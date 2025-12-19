/**
 * Automatic Token Optimization Middleware
 *
 * This module provides seamless token optimization through:
 * - Request/response interception and optimization
 * - Automatic model detection and optimization
 * - Real-time token usage monitoring
 * - Configurable optimization strategies
 * - Integration with existing APIs
 * - Performance tracking and analytics
 */

import { TokenCounter } from '@clarity-chat/token-optimization'
import {
  adaptiveOptimizer,
  optimizeTokensAdaptively,
} from './adaptive-optimizer.js'
import {
  advancedCompressor,
  compressWithAdvanced,
  type AdvancedCompressionStrategy,
} from './advanced-compression.js'
import { semanticCache, getCachedTokenCount } from './intelligent-caching.js'

export type MiddlewareMode =
  | 'automatic'
  | 'manual'
  | 'adaptive'
  | 'budget-aware'
export type OptimizationTarget = 'input' | 'output' | 'both' | 'conversation'
export type MiddlewarePriority = 'performance' | 'quality' | 'cost' | 'balanced'

export interface MiddlewareConfig {
  mode: MiddlewareMode
  target: OptimizationTarget
  priority: MiddlewarePriority
  enabled: boolean
  autoDetectModel: boolean
  enableCaching: boolean
  enableAnalytics: boolean
  enableRealTimeOptimization: boolean
  enableFallback: boolean
  maxRetries: number
  timeout: number
  budgetTokens?: number
  budgetCost?: number
  qualityThreshold?: number
  compressionRatio?: number
  preserveContext?: boolean
  adaptiveLearning?: boolean
}

export interface OptimizationContext {
  model: string
  conversationId?: string
  userId?: string
  sessionId?: string
  timestamp: number
  contextType?: string
  domain?: string
  complexity?: 'low' | 'medium' | 'high'
  historicalData?: any
  userPreferences?: any
}

export interface MiddlewareResult {
  originalText: string
  optimizedText: string
  originalTokens: number
  optimizedTokens: number
  reductionRatio: number
  estimatedQuality: number
  estimatedCost: number
  processingTime: number
  strategyUsed: string
  cacheHit: boolean
  fallbackUsed: boolean
  errors: string[]
  warnings: string[]
  recommendations: string[]
}

export interface TokenUsageMetrics {
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  averageReduction: number
  cacheHitRate: number
  optimizationRate: number
  performanceScore: number
  costSavings: number
}

/**
 * Core token optimization middleware
 */
export class TokenOptimizationMiddleware {
  private config: MiddlewareConfig
  private metrics: TokenUsageMetrics
  private requestHistory: Map<string, any[]>
  private optimizationCache: Map<string, MiddlewareResult>
  private activeConversations: Map<string, OptimizationContext>

  constructor(config: Partial<MiddlewareConfig> = {}) {
    this.config = {
      mode: 'automatic',
      target: 'both',
      priority: 'balanced',
      enabled: true,
      autoDetectModel: true,
      enableCaching: true,
      enableAnalytics: true,
      enableRealTimeOptimization: true,
      enableFallback: true,
      maxRetries: 3,
      timeout: 5000,
      qualityThreshold: 0.8,
      compressionRatio: 0.3,
      preserveContext: true,
      adaptiveLearning: true,
      ...config,
    }

    this.metrics = this.initializeMetrics()
    this.requestHistory = new Map()
    this.optimizationCache = new Map()
    this.activeConversations = new Map()
  }

  /**
   * Main optimization method - processes requests automatically
   */
  async optimize(
    text: string,
    context: OptimizationContext,
    options?: Partial<MiddlewareConfig>
  ): Promise<MiddlewareResult> {
    const startTime = performance.now()
    const config = { ...this.config, ...options }

    if (!config.enabled) {
      return this.createPassthroughResult(text, startTime)
    }

    try {
      // Check cache first
      if (config.enableCaching) {
        const cachedResult = await this.getCachedResult(text, context)
        if (cachedResult) {
          return { ...cachedResult, cacheHit: true }
        }
      }

      // Auto-detect model if needed
      const model = config.autoDetectModel
        ? this.detectModel(text, context)
        : context.model

      // Apply optimization based on mode
      let optimizedResult: MiddlewareResult

      switch (config.mode) {
        case 'automatic':
          optimizedResult = await this.optimizeAutomatically(
            text,
            model,
            context,
            config
          )
          break
        case 'manual':
          optimizedResult = await this.optimizeManually(
            text,
            model,
            context,
            config
          )
          break
        case 'adaptive':
          optimizedResult = await this.optimizeAdaptively(
            text,
            model,
            context,
            config
          )
          break
        case 'budget-aware':
          optimizedResult = await this.optimizeWithBudget(
            text,
            model,
            context,
            config
          )
          break
        default:
          optimizedResult = await this.optimizeAutomatically(
            text,
            model,
            context,
            config
          )
      }

      // Update metrics
      this.updateMetrics(optimizedResult)

      // Cache result
      if (config.enableCaching) {
        await this.cacheResult(text, context, optimizedResult)
      }

      // Record history
      this.recordHistory(context, optimizedResult)

      return optimizedResult
    } catch (error) {
      return this.handleOptimizationError(text, error, startTime)
    }
  }

  /**
   * Automatic optimization with intelligent defaults
   */
  private async optimizeAutomatically(
    text: string,
    model: string,
    context: OptimizationContext,
    config: MiddlewareConfig
  ): Promise<MiddlewareResult> {
    const originalTokens = await TokenCounter.count(text)

    // Apply compression based on content analysis
    const compressionStrategy = this.selectCompressionStrategy(text, context)
    const compressionRatio = this.calculateOptimalCompressionRatio(
      text,
      model,
      context
    )

    const compressedText = await compressWithAdvanced(
      text,
      compressionStrategy,
      compressionRatio,
      config.qualityThreshold || 0.8
    )

    const compressedTokens = await TokenCounter.count(compressedText)
    const reductionRatio = 1 - compressedTokens / originalTokens
    const estimatedQuality = this.estimateQuality(text, compressedText)
    const estimatedCost = this.estimateCost(compressedTokens, model)

    return {
      originalText: text,
      optimizedText: compressedText,
      originalTokens,
      optimizedTokens: compressedTokens,
      reductionRatio,
      estimatedQuality,
      estimatedCost,
      processingTime: performance.now() - context.timestamp,
      strategyUsed: compressionStrategy,
      cacheHit: false,
      fallbackUsed: false,
      errors: [],
      warnings: [],
      recommendations: this.generateRecommendations(
        text,
        compressedText,
        context
      ),
    }
  }

  /**
   * Manual optimization with specific parameters
   */
  private async optimizeManually(
    text: string,
    model: string,
    context: OptimizationContext,
    config: MiddlewareConfig
  ): Promise<MiddlewareResult> {
    const originalTokens = await TokenCounter.count(text)

    // Apply manual compression with specified parameters
    const compressionRatio = config.compressionRatio || 0.3
    const qualityThreshold = config.qualityThreshold || 0.8

    const compressedText = await compressWithAdvanced(
      text,
      'adaptive',
      compressionRatio,
      qualityThreshold
    )

    const compressedTokens = await TokenCounter.count(compressedText)
    const reductionRatio = 1 - compressedTokens / originalTokens
    const estimatedQuality = this.estimateQuality(text, compressedText)
    const estimatedCost = this.estimateCost(compressedTokens, model)

    return {
      originalText: text,
      optimizedText: compressedText,
      originalTokens,
      optimizedTokens: compressedTokens,
      reductionRatio,
      estimatedQuality,
      estimatedCost,
      processingTime: performance.now() - context.timestamp,
      strategyUsed: 'manual',
      cacheHit: false,
      fallbackUsed: false,
      errors: [],
      warnings: [],
      recommendations: [],
    }
  }

  /**
   * Adaptive optimization with learning
   */
  private async optimizeAdaptively(
    text: string,
    model: string,
    context: OptimizationContext,
    config: MiddlewareConfig
  ): Promise<MiddlewareResult> {
    const adaptiveResult = await optimizeTokensAdaptively(
      text,
      model,
      {
        strategy: 'adaptive',
        targetReduction: config.compressionRatio,
        qualityThreshold: config.qualityThreshold,
        adaptiveLearning: config.adaptiveLearning,
        realTimeOptimization: config.enableRealTimeOptimization,
      },
      context.conversationId
    )

    return {
      originalText: text,
      optimizedText: adaptiveResult.optimizedText,
      originalTokens: adaptiveResult.originalTokens,
      optimizedTokens: adaptiveResult.optimizedTokens,
      reductionRatio: adaptiveResult.reductionRatio,
      estimatedQuality: adaptiveResult.estimatedQuality,
      estimatedCost: adaptiveResult.estimatedCost,
      processingTime: performance.now() - context.timestamp,
      strategyUsed: 'adaptive',
      cacheHit: false,
      fallbackUsed: false,
      errors: [],
      warnings: [],
      recommendations: adaptiveResult.recommendations,
    }
  }

  /**
   * Budget-aware optimization
   */
  private async optimizeWithBudget(
    text: string,
    model: string,
    context: OptimizationContext,
    config: MiddlewareConfig
  ): Promise<MiddlewareResult> {
    const originalTokens = await TokenCounter.count(text)
    const budgetTokens = config.budgetTokens
    const budgetCost = config.budgetCost

    let targetTokens = originalTokens

    if (budgetTokens && originalTokens > budgetTokens) {
      targetTokens = budgetTokens
    } else if (budgetCost) {
      const currentCost = this.estimateCost(originalTokens, model)
      if (currentCost > budgetCost) {
        targetTokens = Math.floor((budgetCost / currentCost) * originalTokens)
      }
    }

    const compressionRatio = targetTokens / originalTokens

    const compressedText = await compressWithAdvanced(
      text,
      'adaptive',
      compressionRatio,
      config.qualityThreshold || 0.7 // Lower quality for budget
    )

    const compressedTokens = await TokenCounter.count(compressedText)
    const reductionRatio = 1 - compressedTokens / originalTokens
    const estimatedQuality = this.estimateQuality(text, compressedText)
    const estimatedCost = this.estimateCost(compressedTokens, model)

    return {
      originalText: text,
      optimizedText: compressedText,
      originalTokens,
      optimizedTokens: compressedTokens,
      reductionRatio,
      estimatedQuality,
      estimatedCost,
      processingTime: performance.now() - context.timestamp,
      strategyUsed: 'budget-aware',
      cacheHit: false,
      fallbackUsed: false,
      errors: [],
      warnings: budgetTokens ? [`Budget enforced: ${budgetTokens} tokens`] : [],
      recommendations: [],
    }
  }

  /**
   * Auto-detect model based on text characteristics
   */
  private detectModel(text: string, context: OptimizationContext): string {
    // Simple model detection based on context and text characteristics
    if (context.domain === 'code') return 'gpt-4'
    if (context.complexity === 'high') return 'claude-3-opus'
    if (text.length > 10000) return 'gpt-4-turbo'
    return context.model || 'gpt-3.5-turbo'
  }

  /**
   * Select optimal compression strategy
   */
  private selectCompressionStrategy(
    text: string,
    context: OptimizationContext
  ): AdvancedCompressionStrategy {
    if (context.contextType === 'code') return 'structural'
    if (context.complexity === 'high') return 'semantic_pruning'
    if (text.length > 5000) return 'llmlingua'
    return 'adaptive'
  }

  /**
   * Calculate optimal compression ratio
   */
  private calculateOptimalCompressionRatio(
    text: string,
    model: string,
    context: OptimizationContext
  ): number {
    let ratio = this.config.compressionRatio || 0.3

    // Adjust based on model
    if (model.includes('gpt-4')) ratio = Math.min(ratio * 1.2, 0.6)
    if (model.includes('claude')) ratio = Math.min(ratio * 1.1, 0.5)

    // Adjust based on context
    if (context.contextType === 'code') ratio = Math.max(ratio * 0.5, 0.1)
    if (context.complexity === 'high') ratio = Math.max(ratio * 0.7, 0.15)

    return ratio
  }

  /**
   * Estimate quality of compressed text
   */
  private estimateQuality(
    originalText: string,
    compressedText: string
  ): number {
    const lengthRatio = compressedText.length / originalText.length
    const wordRetention = this.calculateWordRetention(
      originalText,
      compressedText
    )

    return Math.min(1, wordRetention * 0.7 + lengthRatio * 0.3)
  }

  /**
   * Calculate word retention
   */
  private calculateWordRetention(
    originalText: string,
    compressedText: string
  ): number {
    const originalWords = new Set(originalText.toLowerCase().split(/\s+/))
    const compressedWords = new Set(compressedText.toLowerCase().split(/\s+/))

    const retained = [...originalWords].filter((word) =>
      compressedWords.has(word)
    )
    return retained.length / originalWords.size
  }

  /**
   * Estimate cost
   */
  private estimateCost(tokens: number, model: string): number {
    const costPer1k = model.includes('gpt-4') ? 0.03 : 0.001
    return (tokens / 1000) * costPer1k
  }

  /**
   * Get cached result
   */
  private async getCachedResult(
    text: string,
    context: OptimizationContext
  ): Promise<MiddlewareResult | null> {
    const cacheKey = `middleware_${text.slice(0, 100)}_${context.model}`
    return this.optimizationCache.get(cacheKey) || null
  }

  /**
   * Cache result
   */
  private async cacheResult(
    text: string,
    context: OptimizationContext,
    result: MiddlewareResult
  ): Promise<void> {
    const cacheKey = `middleware_${text.slice(0, 100)}_${context.model}`
    this.optimizationCache.set(cacheKey, result)

    // Limit cache size
    if (this.optimizationCache.size > 1000) {
      const firstKey = this.optimizationCache.keys().next().value
      if (firstKey !== undefined) {
        this.optimizationCache.delete(firstKey)
      }
    }
  }

  /**
   * Update metrics
   */
  private updateMetrics(result: MiddlewareResult): void {
    this.metrics.totalInputTokens += result.originalTokens
    this.metrics.totalOutputTokens += result.optimizedTokens
    this.metrics.totalCost += result.estimatedCost
    this.metrics.averageReduction =
      (this.metrics.averageReduction + (1 - result.reductionRatio)) / 2
    this.metrics.cacheHitRate =
      this.metrics.cacheHitRate * 0.9 + (result.cacheHit ? 0.1 : 0)
    this.metrics.costSavings +=
      (result.originalTokens - result.optimizedTokens) * 0.001
  }

  /**
   * Record history
   */
  private recordHistory(
    context: OptimizationContext,
    result: MiddlewareResult
  ): void {
    const key = context.conversationId || context.userId || 'global'
    const history = this.requestHistory.get(key) || []

    history.push({
      timestamp: Date.now(),
      context,
      result,
      tokens: result.originalTokens,
    })

    // Keep only recent history
    if (history.length > 100) {
      history.shift()
    }

    this.requestHistory.set(key, history)
  }

  /**
   * Handle optimization errors
   */
  private handleOptimizationError(
    text: string,
    error: any,
    startTime: number
  ): MiddlewareResult {
    console.warn('Token optimization failed:', error)

    if (this.config.enableFallback) {
      return {
        originalText: text,
        optimizedText: text,
        originalTokens: 0,
        optimizedTokens: 0,
        reductionRatio: 0,
        estimatedQuality: 1,
        estimatedCost: 0,
        processingTime: performance.now() - startTime,
        strategyUsed: 'fallback',
        cacheHit: false,
        fallbackUsed: true,
        errors: [error.message],
        warnings: ['Optimization failed, using original text'],
        recommendations: ['Check optimization configuration'],
      }
    }

    throw error
  }

  /**
   * Create passthrough result
   */
  private createPassthroughResult(
    text: string,
    startTime: number
  ): MiddlewareResult {
    return {
      originalText: text,
      optimizedText: text,
      originalTokens: 0,
      optimizedTokens: 0,
      reductionRatio: 0,
      estimatedQuality: 1,
      estimatedCost: 0,
      processingTime: performance.now() - startTime,
      strategyUsed: 'passthrough',
      cacheHit: false,
      fallbackUsed: false,
      errors: [],
      warnings: ['Optimization disabled'],
      recommendations: [],
    }
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    originalText: string,
    compressedText: string,
    context: OptimizationContext
  ): string[] {
    const recommendations: string[] = []

    const originalLength = originalText.length
    const compressedLength = compressedText.length
    const compressionRatio = 1 - compressedLength / originalLength

    if (compressionRatio < 0.2) {
      recommendations.push(
        'Low compression achieved - consider different optimization strategy'
      )
    }

    if (context.contextType === 'code') {
      recommendations.push(
        'Code content detected - ensure syntax integrity after compression'
      )
    }

    return recommendations
  }

  /**
   * Initialize metrics
   */
  private initializeMetrics(): TokenUsageMetrics {
    return {
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalCost: 0,
      averageReduction: 0,
      cacheHitRate: 0,
      optimizationRate: 0,
      performanceScore: 0,
      costSavings: 0,
    }
  }

  /**
   * Get metrics
   */
  getMetrics(): TokenUsageMetrics {
    return { ...this.metrics }
  }

  /**
   * Get history
   */
  getHistory(id?: string): any[] {
    const key = id || 'global'
    return this.requestHistory.get(key) || []
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<MiddlewareConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get configuration
   */
  getConfig(): MiddlewareConfig {
    return { ...this.config }
  }
}

/**
 * Request interceptor for automatic optimization
 */
export class TokenOptimizationInterceptor {
  private middleware: TokenOptimizationMiddleware
  private enabled: boolean

  constructor(middleware: TokenOptimizationMiddleware) {
    this.middleware = middleware
    this.enabled = true
  }

  /**
   * Intercept and optimize requests
   */
  async interceptRequest(
    request: {
      text: string
      model?: string
      conversationId?: string
      userId?: string
      context?: any
    },
    options?: any
  ): Promise<{
    optimizedText: string
    metrics: any
    originalRequest: any
  }> {
    if (!this.enabled) {
      return {
        optimizedText: request.text,
        metrics: null,
        originalRequest: request,
      }
    }

    const context: OptimizationContext = {
      model: request.model || 'gpt-3.5-turbo',
      conversationId: request.conversationId,
      userId: request.userId,
      timestamp: Date.now(),
      contextType: request.context?.type,
      domain: request.context?.domain,
      complexity: request.context?.complexity,
    }

    const result = await this.middleware.optimize(
      request.text,
      context,
      options
    )

    return {
      optimizedText: result.optimizedText,
      metrics: {
        originalTokens: result.originalTokens,
        optimizedTokens: result.optimizedTokens,
        reductionRatio: result.reductionRatio,
        estimatedCost: result.estimatedCost,
        processingTime: result.processingTime,
        cacheHit: result.cacheHit,
      },
      originalRequest: request,
    }
  }

  /**
   * Enable/disable interceptor
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }
}

/**
 * API wrapper for seamless integration
 */
export class TokenOptimizedAPI {
  private interceptor: TokenOptimizationInterceptor

  constructor(middleware: TokenOptimizationMiddleware) {
    this.interceptor = new TokenOptimizationInterceptor(middleware)
  }

  /**
   * Create API request with automatic optimization
   */
  async createRequest(
    endpoint: string,
    payload: any,
    options?: any
  ): Promise<any> {
    // Extract text content from payload
    const text = this.extractTextFromPayload(payload)

    if (text) {
      const intercepted = await this.interceptor.interceptRequest(
        {
          text,
          model: payload.model,
          conversationId: payload.conversationId,
          userId: payload.userId,
          context: payload.context,
        },
        options
      )

      // Replace text in payload with optimized version
      const optimizedPayload = this.replaceTextInPayload(
        payload,
        intercepted.optimizedText
      )

      return {
        ...optimizedPayload,
        _optimization: intercepted.metrics,
      }
    }

    return payload
  }

  /**
   * Extract text from various payload formats
   */
  private extractTextFromPayload(payload: any): string {
    if (typeof payload === 'string') return payload
    if (payload.text) return payload.text
    if (payload.prompt) return payload.prompt
    if (payload.messages) {
      return payload.messages.map((m: any) => m.content).join(' ')
    }
    return ''
  }

  /**
   * Replace text in payload
   */
  private replaceTextInPayload(payload: any, newText: string): any {
    if (typeof payload === 'string') return newText
    if (payload.text) return { ...payload, text: newText }
    if (payload.prompt) return { ...payload, prompt: newText }
    return payload
  }
}

// Export singleton instances
export const tokenMiddleware = new TokenOptimizationMiddleware({
  mode: 'automatic',
  target: 'both',
  priority: 'balanced',
  enabled: true,
  autoDetectModel: true,
  enableCaching: true,
  enableAnalytics: true,
  enableRealTimeOptimization: true,
  enableFallback: true,
  maxRetries: 3,
  timeout: 5000,
  qualityThreshold: 0.8,
  compressionRatio: 0.3,
  preserveContext: true,
  adaptiveLearning: true,
})

export const tokenInterceptor = new TokenOptimizationInterceptor(
  tokenMiddleware
)
export const tokenOptimizedAPI = new TokenOptimizedAPI(tokenMiddleware)

// Convenience functions
export async function optimizeTokens(
  text: string,
  model: string = 'gpt-3.5-turbo',
  options?: Partial<MiddlewareConfig>
): Promise<string> {
  const context: OptimizationContext = {
    model,
    timestamp: Date.now(),
  }

  const result = await tokenMiddleware.optimize(text, context, options)
  return result.optimizedText
}

export function getOptimizationMetrics(): TokenUsageMetrics {
  return tokenMiddleware.getMetrics()
}

export function getOptimizationHistory(id?: string): any[] {
  return tokenMiddleware.getHistory(id)
}

export function configureMiddleware(config: Partial<MiddlewareConfig>): void {
  tokenMiddleware.updateConfig(config)
}
