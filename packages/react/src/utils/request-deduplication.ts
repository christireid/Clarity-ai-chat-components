/**
 * Request Deduplication Utility
 *
 * Prevents duplicate API requests from being sent, typically caused by
 * user double-clicks or React StrictMode re-renders.
 *
 * Strategies:
 * - `pending`: Dedupe while request is in-flight (returns same promise)
 * - `debounce`: Debounce requests within a time window
 * - `both`: Apply both pending and debounce deduplication
 *
 * @example
 * ```ts
 * const deduper = new RequestDeduplicator({ debounceMs: 300 })
 *
 * // These will be deduplicated into one request
 * const result1 = deduper.execute('chat-1', () => fetch('/api/chat'))
 * const result2 = deduper.execute('chat-1', () => fetch('/api/chat'))
 * // result1 === result2 (same promise)
 * ```
 */

export interface DeduplicationOptions {
  /** Debounce window in ms (default: 300) */
  debounceMs?: number
  /** Strategy: 'pending' | 'debounce' | 'both' (default: 'both') */
  strategy?: 'pending' | 'debounce' | 'both'
  /** Generate cache key from request (default: uses provided key) */
  generateKey?: (key: string) => string
  /** Callback when request is deduplicated */
  onDedupe?: (key: string) => void
}

export interface DeduplicationStats {
  /** Total requests received */
  totalRequests: number
  /** Requests that were deduplicated */
  deduplicatedRequests: number
  /** Currently pending requests */
  pendingCount: number
}

interface PendingRequest<T> {
  promise: Promise<T>
  timestamp: number
}

/**
 * Request deduplicator class
 */
export class RequestDeduplicator {
  private readonly debounceMs: number
  private readonly strategy: 'pending' | 'debounce' | 'both'
  private readonly generateKey: (key: string) => string
  private readonly onDedupe?: (key: string) => void

  private pendingRequests = new Map<string, PendingRequest<any>>()
  private lastRequestTime = new Map<string, number>()
  private debounceTimers = new Map<string, NodeJS.Timeout>()

  private totalRequests = 0
  private deduplicatedRequests = 0

  constructor(options: DeduplicationOptions = {}) {
    this.debounceMs = options.debounceMs ?? 300
    this.strategy = options.strategy ?? 'both'
    this.generateKey = options.generateKey ?? ((key) => key)
    this.onDedupe = options.onDedupe
  }

  /**
   * Execute a request with deduplication
   *
   * @param key - Unique key for the request
   * @param fn - Function that returns a promise
   * @returns The promise result (may be shared with other deduplicated calls)
   */
  async execute<T>(key: string, fn: () => Promise<T>): Promise<T> {
    this.totalRequests++
    const cacheKey = this.generateKey(key)

    // Check pending deduplication
    if (this.strategy === 'pending' || this.strategy === 'both') {
      const pending = this.pendingRequests.get(cacheKey)
      if (pending) {
        this.deduplicatedRequests++
        this.onDedupe?.(cacheKey)
        return pending.promise
      }
    }

    // Check debounce deduplication
    if (this.strategy === 'debounce' || this.strategy === 'both') {
      const lastTime = this.lastRequestTime.get(cacheKey)
      const now = Date.now()

      if (lastTime && now - lastTime < this.debounceMs) {
        // Return a rejected promise for debounced requests
        this.deduplicatedRequests++
        this.onDedupe?.(cacheKey)
        return Promise.reject(new DebouncedError(cacheKey, this.debounceMs))
      }

      this.lastRequestTime.set(cacheKey, now)
    }

    // Execute the request
    const promise = fn()

    // Track pending request
    this.pendingRequests.set(cacheKey, {
      promise,
      timestamp: Date.now(),
    })

    try {
      const result = await promise
      return result
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }

  /**
   * Execute with debounce - waits for debounce window before executing
   *
   * @param key - Unique key for the request
   * @param fn - Function that returns a promise
   * @returns Promise that resolves after debounce window
   */
  executeDebounced<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const cacheKey = this.generateKey(key)

    return new Promise((resolve, reject) => {
      // Clear existing timer
      const existingTimer = this.debounceTimers.get(cacheKey)
      if (existingTimer) {
        clearTimeout(existingTimer)
        this.deduplicatedRequests++
        this.onDedupe?.(cacheKey)
      }

      this.totalRequests++

      // Set new timer
      const timer = setTimeout(async () => {
        this.debounceTimers.delete(cacheKey)

        try {
          const result = await this.execute(cacheKey, fn)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, this.debounceMs)

      this.debounceTimers.set(cacheKey, timer)
    })
  }

  /**
   * Check if a request is currently pending
   */
  isPending(key: string): boolean {
    const cacheKey = this.generateKey(key)
    return this.pendingRequests.has(cacheKey)
  }

  /**
   * Cancel a pending debounced request
   */
  cancelDebounced(key: string): boolean {
    const cacheKey = this.generateKey(key)
    const timer = this.debounceTimers.get(cacheKey)

    if (timer) {
      clearTimeout(timer)
      this.debounceTimers.delete(cacheKey)
      return true
    }

    return false
  }

  /**
   * Get current statistics
   */
  getStats(): DeduplicationStats {
    return {
      totalRequests: this.totalRequests,
      deduplicatedRequests: this.deduplicatedRequests,
      pendingCount: this.pendingRequests.size,
    }
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.totalRequests = 0
    this.deduplicatedRequests = 0
  }

  /**
   * Clear all pending state
   */
  clear(): void {
    this.pendingRequests.clear()
    this.lastRequestTime.clear()

    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer)
    }
    this.debounceTimers.clear()
  }

  /**
   * Destroy the deduplicator
   */
  destroy(): void {
    this.clear()
    this.resetStats()
  }
}

/**
 * Error thrown when request is debounced
 */
export class DebouncedError extends Error {
  public readonly key: string
  public readonly debounceMs: number

  constructor(key: string, debounceMs: number) {
    super(`Request '${key}' was debounced (within ${debounceMs}ms window)`)
    this.name = 'DebouncedError'
    this.key = key
    this.debounceMs = debounceMs
  }
}

/**
 * Check if error is a DebouncedError
 */
export function isDebouncedError(error: unknown): error is DebouncedError {
  return error instanceof DebouncedError
}

/**
 * Create a simple key generator from message content
 *
 * @example
 * ```ts
 * const key = createMessageKey(messages)
 * ```
 */
export function createMessageKey(
  messages: Array<{ role: string; content: string }>
): string {
  // Use last user message as primary key
  const lastUserMessage = messages.filter((m) => m.role === 'user').pop()

  if (lastUserMessage) {
    // Create a simple hash from content
    const content =
      typeof lastUserMessage.content === 'string'
        ? lastUserMessage.content
        : JSON.stringify(lastUserMessage.content)

    return `msg-${simpleHash(content)}`
  }

  return `msg-${Date.now()}`
}

/**
 * Simple string hash function
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * React hook for request deduplication
 *
 * @example
 * ```tsx
 * const { execute, isPending, stats } = useRequestDeduplication({ debounceMs: 300 })
 *
 * const handleSubmit = async () => {
 *   try {
 *     const result = await execute('chat', () => fetch('/api/chat'))
 *   } catch (error) {
 *     if (isDebouncedError(error)) {
 *       // Request was debounced, ignore
 *       return
 *     }
 *     throw error
 *   }
 * }
 * ```
 */
export function createDeduplicator(
  options?: DeduplicationOptions
): RequestDeduplicator {
  return new RequestDeduplicator(options)
}
