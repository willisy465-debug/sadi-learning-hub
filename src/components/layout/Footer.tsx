'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Award, Lock, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-white/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-sage via-white/30 to-brand-sage mb-12 opacity-80" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center rounded-2xl bg-white px-6 py-5 shadow-md ring-1 ring-brand-sage/40">
              <img
                src="/sadi-logo.png"
                alt="Southern Africa Development Institute"
                className="h-[5.25rem] sm:h-[6.3rem] md:h-[7.35rem] w-auto max-w-[min(90vw,462px)] object-contain object-left"
              />
            </div>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              The Southern Africa Development Institute (SADI) is a premier Pan-African professional training and capacity-development institution providing public, online, and customised institutional programmes across Africa.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-white/70">
              <span className="px-2.5 py-1 rounded bg-white/10 border border-brand-sage/40 text-brand-sage font-mono font-bold">
                CIPC Reg: 2011/070892/23
              </span>
              <span className="flex items-center font-medium">
                <Lock className="w-3.5 h-3.5 text-brand-sage mr-1" />
                ISO 9001 Compliant
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">Programmes</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/courses" className="hover:text-brand-sage transition-colors">Scheduled Public Training</Link></li>
              <li><Link href="/courses?delivery=SELF_PACED" className="hover:text-brand-sage transition-colors">Online Self-Paced E-Learning</Link></li>
              <li><Link href="/courses?delivery=FACE_TO_FACE" className="hover:text-brand-sage transition-colors">Face-to-Face Workshops</Link></li>
              <li><Link href="/request-custom" className="hover:text-brand-sage transition-colors">In-House Corporate Training</Link></li>
              <li><Link href="/courses?delivery=CERTIFICATION_PROGRAMME" className="hover:text-brand-sage transition-colors">Certification Examinations</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">Services & Portal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/verify" className="hover:text-brand-sage transition-colors flex items-center"><Award className="w-3.5 h-3.5 text-brand-sage mr-1.5" /> Certificate Verification</Link></li>
              <li><Link href="/corporate/dashboard" className="hover:text-brand-sage transition-colors">Corporate Client Portal</Link></li>
              <li><Link href="/learner/dashboard" className="hover:text-brand-sage transition-colors">Learner Classroom</Link></li>
              <li><Link href="/login" className="hover:text-brand-sage transition-colors">Staff & Facilitator Login</Link></li>
              <li><Link href="/request-custom" className="hover:text-brand-sage transition-colors">Custom Quotation Request</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">Pretoria Headquarters</h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                <span>The Brooklyn Office Park, 105–107 Nicolson Street, Brooklyn, Pretoria, 0181, South Africa</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-sage shrink-0" />
                <span>+27 12 846 7118 / +27 10 007 1811 / +27 68 179 9104</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-sage shrink-0" />
                <span>info@saditraining.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-brand-sage shrink-0" />
                <a href="https://saditraining.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-sage flex items-center">
                  www.saditraining.com <ExternalLink className="w-3 h-3 ml-1 text-white/50" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/60 space-y-4 md:space-y-0">
          <p>© 2026 Southern Africa Development Institute (SADI). All rights reserved.</p>
          <div className="flex items-center space-x-3 flex-wrap justify-center">
            <span>Accepted Currencies:</span>
            {['ZAR', 'USD', 'KES', 'EUR', 'GBP'].map((c) => (
              <span key={c} className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-brand-sage font-mono font-medium">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
