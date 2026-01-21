/**
 * Multimodal Cost Estimator
 *
 * Comprehensive cost estimation for multimodal (text + images) LLM requests.
 * Combines text token counting with vision token counting.
 */

import { encode } from 'gpt-tokenizer'
import type { MultimodalMessage, MessageContent } from './multimodal-types'
import { extractText, extractImages, isTextOnly } from './multimodal-types'
import {
  VisionTokenCounter,
  createOpenAIVisionCounter,
  createAnthropicVisionCounter,
  createGoogleVisionCounter,
  type VisionProvider,
  type VisionTokenResult,
  type ImageDetail,
} from './vision-token-counter'

/**
 * Model pricing for multimodal models
 */
export interface MultimodalModelPricing {
  model: string
  provider: VisionProvider
  inputCostPer1M: number
  outputCostPer1M: number
  /** Optional: Different cost for image tokens */
  imageCostPer1M?: number
}

/**
 * Multimodal token count breakdown
 */
export interface MultimodalTokenBreakdown {
  /** Text tokens */
  textTokens: number
  /** Image tokens (all images combined) */
  imageTokens: number
  /** Total input tokens */
  totalInputTokens: number
  /** Estimated output tokens */
  estimatedOutputTokens: number
  /** Total tokens (input + output) */
  totalTokens: number
  /** Per-image breakdown */
  imageBreakdown: VisionTokenResult[]
}

/**
 * Multimodal cost estimate
 */
export interface MultimodalCostEstimate extends MultimodalTokenBreakdown {
  /** Text input cost */
  textCost: number
  /** Image input cost */
  imageCost: number
  /** Total input cost */
  inputCost: number
  /** Output cost (text only) */
  outputCost: number
  /** Total cost */
  totalCost: number
  /** Cost per token (average) */
  costPerToken: number
  /** Model used */
  model: string
  /** Provider */
  provider: VisionProvider
}

/**
 * Configuration for multimodal cost estimator
 */
export interface MultimodalCostEstimatorConfig {
  /** Model pricing */
  pricing: MultimodalModelPricing
  /** Estimated output tokens (default: 500) */
  estimatedOutputTokens?: number
  /** Default image detail for OpenAI (default: 'auto') */
  defaultImageDetail?: ImageDetail
}

/**
 * Multimodal Cost Estimator
 */
export class MultimodalCostEstimator {
  private pricing: MultimodalModelPricing
  private estimatedOutputTokens: number
  private visionCounter: VisionTokenCounter
  private defaultImageDetail: ImageDetail

  constructor(config: MultimodalCostEstimatorConfig) {
    this.pricing = config.pricing
    this.estimatedOutputTokens = config.estimatedOutputTokens ?? 500
    this.defaultImageDetail = config.defaultImageDetail ?? 'auto'

    // Create vision counter for provider
    switch (config.pricing.provider) {
      case 'openai':
        this.visionCounter = createOpenAIVisionCounter(this.defaultImageDetail)
        break
      case 'anthropic':
        this.visionCounter = createAnthropicVisionCounter()
        break
      case 'google':
        this.visionCounter = createGoogleVisionCounter()
        break
      default:
        throw new Error(`Unsupported provider: ${config.pricing.provider}`)
    }
  }

  /**
   * Estimate cost for a single message
   */
  estimateMessage(message: MultimodalMessage): MultimodalCostEstimate {
    // Handle text-only messages
    if (isTextOnly(message)) {
      const text = typeof message.content === 'string' ? message.content : extractText(message)
      const textTokens = this.countTextTokens(text)

      return this.createEstimate(textTokens, [], this.estimatedOutputTokens)
    }

    // Multimodal message
    const text = extractText(message)
    const images = extractImages(message)

    const textTokens = this.countTextTokens(text)
    const imageResults = images.map((img) => {
      // Count image tokens
      if (img.dimensions) {
        return this.visionCounter.count({
          dimensions: img.dimensions,
          detail: img.type === 'image' ? img.detail : img.image_url.detail,
        })
      }

      // If no dimensions provided, estimate based on typical image size
      console.warn('Image dimensions not provided - using estimated dimensions (1024x1024)')
      return this.visionCounter.count({
        dimensions: { width: 1024, height: 1024 },
        detail: img.type === 'image' ? img.detail : img.image_url.detail,
      })
    })

    return this.createEstimate(textTokens, imageResults, this.estimatedOutputTokens)
  }

  /**
   * Estimate cost for multiple messages (conversation)
   */
  estimateConversation(messages: MultimodalMessage[]): MultimodalCostEstimate {
    // Calculate totals across all messages
    let totalTextTokens = 0
    let allImageResults: VisionTokenResult[] = []

    for (const message of messages) {
      if (isTextOnly(message)) {
        const text = typeof message.content === 'string' ? message.content : extractText(message)
        totalTextTokens += this.countTextTokens(text)
      } else {
        const text = extractText(message)
        const images = extractImages(message)

        totalTextTokens += this.countTextTokens(text)

        const imageResults = images.map((img) => {
          if (img.dimensions) {
            return this.visionCounter.count({
              dimensions: img.dimensions,
              detail: img.type === 'image' ? img.detail : img.image_url.detail,
            })
          }

          return this.visionCounter.count({
            dimensions: { width: 1024, height: 1024 },
            detail: img.type === 'image' ? img.detail : img.image_url.detail,
          })
        })

        allImageResults.push(...imageResults)
      }
    }

    return this.createEstimate(totalTextTokens, allImageResults, this.estimatedOutputTokens)
  }

  /**
   * Estimate cost for specific token counts
   */
  estimateFromTokens(
    textTokens: number,
    imageTokens: number,
    outputTokens: number = this.estimatedOutputTokens
  ): MultimodalCostEstimate {
    const totalInputTokens = textTokens + imageTokens

    // Calculate costs
    const textCost = (textTokens / 1_000_000) * this.pricing.inputCostPer1M
    const imageCostPerToken = this.pricing.imageCostPer1M || this.pricing.inputCostPer1M
    const imageCost = (imageTokens / 1_000_000) * imageCostPerToken
    const inputCost = textCost + imageCost

    const outputCost = (outputTokens / 1_000_000) * this.pricing.outputCostPer1M
    const totalCost = inputCost + outputCost

    const totalTokens = totalInputTokens + outputTokens
    const costPerToken = totalTokens > 0 ? totalCost / totalTokens : 0

    return {
      textTokens,
      imageTokens,
      totalInputTokens,
      estimatedOutputTokens: outputTokens,
      totalTokens,
      imageBreakdown: [],
      textCost,
      imageCost,
      inputCost,
      outputCost,
      totalCost,
      costPerToken,
      model: this.pricing.model,
      provider: this.pricing.provider,
    }
  }

  /**
   * Update pricing
   */
  setPricing(pricing: MultimodalModelPricing): void {
    this.pricing = pricing

    // Update vision counter if provider changed
    if (pricing.provider !== this.pricing.provider) {
      switch (pricing.provider) {
        case 'openai':
          this.visionCounter = createOpenAIVisionCounter(this.defaultImageDetail)
          break
        case 'anthropic':
          this.visionCounter = createAnthropicVisionCounter()
          break
        case 'google':
          this.visionCounter = createGoogleVisionCounter()
          break
      }
    }
  }

  /**
   * Update estimated output tokens
   */
  setEstimatedOutputTokens(tokens: number): void {
    this.estimatedOutputTokens = tokens
  }

  // ============================================================================
  // Private Helpers
  // ============================================================================

  private countTextTokens(text: string): number {
    if (!text || text.length === 0) return 0

    try {
      return encode(text).length
    } catch (error) {
      // Fallback: rough estimation (1 token ≈ 4 characters)
      return Math.ceil(text.length / 4)
    }
  }

  private createEstimate(
    textTokens: number,
    imageResults: VisionTokenResult[],
    outputTokens: number
  ): MultimodalCostEstimate {
    const imageTokens = imageResults.reduce((sum, result) => sum + result.tokens, 0)
    const totalInputTokens = textTokens + imageTokens

    // Calculate costs
    const textCost = (textTokens / 1_000_000) * this.pricing.inputCostPer1M
    const imageCostPerToken = this.pricing.imageCostPer1M || this.pricing.inputCostPer1M
    const imageCost = (imageTokens / 1_000_000) * imageCostPerToken
    const inputCost = textCost + imageCost

    const outputCost = (outputTokens / 1_000_000) * this.pricing.outputCostPer1M
    const totalCost = inputCost + outputCost

    const totalTokens = totalInputTokens + outputTokens
    const costPerToken = totalTokens > 0 ? totalCost / totalTokens : 0

    return {
      textTokens,
      imageTokens,
      totalInputTokens,
      estimatedOutputTokens: outputTokens,
      totalTokens,
      imageBreakdown: imageResults,
      textCost,
      imageCost,
      inputCost,
      outputCost,
      totalCost,
      costPerToken,
      model: this.pricing.model,
      provider: this.pricing.provider,
    }
  }
}

// ============================================================================
// Model Pricing Presets
// ============================================================================

/**
 * Predefined pricing for popular multimodal models (January 2025)
 */
export const MULTIMODAL_MODEL_PRICING: Record<string, MultimodalModelPricing> = {
  // OpenAI
  'gpt-4o': {
    model: 'gpt-4o',
    provider: 'openai',
    inputCostPer1M: 2.5,
    outputCostPer1M: 10,
  },
  'gpt-4o-mini': {
    model: 'gpt-4o-mini',
    provider: 'openai',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
  },
  'gpt-4-turbo': {
    model: 'gpt-4-turbo',
    provider: 'openai',
    inputCostPer1M: 10,
    outputCostPer1M: 30,
  },

  // Anthropic
  'claude-3-5-sonnet': {
    model: 'claude-3-5-sonnet-20241022',
    provider: 'anthropic',
    inputCostPer1M: 3,
    outputCostPer1M: 15,
  },
  'claude-3-5-haiku': {
    model: 'claude-3-5-haiku-20241022',
    provider: 'anthropic',
    inputCostPer1M: 0.8,
    outputCostPer1M: 4,
  },
  'claude-3-opus': {
    model: 'claude-3-opus-20240229',
    provider: 'anthropic',
    inputCostPer1M: 15,
    outputCostPer1M: 75,
  },
  'claude-sonnet-4': {
    model: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    inputCostPer1M: 3,
    outputCostPer1M: 15,
  },
  'claude-opus-4': {
    model: 'claude-opus-4-20250514',
    provider: 'anthropic',
    inputCostPer1M: 15,
    outputCostPer1M: 75,
  },

  // Google
  'gemini-pro': {
    model: 'gemini-1.5-pro',
    provider: 'google',
    inputCostPer1M: 1.25,
    outputCostPer1M: 5,
  },
  'gemini-flash': {
    model: 'gemini-1.5-flash',
    provider: 'google',
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.3,
  },
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create estimator for OpenAI GPT-4o
 */
export function createGPT4oEstimator(
  estimatedOutputTokens = 500
): MultimodalCostEstimator {
  return new MultimodalCostEstimator({
    pricing: MULTIMODAL_MODEL_PRICING['gpt-4o'],
    estimatedOutputTokens,
  })
}

/**
 * Create estimator for OpenAI GPT-4o-mini
 */
export function createGPT4oMiniEstimator(
  estimatedOutputTokens = 500
): MultimodalCostEstimator {
  return new MultimodalCostEstimator({
    pricing: MULTIMODAL_MODEL_PRICING['gpt-4o-mini'],
    estimatedOutputTokens,
  })
}

/**
 * Create estimator for Anthropic Claude 3.5 Sonnet
 */
export function createClaude35SonnetEstimator(
  estimatedOutputTokens = 500
): MultimodalCostEstimator {
  return new MultimodalCostEstimator({
    pricing: MULTIMODAL_MODEL_PRICING['claude-3-5-sonnet'],
    estimatedOutputTokens,
  })
}

/**
 * Create estimator for Anthropic Claude 3.5 Haiku
 */
export function createClaude35HaikuEstimator(
  estimatedOutputTokens = 500
): MultimodalCostEstimator {
  return new MultimodalCostEstimator({
    pricing: MULTIMODAL_MODEL_PRICING['claude-3-5-haiku'],
    estimatedOutputTokens,
  })
}

/**
 * Create estimator for Google Gemini Pro
 */
export function createGeminiProEstimator(
  estimatedOutputTokens = 500
): MultimodalCostEstimator {
  return new MultimodalCostEstimator({
    pricing: MULTIMODAL_MODEL_PRICING['gemini-pro'],
    estimatedOutputTokens,
  })
}

/**
 * Create estimator for Google Gemini Flash
 */
export function createGeminiFlashEstimator(
  estimatedOutputTokens = 500
): MultimodalCostEstimator {
  return new MultimodalCostEstimator({
    pricing: MULTIMODAL_MODEL_PRICING['gemini-flash'],
    estimatedOutputTokens,
  })
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Compare costs across providers for same input
 */
export function compareMultimodalProviders(
  message: MultimodalMessage,
  estimatedOutputTokens = 500
): Record<string, MultimodalCostEstimate> {
  const results: Record<string, MultimodalCostEstimate> = {}

  // OpenAI
  const gpt4o = createGPT4oEstimator(estimatedOutputTokens)
  results['gpt-4o'] = gpt4o.estimateMessage(message)

  const gpt4oMini = createGPT4oMiniEstimator(estimatedOutputTokens)
  results['gpt-4o-mini'] = gpt4oMini.estimateMessage(message)

  // Anthropic
  const claude35Sonnet = createClaude35SonnetEstimator(estimatedOutputTokens)
  results['claude-3-5-sonnet'] = claude35Sonnet.estimateMessage(message)

  const claude35Haiku = createClaude35HaikuEstimator(estimatedOutputTokens)
  results['claude-3-5-haiku'] = claude35Haiku.estimateMessage(message)

  // Google
  const geminiPro = createGeminiProEstimator(estimatedOutputTokens)
  results['gemini-pro'] = geminiPro.estimateMessage(message)

  const geminiFlash = createGeminiFlashEstimator(estimatedOutputTokens)
  results['gemini-flash'] = geminiFlash.estimateMessage(message)

  return results
}

/**
 * Find cheapest model for given input
 */
export function findCheapestModel(
  message: MultimodalMessage,
  estimatedOutputTokens = 500
): {
  model: string
  estimate: MultimodalCostEstimate
  savingsVsExpensive: number
} {
  const comparison = compareMultimodalProviders(message, estimatedOutputTokens)

  let cheapest: { model: string; estimate: MultimodalCostEstimate } | null = null
  let mostExpensive = 0

  for (const [model, estimate] of Object.entries(comparison)) {
    if (!cheapest || estimate.totalCost < cheapest.estimate.totalCost) {
      cheapest = { model, estimate }
    }
    if (estimate.totalCost > mostExpensive) {
      mostExpensive = estimate.totalCost
    }
  }

  if (!cheapest) {
    throw new Error('No models to compare')
  }

  const savingsVsExpensive =
    mostExpensive > 0 ? (mostExpensive - cheapest.estimate.totalCost) / mostExpensive : 0

  return {
    model: cheapest.model,
    estimate: cheapest.estimate,
    savingsVsExpensive,
  }
}
