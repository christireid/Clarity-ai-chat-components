/**
 * Default configuration and constants for semantic search
 */

import type { SemanticSearchConfig } from './types'

/**
 * Default semantic search configuration
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

/**
 * Default embedding dimensions for fallback
 */
export const DEFAULT_EMBEDDING_DIM = 384

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  HISTORY: 'clarity-semantic-search-history',
  CONFIG: 'clarity-semantic-search-config',
} as const
