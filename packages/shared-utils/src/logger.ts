/**
 * Unified Logger
 *
 * Shared logging utility for all Clarity Chat packages
 * Supports log levels, structured output, namespaces, and request tracking
 */

import pc from 'picocolors'

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export type LogLevelString = 'debug' | 'info' | 'success' | 'warn' | 'error'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  namespace: string
  message: string
  data?: unknown
  error?: Error
}

export interface LoggerOptions {
  verbose?: boolean
  silent?: boolean
  timestamps?: boolean
  jsonOutput?: boolean
}

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
let globalLogLevel: LogLevel = process.env.DEBUG
  ? LogLevel.DEBUG
  : LogLevel.INFO
let requestId: string | null = null

/**
 * Configure global logger options
 */
export function configureLogger(options: Partial<LoggerOptions>): void {
  globalOptions = { ...globalOptions, ...options }
  if (options.verbose) {
    globalLogLevel = LogLevel.DEBUG
  }
}

/**
 * Set global log level
 */
export function setGlobalLogLevel(level: LogLevel): void {
  globalLogLevel = level
}

/**
 * Set request ID for tracing
 */
export function setRequestId(id: string | null): void {
  requestId = id
}

/**
 * Get request ID
 */
export function getRequestId(): string | null {
  return requestId
}

/**
 * Get current timestamp string
 */
function getTimestamp(): string {
  return new Date().toISOString().split('T')[1]?.slice(0, 8) ?? ''
}

/**
 * Format log entry as JSON (for structured logging)
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
 * Log colors for each level
 */
const LOG_COLORS: Record<LogLevelString, (s: string) => string> = {
  debug: pc.gray,
  info: pc.blue,
  success: pc.green,
  warn: pc.yellow,
  error: pc.red,
}

/**
 * Create a namespaced logger instance
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

  const formatPrefix = (
    icon: string,
    color: (str: string) => string
  ): string => {
    const parts: string[] = []
    if (globalOptions.timestamps) {
      parts.push(pc.gray(`[${getTimestamp()}]`))
    }
    parts.push(pc.gray(`[${namespace}]`))
    parts.push(color(icon))
    if (requestId) {
      parts.push(pc.gray(`[${requestId.slice(0, 8)}]`))
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

    if (globalOptions.jsonOutput || process.env.JSON_LOGS) {
      consoleFn(formatLogEntry(entry))
    } else {
      consoleFn(
        formatPrefix(LOG_ICONS[levelKey], LOG_COLORS[levelKey]),
        message,
        ...args
      )

      if (
        error?.stack &&
        (process.env.DEBUG || process.env.VERBOSE || globalOptions.verbose)
      ) {
        console.error(pc.gray(error.stack))
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

// Convenience functions using default namespace
const defaultLogger = getLogger('app')

export const info = (message: string, ...args: unknown[]): void =>
  defaultLogger.info(message, ...args)
export const warn = (message: string, ...args: unknown[]): void =>
  defaultLogger.warn(message, ...args)
export const error = (message: string | Error, ...args: unknown[]): void =>
  defaultLogger.error(message, ...args)
export const success = (message: string, ...args: unknown[]): void =>
  defaultLogger.success(message, ...args)
export const debug = (message: string, ...args: unknown[]): void =>
  defaultLogger.debug(message, ...args)
