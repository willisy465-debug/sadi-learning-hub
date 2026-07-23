import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { CourseDetailClient } from './CourseDetailClient';

export const dynamic = 'force-dynamic';

const fallbackCourses: Record<string, any> = {
  'public-finance-ipsas': {
    id: 'demo-1',
    code: 'FIN-801',
    title: 'Executive Public Finance Management & IPSAS Standards',
    shortDescription: 'Master modern international public sector accounting standards, national budget monitoring, and financial auditing through 100% online video lectures.',
    deliveryMethod: 'SELF_PACED',
    durationDays: 5,
    cpdPoints: 20,
    priceZar: 18500,
    priceUsd: 1100,
    slug: 'public-finance-ipsas',
    featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
    category: { id: 'cat-fin', name: 'Public Finance & Accounting' },
    modules: [
      {
        id: 'mod-1',
        title: 'IPSAS Financial Reporting Standards & Public Auditing',
        lessons: [
          { id: 'les-1', title: '1.1 Introduction to IPSAS & Accrual Accounting', durationMinutes: 20 },
          { id: 'les-2', title: '1.2 Public Sector Financial Statement Analysis', durationMinutes: 25 },
        ],
      },
    ],
  },
  'corporate-governance-risk': {
    id: 'demo-2',
    code: 'GOV-902',
    title: 'Corporate Governance, Risk & Board Leadership',
    shortDescription: 'Strategic online masterclass on governance frameworks for state-owned enterprises, central banks, and corporate entities across Africa.',
    deliveryMethod: 'SELF_PACED',
    durationDays: 5,
    cpdPoints: 25,
    priceZar: 21000,
    priceUsd: 1350,
    slug: 'corporate-governance-risk',
    featuredImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
    category: { id: 'cat-gov', name: 'Governance & Leadership' },
    modules: [
      {
        id: 'mod-2',
        title: 'Board Oversight, King IV & Enterprise Risk Governance',
        lessons: [
          { id: 'les-3', title: '2.1 Board Committees & Ethical Leadership', durationMinutes: 30 },
          { id: 'les-4', title: '2.2 Risk Mitigation in State-Owned Enterprises', durationMinutes: 25 },
        ],
      },
    ],
  },
  'cybersecurity-digital-transformation': {
    id: 'demo-3',
    code: 'ICT-703',
    title: 'Cybersecurity Policy & Public Sector Digital Transformation',
    shortDescription: 'Comprehensive online cyber risk management, infrastructure protection, and digital governance hosted e-learning programme.',
    deliveryMethod: 'SELF_PACED',
    durationDays: 4,
    cpdPoints: 15,
    priceZar: 15500,
    priceUsd: 950,
    slug: 'cybersecurity-digital-transformation',
    featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    category: { id: 'cat-ict', name: 'ICT & Cyber Security' },
    modules: [
      {
        id: 'mod-3',
        title: 'National Cyber Security Architecture & Data Privacy',
        lessons: [
          { id: 'les-5', title: '3.1 Critical Information Infrastructure Protection', durationMinutes: 25 },
          { id: 'les-6', title: '3.2 POPIA & GDPR Compliance in Public Sector', durationMinutes: 20 },
        ],
      },
    ],
  },
  'public-procurement-ppp': {
    id: 'demo-4',
    code: 'PRO-604',
    title: 'Public Procurement, Contract Management & PPPs',
    shortDescription: 'Advanced online course on transparent tender evaluation, legal contract compliance, and Public-Private Partnership structuring.',
    deliveryMethod: 'SELF_PACED',
    durationDays: 5,
    cpdPoints: 20,
    priceZar: 19500,
    priceUsd: 1200,
    slug: 'public-procurement-ppp',
    featuredImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
    category: { id: 'cat-pro', name: 'Procurement & Supply Chain' },
    modules: [
      {
        id: 'mod-4',
        title: 'Public Procurement Act & PPP Risk Structuring',
        lessons: [
          { id: 'les-7', title: '4.1 Sustainable Supply Chain Management', durationMinutes: 30 },
          { id: 'les-8', title: '4.2 Structuring PPP Agreements', durationMinutes: 25 },
        ],
      },
    ],
  },
};

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getCurrentUser();

  let course: any = null;
  try {
    course = await prisma.course.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        cohorts: { orderBy: { startDate: 'asc' } },
        modules: {
          orderBy: { displayOrder: 'asc' },
          include: { lessons: { orderBy: { displayOrder: 'asc' } } },
        },
        examinations: true,
      },
    });
  } catch (e) {
    console.error('Course lookup error:', e);
  }

  if (!course) {
    course = fallbackCourses[params.slug];
  }

  if (!course) {
    notFound();
  }

  // Check if user is already enrolled
  let isEnrolled = false;
  if (user && course.id) {
    try {
      const enrolment = await prisma.enrolment.findFirst({
        where: {
          userId: user.userId,
          courseId: course.id,
        },
      });
      if (enrolment) isEnrolled = true;
    } catch (e) {
      console.warn('Enrolment check fallback:', e);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <CourseDetailClient
        course={course}
        isEnrolled={isEnrolled}
        currentUser={user}
      />
    </div>
  );
}
