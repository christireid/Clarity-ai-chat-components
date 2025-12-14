/**
 * Premium Fuzzy Search Utilities
 *
 * Industry-leading fuzzy search with:
 * - Multiple matching strategies (exact, prefix, substring, fuzzy)
 * - Intelligent scoring with position weighting
 * - Typo tolerance with configurable threshold
 * - Word boundary awareness (camelCase, kebab-case, snake_case)
 * - Highlight generation with match positions
 * - Performance optimizations for large datasets
 */

export interface FuzzyMatch {
  item: unknown
  score: number
  matches: {
    field: string
    indices: [number, number][]
  }[]
  matchType?: 'exact' | 'startsWith' | 'wordBoundary' | 'contains' | 'fuzzy'
}

export interface FuzzySearchOptions {
  /** Minimum score to include in results (0-100, default: 0) */
  threshold?: number
  /** Maximum results to return (default: unlimited) */
  limit?: number
  /** Enable case-sensitive search (default: false) */
  caseSensitive?: boolean
  /** Maximum typo distance for fuzzy matching (default: 2) */
  maxTypoDistance?: number
  /** Enable phonetic matching (default: false) */
  phonetic?: boolean
  /** Custom weights for scoring */
  weights?: {
    exact?: number
    startsWith?: number
    wordBoundary?: number
    contains?: number
    fuzzy?: number
  }
}

const defaultWeights = {
  exact: 100,
  startsWith: 80,
  wordBoundary: 60,
  contains: 40,
  fuzzy: 20,
}

/**
 * Calculate Damerau-Levenshtein distance (includes transpositions)
 * More accurate than standard Levenshtein for typo detection
 */
function damerauLevenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  if (a === b) return 0

  const aLen = a.length
  const bLen = b.length

  // Use optimized array instead of full matrix for small strings
  if (aLen <= 32 && bLen <= 32) {
    const matrix: number[][] = []

    for (let i = 0; i <= bLen; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= aLen; j++) {
      matrix[0]![j] = j
    }

    for (let i = 1; i <= bLen; i++) {
      for (let j = 1; j <= aLen; j++) {
        const cost = a.charAt(j - 1) === b.charAt(i - 1) ? 0 : 1
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j]! + 1,
          matrix[i]![j - 1]! + 1,
          matrix[i - 1]![j - 1]! + cost
        )

        // Transposition
        if (
          i > 1 &&
          j > 1 &&
          a.charAt(j - 1) === b.charAt(i - 2) &&
          a.charAt(j - 2) === b.charAt(i - 1)
        ) {
          matrix[i]![j] = Math.min(matrix[i]![j]!, matrix[i - 2]![j - 2]! + cost)
        }
      }
    }

    return matrix[bLen]![aLen]!
  }

  // For longer strings, use standard algorithm with early termination
  let prevPrev: number[] = []
  let prev: number[] = []
  let curr: number[] = []

  for (let j = 0; j <= aLen; j++) {
    prev[j] = j
  }

  for (let i = 1; i <= bLen; i++) {
    curr[0] = i

    for (let j = 1; j <= aLen; j++) {
      const cost = a.charAt(j - 1) === b.charAt(i - 1) ? 0 : 1
      curr[j] = Math.min(prev[j]! + 1, curr[j - 1]! + 1, prev[j - 1]! + cost)
    }

    prevPrev = prev
    prev = curr
    curr = []
  }

  return prev[aLen]!
}

/**
 * Find word boundaries in text (camelCase, kebab-case, snake_case, etc.)
 */
function findWordBoundaries(text: string): number[] {
  const boundaries = [0]

  for (let i = 1; i < text.length; i++) {
    const prevChar = text.charAt(i - 1)
    const currChar = text.charAt(i)

    // camelCase boundary
    if (/[a-z]/.test(prevChar) && /[A-Z]/.test(currChar)) {
      boundaries.push(i)
    }
    // kebab-case or snake_case boundary
    else if (prevChar === '-' || prevChar === '_' || prevChar === ' ') {
      boundaries.push(i)
    }
    // Number to letter boundary
    else if (/\d/.test(prevChar) && /[a-zA-Z]/.test(currChar)) {
      boundaries.push(i)
    }
    // Letter to number boundary
    else if (/[a-zA-Z]/.test(prevChar) && /\d/.test(currChar)) {
      boundaries.push(i)
    }
  }

  return boundaries
}

/**
 * Simple phonetic encoding (Soundex-like)
 */
function phoneticEncode(text: string): string {
  if (!text) return ''

  const map: Record<string, string> = {
    b: '1', f: '1', p: '1', v: '1',
    c: '2', g: '2', j: '2', k: '2', q: '2', s: '2', x: '2', z: '2',
    d: '3', t: '3',
    l: '4',
    m: '5', n: '5',
    r: '6',
  }

  let encoded = text.charAt(0).toUpperCase()
  let lastCode = map[text.charAt(0).toLowerCase()] || ''

  for (let i = 1; i < text.length && encoded.length < 4; i++) {
    const char = text.charAt(i).toLowerCase()
    const code = map[char] || ''

    if (code && code !== lastCode) {
      encoded += code
      lastCode = code
    } else if (!code && !/[aeiouyhw]/.test(char)) {
      lastCode = ''
    }
  }

  return encoded.padEnd(4, '0')
}

/**
 * Calculate fuzzy match score between query and text
 * Higher score = better match
 *
 * Scoring hierarchy:
 * - Exact match: 100
 * - Starts with query: 80 + position bonus
 * - Word boundary match: 60 + position bonus
 * - Contains query: 40 + position bonus
 * - Fuzzy character match: 20 + sequence bonus
 * - No match: 0
 */
export function fuzzyScore(
  query: string,
  text: string,
  options?: FuzzySearchOptions
): { score: number; matchType: FuzzyMatch['matchType']; indices: [number, number][] } {
  if (!query || !text) return { score: 0, matchType: 'fuzzy', indices: [] }

  const weights = { ...defaultWeights, ...options?.weights }
  const caseSensitive = options?.caseSensitive ?? false
  const maxTypoDistance = options?.maxTypoDistance ?? 2

  const queryLower = caseSensitive ? query : query.toLowerCase()
  const textLower = caseSensitive ? text : text.toLowerCase()

  // Exact match
  if (textLower === queryLower) {
    return {
      score: weights.exact,
      matchType: 'exact',
      indices: [[0, text.length]],
    }
  }

  // Starts with query
  if (textLower.startsWith(queryLower)) {
    const lengthBonus = (queryLower.length / textLower.length) * 10
    return {
      score: weights.startsWith + lengthBonus,
      matchType: 'startsWith',
      indices: [[0, query.length]],
    }
  }

  // Word boundary match (camelCase, spaces, hyphens)
  const boundaries = findWordBoundaries(text)
  for (const boundary of boundaries) {
    const fromBoundary = textLower.slice(boundary)
    if (fromBoundary.startsWith(queryLower)) {
      const positionBonus = (1 - boundary / text.length) * 10
      return {
        score: weights.wordBoundary + positionBonus,
        matchType: 'wordBoundary',
        indices: [[boundary, boundary + query.length]],
      }
    }
  }

  // Contains query
  const containsIndex = textLower.indexOf(queryLower)
  if (containsIndex !== -1) {
    // Earlier position = higher score
    const positionBonus = Math.max(0, 10 - containsIndex / 10)
    return {
      score: weights.contains + positionBonus,
      matchType: 'contains',
      indices: [[containsIndex, containsIndex + query.length]],
    }
  }

  // Fuzzy matching with typo tolerance
  const indices: [number, number][] = []

  // First, try Damerau-Levenshtein for short queries (typo detection)
  if (query.length <= 10) {
    // Check each word in the text - filter out empty/whitespace strings
    const words = text.split(/[\s\-_]+|(?=[A-Z])/g).filter(w => w && w.trim().length > 0)
    let bestWordScore = 0
    let bestWordIndices: [number, number][] = []
    let currentPos = 0

    for (const word of words) {
      const wordLower = caseSensitive ? word : word.toLowerCase()
      const distance = damerauLevenshtein(queryLower, wordLower)

      if (distance <= maxTypoDistance) {
        const maxLen = Math.max(query.length, word.length)
        // Avoid division by zero
        const similarity = maxLen > 0 ? 1 - distance / maxLen : 0
        const wordScore = weights.fuzzy + similarity * 15

        if (wordScore > bestWordScore) {
          bestWordScore = wordScore
          const wordStart = textLower.indexOf(wordLower, currentPos)
          if (wordStart !== -1) {
            bestWordIndices = [[wordStart, wordStart + word.length]]
          }
        }
      }

      currentPos += word.length + 1
    }

    if (bestWordScore > 0) {
      return {
        score: bestWordScore,
        matchType: 'fuzzy',
        indices: bestWordIndices,
      }
    }
  }

  // Character sequence matching (all query chars in order)
  let queryIndex = 0
  let matchedChars = 0
  let consecutiveBonus = 0
  let lastMatchIndex = -1
  const sequenceIndices: [number, number][] = []

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower.charAt(i) === queryLower.charAt(queryIndex)) {
      matchedChars++
      sequenceIndices.push([i, i + 1])

      // Bonus for consecutive matches
      if (lastMatchIndex === i - 1) {
        consecutiveBonus += 2
      }

      lastMatchIndex = i
      queryIndex++
    }
  }

  if (queryIndex === queryLower.length && queryLower.length > 0) {
    // All query characters found in order
    // Avoid division by zero
    const matchRatio = queryLower.length > 0 ? matchedChars / queryLower.length : 0
    const gapPenalty = sequenceIndices.length > 1
      ? (sequenceIndices[sequenceIndices.length - 1]![0] - sequenceIndices[0]![0] - queryLower.length) * 0.5
      : 0

    const score = Math.max(1, weights.fuzzy + matchRatio * 10 + consecutiveBonus - gapPenalty)

    return {
      score,
      matchType: 'fuzzy',
      indices: sequenceIndices,
    }
  }

  // Phonetic matching as fallback
  if (options?.phonetic && query.length >= 3) {
    const queryPhonetic = phoneticEncode(query)
    const textPhonetic = phoneticEncode(text)

    if (queryPhonetic === textPhonetic) {
      return {
        score: weights.fuzzy * 0.8,
        matchType: 'fuzzy',
        indices: [],
      }
    }
  }

  return { score: 0, matchType: 'fuzzy', indices: [] }
}

/**
 * Find fuzzy matches for a query in a list of items
 *
 * @example
 * ```tsx
 * const results = fuzzySearch('react hook', items, (item) => [
 *   { field: 'title', value: item.title, weight: 2 },
 *   { field: 'description', value: item.description, weight: 1 },
 * ])
 * ```
 */
export function fuzzySearch<T>(
  query: string,
  items: T[],
  getFields: (item: T) => { field: string; value: string; weight?: number }[],
  options?: FuzzySearchOptions
): (T & { _score: number; _matchType?: FuzzyMatch['matchType']; _matches?: { field: string; indices: [number, number][] }[] })[] {
  if (!query.trim()) {
    return items.map((item) => ({ ...item, _score: 0 }))
  }

  const threshold = options?.threshold ?? 0
  const limit = options?.limit ?? Infinity

  const results = items.map((item) => {
    const fields = getFields(item)
    let totalScore = 0
    let maxScore = 0
    let bestMatchType: FuzzyMatch['matchType'] = 'fuzzy'
    const matches: { field: string; indices: [number, number][] }[] = []

    for (const { field, value, weight = 1 } of fields) {
      const result = fuzzyScore(query, value, options)
      const weightedScore = result.score * weight

      if (weightedScore > 0) {
        matches.push({ field, indices: result.indices })
      }

      totalScore += weightedScore

      if (weightedScore > maxScore) {
        maxScore = weightedScore
        bestMatchType = result.matchType
      }
    }

    // Use max score as primary, total as secondary for multi-field boost
    const finalScore = maxScore + totalScore * 0.1

    return {
      ...item,
      _score: finalScore,
      _matchType: bestMatchType,
      _matches: matches,
    }
  })

  // Filter by threshold and sort by score descending
  return results
    .filter((r) => r._score > threshold)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
}

/**
 * Highlight matched portions of text
 *
 * @example
 * ```tsx
 * const html = highlightMatches('react', 'React Components')
 * // Returns: '<mark>React</mark> Components'
 * ```
 */
export function highlightMatches(query: string, text: string, className?: string): string {
  if (!query || !text) return text

  const { indices } = fuzzyScore(query, text)

  if (indices.length === 0) {
    // Fallback to simple contains match
    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()
    const index = textLower.indexOf(queryLower)

    if (index === -1) return text

    const before = text.slice(0, index)
    const match = text.slice(index, index + query.length)
    const after = text.slice(index + query.length)
    const markClass = className ? ` class="${className}"` : ''

    return `${before}<mark${markClass}>${match}</mark>${after}`
  }

  // Use indices for highlighting
  const markClass = className ? ` class="${className}"` : ''
  let result = ''
  let lastEnd = 0

  // Merge overlapping/adjacent indices
  const merged: [number, number][] = []
  const sorted = [...indices].sort((a, b) => a[0] - b[0])

  for (const [start, end] of sorted) {
    if (merged.length === 0) {
      merged.push([start, end])
    } else {
      const last = merged[merged.length - 1]!
      if (start <= last[1]) {
        last[1] = Math.max(last[1], end)
      } else {
        merged.push([start, end])
      }
    }
  }

  for (const [start, end] of merged) {
    result += text.slice(lastEnd, start)
    result += `<mark${markClass}>${text.slice(start, end)}</mark>`
    lastEnd = end
  }

  result += text.slice(lastEnd)
  return result
}

/**
 * Highlight matches with custom renderer
 *
 * @example
 * ```tsx
 * const parts = highlightMatchesAdvanced(
 *   'react',
 *   'React Components',
 *   (text, isMatch, index) => isMatch ? <mark key={index}>{text}</mark> : text
 * )
 * ```
 */
export function highlightMatchesAdvanced<T>(
  query: string,
  text: string,
  renderer: (text: string, isMatch: boolean, index: number) => T,
  options?: FuzzySearchOptions
): T[] {
  if (!query || !text) {
    return [renderer(text, false, 0)]
  }

  const { indices } = fuzzyScore(query, text, options)

  if (indices.length === 0) {
    return [renderer(text, false, 0)]
  }

  // Merge overlapping indices
  const merged: [number, number][] = []
  const sorted = [...indices].sort((a, b) => a[0] - b[0])

  for (const [start, end] of sorted) {
    if (merged.length === 0) {
      merged.push([start, end])
    } else {
      const last = merged[merged.length - 1]!
      if (start <= last[1]) {
        last[1] = Math.max(last[1], end)
      } else {
        merged.push([start, end])
      }
    }
  }

  const parts: T[] = []
  let lastEnd = 0
  let partIndex = 0

  for (const [start, end] of merged) {
    if (start > lastEnd) {
      parts.push(renderer(text.slice(lastEnd, start), false, partIndex++))
    }
    parts.push(renderer(text.slice(start, end), true, partIndex++))
    lastEnd = end
  }

  if (lastEnd < text.length) {
    parts.push(renderer(text.slice(lastEnd), false, partIndex++))
  }

  return parts
}

/**
 * Create a fuzzy searcher instance with pre-configured options
 *
 * @example
 * ```tsx
 * const searcher = createFuzzySearcher(items, getFields, { threshold: 20 })
 * const results1 = searcher.search('react')
 * searcher.updateItems(newItems)
 * const results2 = searcher.search('hook')
 * ```
 */
export function createFuzzySearcher<T>(
  items: T[],
  getFields: (item: T) => { field: string; value: string; weight?: number }[],
  options?: FuzzySearchOptions
) {
  let _items = items
  let _options = options

  return {
    search: (query: string) => fuzzySearch(query, _items, getFields, _options),
    updateItems: (newItems: T[]) => {
      _items = newItems
    },
    updateOptions: (newOptions: FuzzySearchOptions) => {
      _options = { ..._options, ...newOptions }
    },
    getItems: () => _items,
  }
}

// Default export for convenience
export default fuzzySearch
