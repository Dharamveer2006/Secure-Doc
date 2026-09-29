'use client';

import React from 'react';
import { History, ShieldCheck, CheckCircle2, Hash, FileSpreadsheet, ArrowRight, Lock } from 'lucide-react';

export default function AuditLogsPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full w-fit mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Step 4 Target Module: Tamper-Proof Audit Trails & Legal Ledger</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Cryptographic Audit Trails & Evidentiary Chain-of-Custody
        </h2>
        <p className="text-xs text-slate-600 max-w-2xl mt-1">
          Scheduled for implementation in <strong>Step 4</strong>. Every upload, decryption event, inter-departmental
          access, and permission change generates an immutable cryptographic audit record compliant with Section 65B
          of the Indian Evidence Act.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs mx-auto flex items-center justify-center text-emerald-600">
          <History className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            Immutable Audit Ledger (Step 4 Preview)
          </h3>
          <p className="text-xs text-slate-500">
            Forensic logging architecture: hash-chained event logs, officer digital signatures, and automated court-ready
            evidence export.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left text-xs">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <Hash className="w-4 h-4 text-blue-600" />
              <span>SHA-256 Merkle Chaining</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Each audit entry embeds the previous log hash, rendering retroactive tampering mathematically impossible.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>Chain of Custody Logs</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Tracks Officer ID, Station, Device IP, Decryption Key ID, and Access timestamps.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Section 65B Certificate</span>
            </div>
            <p className="text-[11px] text-slate-500">
              One-click generation of court-admissible electronic record affidavits under Indian Law.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
          <span>Scheduled for Step 4 after Client-Side Encryption (Step 3)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
