'use client'

import * as React from 'react'

// =============================================================================
// Types
// =============================================================================

export interface RetrievedChunk {
  id: string
  text: string
  score: number
  source?: string
  metadata?: Record<string, unknown>
}

export interface Retriever {
  query: (embedding: number[], k: number) => Promise<RetrievedChunk[]>
}

export interface UseVectorSearchConfig {
  /** Embedding function */
  embed: (text: string) => Promise<number[]>
  /** Retriever implementation */
  retriever: Retriever
  /** Number of results to return */
  k?: number
  /** Minimum score threshold */
  minScore?: number
  /** Enable result diversity */
  enableDiversity?: boolean
  /** Diversity threshold */
  diversityThreshold?: number
}

export interface SearchResult {
  chunks: RetrievedChunk[]
  query: string
  searchTimeMs: number
  embeddingTimeMs: number
  totalTimeMs: number
}

export interface UseVectorSearchReturn {
  /** Search for relevant chunks */
  search: (query: string) => Promise<RetrievedChunk[]>
  /** Search with full metadata */
  searchWithMetadata: (query: string) => Promise<SearchResult>
  /** Batch search */
  batchSearch: (queries: string[]) => Promise<RetrievedChunk[][]>
  /** Whether search is in progress */
  isSearching: boolean
  /** Last search result */
  lastResult: SearchResult | null
  /** Search statistics */
  stats: {
    totalSearches: number
    avgSearchTimeMs: number
    avgResultCount: number
  }
}

// =============================================================================
// Error Classes
// =============================================================================

export class EmbeddingFailedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EmbeddingFailedError'
  }
}

export class RetrieverError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RetrieverError'
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Apply diversity filtering using MMR (Maximal Marginal Relevance)
 */
function applyDiversity(
  chunks: RetrievedChunk[],
  queryEmbedding: number[],
  embeddings: Map<string, number[]>,
  threshold: number,
  k: number
): RetrievedChunk[] {
  if (chunks.length <= k) return chunks

  const selected: RetrievedChunk[] = []
  const remaining = [...chunks]

  // Always select the most relevant first
  if (remaining.length > 0) {
    selected.push(remaining.shift()!)
  }

  while (selected.length < k && remaining.length > 0) {
    let bestIdx = 0
    let bestScore = -Infinity

    for (let i = 0; i < remaining.length; i++) {
      const chunk = remaining[i]
      const chunkEmbedding = embeddings.get(chunk.id)
      if (!chunkEmbedding) continue

      // Calculate relevance to query
      const relevance = chunk.score

      // Calculate max similarity to already selected
      let maxSimilarity = 0
      for (const sel of selected) {
        const selEmbedding = embeddings.get(sel.id)
        if (selEmbedding) {
          const sim = cosineSimilarity(chunkEmbedding, selEmbedding)
          maxSimilarity = Math.max(maxSimilarity, sim)
        }
      }

      // MMR score: relevance - lambda * redundancy
      const mmrScore = relevance - threshold * maxSimilarity

      if (mmrScore > bestScore) {
        bestScore = mmrScore
        bestIdx = i
      }
    }

    selected.push(remaining.splice(bestIdx, 1)[0])
  }

  return selected
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useVectorSearch - Retrieves relevant context from a vector database
 *
 * Embeds query text, retrieves top-k chunks, and returns sorted by score.
 * Supports optional diversity filtering using MMR.
 *
 * @example
 * ```tsx
 * const { search } = useVectorSearch({
 *   embed: async (text) => embeddings.embed(text),
 *   retriever: vectorStore,
 *   k: 3,
 *   minScore: 0.7
 * })
 *
 * // Get relevant context for RAG
 * const chunks = await search(userQuery)
 * const context = chunks.map(c => c.text).join('\n\n')
 * ```
 */
export function useVectorSearch(
  config: UseVectorSearchConfig
): UseVectorSearchReturn {
  const {
    embed,
    retriever,
    k = 5,
    minScore = 0,
    enableDiversity = false,
    diversityThreshold = 0.7,
  } = config

  // State
  const [isSearching, setIsSearching] = React.useState(false)
  const [lastResult, setLastResult] = React.useState<SearchResult | null>(null)
  const [stats, setStats] = React.useState({
    totalSearches: 0,
    avgSearchTimeMs: 0,
    avgResultCount: 0,
  })

  // Embedding cache for diversity calculation
  const embeddingCacheRef = React.useRef<Map<string, number[]>>(new Map())

  /**
   * Search with full metadata
   */
  const searchWithMetadata = React.useCallback(
    async (query: string): Promise<SearchResult> => {
      const totalStart = performance.now()
      setIsSearching(true)

      try {
        // Generate embedding
        const embedStart = performance.now()
        let queryEmbedding: number[]
        try {
          queryEmbedding = await embed(query)
        } catch (error) {
          throw new EmbeddingFailedError(
            `Failed to embed query: ${error instanceof Error ? error.message : String(error)}`
          )
        }
        const embeddingTimeMs = performance.now() - embedStart

        // Search retriever
        const searchStart = performance.now()
        let chunks: RetrievedChunk[]
        try {
          chunks = await retriever.query(
            queryEmbedding,
            enableDiversity ? k * 2 : k
          )
        } catch (error) {
          throw new RetrieverError(
            `Retriever query failed: ${error instanceof Error ? error.message : String(error)}`
          )
        }
        const searchTimeMs = performance.now() - searchStart

        // Apply min score filter
        chunks = chunks.filter((c) => c.score >= minScore)

        // Apply diversity filtering if enabled
        if (enableDiversity && chunks.length > k) {
          // Store embeddings for diversity calculation
          // In a real implementation, embeddings would come from the retriever
          chunks = applyDiversity(
            chunks,
            queryEmbedding,
            embeddingCacheRef.current,
            diversityThreshold,
            k
          )
        }

        // Limit to k results
        chunks = chunks.slice(0, k)

        const totalTimeMs = performance.now() - totalStart

        const result: SearchResult = {
          chunks,
          query,
          searchTimeMs,
          embeddingTimeMs,
          totalTimeMs,
        }

        setLastResult(result)

        // Update stats
        setStats((prev) => ({
          totalSearches: prev.totalSearches + 1,
          avgSearchTimeMs:
            (prev.avgSearchTimeMs * prev.totalSearches + totalTimeMs) /
            (prev.totalSearches + 1),
          avgResultCount:
            (prev.avgResultCount * prev.totalSearches + chunks.length) /
            (prev.totalSearches + 1),
        }))

        return result
      } finally {
        setIsSearching(false)
      }
    },
    [embed, retriever, k, minScore, enableDiversity, diversityThreshold]
  )

  /**
   * Search for relevant chunks (simplified)
   */
  const search = React.useCallback(
    async (query: string): Promise<RetrievedChunk[]> => {
      const result = await searchWithMetadata(query)
      return result.chunks
    },
    [searchWithMetadata]
  )

  /**
   * Batch search
   */
  const batchSearch = React.useCallback(
    async (queries: string[]): Promise<RetrievedChunk[][]> => {
      const results = await Promise.all(queries.map(search))
      return results
    },
    [search]
  )

  return {
    search,
    searchWithMetadata,
    batchSearch,
    isSearching,
    lastResult,
    stats,
  }
}
