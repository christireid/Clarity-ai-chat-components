/**
 * Token Counter Utilities
 * Approximate token counting for common models
 */

export class TokenCounter {
  private static readonly AVG_CHARS_PER_TOKEN = 4

  /**
   * Count tokens in text (approximate)
   * Uses ~4 characters per token as a rough estimate
   */
  static count(text: string): number {
    if (!text) return 0
    return Math.ceil(text.length / this.AVG_CHARS_PER_TOKEN)
  }

  /**
   * Count tokens in multiple texts
   */
  static countBatch(texts: string[]): number {
    return texts.reduce((sum, text) => sum + this.count(text), 0)
  }

  /**
   * Truncate text to fit token budget
   * Tries to break at sentence boundaries when possible
   */
  static truncate(text: string, maxTokens: number): string {
    const tokens = this.count(text)
    if (tokens <= maxTokens) return text

    const ratio = maxTokens / tokens
    const targetLength = Math.floor(text.length * ratio)

    // Try to break at sentence boundary
    const truncated = text.slice(0, targetLength)
    const lastPeriod = truncated.lastIndexOf('.')
    const lastNewline = truncated.lastIndexOf('\n')
    const lastExclamation = truncated.lastIndexOf('!')
    const lastQuestion = truncated.lastIndexOf('?')
    const breakPoint = Math.max(
      lastPeriod,
      lastNewline,
      lastExclamation,
      lastQuestion
    )

    if (breakPoint > targetLength * 0.8) {
      return text.slice(0, breakPoint + 1)
    }

    return truncated + '...'
  }

  /**
   * Split text into sentences
   */
  static splitSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  }
}
