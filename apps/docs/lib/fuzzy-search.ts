/**
 * Fuzzy Search Utility
 *
 * Provides fuzzy matching and scoring for search results.
 * Prioritizes exact matches, prefix matches, word boundary matches, and substring matches.
 */

export interface FuzzyMatch {
  item: unknown
  score: number
  matches: {
    field: string
    indices: [number, number][]
  }[]
}

/**
 * Calculate fuzzy match score between query and text
 * Higher score = better match
 *
 * Scoring:
 * - Exact match: 100
 * - Starts with query: 80
 * - Word boundary match: 60
 * - Contains query: 40
 * - Fuzzy character match: 20
 * - No match: 0
 */
export function fuzzyScore(query: string, text: string): number {
  if (!query || !text) return 0

  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  // Exact match
  if (textLower === queryLower) return 100

  // Starts with query
  if (textLower.startsWith(queryLower))
    return 80 + (queryLower.length / textLower.length) * 10

  // Word boundary match (camelCase, spaces, hyphens)
  // Split on original text to preserve camelCase boundaries, then lowercase
  const words = text
    .split(/[\s\-_]+|(?=[A-Z])/g)
    .map((w) => w.toLowerCase())
    .filter(Boolean)
  for (const word of words) {
    if (word.startsWith(queryLower)) {
      return 60 + (queryLower.length / word.length) * 10
    }
  }

  // Contains query
  if (textLower.includes(queryLower)) {
    const index = textLower.indexOf(queryLower)
    // Earlier position = higher score
    return 40 + Math.max(0, 10 - index / 10)
  }

  // Fuzzy character matching (all query chars in order)
  let queryIndex = 0
  let matchedChars = 0
  let consecutiveBonus = 0
  let lastMatchIndex = -1

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      matchedChars++
      // Bonus for consecutive matches
      if (lastMatchIndex === i - 1) {
        consecutiveBonus += 2
      }
      lastMatchIndex = i
      queryIndex++
    }
  }

  if (queryIndex === queryLower.length) {
    // All query characters found in order
    const matchRatio = matchedChars / queryLower.length
    return 20 + matchRatio * 10 + consecutiveBonus
  }

  return 0
}

/**
 * Find fuzzy matches for a query in a list of items
 */
export function fuzzySearch<T>(
  query: string,
  items: T[],
  getFields: (item: T) => { field: string; value: string; weight?: number }[]
): (T & { _score: number })[] {
  if (!query.trim()) {
    return items.map((item) => ({ ...item, _score: 0 }))
  }

  const results = items.map((item) => {
    const fields = getFields(item)
    let totalScore = 0
    let maxScore = 0

    for (const { value, weight = 1 } of fields) {
      const score = fuzzyScore(query, value) * weight
      totalScore += score
      maxScore = Math.max(maxScore, score)
    }

    // Use max score as primary, total as secondary
    const finalScore = maxScore + totalScore * 0.1

    return {
      ...item,
      _score: finalScore,
    }
  })

  // Filter out zero scores and sort by score descending
  return results.filter((r) => r._score > 0).sort((a, b) => b._score - a._score)
}

/**
 * Highlight matched portions of text
 */
export function highlightMatches(query: string, text: string): string {
  if (!query || !text) return text

  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  // Find the match position
  const index = textLower.indexOf(queryLower)
  if (index === -1) return text

  const before = text.slice(0, index)
  const match = text.slice(index, index + query.length)
  const after = text.slice(index + query.length)

  return `${before}<mark>${match}</mark>${after}`
}
