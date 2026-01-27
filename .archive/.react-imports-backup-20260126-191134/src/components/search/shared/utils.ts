/**
 * Shared utility functions for search components
 */

import type { Message } from '@clarity-chat/types'
import type { BaseSearchFilters } from './types'

/**
 * Escape special regex characters to prevent ReDoS
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Simple keyword search with TF-IDF-like scoring
 */
export function keywordSearch(
  query: string,
  messages: Message[]
): Map<string, number> {
  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2)
  const scores = new Map<string, number>()
  const queryLower = query.toLowerCase()

  messages.forEach((message) => {
    const content = message.content.toLowerCase()
    let score = 0

    queryTerms.forEach((term) => {
      // Escape special regex characters to prevent ReDoS
      const escapedTerm = escapeRegex(term)
      const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi')
      const matches = content.match(regex)
      if (matches) {
        score += Math.log(1 + matches.length)
      }

      if (content.includes(queryLower)) {
        score += 5
      }
    })

    if (score > 0) {
      scores.set(message.id, score)
    }
  })

  return scores
}

/**
 * Extract highlights from content based on query terms
 */
export function extractHighlights(
  content: string,
  query: string,
  maxHighlights = 3
): string[] {
  const highlights: string[] = []
  const queryTerms = query.toLowerCase().split(/\s+/)

  queryTerms.forEach((term) => {
    if (term.length < 3) return
    // Escape special regex characters to prevent ReDoS
    const escapedTerm = escapeRegex(term)
    const regex = new RegExp(`(.{0,40})(${escapedTerm})(.{0,40})`, 'gi')
    const match = content.match(regex)
    if (match?.[0]) {
      highlights.push(match[0])
    }
  })

  return highlights.slice(0, maxHighlights)
}

/**
 * Apply advanced filters to messages
 */
export function applyFilters(
  messages: Message[],
  filters: BaseSearchFilters
): Message[] {
  let results = [...messages]

  // Filter by role
  if (filters.role) {
    results = results.filter((msg) => msg.role === filters.role)
  }

  // Filter by date range
  if (filters.dateRange) {
    const { start, end } = filters.dateRange
    results = results.filter((msg) => {
      const msgDate = new Date(msg.createdAt)
      if (start && msgDate < start) return false
      if (end && msgDate > end) return false
      return true
    })
  }

  // Filter by model
  if (filters.model) {
    results = results.filter((msg) => {
      const metadata = (
        msg as Message & { metadata?: Record<string, unknown> }
      ).metadata
      return metadata?.model === filters.model
    })
  }

  // Filter by tokens
  if (filters.minTokens || filters.maxTokens) {
    results = results.filter((msg) => {
      const tokenCount =
        (msg as Message & { tokenCount?: number }).tokenCount || 0
      if (filters.minTokens && tokenCount < filters.minTokens) return false
      if (filters.maxTokens && tokenCount > filters.maxTokens) return false
      return true
    })
  }

  // Filter by attachments
  if (filters.hasAttachments) {
    results = results.filter((msg) => {
      return (
        (msg as Message & { attachments?: unknown[] }).attachments &&
        (msg as Message & { attachments?: unknown[] }).attachments!.length > 0
      )
    })
  }

  // Filter by errors
  if (filters.hasErrors) {
    results = results.filter((msg) => msg.status === 'error')
  }

  return results
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: BaseSearchFilters): number {
  let count = 0
  if (filters.role) count++
  if (filters.dateRange?.start || filters.dateRange?.end) count++
  if (filters.model) count++
  if (filters.tags && filters.tags.length > 0) count++
  if (filters.minTokens || filters.maxTokens) count++
  if (filters.hasAttachments) count++
  if (filters.hasErrors) count++
  return count
}

/**
 * Extract unique models from messages
 */
export function extractAvailableModels(messages: Message[]): string[] {
  const models = new Set<string>()
  messages.forEach((msg) => {
    const metadata = (msg as Message & { metadata?: Record<string, unknown> })
      .metadata
    if (metadata?.model && typeof metadata.model === 'string') {
      models.add(metadata.model)
    }
  })
  return Array.from(models)
}

/**
 * Validate search history structure
 */
export function isValidSearchHistory(data: unknown): data is SearchHistoryEntry[] {
  return (
    Array.isArray(data) &&
    data.every(
      (h: unknown) =>
        typeof h === 'object' &&
        h !== null &&
        'query' in h &&
        'timestamp' in h &&
        'resultCount' in h &&
        typeof (h as SearchHistoryEntry).query === 'string' &&
        typeof (h as SearchHistoryEntry).timestamp === 'number' &&
        typeof (h as SearchHistoryEntry).resultCount === 'number'
    )
  )
}

/**
 * Validate saved search structure
 */
export function isValidSavedSearch<T extends BaseSearchFilters>(
  data: unknown
): data is SavedSearch<T>[] {
  return (
    Array.isArray(data) &&
    data.every(
      (s: unknown) =>
        typeof s === 'object' &&
        s !== null &&
        'id' in s &&
        'name' in s &&
        'filters' in s &&
        'createdAt' in s
    )
  )
}

/**
 * Storage helpers
 */
export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set(key: string, value: unknown): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Silently fail
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch {
      // Silently fail
    }
  },
}

interface SearchHistoryEntry {
  query: string
  timestamp: number
  resultCount: number
}

interface SavedSearch<T> {
  id: string
  name: string
  filters: T
  createdAt: number
  lastUsed?: number
}
