/**
 * Type definitions for Advanced Semantic Message Search
 *
 * Extracted from AdvancedMessageSearchSemantic.tsx for better maintainability
 */

import type { Message } from '@clarity-chat/types'

/**
 * Embedding provider configuration
 */
export interface EmbeddingProvider {
  type: 'openai' | 'cohere' | 'huggingface' | 'local' | 'custom'
  model: string
  apiKey?: string
  endpoint?: string
}

/**
 * Semantic search configuration
 */
export interface SemanticSearchConfig {
  /** Embedding provider for vectorization */
  embeddings: EmbeddingProvider
  /** Hybrid search configuration */
  hybrid: {
    enabled: boolean
    /** Weight for semantic search (0-1), remainder is keyword */
    semanticWeight: number
  }
  /** Reranking configuration */
  reranking?: {
    enabled: boolean
    provider: 'cohere' | 'jina' | 'custom'
    apiKey?: string
    endpoint?: string
  }
  /** Multi-language support */
  multiLanguage?: boolean
  /** Query expansion with synonyms */
  queryExpansion?: boolean
  /** Maximum results to return */
  maxResults?: number
  /** Minimum similarity threshold (0-1) */
  similarityThreshold?: number
}

/**
 * Search result with relevance score
 */
export interface SemanticSearchResult {
  message: Message
  score: number
  highlights?: string[]
  matchType: 'semantic' | 'keyword' | 'hybrid'
  explanation?: string
}

/**
 * Props for SemanticMessageSearch
 */
export interface SemanticMessageSearchProps {
  /** Messages to search through */
  messages: Message[]
  /** Search configuration */
  config?: Partial<SemanticSearchConfig>
  /** Callback when results are found */
  onResultsFound?: (results: SemanticSearchResult[]) => void
  /** Callback when a result is selected */
  onResultSelect?: (result: SemanticSearchResult) => void
  /** Callback for custom embedding generation */
  onGenerateEmbedding?: (text: string) => Promise<number[]>
  /** Callback for custom reranking */
  onRerank?: (
    query: string,
    results: SemanticSearchResult[]
  ) => Promise<SemanticSearchResult[]>
  /** Show search history */
  showHistory?: boolean
  /** Show configuration panel */
  showConfig?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Compact mode */
  compact?: boolean
  className?: string
}

/**
 * Search history entry
 */
export interface SearchHistoryEntry {
  query: string
  timestamp: number
  resultCount: number
}

/**
 * Default configuration for semantic search
 */
export const defaultConfig: SemanticSearchConfig = {
  embeddings: {
    type: 'openai',
    model: 'text-embedding-3-small',
  },
  hybrid: {
    enabled: true,
    semanticWeight: 0.7,
  },
  reranking: {
    enabled: false,
    provider: 'cohere',
  },
  multiLanguage: true,
  queryExpansion: true,
  maxResults: 10,
  similarityThreshold: 0.6,
}
