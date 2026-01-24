/**
 * Search Components
 *
 * Message and conversation search functionality including
 * basic search, advanced search, and semantic search.
 */

export { MessageSearch, MessageSearchWithSuspense } from './message-search'
export { AdvancedMessageSearch } from './advanced-message-search'

// Semantic search (modular)
export { SemanticMessageSearch } from './semantic'
export type {
  SemanticMessageSearchProps,
  SemanticSearchConfig,
  SemanticSearchResult,
  EmbeddingProvider,
} from './semantic'

// Types
export type { AdvancedMessageSearchProps } from './advanced-message-search'
export type {
  SearchFilters,
  SavedSearch,
  SortOption,
  FilterPreset,
  ExtendedMessage,
  ExportFormat,
  SizeVariant,
} from './types'

// Shared types and utilities
export type {
  BaseSearchFilters,
  SearchHistoryEntry,
  SearchSize,
  BaseSearchResult,
} from './shared'

export {
  escapeRegex,
  keywordSearch,
  extractHighlights,
  applyFilters,
  countActiveFilters,
  extractAvailableModels,
  storage,
} from './shared'

// Subcomponents (for advanced usage)
export {
  ActiveFiltersPills,
  SavedSearchesPanel,
  SearchFiltersPanel,
  SearchResultsSummary,
} from './components'

export type {
  ActiveFiltersPillsProps,
  SavedSearchesPanelProps,
  SearchFiltersPanelProps,
  SearchResultsSummaryProps,
} from './components'

// Hooks (for custom implementations)
export {
  useFilteredMessages,
  useSavedSearches,
  useActiveFilterCount,
} from './hooks'

// Semantic search hooks
export { useEmbeddings, useSemanticSearch } from './semantic'

// Constants
export { defaultPresets, STORAGE_KEY_SAVED, STORAGE_KEY_RECENT } from './constants'
