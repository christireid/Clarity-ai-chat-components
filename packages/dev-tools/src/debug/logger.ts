/**
 * Enhanced logger with multiple levels and formatting
 *
 * Provides:
 * - Multiple log levels (trace, debug, info, warn, error)
 * - Colored output for terminal
 * - Structured logging with context
 * - Performance timing
 * - Log filtering
 *
 */

import { infoBox, warningBox, errorBox, successBox } from '../ui/box'
import { keyValueTable } from '../ui/table'
import chalk from 'chalk'

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  timestamp: Date
  message: string
  context?: Record<string, unknown>
  duration?: number
  stack?: string
}

export interface LoggerOptions {
  level?: LogLevel
  prefix?: string
  colors?: boolean
  timestamps?: boolean
  context?: Record<string, unknown>
}

const LOG_LEVELS: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  trace: '\x1b[90m', // Gray
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m', // Green
  warn: '\x1b[33m', // Yellow
  error: '\x1b[31m', // Red
}

const ICONS: Record<LogLevel, string> = {
  trace: '🔍',
  debug: '🐛',
  info: 'ℹ',
  warn: '⚠',
  error: '✗',
}

let globalLogLevel: LogLevel = 'info'
let globalContext: Record<string, unknown> = {}

/**
 * Logger class for development tools
 */
export class Logger {
  private namespace: string
  private level: LogLevel
  private colors: boolean
  private timestamps: boolean
  private context: Record<string, unknown>

  constructor(namespace = 'app', options: LoggerOptions = {}) {
    this.namespace = namespace
    this.level = options.level || globalLogLevel
    this.colors = options.colors ?? true
    this.timestamps = options.timestamps ?? true
    this.context = { ...globalContext, ...options.context }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level]
  }

  private formatPrefix(level: LogLevel): string {
    const parts: string[] = []

    if (this.timestamps) {
      parts.push(chalk.gray(`[${new Date().toISOString()}]`))
    }

    parts.push(chalk.gray(`[${this.namespace}]`))

    if (this.colors) {
      parts.push(`${LEVEL_COLORS[level]}${ICONS[level]}\x1b[0m`)
    } else {
      parts.push(`[${level.toUpperCase()}]`)
    }

    return parts.join(' ')
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): void {
    if (!this.shouldLog(level)) return

    const logContext = { ...this.context, ...context }
    const fullMessage = this.formatPrefix(level) + ' ' + message

    const consoleFn =
      level === 'error'
        ? console.error
        : level === 'warn'
          ? console.warn
          : console.log

    if (Object.keys(logContext).length > 0) {
      consoleFn(fullMessage, logContext)
    } else {
      consoleFn(fullMessage)
    }
  }

  trace(message?: string, context?: Record<string, unknown>): void {
    if (!message) {
      console.log()
      return
    }
    this.log('trace', message, context)
  }

  debug(message?: string, context?: Record<string, unknown>): void {
    if (!message) {
      console.log()
      return
    }
    this.log('debug', message, context)
  }

  info(message?: string, context?: Record<string, unknown>): void {
    if (!message) {
      console.log()
      return
    }
    this.log('info', message, context)
  }

  warn(message?: string, context?: Record<string, unknown>): void {
    if (!message) {
      console.log()
      return
    }
    this.log('warn', message, context)
  }

  error(message?: string, context?: Record<string, unknown>): void {
    if (!message) {
      console.log()
      return
    }
    this.log('error', message, context)
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }

  getLevel(): LogLevel {
    return this.level
  }

  // Performance timing
  time(label: string): void {
    console.time(label)
  }

  timeEnd(label: string): void {
    console.timeEnd(label)
  }

  // Group logging
  group(label: string): void {
    console.group(label)
  }

  groupEnd(): void {
    console.groupEnd()
  }

  // Log filtering (no-op for compatibility)
  filter(_predicate: (entry: LogEntry) => boolean): void {
    console.warn('Log filtering is not supported in this logger')
  }

  // Get all logs (no-op for compatibility)
  getLogs(_level?: LogLevel): LogEntry[] {
    console.warn('Log retrieval is not supported in this logger')
    return []
  }

  // Export logs (no-op for compatibility)
  exportLogs(_options?: {
    level?: LogLevel
    format?: 'json' | 'csv'
    filePath?: string
  }): void {
    console.warn('Log export is not supported in this logger')
  }
}

// Factory functions
export function createLogger(options: LoggerOptions = {}): Logger {
  return new Logger('app', options)
}

export function getLogger(namespace = 'app'): Logger {
  return new Logger(namespace)
}

// Global configuration
export function setGlobalLogLevel(level: LogLevel): void {
  globalLogLevel = level
}

export function setGlobalContext(context: Record<string, unknown>): void {
  globalContext = context
}

// UI helpers
export function logInfoBox(
  message: string,
  context?: Record<string, unknown>
): void {
  const logger = getLogger('ui')
  logger.info(message, context)
  if (context) {
    console.log(infoBox(message, context as Record<string, string>))
  }
}

export function logWarningBox(
  message: string,
  context?: Record<string, unknown>
): void {
  const logger = getLogger('ui')
  logger.warn(message, context)
  console.log(warningBox(message, context as Record<string, string>))
}

export function logErrorBox(
  message: string,
  context?: Record<string, unknown>
): void {
  const logger = getLogger('ui')
  logger.error(message, context)
  console.log(errorBox(message, context as Record<string, string>))
}

export function logSuccessBox(
  message: string,
  context?: Record<string, unknown>
): void {
  const logger = getLogger('ui')
  logger.info(message, context)
  console.log(successBox(message, context as Record<string, string>))
}

export function logKeyValue(
  data: Record<string, unknown>,
  title?: string
): void {
  const logger = getLogger('ui')
  logger.info(title || 'Key-Value Data', data)
  console.log(keyValueTable(data as Record<string, string>, title))
}

export default {
  Logger,
  createLogger,
  getLogger,
  setGlobalLogLevel,
  setGlobalContext,
}
