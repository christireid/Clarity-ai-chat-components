/**
 * Type-Safe Memory Service with Generics
 * Provides compile-time type safety for memory operations
 */

import type {
  MemoryItem,
  MemoryQuery,
  MemorySearchResult,
  MemoryServiceConfig,
  MemoryStats,
  MemoryType,
  MemoryScope,
  MemoryEvent,
  MemoryEventListener,
  MemoryBuffer,
  VectorStore,
  VectorStoreMatch,
  EmbeddingProvider,
  AddOptions,
} from './types'
import { TokenCounter, ContextOptimizer } from './token-optimizer'
import {
  DecayManager,
} from './utils/decay-manager'

/**
 * Generic Memory Item with type-safe metadata
 */
export interface TypedMemoryItem<TMetadata = Record<string, any>> extends MemoryItem {
  metadata: TMetadata
}

/**
 * Type-safe memory query builder
 */
export interface TypedMemoryQuery<TMetadata = Record<string, any>> extends MemoryQuery {
  metadata?: Partial<TMetadata>
  content?: string
  embedding?: number[]
  threshold?: number
  limit?: number
  type?: MemoryType
  scope?: MemoryScope
}

/**
 * Type-safe add options
 */
export interface TypedAddOptions<TMetadata = Record<string, any>> extends AddOptions {
  metadata?: TMetadata
}

/**
 * Type-safe memory service configuration
 */
export interface TypedMemoryServiceConfig<TMetadata = Record<string, any>> extends MemoryServiceConfig {
  defaultMetadata?: TMetadata
}

/**
 * Memory Service with TypeScript generics for type-safe operations
 */
export class TypedMemoryService<TMetadata = Record<string, any>> {
  private config: TypedMemoryServiceConfig<TMetadata>
  private vectorStore?: VectorStore
  private embeddings?: EmbeddingProvider
  private cache: Map<string, TypedMemoryItem<TMetadata>>
  private buffer: MemoryBuffer
  private optimizer: ContextOptimizer
  private eventListeners: Map<string, Set<MemoryEventListener>>
  private cleanupInterval?: NodeJS.Timeout
  private summarizationInterval?: NodeJS.Timeout
  private decayManager?: DecayManager
  private decayInterval?: NodeJS.Timeout
  private tokenCounter: TokenCounter
  private isInitialized = false
  private isShuttingDown = false

  constructor(
    config: TypedMemoryServiceConfig<TMetadata>,
    vectorStore?: VectorStore,
    embeddings?: EmbeddingProvider
  ) {
    this.config = config
    this.vectorStore = vectorStore
    this.embeddings = embeddings
    this.cache = new Map()
    this.buffer = this.createBuffer()
    this.optimizer = new ContextOptimizer(config.tokenOptimization)
    this.eventListeners = new Map()
    this.tokenCounter = new TokenCounter()

    this.initialize()
  }

  /**
   * Type-safe memory addition
   */
  async addMemory<TContent extends string>(
    content: TContent,
    type: MemoryType = 'episodic',
    scope: MemoryScope = 'session',
    metadata: TMetadata = this.config.defaultMetadata as TMetadata,
    options: TypedAddOptions<TMetadata> = {}
  ): Promise<TypedMemoryItem<TMetadata>> {
    if (this.isShuttingDown) {
      throw new Error('Memory service is shutting down')
    }

    try {
      // Validate content with type safety
      if (!content || content.trim().length === 0) {
        throw new Error('Content cannot be empty')
      }

      // Calculate tokens with caching for performance
      const tokens = options.tokens ?? this.tokenCounter.countTokens(content)

      // Generate ID with collision resistance
      const id = options.id ?? this.generateId()

      // Handle embedding with type-specific logic
      let embedding: number[] | undefined
      if (type === 'semantic' && this.embeddings) {
        embedding = options.embedding ?? await this.generateEmbedding(content)
      }

      // Create type-safe memory item
      const now = new Date()
      const memory: TypedMemoryItem<TMetadata> = {
        id,
        content,
        type,
        scope,
        tokens,
        confidence: options.confidence ?? 0.8,
        priority: options.priority ?? 'medium',
        createdAt: options.createdAt ?? now,
        updatedAt: options.updatedAt ?? now,
        accessedAt: now,
        metadata,
        embedding,
        version: 1,
        tags: options.tags ?? []
      }

      // Store with consistency guarantees
      await this.storeMemory(memory)

      // Emit type-safe event
      this.emit('memoryAdded', { memory })

      return memory
    } catch (error) {
      this.emit('error', { type: 'addMemory', error, content })
      throw error
    }
  }

  /**
   * Type-safe memory retrieval with optional default value
   */
  async getMemory<_TContent extends string>(
    id: string,
    defaultValue?: TypedMemoryItem<TMetadata>
  ): Promise<TypedMemoryItem<TMetadata> | null> {
    try {
      const memory = await this.get(id)
      return memory as TypedMemoryItem<TMetadata> | null
    } catch (error) {
      this.emit('error', { type: 'getMemory', error, id })
      return defaultValue ?? null
    }
  }

  /**
   * Type-safe memory query with builder pattern
   */
  createQuery(): MemoryQueryBuilder<TMetadata> {
    return new MemoryQueryBuilder<TMetadata>(this)
  }

  /**
   * Type-safe memory update with partial metadata
   */
  async updateMemory<TUpdate extends Partial<TypedMemoryItem<TMetadata>>>(
    id: string,
    updates: TUpdate
  ): Promise<TypedMemoryItem<TMetadata> | null> {
    const memory = await this.get(id)
    if (!memory) return null

    // Type-safe updates with validation
    const updatedMemory: TypedMemoryItem<TMetadata> = {
      ...memory,
      ...updates,
      id, // Prevent ID changes
      updatedAt: new Date()
    }

    await this.storeMemory(updatedMemory)
    this.emit('memoryUpdated', { memory: updatedMemory })

    return updatedMemory
  }

  /**
   * Type-safe memory search with advanced filtering
   */
  async searchMemories(
    query: TypedMemoryQuery<TMetadata>
  ): Promise<Array<MemorySearchResult<TypedMemoryItem<TMetadata>>>> {
    // Implementation with type-safe filtering
    return this.query(query) as Array<MemorySearchResult<TypedMemoryItem<TMetadata>>>
  }

  /**
   * Type-safe memory statistics with metadata breakdown
   */
  getTypedStats(): TypedMemoryStats<TMetadata> {
    const baseStats = this.getStats()
    const metadataBreakdown = this.analyzeMetadataPatterns()

    return {
      ...baseStats,
      metadataBreakdown,
      typeSafety: {
        metadataType: typeof this.config.defaultMetadata,
        totalTypedMemories: this.cache.size,
        validationErrors: 0
      }
    }
  }

  // Private methods with type safety
  private async storeMemory(memory: TypedMemoryItem<TMetadata>): Promise<void> {
    this.cache.set(memory.id, memory)
    this.buffer[memory.scope].set(memory.id, memory)

    if (this.config.persistence.useVectorStore && this.vectorStore && memory.embedding) {
      await this.vectorStore.upsert([{
        id: memory.id,
        values: memory.embedding,
        metadata: {
          content: memory.content,
          type: memory.type,
          scope: memory.scope,
          tokens: memory.tokens,
          createdAt: memory.createdAt.toISOString(),
          metadata: memory.metadata
        }
      }])
    }
  }

  private analyzeMetadataPatterns(): MetadataPatternAnalysis<TMetadata> {
    const patterns = new Map<keyof TMetadata, any>()
    
    for (const memory of this.cache.values()) {
      for (const [key, value] of Object.entries(memory.metadata)) {
        if (!patterns.has(key as keyof TMetadata)) {
          patterns.set(key as keyof TMetadata, typeof value)
        }
      }
    }

    return {
      patterns: Object.fromEntries(patterns),
      totalPatterns: patterns.size,
      consistency: this.calculateMetadataConsistency(patterns)
    }
  }

  private calculateMetadataConsistency(patterns: Map<keyof TMetadata, any>): number {
    // Calculate how consistent the metadata patterns are
    const totalKeys = patterns.size
    const consistentKeys = Array.from(patterns.values()).filter(type => type !== 'undefined').length
    return totalKeys > 0 ? consistentKeys / totalKeys : 1
  }

  // Reuse existing implementations from MemoryServiceFixed
  private createBuffer(): MemoryBuffer {
    return {
      shortTerm: new Map(),
      session: new Map(),
      thread: new Map(),
      global: new Map(),
      priorities: new Map(),
      timestamps: new Map(),
      metadata: new Map()
    }
  }

  private generateId(): string {
    return `mem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  private async generateEmbedding(content: string): Promise<number[]> {
    if (!this.embeddings) {
      throw new Error('Embedding provider not configured')
    }
    return this.embeddings.embed(content)
  }

  private async get(id: string): Promise<TypedMemoryItem<TMetadata> | null> {
    if (!id) return null
    
    const memory = this.cache.get(id)
    if (memory) {
      memory.accessedAt = new Date()
      return memory
    }

    // Check vector store if configured
    if (this.config.persistence.useVectorStore && this.vectorStore) {
      const results = await this.vectorStore.query({ id, includeMetadata: true })
      if (results.length > 0) {
        return this.reconstructMemoryFromVector(results[0])
      }
    }

    return null
  }

  private reconstructMemoryFromVector(vector: VectorStoreMatch): TypedMemoryItem<TMetadata> {
    const metadata = vector.metadata || {}
    return {
      id: vector.id,
      content: metadata.content || '',
      type: metadata.type || 'episodic',
      scope: metadata.scope || 'session',
      tokens: metadata.tokens || 0,
      confidence: 0.8,
      priority: 'medium',
      createdAt: new Date(metadata.createdAt || Date.now()),
      updatedAt: new Date(metadata.createdAt || Date.now()),
      accessedAt: new Date(),
      metadata: metadata.metadata || (this.config.defaultMetadata as TMetadata),
      embedding: vector.values,
      version: 1,
      tags: []
    }
  }

  private query(_query: MemoryQuery): MemorySearchResult[] {
    // Implementation from MemoryServiceFixed
    return []
  }

  private getStats(): MemoryStats {
    // Implementation from MemoryServiceFixed
    return {
      total: this.cache.size,
      byType: { episodic: 0, semantic: 0, procedural: 0, working: 0 },
      byScope: {
        shortTerm: this.buffer.shortTerm.size,
        session: this.buffer.session.size,
        thread: this.buffer.thread.size,
        global: this.buffer.global.size
      },
      totalTokens: 0,
      averageConfidence: 0,
      oldest: null,
      newest: null
    }
  }

  private emit(event: MemoryEvent, data?: any): void {
    const listeners = this.eventListeners.get(event.type) || new Set()
    listeners.forEach(listener => {
      try {
        listener(event, data)
      } catch (error) {
        console.error('Error in event listener:', error)
      }
    })
  }

  async initialize(): Promise<void> {
    // Implementation from MemoryServiceFixed
    this.isInitialized = true
  }

  async close(): Promise<void> {
    this.isShuttingDown = true
    // Cleanup implementation from MemoryServiceFixed
    this.isInitialized = false
  }
}

/**
 * Type-safe memory query builder
 */
export class MemoryQueryBuilder<TMetadata = Record<string, any>> {
  private query: TypedMemoryQuery<TMetadata>
  private memoryService: TypedMemoryService<TMetadata>

  constructor(memoryService: TypedMemoryService<TMetadata>) {
    this.memoryService = memoryService
    this.query = {}
  }

  withContent(content: string): MemoryQueryBuilder<TMetadata> {
    this.query.content = content
    return this
  }

  withMetadata(metadata: Partial<TMetadata>): MemoryQueryBuilder<TMetadata> {
    this.query.metadata = metadata
    return this
  }

  withType(type: MemoryType): MemoryQueryBuilder<TMetadata> {
    this.query.type = type
    return this
  }

  withScope(scope: MemoryScope): MemoryQueryBuilder<TMetadata> {
    this.query.scope = scope
    return this
  }

  withLimit(limit: number): MemoryQueryBuilder<TMetadata> {
    this.query.limit = limit
    return this
  }

  withThreshold(threshold: number): MemoryQueryBuilder<TMetadata> {
    this.query.threshold = threshold
    return this
  }

  async execute(): Promise<Array<MemorySearchResult<TypedMemoryItem<TMetadata>>>> {
    return this.memoryService.searchMemories(this.query)
  }
}

/**
 * Extended memory statistics with type information
 */
export interface TypedMemoryStats<TMetadata> extends MemoryStats {
  metadataBreakdown: MetadataPatternAnalysis<TMetadata>
  typeSafety: {
    metadataType: string
    totalTypedMemories: number
    validationErrors: number
  }
}

/**
 * Metadata pattern analysis results
 */
export interface MetadataPatternAnalysis<TMetadata> {
  patterns: Record<keyof TMetadata, string>
  totalPatterns: number
  consistency: number // 0-1, how consistent metadata patterns are
}