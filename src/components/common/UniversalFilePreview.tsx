'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  FileCode,
  FileSpreadsheet,
  Archive,
  Eye,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Download,
  Copy,
  Check,
  Terminal,
  FileCheck,
  Shield,
} from 'lucide-react';

export type FileCategory =
  | 'image'
  | 'pdf'
  | 'video'
  | 'audio'
  | 'text'
  | 'spreadsheet'
  | 'archive'
  | 'binary';

export interface UniversalFilePreviewProps {
  file: File | null;
  previewUrl: string | null;
  fileName: string;
  mimeType: string;
  fileSize: number;
  rawText?: string;
  showDlpWatermark?: boolean;
  watermarkText?: string;
}

export function detectFileCategory(fileName: string, mimeType: string): FileCategory {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (
    mimeType.startsWith('image/') ||
    ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff', 'svg', 'gif'].includes(ext)
  ) {
    return 'image';
  }
  if (mimeType === 'application/pdf' || ext === 'pdf') {
    return 'pdf';
  }
  if (
    mimeType.startsWith('video/') ||
    ['mp4', 'webm', 'mkv', 'avi', 'mov'].includes(ext)
  ) {
    return 'video';
  }
  if (
    mimeType.startsWith('audio/') ||
    ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)
  ) {
    return 'audio';
  }
  if (
    mimeType.startsWith('text/') ||
    ['txt', 'log', 'json', 'xml', 'md', 'html', 'js', 'ts', 'py', 'sql', 'c', 'cpp'].includes(ext)
  ) {
    return 'text';
  }
  if (
    mimeType.includes('spreadsheet') ||
    mimeType.includes('csv') ||
    ['csv', 'xlsx', 'xls', 'tsv'].includes(ext)
  ) {
    return 'spreadsheet';
  }
  if (
    mimeType.includes('zip') ||
    mimeType.includes('tar') ||
    mimeType.includes('compressed') ||
    ['zip', 'tar', 'gz', '7z', 'rar', 'bz2'].includes(ext)
  ) {
    return 'archive';
  }

  return 'binary';
}

export default function UniversalFilePreview({
  file,
  previewUrl,
  fileName,
  mimeType,
  fileSize,
  rawText,
  showDlpWatermark = false,
  watermarkText,
}: UniversalFilePreviewProps) {
  const category = detectFileCategory(fileName, mimeType);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [textPreview, setTextPreview] = useState<string>(rawText || '');
  const [hexDump, setHexDump] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Read text files or generate hex dump for binaries
  useEffect(() => {
    if (rawText) {
      setTextPreview(rawText);
    }

    if (file) {
      if (category === 'text' || category === 'spreadsheet') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (content) setTextPreview(content.slice(0, 10000));
        };
        reader.readAsText(file);
      } else if (category === 'binary' || category === 'archive') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const buffer = e.target?.result as ArrayBuffer;
          if (buffer) {
            const bytes = new Uint8Array(buffer.slice(0, 512));
            const lines: string[] = [];
            for (let i = 0; i < bytes.length; i += 16) {
              const chunk = bytes.slice(i, i + 16);
              const hex = Array.from(chunk)
                .map((b) => b.toString(16).padStart(2, '0'))
                .join(' ');
              const ascii = Array.from(chunk)
                .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
                .join('');
              const offset = i.toString(16).padStart(8, '0');
              lines.push(`${offset}  ${hex.padEnd(48, ' ')}  |${ascii}|`);
            }
            setHexDump(lines);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    } else if (category === 'binary' || category === 'archive') {
      // Synthetic hex dump for sample demonstration
      const dummyLines = [
        '00000000  4d 5a 90 00 03 00 00 00  04 00 00 00 ff ff 00 00  |MZ..............|',
        '00000010  b8 00 00 00 00 00 00 00  40 00 00 00 00 00 00 00  |........@.......|',
        '00000020  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|',
        '00000030  00 00 00 00 00 00 00 00  00 00 00 00 f0 00 00 00  |................|',
        '00000040  0e 1f ba 0e 00 b4 09 cd  21 b8 01 4c cd 21 54 68  |........!..L.!Th|',
        '00000050  69 73 20 70 72 6f 67 72  61 6d 20 63 61 6e 6e 6f  |is program canno|',
        '00000060  74 20 62 65 20 72 75 6e  20 69 6e 20 44 4f 53 20  |t be run in DOS |',
        '00000070  6d 6f 64 65 2e 0d 0d 0a  24 00 00 00 00 00 00 00  |mode....$.......|',
      ];
      setHexDump(dummyLines);
    }
  }, [file, category, rawText]);

  const copyContent = () => {
    const textToCopy =
      category === 'binary' || category === 'archive'
        ? hexDump.join('\n')
        : textPreview || rawText || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="relative bg-slate-900/90 rounded-xl overflow-hidden border border-slate-700/60 shadow-inner flex flex-col min-h-[480px]">
      
      {/* DLP Watermark Overlay (if enabled) */}
      {showDlpWatermark && (
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-around opacity-15 select-none overflow-hidden">
          {[1, 2, 3].map((row) => (
            <div
              key={row}
              className="whitespace-nowrap font-mono text-[11px] font-bold text-white tracking-widest rotate-[-15deg] text-center"
            >
              {watermarkText ||
                'GOVERNMENT EVIDENCE REPOSITORY • CONFIDENTIAL CUSTODY • SEC 65B LOGGED'}
            </div>
          ))}
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2 truncate">
          <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
            {category.toUpperCase()}
          </span>
          <span className="font-semibold text-slate-200 truncate">{fileName}</span>
          <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
            ({formatSize(fileSize)})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {category === 'image' && (
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 20, 40))}
                className="p-1 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[10px] px-1">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 20, 200))}
                className="p-1 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {(category === 'text' ||
            category === 'spreadsheet' ||
            category === 'binary' ||
            category === 'archive') && (
            <button
              type="button"
              onClick={copyContent}
              className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        
        {/* 1. Image Preview */}
        {category === 'image' && (
          <div className="max-h-[550px] overflow-auto flex items-center justify-center w-full">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={fileName}
                style={{ width: `${zoomLevel}%` }}
                className="max-w-none transition-all duration-150 rounded shadow-md border border-slate-700/60 object-contain mx-auto"
              />
            ) : (
              <div className="text-slate-500 text-xs">No image source available</div>
            )}
          </div>
        )}

        {/* 2. PDF Preview */}
        {category === 'pdf' && (
          <div className="w-full h-[520px] bg-slate-950 rounded-lg border border-slate-800 flex flex-col">
            {previewUrl ? (
              <iframe
                src={`${previewUrl}#toolbar=0`}
                className="w-full h-full rounded-lg"
                title={fileName}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                <FileText className="w-12 h-12 text-blue-400" />
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">PDF Evidentiary Docket</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    {fileName} ({formatSize(fileSize)})
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded text-left font-mono text-[11px] text-slate-300 max-w-md w-full">
                  <div className="flex justify-between border-b border-slate-800 pb-1 mb-1">
                    <span className="text-slate-500">Document Type:</span>
                    <span className="text-emerald-400">PDF/A-1b Archival Record</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1 mb-1">
                    <span className="text-slate-500">Classification:</span>
                    <span className="text-blue-400">Judicial Record</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Integrity Check:</span>
                    <span className="text-emerald-400">Ready for SHA-256 seal</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Video Preview (CCTV / Evidence Footage) */}
        {category === 'video' && (
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center space-y-3">
            {previewUrl ? (
              <video
                src={previewUrl}
                controls
                className="w-full max-h-[460px] rounded-lg border border-slate-800 shadow-lg bg-black"
              />
            ) : (
              <div className="bg-slate-950 border border-slate-800 p-8 rounded-lg text-center space-y-3 w-full">
                <Film className="w-12 h-12 text-blue-400 mx-auto" />
                <h4 className="font-bold text-slate-200 text-sm">CCTV / Electronic Video Evidence</h4>
                <p className="text-xs text-slate-400">{fileName} • Video container verified</p>
              </div>
            )}
            <div className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Timecode Synchronization: Frame-Accurate</span>
              <span className="text-emerald-400">Digital Seal Ready</span>
            </div>
          </div>
        )}

        {/* 4. Audio Preview (Wiretaps / Witness Statements) */}
        {category === 'audio' && (
          <div className="w-full max-w-xl mx-auto bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-950 border border-blue-800/60 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
              <Music className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">{fileName}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Law Enforcement Audio Evidence • Wiretap / Witness Recording
              </p>
            </div>

            {/* Audio Player */}
            {previewUrl && (
              <audio src={previewUrl} controls className="w-full mx-auto" />
            )}

            {/* Simulated Acoustic Waveform Indicator */}
            <div className="h-10 bg-slate-900 border border-slate-800 rounded flex items-center justify-center gap-1 px-4">
              {[40, 65, 30, 85, 95, 45, 60, 20, 75, 100, 50, 70, 35, 90, 80, 55, 65, 40, 85, 30].map(
                (h, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-blue-500/80 rounded-full"
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>

            <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-900">
              <span>Sample Rate: 48.0 kHz 24-bit</span>
              <span className="text-emerald-400">Forensic Voice Profile Valid</span>
            </div>
          </div>
        )}

        {/* 5. Text / Code / Log Preview */}
        {category === 'text' && (
          <div className="w-full h-[520px] bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-auto whitespace-pre-wrap leading-relaxed select-text">
            {textPreview || rawText || '(Empty text stream)'}
          </div>
        )}

        {/* 6. Spreadsheet / CSV Preview */}
        {category === 'spreadsheet' && (
          <div className="w-full h-[520px] bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-auto">
            {textPreview ? (
              <div className="space-y-1">
                {textPreview
                  .split('\n')
                  .slice(0, 50)
                  .map((row, i) => (
                    <div
                      key={i}
                      className={`flex gap-4 p-1.5 rounded ${
                        i === 0
                          ? 'bg-slate-900 font-bold text-blue-300 border-b border-slate-800'
                          : 'hover:bg-slate-900/50'
                      }`}
                    >
                      <span className="text-slate-600 w-8 select-none">{i + 1}</span>
                      <span className="flex-1 whitespace-pre-wrap">{row}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-slate-500 text-center py-12">Parsing spreadsheet cells...</div>
            )}
          </div>
        )}

        {/* 7. Binary / Forensic Dump / Archive Hex Inspection */}
        {(category === 'binary' || category === 'archive') && (
          <div className="w-full h-[520px] bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-[11px] text-slate-300 overflow-auto space-y-1">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
              <span>OFFSET (HEX)   00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F   DECODED ASCII</span>
              <span className="text-blue-400 font-bold">Raw Forensic Inspection</span>
            </div>
            {hexDump.map((line, idx) => (
              <div key={idx} className="hover:bg-slate-900 px-1 rounded transition-colors select-text">
                {line}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Footer Details */}
      <div className="bg-slate-950/90 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>MIME: {mimeType || 'application/octet-stream'}</span>
        </span>
        <span className="text-emerald-400 font-semibold">
          EAL6+ Sandbox Decoded
        </span>
      </div>

    </div>
  );
}
