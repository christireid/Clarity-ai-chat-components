/**
 * ClarityTokens React Hooks
 *
 * AI Token Optimization hooks for React applications.
 * Provides 80%+ cost reduction through caching, compression,
 * and context management.
 *
 * @packageDocumentation
 * @module @clarity-chat/react/hooks/clarity-tokens
 */

// =============================================================================
// P0 Hooks - Foundation
// =============================================================================

export { useTokenCounter } from './use-token-counter'
export { useCostEstimator } from './use-cost-estimator'
export { useContextWindow } from './use-context-window'
export { useResponseCache } from './use-response-cache'

// =============================================================================
// P1 Hooks - Core Optimization
// =============================================================================

export { useSemanticCache } from './use-semantic-cache'
export { useEmbeddingCache } from './use-embedding-cache'
export { usePromptCompressor } from './use-prompt-compressor'
export { useStreamOptimizer } from './use-stream-optimizer'

// =============================================================================
// P2 Hooks - Advanced Features
// =============================================================================

export { useTokenThrottle } from './use-token-throttle'

// =============================================================================
// Type Exports
// =============================================================================

export type {
  // useTokenCounter types
  UseTokenCounterConfig,
  UseTokenCounterReturn,

  // useCostEstimator types
  UseCostEstimatorConfig,
  UseCostEstimatorReturn,

  // useContextWindow types
  UseContextWindowConfig,
  UseContextWindowReturn,
  ContextWindowState,
  ContextStrategy,

  // useResponseCache types
  UseResponseCacheConfig,
  UseResponseCacheReturn,
  CachedResponse,

  // useSemanticCache types
  UseSemanticCacheConfig,
  UseSemanticCacheReturn,

  // useEmbeddingCache types
  UseEmbeddingCacheConfig,
  UseEmbeddingCacheReturn,

  // usePromptCompressor types
  UsePromptCompressorConfig,
  UsePromptCompressorReturn,

  // useStreamOptimizer types
  UseStreamOptimizerConfig,
  UseStreamOptimizerReturn,
  StreamBufferStrategy,

  // useTokenThrottle types
  UseTokenThrottleConfig,
  UseTokenThrottleReturn,

  // Shared types
  ScoredMessage,
  BudgetAllocation,
  TokenOptimizationProviderConfig,
  TokenOptimizationContextValue,
} from './types'
