/**
 * This file re-exports the refactored semantic search component
 * for backward compatibility while the old file is being deprecated.
 */

export { SemanticMessageSearch } from './semantic'
export type {
  SemanticMessageSearchProps,
  SemanticSearchConfig,
  SemanticSearchResult,
  EmbeddingProvider,
} from './semantic'
