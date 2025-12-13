'use client'

import { useDeferredValue, useMemo, useCallback, useRef, useEffect, useState } from 'react'
import type { Message } from '@clarity-chat/types'

/**
 * Search options for customizing search behavior
 */
export interface DeferredSearchOptions {
  /** Case-sensitive search (default: false) */
  caseSensitive?: boolean
  /** Match whole words only (default: false) */
  wholeWord?: boolean
  /** Use regular expression matching (default: false) */
  useRegex?: boolean
  /** Minimum query length to trigger search (default: 1) */
  minQueryLength?: number
  /** Fields to search in (default: ['content']) */
  searchFields?: ('content' | 'metadata' | 'role' | 'id')[]
  /** Enable fuzzy matching (default: false) */
  fuzzyMatch?: boolean
  /** Fuzzy match threshold 0-1 (default: 0.6) */
  fuzzyThreshold?: number
  /** Maximum results to return (default: unlimited) */
  maxResults?: number
  /** Debounce delay in ms (default: 0 - uses deferred value) */
  debounceMs?: number
}

/**
 * Search match information for highlighting
 */
export interface SearchMatch {
  /** Message that matched */
  message: Message
  /** Score for ranking (higher is better) */
  score: number
  /** Match positions for highlighting */
  matches: {
    field: string
    indices: [number, number][]
  }[]
}

/**
 * Return type for useDeferredSearch hook
 */
export interface DeferredSearchResult {
  /** Filtered messages matching the query */
  filteredMessages: Message[]
  /** Whether search is in progress */
  isPending: boolean
  /** Original query as entered */
  searchQuery: string
  /** Deferred query being processed */
  deferredQuery: string
  /** Detailed match information for highlighting */
  matchInfo: Map<string, SearchMatch>
  /** Total matches found */
  totalMatches: number
  /** Clear the search */
  clearSearch: () => void
}

const defaultOptions: DeferredSearchOptions = {
  caseSensitive: false,
  wholeWord: false,
  useRegex: false,
  minQueryLength: 1,
  searchFields: ['content'],
  fuzzyMatch: false,
  fuzzyThreshold: 0.6,
  maxResults: undefined,
  debounceMs: 0,
}

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0]![j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j - 1]! + 1, // substitution
          matrix[i]![j - 1]! + 1, // insertion
          matrix[i - 1]![j]! + 1 // deletion
        )
      }
    }
  }

  return matrix[b.length]![a.length]!
}

/**
 * Calculate fuzzy match score (0-1)
 */
function fuzzyScore(query: string, text: string): number {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  // Exact match
  if (textLower === queryLower) return 1

  // Contains exact match
  if (textLower.includes(queryLower)) {
    return 0.9 - (textLower.indexOf(queryLower) / textLower.length) * 0.1
  }

  // Word-level matching
  const queryWords = queryLower.split(/\s+/)
  const textWords = textLower.split(/\s+/)

  let matchedWords = 0
  let totalScore = 0

  for (const qWord of queryWords) {
    let bestMatch = 0
    for (const tWord of textWords) {
      if (tWord.includes(qWord)) {
        bestMatch = Math.max(bestMatch, 0.8)
      } else if (qWord.includes(tWord)) {
        bestMatch = Math.max(bestMatch, 0.7)
      } else {
        // Levenshtein distance based score
        const distance = levenshteinDistance(qWord, tWord)
        const maxLen = Math.max(qWord.length, tWord.length)
        const similarity = 1 - distance / maxLen
        if (similarity > 0.6) {
          bestMatch = Math.max(bestMatch, similarity * 0.6)
        }
      }
    }
    if (bestMatch > 0) {
      matchedWords++
      totalScore += bestMatch
    }
  }

  if (matchedWords === 0) return 0
  return (totalScore / queryWords.length) * (matchedWords / queryWords.length)
}

/**
 * Find all match indices in text
 */
function findMatchIndices(text: string, query: string, options: DeferredSearchOptions): [number, number][] {
  const indices: [number, number][] = []
  const searchText = options.caseSensitive ? text : text.toLowerCase()
  const searchQuery = options.caseSensitive ? query : query.toLowerCase()

  if (options.useRegex) {
    try {
      const flags = options.caseSensitive ? 'g' : 'gi'
      const regex = new RegExp(query, flags)
      let match
      while ((match = regex.exec(text)) !== null) {
        indices.push([match.index, match.index + match[0].length])
        if (match.index === regex.lastIndex) {
          regex.lastIndex++
        }
      }
    } catch {
      // Invalid regex, fall through to normal search
    }
  }

  if (indices.length === 0) {
    if (options.wholeWord) {
      const wordRegex = new RegExp(
        `\\b${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
        options.caseSensitive ? 'g' : 'gi'
      )
      let match
      while ((match = wordRegex.exec(text)) !== null) {
        indices.push([match.index, match.index + match[0].length])
      }
    } else {
      let pos = 0
      while ((pos = searchText.indexOf(searchQuery, pos)) !== -1) {
        indices.push([pos, pos + searchQuery.length])
        pos += 1
      }
    }
  }

  return indices
}

/**
 * Hook for deferred search with React 18 concurrent features
 *
 * Uses useDeferredValue to defer expensive search operations,
 * keeping the UI responsive while searching through messages.
 * Includes advanced features like fuzzy matching, regex support,
 * and match highlighting information.
 *
 * @param messages - Array of messages to search through
 * @param searchQuery - Current search query
 * @param options - Search configuration options
 * @returns Search results with filtering and match information
 *
 * @example
 * ```tsx
 * const {
 *   filteredMessages,
 *   isPending,
 *   matchInfo,
 *   clearSearch
 * } = useDeferredSearch(messages, searchQuery, {
 *   fuzzyMatch: true,
 *   searchFields: ['content', 'metadata'],
 *   maxResults: 50,
 * })
 *
 * return (
 *   <div>
 *     {isPending && <SearchingIndicator />}
 *     {filteredMessages.map(msg => (
 *       <Message
 *         key={msg.id}
 *         {...msg}
 *         highlights={matchInfo.get(msg.id)?.matches}
 *       />
 *     ))}
 *   </div>
 * )
 * ```
 */
export function useDeferredSearch(
  messages: Message[],
  searchQuery: string,
  options?: Partial<DeferredSearchOptions>
): DeferredSearchResult {
  const opts = useMemo(() => ({ ...defaultOptions, ...options }), [options])

  // Debounce state for custom debounce
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  const debounceTimerRef = useRef<NodeJS.Timeout>()

  // Handle custom debounce
  useEffect(() => {
    if (opts.debounceMs && opts.debounceMs > 0) {
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedQuery(searchQuery)
      }, opts.debounceMs)

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
      }
    } else {
      setDebouncedQuery(searchQuery)
    }
  }, [searchQuery, opts.debounceMs])

  // Use React's deferred value for automatic priority handling
  const reactDeferredQuery = useDeferredValue(debouncedQuery)

  // Check if the deferred value is behind the actual value
  const isPending = searchQuery !== reactDeferredQuery

  // Perform the search operation
  const searchResult = useMemo(() => {
    const matchInfo = new Map<string, SearchMatch>()

    // Check minimum query length
    if (!reactDeferredQuery.trim() || reactDeferredQuery.length < opts.minQueryLength!) {
      return {
        filtered: messages,
        matchInfo,
        totalMatches: 0,
      }
    }

    const query = reactDeferredQuery.trim()
    const results: { message: Message; score: number; match: SearchMatch }[] = []

    for (const message of messages) {
      let totalScore = 0
      const matches: { field: string; indices: [number, number][] }[] = []

      // Search in specified fields
      for (const field of opts.searchFields!) {
        let fieldValue = ''

        switch (field) {
          case 'content':
            fieldValue = message.content
            break
          case 'metadata':
            if (message.metadata) {
              fieldValue = JSON.stringify(message.metadata)
            }
            break
          case 'role':
            fieldValue = message.role
            break
          case 'id':
            fieldValue = message.id
            break
        }

        if (!fieldValue) continue

        // Calculate match score
        let fieldScore = 0
        let indices: [number, number][] = []

        if (opts.fuzzyMatch) {
          const fScore = fuzzyScore(query, fieldValue)
          if (fScore >= opts.fuzzyThreshold!) {
            fieldScore = fScore
            // For fuzzy matches, find best matching positions
            const queryWords = query.toLowerCase().split(/\s+/)
            for (const qWord of queryWords) {
              const pos = fieldValue.toLowerCase().indexOf(qWord)
              if (pos !== -1) {
                indices.push([pos, pos + qWord.length])
              }
            }
          }
        } else {
          indices = findMatchIndices(fieldValue, query, opts)
          if (indices.length > 0) {
            // Score based on number of matches and position
            fieldScore = indices.length * 0.2
            // Bonus for early match
            fieldScore += (1 - indices[0]![0] / fieldValue.length) * 0.3
            // Normalize
            fieldScore = Math.min(fieldScore, 1)
          }
        }

        if (fieldScore > 0) {
          totalScore += fieldScore
          if (indices.length > 0) {
            matches.push({ field, indices })
          }
        }
      }

      if (totalScore > 0) {
        const searchMatch: SearchMatch = {
          message,
          score: totalScore,
          matches,
        }
        results.push({ message, score: totalScore, match: searchMatch })
      }
    }

    // Sort by score
    results.sort((a, b) => b.score - a.score)

    // Apply max results limit
    const limitedResults = opts.maxResults
      ? results.slice(0, opts.maxResults)
      : results

    // Build match info map
    for (const result of limitedResults) {
      matchInfo.set(result.message.id, result.match)
    }

    return {
      filtered: limitedResults.map((r) => r.message),
      matchInfo,
      totalMatches: results.length,
    }
  }, [messages, reactDeferredQuery, opts])

  // Clear search callback
  const clearSearch = useCallback(() => {
    // This is a no-op - the actual state is managed externally
    // But we provide it for convenience
  }, [])

  return {
    filteredMessages: searchResult.filtered,
    isPending,
    searchQuery,
    deferredQuery: reactDeferredQuery,
    matchInfo: searchResult.matchInfo,
    totalMatches: searchResult.totalMatches,
    clearSearch,
  }
}

/**
 * Utility function to highlight text based on match indices
 *
 * @example
 * ```tsx
 * const highlighted = highlightText(
 *   message.content,
 *   matchInfo.get(message.id)?.matches.find(m => m.field === 'content')?.indices || [],
 *   (text, isHighlight) => isHighlight ? <mark>{text}</mark> : text
 * )
 * ```
 */
export function highlightText<T>(
  text: string,
  indices: [number, number][],
  renderer: (text: string, isHighlight: boolean, index: number) => T
): T[] {
  if (indices.length === 0) {
    return [renderer(text, false, 0)]
  }

  // Sort indices by start position
  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0])

  // Merge overlapping indices
  const mergedIndices: [number, number][] = []
  for (const [start, end] of sortedIndices) {
    if (mergedIndices.length === 0) {
      mergedIndices.push([start, end])
    } else {
      const last = mergedIndices[mergedIndices.length - 1]!
      if (start <= last[1]) {
        last[1] = Math.max(last[1], end)
      } else {
        mergedIndices.push([start, end])
      }
    }
  }

  const parts: T[] = []
  let lastEnd = 0
  let partIndex = 0

  for (const [start, end] of mergedIndices) {
    // Add non-highlighted text before match
    if (start > lastEnd) {
      parts.push(renderer(text.slice(lastEnd, start), false, partIndex++))
    }
    // Add highlighted text
    parts.push(renderer(text.slice(start, end), true, partIndex++))
    lastEnd = end
  }

  // Add remaining text
  if (lastEnd < text.length) {
    parts.push(renderer(text.slice(lastEnd), false, partIndex++))
  }

  return parts
}

/**
 * Simple string highlight utility with HTML mark tags
 */
export function highlightSearchText(text: string, query: string, className?: string): string {
  if (!query.trim()) return text

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const highlightClass = className || 'bg-yellow-200 dark:bg-yellow-900/50'

  return text.replace(regex, `<mark class="${highlightClass}">$1</mark>`)
}

/**
 * React component version of highlight
 */
export function HighlightedText({
  text,
  query,
  className,
  highlightClassName,
}: {
  text: string
  query: string
  className?: string
  highlightClassName?: string
}) {
  if (!query.trim()) {
    return <span className={className}>{text}</span>
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const parts = text.split(regex)

  return (
    <span className={className}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className={
              highlightClassName ||
              'bg-yellow-200 dark:bg-yellow-900/50 text-inherit rounded-sm px-0.5'
            }
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  )
}
