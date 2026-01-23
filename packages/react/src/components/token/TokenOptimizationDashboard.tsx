/**
 * @deprecated Import from '@clarity-chat/token-optimization/react' instead
 * This re-export will be removed in v3.0.0
 *
 * @example Migration
 * ```tsx
 * // Before (deprecated)
 * import { TokenOptimizationDashboard } from '@clarity-chat/react'
 *
 * // After (recommended)
 * import { TokenOptimizationDashboard } from '@clarity-chat/token-optimization/react'
 * ```
 */
export {
  TokenOptimizationDashboard,
  type TokenOptimizationDashboardProps,
  type OptimizationMetrics,
} from '@clarity-chat/token-optimization/react'

// Runtime warning in development
if (process.env['NODE_ENV'] === 'development') {
  console.warn(
    '[Deprecation] TokenOptimizationDashboard: Import from @clarity-chat/token-optimization. ' +
      'This re-export will be removed in v3.0.0'
  )
}
