/**
 * Optimization Utilities
 *
 * Token optimization, compression, caching, and performance utilities.
 */

// Prompt Compression
export {
  compressPrompt,
  aggressiveCompress,
  conservativeCompress,
  balancedCompress,
  compressConversation,
  type CompressionOptions,
  type CompressionResult,
} from './prompt-compression'

export {
  compressPromptSemantic,
  compressPromptCombined,
  calculateTokenImportance,
  estimateCompressibility,
  type SemanticCompressionOptions,
  type SemanticCompressionResult,
  type TokenImportance,
} from './prompt-compression-advanced'

export {
  LLMLinguaCompressor,
  compressRAGContext,
  intelligentCompress,
  createLLMLinguaCompressor,
  type LLMLinguaConfig,
  type CompressionResult as LLMLinguaCompressionResult,
  type CompressorStats,
} from './llmlingua-compressor'

// Chain-of-Thought
export {
  analyzeCoTPrompt,
  optimizeCoTPrompt,
  addZeroShotCoT,
  recommendCoTApproach,
  estimateCoTSavings,
  createCoTPrompt,
  COT_TRIGGERS,
  type CoTOptimizationOptions,
  type CoTAnalysis,
  type CoTOptimizationResult,
} from './cot-optimizer'

// Output Limits
export {
  calculateDynamicOutputLimit,
  injectBrevityInstruction,
  getPreferenceConfig,
  getTaskTypeConfig,
  detectTaskType,
  createModelOutputConfig,
  getMaxTokens,
  type OutputPreference,
  type TaskType,
  type OutputLimitConfig,
  type OutputLimitResult,
} from './dynamic-output-limit'

// KV Cache
export {
  buildKVCacheOptimizedPrompt,
  createSegment,
  createSystemSegment,
  createContextSegment,
  createRAGSegment,
  createHistorySegment,
  createUserSegment,
  conversationToSegments,
  validateSegments,
  estimateKVCacheSavings,
  PromptBudgetExceededError,
  type SegmentPriority,
  type SegmentType,
  type PromptSegment,
  type KVCachePromptConfig,
  type FormattedMessage,
  type TrimmedSegmentInfo,
  type BuiltPrompt,
} from './kv-cache-prompt-builder'

export * from './prompt-structure'
export * from './response-prefilling'
export * from './response-limiter'

// Context Ordering
export {
  reorderForAttention,
  addStructuralMarkers,
  optimizeContextLayout,
  calculateMessageImportance,
  estimateAttentionLoss,
  createContextOrderingHook,
  type ContextMessage,
  type OrderingOptions,
  type OrderedContext,
  type StructuredMessage,
} from './context-ordering'

// Context Window (explicit exports to avoid ContextMessage conflict with context-ordering)
export {
  FIFOTruncation,
  SlidingWindowTruncation,
  SmartTruncation,
  SummarizationTruncation,
  ContextWindowManager,
  type ContextMessage as ContextWindowMessage,
  type ContextWindowOptions,
  type TruncationStrategy,
} from './context-window'

// Caching
export {
  SmartCache,
  SimpleCache,
  type CacheEntry,
  type CacheOptions as SmartCacheOptions,
  type CacheStats as SmartCacheStats,
} from './smart-cache'

export {
  PersistentSemanticCache,
  createPersistentSemanticCache,
  usePersistentSemanticCacheConfig,
  type SemanticCacheConfig,
  type CachedResponse,
  type SemanticCacheStats,
  type CacheCheckResult,
} from './semantic-cache-persistent'

export {
  SchemaCache,
  createOpenAIWarmingRequest,
  estimateSchemaLatency,
  recommendSchemaStrategy,
  COMMON_SCHEMAS,
  type SchemaEntry,
  type SchemaCacheOptions,
  type SchemaWarmingResult,
} from './structured-output-cache'

// Token Optimization (explicit exports to avoid conflicts with named exports above)
export {
  shortenPrompt,
  estimateTokens,
  calculateTokenSavings,
  limitHistorySlidingWindow,
  limitHistoryFIFO,
  limitHistorySmart,
  limitHistory,
  createCache,
  generateCacheKey,
  createThrottler,
  classifyQueryComplexity,
  routeToModel,
  estimateRoutingSavings,
  shouldUseReference,
  createReference,
  enforceOutputLimit,
  createBatcher,
  calculateSimilarity,
  findSimilarCached,
  type TokenOptimizationConfig,
  type PromptShorteningOptions,
  type HistoryLimitingOptions,
  type CacheOptions as TokenCacheOptions,
  type SimilarityCacheOptions,
  type ThrottlingOptions,
  type ModelRoutingOptions,
  type ReferenceOptions,
  type OutputLimitOptions as TokenOutputLimitOptions,
  type BatchingOptions,
} from './token-optimization'

// Performance (explicit exports to avoid conflicts)
export {
  throttle,
  debounce,
  Batcher,
  measurePerformance,
  PerformanceMonitor,
  lazyLoad,
  optimizeArray,
} from './performance'

export {
  calculateVisibleRange,
  createDebouncedFunction,
  createThrottledFunction,
  MemoryManager,
  calculateMessageDiff,
  BatchProcessor,
  PerformanceTracker,
  checkPerformanceTarget,
  type VirtualScrollConfig,
  type DebounceConfig,
  type ThrottleConfig,
} from './performance-optimization'
