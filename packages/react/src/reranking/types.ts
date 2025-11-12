/**
 * Reranking Types
 *
 * Improve RAG relevance by reranking search results.
 * Bring your own reranker (Cohere, Voyage, cross-encoders) or use simple scoring.
 */

export interface RerankResult {
  /** Document ID */
  id: string
  /** Original search score */
  originalScore: number
  /** Reranked score */
  rerankScore: number
  /** Document content */
  content: string
  /** Metadata */
  metadata?: Record<string, any>
  /** Final rank position */
  rank: number
}

export interface RerankRequest {
  /** Search query */
  query: string
  /** Documents to rerank */
  documents: Array<{
    id: string
    content: string
    score?: number
    metadata?: Record<string, any>
  }>
  /** Number of top results to return */
  topK?: number
  /** Model to use (provider-specific) */
  model?: string
}

export interface RerankResponse {
  /** Reranked results */
  results: RerankResult[]
  /** Model used */
  model?: string
  /** Metadata */
  metadata?: Record<string, any>
}

export interface Reranker {
  /** Reranker name */
  readonly name: string

  /**
   * Rerank documents by relevance to query
   */
  rerank(request: RerankRequest): Promise<RerankResponse>
}

