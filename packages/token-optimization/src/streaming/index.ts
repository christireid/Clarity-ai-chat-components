/**
 * Streaming Optimization
 *
 * Week 5: Real-time token counting and cost tracking for streaming LLM responses
 *
 * Features:
 * - Incremental token counting as chunks arrive
 * - Real-time cost updates during streaming
 * - Cache warming with partial responses
 * - Budget monitoring for streaming
 * - React hooks for easy integration
 *
 * @module streaming
 */

// ============================================================================
// Streaming Token Counter
// ============================================================================

export {
  StreamingTokenCounter,
  StreamAdapter,
  createStreamingCounter,
} from './streaming-token-counter'

export type {
  StreamingChunk,
  StreamingTokenStats,
  PredictionStrategy,
  StreamingTokenCounterConfig,
} from './streaming-token-counter'

// ============================================================================
// Streaming Cost Tracker
// ============================================================================

export {
  StreamingCostTracker,
  StreamingTracker,
  StreamingBudgetMonitor,
  StreamingRateLimiter,
  createStreamingCostTracker,
} from './streaming-cost-tracker'

export type {
  StreamingModelPricing,
  StreamingCostStats,
  StreamingCostTrackerConfig,
  StreamingBudgetConfig,
} from './streaming-cost-tracker'

// ============================================================================
// Cache Warming
// ============================================================================

export {
  CacheWarmer,
  StreamingPrefetcher,
  createCacheWarmer,
} from './cache-warming'

export type {
  StreamingCacheEntry,
  CacheWarmingStrategy,
  CacheWarmingConfig,
} from './cache-warming'
