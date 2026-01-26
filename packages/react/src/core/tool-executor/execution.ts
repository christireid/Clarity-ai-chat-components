/**
 * Tool Executor - Execution Module
 *
 * Handles tool execution with timeout protection, rate limiting, and concurrency control.
 *
 * @module core/tool-executor/execution
 */

import type {
  ToolDefinition,
  ToolArguments,
  ToolResult,
  ToolExecutionContext,
} from '../../types/tool-definition'
import type { ToolLifecycleManager } from '../tool-lifecycle'
import { generateToolCallId } from '../../utils/id-generator'
import { validateToolArguments } from './validation'
import { ToolResultCache, type ToolResultCacheConfig } from './cache'

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
  getStats(): {
    currentRequests: number
    maxRequests: number
    windowMs: number
  } {
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

// =============================================================================
// Executor Configuration & Options
// =============================================================================

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

// =============================================================================
// Tool Executor
// =============================================================================

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
  private config: Required<Omit<ExecutorConfig, 'cache'>> & {
    cache?: ToolResultCacheConfig
  }

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
      callId: generateToolCallId('exec'),
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
          reject(
            new Error(
              `Tool execution timeout after ${timeoutMs}ms: ${tool.name}`
            )
          )

          // Call onTimeout hook
          if (tool.hooks?.onTimeout) {
            Promise.resolve(tool.hooks.onTimeout(args, context)).catch(
              (err: Error) => {
                if (process.env.NODE_ENV === 'development') {
                  console.error('Error in onTimeout hook:', err)
                }
              }
            )
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
            Promise.resolve(tool.hooks.onCancel(args, context)).catch(
              (err: Error) => {
                if (process.env.NODE_ENV === 'development') {
                  console.error('Error in onCancel hook:', err)
                }
              }
            )
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
}
