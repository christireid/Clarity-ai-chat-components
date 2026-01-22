/**
 * DELIVERY-1: Message Deduplication Utility
 *
 * Provides utilities for detecting and removing duplicate messages in streaming scenarios.
 * Useful for achieving exactly-once delivery semantics when combined with application-level
 * message IDs or idempotency keys.
 *
 * **Use Cases:**
 * - SSE reconnection with overlapping events
 * - WebSocket message replay during network issues
 * - Preventing duplicate rendering in chat applications
 * - Idempotent message processing
 *
 * @module MessageDeduplication
 */

/**
 * Message with optional ID for deduplication
 */
export interface DeduplicatableMessage<T = unknown> {
  /** Unique message ID (if provided by server) */
  id?: string
  /** Message content/data */
  data: T
  /** Optional timestamp for TTL-based cleanup */
  timestamp?: number
}

/**
 * Options for message deduplicator
 */
export interface MessageDeduplicatorOptions {
  /**
   * Maximum number of message IDs to track (default: 1000)
   * Prevents unbounded memory growth
   */
  maxTrackedIds?: number

  /**
   * Time-to-live for tracked IDs in milliseconds (default: 5 minutes)
   * IDs older than this are automatically removed
   */
  ttlMs?: number

  /**
   * Use content hashing for messages without IDs (default: false)
   * WARNING: Hashing can be expensive for large messages
   */
  useContentHash?: boolean

  /**
   * Custom hash function for content-based deduplication
   * Only used if useContentHash is true
   */
  hashFn?: (data: unknown) => string
}

/**
 * Simple FNV-1a hash implementation for content-based deduplication
 * Fast and sufficient for deduplication (not cryptographic)
 */
function fnv1aHash(str: string): string {
  let hash = 2166136261 // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
  }
  return (hash >>> 0).toString(36) // Convert to base36 string
}

/**
 * Default hash function - JSON.stringify + FNV-1a
 */
function defaultHashFn(data: unknown): string {
  try {
    return fnv1aHash(JSON.stringify(data))
  } catch {
    // Fallback to string representation if JSON.stringify fails
    return fnv1aHash(String(data))
  }
}

/**
 * Message deduplicator using LRU cache with TTL
 *
 * @example
 * ```typescript
 * const deduplicator = new MessageDeduplicator({
 *   maxTrackedIds: 500,
 *   ttlMs: 300000, // 5 minutes
 *   useContentHash: false
 * })
 *
 * // Check if message is duplicate
 * const message = { id: 'msg-123', data: { text: 'Hello' } }
 * if (!deduplicator.isDuplicate(message)) {
 *   deduplicator.markSeen(message)
 *   processMessage(message)
 * }
 *
 * // Or use filter helper
 * const uniqueMessages = deduplicator.filterDuplicates(messages)
 * ```
 */
export class MessageDeduplicator<T = unknown> {
  private seenIds = new Map<string, number>() // id -> timestamp
  private maxTrackedIds: number
  private ttlMs: number
  private useContentHash: boolean
  private hashFn: (data: unknown) => string

  constructor(options: MessageDeduplicatorOptions = {}) {
    this.maxTrackedIds = options.maxTrackedIds ?? 1000
    this.ttlMs = options.ttlMs ?? 300000 // 5 minutes default
    this.useContentHash = options.useContentHash ?? false
    this.hashFn = options.hashFn ?? defaultHashFn
  }

  /**
   * Check if a message is a duplicate (already seen)
   */
  isDuplicate(message: DeduplicatableMessage<T>): boolean {
    this.cleanupExpired()

    const id = this.getMessageId(message)
    if (!id) {
      // No ID and content hashing disabled - can't detect duplicates
      return false
    }

    return this.seenIds.has(id)
  }

  /**
   * Mark a message as seen (add to deduplication set)
   */
  markSeen(message: DeduplicatableMessage<T>): void {
    const id = this.getMessageId(message)
    if (!id) {
      return
    }

    const timestamp = message.timestamp ?? Date.now()
    this.seenIds.set(id, timestamp)

    // Enforce max size limit (LRU eviction)
    if (this.seenIds.size > this.maxTrackedIds) {
      this.evictOldest()
    }
  }

  /**
   * Filter an array of messages to remove duplicates
   * Marks all unique messages as seen
   */
  filterDuplicates(messages: DeduplicatableMessage<T>[]): DeduplicatableMessage<T>[] {
    return messages.filter((msg) => {
      if (this.isDuplicate(msg)) {
        return false
      }
      this.markSeen(msg)
      return true
    })
  }

  /**
   * Clear all tracked message IDs
   */
  clear(): void {
    this.seenIds.clear()
  }

  /**
   * Get current count of tracked message IDs
   */
  getTrackedCount(): number {
    return this.seenIds.size
  }

  /**
   * Get message ID (from id field or content hash)
   */
  private getMessageId(message: DeduplicatableMessage<T>): string | null {
    // Prefer explicit ID if provided
    if (message.id) {
      return message.id
    }

    // Fall back to content hash if enabled
    if (this.useContentHash) {
      return this.hashFn(message.data)
    }

    return null
  }

  /**
   * Remove expired IDs based on TTL
   */
  private cleanupExpired(): void {
    const now = Date.now()
    const expiredIds: string[] = []

    for (const [id, timestamp] of this.seenIds.entries()) {
      if (now - timestamp > this.ttlMs) {
        expiredIds.push(id)
      }
    }

    for (const id of expiredIds) {
      this.seenIds.delete(id)
    }
  }

  /**
   * Evict oldest entry (LRU)
   */
  private evictOldest(): void {
    let oldestId: string | null = null
    let oldestTimestamp = Infinity

    for (const [id, timestamp] of this.seenIds.entries()) {
      if (timestamp < oldestTimestamp) {
        oldestTimestamp = timestamp
        oldestId = id
      }
    }

    if (oldestId) {
      this.seenIds.delete(oldestId)
    }
  }
}

/**
 * React Hook for message deduplication
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const deduplicator = useMessageDeduplicator({
 *     maxTrackedIds: 500,
 *     ttlMs: 300000,
 *   })
 *
 *   const handleMessage = (msg: Message) => {
 *     if (!deduplicator.isDuplicate(msg)) {
 *       deduplicator.markSeen(msg)
 *       setMessages(prev => [...prev, msg])
 *     }
 *   }
 *
 *   return <div>...</div>
 * }
 * ```
 */
export function useMessageDeduplicator<T = unknown>(
  options: MessageDeduplicatorOptions = {}
): MessageDeduplicator<T> {
  // Use ref to maintain same instance across renders
  const deduplicatorRef = React.useRef<MessageDeduplicator<T> | null>(null)

  if (!deduplicatorRef.current) {
    deduplicatorRef.current = new MessageDeduplicator<T>(options)
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      deduplicatorRef.current?.clear()
    }
  }, [])

  return deduplicatorRef.current
}

// React import for hook
import * as React from 'react'
