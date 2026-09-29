'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ROLE_CONFIGS } from '@/lib/constants';
import { NavTab } from '../layout/AppSidebar';
import {
  FolderGit2,
  Search,
  Filter,
  Eye,
  Share2,
  FileSpreadsheet,
  Building,
  Calendar,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  Copy,
  Check,
  Tag,
  Hash,
  FileText,
} from 'lucide-react';

interface CaseDocketRepositoryViewProps {
  onNavigateTab: (tab: NavTab) => void;
}

export default function CaseDocketRepositoryView({ onNavigateTab }: CaseDocketRepositoryViewProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
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
      status: 'UNDER_INVESTIGATION',
      clearance: 'Level 3 Restricted',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      sections: 'Sec 66 IT Act, Sec 318 BNS',
      evidenceItemsCount: 5,
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
      status: 'FORENSIC_SEALED',
      clearance: 'Level 4 Secret',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      sections: 'Sec 45 Indian Evidence Act',
      evidenceItemsCount: 3,
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
      evidenceItemsCount: 8,
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
      evidenceItemsCount: 12,
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
      status: 'UNDER_INVESTIGATION',
      clearance: 'Level 3 Confidential',
      sha256: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      sections: 'Sec 102 CrPC / Sec 105 BNSS',
      evidenceItemsCount: 4,
    },
    {
      id: 'DOC-2026-CFSL-892',
      caseNo: 'CFSL-2026-CYBER-892',
      title: 'Forensic Extraction & Bitstream Analysis of Wiretap Intercept Audio Recordings',
      category: 'Forensics',
      originDept: 'Central Forensic Science Lab (CFSL)',
      officer: 'Dr. Ananya Sen, Ph.D.',
      badge: 'FSL-CEN-042',
      date: '27 Sep 2026',
      status: 'FORENSIC_SEALED',
      clearance: 'Level 4 Secret',
      sha256: '3a58e6584c2f829f086abf6305a41d99e5251a3a6b5774a3f5a0be5f12e8b919',
      sections: 'Sec 5(2) Telegraph Act',
      evidenceItemsCount: 2,
    },
  ];

  const filteredDockets = dockets.filter((doc) => {
    const matchesSearch =
      doc.caseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.sha256.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      selectedDept === 'ALL' || doc.originDept.toLowerCase().includes(selectedDept.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || doc.status === selectedStatus;

    const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;

    return matchesSearch && matchesDept && matchesStatus && matchesCategory;
  });

  const copyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNDER_INVESTIGATION':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Investigation</span>
          </span>
        );
      case 'FORENSIC_SEALED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
            <Lock className="w-3 h-3 text-purple-600" />
            <span>CFSL Sealed</span>
          </span>
        );
      case 'TRIAL_READY':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            <span>Trial Ready</span>
          </span>
        );
      case 'JUDICIAL_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Judicial Bench</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-mono">
              <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
              <span>National Case Dockets &amp; Evidentiary Archive</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">Sec 65B Certified Vault</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Classified Investigation &amp; Case Dockets Repository
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            Centralized index of all active and historical legal case records across Police Divisions, Central Forensic
            Science Laboratories, Prosecution Directorates, and High Court registries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab('upload')}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-sm card-hover"
          >
            <span>+ Ingest New Case Evidence</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Total Case Dockets
          </span>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">1,428</p>
          <p className="text-[11px] text-slate-500 mt-1">100% Cryptographically Indexed</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            CFSL Forensic Reports
          </span>
          <p className="text-2xl font-extrabold text-purple-700 font-mono">248</p>
          <p className="text-[11px] text-purple-700 mt-1">Signed with Class 3 PKI e-Sign</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Judicial Trial Dockets
          </span>
          <p className="text-2xl font-extrabold text-emerald-700 font-mono">481</p>
          <p className="text-[11px] text-emerald-700 mt-1">Evidence Act Sec 65B Admissible</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Zero-Tamper Rate
          </span>
          <p className="text-2xl font-extrabold text-blue-700 font-mono">100.0%</p>
          <p className="text-[11px] text-blue-700 mt-1">Unbroken Merkle Hash Chains</p>
        </div>
      </div>

      {/* Search & Multi-Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 card-hover">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by FIR / Case Number, Accused, Title, Officer Badge, or SHA-256..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Department Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none"
              >
                <option value="ALL">All Departments</option>
                <option value="Delhi Police">Police / Law Enforcement</option>
                <option value="CFSL">Forensics Lab (CFSL)</option>
                <option value="High Court">High Court / Judiciary</option>
                <option value="Prosecution">Prosecution Directorate</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none"
              >
                <option value="ALL">All Custody Stages</option>
                <option value="UNDER_INVESTIGATION">Investigation</option>
                <option value="FORENSIC_SEALED">CFSL Sealed</option>
                <option value="TRIAL_READY">Trial Ready</option>
                <option value="JUDICIAL_REVIEW">Judicial Bench</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Dockets Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden card-hover">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Case Dockets Catalog ({filteredDockets.length} Records Found)
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            Filtered View • Page 1 of 1
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Case Record &amp; Sections</th>
                <th className="py-3 px-4">Originating Department &amp; Officer</th>
                <th className="py-3 px-4">Custody Stage</th>
                <th className="py-3 px-4">SHA-256 Digest</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDockets.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                          {item.caseNo}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {item.sections}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900 leading-snug">{item.title}</p>
                      <p className="text-[10px] text-slate-500">
                        {item.evidenceItemsCount} Evidentiary Items Anchored • {item.clearance}
                      </p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800">{item.originDept}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {item.officer} <span className="font-mono text-[10px]">({item.badge})</span>
                      </p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {getStatusBadge(item.status)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-mono text-[10px]">
                        {item.sha256.slice(0, 10)}...{item.sha256.slice(-8)}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyHash(item.sha256, item.id)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-500 transition"
                        title="Copy Full SHA-256 Digest"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {item.date}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onNavigateTab('viewer')}
                        className="px-2.5 py-1.5 bg-slate-900 text-white rounded-md text-[11px] font-semibold hover:bg-slate-800 transition flex items-center gap-1"
                        title="Open in Secure Evidentiary Viewer"
                      >
                        <Eye className="w-3 h-3 text-blue-400" />
                        <span>Inspect</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('sharing')}
                        className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded-md text-slate-600 transition"
                        title="Generate Inter-Agency Share Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between px-4">
          <span className="font-mono text-[11px]">National Crime Records Bureau Evidentiary Repository</span>
          <span className="text-slate-400 text-[11px]">ISO 27037 &amp; Evidence Act Sec 65B Compliant</span>
        </div>
      </div>
    </div>
  );
}
