/**
 * Enhanced logger with multiple levels and formatting
 * 
 * Provides:
 * - Multiple log levels (trace, debug, info, warn, error)
 * - Colored output for terminal
 * - Structured logging with context
 * - Performance timing
 * - Log filtering
 */

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
  error: '\x1b[31m'  // Red
}

const LEVEL_ICONS: Record<LogLevel, string> = {
  trace: '🔍',
  debug: '🐛',
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌'
}

const RESET_COLOR = '\x1b[0m'

export class Logger {
  private level: LogLevel
  private prefix: string
  private colors: boolean
  private timestamps: boolean
  private context: Record<string, any>
  private timers: Map<string, number> = new Map()
  private logs: LogEntry[] = []

  constructor(options: LoggerOptions = {}) {
    this.level = options.level || 'info'
    this.prefix = options.prefix || ''
    this.colors = options.colors ?? process.stdout.isTTY
    this.timestamps = options.timestamps ?? true
    this.context = options.context || {}
  }

  /**
   * Log at trace level
   */
  trace(message: string, context?: Record<string, any>): void {
    this.log('trace', message, context)
  }

  /**
   * Log at debug level
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context)
  }

  /**
   * Log at info level
   */
  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context)
  }

  /**
   * Log at warn level
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context)
  }

  /**
   * Log at error level
   */
  error(message: string, error?: Error | Record<string, any>): void {
    const context = error instanceof Error 
      ? { error: error.message, stack: error.stack }
      : error

    this.log('error', message, context)
  }

  /**
   * Start a timer for performance measurement
   */
  time(label: string): void {
    this.timers.set(label, performance.now())
  }

  /**
   * End a timer and log the duration
   */
  timeEnd(label: string, level: LogLevel = 'debug'): number {
    const startTime = this.timers.get(label)
    if (!startTime) {
      this.warn(`Timer "${label}" does not exist`)
      return 0
    }

    const duration = performance.now() - startTime
    this.timers.delete(label)

    this.log(level, `${label} completed`, { duration: `${duration.toFixed(2)}ms` })

    return duration
  }

  /**
   * Log a group of related messages
   */
  group(title: string, fn: () => void): void {
    this.info(`┌─ ${title}`)
    const originalPrefix = this.prefix
    this.prefix = originalPrefix + '│  '
    
    try {
      fn()
    } finally {
      this.prefix = originalPrefix
      this.info('└─')
    }
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, any>): Logger {
    return new Logger({
      level: this.level,
      prefix: this.prefix,
      colors: this.colors,
      timestamps: this.timestamps,
      context: { ...this.context, ...context }
    })
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.level = level
  }

  /**
   * Get all log entries
   */
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level)
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = []
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    // Check if this level should be logged
    if (LOG_LEVELS[level] < LOG_LEVELS[this.level]) {
      return
    }

    const entry: LogEntry = {
      level,
      timestamp: new Date(),
      message,
      context: { ...this.context, ...context }
    }

    // Store log entry
    this.logs.push(entry)

    // Format and output
    const formatted = this.format(entry)
    const output = level === 'error' ? console.error : console.log
    output(formatted)
  }

  /**
   * Format log entry for output
   */
  private format(entry: LogEntry): string {
    const parts: string[] = []

    // Timestamp
    if (this.timestamps) {
      const time = entry.timestamp.toISOString().split('T')[1].slice(0, -1)
      parts.push(this.colorize(`[${time}]`, 'trace'))
    }

    // Level icon and name
    const icon = LEVEL_ICONS[entry.level]
    const levelText = entry.level.toUpperCase().padEnd(5)
    parts.push(this.colorize(`${icon} ${levelText}`, entry.level))

    // Prefix
    if (this.prefix) {
      parts.push(this.prefix)
    }

    // Message
    parts.push(this.colorize(entry.message, entry.level))

    // Context
    if (entry.context && Object.keys(entry.context).length > 0) {
      const contextStr = this.formatContext(entry.context)
      parts.push(this.colorize(contextStr, 'trace'))
    }

    return parts.join(' ')
  }

  /**
   * Format context object
   */
  private formatContext(context: Record<string, any>): string {
    const entries = Object.entries(context).map(([key, value]) => {
      if (typeof value === 'object') {
        return `${key}=${JSON.stringify(value)}`
      }
      return `${key}=${value}`
    })
    return `{${entries.join(', ')}}`
  }

  /**
   * Apply color to text
   */
  private colorize(text: string, level: LogLevel): string {
    if (!this.colors) return text
    return `${LEVEL_COLORS[level]}${text}${RESET_COLOR}`
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options)
}

// Default logger instance
let defaultLogger: Logger | null = null

/**
 * Get the default logger instance
 */
export function getLogger(): Logger {
  if (!defaultLogger) {
    defaultLogger = new Logger({
      level: (process.env.LOG_LEVEL as LogLevel) || 'info'
    })
  }
  return defaultLogger
}

/**
 * Convenience functions using default logger
 */
export const trace = (message: string, context?: Record<string, any>) => getLogger().trace(message, context)
export const debug = (message: string, context?: Record<string, any>) => getLogger().debug(message, context)
export const info = (message: string, context?: Record<string, any>) => getLogger().info(message, context)
export const warn = (message: string, context?: Record<string, any>) => getLogger().warn(message, context)
export const error = (message: string, err?: Error | Record<string, any>) => getLogger().error(message, err)
export const time = (label: string) => getLogger().time(label)
export const timeEnd = (label: string, level?: LogLevel) => getLogger().timeEnd(label, level)
