import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Shield, BookOpen, Clock, Award, MapPin, CheckCircle, ArrowRight, UserCheck, Calendar, DollarSign, Building } from 'lucide-react';

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getCurrentUser();

  const course = await prisma.course.findUnique({
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

  if (!course) {
    notFound();
  }

  // Check if user is already enrolled
  let isEnrolled = false;
  if (user && course.cohorts.length > 0) {
    const enrolment = await prisma.enrolment.findFirst({
      where: {
        userId: user.userId,
        courseId: course.id,
      },
    });
    if (enrolment) isEnrolled = true;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Top Breadcrumb & Badge */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link href="/courses" className="hover:text-amber-400">Courses</Link>
        <span>/</span>
        <span className="text-slate-200">{course.category.name}</span>
        <span>/</span>
        <span className="text-amber-400 font-mono">{course.code}</span>
      </div>

      {/* Main Course Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
              {course.code}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              {course.deliveryMethod.replace(/_/g, ' ')}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-1">
              <Award className="w-3.5 h-3.5" />
              <span>{course.cpdPoints} CPD Points</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {course.title}
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            {course.shortDescription}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[10px] uppercase text-slate-500 font-semibold">Duration</p>
              <p className="text-base font-bold text-white flex items-center">
                <Clock className="w-4 h-4 text-amber-400 mr-1.5" />
                {course.durationDays} Days
              </p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[10px] uppercase text-slate-500 font-semibold">Pretoria Tuition Fee</p>
              <p className="text-base font-bold text-amber-400">
                ZAR {course.priceZar.toLocaleString()}
              </p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[10px] uppercase text-slate-500 font-semibold">International Fee</p>
              <p className="text-base font-bold text-slate-200">
                USD {course.priceUsd.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Video Preview & Instant Enrolment Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 h-fit">
          <div className="aspect-video rounded-2xl overflow-hidden relative bg-slate-900 border border-slate-800">
            <img
              src={course.featuredImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop'}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 font-medium">Standard Registration Fee</p>
              <p className="text-3xl font-black text-amber-400">
                ZAR {course.priceZar.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">Equiv. USD {course.priceUsd} (Excl. VAT)</p>
            </div>

            {isEnrolled ? (
              <Link
                href="/learner/dashboard"
                className="w-full py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Enrolled — Go to Classroom</span>
              </Link>
            ) : (
              <form action="/api/enrolments" method="POST" className="space-y-3">
                <input type="hidden" name="courseId" value={course.id} />
                <input type="hidden" name="cohortId" value={course.cohorts[0]?.id || ''} />
                
                <button
                  type="submit"
                  className="w-full gold-button py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
                >
                  <BookOpen className="w-4 h-4 text-slate-950" />
                  <span>Enrol Now & Issue Invoice</span>
                </button>
              </form>
            )}

            <Link
              href={`/request-custom?course=${encodeURIComponent(course.title)}`}
              className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center space-x-2 hover:border-amber-500/40"
            >
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>Request Group / In-House Quote</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Syllabus & Course Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-6">
        
        {/* Left Column: Full Description & Syllabus */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Overview */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white">Course Overview & Scope</h3>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed whitespace-pre-line">
              {course.fullDescription}
            </div>
          </div>

          {/* Learning Objectives */}
          {course.learningObjectives && (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-white">Target Learning Outcomes</h3>
              <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                {course.learningObjectives}
              </div>
            </div>
          )}

          {/* Modules Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Curriculum & Module Breakdown</h3>
            <div className="space-y-4">
              {course.modules.map((mod, idx) => (
                <div key={mod.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-amber-400">
                      Module {idx + 1}: {mod.title}
                    </h4>
                    <span className="text-xs text-slate-400">{mod.lessons.length} Lessons</span>
                  </div>
                  {mod.description && <p className="text-xs text-slate-400">{mod.description}</p>}

                  <div className="space-y-2 pt-2">
                    {mod.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 text-xs text-slate-300">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>{lesson.title}</span>
                        </div>
                        <span className="text-slate-500 font-mono">{lesson.durationMinutes} mins</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Upcoming Cohorts & Logistics */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center">
              <Calendar className="w-4 h-4 text-amber-400 mr-2" />
              <span>Upcoming Scheduled Cohorts</span>
            </h3>

            <div className="space-y-3">
              {course.cohorts.map((cohort) => (
                <div key={cohort.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 font-mono">{cohort.code}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                      {cohort.isAccepting ? 'Open' : 'Full'}
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium">{cohort.name}</p>
                  <p className="text-slate-400 flex items-center">
                    <MapPin className="w-3 h-3 text-slate-500 mr-1" />
                    {cohort.location}
                  </p>
                  <p className="text-slate-400">
                    {new Date(cohort.startDate).toLocaleDateString()} – {new Date(cohort.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 text-xs text-slate-400">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Accreditation & CPD</h4>
            <p>{course.accreditationInfo}</p>
          </div>
        </div>

      </div>

    </div>
  );
}
