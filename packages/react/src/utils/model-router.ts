/**
 * Intelligent Model Router
 * 
 * Routes queries to appropriate models based on complexity.
 * Can save 40-60% on costs by using cheaper models for simple queries.
 */

export interface RouteModelConfig {
  /** Model identifier */
  id: string
  /** Model name */
  name: string
  /** Cost per input token */
  inputCost: number
  /** Cost per output token */
  outputCost: number
  /** Context window size */
  contextWindow: number
  /** Model tier (simple, standard, advanced) */
  tier: 'simple' | 'standard' | 'advanced'
  /** Provider (openai, anthropic, etc.) */
  provider: string
}

export interface QueryComplexity {
  /** Complexity score (0-1) */
  score: number
  /** Complexity level */
  level: 'simple' | 'medium' | 'complex'
  /** Reasoning for classification */
  reasons: string[]
  /** Estimated tokens */
  estimatedTokens: number
}

export interface RoutingDecision {
  /** Selected model */
  model: RouteModelConfig
  /** Query complexity analysis */
  complexity: QueryComplexity
  /** Estimated cost with this model */
  estimatedCost: number
  /** Potential savings vs using most expensive model */
  savingsPercent: number
  /** Reasoning for routing decision */
  reasoning: string
}

/**
 * Common model configurations
 */
export const COMMON_MODELS: RouteModelConfig[] = [
  // OpenAI Models
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    inputCost: 0.0000005,
    outputCost: 0.0000015,
    contextWindow: 16385,
    tier: 'simple',
    provider: 'openai',
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    inputCost: 0.00003,
    outputCost: 0.00006,
    contextWindow: 8192,
    tier: 'standard',
    provider: 'openai',
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    inputCost: 0.00001,
    outputCost: 0.00003,
    contextWindow: 128000,
    tier: 'advanced',
    provider: 'openai',
  },
  // Anthropic Models
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    inputCost: 0.00000025,
    outputCost: 0.00000125,
    contextWindow: 200000,
    tier: 'simple',
    provider: 'anthropic',
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    inputCost: 0.000003,
    outputCost: 0.000015,
    contextWindow: 200000,
    tier: 'standard',
    provider: 'anthropic',
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    inputCost: 0.000015,
    outputCost: 0.000075,
    contextWindow: 200000,
    tier: 'advanced',
    provider: 'anthropic',
  },
]

/**
 * Complexity analysis patterns
 */
const COMPLEXITY_PATTERNS = {
  simple: [
    { pattern: /^(what|who|when|where|which)\s/i, weight: -0.3, reason: 'Simple question' },
    { pattern: /^(yes|no|true|false|ok|okay)\b/i, weight: -0.4, reason: 'Binary response' },
    { pattern: /^(hi|hello|hey|thanks|thank you)\b/i, weight: -0.5, reason: 'Greeting/courtesy' },
    { pattern: /\b(define|meaning|translate)\b/i, weight: -0.2, reason: 'Definition request' },
    { pattern: /\b(list|name|show)\b/i, weight: -0.2, reason: 'Simple enumeration' },
  ],
  complex: [
    { pattern: /\b(analyze|evaluate|compare|contrast|critique)\b/i, weight: 0.3, reason: 'Analytical request' },
    { pattern: /\b(explain|describe|elaborate)\b.*\b(detail|depth|comprehensive)\b/i, weight: 0.3, reason: 'Detailed explanation' },
    { pattern: /\b(code|program|implement|algorithm)\b/i, weight: 0.2, reason: 'Programming task' },
    { pattern: /\b(strategy|plan|design|architect)\b/i, weight: 0.3, reason: 'Complex planning' },
    { pattern: /\b(why|how come|reasoning|rationale)\b/i, weight: 0.2, reason: 'Deep reasoning' },
    { pattern: /\?.*\?/g, weight: 0.1, reason: 'Multiple questions' },
  ],
}

/**
 * Estimate token count
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Analyze query complexity
 */
export function analyzeComplexity(query: string, context?: string[]): QueryComplexity {
  let score = 0.5 // Start neutral
  const reasons: string[] = []

  // Length analysis
  const length = query.length
  const tokens = estimateTokens(query)
  
  if (length < 50) {
    score -= 0.1
    reasons.push('Short query')
  } else if (length > 200) {
    score += 0.1
    reasons.push('Long query')
  }

  // Context analysis
  if (context && context.length > 10) {
    score += 0.15
    reasons.push('Large context history')
  }

  // Pattern matching
  for (const { pattern, weight, reason } of COMPLEXITY_PATTERNS.simple) {
    if (pattern.test(query)) {
      score += weight
      reasons.push(reason)
    }
  }

  for (const { pattern, weight, reason } of COMPLEXITY_PATTERNS.complex) {
    if (pattern.test(query)) {
      score += weight
      reasons.push(reason)
    }
  }

  // Technical indicators
  if (/```[\s\S]*```/.test(query)) {
    score += 0.2
    reasons.push('Contains code blocks')
  }

  if (/\d{3,}/.test(query)) {
    score += 0.1
    reasons.push('Contains numbers/data')
  }

  // Normalize score to 0-1
  score = Math.max(0, Math.min(1, score))

  // Determine level
  let level: 'simple' | 'medium' | 'complex'
  if (score < 0.33) {
    level = 'simple'
  } else if (score < 0.66) {
    level = 'medium'
  } else {
    level = 'complex'
  }

  return {
    score,
    level,
    reasons: reasons.length > 0 ? reasons : ['Standard query'],
    estimatedTokens: tokens,
  }
}

/**
 * Route query to appropriate model
 */
export function routeQuery(
  query: string,
  options: {
    availableModels?: RouteModelConfig[]
    context?: string[]
    preferProvider?: string
    maxCost?: number
    forceModel?: string
  } = {}
): RoutingDecision {
  const {
    availableModels = COMMON_MODELS,
    context,
    preferProvider,
    maxCost,
    forceModel,
  } = options

  // Analyze complexity
  const complexity = analyzeComplexity(query, context)

  // Filter models
  let models = availableModels

  if (preferProvider) {
    models = models.filter((m) => m.provider === preferProvider)
  }

  if (forceModel) {
    const forced = models.find((m) => m.id === forceModel)
    if (forced) {
      const estimatedCost =
        (complexity.estimatedTokens * forced.inputCost) +
        (complexity.estimatedTokens * 2 * forced.outputCost) // Assume 2x output

      return {
        model: forced,
        complexity,
        estimatedCost,
        savingsPercent: 0,
        reasoning: 'Forced model selection',
      }
    }
  }

  // Select model based on complexity
  const targetTier = 
    complexity.level === 'simple' ? 'simple' :
    complexity.level === 'medium' ? 'standard' :
    'advanced'

  // Find best model in target tier
  let selectedModel = models
    .filter((m) => m.tier === targetTier)
    .sort((a, b) => a.inputCost - b.inputCost)[0]

  // Fallback to any available model
  if (!selectedModel) {
    selectedModel = models.sort((a, b) => a.inputCost - b.inputCost)[0]
  }

  // Check max cost constraint
  if (maxCost) {
    const cheaperModels = models
      .filter((m) => m.inputCost <= maxCost)
      .sort((a, b) => b.tier.localeCompare(a.tier)) // Prefer higher tier within budget
    
    if (cheaperModels.length > 0 && cheaperModels[0]) {
      selectedModel = cheaperModels[0]
    }
  }

  // Ensure we have a model
  if (!selectedModel) {
    throw new Error('No models available for routing')
  }

  // Calculate cost
  const estimatedInputCost = complexity.estimatedTokens * selectedModel.inputCost
  const estimatedOutputCost = (complexity.estimatedTokens * 2) * selectedModel.outputCost // Assume 2x output
  const estimatedCost = estimatedInputCost + estimatedOutputCost

  // Calculate savings vs most expensive model
  const mostExpensive = models.sort((a, b) => b.outputCost - a.outputCost)[0]
  if (!mostExpensive) {
    throw new Error('No models available')
  }
  const maxCostEstimate =
    (complexity.estimatedTokens * mostExpensive.inputCost) +
    (complexity.estimatedTokens * 2 * mostExpensive.outputCost)
  const savingsPercent = ((maxCostEstimate - estimatedCost) / maxCostEstimate) * 100

  // Generate reasoning
  const reasoning = [
    `Query classified as ${complexity.level} complexity (score: ${complexity.score.toFixed(2)})`,
    `Selected ${selectedModel.name} (${selectedModel.tier} tier)`,
    complexity.reasons[0] || 'Standard routing',
    savingsPercent > 0 ? `Saving ${savingsPercent.toFixed(1)}% vs premium model` : 'Using best available model',
  ].join('. ')

  return {
    model: selectedModel,
    complexity,
    estimatedCost,
    savingsPercent: Math.max(0, savingsPercent),
    reasoning,
  }
}

/**
 * Model router with learning
 */
export class ModelRouter {
  private history: {
    query: string
    decision: RoutingDecision
    actualCost?: number
    userSatisfaction?: number
  }[] = []

  constructor(
    private availableModels: RouteModelConfig[] = COMMON_MODELS,
    private options: {
      preferProvider?: string
      maxCost?: number
      learningEnabled?: boolean
    } = {}
  ) {}

  /**
   * Route a query
   */
  route(query: string, context?: string[]): RoutingDecision {
    const decision = routeQuery(query, {
      availableModels: this.availableModels,
      context,
      preferProvider: this.options.preferProvider,
      maxCost: this.options.maxCost,
    })

    this.history.push({
      query,
      decision,
    })

    return decision
  }

  /**
   * Record actual cost and satisfaction for learning
   */
  recordFeedback(index: number, actualCost: number, userSatisfaction: number): void {
    if (this.history[index]) {
      this.history[index].actualCost = actualCost
      this.history[index].userSatisfaction = userSatisfaction
    }
  }

  /**
   * Get routing statistics
   */
  getStats() {
    const totalQueries = this.history.length
    const totalEstimatedCost = this.history.reduce(
      (sum, h) => sum + h.decision.estimatedCost,
      0
    )
    const totalActualCost = this.history.reduce(
      (sum, h) => sum + (h.actualCost || 0),
      0
    )
    const averageSavings = this.history.reduce(
      (sum, h) => sum + h.decision.savingsPercent,
      0
    ) / Math.max(totalQueries, 1)

    const modelUsage = this.history.reduce((acc, h) => {
      const modelId = h.decision.model.id
      acc[modelId] = (acc[modelId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalQueries,
      totalEstimatedCost,
      totalActualCost,
      averageSavings,
      modelUsage,
    }
  }

  /**
   * Get routing history
   */
  getHistory() {
    return [...this.history]
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = []
  }
}
