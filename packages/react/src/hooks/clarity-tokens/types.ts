/**
 * ClarityTokens React Hooks - Type Definitions
 *
 * Type definitions for all ClarityTokens React hooks.
 * Uses types from @clarity-chat/token-optimization and local MODEL_REGISTRY.
 */

import type { ChatMessage } from '@clarity-chat/types'
import type { ModelId, TokenizerEncoding } from '../../utils/tokenization/model-registry'

// Re-export types for convenience
export type { ChatMessage } from '@clarity-chat/types'
export type { ModelId, TokenizerEncoding } from '../../utils/tokenization/model-registry'

// =============================================================================
// Shared Types (defined locally to avoid duplicate package dependency)
// =============================================================================

/** Cost estimate result */
export interface CostEstimate {
  inputCost: number
  outputCost: number
  totalCost: number
  currency: string
  breakdown: {
    inputTokens: number
    outputTokens: number
    cachedTokens: number
    pricePerInputToken: number
    pricePerOutputToken: number
  }
}

/** Cost tracking data */
export interface CostTracking {
  today: number
  thisWeek: number
  thisMonth: number
  allTime: number
  byModel: Record<string, number>
  byCategory: Record<string, number>
}

/** Cache statistics */
export interface CacheStats {
  totalEntries: number
  hitRate: number
  totalTokensSaved: number
  totalCostSaved: number
  avgSearchTimeMs: number
}

/** Compression strategy */
export type CompressionStrategy = 'heuristic' | 'extractive' | 'model' | 'auto'

/** Compression result */
export interface CompressionResult {
  original: string
  compressed: string
  compressionRatio: number
  tokensSaved: number
  strategy: CompressionStrategy
  qualityScore: number
}

/** Embedding result */
export interface EmbeddingResult {
  embedding: Float32Array
  text: string
  tokenCount: number
  cached: boolean
}

/** Vector search result */
export interface VectorSearchResult {
  id: string
  text?: string
  similarity: number
  metadata: Record<string, unknown>
}

/** Throttle state */
export interface ThrottleState {
  tokensUsedThisMinute: number
  tokensUsedThisHour: number
  tokensUsedThisDay: number
  tokensRemaining: {
    minute: number
    hour: number
    day: number
  }
  queuedRequests: number
  isThrottled: boolean
  nextAvailableAt: Date | null
}

/** Stream state */
export interface StreamState {
  content: string
  isStreaming: boolean
  tokenCount: number
  chunkCount: number
  startTime: Date | null
  tokensPerSecond: number
}

/** Stream metrics */
export interface StreamMetrics {
  totalChunks: number
  totalRenders: number
  renderReduction: number
  avgChunkLatencyMs: number
}

/** Optimization level */
export type OptimizationLevel = 'none' | 'light' | 'balanced' | 'aggressive' | 'maximum'

/** Global optimization statistics */
export interface GlobalOptimizationStats {
  totalTokensSaved: number
  totalCostSaved: number
  cacheHits: number
  cacheMisses: number
  compressionRatio: number
  averageLatencyMs: number
}

// =============================================================================
// useTokenCounter Types
// =============================================================================

export interface UseTokenCounterConfig {
  /** Model identifier for encoding selection */
  model: ModelId
  /** Debounce delay for reactive counting (ms) */
  debounceMs?: number
  /** Include chat message overhead tokens */
  includeMessageOverhead?: boolean
}

export interface UseTokenCounterReturn {
  /** Synchronous token count (cached) */
  countTokens: (text: string) => number
  /** Count tokens for chat messages array */
  countChatTokens: (messages: ChatMessage[]) => number
  /** Current reactive token count */
  tokenCount: number
  /** Update input for reactive counting */
  setInput: (text: string) => void
  /** Efficient limit checking (stops early if over) */
  isWithinLimit: (text: string, limit: number) => boolean
  /** Current streaming token count */
  streamTokenCount: number
  /** Process streaming chunk */
  onStreamChunk: (chunk: string) => void
  /** Reset stream counter */
  resetStreamCount: () => void
  /** Maximum tokens for current model */
  modelMaxTokens: number
  /** Encoding name for current model */
  encodingName: TokenizerEncoding
}

// =============================================================================
// useCostEstimator Types
// =============================================================================

export interface UseCostEstimatorConfig {
  /** Default model for estimation */
  defaultModel?: ModelId
  /** Custom pricing overrides */
  pricingOverrides?: Record<string, { inputPer1M: number; outputPer1M: number }>
  /** Display currency */
  currency?: 'USD' | 'EUR' | 'GBP'
  /** Enable persistent tracking */
  trackingPersistence?: boolean
}

export interface UseCostEstimatorReturn {
  /** Estimate cost for input */
  estimate: (params: {
    inputText?: string
    inputTokens?: number
    messages?: ChatMessage[]
    model?: ModelId
    expectedOutputTokens?: number
  }) => CostEstimate
  /** Record actual cost */
  recordCost: (params: {
    inputTokens: number
    outputTokens: number
    cachedTokens?: number
    model: ModelId
    category?: string
  }) => void
  /** Current tracking data */
  tracking: CostTracking
  /** Get pricing for a model */
  getModelPricing: (model: ModelId) => {
    inputPer1M: number
    outputPer1M: number
    cachedInputPer1M?: number
    contextWindow: number
  }
  /** Update custom pricing */
  updatePricing: (model: string, pricing: { inputPer1M: number; outputPer1M: number }) => void
  /** Format cost for display */
  formatCost: (amount: number) => string
  /** Export tracking data */
  exportTracking: (format: 'json' | 'csv') => string
  /** Reset tracking */
  resetTracking: () => void
}

// =============================================================================
// useContextWindow Types
// =============================================================================

export type ContextStrategy = 'buffer' | 'window' | 'summaryBuffer'

export interface UseContextWindowConfig {
  /** Maximum tokens for context */
  maxTokens: number
  /** Reserved tokens for system + response */
  reservedTokens?: number
  /** Context management strategy */
  strategy?: ContextStrategy
  /** Window size for 'window' strategy */
  windowSize?: number
  /** Summarization threshold (0-1) */
  summarizationThreshold?: number
  /** Custom summarizer function */
  summarizer?: (messages: ChatMessage[]) => Promise<string>
  /** Preserve system prompt */
  preserveSystemPrompt?: boolean
  /** Number of recent messages to always keep */
  preserveRecentCount?: number
}

export interface ContextWindowState {
  messages: ChatMessage[]
  summary: string | null
  totalTokens: number
  availableTokens: number
  utilizationPercent: number
  truncatedCount: number
  summarizedCount: number
}

export interface UseContextWindowReturn {
  /** Current context state */
  state: ContextWindowState
  /** Add single message */
  addMessage: (message: ChatMessage) => void
  /** Add multiple messages */
  addMessages: (messages: ChatMessage[]) => void
  /** Get optimized context for API */
  getOptimizedContext: () => Promise<{
    messages: ChatMessage[]
    totalTokens: number
    wasTruncated: boolean
    wasSummarized: boolean
  }>
  /** Manually trigger summarization */
  triggerSummarization: () => Promise<void>
  /** Clear all history */
  clearHistory: () => void
  /** Change strategy */
  setStrategy: (strategy: ContextStrategy) => void
  /** Check if message would exceed limit */
  willExceedLimit: (newMessage: ChatMessage) => boolean
  /** Estimate tokens after adding message */
  estimateTokensAfterAdd: (message: ChatMessage) => number
  /** Export state for persistence */
  exportState: () => ContextWindowState
  /** Import state */
  importState: (state: ContextWindowState) => void
}

// =============================================================================
// useResponseCache Types
// =============================================================================

export interface UseResponseCacheConfig {
  /** Default TTL in ms */
  defaultTTLMs?: number
  /** Maximum entries */
  maxEntries?: number
  /** Storage backend */
  storageBackend?: 'memory' | 'indexeddb' | 'localstorage'
  /** Enable stale-while-revalidate */
  staleWhileRevalidate?: boolean
  /** Max age for stale content */
  staleMaxAgeMs?: number
}

export interface CachedResponse<T> {
  data: T
  cachedAt: Date
  expiresAt: Date
  isStale: boolean
  tags: string[]
  hitCount: number
}

export interface UseResponseCacheReturn<T = string> {
  /** Get cached response */
  get: (key: string) => Promise<CachedResponse<T> | null>
  /** Set cached response */
  set: (key: string, value: T, options?: { ttlMs?: number; tags?: string[] }) => Promise<void>
  /** Invalidate by key */
  invalidate: (key: string) => Promise<void>
  /** Invalidate by tag */
  invalidateByTag: (tag: string) => Promise<number>
  /** Invalidate by pattern */
  invalidateByPattern: (pattern: RegExp) => Promise<number>
  /** Clear all entries */
  invalidateAll: () => Promise<void>
  /** Get or revalidate */
  getOrRevalidate: (
    key: string,
    revalidate: () => Promise<T>
  ) => Promise<{ data: T; source: 'cache' | 'fresh' | 'stale' }>
  /** Cache statistics */
  stats: CacheStats
}

// =============================================================================
// useSemanticCache Types
// =============================================================================

export interface UseSemanticCacheConfig {
  /** Embedding model */
  embeddingModel?: string
  /** Similarity threshold (0-1) */
  similarityThreshold?: number
  /** Maximum cache size */
  maxCacheSize?: number
  /** TTL in ms */
  ttlMs?: number
  /** Persist to IndexedDB */
  persistToIndexedDB?: boolean
  /** Database name */
  dbName?: string
}

export interface UseSemanticCacheReturn<T = string> {
  /** Search cache for similar prompt */
  search: (prompt: string) => Promise<{
    entry: { prompt: string; response: T } | null
    similarity: number
    isHit: boolean
    searchTimeMs: number
  }>
  /** Store response */
  set: (prompt: string, response: T, metadata?: { model?: string; tokensSaved?: number }) => Promise<string>
  /** Invalidate by ID */
  invalidate: (id: string) => Promise<void>
  /** Invalidate similar prompts */
  invalidateByPrompt: (prompt: string, threshold?: number) => Promise<number>
  /** Warm cache with entries */
  warmCache: (entries: Array<{ prompt: string; response: T }>) => Promise<void>
  /** Export cache */
  exportCache: () => Promise<Array<{ prompt: string; response: T }>>
  /** Import cache */
  importCache: (entries: Array<{ prompt: string; response: T; embedding?: Float32Array }>) => Promise<void>
  /** Whether cache is ready */
  isReady: boolean
  /** Whether search is in progress */
  isSearching: boolean
  /** Cache statistics */
  stats: CacheStats
  /** Update similarity threshold */
  updateThreshold: (threshold: number) => void
  /** Clear cache */
  clearCache: () => Promise<void>
}

// =============================================================================
// usePromptCompressor Types
// =============================================================================

export interface UsePromptCompressorConfig {
  /** Target compression ratio */
  targetRatio?: number
  /** Compression strategy */
  strategy?: CompressionStrategy
  /** Preserve structural elements */
  preserveStructure?: boolean
  /** Minimum tokens (never compress below) */
  minTokens?: number
  /** Quality threshold */
  qualityThreshold?: number
}

export interface UsePromptCompressorReturn {
  /** Compress text */
  compress: (text: string, config?: Partial<UsePromptCompressorConfig>) => Promise<CompressionResult>
  /** Compress chat messages */
  compressMessages: (messages: ChatMessage[]) => Promise<{
    messages: ChatMessage[]
    totalSaved: number
    compressionRatio: number
  }>
  /** Streaming compression */
  compressStream: (text: string) => AsyncGenerator<{ chunk: string; progress: number }>
  /** Whether compressing */
  isCompressing: boolean
  /** Whether model is loaded (for model-based) */
  isModelLoaded: boolean
  /** Load compression model */
  loadModel: () => Promise<void>
  /** Analyze compressibility */
  analyzeCompressibility: (text: string) => Promise<{
    estimatedRatio: number
    recommendedStrategy: CompressionStrategy
    redundancyScore: number
  }>
}

// =============================================================================
// useEmbeddingCache Types
// =============================================================================

export interface UseEmbeddingCacheConfig {
  /** Embedding model */
  model?: string
  /** Device for inference */
  device?: 'webgpu' | 'wasm' | 'auto'
  /** LRU cache size */
  cacheSize?: number
  /** Persist to IndexedDB */
  persistCache?: boolean
  /** Batch size */
  batchSize?: number
  /** Normalize vectors */
  normalize?: boolean
}

export interface UseEmbeddingCacheReturn {
  /** Generate embedding */
  embed: (text: string) => Promise<EmbeddingResult>
  /** Batch embed */
  embedBatch: (texts: string[]) => Promise<EmbeddingResult[]>
  /** Whether model is loaded */
  isModelLoaded: boolean
  /** Loading progress (0-100) */
  loadProgress: number
  /** Load model */
  loadModel: () => Promise<void>
  /** Unload model */
  unloadModel: () => void
  /** Cache statistics */
  cacheStats: {
    size: number
    hitRate: number
    memoryUsageMB: number
  }
  /** Clear cache */
  clearCache: () => Promise<void>
  /** Preload embeddings */
  preloadEmbeddings: (texts: string[]) => Promise<void>
  /** Cosine similarity */
  cosineSimilarity: (a: Float32Array, b: Float32Array) => number
  /** Find most similar */
  findMostSimilar: (query: string, candidates: string[], topK?: number) => Promise<Array<{
    text: string
    similarity: number
  }>>
}

// =============================================================================
// useVectorSearch Types
// =============================================================================

export interface UseVectorSearchConfig {
  /** Vector dimensions */
  dimensions: number
  /** Max elements */
  maxElements?: number
  /** HNSW build quality */
  efConstruction?: number
  /** HNSW search quality */
  efSearch?: number
  /** Binary quantization */
  useBinaryQuantization?: boolean
  /** Persist to IndexedDB */
  persistToIndexedDB?: boolean
  /** Database name */
  dbName?: string
}

export interface UseVectorSearchReturn {
  /** Add document */
  addDocument: (doc: { id: string; embedding: Float32Array; metadata: Record<string, unknown>; text?: string }) => Promise<void>
  /** Add multiple documents */
  addDocuments: (docs: Array<{ id: string; embedding: Float32Array; metadata: Record<string, unknown>; text?: string }>) => Promise<void>
  /** Remove document */
  removeDocument: (id: string) => Promise<void>
  /** Update document */
  updateDocument: (doc: { id: string; embedding: Float32Array; metadata: Record<string, unknown>; text?: string }) => Promise<void>
  /** Search */
  search: (queryEmbedding: Float32Array, options?: {
    topK?: number
    filter?: string
    includeMetadata?: boolean
    rescoreTopK?: number
  }) => Promise<VectorSearchResult[]>
  /** Hybrid search */
  hybridSearch: (query: string, queryEmbedding: Float32Array, options?: {
    topK?: number
    alpha?: number
  }) => Promise<VectorSearchResult[]>
  /** Whether ready */
  isReady: boolean
  /** Document count */
  documentCount: number
  /** Index statistics */
  indexStats: {
    memoryUsageMB: number
    avgSearchTimeMs: number
  }
  /** Save index */
  save: () => Promise<void>
  /** Load index */
  load: () => Promise<void>
  /** Clear index */
  clear: () => Promise<void>
}

// =============================================================================
// useStreamOptimizer Types
// =============================================================================

export type StreamBufferStrategy = 'character' | 'word' | 'sentence' | 'chunk'

export interface UseStreamOptimizerConfig {
  /** Buffer strategy */
  bufferStrategy?: StreamBufferStrategy
  /** Buffer size (chars) */
  bufferSize?: number
  /** Flush interval (ms) */
  flushIntervalMs?: number
  /** Partial sentence callback */
  onPartialSentence?: (sentence: string) => void
  /** Enable token counting */
  enableTokenCounting?: boolean
}

export interface UseStreamOptimizerReturn {
  /** Stream state */
  state: StreamState
  /** Buffered content */
  bufferedContent: string
  /** Process chunk */
  processChunk: (chunk: string) => void
  /** Start stream */
  startStream: () => void
  /** End stream */
  endStream: () => void
  /** Abort stream */
  abort: () => void
  /** Reset */
  reset: () => void
  /** Content ref for zero-render updates */
  contentRef: React.RefObject<string>
  /** Performance metrics */
  metrics: StreamMetrics
}

// =============================================================================
// useTokenThrottle Types
// =============================================================================

export interface UseTokenThrottleConfig {
  /** Rate limits */
  limits: {
    perMinute?: number
    perHour?: number
    perDay?: number
  }
  /** Budget allocations */
  budgets?: Record<string, { allocation: number; priority: number }>
  /** Overflow strategy */
  overflowStrategy?: 'queue' | 'reject' | 'degrade'
  /** Degradation ratio */
  degradationRatio?: number
  /** Persist usage */
  persistUsage?: boolean
}

export interface UseTokenThrottleReturn {
  /** Throttle state */
  state: ThrottleState
  /** Request tokens */
  requestTokens: (count: number, category?: string) => Promise<{
    granted: boolean
    grantedCount: number
    waitTimeMs: number
    reason?: 'quota_exceeded' | 'queued' | 'degraded'
  }>
  /** Record usage */
  recordUsage: (tokens: number, category?: string) => void
  /** Get budget status */
  getBudgetStatus: (category: string) => {
    used: number
    remaining: number
    percentUsed: number
  }
  /** Pause throttle */
  pause: () => void
  /** Resume throttle */
  resume: () => void
  /** Reset limits */
  resetLimits: () => void
}

// =============================================================================
// useMessagePrioritizer Types
// =============================================================================

export interface UseMessagePrioritizerConfig {
  /** Scoring weights */
  scoringWeights?: {
    recency: number
    semanticRelevance: number
    userPreference: number
    roleImportance: number
  }
  /** Role weights */
  roleWeights?: {
    system: number
    user: number
    assistant: number
    function: number
  }
  /** Custom scoring function */
  customScorer?: (message: ChatMessage, context: { query: string; index: number; total: number }) => number
}

export interface ScoredMessage extends ChatMessage {
  score: number
  tokenCount: number
  scoreBreakdown: {
    recency: number
    semanticRelevance: number
    userPreference: number
    roleImportance: number
    custom?: number
  }
}

export interface UseMessagePrioritizerReturn {
  /** Score messages */
  scoreMessages: (messages: ChatMessage[], currentQuery: string) => Promise<ScoredMessage[]>
  /** Select messages for budget */
  selectForBudget: (messages: ChatMessage[], currentQuery: string, tokenBudget: number) => Promise<{
    selected: ChatMessage[]
    excluded: ChatMessage[]
    totalTokens: number
    totalScore: number
  }>
  /** Pin message */
  pinMessage: (messageId: string) => void
  /** Unpin message */
  unpinMessage: (messageId: string) => void
  /** Pinned message IDs */
  pinnedIds: Set<string>
}

// =============================================================================
// useContextBudget Types
// =============================================================================

export interface UseContextBudgetConfig {
  /** Total budget */
  totalBudget: number
  /** Section allocations */
  allocations: {
    systemPrompt: { min: number; max: number; priority: number }
    history: { min: number; max: number; priority: number }
    retrieval: { min: number; max: number; priority: number }
    query: { min: number; max: number; priority: number }
  }
  /** Rebalance strategy */
  rebalanceStrategy?: 'proportional' | 'priority' | 'fixed'
}

export interface BudgetAllocation {
  section: string
  allocated: number
  used: number
  remaining: number
  isOverBudget: boolean
}

export interface UseContextBudgetReturn {
  /** Current allocations */
  allocations: Record<string, BudgetAllocation>
  /** Total used */
  totalUsed: number
  /** Total remaining */
  totalRemaining: number
  /** Reserve tokens */
  reserve: (section: string, tokens: number) => { granted: number; overflow: number }
  /** Release tokens */
  release: (section: string, tokens: number) => void
  /** Check fit */
  canFit: (section: string, tokens: number) => boolean
  /** Force rebalance */
  rebalance: () => void
  /** Fit content to section */
  fitContent: (section: string, content: string) => {
    fitted: string
    truncated: boolean
    tokenCount: number
  }
}

// =============================================================================
// useOptimizedChat Types
// =============================================================================

export interface UseOptimizedChatConfig {
  /** Model identifier */
  model: ModelId
  /** API endpoint */
  apiEndpoint?: string
  /** Maximum tokens */
  maxTokens?: number
  /** Optimization level */
  optimizationLevel?: OptimizationLevel
  /** Enable semantic cache */
  enableSemanticCache?: boolean
  /** Enable compression */
  enableCompression?: boolean
  /** Enable context window management */
  enableContextWindow?: boolean
}

export interface UseOptimizedChatReturn {
  /** Messages */
  messages: ChatMessage[]
  /** Send message */
  sendMessage: (content: string) => Promise<void>
  /** Input value */
  input: string
  /** Set input */
  setInput: (value: string) => void
  /** Loading state */
  isLoading: boolean
  /** Error */
  error: Error | null
  /** Optimization stats */
  optimizationStats: {
    tokensSaved: number
    cacheHits: number
    compressionRatio: number
    estimatedCostSaved: number
  }
  /** Set optimization level */
  setOptimizationLevel: (level: OptimizationLevel) => void
  /** Clear messages */
  clearMessages: () => void
  /** Stop generation */
  stop: () => void
}

// =============================================================================
// useCostDashboard Types
// =============================================================================

export interface UseCostDashboardReturn {
  /** Chart data */
  charts: {
    dailyCosts: Array<{ date: string; cost: number }>
    modelDistribution: Array<{ model: string; percentage: number; cost: number }>
    savingsBreakdown: Array<{ technique: string; saved: number; percentage: number }>
  }
  /** Alerts */
  alerts: Array<{ type: 'warning' | 'critical'; message: string; threshold?: number }>
  /** Current period totals */
  totals: CostTracking
  /** Global stats */
  globalStats: GlobalOptimizationStats
  /** Set alert thresholds */
  setAlertThresholds: (thresholds: { warning?: number; critical?: number }) => void
  /** Export report */
  exportReport: (format: 'json' | 'csv') => string
  /** Refresh data */
  refresh: () => void
}

// =============================================================================
// Provider Types
// =============================================================================

export interface TokenOptimizationProviderConfig {
  /** Default model */
  defaultModel: ModelId
  /** Enable persistence */
  enablePersistence: boolean
  /** Optimization level */
  optimizationLevel: OptimizationLevel
  /** Pricing mode */
  pricing: 'auto-update' | 'manual'
  /** Storage config */
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

export interface TokenOptimizationContextValue {
  /** Configuration */
  config: TokenOptimizationProviderConfig
  /** Update config */
  updateConfig: (partial: Partial<TokenOptimizationProviderConfig>) => void
  /** Global stats */
  globalStats: GlobalOptimizationStats
  /** Update stats */
  updateStats: (stats: Partial<GlobalOptimizationStats>) => void
}
