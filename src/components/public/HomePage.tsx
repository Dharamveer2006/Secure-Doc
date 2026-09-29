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
  ExternalLink,
  ChevronRight,
  Database,
  Terminal,
  FileLock2,
  CheckCircle,
} from 'lucide-react';
import { PublicPageTab } from './PublicNavbar';

interface HomePageProps {
  onSelectTab: (tab: PublicPageTab) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export default function HomePage({ onSelectTab, onOpenLogin, onOpenRegister }: HomePageProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);
  const [selectedDocketPreview, setSelectedDocketPreview] = useState<any | null>(null);

  const handleCopy = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const previewDockets = [
    {
      id: 'd1',
      caseNo: 'FIR-0482/2026/SP-CELL',
      title: 'First Information Report: Coordinated Financial Cyber Intrusion & Ransom Vector',
      category: 'Police First Information Report',
      dept: 'Special Cell (Cyber & Financial Crimes), New Delhi',
      hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      status: 'Tamper-Proof Locked',
      statusColor: 'text-emerald-800 bg-emerald-50 border-emerald-300',
      timestamp: '2026-09-28 14:22:18 IST',
      officer: 'ACP Vikramaditya Sen, IPS',
      fileSize: '48.2 MB (Raw Disc Image)',
      statutorySection: 'Sec 66C IT Act • Sec 318 BNS 2023',
    },
    {
      id: 'd2',
      caseNo: 'CFSL-CBI-2026-PHY-0914',
      title: 'Forensic Ballistics, GSR Micro-Spectroscopy & Toolmark Chemical Analysis',
      category: 'CFSL Forensic Laboratory Report',
      dept: 'Central Forensic Science Laboratory (CFSL / CBI), Lodhi Road',
      hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      status: 'Forensic PKI Sealed',
      statusColor: 'text-indigo-800 bg-indigo-50 border-indigo-300',
      timestamp: '2026-09-26 11:05:42 IST',
      officer: 'Dr. Rajeshwari Menon, Director CFSL',
      fileSize: '124.6 MB (Spectral RAW)',
      statutorySection: 'Sec 293 CrPC • Sec 39 BSA 2023',
    },
    {
      id: 'd3',
      caseNo: 'HC-CRL-REV-2026/1188',
      title: 'Judicial Examination of Electronic Bitstream Parity & Bail Discovery Minutes',
      category: 'Judicial Bench Order & Certificate',
      dept: 'High Court of Delhi • Criminal Division (Bench III)',
      hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      status: 'Sec 65B / BSA 63 Certified',
      statusColor: 'text-blue-800 bg-blue-50 border-blue-300',
      timestamp: '2026-09-29 16:45:00 IST',
      officer: 'Hon’ble Registrar General, Delhi HC',
      fileSize: '12.8 MB (Signed Bench Record)',
      statutorySection: 'Sec 65B Indian Evidence Act • Sec 63 BSA',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Multi-Format Ingestion & Tesseract OCR',
      category: 'First Seizure & Intake',
      description:
        'Officers ingest raw seized artifacts (scanned FIRs, CCTV DVR extractions, phone memory dumps, audio intercepts). The client-side OCR pipeline automatically extracts statutory penal provisions and references.',
      standard: 'ISO/IEC 27037:2012 Standard for Digital Evidence Handling',
      badge: 'Client-Side Ingestion',
    },
    {
      step: '02',
      title: 'Pre-Transmission SHA-256 Bitstream Digest',
      category: 'Cryptographic Hashing',
      description:
        'A deterministic cryptographic hash (FIPS 180-4 standard) is computed directly in memory before any network dispatch. Even a single flipped bit invalidates the mathematical signature.',
      standard: 'NIST FIPS PUB 180-4 Secure Hash Standard',
      badge: 'Deterministic Verification',
    },
    {
      step: '03',
      title: 'Browser-Native AES-256-GCM Envelope Cipher',
      category: 'Zero-Knowledge Security',
      description:
        'Payloads are encrypted using 256-bit Galois/Counter Mode cipher keys generated in ephemeral browser memory. Plaintext evidence is never exposed to cloud relays or intermediate networks.',
      standard: 'NIST SP 800-38D Authenticated Encryption',
      badge: 'Zero-Knowledge Confidentiality',
    },
    {
      step: '04',
      title: 'Automated Section 65B & BSA 63 Judicial Affidavits',
      category: 'Court Admissibility',
      description:
        'Upon trial requisition, the magistrate or registrar re-computes live bitstream parity. With one click, the system compiles a statutory, sworn affidavit ready for direct judicial marking in court.',
      standard: 'Section 65B Indian Evidence Act 1872 / Section 63 BSA 2023',
      badge: 'Statutory Evidentiary Mark',
    },
  ];

  return (
    <div className="space-y-24 py-6 px-4 sm:px-8 max-w-7xl mx-auto selection:bg-blue-100 selection:text-blue-900">
      
      {/* 3D Modern Hero Section */}
      <section className="relative pt-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content Column */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Official Sovereign Institutional Tag */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-medium tracking-wide shadow-sm border border-slate-700/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-slate-300 font-semibold">MINISTRY OF HOME AFFAIRS</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-200">SMART INDIA HACKATHON 2026</span>
            </div>

            {/* Authoritative Primary Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.08]">
                Sovereign Digital{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900">
                  Evidentiary Custody
                </span>{' '}
                &amp; Forensic Platform
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl">
                National cryptographic repository engineering mathematical chain-of-custody for Indian law enforcement,
                CFSL forensic examiners, public prosecutors, and judicial trial benches. Eliminates evidence tampering
                through zero-knowledge AES-256 client encryption, immutable SHA-256 hashing, and automated Section 65B /
                BSA Section 63 court certification.
              </p>
            </div>

            {/* Primary Action Button Suite */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-3 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer border border-slate-800"
              >
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Institutional Officer Login</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={onOpenRegister}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 hover:border-slate-400 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-xs hover:-translate-y-0.5 cursor-pointer"
              >
                <Fingerprint className="w-4 h-4 text-indigo-600" />
                <span>Enroll Officer / Register</span>
              </button>
            </div>

            {/* Statutory Compliance Badges */}
            <div className="pt-4 border-t border-slate-200/90 grid grid-cols-3 gap-6 text-xs">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">Cipher Standard</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">AES-256-GCM</p>
                <p className="text-[11px] text-slate-500 font-mono">NIST SP 800-38D</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">Evidentiary Standard</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">FIPS 180-4</p>
                <p className="text-[11px] text-slate-500 font-mono">SHA-256 Digest</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">Legal Admissibility</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">IEA 65B &amp; BSA 63</p>
                <p className="text-[11px] text-slate-500 font-mono">High Court Verified</p>
              </div>
            </div>
          </div>

          {/* Hero Right Column: 3D Perspective Enclave Showcase */}
          <div className="lg:col-span-5 perspective-1000 flex justify-center">
            <div className="relative w-full max-w-md preserve-3d animate-3d-float">
              
              {/* Central Elevated 3D Glass Enclave Panel */}
              <div className="glass-panel-dark-3d rounded-3xl p-6 shadow-2xl border border-slate-700/80 text-white space-y-5 relative z-20 bg-slate-950/95">
                
                {/* Node Identity & Heartbeat Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 p-1 flex items-center justify-center shrink-0">
                      <img src="/images/ncrb_seal.svg" alt="Emblem" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-100 tracking-tight">National Cryptographic Enclave</p>
                      <p className="text-[10px] text-slate-400 font-mono">NCRB Node DEL-01 • FIPS 140-3</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>ONLINE</span>
                  </div>
                </div>

                {/* 3-Tier Sovereign Custody Stack */}
                <div className="space-y-2.5">
                  {/* Tier 1: Law Enforcement Seizure */}
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      <div>
                        <span className="font-semibold text-slate-200 block text-xs">1. Police First Seizure Panchnama</span>
                        <span className="text-[10px] text-slate-400 font-mono">Crime Scene Pre-Encryption Digest</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 text-amber-300 font-bold">
                      SHA-256 LOCKED
                    </span>
                  </div>

                  {/* Tier 2: CFSL Forensic Lab Examination */}
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                      <div>
                        <span className="font-semibold text-slate-200 block text-xs">2. Forensic Lab Examination</span>
                        <span className="text-[10px] text-slate-400 font-mono">CFSL Chemical &amp; Cyber Extractions</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/40 text-indigo-300 font-bold">
                      PKI e-SIGNED
                    </span>
                  </div>

                  {/* Tier 3: Judicial Admissibility & Section 65B */}
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <div>
                        <span className="font-semibold text-slate-200 block text-xs">3. Judicial Trial Discovery Bench</span>
                        <span className="text-[10px] text-slate-400 font-mono">Automated Sworn Court Affidavit</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-300 font-bold">
                      SEC 65B BSA
                    </span>
                  </div>
                </div>

                {/* Real-Time Bitstream Ledger Diagnostics */}
                <div className="p-3.5 bg-black/60 border border-slate-800/90 rounded-xl text-xs font-mono space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Merkle Tree Ledger:</span>
                    <span className="text-emerald-400 font-bold">18,492 BLOCKS (SEALED)</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Bitstream Parity:</span>
                    <span className="text-blue-400 font-bold">100.00% ZERO-ALTERATION</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Statutory Compliance:</span>
                    <span className="text-slate-300">DPDP ACT 2023 • SEC 65B</span>
                  </div>
                </div>
              </div>

              {/* Holographic Ambient Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-3xl blur-2xl z-10 -rotate-2 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Performance & Audit Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs card-3d">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1 font-mono">
            Total Case Dockets
          </span>
          <p className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">1,428</p>
          <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Cryptographically Sealed</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs card-3d">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1 font-mono">
            SHA-256 Verifications
          </span>
          <p className="text-3xl font-extrabold text-blue-700 font-mono tracking-tight">3,892</p>
          <p className="text-xs text-blue-700 mt-1.5 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Bit-Level Identity Validated</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs card-3d">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1 font-mono">
            Sec 65B &amp; BSA 63 Certificates
          </span>
          <p className="text-3xl font-extrabold text-purple-700 font-mono tracking-tight">481</p>
          <p className="text-xs text-purple-700 mt-1.5 flex items-center gap-1.5 font-medium">
            <Scale className="w-3.5 h-3.5 text-purple-600" />
            <span>Judicial Court Admissible</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs card-3d">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1 font-mono">
            Integrated Jurisdictions
          </span>
          <p className="text-3xl font-extrabold text-emerald-700 font-mono tracking-tight">4 Agencies</p>
          <p className="text-xs text-emerald-700 mt-1.5 flex items-center gap-1.5 font-medium">
            <Building className="w-3.5 h-3.5 text-emerald-600" />
            <span>Police • CFSL • Prosecution • Judiciary</span>
          </p>
        </div>
      </section>

      {/* 4-Phase Core Architecture Feature Pipeline */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-widest bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full">
            EVIDENTIARY ARCHITECTURE PIPELINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            How Secure-Doc Protects Digital Evidence
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            From first seizure panchnama to Supreme Court trial arguments, every electronic byte is governed by sovereign
            cryptographic protocols.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {workflowSteps.map((ws, idx) => (
            <div
              key={ws.step}
              onClick={() => setActiveWorkflowStep(idx)}
              className={`bg-white border rounded-2xl p-6 shadow-xs card-3d space-y-4 cursor-pointer transition-all duration-200 ${
                activeWorkflowStep === idx
                  ? 'border-blue-600 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-sm">
                  {ws.step}
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {ws.badge}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 font-mono tracking-wider">
                  {ws.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">{ws.title}</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">{ws.description}</p>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-mono font-medium">{ws.standard}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Case Dockets Repository Preview */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">
                Live Evidentiary Case Dockets Directory
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sample public registry indexed across Delhi Police, Central Forensic Science Labs, and the High Court bench.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('dockets')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 transition flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer self-start sm:self-auto"
          >
            <span>Explore All 1,428 Dockets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dockets Table/List */}
        <div className="space-y-3.5">
          {previewDockets.map((doc) => (
            <div
              key={doc.id}
              className="p-5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1.5 min-w-0 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-slate-950 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                    {doc.caseNo}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-medium">{doc.dept}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 font-mono text-[11px]">{doc.timestamp}</span>
                </div>

                <p className="font-bold text-slate-900 text-sm">{doc.title}</p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                  <span className="text-slate-600 font-mono">
                    <strong className="text-slate-700 font-semibold">Statute:</strong> {doc.statutorySection}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-600 font-mono">
                    <strong className="text-slate-700 font-semibold">Officer:</strong> {doc.officer}
                  </span>
                </div>

                {/* SHA-256 Digest Bar */}
                <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200/80 max-w-xl">
                  <span className="font-bold text-slate-700 uppercase text-[10px]">SHA-256:</span>
                  <span className="truncate max-w-xs sm:max-w-md text-slate-800">{doc.hash}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(doc.hash, doc.id)}
                    className="ml-auto text-blue-600 hover:text-blue-800 transition flex items-center gap-1 font-semibold shrink-0 cursor-pointer"
                  >
                    {copiedHash === doc.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Digest</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex md:flex-col items-center md:items-end gap-2.5 shrink-0 self-start md:self-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border font-mono ${doc.statusColor}`}>
                  {doc.status}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedDocketPreview(doc)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Docket</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Preview for Docket Inspection */}
      {selectedDocketPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-slide-up-fade">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <FileLock2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-950 text-base">{selectedDocketPreview.caseNo}</h3>
                  <p className="text-xs text-slate-500 font-mono">Public Evidentiary Chain Verification</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDocketPreview(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Case Caption &amp; Title</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedDocketPreview.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Seizing Department</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedDocketPreview.dept}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Investigating Officer</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedDocketPreview.officer}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Timestamp of Seizure</p>
                  <p className="font-mono font-semibold text-slate-800 mt-0.5">{selectedDocketPreview.timestamp}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Payload Size</p>
                  <p className="font-mono font-semibold text-slate-800 mt-0.5">{selectedDocketPreview.fileSize}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">FIPS 180-4 Pre-Encryption SHA-256 Digest</p>
                <p className="font-mono text-[11px] p-2.5 bg-slate-900 text-emerald-400 rounded-xl break-all">
                  {selectedDocketPreview.hash}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Decryption requires authorized departmental credentials.
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedDocketPreview(null);
                  onOpenLogin();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login to Decrypt Payload</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign Statutory Call to Action */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden border border-slate-800">
        
        {/* Subtle Sovereign Emblem Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5 pointer-events-none">
          <img src="/images/ncrb_seal.svg" alt="Watermark" className="w-full h-full object-contain filter invert" />
        </div>

        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/70 border border-emerald-500/40 px-3.5 py-1 rounded-full">
            OFFICER CLEARANCE GATEWAY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Authenticate into the Sovereign Digital Evidence Enclave
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Authorized access is restricted to designated personnel under the Indian Penal Code, Bharatiya Nyaya Sanhita,
            and IT Act 2000 Section 43/66. Register official credentials with departmental identification to generate
            ephemeral session keys.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 relative z-10 pt-2">
          <button
            type="button"
            onClick={onOpenLogin}
            className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2.5 shadow-lg cursor-pointer hover:-translate-y-0.5"
          >
            <Lock className="w-4 h-4 text-blue-700" />
            <span>Launch Officer Enclave Login</span>
          </button>

          <button
            type="button"
            onClick={onOpenRegister}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
          >
            <Fingerprint className="w-4 h-4 text-emerald-400" />
            <span>Enroll Government Credentials</span>
          </button>
        </div>
      </section>
    </div>
  );
}
