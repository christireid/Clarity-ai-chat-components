/**
 * Local memory utility types
 * These are UI-focused memory types used by the React package utils
 */

export type MemoryScope = 'session' | 'thread' | 'global' | 'user'
export type MemoryType = 'episodic' | 'semantic' | 'preference' | 'fact' | 'behavior'
export type MemoryLayer = 'real-time' | 'session' | 'semantic' | 'episodic'

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
  embedding?: number[]
  metadata?: Record<string, any>
}

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

export interface SemanticMemory {
  id: string
  userId: string
  preferenceType?: string
  preferenceValue?: string
  knowledge?: string
  confidence: number
  context?: string
  lastUpdated: Date
  supportingEpisodes: string[]
  metadata?: Record<string, any>
}

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

export interface MemoryStorageOptions {
  userId: string
  compress?: boolean
  summarize?: boolean
  promoteToGlobal?: boolean
  importanceThreshold?: number
}

export interface MemoryBufferConfig {
  bufferSize: number
  summaryThreshold: number
  compressionRatio: number
  minTokensToCompress: number
}

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

export interface CompressionOptions {
  targetRatio?: number
  preserveImportant?: boolean
  method?: 'summarization' | 'truncation' | 'semantic'
}

export interface CompressionResult {
  original: string
  compressed: string
  ratio: number
  tokens: {
    before: number
    after: number
  }
}
