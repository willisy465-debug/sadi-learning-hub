import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { BookOpen, Award, Clock, PlayCircle, FileText, CheckCircle2, ArrowRight, Shield, Video, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LearnerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let enrolments: any[] = [];
  let certificates: any[] = [];

  try {
    enrolments = await prisma.enrolment.findMany({
      where: { userId: user.userId },
      include: {
        course: {
          include: {
            modules: {
              include: { lessons: true },
            },
            examinations: true,
          },
        },
        cohort: true,
      },
    });

    certificates = await prisma.certificate.findMany({
      where: { userId: user.userId },
    });
  } catch (dbErr) {
    console.error('Error fetching learner dashboard data:', dbErr);
  }

  // Fallback Udemy-style Enrolled Courses if user is newly registered or DB is empty
  if (!enrolments || enrolments.length === 0) {
    enrolments = [
      {
        id: 'enr-demo-1',
        progressPercent: 35,
        cohort: { name: '2026 Online Cohort A' },
        course: {
          id: 'demo-1',
          code: 'FIN-801',
          title: 'Executive Public Finance Management & IPSAS Standards',
          featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
          durationDays: 5,
          cpdPoints: 20,
          examinations: [{ id: 'exam-demo-1' }],
        },
      },
      {
        id: 'enr-demo-2',
        progressPercent: 75,
        cohort: { name: '2026 Executive Self-Paced' },
        course: {
          id: 'demo-2',
          code: 'GOV-902',
          title: 'Corporate Governance, Risk & Board Leadership',
          featuredImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
          durationDays: 5,
          cpdPoints: 25,
          examinations: [{ id: 'exam-demo-2' }],
        },
      },
    ];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome & Udemy "My Learning" Header */}
      <div className="p-8 rounded-xl border border-udemy-grayBorder bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs text-udemy-purple font-semibold bg-udemy-purple/10 px-3 py-1 rounded-full border border-udemy-purple/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SADI "My Learning" Hub</span>
          </div>
          <h1 className="text-3xl font-black text-udemy-black tracking-tight">
            Welcome back, <span className="text-udemy-purple">{user.firstName} {user.lastName}</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {user.email} • Executive Online Learner
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/learner/certificates"
            className="px-4 py-2.5 rounded border border-udemy-grayBorder hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-2 transition-colors"
          >
            <Award className="w-4 h-4 text-udemy-purple" />
            <span>My Certificates ({certificates.length})</span>
          </Link>
          <Link
            href="/courses"
            className="gold-button px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-amber-500/10"
          >
            <span>Explore Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Udemy-Style "My Learning" Course Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-udemy-grayBorder pb-4">
          <h2 className="text-xl font-bold text-udemy-black flex items-center">
            <BookOpen className="w-5 h-5 text-udemy-purple mr-2" />
            <span>My Enrolled Courses</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono font-bold">
            {enrolments.length} Active Courses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {enrolments.map((enrolment) => (
            <div key={enrolment.id} className="bg-white rounded-xl border border-udemy-grayBorder overflow-hidden space-y-6 flex flex-col justify-between hover:border-udemy-purple/40 transition-all duration-300 group shadow-md hover:shadow-lg">
              
              <div className="space-y-4 p-6">
                <div className="aspect-video relative bg-udemy-gray border border-udemy-grayBorder mb-4 overflow-hidden rounded-lg">
                  <img
                    src={enrolment.course.featuredImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop'}
                    alt={enrolment.course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-udemy-purple/30 text-udemy-purple font-mono text-[10px] font-bold shadow-sm">
                    {enrolment.course.code}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-emerald-50/90 backdrop-blur px-2.5 py-1 rounded-full border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center space-x-1 shadow-sm">
                    <Video className="w-3 h-3" />
                    <span>100% Online</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-udemy-black group-hover:text-udemy-purple transition-colors">
                    {enrolment.course.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Cohort: {enrolment.cohort?.name || '2026 Executive Online'}
                  </p>
                </div>

                {/* Udemy Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">Course Progress</span>
                    <span className="font-bold text-udemy-purple font-mono">{enrolment.progressPercent?.toFixed(0) || 0}% Complete</span>
                  </div>
                  <div className="w-full h-2 bg-udemy-grayBorder overflow-hidden">
                    <div
                      className="h-full bg-udemy-purple transition-all duration-500"
                      style={{ width: `${enrolment.progressPercent || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-4 border-t border-udemy-grayBorder flex items-center justify-between gap-3 bg-slate-50">
                <Link
                  href={`/learner/courses/${enrolment.course.id}/learn`}
                  className="flex-1 udemy-button-primary py-3 text-xs flex items-center justify-center space-x-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Continue Learning</span>
                </Link>

                {enrolment.course.examinations && enrolment.course.examinations.length > 0 && (
                  <Link
                    href={`/learner/exams/${enrolment.course.examinations[0].id}`}
                    className="px-4 py-3 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5 border border-udemy-grayBorder transition-colors"
                  >
                    <FileText className="w-4 h-4 text-udemy-purple" />
                    <span>CPD Exam</span>
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
