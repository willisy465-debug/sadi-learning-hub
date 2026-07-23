'use client';

import React, { useState } from 'react';
import { ShieldCheck, Video, Download, Award, CheckCircle2, Lock, CreditCard, Sparkles, Building, Globe, X } from 'lucide-react';

interface InstantCheckoutModalProps {
  course: {
    id: string;
    code: string;
    title: string;
    priceZar: number;
    priceUsd: number;
    durationDays?: number;
    cpdPoints?: number;
  };
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
}

export function InstantCheckoutModal({ course, isOpen, onClose, currentUser }: InstantCheckoutModalProps) {
  const [email, setEmail] = useState(currentUser?.email || '');
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('South Africa');
  const [organisationName, setOrganisationName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'EFT' | 'INSTANT_DEMO'>('CARD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          email,
          firstName,
          lastName,
          password,
          country,
          organisationName,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete online checkout');
      }

      setSuccessMsg(`Credentials & Paid Invoice ${data.invoiceNumber} Generated! Launching Online Classroom...`);
      
      setTimeout(() => {
        window.location.href = data.redirectUrl || `/learner/courses/${course.id}/learn`;
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 max-h-[95vh] overflow-y-auto relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-4 border-b border-slate-800 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Instant Online Checkout & Registration</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase">
                100% Online Access
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automatic credential generation, paid invoice issue, and immediate redirect to hosted online video lectures.
            </p>
          </div>
        </div>

        {/* Selected Course Summary */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-amber-400">{course.code}</span>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold flex items-center">
                <Award className="w-3 h-3 mr-1 text-amber-400" />
                {course.cpdPoints || 10} CPD Points
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold flex items-center">
                <Video className="w-3 h-3 mr-1 text-emerald-400" />
                HD Video Stream
              </span>
            </div>
          </div>
          <h3 className="text-base font-black text-white">{course.title}</h3>
          
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">Total Tuition Fee (100% Online Access):</span>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-400 font-mono">
                ZAR {course.priceZar?.toLocaleString()}
              </span>
              <span className="text-slate-400 ml-2 font-mono text-[11px]">
                (/ USD {course.priceUsd})
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Checkout Registration Form */}
        <form onSubmit={handleCheckout} className="space-y-4 text-xs">
          {!currentUser && (
            <div className="space-y-3">
              <p className="text-amber-400 font-bold uppercase text-[10px] tracking-wider">
                1. Delegate Credential Details (Auto-Created Account)
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-amber-400 focus:outline-none"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-amber-400 focus:outline-none"
                    placeholder="Moyo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Work / Official Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-amber-400 focus:outline-none font-mono"
                    placeholder="delegate@gov.za"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Account Password (Optional)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-amber-400 focus:outline-none font-mono"
                    placeholder="Leave blank for SadiOnline2026!"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-amber-400 focus:outline-none"
                    placeholder="South Africa / Namibia / Kenya"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Organisation / Ministry</label>
                  <input
                    type="text"
                    value={organisationName}
                    onChange={(e) => setOrganisationName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-amber-400 focus:outline-none"
                    placeholder="Department of National Treasury"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2">
            <p className="text-amber-400 font-bold uppercase text-[10px] tracking-wider">
              2. Select Online Payment Gateway
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'CARD'
                    ? 'bg-amber-500/10 border-amber-400 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <input type="radio" name="pay" checked={paymentMethod === 'CARD'} readOnly />
                </div>
                <span className="font-bold text-[11px] mt-2">Credit / Debit Card</span>
                <span className="text-[9px] text-slate-400">PayFast / Visa / Mastercard</span>
              </label>

              <label
                onClick={() => setPaymentMethod('EFT')}
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'EFT'
                    ? 'bg-amber-500/10 border-amber-400 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Building className="w-4 h-4 text-emerald-400" />
                  <input type="radio" name="pay" checked={paymentMethod === 'EFT'} readOnly />
                </div>
                <span className="font-bold text-[11px] mt-2">Instant EFT / Bank Wire</span>
                <span className="text-[9px] text-slate-400">Direct Bank Transfer</span>
              </label>

              <label
                onClick={() => setPaymentMethod('INSTANT_DEMO')}
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'INSTANT_DEMO'
                    ? 'bg-amber-500/10 border-amber-400 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <input type="radio" name="pay" checked={paymentMethod === 'INSTANT_DEMO'} readOnly />
                </div>
                <span className="font-bold text-[11px] mt-2">Instant Activation</span>
                <span className="text-[9px] text-slate-400">Immediate Access</span>
              </label>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-2 text-slate-400 text-[11px]">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>256-Bit SSL Encrypted Instant Credential & Invoice Provisioning</span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="gold-button w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {loading
                  ? 'Provisioning Online Credentials & Enrolling...'
                  : `Pay ZAR ${course.priceZar?.toLocaleString()} & Start Learning Online Immediately`}
              </span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
