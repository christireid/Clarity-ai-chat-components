/**
 * Shared types for search components
 */

import type { Message } from '@clarity-chat/types'

/**
 * Base filter criteria
 */
export interface BaseSearchFilters {
  /** Text search query */
  query: string
  /** Filter by message role */
  role?: 'user' | 'assistant' | 'system'
  /** Filter by date range */
  dateRange?: {
    start?: Date
    end?: Date
  }
  /** Filter by model (if metadata available) */
  model?: string
  /** Filter by tags/keywords */
  tags?: string[]
  /** Minimum token count */
  minTokens?: number
  /** Maximum token count */
  maxTokens?: number
  /** Include only messages with attachments */
  hasAttachments?: boolean
  /** Include only messages with errors */
  hasErrors?: boolean
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
 * Saved search configuration
 */
export interface SavedSearch<TFilters extends BaseSearchFilters = BaseSearchFilters> {
  id: string
  name: string
  filters: TFilters
  createdAt: number
  lastUsed?: number
}

/**
 * Sort options for results
 */
export type SortOption =
  | 'relevance'
  | 'newest'
  | 'oldest'
  | 'longest'
  | 'shortest'

/**
 * Filter preset configuration
 */
export interface FilterPreset<TFilters extends BaseSearchFilters = BaseSearchFilters> {
  id: string
  name: string
  icon: React.ReactNode
  filters: Partial<TFilters>
}

/**
 * Size variant for search components
 */
export type SearchSize = 'sm' | 'md' | 'lg'

/**
 * Common search result interface
 */
export interface BaseSearchResult {
  message: Message
  score: number
}

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'csv' | 'md'
