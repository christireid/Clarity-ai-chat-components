/**
 * Production-Ready Memory Service
 * 
 * Implements 4-layer hybrid memory architecture:
 * - Layer 1: Real-time Context Buffer (Redis/In-Memory, 50-100 tokens)
 * - Layer 2: Session Memory (Compressed summaries, 200-500 tokens)
 * - Layer 3: Semantic Memory (Vector embeddings, user preferences)
 * - Layer 4: Episodic Archive (Full conversation logs, cold storage)
 */

import type {
  MemoryItem,
  MemoryType,
  MemoryScope,
  MemoryLayer,
  EpisodicMemory,
  SemanticMemory,
  MemoryRetrievalOptions,
  MemoryStorageOptions,
  MemoryStats,
  MemoryVectorMetadata,
} from './types'
import { MemoryBuffer } from './memory-buffer'
import type { MemoryVectorStore } from './sliding-context-manager'
import { VectorStoreAdapterWrapper } from './sliding-context-manager'
import type { VectorStoreAdapter } from './vector-store-adapter'

export interface MemoryServiceConfig {
  vectorStore?: MemoryVectorStore | VectorStoreAdapter
  maxRealTimeTokens?: number
  maxSessionTokens?: number
  enableCompression?: boolean
  compressionThreshold?: number
  countTokens: (text: string) => number
}

/**
 * Memory Service - Production-ready memory management
 */
export class MemoryService {
  private config: Required<Pick<MemoryServiceConfig, 'maxRealTimeTokens' | 'maxSessionTokens' | 'enableCompression' | 'compressionThreshold' | 'countTokens'>> & {
    vectorStore?: MemoryVectorStore
  }
  
  // Layer 1: Real-time context buffer (in-memory)
  private realTimeBuffers: Map<string, MemoryBuffer> = new Map()
  
  // Layer 2: Session memory (compressed summaries)
  private sessionMemories: Map<string, MemoryItem[]> = new Map()
  
  // Layer 3 & 4: Handled by vector store (if available)

  constructor(config: MemoryServiceConfig) {
    // Convert VectorStoreAdapter to MemoryVectorStore if needed
    let vectorStore: MemoryVectorStore | undefined
    if (config.vectorStore) {
      if ('similaritySearch' in config.vectorStore && typeof config.vectorStore.similaritySearch === 'function') {
        // Already a MemoryVectorStore
        vectorStore = config.vectorStore as MemoryVectorStore
      } else {
        // It's a VectorStoreAdapter, wrap it
        vectorStore = new VectorStoreAdapterWrapper(config.vectorStore as VectorStoreAdapter)
      }
    }

    this.config = {
      maxRealTimeTokens: config.maxRealTimeTokens ?? 100,
      maxSessionTokens: config.maxSessionTokens ?? 500,
      enableCompression: config.enableCompression ?? true,
      compressionThreshold: config.compressionThreshold ?? 20,
      countTokens: config.countTokens,
      vectorStore,
    }
  }

  /**
   * Store a memory item
   */
  async storeMemory(
    memory: Omit<MemoryItem, 'id' | 'lastUpdated'>,
    options?: MemoryStorageOptions
  ): Promise<MemoryItem> {
    const memoryItem: MemoryItem = {
      ...memory,
      id: `${memory.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date(),
    }

    // Determine target layer based on scope and type
    const targetLayer = this.determineLayer(memoryItem.scope, memoryItem.type)

    // Store in appropriate layer
    switch (targetLayer) {
      case 'real-time':
        await this.storeRealTimeMemory(memoryItem)
        break
      case 'session':
        await this.storeSessionMemory(memoryItem)
        break
      case 'semantic':
      case 'episodic':
        await this.storeLongTermMemory(memoryItem, options)
        break
    }

    return memoryItem
  }

  /**
   * Store in real-time buffer (Layer 1)
   */
  private async storeRealTimeMemory(memory: MemoryItem): Promise<void> {
    const buffer = this.getOrCreateBuffer(memory.userId)
    
    buffer.addMessage({
      role: 'system',
      content: `[${memory.label}] ${memory.value}`,
      timestamp: memory.lastUpdated,
      tokens: memory.tokens,
    })
  }

  /**
   * Store in session memory (Layer 2)
   */
  private async storeSessionMemory(memory: MemoryItem): Promise<void> {
    if (!this.sessionMemories.has(memory.userId)) {
      this.sessionMemories.set(memory.userId, [])
    }

    const sessionMemories = this.sessionMemories.get(memory.userId)!
    sessionMemories.push(memory)

    // Compress if threshold reached
    if (
      this.config.enableCompression &&
      sessionMemories.length >= this.config.compressionThreshold
    ) {
      await this.compressSessionMemory(memory.userId)
    }
  }

  /**
   * Store in long-term memory (Layer 3 & 4)
   */
  private async storeLongTermMemory(
    memory: MemoryItem,
    options?: MemoryStorageOptions
  ): Promise<void> {
    if (!this.config.vectorStore) {
      console.warn('Vector store not configured, falling back to session memory')
      await this.storeSessionMemory(memory)
      return
    }

    try {
      // Store in vector database with retry logic
      await this.storeWithRetry(memory, 3)
    } catch (error) {
      console.error('Failed to store in vector database, falling back to session memory:', error)
      // Fallback to session memory on failure
      await this.storeSessionMemory(memory)
    }

    // If promoting to global, also ensure it's marked appropriately
    if (options?.promoteToGlobal && memory.scope !== 'global') {
      memory.scope = 'global'
    }
  }

  /**
   * Store memory with retry logic
   */
  private async storeWithRetry(memory: MemoryItem, maxRetries: number): Promise<void> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.config.vectorStore!.storeMemory(memory)
        return
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        
        if (attempt < maxRetries) {
          // Exponential backoff: 100ms, 200ms, 400ms
          const delay = 100 * Math.pow(2, attempt - 1)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError || new Error('Failed to store memory after retries')
  }

  /**
   * Retrieve memories based on options
   */
  async retrieveMemories(options: MemoryRetrievalOptions): Promise<MemoryItem[]> {
    const results: MemoryItem[] = []

    // Retrieve from each layer based on options
    if (!options.layer || options.layer.includes('real-time')) {
      const realTime = this.retrieveRealTimeMemories(options)
      results.push(...realTime)
    }

    if (!options.layer || options.layer.includes('session')) {
      const session = this.retrieveSessionMemories(options)
      results.push(...session)
    }

    if (
      (!options.layer || options.layer.includes('semantic') || options.layer.includes('episodic')) &&
      this.config.vectorStore &&
      options.query
    ) {
      const longTerm = await this.retrieveLongTermMemories(options)
      results.push(...longTerm)
    }

    // Filter and sort results
    return this.filterAndSortMemories(results, options)
  }

  /**
   * Retrieve from real-time buffer
   */
  private retrieveRealTimeMemories(options: MemoryRetrievalOptions): MemoryItem[] {
    const buffer = this.realTimeBuffers.get(options.userId)
    if (!buffer) return []

    const context = buffer.getContext(this.config.maxRealTimeTokens)
    
    // Convert buffer messages to memory items
    return context.messages.map((msg, idx) => ({
      id: `realtime_${options.userId}_${idx}`,
      userId: options.userId,
      label: 'Recent Context',
      value: msg.content,
      scope: 'session' as MemoryScope,
      type: 'episodic' as MemoryType,
      layer: 'real-time' as MemoryLayer,
      lastUpdated: new Date(),
      tokens: msg.tokens,
    }))
  }

  /**
   * Retrieve from session memory
   */
  private retrieveSessionMemories(options: MemoryRetrievalOptions): MemoryItem[] {
    const memories = this.sessionMemories.get(options.userId) || []
    
    return memories.filter((m) => {
      if (options.scope && !options.scope.includes(m.scope)) return false
      if (options.type && !options.type.includes(m.type)) return false
      if (options.minConfidence && (m.confidence ?? 0) < options.minConfidence) return false
      return true
    })
  }

  /**
   * Retrieve from long-term memory (vector store)
   */
  private async retrieveLongTermMemories(
    options: MemoryRetrievalOptions
  ): Promise<MemoryItem[]> {
    if (!this.config.vectorStore || !options.query) {
      return []
    }

    try {
      // Attempt retrieval with timeout
      const result = await Promise.race([
        this.config.vectorStore.similaritySearch(
          options.query,
          options.userId,
          {
            k: options.maxResults ?? 5,
            minScore: options.minConfidence ?? 0.7,
          }
        ),
        new Promise<MemoryItem[]>((_, reject) =>
          setTimeout(() => reject(new Error('Retrieval timeout')), 5000)
        ),
      ])

      return result as MemoryItem[]
    } catch (error) {
      console.error('Long-term memory retrieval failed:', error)
      // Fallback: return empty array and continue with other layers
      return []
    }
  }

  /**
   * Filter and sort memories
   */
  private filterAndSortMemories(
    memories: MemoryItem[],
    options: MemoryRetrievalOptions
  ): MemoryItem[] {
    let filtered = memories

    // Apply filters
    if (options.scope) {
      filtered = filtered.filter((m) => options.scope!.includes(m.scope))
    }

    if (options.type) {
      filtered = filtered.filter((m) => options.type!.includes(m.type))
    }

    if (options.minConfidence !== undefined) {
      filtered = filtered.filter(
        (m) => (m.confidence ?? 0) >= options.minConfidence!
      )
    }

    // Sort by importance and recency
    filtered.sort((a, b) => {
      const importanceDiff = (b.importanceScore ?? 0) - (a.importanceScore ?? 0)
      if (Math.abs(importanceDiff) > 0.1) return importanceDiff

      return b.lastUpdated.getTime() - a.lastUpdated.getTime()
    })

    // Limit results
    if (options.maxResults) {
      filtered = filtered.slice(0, options.maxResults)
    }

    return filtered
  }

  /**
   * Compress session memory
   */
  private async compressSessionMemory(userId: string): Promise<void> {
    const memories = this.sessionMemories.get(userId)
    if (!memories || memories.length < this.config.compressionThreshold) {
      return
    }

    // Group by type and compress
    const grouped = new Map<MemoryType, MemoryItem[]>()
    
    memories.forEach((m) => {
      if (!grouped.has(m.type)) {
        grouped.set(m.type, [])
      }
      grouped.get(m.type)!.push(m)
    })

    // Create semantic summaries for each type
    const compressed: MemoryItem[] = []

    for (const [type, items] of grouped.entries()) {
      if (items.length >= 3) {
        // Create semantic summary
        const summary = this.createSemanticSummary(items, type)
        
        compressed.push({
          id: `compressed_${userId}_${type}_${Date.now()}`,
          userId,
          label: `Compressed ${type} memories`,
          value: summary,
          scope: 'thread',
          type: 'semantic',
          layer: 'semantic',
          confidence: this.calculateAverageConfidence(items),
          lastUpdated: new Date(),
          tokens: this.config.countTokens(summary),
          importanceScore: Math.max(...items.map((i) => i.importanceScore ?? 0)),
        })
      } else {
        // Keep individual items if too few to compress
        compressed.push(...items)
      }
    }

    // Store compressed memories and clear originals
    this.sessionMemories.set(userId, compressed)

    // Optionally store compressed memories in vector store
    if (this.config.vectorStore) {
      for (const memory of compressed) {
        if (memory.layer === 'semantic') {
          await this.config.vectorStore.storeMemory(memory)
        }
      }
    }
  }

  /**
   * Create semantic summary from memory items
   */
  private createSemanticSummary(items: MemoryItem[], type: MemoryType): string {
    const values = items.map((i) => i.value).join('. ')
    
    // Simple summarization (would use LLM in production)
    if (values.length > 500) {
      return values.substring(0, 500) + '...'
    }
    
    return values
  }

  /**
   * Calculate average confidence
   */
  private calculateAverageConfidence(items: MemoryItem[]): number {
    if (items.length === 0) return 0
    
    const sum = items.reduce((acc, item) => acc + (item.confidence ?? 0), 0)
    return sum / items.length
  }

  /**
   * Determine target layer for memory
   */
  private determineLayer(scope: MemoryScope, type: MemoryType): MemoryLayer {
    if (scope === 'session') {
      return 'real-time'
    }
    
    if (scope === 'thread') {
      return 'session'
    }
    
    if (type === 'semantic' || type === 'preference') {
      return 'semantic'
    }
    
    return 'episodic'
  }

  /**
   * Get or create buffer for user
   */
  private getOrCreateBuffer(userId: string): MemoryBuffer {
    if (!this.realTimeBuffers.has(userId)) {
      this.realTimeBuffers.set(
        userId,
        new MemoryBuffer({
          bufferSize: 10,
          summaryThreshold: this.config.compressionThreshold,
        })
      )
    }
    
    return this.realTimeBuffers.get(userId)!
  }

  /**
   * Get memory statistics
   */
  getStats(userId: string): MemoryStats {
    const realTime = this.realTimeBuffers.get(userId)
    const session = this.sessionMemories.get(userId) || []

    const allMemories: MemoryItem[] = [
      ...this.retrieveRealTimeMemories({ userId }),
      ...session,
    ]

    const byScope: Record<MemoryScope, number> = {
      session: 0,
      thread: 0,
      global: 0,
      user: 0,
    }

    const byType: Record<MemoryType, number> = {
      episodic: 0,
      semantic: 0,
      preference: 0,
      fact: 0,
      behavior: 0,
    }

    const byLayer: Record<MemoryLayer, number> = {
      'real-time': 0,
      session: 0,
      semantic: 0,
      episodic: 0,
    }

    let totalTokens = 0
    let confidenceSum = 0
    let confidenceCount = 0

    allMemories.forEach((m) => {
      byScope[m.scope] = (byScope[m.scope] || 0) + 1
      byType[m.type] = (byType[m.type] || 0) + 1
      byLayer[m.layer] = (byLayer[m.layer] || 0) + 1
      totalTokens += m.tokens || 0
      
      if (m.confidence !== undefined) {
        confidenceSum += m.confidence
        confidenceCount++
      }
    })

    const dates = allMemories
      .map((m) => m.lastUpdated)
      .filter((d) => d instanceof Date)

    return {
      totalMemories: allMemories.length,
      byScope,
      byType,
      byLayer,
      totalTokens,
      averageConfidence: confidenceCount > 0 ? confidenceSum / confidenceCount : 0,
      oldestMemory: dates.length > 0 ? new Date(Math.min(...dates.map((d) => d.getTime()))) : undefined,
      newestMemory: dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined,
    }
  }

  /**
   * Clear all memories for a user
   */
  clearUserMemories(userId: string): void {
    this.realTimeBuffers.delete(userId)
    this.sessionMemories.delete(userId)
  }
}
