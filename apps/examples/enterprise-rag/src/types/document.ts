/**
 * Type definitions for RAG Workbench
 */

export interface Document {
  id: string
  name: string
  content: string
  createdAt: Date
  size: number
  chunks: DocumentChunk[]
}

export interface DocumentChunk {
  id: string
  documentId: string
  text: string
  startIndex: number
  endIndex: number
  tokens: number
}

export interface SearchResult {
  chunk: DocumentChunk
  document: Document
  score: number
}

export interface RAGQuery {
  query: string
  documentIds?: string[]  // Filter to specific documents
  topK?: number           // Number of chunks to retrieve
  model: string
  provider: 'openai' | 'anthropic' | 'google'
  temperature?: number
  maxTokens?: number
}

export interface RAGResponse {
  answer: string
  sources: Source[]
  tokens: {
    context: number
    prompt: number
    completion: number
    total: number
  }
  cost: number
  responseTime: number
}

export interface Source {
  documentId: string
  documentName: string
  chunkIndex: number
  text: string
  relevanceScore: number
}

export interface RAGConfig {
  chunkSize: number        // tokens per chunk
  overlap: number          // overlap between chunks
  topK: number            // default chunks to retrieve
  maxContextTokens: number // max context size
  temperature: number      // default temperature
}
