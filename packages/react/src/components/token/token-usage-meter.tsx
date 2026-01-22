/**
 * @deprecated Import from '@clarity-chat/token-optimization/react' instead
 * This re-export will be removed in v3.0.0
 *
 * Token Usage Meter - Real-time Token Display Component
 *
 * @example Migration
 * ```typescript
 * // OLD (deprecated)
 * import { TokenUsageMeter } from '@clarity-chat/react'
 *
 * // NEW (recommended - animated version)
 * import { TokenUsageMeter } from '@clarity-chat/token-optimization/react'
 *
 * // NEW (static version without framer-motion)
 * import { TokenUsageMeterStatic as TokenUsageMeter } from '@clarity-chat/token-optimization/react'
 * ```
 */

'use client'

// Re-export everything from token-optimization
export {
  TokenUsageMeter,
  MODEL_PRICING_PRESETS,
  type TokenUsage,
  type ModelPricing,
  type TokenUsageMeterProps,
} from '@clarity-chat/token-optimization/react'

// Runtime deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '[Deprecation] TokenUsageMeter: Import from @clarity-chat/token-optimization/react instead of @clarity-chat/react. ' +
      'This re-export will be removed in v3.0.0. ' +
      'For projects without framer-motion, use TokenUsageMeterStatic. ' +
      'See migration guide: https://github.com/clarity-ai/token-optimization#migration'
  )
}
