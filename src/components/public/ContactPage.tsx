'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Building,
  ShieldAlert,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { PublicPageTab } from './PublicNavbar';

interface ContactPageProps {
  onSelectTab: (tab: PublicPageTab) => void;
  onOpenLogin: () => void;
}

export default function ContactPage({ onSelectTab, onOpenLogin }: ContactPageProps) {
  const [ticketSent, setTicketSent] = useState(false);
  const [badgeId, setBadgeId] = useState('');
  const [incidentType, setIncidentType] = useState('KEY_COMPROMISE');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setBadgeId('');
      setDetails('');
    }, 4000);
  };

  const nodalDirectories = [
    {
      agency: 'National Crime Records Bureau (NCRB)',
      division: 'Women Safety Division & Cyber Crime Nodal Desk',
      address: 'NH-8, Mahipalpur, New Delhi - 110037',
      phone: '+91 (11) 2618-6576 / 1930',
      email: 'nodal.womensafety@ncrb.gov.in',
      clearance: 'LEVEL 5 NODAL',
    },
    {
      agency: 'Delhi Police - Special Cyber Division',
      division: 'Cyber Crime Investigation Cell & Digital Forensics Wing',
      address: 'Police Headquarters, Jai Singh Road, New Delhi - 110001',
      phone: '+91 (11) 2346-9500',
      email: 'cybercell.hq@delhipolice.gov.in',
      clearance: 'LEVEL 3 POLICE',
    },
    {
      agency: 'Central Forensic Science Laboratory (CFSL)',
      division: 'Directorate of Forensic Science Services (DFSS / CBI)',
      address: 'Block 4, CGO Complex, Lodhi Road, New Delhi - 110003',
      phone: '+91 (11) 2436-1396',
      email: 'director.cfsl@cbi.gov.in',
      clearance: 'LEVEL 4 CFSL',
    },
    {
      agency: 'High Court of Delhi Registry',
      division: 'Criminal E-Filing & Judicial Electronic Evidence Scrutiny Branch',
      address: 'Sher Shah Road, New Delhi - 110503',
      phone: '+91 (11) 2338-7240',
      email: 'criminalregistry@delhihighcourt.nic.in',
      clearance: 'LEVEL 5 JUDICIAL',
    },
  ];

  return (
    <div className="space-y-14 py-8 px-4 sm:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <section className="space-y-3 max-w-3xl">
        <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          Institutional Directory • 24/7 Response
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Nodal Officers &amp; Emergency Incident Cell
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Contact authoritative nodal officers across participating ministries and law enforcement directorates, or
          submit an urgent cryptographic key revocation notice.
        </p>
      </section>

      {/* Grid: Directory & Emergency Incident Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Nodal Officers Directory */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            <span>Participating Institutional Nodal Desks</span>
          </h2>

          <div className="space-y-3">
            {nodalDirectories.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs card-hover space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{item.agency}</h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {item.clearance}
                  </span>
                </div>
                <p className="text-slate-600 font-medium">{item.division}</p>
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-500 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:col-span-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-blue-700">{item.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Emergency Security & Key Invalidation Desk */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs card-hover space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Emergency Cryptographic Incident Desk
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Report suspected key compromise, physical token loss, or unauthorized ACL token leakage.
              </p>
            </div>

            {ticketSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-medium space-y-2 text-center animate-fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Security Incident Dispatched</p>
                <p className="text-slate-600 text-[11px]">
                  Incident Ticket <strong>#SEC-2026-INC-9014</strong> has been escalated to NCRB Nodal Security.
                  Session token quarantined.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Officer Badge / Service Number
                  </label>
                  <input
                    type="text"
                    required
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    placeholder="e.g. POL-DL-4091"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 uppercase focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Incident Category</label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                  >
                    <option value="KEY_COMPROMISE">Hardware e-Token / USB Loss</option>
                    <option value="ACL_LEAK">Unauthorized Sharing Link Leakage</option>
                    <option value="TAMPER_DETECTED">Bitstream Tamper Warning Discrepancy</option>
                    <option value="CREDENTIAL_THEFT">Suspected Credential Theft</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Incident Details &amp; Affected Case Number
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Provide case number (e.g. FIR-2026-DEL-0482) and time of suspected compromise..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Transmit Security Invalidation Alert</span>
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>National Cyber Helpline: 1930</span>
              <span>NCRB VPC 24x7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
