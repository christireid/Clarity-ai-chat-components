/**
 * Adaptive Token Usage Strategies Based on Context and Model
 *
 * This module implements intelligent token optimization that adapts based on:
 * - Model-specific token efficiency patterns
 * - Content complexity and domain
 * - Conversation context and history
 * - Real-time performance feedback
 * - Cost-performance trade-offs
 * - User preferences and constraints
 *
 * @module
 */

import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import {
  AdvancedCompressionOrchestrator,
  compressWithAdvanced,
} from './advanced-compression'

// Enhanced model characteristics with token efficiency data
export interface ModelEfficiencyProfile {
  family: string
  model: string
  inputEfficiency: number // Token efficiency for inputs (0-1)
  outputEfficiency: number // Token efficiency for outputs (0-1)
  contextEfficiency: number // Efficiency with long context (0-1)
  reasoningEfficiency: number // Efficiency for reasoning tasks (0-1)
  costPerInputToken: number // Cost per 1000 input tokens
  costPerOutputToken: number // Cost per 1000 output tokens
  maxContextWindow: number // Maximum context window
  optimalContextSize: number // Optimal context size for performance
  compressionEfficiency: number // How well the model handles compressed input
}

// Context types with specific optimization strategies
export interface ContextProfile {
  type: string
  domain: string
  complexity: 'low' | 'medium' | 'high'
  language: string
  hasCode: boolean
  hasStructuredData: boolean
  hasMultilingual: boolean
  hasTechnicalTerms: boolean
  estimatedTokenDensity: number // Estimated tokens per character
}

// Internal strategy configuration
interface AdaptiveStrategyConfig {
  name: string
  compressionRatio: number
  qualityThreshold: number
  compressionStrategy: string
  confidence: number
}

// Optimization metrics result
interface OptimizationMetrics {
  estimatedCost: number
  estimatedLatency: number
  costSavings: number
  performanceScore: number
  compressionEfficiency?: number
}

// Compression result from applyAdaptiveOptimization
interface AdaptiveCompressionResult {
  compressedText: string
  compressedTokens: number
  compressionRatio: number
  estimatedQuality: number
}

// Performance history entry for learning
interface PerformanceHistoryEntry {
  timestamp: number
  contextProfile: ContextProfile
  modelProfile: ModelEfficiencyProfile
  metrics: OptimizationMetrics
  strategy: AdaptiveStrategyConfig
  success: boolean
}

// Conversation state for adaptive optimization
export interface ConversationState {
  turnCount: number
  averageTokensPerTurn: number
  contextWindowUsage: number // Percentage of context window used
  repetitionPatterns: string[] // Detected repetition patterns
  topicDrift: number // How much the topic has drifted
  userFeedback: {
    quality: number // User quality ratings
    relevance: number // User relevance ratings
    satisfaction: number // Overall satisfaction
  }
  historicalCompression: {
    averageRatio: number
    qualityRetention: number
    userAcceptance: number
  }
}

export interface AdaptiveOptimizationConfig {
  strategy: 'conservative' | 'moderate' | 'aggressive' | 'adaptive'
  targetReduction?: number // Target token reduction ratio
  qualityThreshold?: number // Minimum quality threshold
  costBudget?: number // Maximum cost budget
  latencyBudget?: number // Maximum latency budget
  preserveContext?: boolean // Preserve conversation context
  adaptiveLearning?: boolean // Enable adaptive learning
  realTimeOptimization?: boolean // Real-time optimization
  multiObjective?: boolean // Optimize for multiple objectives
}

export interface AdaptiveOptimizationResult {
  optimizedText: string
  originalTokens: number
  optimizedTokens: number
  reductionRatio: number
  estimatedQuality: number
  estimatedCost: number
  estimatedLatency: number
  strategyUsed: string
  confidence: number
  recommendations: string[]
  alternativeStrategies: Array<{
    strategy: string
    tokens: number
    quality: number
    cost: number
  }>
}

// Model efficiency profiles based on research data
const MODEL_EFFICIENCY_PROFILES: Record<string, ModelEfficiencyProfile> = {
  'gpt-4': {
    family: 'openai',
    model: 'gpt-4',
    inputEfficiency: 0.85,
    outputEfficiency: 0.8,
    contextEfficiency: 0.75,
    reasoningEfficiency: 0.9,
    costPerInputToken: 0.03,
    costPerOutputToken: 0.06,
    maxContextWindow: 8192,
    optimalContextSize: 6000,
    compressionEfficiency: 0.85,
  },
  'gpt-4-turbo': {
    family: 'openai',
    model: 'gpt-4-turbo',
    inputEfficiency: 0.9,
    outputEfficiency: 0.85,
    contextEfficiency: 0.85,
    reasoningEfficiency: 0.92,
    costPerInputToken: 0.01,
    costPerOutputToken: 0.03,
    maxContextWindow: 128000,
    optimalContextSize: 100000,
    compressionEfficiency: 0.9,
  },
  'claude-3-opus': {
    family: 'anthropic',
    model: 'claude-3-opus',
    inputEfficiency: 0.88,
    outputEfficiency: 0.82,
    contextEfficiency: 0.88,
    reasoningEfficiency: 0.95,
    costPerInputToken: 0.015,
    costPerOutputToken: 0.075,
    maxContextWindow: 200000,
    optimalContextSize: 150000,
    compressionEfficiency: 0.88,
  },
  'claude-3-sonnet': {
    family: 'anthropic',
    model: 'claude-3-sonnet',
    inputEfficiency: 0.85,
    outputEfficiency: 0.8,
    contextEfficiency: 0.85,
    reasoningEfficiency: 0.88,
    costPerInputToken: 0.003,
    costPerOutputToken: 0.015,
    maxContextWindow: 200000,
    optimalContextSize: 150000,
    compressionEfficiency: 0.85,
  },
  'gemini-pro': {
    family: 'google',
    model: 'gemini-pro',
    inputEfficiency: 0.82,
    outputEfficiency: 0.78,
    contextEfficiency: 0.8,
    reasoningEfficiency: 0.85,
    costPerInputToken: 0.0005,
    costPerOutputToken: 0.0015,
    maxContextWindow: 1000000,
    optimalContextSize: 500000,
    compressionEfficiency: 0.8,
  },
}

/**
 * Adaptive Token Optimizer that learns from context and performance
 */
export class AdaptiveTokenOptimizer {
  private tokenCounter: AccurateTokenCounter
  private compressionOrchestrator: AdvancedCompressionOrchestrator
  private performanceHistory: Map<string, PerformanceHistoryEntry[]>
  private contextProfiles: Map<string, ContextProfile>
  private conversationStates: Map<string, ConversationState>
  private learningRate: number

  constructor(learningRate = 0.01) {
    this.tokenCounter = new AccurateTokenCounter()
    this.compressionOrchestrator = new AdvancedCompressionOrchestrator()
    this.performanceHistory = new Map()
    this.contextProfiles = new Map()
    this.conversationStates = new Map()
    this.learningRate = learningRate
  }

  /**
   * Optimize tokens adaptively based on context and model
   */
  async optimizeTokensAdaptively(
    text: string,
    model: string,
    config: AdaptiveOptimizationConfig,
    conversationId?: string
  ): Promise<AdaptiveOptimizationResult> {
    const startTime = performance.now()

    // Analyze context and content
    const counter = new AccurateTokenCounter({ model })
    const contextProfile = await this.analyzeContext(text, counter)
    const modelProfile =
      MODEL_EFFICIENCY_PROFILES[model] || this.createDefaultModelProfile(model)
    const conversationState = conversationId
      ? this.conversationStates.get(conversationId)
      : undefined

    // Generate adaptive optimization strategy
    const strategy = this.generateAdaptiveStrategy(
      contextProfile,
      modelProfile,
      config,
      conversationState
    )

    // Apply optimization
    const optimizedResult = await this.applyAdaptiveOptimization(
      text,
      strategy,
      modelProfile,
      config
    )

    const processingTime = performance.now() - startTime

    // Calculate metrics
    const metrics = await this.calculateOptimizationMetrics(
      text,
      optimizedResult.compressedText,
      modelProfile,
      processingTime
    )

    // Update learning if enabled
    if (config.adaptiveLearning) {
      this.updateLearning(contextProfile, modelProfile, metrics, strategy)
    }

    // Generate recommendations
    const recommendations = await this.generateRecommendations(
      contextProfile,
      modelProfile,
      metrics,
      strategy
    )

    return {
      optimizedText: optimizedResult.compressedText,
      originalTokens: counter.count(text),
      optimizedTokens: optimizedResult.compressedTokens,
      reductionRatio: optimizedResult.compressionRatio,
      estimatedQuality: optimizedResult.estimatedQuality,
      estimatedCost: metrics.estimatedCost,
      estimatedLatency: metrics.estimatedLatency,
      strategyUsed: strategy.name,
      confidence: strategy.confidence,
      recommendations,
      alternativeStrategies: await this.generateAlternativeStrategies(
        text,
        contextProfile,
        modelProfile,
        config
      ),
    }
  }

  /**
   * Analyze content and create context profile
   */
  private async analyzeContext(
    text: string,
    counter: AccurateTokenCounter
  ): Promise<ContextProfile> {
    const words = text.split(/\s+/).length
    const characters = text.length
    const tokenDensity = counter.count(text) / Math.max(characters, 1)

    const domain = this.detectDomain(text)
    const complexity = this.assessComplexity(text)
    const language = this.detectLanguage(text)
    const hasCode = this.containsCode(text)
    const hasStructuredData = this.containsStructuredData(text)
    const hasMultilingual = this.containsMultipleLanguages(text)
    const hasTechnicalTerms = this.containsTechnicalTerms(text)

    return {
      type: this.categorizeContextType(text),
      domain,
      complexity,
      language,
      hasCode,
      hasStructuredData,
      hasMultilingual,
      hasTechnicalTerms,
      estimatedTokenDensity: tokenDensity,
    }
  }

  /**
   * Generate adaptive optimization strategy
   */
  private generateAdaptiveStrategy(
    contextProfile: ContextProfile,
    modelProfile: ModelEfficiencyProfile,
    config: AdaptiveOptimizationConfig,
    conversationState?: ConversationState
  ): {
    name: string
    compressionRatio: number
    qualityThreshold: number
    compressionStrategy: string
    confidence: number
  } {
    let strategyName = 'adaptive'
    let compressionRatio = config.targetReduction || 0.3
    let qualityThreshold = config.qualityThreshold || 0.8
    let compressionStrategy = 'llmlingua'
    let confidence = 0.7

    // Adjust based on model efficiency
    if (modelProfile.compressionEfficiency > 0.85) {
      compressionRatio = Math.min(compressionRatio * 1.2, 0.6)
      confidence += 0.1
    } else if (modelProfile.compressionEfficiency < 0.7) {
      compressionRatio = Math.max(compressionRatio * 0.7, 0.1)
      confidence -= 0.1
    }

    // Adjust based on context complexity
    switch (contextProfile.complexity) {
      case 'low':
        compressionRatio = Math.min(compressionRatio * 1.3, 0.7)
        qualityThreshold = Math.max(qualityThreshold - 0.1, 0.7)
        compressionStrategy = 'llmlingua'
        confidence += 0.15
        break
      case 'medium':
        // Keep default compressionRatio for medium complexity
        compressionStrategy = 'selective_context'
        confidence += 0.1
        break
      case 'high':
        compressionRatio = Math.max(compressionRatio * 0.7, 0.15)
        qualityThreshold = Math.min(qualityThreshold + 0.1, 0.95)
        compressionStrategy = 'semantic_pruning'
        confidence -= 0.1
        break
    }

    // Adjust based on content type
    if (contextProfile.hasCode) {
      compressionRatio = Math.max(compressionRatio * 0.6, 0.1)
      compressionStrategy = 'structural'
      confidence -= 0.15
    } else if (contextProfile.hasTechnicalTerms) {
      qualityThreshold = Math.min(qualityThreshold + 0.05, 0.9)
      confidence -= 0.05
    }

    // Adjust based on conversation state
    if (conversationState) {
      if (conversationState.contextWindowUsage > 0.8) {
        compressionRatio = Math.min(compressionRatio * 1.2, 0.6)
        qualityThreshold = Math.max(qualityThreshold - 0.05, 0.75)
        confidence += 0.1
      }

      if (conversationState.historicalCompression.qualityRetention > 0.9) {
        compressionRatio = Math.min(compressionRatio * 1.1, 0.5)
        confidence += 0.1
      }
    }

    // Adjust based on strategy
    switch (config.strategy) {
      case 'conservative':
        compressionRatio = Math.max(compressionRatio * 0.6, 0.1)
        qualityThreshold = Math.min(qualityThreshold + 0.1, 0.95)
        confidence += 0.1
        break
      case 'aggressive':
        compressionRatio = Math.min(compressionRatio * 1.4, 0.8)
        qualityThreshold = Math.max(qualityThreshold - 0.15, 0.65)
        confidence -= 0.1
        break
      case 'moderate':
        // Keep current settings
        break
    }

    return {
      name: strategyName,
      compressionRatio,
      qualityThreshold,
      compressionStrategy,
      confidence,
    }
  }

  /**
   * Apply adaptive optimization
   */
  private async applyAdaptiveOptimization(
    text: string,
    strategy: AdaptiveStrategyConfig,
    modelProfile: ModelEfficiencyProfile,
    config: AdaptiveOptimizationConfig
  ): Promise<AdaptiveCompressionResult> {
    const compressionConfig = {
      strategy: strategy.compressionStrategy,
      compressionRatio: strategy.compressionRatio,
      qualityThreshold: strategy.qualityThreshold,
      preserveCode: true,
      adaptive: true,
    }

    const compressedText = await compressWithAdvanced(
      text,
      strategy.compressionStrategy as
        | 'llmlingua'
        | 'selective_context'
        | 'semantic_pruning'
        | 'structural'
        | 'adaptive'
        | undefined,
      compressionConfig.compressionRatio,
      compressionConfig.qualityThreshold
    )

    return {
      compressedText,
      compressedTokens: 0, // Will be calculated later
      compressionRatio: strategy.compressionRatio,
      estimatedQuality: strategy.qualityThreshold,
    }
  }

  /**
   * Calculate optimization metrics
   */
  private async calculateOptimizationMetrics(
    originalText: string,
    optimizedText: string,
    modelProfile: ModelEfficiencyProfile,
    processingTime: number
  ): Promise<{
    estimatedCost: number
    estimatedLatency: number
    costSavings: number
    performanceScore: number
  }> {
    const counter = new AccurateTokenCounter({ model: 'gpt-4' })
    const originalTokens = counter.count(originalText)
    const optimizedTokens = counter.count(optimizedText)

    const inputCost = (originalTokens / 1000) * modelProfile.costPerInputToken
    const optimizedInputCost =
      (optimizedTokens / 1000) * modelProfile.costPerInputToken
    const costSavings = inputCost - optimizedInputCost

    // Estimate latency based on token count and model characteristics
    const baseLatency = modelProfile.contextEfficiency * 100 // ms per 1K tokens
    const estimatedLatency = (optimizedTokens / 1000) * baseLatency

    // Calculate performance score
    const compressionEfficiency = 1 - optimizedTokens / originalTokens
    const qualityScore = modelProfile.compressionEfficiency
    const performanceScore = compressionEfficiency * 0.6 + qualityScore * 0.4

    return {
      estimatedCost: optimizedInputCost,
      estimatedLatency,
      costSavings,
      performanceScore,
    }
  }

  /**
   * Update learning based on results
   */
  private updateLearning(
    contextProfile: ContextProfile,
    modelProfile: ModelEfficiencyProfile,
    metrics: OptimizationMetrics,
    strategy: AdaptiveStrategyConfig
  ): void {
    const learningKey = `${contextProfile.domain}-${modelProfile.family}`
    const history = this.performanceHistory.get(learningKey) || []

    history.push({
      timestamp: Date.now(),
      contextProfile,
      modelProfile,
      metrics,
      strategy,
      success: metrics.performanceScore > 0.7,
    })

    // Keep only recent history
    if (history.length > 50) {
      history.shift()
    }

    this.performanceHistory.set(learningKey, history)

    // Update learning rate based on success rate
    const successRate = history.filter((h) => h.success).length / history.length
    this.learningRate = Math.max(
      0.001,
      Math.min(0.1, this.learningRate * (successRate > 0.7 ? 1.01 : 0.99))
    )
  }

  /**
   * Generate recommendations
   */
  private async generateRecommendations(
    contextProfile: ContextProfile,
    modelProfile: ModelEfficiencyProfile,
    metrics: OptimizationMetrics,
    strategy: AdaptiveStrategyConfig
  ): Promise<string[]> {
    const recommendations: string[] = []

    if (metrics.estimatedCost > 0.1) {
      recommendations.push(
        'Consider using a more cost-effective model for this type of content'
      )
    }

    if (contextProfile.hasCode && strategy.compressionRatio > 0.4) {
      recommendations.push(
        'Code content detected - consider using structural compression'
      )
    }

    if (contextProfile.complexity === 'high' && strategy.confidence < 0.7) {
      recommendations.push(
        'High complexity content - consider manual review of compressed output'
      )
    }

    if (modelProfile.compressionEfficiency < 0.8) {
      recommendations.push(
        'This model has lower compression efficiency - consider switching models'
      )
    }

    return recommendations
  }

  /**
   * Generate alternative strategies
   */
  private async generateAlternativeStrategies(
    text: string,
    contextProfile: ContextProfile,
    modelProfile: ModelEfficiencyProfile,
    config: AdaptiveOptimizationConfig
  ): Promise<
    Array<{
      strategy: string
      tokens: number
      quality: number
      cost: number
    }>
  > {
    const strategies = [
      { name: 'conservative', compressionRatio: 0.2, qualityThreshold: 0.9 },
      { name: 'moderate', compressionRatio: 0.4, qualityThreshold: 0.8 },
      { name: 'aggressive', compressionRatio: 0.6, qualityThreshold: 0.7 },
    ]

    const counter = new AccurateTokenCounter({ model: 'gpt-4' })
    const alternatives = await Promise.all(
      strategies.map(async (strategy) => {
        const compressedText = await compressWithAdvanced(
          text,
          'adaptive',
          strategy.compressionRatio,
          strategy.qualityThreshold
        )

        const tokens = counter.count(compressedText)
        const cost = (tokens / 1000) * modelProfile.costPerInputToken

        return {
          strategy: strategy.name,
          tokens,
          quality: strategy.qualityThreshold,
          cost,
        }
      })
    )

    return alternatives
  }

  // Helper methods
  private createDefaultModelProfile(model: string): ModelEfficiencyProfile {
    return {
      family: 'unknown',
      model,
      inputEfficiency: 0.8,
      outputEfficiency: 0.75,
      contextEfficiency: 0.7,
      reasoningEfficiency: 0.8,
      costPerInputToken: 0.01,
      costPerOutputToken: 0.03,
      maxContextWindow: 8000,
      optimalContextSize: 6000,
      compressionEfficiency: 0.8,
    }
  }

  private detectDomain(text: string): string {
    if (/\b(function|class|import|export|const|let|var)\b/.test(text))
      return 'programming'
    if (/\b(medical|health|patient|diagnosis|treatment)\b/.test(text))
      return 'medical'
    if (/\b(legal|law|court|contract|regulation)\b/.test(text)) return 'legal'
    if (/\b(financial|investment|market|trading|economy)\b/.test(text))
      return 'financial'
    return 'general'
  }

  private assessComplexity(text: string): 'low' | 'medium' | 'high' {
    const sentences = text.split(/[.!?]+/).length
    const avgWordsPerSentence =
      text.split(/\s+/).length / Math.max(sentences, 1)
    const technicalTerms = (
      text.match(/\b(algorithm|methodology|framework|architecture)\b/g) || []
    ).length

    if (avgWordsPerSentence > 20 || technicalTerms > 3) return 'high'
    if (avgWordsPerSentence > 12 || technicalTerms > 1) return 'medium'
    return 'low'
  }

  private detectLanguage(text: string): string {
    if (/[\u4e00-\u9fff]/.test(text)) return 'chinese'
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'japanese'
    if (/[\uac00-\ud7af]/.test(text)) return 'korean'
    if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(text)) return 'european'
    return 'english'
  }

  private containsCode(text: string): boolean {
    return (
      /\b(function|class|import|export|const|let|var|def|class)\b/.test(text) ||
      /[<>{}()[\];]/.test(text)
    )
  }

  private containsStructuredData(text: string): boolean {
    return /\{.*\}/.test(text) || /\[.*\]/.test(text) || /<.*>/.test(text)
  }

  private containsMultipleLanguages(text: string): boolean {
    const languages = [
      /[a-z]/i,
      /[\u4e00-\u9fff]/,
      /[\u3040-\u309f\u30a0-\u30ff]/,
      /[\uac00-\ud7af]/,
    ]

    const detected = languages.filter((lang) => lang.test(text)).length
    return detected > 1
  }

  private containsTechnicalTerms(text: string): boolean {
    return /\b(algorithm|methodology|framework|architecture|protocol|standard)\b/.test(
      text
    )
  }

  private categorizeContextType(text: string): string {
    if (this.containsCode(text)) return 'code'
    if (this.containsStructuredData(text)) return 'structured'
    if (this.containsTechnicalTerms(text)) return 'technical'
    if (this.containsMultipleLanguages(text)) return 'multilingual'
    return 'conversation'
  }

  // Public methods for conversation management
  updateConversationState(
    conversationId: string,
    update: Partial<ConversationState>
  ): void {
    const currentState = this.conversationStates.get(conversationId) || {
      turnCount: 0,
      averageTokensPerTurn: 0,
      contextWindowUsage: 0,
      repetitionPatterns: [],
      topicDrift: 0,
      userFeedback: { quality: 0, relevance: 0, satisfaction: 0 },
      historicalCompression: {
        averageRatio: 0,
        qualityRetention: 0,
        userAcceptance: 0,
      },
    }

    const updatedState = { ...currentState, ...update }
    this.conversationStates.set(conversationId, updatedState)
  }

  getPerformanceAnalytics(
    model?: string,
    domain?: string
  ): {
    totalOptimizations: number
    averageReduction: number
    averageQuality: number
    learningRate: number
    recentPerformance?: PerformanceHistoryEntry[]
  } {
    const key = model || domain || 'global'
    const history = this.performanceHistory.get(key)

    if (!history || history.length === 0) {
      return {
        totalOptimizations: 0,
        averageReduction: 0,
        averageQuality: 0,
        learningRate: this.learningRate,
      }
    }

    const totalOptimizations = history.length
    const averageReduction =
      history.reduce(
        (sum, h) => sum + (1 - (h.metrics.compressionEfficiency ?? 0)),
        0
      ) / totalOptimizations

    const averageQuality =
      history.reduce((sum, h) => sum + h.strategy.qualityThreshold, 0) /
      totalOptimizations

    return {
      totalOptimizations,
      averageReduction,
      averageQuality,
      learningRate: this.learningRate,
      recentPerformance: history.slice(-5),
    }
  }
}

// Export singleton instance
export const adaptiveOptimizer = new AdaptiveTokenOptimizer()

// Convenience functions
export async function optimizeTokensAdaptively(
  text: string,
  model: string,
  config?: Partial<AdaptiveOptimizationConfig>,
  conversationId?: string
): Promise<AdaptiveOptimizationResult> {
  const fullConfig: AdaptiveOptimizationConfig = {
    strategy: 'adaptive',
    targetReduction: 0.3,
    qualityThreshold: 0.8,
    adaptiveLearning: true,
    realTimeOptimization: true,
    multiObjective: true,
    ...config,
  }

  return adaptiveOptimizer.optimizeTokensAdaptively(
    text,
    model,
    fullConfig,
    conversationId
  )
}

export function updateConversationState(
  conversationId: string,
  update: Partial<ConversationState>
): void {
  adaptiveOptimizer.updateConversationState(conversationId, update)
}

export function getAdaptiveAnalytics(
  model?: string,
  domain?: string
): {
  totalOptimizations: number
  averageReduction: number
  averageQuality: number
  learningRate: number
  recentPerformance?: PerformanceHistoryEntry[]
} {
  return adaptiveOptimizer.getPerformanceAnalytics(model, domain)
}
