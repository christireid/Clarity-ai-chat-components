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
  VectorStore,
  VectorStoreMatch,
  VectorStoreVector,
  VectorStoreQuery,
  EmbeddingProvider,
  AddOptions,
  ContextOptions,
  ContextBundle,
  TokenBreakdown,
  DeletionResult,
  DeletionVerification,
} from './types'
import {
  DecayManager,
  type DecayManagerConfig,
  type DecayResult,
} from './utils/decay-manager'
import {
  ConsentManager,
  type ConsentPurpose,
} from './consent'
import {
  AuditLogger,
} from './audit'
import {
  DEFAULT_RETENTION_POLICY,
  DEFAULT_MEMORY_LIMITS,
} from './constants'
import type {
  DataExportResult,
  DataExportOptions,
} from './types'

/**
 * Simple token counter utility
 * Approximates token count (GPT-4 uses ~4 chars per token)
 */
const TokenCounter = {
  count: (text: string): number => Math.ceil(text.length / 4),
}

/**
 * Token allocation breakdown for budget management
 */
interface TokenAllocation {
  semantic: number
  episodic: number
  working: number
  systemPrompt: number
  userPreferences: number
  recentContext: number
  semanticMemory: number
  episodicMemory: number
  responseReserve: number
}

/**
 * Simple token compressor interface for memory compression
 */
interface MemoryCompressorAdapter {
  compressMemory(
    memory: MemoryItem,
    ratio: number
  ): {
    compressed: string
    compressedTokens: number
    compressionRatio: number
  }
}

/**
 * Simple budget manager interface for token allocation
 */
interface BudgetManagerAdapter {
  getAllocation(): TokenAllocation
}

/**
 * Context optimizer adapter for memory service
 */
interface ContextOptimizerAdapter {
  getCompressor(): MemoryCompressorAdapter
  getBudgetManager(): BudgetManagerAdapter
  optimizeContext(options: {
    systemPrompt: string
    userPreferences: Record<string, unknown>
    recentMessages: string[]
    semanticMemories: MemoryItem[]
    episodicMemories: MemoryItem[]
    context?: MemoryContext
  }): {
    optimized: {
      systemPrompt: string
      userPreferences: string
      recentContext: string
      semanticMemory: string
      episodicMemory: string
    }
    stats: {
      totalTokens: number
      allocation: TokenAllocation
      compressionRatio: number
    }
  }
}

/**
 * Default context optimizer implementation
 */
function createDefaultOptimizer(_config?: unknown): ContextOptimizerAdapter {
  const defaultAllocation: TokenAllocation = {
    semantic: 2000,
    episodic: 1500,
    working: 500,
    systemPrompt: 500,
    userPreferences: 300,
    recentContext: 800,
    semanticMemory: 2000,
    episodicMemory: 1500,
    responseReserve: 400,
  }

  return {
    getCompressor: () => ({
      compressMemory: (memory: MemoryItem, ratio: number) => ({
        compressed: memory.content.slice(
          0,
          Math.floor(memory.content.length * ratio)
        ),
        compressedTokens: Math.floor((memory.tokens || 100) * ratio),
        compressionRatio: ratio,
      }),
    }),
    getBudgetManager: () => ({
      getAllocation: () => defaultAllocation,
    }),
    optimizeContext: (options) => {
      // Simple default implementation that truncates content to fit allocations
      const truncate = (text: string, maxTokens: number) => {
        // Rough estimate: ~4 chars per token
        const maxChars = maxTokens * 4
        return text.slice(0, maxChars)
      }

      const systemPrompt = truncate(
        options.systemPrompt,
        defaultAllocation.systemPrompt
      )
      const userPreferences = truncate(
        JSON.stringify(options.userPreferences),
        defaultAllocation.userPreferences
      )
      const recentContext = truncate(
        options.recentMessages.join('\n'),
        defaultAllocation.recentContext
      )
      const semanticMemory = truncate(
        options.semanticMemories.map((m) => m.content).join('\n'),
        defaultAllocation.semanticMemory
      )
      const episodicMemory = truncate(
        options.episodicMemories.map((m) => m.content).join('\n'),
        defaultAllocation.episodicMemory
      )

      const totalTokens = Math.ceil(
        (systemPrompt.length +
          userPreferences.length +
          recentContext.length +
          semanticMemory.length +
          episodicMemory.length) /
          4
      )

      return {
        optimized: {
          systemPrompt,
          userPreferences,
          recentContext,
          semanticMemory,
          episodicMemory,
        },
        stats: {
          totalTokens,
          allocation: defaultAllocation,
          compressionRatio: 1.0,
        },
      }
    },
  }
}

/**
 * Memory Service
 */
export class MemoryService {
  private config: MemoryServiceConfig
  private vectorStore?: VectorStore
  private embeddings?: EmbeddingProvider
  private cache: Map<string, MemoryItem>
  private buffer: MemoryBuffer
  private optimizer: ContextOptimizerAdapter
  private eventListeners: Map<string, Set<MemoryEventListener>>
  private cleanupInterval?: ReturnType<typeof setInterval>
  private summarizationInterval?: ReturnType<typeof setInterval>
  private decayManager?: DecayManager
  private decayInterval?: ReturnType<typeof setInterval>
  private consentManager?: ConsentManager
  private auditLogger: AuditLogger

  constructor(
    config: MemoryServiceConfig,
    vectorStore?: VectorStore,
    embeddings?: EmbeddingProvider,
    consentManager?: ConsentManager,
    auditLogger?: AuditLogger
  ) {
    this.config = config
    this.vectorStore = vectorStore
    this.embeddings = embeddings
    this.consentManager = consentManager
    this.cache = new Map()
    this.buffer = this.createBuffer()
    this.optimizer = createDefaultOptimizer(config.tokenOptimization)
    this.eventListeners = new Map()

    // Initialize audit logger
    this.auditLogger = auditLogger || new AuditLogger(vectorStore, config.audit)

    this.initialize()
  }

  /**
   * Initialize service
   */
  async initialize(): Promise<void> {
    // Initialize vector store if configured
    if (this.config.persistence.useVectorStore && this.vectorStore) {
      await this.vectorStore.initialize()
    }

    // Initialize decay manager if configured
    if (this.config.decay?.enabled) {
      this.decayManager = new DecayManager(
        this.config.decay.policies as Partial<DecayManagerConfig>
      )

      // Start decay background task if interval specified
      if (this.config.decay.decayInterval) {
        this.startDecayTask()
      }
    }

    // Start background tasks
    if (this.config.enableAutoCleanup && this.config.cleanupInterval) {
      this.startCleanupTask()
    }

    if (
      this.config.enableAutoSummarization &&
      this.config.summarizationInterval
    ) {
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
    // Check consent if consent management is enabled
    if (this.config.consent?.enabled && this.consentManager) {
      const requireConsent = this.config.consent.requireConsentForWrites ?? true

      if (requireConsent) {
        // Extract user ID from metadata
        const userId = this.config.consent.getUserId?.(metadata) || metadata.userId as string | undefined

        if (!userId) {
          if (this.config.debug) {
            console.warn(
              '[MemoryService] Consent check failed: No user ID found in metadata. ' +
              'Configure consent.getUserId or include userId in metadata.'
            )
          }
          throw new Error(
            'Cannot add memory: User ID required for consent verification. ' +
            'Include userId in metadata or configure consent.getUserId.'
          )
        }

        // Determine consent purpose based on operation
        const purpose: ConsentPurpose = type === 'episodic' || type === 'semantic'
          ? 'message_storage'
          : 'personalization'

        // Check consent (will throw if not granted)
        try {
          await this.consentManager.requireConsent(userId, purpose)
        } catch (error) {
          if (this.config.debug) {
            console.warn('[MemoryService] Memory write blocked:', (error as Error).message)
          }
          throw error
        }
      }
    }

    // Get limits with defaults
    const limits = {
      maxMemories: this.config.limits?.maxMemories ?? DEFAULT_MEMORY_LIMITS.maxMemories,
      maxTotalTokens: this.config.limits?.maxTotalTokens ?? DEFAULT_MEMORY_LIMITS.maxTotalTokens,
      maxMemorySize: this.config.limits?.maxMemorySize ?? DEFAULT_MEMORY_LIMITS.maxMemorySize,
      warnThreshold: this.config.limits?.warnThreshold ?? DEFAULT_MEMORY_LIMITS.warnThreshold,
    }

    // Check memory size limit
    if (content.length > limits.maxMemorySize) {
      const error = new Error(
        `Memory content exceeds maximum size: ${content.length} > ${limits.maxMemorySize} characters. ` +
        `Consider chunking or summarizing large content.`
      )
      if (this.config.debug) {
        console.error('[MemoryService]', error.message)
      }
      throw error
    }

    // Check and enforce memory count limit (LRU eviction)
    if (this.cache.size >= limits.maxMemories) {
      if (this.config.debug) {
        console.warn(
          `[MemoryService] Memory limit reached (${this.cache.size}/${limits.maxMemories}). ` +
          `Evicting oldest memory (LRU).`
        )
      }

      // Evict oldest memory (LRU - least recently accessed)
      const oldestMemory = Array.from(this.cache.values()).reduce((oldest, current) =>
        current.lastAccessed < oldest.lastAccessed ? current : oldest
      )

      await this.deleteMemory(oldestMemory.id)
    }

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

    // Check total tokens limit (evict if needed)
    const currentTotalTokens = Array.from(this.cache.values()).reduce(
      (sum, m) => sum + m.tokens, 0
    )
    const newTotalTokens = currentTotalTokens + memory.tokens

    if (newTotalTokens > limits.maxTotalTokens) {
      if (this.config.debug) {
        console.warn(
          `[MemoryService] Token limit would be exceeded (${newTotalTokens}/${limits.maxTotalTokens}). ` +
          `Evicting lowest priority memories.`
        )
      }

      // Evict lowest priority memories until under limit
      const sortedMemories = Array.from(this.cache.values()).sort((a, b) => {
        const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 }
        const aPriority = priorityOrder[a.priority]
        const bPriority = priorityOrder[b.priority]
        if (aPriority !== bPriority) return aPriority - bPriority
        return a.lastAccessed.getTime() - b.lastAccessed.getTime()
      })

      let tokensToFree = newTotalTokens - limits.maxTotalTokens
      for (const mem of sortedMemories) {
        if (tokensToFree <= 0) break
        await this.deleteMemory(mem.id)
        tokensToFree -= mem.tokens
      }
    }

    // Warn if approaching limits
    const newMemoryCount = this.cache.size + 1
    const memoryUtilization = newMemoryCount / limits.maxMemories
    const tokenUtilization = newTotalTokens / limits.maxTotalTokens

    if (memoryUtilization >= limits.warnThreshold && !this.config.debug) {
      console.warn(
        `[MemoryService] Approaching memory limit: ${newMemoryCount}/${limits.maxMemories} ` +
        `(${Math.round(memoryUtilization * 100)}% utilization)`
      )
    }

    if (tokenUtilization >= limits.warnThreshold && !this.config.debug) {
      console.warn(
        `[MemoryService] Approaching token limit: ${newTotalTokens}/${limits.maxTotalTokens} ` +
        `(${Math.round(tokenUtilization * 100)}% utilization)`
      )
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
    if (
      this.buffer.autoFlush &&
      this.buffer.items.length >= this.buffer.flushThreshold
    ) {
      await this.flushBuffer()
    }

    // Emit event
    this.emitEvent({
      type: 'memory:created',
      timestamp: new Date(),
      memory,
    })

    // Audit log: memory creation
    await this.auditLogger.log({
      eventType: 'memory:created',
      severity: 'info',
      description: `Memory created: ${type} (${scope})`,
      metadata: {
        userId: metadata.userId as string | undefined,
        memoryId: memory.id,
        memoryType: type,
        memoryScope: scope,
        purpose: metadata.purpose as string | undefined || 'general',
        legalBasis: this.consentManager ? 'consent' : 'legitimate_interest',
        result: 'success',
      },
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

    // Auto-decay on recall if enabled
    if (this.config.decay?.autoDecayOnRecall && this.decayManager) {
      // Run decay in background (don't block recall)
      this.runDecay().catch((error) => {
        if (this.config.debug) {
          console.error('Auto-decay failed:', error)
        }
      })
    }

    // Audit log: data access (GDPR Article 15)
    if (results.length > 0) {
      await this.auditLogger.log({
        eventType: 'memory:queried',
        severity: 'info',
        description: `Memory query executed: ${results.length} results`,
        metadata: {
          userId: query.metadata?.userId as string | undefined,
          memoryType: query.types?.[0],
          memoryScope: query.scopes?.[0],
          purpose: 'retrieval',
          result: 'success',
          resultCount: results.length,
        },
      })
    }

    return results
  }

  /**
   * Vector search
   */
  private async vectorSearch(
    query: MemoryQuery
  ): Promise<MemorySearchResult[]> {
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
      } satisfies VectorStoreQuery)

      return matches.map((match: VectorStoreMatch) => ({
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
      if (query.priorities && !query.priorities.includes(memory.priority))
        continue
      if (query.minConfidence && memory.confidence < query.minConfidence)
        continue

      // Time range filter
      if (query.timeRange) {
        if (query.timeRange.start && memory.createdAt < query.timeRange.start)
          continue
        if (query.timeRange.end && memory.createdAt > query.timeRange.end)
          continue
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

      results.push({ memory, relevance, score: relevance })
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
  private applyFilters(
    results: MemorySearchResult[],
    query: MemoryQuery
  ): MemorySearchResult[] {
    return results.filter((result) => {
      if (query.userId && result.memory.metadata.userId !== query.userId)
        return false
      if (query.threadId && result.memory.metadata.threadId !== query.threadId)
        return false
      if (
        query.sessionId &&
        result.memory.metadata.sessionId !== query.sessionId
      )
        return false
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
  async updateMemory(
    id: string,
    updates: Partial<MemoryItem>
  ): Promise<MemoryItem | null> {
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

    // Delete from cache
    this.cache.delete(id)

    // Delete from buffer
    const bufferIndex = this.buffer.items.findIndex(item => item.id === id)
    if (bufferIndex !== -1) {
      const removed = this.buffer.items.splice(bufferIndex, 1)[0]
      this.buffer.totalTokens -= removed.tokens
    }

    // Delete from vector store
    if (this.vectorStore) {
      try {
        await this.vectorStore.delete(id)
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
   * Delete all user data (GDPR Article 17: Right to Erasure)
   *
   * Implements complete cascade deletion across all storage layers:
   * - Cache (in-memory)
   * - Buffer (pending writes)
   * - Vector store (persistent storage)
   * - Consent records
   *
   * This method ensures COMPLETE data deletion as required by GDPR.
   *
   * @param userId - User identifier
   * @returns Detailed deletion result with verification
   *
   * @example
   * ```typescript
   * const result = await memoryService.deleteAllUserData('user123')
   * console.log(`Deleted ${result.deleted.memories} memories`)
   * console.log(`Verification passed: ${result.verified}`)
   * ```
   */
  async deleteAllUserData(userId: string): Promise<DeletionResult> {
    const timestamp = new Date()
    const failed: string[] = []
    let memoriesDeleted = 0
    let embeddingsDeleted = 0
    let cacheEntriesDeleted = 0
    let bufferEntriesDeleted = 0
    let consentRecordsDeleted = 0

    if (this.config.debug) {
      console.log(`[MemoryService] Starting complete deletion for user: ${userId}`)
    }

    // 1. Delete from cache
    for (const [id, memory] of this.cache.entries()) {
      if (memory.metadata?.userId === userId) {
        try {
          this.cache.delete(id)
          cacheEntriesDeleted++
          if (memory.embedding) {
            embeddingsDeleted++
          }
        } catch (error) {
          failed.push(id)
          if (this.config.debug) {
            console.error(`Failed to delete from cache: ${id}`, error)
          }
        }
      }
    }

    // 2. Delete from buffer
    this.buffer.items = this.buffer.items.filter(item => {
      if (item.metadata?.userId === userId) {
        bufferEntriesDeleted++
        this.buffer.totalTokens -= item.tokens
        return false // Remove from buffer
      }
      return true // Keep in buffer
    })

    // 3. Delete from vector store
    if (this.vectorStore) {
      try {
        // Search for all memories belonging to user
        const userMemories = await this.vectorStore.search('', {
          userId,
          limit: 10000, // High limit to get all
        })

        for (const { memory } of userMemories) {
          try {
            await this.vectorStore.delete(memory.id)
            memoriesDeleted++
            if (memory.embedding) {
              embeddingsDeleted++
            }
          } catch (error) {
            failed.push(memory.id)
            if (this.config.debug) {
              console.error(`Failed to delete from vector store: ${memory.id}`, error)
            }
          }
        }
      } catch (error) {
        if (this.config.debug) {
          console.error('Failed to search vector store for user data:', error)
        }
      }
    }

    // 4. Delete consent records
    if (this.consentManager) {
      try {
        // Withdraw all consent (this creates a withdrawal record)
        await this.consentManager.withdrawConsent(userId)
        consentRecordsDeleted++

        if (this.config.debug) {
          console.log(`[MemoryService] Withdrew consent for user: ${userId}`)
        }
      } catch (error) {
        if (this.config.debug) {
          console.error('Failed to withdraw consent:', error)
        }
      }
    }

    // 5. Verify deletion
    const verification = await this.verifyDeletion(userId)

    // 6. Create deletion result
    const result: DeletionResult = {
      userId,
      timestamp,
      deleted: {
        memories: memoriesDeleted,
        embeddings: embeddingsDeleted,
        cacheEntries: cacheEntriesDeleted,
        bufferEntries: bufferEntriesDeleted,
        consentRecords: consentRecordsDeleted,
      },
      failed,
      verified: verification.passed,
      verification,
    }

    // 7. Emit deletion event
    this.emitEvent({
      type: 'user:data:deleted',
      timestamp,
      data: {
        userId,
        result,
      },
    })

    // 8. Audit log: user data deletion (GDPR Article 17)
    await this.auditLogger.log({
      eventType: 'user:data:deleted',
      severity: verification.passed ? 'info' : 'warning',
      description: `User data deletion ${verification.passed ? 'completed' : 'completed with issues'}: ${userId}`,
      metadata: {
        userId,
        purpose: 'gdpr_right_to_erasure',
        legalBasis: 'legal_obligation',
        result: verification.passed ? 'success' : 'partial',
        memoriesDeleted,
        embeddingsDeleted,
        cacheEntriesDeleted,
        bufferEntriesDeleted,
        consentRecordsDeleted,
        failedDeletions: failed.length,
        verified: verification.passed,
      },
    })

    if (this.config.debug) {
      console.log(
        `[MemoryService] Deletion complete for user ${userId}:`,
        `${memoriesDeleted} memories, ${cacheEntriesDeleted} cache entries, ` +
        `${bufferEntriesDeleted} buffer entries, ${failed.length} failed, ` +
        `verified: ${verification.passed}`
      )
    }

    return result
  }

  /**
   * Verify complete deletion of user data (GDPR Article 17 compliance)
   *
   * Checks all storage layers to ensure no user data remains.
   * Required for demonstrating GDPR compliance.
   *
   * @param userId - User identifier
   * @returns Verification result with details of any remaining data
   *
   * @example
   * ```typescript
   * const verification = await memoryService.verifyDeletion('user123')
   * if (!verification.passed) {
   *   console.error('Deletion incomplete:', verification.remainingData)
   * }
   * ```
   */
  async verifyDeletion(userId: string): Promise<DeletionVerification> {
    const timestamp = new Date()
    const remainingData: DeletionVerification['remainingData'] = []

    try {
      // Check cache
      const cacheRemaining: string[] = []
      for (const [id, memory] of this.cache.entries()) {
        if (memory.metadata?.userId === userId) {
          cacheRemaining.push(id)
        }
      }
      if (cacheRemaining.length > 0) {
        remainingData.push({
          location: 'cache',
          count: cacheRemaining.length,
          sampleIds: cacheRemaining.slice(0, 5),
        })
      }

      // Check buffer
      const bufferRemaining = this.buffer.items
        .filter(item => item.metadata?.userId === userId)
        .map(item => item.id)
      if (bufferRemaining.length > 0) {
        remainingData.push({
          location: 'buffer',
          count: bufferRemaining.length,
          sampleIds: bufferRemaining.slice(0, 5),
        })
      }

      // Check vector store
      if (this.vectorStore) {
        try {
          const storeRemaining = await this.vectorStore.search('', {
            userId,
            limit: 100,
          })
          if (storeRemaining.length > 0) {
            remainingData.push({
              location: 'vectorStore',
              count: storeRemaining.length,
              sampleIds: storeRemaining.slice(0, 5).map(r => r.memory.id),
            })
          }
        } catch (error) {
          if (this.config.debug) {
            console.error('Failed to verify vector store:', error)
          }
        }
      }

      // Check consent records (should only have withdrawal record)
      if (this.consentManager) {
        try {
          const hasConsent = await this.consentManager.hasConsent(userId, 'message_storage')
          if (hasConsent) {
            // Should not have active consent after deletion
            remainingData.push({
              location: 'consent',
              count: 1,
              sampleIds: [userId],
            })
          }
        } catch (error) {
          if (this.config.debug) {
            console.error('Failed to verify consent:', error)
          }
        }
      }

      const passed = remainingData.length === 0

      const verification: DeletionVerification = {
        userId,
        timestamp,
        passed,
        remainingData,
      }

      // Emit verification event
      this.emitEvent({
        type: 'user:data:deletion:verified',
        timestamp,
        data: {
          userId,
          verification,
        },
      })

      return verification
    } catch (error) {
      return {
        userId,
        timestamp,
        passed: false,
        remainingData: [],
        error: (error as Error).message,
      }
    }
  }

  /**
   * Export all user data (GDPR Article 20: Data Portability)
   *
   * Provides complete user data in structured, machine-readable format.
   * Implements GDPR Article 20 (Right to Data Portability).
   *
   * @param userId - User identifier
   * @param options - Export options (what to include)
   * @returns Complete data export
   *
   * @example
   * ```typescript
   * const export = await memoryService.exportUserData('user123', {
   *   includeEmbeddings: false,     // Exclude large embeddings
   *   includeConsentHistory: true,  // Include consent records
   *   includeAuditTrail: true,      // Include audit logs
   *   format: 'json',               // JSON format
   * })
   *
   * // Save to file or send to user
   * fs.writeFileSync('user_data.json', JSON.stringify(export, null, 2))
   * ```
   */
  async exportUserData(
    userId: string,
    options: DataExportOptions = {}
  ): Promise<DataExportResult> {
    const timestamp = new Date()

    // Default options
    const opts: Required<DataExportOptions> = {
      includeEmbeddings: options.includeEmbeddings ?? false, // Embeddings can be large
      includeConsentHistory: options.includeConsentHistory ?? true,
      includeAuditTrail: options.includeAuditTrail ?? true,
      includeProfile: options.includeProfile ?? true,
      format: options.format ?? 'json',
      prettyPrint: options.prettyPrint ?? true,
    }

    if (this.config.debug) {
      console.log(`[MemoryService] Starting data export for user: ${userId}`)
    }

    // 1. Export memories
    const userMemories: MemoryItem[] = []
    let embeddingsCount = 0

    // From cache
    for (const memory of this.cache.values()) {
      if (memory.metadata?.userId === userId) {
        const exportedMemory = { ...memory }

        // Optionally remove embeddings (they're large)
        if (!opts.includeEmbeddings && exportedMemory.embedding) {
          delete exportedMemory.embedding
        } else if (exportedMemory.embedding) {
          embeddingsCount++
        }

        userMemories.push(exportedMemory)
      }
    }

    // From vector store (if available)
    if (this.vectorStore) {
      try {
        const storeMemories = await this.vectorStore.search('', {
          userId,
          limit: 10000,
        })

        for (const { memory } of storeMemories) {
          // Check if not already in cache
          if (!userMemories.find(m => m.id === memory.id)) {
            const exportedMemory = { ...memory }

            if (!opts.includeEmbeddings && exportedMemory.embedding) {
              delete exportedMemory.embedding
            } else if (exportedMemory.embedding) {
              embeddingsCount++
            }

            userMemories.push(exportedMemory)
          }
        }
      } catch (error) {
        if (this.config.debug) {
          console.error('Failed to export from vector store:', error)
        }
      }
    }

    // 2. Export consent history (if requested)
    let consentHistory: DataExportResult['data']['consentHistory'] = undefined
    if (opts.includeConsentHistory && this.consentManager) {
      try {
        const events = await this.consentManager.getConsentHistory(userId)
        consentHistory = events.map(event => ({
          type: event.type === 'granted' ? 'granted' : 'withdrawn',
          purposes: event.purposes,
          timestamp: event.timestamp,
          version: event.version,
        }))
      } catch (error) {
        if (this.config.debug) {
          console.error('Failed to export consent history:', error)
        }
      }
    }

    // 3. Export audit trail (if requested)
    let auditTrail: DataExportResult['data']['auditTrail'] = undefined
    if (opts.includeAuditTrail) {
      try {
        const logs = await this.auditLogger.getUserAuditTrail(userId)
        auditTrail = logs.map(log => ({
          eventType: log.eventType,
          timestamp: log.timestamp,
          description: log.description,
          metadata: log.metadata,
        }))
      } catch (error) {
        if (this.config.debug) {
          console.error('Failed to export audit trail:', error)
        }
      }
    }

    // 4. Export profile data (if requested)
    let profile: Record<string, unknown> | undefined = undefined
    if (opts.includeProfile) {
      // Try to find profile-type memories
      const profileMemories = userMemories.filter(m => m.type === 'profile')
      if (profileMemories.length > 0) {
        profile = profileMemories.reduce((acc, memory) => {
          // Try to parse JSON content as profile data
          try {
            const parsed = JSON.parse(memory.content)
            return { ...acc, ...parsed }
          } catch {
            acc[memory.id] = memory.content
            return acc
          }
        }, {} as Record<string, unknown>)
      }
    }

    // 5. Calculate summary
    const jsonString = JSON.stringify({
      memories: userMemories,
      consentHistory,
      auditTrail,
      profile,
    })
    const dataSizeBytes = new Blob([jsonString]).size

    const result: DataExportResult = {
      userId,
      timestamp,
      formatVersion: '1.0.0',
      data: {
        memories: userMemories,
        consentHistory,
        auditTrail,
        profile,
      },
      summary: {
        memoriesCount: userMemories.length,
        embeddingsCount,
        dataSizeBytes,
        consentEventsCount: consentHistory?.length || 0,
        auditLogsCount: auditTrail?.length || 0,
      },
      options: opts,
    }

    // 6. Audit log: data export (GDPR Article 20)
    await this.auditLogger.log({
      eventType: 'user:data:exported',
      severity: 'info',
      description: `User data exported: ${userId}`,
      metadata: {
        userId,
        purpose: 'gdpr_data_portability',
        legalBasis: 'legal_obligation',
        result: 'success',
        memoriesCount: userMemories.length,
        embeddingsCount,
        dataSizeBytes,
        includeEmbeddings: opts.includeEmbeddings,
        includeConsentHistory: opts.includeConsentHistory,
        includeAuditTrail: opts.includeAuditTrail,
      },
    })

    if (this.config.debug) {
      console.log(
        `[MemoryService] Data export complete for user ${userId}:`,
        `${result.summary.memoriesCount} memories, `,
        `${result.summary.dataSizeBytes} bytes`
      )
    }

    return result
  }

  /**
   * Promote memory to higher scope
   */
  async promoteMemory(
    id: string,
    targetScope: MemoryScope
  ): Promise<MemoryItem | null> {
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
  async compressMemory(
    id: string,
    ratio: number = 0.5
  ): Promise<MemoryItem | null> {
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

    const vectors: VectorStoreVector[] = memories
      .filter((m) => m.embedding && m.embedding.length > 0)
      .map((m) => ({
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
      profile: 0,
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
      averageConfidence:
        this.cache.size > 0 ? totalConfidence / this.cache.size : 0,
    }
  }

  /**
   * Cleanup expired memories
   */
  /**
   * Cleanup expired memories based on retention policies
   *
   * Automatically deletes memories that exceed their TTL based on:
   * - Memory type (episodic, semantic, procedural, etc.)
   * - Memory scope (session, thread, global, user)
   * - Explicit expiresAt timestamp
   *
   * @returns Number of memories deleted
   */
  async cleanup(): Promise<number> {
    const now = new Date()
    const toDelete: string[] = []

    for (const memory of this.cache.values()) {
      // Check explicit expiry
      if (memory.expiresAt && memory.expiresAt < now) {
        toDelete.push(memory.id)
        if (this.config.debug) {
          console.log(
            `[MemoryService] Memory expired (explicit): ${memory.id} ` +
            `(expired at ${memory.expiresAt.toISOString()})`
          )
        }
        continue
      }

      // Check retention policy (TTL)
      const retention = this.getRetentionForMemory(memory)
      if (retention > 0) {
        const age = now.getTime() - memory.createdAt.getTime()
        const ageSeconds = age / 1000

        if (ageSeconds > retention) {
          toDelete.push(memory.id)
          if (this.config.debug) {
            console.log(
              `[MemoryService] Memory expired (retention): ${memory.id} ` +
              `(age: ${Math.round(ageSeconds / 86400)} days, limit: ${Math.round(retention / 86400)} days)`
            )
          }
        }
      }
    }

    // Delete expired memories
    for (const id of toDelete) {
      await this.deleteMemory(id)
      this.emitEvent({
        type: 'memory:expired',
        timestamp: new Date(),
        data: { id },
      })
    }

    if (this.config.debug && toDelete.length > 0) {
      console.log(`[MemoryService] Cleanup complete: ${toDelete.length} memories deleted`)
    }

    return toDelete.length
  }

  /**
   * Start cleanup task
   */
  private startCleanupTask(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup().catch((error) => {
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
      this.runSummarizationCycle().catch((error) => {
        if (this.config.debug) {
          console.error('Summarization task failed:', error)
        }
      })
    }, this.config.summarizationInterval!)
  }

  /**
   * Start decay task
   */
  private startDecayTask(): void {
    this.decayInterval = setInterval(() => {
      this.runDecay().catch((error) => {
        if (this.config.debug) {
          console.error('Decay task failed:', error)
        }
      })
    }, this.config.decay!.decayInterval!)
  }

  /**
   * Run decay evaluation on all memories
   *
   * Evaluates all cached memories and performs appropriate actions:
   * - delete: Remove fully decayed memories
   * - compress: Compress at-risk memories
   * - keep: No action needed
   *
   * @returns Results of decay evaluation
   */
  async runDecay(): Promise<{
    processed: number
    deleted: number
    compressed: number
    kept: number
    results: DecayResult[]
  }> {
    if (!this.decayManager) {
      return { processed: 0, deleted: 0, compressed: 0, kept: 0, results: [] }
    }

    const memories = Array.from(this.cache.values())
    const candidates = this.decayManager.findDecayCandidates(
      memories as any[], // Cast to Memory type
      { limit: 100 }
    )

    let deleted = 0
    let compressed = 0
    let kept = 0

    for (const result of candidates) {
      try {
        switch (result.action) {
          case 'delete':
            await this.deleteMemory(result.id)
            deleted++
            this.emitEvent({
              type: 'memory:expired',
              timestamp: new Date(),
              data: { id: result.id, reason: result.reason },
            })
            break

          case 'compress':
            await this.compressMemory(result.id)
            compressed++
            break

          default:
            kept++
        }
      } catch (error) {
        if (this.config.debug) {
          console.error(`Failed to process decay for ${result.id}:`, error)
        }
      }
    }

    if (this.config.debug && candidates.length > 0) {
      console.log(
        `[MemoryService] Decay cycle complete: ` +
          `${deleted} deleted, ${compressed} compressed, ${kept} kept`
      )
    }

    return {
      processed: candidates.length,
      deleted,
      compressed,
      kept,
      results: candidates,
    }
  }

  /**
   * Get decay statistics for all memories
   *
   * Returns health metrics about memory decay status.
   */
  getDecayStats(): {
    total: number
    healthy: number
    atRisk: number
    expiring: number
    expired: number
    byAction: { keep: number; compress: number; delete: number }
    averageDecayScore: number
  } | null {
    if (!this.decayManager) {
      return null
    }

    const memories = Array.from(this.cache.values())
    return this.decayManager.getStats(memories as any[])
  }

  /**
   * Run a single summarization cycle
   * Finds old memories and compresses them to save space
   */
  private async runSummarizationCycle(): Promise<void> {
    const now = new Date()
    const candidatesForSummarization: MemoryItem[] = []

    // Find memories that need summarization
    for (const memory of this.cache.values()) {
      // Skip if already compressed
      if (memory.compressed) continue

      // Skip if content is missing or invalid
      if (!memory.content || typeof memory.content !== 'string') continue

      // Skip if content is too short (less than 200 chars)
      if (memory.content.length < 200) continue

      // Skip if too recent (less than 1 hour old)
      const createdAt =
        memory.createdAt instanceof Date
          ? memory.createdAt
          : new Date(memory.createdAt)
      const ageMs = now.getTime() - createdAt.getTime()
      if (isNaN(ageMs) || ageMs < 60 * 60 * 1000) continue

      // Skip high priority or critical memories
      if (memory.priority === 'critical' || memory.priority === 'high') continue

      // Check if memory has low access count (not frequently used)
      if (memory.accessCount > 5) continue

      candidatesForSummarization.push(memory)
    }

    // Limit batch size to avoid overwhelming the system
    const batchSize = 10
    const batch = candidatesForSummarization.slice(0, batchSize)

    // Track metrics for this cycle
    let summarizedCount = 0
    let bytesSaved = 0
    let skippedCount = 0

    // Summarize each memory
    for (const memory of batch) {
      try {
        const summary = this.createSummary(memory.content)

        // Only update if summary is significantly shorter
        if (summary.length < memory.content.length * 0.7) {
          await this.updateMemory(memory.id, {
            compressed: summary,
            original: memory.content,
            content: summary, // Use summary as primary content
          })

          this.emitEvent({
            type: 'memory:compressed',
            timestamp: new Date(),
            memory: { ...memory, compressed: summary },
          })

          summarizedCount++
          bytesSaved += memory.content.length - summary.length

          if (this.config.debug) {
            console.log(
              `Summarized memory ${memory.id}: ${memory.content.length} -> ${summary.length} chars`
            )
          }
        } else {
          skippedCount++
        }
      } catch (error) {
        if (this.config.debug) {
          console.error(`Failed to summarize memory ${memory.id}:`, error)
        }
      }
    }

    // Log cycle metrics
    if (this.config.debug && (summarizedCount > 0 || batch.length > 0)) {
      console.log(
        `[MemoryService] Summarization cycle complete: ` +
          `${summarizedCount}/${batch.length} memories compressed, ` +
          `${bytesSaved} bytes saved, ` +
          `${skippedCount} skipped (insufficient compression), ` +
          `${candidatesForSummarization.length - batch.length} queued for next cycle`
      )
    }
  }

  /**
   * Split text into sentences, handling common abbreviations
   */
  private splitIntoSentences(text: string): string[] {
    // Common abbreviations that shouldn't trigger sentence splits
    const abbreviations =
      /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|e\.g|i\.e|Inc|Ltd|Corp|Co|U\.S|U\.K)\./gi

    // Temporarily replace abbreviation periods with placeholder
    const placeholder = '<<<DOT>>>'
    const protected_ = text.replace(abbreviations, (match) =>
      match.replace(/\./g, placeholder)
    )

    // Split on sentence-ending punctuation followed by space or end
    const sentences = protected_
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.replace(new RegExp(placeholder, 'g'), '.').trim())
      .filter((s) => s.length > 10)

    return sentences
  }

  /**
   * Create a summary of text content
   * Uses extractive summarization to preserve key information
   */
  private createSummary(content: string, maxLength: number = 200): string {
    // Split into sentences using abbreviation-aware splitter
    const sentences = this.splitIntoSentences(content)

    if (sentences.length <= 2) {
      // Content is already short, just truncate if needed
      return content.length > maxLength
        ? content.slice(0, maxLength - 3) + '...'
        : content
    }

    // Score sentences by importance
    const scoredSentences = sentences.map((sentence, index) => {
      let score = 0

      // First and last sentences are usually important
      if (index === 0) score += 3
      if (index === sentences.length - 1) score += 2

      // Sentences with key phrases
      const keyPhrases = [
        /important/i,
        /key/i,
        /main/i,
        /summary/i,
        /conclusion/i,
        /result/i,
        /because/i,
        /therefore/i,
        /however/i,
      ]
      for (const phrase of keyPhrases) {
        if (phrase.test(sentence)) score += 1
      }

      // Longer sentences often contain more information
      if (sentence.length > 50) score += 1
      if (sentence.length > 100) score += 1

      return { sentence, score, index }
    })

    // Sort by score and select top sentences
    scoredSentences.sort((a, b) => b.score - a.score)

    // Build summary from top sentences, preserving original order
    const selectedIndices = new Set<number>()
    let currentLength = 0

    for (const { sentence, index } of scoredSentences) {
      if (currentLength + sentence.length + 2 > maxLength) break
      selectedIndices.add(index)
      currentLength += sentence.length + 2
    }

    // Reconstruct in original order
    const summaryParts = sentences.filter((_, i) => selectedIndices.has(i))

    if (summaryParts.length === 0) {
      // Fallback: just take the first part
      return content.slice(0, maxLength - 3) + '...'
    }

    return summaryParts.join('. ') + '.'
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
    if (this.decayInterval) {
      clearInterval(this.decayInterval)
    }
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
    return `mem_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
  }

  private getHigherPriority(current: MemoryPriority): MemoryPriority {
    const priorities: MemoryPriority[] = ['low', 'medium', 'high', 'critical']
    const index = priorities.indexOf(current)
    const nextIndex = Math.min(index + 1, priorities.length - 1)
    return priorities[nextIndex]!
  }

  private createMemoryFromMatch(match: VectorStoreMatch): MemoryItem {
    const metadata = match.metadata || {}
    return {
      id: match.id,
      type: (metadata['type'] as MemoryType | undefined) || 'episodic',
      scope: (metadata['scope'] as MemoryScope | undefined) || 'session',
      content: (metadata['content'] as string | undefined) || '',
      metadata: metadata,
      embedding: match.values,
      confidence: match.score || 0.5,
      priority:
        (metadata['priority'] as MemoryPriority | undefined) || 'medium',
      tokens: TokenCounter.count(
        (metadata['content'] as string | undefined) || ''
      ),
      accessCount: 0,
      lastAccessed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  private assessConversationActivity(): 'low' | 'medium' | 'high' {
    // Simple heuristic based on recent memories
    const recentMemories = Array.from(this.cache.values()).filter((m) => {
      const age = Date.now() - m.createdAt.getTime()
      return age < 5 * 60 * 1000 // Last 5 minutes
    })

    if (recentMemories.length > 10) return 'high'
    if (recentMemories.length > 5) return 'medium'
    return 'low'
  }

  private assessPreferenceRichness(): 'low' | 'medium' | 'high' {
    const semanticMemories = Array.from(this.cache.values()).filter(
      (m) => m.type === 'semantic'
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
   * Get retention TTL for memory (checks both type and scope)
   *
   * Priority order:
   * 1. Memory type (episodic, semantic, procedural, etc.)
   * 2. Memory scope (session, thread, global, user)
   * 3. Default retention policies
   *
   * @param memory - Memory item
   * @returns TTL in seconds (0 = never expires)
   */
  private getRetentionForMemory(memory: MemoryItem): number {
    const policy = this.config.retentionPolicy || {}

    // Check type-specific retention first (higher priority)
    if (memory.type) {
      const typeRetention = policy[memory.type as keyof typeof policy]
      if (typeRetention !== undefined) {
        return typeRetention
      }

      // Fall back to defaults for type
      const typeDefault = DEFAULT_RETENTION_POLICY[memory.type as keyof typeof DEFAULT_RETENTION_POLICY]
      if (typeDefault !== undefined) {
        return typeDefault
      }
    }

    // Fall back to scope-based retention
    switch (memory.scope) {
      case 'session':
        return policy.session ?? DEFAULT_RETENTION_POLICY.session
      case 'thread':
        return policy.thread ?? DEFAULT_RETENTION_POLICY.thread
      case 'global':
        return policy.global ?? DEFAULT_RETENTION_POLICY.global
      case 'user':
        return policy.user ?? DEFAULT_RETENTION_POLICY.user
      default:
        return DEFAULT_RETENTION_POLICY.session // Safe default
    }
  }

  /**
   * @deprecated Use getRetentionForMemory instead
   */
  // private getRetentionForScope(scope: MemoryScope): number {
  //   const policy = this.config.retentionPolicy || {}
  //   switch (scope) {
  //     case 'session':
  //       return policy.session ?? DEFAULT_RETENTION_POLICY.session
  //     case 'thread':
  //       return policy.thread ?? DEFAULT_RETENTION_POLICY.thread
  //     case 'global':
  //       return policy.global ?? DEFAULT_RETENTION_POLICY.global
  //     case 'user':
  //       return policy.user ?? DEFAULT_RETENTION_POLICY.user
  //     default:
  //       return DEFAULT_RETENTION_POLICY.session
  //   }
  // }

  /**
   * Get optimizer
   */
  getOptimizer(): ContextOptimizerAdapter {
    return this.optimizer
  }

  /**
   * Convenience methods (aliases and simplified API)
   */

  /**
   * Add a memory (simplified API)
   */
  async add(content: string, options?: AddOptions): Promise<string> {
    const memory = await this.addMemory(
      content,
      options?.type || 'episodic',
      options?.scope || 'session',
      {},
      {
        embedding: options?.embedding,
      }
    )

    // Update importance and tags if provided
    if (options?.importance !== undefined || options?.tags !== undefined) {
      await this.updateMemory(memory.id, {
        importance: options?.importance,
        tags: options?.tags,
      })
    }

    return memory.id
  }

  /**
   * Recall memories matching a query (alias for query)
   */
  async recall(
    queryText: string,
    options?: Partial<MemoryQuery>
  ): Promise<MemorySearchResult[]> {
    return this.query({ query: queryText, ...options })
  }

  /**
   * Get optimized context bundle
   */
  async context(options?: ContextOptions): Promise<ContextBundle> {
    // Query memories
    const allMemories = await this.query({
      limit: options?.maxTokens ? Math.floor(options.maxTokens / 100) : 50,
    })

    // Get token breakdown
    const allocation = this.optimizer.getBudgetManager().getAllocation()

    // Build formatted context
    const semanticMems = allMemories
      .filter((r) => r.memory.type === 'semantic')
      .map((r) => r.memory)
    const episodicMems = allMemories
      .filter((r) => r.memory.type === 'episodic')
      .map((r) => r.memory)

    const formatted = [
      options?.includeSummary ? '# Context Summary' : '',
      semanticMems.length > 0
        ? `\n## Semantic Memories\n${semanticMems.map((m) => m.content).join('\n')}`
        : '',
      episodicMems.length > 0
        ? `\n## Recent Events\n${episodicMems.map((m) => m.content).join('\n')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n')

    const totalTokens = TokenCounter.count(formatted)

    const breakdown: TokenBreakdown = {
      systemPrompt: allocation.systemPrompt,
      userPreferences: allocation.userPreferences,
      recentContext: allocation.recentContext,
      semanticMemory: allocation.semanticMemory,
      episodicMemory: allocation.episodicMemory,
      responseReserve: allocation.responseReserve,
      total: totalTokens,
    }

    return {
      memories: allMemories.map((r) => r.memory),
      totalTokens,
      tokenBreakdown: breakdown,
      formatted,
      semanticMemories: semanticMems,
      episodicMemories: episodicMems,
    }
  }

  /**
   * Get a memory by ID
   */
  async get(id: string): Promise<MemoryItem | null> {
    // Check cache first
    const cached = this.cache.get(id)
    if (cached) {
      return cached
    }

    // Search through all cached memories
    for (const [, memory] of this.cache) {
      if (memory.id === id) {
        return memory
      }
    }

    return null
  }

  /**
   * Update a memory (alias for updateMemory)
   */
  async update(id: string, updates: Partial<MemoryItem>): Promise<void> {
    await this.updateMemory(id, updates)
  }

  /**
   * Promote a memory (alias for promoteMemory)
   */
  async promote(id: string): Promise<void> {
    await this.promoteMemory(id, 'global')
  }

  /**
   * Compress a memory (alias for compressMemory)
   */
  async compress(id: string): Promise<void> {
    await this.compressMemory(id)
  }

  /**
   * Flush buffer (alias for flushBuffer)
   */
  async flush(): Promise<void> {
    return this.flushBuffer()
  }

  /**
   * Forget a memory (alias for deleteMemory)
   */
  async forget(id: string): Promise<boolean> {
    return this.deleteMemory(id)
  }

  /**
   * Generate embedding for text
   */
  async embed(text: string): Promise<number[]> {
    if (!this.embeddings) {
      throw new Error('Embedding provider not configured')
    }
    return this.embeddings.embedText(text)
  }

  /**
   * Inspect memory state for debugging
   */
  async inspect(): Promise<{
    memories: MemoryItem[]
    stats: MemoryStats
    buffer: MemoryBuffer
  }> {
    const memories = Array.from(this.cache.values())
    const stats = await this.getStats()
    return {
      memories,
      stats,
      buffer: this.buffer,
    }
  }

  /**
   * Close and cleanup
   */
  async close(): Promise<void> {
    // Clear intervals
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    if (this.summarizationInterval) {
      clearInterval(this.summarizationInterval)
    }
    if (this.decayInterval) {
      clearInterval(this.decayInterval)
    }

    // Flush buffer
    await this.flushBuffer()

    // Close vector store if applicable
    if (this.vectorStore && 'close' in this.vectorStore) {
      await (this.vectorStore as any).close()
    }

    // Clear cache
    this.cache.clear()
  }
}

/**
 * Alias for MemoryService (backward compatibility)
 */
export { MemoryService as ClarityMemory }
