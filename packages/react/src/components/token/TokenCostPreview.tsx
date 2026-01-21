/**
 * @deprecated Import from '@clarity-chat/token-optimization/react' instead
 * This re-export will be removed in v3.0.0
 *
 * Token Cost Preview - Real-time Cost Estimation Component
 *
 * @example Migration
 * ```typescript
 * // OLD (deprecated)
 * import { TokenCostPreview, useTokenEstimate } from '@clarity-chat/react'
 *
 * // NEW (recommended)
 * import { TokenCostPreview, useTokenEstimate } from '@clarity-chat/token-optimization/react'
 * ```
 */

'use client'

// Re-export everything from token-optimization
export {
  TokenCostPreview,
  useTokenEstimate,
  type TokenCostPreviewProps,
  type UseTokenEstimateOptions,
  type TokenEstimate,
} from '@clarity-chat/token-optimization/react'

// Runtime deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '[Deprecation] TokenCostPreview: Import from @clarity-chat/token-optimization/react instead of @clarity-chat/react. ' +
      'This re-export will be removed in v3.0.0. ' +
      'See migration guide: https://github.com/clarity-ai/token-optimization#migration'
  )
}
