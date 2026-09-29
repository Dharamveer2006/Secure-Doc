'use client';

import React, { useState } from 'react';
import {
  Info,
  ShieldCheck,
  Building2,
  Cpu,
  Lock,
  Layers,
  FileCheck2,
  Scale,
  Maximize2,
  X,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { PublicPageTab } from './PublicNavbar';

interface AboutPageProps {
  onSelectTab: (tab: PublicPageTab) => void;
  onOpenLogin: () => void;
}

export default function AboutPage({ onSelectTab, onOpenLogin }: AboutPageProps) {
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);

  return (
    <div className="space-y-16 py-8 px-4 sm:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <section className="space-y-3 max-w-3xl">
        <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          Institutional Mandate • SIH 2026
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Secure-Doc: Architecture &amp; Mission
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Developed for the Smart India Hackathon 2026 under the Ministry of Home Affairs and National Crime Records
          Bureau (NCRB), Secure-Doc establishes India&rsquo;s first zero-knowledge, mathematically tamper-evident digital
          evidence management system.
        </p>
      </section>

      {/* SIH Problem Statement Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs card-hover space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Smart India Hackathon 2026 Problem Statement
            </h2>
          </div>
          <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded border border-blue-200 font-semibold">
            Theme: Cybersecurity &amp; Blockchain
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Traditional evidentiary repositories rely on centralized server trust and fragmented physical channels. When
          files travel between police stations, forensic laboratories, prosecutors, and magistrates, they risk
          unauthorized interception, intentional bit modifications, and fatal chain-of-custody evidentiary challenges
          under <strong>Section 65B of the Indian Evidence Act, 1872</strong> and{' '}
          <strong>Section 63 of Bharatiya Sakshya Adhiniyam, 2023</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-900 block">Nodal Ministry</span>
            <span className="text-slate-600">Ministry of Home Affairs (MHA)</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-900 block">Nodal Department</span>
            <span className="text-slate-600">National Crime Records Bureau (NCRB)</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-900 block">Statutory Compliance</span>
            <span className="text-slate-600">IEA Sec 65B &amp; BSA 2023 Sec 63</span>
          </div>
        </div>
      </section>

      {/* 4-Phase Architecture Blueprint Interactive Inspection */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs card-hover space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              End-to-End Cryptographic Architecture Blueprint
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Client-side Ingestion, Pre-Encryption Hashing (SHA-256), AES-256 Enclave, and Permissioned Merkle Ledger.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDiagramModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 self-start"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Inspect Blueprint Fullscreen</span>
          </button>
        </div>

        <div
          onClick={() => setIsDiagramModalOpen(true)}
          className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-4 cursor-pointer hover:border-blue-400 transition card-hover"
        >
          <img
            src="/images/workflow_architecture.svg"
            alt="Secure-Doc System Architecture"
            className="w-full h-auto object-contain max-h-96 mx-auto"
          />
        </div>
      </section>

      {/* Institutional Stakeholders Matrix */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Institutional Operational Matrix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 card-hover">
            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              LEVEL 3 CLEARANCE
            </span>
            <p className="font-bold text-slate-900 text-sm">Police &amp; Law Enforcement</p>
            <p className="text-slate-600 leading-relaxed">
              First Information Report (FIR) registration, seizure panchnamas, case diaries, and immediate intake hashing.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 card-hover">
            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              LEVEL 4 CLEARANCE
            </span>
            <p className="font-bold text-slate-900 text-sm">Forensic Science Labs (CFSL)</p>
            <p className="text-slate-600 leading-relaxed">
              Ballistic reports, GSR micro-spectroscopy, DNA profiles, signed with Class 3 PKI e-Sign certificates u/s 45.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 card-hover">
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              LEVEL 3 CLEARANCE
            </span>
            <p className="font-bold text-slate-900 text-sm">Directorate of Prosecution</p>
            <p className="text-slate-600 leading-relaxed">
              Charge sheet audits, witness statement review, cross-agency evidence discovery, and time-expiring ACL links.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 card-hover">
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              LEVEL 5 CLEARANCE
            </span>
            <p className="font-bold text-slate-900 text-sm">Judiciary &amp; High Court</p>
            <p className="text-slate-600 leading-relaxed">
              Bench trial scrutiny, bail determination minutes, sealed judicial vaults, and Section 65B court certifications.
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {isDiagramModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 shadow-2xl">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <span className="font-bold text-xs">Secure-Doc Cryptographic Architecture Blueprint</span>
              <button
                type="button"
                onClick={() => setIsDiagramModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[75vh] flex items-center justify-center bg-slate-50">
              <img
                src="/images/workflow_architecture.svg"
                alt="System Architecture"
                className="max-w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
