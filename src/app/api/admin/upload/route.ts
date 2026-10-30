import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { getCurrentUser } from '@/lib/auth';
import { canManageCourses } from '@/lib/rbac';

export const runtime = 'nodejs';

const DOC_MAX_BYTES = 50 * 1024 * 1024; // 50 MB
const VIDEO_MAX_BYTES = 1024 * 1024 * 1024; // 1 GB

const DOC_EXTENSIONS = new Set(['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp', '.gif']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.m4v', '.avi', '.mkv']);

const DOC_CONTENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

const VIDEO_CONTENT_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-m4v',
  'video/x-msvideo',
  'video/x-matroska',
];

function isVideoPath(pathname: string) {
  const ext = extname(pathname).toLowerCase();
  return VIDEO_EXTENSIONS.has(ext) || pathname.startsWith('course-videos/');
}

function resolveContentType(name: string, mime = '') {
  const ext = extname(name).toLowerCase();
  const lowerMime = mime.toLowerCase();
  if (VIDEO_EXTENSIONS.has(ext) || lowerMime.startsWith('video/')) return 'VIDEO';
  if (ext === '.pdf' || lowerMime.includes('pdf')) return 'PDF';
  if (ext === '.doc' || ext === '.docx' || lowerMime.includes('word')) return 'DOC';
  return 'FILE';
}

/**
 * Client upload token flow (@vercel/blob/client).
 * Docs ≤ 50 MB, videos ≤ 1 GB (multipart recommended above ~100 MB).
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!canManageCourses(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const contentType = request.headers.get('content-type') || '';

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
        const video = isVideoPath(pathname);

        if (video) {
          if (!VIDEO_EXTENSIONS.has(ext) && !pathname.startsWith('course-videos/')) {
            throw new Error('Only MP4, WebM, MOV, and similar video files are allowed.');
          }
          return {
            allowedContentTypes: VIDEO_CONTENT_TYPES,
            addRandomSuffix: true,
            maximumSizeInBytes: VIDEO_MAX_BYTES,
            tokenPayload: JSON.stringify({
              kind: 'video',
              uploadedBy: user?.email || user?.userId || 'admin',
            }),
          };
        }

        if (!DOC_EXTENSIONS.has(ext)) {
          throw new Error('Only PDF, Word (.doc/.docx), and image files are allowed.');
        }

        return {
          allowedContentTypes: DOC_CONTENT_TYPES,
          addRandomSuffix: true,
          maximumSizeInBytes: DOC_MAX_BYTES,
          tokenPayload: JSON.stringify({
            kind: 'document',
            uploadedBy: user?.email || user?.userId || 'admin',
          }),
        };
      },
      onUploadCompleted: async () => {
        // Course publish persists the blob URL on the lesson/course record.
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
    const video = VIDEO_EXTENSIONS.has(ext) || mime.startsWith('video/');
    const maxBytes = video ? VIDEO_MAX_BYTES : DOC_MAX_BYTES;

    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          error: video
            ? 'Video must be 1 GB or smaller.'
            : 'Document must be 50 MB or smaller.',
        },
        { status: 400 }
      );
    }

    if (video) {
      if (!VIDEO_EXTENSIONS.has(ext) && !mime.startsWith('video/')) {
        return NextResponse.json({ error: 'Unsupported video type.' }, { status: 400 });
      }
    } else {
      const mimeAllowed = DOC_CONTENT_TYPES.includes(mime) || mime.startsWith('image/');
      if (!DOC_EXTENSIONS.has(ext) && !mimeAllowed) {
        return NextResponse.json(
          { error: 'Only PDF, Word (.doc/.docx), and image files are allowed.' },
          { status: 400 }
        );
      }
    }

    const folder = video ? 'course-videos' : 'course-materials';
    const pathname = `${folder}/${Date.now()}-${originalName.replace(/\s+/g, '-')}`;
    let fileUrl = '';

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(pathname, file, {
        access: 'public',
        contentType: file.type || undefined,
        addRandomSuffix: true,
        multipart: file.size > 100 * 1024 * 1024,
      });
      fileUrl = blob.url;
    } else {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Large uploads require Vercel Blob. Configure BLOB_READ_WRITE_TOKEN.' },
          { status: 500 }
        );
      }
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
