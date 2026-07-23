import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Shield, BookOpen, Award, Users, Globe2, Building2, CheckCircle2, ArrowRight, Star, Cpu, Calculator, ShieldAlert, Sparkles } from 'lucide-react';

export default async function HomePage() {
  const categories = await prisma.courseCategory.findMany({
    take: 6,
    orderBy: { displayOrder: 'asc' },
  });

  const featuredCourses = await prisma.course.findMany({
    where: { isPublished: true },
    include: { category: true, cohorts: true },
    take: 3,
  });

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
          
          {/* Institution Tagline */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide shadow-lg shadow-amber-500/10">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Southern Africa Development Institute — Brooklyn, Pretoria, South Africa</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Pan-African Executive <br className="hidden sm:inline" />
            <span className="gold-gradient-text">Capacity Development</span> & Learning Hub
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Empowering executives, public sector leadership, boards, financial regulators, and corporate professionals across Africa through accredited public training, self-paced e-learning, customized in-house programmes, and verifiable certifications.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/courses"
              className="w-full sm:w-auto gold-button px-8 py-4 rounded-2xl text-base font-bold flex items-center justify-center space-x-3 shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
            >
              <BookOpen className="w-5 h-5 text-slate-950" />
              <span>Explore 2026 Course Catalogue</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </Link>

            <Link
              href="/request-custom"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-slate-200 text-base font-semibold flex items-center justify-center space-x-3 transition-colors"
            >
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>Request Custom In-House Training</span>
            </Link>
          </div>

          {/* Key Metrics Banner */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1">
              <p className="text-3xl font-black text-amber-400">100,000+</p>
              <p className="text-xs text-slate-400 font-medium">Delegates Trained</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1">
              <p className="text-3xl font-black text-amber-400">54</p>
              <p className="text-xs text-slate-400 font-medium">African Member States</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1">
              <p className="text-3xl font-black text-amber-400">100%</p>
              <p className="text-xs text-slate-400 font-medium">Verifiable QR Certificates</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1">
              <p className="text-3xl font-black text-amber-400">ISO 9001</p>
              <p className="text-xs text-slate-400 font-medium">Quality Compliance</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. PROGRAMME DELIVERY MODELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Flexible Delivery Architecture</h2>
          <p className="text-3xl font-black text-white tracking-tight">Tailored Learning for Modern African Institutions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Public & Blended Programmes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scheduled cohort-based training delivered in Pretoria, Johannesburg, Nairobi, and online. Combines live facilitator sessions, group case studies, and digital courseware.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Online Self-Paced E-Learning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Immediate continuous enrolment for technical and executive modules with adaptive video streaming, low-bandwidth audio mode, downloadable transcripts, and online exams.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Custom In-House Training</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bespoke capacity-building interventions designed specifically for government ministries, state utilities, central banks, and private corporate entities with dedicated portals.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COURSES CATALOGUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Featured Programmes</h2>
            <p className="text-3xl font-black text-white tracking-tight">High-Impact Professional Courses</p>
          </div>
          <Link href="/courses" className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center">
            <span>View Full 2026 Catalogue</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div key={course.id} className="glass-panel rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-colors group">
              <div className="space-y-4 p-6">
                <div className="aspect-video rounded-2xl overflow-hidden relative bg-slate-900">
                  <img
                    src={course.featuredImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
                    {course.code}
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-medium">
                    {course.deliveryMethod.replace(/_/g, ' ')}
                  </span>
                  <span>•</span>
                  <span>{course.durationDays} Days ({course.cpdPoints} CPD Points)</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {course.shortDescription}
                </p>
              </div>

              <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-semibold">Course Fee</p>
                  <p className="text-sm font-black text-amber-400">
                    ZAR {course.priceZar.toLocaleString()} <span className="text-xs font-normal text-slate-400">(/ USD {course.priceUsd})</span>
                  </p>
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-semibold text-xs transition-colors flex items-center space-x-1"
                >
                  <span>Enrol / Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PUBLIC CERTIFICATE VERIFICATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tamper-Proof Cryptographic Credentials</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Public QR Certificate Verification</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every certificate issued by the Southern Africa Development Institute contains a unique QR code and cryptographic verification hash. Employers, regulators, and audit bodies can instantly verify credential authenticity.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/verify/VER-SADI-90412-AD"
              className="w-full sm:w-auto gold-button px-6 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>Test Sample QR Verification</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
