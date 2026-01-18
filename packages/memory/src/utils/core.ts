/**
 * Clarity Memory - Core Utility Functions
 *
 * IMPORTANT: Prefer importing from @clarity-chat/utils when possible.
 * This file contains only memory-specific utilities and re-exports.
 */

// =============================================================================
// Re-exports from @clarity-chat/utils (canonical source)
// =============================================================================

export {
  // Validation
  isNonEmptyString,
  isNumber as isValidNumber,
} from '@clarity-chat/utils/validation'

export {
  // Async utilities
  sleep,
  retry,
  debounce,
  throttle,
} from '@clarity-chat/utils/async'

import { CHARS_PER_TOKEN as _CHARS_PER_TOKEN } from '@clarity-chat/utils/format'

export {
  // Token estimation
  estimateTokens,
  CHARS_PER_TOKEN,
} from '@clarity-chat/utils/format'

// Local binding for use within this file
const CHARS_PER_TOKEN = _CHARS_PER_TOKEN

export {
  // ID generation
  generateId,
  // Math utilities
  clamp,
  // Environment detection
  isBrowser,
  isNode,
  // Object utilities
  deepMerge,
} from '@clarity-chat/utils'

/**
 * Calculate cosine similarity between two vectors
 * Used for semantic memory retrieval with embeddings
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

// estimateTokens is now re-exported from @clarity-chat/utils

/**
 * Truncate text to a maximum token count
 */
export function truncateToTokens(text: string, maxTokens: number): string {
  const maxChars = maxTokens * CHARS_PER_TOKEN.default
  if (text.length <= maxChars) {
    return text
  }
  return text.substring(0, maxChars).trim()
}
