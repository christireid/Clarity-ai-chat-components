/**
 * SearchService - Hybrid Search Service
 *
 * Combines BM25 keyword search with vector semantic search using
 * Reciprocal Rank Fusion (RRF) for optimal results.
 *
 * Responsibilities:
 * - Hybrid search (keyword + vector)
 * - Result fusion using RRF
 * - MMR (Maximal Marginal Relevance) for diversity
 * - Result ranking and scoring
 *
 * Dependencies: RAGService (for vector search)
 *
 * @example
 * ```typescript
 * const searchService = new SearchService(ragService)
 * const results = await searchService.hybridSearch(query, {
 *   topK: 10,
 *   keywordWeight: 0.4,
 *   enableMMR: true
 * })
 * ```
 */

import { searchDocumentation } from '../ai/keywordSearch'
import { generateEmbedding } from '../ai/embeddings'
import { getVectorStore, type SearchResult } from '../ai/vectorStore'
import type { RAGService } from './RAGService'

// Simple logger for services
const logger = {
  debug: (msg: string, ...args: unknown[]) =>
    console.debug(`[SearchService] ${msg}`, ...args),
  info: (msg: string, ...args: unknown[]) =>
    console.info(`[SearchService] ${msg}`, ...args),
  warn: (msg: string, ...args: unknown[]) =>
    console.warn(`[SearchService] ${msg}`, ...args),
  error: (msg: string, ...args: unknown[]) =>
    console.error(`[SearchService] ${msg}`, ...args),
}

export interface HybridSearchOptions {
  /** Number of results to retrieve from each method */
  retrieveK?: number
  /** Final number of results to return */
  topK?: number
  /** Weight for keyword search (0-1, default: 0.4) */
  keywordWeight?: number
  /** Minimum score threshold */
  minScore?: number
  /** Enable MMR for diversity */
  enableMMR?: boolean
  /** MMR lambda parameter (0-1) */
  mmrLambda?: number
  /** Enable reranking */
  enableReranking?: boolean
  /** Current page path for context */
  currentPath?: string
}

export interface ScoredResult extends SearchResult {
  /** Combined score from RRF */
  finalScore: number
  /** Keyword search score */
  keywordScore?: number
  /** Vector search score */
  vectorScore?: number
  /** Match method */
  matchedBy: 'keyword' | 'vector' | 'both'
}

/**
 * SearchService - Hybrid search combining keyword and vector methods
 */
export class SearchService {
  constructor(private ragService: RAGService) {}

  /**
   * Perform hybrid search combining keyword and vector search
   */
  async hybridSearch(
    query: string,
    options: HybridSearchOptions = {}
  ): Promise<ScoredResult[]> {
    const {
      retrieveK = 10,
      topK = 5,
      keywordWeight = 0.4,
      minScore = 0.3,
      enableMMR = true,
      mmrLambda = 0.7,
      enableReranking = true,
      currentPath,
    } = options

    try {
      // Perform both searches in parallel
      const [keywordResults, vectorResults] = await Promise.all([
        this.performKeywordSearch(query, retrieveK, currentPath),
        this.performVectorSearch(query, retrieveK),
      ])

      // Fuse results using Reciprocal Rank Fusion
      let fusedResults = this.reciprocalRankFusion(
        keywordResults,
        vectorResults,
        keywordWeight
      )

      // Filter by minimum score
      fusedResults = fusedResults.filter((r) => r.finalScore >= minScore)

      // Apply MMR if enabled
      if (enableMMR && fusedResults.length > topK) {
        fusedResults = this.applyMMR(fusedResults, topK, mmrLambda)
      }

      // Apply reranking if enabled
      if (enableReranking) {
        fusedResults = this.rerank(query, fusedResults)
      }

      // Return top K results
      return fusedResults.slice(0, topK)
    } catch (error) {
      logger.error('Error in hybrid search:', error)
      // Fallback to keyword search only
      return this.performKeywordSearch(query, topK, currentPath)
    }
  }

  /**
   * Find related APIs/components based on metadata
   */
  async findRelated(
    metadata: Record<string, unknown>,
    topK = 5
  ): Promise<SearchResult[]> {
    const tags = (metadata.tags as string[]) || []
    const category = (metadata.category as string) || ''

    // Build a search query from metadata
    const query = [category, ...tags].filter(Boolean).join(' ')

    if (!query) {
      return []
    }

    const results = await this.hybridSearch(query, {
      topK,
      minScore: 0.5,
      enableMMR: true,
    })

    return results
  }

  /**
   * Perform keyword search
   */
  private async performKeywordSearch(
    query: string,
    topK: number,
    currentPath?: string
  ): Promise<ScoredResult[]> {
    const results = searchDocumentation(query, {
      topK,
      minScore: 0.01,
      currentPath,
    })

    return results.map((result) => ({
      id: result.chunk.id,
      title: result.chunk.title,
      content: result.chunk.content,
      url: result.chunk.url,
      category: result.chunk.category,
      score: Math.min(result.score / 10, 1),
      metadata: result.chunk.metadata,
      finalScore: Math.min(result.score / 10, 1),
      keywordScore: result.score,
      matchedBy: 'keyword' as const,
    }))
  }

  /**
   * Perform vector search
   */
  private async performVectorSearch(
    query: string,
    topK: number
  ): Promise<ScoredResult[]> {
    try {
      const queryEmbedding = await generateEmbedding(query)
      const vectorStore = getVectorStore()
      await vectorStore.initialize()

      const results = await vectorStore.search(queryEmbedding, topK)

      return results.map((result) => ({
        ...result,
        finalScore: result.score,
        vectorScore: result.score,
        matchedBy: 'vector' as const,
      }))
    } catch (error) {
      logger.error('Error in vector search:', error)
      return []
    }
  }

  /**
   * Reciprocal Rank Fusion (RRF)
   *
   * Combines rankings from multiple search methods using RRF algorithm.
   * RRF score = sum(1 / (k + rank)) for each method
   */
  private reciprocalRankFusion(
    keywordResults: ScoredResult[],
    vectorResults: ScoredResult[],
    keywordWeight: number
  ): ScoredResult[] {
    const k = 60 // RRF constant
    const vectorWeight = 1 - keywordWeight

    // Create a map of all unique results
    const resultsMap = new Map<string, ScoredResult>()

    // Add keyword results
    keywordResults.forEach((result, rank) => {
      const rrfScore = keywordWeight / (k + rank + 1)
      resultsMap.set(result.id, {
        ...result,
        finalScore: rrfScore,
        matchedBy: 'keyword' as const,
      })
    })

    // Add vector results
    vectorResults.forEach((result, rank) => {
      const rrfScore = vectorWeight / (k + rank + 1)
      const existing = resultsMap.get(result.id)

      if (existing) {
        // Result appears in both - combine scores
        resultsMap.set(result.id, {
          ...existing,
          finalScore: existing.finalScore + rrfScore,
          vectorScore: result.score,
          matchedBy: 'both' as const,
        })
      } else {
        // New result from vector search
        resultsMap.set(result.id, {
          ...result,
          finalScore: rrfScore,
          matchedBy: 'vector' as const,
        })
      }
    })

    // Sort by final score
    return Array.from(resultsMap.values()).sort(
      (a, b) => b.finalScore - a.finalScore
    )
  }

  /**
   * Apply Maximal Marginal Relevance (MMR) for result diversity
   *
   * MMR = lambda * relevance - (1-lambda) * max_similarity_to_selected
   */
  private applyMMR(
    results: ScoredResult[],
    topK: number,
    lambda: number
  ): ScoredResult[] {
    const selected: ScoredResult[] = []
    const remaining = [...results]

    while (selected.length < topK && remaining.length > 0) {
      if (selected.length === 0) {
        // Select the highest scored item first
        selected.push(remaining.shift()!)
        continue
      }

      // Calculate MMR score for each remaining item
      let maxMMR = -Infinity
      let maxIndex = 0

      remaining.forEach((candidate, index) => {
        const relevance = candidate.finalScore

        // Calculate max similarity to already selected items
        const maxSimilarity = Math.max(
          ...selected.map((s) => this.calculateSimilarity(s, candidate))
        )

        const mmr = lambda * relevance - (1 - lambda) * maxSimilarity

        if (mmr > maxMMR) {
          maxMMR = mmr
          maxIndex = index
        }
      })

      // Select item with highest MMR
      selected.push(remaining.splice(maxIndex, 1)[0])
    }

    return selected
  }

  /**
   * Calculate similarity between two results (simple content overlap)
   */
  private calculateSimilarity(a: ScoredResult, b: ScoredResult): number {
    // Simple Jaccard similarity based on content words
    const wordsA = new Set(a.content.toLowerCase().split(/\s+/))
    const wordsB = new Set(b.content.toLowerCase().split(/\s+/))

    const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)))
    const union = new Set([...wordsA, ...wordsB])

    return intersection.size / union.size
  }

  /**
   * Rerank results using additional signals
   */
  private rerank(query: string, results: ScoredResult[]): ScoredResult[] {
    return results
      .map((result) => ({
        ...result,
        finalScore: this.calculateRerankedScore(query, result),
      }))
      .sort((a, b) => b.finalScore - a.finalScore)
  }

  /**
   * Calculate reranked score with additional signals
   */
  private calculateRerankedScore(query: string, result: ScoredResult): number {
    let score = result.finalScore

    // Boost for title matches
    const queryTerms = query.toLowerCase().split(/\s+/)
    const titleLower = result.title.toLowerCase()
    const titleMatches = queryTerms.filter((term) =>
      titleLower.includes(term)
    ).length
    score += (titleMatches / queryTerms.length) * 0.1

    // Boost for category relevance
    if (query.includes('component') && result.category === 'component') {
      score += 0.05
    }
    if (query.includes('hook') && result.category === 'hook') {
      score += 0.05
    }
    if (query.includes('example') && result.category === 'example') {
      score += 0.05
    }

    // Boost for recency
    if (result.metadata?.lastUpdated) {
      const daysSinceUpdate =
        (Date.now() - new Date(result.metadata.lastUpdated).getTime()) /
        (1000 * 60 * 60 * 24)
      if (daysSinceUpdate < 7) {
        score += 0.02
      }
    }

    // Boost for results matched by both methods
    if (result.matchedBy === 'both') {
      score += 0.05
    }

    return Math.min(score, 1)
  }
}
