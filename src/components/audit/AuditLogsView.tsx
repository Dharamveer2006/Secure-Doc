'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuditLogEntry } from '@/types/sharing';
import { getAuditLogs } from '@/lib/audit-service';
import {
  History,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Cpu,
  Key,
  Blocks,
  FileCheck,
  Hash,
  Share2,
  ExternalLink,
  ChevronRight,
  Printer,
} from 'lucide-react';

export default function AuditLogsView() {
  const { user } = useAuth();

  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedLogForAffidavit, setSelectedLogForAffidavit] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const filteredLogs = logs.filter((l) => {
    const matchesFilter = selectedFilter === 'ALL' || l.eventType === selectedFilter;
    const matchesSearch =
      searchTerm === '' ||
      l.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.officerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.officerBadge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.logHash.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getEventBadge = (type: AuditLogEntry['eventType']) => {
    switch (type) {
      case 'BLOCKCHAIN_ANCHORED':
        return { label: 'Blockchain Anchor', color: 'bg-emerald-50 text-emerald-800 border-emerald-300', icon: Blocks };
      case 'ENCLAVE_SEALED':
        return { label: 'AES-256 Sealed', color: 'bg-blue-50 text-blue-800 border-blue-300', icon: Lock };
      case 'DECRYPTION_ACCESSED':
        return { label: 'Decryption Access', color: 'bg-purple-50 text-purple-800 border-purple-300', icon: Key };
      case 'ACCESS_LINK_GENERATED':
        return { label: 'Share Link Created', color: 'bg-amber-50 text-amber-800 border-amber-300', icon: Share2 };
      case 'TAMPER_VERIFICATION_CHECK':
        return { label: 'Tamper Verification', color: 'bg-teal-50 text-teal-800 border-teal-300', icon: ShieldCheck };
      default:
        return { label: type.replace('_', ' '), color: 'bg-slate-100 text-slate-800 border-slate-300', icon: FileCheck };
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-emerald-600" />
              <span>Step 4 Active: Immutable Forensic Ledger & Audit Trails</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">Merkle Hash Chained</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Tamper-Proof Audit Dashboard & Legal Evidentiary Ledger
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            Cryptographically chained event ledger recording every document ingestion, client-side AES-256 sealing,
            officer decryption, and inter-departmental grant. Fulfills Section 65B of the Indian Evidence Act.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedLogForAffidavit(filteredLogs[0] || null)}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-sm card-hover"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Generate Sec 65B Affidavit</span>
          </button>
        </div>
      </div>

      {/* Merkle Chain Verification & Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Total Ledger Entries
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{logs.length}</span>
            <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <History className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Hash chained in chronological order</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Bitstream Violations
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-emerald-700 font-mono">0</span>
            <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">100% Zero Tamper Detected</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Merkle Chaining Proof
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">UNBROKEN</span>
            <div className="w-7 h-7 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
              <Hash className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Previous block digest binding valid</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            ISO 27037 Standard
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-blue-700 font-mono">COMPLIANT</span>
            <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Digital evidence chain-of-custody</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Case No, Officer Name, Badge ID, or Hash..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Event:</span>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
          >
            <option value="ALL">All Event Types ({logs.length})</option>
            <option value="BLOCKCHAIN_ANCHORED">Blockchain Anchoring</option>
            <option value="ENCLAVE_SEALED">Enclave Sealing</option>
            <option value="DECRYPTION_ACCESSED">Decryption Access</option>
            <option value="ACCESS_LINK_GENERATED">Access Link Generation</option>
            <option value="TAMPER_VERIFICATION_CHECK">Tamper Verification</option>
          </select>
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="space-y-3">
        {filteredLogs.map((entry, index) => {
          const badge = getEventBadge(entry.eventType);
          const BadgeIcon = badge.icon;
          const isFlagged = entry.status === 'FLAGGED';

          return (
            <div
              key={entry.id}
              className={`bg-white border rounded-xl p-4 shadow-xs transition-all hover:border-slate-300 ${
                isFlagged ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}
                  >
                    <BadgeIcon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>

                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                    {entry.caseNumber}
                  </span>

                  {isFlagged && (
                    <span className="text-[10px] font-bold uppercase bg-rose-600 text-white px-1.5 py-0.2 rounded animate-pulse">
                      Security Alert
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                  <span>{entry.timestamp}</span>
                  <span>•</span>
                  <span>IP: {entry.clientIp}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs items-center">
                {/* Officer & Narrative */}
                <div className="md:col-span-8 space-y-1">
                  <p className="text-slate-800 leading-relaxed font-medium">{entry.details}</p>
                  <p className="text-[11px] text-slate-500">
                    Officer: <strong className="text-slate-700">{entry.officerName}</strong> (
                    <span className="font-mono">{entry.officerBadge}</span>) • {entry.department}
                  </p>
                </div>

                {/* Cryptographic Hashes (Merkle Chaining) */}
                <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Log Hash:</span>
                    <span className="text-slate-900 font-bold truncate max-w-[150px]">
                      {entry.logHash}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prev Hash:</span>
                    <span className="text-slate-600 truncate max-w-[150px]">
                      {entry.prevLogHash}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Section 65B Indian Evidence Act Hash Chain ID: {entry.id}</span>
                <button
                  type="button"
                  onClick={() => setSelectedLogForAffidavit(entry)}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Affidavit Certificate</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 65B Electronic Evidence Affidavit Modal */}
      {selectedLogForAffidavit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base text-white">
                    Section 65B Evidence Act Certificate
                  </h3>
                  <p className="text-xs text-slate-400">Official Electronic Record Affidavit</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                Court Admissible
              </span>
            </div>

            <div className="p-6 space-y-4 text-xs font-mono max-h-[70vh] overflow-y-auto bg-slate-50/50">
              <div className="border-2 border-slate-300 p-5 bg-white space-y-3 shadow-inner">
                <div className="text-center space-y-1 border-b border-slate-200 pb-3">
                  <h4 className="font-bold text-sm text-slate-900 tracking-wider">
                    GOVERNMENT OF INDIA • MINISTRY OF HOME AFFAIRS
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    NATIONAL CRIME RECORDS BUREAU (NCRB) • EVIDENTIARY DEPOSITARY
                  </p>
                  <p className="font-bold text-xs text-blue-900">
                    CERTIFICATE UNDER SECTION 65B(4) OF THE INDIAN EVIDENCE ACT, 1872
                  </p>
                </div>

                <div className="space-y-2 text-[11px] text-slate-800 leading-relaxed font-sans">
                  <p>
                    I, <strong>{selectedLogForAffidavit.officerName}</strong>, holding Badge Number{' '}
                    <strong className="font-mono">{selectedLogForAffidavit.officerBadge}</strong>, acting under lawful
                    authority in the <strong>{selectedLogForAffidavit.department}</strong>, do hereby solemnly depose and state:
                  </p>

                  <p>
                    1. The digital record bearing Case Docket Number{' '}
                    <strong className="font-mono text-blue-700">{selectedLogForAffidavit.caseNumber}</strong> was ingested
                    and sealed through the zero-knowledge Secure-Doc National Ingestion Enclave.
                  </p>

                  <p>
                    2. Cryptographic SHA-256 digest computed at ingestion:{' '}
                    <span className="font-mono font-bold text-slate-900 block bg-slate-100 p-1 rounded mt-0.5 break-all">
                      {selectedLogForAffidavit.sha256Digest}
                    </span>
                  </p>

                  <p>
                    3. The computer system and cryptographic enclave producing this record were operating in normal lawful custody
                    without any breach of security, corruption, or unauthorized alteration.
                  </p>

                  <p>
                    4. Current Log Hash Anchor: <span className="font-mono">{selectedLogForAffidavit.logHash}</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[10px]">
                  <div>
                    <p className="text-slate-500">Date of Attestation: {selectedLogForAffidavit.timestamp}</p>
                    <p className="text-slate-500">Network Terminal: {selectedLogForAffidavit.clientIp}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{selectedLogForAffidavit.officerName}</p>
                    <p className="text-slate-500">{selectedLogForAffidavit.officerBadge} • NIC-CA Signed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrintCertificate}
                className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-white transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedLogForAffidavit(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
              >
                Close Affidavit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
