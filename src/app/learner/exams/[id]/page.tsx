import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ExamEngineView } from './ExamEngineView';

export default async function ExamPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const exam = await prisma.examination.findUnique({
    where: { id: params.id },
    include: {
      course: true,
      questions: {
        orderBy: { displayOrder: 'asc' },
        include: { options: true },
      },
    },
  });

  if (!exam) notFound();

  // Find or create active attempt
  let attempt = await prisma.examAttempt.findFirst({
    where: {
      examinationId: exam.id,
      userId: user.userId,
      status: 'IN_PROGRESS',
    },
    include: { responses: true },
  });

  if (!attempt) {
    attempt = await prisma.examAttempt.create({
      data: {
        examinationId: exam.id,
        userId: user.userId,
        timeRemainingSec: exam.timeLimitMinutes * 60,
        status: 'IN_PROGRESS',
      },
      include: { responses: true },
    });
  }

  return (
    <ExamEngineView
      exam={exam}
      attempt={attempt}
      userId={user.userId}
      userEmail={user.email}
      userName={`${user.firstName} ${user.lastName}`}
    />
  );
}
