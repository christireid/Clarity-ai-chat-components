/**
 * @deprecated Import from '@clarity-chat/token-optimization' instead
 * This re-export will be removed in v3.0.0
 *
 * Model Pricing - Re-exported from token-optimization package
 *
 * @example Migration
 * ```typescript
 * // OLD (deprecated)
 * import { MODEL_PRICING, calculateCost } from '@clarity-chat/react'
 *
 * // NEW (recommended)
 * import { MODEL_PRICING, calculateCost } from '@clarity-chat/token-optimization'
 * ```
 */

// Re-export everything from token-optimization
export {
  MODEL_PRICING,
  calculateCost,
  calculateCacheSavings,
  estimateConversationCost,
  compareModelCosts,
  recommendModel,
  getModelPricing,
  modelSupportsCaching,
  getModelsWithCaching,
  type PricingProvider,
  type ModelPricing,
  type CostCalculation,
} from '@clarity-chat/token-optimization'

// Backwards compatibility: Re-export ModelId as ModelName for existing code
export type { ModelId as ModelName } from '@clarity-chat/token-optimization'

// Runtime deprecation warning in development
if (process.env['NODE_ENV'] === 'development') {
  console.warn(
    '[Deprecation] model-pricing: Import from @clarity-chat/token-optimization instead of @clarity-chat/react. ' +
      'This re-export will be removed in v3.0.0. ' +
      'See migration guide: https://github.com/clarity-ai/token-optimization#migration'
  )
}
