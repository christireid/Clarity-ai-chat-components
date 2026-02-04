import * as React from 'react'
import type { Message } from '@clarity-chat/types'

/**
 * Filter criteria for advanced search
 */
export interface SearchFilters {
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
 * Saved search configuration
 */
export interface SavedSearch {
  id: string
  name: string
  filters: SearchFilters
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
export interface FilterPreset {
  id: string
  name: string
  icon: React.ReactNode
  filters: Partial<SearchFilters>
}

/**
 * Extended message type with optional metadata
 */
export type ExtendedMessage = Message & {
  metadata?: Record<string, unknown>
  tokenCount?: number
  attachments?: unknown[]
}

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'csv' | 'md'

/**
 * Size variants for components
 */
export type SizeVariant = 'sm' | 'md' | 'lg'
