import React from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { Shield, Award, CheckCircle2, AlertTriangle, Building, Lock, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CertificateVerificationPage({
  params,
}: {
  params: { code: string };
}) {
  const code = decodeURIComponent(params.code || '').trim();

  let certificate: any = null;
  let lookupError = false;

  try {
    if (code) {
      certificate = await prisma.certificate.findUnique({
        where: { verificationCode: code },
        include: { course: true, user: true },
      });
    }
  } catch (err) {
    console.error('Certificate verification lookup failed:', err);
    lookupError = true;
  }

  if (certificate) {
    try {
      const hdrs = headers();
      const forwarded = hdrs.get('x-forwarded-for');
      const ipAddress = forwarded?.split(',')[0]?.trim() || hdrs.get('x-real-ip') || 'unknown';
      const userAgent = hdrs.get('user-agent') || 'Web Browser Verification';

      await prisma.certificateVerification.create({
        data: {
          certificateId: certificate.id,
          ipAddress,
          userAgent: userAgent.slice(0, 500),
        },
      });
    } catch (err) {
      console.error('Failed to log certificate verification scan:', err);
    }
  }

  const isValid = certificate?.status === 'VALID';
  const isRevoked = certificate?.status === 'REVOKED';
  const isExpired =
    certificate?.status === 'EXPIRED' ||
    (certificate?.expiryDate && new Date(certificate.expiryDate) < new Date());

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

        {/* Manual code re-check */}
        <form action="/verify" method="get" className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              name="code"
              defaultValue={code}
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
        </form>

        {lookupError ? (
          <div className="bg-white p-10 rounded-3xl border border-amber-300 text-center space-y-4 shadow-lg">
            <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
            <h3 className="text-xl font-bold text-udemy-black">Verification Temporarily Unavailable</h3>
            <p className="text-xs text-slate-600">Please try again shortly.</p>
          </div>
        ) : certificate && isValid && !isExpired ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-emerald-500/30 space-y-8 relative overflow-hidden shadow-2xl">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide">VERIFIED & VALID SADI CREDENTIAL</p>
                  <p className="text-xs text-emerald-600/80">This certificate is authentic and registered with SADI CIPC 2011/070892/23.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold shrink-0 border border-emerald-200">
                STATUS: {certificate.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              <div className="space-y-1 p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Certificate Holder</p>
                <p className="text-base font-bold text-udemy-black">{certificate.learnerName}</p>
                <p className="text-slate-600">{certificate.user?.email}</p>
              </div>

              <div className="space-y-1 p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Certificate Number</p>
                <p className="text-base font-bold text-udemy-purple font-mono">{certificate.certificateNumber}</p>
                <p className="text-slate-600">Verification Code: {certificate.verificationCode}</p>
              </div>

              <div className="md:col-span-2 space-y-1 p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Awarded Programme Title</p>
                <p className="text-base font-bold text-udemy-black">{certificate.courseTitle}</p>
                <p className="text-slate-600 font-mono">Course Code: {certificate.course?.code}</p>
              </div>

              <div className="space-y-1 p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Date of Issuance</p>
                <p className="text-sm font-bold text-slate-800">
                  {new Date(certificate.issueDate).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="space-y-1 p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">CPD Points Accredited</p>
                <p className="text-sm font-bold text-emerald-600 flex items-center">
                  <Award className="w-4 h-4 mr-1 text-emerald-600" />
                  {certificate.cpdPoints} CPD Points
                </p>
              </div>

            </div>

            <div className="p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder space-y-2">
              <div className="flex items-center space-x-2 text-slate-600 text-[11px] font-semibold">
                <Lock className="w-3.5 h-3.5 text-udemy-purple" />
                <span>Digital SHA-256 Cryptographic Signature</span>
              </div>
              <p className="font-mono text-[10px] text-slate-600 break-all bg-white p-2 rounded-lg border border-udemy-grayBorder">
                {certificate.digitalSignature}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-udemy-grayBorder">
              <div className="text-[11px] text-slate-600 flex items-center space-x-2">
                <Building className="w-4 h-4 text-udemy-purple" />
                <span>Issued by SADI Academic Governance Council, Brooklyn Office Park, Pretoria</span>
              </div>

              <Link
                href="/courses"
                className="gold-button px-5 py-2.5 rounded-xl font-bold text-xs text-white"
              >
                Browse SADI Courses
              </Link>
            </div>

          </div>
        ) : certificate && (isRevoked || isExpired || !isValid) ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-rose-300 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700">
              <div className="flex items-center space-x-3">
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide">
                    {isRevoked ? 'CERTIFICATE REVOKED' : isExpired ? 'CERTIFICATE EXPIRED' : 'CERTIFICATE NOT VALID'}
                  </p>
                  <p className="text-xs text-rose-600/80">
                    {isRevoked && certificate.revocationReason
                      ? certificate.revocationReason
                      : 'This credential was found in the register but is not currently valid for official use.'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-mono text-xs font-bold shrink-0 border border-rose-200">
                STATUS: {isExpired && certificate.status === 'VALID' ? 'EXPIRED' : certificate.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Certificate Holder</p>
                <p className="text-base font-bold text-udemy-black">{certificate.learnerName}</p>
              </div>
              <div className="p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Certificate Number</p>
                <p className="text-base font-bold text-udemy-purple font-mono">{certificate.certificateNumber}</p>
              </div>
              <div className="md:col-span-2 p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Programme</p>
                <p className="text-base font-bold text-udemy-black">{certificate.courseTitle}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-10 rounded-3xl border border-rose-500/30 text-center space-y-4 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-udemy-black">Certificate Verification Failed</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {code ? (
                <>
                  No active certificate matching code{' '}
                  <span className="font-mono text-rose-600 font-bold">{code}</span> was found in the
                  Southern Africa Development Institute register.
                </>
              ) : (
                <>Enter a verification code above to check a SADI credential.</>
              )}
            </p>
            <div className="pt-2">
              <Link href="/" className="px-6 py-2.5 rounded-xl bg-udemy-gray border border-udemy-grayBorder text-udemy-black font-semibold text-xs hover:bg-slate-200 transition-colors">
                Return to Homepage
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
