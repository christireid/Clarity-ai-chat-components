/**
 * Model Pricing and Cost Calculation
 *
 * Up-to-date pricing for LLM models (as of 2025)
 */

import type { ModelName } from './accurate-counter'

export interface ModelPricing {
  /** Cost per 1M input tokens */
  inputCostPer1M: number
  /** Cost per 1M output tokens */
  outputCostPer1M: number
  /** Cost per 1M cached input tokens (if supported) */
  cachedInputCostPer1M?: number
  /** Context window size */
  contextWindow: number
  /** Maximum output tokens */
  maxOutputTokens: number
  /** Provider */
  provider: 'openai' | 'anthropic' | 'google' | 'other'
}

/**
 * Model pricing database (updated for 2025)
 */
export const MODEL_PRICING: Record<ModelName | string, ModelPricing> = {
  // OpenAI GPT-4 family
  'gpt-4': {
    inputCostPer1M: 30.0,
    outputCostPer1M: 60.0,
    contextWindow: 8192,
    maxOutputTokens: 4096,
    provider: 'openai',
  },
  'gpt-4-turbo': {
    inputCostPer1M: 10.0,
    outputCostPer1M: 30.0,
    cachedInputCostPer1M: 5.0,
    contextWindow: 128000,
    maxOutputTokens: 4096,
    provider: 'openai',
  },
  'gpt-4o': {
    inputCostPer1M: 2.5,
    outputCostPer1M: 10.0,
    cachedInputCostPer1M: 1.25,
    contextWindow: 128000,
    maxOutputTokens: 16384,
    provider: 'openai',
  },
  'gpt-3.5-turbo': {
    inputCostPer1M: 0.5,
    outputCostPer1M: 1.5,
    contextWindow: 16385,
    maxOutputTokens: 4096,
    provider: 'openai',
  },

  // Anthropic Claude family
  'claude-3-opus': {
    inputCostPer1M: 15.0,
    outputCostPer1M: 75.0,
    cachedInputCostPer1M: 1.5,
    contextWindow: 200000,
    maxOutputTokens: 4096,
    provider: 'anthropic',
  },
  'claude-3-sonnet': {
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
    cachedInputCostPer1M: 0.3,
    contextWindow: 200000,
    maxOutputTokens: 4096,
    provider: 'anthropic',
  },
  'claude-3-5-sonnet': {
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
    cachedInputCostPer1M: 0.3,
    contextWindow: 200000,
    maxOutputTokens: 8192,
    provider: 'anthropic',
  },
  'claude-3-haiku': {
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25,
    cachedInputCostPer1M: 0.03,
    contextWindow: 200000,
    maxOutputTokens: 4096,
    provider: 'anthropic',
  },

  // Google Gemini family
  'gemini-pro': {
    inputCostPer1M: 0.5,
    outputCostPer1M: 1.5,
    contextWindow: 32760,
    maxOutputTokens: 8192,
    provider: 'google',
  },
  'gemini-1.5-pro': {
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.0,
    cachedInputCostPer1M: 0.31,
    contextWindow: 2097152, // 2M tokens!
    maxOutputTokens: 8192,
    provider: 'google',
  },
}

export interface CostCalculation {
  /** Input cost in dollars */
  inputCost: number
  /** Output cost in dollars */
  outputCost: number
  /** Cached input cost in dollars (if applicable) */
  cachedInputCost?: number
  /** Total cost in dollars */
  totalCost: number
  /** Model used */
  model: string
  /** Breakdown */
  breakdown: {
    inputTokens: number
    outputTokens: number
    cachedInputTokens?: number
  }
}

/**
 * Calculate cost for a given number of tokens
 *
 * @example
 * ```ts
 * const cost = calculateCost({
 *   model: 'gpt-4',
 *   inputTokens: 1000,
 *   outputTokens: 500
 * })
 * console.log(cost.totalCost) // $0.06
 * ```
 */
export function calculateCost(params: {
  model: ModelName | string
  inputTokens: number
  outputTokens: number
  cachedInputTokens?: number
}): CostCalculation {
  const { model, inputTokens, outputTokens, cachedInputTokens = 0 } = params

  const pricing = MODEL_PRICING[model]
  if (!pricing) {
    throw new Error(`Unknown model: ${model}`)
  }

  const inputCost = (inputTokens / 1_000_000) * pricing.inputCostPer1M
  const outputCost = (outputTokens / 1_000_000) * pricing.outputCostPer1M

  let cachedInputCost = 0
  if (cachedInputTokens > 0 && pricing.cachedInputCostPer1M) {
    cachedInputCost = (cachedInputTokens / 1_000_000) * pricing.cachedInputCostPer1M
  }

  return {
    inputCost,
    outputCost,
    cachedInputCost: cachedInputTokens > 0 ? cachedInputCost : undefined,
    totalCost: inputCost + outputCost + cachedInputCost,
    model,
    breakdown: {
      inputTokens,
      outputTokens,
      cachedInputTokens: cachedInputTokens > 0 ? cachedInputTokens : undefined,
    },
  }
}

/**
 * Calculate potential savings from caching
 */
export function calculateCacheSavings(params: {
  model: ModelName | string
  inputTokens: number
  cacheHitRate: number // 0-1
}): {
  withoutCache: number
  withCache: number
  savings: number
  savingsPercent: number
} {
  const { model, inputTokens, cacheHitRate } = params

  const pricing = MODEL_PRICING[model]
  if (!pricing || !pricing.cachedInputCostPer1M) {
    return {
      withoutCache: 0,
      withCache: 0,
      savings: 0,
      savingsPercent: 0,
    }
  }

  const cachedTokens = Math.floor(inputTokens * cacheHitRate)
  const uncachedTokens = inputTokens - cachedTokens

  const withoutCache = (inputTokens / 1_000_000) * pricing.inputCostPer1M
  const withCache =
    (uncachedTokens / 1_000_000) * pricing.inputCostPer1M +
    (cachedTokens / 1_000_000) * pricing.cachedInputCostPer1M

  const savings = withoutCache - withCache
  const savingsPercent = withoutCache > 0 ? (savings / withoutCache) * 100 : 0

  return {
    withoutCache,
    withCache,
    savings,
    savingsPercent,
  }
}

/**
 * Estimate cost for a conversation
 */
export function estimateConversationCost(params: {
  model: ModelName | string
  averageInputTokens: number
  averageOutputTokens: number
  messagesPerDay: number
  daysPerMonth?: number
}): {
  costPerMessage: number
  costPerDay: number
  costPerMonth: number
} {
  const { model, averageInputTokens, averageOutputTokens, messagesPerDay, daysPerMonth = 30 } = params

  const costPerMessage = calculateCost({
    model,
    inputTokens: averageInputTokens,
    outputTokens: averageOutputTokens,
  }).totalCost

  const costPerDay = costPerMessage * messagesPerDay
  const costPerMonth = costPerDay * daysPerMonth

  return {
    costPerMessage,
    costPerDay,
    costPerMonth,
  }
}

/**
 * Compare costs across models
 */
export function compareModelCosts(params: {
  models: (ModelName | string)[]
  inputTokens: number
  outputTokens: number
}): Array<{
  model: string
  cost: number
  savings: number
  savingsPercent: number
  pricing: ModelPricing
}> {
  const { models, inputTokens, outputTokens } = params

  const results = models.map(model => {
    const cost = calculateCost({ model, inputTokens, outputTokens })
    return {
      model,
      cost: cost.totalCost,
      pricing: MODEL_PRICING[model]!,
    }
  })

  // Sort by cost (ascending)
  results.sort((a, b) => a.cost - b.cost)

  // Calculate savings relative to most expensive
  const maxCost = Math.max(...results.map(r => r.cost))

  return results.map(r => ({
    model: r.model,
    cost: r.cost,
    savings: maxCost - r.cost,
    savingsPercent: maxCost > 0 ? ((maxCost - r.cost) / maxCost) * 100 : 0,
    pricing: r.pricing,
  }))
}

/**
 * Get recommended model based on budget and requirements
 */
export function recommendModel(params: {
  inputTokens: number
  outputTokens: number
  maxCostPerRequest?: number
  minContextWindow?: number
  providers?: Array<'openai' | 'anthropic' | 'google' | 'other'>
}): {
  recommended: string
  alternatives: string[]
  reasoning: string
} {
  const {
    inputTokens,
    outputTokens,
    maxCostPerRequest,
    minContextWindow = 8000,
    providers,
  } = params

  // Filter models by requirements
  let candidateModels = Object.entries(MODEL_PRICING).filter(([_, pricing]) => {
    if (minContextWindow && pricing.contextWindow < minContextWindow) return false
    if (providers && !providers.includes(pricing.provider)) return false
    return true
  })

  // Calculate costs and filter by budget
  const modelsWithCosts = candidateModels
    .map(([model, pricing]) => {
      const cost = calculateCost({ model, inputTokens, outputTokens })
      return { model, cost: cost.totalCost, pricing }
    })
    .filter(m => !maxCostPerRequest || m.cost <= maxCostPerRequest)
    .sort((a, b) => a.cost - b.cost)

  if (modelsWithCosts.length === 0) {
    return {
      recommended: 'gpt-3.5-turbo',
      alternatives: [],
      reasoning: 'No models match requirements. Using fallback.',
    }
  }

  const recommended = modelsWithCosts[0]!
  const alternatives = modelsWithCosts.slice(1, 4).map(m => m.model)

  return {
    recommended: recommended.model,
    alternatives,
    reasoning: `Cheapest option at $${recommended.cost.toFixed(4)} per request with ${recommended.pricing.contextWindow.toLocaleString()} token context window.`,
  }
}
