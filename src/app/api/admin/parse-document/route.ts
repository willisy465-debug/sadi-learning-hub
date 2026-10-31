import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { canManageCourses } from '@/lib/rbac';
import { mergeOutlines, parseDocumentBuffer, type CurriculumOutline } from '@/lib/curriculum-parser';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function fetchDocumentBytes(url: string): Promise<Buffer> {
  if (url.startsWith('/')) {
    const base =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const res = await fetch(`${base}${url}`);
    if (!res.ok) throw new Error(`Failed to download document (${res.status})`);
    return Buffer.from(await res.arrayBuffer());
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download document (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!canManageCourses(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const documents = Array.isArray(body.documents)
      ? body.documents
      : body.url
        ? [{ url: body.url, name: body.name || 'document.pdf', contentType: body.contentType }]
        : [];

    if (!documents.length) {
      return NextResponse.json({ error: 'No documents to parse.' }, { status: 400 });
    }

    const outlines: CurriculumOutline[] = [];

    for (const doc of documents) {
      if (!doc?.url) continue;
      const name = doc.name || 'document';
      const buffer = await fetchDocumentBytes(doc.url);
      const outline = await parseDocumentBuffer(buffer, name, doc.url);
      outlines.push(outline);
    }

    if (!outlines.length) {
      return NextResponse.json({ error: 'Could not parse any documents.' }, { status: 400 });
    }

    const curriculum = mergeOutlines(outlines);
    const lessonCount = curriculum.modules.reduce((n, m) => n + m.lessons.length, 0);

    return NextResponse.json({
      success: true,
      curriculum,
      stats: {
        documents: outlines.length,
        modules: curriculum.modules.length,
        lessons: lessonCount,
        headings: curriculum.headingCount,
      },
    });
  } catch (error: any) {
    console.error('Parse document error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to parse document into course outline' },
      { status: 500 }
    );
  }
}
