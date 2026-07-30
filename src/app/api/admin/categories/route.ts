import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { canManageCourses } from '@/lib/rbac';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!canManageCourses(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const categories = await prisma.courseCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!canManageCourses(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, description, icon, imageUrl, pdfUrl, displayOrder } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const newCategory = await prisma.courseCategory.create({
      data: {
        name,
        slug,
        description,
        icon,
        imageUrl,
        pdfUrl,
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A category with this slug already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
