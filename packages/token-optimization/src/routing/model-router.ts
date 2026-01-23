/**
 * ModelRouter - Cost-optimized model selection
 *
 * Routes prompts to the most cost-effective model based on
 * complexity analysis, capability requirements, and constraints.
 *
 * @module model-router
 */

import { ComplexityAnalyzer, ComplexityLevel } from './complexity-analyzer'
import type { ComplexityResult } from './complexity-analyzer'

/**
 * Model tier classification
 */
export type ModelTier = 'small' | 'medium' | 'large' | 'premium'

/**
 * Routing strategy options
 */
export enum RoutingStrategy {
  /** Prioritize lowest cost while meeting requirements */
  CostOptimized = 'cost-optimized',
  /** Prioritize quality over cost */
  QualityFirst = 'quality-first',
  /** Balance cost and quality */
  Balanced = 'balanced',
}

/**
 * Configuration for model routing decisions
 *
 * Defines cost, capabilities, and constraints for routing prompts to models.
 * Renamed from ModelConfig to ModelRoutingConfig to clarify purpose and avoid
 * collision with ModelRegistryConfig in models/model-registry.ts.
 */
export interface ModelRoutingConfig {
  /** Unique model identifier */
  id: string
  /** Model tier classification */
  tier: ModelTier
  /** Cost per 1M input tokens in USD */
  inputCostPer1M: number
  /** Cost per 1M output tokens in USD */
  outputCostPer1M: number
  /** Maximum context window in tokens */
  contextWindow: number
  /** Maximum output tokens */
  maxOutput: number
  /** Model capabilities */
  capabilities: string[]
}

/**
 * Options for routing a request
 */
export interface RoutingOptions {
  /** Estimated total tokens (if input/output not specified) */
  estimatedTokens?: number
  /** Estimated input tokens */
  estimatedInputTokens?: number
  /** Estimated output tokens */
  estimatedOutputTokens?: number
  /** Required capabilities */
  requiredCapabilities?: string[]
  /** Override routing strategy */
  strategy?: RoutingStrategy
  /** Only consider these models */
  allowedModels?: string[]
  /** Exclude these models */
  excludedModels?: string[]
}

/**
 * Result of model routing
 */
export interface RoutingResult {
  /** Selected model configuration */
  selectedModel: ModelRoutingConfig | undefined
  /** Routing strategy used */
  strategy: RoutingStrategy
  /** Complexity analysis result */
  complexity?: ComplexityResult
  /** Estimated total cost in USD */
  estimatedCost?: number
  /** Estimated input cost in USD */
  inputCost?: number
  /** Estimated output cost in USD */
  outputCost?: number
  /** Reason for fallback (if not ideal match) */
  fallbackReason?: string
  /** Confidence in the routing decision (0-1) */
  confidence: number
}

/**
 * Router statistics
 */
export interface RouterStats {
  /** Total routing decisions made */
  totalRoutes: number
  /** Routes by model tier */
  routesByTier: Record<ModelTier, number>
  /** Estimated total cost saved by smart routing */
  estimatedSavings: number
  /** Average complexity score */
  averageComplexity: number
}

/**
 * Router configuration
 */
export interface ModelRouterConfig {
  /** Available models */
  models: ModelRoutingConfig[]
  /** Default routing strategy */
  defaultStrategy?: RoutingStrategy
  /** Custom complexity analyzer */
  complexityAnalyzer?: ComplexityAnalyzer
}

// ═══════════════════════════════════════════════════════════════════════════
// MODEL ROUTER BUILDER
// Fluent API for easy configuration
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fluent builder for creating ModelRouter instances.
 *
 * Makes it easy to configure a router with autocomplete and chainable methods.
 *
 * @example Basic Usage
 * ```typescript
 * const router = ModelRouter.builder()
 *   .addModel('gpt-4o-mini', 'small', 0.15, 0.6)
 *   .addModel('gpt-4o', 'medium', 2.5, 10)
 *   .withStrategy('balanced')
 *   .build()
 * ```
 *
 * @example With Preset Models
 * ```typescript
 * const router = ModelRouter.builder()
 *   .useOpenAIModels()  // Adds gpt-4o-mini, gpt-4o, gpt-4-turbo
 *   .useClaudeModels()  // Adds claude-3-haiku, claude-3-sonnet, claude-3-opus
 *   .build()
 * ```
 *
 * @example Custom Configuration
 * ```typescript
 * const router = ModelRouter.builder()
 *   .addModel({
 *     id: 'my-fine-tuned-model',
 *     tier: 'medium',
 *     inputCostPer1M: 3.0,
 *     outputCostPer1M: 6.0,
 *     contextWindow: 8192,
 *     maxOutput: 4096,
 *     capabilities: ['chat', 'code']
 *   })
 *   .withStrategy('quality-first')
 *   .build()
 * ```
 */
export class ModelRouterBuilder {
  private models: ModelRoutingConfig[] = []
  private strategy: RoutingStrategy = RoutingStrategy.CostOptimized
  private analyzer?: ComplexityAnalyzer

  /**
   * Add a model with full configuration
   */
  addModel(config: ModelRoutingConfig): this
  /**
   * Add a model with common defaults
   */
  addModel(
    id: string,
    tier: ModelTier,
    inputCostPer1M: number,
    outputCostPer1M: number,
    contextWindow?: number,
    maxOutput?: number,
    capabilities?: string[]
  ): this
  addModel(
    configOrId: ModelRoutingConfig | string,
    tier?: ModelTier,
    inputCostPer1M?: number,
    outputCostPer1M?: number,
    contextWindow = 128000,
    maxOutput = 16384,
    capabilities: string[] = ['chat', 'completion']
  ): this {
    if (typeof configOrId === 'string') {
      this.models.push({
        id: configOrId,
        tier: tier!,
        inputCostPer1M: inputCostPer1M!,
        outputCostPer1M: outputCostPer1M!,
        contextWindow,
        maxOutput,
        capabilities,
      })
    } else {
      this.models.push(configOrId)
    }
    return this
  }

  /**
   * Add all OpenAI models with current pricing (as of 2025)
   */
  useOpenAIModels(): this {
    return this.addModel('gpt-4o-mini', 'small', 0.15, 0.6, 128000, 16384, [
      'chat',
      'completion',
      'function_calling',
    ])
      .addModel('gpt-4o', 'medium', 2.5, 10, 128000, 16384, [
        'chat',
        'completion',
        'function_calling',
        'vision',
      ])
      .addModel('gpt-4-turbo', 'large', 10, 30, 128000, 4096, [
        'chat',
        'completion',
        'function_calling',
        'vision',
      ])
      .addModel('o1', 'premium', 15, 60, 200000, 100000, ['chat', 'reasoning'])
  }

  /**
   * Add all Anthropic Claude models with current pricing (as of 2025)
   */
  useClaudeModels(): this {
    return this.addModel('claude-3-haiku', 'small', 0.25, 1.25, 200000, 64000, [
      'chat',
      'completion',
      'tool_use',
    ])
      .addModel('claude-3-sonnet', 'medium', 3, 15, 200000, 64000, [
        'chat',
        'completion',
        'tool_use',
        'vision',
      ])
      .addModel('claude-3-5-sonnet', 'large', 3, 15, 200000, 64000, [
        'chat',
        'completion',
        'tool_use',
        'vision',
        'computer_use',
      ])
      .addModel('claude-3-opus', 'premium', 15, 75, 200000, 64000, [
        'chat',
        'completion',
        'tool_use',
        'vision',
      ])
  }

  /**
   * Add Google Gemini models with current pricing (as of 2025)
   */
  useGeminiModels(): this {
    return this.addModel(
      'gemini-2.0-flash-lite',
      'small',
      0.075,
      0.3,
      200000,
      65536,
      ['chat', 'completion']
    )
      .addModel('gemini-2.0-flash', 'medium', 0.5, 3, 200000, 65536, [
        'chat',
        'completion',
        'vision',
      ])
      .addModel('gemini-2.0-pro', 'large', 2.5, 15, 1000000, 65536, [
        'chat',
        'completion',
        'vision',
      ])
  }

  /**
   * Add all major provider models (OpenAI, Claude, Gemini)
   */
  useAllProviders(): this {
    return this.useOpenAIModels().useClaudeModels().useGeminiModels()
  }

  /**
   * Set the default routing strategy
   * @param strategy - 'cost-optimized' | 'balanced' | 'quality-first'
   */
  withStrategy(
    strategy: RoutingStrategy | 'cost-optimized' | 'balanced' | 'quality-first'
  ): this {
    if (typeof strategy === 'string') {
      switch (strategy) {
        case 'cost-optimized':
          this.strategy = RoutingStrategy.CostOptimized
          break
        case 'balanced':
          this.strategy = RoutingStrategy.Balanced
          break
        case 'quality-first':
          this.strategy = RoutingStrategy.QualityFirst
          break
        default:
          this.strategy = strategy as RoutingStrategy
      }
    } else {
      this.strategy = strategy
    }
    return this
  }

  /**
   * Use a custom complexity analyzer
   */
  withComplexityAnalyzer(analyzer: ComplexityAnalyzer): this {
    this.analyzer = analyzer
    return this
  }

  /**
   * Build the ModelRouter instance
   * @throws Error if no models have been configured
   */
  build(): ModelRouter {
    if (this.models.length === 0) {
      throw new Error(
        'No models configured. Use addModel() or useOpenAIModels() etc.'
      )
    }

    return new ModelRouter({
      models: this.models,
      defaultStrategy: this.strategy,
      complexityAnalyzer: this.analyzer,
    })
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MODEL ROUTER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cost-optimized model router
 *
 * Routes prompts to the most cost-effective model based on complexity analysis.
 *
 * @example Using Builder (Recommended)
 * ```typescript
 * const router = ModelRouter.builder()
 *   .useOpenAIModels()
 *   .withStrategy('balanced')
 *   .build()
 *
 * const result = router.route('Write a sorting function')
 * console.log(result.selectedModel?.id)  // 'gpt-4o-mini' for simple tasks
 * console.log(result.estimatedCost)      // Cost estimate in USD
 * ```
 *
 * @example Manual Configuration
 * ```typescript
 * const router = new ModelRouter({
 *   models: [
 *     { id: 'gpt-4o-mini', tier: 'small', inputCostPer1M: 0.15, outputCostPer1M: 0.6, contextWindow: 128000, maxOutput: 16384, capabilities: ['chat'] },
 *     { id: 'gpt-4o', tier: 'medium', inputCostPer1M: 2.5, outputCostPer1M: 10, contextWindow: 128000, maxOutput: 16384, capabilities: ['chat', 'vision'] }
 *   ]
 * })
 *
 * Note: Uses ModelRoutingConfig type (not ModelRegistryConfig from models/)
 * ```
 *
 * @example With Options
 * ```typescript
 * const result = router.route(prompt, {
 *   estimatedInputTokens: 5000,
 *   estimatedOutputTokens: 1000,
 *   requiredCapabilities: ['vision'],
 *   strategy: RoutingStrategy.QualityFirst
 * })
 * ```
 */
export class ModelRouter {
  /**
   * Create a new ModelRouterBuilder for fluent configuration.
   *
   * @example
   * ```typescript
   * const router = ModelRouter.builder()
   *   .useOpenAIModels()
   *   .withStrategy('balanced')
   *   .build()
   * ```
   */
  static builder(): ModelRouterBuilder {
    return new ModelRouterBuilder()
  }

  /**
   * Create a router with sensible defaults (OpenAI models, balanced strategy).
   *
   * @example
   * ```typescript
   * const router = ModelRouter.default()
   * const result = router.route('Hello world')
   * ```
   */
  static default(): ModelRouter {
    return ModelRouter.builder()
      .useOpenAIModels()
      .withStrategy('balanced')
      .build()
  }

  private models: ModelRoutingConfig[]
  private defaultStrategy: RoutingStrategy
  private complexityAnalyzer: ComplexityAnalyzer
  private stats: {
    totalRoutes: number
    routesByTier: Record<ModelTier, number>
    totalCostWithRouting: number
    totalCostWithoutRouting: number
    complexitySum: number
  }

  constructor(config: ModelRouterConfig) {
    this.models = config.models.sort(
      (a, b) => a.inputCostPer1M - b.inputCostPer1M
    )
    this.defaultStrategy =
      config.defaultStrategy ?? RoutingStrategy.CostOptimized
    this.complexityAnalyzer =
      config.complexityAnalyzer ?? new ComplexityAnalyzer()
    this.stats = {
      totalRoutes: 0,
      routesByTier: { small: 0, medium: 0, large: 0, premium: 0 },
      totalCostWithRouting: 0,
      totalCostWithoutRouting: 0,
      complexitySum: 0,
    }
  }

  /**
   * Route a prompt to the optimal model
   *
   * @param prompt - The prompt to route
   * @param options - Routing options
   * @returns Routing result with selected model and cost estimate
   */
  route(prompt: string, options: RoutingOptions = {}): RoutingResult {
    const strategy = options.strategy ?? this.defaultStrategy
    const complexity = this.complexityAnalyzer.analyze(prompt)

    // Filter available models
    let candidates = this.filterModels(options)

    // Check capability requirements
    if (options.requiredCapabilities?.length) {
      candidates = candidates.filter((model) =>
        options.requiredCapabilities!.every((cap) =>
          model.capabilities.includes(cap)
        )
      )

      if (candidates.length === 0) {
        return {
          selectedModel: undefined,
          strategy,
          complexity,
          fallbackReason: 'No model with required capability',
          confidence: 0,
        }
      }
    }

    // Check context window constraints
    const estimatedInput =
      options.estimatedInputTokens ?? options.estimatedTokens ?? 0
    if (estimatedInput > 0) {
      candidates = candidates.filter(
        (model) => model.contextWindow >= estimatedInput
      )
    }

    if (candidates.length === 0) {
      return {
        selectedModel: undefined,
        strategy,
        complexity,
        fallbackReason: 'No model with sufficient context window',
        confidence: 0,
      }
    }

    // Select model based on strategy
    const selectedModel = this.selectModel(candidates, complexity, strategy)

    // Calculate costs
    const inputTokens =
      options.estimatedInputTokens ?? options.estimatedTokens ?? 1000
    const outputTokens =
      options.estimatedOutputTokens ?? Math.floor(inputTokens * 0.5)
    const inputCost = selectedModel
      ? (inputTokens / 1_000_000) * selectedModel.inputCostPer1M
      : undefined
    const outputCost = selectedModel
      ? (outputTokens / 1_000_000) * selectedModel.outputCostPer1M
      : undefined
    const estimatedCost =
      inputCost !== undefined && outputCost !== undefined
        ? inputCost + outputCost
        : undefined

    // Determine if this was a fallback
    let fallbackReason: string | undefined
    if (selectedModel) {
      const idealTier = this.getTierForComplexity(complexity.level)
      if (selectedModel.tier !== idealTier) {
        fallbackReason = `Ideal tier (${idealTier}) unavailable, using ${selectedModel.tier}`
      }
    }

    // Update stats
    this.updateStats(selectedModel, complexity, estimatedCost)

    return {
      selectedModel,
      strategy,
      complexity,
      estimatedCost,
      inputCost,
      outputCost,
      fallbackReason,
      confidence: selectedModel ? complexity.confidence : 0,
    }
  }

  /**
   * Get routing statistics
   */
  getStats(): RouterStats {
    const estimatedSavings = Math.max(
      0,
      this.stats.totalCostWithoutRouting - this.stats.totalCostWithRouting
    )

    return {
      totalRoutes: this.stats.totalRoutes,
      routesByTier: { ...this.stats.routesByTier },
      estimatedSavings,
      averageComplexity:
        this.stats.totalRoutes > 0
          ? this.stats.complexitySum / this.stats.totalRoutes
          : 0,
    }
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalRoutes: 0,
      routesByTier: { small: 0, medium: 0, large: 0, premium: 0 },
      totalCostWithRouting: 0,
      totalCostWithoutRouting: 0,
      complexitySum: 0,
    }
  }

  /**
   * Filter models based on options
   */
  private filterModels(options: RoutingOptions): ModelRoutingConfig[] {
    let candidates = [...this.models]

    if (options.allowedModels?.length) {
      candidates = candidates.filter((m) =>
        options.allowedModels!.includes(m.id)
      )
    }

    if (options.excludedModels?.length) {
      candidates = candidates.filter(
        (m) => !options.excludedModels!.includes(m.id)
      )
    }

    return candidates
  }

  /**
   * Select the best model based on strategy and complexity
   */
  private selectModel(
    candidates: ModelRoutingConfig[],
    complexity: ComplexityResult,
    strategy: RoutingStrategy
  ): ModelConfig | undefined {
    if (candidates.length === 0) return undefined

    switch (strategy) {
      case RoutingStrategy.CostOptimized:
        return this.selectCostOptimized(candidates, complexity)
      case RoutingStrategy.QualityFirst:
        return this.selectQualityFirst(candidates)
      case RoutingStrategy.Balanced:
        return this.selectBalanced(candidates, complexity)
      default:
        return this.selectCostOptimized(candidates, complexity)
    }
  }

  /**
   * Cost-optimized selection: cheapest model that meets complexity requirements
   */
  private selectCostOptimized(
    candidates: ModelRoutingConfig[],
    complexity: ComplexityResult
  ): ModelConfig | undefined {
    const targetTier = this.getTierForComplexity(complexity.level)
    const tierOrder: ModelTier[] = ['small', 'medium', 'large', 'premium']
    const targetIndex = tierOrder.indexOf(targetTier)

    // Sort by cost (cheapest first)
    const sorted = [...candidates].sort(
      (a, b) => a.inputCostPer1M - b.inputCostPer1M
    )

    // Find cheapest model at or above target tier
    for (const model of sorted) {
      const modelTierIndex = tierOrder.indexOf(model.tier)
      if (modelTierIndex >= targetIndex) {
        return model
      }
    }

    // Fallback to any available model (prefer larger for safety)
    return sorted[sorted.length - 1]
  }

  /**
   * Quality-first selection: best model available
   */
  private selectQualityFirst(
    candidates: ModelRoutingConfig[]
  ): ModelRoutingConfig | undefined {
    const tierOrder: ModelTier[] = ['premium', 'large', 'medium', 'small']

    for (const tier of tierOrder) {
      const model = candidates.find((m) => m.tier === tier)
      if (model) return model
    }

    return candidates[0]
  }

  /**
   * Balanced selection: consider both cost and quality
   */
  private selectBalanced(
    candidates: ModelRoutingConfig[],
    complexity: ComplexityResult
  ): ModelConfig | undefined {
    // Bump up one tier from cost-optimized for better quality
    const targetTier = this.getTierForComplexity(complexity.level)
    const tierOrder: ModelTier[] = ['small', 'medium', 'large', 'premium']
    const targetIndex = Math.min(
      tierOrder.indexOf(targetTier) + 1,
      tierOrder.length - 1
    )
    const balancedTier = tierOrder[targetIndex]

    // Find model at balanced tier or above
    const sorted = [...candidates].sort(
      (a, b) => a.inputCostPer1M - b.inputCostPer1M
    )

    for (const model of sorted) {
      if (tierOrder.indexOf(model.tier) >= tierOrder.indexOf(balancedTier)) {
        return model
      }
    }

    // Fallback
    return sorted[sorted.length - 1] ?? sorted[0]
  }

  /**
   * Map complexity level to model tier
   */
  private getTierForComplexity(level: ComplexityLevel): ModelTier {
    switch (level) {
      case ComplexityLevel.Low:
        return 'small'
      case ComplexityLevel.Medium:
        return 'medium'
      case ComplexityLevel.High:
        return 'large'
      case ComplexityLevel.Critical:
        return 'premium'
    }
  }

  /**
   * Update routing statistics
   */
  private updateStats(
    model: ModelRoutingConfig | undefined,
    complexity: ComplexityResult,
    estimatedCost?: number
  ): void {
    this.stats.totalRoutes++
    this.stats.complexitySum += complexity.score

    if (model) {
      this.stats.routesByTier[model.tier]++

      if (estimatedCost !== undefined) {
        this.stats.totalCostWithRouting += estimatedCost

        // Calculate what it would have cost with premium model
        const premiumModel = this.models.find((m) => m.tier === 'premium')
        if (premiumModel) {
          const premiumCost =
            (estimatedCost / model.inputCostPer1M) * premiumModel.inputCostPer1M
          this.stats.totalCostWithoutRouting += premiumCost
        }
      }
    }
  }
}
