'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ArrowRight, ShieldCheck, Users, FileText } from 'lucide-react';

export default function CorporateDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
          <Building2 className="w-4 h-4" />
          <span>SADI Institutional & Corporate Client Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Executive <span className="gold-gradient-text">Institutional Dashboard</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Welcome to the Southern Africa Development Institute Institutional Management Portal. Monitor customized in-house training programmes, delegate enrolments, invoices, and executive progress reports.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Custom In-House Request</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Submit requirements for tailored in-house training for government ministries, public utilities, or corporate entities.
          </p>
          <Link
            href="/request-custom"
            className="gold-button px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center space-x-2"
          >
            <span>Request In-House Training</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Browse Course Catalogue</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Explore 50+ executive short courses across Finance, Audit, Leadership, Procurement, and Public Governance.
          </p>
          <Link
            href="/courses"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs inline-flex items-center justify-center space-x-2 border border-slate-700"
          >
            <span>Explore Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Verification & Compliance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Verify official SADI executive certificates and check delegate CPD point allocations.
          </p>
          <Link
            href="/verify/VER-SADI-90412-AD"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs inline-flex items-center justify-center space-x-2 border border-slate-700"
          >
            <span>Certificate Verification</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
