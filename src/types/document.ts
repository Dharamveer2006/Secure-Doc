export type DocumentCategory =
  | 'POLICE_FIR'
  | 'CHARGE_SHEET'
  | 'FORENSIC_REPORT'
  | 'SEIZURE_MEMO'
  | 'COURT_ORDER'
  | 'WITNESS_STATEMENT';

export interface DocumentMetadata {
  caseNumber: string;
  documentTitle: string;
  category: DocumentCategory;
  suspectName: string;
  complainantName: string;
  incidentDate: string;
  actsAndSections: string;
  policeStationOrLab: string;
  originatingDepartment: string;
  clearanceLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';
  tags: string[];
}

export interface IngestionFileRecord {
  id: string;
  file: File | null;
  fileName: string;
  fileSize: number;
  mimeType: string;
  previewUrl: string | null;
  rawOcrText: string;
  ocrConfidence: number;
  ocrStatus: 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  ocrProgress: number;
  ocrStatusMessage: string;
  metadata: DocumentMetadata;
  createdAt: string;
}
