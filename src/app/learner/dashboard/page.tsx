import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { BookOpen, Award, Clock, PlayCircle, FileText, CheckCircle2, ArrowRight, Shield } from 'lucide-react';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs text-amber-400 font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>SADI Learner Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Welcome back, <span className="gold-gradient-text">{user.firstName} {user.lastName}</span>
          </h1>
          <p className="text-xs text-slate-400">
            {user.email} • {user.roles[0]?.replace(/_/g, ' ')}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/learner/certificates"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>My Credentials ({certificates.length})</span>
          </Link>
          <Link
            href="/courses"
            className="gold-button px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2"
          >
            <span>Browse New Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <BookOpen className="w-5 h-5 text-amber-400 mr-2" />
          <span>My Enrolled Capacity Programmes</span>
        </h2>

        {enrolments.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Active Enrolments Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You are not currently enrolled in any SADI capacity development course. Browse our catalogue to get started.
            </p>
            <Link href="/courses" className="gold-button px-6 py-2.5 rounded-xl text-xs font-bold inline-block">
              Browse Course Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {enrolments.map((enrolment) => (
              <div key={enrolment.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-400 font-mono text-[11px] font-bold">
                      {enrolment.course.code}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Cohort: {enrolment.cohort.name}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {enrolment.course.title}
                  </h3>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Course Completion</span>
                      <span className="font-bold text-amber-400">{enrolment.progressPercent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                        style={{ width: `${enrolment.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <Link
                    href={`/learner/courses/${enrolment.course.id}/learn`}
                    className="flex-1 gold-button py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
                  >
                    <PlayCircle className="w-4 h-4 text-slate-950" />
                    <span>Enter Classroom</span>
                  </Link>

                  {enrolment.course.examinations.length > 0 && (
                    <Link
                      href={`/learner/exams/${enrolment.course.examinations[0].id}`}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700"
                    >
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Take Exam</span>
                    </Link>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
