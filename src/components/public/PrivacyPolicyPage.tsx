'use client';

import React from 'react';
import {
  FileText,
  ShieldCheck,
  Scale,
  Lock,
  Building,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { PublicPageTab } from './PublicNavbar';

interface PrivacyPolicyPageProps {
  onSelectTab: (tab: PublicPageTab) => void;
  onOpenLogin: () => void;
}

export default function PrivacyPolicyPage({ onSelectTab, onOpenLogin }: PrivacyPolicyPageProps) {
  return (
    <div className="space-y-12 py-8 px-4 sm:px-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <section className="space-y-3">
        <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          Statutory Charter • DPDP Act 2023 &amp; IEA 1872
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy &amp; Evidence Preservation Mandate
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          This document governs the processing, client-side encryption, custody logging, and data governance standards
          enforced by the Secure-Doc Enclave under the Ministry of Home Affairs and National Crime Records Bureau.
        </p>
      </section>

      {/* Statutory Foundations Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2 card-hover">
          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
            Primary Privacy Statute
          </span>
          <h2 className="font-bold text-slate-900 text-sm">
            Digital Personal Data Protection Act, 2023 (DPDP Act)
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Personal data collected during police investigations, FIR registration, and forensic analysis is processed
            under Section 7(e) and statutory exemptions under Section 17 for the prevention, detection, investigation,
            and prosecution of offences.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2 card-hover">
          <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[10px]">
            National Security
          </span>
          <h2 className="font-bold text-slate-900 text-sm">
            Official Secrets Act, 1923 (Sections 3 &amp; 5)
          </h2>
          <p className="text-slate-600 leading-relaxed">
            All classified FIRs, ballistic reports, and judicial dockets within this enclave are protected under Section
            5 of the Official Secrets Act. Unauthorized communication or downloading by non-cleared personnel constitutes
            a cognizable offence.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2 card-hover">
          <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
            Statutory Admissibility
          </span>
          <h2 className="font-bold text-slate-900 text-sm">
            Indian Evidence Act Sec 65B &amp; BSA Sec 63
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Electronic records preserved on this platform maintain mathematically unbroken chain-of-custody logs with
            NIST SHA-256 digests to satisfy judicial conditions of admissibility without requiring physical servers in
            court.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2 card-hover">
          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
            International Standard
          </span>
          <h2 className="font-bold text-slate-900 text-sm">
            ISO/IEC 27037:2012 SOP for Digital Evidence
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Adheres strictly to ISO 27037 principles: zero alteration of digital media during extraction, competent
            officer handling, and immutable cryptographic audit trails across the entire evidentiary lifecycle.
          </p>
        </div>
      </section>

      {/* Cryptographic Zero-Knowledge Declaration */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold">Zero-Knowledge Client Architecture Guarantee</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Secure-Doc platform implements client-side envelope encryption. When an officer ingests a document or
          video, encryption with AES-256-GCM occurs inside the officer&rsquo;s web browser via the W3C WebCrypto API before
          any network transmission. Plaintext evidence files are never stored or seen by intermediary servers.
        </p>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
          <p>• Ephemeral Session Keys are zeroized upon session termination or auto-lock timeout.</p>
          <p>• Audit Ledger blocks are strictly append-only (UPDATE and DELETE statements revoked).</p>
          <p>• Inter-Agency Sharing links automatically expire after 24 or 72 hours.</p>
        </div>
      </section>

      {/* Data Retention & Destruction Schedule */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900">Data Retention &amp; Judicial Sealing Schedule</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-3">Record Category</th>
                <th className="p-3">Clearance Level</th>
                <th className="p-3">Mandatory Retention</th>
                <th className="p-3">Destruction Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-800">First Information Reports (FIR)</td>
                <td className="p-3 font-mono text-amber-700">LEVEL 3</td>
                <td className="p-3">Permanent / Court Order</td>
                <td className="p-3 font-mono text-slate-500">Judicial Archival Vault</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">CFSL Forensic Reports &amp; DNA</td>
                <td className="p-3 font-mono text-purple-700">LEVEL 4</td>
                <td className="p-3">30 Years from Verdict</td>
                <td className="p-3 font-mono text-slate-500">Cryptographic Zeroization</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">High Court Scrutiny Minutes</td>
                <td className="p-3 font-mono text-blue-700">LEVEL 5</td>
                <td className="p-3">Permanent Judicial Record</td>
                <td className="p-3 font-mono text-slate-500">High Court Registry Vault</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
