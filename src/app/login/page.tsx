'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, User, Building, MapPin, CheckCircle, ArrowRight, KeyRound } from 'lucide-react';

export default function LoginPage() {
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

      // Redirect based on primary role or query param
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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Glow background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-xl shadow-amber-500/20 mb-4">
            <Shield className="w-8 h-8 text-slate-950 font-bold" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            SADI <span className="text-amber-400">Learning Hub</span>
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isRegister
              ? 'Create your Pan-African professional delegate account'
              : 'Sign in to access your courses, certificates & examinations'}
          </p>
        </div>

        {/* Quick Demo Login Bar for Testing */}
        {!isRegister && (
          <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
              <KeyRound className="w-4 h-4" />
              <span>1-Click Demo Login Presets (Password: Password123!)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('learner@saditraining.com')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-left border border-slate-700 truncate"
              >
                👤 Learner Delegate
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@saditraining.com')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-left border border-amber-500/30 truncate font-medium"
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('facilitator@saditraining.com')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-left border border-slate-700 truncate"
              >
                👨‍🏫 Facilitator
              </button>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">First Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
                      placeholder="Kagiso"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="Dlamini"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Work / Official Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="delegate@institution.gov"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegister && (
              <>
                {/* Sponsorship Model Selection */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Sponsorship / Funding Model *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSponsorType('SELF')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                        sponsorType === 'SELF'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <User className="w-5 h-5 mb-1" />
                      <span>Self-Sponsored</span>
                      <span className="text-[10px] font-normal text-slate-400">Individual Candidate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSponsorType('ORGANISATION')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                        sponsorType === 'ORGANISATION'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Building className="w-5 h-5 mb-1" />
                      <span>Organisation Sponsored</span>
                      <span className="text-[10px] font-normal text-slate-400">Company / Ministry</span>
                    </button>
                  </div>
                </div>

                {/* Organisation Fields if Sponsored */}
                {sponsorType === 'ORGANISATION' && (
                  <div className="space-y-4 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20">
                    <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                      <Building className="w-4 h-4" />
                      <span>Sponsoring Organisation Details</span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Company / Ministry Name *</label>
                      <input
                        type="text"
                        required
                        value={organisationName}
                        onChange={(e) => setOrganisationName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                        placeholder="Eskom SOC / Ministry of Finance"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Tax / CIPC Number</label>
                        <input
                          type="text"
                          value={taxNumber}
                          onChange={(e) => setTaxNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                          placeholder="4910293847"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Job Designation</label>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                          placeholder="Senior Engineer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Sponsoring Manager / HR Email</label>
                      <input
                        type="email"
                        value={managerEmail}
                        onChange={(e) => setManagerEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                        placeholder="hr@organisation.com"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Country of Residence</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none"
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

          {/* Toggle Register/Login */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isRegister ? (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                  }}
                  className="text-amber-400 font-semibold hover:underline"
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
                  className="text-amber-400 font-semibold hover:underline"
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
