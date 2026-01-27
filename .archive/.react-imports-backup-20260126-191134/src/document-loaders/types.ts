/**
 * Document Loader Types
 * 
 * Flexible interfaces for loading and processing documents.
 * Bring your own parsing logic or use built-in helpers.
 */

/** Custom metadata value types */
export type DocumentMetadataValue = string | number | boolean | string[] | number[] | null | undefined

/** Document metadata structure */
export interface DocumentMetadata {
  /** Document source/file name */
  source?: string
  /** File type */
  type?: string
  /** Page number (for PDFs) */
  page?: number
  /** Line numbers */
  lines?: { start: number; end: number }
  /** Custom metadata fields */
  [key: string]: DocumentMetadataValue | { start: number; end: number }
}

export interface Document {
  /** Document content */
  content: string
  /** Document metadata */
  metadata: DocumentMetadata
}

export interface DocumentChunk extends Document {
  /** Chunk ID */
  id: string
  /** Parent document ID */
  documentId?: string
  /** Chunk index */
  index: number
  /** Start position in original document */
  start: number
  /** End position in original document */
  end: number
}

export interface ChunkingOptions {
  /** Chunk size (in characters or tokens) */
  chunkSize: number
  /** Chunk overlap for context continuity */
  chunkOverlap?: number
  /** Split by sentences (preserve sentence boundaries) */
  splitBySentence?: boolean
  /** Separator characters */
  separators?: string[]
  /** Keep separator in chunks */
  keepSeparator?: boolean
  /** Tokenizer function (optional) */
  tokenizer?: (text: string) => string[]
}

/** Options for document loading */
export interface DocumentLoadOptions {
  /** Encoding for text files */
  encoding?: string
  /** Custom metadata to attach */
  metadata?: DocumentMetadata
  /** Maximum document size in bytes */
  maxSize?: number
  /** Skip validation */
  skipValidation?: boolean
  /** Additional loader-specific options */
  [key: string]: DocumentMetadataValue | DocumentMetadata | string[] | boolean | undefined
}

export interface DocumentLoader {
  /** Loader name */
  name: string
  /** Supported file types */
  supportedTypes: string[]

  /**
   * Load a document
   */
  load(source: string | File | Blob, options?: DocumentLoadOptions): Promise<Document[]>

  /**
   * Check if loader supports a file type
   */
  supports(type: string): boolean
}

export interface TextSplitter {
  /**
   * Split text into chunks
   */
  split(text: string, options?: ChunkingOptions): DocumentChunk[]
  
  /**
   * Split documents into chunks
   */
  splitDocuments(documents: Document[], options?: ChunkingOptions): DocumentChunk[]
}

