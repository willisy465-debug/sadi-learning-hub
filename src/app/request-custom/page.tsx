'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Building2, Mail, Phone, MapPin, Calendar, Users, Send, CheckCircle } from 'lucide-react';

function CustomRequestForm() {
  const searchParams = useSearchParams();
  const prefilledCourse = searchParams.get('course') || '';
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organisationName: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    country: 'South Africa',
    preferredCourse: prefilledCourse,
    participantCount: 10,
    preferredDates: '',
    deliveryMode: 'IN_HOUSE_CORPORATE',
    comments: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/corporate/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to submit custom request');
      }
    } catch (err) {
      alert('Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
          <Building2 className="w-4 h-4" />
          <span>In-House Institutional & Customized Training</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Request Tailored <span className="gold-gradient-text">Capacity Programme</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          SADI designs and delivers custom in-house programmes for government departments, state utilities, central banks, and corporate institutions anywhere in Africa or globally.
        </p>
      </div>

      {submitted ? (
        <div className="glass-panel p-10 rounded-3xl border border-emerald-500/30 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">Custom Request Received!</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Thank you. A SADI Senior Institutional Programme Director will review your requirements and issue an official proposal and quotation within 24 hours.
          </p>
          <button
            onClick={() => router.push('/courses')}
            className="gold-button px-6 py-2.5 rounded-xl font-bold text-xs"
          >
            Return to Course Catalogue
          </button>
        </div>
      ) : (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Organisation / Institution Name</label>
                <input
                  type="text"
                  required
                  value={formData.organisationName}
                  onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
                  placeholder="e.g. Ministry of Finance / Eskom SOC"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Contact Person & Title</label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Dr. Sibusiso Zwane (Head of HR)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="sibusiso.zwane@eskom.co.za"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+27 11 800 1111"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
                >
                  <option value="South Africa">South Africa</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Other">Other Country</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Estimated Delegates</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.participantCount}
                  onChange={(e) => setFormData({ ...formData, participantCount: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Delivery Mode</label>
                <select
                  value={formData.deliveryMode}
                  onChange={(e) => setFormData({ ...formData, deliveryMode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
                >
                  <option value="IN_HOUSE_CORPORATE">In-House On-Site (Client Premises)</option>
                  <option value="FACE_TO_FACE">Pretoria SADI Campus</option>
                  <option value="BLENDED">Blended Hybrid</option>
                  <option value="SELF_PACED">Dedicated E-Learning Portal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Course Title or Scope</label>
              <input
                type="text"
                required
                value={formData.preferredCourse}
                onChange={(e) => setFormData({ ...formData, preferredCourse: e.target.value })}
                placeholder="e.g. Executive Leadership & Public Finance Audit"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Additional Requirements / Preferred Dates</label>
              <textarea
                rows={4}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Detail preferred dates, duration (e.g. 5 days), specific learning outcomes, or logistical requirements..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-button py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>{loading ? 'Submitting Request...' : 'Submit Institutional Training Request'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function CustomRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-amber-400 font-bold text-sm">
          Loading Custom Programme Portal...
        </div>
      }
    >
      <CustomRequestForm />
    </Suspense>
  );
}
