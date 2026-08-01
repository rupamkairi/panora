export const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024;
export const MAX_CHAT_DOCUMENTS = 5;

export const SUPPORTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
] as const;

export type DocumentStatus = "uploaded" | "processing" | "ready" | "failed";
export type IndexingPhase =
  | "uploaded"
  | "extracting"
  | "chunking"
  | "embedding"
  | "ready"
  | "failed";

export type KnowledgeDocument = {
  id: string;
  title: string;
  originalFilename: string;
  description: string | null;
  author: string | null;
  organization: string | null;
  sourceUrl: string | null;
  publicationDate: string | null;
  language: string | null;
  category: string | null;
  tags: string[];
  mimeType: string;
  sizeBytes: number;
  status: DocumentStatus;
  phase: IndexingPhase;
  progress: number;
  processedChunks: number;
  totalChunks: number | null;
  errorMessage: string | null;
  pageCount: number | null;
  wordCount: number | null;
  chunkCount: number | null;
  uploadedAt: string;
  updatedAt: string;
  uploadedBy: string;
};

export type SourceCitation = {
  documentId: string;
  documentTitle: string;
  pageNumber?: number;
  section?: string;
  excerpt: string;
  unavailable?: boolean;
};

export type WebReference = { title?: string; url: string };
