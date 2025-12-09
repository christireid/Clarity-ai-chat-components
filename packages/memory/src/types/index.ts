/**
 * Clarity Memory - Alternative Type Definitions
 *
 * @deprecated This file is deprecated and will be removed in a future version.
 * Use the main types from the package root instead:
 *
 * ```typescript
 * import type { MemoryItem, MemoryConfig, MemoryStore } from '@clarity-chat/memory'
 * ```
 *
 * The canonical type definitions are in `../types.ts` (exported from package root).
 * This file is maintained only for backward compatibility.
 */

// ============================================================================
// Core Memory Types
// ============================================================================

/**
 * A single memory item stored in the system
 */
export interface MemoryItem {
  /** Unique identifier for this memory */
  id: string
  
  /** The actual content/text of the memory */
  content: string
  
  /** When this memory was created */
  timestamp: Date
  
  /** When this memory was last accessed */
  lastAccessed?: Date
  
  /** How many times this memory has been accessed */
  accessCount: number
  
  /** Importance score (0-1) */
  importance: number
  
  /** User-defined metadata */
  metadata?: Record<string, unknown>
  
  /** Embedding vector (if available) */
  embedding?: number[]
  
  /** Topic/cluster this memory belongs to */
  topic?: string
  
  /** TTL in milliseconds (optional) */
  ttl?: number
}

/**
 * A chunk of memory (for large memories that are chunked)
 */
export interface MemoryChunk {
  /** Unique identifier */
  id: string
  
  /** Parent memory ID */
  memoryId: string
  
  /** Chunk index */
  index: number
  
  /** Chunk content */
  content: string
  
  /** Embedding vector */
  embedding: number[]
  
  /** Metadata */
  metadata?: Record<string, unknown>
}

/**
 * Embedding vector with metadata
 */
export interface Embedding {
  /** The embedding vector */
  vector: number[]
  
  /** Model used to generate this embedding */
  model: string
  
  /** Dimensions of the vector */
  dimensions: number
  
  /** When this embedding was created */
  timestamp: Date
}

/**
 * Memory score with breakdown
 */
export interface MemoryScore {
  /** Overall score (0-1) */
  score: number
  
  /** Recency score component */
  recency: number
  
  /** Frequency score component */
  frequency: number
  
  /** Relevance score component */
  relevance: number
  
  /** Importance score component */
  importance: number
  
  /** When this score was calculated */
  timestamp: Date
}

/**
 * Search result with metadata
 */
export interface SearchResult {
  /** The memory item */
  memory: MemoryItem
  
  /** Relevance score (0-1) */
  score: number
  
  /** Score breakdown */
  scoreBreakdown: MemoryScore
  
  /** Why this result was selected */
  reason?: string
}

/**
 * Context bundle prepared for LLM
 */
export interface ContextBundle {
  /** Formatted messages for LLM */
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  
  /** Actual token count */
  tokens: number
  
  /** Summary of older/compressed memories */
  summary?: string
  
  /** Memories included in this bundle */
  memories: MemoryItem[]
  
  /** Format used (openai, anthropic, etc.) */
  format: string
}

/**
 * Summarization result
 */
export interface SummarizationResult {
  /** The summary text */
  summary: string
  
  /** Memories that were summarized */
  sourceMemories: MemoryItem[]
  
  /** Token count of summary */
  tokens: number
  
  /** When this summary was created */
  timestamp: Date
}

/**
 * Compression result
 */
export interface CompressionResult {
  /** Number of memories before compression */
  before: number
  
  /** Number of memories after compression */
  after: number
  
  /** Compression ratio */
  ratio: number
  
  /** Strategy used */
  strategy: string
  
  /** Summary created (if applicable) */
  summary?: SummarizationResult
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Embedding provider configuration
 */
export interface EmbeddingConfig {
  /** Provider name */
  provider: 'openai' | 'anthropic' | 'local'
  
  /** Model name */
  model?: string
  
  /** API key (if required) */
  apiKey?: string
  
  /** Additional provider-specific config */
  config?: Record<string, unknown>
  
  /** Cache embeddings */
  cache?: boolean
  
  /** Cache TTL in milliseconds */
  cacheTTL?: number
}

/**
 * Storage configuration
 */
export interface StoreConfig {
  /** Store type */
  type: 'in-memory' | 'file' | 'indexeddb' | 'redis' | 'postgres' | 'sqlite' | 'chroma' | 'qdrant' | 'pinecone' | 'lancedb'
  
  /** Store-specific configuration */
  config?: Record<string, unknown>
  
  /** Path (for file-based stores) */
  path?: string
  
  /** Connection string (for database stores) */
  connectionString?: string
}

/**
 * Short-term memory configuration
 */
export interface ShortTermConfig {
  /** Maximum number of messages */
  maxMessages?: number
  
  /** Maximum tokens */
  maxTokens?: number
  
  /** Maximum message length in characters */
  maxMessageLength?: number
  
  /** Auto-summarize when evicting */
  autoSummarize?: boolean
}

/**
 * Long-term memory configuration
 */
export interface LongTermConfig {
  /** Enable long-term memory */
  enabled: boolean
  
  /** Storage configuration */
  store: StoreConfig
  
  /** Minimum importance score to store long-term */
  minImportance?: number
}

/**
 * Scoring configuration
 */
export interface ScoringConfig {
  /** Weight for recency (0-1) */
  recencyWeight?: number
  
  /** Weight for frequency (0-1) */
  frequencyWeight?: number
  
  /** Weight for relevance (0-1) */
  relevanceWeight?: number
  
  /** Weight for importance (0-1) */
  importanceWeight?: number
  
  /** Time decay configuration */
  timeDecay?: {
    enabled: boolean
    halfLife: number  // milliseconds
  }
}

/**
 * Summarization configuration
 */
export interface SummarizationConfig {
  /** Provider */
  provider?: 'openai' | 'anthropic' | 'local'
  
  /** Model */
  model?: string
  
  /** API key */
  apiKey?: string
  
  /** Auto-summarize */
  auto?: boolean
  
  /** Summarization prompt template */
  promptTemplate?: string
}

/**
 * Token budget configuration
 */
export interface TokenBudgetConfig {
  /** Maximum tokens */
  maxTokens: number
  
  /** Reserve tokens for system prompts */
  reserveTokens?: number
  
  /** Selection strategy */
  strategy?: 'priority' | 'recent' | 'balanced'
}

/**
 * Main configuration
 */
export interface MemoryConfig {
  /** Context identifier (user, session, etc.) */
  context?: string
  
  /** Embedding configuration */
  embedding?: EmbeddingConfig
  
  /** Storage configuration */
  store?: StoreConfig
  
  /** Short-term memory configuration */
  shortTerm?: ShortTermConfig
  
  /** Long-term memory configuration */
  longTerm?: LongTermConfig
  
  /** Scoring configuration */
  scoring?: ScoringConfig
  
  /** Summarization configuration */
  summarizer?: SummarizationConfig
  
  /** Token budget configuration */
  tokenBudget?: TokenBudgetConfig
  
  /** Target model for optimization */
  targetModel?: string
  
  /** Context format */
  contextFormat?: 'openai' | 'anthropic' | 'claude'
}

// ============================================================================
// Store Types
// ============================================================================

/**
 * Search options
 */
export interface SearchOptions {
  /** Maximum number of results */
  limit?: number
  
  /** Minimum score threshold */
  minScore?: number
  
  /** Filters */
  filters?: Record<string, unknown>
  
  /** Sort by */
  sortBy?: 'relevance' | 'recency' | 'importance'
}

/**
 * Store statistics
 */
export interface StoreStats {
  /** Total number of memories */
  totalMemories: number
  
  /** Total tokens */
  totalTokens: number
  
  /** Oldest memory timestamp */
  oldestMemory?: Date
  
  /** Newest memory timestamp */
  newestMemory?: Date
  
  /** Average importance score */
  averageImportance: number
}

/**
 * Base store interface
 */
export interface MemoryStore {
  /** Initialize the store */
  init(): Promise<void>
  
  /** Add a memory item */
  add(item: MemoryItem): Promise<void>
  
  /** Get a memory item by ID */
  get(id: string): Promise<MemoryItem | null>
  
  /** Search memories */
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>
  
  /** Update a memory item */
  update(id: string, updates: Partial<MemoryItem>): Promise<void>
  
  /** Delete a memory item */
  delete(id: string): Promise<void>
  
  /** Get all memories */
  getAll(): Promise<MemoryItem[]>
  
  /** Clear all memories */
  clear(): Promise<void>
  
  /** Get statistics */
  stats(): Promise<StoreStats>
  
  /** Close the store */
  close(): Promise<void>
}

// ============================================================================
// Embedding Types
// ============================================================================

/**
 * Base embedder interface
 */
export interface Embedder {
  /** Embed a single text */
  embed(text: string): Promise<number[]>
  
  /** Embed multiple texts */
  embedBatch(texts: string[]): Promise<number[][]>
  
  /** Get embedding dimensions */
  getDimensions(): number
}

// ============================================================================
// Scoring Types
// ============================================================================

/**
 * Base scorer interface
 */
export interface Scorer {
  /** Score a memory item */
  score(memory: MemoryItem, query?: string): Promise<number>
  
  /** Score multiple memory items */
  scoreBatch(memories: MemoryItem[], query?: string): Promise<number[]>
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Memory error class
 */
export class MemoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public cause?: Error
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

export type MemoryErrorCode = typeof MemoryErrorCodes[keyof typeof MemoryErrorCodes]
