/**
 * Reference-Based Data Handling
 * 
 * Use references instead of sending full data to reduce payload size.
 * Can save 50%+ on large documents or attachments.
 */

export interface Reference {
  /** Reference ID */
  id: string
  /** Reference type */
  type: 'document' | 'image' | 'file' | 'conversation' | 'custom'
  /** Reference metadata */
  metadata?: Record<string, any>
  /** Creation timestamp */
  timestamp: number
  /** Size in bytes (if applicable) */
  size?: number
}

export interface ReferencedData<T = any> {
  /** Reference ID */
  refId: string
  /** Actual data */
  data: T
  /** Data size in bytes */
  size: number
  /** Creation timestamp */
  timestamp: number
  /** Access count */
  accessCount: number
  /** Last accessed timestamp */
  lastAccessed: number
  /** TTL in milliseconds */
  ttl?: number
}

export interface ReferenceStats {
  /** Total references created */
  totalReferences: number
  /** Total data size stored (bytes) */
  totalDataSize: number
  /** Total payload size saved (bytes) */
  payloadSaved: number
  /** Average reference size vs actual data size */
  averageCompressionRatio: number
  /** Cache hit rate */
  hitRate: number
}

/**
 * Calculate data size in bytes
 */
function calculateSize(data: any): number {
  const str = typeof data === 'string' ? data : JSON.stringify(data)
  return new Blob([str]).size
}

/**
 * Reference handler for managing data references
 * 
 * @example
 * ```tsx
 * const handler = new ReferenceHandler()
 * 
 * // Store large document
 * const docRef = handler.create('document', largeDocument)
 * 
 * // Send only reference to API
 * await api.query({
 *   message: 'Summarize this',
 *   documentRef: docRef.id // Only ~20 bytes instead of full doc
 * })
 * 
 * // Retrieve data when needed
 * const doc = handler.resolve(docRef.id)
 * ```
 */
export class ReferenceHandler {
  private references: Map<string, ReferencedData> = new Map()
  private stats: ReferenceStats = {
    totalReferences: 0,
    totalDataSize: 0,
    payloadSaved: 0,
    averageCompressionRatio: 0,
    hitRate: 0,
  }
  private hits = 0
  private misses = 0

  constructor(
    private options: {
      maxSize?: number
      defaultTTL?: number
      onEvict?: (ref: ReferencedData) => void
    } = {}
  ) {
    this.options.maxSize = options.maxSize ?? 100
    this.options.defaultTTL = options.defaultTTL ?? 0 // 0 = no expiry
  }

  /**
   * Create reference for data
   */
  create<T = any>(
    type: Reference['type'],
    data: T,
    options?: {
      ttl?: number
      metadata?: Record<string, any>
    }
  ): Reference {
    const id = this.generateId()
    const size = calculateSize(data)
    const timestamp = Date.now()

    const referencedData: ReferencedData<T> = {
      refId: id,
      data,
      size,
      timestamp,
      accessCount: 0,
      lastAccessed: timestamp,
      ttl: options?.ttl ?? this.options.defaultTTL,
    }

    this.references.set(id, referencedData)

    // Update stats
    this.stats.totalReferences++
    this.stats.totalDataSize += size
    
    // Reference ID is much smaller than actual data
    const referenceSize = id.length + 20 // ID + overhead
    this.stats.payloadSaved += size - referenceSize
    
    this.updateCompressionRatio()

    // Enforce max size
    if (this.references.size > this.options.maxSize!) {
      this.evictLRU()
    }

    const reference: Reference = {
      id,
      type,
      metadata: options?.metadata,
      timestamp,
      size,
    }

    return reference
  }

  /**
   * Resolve reference to get data
   */
  resolve<T = any>(refId: string): T | null {
    const ref = this.references.get(refId)

    if (!ref) {
      this.misses++
      this.updateHitRate()
      return null
    }

    // Check expiry
    if (ref.ttl && ref.ttl > 0 && Date.now() - ref.timestamp > ref.ttl) {
      this.references.delete(refId)
      this.misses++
      this.updateHitRate()
      return null
    }

    // Update access info
    ref.accessCount++
    ref.lastAccessed = Date.now()
    this.hits++
    this.updateHitRate()

    return ref.data as T
  }

  /**
   * Check if reference exists
   */
  exists(refId: string): boolean {
    return this.references.has(refId)
  }

  /**
   * Delete reference
   */
  delete(refId: string): boolean {
    return this.references.delete(refId)
  }

  /**
   * Clear all references
   */
  clear(): void {
    this.references.clear()
    this.resetStats()
  }

  /**
   * Clear expired references
   */
  clearExpired(): void {
    const now = Date.now()
    for (const [id, ref] of this.references.entries()) {
      if (ref.ttl && ref.ttl > 0 && now - ref.timestamp > ref.ttl) {
        this.references.delete(id)
      }
    }
  }

  /**
   * Get all references
   */
  getAll(): Reference[] {
    return Array.from(this.references.values()).map((ref) => ({
      id: ref.refId,
      type: 'custom' as const,
      timestamp: ref.timestamp,
      size: ref.size,
    }))
  }

  /**
   * Get statistics
   */
  getStats(): ReferenceStats {
    return { ...this.stats }
  }

  /**
   * Evict least recently used reference
   */
  private evictLRU(): void {
    let oldestRef: string | null = null
    let oldestTime = Infinity

    for (const [id, ref] of this.references.entries()) {
      const score = ref.lastAccessed - (ref.accessCount * 10000)
      if (score < oldestTime) {
        oldestTime = score
        oldestRef = id
      }
    }

    if (oldestRef) {
      const ref = this.references.get(oldestRef)
      this.references.delete(oldestRef)
      if (ref) {
        this.options.onEvict?.(ref)
      }
    }
  }

  /**
   * Update compression ratio
   */
  private updateCompressionRatio(): void {
    if (this.stats.totalReferences === 0) {
      this.stats.averageCompressionRatio = 0
      return
    }

    const avgDataSize = this.stats.totalDataSize / this.stats.totalReferences
    const avgReferenceSize = 40 // Approximate reference size
    this.stats.averageCompressionRatio = avgDataSize / avgReferenceSize
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    const total = this.hits + this.misses
    this.stats.hitRate = total > 0 ? (this.hits / total) * 100 : 0
  }

  /**
   * Reset statistics
   */
  private resetStats(): void {
    this.stats = {
      totalReferences: 0,
      totalDataSize: 0,
      payloadSaved: 0,
      averageCompressionRatio: 0,
      hitRate: 0,
    }
    this.hits = 0
    this.misses = 0
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Create a reference context for conversation history
 * Replaces full history with references to previous messages
 */
export function createConversationReference(
  messages: Array<{ role: string; content: string }>,
  handler: ReferenceHandler
): {
  reference: Reference
  compressedMessages: Array<{ role: string; content: string; ref?: string }>
  savedBytes: number
} {
  // Store full conversation
  const fullConversation = JSON.stringify(messages)
  const ref = handler.create('conversation', messages, {
    metadata: { messageCount: messages.length },
  })

  // Create compressed version with only recent messages + reference
  const recentCount = Math.min(3, messages.length)
  const recentMessages = messages.slice(-recentCount)
  
  const compressedMessages = [
    {
      role: 'system',
      content: `[Previous conversation: ${ref.id}]`,
      ref: ref.id,
    },
    ...recentMessages,
  ]

  const compressedSize = calculateSize(compressedMessages)
  const originalSize = calculateSize(messages)
  const savedBytes = originalSize - compressedSize

  return {
    reference: ref,
    compressedMessages,
    savedBytes,
  }
}
