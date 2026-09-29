'use client';

import React from 'react';
import { UploadCloud, Sparkles, Cpu, Lock, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export default function SecureUploadPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full w-fit mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Step 2 Target Module: Digital Ingestion & OCR Processing</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Secure Document Ingestion & Optical Character Recognition
        </h2>
        <p className="text-xs text-slate-600 max-w-2xl mt-1">
          This module is the active target for <strong>Step 2</strong>. In the next phase, it will feature
          client-side drag-and-drop file ingestion, client-side Tesseract.js OCR text extraction, and automated
          metadata parsing (Case Number, Suspect Name, Sections, Incident Date) directly in the browser.
        </p>
      </div>

      {/* Blueprint Preview of Step 2 */}
      <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm mx-auto flex items-center justify-center text-blue-600 mb-4">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Client-Side Ingestion Zone (Step 2 Preview)
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
          Drag & drop FIRs, autopsy records, forensic photos, or charge sheets. Files will be pre-processed locally
          using OCR before client-side AES-256 encryption.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left text-xs">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>Tesseract.js OCR</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Extracts text from scanned FIRs on the client machine without leaking unencrypted data.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Auto Metadata Tagging</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Auto-fills Case ID, Suspect Names, IPC/BNS acts, and Police Station tags.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Pre-Encryption Hook</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Prepares binary payload for Step 3 AES-256 and SHA-256 cryptographic sealing.
            </p>
          </div>
        </div>

        <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">
          <span>Awaiting Step 1 Verification Confirmation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
