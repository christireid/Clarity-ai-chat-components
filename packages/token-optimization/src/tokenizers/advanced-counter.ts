/**
 * Advanced Token Counter with Model-Specific Heuristics
 * 
 * Enhanced token counting with content type detection, confidence levels,
 * and model-specific optimizations based on empirical analysis
 */

import { encoding_for_model } from '@dqbd/tiktoken'

/**
 * Supported model families for token counting
 */
export type ModelFamily = 'gpt-4' | 'gpt-3.5' | 'claude' | 'gemini' | 'generic'

/**
 * Content type affects token counting accuracy
 */
export type ContentType = 'prose' | 'code' | 'mixed' | 'unknown'

/**
 * Token count result with confidence level and content analysis
 */
export interface TokenCountResult {
  /** Estimated token count */
  count: number
  /** Confidence level of the estimate */
  confidence: 'exact' | 'high' | 'approximate'
  /** Content type detected */
  contentType: ContentType
  /** Model used for counting */
  model: ModelFamily
  /** Processing time in milliseconds */
  processingTime: number
  /** Whether cache was used */
  cached: boolean
}

/**
 * Configuration for the advanced token counter
 */
export interface AdvancedTokenizerConfig {
  /** Default model family to use */
  defaultModel: ModelFamily
  /** Enable caching of token counts */
  enableCache: boolean
  /** Cache timeout in milliseconds */
  cacheTimeout: number
  /** Enable content type detection */
  enableContentDetection: boolean
  /** Enable performance monitoring */
  enableMonitoring: boolean
  /** Confidence threshold for approximate counts */
  confidenceThreshold: number
}

/**
 * Performance metrics for the tokenizer
 */
export interface TokenCounterMetrics {
  /** Total token counts performed */
  totalCounts: number
  /** Number of cache hits */
  cacheHits: number
  /** Average processing time */
  averageProcessingTime: number
  /** Distribution of content types */
  contentTypeDistribution: Record<ContentType, number>
  /** Cache hit rate */
  cacheHitRate: number
}

/**
 * Model-specific token ratios based on empirical analysis
 * These ratios represent characters per token for different content types
 */
const MODEL_RATIOS: Record<ModelFamily, Record<ContentType, number>> = {
  'gpt-4': {
    prose: 4.0,
    code: 3.5,
    mixed: 3.8,
    unknown: 3.9
  },
  'gpt-3.5': {
    prose: 4.2,
    code: 3.8,
    mixed: 4.0,
    unknown: 4.1
  },
  'claude': {
    prose: 3.8,
    code: 3.3,
    mixed: 3.6,
    unknown: 3.7
  },
  'gemini': {
    prose: 3.9,
    code: 3.4,
    mixed: 3.7,
    unknown: 3.8
  },
  'generic': {
    prose: 4.0,
    code: 3.5,
    mixed: 3.8,
    unknown: 3.9
  }
}

/**
 * Advanced token counter with caching and content analysis
 */
export class AdvancedTokenCounter {
  private cache: Map<string, { count: number; timestamp: number }>
  private metrics: TokenCounterMetrics
  private tiktokenEncoders: Map<ModelFamily, any>

  constructor(private config: AdvancedTokenizerConfig) {
    this.cache = new Map()
    this.tiktokenEncoders = new Map()
    this.metrics = {
      totalCounts: 0,
      cacheHits: 0,
      averageProcessingTime: 0,
      contentTypeDistribution: {
        prose: 0,
        code: 0,
        mixed: 0,
        unknown: 0
      },
      cacheHitRate: 0
    }

    this.initializeEncoders()
  }

  private initializeEncoders(): void {
    // Initialize Tiktoken encoders for supported models
    try {
      this.tiktokenEncoders.set('gpt-4', encoding_for_model('gpt-4'))
      this.tiktokenEncoders.set('gpt-3.5', encoding_for_model('gpt-3.5-turbo'))
    } catch (error) {
      console.warn('Failed to initialize Tiktoken encoders, falling back to heuristic counting')
    }
  }

  /**
   * Count tokens with high accuracy using Tiktoken when available
   */
  async countWithConfidence(
    text: string,
    model: ModelFamily = this.config.defaultModel
  ): Promise<TokenCountResult> {
    const startTime = Date.now()
    const cacheKey = `${model}:${text}`

    // Check cache first
    if (this.config.enableCache) {
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
        this.metrics.cacheHits++
        this.updateMetrics()
        
        return {
          count: cached.count,
          confidence: 'exact',
          contentType: this.detectContentType(text),
          model,
          processingTime: Date.now() - startTime,
          cached: true
        }
      }
    }

    // Detect content type
    const contentType = this.detectContentType(text)

    // Try to use Tiktoken for exact counting
    let count: number
    let confidence: 'exact' | 'high' | 'approximate' = 'exact'

    const encoder = this.tiktokenEncoders.get(model)
    if (encoder) {
      try {
        count = encoder.encode(text).length
      } catch (error) {
        // Fallback to heuristic counting
        count = this.estimateWithHeuristics(text, model, contentType)
        confidence = 'approximate'
      }
    } else {
      // Use heuristic counting
      count = this.estimateWithHeuristics(text, model, contentType)
      confidence = 'approximate'
    }

    // Cache the result
    if (this.config.enableCache) {
      this.cache.set(cacheKey, { count, timestamp: Date.now() })
    }

    this.metrics.totalCounts++
    this.updateMetrics()

    return {
      count,
      confidence,
      contentType,
      model,
      processingTime: Date.now() - startTime,
      cached: false
    }
  }

  /**
   * Simple token counting without detailed analysis
   */
  count(text: string, model: ModelFamily = this.config.defaultModel): number {
    return Math.ceil(text.length / MODEL_RATIOS[model][this.detectContentType(text)])
  }

  /**
   * Estimate token count using heuristics when exact counting is not available
   */
  private estimateWithHeuristics(
    text: string,
    model: ModelFamily,
    contentType: ContentType
  ): number {
    const ratio = MODEL_RATIOS[model][contentType]
    return Math.ceil(text.length / ratio)
  }

  /**
   * Detect content type based on text characteristics
   */
  private detectContentType(text: string): ContentType {
    const codePatterns = [
      /function\s+\w+\s*\(/,
      /const\s+\w+\s*=/,
      /class\s+\w+/,
      /def\s+\w+\s*\(/,
      /\{.*\}/,
      /\[.*\]/,
      /import\s+\w+/,
      /export\s+\w+/
    ]

    const codeMatches = codePatterns.reduce((count, pattern) => {
      const matches = text.match(pattern)
      return count + (matches ? matches.length : 0)
    }, 0)

    const codeRatio = codeMatches / (text.length / 100)

    if (codeRatio > 2) {
      this.metrics.contentTypeDistribution.code++
      return 'code'
    }
    if (codeRatio > 0.5) {
      this.metrics.contentTypeDistribution.mixed++
      return 'mixed'
    }
    
    this.metrics.contentTypeDistribution.prose++
    return 'prose'
  }

  /**
   * Count tokens for multiple texts efficiently
   */
  async countBatch(
    texts: string[],
    model: ModelFamily = this.config.defaultModel
  ): Promise<number[]> {
    return Promise.all(texts.map(text => this.countWithConfidence(text, model).then(result => result.count)))
  }

  /**
   * Count tokens for multiple texts with confidence information
   */
  async countBatchWithConfidence(
    texts: string[],
    model: ModelFamily = this.config.defaultModel
  ): Promise<TokenCountResult[]> {
    return Promise.all(texts.map(text => this.countWithConfidence(text, model)))
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): TokenCounterMetrics {
    return { ...this.metrics }
  }

  /**
   * Reset performance metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalCounts: 0,
      cacheHits: 0,
      averageProcessingTime: 0,
      contentTypeDistribution: {
        prose: 0,
        code: 0,
        mixed: 0,
        unknown: 0
      },
      cacheHitRate: 0
    }
  }

  /**
   * Update internal metrics
   */
  private updateMetrics(): void {
    this.metrics.cacheHitRate = this.metrics.cacheHits / Math.max(1, this.metrics.totalCounts)
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.cache.clear()
    this.tiktokenEncoders.forEach(encoder => encoder.free())
  }
}

/**
 * Convenience function for quick token counting
 */
export function countTokens(text: string, model?: ModelFamily): number {
  const counter = new AdvancedTokenCounter({
    defaultModel: model || 'generic',
    enableCache: true,
    cacheTimeout: 3600000,
    enableContentDetection: true,
    enableMonitoring: false,
    confidenceThreshold: 0.8
  })
  
  return counter.count(text, model || 'generic')
}

/**
 * Convenience function for token counting with confidence information
 */
export async function countTokensWithConfidence(
  text: string,
  model?: ModelFamily
): Promise<TokenCountResult> {
  const counter = new AdvancedTokenCounter({
    defaultModel: model || 'generic',
    enableCache: true,
    cacheTimeout: 3600000,
    enableContentDetection: true,
    enableMonitoring: false,
    confidenceThreshold: 0.8
  })
  
  return await counter.countWithConfidence(text, model || 'generic')
}