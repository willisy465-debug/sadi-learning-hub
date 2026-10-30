import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { getCurrentUser } from '@/lib/auth';
import { canManageCourses } from '@/lib/rbac';

export const runtime = 'nodejs';

const ALLOWED_CONTENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
]);

function resolveContentType(name: string, mime = '') {
  const ext = extname(name).toLowerCase();
  const lowerMime = mime.toLowerCase();
  if (ext === '.pdf' || lowerMime.includes('pdf')) return 'PDF';
  if (ext === '.doc' || ext === '.docx' || lowerMime.includes('word')) return 'DOC';
  return 'FILE';
}

/**
 * Client upload token flow (@vercel/blob/client) — preferred on Vercel so large
 * PDFs/Word files never hit the serverless request body limit.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!canManageCourses(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const contentType = request.headers.get('content-type') || '';

  // Multipart fallback (local / small files posted directly to this route)
  if (contentType.includes('multipart/form-data')) {
    return handleDirectUpload(request);
  }

  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const ext = extname(pathname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(ext)) {
          throw new Error('Only PDF, Word (.doc/.docx), and image files are allowed.');
        }
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          addRandomSuffix: true,
          maximumSizeInBytes: 50 * 1024 * 1024,
          tokenPayload: JSON.stringify({
            uploadedBy: user?.email || user?.userId || 'admin',
          }),
        };
      },
      onUploadCompleted: async () => {
        // Metadata is recorded when the course is published.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error('Blob upload token error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to prepare upload' },
      { status: 400 }
    );
  }
}

async function handleDirectUpload(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_ ]/g, '').trim() || 'document';
    const ext = extname(originalName).toLowerCase();
    const mime = (file.type || '').toLowerCase();
    const mimeAllowed =
      ALLOWED_CONTENT_TYPES.includes(mime) || mime.startsWith('image/');

    if (!ALLOWED_EXTENSIONS.has(ext) && !mimeAllowed) {
      return NextResponse.json(
        { error: 'Only PDF, Word (.doc/.docx), and image files are allowed.' },
        { status: 400 }
      );
    }

    const pathname = `course-materials/${Date.now()}-${originalName.replace(/\s+/g, '-')}`;
    let fileUrl = '';

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(pathname, file, {
        access: 'public',
        contentType: file.type || undefined,
        addRandomSuffix: true,
      });
      fileUrl = blob.url;
    } else {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filename = `${Date.now()}-${originalName.replace(/\s+/g, '-')}`;
      await writeFile(join(uploadDir, filename), buffer);
      fileUrl = `/uploads/${filename}`;
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: originalName,
      contentType: resolveContentType(originalName, mime),
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
