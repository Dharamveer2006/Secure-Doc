import CryptoJS from 'crypto-js';
import { ShareLinkRecord } from '@/types/sharing';
import { GovernmentUser, UserRole } from '@/types/auth';
import { appendAuditLog } from './audit-service';

const SHARING_STORAGE_KEY = 'securedoc_sharing_links';

export const INITIAL_SHARE_LINKS: ShareLinkRecord[] = [
  {
    id: 'share-001',
    documentId: 'doc-001',
    caseNumber: 'FIR-2026-DEL-0482',
    documentTitle: 'First Information Report: High-Value Financial Cyber Intrusion',
    category: 'POLICE_FIR',
    issuingOfficer: 'Insp. Vikramaditya Rathore',
    issuingBadge: 'POL-DL-4091',
    targetDepartment: 'High Court of Delhi - Criminal Registry',
    targetRole: 'COURT',
    clearanceRequired: 'LEVEL_4',
    permissions: 'VIEW_ONLY',
    ttlHours: 72,
    expiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    shareToken: 'sec_9f86d081_hc_del_token',
    shareUrl: 'https://secure-doc.mha.gov.in/share/token?auth=sec_9f86d081_hc_del_token&exp=72h&role=COURT',
    accessCount: 3,
    maxAccessLimit: 10,
    dlpWatermarkEnabled: true,
    isRevoked: false,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'share-002',
    documentId: 'doc-002',
    caseNumber: 'CFSL-2026-BALL-114',
    documentTitle: 'Forensic Ballistics & GSR Micro-Spectroscopy Report',
    category: 'FORENSIC_REPORT',
    issuingOfficer: 'Dr. Ananya Sen, Ph.D.',
    issuingBadge: 'FSL-CEN-042',
    targetDepartment: 'Directorate of Prosecution - MHA',
    targetRole: 'LEGAL',
    clearanceRequired: 'LEVEL_3',
    permissions: 'VIEW_AND_NOTES',
    ttlHours: 24,
    expiresAt: new Date(Date.now() + 19 * 3600 * 1000).toISOString(),
    shareToken: 'sec_5e884898_pros_mha_token',
    shareUrl: 'https://secure-doc.mha.gov.in/share/token?auth=sec_5e884898_pros_mha_token&exp=24h&role=LEGAL',
    accessCount: 1,
    maxAccessLimit: 5,
    dlpWatermarkEnabled: true,
    isRevoked: false,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
];

export function getShareLinks(): ShareLinkRecord[] {
  if (typeof window === 'undefined') return INITIAL_SHARE_LINKS;
  try {
    const raw = localStorage.getItem(SHARING_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SHARING_STORAGE_KEY, JSON.stringify(INITIAL_SHARE_LINKS));
      return INITIAL_SHARE_LINKS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load share links:', err);
    return INITIAL_SHARE_LINKS;
  }
}

export function createShareLink(
  params: {
    documentId: string;
    caseNumber: string;
    documentTitle: string;
    category: any;
    targetDepartment: string;
    targetRole: UserRole | 'ANY_AUTHORIZED';
    clearanceRequired: string;
    permissions: ShareLinkRecord['permissions'];
    ttlHours: number;
    dlpWatermarkEnabled: boolean;
  },
  officer: GovernmentUser
): ShareLinkRecord {
  const token =
    'sec_' +
    CryptoJS.SHA256(`${params.documentId}_${Date.now()}_${officer.badgeNumber}`)
      .toString(CryptoJS.enc.Hex)
      .slice(0, 16);

  const expiresAt = new Date(Date.now() + params.ttlHours * 3600 * 1000).toISOString();
  const shareUrl = `https://secure-doc.mha.gov.in/share/token?auth=${token}&exp=${params.ttlHours}h&role=${params.targetRole}`;

  const newLink: ShareLinkRecord = {
    id: `share-${Date.now()}`,
    documentId: params.documentId,
    caseNumber: params.caseNumber,
    documentTitle: params.documentTitle,
    category: params.category,
    issuingOfficer: officer.name,
    issuingBadge: officer.badgeNumber,
    targetDepartment: params.targetDepartment,
    targetRole: params.targetRole,
    clearanceRequired: params.clearanceRequired,
    permissions: params.permissions,
    ttlHours: params.ttlHours,
    expiresAt,
    shareToken: token,
    shareUrl,
    accessCount: 0,
    dlpWatermarkEnabled: params.dlpWatermarkEnabled,
    isRevoked: false,
    createdAt: new Date().toISOString(),
  };

  const current = getShareLinks();
  const updated = [newLink, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(SHARING_STORAGE_KEY, JSON.stringify(updated));
  }

  // Automatically log this inter-departmental action into the Audit Ledger
  appendAuditLog({
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
    caseNumber: params.caseNumber,
    documentId: params.documentId,
    eventType: 'ACCESS_LINK_GENERATED',
    officerName: officer.name,
    officerBadge: officer.badgeNumber,
    department: officer.department,
    clientIp: '10.14.88.19 (GovNet VPN)',
    sha256Digest: token,
    status: 'SUCCESS',
    details: `Time-limited access token issued for ${params.targetDepartment}. TTL: ${params.ttlHours} hours. Watermark: ${params.dlpWatermarkEnabled ? 'Enforced' : 'Disabled'}.`,
  });

  return newLink;
}

export function revokeShareLink(shareId: string, officer: GovernmentUser): void {
  const current = getShareLinks();
  const target = current.find((l) => l.id === shareId);
  const updated = current.map((link) =>
    link.id === shareId ? { ...link, isRevoked: true } : link
  );

  if (typeof window !== 'undefined') {
    localStorage.setItem(SHARING_STORAGE_KEY, JSON.stringify(updated));
  }

  if (target) {
    appendAuditLog({
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      caseNumber: target.caseNumber,
      documentId: target.documentId,
      eventType: 'ACCESS_LINK_GENERATED',
      officerName: officer.name,
      officerBadge: officer.badgeNumber,
      department: officer.department,
      clientIp: '10.14.88.19 (GovNet VPN)',
      sha256Digest: target.shareToken,
      status: 'REVOKED',
      details: `Access token revoked manually by ${officer.name} (${officer.badgeNumber}). Immediate token nullification executed.`,
    });
  }
}
