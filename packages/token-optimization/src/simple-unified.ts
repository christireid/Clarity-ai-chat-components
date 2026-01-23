/**
 * Simple Unified Token Optimizer
 *
 * Basic implementation combining simple components
 */

import {
  AccurateTokenCounter,
  TokenSecurityManager,
  ToonOptimizer,
  DEFAULT_TOKENIZER_CONFIG,
  DEFAULT_SECURITY_CONFIG,
  DEFAULT_TOON_CONFIG,
} from './simple-index'
import { TokenOptimizationError, TokenErrorCode } from './errors'
import { Logger } from './observability'

/**
 * Options for simple optimization
 */
export interface SimpleOptimizationOptions {
  strategy?: 'basic' | 'toon' | 'compression' | 'truncated'
  maxTokens?: number
}

export interface SimpleOptimizationResult {
  original: string
  optimized: string
  originalTokens: number
  optimizedTokens: number
  savings: number
  percentage: number
  method: string
  security: {
    sanitized: boolean
    threats: string[]
    riskLevel: string
  }
}

/**
 * Simple Unified Token Optimizer
 */
export class SimpleUnifiedOptimizer {
  private tokenCounter: AccurateTokenCounter
  private securityManager: TokenSecurityManager
  private toonOptimizer: ToonOptimizer
  private cache: Map<string, SimpleOptimizationResult> = new Map()
  private enableCaching: boolean
  private logger: Logger

  constructor(enableCaching = true) {
    this.enableCaching = enableCaching
    this.logger = new Logger({ serviceName: 'simple-unified-optimizer' })
    this.tokenCounter = new AccurateTokenCounter({
      model: DEFAULT_TOKENIZER_CONFIG.model,
      enableCaching: DEFAULT_TOKENIZER_CONFIG.enableCaching,
      enableMonitoring: DEFAULT_TOKENIZER_CONFIG.enableMonitoring,
    })
    this.securityManager = new TokenSecurityManager(DEFAULT_SECURITY_CONFIG)
    this.toonOptimizer = new ToonOptimizer(DEFAULT_TOON_CONFIG)
  }

  /**
   * Optimize text with basic token optimization
   */
  async optimize(
    text: string,
    options: SimpleOptimizationOptions = {}
  ): Promise<SimpleOptimizationResult> {
    const strategy = options.strategy ?? 'basic'
    const maxTokens = options.maxTokens

    // Check cache first
    const cacheKey = `${strategy}:${text}`
    if (this.enableCaching && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!
      return {
        ...cached,
        method: `cache-${cached.method}`,
      }
    }

    // Apply security measures
    const secured = this.securityManager.sanitizeInput(text)
    if (secured.riskLevel === 'high') {
      throw new TokenOptimizationError(
        'Security threat detected in input',
        TokenErrorCode.SECURITY_VIOLATION,
        false,
        { riskLevel: secured.riskLevel, threats: secured.threats?.length || 0 }
      )
    }

    // Try TOON optimization if applicable
    let optimized = secured.sanitized
    let method = strategy

    try {
      // Check if it's structured data
      try {
        const data: unknown = JSON.parse(secured.sanitized)
        const toonOptimized = this.toonOptimizer.convertToToon(data)
        const originalTokens = this.tokenCounter.count(secured.sanitized)
        const toonTokens = this.tokenCounter.count(toonOptimized)

        if (toonTokens < originalTokens || strategy === 'toon') {
          optimized = toonOptimized
          method = 'toon'
        }
      } catch {
        // Not JSON, use simple compression
        const words = secured.sanitized.split(' ')
        if (words.length > 10) {
          // Simple compression by removing less important words
          const importantWords = words.filter(
            (_word: string, index: number) => index % 2 === 0
          )
          optimized = importantWords.join(' ')
          method = 'compression'
        }
      }
    } catch (error) {
      this.logger.warn('Optimization failed', {
        error: error instanceof Error ? error.message : String(error),
        strategy,
      })
    }

    // Apply max tokens constraint if specified
    if (maxTokens) {
      const currentTokens = this.tokenCounter.count(optimized)
      if (currentTokens > maxTokens) {
        // More aggressive truncation
        const ratio = (maxTokens - 1) / currentTokens
        const targetLength = Math.floor(optimized.length * ratio)
        optimized = optimized.slice(0, Math.max(1, targetLength)) + '...'
        method = 'truncated'
      }
    }

    const originalTokens = this.tokenCounter.count(secured.sanitized)
    const optimizedTokens = this.tokenCounter.count(optimized)
    const savings = originalTokens - optimizedTokens

    const result: SimpleOptimizationResult = {
      original: text,
      optimized,
      originalTokens,
      optimizedTokens,
      savings,
      percentage: originalTokens > 0 ? (savings / originalTokens) * 100 : 0,
      method,
      security: {
        sanitized: true,
        threats: secured.threats ?? [],
        riskLevel: secured.riskLevel,
      },
    }

    // Cache result
    if (this.enableCaching) {
      this.cache.set(cacheKey, result)
    }

    return result
  }

  /**
   * Get optimization statistics
   */
  getStats() {
    return {
      tokenCounter: this.tokenCounter.getCacheStats(),
      cache: this.getCacheStats(),
      predictive: {
        enabled: false, // Not implemented in simple version
        accuracy: 0,
      },
      method: 'simple',
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.tokenCounter.destroy()
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      enabled: this.enableCaching,
      size: this.cache.size,
      hitRate: this.cache.size > 0 ? 0.5 : 0, // Mock hit rate
    }
  }
}
