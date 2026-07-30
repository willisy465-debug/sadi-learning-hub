import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { hasRole } from '@/lib/rbac';
import { ClassroomView } from './ClassroomView';

export const dynamic = 'force-dynamic';

export default async function LearnPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  let course: any = null;
  try {
    course = await prisma.course.findUnique({
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
  } catch (e) {
    console.error('Database query error in LearnPage:', e);
  }

  if (!course) notFound();

  const isStaff = hasRole(user, [
    'SUPER_ADMIN',
    'PROGRAMME_DIRECTOR',
    'LMS_ADMIN',
    'PROGRAMME_MANAGER',
    'FACILITATOR',
  ]);

  if (!isStaff) {
    const enrolment = await prisma.enrolment.findFirst({
      where: { userId: user.userId, courseId: course.id },
    });
    if (!enrolment) {
      redirect(`/courses/${course.slug}`);
    }
  }

  return (
    <ClassroomView
      course={course}
      userId={user.userId}
      userEmail={user.email}
      userName={`${user.firstName} ${user.lastName}`}
    />
  );
}
