import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ClassroomView } from './ClassroomView';

export const dynamic = 'force-dynamic';

const fallbackCourseMap: Record<string, any> = {
  'demo-1': {
    id: 'demo-1',
    code: 'FIN-801',
    title: 'Executive Public Finance Management & IPSAS Standards',
    featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
    modules: [
      {
        id: 'm1',
        title: 'IPSAS Accounting Standards & Public Sector Audit',
        lessons: [
          {
            id: 'les-101',
            title: 'Lesson 1.1: IPSAS Framework & Governance Protocols',
            durationMinutes: 20,
            summary: 'Understanding international public sector accounting standards and financial reporting.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            textContent: 'Welcome to the Executive Public Finance Management module. Review the video lecture above, study the IPSAS disclosure guidelines, and complete the module assessment.',
          },
          {
            id: 'les-102',
            title: 'Lesson 1.2: National Budgetary Control & Audit Procedures',
            durationMinutes: 25,
            summary: 'Auditing public expenditures and compliance oversight.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            textContent: 'This lesson covers public sector expenditure monitoring, parliamentary oversight, and external audit compliance.',
          },
        ],
      },
    ],
    examinations: [{ id: 'exam-demo-1' }],
  },
  'demo-2': {
    id: 'demo-2',
    code: 'GOV-902',
    title: 'Corporate Governance, Risk & Board Leadership',
    featuredImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
    modules: [
      {
        id: 'm2',
        title: 'Board Governance & Strategic Enterprise Risk',
        lessons: [
          {
            id: 'les-201',
            title: 'Lesson 2.1: Board Leadership & Ethical Oversight',
            durationMinutes: 30,
            summary: 'Key responsibilities of board members in African state-owned enterprises and financial institutions.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            textContent: 'Master the principles of King IV governance, ethical board leadership, and executive risk management.',
          },
        ],
      },
    ],
    examinations: [{ id: 'exam-demo-2' }],
  },
};

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

  if (!course) {
    course = fallbackCourseMap[params.id] || fallbackCourseMap['demo-1'];
  }

  if (!course) notFound();

  return (
    <ClassroomView
      course={course}
      userId={user.userId}
      userEmail={user.email}
      userName={`${user.firstName} ${user.lastName}`}
    />
  );
}
