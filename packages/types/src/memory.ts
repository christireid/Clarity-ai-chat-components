/**
 * Advanced Memory & Context Type Definitions
 *
 * This module provides type definitions for the Clarity Chat memory system,
 * implementing a hybrid memory architecture with episodic and semantic layers.
 *
 * @remarks
 * NOTE: This file contains simplified type definitions for basic use cases.
 * For full memory system types with all features, use @clarity-chat/memory:
 *
 * ```typescript
 * import type { MemoryItem, MemoryConfig, MemoryService } from '@clarity-chat/memory'
 * ```
 *
 * The types in this file are maintained for backward compatibility and provide
 * a minimal interface for consumers who don't need the full memory package.
 *
 * @packageDocumentation
 */

/**
 * Memory scope defines the persistence level.
 *
 * @remarks
 * - `session`: Memory persists only for the current browser session
 * - `thread`: Memory persists within a conversation thread
 * - `global`: Memory persists across all sessions and threads
 */
export type MemoryScope = 'session' | 'thread' | 'global'

/**
 * Memory type defines the nature of stored information.
 *
 * @remarks
 * - `episodic`: Specific events with temporal context
 * - `semantic`: Compressed, generalized knowledge
 * - `preference`: User preferences and settings
 * - `fact`: Verified factual information
 * - `behavior`: Observed user behavior patterns
 */
export type MemoryType =
  | 'episodic'
  | 'semantic'
  | 'preference'
  | 'fact'
  | 'behavior'

/**
 * Memory layer in the hybrid architecture.
 *
 * @remarks
 * - `real-time`: Immediate context from current conversation
 * - `session`: Short-term memory for current session
 * - `semantic`: Long-term compressed knowledge
 * - `episodic`: Long-term specific event memories
 */
export type MemoryLayer = 'real-time' | 'session' | 'semantic' | 'episodic'

/**
 * Episodic Memory - Stores specific events with temporal context.
 *
 * @remarks
 * Episodic memories capture specific conversations and events,
 * preserving temporal context and emotional/contextual metadata.
 *
 * @example
 * ```typescript
 * const episode: EpisodicMemory = {
 *   id: 'ep-1',
 *   userId: 'user-1',
 *   timestamp: new Date(),
 *   conversation: [
 *     { role: 'user', content: 'Can you help me with React?' },
 *     { role: 'assistant', content: 'Of course! What do you need?' },
 *   ],
 *   context: {
 *     topic: 'React development',
 *     sentiment: 'positive',
 *     importanceScore: 0.8,
 *   },
 * }
 * ```
 */
export interface EpisodicMemory {
  /** Unique memory identifier */
  id: string
  /** ID of the user this memory belongs to */
  userId: string
  /** When this episode occurred */
  timestamp: Date
  /** The conversation exchange */
  conversation: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
  /** Contextual metadata about the episode */
  context: {
    /** Topic or subject of the conversation */
    topic?: string
    /** Overall sentiment of the exchange */
    sentiment?: 'positive' | 'neutral' | 'negative'
    /** Whether a decision was made during this episode */
    decisionMade?: boolean
    /** Importance score (0-1) for retrieval ranking */
    importanceScore?: number
  }
  /** Additional custom metadata (requires type narrowing) */
  metadata?: Record<string, unknown>
}

/**
 * Semantic Memory - Stores compressed, generalized knowledge.
 *
 * @remarks
 * Semantic memories represent distilled knowledge extracted from
 * multiple episodic memories, with confidence scores and references.
 *
 * @example
 * ```typescript
 * const semantic: SemanticMemory = {
 *   id: 'sem-1',
 *   userId: 'user-1',
 *   knowledge: 'User prefers TypeScript over JavaScript',
 *   confidence: 0.9,
 *   lastUpdated: new Date(),
 *   supportingEpisodes: ['ep-1', 'ep-5', 'ep-12'],
 * }
 * ```
 */
export interface SemanticMemory {
  /** Unique memory identifier */
  id: string
  /** ID of the user this memory belongs to */
  userId: string
  /** Type of preference (for preference memories) */
  preferenceType?: string
  /** Value of preference (for preference memories) */
  preferenceValue?: string
  /** Generalized knowledge statement */
  knowledge?: string
  /** Confidence score (0-1) in this knowledge */
  confidence: number
  /** Additional context about this knowledge */
  context?: string
  /** When this memory was last updated */
  lastUpdated: Date
  /** IDs of episodic memories supporting this knowledge */
  supportingEpisodes: string[]
  /** Additional custom metadata (requires type narrowing) */
  metadata?: Record<string, unknown>
}

/**
 * Unified Memory Item for display and management.
 *
 * @remarks
 * This is the primary type for representing memories across the system,
 * regardless of their underlying storage format.
 *
 * @example
 * ```typescript
 * const memory: MemoryItem = {
 *   id: 'mem-1',
 *   userId: 'user-1',
 *   label: 'Programming Language Preference',
 *   value: 'Prefers TypeScript for all projects',
 *   scope: 'global',
 *   type: 'preference',
 *   layer: 'semantic',
 *   confidence: 0.95,
 *   lastUpdated: new Date(),
 * }
 * ```
 */
export interface MemoryItem {
  /** Unique memory identifier */
  id: string
  /** ID of the user this memory belongs to */
  userId: string
  /** Human-readable label for the memory */
  label: string
  /** The memory content/value */
  value: string
  /** Persistence scope of this memory */
  scope: MemoryScope
  /** Type/category of this memory */
  type: MemoryType
  /** Architecture layer this memory belongs to */
  layer: MemoryLayer
  /** Confidence score (0-1) */
  confidence?: number
  /** Source of this memory (e.g., conversation ID) */
  source?: string
  /** When this memory was last updated */
  lastUpdated: Date
  /** Estimated token count for this memory */
  tokens?: number
  /** Importance score (0-1) for retrieval ranking */
  importanceScore?: number
  /** Vector embedding for semantic search */
  embedding?: number[]
  /** Additional custom metadata (requires type narrowing) */
  metadata?: Record<string, unknown>
}

/**
 * Options for retrieving memories.
 *
 * @example
 * ```typescript
 * const options: MemoryRetrievalOptions = {
 *   userId: 'user-1',
 *   query: 'programming preferences',
 *   maxResults: 10,
 *   minConfidence: 0.7,
 *   scope: ['global'],
 *   type: ['preference', 'fact'],
 * }
 * ```
 */
export interface MemoryRetrievalOptions {
  /** User ID to retrieve memories for */
  userId: string
  /** Semantic search query */
  query?: string
  /** Maximum number of results to return */
  maxResults?: number
  /** Minimum confidence threshold (0-1) */
  minConfidence?: number
  /** Filter by memory scopes */
  scope?: MemoryScope[]
  /** Filter by memory types */
  type?: MemoryType[]
  /** Filter by memory layers */
  layer?: MemoryLayer[]
  /** Include vector embeddings in results */
  includeEmbeddings?: boolean
}

/**
 * Options for storing memories.
 *
 * @example
 * ```typescript
 * const options: MemoryStorageOptions = {
 *   userId: 'user-1',
 *   compress: true,
 *   summarize: true,
 *   promoteToGlobal: false,
 *   importanceThreshold: 0.7,
 * }
 * ```
 */
export interface MemoryStorageOptions {
  /** User ID to store memory for */
  userId: string
  /** Whether to compress the memory content */
  compress?: boolean
  /** Whether to generate a summary */
  summarize?: boolean
  /** Whether to promote to global scope */
  promoteToGlobal?: boolean
  /** Minimum importance to store (0-1) */
  importanceThreshold?: number
}

/**
 * Configuration for the memory buffer.
 *
 * @example
 * ```typescript
 * const config: MemoryBufferConfig = {
 *   bufferSize: 100,
 *   summaryThreshold: 50,
 *   compressionRatio: 0.5,
 *   minTokensToCompress: 1000,
 * }
 * ```
 */
export interface MemoryBufferConfig {
  /** Maximum number of items in buffer */
  bufferSize: number
  /** Number of items before triggering summarization */
  summaryThreshold: number
  /** Target compression ratio (0-1) */
  compressionRatio: number
  /** Minimum tokens before compression is applied */
  minTokensToCompress: number
}

/**
 * Result of context optimization.
 *
 * @remarks
 * Returned when the memory system optimizes context for an LLM call,
 * including selected messages and retrieved memories.
 *
 * @example
 * ```typescript
 * const result: OptimizedContext = {
 *   messages: [
 *     { role: 'system', content: 'You are a helpful assistant.' },
 *     { role: 'user', content: 'Hello!' },
 *   ],
 *   totalTokens: 150,
 *   compressionRatio: 0.7,
 *   layersUsed: ['real-time', 'semantic'],
 *   retrievedMemories: [],
 * }
 * ```
 */
export interface OptimizedContext {
  /** Optimized message array for LLM */
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
  /** Total token count of the context */
  totalTokens: number
  /** Compression ratio achieved (0-1) */
  compressionRatio?: number
  /** Memory layers used in optimization */
  layersUsed: MemoryLayer[]
  /** Memories retrieved and included */
  retrievedMemories: MemoryItem[]
}

/**
 * Statistics about stored memories.
 *
 * @example
 * ```typescript
 * const stats: MemoryStats = {
 *   totalMemories: 150,
 *   byScope: { session: 50, thread: 30, global: 70 },
 *   byType: { episodic: 40, semantic: 60, preference: 20, fact: 20, behavior: 10 },
 *   byLayer: { 'real-time': 10, session: 40, semantic: 60, episodic: 40 },
 *   totalTokens: 50000,
 *   averageConfidence: 0.85,
 * }
 * ```
 */
export interface MemoryStats {
  /** Total number of stored memories */
  totalMemories: number
  /** Count by scope */
  byScope: Record<MemoryScope, number>
  /** Count by type */
  byType: Record<MemoryType, number>
  /** Count by layer */
  byLayer: Record<MemoryLayer, number>
  /** Total tokens across all memories */
  totalTokens: number
  /** Average confidence score */
  averageConfidence: number
  /** Timestamp of oldest memory */
  oldestMemory?: Date
  /** Timestamp of newest memory */
  newestMemory?: Date
}

/**
 * Metadata for vector database storage.
 *
 * @remarks
 * Used when storing memories in a vector database for semantic search.
 *
 * @example
 * ```typescript
 * const vectorMeta: MemoryVectorMetadata = {
 *   userId: 'user-1',
 *   timestamp: new Date().toISOString(),
 *   chunkIndex: 0,
 *   totalChunks: 1,
 *   memoryType: 'semantic',
 *   importanceScore: 0.9,
 *   scope: 'global',
 *   layer: 'semantic',
 * }
 * ```
 */
export interface MemoryVectorMetadata {
  /** User ID */
  userId: string
  /** ISO timestamp string */
  timestamp: string
  /** Index of this chunk (for split memories) */
  chunkIndex: number
  /** Total number of chunks */
  totalChunks: number
  /** Type of memory */
  memoryType: MemoryType
  /** Topic of the memory */
  topic?: string
  /** Sentiment classification */
  sentiment?: string
  /** Importance score (0-1) */
  importanceScore: number
  /** Persistence scope */
  scope: MemoryScope
  /** Architecture layer */
  layer: MemoryLayer
}
