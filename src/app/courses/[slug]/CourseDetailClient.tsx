'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, Clock, Video, Download, ShieldCheck, CheckCircle2, ArrowRight, Play, Sparkles, BookOpen } from 'lucide-react';
import { InstantCheckoutModal } from '@/components/checkout/InstantCheckoutModal';

interface CourseDetailClientProps {
  course: any;
  isEnrolled: boolean;
  currentUser?: any;
}

export function CourseDetailClient({ course, isEnrolled, currentUser }: CourseDetailClientProps) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  return (
    <div className="space-y-12">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link href="/courses" className="hover:text-amber-400">Courses</Link>
        <span>/</span>
        <span className="text-slate-200">{course.category?.name || 'Executive Online'}</span>
        <span>/</span>
        <span className="text-amber-400 font-mono">{course.code}</span>
      </div>

      {/* Main Course Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Details & Online Syllabus */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
              {course.code}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-1">
              <Video className="w-3.5 h-3.5" />
              <span>100% Online Self-Paced</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center space-x-1">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[10px] uppercase text-slate-500 font-semibold">Access Duration</p>
              <p className="text-base font-bold text-white flex items-center">
                <Clock className="w-4 h-4 text-amber-400 mr-1.5" />
                {course.durationDays || 5} Days Access
              </p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[10px] uppercase text-slate-500 font-semibold">Tuition Fee (ZAR)</p>
              <p className="text-base font-black text-emerald-400 font-mono">
                ZAR {course.priceZar?.toLocaleString()}
              </p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[10px] uppercase text-slate-500 font-semibold">Tuition Fee (USD)</p>
              <p className="text-base font-bold text-slate-200 font-mono">
                USD ${course.priceUsd}
              </p>
            </div>
          </div>

          {/* Online Hosted Video Preview & Material Features */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Video className="w-5 h-5 text-amber-400 mr-2" />
              <span>100% Online Hosted Learning Experience</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Play className="w-4 h-4" />
                  <span>Streaming HD Video Lectures</span>
                </div>
                <p className="text-slate-400">Watch on-demand video lectures hosted on SADI digital streaming servers 24/7.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Download className="w-4 h-4" />
                  <span>Downloadable Material & PDFs</span>
                </div>
                <p className="text-slate-400">Instant access to downloadable courseware slides, case studies, and reference handbooks.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-blue-400 font-bold">
                  <Award className="w-4 h-4" />
                  <span>Online Assessment & CPD Certificate</span>
                </div>
                <p className="text-slate-400">Complete online multiple-choice examinations to earn your verified CPD certificate.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-purple-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Instant Credential Activation</span>
                </div>
                <p className="text-slate-400">Self-registration + immediate checkout issues your login credentials instantly.</p>
              </div>
            </div>
          </div>

          {/* Curriculum & Modules */}
          {course.modules && course.modules.length > 0 && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <BookOpen className="w-5 h-5 text-amber-400 mr-2" />
                <span>Online Course Curriculum & Video Lessons</span>
              </h3>

              <div className="space-y-4">
                {course.modules.map((mod: any, idx: number) => (
                  <div key={mod.id || idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">
                        Module {idx + 1}: {mod.title}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{mod.lessons?.length || 0} Lessons</span>
                    </div>
                    {mod.lessons && mod.lessons.length > 0 && (
                      <ul className="space-y-2 pl-4 border-l-2 border-slate-800 text-xs text-slate-300">
                        {mod.lessons.map((lesson: any) => (
                          <li key={lesson.id} className="flex items-center justify-between">
                            <span className="flex items-center">
                              <Video className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
                              {lesson.title}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">Online Video</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Card */}
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 sticky top-24">
            
            <div className="aspect-video rounded-2xl overflow-hidden relative bg-slate-900 border border-slate-800">
              <img
                src={course.featuredImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Play className="w-5 h-5 ml-1 fill-current" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase text-slate-400 font-bold">100% Online Tuition</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-emerald-400 font-mono">
                  ZAR {course.priceZar?.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  / USD ${course.priceUsd}
                </span>
              </div>
            </div>

            {isEnrolled ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You are enrolled in this online course!</span>
                </div>

                <Link
                  href={`/learner/courses/${course.id}/learn`}
                  className="gold-button w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
                >
                  <Video className="w-4 h-4" />
                  <span>Launch Online Classroom</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="gold-button w-full py-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buy Online Access & Start Now</span>
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  Triggers automated registration, paid invoice issue, and immediate login credential generation.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Immediate 24/7 Access to Hosted Videos</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Digital CPD Certificate</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full Downloadable Online Study Pack</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Instant Checkout Modal */}
      {showCheckoutModal && (
        <InstantCheckoutModal
          course={course}
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          currentUser={currentUser}
        />
      )}

    </div>
  );
}
