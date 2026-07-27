import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Building2, ArrowLeft, Mail, Phone, MapPin, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  let leads: any[] = [];
  try {
    leads = await prisma.corporateRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (dbErr) {
    console.error('Error fetching corporate leads:', dbErr);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center space-x-4">
        <Link href="/admin/dashboard" className="p-2.5 rounded border border-udemy-grayBorder bg-white text-slate-500 hover:text-udemy-black hover:border-udemy-purple/30 shadow-sm transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-udemy-black">Corporate In-House Leads</h1>
            <span className="px-2.5 py-0.5 rounded bg-udemy-purple/10 text-udemy-purple font-mono text-[10px] border border-udemy-purple/20 font-bold uppercase">
              {leads.length} Active Requests
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Review and manage custom training requests submitted by enterprise clients.</p>
        </div>
      </div>

      <div className="p-8 rounded-xl border border-udemy-grayBorder bg-white space-y-6 shadow-sm">
        <div className="overflow-x-auto rounded-lg border border-udemy-grayBorder">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-udemy-grayBorder">
              <tr>
                <th className="p-3">Date Submitted</th>
                <th className="p-3">Organisation</th>
                <th className="p-3">Contact Person</th>
                <th className="p-3">Requested Course & Details</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-udemy-grayBorder">
              {leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500 text-sm">No corporate leads found.</td>
                </tr>
              )}
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-udemy-black text-sm">{lead.organisationName}</div>
                    <div className="flex items-center text-slate-500 text-[10px] mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {lead.country}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-700">{lead.contactPerson}</div>
                    <div className="flex flex-col space-y-1 mt-1 text-[10px]">
                      <a href={`mailto:${lead.contactEmail}`} className="flex items-center text-udemy-purple hover:underline">
                        <Mail className="w-3 h-3 mr-1" />
                        {lead.contactEmail}
                      </a>
                      <a href={`tel:${lead.contactPhone}`} className="flex items-center text-slate-500 hover:text-slate-700">
                        <Phone className="w-3 h-3 mr-1" />
                        {lead.contactPhone}
                      </a>
                    </div>
                  </td>
                  <td className="p-3 max-w-sm">
                    <div className="font-bold text-udemy-purple truncate" title={lead.preferredCourse}>
                      {lead.preferredCourse}
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-[10px] text-slate-600">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1 text-slate-400" />
                        {lead.participantCount} Delegates
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 uppercase font-mono">
                        {lead.deliveryMode.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {lead.comments && (
                      <div className="mt-2 text-[10px] text-slate-500 italic line-clamp-2" title={lead.comments}>
                        "{lead.comments}"
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      lead.status === 'NEW_LEAD' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                      lead.status === 'CONTACTED' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {lead.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
