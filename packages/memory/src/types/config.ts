/**
 * Configuration Types
 *
 * Defines memory system configuration options
 */

import type { MemoryType } from './memory.js'

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

/** Local budget config. @see CanonicalTokenBudgetConfig in @clarity-chat/token-optimization for cross-package use */
export interface TokenBudgetConfig {
  /** Maximum context window size */
  maxContextWindow: number

  /** Token allocation */
  allocation: TokenAllocation

  /** Enable dynamic allocation */
  dynamicAllocation?: boolean
}

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
 * Context bundle containing selected memories and metadata
 */
export interface ContextBundle {
  /** Selected memories */
  memories: import('./memory.js').MemoryItem[]

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
  semanticMemories?: import('./memory.js').MemoryItem[]

  /** Episodic memories (filtered) */
  episodicMemories?: import('./memory.js').MemoryItem[]

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

  /**
   * Importance scoring configuration
   *
   * When enabled, uses multi-factor scoring for intelligent retrieval:
   * - Base importance (user-defined or default)
   * - Recency (exponential decay)
   * - Access frequency
   * - Semantic relevance (when query provided)
   * - Scope boost (user-scoped memories prioritized)
   */
  importanceScoring?: {
    /** Enable importance-based re-ranking (default: false) */
    enabled?: boolean
    /** Half-life for recency decay in days (default: 7) */
    recencyHalfLife?: number
    /** Maximum accesses for frequency normalization (default: 10) */
    maxFrequencyAccesses?: number
    /** Weight configuration for scoring components */
    weights?: {
      base?: number
      recency?: number
      frequency?: number
      relevance?: number
    }
  }

  /**
   * Streaming behavior configuration
   *
   * Controls how streaming messages are captured to memory
   */
  streaming?: {
    /** Store aborted messages to memory (default: false) */
    storeAbortedMessages?: boolean
    /** Store error messages to memory (default: false) */
    storeErrorMessages?: boolean
    /** Enable deduplication for regenerated messages (default: true) */
    deduplicate?: boolean
    /** Similarity threshold for deduplication (default: 0.95) */
    deduplicateThreshold?: number
    /** Time window for deduplication in ms (default: 60000 = 1 minute) */
    deduplicateWindow?: number
  }

  /**
   * Tool integration configuration
   *
   * Controls automatic capture of tool calls and outputs
   */
  toolIntegration?: {
    /** Automatically capture tool calls (default: false) */
    captureToolCalls?: boolean
    /** Automatically capture tool outputs (default: false) */
    captureToolOutputs?: boolean
    /** Filter which tools to capture (default: capture all) */
    toolCaptureFilter?: (toolName: string) => boolean
    /** Maximum tokens per tool memory (default: 500) */
    maxTokensPerTool?: number
    /** Maximum total tokens for tool memories (default: 5000) */
    maxTotalToolTokens?: number
    /** Auto-summarize large tool outputs (default: true) */
    autoSummarize?: boolean
  }
}

/**
 * Alias for MemoryServiceConfig (backward compatibility)
 */
export type MemoryConfig = MemoryServiceConfig
