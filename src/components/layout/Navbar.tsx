'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, BookOpen, Award, Building2, User, LogOut, Menu, X, CheckCircle, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentUser?: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    organisationId?: string | null;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const isLearner = currentUser?.roles.includes('LEARNER');
  const isFacilitator = currentUser?.roles.includes('FACILITATOR') || currentUser?.roles.includes('SUPER_ADMIN');
  const isAdmin = currentUser?.roles.some((r) =>
    ['SUPER_ADMIN', 'PROGRAMME_DIRECTOR', 'OPERATIONS_MANAGER', 'LMS_ADMIN', 'PROGRAMME_MANAGER', 'FINANCE_OFFICER'].includes(r)
  );

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              {/* Custom SADI Logo Image slot with Shield Fallback */}
              <img
                src="/logo.png"
                alt="SADI Logo"
                className="w-full h-full object-contain rounded-lg hidden text-transparent"
                onError={(e) => {
                  // If logo.png is not uploaded yet, display default brand badge
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg text-white tracking-tight">SADI</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[10px] tracking-wider uppercase">
                  Learning Hub
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Southern Africa Development Institute</p>
            </div>
          </Link>

          {/* Desktop Main Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/courses"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/courses' ? 'text-amber-400 bg-slate-800/80' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Course Catalogue
            </Link>
            <Link
              href="/request-custom"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/request-custom' ? 'text-amber-400 bg-slate-800/80' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              In-House & Custom
            </Link>
            <Link
              href="/verify/VER-SADI-90412-AD"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                pathname.startsWith('/verify') ? 'text-amber-400 bg-slate-800/80' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Verify Certificate</span>
            </Link>
          </nav>

          {/* User Auth Controls & Portals */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm">
                    {currentUser.firstName[0]}
                    {currentUser.lastName[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-[10px] text-amber-400 font-mono">
                      {currentUser.roles[0]?.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-2xl py-2 z-50 border border-slate-700">
                    <div className="px-4 py-2 border-b border-slate-700/60">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-xs font-semibold text-white truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/learner/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-700/50 hover:text-amber-400"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Learner Dashboard</span>
                      </Link>

                      {isFacilitator && (
                        <Link
                          href="/facilitator/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-700/50 hover:text-amber-400"
                        >
                          <User className="w-4 h-4" />
                          <span>Facilitator Portal</span>
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-700/50 hover:text-amber-400"
                        >
                          <Shield className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-amber-400">Admin Operations Hub</span>
                        </Link>
                      )}

                      <Link
                        href="/learner/certificates"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-700/50 hover:text-amber-400"
                      >
                        <Award className="w-4 h-4" />
                        <span>My Certificates</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-700/60">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?register=true"
                  className="gold-button px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/10 hover:scale-[1.02] transition-transform"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-amber-400"
          >
            Course Catalogue
          </Link>
          <Link
            href="/request-custom"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-amber-400"
          >
            In-House & Custom Requests
          </Link>
          <Link
            href="/verify/VER-SADI-90412-AD"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-emerald-400 font-medium"
          >
            Verify Certificate
          </Link>

          {currentUser ? (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <p className="text-xs text-slate-400">Signed in as {currentUser.email}</p>
              <Link href="/learner/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-200">
                Learner Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-amber-400 font-semibold">
                  Admin Hub
                </Link>
              )}
              <button onClick={handleLogout} className="block text-sm text-rose-400 pt-2">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-slate-300 bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                href="/login?register=true"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center gold-button py-2.5 rounded-xl font-semibold"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
