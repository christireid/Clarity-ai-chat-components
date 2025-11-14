/**
 * Token Counter Utility
 * 
 * Centralized token counting implementation
 * Uses simple approximation: ~4 characters per token (OpenAI standard)
 */

/**
 * Count tokens in text
 * 
 * Simple approximation: ~4 characters per token
 * For more accurate counting, use tiktoken or similar libraries
 * 
 * @param text - Text to count tokens for
 * @returns Approximate token count
 */
export function countTokens(text: string): number {
  if (!text || text.length === 0) return 0
  
  // Simple approximation: ~4 characters per token
  // This is a rough estimate, but works well for most use cases
  return Math.ceil(text.length / 4)
}

/**
 * Count tokens in multiple texts
 * 
 * @param texts - Array of texts
 * @returns Total token count
 */
export function countTokensBatch(texts: string[]): number {
  return texts.reduce((sum, text) => sum + countTokens(text), 0)
}

/**
 * Estimate tokens for a target length
 * 
 * @param targetTokens - Target number of tokens
 * @returns Estimated character length
 */
export function estimateCharsForTokens(targetTokens: number): number {
  return targetTokens * 4
}

/**
 * Check if text exceeds token limit
 * 
 * @param text - Text to check
 * @param maxTokens - Maximum allowed tokens
 * @returns True if text exceeds limit
 */
export function exceedsTokenLimit(text: string, maxTokens: number): boolean {
  return countTokens(text) > maxTokens
}

/**
 * Truncate text to fit within token budget
 * 
 * @param text - Text to truncate
 * @param maxTokens - Maximum allowed tokens
 * @param suffix - Optional suffix to add when truncated (default: '...')
 * @returns Truncated text
 */
export function truncateToTokenLimit(
  text: string,
  maxTokens: number,
  suffix: string = '...'
): string {
  const currentTokens = countTokens(text)
  
  if (currentTokens <= maxTokens) {
    return text
  }
  
  // Calculate target character length
  const targetChars = estimateCharsForTokens(maxTokens - countTokens(suffix))
  
  // Truncate and add suffix
  return text.slice(0, Math.max(0, targetChars)) + suffix
}
