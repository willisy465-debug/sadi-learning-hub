import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Award, Shield, CheckCircle, ExternalLink, Calendar, Download, Printer } from 'lucide-react';

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const certificates = await prisma.certificate.findMany({
    where: { userId: user.userId },
    include: { course: true },
    orderBy: { issueDate: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs text-amber-400 font-semibold">
            <Award className="w-4 h-4" />
            <span>SADI Certified Academic Credentials</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            My Verifiable <span className="gold-gradient-text">Certificates & Badges</span>
          </h1>
          <p className="text-xs text-slate-400">
            Registered for {user.firstName} {user.lastName} ({user.email})
          </p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Credentials Issued Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Complete your course modules and pass the final examination to receive your SADI Pan-African Certificate of Achievement.
          </p>
          <Link href="/learner/dashboard" className="gold-button px-6 py-2.5 rounded-xl text-xs font-bold inline-block">
            Go to Classroom
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificates.map((cert) => (
            <div key={cert.id} className="glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-6 flex flex-col justify-between hover:border-amber-500/60 transition-colors shadow-xl">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-amber-400" />
                    <span className="font-mono text-xs font-bold text-amber-400">{cert.certificateNumber}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                    STATUS: {cert.status}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-semibold">Program Awarded</p>
                  <h3 className="text-lg font-bold text-white leading-snug">{cert.courseTitle}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-500 text-[10px]">Issued Date</p>
                    <p className="font-bold text-slate-200">{new Date(cert.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-500 text-[10px]">CPD Credits</p>
                    <p className="font-bold text-emerald-400">{cert.cpdPoints} CPD Points</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <Link
                  href={`/verify/${cert.verificationCode}`}
                  target="_blank"
                  className="flex-1 gold-button py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                  <span>Public QR Verification Link</span>
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
