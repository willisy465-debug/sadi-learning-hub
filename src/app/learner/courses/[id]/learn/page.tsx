import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ClassroomView } from './ClassroomView';

export default async function LearnPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: {
        orderBy: { displayOrder: 'asc' },
        include: {
          lessons: {
            orderBy: { displayOrder: 'asc' },
            include: {
              videoProgress: {
                where: { userId: user.userId },
              },
              progresses: {
                where: { userId: user.userId },
              },
            },
          },
        },
      },
      examinations: true,
    },
  });

  if (!course) notFound();

  return <ClassroomView course={course} userId={user.userId} userEmail={user.email} userName={`${user.firstName} ${user.lastName}`} />;
}
