/**
 * Response Token Optimization Techniques
 *
 * This module implements advanced techniques for optimizing LLM responses:
 * - Response length prediction and control
 * - Output token budget management
 * - Response quality vs. length optimization
 * - Streaming response optimization
 * - Multi-turn conversation response optimization
 * - Response caching and reuse
 */

import { TokenCounter } from '@clarity-chat/token-optimization'
import { adaptiveOptimizer } from './adaptive-optimizer'

export type ResponseOptimizationStrategy =
  | 'length_control' // Control response length
  | 'quality_balance' // Balance quality vs. length
  | 'streaming' // Optimize streaming responses
  | 'caching' // Cache and reuse responses
  | 'budget_aware' // Budget-aware responses
  | 'adaptive' // Adaptive based on context
  | 'multi_turn' // Multi-turn conversation optimization
  | 'predictive' // Predict optimal response length

export interface ResponseOptimizationConfig {
  strategy: ResponseOptimizationStrategy
  maxTokens?: number
  targetTokens?: number
  minQuality?: number
  preserveInformation?: boolean
  enableStreaming?: boolean
  enableCaching?: boolean
  adaptive?: boolean
  budgetAware?: boolean
  contextAware?: boolean
}

export interface ResponseMetrics {
  actualTokens: number
  predictedTokens: number
  qualityScore: number
  informationDensity: number
  responseTime: number
  cost: number
  userSatisfaction?: number
  relevanceScore?: number
}

/** User preferences for conversation context */
interface UserPreferences {
  preferredResponseLength?: 'short' | 'medium' | 'long'
  verbosity?: number
  [key: string]: unknown
}

/** Historical response record */
interface HistoricalResponse {
  tokens?: number
  content?: string
  timestamp?: number
  [key: string]: unknown
}

export interface ConversationContext {
  conversationId: string
  turnCount: number
  averageResponseLength: number
  userPreferences: UserPreferences
  historicalResponses: HistoricalResponse[]
  contextWindowUsage: number
  topics: string[]
}

export interface ResponsePrediction {
  predictedTokens: number
  confidence: number
  optimalLength: number
  qualityEstimate: number
  costEstimate: number
  strategy: string
}

/** Historical data record for prediction */
interface HistoricalDataRecord {
  timestamp: number
  prompt: string
  actualTokens: number
  predictedTokens: number
  accuracy: number
  context?: ConversationContext
}

/** Historical pattern for prediction */
interface HistoricalPattern {
  averageTokens: number
  trend: number
  consistency: number
}

/** Prompt analysis result */
interface PromptAnalysis {
  complexity: number
  questionType: string
  domain: string
  length: number
  hasExamples: boolean
  hasConstraints: boolean
}

/**
 * Advanced response length predictor using ML techniques
 */
export class ResponseLengthPredictor {
  private historicalData: Map<string, HistoricalDataRecord[]>
  private predictionModels: Map<string, unknown>

  constructor() {
    this.historicalData = new Map()
    this.predictionModels = new Map()
  }

  /**
   * Predict optimal response length based on prompt and context
   */
  async predictResponseLength(
    prompt: string,
    model: string,
    context?: ConversationContext
  ): Promise<ResponsePrediction> {
    const promptTokens = await TokenCounter.count(prompt)

    // Analyze prompt characteristics
    const promptAnalysis = this.analyzePrompt(prompt)
    const historicalPattern = this.getHistoricalPattern(model, context)

    // Base prediction on prompt characteristics
    let predictedTokens = this.basePrediction(
      promptTokens,
      promptAnalysis,
      model
    )

    // Adjust based on historical patterns
    if (historicalPattern) {
      predictedTokens = this.adjustPrediction(
        predictedTokens,
        historicalPattern
      )
    }

    // Adjust based on context
    if (context) {
      predictedTokens = this.adjustForContext(predictedTokens, context)
    }

    // Calculate confidence and other metrics
    const confidence = this.calculateConfidence(
      promptAnalysis,
      historicalPattern
    )
    const optimalLength = this.calculateOptimalLength(predictedTokens, model)
    const qualityEstimate = this.estimateQuality(predictedTokens, optimalLength)
    const costEstimate = this.estimateCost(predictedTokens, model)

    return {
      predictedTokens,
      confidence,
      optimalLength,
      qualityEstimate,
      costEstimate,
      strategy: this.selectStrategy(predictedTokens, model, context),
    }
  }

  /**
   * Analyze prompt characteristics
   */
  private analyzePrompt(prompt: string): PromptAnalysis {
    const words = prompt.split(/\s+/).length
    const sentences = prompt.split(/[.!?]+/).length
    const complexity = this.calculateComplexity(prompt)
    const questionType = this.detectQuestionType(prompt)
    const domain = this.detectDomain(prompt)
    const hasExamples = /\b(example|instance|sample)\b/i.test(prompt)
    const hasConstraints = /\b(limit|max|min|within)\b/i.test(prompt)

    return {
      complexity: complexity,
      questionType,
      domain,
      length: words,
      hasExamples,
      hasConstraints,
    }
  }

  /**
   * Base prediction based on prompt characteristics
   */
  private basePrediction(
    promptTokens: number,
    analysis: PromptAnalysis,
    model: string
  ): number {
    let baseTokens = promptTokens * 0.7 // Default ratio

    // Adjust based on question type
    switch (analysis.questionType) {
      case 'factual':
        baseTokens *= 0.5
        break
      case 'explanatory':
        baseTokens *= 1.2
        break
      case 'creative':
        baseTokens *= 1.5
        break
      case 'analytical':
        baseTokens *= 1.8
        break
      case 'code':
        baseTokens *= 2.0
        break
    }

    // Adjust based on complexity
    baseTokens *= 1 + (analysis.complexity - 0.5) * 0.5

    // Adjust based on domain
    switch (analysis.domain) {
      case 'technical':
        baseTokens *= 1.3
        break
      case 'creative':
        baseTokens *= 1.4
        break
      case 'academic':
        baseTokens *= 1.6
        break
      case 'code':
        baseTokens *= 2.2
        break
    }

    // Model-specific adjustments
    if (model.includes('gpt-4')) {
      baseTokens *= 0.9 // GPT-4 tends to be more concise
    } else if (model.includes('claude')) {
      baseTokens *= 1.1 // Claude tends to be more detailed
    }

    return Math.round(baseTokens)
  }

  /**
   * Get historical pattern for model and context
   */
  private getHistoricalPattern(
    model: string,
    context?: ConversationContext
  ): HistoricalPattern | null {
    const key = `${model}_${context?.conversationId || 'global'}`
    const history = this.historicalData.get(key) || []

    if (history.length < 3) return null

    const recent = history.slice(-5)
    const avgTokens =
      recent.reduce((sum, h) => sum + h.actualTokens, 0) / recent.length
    const trend = this.calculateTrend(recent.map((h) => h.actualTokens))

    return {
      averageTokens: avgTokens,
      trend,
      consistency: this.calculateConsistency(recent.map((h) => h.actualTokens)),
    }
  }

  /**
   * Adjust prediction based on historical patterns
   */
  private adjustPrediction(
    predictedTokens: number,
    historicalPattern: HistoricalPattern | null
  ): number {
    if (!historicalPattern) return predictedTokens

    const { averageTokens, trend, consistency } = historicalPattern

    // Weighted average of predicted and historical
    const weight = consistency * 0.7 // Higher weight for consistent patterns
    const adjusted = predictedTokens * (1 - weight) + averageTokens * weight

    // Apply trend
    const trendFactor = 1 + trend * 0.1

    return Math.round(adjusted * trendFactor)
  }

  /**
   * Adjust prediction for conversation context
   */
  private adjustForContext(
    predictedTokens: number,
    context: ConversationContext
  ): number {
    let adjusted = predictedTokens

    // Adjust based on conversation turn
    if (context.turnCount > 5) {
      adjusted *= 0.9 // Later turns tend to be shorter
    }

    // Adjust based on average response length
    if (context.averageResponseLength > 0) {
      const ratio = context.averageResponseLength / predictedTokens
      adjusted = adjusted * 0.7 + context.averageResponseLength * 0.3
    }

    // Adjust based on context window usage
    if (context.contextWindowUsage > 0.8) {
      adjusted *= 0.8 // Compress responses when context is full
    }

    return Math.round(adjusted)
  }

  /**
   * Calculate confidence in prediction
   */
  private calculateConfidence(
    promptAnalysis: PromptAnalysis,
    historicalPattern?: HistoricalPattern | null
  ): number {
    let confidence = 0.5 // Base confidence

    // Increase confidence with more prompt information
    if (promptAnalysis.hasConstraints) confidence += 0.2
    if (promptAnalysis.hasExamples) confidence += 0.1

    // Increase confidence with historical data
    const consistency = historicalPattern?.consistency
    if (consistency !== undefined && consistency > 0.8) confidence += 0.2
    if (
      historicalPattern?.trend !== 0 &&
      historicalPattern?.trend !== undefined
    )
      confidence += 0.1

    return Math.min(0.95, confidence)
  }

  /**
   * Calculate optimal length based on predicted tokens
   */
  private calculateOptimalLength(
    predictedTokens: number,
    model: string
  ): number {
    const modelMultiplier = model.includes('gpt-4') ? 0.9 : 1.0
    return Math.round(predictedTokens * modelMultiplier)
  }

  /**
   * Estimate quality based on predicted length
   */
  private estimateQuality(
    predictedTokens: number,
    optimalLength: number
  ): number {
    const ratio = predictedTokens / optimalLength
    if (ratio >= 0.8 && ratio <= 1.2) return 0.9
    if (ratio >= 0.6 && ratio <= 1.4) return 0.7
    return 0.5
  }

  /**
   * Estimate cost based on predicted tokens
   */
  private estimateCost(predictedTokens: number, model: string): number {
    const costPer1k = model.includes('gpt-4') ? 0.06 : 0.002
    return (predictedTokens / 1000) * costPer1k
  }

  /**
   * Select optimal strategy
   */
  private selectStrategy(
    predictedTokens: number,
    model: string,
    context?: ConversationContext
  ): string {
    if (context && context.contextWindowUsage > 0.8)
      return 'aggressive_compression'
    if (predictedTokens > 1000) return 'selective_context'
    if (model.includes('gpt-4')) return 'concise'
    return 'balanced'
  }

  /**
   * Calculate complexity
   */
  private calculateComplexity(text: string): number {
    const words = text.split(/\s+/).length
    const sentences = text.split(/[.!?]+/).length
    const avgWordsPerSentence = words / Math.max(sentences, 1)
    const technicalTerms = (
      text.match(/\b(algorithm|methodology|framework)\b/gi) || []
    ).length

    let complexity = 0.5
    if (avgWordsPerSentence > 15) complexity += 0.2
    if (technicalTerms > 2) complexity += 0.2
    if (words > 100) complexity += 0.1

    return Math.min(1, complexity)
  }

  /**
   * Detect question type
   */
  private detectQuestionType(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase()

    if (/\b(what|when|where|who)\b/.test(lowerPrompt)) return 'factual'
    if (/\b(how|why|explain|describe)\b/.test(lowerPrompt)) return 'explanatory'
    if (/\b(create|write|generate|imagine)\b/.test(lowerPrompt))
      return 'creative'
    if (/\b(analyze|compare|evaluate|assess)\b/.test(lowerPrompt))
      return 'analytical'
    if (/\b(code|function|implement|build)\b/.test(lowerPrompt)) return 'code'

    return 'general'
  }

  /**
   * Detect domain
   */
  private detectDomain(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase()

    if (/\b(code|function|program|algorithm)\b/.test(lowerPrompt)) return 'code'
    if (/\b(medical|health|patient|diagnosis)\b/.test(lowerPrompt))
      return 'medical'
    if (/\b(legal|law|court|contract)\b/.test(lowerPrompt)) return 'legal'
    if (/\b(technical|system|architecture)\b/.test(lowerPrompt))
      return 'technical'
    if (/\b(research|academic|study|theory)\b/.test(lowerPrompt))
      return 'academic'
    if (/\b(creative|story|poem|art)\b/.test(lowerPrompt)) return 'creative'

    return 'general'
  }

  /**
   * Calculate trend
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0
    const recent = values.slice(-3)
    const earlier = values.slice(0, 3)
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length
    return (recentAvg - earlierAvg) / earlierAvg
  }

  /**
   * Calculate consistency
   */
  private calculateConsistency(values: number[]): number {
    if (values.length < 2) return 0
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
      values.length
    const stdDev = Math.sqrt(variance)
    return avg > 0 ? Math.max(0, 1 - stdDev / avg) : 0
  }

  /**
   * Record actual response for learning
   */
  async recordActualResponse(
    prompt: string,
    actualResponse: string,
    model: string,
    context?: ConversationContext
  ): Promise<void> {
    const key = `${model}_${context?.conversationId || 'global'}`
    const history = this.historicalData.get(key) || []

    const actualTokens = await TokenCounter.count(actualResponse)
    const prediction = await this.predictResponseLength(prompt, model, context)

    history.push({
      timestamp: Date.now(),
      prompt,
      actualTokens,
      predictedTokens: prediction.predictedTokens,
      accuracy:
        1 -
        Math.abs(actualTokens - prediction.predictedTokens) /
          Math.max(actualTokens, 1),
      context,
    })

    // Keep only recent history
    if (history.length > 100) {
      history.shift()
    }

    this.historicalData.set(key, history)
  }

  /**
   * Get prediction accuracy
   */
  getAccuracy(model: string, conversationId?: string): number {
    const key = `${model}_${conversationId || 'global'}`
    const history = this.historicalData.get(key) || []

    if (history.length === 0) return 0

    const recent = history.slice(-10)
    const avgAccuracy =
      recent.reduce((sum, h) => sum + h.accuracy, 0) / recent.length
    return avgAccuracy
  }
}

/**
 * Response optimizer with budget and quality control
 */
export class ResponseOptimizer {
  private predictor: ResponseLengthPredictor
  private tokenCounter: TokenCounter

  constructor() {
    this.predictor = new ResponseLengthPredictor()
    this.tokenCounter = new TokenCounter()
  }

  /**
   * Optimize response generation
   */
  async optimizeResponse(
    prompt: string,
    model: string,
    config: ResponseOptimizationConfig,
    context?: ConversationContext
  ): Promise<{
    optimizedPrompt: string
    predictedResponse: ResponsePrediction
    strategy: string
    metrics: ResponseMetrics
  }> {
    // Predict optimal response length
    const prediction = await this.predictor.predictResponseLength(
      prompt,
      model,
      context
    )

    // Generate optimized prompt
    const optimizedPrompt = this.generateOptimizedPrompt(
      prompt,
      prediction,
      config,
      context
    )

    // Calculate metrics
    const metrics = await this.calculateResponseMetrics(
      prompt,
      optimizedPrompt,
      prediction,
      model
    )

    return {
      optimizedPrompt,
      predictedResponse: prediction,
      strategy: prediction.strategy,
      metrics,
    }
  }

  /**
   * Generate optimized prompt for response control
   */
  private generateOptimizedPrompt(
    originalPrompt: string,
    prediction: ResponsePrediction,
    config: ResponseOptimizationConfig,
    context?: ConversationContext
  ): string {
    let optimizedPrompt = originalPrompt

    // Add length control instructions
    if (
      config.strategy === 'length_control' ||
      prediction.predictedTokens > 500
    ) {
      const maxWords = Math.round(prediction.predictedTokens * 0.75) // Approximate words
      optimizedPrompt += `\n\nPlease provide a concise response within ${maxWords} words.`
    }

    // Add quality instructions
    if (config.minQuality && config.minQuality > 0.8) {
      optimizedPrompt += `\nFocus on accuracy and clarity over length.`
    }

    // Add context preservation
    if (config.preserveInformation && context) {
      optimizedPrompt += `\nMaintain the key information from our previous discussion.`
    }

    // Add budget awareness
    if (config.budgetAware) {
      optimizedPrompt += `\nBe concise and cost-effective in your response.`
    }

    return optimizedPrompt
  }

  /**
   * Calculate response metrics
   */
  private async calculateResponseMetrics(
    originalPrompt: string,
    optimizedPrompt: string,
    prediction: ResponsePrediction,
    model: string
  ): Promise<ResponseMetrics> {
    const originalTokens = await TokenCounter.count(originalPrompt)
    const optimizedTokens = await TokenCounter.count(optimizedPrompt)
    const predictedTokens = prediction.predictedTokens

    const informationDensity = this.calculateInformationDensity(optimizedPrompt)
    const responseTime = this.estimateResponseTime(predictedTokens, model)
    const cost = this.estimateCost(predictedTokens, model)

    return {
      actualTokens: optimizedTokens,
      predictedTokens,
      qualityScore: prediction.qualityEstimate,
      informationDensity,
      responseTime,
      cost,
    }
  }

  /**
   * Calculate information density
   */
  private calculateInformationDensity(text: string): number {
    const words = text.split(/\s+/).length
    const sentences = text.split(/[.!?]+/).length
    const keyTerms = (text.match(/\b(key|important|main|critical)\b/gi) || [])
      .length

    let density = 0.5
    if (sentences > 0) density += Math.min(0.3, words / (sentences * 20))
    if (keyTerms > 0) density += Math.min(0.2, keyTerms / 5)

    return Math.min(1, density)
  }

  /**
   * Estimate response time
   */
  private estimateResponseTime(tokens: number, model: string): number {
    const baseTime = model.includes('gpt-4') ? 50 : 30 // ms per token
    return tokens * baseTime
  }

  /**
   * Estimate cost
   */
  private estimateCost(tokens: number, model: string): number {
    const costPer1k = model.includes('gpt-4') ? 0.06 : 0.002
    return (tokens / 1000) * costPer1k
  }

  /**
   * Optimize streaming response
   */
  async optimizeStreamingResponse(
    prompt: string,
    model: string,
    chunkSize: number = 100
  ): Promise<{
    optimizedPrompt: string
    streamingStrategy: string
    estimatedChunks: number
    metrics: ResponseMetrics
  }> {
    const prediction = await this.predictor.predictResponseLength(prompt, model)
    const estimatedChunks = Math.ceil(prediction.predictedTokens / chunkSize)

    const optimizedPrompt =
      prompt +
      `\n\nPlease provide your response in chunks of approximately ${chunkSize} tokens.`

    const metrics: ResponseMetrics = {
      actualTokens: await TokenCounter.count(optimizedPrompt),
      predictedTokens: prediction.predictedTokens,
      qualityScore: prediction.qualityEstimate,
      informationDensity: 0.7,
      responseTime: prediction.predictedTokens * 20, // Faster per token for streaming
      cost: this.estimateCost(prediction.predictedTokens, model),
    }

    return {
      optimizedPrompt,
      streamingStrategy: 'chunked',
      estimatedChunks,
      metrics,
    }
  }

  /**
   * Control response budget
   */
  async controlResponseBudget(
    prompt: string,
    model: string,
    maxTokens: number,
    minQuality: number = 0.7
  ): Promise<{
    optimizedPrompt: string
    budgetStrategy: string
    predictedTokens: number
    confidence: number
  }> {
    const prediction = await this.predictor.predictResponseLength(prompt, model)

    let optimizedPrompt = prompt
    let budgetStrategy = 'none'

    if (prediction.predictedTokens > maxTokens) {
      // Need to constrain response
      const targetWords = Math.round(maxTokens * 0.75)
      optimizedPrompt += `\n\nPlease limit your response to ${targetWords} words or less.`
      budgetStrategy = 'hard_limit'
    } else if (prediction.predictedTokens > maxTokens * 0.8) {
      // Soft constraint
      optimizedPrompt += `\n\nPlease be concise in your response.`
      budgetStrategy = 'soft_limit'
    }

    return {
      optimizedPrompt,
      budgetStrategy,
      predictedTokens: Math.min(prediction.predictedTokens, maxTokens),
      confidence: prediction.confidence,
    }
  }

  /**
   * Multi-turn conversation optimization
   */
  async optimizeMultiTurnResponse(
    prompt: string,
    model: string,
    context: ConversationContext,
    config: ResponseOptimizationConfig
  ): Promise<{
    optimizedPrompt: string
    conversationStrategy: string
    contextPreservation: number
    metrics: ResponseMetrics
  }> {
    const prediction = await this.predictor.predictResponseLength(
      prompt,
      model,
      context
    )

    // Analyze conversation state
    const contextPreservation = this.calculateContextPreservation(context)
    const conversationStrategy = this.selectConversationStrategy(
      context,
      config
    )

    // Build optimized prompt
    let optimizedPrompt = prompt

    // Add context awareness
    if (context.turnCount > 3) {
      optimizedPrompt += `\n\nConsidering our previous discussion about ${context.topics.join(', ')}, `
      optimizedPrompt += `please provide a focused response.`
    }

    // Add length control based on conversation
    if (context.turnCount > 5 && prediction.predictedTokens > 200) {
      optimizedPrompt += `\nKeep your response concise to maintain conversation flow.`
    }

    const metrics = await this.calculateResponseMetrics(
      prompt,
      optimizedPrompt,
      prediction,
      model
    )

    return {
      optimizedPrompt,
      conversationStrategy,
      contextPreservation,
      metrics,
    }
  }

  /**
   * Calculate context preservation
   */
  private calculateContextPreservation(context: ConversationContext): number {
    if (context.turnCount === 0) return 0

    const recentResponses = context.historicalResponses.slice(-3)
    const avgLength =
      recentResponses.reduce((sum, r) => sum + (r.tokens || 0), 0) /
      Math.max(recentResponses.length, 1)
    const consistency =
      context.averageResponseLength > 0
        ? 1 -
          Math.abs(avgLength - context.averageResponseLength) /
            context.averageResponseLength
        : 0

    return Math.max(0, consistency)
  }

  /**
   * Select conversation strategy
   */
  private selectConversationStrategy(
    context: ConversationContext,
    config: ResponseOptimizationConfig
  ): string {
    if (context.turnCount < 3) return 'exploratory'
    if (context.contextWindowUsage > 0.8) return 'compressed'
    if (context.topics.length > 2) return 'focused'
    return 'balanced'
  }

  /**
   * Cache response for reuse
   */
  async cacheResponse(
    prompt: string,
    response: string,
    model: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(prompt, model)
    const responseTokens = await TokenCounter.count(response)

    // Type assertion needed as semanticCache uses generic unknown type

    await semanticCache.set(cacheKey, {
      response,
      tokens: responseTokens,
      model,
      timestamp: Date.now(),
      metadata,
    } as any)
  }

  /**
   * Get cached response
   */
  async getCachedResponse(
    prompt: string,
    model: string,
    similarityThreshold = 0.8
  ): Promise<string | null> {
    const cacheKey = this.generateCacheKey(prompt, model)
    // Type assertion needed as semanticCache uses generic unknown type
    const cached = (await semanticCache.get(cacheKey)) as {
      response?: string
    } | null

    if (cached && cached.response) {
      return cached.response
    }

    // Try semantic matching
    if (similarityThreshold > 0) {
      const similarResponse = await this.findSimilarResponse(
        prompt,
        model,
        similarityThreshold
      )
      return similarResponse
    }

    return null
  }

  /**
   * Find similar response
   */
  private async findSimilarResponse(
    prompt: string,
    model: string,
    threshold: number
  ): Promise<string | null> {
    // Implementation would use semantic similarity search
    // For now, return null
    return null
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(prompt: string, model: string): string {
    const normalizedPrompt = prompt.toLowerCase().replace(/\s+/g, ' ').trim()
    const hash = this.simpleHash(normalizedPrompt)
    return `response_${model}_${hash}`
  }

  /**
   * Simple hash function
   */
  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }

  /**
   * Get prediction accuracy
   */
  getPredictionAccuracy(model: string, conversationId?: string): number {
    return this.predictor.getAccuracy(model, conversationId)
  }
}

// Export singleton instances
export const responseLengthPredictor = new ResponseLengthPredictor()
export const responseOptimizer = new ResponseOptimizer()

// Convenience functions
export async function optimizeResponse(
  prompt: string,
  model: string,
  config: ResponseOptimizationConfig,
  context?: ConversationContext
): Promise<{
  optimizedPrompt: string
  predictedResponse: ResponsePrediction
  strategy: string
  metrics: ResponseMetrics
}> {
  return responseOptimizer.optimizeResponse(prompt, model, config, context)
}

export async function predictResponseLength(
  prompt: string,
  model: string,
  context?: ConversationContext
): Promise<ResponsePrediction> {
  return responseLengthPredictor.predictResponseLength(prompt, model, context)
}

export async function controlResponseBudget(
  prompt: string,
  model: string,
  maxTokens: number,
  minQuality?: number
): Promise<{
  optimizedPrompt: string
  budgetStrategy: string
  predictedTokens: number
  confidence: number
}> {
  return responseOptimizer.controlResponseBudget(
    prompt,
    model,
    maxTokens,
    minQuality
  )
}

export function getResponsePredictionAccuracy(
  model: string,
  conversationId?: string
): number {
  return responseLengthPredictor.getAccuracy(model, conversationId)
}
