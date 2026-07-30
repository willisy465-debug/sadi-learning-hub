import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function VerifyLandingPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const code = (searchParams.code || '').trim();
  if (code) {
    redirect(`/verify/${encodeURIComponent(code)}`);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-udemy-purple to-udemy-darkPurple flex items-center justify-center shadow-xl shadow-udemy-purple/20 mb-2">
            <Shield className="w-8 h-8 text-white font-bold" />
          </div>
          <h1 className="text-3xl font-black text-udemy-black tracking-tight">
            Southern Africa Development Institute
          </h1>
          <p className="text-xs text-udemy-purple font-semibold uppercase tracking-widest">
            Official Credential Verification Portal
          </p>
        </div>

        <form action="/verify" method="get" className="max-w-xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              name="code"
              required
              placeholder="Enter verification code (e.g. VER-SADI-90412-AD)"
              className="flex-1 px-4 py-3 rounded-xl border border-udemy-grayBorder bg-udemy-gray text-sm text-udemy-black focus:outline-none focus:border-udemy-purple focus:ring-1 focus:ring-udemy-purple/20 font-mono"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-udemy-purple text-white text-sm font-bold hover:bg-udemy-darkPurple transition-colors"
            >
              Verify
            </button>
          </div>
          <p className="text-center text-xs text-slate-500">
            Try the sample credential:{' '}
            <Link href="/verify/VER-SADI-90412-AD" className="text-udemy-purple font-mono font-bold hover:underline">
              VER-SADI-90412-AD
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
