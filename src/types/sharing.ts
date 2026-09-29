import { UserRole } from './auth';
import { DocumentCategory } from './document';

export interface ShareLinkRecord {
  id: string;
  documentId: string;
  caseNumber: string;
  documentTitle: string;
  category: DocumentCategory;
  issuingOfficer: string;
  issuingBadge: string;
  targetDepartment: string;
  targetRole: UserRole | 'ANY_AUTHORIZED';
  clearanceRequired: string;
  permissions: 'VIEW_ONLY' | 'VIEW_AND_NOTES' | 'FULL_DISCOVERY';
  ttlHours: number;
  expiresAt: string;
  shareToken: string;
  shareUrl: string;
  accessCount: number;
  maxAccessLimit?: number;
  dlpWatermarkEnabled: boolean;
  isRevoked: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  caseNumber: string;
  documentId: string;
  eventType:
    | 'DOCUMENT_INGESTED'
    | 'ENCLAVE_SEALED'
    | 'BLOCKCHAIN_ANCHORED'
    | 'DECRYPTION_ACCESSED'
    | 'ACCESS_LINK_GENERATED'
    | 'TAMPER_VERIFICATION_CHECK'
    | 'SECTION_65B_AFFIDAVIT_EXPORTED';
  officerName: string;
  officerBadge: string;
  department: string;
  clientIp: string;
  sha256Digest: string;
  logHash: string;
  prevLogHash: string;
  status: 'SUCCESS' | 'FLAGGED' | 'REVOKED';
  details: string;
}
