/**
 * AI Memory & Context Types
 *
 * Production-ready memory system for AI chat applications with support for:
 * - Short-term and long-term memory
 * - Episodic and semantic memory
 * - Token optimization
 * - Semantic chunking and compression
 * - Hybrid memory systems
 */

/**
 * Memory scope defines the lifetime and visibility of memory items
 */
export type MemoryScope = 'session' | 'thread' | 'global' | 'user'

/**
 * Memory type determines how the memory is processed and retrieved
 */
export type MemoryType =
  | 'episodic'
  | 'semantic'
  | 'procedural'
  | 'short-term'
  | 'profile'

/**
 * Priority levels for memory retrieval and token allocation
 */
export type MemoryPriority = 'critical' | 'high' | 'medium' | 'low'

/**
 * Core memory item interface
 */
export interface MemoryItem {
  /** Unique identifier */
  id: string

  /** Memory type */
  type: MemoryType

  /** Memory scope */
  scope: MemoryScope

  /** Memory content */
  content: string

  /** Structured metadata */
  metadata: {
    /** Topic or category */
    topic?: string
    /** Entity references */
    entities?: string[]
    /** Keywords */
    keywords?: string[]
    /** Source of memory */
    source?: string
    /** User ID for user-scoped memories */
    userId?: string
    /** Thread/conversation ID */
    threadId?: string
    /** Session ID */
    sessionId?: string
    /** Custom metadata */
    [key: string]: any
  }

  /** Embedding vector for semantic search */
  embedding?: number[]

  /** Confidence score (0-1) */
  confidence: number

  /** Priority level */
  priority: MemoryPriority

  /** Token count */
  tokens: number

  /** Access count (for importance tracking) */
  accessCount: number

  /** Last accessed timestamp */
  lastAccessed: Date

  /** Created timestamp */
  createdAt: Date

  /** Updated timestamp */
  updatedAt: Date

  /** Timestamp (alias for createdAt) */
  timestamp?: Date

  /** Importance score (0-1) */
  importance?: number

  /** Tags for categorization */
  tags?: string[]

  /** Expiry time (optional) */
  expiresAt?: Date

  /** Compressed version of content */
  compressed?: string

  /** Original content if compressed */
  original?: string
}

/**
 * Memory query interface
 */
export interface MemoryQuery {
  /** Query text */
  query?: string

  /** Query embedding */
  embedding?: number[]

  /** Filter by memory type */
  types?: MemoryType[]

  /** Filter by scope */
  scopes?: MemoryScope[]

  /** Filter by priority */
  priorities?: MemoryPriority[]

  /** Minimum confidence threshold */
  minConfidence?: number

  /** Maximum results */
  limit?: number

  /** Token budget for results */
  tokenBudget?: number

  /** Metadata filters */
  metadata?: Record<string, any>

  /** Time range filter */
  timeRange?: {
    start?: Date
    end?: Date
  }

  /** User ID filter */
  userId?: string

  /** Thread ID filter */
  threadId?: string

  /** Session ID filter */
  sessionId?: string

  /** Include embeddings in results */
  includeEmbeddings?: boolean
}

/**
 * Memory search result
 */
export interface MemorySearchResult {
  /** Memory item */
  memory: MemoryItem

  /** Relevance score (0-1) */
  relevance: number

  /** Score alias for relevance (backward compatibility) */
  score?: number

  /** Distance metric (for vector search) */
  distance?: number

  /** Highlights (for keyword search) */
  highlights?: string[]
}

/**
 * Vector store query options
 */
export interface VectorStoreQuery {
  /** Query vector */
  vector: number[]

  /** Number of results to return */
  topK?: number

  /** Minimum score threshold */
  minScore?: number

  /** Metadata filter */
  filter?: Record<string, any>

  /** Namespace or collection */
  namespace?: string

  /** Include metadata in results */
  includeMetadata?: boolean
}

/**
 * Vector store match
 */
export interface VectorStoreMatch {
  /** Match identifier */
  id: string

  /** Similarity score */
  score: number

  /** Stored vector values */
  values: number[]

  /** Associated metadata */
  metadata?: Record<string, any>
}

/**
 * Vector data for upsert operations
 */
export interface VectorStoreVector {
  id: string
  values: number[]
  metadata?: Record<string, any>
}

/**
 * Vector store upsert options
 */
export interface VectorStoreUpsertOptions {
  namespace?: string
  batchSize?: number
}

/**
 * Vector store interface
 */
export interface VectorStore {
  initialize(): Promise<void> | void
  query(options: VectorStoreQuery): Promise<VectorStoreMatch[]>
  upsert(
    vectors: VectorStoreVector[],
    options?: VectorStoreUpsertOptions
  ): Promise<void>
  delete(ids: string[], namespace?: string): Promise<void>
}

/**
 * Embedding provider interface
 */
export interface EmbeddingProvider {
  embedText(text: string): Promise<number[]>
  embedBatch?(texts: string[]): Promise<number[][]>
}

/**
 * Token allocation strategy
 */
export interface TokenAllocation {
  /** System prompt allocation */
  systemPrompt: number

  /** User preferences allocation */
  userPreferences: number

  /** Recent context allocation */
  recentContext: number

  /** Semantic memory allocation */
  semanticMemory: number

  /** Episodic memory allocation */
  episodicMemory: number

  /** Reserved for response */
  responseReserve: number
}

/**
 * Token optimization configuration
 */
export interface TokenOptimizationConfig {
  /** Maximum context window */
  maxContextWindow: number

  /** Token allocation percentages */
  allocation: {
    systemPrompt: number
    userPreferences: number
    recentContext: number
    semanticMemory: number
    episodicMemory: number
    responseReserve: number
  }

  /** Enable dynamic allocation */
  dynamicAllocation: boolean

  /** Enable compression */
  enableCompression: boolean

  /** Compression ratio target */
  compressionRatio?: number

  /** Enable semantic chunking */
  enableChunking: boolean

  /** Chunk size */
  chunkSize?: number

  /** Chunk overlap */
  chunkOverlap?: number
}

/**
 * Memory chunk for semantic coherence
 */
export interface MemoryChunk {
  /** Chunk ID */
  id: string

  /** Chunk content */
  text: string

  /** Token count */
  tokens: number

  /** Embedding */
  embedding: number[]

  /** Extracted topic */
  topic?: string

  /** Relevance score */
  relevance?: number

  /** Source memory ID */
  sourceMemoryId?: string

  /** Chunk index in source */
  chunkIndex?: number
}

/**
 * Memory context for optimization
 */
export interface MemoryContext {
  /** Conversation activity level */
  conversationActivity: 'low' | 'medium' | 'high'

  /** User preference richness */
  preferenceRichness: 'low' | 'medium' | 'high'

  /** Task complexity */
  taskComplexity: 'low' | 'medium' | 'high'

  /** Memory usage stats */
  stats: {
    totalMemories: number
    byType: Record<MemoryType, number>
    byScope: Record<MemoryScope, number>
    totalTokens: number
    averageRelevance: number
  }
}

/**
 * Compressed memory result
 */
export interface CompressedMemory {
  /** Original content */
  original: string

  /** Compressed content */
  compressed: string

  /** Original token count */
  originalTokens: number

  /** Compressed token count */
  compressedTokens: number

  /** Compression ratio */
  compressionRatio: number

  /** Compression method */
  method: 'summarization' | 'truncation' | 'semantic' | 'selective'
}

/**
 * Memory buffer for batching
 */
export interface MemoryBuffer {
  /** Buffered memories */
  items: MemoryItem[]

  /** Total tokens */
  totalTokens: number

  /** Buffer capacity */
  capacity: number

  /** Flush threshold */
  flushThreshold: number

  /** Auto-flush enabled */
  autoFlush: boolean
}

/**
 * Memory persistence options
 */
export interface MemoryPersistenceOptions {
  /** Use vector store for semantic search */
  useVectorStore: boolean

  /** Vector store namespace */
  vectorStoreNamespace?: string

  /** Use cache layer */
  useCache: boolean

  /** Cache TTL in seconds */
  cacheTTL?: number

  /** Use database for persistence */
  useDatabase: boolean

  /** Database connection string */
  databaseUrl?: string

  /** Batch size for operations */
  batchSize?: number
}

/**
 * Memory statistics
 */
export interface MemoryStats {
  /** Total memories */
  total: number

  /** Alias for total (backward compatibility) */
  totalMemories?: number

  /** By type */
  byType: Record<MemoryType, number>

  /** By scope */
  byScope: Record<MemoryScope, number>

  /** By priority */
  byPriority: Record<MemoryPriority, number>

  /** Total tokens */
  totalTokens: number

  /** Average confidence */
  averageConfidence: number

  /** Cache statistics */
  cache?: {
    hits: number
    misses: number
    hitRate: number
    size: number
  }

  /** Vector store statistics */
  vectorStore?: {
    totalVectors: number
    dimension: number
    namespaces: string[]
  }
}

/**
 * Memory service configuration
 */
export interface MemoryServiceConfig {
  /** Token optimization config */
  tokenOptimization: TokenOptimizationConfig

  /** Persistence options */
  persistence: MemoryPersistenceOptions

  /** Enable automatic summarization */
  enableAutoSummarization: boolean

  /** Summarization interval (ms) */
  summarizationInterval?: number

  /** Enable automatic cleanup */
  enableAutoCleanup: boolean

  /** Cleanup interval (ms) */
  cleanupInterval?: number

  /**
   * Memory retention policy - TTLs for automatic deletion
   *
   * Defaults (GDPR-compliant retention limits):
   * - episodic: 30 days (2592000 seconds)
   * - semantic: 90 days (7776000 seconds)
   * - procedural: 60 days (5184000 seconds)
   * - short-term: Session only (0 seconds)
   * - profile: 1 year (31536000 seconds)
   */
  retentionPolicy?: {
    /** Episodic memory TTL (seconds) */
    episodic?: number
    /** Semantic memory TTL (seconds) */
    semantic?: number
    /** Procedural memory TTL (seconds) */
    procedural?: number
    /** Short-term memory TTL (seconds) */
    shortTerm?: number
    /** Session memory TTL (seconds) */
    session?: number
    /** Thread memory TTL (seconds) */
    thread?: number
    /** Global memory TTL (seconds, 0 = never expires) */
    global?: number
    /** User-scoped memory TTL (seconds, 0 = never expires) */
    user?: number
    /** Profile memory TTL (seconds) */
    profile?: number
  }

  /**
   * Memory size limits to prevent unbounded growth
   *
   * Defaults:
   * - maxMemories: 1000 (LRU eviction when exceeded)
   * - maxTotalTokens: 100,000 (approx 400KB of text)
   * - maxMemorySize: 10,000 characters per memory
   */
  limits?: {
    /** Maximum number of memories to store (default: 1000) */
    maxMemories?: number
    /** Maximum total tokens across all memories (default: 100,000) */
    maxTotalTokens?: number
    /** Maximum size of single memory in characters (default: 10,000) */
    maxMemorySize?: number
    /** Warn when approaching limits (default: 0.9 = 90%) */
    warnThreshold?: number
  }

  /** Decay manager configuration for intelligent memory forgetting */
  decay?: {
    /** Enable decay manager */
    enabled: boolean
    /** Run decay evaluation automatically on recall() */
    autoDecayOnRecall?: boolean
    /** Decay evaluation interval (ms) for background processing */
    decayInterval?: number
    /** Custom decay policies by type/scope (see DecayManagerConfig) */
    policies?: Record<string, unknown>
  }

  /**
   * Consent management configuration (GDPR/CCPA compliance)
   *
   * When enabled, all memory writes require user consent.
   * Implements GDPR Article 6 (lawful basis) and Article 7 (consent conditions).
   */
  consent?: {
    /** Enable consent management (default: false for backwards compatibility) */
    enabled: boolean
    /** Require consent before any write operations (default: true) */
    requireConsentForWrites?: boolean
    /** Consent policy version (e.g., '1.0.0') */
    version?: string
    /** User ID extractor - extracts user ID from metadata */
    getUserId?: (metadata: Record<string, unknown>) => string | undefined
  }

  /**
   * Audit logging configuration (GDPR Article 30 compliance)
   *
   * When enabled, all operations are logged for compliance demonstration.
   * Implements GDPR Article 30 (Records of Processing Activities).
   */
  audit?: {
    /** Enable audit logging (default: true) */
    enabled?: boolean
    /** Store logs persistently (default: true) */
    persistent?: boolean
    /** Log retention period in days (default: 365 for GDPR) */
    retentionDays?: number
    /** Include IP addresses in logs (default: false for privacy) */
    includeIpAddresses?: boolean
    /** Include user agents in logs (default: false for privacy) */
    includeUserAgents?: boolean
  }

  /** Enable debug logging */
  debug?: boolean

  /** Log level for debugging */
  logLevel?: 'error' | 'warn' | 'info' | 'debug'

  /** Storage adapter configuration */
  storage?: {
    type: 'memory' | 'file' | 'indexeddb'
    options?: Record<string, any>
  }

  /** Embedding provider */
  embeddingProvider?: any

  /** Token budget configuration */
  tokenBudget?: TokenBudgetConfig
}

/**
 * Memory event types
 */
export type MemoryEventType =
  | 'memory:created'
  | 'memory:updated'
  | 'memory:deleted'
  | 'memory:promoted'
  | 'memory:compressed'
  | 'memory:expired'
  | 'buffer:flushed'
  | 'context:optimized'
  | 'user:data:deleted' // User data deletion event (GDPR Article 17)
  | 'user:data:deletion:verified' // Deletion verification event

/**
 * Memory event
 */
export interface MemoryEvent {
  /** Event type */
  type: MemoryEventType

  /** Event timestamp */
  timestamp: Date

  /** Memory item (if applicable) */
  memory?: MemoryItem

  /** Additional event data */
  data?: Record<string, any>
}

/**
 * Memory event listener
 */
export type MemoryEventListener = (event: MemoryEvent) => void | Promise<void>

/**
 * Deletion result - detailed breakdown of what was deleted
 *
 * Implements GDPR Article 17 (Right to Erasure) requirements:
 * - Must delete all personal data
 * - Must provide confirmation of deletion
 * - Must verify deletion completeness
 */
export interface DeletionResult {
  /** User ID whose data was deleted */
  userId: string
  /** Timestamp of deletion operation */
  timestamp: Date
  /** Detailed breakdown of deleted items */
  deleted: {
    /** Number of memories deleted */
    memories: number
    /** Number of embeddings deleted */
    embeddings: number
    /** Number of cache entries deleted */
    cacheEntries: number
    /** Number of buffer entries deleted */
    bufferEntries: number
    /** Number of consent records deleted */
    consentRecords: number
  }
  /** Failed deletion attempts (IDs that couldn't be deleted) */
  failed: string[]
  /** Whether deletion was verified complete */
  verified: boolean
  /** Verification details */
  verification?: DeletionVerification
}

/**
 * Deletion verification - confirms no data remains
 *
 * GDPR Article 17 compliance: Must be able to demonstrate complete deletion
 */
export interface DeletionVerification {
  /** User ID being verified */
  userId: string
  /** Timestamp of verification */
  timestamp: Date
  /** Whether verification passed (no data found) */
  passed: boolean
  /** Remaining data found (should be empty array if passed) */
  remainingData: Array<{
    /** Location where data was found */
    location: 'cache' | 'buffer' | 'vectorStore' | 'consent'
    /** Number of items found */
    count: number
    /** Sample IDs (up to 5) */
    sampleIds: string[]
  }>
  /** Error message if verification failed */
  error?: string
}

// ============================================================================
// Type Aliases for Backward Compatibility
// ============================================================================

/**
 * Alias for MemoryItem (backward compatibility)
 */
export type Memory = MemoryItem

/**
 * Alias for MemoryServiceConfig (backward compatibility)
 */
export type MemoryConfig = MemoryServiceConfig

/**
 * Alias for MemorySearchResult (backward compatibility)
 */
export type SearchResult = MemorySearchResult

// ============================================================================
// Additional Type Definitions
// ============================================================================

/**
 * Compression configuration
 */
export interface CompressionConfig {
  /** Enable compression */
  enabled: boolean

  /** Target compression ratio (0-1) */
  targetRatio?: number

  /** Compression strategy */
  strategy?: 'truncate' | 'summarize' | 'extract' | 'adaptive'

  /** Minimum tokens before compression */
  minTokens?: number

  /** Compression threshold */
  threshold?: number

  /** Minimum quality score (0-1) */
  minQuality?: number
}

/**
 * Context bundle containing selected memories and metadata
 */
export interface ContextBundle {
  /** Selected memories */
  memories: MemoryItem[]

  /** Total token count */
  totalTokens: number

  /** Token breakdown by category */
  tokenBreakdown: TokenBreakdown

  /** Compressed content (if applicable) */
  compressed?: string

  /** System prompt */
  systemPrompt?: string

  /** Formatted context string ready for LLM */
  formatted?: string

  /** Semantic memories (filtered) */
  semanticMemories?: MemoryItem[]

  /** Episodic memories (filtered) */
  episodicMemories?: MemoryItem[]

  /** User preferences */
  userPreferences?: Record<string, any>

  /** Metadata */
  metadata?: Record<string, any>
}

/**
 * Options for context building
 */
export interface ContextOptions {
  /** Maximum token budget */
  tokenBudget?: number

  /** Maximum tokens (alias for tokenBudget) */
  maxTokens?: number

  /** Token allocation strategy */
  allocation?: Partial<TokenAllocation>

  /** Enable compression */
  enableCompression?: boolean

  /** Compression configuration */
  compressionConfig?: CompressionConfig

  /** Include embeddings */
  includeEmbeddings?: boolean

  /** Include user preferences */
  includePreferences?: boolean

  /** Include recent context */
  includeRecent?: boolean

  /** Include summary */
  includeSummary?: boolean

  /** User ID filter */
  userId?: string

  /** Session ID filter */
  sessionId?: string

  /** Minimum relevance score (0-1) */
  minRelevance?: number

  /** Filter by memory types */
  types?: MemoryType[]
}

/**
 * Token breakdown by memory category
 */
export interface TokenBreakdown {
  /** System prompt tokens */
  systemPrompt: number

  /** User preferences tokens */
  userPreferences: number

  /** Recent context tokens */
  recentContext: number

  /** Semantic memory tokens */
  semanticMemory: number

  /** Episodic memory tokens */
  episodicMemory: number

  /** Response reserve tokens */
  responseReserve: number

  /** Summary tokens */
  summary?: number

  /** Total tokens used */
  total: number
}

/**
 * Token budget configuration
 */
export interface TokenBudgetConfig {
  /** Maximum context window size */
  maxContextWindow: number

  /** Token allocation */
  allocation: TokenAllocation

  /** Enable dynamic allocation */
  dynamicAllocation?: boolean
}

/**
 * Search options for memory queries
 */
export interface SearchOptions extends MemoryQuery {
  /** Rerank results */
  rerank?: boolean

  /** Diversify results */
  diversify?: boolean

  /** Filter by tags */
  tags?: string[]

  /** Minimum relevance score (0-1) */
  minScore?: number
}

/**
 * Summarization configuration
 */
export interface SummarizationConfig {
  /** Enable auto-summarization */
  enabled: boolean

  /** Summarization interval (ms) */
  interval?: number

  /** Target summary length */
  targetLength?: number

  /** Minimum content length for summarization */
  minLength?: number

  /** Maximum tokens for summary */
  maxTokens?: number

  /** LLM provider for summarization */
  provider?: 'openai' | 'anthropic' | 'local' | 'custom'

  /** Model name */
  model?: string
}

/**
 * Options for adding memories
 */
export interface AddOptions {
  /** Memory type override */
  type?: MemoryType

  /** Memory scope */
  scope?: MemoryScope

  /** Importance score (0-1) */
  importance?: number

  /** Tags for categorization */
  tags?: string[]

  /** Vector embedding */
  embedding?: number[]
}

/**
 * Memory score with breakdown
 */
export interface MemoryScore {
  /** Base importance score */
  base: number

  /** Recency score component */
  recency: number

  /** Access frequency score component */
  frequency: number

  /** User scope boost */
  userBoost: number

  /** Semantic relevance score */
  semanticRelevance: number

  /** Final computed score */
  final: number

  /** Score breakdown weights */
  breakdown: {
    recencyWeight: number
    frequencyWeight: number
    relevanceWeight: number
  }
}

/**
 * Memory error class
 */
export class MemoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public override cause?: Error
  ) {
    super(message)
    this.name = 'MemoryError'
  }
}

/**
 * Memory error codes
 */
export const MemoryErrorCodes = {
  STORE_ERROR: 'STORE_ERROR',
  EMBEDDING_ERROR: 'EMBEDDING_ERROR',
  TOKEN_BUDGET_EXCEEDED: 'TOKEN_BUDGET_EXCEEDED',
  INVALID_CONFIG: 'INVALID_CONFIG',
  MEMORY_NOT_FOUND: 'MEMORY_NOT_FOUND',
} as const

export type MemoryErrorCode =
  (typeof MemoryErrorCodes)[keyof typeof MemoryErrorCodes]

/**
 * Vector store configuration
 */
export interface VectorStoreConfig {
  /** Store type */
  type:
    | 'in-memory'
    | 'file'
    | 'indexeddb'
    | 'redis'
    | 'postgres'
    | 'sqlite'
    | 'chroma'
    | 'qdrant'
    | 'pinecone'
    | 'lancedb'

  /** File path (for file store) */
  path?: string

  /** Database name (for indexeddb store) */
  dbName?: string

  /** Additional store-specific options */
  options?: Record<string, any>
}
