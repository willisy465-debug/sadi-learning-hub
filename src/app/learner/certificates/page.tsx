import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Award, Shield, CheckCircle, ExternalLink, Calendar, Download, Printer } from 'lucide-react';

export const dynamic = 'force-dynamic';

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
      <div className="p-8 rounded-xl border border-udemy-grayBorder bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs text-udemy-purple font-semibold bg-udemy-purple/10 px-3 py-1 rounded-full border border-udemy-purple/20">
            <Award className="w-4 h-4" />
            <span>SADI Certified Academic Credentials</span>
          </div>
          <h1 className="text-3xl font-black text-udemy-black tracking-tight">
            My Verifiable <span className="text-udemy-purple">Certificates & Badges</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Registered for {user.firstName} {user.lastName} ({user.email})
          </p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-udemy-grayBorder bg-white space-y-4 shadow-sm">
          <Award className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-udemy-black">No Credentials Issued Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            Complete your course modules and pass the final examination to receive your SADI Pan-African Certificate of Achievement.
          </p>
          <Link href="/learner/dashboard" className="udemy-button-primary px-6 py-2.5 rounded text-xs inline-block mt-2">
            Go to Classroom
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white p-8 rounded-xl border border-udemy-grayBorder space-y-6 flex flex-col justify-between hover:border-udemy-purple/40 transition-all shadow-md hover:shadow-lg group">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-udemy-purple" />
                    <span className="font-mono text-xs font-bold text-udemy-purple">{cert.certificateNumber}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
                    STATUS: {cert.status}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">Program Awarded</p>
                  <h3 className="text-lg font-bold text-udemy-black leading-snug group-hover:text-udemy-purple transition-colors">{cert.courseTitle}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3 rounded-lg bg-slate-50 border border-udemy-grayBorder">
                    <p className="text-slate-500 text-[10px] font-semibold">Issued Date</p>
                    <p className="font-bold text-slate-700">{new Date(cert.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-udemy-grayBorder">
                    <p className="text-slate-500 text-[10px] font-semibold">CPD Credits</p>
                    <p className="font-bold text-emerald-600">{cert.cpdPoints} CPD Points</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-udemy-grayBorder flex items-center justify-between gap-3">
                <Link
                  href={`/verify/${cert.verificationCode}`}
                  target="_blank"
                  className="flex-1 udemy-button-primary py-2.5 text-xs flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
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
