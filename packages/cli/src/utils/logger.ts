/**
 * Enhanced structured logging utility
 * Supports log levels, structured output, and request tracking
 *
 */

import pc from 'picocolors'

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  namespace: string
  message: string
  data?: any
  error?: Error
}

export interface Logger {
  info: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  error: (message: string | Error, ...args: any[]) => void
  success: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
  setLevel: (level: LogLevel) => void
  getLevel: () => LogLevel
}

let globalLogLevel: LogLevel = process.env.DEBUG
  ? LogLevel.DEBUG
  : LogLevel.INFO
let requestId: string | null = null

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
 * Create logger instance
 *
 */
export function getLogger(
  namespace: string,
  level: LogLevel = globalLogLevel
): Logger {
  let instanceLevel = level

  const shouldLog = (logLevel: LogLevel): boolean => {
    return logLevel >= instanceLevel && logLevel >= globalLogLevel
  }

  const formatPrefix = (
    icon: string,
    color: (str: string) => string
  ): string => {
    const parts = [pc.gray(`[${namespace}]`), color(icon)]
    if (requestId) {
      parts.push(pc.gray(`[${requestId.slice(0, 8)}]`))
    }
    return parts.join(' ')
  }

  return {
    info: (message: string, ...args: any[]) => {
      if (!shouldLog(LogLevel.INFO)) return

      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: LogLevel.INFO,
        namespace,
        message,
        data: args.length > 0 ? args : undefined,
      }

      if (process.env.JSON_LOGS) {
        console.info(formatLogEntry(entry))
      } else {
        console.info(formatPrefix('ℹ', pc.blue), message, ...args)
      }
    },

    warn: (message: string, ...args: any[]) => {
      if (!shouldLog(LogLevel.WARN)) return

      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: LogLevel.WARN,
        namespace,
        message,
        data: args.length > 0 ? args : undefined,
      }

      if (process.env.JSON_LOGS) {
        console.warn(formatLogEntry(entry))
      } else {
        console.warn(formatPrefix('⚠', pc.yellow), message, ...args)
      }
    },

    error: (message: string | Error, ...args: any[]) => {
      if (!shouldLog(LogLevel.ERROR)) return

      const error = message instanceof Error ? message : undefined
      const errorMessage: string = error
        ? error.message
        : typeof message === 'string'
          ? message
          : String(message)

      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: LogLevel.ERROR,
        namespace,
        message: errorMessage,
        data: args.length > 0 ? args : undefined,
        error,
      }

      if (process.env.JSON_LOGS) {
        console.error(formatLogEntry(entry))
      } else {
        console.error(formatPrefix('✖', pc.red), errorMessage, ...args)

        if (
          error &&
          'stack' in error &&
          error.stack &&
          (process.env.DEBUG || process.env.VERBOSE)
        ) {
          console.error(pc.gray(String(error.stack)))
        }
      }
    },

    success: (message: string, ...args: any[]) => {
      if (!shouldLog(LogLevel.INFO)) return

      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: LogLevel.INFO,
        namespace,
        message: String(message),
        data: args.length > 0 ? args : undefined,
      }

      if (process.env.JSON_LOGS) {
        console.info(formatLogEntry(entry))
      } else {
        console.info(formatPrefix('✔', pc.green), message, ...args)
      }
    },

    debug: (message: string, ...args: any[]) => {
      if (!shouldLog(LogLevel.DEBUG)) return

      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: LogLevel.DEBUG,
        namespace,
        message,
        data: args.length > 0 ? args : undefined,
      }

      if (process.env.JSON_LOGS) {
        console.debug(formatLogEntry(entry))
      } else {
        console.debug(formatPrefix('🐛', pc.magenta), message, ...args)
      }
    },

    setLevel: (level: LogLevel) => {
      instanceLevel = level
    },

    getLevel: () => instanceLevel,
  }
}

export default {
  LogLevel,
  getLogger,
  setGlobalLogLevel,
  setRequestId,
  getRequestId,
}
