/**
 * Advanced Token Counter with Model-Specific Heuristics
 * 
 * Enhanced token counting with content type detection, confidence levels,
 * and model-specific optimizations based on empirical analysis
 */

import { encoding_for_model, get_encoding, type TiktokenModel } from '@dqbd/tiktoken'

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
  model?: ModelFamily
  /** Additional metadata */
  metadata?: {
    specialTokens?: number
    contentTypeScore?: number
    estimationMethod?: string
  }
}

/**
 * Model-specific character-to-token ratios based on empirical analysis
 */
const MODEL_RATIOS: Record<ModelFamily, { prose: number; code: number }> = {
  'gpt-4': { prose: 4.0, code: 3.5 },
  'gpt-3.5': { prose: 4.0, code: 3.5 },
  'claude': { prose: 3.8, code: 3.3 },
  'gemini': { prose: 3.9, code: 3.4 },
  'generic': { prose: 4.0, code: 3.5 },
}

/**
 * Configuration for advanced token counting
 */
export interface AdvancedTokenizerConfig {
  model?: ModelFamily
  enableCaching?: boolean
  cacheSize?: number
  enableMonitoring?: boolean
  enableContentDetection?: boolean
  fallbackToHeuristics?: boolean
}

/**
 * Performance metrics for token counting operations
 */
export interface TokenCounterMetrics {
  totalOperations: number
  cacheHitRate: number
  averageExecutionTime: number
  contentTypeDistribution: Record<ContentType, number>
  modelAccuracy: Record<ModelFamily, number>
}

/**
 * Advanced token counter with model-specific optimizations
 */
export class AdvancedTokenCounter {
  private static instance: AdvancedTokenCounter
  private encoder: any
  private cache: Map<string, { count: number; timestamp: number }>
  private metrics: TokenCounterMetrics
  private config: Required<AdvancedTokenizerConfig>

  constructor(config: AdvancedTokenizerConfig = {}) {
    this.config = {
      model: config.model || 'generic',
      enableCaching: config.enableCaching ?? true,
      cacheSize: config.cacheSize ?? 10000,
      enableMonitoring: config.enableMonitoring ?? true,
      enableContentDetection: config.enableContentDetection ?? true,
      fallbackToHeuristics: config.fallbackToHeuristics ?? true,
    }

    this.cache = new Map()
    this.metrics = {
      totalOperations: 0,
      cacheHitRate: 0,
      averageExecutionTime: 0,
      contentTypeDistribution: { prose: 0, code: 0, mixed: 0, unknown: 0 },
      modelAccuracy: { 'gpt-4': 0, 'gpt-3.5': 0, claude: 0, gemini: 0, generic: 0 },
    }

    this.initializeEncoder()
    this.setupCacheManagement()
  }

  /**
   * Get singleton instance
   */
  static getInstance(config?: AdvancedTokenizerConfig): AdvancedTokenCounter {
    if (!this.instance) {
      this.instance = new AdvancedTokenCounter(config)
    }
    return this.instance
  }

  /**
   * Initialize the tokenizer encoder
   */
  private initializeEncoder(): void {
    try {
      if (this.config.model && ['gpt-4', 'gpt-3.5'].includes(this.config.model)) {
        this.encoder = encoding_for_model(this.config.model as TiktokenModel)
      } else {
        // Use cl100k_base for most models
        this.encoder = get_encoding('cl100k_base')
      }
    } catch (error) {
      console.warn(`Failed to initialize encoder for ${this.config.model}:`, error)
      this.encoder = null
    }
  }

  /**
   * Detect content type based on text characteristics
   */
  private detectContentType(text: string): ContentType {
    if (!text || text.length === 0) return 'unknown'

    // Code detection patterns
    const codePatterns = [
      /^\s*(function|const|let|var|class|import|export|if|for|while|return)\s/m,
      /[{}();=]/g,
      /^\s*\/\//m,
      /^\s*#\s*(include|define|pragma)/m,
      /^\s*(def|class|import|from|if|elif|else|for|while|return)\s/m,
      /`[^`]*`|'[^']*'|"[^"]*"/g, // String literals
      /\b(console|print|printf|cout|System\.out)\b/g, // Output statements
    ]

    const codeMatches = codePatterns.reduce((count, pattern) => {
      const matches = text.match(pattern)
      return count + (matches ? matches.length : 0)
    }, 0)

    const codeRatio = codeMatches / (text.length / 100)
    const contentTypeScore = codeRatio

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
   * Count special tokens that may affect the count
   */
  private countSpecialTokenAdjustment(text: string): number {
    let adjustment = 0

    // URLs are typically 1 token regardless of length
    const urls = text.match(/https?:\/\/[^\s]+/g)
    if (urls) {
      urls.forEach((url) => {
        // Subtract characters, add 1 token
        adjustment -= Math.floor(url.length / 4) - 1
      })
    }

    // Numbers are typically 1-2 tokens regardless of length
    const numbers = text.match(/\d{4,}/g)
    if (numbers) {
      numbers.forEach((num) => {
        adjustment -= Math.floor(num.length / 4) - 2
      })
    }

    // Email addresses
    const emails = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/g)
    if (emails) {
      emails.forEach(() => {
        adjustment += 1 // Usually 1 token
      })
    }

    return Math.round(adjustment)
  }

  /**
   * Count tokens with high accuracy and confidence assessment
   */
  countWithConfidence(text: string, model?: ModelFamily): TokenCountResult {
    const startTime = performance.now()
    
    if (!text) {
      return {
        count: 0,
        confidence: 'exact',
        contentType: 'unknown',
        model: model || this.config.model,
      }
    }

    const targetModel = model || this.config.model
    const cacheKey = `${text}:${targetModel}`

    // Check cache
    if (this.config.enableCaching) {
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour TTL
        this.updateMetrics('cache_hit')
        return {
          count: cached.count,
          confidence: 'exact',
          contentType: 'unknown', // Could cache this too
          model: targetModel,
        }
      }
    }

    let count: number
    let confidence: 'exact' | 'high' | 'approximate'
    let contentType: ContentType

    // Use tiktoken for exact counting if available
    if (this.encoder && ['gpt-4', 'gpt-3.5'].includes(targetModel)) {
      try {
        count = this.encoder.encode(text).length
        confidence = 'exact'
        contentType = this.config.enableContentDetection ? this.detectContentType(text) : 'unknown'
      } catch (error) {
        // Fallback to heuristics
        count = this.estimateWithHeuristics(text, targetModel)
        confidence = 'approximate'
        contentType = 'unknown'
      }
    } else {
      // Use heuristics for other models
      count = this.estimateWithHeuristics(text, targetModel)
      confidence = this.encoder ? 'high' : 'approximate'
      contentType = this.config.enableContentDetection ? this.detectContentType(text) : 'unknown'
    }

    const result: TokenCountResult = {
      count: Math.max(1, count),
      confidence,
      contentType,
      model: targetModel,
      metadata: {
        specialTokens: this.countSpecialTokenAdjustment(text),
        contentTypeScore: contentType !== 'unknown' ? 0.8 : 0,
        estimationMethod: confidence === 'exact' ? 'tiktoken' : 'heuristic',
      },
    }

    // Cache result
    if (this.config.enableCaching) {
      this.addToCache(cacheKey, result.count)
    }

    this.updateMetrics('operation', performance.now() - startTime)
    return result
  }

  /**
   * Estimate tokens using model-specific heuristics
   */
  private estimateWithHeuristics(text: string, model: ModelFamily): number {
    if (!this.config.fallbackToHeuristics) {
      return Math.ceil(text.length / 4) // Basic fallback
    }

    const contentType = this.detectContentType(text)
    const ratios = MODEL_RATIOS[model]

    let ratio: number
    switch (contentType) {
      case 'code':
        ratio = ratios.code
        break
      case 'prose':
        ratio = ratios.prose
        break
      case 'mixed':
        ratio = (ratios.code + ratios.prose) / 2
        break
      default:
        ratio = 4.0 // Default chars per token
    }

    const baseCount = Math.ceil(text.length / ratio)
    const adjustment = this.countSpecialTokenAdjustment(text)
    return Math.max(1, baseCount + adjustment)
  }

  /**
   * Count tokens (backward compatible)
   */
  count(text: string, model?: ModelFamily): number {
    return this.countWithConfidence(text, model).count
  }

  /**
   * Count tokens in multiple texts efficiently
   */
  countBatch(texts: string[], model?: ModelFamily): number {
    return texts.reduce((sum, text) => sum + this.count(text, model), 0)
  }

  /**
   * Count multiple texts with confidence information
   */
  countBatchWithConfidence(texts: string[], model?: ModelFamily): TokenCountResult {
    if (texts.length === 0) {
      return {
        count: 0,
        confidence: 'exact',
        contentType: 'unknown',
        model: model || this.config.model,
      }
    }

    let totalCount = 0
    let hasApproximate = false
    const contentTypes: ContentType[] = []

    for (const text of texts) {
      const result = this.countWithConfidence(text, model)
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
      model: model || this.config.model,
    }
  }

  /**
   * Truncate text to fit token budget with intelligent boundary detection
   */
  truncate(text: string, maxTokens: number): string {
    const tokens = this.count(text)
    if (tokens <= maxTokens) return text

    const ratio = maxTokens / tokens
    const targetLength = Math.floor(text.length * ratio)

    // Try to break at natural boundaries
    const truncated = text.slice(0, targetLength)
    const boundaries = [
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('\n'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?'),
      truncated.lastIndexOf(';'),
      truncated.lastIndexOf(','),
    ].filter(pos => pos > targetLength * 0.7) // Only consider boundaries in the last 30%

    const breakPoint = Math.max(...boundaries)

    if (breakPoint > targetLength * 0.7) {
      return text.slice(0, breakPoint + 1).trim()
    }

    // If no good boundary found, use binary search for exact token count
    return this.truncateWithBinarySearch(text, maxTokens)
  }

  /**
   * Truncate using binary search for exact token count
   */
  private truncateWithBinarySearch(text: string, maxTokens: number): string {
    let left = 0
    let right = text.length

    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      const truncated = text.slice(0, mid)
      const truncatedTokens = this.count(truncated)

      if (truncatedTokens <= maxTokens) {
        left = mid + 1
      } else {
        right = mid
      }
    }

    const result = text.slice(0, left - 1).trim()
    return result || text.slice(0, maxTokens * 3) // Fallback
  }

  /**
   * Split text into sentences
   */
  splitSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  }

  /**
   * Get token-to-character ratio for current model
   */
  getTokenRatio(contentType: ContentType = 'prose'): number {
    const ratios = MODEL_RATIOS[this.config.model]
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
   * Update performance metrics
   */
  private updateMetrics(type: 'operation' | 'cache_hit', value?: number): void {
    if (!this.config.enableMonitoring) return

    this.metrics.totalOperations++

    if (type === 'cache_hit') {
      // Update cache hit rate
      const totalOps = this.metrics.totalOperations
      const currentHits = this.metrics.cacheHitRate * (totalOps - 1)
      this.metrics.cacheHitRate = (currentHits + 1) / totalOps
    } else if (type === 'operation' && value) {
      // Update average execution time
      const currentTotal = this.metrics.averageExecutionTime * (this.metrics.totalOperations - 1)
      this.metrics.averageExecutionTime = (currentTotal + value) / this.metrics.totalOperations
    }
  }

  /**
   * Add result to cache with TTL
   */
  private addToCache(key: string, count: number): void {
    // If cache is full, remove oldest entries
    if (this.config.cacheSize && this.cache.size >= this.config.cacheSize) {
      const entriesToRemove = Math.floor(this.cache.size * 0.1) // Remove 10% of entries
      const entries = Array.from(this.cache.entries())
      for (let i = 0; i < entriesToRemove && i < entries.length; i++) {
        this.cache.delete(entries[i][0])
      }
    }

    this.cache.set(key, { count, timestamp: Date.now() })
  }

  /**
   * Setup automatic cache management
   */
  private setupCacheManagement(): void {
    if (!this.config.enableCaching) return

    // Clear expired entries every 5 minutes
    setInterval(() => {
      const now = Date.now()
      const expiredKeys: string[] = []

      for (const [key, entry] of this.cache) {
        if (now - entry.timestamp > 3600000) { // 1 hour TTL
          expiredKeys.push(key)
        }
      }

      expiredKeys.forEach(key => this.cache.delete(key))

      if (this.config.enableMonitoring && expiredKeys.length > 0) {
        console.log(`[AdvancedTokenCounter] Cleared ${expiredKeys.length} expired cache entries`)
      }
    }, 300000)
  }

  /**
   * Get performance metrics
   */
  getMetrics(): TokenCounterMetrics {
    return { ...this.metrics }
  }

  /**
   * Reset performance metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalOperations: 0,
      cacheHitRate: 0,
      averageExecutionTime: 0,
      contentTypeDistribution: { prose: 0, code: 0, mixed: 0, unknown: 0 },
      modelAccuracy: { 'gpt-4': 0, 'gpt-3.5': 0, claude: 0, gemini: 0, generic: 0 },
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.cache.clear()
    this.encoder = null
  }
}

/**
 * Convenience function for counting tokens with confidence
 */
export function countTokensWithConfidence(
  text: string,
  model?: ModelFamily,
  config?: AdvancedTokenizerConfig
): TokenCountResult {
  const counter = AdvancedTokenCounter.getInstance(config)
  return counter.countWithConfidence(text, model)
}

/**
 * Convenience function for basic token counting
 */
export function countTokens(text: string, model?: ModelFamily): number {
  const counter = AdvancedTokenCounter.getInstance()
  return counter.count(text, model)
}