import { TokenCounter } from '@clarity-chat/token-optimization'

export interface FallbackStrategy {
  name: string
  shouldUse: (text: string, context: FallbackContext) => boolean
  count: (text: string, context: FallbackContext) => number
}

export interface FallbackContext {
  model?: string
  maxTokens?: number
  isStreaming?: boolean
  textLength: number
  hasSpecialChars: boolean
  isCode: boolean
  language?: string
}

/**
 * Smart fallback strategies for token counting edge cases
 */
export class SmartTokenCounter {
  private strategies: FallbackStrategy[] = []
  private defaultStrategy = 'tiktoken'

  constructor() {
    this.initializeStrategies()
  }

  private initializeStrategies() {
    this.strategies = [
      // Strategy 1: Character-based estimation for very long text
      {
        name: 'character-based',
        shouldUse: (text, context) => context.textLength > 50000,
        count: (text, context) => {
          const avgCharsPerToken = this.getCharsPerToken(context.model)
          return Math.ceil(text.length / avgCharsPerToken)
        },
      },

      // Strategy 2: Word-based estimation for natural language
      {
        name: 'word-based',
        shouldUse: (text, context) =>
          context.textLength < 10000 &&
          !context.hasSpecialChars &&
          !context.isCode,
        count: (text, context) => {
          const words = text.split(/\s+/).filter((word) => word.length > 0)
          const avgTokensPerWord = this.getTokensPerWord(context.language)
          return Math.ceil(words.length * avgTokensPerWord)
        },
      },

      // Strategy 3: Code-aware estimation
      {
        name: 'code-aware',
        shouldUse: (text, context) => context.isCode,
        count: (text, context) => {
          const lines = text.split('\n').length
          const symbols = (
            text.match(/[{}()[\];,./<>?\\|`~!@#$%^&*-_+=]/g) || []
          ).length
          const avgTokensPerLine = this.getTokensPerCodeLine(context.language)
          const symbolTokens = symbols * 0.5 // Symbols typically use fewer tokens
          return Math.ceil(lines * avgTokensPerLine + symbolTokens)
        },
      },

      // Strategy 4: Unicode-aware counting
      {
        name: 'unicode-aware',
        shouldUse: (text, context) =>
          context.hasSpecialChars && /[^\u0020-\u007E]/.test(text), // Contains non-printable ASCII or non-ASCII characters
        count: (text, context) => {
          const segments = this.segmentUnicodeText(text)
          let totalTokens = 0

          segments.forEach((segment) => {
            if (this.isCJK(segment)) {
              totalTokens += segment.length // CJK characters often count as 1 token each
            } else if (this.isEmoji(segment)) {
              totalTokens += 2 // Emojis typically count as 2 tokens
            } else {
              totalTokens += Math.ceil(segment.length / 4) // Fallback for other Unicode
            }
          })

          return totalTokens
        },
      },

      // Strategy 5: Streaming-optimized counting
      {
        name: 'streaming-optimized',
        shouldUse: (text, context) =>
          context.isStreaming && context.textLength < 1000,
        count: (text, context) => {
          // For streaming, we need fast estimation
          const chunks = text.split(/\s+/)
          const avgTokensPerChunk = this.getTokensPerChunk(context.model)
          return Math.ceil(chunks.length * avgTokensPerChunk)
        },
      },
    ]
  }

  /**
   * Smart token counting with fallback strategies
   */
  public smartCount(
    text: string,
    options: {
      model?: string
      maxTokens?: number
      isStreaming?: boolean
      strategy?: string
    } = {}
  ): number {
    try {
      // First try the primary TokenCounter
      if (options.strategy === 'tiktoken' || !options.strategy) {
        const primaryCount = TokenCounter.count(text)
        if (this.isValidCount(primaryCount, text, options)) {
          return primaryCount
        }
      }

      // Build context for fallback decisions
      const context = this.buildContext(text, options)

      // Try fallback strategies
      for (const strategy of this.strategies) {
        if (strategy.shouldUse(text, context)) {
          const fallbackCount = strategy.count(text, context)
          if (this.isValidCount(fallbackCount, text, options)) {
            this.logFallback(strategy.name, text, primaryCount, fallbackCount)
            return fallbackCount
          }
        }
      }

      // Ultimate fallback: character-based estimation
      return this.ultimateFallback(text, options.model)
    } catch (error) {
      console.warn('Token counting failed, using fallback:', error)
      return this.ultimateFallback(text, options.model)
    }
  }

  /**
   * Validate if a token count is reasonable
   */
  private isValidCount(count: number, text: string, options: any): boolean {
    if (count < 0) return false
    if (count > text.length * 2) return false // Sanity check
    if (options.maxTokens && count > options.maxTokens * 1.5) return false
    return true
  }

  /**
   * Build context for strategy selection
   */
  private buildContext(text: string, options: any): FallbackContext {
    return {
      model: options.model,
      maxTokens: options.maxTokens,
      isStreaming: options.isStreaming,
      textLength: text.length,
      hasSpecialChars: /[^\w\s]/.test(text),
      isCode: this.isCode(text),
      language: this.detectLanguage(text),
    }
  }

  /**
   * Detect if text is code
   */
  private isCode(text: string): boolean {
    const codeIndicators = [
      /function\s+\w+\s*\(/,
      /const\s+\w+\s*=/,
      /import\s+.*from/,
      /export\s+(default\s+)?(function|class|const)/,
      /;\s*$/m,
      /{\s*$/m,
      /}\s*$/m,
      /<\w+.*>/,
      /\$\w+|@\w+|#\w+/,
    ]

    const codeScore = codeIndicators.reduce(
      (score, pattern) => score + (pattern.test(text) ? 1 : 0),
      0
    )

    return codeScore >= 2
  }

  /**
   * Detect language of text
   */
  private detectLanguage(text: string): string {
    if (/[\u4e00-\u9fff]/.test(text)) return 'chinese'
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'japanese'
    if (/[\uac00-\ud7af]/.test(text)) return 'korean'
    if (/[\u0600-\u06ff]/.test(text)) return 'arabic'
    if (/[\u0370-\u03ff]/.test(text)) return 'greek'
    if (/[\u0400-\u04ff]/.test(text)) return 'cyrillic'
    return 'english'
  }

  /**
   * Get average characters per token for a model
   */
  private getCharsPerToken(model?: string): number {
    const modelRatios: Record<string, number> = {
      'gpt-4': 4.0,
      'gpt-4-turbo': 4.0,
      'gpt-4o': 4.0,
      'gpt-3.5-turbo': 4.0,
      'claude-3-opus': 3.8,
      'claude-3-sonnet': 3.8,
      'claude-3-haiku': 3.8,
      'gemini-pro': 4.0,
      'deepseek-chat': 4.0,
      'llama-2-70b': 3.5,
      'llama-3-8b': 3.5,
      'llama-3-70b': 3.5,
    }

    return model && modelRatios[model] ? modelRatios[model] : 4.0
  }

  /**
   * Get average tokens per word for a language
   */
  private getTokensPerWord(language: string): number {
    const tokensPerWord: Record<string, number> = {
      english: 1.3,
      chinese: 1.0,
      japanese: 1.1,
      korean: 1.2,
      arabic: 1.4,
      greek: 1.3,
      cyrillic: 1.3,
    }

    return tokensPerWord[language] || 1.3
  }

  /**
   * Get average tokens per code line
   */
  private getTokensPerCodeLine(language?: string): number {
    const tokensPerLine: Record<string, number> = {
      javascript: 8,
      typescript: 8,
      python: 6,
      java: 10,
      cpp: 9,
      csharp: 9,
      go: 7,
      rust: 8,
      php: 7,
      ruby: 6,
      swift: 8,
      kotlin: 8,
    }

    return language && tokensPerLine[language] ? tokensPerLine[language] : 8
  }

  /**
   * Get average tokens per chunk for streaming
   */
  private getTokensPerChunk(model?: string): number {
    const tokensPerChunk: Record<string, number> = {
      'gpt-4': 1.2,
      'gpt-3.5-turbo': 1.1,
      'claude-3-opus': 1.3,
      'claude-3-sonnet': 1.2,
      'gemini-pro': 1.1,
    }

    return model && tokensPerChunk[model] ? tokensPerChunk[model] : 1.2
  }

  /**
   * Segment Unicode text
   */
  private segmentUnicodeText(text: string): string[] {
    const segments: string[] = []
    let current = ''

    for (const char of text) {
      if (this.isCJK(char) && current && !this.isCJK(current[0])) {
        segments.push(current)
        current = char
      } else if (this.isEmoji(char)) {
        if (current) segments.push(current)
        segments.push(char)
        current = ''
      } else {
        current += char
      }
    }

    if (current) segments.push(current)
    return segments
  }

  /**
   * Check if text is CJK
   */
  private isCJK(text: string): boolean {
    return /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(text)
  }

  /**
   * Check if text is emoji
   */
  private isEmoji(text: string): boolean {
    return /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
      text
    )
  }

  /**
   * Ultimate fallback when all else fails
   */
  private ultimateFallback(text: string, model?: string): number {
    const charsPerToken = this.getCharsPerToken(model)
    return Math.ceil(text.length / charsPerToken)
  }

  /**
   * Log fallback usage
   */
  private logFallback(
    strategy: string,
    text: string,
    primaryCount: number,
    fallbackCount: number
  ) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[TokenCounter] Using ${strategy} fallback. Primary: ${primaryCount}, Fallback: ${fallbackCount}, Text: "${text.substring(0, 50)}..."`
      )
    }
  }

  /**
   * Add custom fallback strategy
   */
  public addStrategy(strategy: FallbackStrategy): void {
    this.strategies.push(strategy)
  }

  /**
   * Get available strategies
   */
  public getStrategies(): string[] {
    return ['tiktoken', ...this.strategies.map((s) => s.name)]
  }
}

// Export singleton instance
export const smartTokenCounter = new SmartTokenCounter()

// Convenience function
export function smartCountTokens(text: string, options?: any): number {
  return smartTokenCounter.smartCount(text, options)
}
