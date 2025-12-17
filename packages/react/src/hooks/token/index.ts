/**
 * Token Hooks
 *
 * Hooks for token optimization, tracking, and budget management.
 */

export {
  useTokenOptimization,
  type UseTokenOptimizationOptions,
  type UseTokenOptimizationReturn,
  type TokenOptimizationStats,
} from './use-token-optimization'

export {
  useTokenOptimizationEnhanced,
  type EnhancedTokenOptimizationOptions,
  type EnhancedOptimizationStats,
  type EnhancedOptimizationResult,
} from './use-token-optimization-enhanced'

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
