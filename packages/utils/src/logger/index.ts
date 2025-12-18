/**
 * Unified Logger
 *
 * Structured logging utility with log levels, namespaces, and request tracking.
 * Supports both pretty-printed and JSON output formats.
 *
 * @module @clarity-chat/utils/logger
 *
 * @example
 * ```ts
 * import { getLogger, LogLevel } from '@clarity-chat/utils/logger'
 *
 * const logger = getLogger('my-module')
 * logger.info('Starting process')
 * logger.error('Something went wrong', { detail: 'info' })
 * logger.debug('Debug info') // Only shown when DEBUG=true
 * ```
 */

/**
 * Log level enum for filtering output
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * String representation of log levels
 */
export type LogLevelString = 'debug' | 'info' | 'success' | 'warn' | 'error'

/**
 * Structured log entry
 */
export interface LogEntry {
  timestamp: string
  level: LogLevel
  namespace: string
  message: string
  data?: unknown
  error?: Error
}

/**
 * Logger configuration options
 */
export interface LoggerOptions {
  /** Enable verbose/debug logging */
  verbose?: boolean
  /** Suppress all output */
  silent?: boolean
  /** Include timestamps in output */
  timestamps?: boolean
  /** Output as JSON instead of pretty-printed */
  jsonOutput?: boolean
}

/**
 * Logger instance interface
 */
export interface Logger {
  info: (message: string, ...args: unknown[]) => void
  warn: (message: string, ...args: unknown[]) => void
  error: (message: string | Error, ...args: unknown[]) => void
  success: (message: string, ...args: unknown[]) => void
  debug: (message: string, ...args: unknown[]) => void
  setLevel: (level: LogLevel) => void
  getLevel: () => LogLevel
}

const DEFAULT_OPTIONS: LoggerOptions = {
  verbose: false,
  silent: false,
  timestamps: false,
  jsonOutput: false,
}

let globalOptions: LoggerOptions = { ...DEFAULT_OPTIONS }
let globalLogLevel: LogLevel =
  typeof process !== 'undefined' && process.env?.['DEBUG']
    ? LogLevel.DEBUG
    : LogLevel.INFO
let requestId: string | null = null

/**
 * Configure global logger options
 *
 * @param options - Logger options to merge with defaults
 *
 * @example
 * ```ts
 * configureLogger({ verbose: true, timestamps: true })
 * ```
 */
export function configureLogger(options: Partial<LoggerOptions>): void {
  globalOptions = { ...globalOptions, ...options }
  if (options.verbose) {
    globalLogLevel = LogLevel.DEBUG
  }
}

/**
 * Set global log level
 *
 * @param level - Minimum log level to display
 */
export function setGlobalLogLevel(level: LogLevel): void {
  globalLogLevel = level
}

/**
 * Set request ID for distributed tracing
 *
 * @param id - Request ID or null to clear
 */
export function setRequestId(id: string | null): void {
  requestId = id
}

/**
 * Get current request ID
 */
export function getRequestId(): string | null {
  return requestId
}

/**
 * Get current timestamp string (HH:MM:SS)
 */
function getTimestamp(): string {
  return new Date().toISOString().split('T')[1]?.slice(0, 8) ?? ''
}

/**
 * Format log entry as JSON
 */
function formatLogEntry(entry: LogEntry): string {
  return JSON.stringify({
    ...entry,
    error: entry.error
      ? {
          message: entry.error.message,
          stack: entry.error.stack,
          name: entry.error.name,
        }
      : undefined,
  })
}

/**
 * Log icons for each level
 */
const LOG_ICONS: Record<LogLevelString, string> = {
  debug: '🔍',
  info: 'ℹ',
  success: '✓',
  warn: '⚠',
  error: '✗',
}

/**
 * Create a namespaced logger instance
 *
 * @param namespace - Logger namespace (shown in output)
 * @param level - Initial log level (defaults to global level)
 * @returns Logger instance
 *
 * @example
 * ```ts
 * const logger = getLogger('api-client')
 * logger.info('Making request', { url: '/api/data' })
 * logger.error(new Error('Request failed'))
 * ```
 */
export function getLogger(
  namespace: string,
  level: LogLevel = globalLogLevel
): Logger {
  let instanceLevel = level

  const shouldLog = (logLevel: LogLevel): boolean => {
    if (globalOptions.silent) return false
    return logLevel >= instanceLevel && logLevel >= globalLogLevel
  }

  const formatPrefix = (icon: string): string => {
    const parts: string[] = []
    if (globalOptions.timestamps) {
      parts.push(`[${getTimestamp()}]`)
    }
    parts.push(`[${namespace}]`)
    parts.push(icon)
    if (requestId) {
      parts.push(`[${requestId.slice(0, 8)}]`)
    }
    return parts.join(' ')
  }

  const logMessage = (
    levelKey: LogLevelString,
    logLevel: LogLevel,
    message: string,
    args: unknown[],
    error?: Error
  ): void => {
    if (!shouldLog(logLevel)) return

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: logLevel,
      namespace,
      message,
      data: args.length > 0 ? args : undefined,
      error,
    }

    const consoleFn =
      logLevel === LogLevel.ERROR
        ? console.error
        : logLevel === LogLevel.WARN
          ? console.warn
          : console.log

    const isJsonMode =
      globalOptions.jsonOutput ||
      (typeof process !== 'undefined' && process.env?.['JSON_LOGS'])

    if (isJsonMode) {
      consoleFn(formatLogEntry(entry))
    } else {
      consoleFn(formatPrefix(LOG_ICONS[levelKey]), message, ...args)

      if (
        error?.stack &&
        (globalOptions.verbose || logLevel === LogLevel.ERROR)
      ) {
        console.error(error.stack)
      }
    }
  }

  return {
    info: (message: string, ...args: unknown[]) => {
      logMessage('info', LogLevel.INFO, message, args)
    },

    warn: (message: string, ...args: unknown[]) => {
      logMessage('warn', LogLevel.WARN, message, args)
    },

    error: (message: string | Error, ...args: unknown[]) => {
      const error = message instanceof Error ? message : undefined
      const errorMessage: string = error
        ? error.message
        : typeof message === 'string'
          ? message
          : String(message)
      logMessage('error', LogLevel.ERROR, errorMessage, args, error)
    },

    success: (message: string, ...args: unknown[]) => {
      logMessage('success', LogLevel.INFO, message, args)
    },

    debug: (message: string, ...args: unknown[]) => {
      logMessage('debug', LogLevel.DEBUG, message, args)
    },

    setLevel: (level: LogLevel) => {
      instanceLevel = level
    },

    getLevel: () => instanceLevel,
  }
}

// Create default logger instance
const defaultLogger = getLogger('app')

export const logger = defaultLogger

/**
 * Default logger instance for direct use
 * @example
 * ```ts
 * import { logger } from '@clarity-chat/utils/logger'
 * logger.info('Hello')
 * logger.error('Something went wrong')
 * ```
 */
export const logger = defaultLogger

/**
 * Log an info message using the default logger
 */
export const info = (message: string, ...args: unknown[]): void =>
  defaultLogger.info(message, ...args)

/**
 * Log a warning using the default logger
 */
export const warn = (message: string, ...args: unknown[]): void =>
  defaultLogger.warn(message, ...args)

/**
 * Log an error using the default logger
 */
export const error = (message: string | Error, ...args: unknown[]): void =>
  defaultLogger.error(message, ...args)

/**
 * Log a success message using the default logger
 */
export const success = (message: string, ...args: unknown[]): void =>
  defaultLogger.success(message, ...args)

/**
 * Log a debug message using the default logger
 */
export const debug = (message: string, ...args: unknown[]): void =>
  defaultLogger.debug(message, ...args)