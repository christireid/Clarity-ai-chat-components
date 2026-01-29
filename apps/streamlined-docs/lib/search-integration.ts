/**
 * Search Integration with Priority Configuration
 *
 * Integrates search-config priority scoring with existing search infrastructure.
 * Enhances search results with relevance boosting and synonym expansion.
 *
 * @module search-integration
 */

import type { SearchItem } from './search-data'
import {
  calculateSearchScore,
  expandQueryWithSynonyms,
  isTokenOptimizationQuery,
  type ScoredSearchResult,
} from './search-config'

// ============================================================================
// Types
// ============================================================================

export interface EnhancedSearchResult extends SearchItem {
  /** Relevance score (0-1) */
  score: number
  /** Score breakdown for debugging */
  scoreBreakdown?: ScoredSearchResult
  /** Match type indicator */
  matchType: 'exact' | 'partial' | 'synonym'
}

export interface SearchOptions {
  /** Maximum number of results to return */
  limit?: number
  /** Minimum score threshold (0-1) */
  minScore?: number
  /** Include score breakdown for debugging */
  includeScoreBreakdown?: boolean
  /** Current page path for context-aware boosting */
  currentPath?: string
}

// ============================================================================
// Search Functions
// ============================================================================

/**
 * Enhanced search with priority configuration
 *
 * @param query - Search query string
 * @param items - Search index items
 * @param options - Search options
 * @returns Sorted and scored search results
 */
export function enhancedSearch(
  query: string,
  items: SearchItem[],
  options: SearchOptions = {}
): EnhancedSearchResult[] {
  const {
    limit = 10,
    minScore = 0.1,
    includeScoreBreakdown = false,
    currentPath,
  } = options

  const lowerQuery = query.toLowerCase().trim()

  // Expand query with synonyms
  const expandedQueries = expandQueryWithSynonyms(query)

  // Score all items
  const scoredResults: EnhancedSearchResult[] = items
    .map((item) => {
      // Calculate base score
      const { score: baseScore, matchType } = calculateBaseScore(
        lowerQuery,
        expandedQueries,
        item
      )

      if (baseScore === 0) return null // Skip non-matches

      // Apply context-aware boosting
      let contextBoost = 1.0
      if (currentPath && item.href.startsWith(currentPath)) {
        contextBoost = 1.2 // Boost results from current section
      }

      // Calculate priority score
      const scoreBreakdown = calculateSearchScore(
        baseScore * contextBoost,
        item.href,
        item.type,
        item.category
      )

      return {
        ...item,
        score: scoreBreakdown.finalScore,
        scoreBreakdown: includeScoreBreakdown ? scoreBreakdown : undefined,
        matchType,
      } as EnhancedSearchResult
    })
    .filter((result): result is EnhancedSearchResult => result !== null)

  // Sort by score (descending) and filter by minimum score
  const filtered = scoredResults
    .filter((result) => result.score >= minScore)
    .sort((a, b) => b.score - a.score)

  // Apply limit
  return filtered.slice(0, limit)
}

/**
 * Calculate base relevance score
 *
 * @param query - Lowercase query string
 * @param expandedQueries - Query with synonyms
 * @param item - Search item
 * @returns Base score and match type
 */
function calculateBaseScore(
  query: string,
  expandedQueries: string[],
  item: SearchItem
): { score: number; matchType: 'exact' | 'partial' | 'synonym' } {
  const title = item.title.toLowerCase()
  const description = item.description?.toLowerCase() || ''
  const category = item.category?.toLowerCase() || ''
  const href = item.href.toLowerCase()

  // Exact title match (highest score)
  if (title === query) {
    return { score: 1.0, matchType: 'exact' }
  }

  // Exact phrase in title
  if (title.includes(query)) {
    const position = title.indexOf(query)
    const positionScore = 1 - position / title.length // Earlier = higher score
    return { score: 0.8 + positionScore * 0.2, matchType: 'exact' }
  }

  // Check for word matches in title
  const queryWords = query.split(/\s+/)
  const titleWords = title.split(/\s+/)

  const titleWordMatches = queryWords.filter((word) =>
    titleWords.some((titleWord) => titleWord.includes(word) || word.includes(titleWord))
  ).length

  if (titleWordMatches === queryWords.length) {
    return { score: 0.7, matchType: 'partial' }
  }

  if (titleWordMatches > 0) {
    return {
      score: 0.5 + (titleWordMatches / queryWords.length) * 0.2,
      matchType: 'partial',
    }
  }

  // Check expanded queries (synonyms)
  for (const expandedQuery of expandedQueries) {
    if (expandedQuery === query) continue // Skip original query

    if (title.includes(expandedQuery)) {
      return { score: 0.6, matchType: 'synonym' }
    }

    if (description.includes(expandedQuery)) {
      return { score: 0.4, matchType: 'synonym' }
    }

    if (href.includes(expandedQuery.replace(/\s+/g, '-'))) {
      return { score: 0.5, matchType: 'synonym' }
    }
  }

  // Description match
  if (description.includes(query)) {
    return { score: 0.4, matchType: 'partial' }
  }

  // Category match
  if (category.includes(query)) {
    return { score: 0.3, matchType: 'partial' }
  }

  // URL path match
  if (href.includes(query.replace(/\s+/g, '-'))) {
    return { score: 0.35, matchType: 'partial' }
  }

  // No match
  return { score: 0, matchType: 'partial' }
}

/**
 * Token optimization aware search
 *
 * Special handling for token/cost-related queries to ensure
 * token optimization content appears in top results.
 *
 * @param query - Search query
 * @param items - Search items
 * @param options - Search options
 * @returns Enhanced search results with token content boosted
 */
export function tokenOptimizationSearch(
  query: string,
  items: SearchItem[],
  options: SearchOptions = {}
): EnhancedSearchResult[] {
  // First check if this is a token-related query
  if (!isTokenOptimizationQuery(query)) {
    // Not a token query, use standard search
    return enhancedSearch(query, items, options)
  }

  // Token-related query: boost token content
  const results = enhancedSearch(query, items, {
    ...options,
    limit: (options.limit || 10) * 2, // Get more results initially
  })

  // Apply additional boost to token optimization content
  const boostedResults = results.map((result) => {
    if (
      result.href.includes('token') ||
      result.title.toLowerCase().includes('token') ||
      result.category?.includes('token')
    ) {
      return {
        ...result,
        score: result.score * 1.3, // 30% boost for token content
      }
    }
    return result
  })

  // Re-sort and apply limit
  return boostedResults
    .sort((a, b) => b.score - a.score)
    .slice(0, options.limit || 10)
}

/**
 * Get search suggestions based on query
 *
 * Provides autocomplete suggestions for partial queries.
 *
 * @param query - Partial query string
 * @param items - Search items
 * @param limit - Maximum suggestions to return
 * @returns Top matching titles
 */
export function getSearchSuggestions(
  query: string,
  items: SearchItem[],
  limit: number = 5
): string[] {
  if (query.length < 2) return []

  const lowerQuery = query.toLowerCase()

  const matches = items
    .filter((item) => {
      const title = item.title.toLowerCase()
      return title.includes(lowerQuery)
    })
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase()
      const bTitle = b.title.toLowerCase()

      // Prioritize matches at start of title
      const aIndex = aTitle.indexOf(lowerQuery)
      const bIndex = bTitle.indexOf(lowerQuery)

      if (aIndex !== bIndex) {
        return aIndex - bIndex
      }

      // Then by title length (shorter = more relevant)
      return aTitle.length - bTitle.length
    })
    .slice(0, limit)
    .map((item) => item.title)

  return [...new Set(matches)] // Remove duplicates
}

/**
 * Group search results by category
 *
 * @param results - Search results
 * @returns Results grouped by category
 */
export function groupResultsByCategory(
  results: EnhancedSearchResult[]
): Record<string, EnhancedSearchResult[]> {
  const grouped: Record<string, EnhancedSearchResult[]> = {}

  for (const result of results) {
    const category = result.category || 'other'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(result)
  }

  return grouped
}

/**
 * Get related content based on current page
 *
 * @param currentPath - Current page path
 * @param items - All search items
 * @param limit - Maximum results to return
 * @returns Related content items
 */
export function getRelatedContent(
  currentPath: string,
  items: SearchItem[],
  limit: number = 5
): SearchItem[] {
  // Extract category from current path
  const pathParts = currentPath.split('/').filter(Boolean)
  const category = pathParts[0] || ''

  // Find items in same category, excluding current page
  const related = items
    .filter((item) => {
      if (item.href === currentPath) return false
      if (!item.category) return false

      // Match category or path prefix
      return (
        item.category === category ||
        item.href.startsWith(`/${category}/`)
      )
    })
    .slice(0, limit)

  return related
}

// ============================================================================
// Export
// ============================================================================

export default {
  enhancedSearch,
  tokenOptimizationSearch,
  getSearchSuggestions,
  groupResultsByCategory,
  getRelatedContent,
}
