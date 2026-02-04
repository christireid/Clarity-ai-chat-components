import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import type {
  SemanticSearchConfig,
  SemanticSearchResult,
} from '../AdvancedMessageSearchSemantic.types'
import {
  cosineSimilarity,
  keywordSearch,
  expandQuery,
  escapeRegex,
} from '../AdvancedMessageSearchSemantic.utils'

export interface UseSemanticSearchProps {
  /** Messages to search through */
  messages: Message[]
  /** Search configuration */
  config: SemanticSearchConfig
  /** Custom embedding generator */
  onGenerateEmbedding?: (text: string) => Promise<number[]>
  /** Custom reranker */
  onRerank?: (
    query: string,
    results: SemanticSearchResult[]
  ) => Promise<SemanticSearchResult[]>
}

export interface UseSemanticSearchReturn {
  /** Perform search */
  search: (query: string) => Promise<SemanticSearchResult[]>
  /** Expanded query terms */
  expandedQueries: string[]
  /** Clear embeddings cache */
  clearCache: () => void
}

/**
 * Custom hook for semantic message search
 *
 * Handles embedding generation, semantic similarity matching,
 * keyword search, hybrid search, and optional reranking
 */
export function useSemanticSearch({
  messages,
  config,
  onGenerateEmbedding,
  onRerank,
}: UseSemanticSearchProps): UseSemanticSearchReturn {
  // Cache for message embeddings
  const embeddingsCache = React.useRef<Map<string, number[]>>(new Map())
  const [expandedQueries, setExpandedQueries] = React.useState<string[]>([])

  /**
   * Generate embedding for text
   */
  const generateEmbedding = React.useCallback(
    async (text: string): Promise<number[]> => {
      if (embeddingsCache.current.has(text)) {
        return embeddingsCache.current.get(text)!
      }

      if (onGenerateEmbedding) {
        const embedding = await onGenerateEmbedding(text)
        embeddingsCache.current.set(text, embedding)
        return embedding
      }

      // Fallback: generate simple bag-of-words embedding
      const words = text.toLowerCase().split(/\s+/)
      const embedding = new Array(384).fill(0)

      words.forEach((word) => {
        const hash = word.split('').reduce((acc, char) => {
          return ((acc << 5) - acc + char.charCodeAt(0)) | 0
        }, 0)
        const position = Math.abs(hash) % embedding.length
        embedding[position] += 1
      })

      const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
      const normalized = embedding.map((val) => val / (norm || 1))

      embeddingsCache.current.set(text, normalized)
      return normalized
    },
    [onGenerateEmbedding]
  )

  /**
   * Perform semantic search
   */
  const performSemanticSearch = React.useCallback(
    async (searchQuery: string): Promise<SemanticSearchResult[]> => {
      const queries = config.queryExpansion
        ? expandQuery(searchQuery)
        : [searchQuery]

      setExpandedQueries(queries)

      const primaryQuery = queries[0] ?? searchQuery
      const queryEmbedding = await generateEmbedding(primaryQuery)

      const semanticScores = new Map<string, number>()

      for (const message of messages) {
        const messageEmbedding = await generateEmbedding(message.content)
        const similarity = cosineSimilarity(queryEmbedding, messageEmbedding)
        semanticScores.set(message.id, similarity)
      }

      const keywordScores = keywordSearch(searchQuery, messages)

      const combinedResults: SemanticSearchResult[] = []

      messages.forEach((message) => {
        const semanticScore = semanticScores.get(message.id) || 0
        const keywordScore = keywordScores.get(message.id) || 0

        let finalScore = 0
        let matchType: 'semantic' | 'keyword' | 'hybrid' = 'semantic'

        if (config.hybrid.enabled) {
          const normalizedKeywordScore = Math.min(keywordScore / 10, 1)

          finalScore =
            config.hybrid.semanticWeight * semanticScore +
            (1 - config.hybrid.semanticWeight) * normalizedKeywordScore

          matchType = 'hybrid'
        } else {
          finalScore = semanticScore
        }

        if (finalScore >= (config.similarityThreshold || 0.6)) {
          const highlights: string[] = []
          const content = message.content
          const queryTerms = searchQuery.toLowerCase().split(/\s+/)

          queryTerms.forEach((term) => {
            if (term.length < 3) return
            // Escape special regex characters to prevent ReDoS
            const escapedTerm = escapeRegex(term)
            const regex = new RegExp(`(.{0,40})(${escapedTerm})(.{0,40})`, 'gi')
            const match = content.match(regex)
            if (match && match[0]) {
              highlights.push(match[0])
            }
          })

          combinedResults.push({
            message,
            score: finalScore,
            highlights: highlights.slice(0, 3),
            matchType,
            explanation: `${Math.round(finalScore * 100)}% relevance`,
          })
        }
      })

      combinedResults.sort((a, b) => b.score - a.score)

      return combinedResults.slice(0, config.maxResults || 10)
    },
    [messages, config, generateEmbedding]
  )

  /**
   * Search with optional reranking
   */
  const search = React.useCallback(
    async (query: string): Promise<SemanticSearchResult[]> => {
      let results = await performSemanticSearch(query)

      if (config.reranking?.enabled && onRerank) {
        results = await onRerank(query, results)
      }

      return results
    },
    [performSemanticSearch, config.reranking, onRerank]
  )

  /**
   * Clear embeddings cache
   */
  const clearCache = React.useCallback(() => {
    embeddingsCache.current.clear()
  }, [])

  return {
    search,
    expandedQueries,
    clearCache,
  }
}
