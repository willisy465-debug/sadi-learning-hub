'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, BookOpen, Clock, Award, ArrowRight, Video, Download, 
  Sparkles, CheckCircle2, ShieldCheck, Star, PlayCircle, Users, FileText, Check 
} from 'lucide-react';
import { InstantCheckoutModal } from '@/components/checkout/InstantCheckoutModal';

interface CoursesMarketplaceClientProps {
  initialCourses: any[];
  categories: any[];
  currentUser?: any;
}

export function CoursesMarketplaceClient({ initialCourses, categories, currentUser }: CoursesMarketplaceClientProps) {
  const [courses] = useState(initialCourses);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<any>(null);
  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);

  const filteredCourses = courses.filter((course) => {
    const matchesQuery = query
      ? course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.code.toLowerCase().includes(query.toLowerCase()) ||
        (course.shortDescription && course.shortDescription.toLowerCase().includes(query.toLowerCase()))
      : true;
    const matchesCat = selectedCategory ? course.categoryId === selectedCategory || (course.category && course.category.id === selectedCategory) : true;
    const matchesDel = selectedDelivery ? course.deliveryMethod === selectedDelivery : true;
    return matchesQuery && matchesCat && matchesDel;
  });

  return (
    <div className="space-y-8">
      
      {/* Category Pills Bar (Udemy Style) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === ''
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
          }`}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(selectedCategory === c.id ? '' : c.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === c.id
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search executive online courses, skills, codes (e.g. FIN-801)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
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
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400 font-medium">Showing {filteredCourses.length} executive online courses</span>
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('');
                setSelectedDelivery('');
              }}
              className="text-amber-400 hover:underline font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Udemy-Style Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No online courses match your search</h3>
          <p className="text-xs text-slate-400">Try adjusting your keywords or clearing filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, idx) => {
            const originalPrice = Math.round((course.priceZar || 18500) * 1.3);
            const discountPercent = 23;
            const rating = (4.8 + (idx % 3) * 0.1).toFixed(1);
            const reviewCount = 180 + idx * 95;
            const badgeType = idx % 3 === 0 ? 'Bestseller' : idx % 3 === 1 ? 'Highest Rated' : 'Hot & New';

            return (
              <div
                key={course.id}
                onMouseEnter={() => setHoveredCourseId(course.id)}
                onMouseLeave={() => setHoveredCourseId(null)}
                className="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 group shadow-xl hover:shadow-amber-500/10 relative"
              >
                {/* Udemy Course Card Header & Image */}
                <div className="space-y-4">
                  <div className="aspect-video rounded-t-2xl overflow-hidden relative bg-slate-900">
                    <img
                      src={course.featuredImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Course Code Badge */}
                    <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
                      {course.code}
                    </div>

                    {/* Udemy Badge (Bestseller / Highest Rated) */}
                    <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      badgeType === 'Bestseller'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : badgeType === 'Highest Rated'
                        ? 'bg-emerald-400 text-slate-950 shadow-md'
                        : 'bg-purple-400 text-slate-950 shadow-md'
                    }`}>
                      {badgeType}
                    </div>

                    {/* Play Overlay Preview */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/30 transform group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-7 h-7 fill-slate-950 text-amber-400" />
                      </div>
                    </div>
                  </div>

                  {/* Course Content Details */}
                  <div className="px-5 space-y-2.5">
                    
                    {/* Category & Duration */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-bold uppercase tracking-wider">
                        {course.category?.name || 'Executive Online'}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {course.durationDays || 5} Days Access
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/courses/${course.slug}`}>
                        {course.title}
                      </Link>
                    </h3>

                    {/* Instructor / Faculty */}
                    <p className="text-xs text-slate-400 font-medium">
                      SADI Executive Faculty & Pan-African Experts
                    </p>

                    {/* Udemy Star Rating */}
                    <div className="flex items-center space-x-1 text-xs">
                      <span className="font-black text-amber-400">{rating}</span>
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">({reviewCount})</span>
                    </div>

                    {/* Quick Specs Pills */}
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center space-x-1">
                        <Video className="w-3.5 h-3.5 text-amber-400" />
                        <span>HD Video</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>PDF Notes</span>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{course.cpdPoints || 20} CPD</span>
                    </div>

                  </div>
                </div>

                {/* Price & Purchase Actions */}
                <div className="p-5 pt-4 border-t border-slate-800/80 space-y-3 bg-slate-900/40 mt-4 rounded-b-2xl">
                  
                  {/* Udemy Price Display */}
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-black text-white font-mono">
                      ZAR {course.priceZar?.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 line-through font-mono">
                      ZAR {originalPrice.toLocaleString()}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                      {discountPercent}% OFF
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white text-center transition-all"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => setSelectedCourseForCheckout(course)}
                      className="gold-button py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 shadow-lg shadow-amber-500/10"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Buy Now</span>
                    </button>
                  </div>

                </div>

                {/* Udemy Quick Hover Preview Popover */}
                {hoveredCourseId === course.id && (
                  <div className="hidden xl:block absolute left-full top-0 ml-4 w-80 bg-slate-900 border border-slate-700 p-5 rounded-2xl shadow-2xl z-50 space-y-4 animate-in fade-in slide-in-from-left-2 duration-200">
                    <h4 className="font-bold text-white text-sm leading-snug">
                      {course.title}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {course.shortDescription || 'Master executive leadership, governance standards, and strategic skills through 100% online self-paced e-learning.'}
                    </p>

                    <div className="space-y-2 border-t border-slate-800 pt-3">
                      <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">What you'll learn:</p>
                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Complete 100% online executive video modules</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Earn SADI accredited CPD Points & Certificate</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Instant auto-provisioning & lifetime access</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCourseForCheckout(course)}
                      className="gold-button w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Buy & Start Online Immediately</span>
                    </button>
                  </div>
                )}

              </div>
            );
          })}
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
