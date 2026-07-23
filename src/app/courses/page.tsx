import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Search, Filter, BookOpen, Clock, Award, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: { query?: string; category?: string; delivery?: string };
}) {
  const query = searchParams?.query || '';
  const categoryFilter = searchParams?.category || '';
  const deliveryFilter = searchParams?.delivery || '';

  const categories = await prisma.courseCategory.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      ...(categoryFilter ? { categoryId: categoryFilter } : {}),
      ...(deliveryFilter ? { deliveryMethod: deliveryFilter } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query } },
              { code: { contains: query } },
              { shortDescription: { contains: query } },
            ],
          }
        : {}),
    },
    include: { category: true, cohorts: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400">
          <BookOpen className="w-4 h-4" />
          <span>SADI 2026 Academic Catalogue</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Professional Training & <span className="gold-gradient-text">Capacity Courses</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Browse public scheduled workshops, online self-paced e-learning, blended programmes, and institutional certifications across Pan-African development sectors.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              name="query"
              defaultValue={query}
              placeholder="Search by course title, code (e.g. SADI-EXEC-01)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              name="category"
              defaultValue={categoryFilter}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Method Filter */}
          <div>
            <select
              name="delivery"
              defaultValue={deliveryFilter}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
            >
              <option value="">All Delivery Modes</option>
              <option value="BLENDED">Blended Learning</option>
              <option value="SELF_PACED">Online Self-Paced</option>
              <option value="FACE_TO_FACE">Face-to-Face Workshop</option>
              <option value="IN_HOUSE_CORPORATE">In-House Corporate</option>
              <option value="CERTIFICATION_PROGRAMME">Certification Exam</option>
            </select>
          </div>

          <div className="md:col-span-4 flex items-center justify-end space-x-3">
            {(query || categoryFilter || deliveryFilter) && (
              <Link
                href="/courses"
                className="text-xs text-slate-400 hover:text-white underline mr-auto"
              >
                Reset Filters
              </Link>
            )}
            <button
              type="submit"
              className="gold-button px-6 py-2 rounded-xl text-xs font-bold shadow-md shadow-amber-500/10"
            >
              Apply Filters
            </button>
          </div>

        </form>
      </div>

      {/* Course Grid */}
      {courses.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No courses match your filter criteria</h3>
          <p className="text-xs text-slate-400">Try searching for a different keyword or resetting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="glass-panel rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-colors group"
            >
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
                  <span>{course.durationDays} Days</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">{course.cpdPoints} CPD Points</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {course.shortDescription}
                </p>

                {course.cohorts && course.cohorts.length > 0 && (
                  <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Next Cohort: {new Date(course.cohorts[0].startDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-semibold">Tuition Fee</p>
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
      )}

    </div>
  );
}
