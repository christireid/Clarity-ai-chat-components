/**
 * Clarity Memory - Core Utility Functions
 *
 * Basic utility functions.
 */

/**
 * Clamp a number between min and max
 * @deprecated Import from @clarity-chat/utils instead
 */
export { clamp } from '@clarity-chat/utils'

/**
 * Deep merge two objects
 * @deprecated Import from @clarity-chat/react/internal instead
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target }

  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        target[key] !== null &&
        !Array.isArray(target[key])
      ) {
        result[key] = deepMerge(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>
        ) as T[Extract<keyof T, string>]
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>]
      }
    }
  }

  return result
}

/**
 * Generate a random ID
 * @deprecated Import from @clarity-chat/utils instead
 */
export { generateId } from '@clarity-chat/utils'

/**
 * Sleep for a given number of milliseconds
 * @deprecated Import from @clarity-chat/utils/async instead
 */
export { sleep } from '@clarity-chat/utils/async'

/**
 * Retry a function with exponential backoff
 * @deprecated Import from @clarity-chat/utils/async instead
 */
export { retry } from '@clarity-chat/utils/async'

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    }
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i]! * b[i]!
    normA += a[i]! * a[i]!
    normB += b[i]! * b[i]!
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  if (denominator === 0) {
    return 0
  }

  return dotProduct / denominator
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 *
 * This is the standard token estimation ratio used across the codebase.
 * For model-specific estimation, see @clarity/react/utils/tokenization/estimator
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Truncate text to a maximum token count
 */
export function truncateToTokens(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4
  if (text.length <= maxChars) {
    return text
  }
  return text.substring(0, maxChars).trim()
}

/**
 * Check if code is running in browser
 * @deprecated Import from @clarity-chat/utils/env instead
 */
export { isBrowser } from '@clarity-chat/utils/env'

/**
 * Check if code is running in Node.js
 * @deprecated Import from @clarity-chat/utils/env instead
 */
export { isNode } from '@clarity-chat/utils/env'
