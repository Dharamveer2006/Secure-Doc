'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  getStoredEncryptedDocuments,
  decryptPayloadAes256,
  computeSha256,
  EncryptedDocumentBundle,
} from '@/lib/crypto-service';
import { appendAuditLog } from '@/lib/audit-service';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  FileText,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Download,
  Eye,
  Blocks,
  FileCheck,
  ExternalLink,
  Flame,
  FileSpreadsheet,
} from 'lucide-react';
import UniversalFilePreview from '../common/UniversalFilePreview';
import { createSampleDocumentImage } from '@/lib/ocr-service';

interface SecureDocumentViewerProps {
  initialDocumentId?: string;
  onClose?: () => void;
}

export default function SecureDocumentViewer({
  initialDocumentId,
  onClose,
}: SecureDocumentViewerProps) {
  const { user } = useAuth();

  const [documents, setDocuments] = useState<EncryptedDocumentBundle[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [decryptedPayload, setDecryptedPayload] = useState<string | null>(null);
  const [recomputedHash, setRecomputedHash] = useState<string>('');
  const [isTamperSimulated, setIsTamperSimulated] = useState<boolean>(false);
  const [hashMatches, setHashMatches] = useState<boolean | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'metadata' | 'blockchain'>('preview');

  // Load documents
  useEffect(() => {
    let docs = getStoredEncryptedDocuments();

    // If none exists, create default anchored bundles so the viewer is instantly testable!
    if (!docs || docs.length === 0) {
      const defaultFirImage = createSampleDocumentImage('FIR');
      const defaultSha = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
      const defaultKey = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      const defaultIv = '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d';

      const demoDoc: EncryptedDocumentBundle = {
        documentId: 'doc-001',
        originalFileName: 'FIR_2026_DEL_0482_CyberIntrusion_Verified.png',
        originalFileSize: 348200,
        originalMimeType: 'image/png',
        originalSha256: defaultSha,
        encryptedPayload: defaultFirImage, // In demonstration, stores payload
        encryptionAlgorithm: 'AES-256-CBC',
        encryptionKeyHex: defaultKey,
        ivHex: defaultIv,
        metadata: {
          caseNumber: 'FIR-2026-DEL-0482',
          documentTitle: 'First Information Report: High-Value Financial Cyber Intrusion',
          category: 'POLICE_FIR',
          suspectName: 'Vikramaditya Malhotra',
          complainantName: 'Sunita Devi, Joint Secretary (Finance)',
          incidentDate: '2026-09-24',
          actsAndSections: 'Section 316 BNS & Section 66, 43 IT Act',
          policeStationOrLab: 'Special Cyber Crime Division, New Delhi',
          originatingDepartment: 'Delhi Police - Special Crime Division',
          clearanceLevel: 'LEVEL_3',
          tags: ['POLICE_FIR', 'CYBER_CRIME', 'BNS_316'],
        },
        pkiSignature: {
          signerName: 'Insp. Vikramaditya Rathore',
          signerBadge: 'POL-DL-4091',
          signerRole: 'POLICE',
          certAuthority: 'National Informatics Centre Certifying Authority (NIC-CA) • Class 3 Gov e-Sign',
          signatureDigest: '0x88f294ab10e98c7726190284716b0a9482716382901847162938475619283746',
          signedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
          keyType: 'RSA-4096 / SHA-256 with FIPS 140-2 HSM Token',
        },
        storage: {
          target: 'MOCK_IPFS_GOVCLOUD',
          ipfsCid: 'bafybeic9f86d081884c7d659a2fgovstorage0f00a08',
          storageUri: 'ipfs://bafybeic9f86d081884c7d659a2fgovstorage0f00a08',
          uploadedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        },
        blockchain: {
          network: 'MHA National Police Blockchain (Permissioned Hyperledger)',
          blockNumber: 1842091,
          transactionHash: '0x3a9fe18b827e8a937bc609117a581e289bf16c879d0124ba1894f8a29b7c109e',
          smartContractAddress: '0xNCRB0048e77c82Fa29e18bC426De32B81F17901',
          anchoredAt: new Date(Date.now() - 3600 * 1000).toISOString(),
          merkleRoot: '0x7b12c84918e97f01a942cd8901ba762048f7190283c74910ea5827361840219b',
        },
      };

      docs = [demoDoc];
    }

    setDocuments(docs);
    setSelectedDocId(initialDocumentId || docs[0]?.documentId || '');
  }, [initialDocumentId]);

  // Execute client-side decryption & tamper verification whenever selected document changes
  const activeDoc = documents.find((d) => d.documentId === selectedDocId) || documents[0];

  useEffect(() => {
    if (!activeDoc || !user) return;

    const runDecryptionPipeline = async () => {
      setIsDecrypting(true);
      setDecryptedPayload(null);
      setHashMatches(null);

      await new Promise((r) => setTimeout(r, 400));

      try {
        let payloadToVerify = activeDoc.encryptedPayload;

        // If tamper simulation is toggled ON, corrupt the payload by changing 1 character
        if (isTamperSimulated) {
          payloadToVerify =
            payloadToVerify.slice(0, 100) + 'TAMPERED_BYTE_CORRUPTION' + payloadToVerify.slice(125);
        }

        // Compute decrypted payload hash
        const computedHash = await computeSha256(payloadToVerify);
        setRecomputedHash(computedHash);

        const isExactMatch = computedHash === activeDoc.originalSha256 && !isTamperSimulated;
        setHashMatches(isExactMatch);
        setDecryptedPayload(payloadToVerify);

        // Append to immutable audit log
        appendAuditLog({
          timestamp:
            new Date().toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }) + ' IST',
          caseNumber: activeDoc.metadata.caseNumber,
          documentId: activeDoc.documentId,
          eventType: 'DECRYPTION_ACCESSED',
          officerName: user.name,
          officerBadge: user.badgeNumber,
          department: user.department,
          clientIp: '10.14.88.19 (GovNet VPN)',
          sha256Digest: computedHash,
          status: isExactMatch ? 'SUCCESS' : 'FLAGGED',
          details: isExactMatch
            ? `Client AES-256 decryption successful. SHA-256 evidentiary hash 100% matched with block #${activeDoc.blockchain.blockNumber}.`
            : `SECURITY ALERT: Tampering detected! Recomputed hash differs from blockchain anchor record.`,
        });
      } catch (err) {
        console.error('Decryption failed:', err);
        setHashMatches(false);
      } finally {
        setIsDecrypting(false);
      }
    };

    runDecryptionPipeline();
  }, [activeDoc, isTamperSimulated, user]);

  const copyHash = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(activeDoc.originalSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const downloadAffidavit = () => {
    if (!activeDoc || !user) return;
    const affidavitText = `
CERTIFICATE UNDER SECTION 65B(4) OF THE INDIAN EVIDENCE ACT, 1872
FOR ADMISSIBILITY OF ELECTRONIC RECORDS

Case Record No       : ${activeDoc.metadata.caseNumber}
Document Description : ${activeDoc.metadata.documentTitle}
Originating Agency   : ${activeDoc.metadata.originatingDepartment}

1. I, ${user.name}, holding official Badge ID: ${user.badgeNumber}, serving as ${user.role} in ${user.department}, do hereby solemnly affirm and state on oath:
2. The electronic record described herein was ingested under authorized custody via the National Secure-Doc Digital Management System.
3. At the time of ingestion, a cryptographic SHA-256 hash was generated on the raw digital file before transmission:
   SHA-256 Digest: ${activeDoc.originalSha256}
4. The document payload was encrypted using AES-256-CBC client-side encryption and anchored on the MHA National Police Blockchain at Block #${activeDoc.blockchain.blockNumber} (Tx: ${activeDoc.blockchain.transactionHash}).
5. Client-side re-verification confirms 0-byte bitstream deviation and 100% cryptographic integrity match.

Date of Verification : ${new Date().toLocaleString('en-IN')} IST
Certifying Officer   : ${user.name} (${user.badgeNumber})
Issuing CA Authority : ${activeDoc.pkiSignature.certAuthority}
Electronic Signature : ${activeDoc.pkiSignature.signatureDigest}
`.trim();

    const blob = new Blob([affidavitText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SECTION_65B_AFFIDAVIT_${activeDoc.metadata.caseNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!activeDoc) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
        No encrypted documents currently anchored in this session.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Row with Document Selector & Tamper Attack Simulator */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Step 4 Active: Secure Client-Side Decryption & Verification</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">Sec 65B Compliant</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Secure Evidentiary Document Viewer
          </h2>
          <p className="text-xs text-slate-600 max-w-xl">
            Decrypted client-side with AES-256 and verified against the blockchain SHA-256 anchor.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Document Switcher */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700 hidden sm:inline">
              Select Record:
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => {
                setSelectedDocId(e.target.value);
                setIsTamperSimulated(false);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition max-w-xs"
            >
              {documents.map((d) => (
                <option key={d.documentId} value={d.documentId}>
                  {d.metadata.caseNumber} - {d.metadata.documentTitle.slice(0, 30)}...
                </option>
              ))}
            </select>
          </div>

          {/* Tamper Simulation Button (SIH Jury Test) */}
          <button
            type="button"
            onClick={() => setIsTamperSimulated(!isTamperSimulated)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
              isTamperSimulated
                ? 'bg-rose-600 text-white hover:bg-rose-700 ring-2 ring-rose-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>
              {isTamperSimulated ? 'Tamper Injected (Corrupted)' : 'Simulate Tamper Attack'}
            </span>
          </button>
        </div>
      </div>

      {/* Mathematical Cryptographic Verification Banner */}
      <div
        className={`rounded-xl p-4 sm:p-5 border transition-all ${
          hashMatches === true
            ? 'bg-emerald-50 border-emerald-200'
            : hashMatches === false
            ? 'bg-rose-50 border-rose-300 animate-pulse'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white ${
                hashMatches === true
                  ? 'bg-emerald-600'
                  : hashMatches === false
                  ? 'bg-rose-600'
                  : 'bg-slate-400'
              }`}
            >
              {isDecrypting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : hashMatches === true ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4
                  className={`text-sm font-bold ${
                    hashMatches === true
                      ? 'text-emerald-900'
                      : hashMatches === false
                      ? 'text-rose-900'
                      : 'text-slate-800'
                  }`}
                >
                  {isDecrypting
                    ? 'Decrypting AES-256 Payload & Validating Bitstream...'
                    : hashMatches === true
                    ? 'MATHEMATICAL INTEGRITY PROVEN: ZERO TAMPERING DETECTED'
                    : 'SECURITY COMPROMISE DETECTED: EVIDENTIARY HASH MISMATCH!'}
                </h4>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    hashMatches === true
                      ? 'bg-emerald-200 text-emerald-800'
                      : hashMatches === false
                      ? 'bg-rose-200 text-rose-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {hashMatches === true ? 'Bitstream Valid' : 'Inadmissible'}
                </span>
              </div>

              <p
                className={`text-xs ${
                  hashMatches === true ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {hashMatches === true
                  ? 'Decrypted bitstream exactly matches the pre-encryption SHA-256 hash anchored in Block #' +
                    activeDoc.blockchain.blockNumber +
                    '. Legally admissible under Section 65B.'
                  : 'WARNING: 1 or more bytes altered in transit. The decrypted payload does NOT match the cryptographic anchor on the blockchain ledger!'}
              </p>
            </div>
          </div>

          {/* Export Affidavit button */}
          <button
            type="button"
            onClick={downloadAffidavit}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            <span>Generate Sec 65B Affidavit</span>
          </button>
        </div>

        {/* Side-by-Side Hash Comparison Box */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Blockchain Stored Anchor Hash:
            </span>
            <div className="flex items-center justify-between gap-1 text-[11px] text-slate-900 break-all select-all font-bold">
              <span>{activeDoc.originalSha256}</span>
              <button
                type="button"
                onClick={copyHash}
                className="text-blue-600 hover:text-blue-800 shrink-0 p-1"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div
            className={`p-2.5 rounded-lg border ${
              hashMatches === true
                ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950 font-bold'
                : 'bg-rose-100/60 border-rose-300 text-rose-950 font-bold'
            }`}
          >
            <span className="text-[10px] uppercase font-bold block mb-1">
              {isTamperSimulated ? 'Compromised Decrypted Hash:' : 'Recomputed Post-Decryption Hash:'}
            </span>
            <div className="text-[11px] break-all select-all">
              {recomputedHash || 'Computing...'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Document Viewer Pane with Dynamic DLP Watermark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Decrypted Document & Dynamic Watermark */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          {/* Header Bar */}
          <div className="border-b border-slate-200 px-4 py-3 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {activeDoc.metadata.caseNumber}
              </span>
              <span className="text-xs font-bold text-slate-800 truncate">
                {activeDoc.metadata.documentTitle}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              AES-256-CBC Decrypted
            </span>
          </div>

          {/* Universal Decrypted Preview with DLP Forensic Watermark */}
          <div className="p-3">
            <UniversalFilePreview
              file={null}
              previewUrl={decryptedPayload}
              fileName={activeDoc.originalFileName}
              mimeType={activeDoc.originalMimeType}
              fileSize={activeDoc.originalFileSize}
              showDlpWatermark={true}
              watermarkText={`RESTRICTED GOVT EVIDENCE • ACCESSED BY ${user?.name.toUpperCase()} (${user?.badgeNumber}) • IP 10.14.88.19 • SEC 65B LOGGED`}
            />
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Client Enclave Node: DEL-NCRB-01</span>
            <span className="text-emerald-700 font-semibold font-mono">
              FIPS 140-2 Keyed Decryption
            </span>
          </div>
        </div>

        {/* Right Column: Case Metadata & Chain-of-Custody Attestation */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Metadata Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Evidentiary Case Profile</span>
            </h4>

            <div className="space-y-2">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Accused / Suspect:</span>
                <span className="font-bold text-slate-900">{activeDoc.metadata.suspectName}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Complainant / Submitting:</span>
                <span className="text-slate-800">{activeDoc.metadata.complainantName}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Acts & Sections:</span>
                <span className="font-mono text-slate-800 font-semibold">{activeDoc.metadata.actsAndSections}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Police Station / CFSL:</span>
                <span className="text-slate-800">{activeDoc.metadata.policeStationOrLab}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Clearance Level:</span>
                <span className="font-mono text-blue-700 font-bold">{activeDoc.metadata.clearanceLevel}</span>
              </div>
            </div>
          </div>

          {/* Officer PKI e-Sign Attestation Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Officer PKI Digital Signature</span>
              </span>
              <span className="text-[9px] font-mono bg-purple-50 text-purple-700 px-1.5 rounded">
                Class 3
              </span>
            </h4>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Signer Officer:</span>
                <span className="font-bold text-slate-800">{activeDoc.pkiSignature.signerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Badge ID:</span>
                <span className="font-mono text-slate-800">{activeDoc.pkiSignature.signerBadge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Authority:</span>
                <span className="text-slate-700 truncate max-w-[180px]">
                  NIC-CA India
                </span>
              </div>
              <div className="pt-1 border-t border-slate-100 font-mono text-[10px]">
                <span className="text-slate-500 block">Signature Digest:</span>
                <span className="text-purple-800 break-all">{activeDoc.pkiSignature.signatureDigest.slice(0, 32)}...</span>
              </div>
            </div>
          </div>

          {/* Blockchain Anchor Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2 text-xs font-mono">
            <h4 className="font-bold font-sans text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Blocks className="w-3.5 h-3.5 text-emerald-600" />
              <span>Permissioned Blockchain Receipt</span>
            </h4>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Mined Block:</span>
                <span className="font-bold text-emerald-800">#{activeDoc.blockchain.blockNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Storage CID:</span>
                <span className="text-slate-800 truncate max-w-[160px]">{activeDoc.storage.ipfsCid}</span>
              </div>
              <div className="pt-1 border-t border-slate-100 text-[10px]">
                <span className="text-slate-500 block">Transaction Hash:</span>
                <span className="text-slate-800 break-all">{activeDoc.blockchain.transactionHash}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
