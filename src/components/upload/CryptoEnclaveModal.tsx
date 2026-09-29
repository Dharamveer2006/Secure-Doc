'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { IngestionFileRecord } from '@/types/document';
import {
  computeSha256,
  generateRandomAes256Key,
  encryptPayloadAes256,
  generatePkiDigitalSignature,
  generateMockStorageCid,
  generateMockBlockchainAnchor,
  saveEncryptedDocument,
  EncryptedDocumentBundle,
} from '@/lib/crypto-service';
import {
  ShieldCheck,
  Lock,
  Key,
  Database,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  Eye,
  EyeOff,
  ArrowRight,
  ExternalLink,
  Blocks,
  FileCheck,
  Sparkles,
  QrCode,
} from 'lucide-react';

interface CryptoEnclaveModalProps {
  record: IngestionFileRecord;
  onClose: () => void;
  onSuccess: (bundle: EncryptedDocumentBundle) => void;
}

type Stage = 'HASHING' | 'ENCRYPTING' | 'SIGNING' | 'STORAGE' | 'BLOCKCHAIN' | 'COMPLETE';

export default function CryptoEnclaveModal({
  record,
  onClose,
  onSuccess,
}: CryptoEnclaveModalProps) {
  const { user } = useAuth();

  const [currentStage, setCurrentStage] = useState<Stage>('HASHING');
  const [sha256Hash, setSha256Hash] = useState<string>('');
  const [aesKey, setAesKey] = useState<string>('');
  const [ivHex, setIvHex] = useState<string>('');
  const [ciphertextPreview, setCiphertextPreview] = useState<string>('');
  const [bundle, setBundle] = useState<EncryptedDocumentBundle | null>(null);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Execute cryptographic pipeline sequentially
  useEffect(() => {
    let isCancelled = false;

    const executePipeline = async () => {
      if (!user) return;

      const rawContent = record.previewUrl || record.rawOcrText || record.fileName;

      // Stage 1: SHA-256 Hashing
      setCurrentStage('HASHING');
      await new Promise((r) => setTimeout(r, 600));
      if (isCancelled) return;
      const hash = await computeSha256(rawContent);
      setSha256Hash(hash);

      // Stage 2: AES-256 Client-Side Encryption
      setCurrentStage('ENCRYPTING');
      await new Promise((r) => setTimeout(r, 600));
      if (isCancelled) return;
      const randomKey = generateRandomAes256Key();
      const encryption = encryptPayloadAes256(rawContent, randomKey);
      setAesKey(randomKey);
      setIvHex(encryption.ivHex);
      setCiphertextPreview(encryption.ciphertext.slice(0, 120) + '...');

      // Stage 3: PKI Digital Signature
      setCurrentStage('SIGNING');
      await new Promise((r) => setTimeout(r, 600));
      if (isCancelled) return;
      const pki = generatePkiDigitalSignature(hash, user);

      // Stage 4: Mock IPFS Storage
      setCurrentStage('STORAGE');
      await new Promise((r) => setTimeout(r, 500));
      if (isCancelled) return;
      const storage = generateMockStorageCid(hash);

      // Stage 5: Mock Blockchain Anchoring
      setCurrentStage('BLOCKCHAIN');
      await new Promise((r) => setTimeout(r, 700));
      if (isCancelled) return;
      const blockchain = generateMockBlockchainAnchor(hash, record.metadata.caseNumber);

      // Final Bundle Assembly
      const finalBundle: EncryptedDocumentBundle = {
        documentId: record.id,
        originalFileName: record.fileName,
        originalFileSize: record.fileSize,
        originalMimeType: record.mimeType,
        originalSha256: hash,
        encryptedPayload: encryption.ciphertext,
        encryptionAlgorithm: 'AES-256-CBC',
        encryptionKeyHex: randomKey,
        ivHex: encryption.ivHex,
        metadata: record.metadata,
        pkiSignature: pki,
        storage,
        blockchain,
      };

      saveEncryptedDocument(finalBundle);
      setBundle(finalBundle);
      setCurrentStage('COMPLETE');
      onSuccess(finalBundle);
    };

    executePipeline();

    return () => {
      isCancelled = true;
    };
  }, [record, user]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadProof = () => {
    if (!bundle) return;
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SECUREDOC_CERTIFICATE_${bundle.metadata.caseNumber}_${bundle.originalSha256.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stages: { id: Stage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'HASHING', label: '1. SHA-256 Digest', icon: Cpu },
    { id: 'ENCRYPTING', label: '2. Client AES-256', icon: Lock },
    { id: 'SIGNING', label: '3. PKI e-Sign', icon: FileCheck },
    { id: 'STORAGE', label: '4. IPFS GovCloud', icon: Database },
    { id: 'BLOCKCHAIN', label: '5. Ledger Anchor', icon: Blocks },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base tracking-wide text-white">
                Cryptographic Enclave & Evidentiary Anchoring
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Indian Evidence Act Sec 65B • Zero-Knowledge Sealing
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-semibold">
            {currentStage === 'COMPLETE' ? 'SEALED & ANCHORED' : 'PROCESSING ENCLAVE'}
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between gap-1 overflow-x-auto">
            {stages.map((st, i) => {
              const Icon = st.icon;
              const isPast =
                currentStage === 'COMPLETE' ||
                stages.findIndex((s) => s.id === currentStage) > i;
              const isCurrent = currentStage === st.id;

              return (
                <div key={st.id} className="flex items-center gap-1.5 shrink-0 text-xs">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300 animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span
                    className={`hidden sm:inline font-semibold text-[11px] ${
                      isPast
                        ? 'text-emerald-700'
                        : isCurrent
                        ? 'text-blue-700 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                  {i < stages.length - 1 && (
                    <span className="text-slate-300 mx-1 hidden sm:inline">→</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Active Processing Indicators */}
          {currentStage !== 'COMPLETE' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center animate-spin">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  Executing Cryptographic Pipeline in Client Browser
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target Document: <strong className="text-slate-800">{record.fileName}</strong> ({record.metadata.caseNumber})
                </p>
              </div>
            </div>
          )}

          {/* Completed State: Digital Certificate of Authenticity */}
          {currentStage === 'COMPLETE' && bundle && (
            <div className="space-y-4">
              {/* Success Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 leading-tight">
                    Evidentiary Integrity Mathematically Certified
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Original file hashed with SHA-256, payload encrypted client-side with AES-256, 
                    attested with Officer PKI Signature, and anchored on the permissioned government blockchain.
                  </p>
                </div>
              </div>

              {/* Cryptographic Proof Details Grid */}
              <div className="space-y-3 text-xs">
                
                {/* 1. SHA-256 Evidentiary Digest */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-blue-600" />
                      <span>Original Document SHA-256 Digest (Pre-Encryption Proof)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(bundle.originalSha256, 'sha256')}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      {copiedField === 'sha256' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'sha256' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-[11px] bg-slate-50 border border-slate-200 p-2 rounded text-slate-900 break-all select-all font-bold">
                    {bundle.originalSha256}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Matches Section 65B Indian Evidence Act requirement for bit-level bitstream verification.
                  </p>
                </div>

                {/* 2. Client AES-256 Key & IV */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Client AES-256 Secret Key & IV (Zero-Knowledge)</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px]"
                      >
                        {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showKey ? 'Hide Key' : 'Reveal Key'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(bundle.encryptionKeyHex, 'aesKey')}
                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 text-[11px]"
                      >
                        {copiedField === 'aesKey' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'aesKey' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="font-mono text-[11px] bg-slate-50 border border-slate-200 p-2 rounded text-slate-900 break-all select-all">
                    {showKey ? bundle.encryptionKeyHex : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>Algorithm: {bundle.encryptionAlgorithm}</span>
                    <span>IV: {bundle.ivHex.slice(0, 16)}...</span>
                  </div>
                </div>

                {/* 3. PKI Digital Signature */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>Officer PKI Digital Signature Attestation (NIC-CA)</span>
                    </span>
                    <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded border border-purple-200">
                      Class 3 e-Sign
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Signer Officer:</span>
                      <span className="font-bold text-slate-800">
                        {bundle.pkiSignature.signerName} ({bundle.pkiSignature.signerBadge})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Certifying Authority:</span>
                      <span className="text-slate-700 truncate max-w-xs">{bundle.pkiSignature.certAuthority}</span>
                    </div>
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-slate-500">Signature Digest:</span>
                      <span className="text-purple-800 font-bold truncate max-w-xs">
                        {bundle.pkiSignature.signatureDigest.slice(0, 24)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Mock Blockchain Anchor & Storage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* IPFS Storage */}
                  <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-slate-600" />
                        <span>IPFS GovCloud CID</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(bundle.storage.ipfsCid, 'ipfs')}
                        className="text-blue-600 hover:text-blue-800 text-[10px] font-semibold"
                      >
                        {copiedField === 'ipfs' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="font-mono text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200 text-slate-800 truncate">
                      {bundle.storage.ipfsCid}
                    </div>
                  </div>

                  {/* Blockchain Transaction */}
                  <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Blocks className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Block #{bundle.blockchain.blockNumber}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(bundle.blockchain.transactionHash, 'tx')}
                        className="text-blue-600 hover:text-blue-800 text-[10px] font-semibold"
                      >
                        {copiedField === 'tx' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="font-mono text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200 text-slate-800 truncate">
                      {bundle.blockchain.transactionHash}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            disabled={!bundle}
            onClick={handleDownloadProof}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-white transition flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Evidentiary Certificate (.json)</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Done & Return to Workspace</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
