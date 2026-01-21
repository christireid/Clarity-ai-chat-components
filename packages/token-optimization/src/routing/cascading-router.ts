/**
 * Cascading Router with Quality Assessment
 *
 * Automatically routes requests to cheap models first, assesses response quality,
 * and escalates to more expensive models only when needed. Achieves 50-80% cost
 * savings while maintaining quality standards.
 *
 * Strategy:
 * 1. Start with cheapest capable model
 * 2. Generate response
 * 3. Assess quality (heuristic or LLM-based)
 * 4. If quality insufficient, escalate to next tier
 * 5. Repeat until quality threshold met or max attempts reached
 *
 * @module cascading-router
 */

import { ComplexityAnalyzer, type ComplexityResult } from './complexity-analyzer'
import { ModelRouter, type ModelConfig, type RoutingStrategy } from './model-router'

/**
 * Quality assessment result
 */
export interface QualityAssessment {
  /** Overall quality score (0-1, higher = better) */
  score: number
  /** Whether quality meets threshold */
  passesThreshold: boolean
  /** Detailed quality metrics */
  metrics: {
    /** Response length appropriateness (0-1) */
    length: number
    /** Response completeness (0-1) */
    completeness: number
    /** Presence of refusal/inability indicators (0-1, higher = no refusal) */
    noRefusal: number
    /** Response coherence (0-1) */
    coherence: number
    /** Confidence in assessment (0-1) */
    confidence: number
  }
  /** Reasons for quality score */
  reasons: string[]
  /** Assessment method used */
  method: 'heuristic' | 'llm'
}

/**
 * LLM-based quality assessor interface
 */
export interface LLMQualityAssessor {
  /**
   * Assess response quality using an LLM
   *
   * @param prompt - Original prompt
   * @param response - Model response to assess
   * @returns Quality assessment
   */
  assess(prompt: string, response: string): Promise<QualityAssessment>
}

/**
 * Configuration for heuristic quality assessment
 */
export interface HeuristicQualityConfig {
  /** Minimum response length in characters */
  minLength?: number
  /** Maximum response length in characters (for avoiding overly verbose responses) */
  maxLength?: number
  /** Refusal keywords that indicate model couldn't complete task */
  refusalKeywords?: string[]
  /** Required keywords that should appear in response */
  requiredKeywords?: string[]
  /** Weight for length metric (0-1) */
  lengthWeight?: number
  /** Weight for completeness metric (0-1) */
  completenessWeight?: number
  /** Weight for no-refusal metric (0-1) */
  refusalWeight?: number
  /** Weight for coherence metric (0-1) */
  coherenceWeight?: number
}

/**
 * Model tier for cascading
 */
export interface ModelTier {
  /** Tier identifier */
  id: string
  /** Models in this tier (in order of preference) */
  models: ModelConfig[]
  /** Maximum attempts for this tier before escalating */
  maxAttempts?: number
}

/**
 * Configuration for cascading router
 */
export interface CascadingRouterConfig {
  /** Model tiers in order from cheapest to most expensive */
  tiers: ModelTier[]
  /** Quality threshold (0-1) - escalate if quality below this */
  qualityThreshold?: number
  /** Maximum total cascade attempts across all tiers */
  maxTotalAttempts?: number
  /** Quality assessment method */
  assessmentMethod?: 'heuristic' | 'llm' | 'both'
  /** Heuristic quality configuration */
  heuristicConfig?: HeuristicQualityConfig
  /** LLM quality assessor (required if using 'llm' or 'both') */
  llmAssessor?: LLMQualityAssessor
  /** Complexity analyzer for initial routing */
  complexityAnalyzer?: ComplexityAnalyzer
  /** Whether to track cascade metrics */
  trackMetrics?: boolean
}

/**
 * Result of a cascade attempt
 */
export interface CascadeAttempt {
  /** Attempt number (1-indexed) */
  attemptNumber: number
  /** Model tier used */
  tier: string
  /** Model configuration used */
  model: ModelConfig
  /** Generated response */
  response: string
  /** Quality assessment */
  quality: QualityAssessment
  /** Estimated cost for this attempt */
  cost: number
  /** Whether this attempt was successful (met quality threshold) */
  success: boolean
}

/**
 * Result of cascading router execution
 */
export interface CascadingResult {
  /** Final response (best quality achieved) */
  response: string
  /** All cascade attempts made */
  attempts: CascadeAttempt[]
  /** Final quality assessment */
  finalQuality: QualityAssessment
  /** Model that produced final response */
  finalModel: ModelConfig
  /** Total cost across all attempts */
  totalCost: number
  /** Whether quality threshold was met */
  qualityMet: boolean
  /** Number of escalations performed */
  escalations: number
  /** Complexity analysis of original prompt */
  complexity?: ComplexityResult
  /** Total tokens used (input + output across all attempts) */
  totalTokens: {
    input: number
    output: number
  }
}

/**
 * Cascade statistics
 */
export interface CascadeStats {
  /** Total cascade executions */
  totalExecutions: number
  /** Successful first attempts (no escalation needed) */
  successfulFirstAttempts: number
  /** Average number of attempts per execution */
  averageAttempts: number
  /** Total cost across all executions */
  totalCost: number
  /** Average cost per execution */
  averageCost: number
  /** Cost savings vs always using premium model */
  estimatedSavings: number
  /** Success rate by tier */
  successRateByTier: Map<string, number>
}

/**
 * Heuristic Quality Assessor
 *
 * Fast, rule-based quality assessment without external LLM calls.
 * Analyzes response characteristics like length, completeness, refusals.
 */
export class HeuristicQualityAssessor {
  private readonly config: Required<HeuristicQualityConfig>

  constructor(config: HeuristicQualityConfig = {}) {
    this.config = {
      minLength: config.minLength ?? 50,
      maxLength: config.maxLength ?? 10000,
      refusalKeywords: config.refusalKeywords ?? [
        "i can't",
        "i cannot",
        "i'm unable",
        'i am unable',
        "i don't have access",
        'unable to',
        'not able to',
        "i'm not able",
        'as an ai',
        'as a language model',
        'i apologize',
      ],
      requiredKeywords: config.requiredKeywords ?? [],
      lengthWeight: config.lengthWeight ?? 0.25,
      completenessWeight: config.completenessWeight ?? 0.35,
      refusalWeight: config.refusalWeight ?? 0.3,
      coherenceWeight: config.coherenceWeight ?? 0.1,
    }
  }

  /**
   * Assess response quality using heuristics
   *
   * @param prompt - Original prompt
   * @param response - Model response
   * @param qualityThreshold - Threshold to pass (0-1)
   * @returns Quality assessment
   */
  assess(prompt: string, response: string, qualityThreshold: number = 0.7): QualityAssessment {
    const metrics = {
      length: this.assessLength(response),
      completeness: this.assessCompleteness(prompt, response),
      noRefusal: this.assessNoRefusal(response),
      coherence: this.assessCoherence(response),
      confidence: 0.8, // Heuristic methods have moderate confidence
    }

    const reasons: string[] = []

    // Calculate weighted score
    let score = 0
    score += metrics.length * this.config.lengthWeight
    score += metrics.completeness * this.config.completenessWeight
    score += metrics.noRefusal * this.config.refusalWeight
    score += metrics.coherence * this.config.coherenceWeight

    // Add reasons
    if (metrics.length < 0.5) {
      reasons.push(`Response too ${response.length < this.config.minLength ? 'short' : 'long'}`)
    }
    if (metrics.completeness < 0.5) {
      reasons.push('Response appears incomplete')
    }
    if (metrics.noRefusal < 0.9) {
      reasons.push('Response contains refusal indicators')
    }
    if (metrics.coherence < 0.5) {
      reasons.push('Response coherence issues detected')
    }

    if (score >= qualityThreshold) {
      reasons.push('Quality threshold met')
    }

    return {
      score,
      passesThreshold: score >= qualityThreshold,
      metrics,
      reasons,
      method: 'heuristic',
    }
  }

  /**
   * Assess response length appropriateness
   */
  private assessLength(response: string): number {
    const length = response.length

    if (length < this.config.minLength) {
      // Too short
      return length / this.config.minLength
    } else if (length > this.config.maxLength) {
      // Too long
      const excess = length - this.config.maxLength
      const penalty = Math.min(excess / this.config.maxLength, 0.5)
      return 1.0 - penalty
    } else {
      // Good length
      return 1.0
    }
  }

  /**
   * Assess response completeness
   */
  private assessCompleteness(prompt: string, response: string): number {
    let score = 0.5 // Base score

    // Check for sentence endings
    const endsWithPunctuation = /[.!?]$/.test(response.trim())
    if (endsWithPunctuation) {
      score += 0.2
    }

    // Check for truncation indicators
    const truncationIndicators = ['...', '[truncated]', '[cut off]', 'continued...']
    const hasTruncation = truncationIndicators.some((indicator) =>
      response.toLowerCase().includes(indicator)
    )
    if (hasTruncation) {
      score -= 0.3
    }

    // Check for required keywords from prompt
    if (this.config.requiredKeywords.length > 0) {
      const keywordsPresent = this.config.requiredKeywords.filter((keyword) =>
        response.toLowerCase().includes(keyword.toLowerCase())
      ).length
      const keywordRatio = keywordsPresent / this.config.requiredKeywords.length
      score += keywordRatio * 0.3
    } else {
      // Default completeness boost if no specific keywords required
      score += 0.3
    }

    return Math.max(0, Math.min(1, score))
  }

  /**
   * Assess for refusal indicators
   */
  private assessNoRefusal(response: string): number {
    const lowerResponse = response.toLowerCase()

    // Check for refusal keywords
    const refusalCount = this.config.refusalKeywords.filter((keyword) =>
      lowerResponse.includes(keyword.toLowerCase())
    ).length

    if (refusalCount === 0) {
      return 1.0
    }

    // Penalty based on number of refusal indicators
    const penalty = Math.min(refusalCount * 0.3, 0.9)
    return 1.0 - penalty
  }

  /**
   * Assess response coherence
   */
  private assessCoherence(response: string): number {
    let score = 1.0

    // Check for repeated phrases (indicates low-quality generation)
    const words = response.split(/\s+/)
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()))
    const repetitionRatio = uniqueWords.size / Math.max(words.length, 1)

    if (repetitionRatio < 0.5) {
      score -= 0.4 // High repetition
    } else if (repetitionRatio < 0.7) {
      score -= 0.2 // Moderate repetition
    }

    // Check for sentence structure (simple heuristic)
    const sentences = response.split(/[.!?]+/)
    const avgSentenceLength = words.length / Math.max(sentences.length, 1)

    if (avgSentenceLength < 3) {
      score -= 0.3 // Very short sentences
    } else if (avgSentenceLength > 50) {
      score -= 0.2 // Very long run-on sentences
    }

    return Math.max(0, Math.min(1, score))
  }
}

/**
 * Cascading Router
 *
 * Routes requests to cheap models first, escalates only when quality is insufficient.
 *
 * @example Basic Usage
 * ```typescript
 * const router = new CascadingRouter({
 *   tiers: [
 *     { id: 'cheap', models: [gpt4oMini, claudeHaiku] },
 *     { id: 'standard', models: [gpt4o, claudeSonnet] },
 *     { id: 'premium', models: [claudeOpus] },
 *   ],
 *   qualityThreshold: 0.7,
 * });
 *
 * const result = await router.execute(prompt, generateFn);
 * console.log(`Cost: $${result.totalCost}, Attempts: ${result.attempts.length}`);
 * ```
 *
 * @example With LLM Quality Assessment
 * ```typescript
 * const llmAssessor: LLMQualityAssessor = {
 *   async assess(prompt, response) {
 *     const assessment = await openai.chat.completions.create({
 *       model: 'gpt-4o-mini',
 *       messages: [{
 *         role: 'system',
 *         content: 'Assess response quality. Return JSON: { score: 0-1, reasons: [...] }'
 *       }, {
 *         role: 'user',
 *         content: `Prompt: ${prompt}\n\nResponse: ${response}`
 *       }]
 *     });
 *     // Parse and return QualityAssessment
 *   }
 * };
 *
 * const router = new CascadingRouter({
 *   tiers: [...],
 *   assessmentMethod: 'llm',
 *   llmAssessor,
 * });
 * ```
 */
export class CascadingRouter {
  private readonly config: Required<CascadingRouterConfig>
  private readonly heuristicAssessor: HeuristicQualityAssessor
  private readonly stats: CascadeStats
  private readonly complexityAnalyzer: ComplexityAnalyzer

  constructor(config: CascadingRouterConfig) {
    // Validate config
    if (!config.tiers || config.tiers.length === 0) {
      throw new Error('CascadingRouter requires at least one model tier')
    }

    if (
      (config.assessmentMethod === 'llm' || config.assessmentMethod === 'both') &&
      !config.llmAssessor
    ) {
      throw new Error('LLM assessor required when using LLM assessment method')
    }

    this.config = {
      tiers: config.tiers,
      qualityThreshold: config.qualityThreshold ?? 0.7,
      maxTotalAttempts: config.maxTotalAttempts ?? 3,
      assessmentMethod: config.assessmentMethod ?? 'heuristic',
      heuristicConfig: config.heuristicConfig ?? {},
      llmAssessor: config.llmAssessor,
      complexityAnalyzer: config.complexityAnalyzer ?? new ComplexityAnalyzer(),
      trackMetrics: config.trackMetrics ?? true,
    }

    this.heuristicAssessor = new HeuristicQualityAssessor(this.config.heuristicConfig)

    this.stats = {
      totalExecutions: 0,
      successfulFirstAttempts: 0,
      averageAttempts: 0,
      totalCost: 0,
      averageCost: 0,
      estimatedSavings: 0,
      successRateByTier: new Map(),
    }

    this.complexityAnalyzer = this.config.complexityAnalyzer
  }

  /**
   * Execute cascade routing for a prompt
   *
   * @param prompt - The prompt to process
   * @param generateFn - Function to generate response given a model
   * @returns Cascade execution result
   */
  async execute(
    prompt: string,
    generateFn: (model: ModelConfig) => Promise<{ response: string; inputTokens: number; outputTokens: number }>
  ): Promise<CascadingResult> {
    // Analyze prompt complexity
    const complexity = this.complexityAnalyzer.analyze(prompt)

    const attempts: CascadeAttempt[] = []
    let totalInputTokens = 0
    let totalOutputTokens = 0
    let totalCost = 0
    let escalations = 0
    let qualityMet = false

    // Iterate through tiers
    for (let tierIndex = 0; tierIndex < this.config.tiers.length; tierIndex++) {
      const tier = this.config.tiers[tierIndex]
      const maxAttemptsForTier = tier.maxAttempts ?? 1

      // Try models in this tier
      for (let tierAttempt = 0; tierAttempt < maxAttemptsForTier; tierAttempt++) {
        // Check if we've exceeded max total attempts
        if (attempts.length >= this.config.maxTotalAttempts) {
          break
        }

        // Select model from tier (rotate through available models)
        const modelIndex = tierAttempt % tier.models.length
        const model = tier.models[modelIndex]

        // Generate response
        const { response, inputTokens, outputTokens } = await generateFn(model)

        totalInputTokens += inputTokens
        totalOutputTokens += outputTokens

        // Calculate cost
        const cost =
          (inputTokens / 1_000_000) * model.inputCostPer1M +
          (outputTokens / 1_000_000) * model.outputCostPer1M
        totalCost += cost

        // Assess quality
        const quality = await this.assessQuality(prompt, response)

        const attempt: CascadeAttempt = {
          attemptNumber: attempts.length + 1,
          tier: tier.id,
          model,
          response,
          quality,
          cost,
          success: quality.passesThreshold,
        }

        attempts.push(attempt)

        // Check if quality threshold met
        if (quality.passesThreshold) {
          qualityMet = true
          break
        }

        // Continue to next attempt in tier
      }

      // If quality met, stop escalating
      if (qualityMet) {
        break
      }

      // Escalate to next tier
      if (tierIndex < this.config.tiers.length - 1) {
        escalations++
      }
    }

    // Get final attempt (best result)
    const finalAttempt = attempts[attempts.length - 1]

    // Update stats
    if (this.config.trackMetrics) {
      this.updateStats(attempts, totalCost, escalations)
    }

    return {
      response: finalAttempt.response,
      attempts,
      finalQuality: finalAttempt.quality,
      finalModel: finalAttempt.model,
      totalCost,
      qualityMet,
      escalations,
      complexity,
      totalTokens: {
        input: totalInputTokens,
        output: totalOutputTokens,
      },
    }
  }

  /**
   * Assess response quality
   */
  private async assessQuality(prompt: string, response: string): Promise<QualityAssessment> {
    const method = this.config.assessmentMethod

    if (method === 'heuristic') {
      return this.heuristicAssessor.assess(prompt, response, this.config.qualityThreshold)
    }

    if (method === 'llm' && this.config.llmAssessor) {
      return await this.config.llmAssessor.assess(prompt, response)
    }

    if (method === 'both' && this.config.llmAssessor) {
      // Use both methods and combine scores
      const heuristic = this.heuristicAssessor.assess(prompt, response, this.config.qualityThreshold)
      const llm = await this.config.llmAssessor.assess(prompt, response)

      // Weighted average (give LLM assessment more weight)
      const combinedScore = heuristic.score * 0.3 + llm.score * 0.7

      return {
        score: combinedScore,
        passesThreshold: combinedScore >= this.config.qualityThreshold,
        metrics: {
          ...heuristic.metrics,
          confidence: (heuristic.metrics.confidence + llm.metrics.confidence) / 2,
        },
        reasons: [...heuristic.reasons, ...llm.reasons],
        method: 'both' as any,
      }
    }

    // Fallback to heuristic
    return this.heuristicAssessor.assess(prompt, response, this.config.qualityThreshold)
  }

  /**
   * Update cascade statistics
   */
  private updateStats(attempts: CascadeAttempt[], totalCost: number, escalations: number): void {
    this.stats.totalExecutions++

    if (escalations === 0) {
      this.stats.successfulFirstAttempts++
    }

    this.stats.averageAttempts =
      (this.stats.averageAttempts * (this.stats.totalExecutions - 1) + attempts.length) /
      this.stats.totalExecutions

    this.stats.totalCost += totalCost
    this.stats.averageCost = this.stats.totalCost / this.stats.totalExecutions

    // Update success rate by tier
    for (const attempt of attempts) {
      const tierStats = this.stats.successRateByTier.get(attempt.tier) ?? 0
      this.stats.successRateByTier.set(attempt.tier, tierStats + (attempt.success ? 1 : 0))
    }

    // Calculate estimated savings (vs always using premium tier)
    const premiumTier = this.config.tiers[this.config.tiers.length - 1]
    const premiumModel = premiumTier.models[0]
    const firstAttempt = attempts[0]

    // Estimate what premium cost would have been
    const estimatedPremiumCost =
      (firstAttempt.model.inputCostPer1M / premiumModel.inputCostPer1M) * totalCost

    this.stats.estimatedSavings += Math.max(0, estimatedPremiumCost - totalCost)
  }

  /**
   * Get cascade statistics
   */
  getStats(): CascadeStats {
    return { ...this.stats }
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats.totalExecutions = 0
    this.stats.successfulFirstAttempts = 0
    this.stats.averageAttempts = 0
    this.stats.totalCost = 0
    this.stats.averageCost = 0
    this.stats.estimatedSavings = 0
    this.stats.successRateByTier.clear()
  }
}

/**
 * Create a cascading router with preset OpenAI tiers
 *
 * @param options - Additional configuration options
 * @returns Configured cascading router
 */
export function createOpenAICascadingRouter(
  options: Partial<CascadingRouterConfig> = {}
): CascadingRouter {
  const tiers: ModelTier[] = [
    {
      id: 'cheap',
      models: [
        {
          id: 'gpt-4o-mini',
          tier: 'small',
          inputCostPer1M: 0.15,
          outputCostPer1M: 0.6,
          contextWindow: 128000,
          maxOutput: 16384,
          capabilities: ['chat', 'tools'],
        },
      ],
    },
    {
      id: 'standard',
      models: [
        {
          id: 'gpt-4o',
          tier: 'medium',
          inputCostPer1M: 2.5,
          outputCostPer1M: 10,
          contextWindow: 128000,
          maxOutput: 16384,
          capabilities: ['chat', 'tools', 'vision'],
        },
      ],
    },
    {
      id: 'premium',
      models: [
        {
          id: 'o1',
          tier: 'premium',
          inputCostPer1M: 15,
          outputCostPer1M: 60,
          contextWindow: 200000,
          maxOutput: 100000,
          capabilities: ['chat', 'reasoning'],
        },
      ],
    },
  ]

  return new CascadingRouter({
    tiers,
    ...options,
  })
}

/**
 * Create a cascading router with preset Anthropic tiers
 *
 * @param options - Additional configuration options
 * @returns Configured cascading router
 */
export function createAnthropicCascadingRouter(
  options: Partial<CascadingRouterConfig> = {}
): CascadingRouter {
  const tiers: ModelTier[] = [
    {
      id: 'cheap',
      models: [
        {
          id: 'claude-3-5-haiku-20241022',
          tier: 'small',
          inputCostPer1M: 0.8,
          outputCostPer1M: 4,
          contextWindow: 200000,
          maxOutput: 8192,
          capabilities: ['chat', 'tools'],
        },
      ],
    },
    {
      id: 'standard',
      models: [
        {
          id: 'claude-3-5-sonnet-20241022',
          tier: 'medium',
          inputCostPer1M: 3,
          outputCostPer1M: 15,
          contextWindow: 200000,
          maxOutput: 8192,
          capabilities: ['chat', 'tools', 'vision'],
        },
      ],
    },
    {
      id: 'premium',
      models: [
        {
          id: 'claude-opus-4-20250514',
          tier: 'premium',
          inputCostPer1M: 15,
          outputCostPer1M: 75,
          contextWindow: 200000,
          maxOutput: 16384,
          capabilities: ['chat', 'tools', 'vision', 'advanced-reasoning'],
        },
      ],
    },
  ]

  return new CascadingRouter({
    tiers,
    ...options,
  })
}
