/**
 * Advanced Memory & Context Type Definitions
 * 
 * Implements hybrid memory architecture with episodic, semantic, short-term, and long-term memory layers
 * Based on production-ready patterns for AI chat applications
 */

/**
 * Memory scope defines the persistence level
 */
export type MemoryScope = 'session' | 'thread' | 'global'

/**
 * Memory type defines the nature of stored information
 */
export type MemoryType = 'episodic' | 'semantic' | 'preference' | 'fact' | 'behavior'

/**
 * Memory layer in the hybrid architecture
 */
export type MemoryLayer = 'real-time' | 'session' | 'semantic' | 'episodic'

/**
 * Episodic Memory - Stores specific events with temporal context
 */
export interface EpisodicMemory {
  id: string
  userId: string
  timestamp: Date
  conversation: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
  context: {
    topic?: string
    sentiment?: 'positive' | 'neutral' | 'negative'
    decisionMade?: boolean
    importanceScore?: number
  }
  metadata?: Record<string, any>
}

/**
 * Semantic Memory - Stores compressed, generalized knowledge
 */
export interface SemanticMemory {
  id: string
  userId: string
  preferenceType?: string
  preferenceValue?: string
  knowledge?: string
  confidence: number
  context?: string
  lastUpdated: Date
  supportingEpisodes: string[] // References to episodic memories
  metadata?: Record<string, any>
}

/**
 * Unified Memory Item for display and management
 */
export interface MemoryItem {
  id: string
  userId: string
  label: string
  value: string
  scope: MemoryScope
  type: MemoryType
  layer: MemoryLayer
  confidence?: number
  source?: string
  lastUpdated: Date
  tokens?: number
  importanceScore?: number
  embedding?: number[] // Vector embedding for semantic search
  metadata?: Record<string, any>
}

/**
 * Memory retrieval options
 */
export interface MemoryRetrievalOptions {
  userId: string
  query?: string
  maxResults?: number
  minConfidence?: number
  scope?: MemoryScope[]
  type?: MemoryType[]
  layer?: MemoryLayer[]
  includeEmbeddings?: boolean
}

/**
 * Memory storage options
 */
export interface MemoryStorageOptions {
  userId: string
  compress?: boolean
  summarize?: boolean
  promoteToGlobal?: boolean
  importanceThreshold?: number
}

/**
 * Memory buffer configuration
 */
export interface MemoryBufferConfig {
  bufferSize: number
  summaryThreshold: number
  compressionRatio: number
  minTokensToCompress: number
}

/**
 * Context optimization result
 */
export interface OptimizedContext {
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
  totalTokens: number
  compressionRatio?: number
  layersUsed: MemoryLayer[]
  retrievedMemories: MemoryItem[]
}

/**
 * Memory statistics
 */
export interface MemoryStats {
  totalMemories: number
  byScope: Record<MemoryScope, number>
  byType: Record<MemoryType, number>
  byLayer: Record<MemoryLayer, number>
  totalTokens: number
  averageConfidence: number
  oldestMemory?: Date
  newestMemory?: Date
}

/**
 * Vector database metadata for memory storage
 */
export interface MemoryVectorMetadata {
  userId: string
  timestamp: string
  chunkIndex: number
  totalChunks: number
  memoryType: MemoryType
  topic?: string
  sentiment?: string
  importanceScore: number
  scope: MemoryScope
  layer: MemoryLayer
}
