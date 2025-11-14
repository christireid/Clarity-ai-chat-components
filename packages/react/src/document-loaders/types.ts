/**
 * Document Loader Types
 * 
 * Flexible interfaces for loading and processing documents.
 * Bring your own parsing logic or use built-in helpers.
 */

export interface Document {
  /** Document content */
  content: string
  /** Document metadata */
  metadata: {
    /** Document source/file name */
    source?: string
    /** File type */
    type?: string
    /** Page number (for PDFs) */
    page?: number
    /** Line numbers */
    lines?: { start: number; end: number }
    /** Custom metadata */
    [key: string]: any
  }
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

export interface DocumentLoader {
  /** Loader name */
  name: string
  /** Supported file types */
  supportedTypes: string[]
  
  /**
   * Load a document
   */
  load(source: string | File | Blob, options?: any): Promise<Document[]>
  
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

