'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ShareLinkRecord } from '@/types/sharing';
import {
  getShareLinks,
  createShareLink,
  revokeShareLink,
} from '@/lib/sharing-service';
import { getStoredEncryptedDocuments } from '@/lib/crypto-service';
import { UserRole } from '@/types/auth';
import {
  Share2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Plus,
  AlertCircle,
  Trash2,
  Lock,
  Building,
  UserCheck,
  Key,
  ExternalLink,
  QrCode,
  FileText,
  BadgeAlert,
} from 'lucide-react';

export default function InterDepartmentSharingView() {
  const { user } = useAuth();

  const [shareLinks, setShareLinks] = useState<ShareLinkRecord[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [availableDocs, setAvailableDocs] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [targetDept, setTargetDept] = useState('High Court of Delhi - Criminal Registry');
  const [targetRole, setTargetRole] = useState<UserRole | 'ANY_AUTHORIZED'>('COURT');
  const [clearanceReq, setClearanceReq] = useState('LEVEL_4');
  const [permissions, setPermissions] = useState<ShareLinkRecord['permissions']>('VIEW_ONLY');
  const [ttlHours, setTtlHours] = useState(72);
  const [dlpEnabled, setDlpEnabled] = useState(true);

  const refreshLinks = () => {
    setShareLinks(getShareLinks());
  };

  useEffect(() => {
    refreshLinks();

    // Load available anchored documents
    const anchored = getStoredEncryptedDocuments();
    if (anchored && anchored.length > 0) {
      setAvailableDocs(anchored);
      setSelectedDocId(anchored[0].documentId);
    } else {
      // Fallback sample doc
      const fallback = [
        {
          documentId: 'doc-001',
          metadata: {
            caseNumber: 'FIR-2026-DEL-0482',
            documentTitle: 'First Information Report: High-Value Financial Cyber Intrusion',
            category: 'POLICE_FIR',
          },
        },
        {
          documentId: 'doc-002',
          metadata: {
            caseNumber: 'CFSL-2026-BALL-114',
            documentTitle: 'Forensic Ballistics & GSR Micro-Spectroscopy Report',
            category: 'FORENSIC_REPORT',
          },
        },
      ];
      setAvailableDocs(fallback);
      setSelectedDocId('doc-001');
    }
  }, []);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const chosenDoc =
      availableDocs.find((d) => d.documentId === selectedDocId) || availableDocs[0];

    createShareLink(
      {
        documentId: chosenDoc.documentId,
        caseNumber: chosenDoc.metadata.caseNumber,
        documentTitle: chosenDoc.metadata.documentTitle,
        category: chosenDoc.metadata.category,
        targetDepartment: targetDept,
        targetRole,
        clearanceRequired: clearanceReq,
        permissions,
        ttlHours,
        dlpWatermarkEnabled: dlpEnabled,
      },
      user
    );

    refreshLinks();
    setIsCreateModalOpen(false);
  };

  const handleRevoke = (shareId: string) => {
    if (!user) return;
    revokeShareLink(shareId, user);
    refreshLinks();
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatExpires = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 3600));
    const mins = Math.floor((diff % (1000 * 3600)) / (1000 * 60));
    return `${hours}h ${mins}m remaining`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Step 4 Active: Inter-Departmental Evidence Sharing & ACLs</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">DLP Watermarking Enforced</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inter-Agency Access Control & Time-Bounded Sharing
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            Issue cryptographically signed, time-expiring discovery tokens to external magistrates, prosecutors, or
            forensic scientists. Incorporates dynamic Data Loss Prevention (DLP) watermarks and instant revocation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-sm shrink-0 card-hover"
        >
          <Plus className="w-4 h-4 text-blue-400" />
          <span>Generate New Time-Locked Share</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Active Shared Links
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {shareLinks.filter((l) => !l.isRevoked).length}
            </span>
            <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <Share2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Granular RBAC restrictions active</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            DLP Forensic Watermarking
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-emerald-700 font-mono">100%</span>
            <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Imprints recipient badge & IP trace</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Revoked Tokens
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-slate-700 font-mono">
              {shareLinks.filter((l) => l.isRevoked).length}
            </span>
            <div className="w-7 h-7 rounded bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Immediately invalidated tokens</p>
        </div>
      </div>

      {/* Active Shares Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Inter-Departmental Evidence Grants
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live cryptographic access tokens issued across Police, Courts, CFSL, and Prosecution
            </p>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Audit Synchronized
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Case Record & Document</th>
                <th className="py-3 px-4">Target Agency & Role</th>
                <th className="py-3 px-4">Permissions & DLP</th>
                <th className="py-3 px-4">Expiration (TTL)</th>
                <th className="py-3 px-4">Cryptographic Token URL</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shareLinks.map((link) => {
                const isExpired = new Date(link.expiresAt).getTime() <= Date.now();
                return (
                  <tr key={link.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                          {link.caseNumber}
                        </span>
                        <p className="font-semibold text-slate-900 line-clamp-1">{link.documentTitle}</p>
                        <p className="text-[10px] text-slate-400">Issued by: {link.issuingOfficer}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 font-semibold text-slate-900">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-xs">{link.targetDepartment}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          Role: {link.targetRole} • Req: {link.clearanceRequired}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold border border-slate-200">
                          {link.permissions.replace('_', ' ')}
                        </span>
                        {link.dlpWatermarkEnabled && (
                          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>DLP Stamp Active</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {link.isRevoked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                            Revoked
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            Expired
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatExpires(link.expiresAt)}</span>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Accesses: {link.accessCount}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] bg-slate-50 border border-slate-200 px-2 py-1 rounded text-slate-700 truncate max-w-xs select-all">
                          {link.shareUrl}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyUrl(link.shareUrl, link.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition shrink-0"
                          title="Copy Link"
                        >
                          {copiedId === link.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {!link.isRevoked && (
                        <button
                          type="button"
                          onClick={() => handleRevoke(link.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                        >
                          Revoke Link
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Share Link Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Generate Inter-Agency Share Grant</h3>
                  <p className="text-xs text-slate-400">Configure Access Control Lists (ACLs)</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Time-Bounded
              </span>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              {/* Select Document */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Anchored Document
                </label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                >
                  {availableDocs.map((d) => (
                    <option key={d.documentId} value={d.documentId}>
                      {d.metadata.caseNumber} - {d.metadata.documentTitle.slice(0, 40)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Department */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Recipient Department
                </label>
                <select
                  value={targetDept}
                  onChange={(e) => setTargetDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                >
                  <option value="High Court of Delhi - Criminal Registry">
                    High Court of Delhi - Criminal Registry
                  </option>
                  <option value="Central Forensic Science Laboratory (CFSL)">
                    Central Forensic Science Laboratory (CFSL)
                  </option>
                  <option value="Directorate of Prosecution - MHA">
                    Directorate of Prosecution - MHA
                  </option>
                  <option value="Delhi Police - Crime Branch Headquarters">
                    Delhi Police - Crime Branch Headquarters
                  </option>
                  <option value="All Authorized Investigation Agencies">
                    All Authorized Investigation Agencies
                  </option>
                </select>
              </div>

              {/* Target Role & Clearance */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Allowed Role (RBAC)
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                  >
                    <option value="COURT">Judiciary / Court</option>
                    <option value="FORENSICS">CFSL Forensics</option>
                    <option value="LEGAL">Public Prosecution</option>
                    <option value="POLICE">Law Enforcement</option>
                    <option value="ANY_AUTHORIZED">Any Verified Officer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Clearance Required
                  </label>
                  <select
                    value={clearanceReq}
                    onChange={(e) => setClearanceReq(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                  >
                    <option value="LEVEL_3">Level 3 (Confidential)</option>
                    <option value="LEVEL_4">Level 4 (Secret / Forensic)</option>
                    <option value="LEVEL_5">Level 5 (Top Secret / Judicial)</option>
                  </select>
                </div>
              </div>

              {/* Permissions & TTL */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Access Permissions
                  </label>
                  <select
                    value={permissions}
                    onChange={(e) => setPermissions(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                  >
                    <option value="VIEW_ONLY">View & Decrypt Only</option>
                    <option value="VIEW_AND_NOTES">View + Add Forensic Notes</option>
                    <option value="FULL_DISCOVERY">Full Trial Discovery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Time-to-Live (TTL Expiry)
                  </label>
                  <select
                    value={ttlHours}
                    onChange={(e) => setTtlHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                  >
                    <option value={24}>24 Hours (Fast Scrutiny)</option>
                    <option value={72}>72 Hours (Standard Bail)</option>
                    <option value={168}>7 Days (Trial Bundle)</option>
                    <option value={1}>1 Hour (Emergency Review)</option>
                  </select>
                </div>
              </div>

              {/* DLP Watermark Checkbox */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dlpEnabled}
                    onChange={(e) => setDlpEnabled(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900">
                      Enforce Dynamic Forensic DLP Watermark
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Burns recipient Officer ID, IP address, and Section 65B legal warning diagonally across
                      document viewer pages to prevent unauthorized photographing or leakage.
                    </p>
                  </div>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5 text-blue-400" />
                  <span>Generate Signed Token</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
