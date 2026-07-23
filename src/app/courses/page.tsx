import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { BookOpen, Sparkles, ShieldCheck, Video, Download } from 'lucide-react';
import { CoursesMarketplaceClient } from './CoursesMarketplaceClient';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  let categories: any[] = [];
  let courses: any[] = [];
  let currentUser: any = null;

  try {
    currentUser = await getCurrentUser();

    categories = await prisma.courseCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('CoursesPage database query error:', err);
  }

  // Fallback Executive Online Courses if database is unseeded or query fails
  if (!courses || courses.length === 0) {
    courses = [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
    ];
  }

  if (!categories || categories.length === 0) {
    categories = [
      { id: 'cat-fin', name: 'Public Finance & Accounting' },
      { id: 'cat-gov', name: 'Governance & Leadership' },
      { id: 'cat-ict', name: 'ICT & Cyber Security' },
      { id: 'cat-pro', name: 'Procurement & Supply Chain' },
    ];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SADI 100% Executive Online Marketplace</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Hosted Online Courses & <span className="gold-gradient-text">Video Streaming</span>
        </h1>

        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Explore our executive online e-learning marketplace. Select your course to trigger instant automated registration, payment receipt, credential issuance, and immediate access to HD streaming video lectures and digital materials.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-2">
          <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Video className="w-4 h-4 text-amber-400" />
            <span>Hosted HD Video Lectures</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Digital Study Guides & PDFs</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Instant Auto-Credentials</span>
          </div>
        </div>
      </div>

      {/* Marketplace Component */}
      <CoursesMarketplaceClient
        initialCourses={courses}
        categories={categories}
        currentUser={currentUser}
      />

    </div>
  );
}
