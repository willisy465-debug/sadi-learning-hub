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
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SADI "My Learning" Hub</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Welcome back, <span className="gold-gradient-text">{user.firstName} {user.lastName}</span>
          </h1>
          <p className="text-xs text-slate-400">
            {user.email} • Executive Online Learner
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/learner/certificates"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-800"
          >
            <Award className="w-4 h-4 text-amber-400" />
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
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <BookOpen className="w-5 h-5 text-amber-400 mr-2" />
            <span>My Enrolled Courses</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono font-bold">
            {enrolments.length} Active Courses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {enrolments.map((enrolment) => (
            <div key={enrolment.id} className="glass-panel rounded-3xl border border-slate-800 overflow-hidden space-y-6 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group shadow-xl">
              
              <div className="space-y-4 p-6">
                <div className="aspect-video rounded-2xl overflow-hidden relative bg-slate-900 border border-slate-800">
                  <img
                    src={enrolment.course.featuredImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop'}
                    alt={enrolment.course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
                    {enrolment.course.code}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-emerald-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center space-x-1">
                    <Video className="w-3 h-3" />
                    <span>100% Online</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {enrolment.course.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Cohort: {enrolment.cohort?.name || '2026 Executive Online'}
                  </p>
                </div>

                {/* Udemy Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Course Progress</span>
                    <span className="font-bold text-amber-400 font-mono">{enrolment.progressPercent?.toFixed(0) || 0}% Complete</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${enrolment.progressPercent || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 bg-slate-900/30">
                <Link
                  href={`/learner/courses/${enrolment.course.id}/learn`}
                  className="flex-1 gold-button py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10"
                >
                  <PlayCircle className="w-4 h-4 text-slate-950" />
                  <span>Continue Learning</span>
                </Link>

                {enrolment.course.examinations && enrolment.course.examinations.length > 0 && (
                  <Link
                    href={`/learner/exams/${enrolment.course.examinations[0].id}`}
                    className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-800"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
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
