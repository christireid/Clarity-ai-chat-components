/**
 * Hook for performing semantic search
 */

import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import type { SemanticSearchConfig, SemanticSearchResult } from '../types'
import { keywordSearch, extractHighlights } from '../../shared/utils'
import { cosineSimilarity, expandQuery } from '../utils'
import { useEmbeddings } from './use-embeddings'

export interface UseSemanticSearchOptions {
  messages: Message[]
  config: SemanticSearchConfig
  onGenerateEmbedding?: (text: string) => Promise<number[]>
  onRerank?: (
    query: string,
    results: SemanticSearchResult[]
  ) => Promise<SemanticSearchResult[]>
}

export function useSemanticSearch({
  messages,
  config,
  onGenerateEmbedding,
  onRerank,
}: UseSemanticSearchOptions) {
  const { generateEmbedding } = useEmbeddings({ onGenerateEmbedding })
  const [expandedQueries, setExpandedQueries] = React.useState<string[]>([])

  const performSearch = React.useCallback(
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
          const highlights = extractHighlights(message.content, searchQuery)

          combinedResults.push({
            message,
            score: finalScore,
            highlights,
            matchType,
            explanation: `${Math.round(finalScore * 100)}% relevance`,
          })
        }
      })

      combinedResults.sort((a, b) => b.score - a.score)

      let results = combinedResults.slice(0, config.maxResults || 10)

      // Apply reranking if enabled
      if (config.reranking?.enabled && onRerank) {
        results = await onRerank(searchQuery, results)
      }

      return results
    },
    [messages, config, generateEmbedding, onRerank]
  )

  return {
    performSearch,
    expandedQueries,
  }
}
