/**
 * Token Hooks
 *
 * Hooks for token optimization, tracking, and budget management.
 *
 * Note: Modern token optimization hooks have moved to clarity-tokens.
 * Import from '@clarity-chat/react/hooks/clarity-tokens' for the latest versions.
 */

// Legacy exports removed - use clarity-tokens instead:
// - useTokenOptimization -> import from 'hooks/clarity-tokens'
// - useTokenOptimization -> use useTokenOptimization from 'hooks/clarity-tokens'

export * from './use-token-tracker'

export {
  useTokenBudgetMonitor,
  getStatusColor,
  formatTokenUsage,
  createModelBudgetMonitor,
  type TokenBudgetConfig,
  type TokenBudgetMonitorReturn,
  type TokenUsage,
  type TokenUsageStatus,
  type TrimResult,
  type BudgetMessage,
  type BudgetMonitorModel,
} from './use-token-budget-monitor'

export {
  useTokenCounter,
  getEncodingForModel,
  preloadEncoding,
  type TokenEncoding,
  type UseTokenCounterOptions,
  type UseTokenCounterReturn,
} from './useTokenCounter'
