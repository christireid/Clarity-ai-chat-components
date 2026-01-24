/**
 * Semantic Search Module
 *
 * AI-powered semantic search with vector embeddings and hybrid search capabilities.
 */

export { SemanticMessageSearch } from './semantic-message-search'

export type {
  EmbeddingProvider,
  SemanticSearchConfig,
  SemanticSearchResult,
  SemanticSearchFilters,
  SemanticMessageSearchProps,
  MatchQuality,
} from './types'

export { defaultConfig, DEFAULT_EMBEDDING_DIM, STORAGE_KEYS } from './config'

export {
  cosineSimilarity,
  expandQuery,
  getMatchQuality,
  generateFallbackEmbedding,
} from './utils'

export { useEmbeddings, useSemanticSearch } from './hooks'
export type { UseEmbeddingsOptions, UseSemanticSearchOptions } from './hooks'

export {
  SemanticSearchHeader,
  SemanticSearchInput,
  SemanticSearchResultCard,
  SemanticConfigPanel,
  QueryExpansionPreview,
  SemanticSearchHistory,
} from './components'
