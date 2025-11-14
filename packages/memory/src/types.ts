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
export type MemoryType = 'episodic' | 'semantic' | 'procedural' | 'short-term'

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

  /** Memory retention policy */
  retentionPolicy: {
    /** Short-term memory TTL (seconds) */
    shortTerm: number
    /** Session memory TTL (seconds) */
    session: number
    /** Thread memory TTL (seconds) */
    thread: number
    /** Global memory TTL (seconds, 0 = never expires) */
    global: number
    /** User-scoped memory TTL (seconds, 0 = never expires) */
    user?: number
  }

  /** Enable debug logging */
  debug?: boolean
}

/**
 * Embedding provider interface (framework-agnostic)
 */
export interface EmbeddingProvider {
  embedText(text: string): Promise<number[]>
}

/**
 * Vector store types (framework-agnostic)
 */
export interface VectorMatch {
  id: string
  score: number
  values: number[]
  metadata?: Record<string, any>
}

export interface VectorQuery {
  vector: number[]
  topK: number
  minScore: number
  filter?: Record<string, any>
  namespace?: string
  includeMetadata?: boolean
}

export interface VectorUpsertVector {
  id: string
  values: number[]
  metadata?: Record<string, any>
}

export interface VectorUpsertOptions {
  namespace?: string
  batchSize?: number
}

export interface VectorStore {
  initialize(): Promise<void>
  query(input: VectorQuery): Promise<VectorMatch[]>
  upsert(vectors: VectorUpsertVector[], options?: VectorUpsertOptions): Promise<void>
  delete(ids: string[], namespace?: string): Promise<void>
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
