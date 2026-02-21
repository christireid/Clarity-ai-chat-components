/**
 * Token Counting Utilities
 *
 * Uses @clarity-chat/token-optimization for accurate token counting.
 * Provides backward-compatible API for docs site.
 *
 * @version 2.0.0
 * @lastUpdated January 2026
 * @migrated Now using unified token-optimization package
 */

import { SimpleTokenCounter } from '@clarity-chat/token-optimization'

// Create singleton instance
const tokenCounter = new SimpleTokenCounter()

/**
 * Content type for estimation
 * Maintained for backward compatibility
 */
type ContentType = 'prose' | 'code' | 'mixed'

/**
 * Estimate token count for a string.
 *
 * Now uses SimpleTokenCounter from @clarity-chat/token-optimization
 * for more accurate estimation.
 *
 * @param text - The text to estimate tokens for
 * @param contentType - Type of content (prose, code, or mixed)
 * @returns Estimated token count
 */
export function estimateTokens(
  text: string,
  contentType: ContentType = 'mixed'
): number {
  if (!text) return 0

  // Use SimpleTokenCounter which provides accurate estimation
  // The contentType parameter is kept for API compatibility
  return tokenCounter.estimate(text, contentType)
}

/**
 * Validate that a token estimate is within acceptable range of actual count.
 *
 * @param actual - The actual/estimated token count
 * @param declared - The declared token estimate
 * @param tolerance - Allowed variance (0.2 = 20%)
 * @returns Validation result with details
 */
export function validateTokenEstimate(
  actual: number,
  declared: number,
  tolerance: number = 0.25
): {
  isValid: boolean
  variance: number
  message: string
} {
  const variance = Math.abs(actual - declared) / declared
  const isValid = variance <= tolerance

  const percentVariance = Math.round(variance * 100)
  const direction = actual > declared ? 'higher' : 'lower'

  const message = isValid
    ? `Token estimate is accurate (${percentVariance}% variance)`
    : `Token estimate is ${percentVariance}% ${direction} than actual (${actual} vs ${declared})`

  return { isValid, variance, message }
}

/**
 * Analyze a prompt and return detailed token information.
 *
 * Uses @clarity-chat/token-optimization for accurate estimates.
 */
export function analyzePromptTokens(prompt: string): {
  estimatedTokens: number
  characterCount: number
  codeBlockCount: number
  xmlTagCount: number
  breakdown: {
    proseEstimate: number
    codeEstimate: number
    mixedEstimate: number
  }
} {
  const characterCount = prompt.length
  const codeBlockCount = (prompt.match(/```[\s\S]*?```/g) || []).length
  const xmlTagCount = (prompt.match(/<\/?[a-z_][a-z0-9_]*>/gi) || []).length

  return {
    estimatedTokens: estimateTokens(prompt, 'mixed'),
    characterCount,
    codeBlockCount,
    xmlTagCount,
    breakdown: {
      proseEstimate: estimateTokens(prompt, 'prose'),
      codeEstimate: estimateTokens(prompt, 'code'),
      mixedEstimate: estimateTokens(prompt, 'mixed'),
    },
  }
}

/**
 * Check if prompt is within a token budget.
 */
export function isWithinBudget(
  prompt: string,
  budget: number,
  contentType: ContentType = 'mixed'
): boolean {
  return estimateTokens(prompt, contentType) <= budget
}

/**
 * Suggest a token estimate for a prompt.
 * Rounds to nearest 50 for cleaner values.
 */
export function suggestTokenEstimate(prompt: string): number {
  const estimate = estimateTokens(prompt, 'mixed')
  return Math.ceil(estimate / 50) * 50
}
