/**
 * ClarityTokens - AI Token Optimization Library
 *
 * A comprehensive library for AI token optimization delivering 80%+ cost
 * reduction through caching, compression, and context management.
 *
 * @packageDocumentation
 * @module @clarity-chat/clarity-tokens
 * @version 1.0.0
 */

// =============================================================================
// Core Exports
// =============================================================================

// Types
export type {
  // Model types
  ModelIdentifier,
  TokenEncoding,
  ModelPricing,
  ModelConfig,

  // Message types
  MessageRole,
  ChatMessage,
  ChatMessageMetadata,

  // Token counting types
  TokenCountResult,
  TokenCounterConfig,

  // Cost types
  CostEstimate,
  CostTracking,
  CostEstimatorConfig,

  // Context types
  ContextStrategy,
  ContextWindowState,
  ContextWindowConfig,
  OptimizedContextResult,

  // Cache types
  CacheEntry,
  CacheEntryMetadata,
  SemanticCacheEntry,
  CacheSearchResult,
  CacheStats,
  ResponseCacheConfig,
  SemanticCacheConfig,

  // Compression types
  CompressionStrategy,
  CompressionResult,
  CompressionConfig,

  // Embedding types
  EmbeddingResult,
  EmbeddingCacheConfig,

  // Vector search types
  VectorDocument,
  VectorSearchResult,
  VectorSearchConfig,

  // Provider types
  OptimizationLevel,
  TokenOptimizationConfig,
  GlobalOptimizationStats,

  // Throttle types
  TokenThrottleLimits,
  TokenBudgetAllocation,
  ThrottleOverflowStrategy,
  TokenThrottleConfig,
  ThrottleState,

  // Stream types
  StreamBufferStrategy,
  StreamOptimizerConfig,
  StreamState,
  StreamMetrics,
} from './types'

// =============================================================================
// Core Module
// =============================================================================

// Model Registry
export {
  MODEL_REGISTRY,
  getModelConfig,
  getModelEncoding,
  getModelContextWindow,
  getModelPricing,
  getSupportedModels,
  modelSupportsFeature,
} from './core/model-registry'

// Token Counter
export {
  countTokens,
  countTokensForModel,
  checkWithinLimit,
  countChatTokens,
  countChatTokensForModel,
  estimateTokens,
  truncateToTokenLimit,
  splitByTokenLimit,
  clearTokenCache,
  getTokenCacheStats,
  decodeTokens,
} from './core/token-counter'

// Cost Calculator
export {
  calculateCost,
  estimateCostFromText,
  estimateCostFromMessages,
  quickEstimateCost,
  convertCurrency,
  formatCost,
  CostTracker,
  compareCosts,
  findCheapestModel,
  calculateSavings,
} from './core/cost-calculator'

// Storage
export {
  getDatabase,
  closeDatabase,
  generateHash,
  generateId,
  clearAllData,
  getStorageStats,
  isIndexedDBAvailable,
} from './core/storage'

// =============================================================================
// Caching Module
// =============================================================================

export {
  ResponseCacheManager,
  createResponseCache,
} from './caching/response-cache'

export {
  SemanticCacheManager,
  createSemanticCache,
  cosineSimilarity,
  type EmbeddingFunction,
} from './caching/semantic-cache'

// =============================================================================
// Compression Module
// =============================================================================

export {
  PromptCompressor,
  createPromptCompressor,
  compressPrompt,
} from './compression/prompt-compressor'

// =============================================================================
// Embeddings Module
// =============================================================================

export {
  EmbeddingManager,
  createEmbeddingManager,
  generateEmbedding,
} from './embeddings/embedding-manager'
