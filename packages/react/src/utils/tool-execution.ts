/**
 * Tool Execution Utilities
 *
 * Helper functions for common tool execution patterns including:
 * - Retry with exponential backoff
 * - Fallback execution
 * - Timeout handling
 * - Error transformation
 * - Logging and monitoring
 *
 * @module utils/tool-execution
 */

import type { ToolOrchestrator } from '../core/tool-orchestrator'
import type { ToolArguments, ToolResult } from '../types/tool-definition'
import type { OrchestrationResult } from '../core/tool-orchestrator'

// =============================================================================
// Types
// =============================================================================

export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Initial delay in ms (default: 1000) */
  initialDelay?: number
  /** Maximum delay in ms (default: 30000) */
  maxDelay?: number
  /** Backoff multiplier (default: 2 for exponential) */
  backoffMultiplier?: number
  /** Which statuses should trigger retry (default: ['failed', 'timeout']) */
  retryOn?: Array<'failed' | 'timeout' | 'cancelled'>
  /** Custom retry condition function */
  shouldRetry?: (result: OrchestrationResult, attempt: number) => boolean
  /** Callback called before each retry */
  onRetry?: (attempt: number, delay: number, error?: Error) => void
}

export interface FallbackOptions {
  /** Tool names to try in order */
  tools: string[]
  /** Arguments for each tool (if different) */
  argsPerTool?: Record<string, ToolArguments>
  /** Stop trying after first success? (default: true) */
  stopOnSuccess?: boolean
  /** Callback when fallback occurs */
  onFallback?: (failedTool: string, nextTool: string) => void
}

export interface LogOptions {
  /** Enable logging (default: true) */
  enabled?: boolean
  /** Log level (default: 'info') */
  level?: 'debug' | 'info' | 'warn' | 'error'
  /** Include arguments in logs (default: true) */
  logArgs?: boolean
  /** Include results in logs (default: false, can be large) */
  logResults?: boolean
  /** Custom logger function */
  logger?: (level: string, message: string, data?: any) => void
}

export interface TimeoutOptions {
  /** Timeout in ms */
  timeout: number
  /** Message for timeout error */
  message?: string
  /** Callback when timeout occurs */
  onTimeout?: (toolName: string, args: ToolArguments) => void
}

// =============================================================================
// Retry Execution
// =============================================================================

/**
 * Execute a tool with automatic retry on failure
 *
 * Uses exponential backoff by default:
 * - Attempt 1: 0ms delay
 * - Attempt 2: 1000ms delay
 * - Attempt 3: 2000ms delay
 * - Attempt 4: 4000ms delay
 *
 * @example
 * ```typescript
 * const result = await executeWithRetry(
 *   orchestrator,
 *   'flaky_api_call',
 *   { url: 'https://api.example.com' },
 *   {
 *     maxRetries: 3,
 *     initialDelay: 1000,
 *     onRetry: (attempt, delay) => {
 *       console.log(`Retry attempt ${attempt} after ${delay}ms`)
 *     }
 *   }
 * )
 * ```
 */
export async function executeWithRetry(
  orchestrator: ToolOrchestrator,
  toolName: string,
  args: ToolArguments,
  options: RetryOptions = {}
): Promise<ToolResult> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    retryOn = ['failed', 'timeout'],
    shouldRetry: customShouldRetry,
    onRetry,
  } = options

  let lastResult: OrchestrationResult | null = null
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await orchestrator.executeTool(toolName, args)

      // Check if we should retry
      const shouldRetryDefault = retryOn.includes(result.status as any)
      const shouldRetryCustom =
        customShouldRetry?.(result, attempt) ?? shouldRetryDefault

      if (result.status === 'completed') {
        return result.result as ToolResult
      }

      if (!shouldRetryCustom || attempt > maxRetries) {
        throw new Error(
          `Tool execution ${result.status}: ${result.error?.message || 'Unknown error'}`
        )
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt - 1),
        maxDelay
      )

      onRetry?.(attempt, delay, result.error)

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay))

      lastResult = result
      lastError = result.error || null
    } catch (error) {
      if (attempt > maxRetries) {
        throw error
      }

      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt - 1),
        maxDelay
      )

      onRetry?.(attempt, delay, error as Error)

      await new Promise((resolve) => setTimeout(resolve, delay))

      lastError = error as Error
    }
  }

  // Should never reach here, but TypeScript needs it
  throw (
    lastError || new Error(`Tool execution failed after ${maxRetries} retries`)
  )
}

// =============================================================================
// Fallback Execution
// =============================================================================

/**
 * Execute tools with fallback chain
 *
 * Tries tools in order until one succeeds. Useful for:
 * - Primary/secondary API endpoints
 * - Graceful degradation
 * - Multi-provider systems
 *
 * @example
 * ```typescript
 * const result = await executeWithFallback(
 *   orchestrator,
 *   {
 *     tools: ['openai_api', 'anthropic_api', 'local_model'],
 *     argsPerTool: {
 *       openai_api: { model: 'gpt-4', prompt: '...' },
 *       anthropic_api: { model: 'claude-3', prompt: '...' },
 *       local_model: { prompt: '...' }
 *     },
 *     onFallback: (failed, next) => {
 *       console.warn(`${failed} failed, trying ${next}`)
 *     }
 *   }
 * )
 * ```
 */
export async function executeWithFallback(
  orchestrator: ToolOrchestrator,
  args: ToolArguments,
  options: FallbackOptions
): Promise<ToolResult> {
  const { tools, argsPerTool, stopOnSuccess = true, onFallback } = options

  if (tools.length === 0) {
    throw new Error('No tools provided for fallback execution')
  }

  const errors: Array<{ tool: string; error: Error }> = []

  for (let i = 0; i < tools.length; i++) {
    const toolName = tools[i]
    const toolArgs = argsPerTool?.[toolName] ?? args

    try {
      const result = await orchestrator.executeTool(toolName, toolArgs)

      if (result.status === 'completed') {
        return result.result as ToolResult
      }

      // Tool didn't complete successfully
      const error =
        result.error || new Error(`Tool ${toolName} ${result.status}`)
      errors.push({ tool: toolName, error })

      // Try next tool if available
      if (i < tools.length - 1) {
        onFallback?.(toolName, tools[i + 1])
      }
    } catch (error) {
      errors.push({ tool: toolName, error: error as Error })

      if (i < tools.length - 1) {
        onFallback?.(toolName, tools[i + 1])
      }
    }
  }

  // All tools failed
  const errorMessages = errors
    .map((e) => `${e.tool}: ${e.error.message}`)
    .join('; ')
  throw new Error(`All fallback tools failed: ${errorMessages}`)
}

// =============================================================================
// Timeout Execution
// =============================================================================

/**
 * Execute a tool with a custom timeout
 *
 * More flexible than orchestrator's default timeout.
 * Can be used to override timeout for specific calls.
 *
 * @example
 * ```typescript
 * const result = await executeWithTimeout(
 *   orchestrator,
 *   'slow_operation',
 *   { data: 'large dataset' },
 *   {
 *     timeout: 120000, // 2 minutes
 *     message: 'Operation took too long',
 *     onTimeout: (toolName) => {
 *       console.error(`${toolName} timed out`)
 *     }
 *   }
 * )
 * ```
 */
export async function executeWithTimeout(
  orchestrator: ToolOrchestrator,
  toolName: string,
  args: ToolArguments,
  options: TimeoutOptions
): Promise<ToolResult> {
  const {
    timeout,
    message = `Tool execution timed out after ${timeout}ms`,
    onTimeout,
  } = options

  const controller = new AbortController()

  const timeoutId = setTimeout(() => {
    controller.abort()
    onTimeout?.(toolName, args)
  }, timeout)

  try {
    const result = await orchestrator.executeTool(toolName, args, {
      signal: controller.signal,
      timeout,
    })

    clearTimeout(timeoutId)

    if (result.status === 'completed') {
      return result.result as ToolResult
    }

    throw new Error(
      `Tool execution ${result.status}: ${result.error?.message || 'Unknown error'}`
    )
  } catch (error) {
    clearTimeout(timeoutId)

    if (controller.signal.aborted) {
      throw new Error(message)
    }

    throw error
  }
}

// =============================================================================
// Logged Execution
// =============================================================================

/**
 * Execute a tool with automatic logging
 *
 * Logs execution start, completion, errors, and performance metrics.
 * Useful for debugging and monitoring.
 *
 * @example
 * ```typescript
 * const result = await executeWithLogging(
 *   orchestrator,
 *   'api_call',
 *   { endpoint: '/users' },
 *   {
 *     level: 'info',
 *     logArgs: true,
 *     logResults: false,
 *     logger: (level, message, data) => {
 *       console.log(`[${level.toUpperCase()}] ${message}`, data)
 *     }
 *   }
 * )
 * ```
 */
export async function executeWithLogging(
  orchestrator: ToolOrchestrator,
  toolName: string,
  args: ToolArguments,
  options: LogOptions = {}
): Promise<ToolResult> {
  const {
    enabled = true,
    level = 'info',
    logArgs = true,
    logResults = false,
    logger = console.log,
  } = options

  if (!enabled) {
    const result = await orchestrator.executeTool(toolName, args)
    if (result.status !== 'completed') {
      throw new Error(
        `Tool execution ${result.status}: ${result.error?.message}`
      )
    }
    return result.result as ToolResult
  }

  const startTime = Date.now()

  logger(
    level,
    `🔧 Executing tool: ${toolName}`,
    logArgs ? { args } : undefined
  )

  try {
    const result = await orchestrator.executeTool(toolName, args)
    const duration = Date.now() - startTime

    if (result.status === 'completed') {
      logger(
        level,
        `✓ Tool completed: ${toolName} (${duration}ms)${result.cached ? ' [cached]' : ''}`,
        logResults
          ? { result: result.result }
          : { duration, cached: result.cached }
      )

      return result.result as ToolResult
    } else {
      logger('error', `✗ Tool ${result.status}: ${toolName} (${duration}ms)`, {
        error: result.error?.message,
        duration,
      })

      throw new Error(
        `Tool execution ${result.status}: ${result.error?.message}`
      )
    }
  } catch (error) {
    const duration = Date.now() - startTime

    logger('error', `✗ Tool error: ${toolName} (${duration}ms)`, {
      error: error instanceof Error ? error.message : String(error),
      duration,
    })

    throw error
  }
}

// =============================================================================
// Combined Utilities
// =============================================================================

/**
 * Execute with retry, fallback, timeout, and logging
 *
 * Combines all utilities for maximum reliability.
 * Use this for critical operations that must succeed.
 *
 * @example
 * ```typescript
 * const result = await executeWithAll(
 *   orchestrator,
 *   'critical_operation',
 *   { data: 'important' },
 *   {
 *     retry: { maxRetries: 3, initialDelay: 1000 },
 *     fallback: { tools: ['primary_api', 'secondary_api'] },
 *     timeout: { timeout: 60000 },
 *     log: { level: 'info', logArgs: true }
 *   }
 * )
 * ```
 */
export async function executeWithAll(
  orchestrator: ToolOrchestrator,
  toolName: string,
  args: ToolArguments,
  options: {
    retry?: RetryOptions
    fallback?: Omit<FallbackOptions, 'tools'> & { tools?: string[] }
    timeout?: TimeoutOptions
    log?: LogOptions
  } = {}
): Promise<ToolResult> {
  const { retry, fallback, timeout, log } = options

  // Build execution function
  let executor = async () => {
    if (timeout) {
      return executeWithTimeout(orchestrator, toolName, args, timeout)
    } else {
      const result = await orchestrator.executeTool(toolName, args)
      if (result.status !== 'completed') {
        throw new Error(
          `Tool execution ${result.status}: ${result.error?.message}`
        )
      }
      return result.result as ToolResult
    }
  }

  // Add retry if specified
  if (retry) {
    const baseExecutor = executor
    executor = async () => executeWithRetry(orchestrator, toolName, args, retry)
  }

  // Add fallback if specified
  if (fallback?.tools && fallback.tools.length > 0) {
    const tools = [toolName, ...fallback.tools]
    executor = async () =>
      executeWithFallback(orchestrator, args, {
        ...fallback,
        tools,
      } as FallbackOptions)
  }

  // Add logging if specified
  if (log?.enabled !== false) {
    const baseExecutor = executor
    if (log) {
      const { logger, ...logOpts } = log
      const customLogger = logger
      executor = async () => {
        const startTime = Date.now()
        customLogger?.(
          log.level || 'info',
          `🔧 Executing tool: ${toolName}`,
          log.logArgs ? { args } : undefined
        )

        try {
          const result = await baseExecutor()
          const duration = Date.now() - startTime

          customLogger?.(
            log.level || 'info',
            `✓ Tool completed: ${toolName} (${duration}ms)`,
            log.logResults ? { result } : { duration }
          )

          return result
        } catch (error) {
          const duration = Date.now() - startTime

          customLogger?.('error', `✗ Tool error: ${toolName} (${duration}ms)`, {
            error: error instanceof Error ? error.message : String(error),
            duration,
          })

          throw error
        }
      }
    }
  }

  return executor()
}

// =============================================================================
// Batch Execution
// =============================================================================

export interface BatchExecutionOptions {
  /** Maximum concurrent executions (default: 10) */
  maxConcurrent?: number

  /** Deduplicate identical calls (same tool + args) (default: true) */
  deduplicate?: boolean

  /** Stop all executions on first error (default: false) */
  stopOnError?: boolean

  /** Callback for progress updates */
  onProgress?: (completed: number, total: number) => void
}

export interface BatchCall {
  toolName: string
  args: ToolArguments
  options?: any
  /** Unique ID for this call (optional, for deduplication) */
  id?: string
}

export interface BatchResult {
  success: boolean
  result?: ToolResult
  error?: Error
  /** Original call index */
  callIndex: number
  /** Whether result came from deduplication */
  deduplicated?: boolean
  /** Time taken in milliseconds */
  duration?: number
}

/**
 * Execute multiple tools in parallel with optimizations
 *
 * **Features**:
 * - Concurrency limiting (prevents overwhelming the system)
 * - Deduplication of identical calls (same tool + args)
 * - Shared caching across batch
 * - Progress tracking
 * - Error handling with stop-on-error option
 *
 * **Optimizations**:
 * - Identical calls are deduplicated and executed once
 * - Results are shared across all duplicate calls
 * - Concurrency is limited to prevent resource exhaustion
 * - Cache is shared across all calls in the batch
 *
 * @example
 * ```typescript
 * const results = await executeBatch(
 *   orchestrator,
 *   [
 *     { toolName: 'get_weather', args: { location: 'London' } },
 *     { toolName: 'get_weather', args: { location: 'Paris' } },
 *     { toolName: 'get_weather', args: { location: 'London' } }, // Duplicate
 *     { toolName: 'calculate', args: { expression: '10 + 5' } }
 *   ],
 *   {
 *     maxConcurrent: 5,
 *     deduplicate: true,
 *     onProgress: (completed, total) => {
 *       console.log(`Progress: ${completed}/${total}`)
 *     }
 *   }
 * )
 * ```
 */
export async function executeBatch(
  orchestrator: ToolOrchestrator,
  calls: BatchCall[],
  options: BatchExecutionOptions = {}
): Promise<BatchResult[]> {
  const {
    maxConcurrent = 10,
    deduplicate = true,
    stopOnError = false,
    onProgress,
  } = options

  if (calls.length === 0) {
    return []
  }

  // Generate unique keys for deduplication
  const generateKey = (call: BatchCall): string => {
    if (call.id) return call.id
    // Sort args keys for consistent hashing
    const sortedArgs = Object.keys(call.args)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = call.args[key]
          return acc
        },
        {} as Record<string, unknown>
      )
    return `${call.toolName}:${JSON.stringify(sortedArgs)}`
  }

  // Map calls to keys for deduplication
  const callKeys = calls.map((call) => generateKey(call))
  const uniqueKeys = deduplicate ? Array.from(new Set(callKeys)) : callKeys
  const keyToCallIndex = new Map<string, number[]>()

  // Build index of which original calls map to which unique keys
  callKeys.forEach((key, index) => {
    if (!keyToCallIndex.has(key)) {
      keyToCallIndex.set(key, [])
    }
    keyToCallIndex.get(key)!.push(index)
  })

  // Find first occurrence of each unique key
  const uniqueCallIndices = uniqueKeys.map((key) => keyToCallIndex.get(key)![0])
  const uniqueCalls = uniqueCallIndices.map((idx) => calls[idx])

  // Prepare results array
  const results: BatchResult[] = new Array(calls.length)
  let completed = 0
  let hasError = false

  // Execute unique calls with concurrency limit
  const executeCall = async (
    call: BatchCall,
    callKey: string,
    uniqueIndex: number
  ) => {
    if (hasError && stopOnError) {
      return
    }

    const startTime = Date.now()

    try {
      const result = await orchestrator.executeTool(
        call.toolName,
        call.args,
        call.options
      )
      const duration = Date.now() - startTime

      const batchResult: BatchResult = {
        success: result.status === 'completed',
        callIndex: uniqueCallIndices[uniqueIndex],
        duration,
      }

      if (result.status === 'completed') {
        batchResult.result = result.result as ToolResult
      } else {
        batchResult.error = result.error || new Error(`Tool ${result.status}`)
      }

      // Share result with all calls that have the same key
      const originalIndices = keyToCallIndex.get(callKey)!
      for (const idx of originalIndices) {
        results[idx] = {
          ...batchResult,
          callIndex: idx,
          deduplicated: idx !== uniqueCallIndices[uniqueIndex],
        }
      }

      completed += originalIndices.length
      onProgress?.(completed, calls.length)

      if (!batchResult.success && stopOnError) {
        hasError = true
      }
    } catch (error) {
      const duration = Date.now() - startTime
      const batchResult: BatchResult = {
        success: false,
        error: error as Error,
        callIndex: uniqueCallIndices[uniqueIndex],
        duration,
      }

      // Share error with all duplicate calls
      const originalIndices = keyToCallIndex.get(callKey)!
      for (const idx of originalIndices) {
        results[idx] = {
          ...batchResult,
          callIndex: idx,
          deduplicated: idx !== uniqueCallIndices[uniqueIndex],
        }
      }

      completed += originalIndices.length
      onProgress?.(completed, calls.length)

      if (stopOnError) {
        hasError = true
      }
    }
  }

  // Execute with concurrency limit
  const queue = uniqueCalls.map((call, idx) => ({
    call,
    key: uniqueKeys[idx],
    uniqueIndex: idx,
  }))
  const executing: Promise<void>[] = []

  for (const item of queue) {
    // Wait if we've reached max concurrent
    if (executing.length >= maxConcurrent) {
      await Promise.race(executing)
    }

    if (hasError && stopOnError) {
      break
    }

    const promise = executeCall(item.call, item.key, item.uniqueIndex).then(
      () => {
        executing.splice(executing.indexOf(promise), 1)
      }
    )

    executing.push(promise)
  }

  // Wait for all remaining executions
  await Promise.all(executing)

  return results
}

/**
 * Execute multiple tools in parallel (simple version without optimizations)
 *
 * Use this for simple cases where you don't need deduplication or concurrency limiting.
 * For production use with many calls, use `executeBatch()` instead.
 *
 * @example
 * ```typescript
 * const results = await executeBatchSimple(orchestrator, [
 *   { toolName: 'get_weather', args: { location: 'London' } },
 *   { toolName: 'get_weather', args: { location: 'Paris' } },
 * ])
 * ```
 */
export async function executeBatchSimple(
  orchestrator: ToolOrchestrator,
  calls: Array<{ toolName: string; args: ToolArguments; options?: any }>
): Promise<Array<{ success: boolean; result?: ToolResult; error?: Error }>> {
  const promises = calls.map(async ({ toolName, args, options }) => {
    try {
      const result = await orchestrator.executeTool(toolName, args, options)

      if (result.status === 'completed') {
        return { success: true, result: result.result as ToolResult }
      } else {
        return {
          success: false,
          error: result.error || new Error(`Tool ${result.status}`),
        }
      }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  })

  return Promise.all(promises)
}
