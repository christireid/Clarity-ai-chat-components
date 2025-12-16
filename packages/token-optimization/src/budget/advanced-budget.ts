/**
 * Advanced Token Budget Manager
 * 
 * Enterprise-grade token allocation system with dynamic redistribution,
 * context-aware optimization, and multi-layer budgeting
 */

import { AdvancedTokenCounter, type ModelFamily } from '../tokenizers/advanced-counter'
import { AdvancedCompressionEngine } from '../compression/advanced-engine'

/**
 * Token allocation strategy
 */
export type AllocationStrategy = 'static' | 'dynamic' | 'adaptive' | 'ml_optimized'

/**
 * Memory layer priorities
 */
export type MemoryLayer = 'system' | 'context' | 'memory' | 'response' | 'buffer'

/**
 * Token budget configuration
 */
export interface TokenBudgetConfig {
  totalBudget: number
  strategy: AllocationStrategy
  model: ModelFamily
  enableCompression: boolean
  compressionThreshold: number
  preserveQuality: boolean
  dynamicReallocation: boolean
  contextAware: boolean
}

/**
 * Token allocation breakdown
 */
export interface TokenAllocation {
  system: number
  context: number
  memory: number
  response: number
  buffer: number
  total: number
}

/**
 * Context factors for dynamic allocation
 */
export interface ContextFactors {
  conversationLength: number
  memoryRichness: number
  taskComplexity: 'low' | 'medium' | 'high'
  urgency: 'low' | 'medium' | 'high'
  userPreference: Record<string, number>
  historicalUsage: {
    averageSystem: number
    averageContext: number
    averageMemory: number
    averageResponse: number
  }
}

/**
 * Allocation optimization result
 */
export interface AllocationResult {
  allocation: TokenAllocation
  compressionUsed: boolean
  compressionRatio: number
  estimatedQuality: number
  recommendations: string[]
  metadata: {
    strategy: AllocationStrategy
    processingTime: number
    contextFactors?: ContextFactors
  }
}

/**
 * Token usage tracking
 */
export interface TokenUsage {
  timestamp: number
  layer: MemoryLayer
  tokens: number
  quality: number
  compressionUsed: boolean
}

/**
 * Historical usage patterns for ML optimization
 */
export interface UsagePattern {
  id: string
  pattern: Record<MemoryLayer, number>
  frequency: number
  averageQuality: number
  successRate: number
  lastUsed: number
}

/**
 * Advanced token budget manager with ML-enhanced allocation
 */
export class AdvancedTokenBudgetManager {
  private config: Required<TokenBudgetConfig>
  private counter: AdvancedTokenCounter
  private compressor: AdvancedCompressionEngine
  private usageHistory: TokenUsage[]
  private usagePatterns: Map<string, UsagePattern>
  private currentAllocation: TokenAllocation

  constructor(config: TokenBudgetConfig) {
    this.config = {
      totalBudget: config.totalBudget,
      strategy: config.strategy || 'adaptive',
      model: config.model || 'generic',
      enableCompression: config.enableCompression ?? true,
      compressionThreshold: config.compressionThreshold ?? 0.8,
      preserveQuality: config.preserveQuality ?? true,
      dynamicReallocation: config.dynamicReallocation ?? true,
      contextAware: config.contextAware ?? true,
    }

    this.counter = new AdvancedTokenCounter()
    this.compressor = new AdvancedCompressionEngine()
    this.usageHistory = []
    this.usagePatterns = new Map()
    this.currentAllocation = this.calculateInitialAllocation()

    this.loadUsagePatterns()
  }

  /**
   * Calculate optimal token allocation based on context
   */
  async optimizeAllocation(
    context: Partial<ContextFactors> = {},
    forceRecalculate: boolean = false
  ): Promise<AllocationResult> {
    const startTime = performance.now()

    // Merge with default context
    const fullContext: ContextFactors = {
      conversationLength: 0,
      memoryRichness: 0.5,
      taskComplexity: 'medium',
      urgency: 'medium',
      userPreference: {},
      historicalUsage: {
        averageSystem: this.currentAllocation.system,
        averageContext: this.currentAllocation.context,
        averageMemory: this.currentAllocation.memory,
        averageResponse: this.currentAllocation.response,
      },
      ...context,
    }

    let allocation: TokenAllocation
    let compressionUsed = false
    let compressionRatio = 1.0
    let estimatedQuality = 1.0
    let strategy = this.config.strategy

    // Select allocation strategy based on configuration
    switch (this.config.strategy) {
      case 'static':
        allocation = this.calculateStaticAllocation()
        break

      case 'dynamic':
        allocation = this.calculateDynamicAllocation(fullContext)
        break

      case 'adaptive':
        const adaptiveResult = await this.calculateAdaptiveAllocation(fullContext)
        allocation = adaptiveResult.allocation
        compressionUsed = adaptiveResult.compressionUsed
        compressionRatio = adaptiveResult.compressionRatio
        estimatedQuality = adaptiveResult.quality
        break

      case 'ml_optimized':
        const mlResult = await this.calculateMLOptimizedAllocation(fullContext)
        allocation = mlResult.allocation
        compressionUsed = mlResult.compressionUsed
        compressionRatio = mlResult.compressionRatio
        estimatedQuality = mlResult.quality
        strategy = 'ml_optimized'
        break

      default:
        allocation = this.calculateAdaptiveAllocation(fullContext).then(r => r.allocation)
        allocation = await allocation
    }

    const processingTime = performance.now() - startTime

    // Generate recommendations
    const recommendations = this.generateRecommendations(allocation, fullContext, compressionUsed)

    const result: AllocationResult = {
      allocation,
      compressionUsed,
      compressionRatio,
      estimatedQuality,
      recommendations,
      metadata: {
        strategy,
        processingTime,
        contextFactors: fullContext,
      },
    }

    // Update current allocation
    this.currentAllocation = allocation

    // Track usage
    this.trackUsage(result, fullContext)

    return result
  }

  /**
   * Calculate static allocation based on best practices
   */
  private calculateStaticAllocation(): TokenAllocation {
    const total = this.config.totalBudget

    // Best practice ratios
    return {
      system: Math.floor(total * 0.15),     // 15% for system prompts
      context: Math.floor(total * 0.25),    // 25% for conversation context
      memory: Math.floor(total * 0.35),      // 35% for memory storage
      response: Math.floor(total * 0.20),    // 20% for response generation
      buffer: Math.floor(total * 0.05),      // 5% buffer for safety
      total,
    }
  }

  /**
   * Calculate dynamic allocation based on context factors
   */
  private calculateDynamicAllocation(context: ContextFactors): TokenAllocation {
    const baseAllocation = this.calculateStaticAllocation()
    
    if (!this.config.dynamicReallocation) {
      return baseAllocation
    }

    const adjustments = this.calculateContextualAdjustments(context)
    
    // Apply adjustments
    const adjusted: TokenAllocation = {
      system: Math.max(50, baseAllocation.system + adjustments.system),
      context: Math.max(100, baseAllocation.context + adjustments.context),
      memory: Math.max(200, baseAllocation.memory + adjustments.memory),
      response: Math.max(100, baseAllocation.response + adjustments.response),
      buffer: baseAllocation.buffer + adjustments.buffer,
      total: baseAllocation.total,
    }

    // Ensure total doesn't exceed budget
    return this.normalizeAllocation(adjusted)
  }

  /**
   * Calculate adaptive allocation with optional compression
   */
  private async calculateAdaptiveAllocation(context: ContextFactors): Promise<{
    allocation: TokenAllocation
    compressionUsed: boolean
    compressionRatio: number
    quality: number
  }> {
    const dynamicAllocation = this.calculateDynamicAllocation(context)
    
    if (!this.config.enableCompression) {
      return {
        allocation: dynamicAllocation,
        compressionUsed: false,
        compressionRatio: 1.0,
        quality: 1.0,
      }
    }

    // Check if compression is beneficial
    const shouldCompress = this.shouldUseCompression(context, dynamicAllocation)
    
    if (!shouldCompress) {
      return {
        allocation: dynamicAllocation,
        compressionUsed: false,
        compressionRatio: 1.0,
        quality: 1.0,
      }
    }

    // Calculate optimal allocation with compression
    const compressedAllocation = await this.optimizeWithCompression(dynamicAllocation, context)
    
    return compressedAllocation
  }

  /**
   * Calculate ML-optimized allocation based on historical patterns
   */
  private async calculateMLOptimizedAllocation(context: ContextFactors): Promise<{
    allocation: TokenAllocation
    compressionUsed: boolean
    compressionRatio: number
    quality: number
  }> {
    // Find similar usage patterns
    const similarPatterns = this.findSimilarPatterns(context)
    
    if (similarPatterns.length === 0) {
      // No patterns found, fall back to adaptive
      return this.calculateAdaptiveAllocation(context)
    }

    // Use best pattern
    const bestPattern = similarPatterns[0]
    const patternAllocation = this.patternToAllocation(bestPattern.pattern)
    
    // Refine with current context
    const refinedAllocation = this.refineAllocationWithContext(patternAllocation, context)
    
    return {
      allocation: refinedAllocation,
      compressionUsed: bestPattern.pattern.memory < this.currentAllocation.memory * 0.8,
      compressionRatio: bestPattern.pattern.memory / this.currentAllocation.memory,
      quality: bestPattern.averageQuality,
    }
  }

  /**
   * Calculate contextual adjustments for dynamic allocation
   */
  private calculateContextualAdjustments(context: ContextFactors) {
    const adjustments = {
      system: 0,
      context: 0,
      memory: 0,
      response: 0,
      buffer: 0,
    }

    // Task complexity adjustments
    switch (context.taskComplexity) {
      case 'low':
        adjustments.system -= 50
        adjustments.response += 50
        break
      case 'high':
        adjustments.system += 100
        adjustments.memory += 100
        adjustments.response -= 50
        break
    }

    // Urgency adjustments
    switch (context.urgency) {
      case 'high':
        adjustments.context += 100
        adjustments.response += 50
        adjustments.buffer -= 50
        break
      case 'low':
        adjustments.memory += 100
        adjustments.buffer += 50
        break
    }

    // Conversation length adjustments
    if (context.conversationLength > 20) {
      adjustments.context += 100
      adjustments.memory -= 50
    }

    // Memory richness adjustments
    if (context.memoryRichness > 0.7) {
      adjustments.memory += 150
      adjustments.context -= 100
    } else if (context.memoryRichness < 0.3) {
      adjustments.memory -= 100
      adjustments.context += 150
    }

    return adjustments
  }

  /**
   * Determine if compression should be used
   */
  private shouldUseCompression(context: ContextFactors, allocation: TokenAllocation): boolean {
    if (!this.config.enableCompression) return false

    // High memory usage relative to allocation
    const memoryUsageRatio = context.historicalUsage.averageMemory / allocation.memory
    
    // High complexity content
    const highComplexity = context.taskComplexity === 'high'
    
    // Rich memory content
    const richMemory = context.memoryRichness > 0.7

    return memoryUsageRatio > this.config.compressionThreshold || highComplexity || richMemory
  }

  /**
   * Optimize allocation with compression
   */
  private async optimizeWithCompression(
    baseAllocation: TokenAllocation,
    context: ContextFactors
  ): Promise<{
    allocation: TokenAllocation
    compressionUsed: boolean
    compressionRatio: number
    quality: number
  }> {
    // Try to compress memory content
    const compressionTarget = Math.floor(baseAllocation.memory * 0.7) // Target 70% compression
    
    // This is a simplified compression estimation
    // In reality, you would compress actual memory content here
    const estimatedCompressionRatio = 0.75 // Assume 75% compression
    const compressedMemory = Math.floor(baseAllocation.memory * estimatedCompressionRatio)
    
    // Reallocate saved tokens
    const savedTokens = baseAllocation.memory - compressedMemory
    
    const optimizedAllocation: TokenAllocation = {
      ...baseAllocation,
      memory: compressedMemory,
      context: baseAllocation.context + Math.floor(savedTokens * 0.4),
      response: baseAllocation.response + Math.floor(savedTokens * 0.3),
      buffer: baseAllocation.buffer + Math.floor(savedTokens * 0.3),
      total: baseAllocation.total,
    }

    return {
      allocation: optimizedAllocation,
      compressionUsed: true,
      compressionRatio: estimatedCompressionRatio,
      quality: this.config.preserveQuality ? 0.8 : 0.6,
    }
  }

  /**
   * Find similar usage patterns
   */
  private findSimilarPatterns(context: ContextFactors): UsagePattern[] {
    const patterns: UsagePattern[] = []
    
    for (const pattern of this.usagePatterns.values()) {
      const similarity = this.calculatePatternSimilarity(pattern, context)
      if (similarity > 0.7) { // 70% similarity threshold
        patterns.push(pattern)
      }
    }

    return patterns.sort((a, b) => b.successRate - a.successRate)
  }

  /**
   * Calculate similarity between pattern and current context
   */
  private calculatePatternSimilarity(pattern: UsagePattern, context: ContextFactors): number {
    const patternContext = pattern.pattern
    
    // Simple similarity based on memory allocation ratios
    const currentMemoryRatio = context.historicalUsage.averageMemory / this.config.totalBudget
    const patternMemoryRatio = patternContext.memory / this.config.totalBudget
    
    const similarity = 1 - Math.abs(currentMemoryRatio - patternMemoryRatio)
    
    return Math.max(0, similarity)
  }

  /**
   * Convert pattern to allocation
   */
  private patternToAllocation(pattern: Record<MemoryLayer, number>): TokenAllocation {
    return {
      system: pattern.system || Math.floor(this.config.totalBudget * 0.15),
      context: pattern.context || Math.floor(this.config.totalBudget * 0.25),
      memory: pattern.memory || Math.floor(this.config.totalBudget * 0.35),
      response: pattern.response || Math.floor(this.config.totalBudget * 0.20),
      buffer: pattern.buffer || Math.floor(this.config.totalBudget * 0.05),
      total: this.config.totalBudget,
    }
  }

  /**
   * Refine allocation with current context
   */
  private refineAllocationWithContext(
    baseAllocation: TokenAllocation,
    context: ContextFactors
  ): TokenAllocation {
    const adjustments = this.calculateContextualAdjustments(context)
    
    const refined: TokenAllocation = {
      system: Math.max(50, baseAllocation.system + adjustments.system),
      context: Math.max(100, baseAllocation.context + adjustments.context),
      memory: Math.max(200, baseAllocation.memory + adjustments.memory),
      response: Math.max(100, baseAllocation.response + adjustments.response),
      buffer: baseAllocation.buffer + adjustments.buffer,
      total: baseAllocation.total,
    }

    return this.normalizeAllocation(refined)
  }

  /**
   * Normalize allocation to fit within total budget
   */
  private normalizeAllocation(allocation: TokenAllocation): TokenAllocation {
    const totalUsed = allocation.system + allocation.context + allocation.memory + allocation.response + allocation.buffer
    
    if (totalUsed <= allocation.total) {
      return allocation
    }

    const excess = totalUsed - allocation.total
    const reductionOrder: (keyof TokenAllocation)[] = ['buffer', 'response', 'context', 'memory', 'system']
    
    const normalized = { ...allocation }
    let remainingExcess = excess

    for (const field of reductionOrder) {
      if (remainingExcess <= 0) break
      
      const current = normalized[field] as number
      const minimum = field === 'system' ? 50 : field === 'memory' ? 200 : 100
      
      if (current - minimum >= remainingExcess) {
        normalized[field] = current - remainingExcess
        remainingExcess = 0
      } else {
        remainingExcess -= (current - minimum)
        normalized[field] = minimum
      }
    }

    return normalized
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(
    allocation: TokenAllocation,
    context: ContextFactors,
    compressionUsed: boolean
  ): string[] {
    const recommendations: string[] = []

    if (compressionUsed) {
      recommendations.push('Compression is active - monitor quality metrics')
    }

    if (context.taskComplexity === 'high' && allocation.system < 200) {
      recommendations.push('Consider increasing system prompt allocation for complex tasks')
    }

    if (context.memoryRichness > 0.8 && allocation.memory < 500) {
      recommendations.push('High memory richness detected - consider memory optimization')
    }

    if (context.urgency === 'high' && allocation.buffer < 100) {
      recommendations.push('Low buffer for high-urgency task - monitor token usage')
    }

    return recommendations
  }

  /**
   * Track usage for pattern learning
   */
  private trackUsage(result: AllocationResult, context: ContextFactors): void {
    const usage: TokenUsage = {
      timestamp: Date.now(),
      layer: 'memory', // Simplified tracking
      tokens: result.allocation.memory,
      quality: result.estimatedQuality,
      compressionUsed: result.compressionUsed,
    }

    this.usageHistory.push(usage)

    // Keep only recent history (last 1000 entries)
    if (this.usageHistory.length > 1000) {
      this.usageHistory = this.usageHistory.slice(-1000)
    }

    // Update patterns
    this.updateUsagePatterns(result, context)
  }

  /**
   * Update usage patterns based on results
   */
  private updateUsagePatterns(result: AllocationResult, context: ContextFactors): void {
    const patternKey = this.generatePatternKey(context)
    const existingPattern = this.usagePatterns.get(patternKey)

    if (existingPattern) {
      // Update existing pattern
      existingPattern.frequency++
      existingPattern.lastUsed = Date.now()
      existingPattern.averageQuality = 
        (existingPattern.averageQuality * (existingPattern.frequency - 1) + result.estimatedQuality) / 
        existingPattern.frequency
      existingPattern.successRate = 
        (existingPattern.successRate * (existingPattern.frequency - 1) + 
         (result.estimatedQuality > 0.7 ? 1 : 0)) / existingPattern.frequency
    } else {
      // Create new pattern
      const newPattern: UsagePattern = {
        id: patternKey,
        pattern: {
          system: result.allocation.system,
          context: result.allocation.context,
          memory: result.allocation.memory,
          response: result.allocation.response,
          buffer: result.allocation.buffer,
        },
        frequency: 1,
        averageQuality: result.estimatedQuality,
        successRate: result.estimatedQuality > 0.7 ? 1 : 0,
        lastUsed: Date.now(),
      }

      this.usagePatterns.set(patternKey, newPattern)
    }
  }

  /**
   * Generate pattern key from context
   */
  private generatePatternKey(context: ContextFactors): string {
    const complexity = context.taskComplexity
    const urgency = context.urgency
    const richness = Math.round(context.memoryRichness * 10) // 0-10 scale
    const length = Math.min(context.conversationLength, 50) // Cap at 50
    
    return `${complexity}_${urgency}_${richness}_${Math.floor(length / 5) * 5}`
  }

  /**
   * Load usage patterns from storage
   */
  private loadUsagePatterns(): void {
    // In a real implementation, this would load from persistent storage
    // For now, initialize with some default patterns
    const defaultPatterns: UsagePattern[] = [
      {
        id: 'medium_medium_5_5',
        pattern: { system: 300, context: 500, memory: 700, response: 400, buffer: 100 },
        frequency: 10,
        averageQuality: 0.8,
        successRate: 0.85,
        lastUsed: Date.now(),
      },
      {
        id: 'high_high_8_10',
        pattern: { system: 400, context: 600, memory: 800, response: 500, buffer: 200 },
        frequency: 5,
        averageQuality: 0.85,
        successRate: 0.9,
        lastUsed: Date.now() - 86400000, // Yesterday
      },
    ]

    defaultPatterns.forEach(pattern => {
      this.usagePatterns.set(pattern.id, pattern)
    })
  }

  /**
   * Get current allocation
   */
  getCurrentAllocation(): TokenAllocation {
    return { ...this.currentAllocation }
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    const totalUsage = this.usageHistory.length
    const compressedUsages = this.usageHistory.filter(u => u.compressionUsed).length
    const averageQuality = this.usageHistory.reduce((sum, u) => sum + u.quality, 0) / totalUsage || 0

    return {
      totalUsages: totalUsage,
      compressedUsages,
      compressionRate: totalUsage > 0 ? compressedUsages / totalUsage : 0,
      averageQuality,
      patternCount: this.usagePatterns.size,
      currentAllocation: this.currentAllocation,
    }
  }

  /**
   * Reset usage history and patterns
   */
  resetLearning(): void {
    this.usageHistory = []
    this.usagePatterns.clear()
    this.loadUsagePatterns()
  }
}

/**
 * Convenience function for token budget optimization
 */
export async function optimizeTokenBudget(
  totalBudget: number,
  context?: Partial<ContextFactors>,
  config?: Partial<TokenBudgetConfig>
): Promise<AllocationResult> {
  const fullConfig: TokenBudgetConfig = {
    totalBudget,
    strategy: 'adaptive',
    model: 'generic',
    enableCompression: true,
    compressionThreshold: 0.8,
    preserveQuality: true,
    dynamicReallocation: true,
    contextAware: true,
    ...config,
  }

  const manager = new AdvancedTokenBudgetManager(fullConfig)
  return manager.optimizeAllocation(context)
}

/**
 * Convenience function for allocation with compression
 */
export async function optimizeTokensWithCompression(
  totalBudget: number,
  targetCompression: number = 0.7,
  context?: Partial<ContextFactors>
): Promise<AllocationResult> {
  return optimizeTokenBudget(totalBudget, context, {
    enableCompression: true,
    compressionThreshold: targetCompression,
    strategy: 'adaptive',
  })
}