/**
 * Vector Store Types
 *
 * Defines vector database interfaces and operations
 */

import type { MemoryItem, MemoryType } from './memory.js'

/**
 * Vector store query options
 */
export interface VectorStoreQuery {
  /** Query vector */
  vector: number[]

  /** Number of results to return */
  topK?: number

  /** Minimum score threshold */
  minScore?: number

  /** Metadata filter */
  filter?: Record<string, any>

  /** Namespace or collection */
  namespace?: string

  /** Include metadata in results */
  includeMetadata?: boolean
}

/**
 * Vector store match
 */
export interface VectorStoreMatch {
  /** Match identifier */
  id: string

  /** Similarity score */
  score: number

  /** Stored vector values */
  values: number[]

  /** Associated metadata */
  metadata?: Record<string, any>
}

/**
 * Vector data for upsert operations
 */
export interface VectorStoreVector {
  id: string
  values: number[]
  metadata?: Record<string, any>
}

/**
 * Vector store upsert options
 */
export interface VectorStoreUpsertOptions {
  namespace?: string
  batchSize?: number
}

/**
 * Vector store interface
 */
export interface VectorStore {
  initialize(): Promise<void> | void
  query(options: VectorStoreQuery): Promise<VectorStoreMatch[]>
  upsert(
    vectors: VectorStoreVector[],
    options?: VectorStoreUpsertOptions
  ): Promise<void>
  delete(ids: string | string[], namespace?: string): Promise<void>

  // Methods for compatibility with stores/base.ts and AuditLogger
  add(memory: MemoryItem): Promise<void>
  get(id: string): Promise<MemoryItem | null>
  update(id: string, memory: MemoryItem): Promise<void>
  search(
    query: string,
    options: any
  ): Promise<Array<{ memory: MemoryItem; score: number }>>
  getAll(options?: { types?: MemoryType[] }): Promise<MemoryItem[]>
  close(): Promise<void>
}

/**
 * Embedding provider interface
 */
export interface EmbeddingProvider {
  embedText(text: string): Promise<number[]>
  embedBatch?(texts: string[]): Promise<number[][]>
}

/**
 * Vector store configuration
 */
export interface VectorStoreConfig {
  /** Store type */
  type:
    | 'in-memory'
    | 'file'
    | 'indexeddb'
    | 'redis'
    | 'postgres'
    | 'sqlite'
    | 'chroma'
    | 'qdrant'
    | 'pinecone'
    | 'lancedb'

  /** File path (for file store) */
  path?: string

  /** Database name (for indexeddb store) */
  dbName?: string

  /** Additional store-specific options */
  options?: Record<string, any>
}
