'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ArrowRight, ShieldCheck, Users, FileText } from 'lucide-react';

export default function CorporateDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="p-8 rounded-xl border border-udemy-grayBorder bg-white space-y-4 shadow-sm">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-udemy-purple/10 text-udemy-purple text-xs font-bold border border-udemy-purple/20">
          <Building2 className="w-4 h-4" />
          <span>SADI Institutional & Corporate Client Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-udemy-black tracking-tight">
          Executive <span className="text-udemy-purple">Institutional Dashboard</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
          Welcome to the Southern Africa Development Institute Institutional Management Portal. Monitor customized in-house training programmes, delegate enrolments, invoices, and executive progress reports.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-udemy-grayBorder space-y-4 hover:border-udemy-purple/40 transition-all shadow-sm hover:shadow-md">
          <div className="w-12 h-12 rounded-lg bg-udemy-purple/10 text-udemy-purple flex items-center justify-center border border-udemy-purple/20">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-udemy-black">Custom In-House Request</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Submit requirements for tailored in-house training for government ministries, public utilities, or corporate entities.
          </p>
          <Link
            href="/request-custom"
            className="udemy-button-primary px-4 py-2.5 rounded text-xs inline-flex items-center space-x-2 w-full justify-center"
          >
            <span>Request In-House Training</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-udemy-grayBorder space-y-4 hover:border-udemy-purple/40 transition-all shadow-sm hover:shadow-md">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-udemy-black">Browse Course Catalogue</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Explore 50+ executive short courses across Finance, Audit, Leadership, Procurement, and Public Governance.
          </p>
          <Link
            href="/courses"
            className="w-full px-4 py-2.5 rounded bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold text-xs inline-flex items-center justify-center space-x-2 border border-udemy-grayBorder transition-colors"
          >
            <span>Explore Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-udemy-grayBorder space-y-4 hover:border-udemy-purple/40 transition-all shadow-sm hover:shadow-md">
          <div className="w-12 h-12 rounded-lg bg-udemy-purple/10 text-udemy-purple flex items-center justify-center border border-udemy-purple/20">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-udemy-black">Verification & Compliance</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Verify official SADI executive certificates and check delegate CPD point allocations.
          </p>
          <Link
            href="/verify/VER-SADI-90412-AD"
            className="w-full px-4 py-2.5 rounded bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold text-xs inline-flex items-center justify-center space-x-2 border border-udemy-grayBorder transition-colors"
          >
            <span>Certificate Verification</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
