/**
 * Core Memory Types
 *
 * Defines the fundamental memory structures and operations
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
    /** Message ID (for streaming messages) */
    messageId?: string
    /** Message role (for streaming messages) */
    role?: 'user' | 'assistant' | 'system' | 'tool'
    /** Completion status (for streaming messages) */
    completionStatus?: 'complete' | 'aborted' | 'error'
    /** Error message (if completionStatus is 'error') */
    errorMessage?: string
    /** Whether this was auto-captured */
    autoCapture?: boolean
    /** Tool name (for tool memories) */
    toolName?: string
    /** Tool parameters (for tool memories) */
    toolParams?: any
    /** Tool result (for tool memories) */
    toolResult?: any
    /** Tool type (for tool memories) */
    toolType?: 'api' | 'database' | 'computation' | 'external' | 'utility'
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

  /** Track access (updates accessCount and lastAccessed) - default: false for pure reads */
  trackAccess?: boolean
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

/**
 * Data export result - complete user data export (GDPR Article 20: Data Portability)
 *
 * Provides all personal data in a structured, machine-readable format.
 * Required for GDPR Article 20 compliance.
 */
export interface DataExportResult {
  /** User ID whose data was exported */
  userId: string
  /** Timestamp of export operation */
  timestamp: Date
  /** Export format version */
  formatVersion: string
  /** Exported data */
  data: {
    /** All memories belonging to user */
    memories: MemoryItem[]
    /** Consent history */
    consentHistory?: Array<{
      type: 'granted' | 'withdrawn'
      purposes: string[]
      timestamp: Date
      version: string
    }>
    /** Audit trail (if requested) */
    auditTrail?: Array<{
      eventType: string
      timestamp: Date
      description: string
      metadata: Record<string, unknown>
    }>
    /** User profile data */
    profile?: Record<string, unknown>
  }
  /** Summary statistics */
  summary: {
    /** Total memories exported */
    memoriesCount: number
    /** Total embeddings exported */
    embeddingsCount: number
    /** Total data size (bytes) */
    dataSizeBytes: number
    /** Consent events count */
    consentEventsCount: number
    /** Audit logs count */
    auditLogsCount: number
  }
  /** Export options used */
  options: DataExportOptions
}

/**
 * Data export options - configure what to include in export
 */
export interface DataExportOptions {
  /** Include embeddings (can be large) */
  includeEmbeddings?: boolean
  /** Include consent history */
  includeConsentHistory?: boolean
  /** Include audit trail */
  includeAuditTrail?: boolean
  /** Include profile data */
  includeProfile?: boolean
  /** Export format */
  format?: 'json' | 'csv'
  /** Pretty print JSON (default: true) */
  prettyPrint?: boolean
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

// ============================================================================
// Type Aliases for Backward Compatibility
// ============================================================================

/**
 * Alias for MemoryItem (backward compatibility)
 */
export type Memory = MemoryItem

/**
 * Alias for MemorySearchResult (backward compatibility)
 */
export type SearchResult = MemorySearchResult
