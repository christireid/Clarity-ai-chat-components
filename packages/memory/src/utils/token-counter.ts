/**
 * Token Counter Utilities
 *
 * Re-exports from @clarity-chat/token-optimization for backward compatibility.
 * The memory package now delegates to the consolidated token-optimization package.
 *
 * This file provides a TokenCounter class with both static and instance methods
 * to maintain backward compatibility with the original memory package API.
 */

import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

// Re-export types from token-optimization
export type {
  TokenizerConfig,
  TokenInfo,
  CacheStats,
  MonitoringStats,
} from '@clarity-chat/token-optimization'

/**
 * Supported model families for token counting
 * Preserved for backward compatibility with memory package API
 */
export type ModelFamily = 'gpt-4' | 'gpt-3.5' | 'claude' | 'generic'

/**
 * Content type affects token counting accuracy
 * Preserved for backward compatibility with memory package API
 */
export type ContentType = 'prose' | 'code' | 'mixed' | 'unknown'

/**
 * Token count result with confidence level
 * Preserved for backward compatibility with memory package API
 */
export interface TokenCountResult {
  /** Estimated token count */
  count: number
  /** Confidence level of the estimate */
  confidence: 'exact' | 'high' | 'approximate'
  /** Content type detected */
  contentType: ContentType
}

// Create a singleton instance for static method delegation
const defaultCounter = new AccurateTokenCounter({ model: 'gpt-4' })

/**
 * TokenCounter class with both static and instance methods
 *
 * This class wraps AccurateTokenCounter to provide backward compatibility
 * with the original memory package API that used static methods.
 */
export class TokenCounter {
  private counter: AccurateTokenCounter
  private static _currentModel: ModelFamily = 'generic'

  /**
   * Create a new TokenCounter instance
   *
   * @param model - Model family to use for token counting
   */
  constructor(model?: ModelFamily) {
    const modelMap: Record<ModelFamily, string> = {
      'gpt-4': 'gpt-4',
      'gpt-3.5': 'gpt-3.5-turbo',
      claude: 'claude-3-sonnet',
      generic: 'gpt-4',
    }
    this.counter = new AccurateTokenCounter({
      model: modelMap[model || 'generic'],
    })
  }

  // ============================================================================
  // Static Methods (for backward compatibility)
  // ============================================================================

  /**
   * Set the model family for more accurate counting (static)
   */
  static setModel(model: ModelFamily): void {
    TokenCounter._currentModel = model
  }

  /**
   * Get current model family (static)
   */
  static getModel(): ModelFamily {
    return TokenCounter._currentModel
  }

  /**
   * Count tokens in text (approximate) - static method
   * Backward compatible - returns just the count
   */
  static count(text: string): number {
    return defaultCounter.count(text)
  }

  /**
   * Count tokens in multiple texts (static)
   */
  static countBatch(texts: string[]): number {
    return texts.reduce((sum, text) => sum + TokenCounter.count(text), 0)
  }

  /**
   * Count tokens in text with confidence level (static)
   * Returns detailed result including confidence
   */
  static countWithConfidence(
    text: string,
    _model?: ModelFamily
  ): TokenCountResult {
    const count = TokenCounter.count(text)
    return {
      count,
      confidence: 'high' as const,
      contentType: detectContentType(text),
    }
  }

  /**
   * Truncate text to fit token budget (static)
   * Tries to break at sentence boundaries when possible
   */
  static truncate(text: string, maxTokens: number): string {
    return defaultCounter.truncate(text, maxTokens)
  }

  /**
   * Estimate tokens remaining in a budget (static)
   */
  static remaining(text: string, budget: number): number {
    return Math.max(0, budget - TokenCounter.count(text))
  }

  /**
   * Check if text fits within token budget (static)
   */
  static fitsInBudget(text: string, budget: number): boolean {
    return TokenCounter.count(text) <= budget
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
   * Get token-to-character ratio for current model (static)
   */
  static getTokenRatio(contentType: ContentType = 'prose'): number {
    const ratios = {
      prose: 4.0,
      code: 3.5,
      mixed: 3.75,
      unknown: 4.0,
    }
    return ratios[contentType]
  }

  // ============================================================================
  // Instance Methods
  // ============================================================================

  /**
   * Set instance model
   */
  setModel(model: ModelFamily): void {
    const modelMap: Record<ModelFamily, string> = {
      'gpt-4': 'gpt-4',
      'gpt-3.5': 'gpt-3.5-turbo',
      claude: 'claude-3-sonnet',
      generic: 'gpt-4',
    }
    this.counter = new AccurateTokenCounter({ model: modelMap[model] })
  }

  /**
   * Count tokens in text - instance method
   */
  countTokens(text: string): number {
    return this.counter.count(text)
  }

  /**
   * Count tokens with confidence - instance method
   */
  countTokensWithConfidence(text: string): TokenCountResult {
    return {
      count: this.countTokens(text),
      confidence: 'high' as const,
      contentType: detectContentType(text),
    }
  }

  /**
   * Count tokens in multiple texts - instance method
   */
  countBatch(texts: string[]): number {
    return texts.reduce((sum, text) => sum + this.countTokens(text), 0)
  }

  /**
   * Truncate text - instance method
   */
  truncate(text: string, maxTokens: number): string {
    return this.counter.truncate(text, maxTokens)
  }

  /**
   * Estimate tokens remaining - instance method
   */
  remaining(text: string, budget: number): number {
    return Math.max(0, budget - this.countTokens(text))
  }

  /**
   * Check if text fits - instance method
   */
  fitsInBudget(text: string, budget: number): boolean {
    return this.countTokens(text) <= budget
  }

  /**
   * Split text into sentences - instance method
   */
  splitSentences(text: string): string[] {
    return TokenCounter.splitSentences(text)
  }

  /**
   * Get token-to-character ratio - instance method
   */
  getTokenRatio(contentType: ContentType = 'prose'): number {
    return TokenCounter.getTokenRatio(contentType)
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

/**
 * Detect content type based on text characteristics
 * Helper function for countTokensWithConfidence
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
