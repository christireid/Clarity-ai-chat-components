/**
 * @deprecated Import from '@clarity-chat/token-optimization' instead
 * This re-export will be removed in v3.0.0
 *
 * Token Budget Monitor Hook - Re-exported from token-optimization package
 *
 * @example Migration
 * ```typescript
 * // OLD (deprecated)
 * import { useTokenBudgetMonitor } from '@clarity-chat/react'
 *
 * // NEW (recommended)
 * import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'
 * ```
 */

'use client'

// Re-export everything from token-optimization
export {
  useTokenBudgetMonitor,
  getStatusColor,
  formatTokenUsage,
  createModelBudgetMonitor,
  isValidBudgetMonitorModel,
  estimateTokenCost,
  type TokenUsageStatus,
  type TokenUsage,
  type TrimResult,
  type BudgetMessage,
  type TokenBudgetConfig,
  type TokenBudgetMonitorReturn,
  type BudgetMonitorModel,
  type TokenCostEstimate,
  type ModelName,
} from '@clarity-chat/token-optimization'

// Runtime deprecation warning in development
if (process.env['NODE_ENV'] === 'development') {
  console.warn(
    '[Deprecation] useTokenBudgetMonitor: Import from @clarity-chat/token-optimization instead of @clarity-chat/react. ' +
      'This re-export will be removed in v3.0.0. ' +
      'See migration guide: https://github.com/clarity-ai/token-optimization#migration'
  )
}
