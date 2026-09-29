import CryptoJS from 'crypto-js';
import { DocumentMetadata } from '@/types/document';
import { GovernmentUser } from '@/types/auth';

export interface EncryptedDocumentBundle {
  documentId: string;
  originalFileName: string;
  originalFileSize: number;
  originalMimeType: string;
  originalSha256: string;
  encryptedPayload: string;
  encryptionAlgorithm: 'AES-256-CBC' | 'AES-256-GCM';
  encryptionKeyHex: string;
  ivHex: string;
  metadata: DocumentMetadata;
  pkiSignature: {
    signerName: string;
    signerBadge: string;
    signerRole: string;
    certAuthority: string;
    signatureDigest: string;
    signedAt: string;
    keyType: string;
  };
  storage: {
    target: 'MOCK_IPFS_GOVCLOUD';
    ipfsCid: string;
    storageUri: string;
    uploadedAt: string;
  };
  blockchain: {
    network: 'MHA National Police Blockchain (Permissioned Hyperledger)';
    blockNumber: number;
    transactionHash: string;
    smartContractAddress: string;
    anchoredAt: string;
    merkleRoot: string;
  };
}

// 1. Compute SHA-256 hash from a string or ArrayBuffer/Base64
export async function computeSha256(data: string): Promise<string> {
  // If data is dataUrl, strip header or hash payload
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

// Helper to generate a random 256-bit AES key (32 bytes hex)
export function generateRandomAes256Key(): string {
  return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
}

// 2. Encrypt plaintext/base64 content using AES-256
export function encryptPayloadAes256(
  plaintext: string,
  keyHex: string
): { ciphertext: string; ivHex: string } {
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const iv = CryptoJS.lib.WordArray.random(16); // 128-bit IV

  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    ciphertext: encrypted.toString(),
    ivHex: iv.toString(CryptoJS.enc.Hex),
  };
}

// 3. Decrypt ciphertext using AES-256
export function decryptPayloadAes256(
  ciphertext: string,
  keyHex: string,
  ivHex: string
): string {
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const iv = CryptoJS.enc.Hex.parse(ivHex);

  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

// 4. Generate Officer PKI Digital Signature (NIC-CA e-Sign simulation)
export function generatePkiDigitalSignature(
  documentSha256: string,
  user: GovernmentUser
): EncryptedDocumentBundle['pkiSignature'] {
  const signaturePayload = `${documentSha256}:${user.badgeNumber}:${user.email}:${Date.now()}`;
  const signatureDigest = '0x' + CryptoJS.HmacSHA256(signaturePayload, `nic_ca_key_${user.id}`).toString(CryptoJS.enc.Hex);

  return {
    signerName: user.name,
    signerBadge: user.badgeNumber,
    signerRole: user.role,
    certAuthority: 'National Informatics Centre Certifying Authority (NIC-CA) • Class 3 Gov e-Sign',
    signatureDigest,
    signedAt: new Date().toISOString(),
    keyType: 'RSA-4096 / SHA-256 with FIPS 140-2 HSM Token',
  };
}

// 5. Mock Decentralized IPFS Storage Upload
export function generateMockStorageCid(sha256Hash: string): EncryptedDocumentBundle['storage'] {
  const ipfsCid = `bafybeic${sha256Hash.slice(0, 16)}govstorage${sha256Hash.slice(-8)}`;
  return {
    target: 'MOCK_IPFS_GOVCLOUD',
    ipfsCid,
    storageUri: `ipfs://${ipfsCid}`,
    uploadedAt: new Date().toISOString(),
  };
}

// 6. Mock Blockchain Anchoring Transaction (Permissioned Gov Ledger)
export function generateMockBlockchainAnchor(
  sha256Hash: string,
  caseNumber: string
): EncryptedDocumentBundle['blockchain'] {
  const randomBlock = Math.floor(1840000 + Math.random() * 9000);
  const txHash = '0x' + CryptoJS.SHA256(`tx_${sha256Hash}_${Date.now()}`).toString(CryptoJS.enc.Hex);
  const merkleRoot = '0x' + CryptoJS.SHA256(`merkle_${randomBlock}_${caseNumber}`).toString(CryptoJS.enc.Hex);

  return {
    network: 'MHA National Police Blockchain (Permissioned Hyperledger)',
    blockNumber: randomBlock,
    transactionHash: txHash,
    smartContractAddress: '0xNCRB0048e77c82Fa29e18bC426De32B81F17901',
    anchoredAt: new Date().toISOString(),
    merkleRoot,
  };
}

// In-memory / local storage registry for persistent encrypted documents
const ENCRYPTED_DOCS_KEY = 'securedoc_anchored_documents';

export function saveEncryptedDocument(doc: EncryptedDocumentBundle): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredEncryptedDocuments();
    const updated = [doc, ...existing.filter((d) => d.documentId !== doc.documentId)];
    localStorage.setItem(ENCRYPTED_DOCS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save encrypted document:', err);
  }
}

export function getStoredEncryptedDocuments(): EncryptedDocumentBundle[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ENCRYPTED_DOCS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load encrypted documents:', err);
    return [];
  }
}
