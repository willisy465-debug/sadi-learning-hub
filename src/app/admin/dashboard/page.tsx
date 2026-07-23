import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Shield, BookOpen, Users, Building2, DollarSign, FileText, Activity, Award, PlusCircle, ArrowRight } from 'lucide-react';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const coursesCount = await prisma.course.count();
  const enrolmentsCount = await prisma.enrolment.count();
  const delegatesCount = await prisma.user.count();
  const certificatesCount = await prisma.certificate.count();
  const corporateLeadsCount = await prisma.corporateRequest.count();

  const invoices = await prisma.invoice.findMany();
  const totalRevenueZar = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);

  const recentAuditLogs = await prisma.auditLog.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Admin Executive Header */}
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>SADI Executive Governance & LMS Operations</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Directorate Command Hub
          </h1>
          <p className="text-xs text-slate-400">
            Logged in as {user.firstName} {user.lastName} • Access Level: <span className="font-mono text-amber-400 font-bold">{user.roles[0]}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/courses"
            className="gold-button px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-amber-500/20"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Manage Course Catalogue</span>
          </Link>
        </div>
      </div>

      {/* Institutional Core Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-[10px] uppercase text-slate-500 font-semibold">Active Courses</p>
          <p className="text-2xl font-black text-amber-400">{coursesCount}</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-[10px] uppercase text-slate-500 font-semibold">Total Enrolments</p>
          <p className="text-2xl font-black text-white">{enrolmentsCount}</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-[10px] uppercase text-slate-500 font-semibold">Registered Delegates</p>
          <p className="text-2xl font-black text-white">{delegatesCount}</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-[10px] uppercase text-slate-500 font-semibold">Issued Certificates</p>
          <p className="text-2xl font-black text-emerald-400">{certificatesCount}</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1 col-span-2 md:col-span-1">
          <p className="text-[10px] uppercase text-slate-500 font-semibold">Total Revenue (ZAR)</p>
          <p className="text-2xl font-black text-amber-400">ZAR {totalRevenueZar.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-mono text-slate-500">{coursesCount} Courses</span>
          </div>
          <h3 className="text-lg font-bold text-white">Course & Curriculum Manager</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create new training courses, schedule Pretoria/Johannesburg cohorts, manage modules and upload lecture videos.
          </p>
          <Link href="/admin/courses" className="text-xs font-bold text-amber-400 hover:underline flex items-center pt-2">
            <span>Manage Programmes</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <Building2 className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-mono text-amber-400 font-bold">{corporateLeadsCount} Custom Leads</span>
          </div>
          <h3 className="text-lg font-bold text-white">Corporate In-House Requests</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Review custom training quotes submitted by African government ministries, public utilities, and corporate clients.
          </p>
          <Link href="/request-custom" className="text-xs font-bold text-amber-400 hover:underline flex items-center pt-2">
            <span>View In-House Leads</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <Activity className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-mono text-slate-500">Immutable Ledger</span>
          </div>
          <h3 className="text-lg font-bold text-white">System Security & Audit Logs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Inspect real-time security events, delegate logins, payment webhooks, exam completions, and certificate issuances.
          </p>
          <Link href="/admin/audit" className="text-xs font-bold text-amber-400 hover:underline flex items-center pt-2">
            <span>Inspect Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

      </div>

      {/* Recent Audit Logs Feed */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Activity className="w-5 h-5 text-amber-400 mr-2" />
            <span>Recent System Operations & Audit Trail</span>
          </h2>
          <Link href="/admin/audit" className="text-xs text-amber-400 hover:underline font-semibold">
            View All Security Events
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-mono text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-3 font-semibold text-white">{log.actorEmail}</td>
                  <td className="p-3 font-mono font-bold text-amber-400">{log.action}</td>
                  <td className="p-3 text-slate-400">{log.entityType}</td>
                  <td className="p-3 text-slate-300 max-w-xs truncate">{log.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
