/**
 * Advanced Search Utilities for MCP Server
 *
 * Provides fuzzy matching, intelligent search suggestions,
 * and semantic search capabilities.
 *
 * @module utils/search
 */

// =============================================================================
// Search Types
// =============================================================================

export interface SearchOptions {
  /** Minimum similarity score (0-1) */
  threshold?: number
  /** Maximum results to return */
  limit?: number
  /** Fields to search in (for objects) */
  fields?: string[]
  /** Boost scores for specific fields */
  fieldBoosts?: Record<string, number>
  /** Enable fuzzy matching */
  fuzzy?: boolean
  /** Enable prefix matching */
  prefix?: boolean
  /** Enable substring matching */
  substring?: boolean
  /** Case sensitive matching */
  caseSensitive?: boolean
}

export interface SearchResult<T> {
  item: T
  score: number
  matches: SearchMatch[]
}

export interface SearchMatch {
  field: string
  value: string
  indices: [number, number][]
  score: number
}

// =============================================================================
// Search Configuration
// =============================================================================

const SEARCH_LIMITS = {
  /** Maximum query length for search */
  maxQueryLength: 500,
  /** Maximum string length for Levenshtein comparison */
  maxLevenshteinLength: 200,
  /** Maximum items to search through */
  maxSearchItems: 10000,
}

// =============================================================================
// Fuzzy Matching Algorithm
// =============================================================================

/**
 * Calculate Levenshtein distance between two strings
 * Includes length limits to prevent performance issues
 */
function levenshteinDistance(a: string, b: string): number {
  // Limit string lengths to prevent O(n*m) memory issues
  const limitedA = a.slice(0, SEARCH_LIMITS.maxLevenshteinLength)
  const limitedB = b.slice(0, SEARCH_LIMITS.maxLevenshteinLength)

  const matrix: number[][] = []

  for (let i = 0; i <= limitedB.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= limitedA.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= limitedB.length; i++) {
    for (let j = 1; j <= limitedA.length; j++) {
      if (limitedB.charAt(i - 1) === limitedA.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        )
      }
    }
  }

  return matrix[limitedB.length][limitedA.length]
}

/**
 * Calculate similarity score (0-1) between two strings
 */
export function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1
  if (a.length === 0 || b.length === 0) return 0

  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase())
  const maxLength = Math.max(a.length, b.length)
  return 1 - distance / maxLength
}

/**
 * Find matching indices in a string
 */
function findMatchIndices(
  text: string,
  query: string,
  caseSensitive: boolean
): [number, number][] {
  const indices: [number, number][] = []
  const searchText = caseSensitive ? text : text.toLowerCase()
  const searchQuery = caseSensitive ? query : query.toLowerCase()

  let startIndex = 0
  let index: number

  while ((index = searchText.indexOf(searchQuery, startIndex)) !== -1) {
    indices.push([index, index + searchQuery.length - 1])
    startIndex = index + 1
  }

  return indices
}

/**
 * Fuzzy match with character-by-character matching
 */
function fuzzyMatch(
  text: string,
  query: string,
  caseSensitive: boolean
): { matched: boolean; indices: [number, number][]; score: number } {
  const searchText = caseSensitive ? text : text.toLowerCase()
  const searchQuery = caseSensitive ? query : query.toLowerCase()

  const indices: [number, number][] = []
  let queryIndex = 0
  let lastMatchIndex = -1
  let consecutiveMatches = 0
  let maxConsecutive = 0

  for (let i = 0; i < searchText.length && queryIndex < searchQuery.length; i++) {
    if (searchText[i] === searchQuery[queryIndex]) {
      if (lastMatchIndex === i - 1) {
        consecutiveMatches++
        maxConsecutive = Math.max(maxConsecutive, consecutiveMatches)
      } else {
        consecutiveMatches = 1
      }

      if (
        indices.length > 0 &&
        indices[indices.length - 1][1] === i - 1
      ) {
        indices[indices.length - 1][1] = i
      } else {
        indices.push([i, i])
      }

      lastMatchIndex = i
      queryIndex++
    }
  }

  if (queryIndex !== searchQuery.length) {
    return { matched: false, indices: [], score: 0 }
  }

  // Calculate score based on:
  // - Query coverage
  // - Consecutive matches
  // - Position of first match (earlier is better)
  const coverage = searchQuery.length / searchText.length
  const consecutiveBonus = maxConsecutive / searchQuery.length
  const positionBonus = 1 - (indices[0]?.[0] ?? 0) / searchText.length

  const score = (coverage * 0.3 + consecutiveBonus * 0.5 + positionBonus * 0.2)

  return { matched: true, indices, score }
}

// =============================================================================
// Search Engine
// =============================================================================

/**
 * Advanced search engine with fuzzy matching
 */
export class SearchEngine<T> {
  private items: T[] = []
  private defaultOptions: SearchOptions = {
    threshold: 0.3,
    limit: 10,
    fuzzy: true,
    prefix: true,
    substring: true,
    caseSensitive: false,
  }

  constructor(items: T[] = [], defaultOptions?: Partial<SearchOptions>) {
    this.items = items
    if (defaultOptions) {
      this.defaultOptions = { ...this.defaultOptions, ...defaultOptions }
    }
  }

  /**
   * Add items to the search index
   */
  add(items: T | T[]): void {
    const toAdd = Array.isArray(items) ? items : [items]
    this.items.push(...toAdd)
  }

  /**
   * Remove items from the search index
   */
  remove(predicate: (item: T) => boolean): number {
    const initialLength = this.items.length
    this.items = this.items.filter((item) => !predicate(item))
    return initialLength - this.items.length
  }

  /**
   * Clear all items
   */
  clear(): void {
    this.items = []
  }

  /**
   * Search for items matching a query
   */
  search(query: string, options?: Partial<SearchOptions>): SearchResult<T>[] {
    const opts = { ...this.defaultOptions, ...options }
    const { threshold, limit, fields, fieldBoosts, caseSensitive } = opts

    if (!query || query.trim().length === 0) {
      return this.items.slice(0, limit).map((item) => ({
        item,
        score: 1,
        matches: [],
      }))
    }

    // Limit query length to prevent performance issues
    const limitedQuery = query.slice(0, SEARCH_LIMITS.maxQueryLength)

    // Limit items to search through
    const itemsToSearch = this.items.slice(0, SEARCH_LIMITS.maxSearchItems)

    const results: SearchResult<T>[] = []

    for (const item of itemsToSearch) {
      const searchableValues = this.getSearchableValues(item, fields)
      let bestScore = 0
      const allMatches: SearchMatch[] = []

      for (const { field, value } of searchableValues) {
        const matchResult = this.matchValue(value, limitedQuery, opts)

        if (matchResult.score > 0) {
          // Apply field boost if specified
          const boost = fieldBoosts?.[field] ?? 1
          const boostedScore = matchResult.score * boost

          if (boostedScore > bestScore) {
            bestScore = boostedScore
          }

          if (matchResult.indices.length > 0) {
            allMatches.push({
              field,
              value,
              indices: matchResult.indices,
              score: boostedScore,
            })
          }
        }
      }

      if (bestScore >= (threshold ?? 0)) {
        results.push({
          item,
          score: bestScore,
          matches: allMatches,
        })
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score)

    return results.slice(0, limit)
  }

  /**
   * Get searchable values from an item
   */
  private getSearchableValues(
    item: T,
    fields?: string[]
  ): Array<{ field: string; value: string }> {
    if (typeof item === 'string') {
      return [{ field: 'value', value: item }]
    }

    if (typeof item !== 'object' || item === null) {
      return [{ field: 'value', value: String(item) }]
    }

    const values: Array<{ field: string; value: string }> = []
    const fieldsToSearch = fields || Object.keys(item as object)

    for (const field of fieldsToSearch) {
      const value = (item as Record<string, unknown>)[field]
      if (typeof value === 'string') {
        values.push({ field, value })
      } else if (Array.isArray(value)) {
        for (const v of value) {
          if (typeof v === 'string') {
            values.push({ field, value: v })
          }
        }
      }
    }

    return values
  }

  /**
   * Match a value against a query using multiple strategies
   */
  private matchValue(
    value: string,
    query: string,
    options: SearchOptions
  ): { score: number; indices: [number, number][] } {
    const { fuzzy, prefix, substring, caseSensitive } = options
    const compareValue = caseSensitive ? value : value.toLowerCase()
    const compareQuery = caseSensitive ? query : query.toLowerCase()

    // Exact match (highest score)
    if (compareValue === compareQuery) {
      return { score: 1, indices: [[0, value.length - 1]] }
    }

    // Prefix match
    if (prefix && compareValue.startsWith(compareQuery)) {
      const score = 0.9 * (compareQuery.length / compareValue.length + 0.5)
      return {
        score: Math.min(score, 0.95),
        indices: [[0, compareQuery.length - 1]],
      }
    }

    // Substring match
    if (substring && compareValue.includes(compareQuery)) {
      const indices = findMatchIndices(value, query, caseSensitive ?? false)
      const score = 0.7 * (compareQuery.length / compareValue.length + 0.3)
      return { score: Math.min(score, 0.85), indices }
    }

    // Fuzzy match
    if (fuzzy) {
      const fuzzyResult = fuzzyMatch(value, query, caseSensitive ?? false)
      if (fuzzyResult.matched) {
        return { score: fuzzyResult.score * 0.8, indices: fuzzyResult.indices }
      }

      // Fall back to similarity score
      const similarity = stringSimilarity(value, query)
      if (similarity >= (options.threshold ?? 0.3)) {
        return { score: similarity * 0.6, indices: [] }
      }
    }

    return { score: 0, indices: [] }
  }

  /**
   * Get search suggestions based on partial query
   */
  getSuggestions(
    query: string,
    options?: Partial<SearchOptions>
  ): string[] {
    const results = this.search(query, { ...options, limit: 5 })
    const suggestions: string[] = []

    for (const result of results) {
      for (const match of result.matches) {
        if (!suggestions.includes(match.value)) {
          suggestions.push(match.value)
        }
      }
    }

    return suggestions.slice(0, 5)
  }

  /**
   * Get item count
   */
  get count(): number {
    return this.items.length
  }
}

// =============================================================================
// Search Helpers
// =============================================================================

/**
 * Highlight matches in a string
 */
export function highlightMatches(
  text: string,
  indices: [number, number][],
  startTag = '**',
  endTag = '**'
): string {
  if (indices.length === 0) return text

  // Sort indices by start position
  const sorted = [...indices].sort((a, b) => a[0] - b[0])

  let result = ''
  let lastIndex = 0

  for (const [start, end] of sorted) {
    result += text.slice(lastIndex, start)
    result += startTag + text.slice(start, end + 1) + endTag
    lastIndex = end + 1
  }

  result += text.slice(lastIndex)
  return result
}

/**
 * Tokenize a query into words
 */
export function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 0)
}

/**
 * Score a multi-word query match
 */
export function scoreMultiWordMatch(
  text: string,
  query: string,
  options?: Partial<SearchOptions>
): number {
  const tokens = tokenizeQuery(query)
  if (tokens.length === 0) return 0

  const textLower = text.toLowerCase()
  let totalScore = 0
  let matchedTokens = 0

  for (const token of tokens) {
    if (textLower.includes(token)) {
      matchedTokens++
      totalScore += 1
    } else {
      const similarity = stringSimilarity(textLower, token)
      if (similarity > (options?.threshold ?? 0.3)) {
        matchedTokens++
        totalScore += similarity
      }
    }
  }

  return (totalScore / tokens.length) * (matchedTokens / tokens.length)
}

/**
 * Create a search-friendly string from an object
 */
export function createSearchableString(obj: Record<string, unknown>): string {
  const parts: string[] = []

  function extract(value: unknown, prefix = ''): void {
    if (typeof value === 'string') {
      parts.push(value)
    } else if (Array.isArray(value)) {
      for (const item of value) {
        extract(item, prefix)
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const [key, val] of Object.entries(value)) {
        extract(val, prefix ? `${prefix}.${key}` : key)
      }
    }
  }

  extract(obj)
  return parts.join(' ')
}

// =============================================================================
// Pre-built Search Instances
// =============================================================================

/**
 * Component search options
 */
export const componentSearchOptions: SearchOptions = {
  threshold: 0.3,
  limit: 20,
  fields: ['name', 'displayName', 'description', 'tags', 'category'],
  fieldBoosts: {
    name: 2.0,
    displayName: 1.5,
    tags: 1.3,
    category: 1.2,
    description: 1.0,
  },
  fuzzy: true,
  prefix: true,
  substring: true,
}

/**
 * Hook search options
 */
export const hookSearchOptions: SearchOptions = {
  threshold: 0.3,
  limit: 20,
  fields: ['name', 'displayName', 'description', 'tags'],
  fieldBoosts: {
    name: 2.0,
    displayName: 1.5,
    tags: 1.3,
    description: 1.0,
  },
  fuzzy: true,
  prefix: true,
  substring: true,
}
