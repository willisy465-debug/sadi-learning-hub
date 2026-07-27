import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Shield, BookOpen, Users, Building2, DollarSign, FileText, Activity, Award, PlusCircle, ArrowRight } from 'lucide-react';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let coursesCount = 0;
  let enrolmentsCount = 0;
  let delegatesCount = 0;
  let certificatesCount = 0;
  let corporateLeadsCount = 0;
  let invoices: any[] = [];
  let totalRevenueZar = 0;
  let recentAuditLogs: any[] = [];

  try {
    coursesCount = await prisma.course.count();
    enrolmentsCount = await prisma.enrolment.count();
    delegatesCount = await prisma.user.count();
    certificatesCount = await prisma.certificate.count();
    corporateLeadsCount = await prisma.corporateRequest.count();

    invoices = await prisma.invoice.findMany();
    totalRevenueZar = invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);

    recentAuditLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
  } catch (dbErr) {
    console.error('Error fetching admin dashboard data:', dbErr);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Admin Executive Header */}
      <div className="p-8 rounded-xl border border-udemy-grayBorder bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs text-udemy-purple font-bold uppercase tracking-wider bg-udemy-purple/10 px-3 py-1 rounded-full border border-udemy-purple/20">
            <Shield className="w-4 h-4" />
            <span>SADI Executive Governance & LMS Operations</span>
          </div>
          <h1 className="text-3xl font-black text-udemy-black tracking-tight">
            Directorate Command Hub
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Logged in as <span className="font-semibold text-udemy-black">{user.firstName} {user.lastName}</span> • Access Level: <span className="font-mono text-udemy-purple font-bold">{user.roles[0]}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/courses"
            className="udemy-button-primary px-5 py-2.5 rounded text-xs flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage Course Catalogue</span>
          </Link>
        </div>
      </div>

      {/* Institutional Core Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="bg-white p-5 rounded-xl border border-udemy-grayBorder space-y-1 shadow-sm">
          <p className="text-[10px] uppercase text-slate-500 font-bold">Active Courses</p>
          <p className="text-2xl font-black text-udemy-purple">{coursesCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-udemy-grayBorder space-y-1 shadow-sm">
          <p className="text-[10px] uppercase text-slate-500 font-bold">Total Enrolments</p>
          <p className="text-2xl font-black text-udemy-black">{enrolmentsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-udemy-grayBorder space-y-1 shadow-sm">
          <p className="text-[10px] uppercase text-slate-500 font-bold">Registered Delegates</p>
          <p className="text-2xl font-black text-udemy-black">{delegatesCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-udemy-grayBorder space-y-1 shadow-sm">
          <p className="text-[10px] uppercase text-slate-500 font-bold">Issued Certificates</p>
          <p className="text-2xl font-black text-emerald-600">{certificatesCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-udemy-grayBorder space-y-1 col-span-2 md:col-span-1 shadow-sm">
          <p className="text-[10px] uppercase text-slate-500 font-bold">Total Revenue (ZAR)</p>
          <p className="text-2xl font-black text-udemy-purple">ZAR {totalRevenueZar.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div className="bg-white p-6 rounded-xl border border-udemy-grayBorder space-y-4 hover:border-udemy-purple/40 transition-colors shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between">
            <BookOpen className="w-6 h-6 text-udemy-purple" />
            <span className="text-xs font-mono font-bold text-slate-500">{coursesCount} Courses</span>
          </div>
          <h3 className="text-lg font-bold text-udemy-black">Course Manager</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Create new training courses, schedule cohorts, manage modules and upload lecture videos.
          </p>
          <Link href="/admin/courses" className="text-xs font-bold text-udemy-purple hover:underline flex items-center pt-2">
            <span>Manage Programmes</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-udemy-grayBorder space-y-4 hover:border-udemy-purple/40 transition-colors shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between">
            <FileText className="w-6 h-6 text-udemy-purple" />
          </div>
          <h3 className="text-lg font-bold text-udemy-black">Course Categories</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Manage course categories, AI-generated pictorials, and PDF training brochures.
          </p>
          <Link href="/admin/categories" className="text-xs font-bold text-udemy-purple hover:underline flex items-center pt-2">
            <span>Manage Categories</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-udemy-grayBorder space-y-4 hover:border-udemy-purple/40 transition-colors shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between">
            <Building2 className="w-6 h-6 text-udemy-purple" />
            <span className="text-xs font-mono text-udemy-purple font-bold">{corporateLeadsCount} Custom Leads</span>
          </div>
          <h3 className="text-lg font-bold text-udemy-black">In-House Requests</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Review custom training quotes submitted by government ministries and corporate clients.
          </p>
          <Link href="/admin/leads" className="text-xs font-bold text-udemy-purple hover:underline flex items-center pt-2">
            <span>View In-House Leads</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-udemy-grayBorder space-y-4 hover:border-udemy-purple/40 transition-colors shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between">
            <Activity className="w-6 h-6 text-udemy-purple" />
            <span className="text-xs font-mono font-bold text-slate-500">System Logs</span>
          </div>
          <h3 className="text-lg font-bold text-udemy-black">System Security Audit</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Inspect real-time security events, delegate logins, and exam completions.
          </p>
          <Link href="/admin/audit" className="text-xs font-bold text-udemy-purple hover:underline flex items-center pt-2">
            <span>Inspect Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

      </div>

      {/* Recent Audit Logs Feed */}
      <div className="bg-white p-8 rounded-xl border border-udemy-grayBorder space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-udemy-black flex items-center">
            <Activity className="w-5 h-5 text-udemy-purple mr-2" />
            <span>Recent System Operations & Audit Trail</span>
          </h2>
          <Link href="/admin/audit" className="text-xs text-udemy-purple hover:underline font-semibold">
            View All Security Events
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-udemy-grayBorder">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-udemy-grayBorder">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-udemy-grayBorder">
              {recentAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-3 font-semibold text-udemy-black">{log.actorEmail}</td>
                  <td className="p-3 font-mono font-bold text-udemy-purple">{log.action}</td>
                  <td className="p-3 text-slate-500 font-medium">{log.entityType}</td>
                  <td className="p-3 text-slate-600 max-w-xs truncate">{log.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
