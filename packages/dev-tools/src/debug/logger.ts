import { logger } from '@clarity-chat/utils/logger';
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
  context?: Record<string, any>
  duration?: number
  stack?: string
}

export interface LoggerOptions {
  level?: LogLevel
  prefix?: string
  colors?: boolean
  timestamps?: boolean
  context?: Record<string, any>
}

const LOG_LEVELS: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  trace: '\x1b[90m', // Gray
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
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
let globalContext: Record<string, any> = {}

// Map our log levels to utils logger levels
const mapToUtilsLevel = (level: LogLevel): LogLevel => {
  switch (level) {
    case 'trace':
    case 'debug':
      return LogLevel.DEBUG
    case 'info':
      return LogLevel.INFO
    case 'warn':
      return LogLevel.WARN
    case 'error':
      return LogLevel.ERROR
    default:
      return LogLevel.INFO
  }
}

// Compatibility wrapper for legacy code
export class Logger {
  private logger: ReturnType<typeof getLogger>
  private namespace: string
  private level: LogLevel
  private colors: boolean
  private timestamps: boolean
  private context: Record<string, any>

  constructor(namespace = 'app', options: LoggerOptions = {}) {
    this.namespace = namespace
    this.level = options.level || globalLogLevel
    this.colors = options.colors ?? true
    this.timestamps = options.timestamps ?? true
    this.context = { ...globalContext, ...options.context }
    
    // Create the standard utils logger
    this.logger = getLogger(namespace)
    this.logger.setLevel(mapToUtilsLevel(this.level))
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

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) return

    const logContext = { ...this.context, ...context }
    const fullMessage = this.formatPrefix(level) + ' ' + message

    switch (level) {
      case 'trace':
      case 'debug':
        this.logger.debug(fullMessage, logContext)
        break
      case 'info':
        this.logger.info(fullMessage, logContext)
        break
      case 'warn':
        this.logger.warn(fullMessage, logContext)
        break
      case 'error':
        this.logger.error(fullMessage, logContext)
        break
    }
  }

  trace(message: string, context?: Record<string, any>): void {
    this.log('trace', message, context)
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context)
  }

  error(message: string, context?: Record<string, any>): void {
    this.log('error', message, context)
  }

  setLevel(level: LogLevel): void {
    this.level = level
    this.logger.setLevel(mapToUtilsLevel(level))
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

  // Log filtering
  filter(predicate: (entry: LogEntry) => boolean): void {
    // This is a no-op for compatibility - the new logger doesn't support filtering
    console.warn('Log filtering is not supported in the new logger')
  }

  // Get all logs
  getLogs(level?: LogLevel): LogEntry[] {
    // This is a no-op for compatibility - the new logger doesn't support log retrieval
    console.warn('Log retrieval is not supported in the new logger')
    return []
  }

  // Export logs
  exportLogs(options?: {
    level?: LogLevel
    format?: 'json' | 'csv'
    filePath?: string
  }): void {
    // This is a no-op for compatibility
    console.warn('Log export is not supported in the new logger')
  }
}

// Factory functions for backward compatibility
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

export function setGlobalContext(context: Record<string, any>): void {
  globalContext = context
}

// UI helpers
export function logInfoBox(message: string, context?: Record<string, any>): void {
  const logger = getLogger('ui')
  logger.info(message, context)
  if (context) {
    console.log(infoBox(message, context))
  }
}

export function logWarningBox(message: string, context?: Record<string, any>): void {
  const logger = getLogger('ui')
  logger.warn(message, context)
  console.log(warningBox(message, context))
}

export function logErrorBox(message: string, context?: Record<string, any>): void {
  const logger = getLogger('ui')
  logger.error(message, context)
  console.log(errorBox(message, context))
}

export function logSuccessBox(message: string, context?: Record<string, any>): void {
  const logger = getLogger('ui')
  logger.info(message, context)
  console.log(successBox(message, context))
}

export function logKeyValue(data: Record<string, any>, title?: string): void {
  const logger = getLogger('ui')
  logger.info(title || 'Key-Value Data', data)
  console.log(keyValueTable(data, title))
}

// Re-export the standard utils logger for new code

export default {
  Logger,
  createLogger,
  getLogger,
  setGlobalLogLevel,
  setGlobalContext,
  LogLevel
}