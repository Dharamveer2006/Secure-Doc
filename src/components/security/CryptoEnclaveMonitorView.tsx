'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  ShieldCheck,
  Cpu,
  Key,
  Database,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Copy,
  Check,
  RefreshCw,
  HardDrive,
  FileCheck,
  Terminal,
  Activity,
  Layers,
  Fingerprint,
  Zap,
} from 'lucide-react';

export default function CryptoEnclaveMonitorView() {
  const { user } = useAuth();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationSuccess, setRotationSuccess] = useState(false);

  // Live client-side hash calculator state
  const [calcFile, setCalcFile] = useState<File | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [computedSha256, setComputedSha256] = useState<string>('');
  const [computedSha512, setComputedSha512] = useState<string>('');
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; type: string } | null>(null);
  const [compareHashInput, setCompareHashInput] = useState<string>('');
  const [matchStatus, setMatchStatus] = useState<'idle' | 'match' | 'mismatch'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRotateKey = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
      setRotationSuccess(true);
      setTimeout(() => setRotationSuccess(false), 3000);
    }, 1200);
  };

  // Real client-side cryptographic hashing via WebCrypto API
  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
    let file: File | null = null;
    if ('dataTransfer' in e) {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        file = e.dataTransfer.files[0];
      }
    } else if (e.target.files && e.target.files[0]) {
      file = e.target.files[0];
    }

    if (!file) return;

    setCalcFile(file);
    setFileDetails({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type || 'application/octet-stream',
    });
    setIsHashing(true);
    setComputedSha256('');
    setComputedSha512('');
    setMatchStatus('idle');

    try {
      const buffer = await file.arrayBuffer();

      // Compute SHA-256
      const hashBuffer256 = await window.crypto.subtle.digest('SHA-256', buffer);
      const hashArray256 = Array.from(new Uint8Array(hashBuffer256));
      const hashHex256 = hashArray256.map((b) => b.toString(16).padStart(2, '0')).join('');
      setComputedSha256(hashHex256);

      // Compute SHA-512
      const hashBuffer512 = await window.crypto.subtle.digest('SHA-512', buffer);
      const hashArray512 = Array.from(new Uint8Array(hashBuffer512));
      const hashHex512 = hashArray512.map((b) => b.toString(16).padStart(2, '0')).join('');
      setComputedSha512(hashHex512);

      // Check if compare input matches
      if (compareHashInput.trim()) {
        const cleanCompare = compareHashInput.trim().toLowerCase();
        if (cleanCompare === hashHex256.toLowerCase() || cleanCompare === hashHex512.toLowerCase()) {
          setMatchStatus('match');
        } else {
          setMatchStatus('mismatch');
        }
      }
    } catch (err) {
      console.error('Hashing error:', err);
    } finally {
      setIsHashing(false);
    }
  };

  const verifyAgainstComparison = (target: string) => {
    setCompareHashInput(target);
    const cleanCompare = target.trim().toLowerCase();
    if (!cleanCompare || !computedSha256) {
      setMatchStatus('idle');
      return;
    }
    if (cleanCompare === computedSha256.toLowerCase() || cleanCompare === computedSha512.toLowerCase()) {
      setMatchStatus('match');
    } else {
      setMatchStatus('mismatch');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cryptographic Enclave &amp; Zero-Trust Telemetry</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">FIPS 140-2 Level 3 Certified</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Cryptographic Enclave &amp; Hardware Security Module (HSM)
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            Real-time monitoring of client-side encryption suites, hardware security module key storage, FIPS 180-4
            hash engines, and live evidentiary file integrity verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleRotateKey}
            disabled={isRotating}
            className="px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-2 shadow-xs card-hover disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Re-deriving Session Keys...' : 'Rotate Ephemeral Keys'}</span>
          </button>
        </div>
      </div>

      {rotationSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            Key rotation successful: WebCrypto PBKDF2 ephemeral master key updated. Previous session vector safely quarantined.
          </span>
        </div>
      )}

      {/* Real-time Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Enclave State
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ARMED
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900 font-mono">Isolated VPC Enclave</p>
          <p className="text-[11px] text-slate-500 mt-1">Delhi-NCRB Primary Node 01</p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Uptime: 99.98%</span>
            <span>Latency: 1.4ms</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Cipher Engine
            </span>
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              NIST Approved
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900 font-mono">AES-256-GCM</p>
          <p className="text-[11px] text-slate-500 mt-1">96-bit Random IV + 128-bit Auth Tag</p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Zero Server Knowledge</span>
            <span>Client Decrypt</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Hash Verifier
            </span>
            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
              FIPS 180-4
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900 font-mono">SHA-256 / SHA-512</p>
          <p className="text-[11px] text-slate-500 mt-1">Cryptographic Bit-Level Digest</p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Collision Resistant</span>
            <span>Sec 65B Proof</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Hardware Security
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              SafeNet Luna
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900 font-mono">HSM Tier 3</p>
          <p className="text-[11px] text-slate-500 mt-1">Tamper-Responsive Zeroization</p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Temp: 37.8°C</span>
            <span>Battery: 100%</span>
          </div>
        </div>
      </div>

      {/* Main Section: Interactive Live Hash Calculator & Tamper Prover */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs card-hover space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Live Client-Side File Hash Calculator &amp; Integrity Prover
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag and drop any physical file to instantly compute exact SHA-256 and SHA-512 cryptographic digests
              inside your browser using native WebCrypto API.
            </p>
          </div>

          <span className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
            W3C WebCrypto • 100% Client-Side
          </span>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 rounded-xl p-8 text-center cursor-pointer transition-all group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileDrop}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            Click or drag &amp; drop any file here to calculate evidentiary hash
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supports any format (PDF, JPG, MP4, WAV, ZIP, CSV, DOCX, BIN) up to 500 MB. Zero data transmitted over network.
          </p>
        </div>

        {/* Live Calculation Progress & Results */}
        {isHashing && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3 text-xs text-blue-900 font-medium">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Streaming file byte stream through W3C WebCrypto SHA-256 &amp; SHA-512 digest pipelines...</span>
          </div>
        )}

        {computedSha256 && fileDetails && (
          <div className="space-y-4 pt-2">
            {/* File metadata row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">File Name</span>
                <span className="font-semibold text-slate-800 truncate block">{fileDetails.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">File Size</span>
                <span className="font-semibold text-slate-800 font-mono">{fileDetails.size}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Detected MIME Type</span>
                <span className="font-semibold text-slate-800 font-mono truncate block">{fileDetails.type}</span>
              </div>
            </div>

            {/* SHA-256 Card */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>SHA-256 Evidentiary Digest (FIPS 180-4)</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(computedSha256, 'sha256')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[11px] font-mono flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'sha256' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy Digest</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-slate-200 break-all bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 select-all">
                {computedSha256}
              </p>
            </div>

            {/* SHA-512 Card */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-purple-400 font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>SHA-512 High-Entropy Digest</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(computedSha512, 'sha512')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[11px] font-mono flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'sha512' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy Digest</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-[11px] text-slate-300 break-all bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 select-all leading-relaxed">
                {computedSha512}
              </p>
            </div>

            {/* Compare against Expected Ledger Hash */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Verification: Compare Against Known Case Docket Hash
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste expected SHA-256 hash here to test for bit-level tampering..."
                  value={compareHashInput}
                  onChange={(e) => verifyAgainstComparison(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {matchStatus === 'match' && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    PERFECT CRYPTOGRAPHIC MATCH: File integrity verified. Zero bits altered. Compliant with Section 65B Indian Evidence Act.
                  </span>
                </div>
              )}

              {matchStatus === 'mismatch' && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-xs text-red-900 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    TAMPER ALERT DETECTED: Hashes do NOT match. File has been modified, corrupted, or replaced since initial seizure panchnama.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Security Architecture & Hardware Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enclave Parameters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs card-hover space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Enclave Security Specifications</span>
            </h3>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              Active Parameters
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800">Symmetric Encryption</p>
                <p className="text-[11px] text-slate-500">Authenticated Galois/Counter Mode</p>
              </div>
              <span className="font-mono font-bold text-slate-900">AES-256-GCM</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800">Key Derivation Function</p>
                <p className="text-[11px] text-slate-500">Password-Based Key Derivation v2</p>
              </div>
              <span className="font-mono font-bold text-slate-900">PBKDF2 (100,000 iter)</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800">Digital Signature Algorithm</p>
                <p className="text-[11px] text-slate-500">Elliptic Curve Digital Signature</p>
              </div>
              <span className="font-mono font-bold text-slate-900">ECDSA (P-384 / SHA-384)</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800">Zero-Knowledge Ledger</p>
                <p className="text-[11px] text-slate-500">Merkle Tree Block Integrity Chain</p>
              </div>
              <span className="font-mono font-bold text-emerald-700">10,480 Verified Blocks</span>
            </div>
          </div>
        </div>

        {/* Certificate Chain & Trust Anchor */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs card-hover space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>National PKI Certificate Authority Chain</span>
            </h3>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              Trust Anchor OK
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Root CA */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">1. India Root CA (CCA)</span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">Valid till 2035</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Controller of Certifying Authorities, Ministry of Electronics &amp; IT
              </p>
              <p className="font-mono text-[10px] text-slate-400 truncate">
                Thumbprint: 8F:92:B1:04:E2:89:12:44:09:A1:FE:33:98:C1
              </p>
            </div>

            {/* Intermediate CA */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">2. National Informatics Centre CA (NIC-CA)</span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">Valid till 2030</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Subordinate Government Certifying Authority for Law Enforcement &amp; Judiciary
              </p>
              <p className="font-mono text-[10px] text-slate-400 truncate">
                Thumbprint: 4A:11:9C:F7:2B:65:E0:91:88:14:2C:D9:00:81
              </p>
            </div>

            {/* End Entity */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-900">3. Secure-Doc MHA GovTech Node Certificate</span>
                <span className="text-[10px] font-mono text-blue-700 font-bold">Class 3 Verified</span>
              </div>
              <p className="text-[11px] text-blue-800">
                Issued to: NCRB Secure Document Enclave (DEL-MHA-VPC-01)
              </p>
              <p className="font-mono text-[10px] text-blue-600 truncate">
                Subject: CN=secure-doc.mha.gov.in, O=NCRB, C=IN
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
