/**
 * Token Counting Utility
 *
 * Provides estimation and counting of tokens for various models.
 * Currently uses a character-based heuristic for performance.
 *
 * @todo Integrate @dqbd/tiktoken WASM for precise counting in the future.
 */

/**
 * Estimate the number of tokens in a text string.
 * Uses a heuristic of ~4 characters per token for English text.
 */
export const estimateTokens = (text: string): number => {
  if (!text) return 0
  return Math.ceil(text.length / 4)
}

/**
 * Count tokens for a list of messages, including protocol overhead.
 */
export const countMessageTokens = (
  messages: { role: string; content: string }[]
): number => {
  // Base overhead for every request
  let total = 3

  for (const msg of messages) {
    // Per-message overhead (differs by model, but ~4 is a safe upper bound)
    total += 4
    total += estimateTokens(msg.content)
    total += estimateTokens(msg.role)
  }

  return total
}
