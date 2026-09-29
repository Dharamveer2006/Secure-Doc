'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  FolderGit2,
  Cpu,
  Layers,
  FileCheck2,
  Scale,
  Sparkles,
  CheckCircle2,
  HardDrive,
  Fingerprint,
  UploadCloud,
  Eye,
  Share2,
  History,
  Activity,
  Zap,
  Building,
  KeyRound,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { PublicPageTab } from './PublicNavbar';

interface HomePageProps {
  onSelectTab: (tab: PublicPageTab) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export default function HomePage({ onSelectTab, onOpenLogin, onOpenRegister }: HomePageProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const previewDockets = [
    {
      id: 'd1',
      caseNo: 'FIR-2026-DEL-0482',
      title: 'First Information Report: High-Value Financial Cyber Intrusion',
      category: 'Police FIR',
      dept: 'Delhi Police - Cyber Division',
      hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      status: 'Tamper-Proof',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'd2',
      caseNo: 'CFSL-2026-BALL-114',
      title: 'Forensic Ballistics & GSR Micro-Spectroscopy Chemical Report',
      category: 'CFSL Forensics',
      dept: 'Central Forensic Science Lab (CFSL)',
      hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      status: 'Forensic Sealed',
      statusColor: 'text-purple-700 bg-purple-50 border-purple-200',
    },
    {
      id: 'd3',
      caseNo: 'HC-CRL-2026-904',
      title: 'Judicial Scrutiny of Electronic Evidence & Bail Minutes',
      category: 'Court Order',
      dept: 'High Court of Delhi - Bench 03',
      hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      status: 'Sec 65B Certified',
      statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
    },
  ];

  return (
    <div className="space-y-20 py-8 px-4 sm:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* 3D Modern Hero Section */}
      <section className="relative pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Smart India Hackathon 2026 • Ministry of Home Affairs</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Next-Gen{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900">
                3D Cryptographic
              </span>{' '}
              Evidence Management
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              An institutional GovTech enclave engineered for Indian law enforcement, CFSL forensic scientists, public
              prosecutors, and judicial benches. Guarantees mathematical chain-of-custody, zero-knowledge AES-256 client
              encryption, and automated Section 65B Indian Evidence Act court admissibility.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition flex items-center gap-2.5 shadow-lg shadow-slate-900/10 card-hover"
              >
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Launch Officer Enclave</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={onOpenRegister}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-sm font-bold transition flex items-center gap-2 card-hover shadow-xs"
              >
                <span>Register Government Credentials</span>
              </button>
            </div>

            {/* Institutional Security Highlights */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Cipher Engine</p>
                <p className="font-bold text-slate-900 text-sm">AES-256-GCM</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Bitstream Digest</p>
                <p className="font-bold text-slate-900 text-sm">FIPS 180-4</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Statutory Law</p>
                <p className="font-bold text-slate-900 text-sm">IEA 65B &amp; BSA 63</p>
              </div>
            </div>
          </div>

          {/* Hero Right: 3D Isometric Cryptographic Enclave Showcase */}
          <div className="lg:col-span-5 perspective-1000 flex justify-center">
            <div className="relative w-full max-w-md preserve-3d animate-3d-float">
              {/* Central 3D Glass Enclave Container */}
              <div className="glass-panel-3d rounded-3xl p-6 shadow-2xl border border-white/80 space-y-5 relative z-20">
                {/* Enclave Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 p-0.5 flex items-center justify-center">
                      <img src="/images/ncrb_seal.svg" alt="Emblem" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">National Cryptographic Enclave</p>
                      <p className="text-[10px] text-slate-500 font-mono">Node DEL-NCRB-01 • Active</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                {/* Simulated 3D Rotating Layers Representation */}
                <div className="space-y-3">
                  {/* Layer 1: Police Intake */}
                  <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center justify-between text-xs card-hover">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="font-bold text-amber-900">1. Police Seizure Panchnama</span>
                    </div>
                    <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 text-amber-800 font-bold">
                      SHA-256 LOCKED
                    </span>
                  </div>

                  {/* Layer 2: CFSL Sealing */}
                  <div className="p-3 bg-purple-50/90 border border-purple-200 rounded-xl flex items-center justify-between text-xs card-hover">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span className="font-bold text-purple-900">2. CFSL Ballistic Examination</span>
                    </div>
                    <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-purple-200 text-purple-800 font-bold">
                      PKI e-SIGNED
                    </span>
                  </div>

                  {/* Layer 3: Judicial Admissibility */}
                  <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between text-xs card-hover">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-bold text-emerald-900">3. High Court Judicial Bench</span>
                    </div>
                    <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-emerald-800 font-bold">
                      SEC 65B VALID
                    </span>
                  </div>
                </div>

                {/* Real-time Crypto Diagnostics Bar */}
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Ledger Merkle Tree:</span>
                    <span className="text-emerald-400 font-bold">10,480 BLOCKS</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Bitstream Integrity:</span>
                    <span className="text-blue-400 font-bold">100.00% MATCH</span>
                  </div>
                </div>
              </div>

              {/* Decorative 3D Depth Card Background Shadow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/15 to-purple-600/15 rounded-3xl blur-xl z-10 -rotate-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D KPI Metrics Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs card-3d">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Total Case Dockets
          </span>
          <p className="text-3xl font-black text-slate-900 font-mono">1,428</p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Cryptographically Sealed</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs card-3d">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            SHA-256 Verifications
          </span>
          <p className="text-3xl font-black text-blue-700 font-mono">3,892</p>
          <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Zero Bit Alterations</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs card-3d">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Sec 65B Certificates
          </span>
          <p className="text-3xl font-black text-purple-700 font-mono">481</p>
          <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-purple-600" />
            <span>Judicial Court Admissible</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs card-3d">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Unified Institutions
          </span>
          <p className="text-3xl font-black text-emerald-700 font-mono">4 Agencies</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-emerald-600" />
            <span>Police • CFSL • Prosecution • Bench</span>
          </p>
        </div>
      </section>

      {/* 4-Phase Core Architecture Feature Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Zero-Knowledge Enclave Pipeline
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How Secure-Doc Protects Digital Evidence
          </h2>
          <p className="text-xs text-slate-600">
            From the crime scene seizure to the High Court trial bench, every electronic byte is shielded by mathematical
            immutability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs card-3d space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Multi-Modal Ingest &amp; OCR</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ingest any evidence file (PDFs, FIR scans, CCTV video, wiretap audio, or raw forensic memory dumps).
              Client-side Tesseract.js OCR indexes legal provisions.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs card-3d space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Pre-Encryption SHA-256</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              An immutable cryptographic fingerprint (FIPS 180-4 standard) is generated from the raw bitstream before
              any packaging or transmission occurs.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs card-3d space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">AES-256-GCM Enclave</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The payload is sealed using 256-bit symmetric encryption with authenticated Galois/Counter mode in the
              client browser. Zero plaintext reaches cloud storage.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs card-3d space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900">Section 65B Admissibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upon judicial discovery, the judge verifies bitstream parity in the browser and exports a certified
              sworn Section 65B affidavit in one click.
            </p>
          </div>
        </div>
      </section>

      {/* Case Dockets Repository Live Preview */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs card-hover space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Live Evidentiary Case Dockets Preview</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspected in real-time across Police, Forensic Laboratories, and High Court benches.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('dockets')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5"
          >
            <span>Browse All 1,428 Dockets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {previewDockets.map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{doc.caseNo}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">{doc.dept}</span>
                </div>
                <p className="font-bold text-slate-900 text-sm truncate">{doc.title}</p>
                <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-slate-500">
                  <span>SHA-256:</span>
                  <span className="truncate max-w-xs">{doc.hash}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(doc.hash, doc.id)}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {copiedHash === doc.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${doc.statusColor}`}>
                  {doc.status}
                </span>

                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Inspect Docket</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional Stakeholders CTA */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-700/60 px-3 py-1 rounded-full">
            EAL6+ Verified Enclave
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Authenticate into the National Evidence Enclave?
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            All operations require active departmental clearance. Register your Gmail or official government email to
            generate your FIPS 140-2 session keys.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
          <button
            type="button"
            onClick={onOpenLogin}
            className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg card-hover"
          >
            <Lock className="w-4 h-4 text-blue-700" />
            <span>Officer Portal Login</span>
          </button>

          <button
            type="button"
            onClick={onOpenRegister}
            className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 card-hover"
          >
            <span>Register Government Details</span>
          </button>
        </div>
      </section>
    </div>
  );
}
