'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Clock, Award, ArrowRight, Video, Download, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { InstantCheckoutModal } from '@/components/checkout/InstantCheckoutModal';

interface CoursesMarketplaceClientProps {
  initialCourses: any[];
  categories: any[];
  currentUser?: any;
}

export function CoursesMarketplaceClient({ initialCourses, categories, currentUser }: CoursesMarketplaceClientProps) {
  const [courses, setCourses] = useState(initialCourses);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<any>(null);

  const filteredCourses = courses.filter((course) => {
    const matchesQuery = query
      ? course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.code.toLowerCase().includes(query.toLowerCase()) ||
        course.shortDescription.toLowerCase().includes(query.toLowerCase())
      : true;
    const matchesCat = selectedCategory ? course.categoryId === selectedCategory : true;
    const matchesDel = selectedDelivery ? course.deliveryMethod === selectedDelivery : true;
    return matchesQuery && matchesCat && matchesDel;
  });

  return (
    <div className="space-y-8">
      
      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search online courses, code (e.g. SADI-EXEC-01)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
            >
              <option value="">All Executive Sectors</option>
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
              value={selectedDelivery}
              onChange={(e) => setSelectedDelivery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
            >
              <option value="">All Online Delivery Modes</option>
              <option value="SELF_PACED">100% Online Self-Paced Video</option>
              <option value="ONLINE_VIRTUAL">Live Online Virtual Masterclass</option>
              <option value="BLENDED">Blended Online & Masterclass</option>
            </select>
          </div>

        </div>

        {(query || selectedCategory || selectedDelivery) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400">Showing {filteredCourses.length} online courses</span>
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('');
                setSelectedDelivery('');
              }}
              className="text-amber-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Course Marketplace Grid */}
      {filteredCourses.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No online courses match your search</h3>
          <p className="text-xs text-slate-400">Try adjusting your keywords or clearing filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="glass-panel rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group shadow-xl hover:shadow-amber-500/5"
            >
              <div className="space-y-4 p-6">
                <div className="aspect-video rounded-2xl overflow-hidden relative bg-slate-900">
                  <img
                    src={course.featuredImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
                    {course.code}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-emerald-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center space-x-1">
                    <Video className="w-3 h-3" />
                    <span>100% Hosted Online</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                    Online Self-Paced
                  </span>
                  <span>•</span>
                  <span className="text-slate-300">{course.durationDays || 5} Days Access</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{course.cpdPoints || 10} CPD Pts</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {course.shortDescription}
                </p>

                {/* Online Hosted Features */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Video className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>HD Streaming Videos</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Digital Notes & PDFs</span>
                  </div>
                </div>
              </div>

              {/* Price & Instant Purchase Actions */}
              <div className="p-6 pt-4 border-t border-slate-800/80 space-y-3 bg-slate-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Tuition Fee</p>
                    <p className="text-base font-black text-emerald-400 font-mono">
                      ZAR {course.priceZar?.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-slate-400">(/ USD {course.priceUsd})</span>
                    </p>
                  </div>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-xs text-slate-400 hover:text-amber-400 font-semibold underline"
                  >
                    View Syllabus
                  </Link>
                </div>

                <button
                  onClick={() => setSelectedCourseForCheckout(course)}
                  className="gold-button w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buy & Start Online Immediately</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instant Checkout Modal */}
      {selectedCourseForCheckout && (
        <InstantCheckoutModal
          course={selectedCourseForCheckout}
          isOpen={!!selectedCourseForCheckout}
          onClose={() => setSelectedCourseForCheckout(null)}
          currentUser={currentUser}
        />
      )}

    </div>
  );
}
