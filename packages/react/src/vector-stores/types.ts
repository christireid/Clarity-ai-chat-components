/**
 * Vector Store Types
 * 
 * Unified interface for vector databases (Pinecone, Qdrant, Weaviate, Chroma)
 * enabling enterprise-grade RAG with semantic search.
 */

export interface Vector {
  /** Vector ID */
  id: string
  /** Embedding values */
  values: number[]
  /** Metadata associated with the vector */
  metadata?: Record<string, any>
  /** Sparse vector values for hybrid search */
  sparseValues?: {
    indices: number[]
    values: number[]
  }
}

export interface VectorQuery {
  /** Query vector */
  vector?: number[]
  /** Query text (if embeddings generated automatically) */
  text?: string
  /** Number of results to return */
  topK?: number
  /** Minimum similarity score (0-1) */
  minScore?: number
  /** Metadata filters */
  filter?: Record<string, any>
  /** Include vector values in response */
  includeValues?: boolean
  /** Include metadata in response */
  includeMetadata?: boolean
  /** Namespace for multi-tenancy */
  namespace?: string
}

export interface VectorMatch {
  /** Vector ID */
  id: string
  /** Similarity score (0-1) */
  score: number
  /** Vector values (if requested) */
  values?: number[]
  /** Metadata */
  metadata?: Record<string, any>
}

export interface VectorUpsertOptions {
  /** Namespace for multi-tenancy */
  namespace?: string
  /** Batch size for chunked uploads */
  batchSize?: number
}

export interface VectorStats {
  /** Total number of vectors */
  totalVectors: number
  /** Dimension of vectors */
  dimension: number
  /** Available namespaces */
  namespaces?: string[]
  /** Index status */
  status?: 'ready' | 'initializing' | 'error'
}

export interface VectorStoreConfig {
  /** Provider name */
  provider: 'pinecone' | 'qdrant' | 'weaviate' | 'chroma' | 'custom'
  /** API key */
  apiKey?: string
  /** API endpoint */
  endpoint?: string
  /** Index/collection name */
  indexName: string
  /** Vector dimension */
  dimension?: number
  /** Similarity metric */
  metric?: 'cosine' | 'euclidean' | 'dotProduct'
  /** Environment (for Pinecone) */
  environment?: string
  /** Additional provider-specific config */
  config?: Record<string, any>
}

/**
 * Unified Vector Store Interface
 * 
 * All vector store providers must implement this interface
 */
export interface VectorStore {
  /** Provider name */
  readonly provider: string
  
  /**
   * Initialize the vector store connection
   */
  initialize(): Promise<void>
  
  /**
   * Upsert vectors (insert or update)
   * @param vectors - Vectors to upsert
   * @param options - Upsert options
   */
  upsert(vectors: Vector[], options?: VectorUpsertOptions): Promise<void>
  
  /**
   * Query similar vectors
   * @param query - Query parameters
   */
  query(query: VectorQuery): Promise<VectorMatch[]>
  
  /**
   * Delete vectors by IDs
   * @param ids - Vector IDs to delete
   * @param namespace - Namespace (optional)
   */
  delete(ids: string[], namespace?: string): Promise<void>
  
  /**
   * Delete all vectors in a namespace
   * @param namespace - Namespace to delete
   */
  deleteNamespace(namespace: string): Promise<void>
  
  /**
   * Get vector store statistics
   */
  getStats(): Promise<VectorStats>
  
  /**
   * Fetch vectors by IDs
   * @param ids - Vector IDs
   * @param namespace - Namespace (optional)
   */
  fetch(ids: string[], namespace?: string): Promise<Vector[]>
  
  /**
   * List vector IDs (paginated)
   * @param namespace - Namespace (optional)
   * @param limit - Page size
   * @param paginationToken - Token from previous page
   */
  list(namespace?: string, limit?: number, paginationToken?: string): Promise<{
    ids: string[]
    nextToken?: string
  }>
  
  /**
   * Create a namespace (if supported)
   * @param namespace - Namespace name
   */
  createNamespace?(namespace: string): Promise<void>
  
  /**
   * Close connection
   */
  close(): Promise<void>
}

/**
 * Vector Store Factory
 */
export interface VectorStoreFactory {
  create(config: VectorStoreConfig): VectorStore
}

/**
 * Hybrid Search Result
 * Combines dense and sparse vectors for improved accuracy
 */
export interface HybridSearchResult extends VectorMatch {
  /** Dense vector score */
  denseScore: number
  /** Sparse vector score (keyword match) */
  sparseScore: number
  /** Combined score */
  hybridScore: number
}

