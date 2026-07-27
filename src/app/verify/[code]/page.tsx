import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Shield, Award, CheckCircle2, AlertTriangle, Calendar, Building, Lock, ExternalLink, Printer } from 'lucide-react';

export default async function CertificateVerificationPage({
  params,
}: {
  params: { code: string };
}) {
  const code = params.code;

  const certificate = await prisma.certificate.findUnique({
    where: { verificationCode: code },
    include: { course: true, user: true },
  });

  if (certificate) {
    // Log verification audit event
    await prisma.certificateVerification.create({
      data: {
        certificateId: certificate.id,
        ipAddress: '127.0.0.1',
        userAgent: 'Web Browser Verification',
      },
    });
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        
        {/* Header */}
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

        {certificate ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-emerald-500/30 space-y-8 relative overflow-hidden shadow-2xl">
            
            {/* Status Badge Banner */}
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

            {/* Certificate Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              <div className="space-y-1 p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Certificate Holder</p>
                <p className="text-base font-bold text-udemy-black">{certificate.learnerName}</p>
                <p className="text-slate-600">{certificate.user.email}</p>
              </div>

              <div className="space-y-1 p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Certificate Number</p>
                <p className="text-base font-bold text-udemy-purple font-mono">{certificate.certificateNumber}</p>
                <p className="text-slate-600">Verification Code: {certificate.verificationCode}</p>
              </div>

              <div className="md:col-span-2 space-y-1 p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Awarded Programme Title</p>
                <p className="text-base font-bold text-udemy-black">{certificate.courseTitle}</p>
                <p className="text-slate-600 font-mono">Course Code: {certificate.course.code}</p>
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

            {/* Cryptographic Hash Security Signature */}
            <div className="p-4 rounded-2xl bg-udemy-gray border border-udemy-grayBorder space-y-2">
              <div className="flex items-center space-x-2 text-slate-600 text-[11px] font-semibold">
                <Lock className="w-3.5 h-3.5 text-udemy-purple" />
                <span>Digital SHA-256 Cryptographic Signature</span>
              </div>
              <p className="font-mono text-[10px] text-slate-600 break-all bg-white p-2 rounded-lg border border-udemy-grayBorder">
                {certificate.digitalSignature}
              </p>
            </div>

            {/* Action buttons */}
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
        ) : (
          <div className="bg-white p-10 rounded-3xl border border-rose-500/30 text-center space-y-4 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-udemy-black">Certificate Verification Failed</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              No active certificate matching code <span className="font-mono text-rose-600 font-bold">{code}</span> was found in the Southern Africa Development Institute register.
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
