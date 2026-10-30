import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { getCurrentUser } from '@/lib/auth';
import { canManageCourses } from '@/lib/rbac';

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

const ALLOWED_MIME_PREFIXES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml',
  'image/',
];

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!canManageCourses(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_ ]/g, '').trim() || 'document';
    const ext = extname(originalName).toLowerCase();
    const mime = (file.type || '').toLowerCase();

    const mimeAllowed = ALLOWED_MIME_PREFIXES.some((p) => mime.startsWith(p));
    if (!ALLOWED_EXTENSIONS.has(ext) && !mimeAllowed) {
      return NextResponse.json(
        { error: 'Only PDF, Word (.doc/.docx), and image files are allowed.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeBase = originalName.replace(/\s+/g, '-');
    const filename = `${Date.now()}-${safeBase}`;

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    const fileUrl = `/uploads/${filename}`;
    const contentType =
      ext === '.pdf' || mime.includes('pdf')
        ? 'PDF'
        : ext === '.doc' || ext === '.docx' || mime.includes('word')
          ? 'DOC'
          : 'FILE';

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: originalName,
      contentType,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
