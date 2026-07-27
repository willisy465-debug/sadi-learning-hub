import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { GraduationCap, Users, Calendar, CheckSquare, BookOpen, Clock, FileCheck, Award } from 'lucide-react';

export default async function FacilitatorDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let cohorts: any[] = [];
  let pendingAttempts: any[] = [];

  try {
    cohorts = await prisma.cohort.findMany({
      include: {
        course: true,
        registrations: { include: { user: true } },
      },
      take: 10,
    });

    pendingAttempts = await prisma.examAttempt.findMany({
      where: { status: 'SUBMITTED' },
      include: {
        examination: { include: { course: true } },
        user: true,
      },
    });
  } catch (dbErr) {
    console.error('Error fetching facilitator dashboard data:', dbErr);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Facilitator Header */}
      <div className="p-8 rounded-xl border border-udemy-grayBorder bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs text-udemy-purple font-bold uppercase tracking-wider bg-udemy-purple/10 px-3 py-1 rounded-full border border-udemy-purple/20">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Facilitator & Master Trainer Portal</span>
          </div>
          <h1 className="text-3xl font-black text-udemy-black tracking-tight">
            Facilitator Classroom & Assessment Hub
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Facilitator: <span className="font-semibold text-udemy-black">{user.firstName} {user.lastName}</span> ({user.email})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-udemy-grayBorder text-udemy-purple text-xs font-mono font-bold shadow-sm">
            {cohorts.length} Active Cohorts
          </span>
        </div>
      </div>

      {/* Cohorts & Attendance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Workshop Cohorts */}
        <div className="p-8 rounded-xl border border-udemy-grayBorder bg-white space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-udemy-black flex items-center">
            <Calendar className="w-5 h-5 text-udemy-purple mr-2" />
            <span>Assigned Training Cohorts (Pretoria & Virtual)</span>
          </h2>

          <div className="space-y-4">
            {cohorts.map((cohort) => (
              <div key={cohort.id} className="p-5 rounded-xl bg-udemy-gray border border-udemy-grayBorder space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-udemy-purple/10 text-udemy-purple font-mono text-[10px] font-bold border border-udemy-purple/20">
                    {cohort.code}
                  </span>
                  <span className="text-[11px] text-slate-500 font-bold flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    {cohort.registrations.length} Delegates
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-udemy-black text-sm">{cohort.name}</h3>
                  <p className="text-xs text-slate-600 font-medium">{cohort.course.title}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-2 border-t border-udemy-grayBorder">
                  <span>Venue: {cohort.venueDetails || 'Pretoria Campus'}</span>
                  <span className="font-mono text-emerald-600 font-bold">{cohort.deliveryMethod.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Assessment Grading */}
        <div className="p-8 rounded-xl border border-udemy-grayBorder bg-white space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-udemy-black flex items-center">
            <FileCheck className="w-5 h-5 text-udemy-purple mr-2" />
            <span>Submitted Delegate Assessments</span>
          </h2>

          {pendingAttempts.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-50 text-center space-y-2 border border-udemy-grayBorder">
              <CheckSquare className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-xs text-slate-600 font-bold">All submitted assessments graded!</p>
              <p className="text-[11px] text-slate-500 font-medium">Automated MCQ evaluations and certificates are up to date.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAttempts.map((attempt) => (
                <div key={attempt.id} className="p-5 rounded-xl bg-white border border-udemy-grayBorder shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-udemy-black">
                      {attempt.user.firstName} {attempt.user.lastName}
                    </p>
                    <p className="text-[11px] text-udemy-purple font-medium">{attempt.examination.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono font-medium">
                      Score: {attempt.scorePercent || 0}% ({attempt.isPassed ? 'PASSED' : 'FAILED'})
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                    Graded ✓
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
