/**
 * Structured error logging service
 *
 * Provides consistent, structured logging for errors across the application
 * with support for batching, external service integration, and log levels.
 */

import { isClarityError } from '../errors/base-error'

/**
 * Log entry structure for errors
 */
export interface ErrorLogEntry {
  /** ISO timestamp when error was logged */
  timestamp: string
  /** Log level */
  level: 'error' | 'warn' | 'info'
  /** Error details */
  error: {
    name: string
    code?: string
    message: string
    stack?: string
  }
  /** Additional context */
  context?: Record<string, unknown>
  /** User information (if available) */
  user?: {
    id?: string
    sessionId?: string
  }
  /** Request information (if available) */
  request?: {
    url?: string
    method?: string
    userAgent?: string
  }
  /** Component information (for React errors) */
  component?: {
    name?: string
    stack?: string
  }
}

/**
 * Backpressure strategy when queue is full
 */
export type BackpressureStrategy = 'drop-oldest' | 'drop-newest' | 'block'

/**
 * Configuration for the error logger
 */
export interface ErrorLoggerConfig {
  /** External logging service endpoint */
  endpoint?: string
  /** API key for external service */
  apiKey?: string
  /** Include stack traces in production */
  includeStackInProd?: boolean
  /** Batch logs before sending */
  batchSize?: number
  /** Flush interval in ms */
  flushInterval?: number
  /** Custom headers for external service */
  headers?: Record<string, string>
  /** Transform log entry before sending */
  transform?: (entry: ErrorLogEntry) => ErrorLogEntry
  /** Filter which errors to log */
  filter?: (entry: ErrorLogEntry) => boolean
  /** Maximum queue size for backpressure (default: 1000) */
  maxQueueSize?: number
  /** Strategy when queue is full (default: 'drop-oldest') */
  backpressureStrategy?: BackpressureStrategy
  /** Called when logs are dropped due to backpressure */
  onDropped?: (count: number, reason: string) => void
}

/**
 * Error logger instance type
 */
export interface ErrorLogger {
  /** Log an error */
  error: (error: Error, options?: LogOptions) => void
  /** Log a warning */
  warn: (error: Error, options?: LogOptions) => void
  /** Log info */
  info: (error: Error, options?: LogOptions) => void
  /** Manually flush pending logs */
  flush: () => Promise<void>
  /** Get pending log count */
  pendingCount: () => number
  /** Clear pending logs without sending */
  clear: () => void
}

/**
 * Options for logging
 */
export interface LogOptions {
  context?: Record<string, unknown>
  user?: { id?: string; sessionId?: string }
  request?: { url?: string; method?: string; userAgent?: string }
  component?: { name?: string; stack?: string }
}

/**
 * Create a structured error logger
 *
 * @example
 * ```typescript
 * const logger = createErrorLogger({
 *   endpoint: 'https://logging.example.com/errors',
 *   batchSize: 10,
 *   apiKey: process.env.LOGGING_API_KEY,
 * });
 *
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   console.error(error, {
 *     context: { operation: 'riskyOperation' },
 *     user: { id: userId },
 *   });
 * }
 * ```
 */
export function createErrorLogger(config: ErrorLoggerConfig = {}): ErrorLogger {
  const {
    endpoint,
    apiKey,
    includeStackInProd = false,
    batchSize = 10,
    flushInterval = 5000,
    headers = {},
    transform,
    filter,
    maxQueueSize = 1000,
    backpressureStrategy = 'drop-oldest',
    onDropped,
  } = config

  let batch: ErrorLogEntry[] = []
  let flushTimer: ReturnType<typeof setTimeout> | null = null
  let isFlushBlocked = false

  /**
   * Handle backpressure when queue is full
   * Returns true if the new entry should be added, false if it should be dropped
   */
  const handleBackpressure = (): boolean => {
    if (batch.length < maxQueueSize) {
      return true
    }

    switch (backpressureStrategy) {
      case 'drop-oldest': {
        // Remove oldest entries to make room
        const dropped = batch.splice(0, 1)
        onDropped?.(dropped.length, 'queue-full-drop-oldest')
        return true
      }
      case 'drop-newest': {
        // Don't add the new entry
        onDropped?.(1, 'queue-full-drop-newest')
        return false
      }
      case 'block': {
        // If we're already flushing, drop the entry
        if (isFlushBlocked) {
          onDropped?.(1, 'queue-full-blocked')
          return false
        }
        // Try to flush synchronously-ish
        flush()
        return batch.length < maxQueueSize
      }
      default:
        return true
    }
  }

  const flush = async (): Promise<void> => {
    if (batch.length === 0) return
    if (isFlushBlocked) return

    isFlushBlocked = true
    const toSend = [...batch]
    batch = []

    try {
      if (endpoint) {
        try {
          await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
              ...headers,
            },
            body: JSON.stringify({ logs: toSend }),
          })
        } catch (fetchError) {
          // Re-add to batch if send fails, but respect max queue size
          const spaceAvailable = maxQueueSize - batch.length
          if (spaceAvailable > 0) {
            const toRequeue = toSend.slice(0, spaceAvailable)
            batch.push(...toRequeue)
            const dropped = toSend.length - toRequeue.length
            if (dropped > 0) {
              onDropped?.(dropped, 'send-failed-queue-full')
            }
          } else {
            onDropped?.(toSend.length, 'send-failed-queue-full')
          }
          // Also log to console as fallback
          console.error(
            '[ErrorLogger] Failed to send logs to endpoint:',
            fetchError
          )
          toSend.forEach((entry) => {
            console[entry.level]('[ErrorLogger]', entry)
          })
        }
      } else {
        // Log to console if no endpoint configured
        toSend.forEach((entry) => {
          console[entry.level]('[ErrorLogger]', entry)
        })
      }
    } finally {
      isFlushBlocked = false
    }
  }

  const scheduleFlush = (): void => {
    if (flushTimer) return
    flushTimer = setTimeout(() => {
      flushTimer = null
      flush()
    }, flushInterval)
  }

  const log = (
    level: 'error' | 'warn' | 'info',
    error: Error,
    options?: LogOptions
  ): void => {
    const isProduction = process.env['NODE_ENV'] === 'production'
    const includeStack = !isProduction || includeStackInProd

    let entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      error: {
        name: error.name,
        code: isClarityError(error) ? error.code : undefined,
        message: error.message,
        stack: includeStack ? error.stack : undefined,
      },
      context: {
        ...options?.context,
        ...(isClarityError(error) && error.context),
      },
      user: options?.user,
      request: options?.request,
      component: options?.component,
    }

    // Apply transform if provided
    if (transform) {
      entry = transform(entry)
    }

    // Apply filter if provided
    if (filter && !filter(entry)) {
      return
    }

    // Check backpressure before adding
    if (!handleBackpressure()) {
      return
    }

    batch.push(entry)

    if (batch.length >= batchSize) {
      flush()
    } else {
      scheduleFlush()
    }
  }

  return {
    error: (error: Error, options?: LogOptions) => log('error', error, options),
    warn: (error: Error, options?: LogOptions) => log('warn', error, options),
    info: (error: Error, options?: LogOptions) => log('info', error, options),
    flush,
    pendingCount: () => batch.length,
    clear: () => {
      batch = []
      if (flushTimer) {
        clearTimeout(flushTimer)
        flushTimer = null
      }
    },
  }
}

// Default logger instance (configured for development)
let defaultLogger: ErrorLogger | null = null

/**
 * Get or create the default error logger
 *
 * @example
 * ```typescript
 * import { getErrorLogger } from '@clarity-chat/error-handling'
 *
 * const logger = getErrorLogger()
 * console.error(new Error('Something went wrong'))
 * ```
 */
export function getErrorLogger(): ErrorLogger {
  if (!defaultLogger) {
    defaultLogger = createErrorLogger({
      endpoint: process.env['ERROR_LOGGING_ENDPOINT'],
      apiKey: process.env['ERROR_LOGGING_API_KEY'],
      includeStackInProd: process.env['INCLUDE_STACK_IN_LOGS'] === 'true',
    })
  }
  return defaultLogger
}

/**
 * Configure the default error logger
 *
 * @example
 * ```typescript
 * import { configureErrorLogger } from '@clarity-chat/error-handling'
 *
 * configureErrorLogger({
 *   endpoint: 'https://my-logging-service.com/logs',
 *   batchSize: 20,
 * })
 * ```
 */
export function configureErrorLogger(config: ErrorLoggerConfig): void {
  defaultLogger = createErrorLogger(config)
}

/**
 * Log an error using the default logger
 *
 * @example
 * ```typescript
 * import { logError } from '@clarity-chat/error-handling'
 *
 * try {
 *   await fetchData()
 * } catch (error) {
 *   logError(error, { context: { action: 'fetchData' } })
 * }
 * ```
 */
export function logError(error: Error, options?: LogOptions): void {
  getErrorLogger().error(error, options)
}

/**
 * Log a warning using the default logger
 */
export function logWarning(error: Error, options?: LogOptions): void {
  getErrorLogger().warn(error, options)
}

/**
 * Log info using the default logger
 */
export function logInfo(error: Error, options?: LogOptions): void {
  getErrorLogger().info(error, options)
}

/**
 * React error info adapter
 * Converts React ErrorInfo to LogOptions format
 *
 * @example
 * ```typescript
 * componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
 *   logError(error, reactErrorInfoToLogOptions(errorInfo))
 * }
 * ```
 */
export function reactErrorInfoToLogOptions(errorInfo: {
  componentStack?: string | null
}): LogOptions {
  return {
    component: {
      stack: errorInfo.componentStack ?? undefined,
    },
  }
}
