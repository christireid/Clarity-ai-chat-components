/**
 * Shared Search Utilities and Types
 *
 * Common functionality used across all search components.
 */

export type {
  BaseSearchFilters,
  SearchHistoryEntry,
  SavedSearch,
  SortOption,
  FilterPreset,
  SearchSize,
  BaseSearchResult,
  ExportFormat,
} from './types'

export {
  escapeRegex,
  keywordSearch,
  extractHighlights,
  applyFilters,
  countActiveFilters,
  extractAvailableModels,
  isValidSearchHistory,
  isValidSavedSearch,
  storage,
} from './utils'
