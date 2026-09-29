'use client';

import React from 'react';
import { Share2, Clock, ShieldCheck, Key, Lock, ArrowRight, UserCheck } from 'lucide-react';

export default function InterDepartmentSharingPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full w-fit mb-3">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Step 4 Target Module: Inter-Departmental Time-Limited Sharing</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Inter-Agency Evidence Sharing & Access Control Lists (ACLs)
        </h2>
        <p className="text-xs text-slate-600 max-w-2xl mt-1">
          Scheduled for implementation in <strong>Step 4</strong>. Enables authorized police officers, public
          prosecutors, and judges to issue granular, time-expiring cryptographic tokens with view-only or download
          permissions across departments with DLP watermarking.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs mx-auto flex items-center justify-center text-amber-600">
          <Share2 className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            Cryptographic Access Grant Engine (Step 4 Preview)
          </h3>
          <p className="text-xs text-slate-500">
            Configures dynamic sharing policies: Time-to-Live (TTL) expiration, department whitelisting, and dynamic
            evidentiary watermarks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left text-xs">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Time-Bounded TTL</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Links automatically self-terminate after 24h, 72h, or upon court bail hearing conclusion.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>RBAC Role Whitelist</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Restricts access strictly to verified Judicial Officers or Public Prosecutors.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>DLP Forensics Trace</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Dynamic forensic watermark stamped with recipient Officer ID, IP address, and timestamp.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
          <span>Scheduled for Step 4 after Cryptographic Enclave (Step 3)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
