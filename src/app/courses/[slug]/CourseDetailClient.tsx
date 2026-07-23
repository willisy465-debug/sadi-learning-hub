'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Award, Clock, Video, Download, ShieldCheck, CheckCircle2, ArrowRight, 
  Play, Sparkles, BookOpen, Star, Check, ChevronDown, ChevronUp, UserCheck, Globe, Infinity, Smartphone 
} from 'lucide-react';
import { InstantCheckoutModal } from '@/components/checkout/InstantCheckoutModal';

interface CourseDetailClientProps {
  course: any;
  isEnrolled: boolean;
  currentUser?: any;
}

export function CourseDetailClient({ course, isEnrolled, currentUser }: CourseDetailClientProps) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-0': true,
    'mod-1': true,
  });

  const originalPrice = Math.round((course.priceZar || 18500) * 1.3);
  const discountPercent = 23;

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 12;

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
          
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                Bestseller
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
                {course.code}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-1">
                <Video className="w-3.5 h-3.5" />
                <span>100% Online Self-Paced</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed">
              {course.shortDescription}
            </p>

            {/* Udemy Star Rating & Student Enrolments */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-amber-400 text-sm">4.9</span>
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-slate-400 font-mono">(482 ratings)</span>
              </div>

              <span className="text-slate-600">•</span>
              <div className="flex items-center space-x-1 text-slate-300 font-medium">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>1,420 delegates enrolled</span>
              </div>

              <span className="text-slate-600">•</span>
              <div className="flex items-center space-x-1 text-slate-300 font-medium">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>English (Pan-African Edition)</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              Created by <span className="text-amber-400 font-semibold">SADI Executive Faculty & Pan-African Experts</span>
            </p>
          </div>

          {/* Udemy "What You'll Learn" Highlight Box */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 bg-slate-900/60 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <CheckCircle2 className="w-5 h-5 text-amber-400 mr-2" />
              <span>What you'll learn in this executive course</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Master modern governance frameworks and public finance compliance.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Evaluate financial statements and national budget monitoring mechanisms.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Apply King IV & international board leadership protocols.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Download executive reference PDF handbooks and slide decks.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Earn 20 Accredited CPD Points & verified digital certificate.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Immediate automated credential issuance for 24/7 video streaming.</span>
              </div>
            </div>
          </div>

          {/* Udemy-Style Course Curriculum Accordion */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center">
                  <BookOpen className="w-5 h-5 text-amber-400 mr-2" />
                  <span>Course Content & Online Modules</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {course.modules?.length || 2} sections • {totalLessons} lectures • {course.durationDays || 5} days full access
                </p>
              </div>

              <button
                onClick={() => {
                  const allExpanded = Object.keys(expandedModules).length > 0;
                  setExpandedModules(allExpanded ? {} : { 'mod-0': true, 'mod-1': true });
                }}
                className="text-xs font-bold text-amber-400 hover:underline"
              >
                Toggle sections
              </button>
            </div>

            <div className="space-y-3">
              {(course.modules && course.modules.length > 0 ? course.modules : [
                {
                  id: 'mod-0',
                  title: 'Module 1: Executive Public Sector Governance & Strategic Auditing',
                  lessons: [
                    { id: 'les-1', title: '1.1 Introduction to IPSAS & Accrual Accounting', durationMinutes: 20 },
                    { id: 'les-2', title: '1.2 Public Sector Financial Statement Analysis', durationMinutes: 25 },
                  ],
                },
                {
                  id: 'mod-1',
                  title: 'Module 2: Risk Oversight, Compliance & Parliamentary Reporting',
                  lessons: [
                    { id: 'les-3', title: '2.1 Enterprise Risk Mitigation Protocols', durationMinutes: 30 },
                    { id: 'les-4', title: '2.2 Parliamentary Committee Reporting Standards', durationMinutes: 25 },
                  ],
                },
              ]).map((mod: any, idx: number) => {
                const modKey = mod.id || `mod-${idx}`;
                const isOpen = expandedModules[modKey] !== false;

                return (
                  <div key={modKey} className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                    <button
                      onClick={() => toggleModule(modKey)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="font-bold text-white text-sm">
                          {mod.title}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {mod.lessons?.length || 0} lectures
                      </span>
                    </button>

                    {isOpen && mod.lessons && mod.lessons.length > 0 && (
                      <div className="p-4 pt-0 border-t border-slate-800/60 space-y-2 bg-slate-950/40">
                        {mod.lessons.map((lesson: any) => (
                          <div key={lesson.id} className="flex items-center justify-between text-xs py-2 px-3 rounded-xl hover:bg-slate-900/80">
                            <div className="flex items-center space-x-2 text-slate-200">
                              <Play className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{lesson.title}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-400 font-mono text-[11px]">
                              <span>{lesson.durationMinutes || 20} mins</span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                                Video
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Ratings Histogram */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Star className="w-5 h-5 text-amber-400 mr-2 fill-amber-400" />
              <span>Student Feedback & Executive Reviews</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="text-center space-y-1 sm:border-r border-slate-800 sm:pr-6">
                <p className="text-5xl font-black text-amber-400">4.9</p>
                <div className="flex justify-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <p className="text-xs text-slate-400 font-medium">Course Rating</p>
              </div>

              <div className="sm:col-span-2 space-y-2 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-20 text-slate-300 font-semibold">5 stars</div>
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-400 w-[88%]" />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono">88%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 text-slate-300 font-semibold">4 stars</div>
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-400 w-[9%]" />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono">9%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 text-slate-300 font-semibold">3 stars</div>
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-400 w-[2%]" />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono">2%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Udemy Sticky Floating Purchase Card */}
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 sticky top-24">
            
            {/* Udemy Video Preview Poster */}
            <div className="aspect-video rounded-2xl overflow-hidden relative bg-slate-900 border border-slate-800 group cursor-pointer" onClick={() => setShowCheckoutModal(true)}>
              <img
                src={course.featuredImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop'}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/50 flex flex-col items-center justify-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-400/40 transform group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 ml-1 fill-slate-950 text-amber-400" />
                </div>
                <span className="text-xs font-bold text-white bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                  Preview Course
                </span>
              </div>
            </div>

            {/* Udemy Price Display */}
            <div className="space-y-2">
              <p className="text-xs uppercase text-amber-400 font-bold">100% Online Instant Access</p>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-white font-mono">
                  ZAR {course.priceZar?.toLocaleString()}
                </span>
                <span className="text-sm text-slate-500 line-through font-mono">
                  ZAR {originalPrice.toLocaleString()}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                  {discountPercent}% OFF
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                USD ${course.priceUsd} / International Delegate Rate
              </p>
            </div>

            {/* Purchase CTA */}
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
                  <span>Go to Course Classroom</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="gold-button w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/25"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buy Now & Start Online</span>
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  Automated registration + instant paid invoice + credential generation.
                </p>
              </div>
            )}

            {/* Udemy Guarantee & Features Checklist */}
            <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-300">
              <p className="text-xs font-bold text-white uppercase tracking-wider">This course includes:</p>
              
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Video className="w-4 h-4 text-amber-400 shrink-0" />
                <span>HD Video Lectures on-demand</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Download className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Downloadable Study Notes & Slide Decks</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Infinity className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Full Lifetime Access</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Smartphone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Access on Mobile and Desktop</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>SADI Verified CPD Certificate</span>
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
