'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, User, Building, MapPin, CheckCircle, ArrowRight, KeyRound } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegisterInitial = searchParams.get('register') === 'true';
  const redirect = searchParams.get('redirect') || '/learner/dashboard';

  const [isRegister, setIsRegister] = useState(isRegisterInitial);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('South Africa');
  const [sponsorType, setSponsorType] = useState<'SELF' | 'ORGANISATION'>('SELF');
  const [organisationName, setOrganisationName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister
        ? {
            email,
            password,
            firstName,
            lastName,
            country,
            sponsorType,
            organisationName,
            taxNumber,
            jobTitle,
            department,
            managerEmail,
          }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      if (data.roles?.includes('SUPER_ADMIN') || data.roles?.includes('PROGRAMME_DIRECTOR')) {
        router.push('/admin/dashboard');
      } else if (data.roles?.includes('FACILITATOR')) {
        router.push('/facilitator/dashboard');
      } else {
        router.push(redirect);
      }
      router.refresh();
    } catch (err: any) {
      setError('An error occurred during authentication.');
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00b1f8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <img src="/logo.jpg" alt="SADI Logo" className="mx-auto h-20 w-auto object-contain mb-4" />
          <h2 className="text-3xl font-black text-black tracking-tight">
            SADI <span className="text-[#060097]">Learning Hub</span>
          </h2>
          <p className="mt-2 text-sm text-gray-900">
            {isRegister
              ? 'Create your Pan-African professional delegate account'
              : 'Sign in to access your courses, certificates & examinations'}
          </p>
        </div>

        {!isRegister && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#00b1f8]">
              <KeyRound className="w-4 h-4" />
              <span>1-Click Demo Login Presets (Password: Password123!)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('learner@saditraining.com')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-black text-left border border-slate-200 truncate"
              >
                👤 Learner Delegate
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@saditraining.com')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#060097] text-left border border-[#00b1f8]/30 truncate font-bold shadow-sm shadow-[#060097]/5"
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('facilitator@saditraining.com')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-black text-left border border-slate-200 truncate"
              >
                👨‍🏫 Facilitator
              </button>
            </div>
          </div>
        )}

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-[#060097]/5">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black mb-1.5">First Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-black text-sm focus:border-[#00b1f8] focus:outline-none focus:ring-1 focus:ring-[#00b1f8]/30 placeholder-slate-400"
                      placeholder="Kagiso"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-black mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-black text-sm focus:border-[#00b1f8] focus:outline-none focus:ring-1 focus:ring-[#00b1f8]/30 placeholder-slate-400"
                    placeholder="Dlamini"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">Work / Official Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-black text-sm focus:border-[#00b1f8] focus:outline-none focus:ring-1 focus:ring-[#00b1f8]/30 placeholder-slate-400"
                  placeholder="delegate@institution.gov"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-black text-sm focus:border-[#00b1f8] focus:outline-none focus:ring-1 focus:ring-[#00b1f8]/30 placeholder-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegister && (
              <>
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-[#060097] uppercase tracking-wider">
                    Sponsorship / Funding Model *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSponsorType('SELF')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                        sponsorType === 'SELF'
                          ? 'bg-[#00b1f8]/10 border-[#00b1f8] text-[#060097] shadow-md shadow-[#00b1f8]/10'
                          : 'bg-white border-slate-200 text-[#64748b] hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-5 h-5 mb-1" />
                      <span>Self-Sponsored</span>
                      <span className="text-[10px] font-normal text-[#64748b]">Individual Candidate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSponsorType('ORGANISATION')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                        sponsorType === 'ORGANISATION'
                          ? 'bg-[#00b1f8]/10 border-[#00b1f8] text-[#060097] shadow-md shadow-[#00b1f8]/10'
                          : 'bg-white border-slate-200 text-[#64748b] hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Building className="w-5 h-5 mb-1" />
                      <span>Organisation Sponsored</span>
                      <span className="text-[10px] font-normal text-[#64748b]">Company / Ministry</span>
                    </button>
                  </div>
                </div>

                {sponsorType === 'ORGANISATION' && (
                  <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#060097]">
                      <Building className="w-4 h-4" />
                      <span>Sponsoring Organisation Details</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1">Company / Ministry Name *</label>
                      <input
                        type="text"
                        required
                        value={organisationName}
                        onChange={(e) => setOrganisationName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-black text-xs focus:border-[#00b1f8] focus:outline-none focus:ring-1 focus:ring-[#00b1f8]/30 placeholder-slate-400"
                        placeholder="Eskom SOC / Ministry of Finance"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-black mb-1">Tax / CIPC Number</label>
                        <input
                          type="text"
                          value={taxNumber}
                          onChange={(e) => setTaxNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-black text-xs focus:border-[#00b1f8] focus:outline-none focus:ring-1 focus:ring-[#00b1f8]/30 placeholder-slate-400"
                          placeholder="4910293847"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-black mb-1">Job Designation</label>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-black text-xs focus:border-[#00b1f8] focus:outline-none focus:ring-1 focus:ring-[#00b1f8]/30 placeholder-slate-400"
                          placeholder="Senior Engineer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1">Sponsoring Manager / HR Email</label>
                      <input
                        type="email"
                        value={managerEmail}
                        onChange={(e) => setManagerEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-black text-xs focus:border-[#00b1f8] focus:outline-none focus:ring-1 focus:ring-[#00b1f8]/30 placeholder-slate-400"
                        placeholder="hr@organisation.com"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-black mb-1.5">Country of Residence</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-black text-sm focus:border-[#00b1f8] focus:outline-none focus:ring-1 focus:ring-[#00b1f8]/30"
                    >
                      <option value="South Africa">South Africa</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                      <option value="Zambia">Zambia</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Botswana">Botswana</option>
                      <option value="Namibia">Namibia</option>
                      <option value="Other">Other International</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-button py-3 rounded-xl font-bold flex items-center justify-center space-x-2 text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : isRegister ? 'Create Delegate Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#64748b]">
            {isRegister ? (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                  }}
                  className="text-[#060097] font-semibold hover:underline"
                >
                  Sign in to your account
                </button>
              </p>
            ) : (
              <p>
                New delegate or organisation?{' '}
                <button
                  onClick={() => {
                    setIsRegister(true);
                    setError('');
                  }}
                  className="text-[#060097] font-semibold hover:underline"
                >
                  Register a new account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center bg-slate-50">
          <div className="text-[#060097] font-bold text-sm">Loading SADI Authentication Portal...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
