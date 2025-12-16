/**
 * Unified Token Optimizer
 * 
 * Combines all token optimization techniques into a single, easy-to-use interface
 * with intelligent strategy selection and enterprise-grade security
 */

import {
  AccurateTokenCounter,
  TokenSecurityManager,
  ToonOptimizer
} from './index'

import type {
  TokenizerConfig,
  SecurityConfig,
  ToonConfig,
  CompressionResult,
  OptimizationResult
} from './types'

export interface UnifiedOptimizerConfig {
  tokenizer: TokenizerConfig
  security: SecurityConfig
  toon?: ToonConfig
  enableAllStrategies?: boolean
  autoSelectStrategy?: boolean
}

export interface OptimizationContext {
  conversationHistory?: string[]
  userProfile?: any
  currentTask?: string
  constraints?: any
  securityLevel?: 'basic' | 'enterprise' | 'government'
  userId?: string
  sessionId?: string
}

/**
 * Unified Token Optimizer - The main interface for token optimization
 */
export class UnifiedTokenOptimizer {
  private tokenCounter: AccurateTokenCounter
  private securityManager: TokenSecurityManager
  private toonOptimizer: ToonOptimizer

  private config: UnifiedOptimizerConfig

  constructor(config: UnifiedOptimizerConfig) {
    this.config = config
    
    // Initialize core components
    this.tokenCounter = new AccurateTokenCounter(config.tokenizer)
    this.securityManager = new TokenSecurityManager(config.security)
    this.toonOptimizer = new ToonOptimizer(config.toon || { 
      enableArrayTables: true,
      maxArraySizeForTable: 100,
      preserveKeys: true,
      compactNumbers: true,
      quoteStrings: true
    })
  }

  /**
   * Optimize text using intelligent strategy selection
   */
  async optimize(
    text: string,
    context?: OptimizationContext,
    options?: {
      maxTokens?: number
      targetCompression?: number
      preserveMeaning?: boolean
      strategy?: string
    }
  ): Promise<OptimizationResult> {
    const {
      maxTokens,
      targetCompression = 0.5,
      strategy
    } = options || {}

    // Security check first
    const securityResult = this.securityManager.sanitizeInput(text)
    let processedText = securityResult.sanitized

    // Apply security measures
    if (this.config.security.enablePIIRedaction && 'redactPII' in this.securityManager) {
      const piiResult = (this.securityManager as any).redactPII(processedText)
      processedText = piiResult.protected
    }

    let compressionResult: CompressionResult | null = null
    let finalStrategy = strategy || 'basic'

    // Strategy selection
    if (!strategy && this.config.autoSelectStrategy !== false) {
      finalStrategy = this.selectOptimalStrategy(processedText, context)
    }

    // Apply selected strategy
    switch (finalStrategy) {
      case 'toon':
        if (this.isStructuredData(processedText)) {
          try {
            const data = JSON.parse(processedText)
            const toonText = ToonOptimizer.optimizeForLLM(data)
            compressionResult = {
              original: processedText,
              compressed: toonText,
              originalTokens: this.tokenCounter.count(processedText),
              compressedTokens: this.tokenCounter.count(toonText),
              compressionRatio: this.tokenCounter.count(processedText) / this.tokenCounter.count(toonText),
              method: 'toon',
              qualityScore: 0.9
            }
          } catch {
            // Fallback to basic compression if JSON parsing fails
            compressionResult = this.basicCompress(processedText, targetCompression)
          }
        } else {
          // Fallback to basic compression
          compressionResult = this.basicCompress(processedText, targetCompression)
        }
        break

      case 'basic':
      default:
        compressionResult = this.basicCompress(processedText, targetCompression)
        break
    }

    // Apply token limit if specified
    if (maxTokens && compressionResult && compressionResult.compressedTokens > maxTokens) {
      const truncated = this.tokenCounter.truncate(compressionResult.compressed, maxTokens)
      compressionResult = {
        ...compressionResult,
        compressed: truncated,
        compressedTokens: maxTokens,
        original: compressionResult.original || processedText,
        originalTokens: compressionResult.originalTokens || this.tokenCounter.count(processedText)
      }
    }

    // Calculate final metrics
    const originalTokens = this.tokenCounter.count(text)
    const finalText = compressionResult?.compressed || processedText
    const finalTokens = compressionResult?.compressedTokens || this.tokenCounter.count(processedText)
    // const compressionRatio = originalTokens / finalTokens
    const tokenSavings = originalTokens - finalTokens
    const savingsPercentage = (tokenSavings / originalTokens) * 100

    return {
      original: text,
      optimized: finalText,
      originalTokens,
      optimizedTokens: finalTokens,
      savings: tokenSavings,
      percentage: savingsPercentage,
      method: finalStrategy,
      security: {
        sanitized: securityResult.sanitized !== text,
        threats: securityResult.threats,
        riskLevel: securityResult.riskLevel
      }
    }
  }

  /**
   * Basic compression strategy
   */
  private basicCompress(text: string, targetRatio: number): CompressionResult {
    const originalTokens = this.tokenCounter.count(text)
    const targetTokens = Math.floor(originalTokens * targetRatio)
    
    // Simple truncation-based compression
    const compressed = this.tokenCounter.truncate(text, targetTokens)
    const compressedTokens = this.tokenCounter.count(compressed)
    
    return {
      original: text,
      compressed,
      originalTokens,
      compressedTokens,
      compressionRatio: originalTokens / compressedTokens,
      method: 'basic',
      qualityScore: 0.8
    }
  }

  /**
   * Select optimal strategy based on text and context
   */
  private selectOptimalStrategy(text: string, context?: OptimizationContext): string {
    // Simple heuristic-based strategy selection
    
    // Check if text contains structured data patterns
    if (this.isStructuredData(text)) {
      return 'toon'
    }

    // Check context for hints
    if (context?.currentTask?.includes('compress') || context?.currentTask?.includes('optimize')) {
      return 'basic'
    }

    // Default strategy based on text characteristics
    const tokens = this.tokenCounter.count(text)
    if (tokens > 1000) {
      return 'basic' // Use basic compression for longer texts
    }

    return 'basic'
  }

  /**
   * Check if text contains structured data
   */
  private isStructuredData(text: string): boolean {
    // Simple heuristics for structured data detection
    const structuredPatterns = [
      /\{[\s\S]*\}/, // JSON-like
      /\[[\s\S]*\]/, // Array-like
      /\w+:\s*[^\n]+/m, // Key-value pairs
      /\|\s*\w+\s*\|/m // Table-like
    ]

    return structuredPatterns.some(pattern => pattern.test(text))
  }

  /**
   * Get tokenizer instance
   */
  getTokenizer(): AccurateTokenCounter {
    return this.tokenCounter
  }

  /**
   * Get security manager
   */
  getSecurityManager(): TokenSecurityManager {
    return this.securityManager
  }

  /**
   * Get TOON optimizer
   */
  getToonOptimizer(): ToonOptimizer {
    return this.toonOptimizer
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<UnifiedOptimizerConfig>): void {
    this.config = { ...this.config, ...newConfig }
    
    // Reinitialize components if needed
    if (newConfig.tokenizer) {
      this.tokenCounter = new AccurateTokenCounter(newConfig.tokenizer)
    }
    if (newConfig.security) {
      this.securityManager = new TokenSecurityManager(newConfig.security)
    }
    if (newConfig.toon) {
      this.toonOptimizer = new ToonOptimizer(newConfig.toon)
    }
  }
}