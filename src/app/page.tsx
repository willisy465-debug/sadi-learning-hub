import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Shield, BookOpen, Award, Users, Globe2, Building2, CheckCircle2, ArrowRight, Star, Cpu, Calculator, ShieldAlert, Sparkles } from 'lucide-react';

export default async function HomePage() {
  let categories: any[] = [];
  let featuredCourses: any[] = [];

  try {
    categories = await prisma.courseCategory.findMany({
      take: 6,
      orderBy: { displayOrder: 'asc' },
    });

    featuredCourses = await prisma.course.findMany({
      where: { isPublished: true },
      include: { category: true, cohorts: true },
      take: 3,
    });
  } catch (err) {
    console.error('HomePage database query error:', err);
    featuredCourses = [
      {
        id: 'demo-1',
        code: 'FIN-801',
        title: 'Executive Public Finance Management & IPSAS Standards',
        shortDescription: 'Master modern international public sector accounting standards, national budget monitoring, and financial auditing for government ministries.',
        deliveryMethod: 'BLENDED',
        durationDays: 5,
        cpdPoints: 20,
        priceZar: 18500,
        priceUsd: 1100,
        slug: 'public-finance-ipsas',
        featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 'demo-2',
        code: 'GOV-902',
        title: 'Corporate Governance, Risk & Board Leadership',
        shortDescription: 'Strategic governance frameworks for state-owned enterprises, central banks, and corporate entities across Southern Africa.',
        deliveryMethod: 'FACE_TO_FACE',
        durationDays: 5,
        cpdPoints: 25,
        priceZar: 21000,
        priceUsd: 1350,
        slug: 'corporate-governance-risk',
        featuredImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 'demo-3',
        code: 'ICT-703',
        title: 'Cybersecurity Policy & Public Sector Digital Transformation',
        shortDescription: 'Comprehensive cyber risk management, infrastructure protection, and digital governance for African public institutions.',
        deliveryMethod: 'ONLINE_SELF_PACED',
        durationDays: 4,
        cpdPoints: 15,
        priceZar: 15500,
        priceUsd: 950,
        slug: 'cybersecurity-digital-transformation',
        featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
      },
    ];
  }

  return (
    <div className="space-y-24 pb-20 bg-udemy-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-udemy-purple to-udemy-darkPurple rounded-b-[2rem] sm:rounded-b-[4rem] shadow-2xl mb-12">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-white/10 via-white/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
          
          {/* Institution Tagline */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-udemy-black/40 border border-white/20 text-white text-xs font-semibold tracking-wide shadow-lg">
            <Sparkles className="w-4 h-4 text-udemy-grayBorder" />
            <span>Southern Africa Development Institute — Fully Online Global Learning</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Transforming <span className="text-white drop-shadow-md">African Leadership</span>
          </h1>

          <p className="text-base sm:text-lg text-udemy-gray max-w-3xl mx-auto leading-relaxed font-normal">
            Empowering executives, public sector leadership, boards, financial regulators, and corporate professionals across Africa through accredited fully online training, self-paced video e-learning, and interactive virtual instructor-led sessions via Zoom and Microsoft Teams.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/courses"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-udemy-purple text-base font-bold flex items-center justify-center space-x-3 shadow-xl hover:bg-udemy-gray transition-all"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore 2026 Online Catalogue</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/request-custom"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-transparent border-2 border-white hover:bg-white/10 text-white text-base font-semibold flex items-center justify-center space-x-3 transition-colors"
            >
              <Building2 className="w-5 h-5" />
              <span>Request Virtual In-House Training</span>
            </Link>
          </div>

          {/* Key Metrics Banner */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-1">
              <p className="text-3xl font-black text-white">100,000+</p>
              <p className="text-xs text-udemy-gray font-medium">Online Learners</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-1">
              <p className="text-3xl font-black text-white">54</p>
              <p className="text-xs text-udemy-gray font-medium">African Member States</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-1">
              <p className="text-3xl font-black text-white">100%</p>
              <p className="text-xs text-udemy-gray font-medium">Verifiable QR Certificates</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-1">
              <p className="text-3xl font-black text-white">ISO 9001</p>
              <p className="text-xs text-udemy-gray font-medium">Quality Compliance</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. PROGRAMME DELIVERY MODELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-udemy-purple">Flexible Online Delivery Architecture</h2>
          <p className="text-3xl font-black text-udemy-black tracking-tight">Tailored E-Learning for Modern African Institutions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-udemy-grayBorder p-8 rounded-3xl space-y-4 hover:border-udemy-purple transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-udemy-gray text-udemy-purple flex items-center justify-center">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-udemy-black">Instructor-Led Live Sessions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scheduled virtual cohort-based training delivered globally via Microsoft Teams and Zoom. Combines live facilitator sessions, interactive Q&A, and group case studies.
            </p>
          </div>

          <div className="bg-white border border-udemy-grayBorder p-8 rounded-3xl space-y-4 hover:border-udemy-purple transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-udemy-gray text-udemy-purple flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-udemy-black">Self-Paced E-Learning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Immediate continuous enrolment for technical and executive modules with adaptive video streaming, downloadable transcripts, and online exams. Learn on your own schedule.
            </p>
          </div>

          <div className="bg-white border border-udemy-grayBorder p-8 rounded-3xl space-y-4 hover:border-udemy-purple transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-udemy-gray text-udemy-purple flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-udemy-black">Virtual In-House Training</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bespoke capacity-building virtual interventions designed specifically for government ministries and corporate entities, delivered securely over your preferred corporate meeting platform.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COURSES CATALOGUE (MARKETPLACE STYLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-udemy-grayBorder pb-6">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-udemy-purple">Top Selling Online Courses</h2>
            <p className="text-3xl font-black text-udemy-black tracking-tight">Invest in Your Professional Growth</p>
          </div>
          <Link href="/courses" className="text-sm font-semibold text-udemy-purple hover:text-udemy-darkPurple flex items-center">
            <span>View Full 2026 Online Catalogue</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course, idx) => (
            <div key={course.id} className="bg-white relative rounded-3xl overflow-hidden flex flex-col justify-between group border border-udemy-grayBorder hover:border-udemy-purple transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Badges */}
              {idx === 0 && (
                <div className="absolute top-4 right-4 z-20 bg-udemy-purple text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Best Seller</span>
                </div>
              )}
              {idx === 1 && (
                <div className="absolute top-4 right-4 z-20 bg-udemy-darkPurple text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Trending</span>
                </div>
              )}

              <div className="p-4 pb-0">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden relative bg-udemy-gray shadow-inner">
                  <img
                    src={course.featuredImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-udemy-grayBorder text-[#5624d0] font-mono text-[10px] font-bold shadow-sm">
                    {course.code}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-grow">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#64748b] font-medium">
                  <span className="px-2 py-1 rounded-md bg-udemy-gray text-slate-700 border border-udemy-grayBorder uppercase tracking-wide">
                    {course.deliveryMethod.replace(/_/g, ' ')}
                  </span>
                  <span>•</span>
                  <span>{course.durationDays} Days</span>
                  <span>•</span>
                  <span>{course.cpdPoints} CPD</span>
                </div>

                <h3 className="text-xl font-extrabold text-udemy-black group-hover:text-udemy-purple transition-colors line-clamp-2 leading-tight">
                  {course.title}
                </h3>
                
                {/* Trust Signals (Mocked for Sales) */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-udemy-purple">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">(4.9/5 • 120+ Enrolled)</span>
                </div>

                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {course.shortDescription}
                </p>
              </div>

              <div className="p-6 pt-4 border-t border-udemy-grayBorder bg-udemy-gray mt-auto space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-black text-udemy-black tracking-tight">
                      ZAR {course.priceZar.toLocaleString()}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      USD {course.priceUsd.toLocaleString()} (Excl. VAT)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="col-span-1 px-4 py-3 rounded-xl bg-white border border-udemy-purple text-udemy-purple text-xs font-bold flex items-center justify-center hover:bg-udemy-gray transition-colors shadow-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/courses/${course.slug}/checkout`}
                    className="col-span-1 px-4 py-3 rounded-xl bg-udemy-purple text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-udemy-purple/20 hover:bg-udemy-darkPurple transition-colors"
                  >
                    Buy Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PUBLIC CERTIFICATE VERIFICATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border-udemy-grayBorder border flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tamper-Proof Cryptographic Credentials</span>
            </div>
            <h2 className="text-3xl font-black text-udemy-black tracking-tight">Public QR Certificate Verification</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every certificate issued by the Southern Africa Development Institute contains a unique QR code and cryptographic verification hash. Employers, regulators, and audit bodies can instantly verify credential authenticity.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/verify/VER-SADI-90412-AD"
              className="w-full sm:w-auto bg-udemy-purple hover:bg-udemy-darkPurple text-white px-6 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg transition-colors"
            >
              <Award className="w-4 h-4 text-white" />
              <span>Test Sample QR Verification</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
