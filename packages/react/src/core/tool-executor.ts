/**
 * Tool Executor
 *
 * Executes tools with validation, timeout protection, and caching.
 * Integrates with lifecycle manager for state tracking and event emission.
 *
 * **Features**:
 * - JSON Schema validation of parameters
 * - Timeout protection with AbortSignal
 * - Result caching for cacheable tools
 * - Lifecycle integration
 * - Error handling and recovery
 * - Execution hooks
 *
 * @module core/tool-executor
 */

import type {
  ToolDefinition,
  ToolArguments,
  ToolResult,
  ToolExecutionContext,
} from '../types/tool-definition'
import type { ToolLifecycleManager } from './tool-lifecycle'

// =============================================================================
// Validation
// =============================================================================

/**
 * Validation error
 */
export class ToolValidationError extends Error {
  constructor(
    public toolName: string,
    public field: string,
    message: string
  ) {
    super(`[${toolName}] Parameter validation failed for '${field}': ${message}`)
    this.name = 'ToolValidationError'
  }
}

/**
 * Validate tool arguments against parameter schema
 *
 * @param tool - Tool definition
 * @param args - Arguments to validate
 * @throws ToolValidationError if validation fails
 */
export function validateToolArguments(
  tool: ToolDefinition,
  args: ToolArguments
): void {
  const { parameters } = tool

  // Check required fields
  if (parameters.required) {
    for (const field of parameters.required) {
      if (!(field in args)) {
        throw new ToolValidationError(tool.name, field, 'Required field is missing')
      }
    }
  }

  // Validate each property
  for (const [key, value] of Object.entries(args)) {
    const schema = parameters.properties[key]

    if (!schema) {
      // Unknown field
      if (parameters.additionalProperties === false) {
        throw new ToolValidationError(
          tool.name,
          key,
          'Unknown field (additionalProperties: false)'
        )
      }
      continue
    }

    // Type validation
    validateValue(tool.name, key, value, schema)
  }
}

/**
 * Validate a single value against schema
 */
function validateValue(
  toolName: string,
  field: string,
  value: unknown,
  schema: any
): void {
  // Null check
  if (value === null || value === undefined) {
    if (schema.type === 'null' || schema.type?.includes('null')) {
      return
    }
    throw new ToolValidationError(toolName, field, 'Value is null or undefined')
  }

  // Type check
  const actualType = Array.isArray(value) ? 'array' : typeof value
  const expectedTypes = Array.isArray(schema.type) ? schema.type : [schema.type]

  if (!expectedTypes.includes(actualType)) {
    throw new ToolValidationError(
      toolName,
      field,
      `Expected type ${expectedTypes.join(' | ')}, got ${actualType}`
    )
  }

  // Type-specific validation
  switch (schema.type) {
    case 'string':
      validateString(toolName, field, value as string, schema)
      break
    case 'number':
    case 'integer':
      validateNumber(toolName, field, value as number, schema)
      break
    case 'array':
      validateArray(toolName, field, value as unknown[], schema)
      break
    case 'object':
      validateObject(toolName, field, value as Record<string, unknown>, schema)
      break
  }

  // Enum validation
  if (schema.enum && !schema.enum.includes(value)) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value must be one of: ${schema.enum.join(', ')}`
    )
  }
}

/**
 * Validate string value
 */
function validateString(toolName: string, field: string, value: string, schema: any): void {
  if (schema.minLength !== undefined && value.length < schema.minLength) {
    throw new ToolValidationError(
      toolName,
      field,
      `String length ${value.length} is less than minimum ${schema.minLength}`
    )
  }

  if (schema.maxLength !== undefined && value.length > schema.maxLength) {
    throw new ToolValidationError(
      toolName,
      field,
      `String length ${value.length} exceeds maximum ${schema.maxLength}`
    )
  }

  if (schema.pattern) {
    const regex = new RegExp(schema.pattern)
    if (!regex.test(value)) {
      throw new ToolValidationError(
        toolName,
        field,
        `String does not match pattern: ${schema.pattern}`
      )
    }
  }
}

/**
 * Validate number value
 */
function validateNumber(toolName: string, field: string, value: number, schema: any): void {
  if (schema.type === 'integer' && !Number.isInteger(value)) {
    throw new ToolValidationError(toolName, field, 'Value must be an integer')
  }

  if (schema.minimum !== undefined && value < schema.minimum) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} is less than minimum ${schema.minimum}`
    )
  }

  if (schema.maximum !== undefined && value > schema.maximum) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} exceeds maximum ${schema.maximum}`
    )
  }

  if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} must be greater than ${schema.exclusiveMinimum}`
    )
  }

  if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} must be less than ${schema.exclusiveMaximum}`
    )
  }

  if (schema.multipleOf !== undefined && value % schema.multipleOf !== 0) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} is not a multiple of ${schema.multipleOf}`
    )
  }
}

/**
 * Validate array value
 */
function validateArray(
  toolName: string,
  field: string,
  value: unknown[],
  schema: any
): void {
  if (schema.minItems !== undefined && value.length < schema.minItems) {
    throw new ToolValidationError(
      toolName,
      field,
      `Array length ${value.length} is less than minimum ${schema.minItems}`
    )
  }

  if (schema.maxItems !== undefined && value.length > schema.maxItems) {
    throw new ToolValidationError(
      toolName,
      field,
      `Array length ${value.length} exceeds maximum ${schema.maxItems}`
    )
  }

  if (schema.uniqueItems) {
    const unique = new Set(value.map((v) => JSON.stringify(v)))
    if (unique.size !== value.length) {
      throw new ToolValidationError(toolName, field, 'Array items must be unique')
    }
  }

  // Validate items
  if (schema.items) {
    value.forEach((item, index) => {
      validateValue(toolName, `${field}[${index}]`, item, schema.items)
    })
  }
}

/**
 * Validate object value
 */
function validateObject(
  toolName: string,
  field: string,
  value: Record<string, unknown>,
  schema: any
): void {
  if (schema.required) {
    for (const requiredField of schema.required) {
      if (!(requiredField in value)) {
        throw new ToolValidationError(
          toolName,
          `${field}.${requiredField}`,
          'Required field is missing'
        )
      }
    }
  }

  if (schema.properties) {
    for (const [key, val] of Object.entries(value)) {
      const propSchema = schema.properties[key]
      if (propSchema) {
        validateValue(toolName, `${field}.${key}`, val, propSchema)
      }
    }
  }
}

// =============================================================================
// Cache
// =============================================================================

/**
 * Cache entry with LRU tracking
 */
interface CacheEntry {
  result: ToolResult
  timestamp: number        // When entry was created
  lastAccessed: number     // When entry was last accessed (for LRU)
  ttl: number
  accessCount: number      // Number of times accessed
}

/**
 * Tool result cache configuration
 */
export interface ToolResultCacheConfig {
  /** Maximum cache size (number of entries, default: 1000) */
  maxSize?: number

  /** Enable periodic cleanup of expired entries (default: false) */
  enablePeriodicCleanup?: boolean

  /** Cleanup interval in milliseconds (default: 60000 = 1 minute) */
  cleanupIntervalMs?: number
}

/**
 * Tool result cache with LRU eviction
 *
 * **Features**:
 * - LRU (Least Recently Used) eviction when maxSize is reached
 * - TTL-based expiration
 * - Optional periodic cleanup of expired entries
 * - Cache hit/miss statistics
 * - Per-tool cache clearing
 *
 * **Usage**:
 * ```typescript
 * const cache = new ToolResultCache({
 *   maxSize: 1000,
 *   enablePeriodicCleanup: true,
 *   cleanupIntervalMs: 60000,
 * })
 * ```
 */
export class ToolResultCache {
  private cache = new Map<string, CacheEntry>()
  private hits = 0
  private misses = 0
  private evictions = 0
  private maxSize: number
  private cleanupIntervalMs: number
  private cleanupTimer?: NodeJS.Timeout | number

  constructor(config: ToolResultCacheConfig = {}) {
    this.maxSize = config.maxSize ?? 1000
    this.cleanupIntervalMs = config.cleanupIntervalMs ?? 60000

    // Start periodic cleanup if enabled
    if (config.enablePeriodicCleanup) {
      this.startPeriodicCleanup()
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startPeriodicCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired()
    }, this.cleanupIntervalMs)

    // Unref timer in Node.js to allow process to exit
    if (typeof this.cleanupTimer === 'object' && 'unref' in this.cleanupTimer) {
      this.cleanupTimer.unref()
    }
  }

  /**
   * Stop periodic cleanup
   */
  stopPeriodicCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer as any)
      this.cleanupTimer = undefined
    }
  }

  /**
   * Clean up expired entries
   * @returns Number of entries removed
   */
  cleanupExpired(): number {
    const now = Date.now()
    let removed = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        removed++
      }
    }

    return removed
  }

  /**
   * Evict least recently used entries to make room
   * @param count Number of entries to evict
   */
  private evictLRU(count: number): void {
    // Sort entries by lastAccessed (oldest first)
    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.lastAccessed - b.lastAccessed
    )

    // Remove oldest entries
    for (let i = 0; i < Math.min(count, entries.length); i++) {
      this.cache.delete(entries[i][0])
      this.evictions++
    }
  }

  /**
   * Generate cache key with robust hashing
   *
   * Handles edge cases:
   * - Circular references (uses [Circular] marker)
   * - Functions (uses function signature)
   * - Dates (uses ISO string)
   * - RegExp (uses source)
   * - Nested objects (recursive hash)
   * - Arrays (preserves order)
   * - Null/undefined (explicit markers)
   *
   * @param toolName - Tool name
   * @param args - Tool arguments
   * @returns Cache key string
   */
  private getCacheKey(toolName: string, args: ToolArguments): string {
    const seen = new WeakSet()

    const hash = (value: unknown): string => {
      // Handle primitives
      if (value === null) return 'null'
      if (value === undefined) return 'undefined'
      if (typeof value === 'string') return `"${value}"`
      if (typeof value === 'number') return String(value)
      if (typeof value === 'boolean') return String(value)

      // Handle functions
      if (typeof value === 'function') {
        return `function:${value.name || 'anonymous'}:${value.length}`
      }

      // Handle Date
      if (value instanceof Date) {
        return `date:${value.toISOString()}`
      }

      // Handle RegExp
      if (value instanceof RegExp) {
        return `regex:${value.source}:${value.flags}`
      }

      // Handle arrays
      if (Array.isArray(value)) {
        return `[${value.map(hash).join(',')}]`
      }

      // Handle objects
      if (typeof value === 'object') {
        // Check for circular references
        if (seen.has(value as object)) {
          return '[Circular]'
        }
        seen.add(value as object)

        // Sort keys for consistent hashing
        const keys = Object.keys(value).sort()
        const pairs = keys.map((key) => `${key}:${hash((value as any)[key])}`)
        return `{${pairs.join(',')}}`
      }

      // Fallback
      return String(value)
    }

    try {
      const argsHash = hash(args)
      return `${toolName}:${argsHash}`
    } catch (error) {
      // Fallback to JSON.stringify if hashing fails
      console.warn('Cache key generation failed, using fallback:', error)
      const sortedArgs = Object.keys(args)
        .sort()
        .reduce((acc, key) => {
          acc[key] = args[key]
          return acc
        }, {} as Record<string, unknown>)

      return `${toolName}:${JSON.stringify(sortedArgs)}`
    }
  }

  /**
   * Get cached result
   */
  get(toolName: string, args: ToolArguments): ToolResult | undefined {
    const key = this.getCacheKey(toolName, args)
    const entry = this.cache.get(key)

    if (!entry) {
      this.misses++
      return undefined
    }

    // Check if expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      this.misses++
      return undefined
    }

    // Update LRU tracking
    entry.lastAccessed = now
    entry.accessCount++

    this.hits++
    return entry.result
  }

  /**
   * Set cache entry
   */
  set(toolName: string, args: ToolArguments, result: ToolResult, ttl: number): void {
    const key = this.getCacheKey(toolName, args)
    const now = Date.now()

    // Check if we need to evict entries to make room
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // Evict 10% of cache (or at least 1 entry)
      const evictCount = Math.max(1, Math.floor(this.maxSize * 0.1))
      this.evictLRU(evictCount)
    }

    this.cache.set(key, {
      result,
      timestamp: now,
      lastAccessed: now,
      ttl,
      accessCount: 0,
    })
  }

  /**
   * Clear cache for tool
   */
  clear(toolName?: string): void {
    if (!toolName) {
      this.cache.clear()
      return
    }

    for (const key of this.cache.keys()) {
      if (key.startsWith(`${toolName}:`)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number
    maxSize: number
    hits: number
    misses: number
    evictions: number
    hitRate: number
    fillRate: number
    entries: Array<{
      toolName: string
      age: number
      lastAccessed: number
      accessCount: number
    }>
  } {
    const entries: Array<{
      toolName: string
      age: number
      lastAccessed: number
      accessCount: number
    }> = []
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      const toolName = key.split(':')[0]
      entries.push({
        toolName,
        age: now - entry.timestamp,
        lastAccessed: entry.lastAccessed,
        accessCount: entry.accessCount,
      })
    }

    const total = this.hits + this.misses
    const hitRate = total > 0 ? this.hits / total : 0
    const fillRate = this.maxSize > 0 ? this.cache.size / this.maxSize : 0

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      hitRate,
      fillRate,
      entries,
    }
  }

  /**
   * Destroy cache and stop periodic cleanup
   */
  destroy(): void {
    this.stopPeriodicCleanup()
    this.cache.clear()
  }
}

// =============================================================================
// Rate Limiting & Concurrency Control
// =============================================================================

/**
 * Rate limiter for tool execution
 */
class RateLimiter {
  private requests: number[] = []

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  /**
   * Check if request is allowed
   * @throws Error if rate limit exceeded
   */
  checkLimit(toolName: string): void {
    const now = Date.now()
    // Remove old requests outside the window
    this.requests = this.requests.filter((time) => now - time < this.windowMs)

    if (this.requests.length >= this.maxRequests) {
      throw new Error(
        `[${toolName}] Rate limit exceeded: ${this.maxRequests} requests per ${this.windowMs}ms`
      )
    }

    // Record this request
    this.requests.push(now)
  }

  /**
   * Get current rate limit stats
   */
  getStats(): { currentRequests: number; maxRequests: number; windowMs: number } {
    const now = Date.now()
    this.requests = this.requests.filter((time) => now - time < this.windowMs)
    return {
      currentRequests: this.requests.length,
      maxRequests: this.maxRequests,
      windowMs: this.windowMs,
    }
  }
}

/**
 * Concurrency limiter for tool execution
 */
class ConcurrencyLimiter {
  private activeCount = 0
  private waiting: Array<() => void> = []

  constructor(private maxConcurrent: number) {}

  /**
   * Acquire a slot for execution
   * @returns Release function to call when done
   */
  async acquire(toolName: string): Promise<() => void> {
    if (this.activeCount >= this.maxConcurrent) {
      // Wait for a slot to become available
      await new Promise<void>((resolve) => {
        this.waiting.push(resolve)
      })
    }

    this.activeCount++

    // Return release function
    return () => {
      this.activeCount--
      const next = this.waiting.shift()
      if (next) {
        next()
      }
    }
  }

  /**
   * Get current concurrency stats
   */
  getStats(): { active: number; waiting: number; maxConcurrent: number } {
    return {
      active: this.activeCount,
      waiting: this.waiting.length,
      maxConcurrent: this.maxConcurrent,
    }
  }
}

/**
 * Executor configuration
 */
export interface ExecutorConfig {
  /** Enable rate limiting */
  enableRateLimit?: boolean

  /** Maximum requests per window (default: 100) */
  maxRequestsPerWindow?: number

  /** Rate limit window in milliseconds (default: 60000 = 1 minute) */
  rateLimitWindowMs?: number

  /** Enable concurrency limiting */
  enableConcurrencyLimit?: boolean

  /** Maximum concurrent executions (default: 10) */
  maxConcurrentExecutions?: number

  /** Cache configuration */
  cache?: ToolResultCacheConfig
}

// =============================================================================
// Tool Executor
// =============================================================================

/**
 * Execution options
 */
export interface ExecutionOptions {
  /** Timeout in milliseconds (overrides tool.timeout) */
  timeout?: number

  /** Abort signal for cancellation */
  signal?: AbortSignal

  /** Skip validation */
  skipValidation?: boolean

  /** Skip cache */
  skipCache?: boolean

  /** Bypass rate limiting (use with caution) */
  bypassRateLimit?: boolean

  /** Bypass concurrency limit (use with caution) */
  bypassConcurrencyLimit?: boolean

  /** Additional context */
  context?: Partial<ToolExecutionContext>
}

/**
 * Execution result
 */
export interface ExecutionResult {
  /** Tool result */
  result: ToolResult

  /** Execution duration in milliseconds */
  duration: number

  /** Whether result came from cache */
  cached: boolean

  /** Error (if execution failed) */
  error?: Error
}

/**
 * Tool Executor
 *
 * Executes tools with validation, timeout, caching, rate limiting, and concurrency control.
 *
 * @example
 * ```typescript
 * const executor = new ToolExecutor(lifecycle, {
 *   enableRateLimit: true,
 *   maxRequestsPerWindow: 100,
 *   rateLimitWindowMs: 60000,
 *   enableConcurrencyLimit: true,
 *   maxConcurrentExecutions: 10
 * })
 *
 * const result = await executor.execute(tool, args, {
 *   timeout: 5000,
 *   signal: abortSignal
 * })
 *
 * console.log(`Result: ${result.result}, Duration: ${result.duration}ms, Cached: ${result.cached}`)
 * ```
 */
export class ToolExecutor {
  private cache: ToolResultCache
  private rateLimiter?: RateLimiter
  private concurrencyLimiter?: ConcurrencyLimiter
  private config: Required<Omit<ExecutorConfig, 'cache'>> & { cache?: ToolResultCacheConfig }

  constructor(
    private lifecycle?: ToolLifecycleManager,
    config: ExecutorConfig = {}
  ) {
    this.config = {
      enableRateLimit: config.enableRateLimit ?? false,
      maxRequestsPerWindow: config.maxRequestsPerWindow ?? 100,
      rateLimitWindowMs: config.rateLimitWindowMs ?? 60000,
      enableConcurrencyLimit: config.enableConcurrencyLimit ?? false,
      maxConcurrentExecutions: config.maxConcurrentExecutions ?? 10,
      cache: config.cache,
    }

    // Initialize cache with configuration
    this.cache = new ToolResultCache(this.config.cache)

    // Initialize rate limiter if enabled
    if (this.config.enableRateLimit) {
      this.rateLimiter = new RateLimiter(
        this.config.maxRequestsPerWindow,
        this.config.rateLimitWindowMs
      )
    }

    // Initialize concurrency limiter if enabled
    if (this.config.enableConcurrencyLimit) {
      this.concurrencyLimiter = new ConcurrencyLimiter(
        this.config.maxConcurrentExecutions
      )
    }
  }

  /**
   * Execute a tool
   *
   * @param tool - Tool definition
   * @param args - Tool arguments
   * @param options - Execution options
   * @returns Execution result
   */
  async execute(
    tool: ToolDefinition,
    args: ToolArguments,
    options: ExecutionOptions = {}
  ): Promise<ExecutionResult> {
    const startTime = Date.now()

    // Create execution context
    const context: ToolExecutionContext = {
      callId: this.generateCallId(),
      startedAt: startTime,
      ...options.context,
    }

    // Check rate limit
    if (this.rateLimiter && !options.bypassRateLimit) {
      this.rateLimiter.checkLimit(tool.name)
    }

    // Acquire concurrency slot
    let releaseConcurrency: (() => void) | undefined
    if (this.concurrencyLimiter && !options.bypassConcurrencyLimit) {
      releaseConcurrency = await this.concurrencyLimiter.acquire(tool.name)
    }

    try {
      // Validate arguments
      if (!options.skipValidation) {
        validateToolArguments(tool, args)
      }

      // Check cache
      if (!options.skipCache && tool.cacheable) {
        const cached = this.cache.get(tool.name, args)
        if (cached !== undefined) {
          // Release concurrency slot immediately for cache hits
          releaseConcurrency?.()
          return {
            result: cached,
            duration: Date.now() - startTime,
            cached: true,
          }
        }
      }

      // Call onBefore hook
      if (tool.hooks?.onBefore) {
        await tool.hooks.onBefore(args, context)
      }

      // Execute with timeout
      const timeout = options.timeout ?? tool.timeout ?? 30000
      const result = await this.executeWithTimeout(
        tool,
        args,
        context,
        timeout,
        options.signal
      )

      const duration = Date.now() - startTime

      // Cache result
      if (tool.cacheable && !options.skipCache) {
        const ttl = tool.cacheTtl ?? 300000 // 5 minutes default
        this.cache.set(tool.name, args, result, ttl)
      }

      // Call onAfter hook
      if (tool.hooks?.onAfter) {
        await tool.hooks.onAfter(result, args, context)
      }

      return {
        result,
        duration,
        cached: false,
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))

      // Call onError hook
      if (tool.hooks?.onError) {
        await tool.hooks.onError(err, args, context)
      }

      throw err
    } finally {
      // Always release concurrency slot
      releaseConcurrency?.()
    }
  }

  /**
   * Execute tool with timeout protection
   */
  private async executeWithTimeout(
    tool: ToolDefinition,
    args: ToolArguments,
    context: ToolExecutionContext,
    timeoutMs: number,
    signal?: AbortSignal
  ): Promise<ToolResult> {
    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | undefined
      let completed = false

      // Check if already aborted
      if (signal?.aborted) {
        reject(new Error(`Tool execution aborted: ${tool.name}`))
        return
      }

      // Set up timeout
      timeoutId = setTimeout(() => {
        if (!completed) {
          completed = true
          reject(new Error(`Tool execution timeout after ${timeoutMs}ms: ${tool.name}`))

          // Call onTimeout hook
          if (tool.hooks?.onTimeout) {
            tool.hooks.onTimeout(args, context).catch((err) => {
              console.error('Error in onTimeout hook:', err)
            })
          }
        }
      }, timeoutMs)

      // Set up abort listener
      const abortListener = () => {
        if (!completed) {
          completed = true
          if (timeoutId) clearTimeout(timeoutId)
          reject(new Error(`Tool execution cancelled: ${tool.name}`))

          // Call onCancel hook
          if (tool.hooks?.onCancel) {
            tool.hooks.onCancel(args, context).catch((err) => {
              console.error('Error in onCancel hook:', err)
            })
          }
        }
      }

      signal?.addEventListener('abort', abortListener)

      // Execute tool
      tool
        .execute(args, context)
        .then((result) => {
          if (!completed) {
            completed = true
            if (timeoutId) clearTimeout(timeoutId)
            signal?.removeEventListener('abort', abortListener)
            resolve(result)
          }
        })
        .catch((error) => {
          if (!completed) {
            completed = true
            if (timeoutId) clearTimeout(timeoutId)
            signal?.removeEventListener('abort', abortListener)
            reject(error)
          }
        })
    })
  }

  /**
   * Get cache instance
   */
  getCache(): ToolResultCache {
    return this.cache
  }

  /**
   * Clear cache
   */
  clearCache(toolName?: string): void {
    this.cache.clear(toolName)
  }

  /**
   * Get rate limiting statistics
   */
  getRateLimitStats() {
    if (!this.rateLimiter) {
      return { enabled: false }
    }
    return { enabled: true, ...this.rateLimiter.getStats() }
  }

  /**
   * Get concurrency statistics
   */
  getConcurrencyStats() {
    if (!this.concurrencyLimiter) {
      return { enabled: false }
    }
    return { enabled: true, ...this.concurrencyLimiter.getStats() }
  }

  /**
   * Get comprehensive executor statistics
   */
  getStats() {
    return {
      cache: this.cache.getStats(),
      rateLimit: this.getRateLimitStats(),
      concurrency: this.getConcurrencyStats(),
      config: this.config,
    }
  }

  /**
   * Clean up expired cache entries
   *
   * Removes all expired entries from the cache. This is useful for periodic
   * maintenance when periodic cleanup is not enabled.
   *
   * @returns Number of entries removed
   *
   * @example
   * ```typescript
   * // Manually cleanup cache periodically
   * setInterval(() => {
   *   const removed = executor.cleanupCache()
   *   console.log(`Cleaned up ${removed} expired cache entries`)
   * }, 60000) // Every minute
   * ```
   */
  cleanupCache(): number {
    return this.cache.cleanupExpired()
  }

  /**
   * Destroy executor and cleanup resources
   *
   * Stops periodic cleanup timers and clears caches. Call this when you're
   * done with the executor to prevent memory leaks.
   *
   * @example
   * ```typescript
   * const executor = new ToolExecutor(lifecycle, {
   *   cache: { enablePeriodicCleanup: true }
   * })
   *
   * // Use executor...
   *
   * // Cleanup when done
   * executor.destroy()
   * ```
   */
  destroy(): void {
    this.cache.destroy()
  }

  /**
   * Generate unique call ID
   */
  private generateCallId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }
}

// =============================================================================
// Exports
// =============================================================================

export type { ExecutionOptions, ExecutionResult, ExecutorConfig, ToolResultCacheConfig }
