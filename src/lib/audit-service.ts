import CryptoJS from 'crypto-js';
import { AuditLogEntry } from '@/types/sharing';

const AUDIT_STORAGE_KEY = 'securedoc_audit_logs';

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '29 Sep 2026, 19:42:10 IST',
    caseNumber: 'FIR-2026-DEL-0482',
    documentId: 'doc-001',
    eventType: 'BLOCKCHAIN_ANCHORED',
    officerName: 'Insp. Vikramaditya Rathore',
    officerBadge: 'POL-DL-4091',
    department: 'Delhi Police - Special Crime Division',
    clientIp: '10.14.88.19 (GovNet VPN)',
    sha256Digest: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    logHash: '0x4f8a29b7c109e847d018b827e8a937bc609117a581e289bf16c879d0124ba189',
    prevLogHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    status: 'SUCCESS',
    details: 'Anchored on MHA Police Blockchain block #1842091. Merkle proof validated.',
  },
  {
    id: 'log-002',
    timestamp: '29 Sep 2026, 18:30:22 IST',
    caseNumber: 'CFSL-2026-BALL-114',
    documentId: 'doc-002',
    eventType: 'ENCLAVE_SEALED',
    officerName: 'Dr. Ananya Sen, Ph.D.',
    officerBadge: 'FSL-CEN-042',
    department: 'Central Forensic Science Laboratory (CFSL)',
    clientIp: '10.22.40.11 (CFSL Secure Enclave)',
    sha256Digest: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    logHash: '0x7b12c84918e97f01a942cd8901ba762048f7190283c74910ea5827361840219b',
    prevLogHash: '0x4f8a29b7c109e847d018b827e8a937bc609117a581e289bf16c879d0124ba189',
    status: 'SUCCESS',
    details: 'Ballistics micro-spectroscopy scan sealed with AES-256-CBC. Zero-knowledge key exported.',
  },
  {
    id: 'log-003',
    timestamp: '29 Sep 2026, 15:45:00 IST',
    caseNumber: 'HC-CRL-2026-904',
    documentId: 'doc-003',
    eventType: 'TAMPER_VERIFICATION_CHECK',
    officerName: 'Hon. Registrar S. Venkataraman',
    officerBadge: 'JUD-HC-1108',
    department: 'High Court of Delhi - Criminal Registry',
    clientIp: '10.5.12.90 (High Court Chambers)',
    sha256Digest: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    logHash: '0x99a817b26c04f918e217c490a18bc273610938472619047261b0a94827163829',
    prevLogHash: '0x7b12c84918e97f01a942cd8901ba762048f7190283c74910ea5827361840219b',
    status: 'SUCCESS',
    details: 'Pre-hearing evidentiary verification: Original hash bitstream identical. 0 byte drift.',
  },
  {
    id: 'log-004',
    timestamp: '29 Sep 2026, 12:10:15 IST',
    caseNumber: 'FIR-2026-DEL-0482',
    documentId: 'doc-001',
    eventType: 'ACCESS_LINK_GENERATED',
    officerName: 'Insp. Vikramaditya Rathore',
    officerBadge: 'POL-DL-4091',
    department: 'Delhi Police - Special Crime Division',
    clientIp: '10.14.88.19 (GovNet VPN)',
    sha256Digest: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    logHash: '0x12e987a04918f7620491ba650192847c50192847162938475619283746591029',
    prevLogHash: '0x99a817b26c04f918e217c490a18bc273610938472619047261b0a94827163829',
    status: 'SUCCESS',
    details: 'Time-locked access link generated for High Court Bench 03. TTL set to 72 hours.',
  },
];

export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load audit logs:', err);
    return INITIAL_AUDIT_LOGS;
  }
}

export function appendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'logHash' | 'prevLogHash'>): AuditLogEntry {
  const currentLogs = getAuditLogs();
  const prevLog = currentLogs[0] || null;
  const prevLogHash = prevLog ? prevLog.logHash : '0x0000000000000000000000000000000000000000000000000000000000000000';

  const logPayload = `${entry.timestamp}:${entry.caseNumber}:${entry.eventType}:${entry.officerBadge}:${prevLogHash}`;
  const logHash = '0x' + CryptoJS.SHA256(logPayload).toString(CryptoJS.enc.Hex);

  const fullEntry: AuditLogEntry = {
    ...entry,
    id: `log-${Date.now()}`,
    logHash,
    prevLogHash,
  };

  const updatedLogs = [fullEntry, ...currentLogs];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (err) {
      console.error('Failed to save audit log:', err);
    }
  }

  return fullEntry;
}
