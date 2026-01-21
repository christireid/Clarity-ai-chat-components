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
  ModelConfig,
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
export {
  useTokenBudgetMonitor,
  getStatusColor,
  formatTokenUsage,
  createModelBudgetMonitor,
  isValidBudgetMonitorModel,
  estimateTokenCost,
} from './use-token-budget-monitor'
export type {
  TokenUsageStatus,
  TokenUsage,
  TrimResult,
  BudgetMessage,
  TokenBudgetConfig,
  TokenBudgetMonitorReturn,
  BudgetMonitorModel,
  TokenCostEstimate,
  ModelName, // Backward compatibility alias
} from './use-token-budget-monitor'

// ============================================================================
// Enhanced Hooks (Week 3) - Production-ready optimization hooks
// ============================================================================

// Context window management with conversation memory strategies
export {
  useContextWindow,
  useContextWindowStatus,
} from './use-context-window'
export type {
  UseContextWindowConfig,
  UseContextWindowReturn,
  ContextWindowStrategy,
  ContextWindowStatus,
} from './use-context-window'

// Quality-based routing with cascading model selection
export {
  useQualityRouter,
  useQualityRouterMetrics,
} from './use-quality-router'
export type {
  UseQualityRouterConfig,
  UseQualityRouterReturn,
  GenerateFunction,
  RouterProvider,
  QualityRouterMetrics,
  UseOptimizedChatConfig,
  UseOptimizedChatReturn,
  ConversationMessage,
} from './use-quality-router'

// Real-time cache performance monitoring
export {
  useCacheStats,
  useCacheComparison,
  getPerformanceColor,
} from './use-cache-stats'
export type {
  UseCacheStatsConfig,
  UseCacheStatsReturn,
  CacheStatistics,
  CachePerformanceMetrics,
  CacheComparison,
} from './use-cache-stats'

// Cost estimation, tracking, and budget monitoring
export {
  useEstimateCost,
  useCumulativeCost,
  useBudgetAlerts,
  MODEL_PRICING_PRESETS,
} from './use-estimate-cost'
export type {
  UseEstimateCostConfig,
  UseEstimateCostReturn,
  ModelPricing,
  CostEstimate,
  CostBreakdown,
  CostHistoryEntry,
  UseCumulativeCostReturn,
  BudgetAlert,
  UseBudgetAlertsConfig,
  UseBudgetAlertsReturn,
} from './use-estimate-cost'

// ============================================================================
// Streaming Hooks (Week 5) - Real-time optimization for streaming responses
// ============================================================================

// Comprehensive streaming optimization
export {
  useStreamingOptimization,
  useStreamingTokens,
  useStreamingCost,
} from './use-streaming-optimization'
export type {
  UseStreamingOptimizationConfig,
  StreamingState,
} from './use-streaming-optimization'
