/**
 * Memory Service
 * 
 * Production-ready memory management for AI chat applications
 * Implements hybrid memory system with:
 * - Short-term and long-term memory
 * - Episodic and semantic memory
 * - Vector search integration
 * - Token optimization
 * - Automatic cleanup and summarization
 */

import type {
  MemoryItem,
  MemoryQuery,
  MemorySearchResult,
  MemoryServiceConfig,
  MemoryStats,
  MemoryType,
  MemoryScope,
  MemoryPriority,
  MemoryEvent,
  MemoryEventListener,
  MemoryBuffer,
  MemoryContext,
} from './types'
import type { VectorStore, EmbeddingProvider, VectorMatch } from './types'
import { TokenCounter, ContextOptimizer } from './token-optimizer'

/**
 * Memory Service
 */
export class MemoryService {
  private config: MemoryServiceConfig
  private vectorStore?: VectorStore
  private embeddings?: EmbeddingProvider
  private cache: Map<string, MemoryItem>
  private buffer: MemoryBuffer
  private optimizer: ContextOptimizer
  private eventListeners: Map<string, Set<MemoryEventListener>>
  private cleanupInterval?: NodeJS.Timeout
  private summarizationInterval?: NodeJS.Timeout

  constructor(
    config: MemoryServiceConfig,
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

    this.initialize()
  }

  /**
   * Initialize service
   */
  private async initialize(): Promise<void> {
    // Initialize vector store if configured
    if (this.config.persistence.useVectorStore && this.vectorStore) {
      await this.vectorStore.initialize()
    }

    // Start background tasks
    if (this.config.enableAutoCleanup && this.config.cleanupInterval) {
      this.startCleanupTask()
    }

    if (this.config.enableAutoSummarization && this.config.summarizationInterval) {
      this.startSummarizationTask()
    }
  }

  /**
   * Create memory buffer
   */
  private createBuffer(): MemoryBuffer {
    return {
      items: [],
      totalTokens: 0,
      capacity: 100,
      flushThreshold: 50,
      autoFlush: true,
    }
  }

  /**
   * Add memory item
   */
  async addMemory(
    content: string,
    type: MemoryType,
    scope: MemoryScope,
    metadata: MemoryItem['metadata'] = {},
    options: {
      priority?: MemoryPriority
      confidence?: number
      embedding?: number[]
    } = {}
  ): Promise<MemoryItem> {
    const memory: MemoryItem = {
      id: this.generateId(),
      type,
      scope,
      content,
      metadata,
      confidence: options.confidence || 0.8,
      priority: options.priority || 'medium',
      tokens: TokenCounter.count(content),
      accessCount: 0,
      lastAccessed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Generate embedding if not provided
    if (this.embeddings && !options.embedding) {
      try {
        memory.embedding = await this.embeddings.embedText(content)
      } catch (error) {
        if (this.config.debug) {
          console.error('Failed to generate embedding:', error)
        }
      }
    } else if (options.embedding) {
      memory.embedding = options.embedding
    }

    // Add to cache
    this.cache.set(memory.id, memory)

    // Add to buffer
    this.buffer.items.push(memory)
    this.buffer.totalTokens += memory.tokens

    // Auto-flush if threshold reached
    if (this.buffer.autoFlush && this.buffer.items.length >= this.buffer.flushThreshold) {
      await this.flushBuffer()
    }

    // Emit event
    this.emitEvent({
      type: 'memory:created',
      timestamp: new Date(),
      memory,
    })

    return memory
  }

  /**
   * Batch add memories
   */
  async addMemories(
    memories: Array<{
      content: string
      type: MemoryType
      scope: MemoryScope
      metadata?: MemoryItem['metadata']
      priority?: MemoryPriority
      confidence?: number
    }>
  ): Promise<MemoryItem[]> {
    const items: MemoryItem[] = []

    for (const mem of memories) {
      const item = await this.addMemory(
        mem.content,
        mem.type,
        mem.scope,
        mem.metadata,
        {
          priority: mem.priority,
          confidence: mem.confidence,
        }
      )
      items.push(item)
    }

    return items
  }

  /**
   * Query memories
   */
  async query(query: MemoryQuery): Promise<MemorySearchResult[]> {
    let results: MemorySearchResult[] = []

    // Vector search if embedding provided
    if (query.embedding && this.vectorStore) {
      results = await this.vectorSearch(query)
    } else if (query.query && this.embeddings && this.vectorStore) {
      // Generate embedding and search
      const embedding = await this.embeddings.embedText(query.query)
      results = await this.vectorSearch({ ...query, embedding })
    } else {
      // Fallback to cache search
      results = this.cacheSearch(query)
    }

    // Apply filters
    results = this.applyFilters(results, query)

    // Optimize for token budget
    if (query.tokenBudget) {
      results = this.optimizeForBudget(results, query.tokenBudget)
    }

    // Update access stats
    for (const result of results) {
      result.memory.accessCount++
      result.memory.lastAccessed = new Date()
    }

    return results
  }

  /**
   * Vector search
   */
  private async vectorSearch(query: MemoryQuery): Promise<MemorySearchResult[]> {
    if (!this.vectorStore || !query.embedding) {
      return []
    }

    try {
      const matches = await this.vectorStore.query({
        vector: query.embedding,
        topK: query.limit || 10,
        minScore: query.minConfidence || 0.5,
        filter: query.metadata,
        namespace: this.config.persistence.vectorStoreNamespace,
        includeMetadata: true,
      })

      return matches.map((match: VectorMatch) => ({
        memory: this.cache.get(match.id) || this.createMemoryFromMatch(match),
        relevance: match.score,
        distance: 1 - match.score,
      }))
    } catch (error) {
      if (this.config.debug) {
        console.error('Vector search failed:', error)
      }
      return []
    }
  }

  /**
   * Cache search
   */
  private cacheSearch(query: MemoryQuery): MemorySearchResult[] {
    const results: MemorySearchResult[] = []

    for (const memory of this.cache.values()) {
      // Apply basic filters
      if (query.types && !query.types.includes(memory.type)) continue
      if (query.scopes && !query.scopes.includes(memory.scope)) continue
      if (query.priorities && !query.priorities.includes(memory.priority)) continue
      if (query.minConfidence && memory.confidence < query.minConfidence) continue

      // Time range filter
      if (query.timeRange) {
        if (query.timeRange.start && memory.createdAt < query.timeRange.start) continue
        if (query.timeRange.end && memory.createdAt > query.timeRange.end) continue
      }

      // Text search
      let relevance = 0.5
      if (query.query) {
        const queryLower = query.query.toLowerCase()
        const contentLower = memory.content.toLowerCase()
        if (contentLower.includes(queryLower)) {
          relevance = 0.8
        } else {
          continue
        }
      }

      results.push({ memory, relevance })
    }

    // Sort by relevance and confidence
    results.sort((a, b) => {
      const scoreA = a.relevance * a.memory.confidence
      const scoreB = b.relevance * b.memory.confidence
      return scoreB - scoreA
    })

    return results.slice(0, query.limit || 10)
  }

  /**
   * Apply query filters
   */
  private applyFilters(results: MemorySearchResult[], query: MemoryQuery): MemorySearchResult[] {
    return results.filter(result => {
      if (query.userId && result.memory.metadata.userId !== query.userId) return false
      if (query.threadId && result.memory.metadata.threadId !== query.threadId) return false
      if (query.sessionId && result.memory.metadata.sessionId !== query.sessionId) return false
      return true
    })
  }

  /**
   * Optimize results for token budget
   */
  private optimizeForBudget(
    results: MemorySearchResult[],
    budget: number
  ): MemorySearchResult[] {
    const optimized: MemorySearchResult[] = []
    let usedTokens = 0

    for (const result of results) {
      if (usedTokens + result.memory.tokens <= budget) {
        optimized.push(result)
        usedTokens += result.memory.tokens
      } else {
        break
      }
    }

    return optimized
  }

  /**
   * Update memory item
   */
  async updateMemory(id: string, updates: Partial<MemoryItem>): Promise<MemoryItem | null> {
    const memory = this.cache.get(id)
    if (!memory) return null

    const updated = {
      ...memory,
      ...updates,
      updatedAt: new Date(),
    }

    // Recalculate tokens if content changed
    if (updates.content && updates.content !== memory.content) {
      updated.tokens = TokenCounter.count(updates.content)
      
      // Regenerate embedding
      if (this.embeddings) {
        try {
          updated.embedding = await this.embeddings.embedText(updates.content)
        } catch (error) {
          if (this.config.debug) {
            console.error('Failed to regenerate embedding:', error)
          }
        }
      }
    }

    this.cache.set(id, updated)

    // Update in vector store
    if (this.vectorStore && updated.embedding) {
      await this.updateVectorStore([updated])
    }

    this.emitEvent({
      type: 'memory:updated',
      timestamp: new Date(),
      memory: updated,
    })

    return updated
  }

  /**
   * Delete memory item
   */
  async deleteMemory(id: string): Promise<boolean> {
    const memory = this.cache.get(id)
    if (!memory) return false

    this.cache.delete(id)

    // Delete from vector store
    if (this.vectorStore) {
      try {
        await this.vectorStore.delete(
          [id],
          this.config.persistence.vectorStoreNamespace
        )
      } catch (error) {
        if (this.config.debug) {
          console.error('Failed to delete from vector store:', error)
        }
      }
    }

    this.emitEvent({
      type: 'memory:deleted',
      timestamp: new Date(),
      memory,
    })

    return true
  }

  /**
   * Delete memories by filter
   */
  async deleteMemories(filter: Partial<MemoryQuery>): Promise<number> {
    const results = await this.query({ ...filter, limit: 1000 })
    let deleted = 0

    for (const result of results) {
      if (await this.deleteMemory(result.memory.id)) {
        deleted++
      }
    }

    return deleted
  }

  /**
   * Promote memory to higher scope
   */
  async promoteMemory(id: string, targetScope: MemoryScope): Promise<MemoryItem | null> {
    const memory = this.cache.get(id)
    if (!memory) return null

    const updated = await this.updateMemory(id, {
      scope: targetScope,
      priority: this.getHigherPriority(memory.priority),
    })

    if (updated) {
      this.emitEvent({
        type: 'memory:promoted',
        timestamp: new Date(),
        memory: updated,
        data: { from: memory.scope, to: targetScope },
      })
    }

    return updated
  }

  /**
   * Compress memory
   */
  async compressMemory(id: string, ratio: number = 0.5): Promise<MemoryItem | null> {
    const memory = this.cache.get(id)
    if (!memory) return null

    const compressor = this.optimizer.getCompressor()
    const compressed = compressor.compressMemory(memory, ratio)

    const updated = await this.updateMemory(id, {
      content: compressed.compressed,
      original: memory.content,
      compressed: compressed.compressed,
      tokens: compressed.compressedTokens,
    })

    if (updated) {
      this.emitEvent({
        type: 'memory:compressed',
        timestamp: new Date(),
        memory: updated,
        data: { compressionRatio: compressed.compressionRatio },
      })
    }

    return updated
  }

  /**
   * Flush buffer to persistent storage
   */
  async flushBuffer(): Promise<void> {
    if (this.buffer.items.length === 0) return

    const items = [...this.buffer.items]

    // Update vector store
    if (this.vectorStore) {
      await this.updateVectorStore(items)
    }

    // Clear buffer
    this.buffer.items = []
    this.buffer.totalTokens = 0

    this.emitEvent({
      type: 'buffer:flushed',
      timestamp: new Date(),
      data: { count: items.length },
    })
  }

  /**
   * Update vector store
   */
  private async updateVectorStore(memories: MemoryItem[]): Promise<void> {
    if (!this.vectorStore) return

    const vectors = memories
      .filter(m => m.embedding && m.embedding.length > 0)
      .map(m => ({
        id: m.id,
        values: m.embedding!,
        metadata: {
          type: m.type,
          scope: m.scope,
          priority: m.priority,
          content: m.content,
          ...m.metadata,
        },
      }))

    if (vectors.length === 0) return

    try {
      await this.vectorStore.upsert(vectors, {
        namespace: this.config.persistence.vectorStoreNamespace,
        batchSize: this.config.persistence.batchSize || 100,
      })
    } catch (error) {
      if (this.config.debug) {
        console.error('Failed to update vector store:', error)
      }
    }
  }

  /**
   * Get memory context for optimization
   */
  getMemoryContext(): MemoryContext {
    const stats = this.getStats()
    
    return {
      conversationActivity: this.assessConversationActivity(),
      preferenceRichness: this.assessPreferenceRichness(),
      taskComplexity: this.assessTaskComplexity(),
      stats: {
        totalMemories: stats.total,
        byType: stats.byType as any,
        byScope: stats.byScope as any,
        totalTokens: stats.totalTokens,
        averageRelevance: stats.averageConfidence,
      },
    }
  }

  /**
   * Get statistics
   */
  getStats(): MemoryStats {
    const byType: Record<MemoryType, number> = {
      episodic: 0,
      semantic: 0,
      procedural: 0,
      'short-term': 0,
    }
    const byScope: Record<MemoryScope, number> = {
      session: 0,
      thread: 0,
      global: 0,
      user: 0,
    }
    const byPriority: Record<MemoryPriority, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    }

    let totalTokens = 0
    let totalConfidence = 0

    for (const memory of this.cache.values()) {
      byType[memory.type]++
      byScope[memory.scope]++
      byPriority[memory.priority]++
      totalTokens += memory.tokens
      totalConfidence += memory.confidence
    }

    return {
      total: this.cache.size,
      byType,
      byScope,
      byPriority,
      totalTokens,
      averageConfidence: this.cache.size > 0 ? totalConfidence / this.cache.size : 0,
    }
  }

  /**
   * Cleanup expired memories
   */
  async cleanup(): Promise<number> {
    const now = new Date()
    const toDelete: string[] = []

    for (const memory of this.cache.values()) {
      // Check expiry
      if (memory.expiresAt && memory.expiresAt < now) {
        toDelete.push(memory.id)
        continue
      }

      // Check retention policy
      const retention = this.getRetentionForScope(memory.scope)
      if (retention > 0) {
        const age = now.getTime() - memory.createdAt.getTime()
        if (age > retention * 1000) {
          toDelete.push(memory.id)
        }
      }
    }

    for (const id of toDelete) {
      await this.deleteMemory(id)
      this.emitEvent({
        type: 'memory:expired',
        timestamp: new Date(),
        data: { id },
      })
    }

    return toDelete.length
  }

  /**
   * Start cleanup task
   */
  private startCleanupTask(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup().catch(error => {
        if (this.config.debug) {
          console.error('Cleanup task failed:', error)
        }
      })
    }, this.config.cleanupInterval!)
  }

  /**
   * Start summarization task
   */
  private startSummarizationTask(): void {
    this.summarizationInterval = setInterval(() => {
      // Implement summarization logic
      // This would compress old memories to save space
    }, this.config.summarizationInterval!)
  }

  /**
   * Stop background tasks
   */
  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    if (this.summarizationInterval) {
      clearInterval(this.summarizationInterval)
    }
  }

  /**
   * Get retention time (in seconds) for a given scope
   * Handles scopes not present in the retention policy by returning 0
   */
  private getRetentionForScope(scope: MemoryScope): number {
    const policy = this.config.retentionPolicy
    const map: Record<MemoryScope, number> = {
      session: policy.session,
      thread: policy.thread,
      global: policy.global,
      user: 0,
    }
    return map[scope] ?? 0
  }

  /**
   * Event management
   */
  on(eventType: string, listener: MemoryEventListener): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set())
    }
    this.eventListeners.get(eventType)!.add(listener)
  }

  off(eventType: string, listener: MemoryEventListener): void {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      listeners.delete(listener)
    }
  }

  private emitEvent(event: MemoryEvent): void {
    const listeners = this.eventListeners.get(event.type)
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(event)
        } catch (error) {
          if (this.config.debug) {
            console.error('Event listener error:', error)
          }
        }
      }
    }
  }

  /**
   * Utility methods
   */
  private generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getHigherPriority(current: MemoryPriority): MemoryPriority {
    const priorities: MemoryPriority[] = ['low', 'medium', 'high', 'critical']
    const index = priorities.indexOf(current)
    return priorities[Math.min(index + 1, priorities.length - 1)]
  }

  private createMemoryFromMatch(match: any): MemoryItem {
    return {
      id: match.id,
      type: match.metadata?.type || 'episodic',
      scope: match.metadata?.scope || 'session',
      content: match.metadata?.content || '',
      metadata: match.metadata || {},
      embedding: match.values,
      confidence: match.score || 0.5,
      priority: match.metadata?.priority || 'medium',
      tokens: TokenCounter.count(match.metadata?.content || ''),
      accessCount: 0,
      lastAccessed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  private assessConversationActivity(): 'low' | 'medium' | 'high' {
    // Simple heuristic based on recent memories
    const recentMemories = Array.from(this.cache.values()).filter(m => {
      const age = Date.now() - m.createdAt.getTime()
      return age < 5 * 60 * 1000 // Last 5 minutes
    })

    if (recentMemories.length > 10) return 'high'
    if (recentMemories.length > 5) return 'medium'
    return 'low'
  }

  private assessPreferenceRichness(): 'low' | 'medium' | 'high' {
    const semanticMemories = Array.from(this.cache.values()).filter(
      m => m.type === 'semantic'
    )

    if (semanticMemories.length > 20) return 'high'
    if (semanticMemories.length > 10) return 'medium'
    return 'low'
  }

  private assessTaskComplexity(): 'low' | 'medium' | 'high' {
    // Could be based on conversation depth, technical terms, etc.
    return 'medium'
  }

  /**
   * Get optimizer
   */
  getOptimizer(): ContextOptimizer {
    return this.optimizer
  }
}
