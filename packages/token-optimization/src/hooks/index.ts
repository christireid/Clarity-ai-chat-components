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
