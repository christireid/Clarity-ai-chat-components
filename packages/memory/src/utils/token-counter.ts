/**
 * Token Counter Utilities
 * Improved token counting with model-specific heuristics and confidence levels
 */

/**
 * Supported model families for token counting
 */
export type ModelFamily = 'gpt-4' | 'gpt-3.5' | 'claude' | 'generic'

/**
 * Content type affects token counting accuracy
 */
export type ContentType = 'prose' | 'code' | 'mixed' | 'unknown'

/**
 * Token count result with confidence level
 */
export interface TokenCountResult {
  /** Estimated token count */
  count: number
  /** Confidence level of the estimate */
  confidence: 'exact' | 'high' | 'approximate'
  /** Content type detected */
  contentType: ContentType
}

/**
 * Model-specific character-to-token ratios
 * Based on empirical analysis of different model tokenizers
 */
const MODEL_RATIOS: Record<ModelFamily, { prose: number; code: number }> = {
  'gpt-4': { prose: 4.0, code: 3.5 },
  'gpt-3.5': { prose: 4.0, code: 3.5 },
  'claude': { prose: 3.8, code: 3.3 },
  'generic': { prose: 4.0, code: 3.5 },
}

/**
 * Detect content type based on text characteristics
 */
function detectContentType(text: string): ContentType {
  if (!text || text.length === 0) return 'unknown'

  // Code indicators
  const codePatterns = [
    /^\s*(function|const|let|var|class|import|export|if|for|while|return)\s/m,
    /[{}();=]/g,
    /^\s*\/\//m,
    /^\s*#\s*(include|define|pragma)/m,
    /^\s*(def|class|import|from|if|elif|else|for|while|return)\s/m,
  ]

  const codeMatches = codePatterns.reduce((count, pattern) => {
    const matches = text.match(pattern)
    return count + (matches ? matches.length : 0)
  }, 0)

  const codeRatio = codeMatches / (text.length / 100)

  if (codeRatio > 2) return 'code'
  if (codeRatio > 0.5) return 'mixed'
  return 'prose'
}

/**
 * Count special tokens that may affect the count
 * (URLs, numbers, special characters)
 */
function countSpecialTokenAdjustment(text: string): number {
  let adjustment = 0

  // URLs are typically 1 token
  const urls = text.match(/https?:\/\/[^\s]+/g)
  if (urls) {
    urls.forEach((url) => {
      // Subtract characters, add 1 token
      adjustment -= url.length / 4 - 1
    })
  }

  // Numbers are typically 1-2 tokens regardless of length
  const numbers = text.match(/\d{4,}/g)
  if (numbers) {
    numbers.forEach((num) => {
      adjustment -= num.length / 4 - 2
    })
  }

  return Math.round(adjustment)
}

export class TokenCounter {
  private static readonly DEFAULT_CHARS_PER_TOKEN = 4
  private static currentModel: ModelFamily = 'generic'

  /**
   * Instance model for instance methods
   */
  private instanceModel: ModelFamily = 'generic'

  /**
   * Constructor for instance usage
   */
  constructor(model?: ModelFamily) {
    if (model) {
      this.instanceModel = model
    }
  }

  /**
   * Set the model family for more accurate counting (static)
   */
  static setModel(model: ModelFamily): void {
    this.currentModel = model
  }

  /**
   * Get current model family (static)
   */
  static getModel(): ModelFamily {
    return this.currentModel
  }

  /**
   * Set instance model
   */
  setModel(model: ModelFamily): void {
    this.instanceModel = model
  }

  /**
   * Get instance model
   */
  getModel(): ModelFamily {
    return this.instanceModel
  }

  /**
   * Count tokens in text with confidence level (static)
   * Returns detailed result including confidence
   */
  static countWithConfidence(
    text: string,
    model?: ModelFamily
  ): TokenCountResult {
    if (!text) {
      return { count: 0, confidence: 'exact', contentType: 'unknown' }
    }

    const targetModel = model || this.currentModel
    const contentType = detectContentType(text)
    const ratios = MODEL_RATIOS[targetModel]

    let ratio: number
    let confidence: 'exact' | 'high' | 'approximate'

    switch (contentType) {
      case 'code':
        ratio = ratios.code
        confidence = 'high'
        break
      case 'prose':
        ratio = ratios.prose
        confidence = 'high'
        break
      case 'mixed':
        ratio = (ratios.code + ratios.prose) / 2
        confidence = 'approximate'
        break
      default:
        ratio = this.DEFAULT_CHARS_PER_TOKEN
        confidence = 'approximate'
    }

    const baseCount = Math.ceil(text.length / ratio)
    const adjustment = countSpecialTokenAdjustment(text)
    const count = Math.max(1, baseCount + adjustment)

    return { count, confidence, contentType }
  }

  /**
   * Count tokens in text (approximate) - static method
   * Backward compatible - returns just the count
   */
  static count(text: string): number {
    return this.countWithConfidence(text).count
  }

  /**
   * Count tokens in text - instance method
   * Delegates to static method
   */
  countTokens(text: string): number {
    return TokenCounter.countWithConfidence(text, this.instanceModel).count
  }

  /**
   * Count tokens with confidence - instance method
   */
  countTokensWithConfidence(text: string): TokenCountResult {
    return TokenCounter.countWithConfidence(text, this.instanceModel)
  }

  /**
   * Count tokens in multiple texts (static)
   */
  static countBatch(texts: string[]): number {
    return texts.reduce((sum, text) => sum + this.count(text), 0)
  }

  /**
   * Count tokens in multiple texts - instance method
   */
  countBatch(texts: string[]): number {
    return texts.reduce((sum, text) => sum + this.countTokens(text), 0)
  }

  /**
   * Count tokens in multiple texts with confidence (static)
   */
  static countBatchWithConfidence(texts: string[]): TokenCountResult {
    if (texts.length === 0) {
      return { count: 0, confidence: 'exact', contentType: 'unknown' }
    }

    let totalCount = 0
    let hasApproximate = false
    const contentTypes: ContentType[] = []

    for (const text of texts) {
      const result = this.countWithConfidence(text)
      totalCount += result.count
      if (result.confidence === 'approximate') {
        hasApproximate = true
      }
      contentTypes.push(result.contentType)
    }

    // Determine overall content type
    const codeCount = contentTypes.filter((t) => t === 'code').length
    const proseCount = contentTypes.filter((t) => t === 'prose').length
    let overallType: ContentType = 'mixed'
    if (codeCount > proseCount * 2) overallType = 'code'
    else if (proseCount > codeCount * 2) overallType = 'prose'

    return {
      count: totalCount,
      confidence: hasApproximate ? 'approximate' : 'high',
      contentType: overallType,
    }
  }

  /**
   * Truncate text to fit token budget (static)
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
   * Truncate text - instance method
   */
  truncate(text: string, maxTokens: number): string {
    return TokenCounter.truncate(text, maxTokens)
  }

  /**
   * Estimate tokens remaining in a budget (static)
   */
  static remaining(text: string, budget: number): number {
    return Math.max(0, budget - this.count(text))
  }

  /**
   * Estimate tokens remaining - instance method
   */
  remaining(text: string, budget: number): number {
    return Math.max(0, budget - this.countTokens(text))
  }

  /**
   * Check if text fits within token budget (static)
   */
  static fitsInBudget(text: string, budget: number): boolean {
    return this.count(text) <= budget
  }

  /**
   * Check if text fits - instance method
   */
  fitsInBudget(text: string, budget: number): boolean {
    return this.countTokens(text) <= budget
  }

  /**
   * Split text into sentences (static)
   */
  static splitSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  }

  /**
   * Split text into sentences - instance method
   */
  splitSentences(text: string): string[] {
    return TokenCounter.splitSentences(text)
  }

  /**
   * Get token-to-character ratio for current model (static)
   */
  static getTokenRatio(contentType: ContentType = 'prose'): number {
    const ratios = MODEL_RATIOS[this.currentModel]
    switch (contentType) {
      case 'code':
        return ratios.code
      case 'prose':
        return ratios.prose
      default:
        return (ratios.code + ratios.prose) / 2
    }
  }

  /**
   * Get token-to-character ratio - instance method
   */
  getTokenRatio(contentType: ContentType = 'prose'): number {
    const ratios = MODEL_RATIOS[this.instanceModel]
    switch (contentType) {
      case 'code':
        return ratios.code
      case 'prose':
        return ratios.prose
      default:
        return (ratios.code + ratios.prose) / 2
    }
  }
}

/**
 * Convenience function for counting tokens
 * Alias for TokenCounter.count()
 */
export function countTokens(text: string): number {
  return TokenCounter.count(text)
}

/**
 * Convenience function for counting tokens with confidence
 */
export function countTokensWithConfidence(
  text: string,
  model?: ModelFamily
): TokenCountResult {
  return TokenCounter.countWithConfidence(text, model)
}
