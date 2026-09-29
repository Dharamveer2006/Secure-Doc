'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ROLE_CONFIGS } from '@/lib/constants';
import { DocumentCategory, DocumentMetadata, IngestionFileRecord } from '@/types/document';
import {
  runClientOcr,
  createSampleDocumentImage,
  OcrResult,
} from '@/lib/ocr-service';
import UniversalFilePreview, { detectFileCategory } from '../common/UniversalFilePreview';
import CryptoEnclaveModal from './CryptoEnclaveModal';
import { EncryptedDocumentBundle } from '@/lib/crypto-service';
import {
  UploadCloud,
  FileText,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  FileCode,
  Tag,
  Calendar,
  User,
  Shield,
  Building,
  Hash,
  Scale,
  ArrowRight,
  Trash2,
  Lock,
  Film,
  Music,
  Archive,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SecureUploadViewProps {
  onProceedToStep3?: (record: IngestionFileRecord) => void;
}

export default function SecureUploadView({ onProceedToStep3 }: SecureUploadViewProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [record, setRecord] = useState<IngestionFileRecord | null>(null);
  const [activeLeftTab, setActiveLeftTab] = useState<'preview' | 'rawText'>('preview');
  const [isEnclaveModalOpen, setIsEnclaveModalOpen] = useState(false);
  const [anchoredBundle, setAnchoredBundle] = useState<EncryptedDocumentBundle | null>(null);

  // Universal ingestion and OCR processing pipeline
  const processAnyFile = async (
    file: File | null,
    previewUrl: string,
    fileName: string,
    fileSize: number,
    mimeType: string
  ) => {
    const detectedCat = detectFileCategory(fileName, mimeType);

    const initialRecord: IngestionFileRecord = {
      id: `doc-${Date.now()}`,
      file,
      fileName,
      fileSize,
      mimeType,
      previewUrl,
      rawOcrText: '',
      ocrConfidence: 0,
      ocrStatus: 'PROCESSING',
      ocrProgress: 15,
      ocrStatusMessage:
        detectedCat === 'image'
          ? 'Initializing Tesseract OCR Neural Engine...'
          : `Processing ${detectedCat.toUpperCase()} evidence stream...`,
      metadata: {
        caseNumber: 'Detecting...',
        documentTitle: `Ingested ${detectedCat.toUpperCase()}: ${fileName}`,
        category:
          detectedCat === 'audio'
            ? 'WITNESS_STATEMENT'
            : detectedCat === 'video' || detectedCat === 'binary' || detectedCat === 'archive'
            ? 'SEIZURE_MEMO'
            : detectedCat === 'spreadsheet'
            ? 'CHARGE_SHEET'
            : 'POLICE_FIR',
        suspectName: 'Scanning...',
        complainantName: 'Scanning...',
        incidentDate: new Date().toISOString().split('T')[0],
        actsAndSections: 'Analyzing...',
        policeStationOrLab: user ? user.department : 'Central Registry',
        originatingDepartment: user ? user.department : 'Delhi Police',
        clearanceLevel: user ? user.clearanceLevel : 'LEVEL_3',
        tags: [detectedCat.toUpperCase(), 'PENDING_ENCLAVE'],
      },
      createdAt: new Date().toISOString(),
    };

    setRecord(initialRecord);

    try {
      const ocrResult: OcrResult = await runClientOcr(
        file || previewUrl,
        fileName,
        (progress, message) => {
          setRecord((prev) =>
            prev
              ? {
                  ...prev,
                  ocrProgress: progress,
                  ocrStatusMessage: message,
                }
              : null
          );
        }
      );

      setRecord((prev) =>
        prev
          ? {
              ...prev,
              rawOcrText: ocrResult.rawText,
              ocrConfidence: ocrResult.confidence,
              ocrStatus: 'COMPLETED',
              ocrProgress: 100,
              ocrStatusMessage: 'Evidence stream verified & metadata structured.',
              metadata: ocrResult.parsedMetadata,
            }
          : null
      );
    } catch (err) {
      console.error('File ingestion pipeline error:', err);
      setRecord((prev) =>
        prev
          ? {
              ...prev,
              ocrStatus: 'FAILED',
              ocrStatusMessage: 'File parsing encountered an unexpected issue.',
            }
          : null
      );
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      const previewUrl = URL.createObjectURL(droppedFile);
      processAnyFile(
        droppedFile,
        previewUrl,
        droppedFile.name,
        droppedFile.size,
        droppedFile.type || 'application/octet-stream'
      );
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selected = files[0];
      const previewUrl = URL.createObjectURL(selected);
      processAnyFile(
        selected,
        previewUrl,
        selected.name,
        selected.size,
        selected.type || 'application/octet-stream'
      );
    }
  };

  // Turnkey demo document loaders for all forensic modalities
  const handleLoadDemo = (
    type: 'FIR_IMG' | 'CFSL_IMG' | 'AUDIO_WIRETAP' | 'DISK_DUMP' | 'CCTV_VIDEO'
  ) => {
    if (type === 'FIR_IMG' || type === 'CFSL_IMG') {
      const isFir = type === 'FIR_IMG';
      const dataUrl = createSampleDocumentImage(isFir ? 'FIR' : 'FORENSIC');
      const fileName = isFir
        ? 'FIR_2026_DEL_0482_CyberIntrusion_Verified.png'
        : 'CFSL_2026_BALL_114_ForensicsReport.png';
      const approxSize = Math.round(dataUrl.length * 0.75);
      processAnyFile(null, dataUrl, fileName, approxSize, 'image/png');
    } else if (type === 'AUDIO_WIRETAP') {
      const fileName = 'WIRETAP_INTERCEPT_2026_CALL_RECORD.wav';
      processAnyFile(null, '', fileName, 2489000, 'audio/wav');
    } else if (type === 'DISK_DUMP') {
      const fileName = 'SEIZURE_PANCHNAMA_772_NVME_SECTOR_DUMP.pcap';
      processAnyFile(null, '', fileName, 8940000, 'application/vnd.tcpdump.pcap');
    } else if (type === 'CCTV_VIDEO') {
      const fileName = 'CCTV_ENTRANCE_VAULT_CAM04_FOOTAGE.mp4';
      processAnyFile(null, '', fileName, 14200000, 'video/mp4');
    }
  };

  const handleMetadataChange = (field: keyof DocumentMetadata, value: any) => {
    if (!record) return;
    setRecord({
      ...record,
      metadata: {
        ...record.metadata,
        [field]: value,
      },
    });
  };

  const handleReset = () => {
    if (record?.previewUrl && record.file) {
      URL.revokeObjectURL(record.previewUrl);
    }
    setRecord(null);
    setAnchoredBundle(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-mono">
              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
              <span>Universal Evidence Ingestion & Cryptographic Seal</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-emerald-700 font-mono font-semibold">
              All Formats Supported
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Digital Evidence Ingestion & Chain-of-Custody Sealing
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            Upload any evidence format: scanned police FIRs, forensic ballistics, wiretap recordings, CCTV footage,
            or raw disk sector captures. Previews are decoded locally, text is extracted via OCR, and payloads are
            sealed with client-side AES-256 before blockchain anchoring.
          </p>
        </div>

        {record && (
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1.5 self-start md:self-auto card-hover"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Discard & Ingest Another</span>
          </button>
        )}
      </div>

      {/* Main Drag-and-Drop Area (Visible when no document loaded) */}
      {!record && (
        <div className="space-y-5">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all card-hover ${
              isDragging
                ? 'border-blue-600 bg-blue-50/50 scale-[1.005]'
                : 'border-slate-300 bg-slate-50/70 hover:bg-white hover:border-slate-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="*/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm mx-auto flex items-center justify-center text-blue-600 mb-4 transition-transform hover:scale-105">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Drag & Drop Any Evidence File or Police Docket
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1 mb-5 leading-relaxed">
              Accepts <strong>all file types</strong>: Scanned Images (PNG, JPG, TIFF), Judicial Dockets (PDF, DOCX),
              Wiretap Audio (WAV, MP3), CCTV Video (MP4, WEBM), Spreadsheets (CSV, XLSX), or Forensic Binaries (PCAP, DD, ZIP).
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition shadow-sm card-hover">
              <FileText className="w-3.5 h-3.5" />
              <span>Select File from Machine</span>
            </div>

            {/* Formats Grid Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-800">IMAGES (OCR)</span>
              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-800">PDF & DOCX</span>
              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-800">CCTV VIDEO</span>
              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-800">WIRETAP AUDIO</span>
              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-800">PCAP / DISK DUMPS</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1 font-sans">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero Server Leakage</span>
              </span>
            </div>
          </div>

          {/* Turnkey Demo Modalities Grid for SIH Judges */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Test Any Forensic Modality (1-Click Evaluator Scans)
                </span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold border border-slate-200">
                Multi-Modal Pipeline
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Test how the system ingests and renders different legal evidentiary formats:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Demo 1: Police FIR Image */}
              <button
                type="button"
                onClick={() => handleLoadDemo('FIR_IMG')}
                className="p-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-left transition space-y-1.5 group card-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-100 px-1 rounded">
                    IMAGE / OCR
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Police FIR Document
                </p>
                <p className="text-[11px] text-slate-500">
                  Scanned FIR with OCR text extraction & BNS sections.
                </p>
              </button>

              {/* Demo 2: CFSL Forensic Lab Report */}
              <button
                type="button"
                onClick={() => handleLoadDemo('CFSL_IMG')}
                className="p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-left transition space-y-1.5 group card-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-purple-800 bg-purple-100 px-1 rounded">
                    FORENSICS
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  CFSL Ballistics Report
                </p>
                <p className="text-[11px] text-slate-500">
                  Chemical micro-spectroscopy & GSR matching.
                </p>
              </button>

              {/* Demo 3: Audio Wiretap Evidence */}
              <button
                type="button"
                onClick={() => handleLoadDemo('AUDIO_WIRETAP')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition space-y-1.5 group card-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                    <Music className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-blue-800 bg-blue-100 px-1 rounded">
                    AUDIO / WAV
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Wiretap Call Recording
                </p>
                <p className="text-[11px] text-slate-500">
                  Telecommunication intercept with acoustic waveform.
                </p>
              </button>

              {/* Demo 4: Forensic Disk Dump / PCAP */}
              <button
                type="button"
                onClick={() => handleLoadDemo('DISK_DUMP')}
                className="p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition space-y-1.5 group card-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                    <Archive className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1 rounded">
                    HEX / PCAP
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  NVMe Sector Dump
                </p>
                <p className="text-[11px] text-slate-500">
                  Bitstream hex dump inspector & network packet trail.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Loaded & Universal Inspection Workspace */}
      {record && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Progress / Status Terminal Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
                  {record.ocrStatus === 'PROCESSING' ? (
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                  ) : record.ocrStatus === 'COMPLETED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold tracking-wide uppercase text-slate-200">
                      Processing Status: {record.ocrStatus}
                    </span>
                    {record.ocrConfidence > 0 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {record.ocrConfidence}% Confidence
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{record.ocrStatusMessage}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                <span className="truncate max-w-[200px]">File: {record.fileName}</span>
                <span>•</span>
                <span>{(record.fileSize / 1024).toFixed(1)} KB</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-300 ${
                  record.ocrStatus === 'COMPLETED'
                    ? 'bg-emerald-500'
                    : record.ocrStatus === 'FAILED'
                    ? 'bg-rose-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${record.ocrProgress}%` }}
              />
            </div>
          </div>

          {/* Dual Split-Pane Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Universal Multi-Modal File Previewer */}
            <div className="lg:col-span-6 space-y-2">
              <UniversalFilePreview
                file={record.file}
                previewUrl={record.previewUrl}
                fileName={record.fileName}
                mimeType={record.mimeType}
                fileSize={record.fileSize}
                rawText={record.rawOcrText}
              />
            </div>

            {/* Right Column: Auto-Populated Legal Metadata Form */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span>Structured Evidentiary Metadata</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Structured via content inspection and legal heuristics. Fully editable before cryptographic seal.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  Verified
                </span>
              </div>

              {/* Form Fields Grid */}
              <div className="space-y-3.5 text-xs">
                {/* Case Number & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Case / FIR Docket Number</span>
                      <span className="text-[10px] text-blue-600 font-normal">Parsed</span>
                    </label>
                    <div className="relative">
                      <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={record.metadata.caseNumber}
                        onChange={(e) => handleMetadataChange('caseNumber', e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Evidence Category
                    </label>
                    <select
                      value={record.metadata.category}
                      onChange={(e) =>
                        handleMetadataChange('category', e.target.value as DocumentCategory)
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                    >
                      <option value="POLICE_FIR">Police FIR (First Info Report)</option>
                      <option value="FORENSIC_REPORT">CFSL Forensic Lab Examination</option>
                      <option value="CHARGE_SHEET">Police Charge Sheet / Final Form</option>
                      <option value="SEIZURE_MEMO">Seizure Panchnama / Digital Evidence</option>
                      <option value="COURT_ORDER">Court Judicial Order / Bail Record</option>
                      <option value="WITNESS_STATEMENT">Witness Statement (Wiretap/Sec 161)</option>
                    </select>
                  </div>
                </div>

                {/* Document Title */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Formal Evidence Title
                  </label>
                  <input
                    type="text"
                    value={record.metadata.documentTitle}
                    onChange={(e) => handleMetadataChange('documentTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                  />
                </div>

                {/* Suspect Name & Complainant */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Accused / Suspect Person</span>
                      <span className="text-[10px] text-blue-600 font-normal">Parsed</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={record.metadata.suspectName}
                        onChange={(e) => handleMetadataChange('suspectName', e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Complainant / Submitting Body</span>
                      <span className="text-[10px] text-blue-600 font-normal">Parsed</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={record.metadata.complainantName}
                        onChange={(e) => handleMetadataChange('complainantName', e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Acts & Sections + Filing Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Acts & Sections (IPC / BNS / IT Act)</span>
                      <span className="text-[10px] text-blue-600 font-normal">Parsed</span>
                    </label>
                    <div className="relative">
                      <Scale className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={record.metadata.actsAndSections}
                        onChange={(e) => handleMetadataChange('actsAndSections', e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Incident / Filing Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={record.metadata.incidentDate}
                        onChange={(e) => handleMetadataChange('incidentDate', e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Police Station / Lab & Clearance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Station / Laboratory Division
                    </label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={record.metadata.policeStationOrLab}
                        onChange={(e) =>
                          handleMetadataChange('policeStationOrLab', e.target.value)
                        }
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Clearance Level
                    </label>
                    <select
                      value={record.metadata.clearanceLevel}
                      onChange={(e) => handleMetadataChange('clearanceLevel', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                    >
                      <option value="LEVEL_1">Level 1 - Public Records</option>
                      <option value="LEVEL_2">Level 2 - Internal Dept</option>
                      <option value="LEVEL_3">Level 3 - Confidential (Police/Legal)</option>
                      <option value="LEVEL_4">Level 4 - Secret (CFSL Forensics)</option>
                      <option value="LEVEL_5">Level 5 - Top Secret (Judicial/High Court)</option>
                    </select>
                  </div>
                </div>

                {/* Evidence Tags Cloud */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Evidentiary Indexing Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {record.metadata.tags.map((t, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        <span>#{t}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cryptographic Enclave Action Card */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                {anchoredBundle ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Document Cryptographically Anchored</span>
                      </span>
                      <span className="font-mono text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                        Block #{anchoredBundle.blockchain.blockNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      SHA-256:{' '}
                      <strong className="font-mono">
                        {anchoredBundle.originalSha256.slice(0, 16)}...
                      </strong>{' '}
                      | AES-256 Client Encrypted
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsEnclaveModalOpen(true)}
                      className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Evidentiary Certificate & Cryptographic Keys</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-start gap-2.5">
                      <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">Cryptographic Seal Ready</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Click below to calculate the bitstream SHA-256 hash, encrypt with client-side
                          AES-256, sign with Officer PKI, and anchor onto the blockchain ledger.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEnclaveModalOpen(true)}
                      className="w-full py-3 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Execute Cryptographic Enclave Seal (SHA-256 & AES-256)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cryptographic Enclave Modal */}
      {isEnclaveModalOpen && record && (
        <CryptoEnclaveModal
          record={record}
          onClose={() => setIsEnclaveModalOpen(false)}
          onSuccess={(bundle) => {
            setAnchoredBundle(bundle);
            onProceedToStep3?.(record);
          }}
        />
      )}
    </div>
  );
}
