/**
 * Advanced Token Budget Manager
 *
 * Sophisticated budget management with dynamic allocation
 */

export interface TokenBudgetConfig {
  maxTokens: number
  reserveTokens: number
  minQualityThreshold: number
  enableDynamicAllocation: boolean
  enableCompression: boolean
  enableCaching: boolean
  priorityWeights: {
    system: number
    user: number
    context: number
    response: number
  }
}

export interface TokenAllocation {
  system: number
  user: number
  context: number
  response: number
  available: number
}

export interface AllocationStrategy {
  name: string
  allocate: (
    budget: number,
    requirements: AllocationRequirements
  ) => TokenAllocation
  priority: number
}

export interface AllocationResult {
  allocation: TokenAllocation
  strategy: string
  qualityScore: number
  costEstimate: number
  recommendations: string[]
}

export interface ContextFactors {
  conversationLength: number
  userPreferences: Record<string, any>
  recentContext: string[]
  memoryRichness: number
  responseComplexity: 'simple' | 'moderate' | 'complex'
}

export class AdvancedTokenBudgetManager {
  private strategies: Map<string, AllocationStrategy>
  private config: TokenBudgetConfig

  constructor(config: Partial<TokenBudgetConfig> = {}) {
    this.config = {
      maxTokens: 128000,
      reserveTokens: 1000,
      minQualityThreshold: 0.8,
      enableDynamicAllocation: true,
      enableCompression: true,
      enableCaching: true,
      priorityWeights: {
        system: 0.2,
        user: 0.3,
        context: 0.3,
        response: 0.2,
      },
      ...config,
    }

    this.strategies = new Map()
    this.initializeStrategies()
  }

  async optimizeTokenBudget(
    requirements: AllocationRequirements,
    context: ContextFactors
  ): Promise<AllocationResult> {
    const availableBudget = this.config.maxTokens - this.config.reserveTokens

    // Select optimal strategy
    const strategy = this.selectStrategy(requirements, context)

    // Allocate tokens
    const allocation = strategy.allocate(availableBudget, requirements)

    // Apply dynamic adjustments
    if (this.config.enableDynamicAllocation) {
      await this.applyDynamicAdjustments(allocation, context)
    }

    // Calculate quality score
    const qualityScore = this.calculateQualityScore(allocation, context)

    // Calculate cost estimate
    const costEstimate = this.estimateCost(allocation)

    // Generate recommendations
    const recommendations = this.generateRecommendations(allocation, context)

    return {
      allocation,
      strategy: strategy.name,
      qualityScore,
      costEstimate,
      recommendations,
    }
  }

  private selectStrategy(
    _requirements: AllocationRequirements,
    _context: ContextFactors
  ): AllocationStrategy {
    // Simple strategy selection based on requirements
    return this.strategies.get('balanced')!
  }

  private initializeStrategies(): void {
    this.strategies.set('balanced', {
      name: 'balanced',
      allocate: (_budget: number, _requirements: AllocationRequirements) => {
        const weights = this.config.priorityWeights
        return {
          system: Math.floor(_budget * weights.system),
          user: Math.floor(_budget * weights.user),
          context: Math.floor(_budget * weights.context),
          response: Math.floor(_budget * weights.response),
          available:
            _budget -
            Math.floor(
              _budget *
                (weights.system +
                  weights.user +
                  weights.context +
                  weights.response)
            ),
        }
      },
      priority: 1,
    })
  }

  private async applyDynamicAdjustments(
    allocation: TokenAllocation,
    context: ContextFactors
  ): Promise<void> {
    // Adjust based on conversation length
    if (context.conversationLength > 1000) {
      allocation.context = Math.floor(allocation.context * 0.8)
      allocation.available += Math.floor(allocation.context * 0.2)
    }

    // Adjust based on memory richness
    if (context.memoryRichness > 0.8) {
      allocation.context = Math.floor(allocation.context * 1.2)
      allocation.available = Math.max(
        0,
        allocation.available - Math.floor(allocation.context * 0.2)
      )
    }

    // Adjust based on response complexity
    const complexityMultipliers = {
      simple: 0.7,
      moderate: 1.0,
      complex: 1.5,
    }

    const multiplier = complexityMultipliers[context.responseComplexity]
    allocation.response = Math.floor(allocation.response * multiplier)
    allocation.available = Math.max(
      0,
      allocation.available - Math.floor(allocation.response * (multiplier - 1))
    )
  }

  private calculateQualityScore(
    allocation: TokenAllocation,
    context: ContextFactors
  ): number {
    let score = 0.8 // Base score

    // Adjust based on allocation balance
    const totalAllocated =
      allocation.system +
      allocation.user +
      allocation.context +
      allocation.response
    const utilization =
      totalAllocated / (this.config.maxTokens - this.config.reserveTokens)

    if (utilization > 0.9) score += 0.1
    if (utilization < 0.5) score -= 0.2

    // Adjust based on context factors
    if (context.memoryRichness > 0.8) score += 0.05
    if (context.conversationLength < 500) score += 0.05

    return Math.max(0, Math.min(1, score))
  }

  private estimateCost(allocation: TokenAllocation): number {
    const totalTokens =
      allocation.system +
      allocation.user +
      allocation.context +
      allocation.response
    return totalTokens * 0.000001 // Assume $0.001 per 1K tokens
  }

  private generateRecommendations(
    allocation: TokenAllocation,
    context: ContextFactors
  ): string[] {
    const recommendations: string[] = []

    if (allocation.available < 100) {
      recommendations.push('Consider increasing token budget')
    }

    if (context.conversationLength > 2000) {
      recommendations.push('Consider summarizing conversation history')
    }

    if (context.responseComplexity === 'complex') {
      recommendations.push('Consider breaking complex responses into chunks')
    }

    return recommendations
  }
}

/**
 * Optimize token budget allocation based on requirements and context.
 *
 * Creates a temporary budget manager and optimizes token allocation
 * for the given requirements and context factors.
 *
 * @param budget - Maximum token budget available
 * @param requirements - Allocation requirements including prompts and quality needs
 * @param context - Context factors like conversation length and complexity
 * @param config - Optional configuration overrides
 * @returns Allocation result with strategy, quality score, and recommendations
 *
 * @example
 * ```typescript
 * const result = await optimizeTokenBudget(
 *   8000,
 *   { systemPrompt: 'You are helpful', qualityRequirement: 0.9 },
 *   { conversationLength: 500, responseComplexity: 'moderate', memoryRichness: 0.5 }
 * )
 * console.log(result.allocation)
 * ```
 */
export async function optimizeTokenBudget(
  budget: number,
  requirements: AllocationRequirements,
  context: ContextFactors,
  config?: Partial<TokenBudgetConfig>
): Promise<AllocationResult> {
  const manager = new AdvancedTokenBudgetManager({
    maxTokens: budget,
    ...config,
  })

  return await manager.optimizeTokenBudget(requirements, context)
}

/**
 * Optimize content to fit within token budget, optionally with compression.
 *
 * If compression is enabled and content exceeds the token limit,
 * applies simple whitespace normalization to reduce token count.
 *
 * @param content - The text content to optimize
 * @param maxTokens - Maximum allowed tokens
 * @param enableCompression - Whether to apply compression (default: true)
 * @returns Optimized content with token count and compression ratio
 *
 * @example
 * ```typescript
 * const result = await optimizeTokensWithCompression(
 *   longText,
 *   4000,
 *   true
 * )
 * console.log(`Compressed to ${result.tokens} tokens (${result.compressionRatio * 100}%)`)
 * ```
 */
export async function optimizeTokensWithCompression(
  content: string,
  maxTokens: number,
  enableCompression: boolean = true
): Promise<{ content: string; tokens: number; compressionRatio: number }> {
  if (!enableCompression || content.length <= maxTokens * 4) {
    return {
      content,
      tokens: Math.ceil(content.length / 4),
      compressionRatio: 1.0,
    }
  }

  // Simple compression for demonstration
  const compressed = content
    .replace(/\s+/g, ' ')
    .replace(/[.]{2,}/g, '.')
    .trim()

  const compressedTokens = Math.ceil(compressed.length / 4)
  const compressionRatio = compressed.length / content.length

  return {
    content:
      compressedTokens <= maxTokens
        ? compressed
        : content.substring(0, maxTokens * 4),
    tokens: Math.min(compressedTokens, maxTokens),
    compressionRatio,
  }
}

export interface AllocationRequirements {
  systemPrompt?: string
  userInput?: string
  contextHistory?: string[]
  expectedResponse?: string
  qualityRequirement?: number
  urgency?: 'low' | 'medium' | 'high'
}
