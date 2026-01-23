/**
 * React Hooks for Token Optimization
 *
 * This module exports React hooks that provide easy-to-use
 * interfaces to the token optimization system.
 *
 * @module hooks
 */

// Simple token counting (recommended starting point)
export { useTokenCount } from './use-token-count'
export type {
  UseTokenCountOptions,
  UseTokenCountReturn,
} from './use-token-count'

export { useTieredCache } from './use-tiered-cache'
export type {
  UseTieredCacheConfig,
  UseTieredCacheReturn,
} from './use-tiered-cache'

export { useModelRouter, RoutingStrategy } from './use-model-router'
export type {
  UseModelRouterConfig,
  UseModelRouterReturn,
  ModelRoutingConfig,
  RoutingOptions,
  RoutingResult,
  RouterStats,
} from './use-model-router'

export {
  useOptimizationPipeline,
  CompressionLevel,
  RoutingStrategy as PipelineRoutingStrategy,
} from './use-optimization-pipeline'
export type {
  OptimizationPipelineConfig,
  PipelineResult,
  PipelineStats,
  UseOptimizationPipelineReturn,
} from './use-optimization-pipeline'

// Unified hook (recommended for most use cases)
export { useTokenOptimization } from './use-token-optimization'
export type {
  UseTokenOptimizationConfig,
  UseTokenOptimizationReturn,
  TokenOptimizationPreset,
} from './use-token-optimization'

// Token budget monitoring (advanced usage tracking)
// New canonical name
export {
  useTokenBudgetTracking,
  type TokenBudgetTrackingReturn,
} from './use-token-budget-tracking'

// Deprecated exports - kept for backward compatibility
export {
  useTokenBudgetMonitor, // @deprecated - use useTokenBudgetTracking
  getStatusColor,
  formatTokenUsage,
  createModelBudgetMonitor,
  isValidBudgetMonitorModel,
  estimateTokenCost,
} from './use-token-budget-monitor'
export type {
  TokenUsageStatus,
  TokenBudgetUsage,
  TokenUsage, // @deprecated - use TokenBudgetUsage
  TrimResult,
  BudgetMessage,
  TokenBudgetConfig,
  TokenBudgetMonitorReturn, // @deprecated - use TokenBudgetTrackingReturn
  BudgetMonitorModel,
  TokenCostEstimate,
  ModelName, // Backward compatibility alias
} from './use-token-budget-monitor'
