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
        <Link href="/admin/dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white">Immutable Security Audit Ledger</h1>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
              TAMPER-PROOF LOGS
            </span>
          </div>
          <p className="text-xs text-slate-400">Governance & compliance audit trail for user authentication, payment webhooks, and exam completions.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor Email</th>
                <th className="p-3">Action Event</th>
                <th className="p-3">Entity Type</th>
                <th className="p-3">Details / Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 font-mono">
                  <td className="p-3 text-slate-500 text-[10px]">{log.id.substring(0, 8)}...</td>
                  <td className="p-3 text-slate-400 text-[11px]">{new Date(log.createdAt).toISOString()}</td>
                  <td className="p-3 text-white font-semibold font-sans">{log.actorEmail}</td>
                  <td className="p-3 font-bold text-amber-400">{log.action}</td>
                  <td className="p-3 text-slate-400">{log.entityType}</td>
                  <td className="p-3 text-slate-300 font-sans max-w-sm truncate">{log.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
