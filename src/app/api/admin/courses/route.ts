import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, logAuditEvent } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.roles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    const {
      code,
      title,
      shortDescription,
      fullDescription,
      deliveryMethod,
      durationDays,
      cpdPoints,
      priceZar,
      priceUsd,
      videoUrl,
      moduleTitle,
      lessonTitle,
    } = await request.json();

    if (!code || !title || !shortDescription) {
      return NextResponse.json({ error: 'Code, title, and short description are required.' }, { status: 400 });
    }

    // Get default category
    let category = await prisma.courseCategory.findFirst();
    if (!category) {
      category = await prisma.courseCategory.create({
        data: {
          name: 'Executive Capacity Building',
          slug: 'executive-capacity',
          description: 'Specialized management training for public & private sector leaders',
        },
      });
    }

    const slug = code.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Create course with initial module and lesson video material
    const newCourse = await prisma.course.create({
      data: {
        code,
        title,
        slug,
        shortDescription,
        fullDescription: fullDescription || shortDescription,
        categoryId: category.id,
        deliveryMethod: deliveryMethod || 'BLENDED',
        durationDays: parseInt(durationDays) || 5,
        cpdPoints: parseInt(cpdPoints) || 10,
        priceZar: parseFloat(priceZar) || 15000.0,
        priceUsd: parseFloat(priceUsd) || 950.0,
        promotionalVideoUrl: videoUrl || undefined,
        modules: {
          create: {
            title: moduleTitle || 'Module 1: Executive Foundation & Materials',
            description: 'Core lecture videos and downloadable reading materials',
            displayOrder: 1,
            lessons: {
              create: {
                title: lessonTitle || 'Lesson 1.1: Core Masterclass Video Lecture',
                summary: 'Comprehensive executive video lecture material uploaded by Super Admin.',
                contentType: 'VIDEO',
                videoUrl: videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                durationMinutes: 45,
                displayOrder: 1,
              },
            },
          },
        },
      },
    });

    await logAuditEvent(
      user.email,
      'COURSE_CREATE',
      'COURSE',
      `Super Admin created course ${code}: "${title}" with video stream material`,
      newCourse.id
    );

    return NextResponse.json({ success: true, course: newCourse });
  } catch (error: any) {
    console.error('Super Admin Course Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload course material' }, { status: 500 });
  }
}
