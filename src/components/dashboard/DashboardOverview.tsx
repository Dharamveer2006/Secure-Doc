'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ROLE_CONFIGS } from '@/lib/constants';
import { getStoredEncryptedDocuments } from '@/lib/crypto-service';
import {
  FileText,
  ShieldCheck,
  Lock,
  Share2,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Hash,
  Download,
  Eye,
  FileSpreadsheet,
  Building,
  UploadCloud,
  Layers,
  Sparkles,
  ExternalLink,
  Maximize2,
  X,
  Image as ImageIcon,
  FolderGit2,
} from 'lucide-react';
import { NavTab } from '../layout/AppSidebar';

interface DashboardOverviewProps {
  onNavigateTab: (tab: NavTab) => void;
}

export default function DashboardOverview({ onNavigateTab }: DashboardOverviewProps) {
  const { user } = useAuth();
  if (!user) return null;

  const roleConfig = ROLE_CONFIGS[user.role];
  const [storedDocs, setStoredDocs] = useState<any[]>([]);
  const [activeInfographicTab, setActiveInfographicTab] = useState<'custody' | 'architecture'>('custody');
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);

  useEffect(() => {
    const anchored = getStoredEncryptedDocuments();
    if (anchored && anchored.length > 0) {
      const formatted = anchored.map((doc) => ({
        id: doc.documentId,
        caseNo: doc.metadata.caseNumber,
        title: doc.metadata.documentTitle,
        category: doc.metadata.category.replace('_', ' '),
        dept: doc.metadata.originatingDepartment,
        sha256: doc.originalSha256,
        encryption: `${doc.encryptionAlgorithm} (Enclave)`,
        timestamp: new Date(doc.blockchain.anchoredAt).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }) + ' IST (Just now)',
        status: 'Blockchain Anchored',
        classification: doc.metadata.clearanceLevel,
        isNewlyAnchored: true,
      }));
      setStoredDocs(formatted);
    }
  }, []);

  // Base sample legal and investigation records
  const sampleRecords = [
    {
      id: 'doc-001',
      caseNo: 'FIR-2026-DEL-0482',
      title: 'First Information Report: High-Value Financial Cyber Intrusion',
      category: 'Police FIR',
      dept: 'Delhi Police - Cyber Crime Division',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      encryption: 'AES-256-GCM',
      timestamp: '29 Sep 2026, 19:42 IST',
      status: 'Tamper-Proof',
      classification: 'Confidential (Level 3)',
    },
    {
      id: 'doc-002',
      caseNo: 'CFSL-2026-BALL-114',
      title: 'Forensic Ballistics & GSR Micro-Spectroscopy Report',
      category: 'Forensics',
      dept: 'Central Forensic Science Lab (CFSL)',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      encryption: 'AES-256-GCM',
      timestamp: '29 Sep 2026, 17:15 IST',
      status: 'Tamper-Proof',
      classification: 'Secret (Level 4)',
    },
    {
      id: 'doc-003',
      caseNo: 'HC-CRL-2026-904',
      title: 'Judicial Scrutiny of Electronic Evidence & Bail Hearing Minutes',
      category: 'Court Order',
      dept: 'High Court of Delhi - Bench 03',
      sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      encryption: 'AES-256-GCM',
      timestamp: '29 Sep 2026, 14:30 IST',
      status: 'Tamper-Proof',
      classification: 'Judicial Record (Level 5)',
    },
    {
      id: 'doc-004',
      caseNo: 'CHG-2026-MHA-091',
      title: 'Final Police Report & Charge Sheet u/s 316 BNS & Sec 66 IT Act',
      category: 'Charge Sheet',
      dept: 'Directorate of Prosecution - MHA',
      sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      encryption: 'AES-256-GCM',
      timestamp: '29 Sep 2026, 11:08 IST',
      status: 'Tamper-Proof',
      classification: 'Restricted (Level 3)',
    },
    {
      id: 'doc-005',
      caseNo: 'SEZ-2026-MUM-772',
      title: 'Digital Seizure Panchnama & Hash Inventory of 4 Encrypted NVMe Drives',
      category: 'Seizure Memo',
      dept: 'State CID - Special Investigation Team',
      sha256: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      encryption: 'AES-256-GCM',
      timestamp: '28 Sep 2026, 22:50 IST',
      status: 'Tamper-Proof',
      classification: 'Strictly Confidential',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner: Department Context */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${roleConfig.bgLight} ${roleConfig.color} ${roleConfig.borderColor}`}
            >
              {roleConfig.fullName}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">Clearance: {user.clearanceLevel}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Digital Evidence & Case Ledger
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            Logged into <strong className="text-slate-800">{user.department}</strong>. All file uploads undergo
            client-side AES-256 envelope encryption and SHA-256 tamper-proof ledger anchoring prior to dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => onNavigateTab('cases')}
            className="px-3.5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-2 shadow-xs card-hover"
          >
            <FolderGit2 className="w-4 h-4 text-blue-400" />
            <span>Case Dockets Archive</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('upload')}
            className="px-3.5 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-xs card-hover"
          >
            <UploadCloud className="w-4 h-4 text-blue-200" />
            <span>Secure Ingest</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('sharing')}
            className="px-3.5 py-2.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-200 transition flex items-center gap-1.5 card-hover"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Inter-Agency</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Encrypted Documents
            </span>
            <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">1,428</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% AES-256 GCM Sealed</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              SHA-256 Tamper Checks
            </span>
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">3,892 / 3,892</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero Tamper Detections</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Active Inter-Agency Shares
            </span>
            <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Share2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">24</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Time-locked access links</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Section 65B Certificates
            </span>
            <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">481</p>
          <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-medium mt-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Judicial Court Admissible</span>
          </div>
        </div>
      </div>

      {/* Inter-Departmental Evidentiary Pipeline & Visual Blueprint Flow */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 card-hover">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Inter-Departmental Chain of Custody & Architectural Protocol
              </h3>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                ISO 27037 Standard
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cryptographic lifecycle from police ingestion and CFSL forensic sealing to judicial discovery
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex text-xs">
              <button
                type="button"
                onClick={() => setActiveInfographicTab('custody')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  activeInfographicTab === 'custody'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chain of Custody
              </button>
              <button
                type="button"
                onClick={() => setActiveInfographicTab('architecture')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  activeInfographicTab === 'architecture'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                System Architecture
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsDiagramModalOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition"
              title="Full-Screen Diagram Inspection"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Infographic Preview Banner */}
        <div
          onClick={() => setIsDiagramModalOpen(true)}
          className="relative rounded-xl overflow-hidden border border-slate-200 bg-white cursor-pointer group shadow-xs"
        >
          <div className="h-48 sm:h-56 w-full flex items-center justify-center p-2 bg-slate-50">
            <img
              src={
                activeInfographicTab === 'custody'
                  ? '/images/chain_of_custody.svg'
                  : '/images/workflow_architecture.svg'
              }
              alt="Workflow Diagram Preview"
              className="w-full h-full object-contain group-hover:scale-[1.01] transition-transform duration-300"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent flex items-end justify-between p-4 pointer-events-none">
            <div className="text-white space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                {activeInfographicTab === 'custody' ? 'Evidence Lifecycle Flow' : '4-Tier Enclave Pipeline'}
              </span>
              <p className="text-xs font-bold">
                {activeInfographicTab === 'custody'
                  ? 'Complete Digital Chain-of-Custody (Evidence Act Sec 65B Compliant)'
                  : 'Zero-Knowledge SHA-256 Digesting & AES-256 Envelope Encryption'}
              </p>
            </div>
            <div className="bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-lg group-hover:bg-blue-600 transition-colors">
              <Eye className="w-3.5 h-3.5 text-blue-300" />
              <span>Click to Enlarge Diagram</span>
            </div>
          </div>
        </div>

        {/* 4 Protocol Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
          <div className="border border-amber-200 bg-amber-50/50 p-3 rounded-lg space-y-1">
            <div className="flex items-center justify-between font-bold text-amber-900">
              <span>1. Ingestion & OCR</span>
              <span className="text-[10px] bg-amber-200 text-amber-800 px-1 rounded">Police</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Police officers scan physical FIRs. Tesseract OCR parses case numbers, IPC/BNS sections.
            </p>
          </div>

          <div className="border border-purple-200 bg-purple-50/50 p-3 rounded-lg space-y-1">
            <div className="flex items-center justify-between font-bold text-purple-900">
              <span>2. Forensic Attestation</span>
              <span className="text-[10px] bg-purple-200 text-purple-800 px-1 rounded">CFSL</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Digital evidence & forensic lab test results signed with PKI digital signature certificates.
            </p>
          </div>

          <div className="border border-blue-200 bg-blue-50/50 p-3 rounded-lg space-y-1">
            <div className="flex items-center justify-between font-bold text-blue-900">
              <span>3. Cryptographic Lock</span>
              <span className="text-[10px] bg-blue-200 text-blue-800 px-1 rounded">AES-256</span>
            </div>
            <p className="text-[11px] text-slate-600">
              SHA-256 digest is anchored on the ledger. Document payload encrypted prior to storage dispatch.
            </p>
          </div>

          <div className="border border-emerald-200 bg-emerald-50/50 p-3 rounded-lg space-y-1">
            <div className="flex items-center justify-between font-bold text-emerald-900">
              <span>4. Judicial Presentation</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1 rounded">Courts</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Judges and prosecutors review decrypted records with mathematical tamper-proof proof verification.
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full Diagram Inspection */}
      {isDiagramModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {activeInfographicTab === 'custody'
                      ? 'Digital Chain of Custody Evidentiary Protocol'
                      : 'Secure-Doc Cryptographic Architecture Blueprint'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Smart India Hackathon 2026 Reference Architectural Blueprint
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveInfographicTab('custody')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                      activeInfographicTab === 'custody'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Chain of Custody
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInfographicTab('architecture')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                      activeInfographicTab === 'architecture'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    System Architecture
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDiagramModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Close Inspector"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-slate-900/95 p-4 sm:p-6 flex flex-col items-center justify-center">
              <div className="max-w-4xl w-full rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-white p-2">
                <img
                  src={
                    activeInfographicTab === 'custody'
                      ? '/images/chain_of_custody.svg'
                      : '/images/workflow_architecture.svg'
                  }
                  alt="High Resolution Workflow Graphic"
                  className="w-full h-auto object-contain max-h-[65vh] mx-auto rounded-lg"
                />
              </div>

              <div className="mt-4 max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-300 text-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] space-y-1">
                  <p className="font-semibold text-white">
                    {activeInfographicTab === 'custody'
                      ? 'Digital Chain of Custody Under Section 65B Indian Evidence Act'
                      : 'Client-Side Cryptographic Enclave Pipeline'}
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    {activeInfographicTab === 'custody'
                      ? 'Guarantees that digital evidence (FIRs, CFSL forensic reports, wiretaps, CCTV videos, PCAP/disk dumps) remains tamper-evident and admissible across law enforcement, prosecution, and judicial branches.'
                      : 'Documents are pre-hashed with SHA-256 and sealed with AES-256 envelope encryption in the client browser prior to being dispatched to GovCloud storage and anchored on the blockchain ledger.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-mono text-[11px]">
                Compliant with Section 65B of Indian Evidence Act, 1872 & IT Act 2000
              </span>
              <button
                type="button"
                onClick={() => setIsDiagramModalOpen(false)}
                className="px-3 py-1 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidentiary Records Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Legal & Investigation Documents Docket
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live records protected by SHA-256 hashing and client-side AES-256 envelope encryption
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('cases')}
              className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition shadow-xs"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Browse All 1,428 Dockets</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('audit')}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 hover:underline"
            >
              <span>View Tamper Audit Log</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Case & Document Title</th>
                <th className="py-3 px-4">Originating Department</th>
                <th className="py-3 px-4">SHA-256 Digest</th>
                <th className="py-3 px-4">Encryption</th>
                <th className="py-3 px-4">Date / Time (IST)</th>
                <th className="py-3 px-4 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...storedDocs, ...sampleRecords].map((rec) => (
                <tr
                  key={rec.id}
                  className={`transition-colors ${
                    rec.isNewlyAnchored
                      ? 'bg-emerald-50/60 hover:bg-emerald-50'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                          {rec.caseNo}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">{rec.category}</span>
                        {rec.isNewlyAnchored && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-1.5 py-0.2 rounded animate-pulse">
                            Newly Anchored
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-slate-900 leading-snug">{rec.title}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{rec.dept}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">
                      {rec.sha256.slice(0, 10)}...{rec.sha256.slice(-8)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      {rec.encryption}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {rec.timestamp}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{rec.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-between px-4">
          <span className="font-mono text-[11px]">Displaying 5 of 1,428 active evidentiary documents</span>
          <span className="text-slate-400 text-[11px]">Indian Evidence Act Sec 65B Certified Ledger</span>
        </div>
      </div>
    </div>
  );
}
