'use client';

import React, { useState } from 'react';
import {
  FolderGit2,
  Search,
  Lock,
  Copy,
  Check,
  Eye,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { PublicPageTab } from './PublicNavbar';

interface PublicDocketsPageProps {
  onSelectTab: (tab: PublicPageTab) => void;
  onOpenLogin: () => void;
}

export default function PublicDocketsPage({ onSelectTab, onOpenLogin }: PublicDocketsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const dockets = [
    {
      id: 'DOC-2026-DEL-0482',
      caseNo: 'FIR-2026-DEL-0482',
      title: 'First Information Report: High-Value Financial Cyber Intrusion & Ransomware',
      category: 'Police FIR',
      originDept: 'Delhi Police - Cyber Crime Division',
      officer: 'Insp. Vikramaditya Rathore',
      badge: 'POL-DL-4091',
      date: '29 Sep 2026',
      status: 'INVESTIGATION',
      clearance: 'Level 3 Restricted',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      sections: 'Sec 66 IT Act, Sec 318 BNS',
    },
    {
      id: 'DOC-2026-CFSL-114',
      caseNo: 'CFSL-2026-BALL-114',
      title: 'Forensic Ballistics & GSR Micro-Spectroscopy Chemical Examination Report',
      category: 'Forensics',
      originDept: 'Central Forensic Science Lab (CFSL)',
      officer: 'Dr. Ananya Sen, Ph.D.',
      badge: 'FSL-CEN-042',
      date: '29 Sep 2026',
      status: 'CFSL_SEALED',
      clearance: 'Level 4 Secret',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      sections: 'Sec 45 Indian Evidence Act',
    },
    {
      id: 'DOC-2026-HC-904',
      caseNo: 'HC-CRL-2026-904',
      title: 'Judicial Scrutiny of Electronic Evidence & Bail Hearing Determination Minutes',
      category: 'Court Order',
      originDept: 'High Court of Delhi - Bench 03',
      officer: 'Hon. Registrar S. Venkataraman',
      badge: 'JUD-HC-1108',
      date: '29 Sep 2026',
      status: 'JUDICIAL_REVIEW',
      clearance: 'Level 5 Judicial',
      sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      sections: 'Sec 439 CrPC / Sec 482 BNSS',
    },
    {
      id: 'DOC-2026-MHA-091',
      caseNo: 'CHG-2026-MHA-091',
      title: 'Final Police Report & Charge Sheet u/s 316 BNS & Sec 66 IT Act',
      category: 'Charge Sheet',
      originDept: 'Directorate of Prosecution - MHA',
      officer: 'Adv. Meera Chawla',
      badge: 'PP-MHA-882',
      date: '28 Sep 2026',
      status: 'TRIAL_READY',
      clearance: 'Level 3 Restricted',
      sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      sections: 'Sec 173 CrPC / Sec 193 BNSS',
    },
    {
      id: 'DOC-2026-MUM-772',
      caseNo: 'SEZ-2026-MUM-772',
      title: 'Digital Seizure Panchnama & Hash Inventory of 4 Encrypted NVMe Drives',
      category: 'Seizure Memo',
      originDept: 'State CID - Special Investigation Team',
      officer: 'DySP K. Deshmukh',
      badge: 'CID-MH-2021',
      date: '28 Sep 2026',
      status: 'INVESTIGATION',
      clearance: 'Level 3 Confidential',
      sha256: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      sections: 'Sec 102 CrPC / Sec 105 BNSS',
    },
  ];

  const filtered = dockets.filter((d) => {
    const matchSearch =
      d.caseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.sha256.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'ALL' || d.originDept.includes(selectedDept);
    return matchSearch && matchDept;
  });

  const handleCopy = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 py-8 px-4 sm:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Classified Evidentiary Archive
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">1,428 Registered Dockets</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            National Evidentiary Case Dockets Directory
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl">
            Public cryptographic index of verified investigation dockets. Payloads are encrypted with client-side
            AES-256-GCM. Authenticated officers can log in to decrypt the full case files.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenLogin}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs shrink-0 self-start md:self-center"
        >
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span>Login to Decrypt Payloads</span>
        </button>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Case No, FIR, title, or SHA-256 hash..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Delhi Police">Police Divisions</option>
            <option value="CFSL">Forensics (CFSL)</option>
            <option value="High Court">Judicial High Court</option>
            <option value="Prosecution">Prosecution Directorate</option>
          </select>
        </div>
      </section>

      {/* Dockets List */}
      <section className="space-y-3">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition space-y-3 text-xs card-hover"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 text-sm">{doc.caseNo}</span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {doc.category}
                </span>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {doc.clearance}
                </span>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">{doc.date}</span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">{doc.title}</h3>
              <p className="text-slate-500 text-[11px] mt-0.5">
                {doc.originDept} • Custody Officer: <strong>{doc.officer}</strong> ({doc.badge})
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-2 truncate">
                <span className="text-slate-400 font-bold shrink-0">SHA-256:</span>
                <span className="text-slate-700 truncate">{doc.sha256}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(doc.sha256, doc.id)}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 shrink-0 self-start sm:self-center"
              >
                {copiedId === doc.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-mono">
                Statutory: <strong className="text-slate-800">{doc.sections}</strong>
              </span>

              <button
                type="button"
                onClick={onOpenLogin}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <Eye className="w-3 h-3 text-blue-400" />
                <span>Decrypt Evidence</span>
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
