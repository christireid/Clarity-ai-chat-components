/**
 * ClarityTokens Core Type Definitions
 *
 * Type definitions for the AI Token Optimization Library.
 * These types are used across all hooks and utilities.
 */

// =============================================================================
// Model Types
// =============================================================================

/**
 * Model identifier for supported LLM providers
 */
export type ModelIdentifier =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4-turbo'
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'claude-3-5-sonnet'
  | 'claude-3-opus'
  | 'claude-3-haiku'
  | 'gemini-2.5-pro'
  | 'gemini-2.5-flash'
  | string // Custom models

/**
 * Token encoding types
 */
export type TokenEncoding = 'o200k_base' | 'cl100k_base' | 'p50k_base'

/**
 * Model pricing information
 */
export interface ModelPricing {
  /** Cost per 1M input tokens in USD */
  inputPer1M: number
  /** Cost per 1M output tokens in USD */
  outputPer1M: number
  /** Cost per 1M cached input tokens (if supported) */
  cachedInputPer1M?: number
  /** Maximum context window size */
  contextWindow: number
  /** Maximum output tokens */
  maxOutputTokens?: number
  /** Token encoding type */
  encoding: TokenEncoding
}

/**
 * Model configuration registry entry
 */
export interface ModelConfig extends ModelPricing {
  /** Display name */
  displayName: string
  /** Provider (openai, anthropic, google, etc.) */
  provider: string
  /** Whether the model supports streaming */
  supportsStreaming: boolean
  /** Whether the model supports function calling */
  supportsFunctionCalling: boolean
  /** Whether the model supports vision */
  supportsVision: boolean
}

// =============================================================================
// Chat Message Types
// =============================================================================

/**
 * Chat message role
 */
export type MessageRole = 'system' | 'user' | 'assistant' | 'function' | 'tool'

/**
 * Chat message structure
 */
export interface ChatMessage {
  /** Unique message identifier */
  id: string
  /** Message role */
  role: MessageRole
  /** Message content */
  content: string
  /** Function/tool name (for function/tool roles) */
  name?: string
  /** Function call data */
  function_call?: {
    name: string
    arguments: string
  }
  /** Tool calls data */
  tool_calls?: Array<{
    id: string
    type: 'function'
    function: {
      name: string
      arguments: string
    }
  }>
  /** Message metadata */
  metadata?: ChatMessageMetadata
}

/**
 * Chat message metadata
 */
export interface ChatMessageMetadata {
  /** Token count for this message */
  tokenCount?: number
  /** Timestamp when message was created */
  timestamp?: Date
  /** Whether message is pinned (always include in context) */
  pinned?: boolean
  /** Importance score (0-1) */
  importance?: number
  /** Custom metadata */
  [key: string]: unknown
}

// =============================================================================
// Token Counting Types
// =============================================================================

/**
 * Token count result
 */
export interface TokenCountResult {
  /** Total token count */
  count: number
  /** Whether count is within specified limit */
  isWithinLimit: boolean
  /** Encoding used for counting */
  encoding: TokenEncoding
  /** Whether result was from cache */
  cached: boolean
  /** Time to count in milliseconds */
  processingTimeMs?: number
}

/**
 * Token counter configuration
 */
export interface TokenCounterConfig {
  /** Model to use for tokenization */
  model: ModelIdentifier
  /** Debounce time for reactive counting (ms) */
  debounceMs?: number
  /** Include overhead for chat message formatting */
  includeMessageOverhead?: boolean
  /** Enable caching for repeated counts */
  enableCache?: boolean
  /** Maximum cache size */
  maxCacheSize?: number
}

// =============================================================================
// Cost Estimation Types
// =============================================================================

/**
 * Cost estimate breakdown
 */
export interface CostEstimate {
  /** Cost for input tokens */
  inputCost: number
  /** Cost for output tokens */
  outputCost: number
  /** Total cost */
  totalCost: number
  /** Currency code */
  currency: string
  /** Detailed breakdown */
  breakdown: {
    inputTokens: number
    outputTokens: number
    cachedTokens: number
    pricePerInputToken: number
    pricePerOutputToken: number
    pricePerCachedToken?: number
  }
}

/**
 * Cost tracking over time
 */
export interface CostTracking {
  /** Cost today */
  today: number
  /** Cost this week */
  thisWeek: number
  /** Cost this month */
  thisMonth: number
  /** All time cost */
  allTime: number
  /** Cost breakdown by model */
  byModel: Record<string, number>
  /** Cost breakdown by category */
  byCategory: Record<string, number>
}

/**
 * Cost estimator configuration
 */
export interface CostEstimatorConfig {
  /** Default model for estimation */
  defaultModel?: ModelIdentifier
  /** Custom pricing overrides */
  pricingOverrides?: Record<string, Partial<ModelPricing>>
  /** Display currency */
  currency?: 'USD' | 'EUR' | 'GBP'
  /** Enable persistence of tracking data */
  trackingPersistence?: boolean
  /** IndexedDB database name */
  dbName?: string
}

// =============================================================================
// Context Window Types
// =============================================================================

/**
 * Context window management strategy
 */
export type ContextStrategy = 'buffer' | 'window' | 'summaryBuffer'

/**
 * Context window state
 */
export interface ContextWindowState {
  /** Current messages in context */
  messages: ChatMessage[]
  /** Summary of older messages (if using summaryBuffer) */
  summary: string | null
  /** Total tokens in current context */
  totalTokens: number
  /** Available tokens remaining */
  availableTokens: number
  /** Context utilization percentage (0-100) */
  utilizationPercent: number
  /** Number of truncated messages */
  truncatedCount: number
  /** Number of summarized messages */
  summarizedCount: number
}

/**
 * Context window configuration
 */
export interface ContextWindowConfig {
  /** Maximum tokens for the model */
  maxTokens: number
  /** Tokens reserved for system prompt and response */
  reservedTokens?: number
  /** Context management strategy */
  strategy?: ContextStrategy
  /** Window size for 'window' strategy */
  windowSize?: number
  /** Threshold for triggering summarization (0-1) */
  summarizationThreshold?: number
  /** Custom summarization function */
  summarizer?: (messages: ChatMessage[]) => Promise<string>
  /** Always preserve system prompt */
  preserveSystemPrompt?: boolean
  /** Number of recent messages to always keep */
  preserveRecentCount?: number
}

/**
 * Optimized context result
 */
export interface OptimizedContextResult {
  /** Optimized messages for API call */
  messages: ChatMessage[]
  /** Total tokens in optimized context */
  totalTokens: number
  /** Whether messages were truncated */
  wasTruncated: boolean
  /** Whether older messages were summarized */
  wasSummarized: boolean
}

// =============================================================================
// Caching Types
// =============================================================================

/**
 * Cache entry for response caching
 */
export interface CacheEntry<T = string> {
  /** Unique entry identifier */
  id: string
  /** Original prompt/key */
  prompt: string
  /** Cached response */
  response: T
  /** Entry metadata */
  metadata: CacheEntryMetadata
}

/**
 * Cache entry metadata
 */
export interface CacheEntryMetadata {
  /** Model used for response */
  model: string
  /** Tokens saved by cache hit */
  tokensSaved: number
  /** Creation timestamp */
  createdAt: Date
  /** Expiration timestamp */
  expiresAt?: Date
  /** Number of cache hits */
  hitCount: number
  /** Last access timestamp */
  lastAccessed: Date
  /** Custom tags for invalidation */
  tags?: string[]
}

/**
 * Semantic cache entry with embedding
 */
export interface SemanticCacheEntry<T = string> extends CacheEntry<T> {
  /** Embedding vector for semantic search */
  embedding: Float32Array
}

/**
 * Cache search result
 */
export interface CacheSearchResult<T> {
  /** Matched cache entry (null if miss) */
  entry: CacheEntry<T> | null
  /** Similarity score for semantic search (0-1) */
  similarity: number
  /** Whether this is a cache hit */
  isHit: boolean
  /** Search time in milliseconds */
  searchTimeMs: number
}

/**
 * Cache statistics
 */
export interface CacheStats {
  /** Total entries in cache */
  totalEntries: number
  /** Cache hit rate (rolling window) */
  hitRate: number
  /** Total tokens saved */
  totalTokensSaved: number
  /** Total cost saved */
  totalCostSaved: number
  /** Average search time in ms */
  avgSearchTimeMs: number
  /** Memory usage in MB */
  memoryUsageMB?: number
}

/**
 * Response cache configuration
 */
export interface ResponseCacheConfig {
  /** Default TTL in milliseconds */
  defaultTTLMs?: number
  /** Maximum cache entries */
  maxEntries?: number
  /** Storage backend */
  storageBackend?: 'memory' | 'indexeddb' | 'localstorage'
  /** Enable stale-while-revalidate */
  staleWhileRevalidate?: boolean
  /** Maximum age for stale content */
  staleMaxAgeMs?: number
  /** Database name for IndexedDB */
  dbName?: string
}

/**
 * Semantic cache configuration
 */
export interface SemanticCacheConfig {
  /** Embedding model identifier */
  embeddingModel?: string
  /** Similarity threshold for cache hit (0-1) */
  similarityThreshold?: number
  /** Maximum cache size */
  maxCacheSize?: number
  /** Entry TTL in milliseconds */
  ttlMs?: number
  /** Persist to IndexedDB */
  persistToIndexedDB?: boolean
  /** Database name */
  dbName?: string
}

// =============================================================================
// Compression Types
// =============================================================================

/**
 * Compression strategy
 */
export type CompressionStrategy = 'heuristic' | 'extractive' | 'model' | 'auto'

/**
 * Compression result
 */
export interface CompressionResult {
  /** Original text */
  original: string
  /** Compressed text */
  compressed: string
  /** Original token count */
  originalTokens: number
  /** Compressed token count */
  compressedTokens: number
  /** Compression ratio (e.g., 2.5 = 2.5x smaller) */
  compressionRatio: number
  /** Tokens saved */
  tokensSaved: number
  /** Strategy used */
  strategy: CompressionStrategy
  /** Estimated quality preservation (0-1) */
  qualityScore: number
  /** Processing time in ms */
  processingTimeMs: number
}

/**
 * Compression configuration
 */
export interface CompressionConfig {
  /** Target compression ratio (e.g., 0.5 = 50% size) */
  targetRatio?: number
  /** Compression strategy */
  strategy?: CompressionStrategy
  /** Preserve structural elements (headers, lists, code) */
  preserveStructure?: boolean
  /** Minimum tokens (never compress below) */
  minTokens?: number
  /** Quality threshold (abort if below) */
  qualityThreshold?: number
}

// =============================================================================
// Embedding Types
// =============================================================================

/**
 * Embedding result
 */
export interface EmbeddingResult {
  /** Embedding vector */
  embedding: Float32Array
  /** Vector dimensions */
  dimensions: number
  /** Whether from cache */
  fromCache: boolean
  /** Processing time in ms */
  processingTimeMs: number
}

/**
 * Embedding cache configuration
 */
export interface EmbeddingCacheConfig {
  /** Embedding model name */
  model?: string
  /** Execution device */
  device?: 'webgpu' | 'wasm' | 'auto'
  /** LRU cache size */
  cacheSize?: number
  /** Persist cache to IndexedDB */
  persistCache?: boolean
  /** Batch size for bulk embedding */
  batchSize?: number
  /** Normalize vectors (L2) */
  normalize?: boolean
}

// =============================================================================
// Vector Search Types
// =============================================================================

/**
 * Vector document for indexing
 */
export interface VectorDocument {
  /** Unique document identifier */
  id: string
  /** Embedding vector */
  embedding: Float32Array
  /** Document metadata */
  metadata: Record<string, unknown>
  /** Original text (optional) */
  text?: string
}

/**
 * Vector search result
 */
export interface VectorSearchResult {
  /** Document identifier */
  id: string
  /** Similarity score (0-1) */
  score: number
  /** Distance value */
  distance: number
  /** Document metadata */
  metadata: Record<string, unknown>
  /** Original text if stored */
  text?: string
}

/**
 * Vector search configuration
 */
export interface VectorSearchConfig {
  /** Vector dimensions */
  dimensions: number
  /** Maximum elements in index */
  maxElements?: number
  /** HNSW build quality parameter */
  efConstruction?: number
  /** HNSW search quality parameter */
  efSearch?: number
  /** Enable binary quantization */
  useBinaryQuantization?: boolean
  /** Persist to IndexedDB */
  persistToIndexedDB?: boolean
  /** Database name */
  dbName?: string
}

// =============================================================================
// Provider Context Types
// =============================================================================

/**
 * Optimization level preset
 */
export type OptimizationLevel = 'none' | 'balanced' | 'aggressive'

/**
 * Token optimization provider configuration
 */
export interface TokenOptimizationConfig {
  /** Default model */
  defaultModel: ModelIdentifier
  /** Enable persistence */
  enablePersistence: boolean
  /** Optimization level */
  optimizationLevel: OptimizationLevel
  /** Pricing configuration */
  pricing: 'auto-update' | 'manual' | ModelPricing[]
  /** Storage configuration */
  storage: {
    backend: 'indexeddb' | 'memory'
    maxSizeMB: number
  }
  /** Feature flags */
  features: {
    semanticCache: boolean
    compression: boolean
    localLLM: boolean
    vectorSearch: boolean
  }
}

/**
 * Global optimization statistics
 */
export interface GlobalOptimizationStats {
  /** Total tokens saved */
  totalTokensSaved: number
  /** Total cost saved in USD */
  totalCostSaved: number
  /** Cache hit count */
  cacheHits: number
  /** Average compression ratio */
  compressionRatio: number
  /** Requests processed */
  requestsProcessed: number
  /** Cache hit rate */
  cacheHitRate: number
}

// =============================================================================
// Throttle Types
// =============================================================================

/**
 * Token throttle limits
 */
export interface TokenThrottleLimits {
  /** Tokens per minute */
  perMinute?: number
  /** Tokens per hour */
  perHour?: number
  /** Tokens per day */
  perDay?: number
}

/**
 * Token budget allocation
 */
export interface TokenBudgetAllocation {
  /** Percentage allocation (0-100) */
  allocation: number
  /** Priority (higher = more important) */
  priority: number
}

/**
 * Throttle overflow strategy
 */
export type ThrottleOverflowStrategy = 'queue' | 'reject' | 'degrade'

/**
 * Token throttle configuration
 */
export interface TokenThrottleConfig {
  /** Rate limits */
  limits: TokenThrottleLimits
  /** Budget allocations by category */
  budgets?: Record<string, TokenBudgetAllocation>
  /** Overflow handling strategy */
  overflowStrategy?: ThrottleOverflowStrategy
  /** Degradation ratio when overflow */
  degradationRatio?: number
  /** Persist usage across refresh */
  persistUsage?: boolean
}

/**
 * Throttle state
 */
export interface ThrottleState {
  /** Tokens used this minute */
  tokensUsedThisMinute: number
  /** Tokens used this hour */
  tokensUsedThisHour: number
  /** Tokens used today */
  tokensUsedThisDay: number
  /** Remaining tokens */
  tokensRemaining: {
    minute: number
    hour: number
    day: number
  }
  /** Number of queued requests */
  queuedRequests: number
  /** Whether currently throttled */
  isThrottled: boolean
  /** Next available time for request */
  nextAvailableAt: Date | null
}

// =============================================================================
// Streaming Types
// =============================================================================

/**
 * Stream buffer strategy
 */
export type StreamBufferStrategy = 'character' | 'word' | 'sentence' | 'chunk'

/**
 * Stream optimizer configuration
 */
export interface StreamOptimizerConfig {
  /** Buffering strategy */
  bufferStrategy?: StreamBufferStrategy
  /** Buffer size in characters */
  bufferSize?: number
  /** Flush interval in ms */
  flushIntervalMs?: number
  /** Callback for partial sentences */
  onPartialSentence?: (sentence: string) => void
  /** Enable token counting during stream */
  enableTokenCounting?: boolean
}

/**
 * Stream state
 */
export interface StreamState {
  /** Accumulated content */
  content: string
  /** Whether currently streaming */
  isStreaming: boolean
  /** Token count so far */
  tokenCount: number
  /** Number of chunks received */
  chunkCount: number
  /** Stream start time */
  startTime: Date | null
  /** Tokens per second */
  tokensPerSecond: number
}

/**
 * Stream performance metrics
 */
export interface StreamMetrics {
  /** Total chunks processed */
  totalChunks: number
  /** Total React re-renders */
  totalRenders: number
  /** Percentage of renders saved */
  renderReduction: number
  /** Average chunk latency in ms */
  avgChunkLatencyMs: number
}
