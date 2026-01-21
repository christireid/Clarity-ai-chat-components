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
// Core Pipeline & Types
// =============================================================================

export {
  // Pipeline
  createPipeline,
  createNamedPipeline,
  // Built-in middlewares
  requestIdMiddleware,
  tokenCountMiddleware,
  budgetGuardMiddleware,
  exactCacheMiddleware,
  semanticCacheMiddleware,
  costTrackingMiddleware,
  compressionMiddleware,
  retrievalMiddleware,
  routingMiddleware,
  // Telemetry
  composeTelemetry,
  consoleLogger,
  noopTelemetry,
  // Errors
  TokenizerUnavailableError,
  BudgetExceededError as CoreBudgetExceededError,
  SummarizationFailedError as CoreSummarizationFailedError,
  CompressionFailedError,
  CacheCorruptError as CoreCacheCorruptError,
  EmbeddingFailedError as CoreEmbeddingFailedError,
  VectorIndexError,
  RetrieverError as CoreRetrieverError,
  ContextInjectionError as CoreContextInjectionError,
  ThrottleQueueFullError,
  PricingMissingError as CorePricingMissingError,
  InvalidRouteError,
  ProviderError,
} from './pipeline'

export type {
  // Request/Response
  Role,
  ChatMessage as ClarityTokensChatMessage,
  Provider,
  LLMRequest,
  LLMResponse,
  TokenUsage as ClarityTokensTokenUsage,
  CacheInfo,
  // Middleware
  Middleware,
  NamedMiddleware,
  // Tokenizer
  TokenizerEncoding as CoreTokenizerEncoding,
  TokenCounter,
  // Cache & Storage
  CacheStore,
  VectorIndex,
  // Retrieval
  RetrievedChunk as CoreRetrievedChunk,
  Retriever,
  // Adapter
  ProviderAdapter,
  AdapterConfig,
  // Telemetry
  TelemetryEventType,
  TelemetryEvent,
  TelemetryHandler,
} from './pipeline'

// =============================================================================
// Provider Adapters
// =============================================================================

export { createOpenAIAdapter, createAnthropicAdapter } from './adapters'
export type { OpenAIAdapterConfig, AnthropicAdapterConfig } from './adapters'

// =============================================================================
// P0 Hooks - Foundation
// =============================================================================

export { useTokenCounter } from './use-token-counter'
export {
  useLazyTokenCounter,
  preloadTokenizer,
  isTokenizerLoaded,
  getLoadedModel,
  destroySharedTokenCounter,
} from './use-lazy-token-counter'
export { useCostEstimator } from './use-cost-estimator'
export { useContextWindow } from './use-context-window'
export { useResponseCache } from './use-response-cache'

// =============================================================================
// Unified Token Optimization Hook
// =============================================================================

export { useTokenOptimization } from './use-token-optimization'

// =============================================================================
// P1 Hooks - Core Optimization
// =============================================================================

export { useSemanticCache } from './use-semantic-cache'
export { useEmbeddingCache } from './use-embedding-cache'
export { usePromptCompressor } from './use-prompt-compressor'
export { useStreamOptimizer } from './use-stream-optimizer'
export {
  useExactCache,
  createInMemoryStore,
  createIndexedDBStore,
} from './use-exact-cache'

// =============================================================================
// P2 Hooks - Advanced Features
// =============================================================================

export { useTokenThrottle } from './use-token-throttle'
export { useTokenLimitGuard } from './use-token-limit-guard'
export { useTokenBudget } from './use-token-budget'
export { useVectorSearch } from './use-vector-search'
export { useContextInjector } from './use-context-injector'
export {
  useAdaptiveModel,
  createSizeBasedRule,
  createContentBasedRule,
  createTierBasedRule,
  createIntentBasedRule,
  createCostOptimizedRule,
  createLatencyBasedRule,
} from './use-adaptive-model'
export { useCostTracker } from './use-cost-tracker'

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
  CostEstimate,
  CostTracking,
  CacheStats,
  CompressionStrategy,
  CompressionResult,
  EmbeddingResult,
  VectorSearchResult,
  ThrottleState,
  StreamState,
  StreamMetrics,
  OptimizationLevel,
  GlobalOptimizationStats,
  ModelIdentifier,
  TokenEncoding,
  // Note: ChatMessage is not re-exported here to avoid conflict with ./hooks/chat
  // Use ClarityTokensChatMessage from pipeline types instead
  ModelId,
  TokenizerEncoding,
} from './types'

// useTokenLimitGuard types
export type {
  UseTokenLimitGuardConfig,
  UseTokenLimitGuardReturn,
  GuardPolicy,
  GuardResult,
} from './use-token-limit-guard'

// useTokenBudget types
export type {
  UseTokenBudgetConfig,
  UseTokenBudgetReturn,
  TokenUsageRecord,
  BudgetStatus,
} from './use-token-budget'

// useExactCache types
export type {
  UseExactCacheConfig,
  UseExactCacheReturn,
  CacheStore as ExactCacheStore,
  LLMRequest as ExactCacheLLMRequest,
  LLMResponse as ExactCacheLLMResponse,
} from './use-exact-cache'

// useVectorSearch types
export type {
  UseVectorSearchConfig,
  UseVectorSearchReturn,
  RetrievedChunk,
  Retriever as VectorRetriever,
  SearchResult,
} from './use-vector-search'

// useContextInjector types
export type {
  UseContextInjectorConfig,
  UseContextInjectorReturn,
  ContextPlacement,
  InjectionResult,
} from './use-context-injector'

// useAdaptiveModel types
export type {
  UseAdaptiveModelConfig,
  UseAdaptiveModelReturn,
  RouteResult,
  RoutingRule,
  RoutingDecision,
} from './use-adaptive-model'

// useCostTracker types
export type {
  UseCostTrackerConfig,
  UseCostTrackerReturn,
  ModelPricing,
  CostEntry,
  CostTotals,
} from './use-cost-tracker'

// useLazyTokenCounter types
export type {
  UseLazyTokenCounterConfig,
  UseLazyTokenCounterReturn,
  LazyTokenCounterState,
} from './use-lazy-token-counter'

// useContextWindow compression types
export type {
  CompressionStrategyType,
  ContextCompressionOptions,
  UseContextWindowConfigWithCompression,
} from './use-context-window'

// useTokenOptimization types
export type {
  UseTokenOptimizationOptions,
  CompressionOptions as TokenOptimizationCompressionOptions,
  CompressionResult as TokenOptimizationCompressionResult,
  CachedResponse as TokenOptimizationCachedResponse,
  ModelInfo,
  TokenOptimizationResult,
} from './use-token-optimization'

// Token optimization statistics (for display components)
export {
  type TokenOptimizationStats,
  createEmptyStats,
} from './use-token-optimization-stats'
