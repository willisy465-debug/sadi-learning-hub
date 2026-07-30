import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getCurrentUser } from '@/lib/auth';
import { canManageCourses } from '@/lib/rbac';

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique name
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filename = `${Date.now()}-${originalName}`;
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if directory already exists
    }

    const path = join(uploadDir, filename);

    // Write file to public/uploads
    await writeFile(path, buffer);

    // Return the URL for the frontend to use
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
