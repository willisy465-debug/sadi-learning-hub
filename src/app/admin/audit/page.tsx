import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Activity, Shield, ArrowLeft, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAuditPage() {
  let auditLogs: any[] = [];
  try {
    auditLogs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch (dbErr) {
    console.error('Error fetching audit logs:', dbErr);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center space-x-4">
        <Link href="/admin/dashboard" className="p-2.5 rounded border border-udemy-grayBorder bg-white text-slate-500 hover:text-udemy-black hover:border-udemy-purple/30 shadow-sm transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-udemy-black">Immutable Security Audit Ledger</h1>
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] border border-emerald-200">
              TAMPER-PROOF LOGS
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Governance & compliance audit trail for user authentication, payment webhooks, and exam completions.</p>
        </div>
      </div>

      <div className="p-8 rounded-xl border border-udemy-grayBorder bg-white space-y-6 shadow-sm">
        <div className="overflow-x-auto rounded-lg border border-udemy-grayBorder">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-udemy-grayBorder">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor Email</th>
                <th className="p-3">Action Event</th>
                <th className="p-3">Entity Type</th>
                <th className="p-3">Details / Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-udemy-grayBorder">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors font-mono">
                  <td className="p-3 text-slate-500 text-[10px]">{log.id.substring(0, 8)}...</td>
                  <td className="p-3 text-slate-500 text-[11px]">{new Date(log.createdAt).toISOString()}</td>
                  <td className="p-3 text-udemy-black font-semibold font-sans">{log.actorEmail}</td>
                  <td className="p-3 font-bold text-udemy-purple">{log.action}</td>
                  <td className="p-3 text-slate-500">{log.entityType}</td>
                  <td className="p-3 text-slate-700 font-sans max-w-sm truncate">{log.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
