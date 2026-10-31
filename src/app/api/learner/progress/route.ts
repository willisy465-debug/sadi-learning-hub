import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { lessonId, source } = body;

    if (!lessonId) return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });

    const progressPercent = Math.max(
      0,
      Math.min(100, Number(body.progressPercent ?? (body.isCompleted ? 100 : 0)))
    );
    const lastPosition = Number.isFinite(Number(body.lastPosition))
      ? Math.max(0, Math.floor(Number(body.lastPosition)))
      : 0;

    const existing = await prisma.learnerProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: user.userId,
          lessonId,
        },
      },
    });

    const wasCompleted = Boolean(existing?.isCompleted);
    const isManual = source === 'manual';
    const autoComplete =
      body.isCompleted === true ||
      progressPercent >= 85 ||
      source === 'download';

    let isCompleted = wasCompleted || autoComplete;
    if (isManual && typeof body.isCompleted === 'boolean') {
      isCompleted = Boolean(body.isCompleted);
    }

    const record = await prisma.learnerProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.userId,
          lessonId,
        },
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? existing?.completedAt || new Date() : null,
      },
      create: {
        userId: user.userId,
        lessonId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    if (source === 'video' && lastPosition > 0) {
      await prisma.videoProgress.upsert({
        where: {
          userId_lessonId: {
            userId: user.userId,
            lessonId,
          },
        },
        update: {
          watchedSeconds: lastPosition,
          completionPercent: Math.max(progressPercent, isCompleted ? 100 : 0),
          isCompleted,
          lastWatchedPosition: lastPosition,
        },
        create: {
          userId: user.userId,
          lessonId,
          watchedSeconds: lastPosition,
          completionPercent: Math.max(progressPercent, isCompleted ? 100 : 0),
          isCompleted,
          lastWatchedPosition: lastPosition,
        },
      });
    }

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

    return NextResponse.json({
      success: true,
      record,
      progressPercent: isCompleted ? 100 : progressPercent,
    });
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
