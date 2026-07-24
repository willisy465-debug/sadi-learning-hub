'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, MapPin, Phone, Mail, Globe, Award, Lock, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Institutional Info & SADI Branding */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/logo.jpg" alt="SADI Logo" className="h-12 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white">
                  SADI <span className="text-amber-400 text-sm font-semibold ml-1">Learning Hub</span>
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The Southern Africa Development Institute (SADI) is a premier Pan-African professional training and capacity-development institution providing public, online, and customised institutional programmes across Africa.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 font-mono">
                CIPC Reg: 2011/070892/23
              </span>
              <span className="flex items-center text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                ISO 9001 Compliant
              </span>
            </div>
          </div>

          {/* Training Delivery Models */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">Programmes</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/courses" className="hover:text-amber-400 transition-colors">Scheduled Public Training</Link></li>
              <li><Link href="/courses?delivery=SELF_PACED" className="hover:text-amber-400 transition-colors">Online Self-Paced E-Learning</Link></li>
              <li><Link href="/courses?delivery=FACE_TO_FACE" className="hover:text-amber-400 transition-colors">Face-to-Face Workshops</Link></li>
              <li><Link href="/request-custom" className="hover:text-amber-400 transition-colors">In-House Corporate Training</Link></li>
              <li><Link href="/courses?delivery=CERTIFICATION_PROGRAMME" className="hover:text-amber-400 transition-colors">Certification Examinations</Link></li>
            </ul>
          </div>

          {/* Operational Support & Verification */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">Services & Portal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/verify/VER-SADI-90412-AD" className="hover:text-amber-400 transition-colors flex items-center"><Award className="w-3.5 h-3.5 text-amber-400 mr-1.5" /> Certificate Verification</Link></li>
              <li><Link href="/corporate/dashboard" className="hover:text-amber-400 transition-colors">Corporate Client Portal</Link></li>
              <li><Link href="/learner/dashboard" className="hover:text-amber-400 transition-colors">Learner Classroom</Link></li>
              <li><Link href="/login" className="hover:text-amber-400 transition-colors">Staff & Facilitator Login</Link></li>
              <li><Link href="/request-custom" className="hover:text-amber-400 transition-colors">Custom Quotation Request</Link></li>
            </ul>
          </div>

          {/* Head Office Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">Pretoria Headquarters</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>The Brooklyn Office Park, 105–107 Nicolson Street, Brooklyn, Pretoria, 0181, South Africa</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+27 12 846 7118 / +27 10 007 1811 / +27 68 179 9104</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@saditraining.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="https://saditraining.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center">
                  www.saditraining.com <ExternalLink className="w-3 h-3 ml-1 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights & Currencies */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>© 2026 Southern Africa Development Institute (SADI). All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Accepted Currencies:</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">ZAR</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">USD</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">KES</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">EUR</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">GBP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
