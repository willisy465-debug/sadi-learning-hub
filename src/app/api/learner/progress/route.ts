import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { lessonId, isCompleted } = await request.json();

    if (!lessonId) return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });

    const record = await prisma.learnerProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.userId,
          lessonId,
        },
      },
      update: {
        isCompleted: Boolean(isCompleted),
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        userId: user.userId,
        lessonId,
        isCompleted: Boolean(isCompleted),
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Update course enrolment percentage
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });

    if (lesson) {
      const courseId = lesson.module.courseId;
      const totalLessons = await prisma.lesson.count({
        where: { module: { courseId } },
      });

      const completedCount = await prisma.learnerProgress.count({
        where: {
          userId: user.userId,
          isCompleted: true,
          lesson: { module: { courseId } },
        },
      });

      const percent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

      await prisma.enrolment.updateMany({
        where: {
          userId: user.userId,
          courseId,
        },
        data: {
          progressPercent: percent,
          isCompleted: percent >= 100,
          completedAt: percent >= 100 ? new Date() : null,
        },
      });
    }

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
