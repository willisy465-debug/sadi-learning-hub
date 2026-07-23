'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, BookOpen } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-amber-500/30 max-w-xl w-full text-center space-y-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Temporary System Error
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            The SADI Learning Hub encountered an unexpected issue while loading this page. Our engineers have been notified.
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-slate-500 pt-2">
              Error Reference Digest: <span className="text-amber-400 font-bold">{error.digest}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto gold-button px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
          >
            <RefreshCw className="w-4 h-4 text-slate-950" />
            <span>Try Reloading Page</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
