/**
 * Enhanced Debug Console for Clarity Chat Developer Tools
 *
 * A comprehensive logging and debugging system with:
 * - Multiple log levels with filtering
 * - Log persistence and export
 * - Search and filtering capabilities
 * - Performance timing integration
 * - Stack trace capture
 * - Context-aware logging
 * - Console interception
 * - Log replay functionality
 */

import chalk from 'chalk'
import { infoBox, errorBox, warningBox, successBox } from '../ui/box'
import { table, keyValueTable, type TableColumn } from '../ui/table'

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface EnhancedLogEntry {
  id: string
  level: LogLevel
  timestamp: Date
  message: string
  args: unknown[]
  context?: Record<string, unknown>
  source?: {
    file?: string
    line?: number
    column?: number
    function?: string
  }
  duration?: number
  tags?: string[]
  groupId?: string
  stack?: string
}

export interface ConsoleFilter {
  levels?: LogLevel[]
  tags?: string[]
  search?: string
  startTime?: Date
  endTime?: Date
  source?: string
}

export interface ConsoleExportOptions {
  format: 'json' | 'csv' | 'markdown' | 'html'
  filter?: ConsoleFilter
  includeStack?: boolean
  prettyPrint?: boolean
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
}

const LOG_LEVEL_COLORS: Record<LogLevel, (text: string) => string> = {
  trace: chalk.gray,
  debug: chalk.cyan,
  info: chalk.green,
  warn: chalk.yellow,
  error: chalk.red,
  fatal: chalk.bgRed.white,
}

const LOG_LEVEL_ICONS: Record<LogLevel, string> = {
  trace: '🔍',
  debug: '🐛',
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  fatal: '💀',
}

/**
 * Enhanced Debug Console
 * Comprehensive logging with filtering, export, and replay
 */
export class EnhancedConsole {
  private entries: EnhancedLogEntry[] = []
  private maxEntries: number = 1000
  private minLevel: LogLevel = 'debug'
  private enabled: boolean = true
  private interceptConsole: boolean = false
  private originalConsole: Partial<Console> = {}
  private currentGroup: string | null = null
  private timers: Map<string, number> = new Map()
  private context: Record<string, unknown> = {}
  private listeners: Set<(entry: EnhancedLogEntry) => void> = new Set()
  private tags: Set<string> = new Set()

  constructor(options: {
    maxEntries?: number
    minLevel?: LogLevel
    enabled?: boolean
    interceptConsole?: boolean
    context?: Record<string, unknown>
  } = {}) {
    this.maxEntries = options.maxEntries ?? 1000
    this.minLevel = options.minLevel ?? 'debug'
    this.enabled = options.enabled ?? true
    this.context = options.context ?? {}

    if (options.interceptConsole) {
      this.startInterception()
    }
  }

  /**
   * Start intercepting console methods
   */
  startInterception(): void {
    if (this.interceptConsole) return

    this.interceptConsole = true
    this.originalConsole = {
      log: console.log,
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
    }

    console.log = (...args) => this.info(args[0], ...args.slice(1))
    console.debug = (...args) => this.debug(args[0], ...args.slice(1))
    console.info = (...args) => this.info(args[0], ...args.slice(1))
    console.warn = (...args) => this.warn(args[0], ...args.slice(1))
    console.error = (...args) => this.error(args[0], ...args.slice(1))
  }

  /**
   * Stop intercepting console methods
   */
  stopInterception(): void {
    if (!this.interceptConsole) return

    this.interceptConsole = false
    if (this.originalConsole.log) console.log = this.originalConsole.log
    if (this.originalConsole.debug) console.debug = this.originalConsole.debug
    if (this.originalConsole.info) console.info = this.originalConsole.info
    if (this.originalConsole.warn) console.warn = this.originalConsole.warn
    if (this.originalConsole.error) console.error = this.originalConsole.error
  }

  /**
   * Set global context
   */
  setContext(context: Record<string, unknown>): void {
    this.context = { ...this.context, ...context }
  }

  /**
   * Clear global context
   */
  clearContext(): void {
    this.context = {}
  }

  /**
   * Set minimum log level
   */
  setLevel(level: LogLevel): void {
    this.minLevel = level
  }

  /**
   * Enable/disable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Add a log listener
   */
  addListener(listener: (entry: EnhancedLogEntry) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Log at trace level
   */
  trace(message: string, ...args: unknown[]): EnhancedLogEntry | null {
    return this.log('trace', message, args)
  }

  /**
   * Log at debug level
   */
  debug(message: string, ...args: unknown[]): EnhancedLogEntry | null {
    return this.log('debug', message, args)
  }

  /**
   * Log at info level
   */
  info(message: string, ...args: unknown[]): EnhancedLogEntry | null {
    return this.log('info', message, args)
  }

  /**
   * Log at warn level
   */
  warn(message: string, ...args: unknown[]): EnhancedLogEntry | null {
    return this.log('warn', message, args)
  }

  /**
   * Log at error level
   */
  error(message: string, ...args: unknown[]): EnhancedLogEntry | null {
    return this.log('error', message, args)
  }

  /**
   * Log at fatal level
   */
  fatal(message: string, ...args: unknown[]): EnhancedLogEntry | null {
    return this.log('fatal', message, args)
  }

  /**
   * Log with context
   */
  withContext(context: Record<string, unknown>): {
    trace: (msg: string, ...args: unknown[]) => EnhancedLogEntry | null
    debug: (msg: string, ...args: unknown[]) => EnhancedLogEntry | null
    info: (msg: string, ...args: unknown[]) => EnhancedLogEntry | null
    warn: (msg: string, ...args: unknown[]) => EnhancedLogEntry | null
    error: (msg: string, ...args: unknown[]) => EnhancedLogEntry | null
    fatal: (msg: string, ...args: unknown[]) => EnhancedLogEntry | null
  } {
    return {
      trace: (msg, ...args) => this.log('trace', msg, args, context),
      debug: (msg, ...args) => this.log('debug', msg, args, context),
      info: (msg, ...args) => this.log('info', msg, args, context),
      warn: (msg, ...args) => this.log('warn', msg, args, context),
      error: (msg, ...args) => this.log('error', msg, args, context),
      fatal: (msg, ...args) => this.log('fatal', msg, args, context),
    }
  }

  /**
   * Log with tags
   */
  withTags(...tags: string[]): {
    trace: (msg: string, ...args: unknown[]) => EnhancedLogEntry | null
    debug: (msg: string, ...args: unknown[]) => EnhancedLogEntry | null
    info: (msg: string, ...args: unknown[]) => EnhancedLogEntry | null
    warn: (msg: string, ...args: unknown[]) => EnhancedLogEntry | null
    error: (msg: string, ...args: unknown[]) => EnhancedLogEntry | null
    fatal: (msg: string, ...args: unknown[]) => EnhancedLogEntry | null
  } {
    tags.forEach(tag => this.tags.add(tag))
    return {
      trace: (msg, ...args) => this.log('trace', msg, args, undefined, tags),
      debug: (msg, ...args) => this.log('debug', msg, args, undefined, tags),
      info: (msg, ...args) => this.log('info', msg, args, undefined, tags),
      warn: (msg, ...args) => this.log('warn', msg, args, undefined, tags),
      error: (msg, ...args) => this.log('error', msg, args, undefined, tags),
      fatal: (msg, ...args) => this.log('fatal', msg, args, undefined, tags),
    }
  }

  /**
   * Start a timer
   */
  time(label: string): void {
    this.timers.set(label, performance.now())
  }

  /**
   * End a timer and log duration
   */
  timeEnd(label: string): number | null {
    const start = this.timers.get(label)
    if (start === undefined) {
      this.warn(`Timer '${label}' does not exist`)
      return null
    }

    const duration = performance.now() - start
    this.timers.delete(label)

    this.log('debug', `${label}: ${duration.toFixed(2)}ms`, [], { timer: label, duration })
    return duration
  }

  /**
   * Start a group
   */
  group(label: string): void {
    this.currentGroup = label
    this.info(`▼ ${label}`)
  }

  /**
   * End current group
   */
  groupEnd(): void {
    if (this.currentGroup) {
      this.info(`▲ End ${this.currentGroup}`)
      this.currentGroup = null
    }
  }

  /**
   * Assert a condition
   */
  assert(condition: boolean, message: string, ...args: unknown[]): void {
    if (!condition) {
      this.error(`Assertion failed: ${message}`, ...args)
    }
  }

  /**
   * Count occurrences
   */
  private counts: Map<string, number> = new Map()

  count(label: string = 'default'): number {
    const count = (this.counts.get(label) ?? 0) + 1
    this.counts.set(label, count)
    this.debug(`${label}: ${count}`)
    return count
  }

  /**
   * Reset count
   */
  countReset(label: string = 'default'): void {
    this.counts.delete(label)
  }

  /**
   * Log a table
   */
  table(data: Record<string, unknown>[] | Record<string, unknown>, columns?: string[]): void {
    if (Array.isArray(data)) {
      const cols = columns ?? Object.keys(data[0] ?? {})
      const tableColumns: TableColumn[] = cols.map(col => ({
        header: col,
        width: Math.max(col.length, 15),
      }))
      const tableData = data.map(row => cols.map(col => String(row[col] ?? '')))
      console.log(table(tableData, tableColumns))
    } else {
      console.log(keyValueTable(data as Record<string, string>))
    }
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.entries = []
    this.timers.clear()
    this.counts.clear()
    this.currentGroup = null
  }

  /**
   * Get all entries
   */
  getEntries(filter?: ConsoleFilter): EnhancedLogEntry[] {
    let entries = [...this.entries]

    if (filter) {
      if (filter.levels?.length) {
        entries = entries.filter(e => filter.levels!.includes(e.level))
      }
      if (filter.tags?.length) {
        entries = entries.filter(e =>
          e.tags?.some(t => filter.tags!.includes(t))
        )
      }
      if (filter.search) {
        const search = filter.search.toLowerCase()
        entries = entries.filter(e =>
          e.message.toLowerCase().includes(search) ||
          JSON.stringify(e.args).toLowerCase().includes(search)
        )
      }
      if (filter.startTime) {
        entries = entries.filter(e => e.timestamp >= filter.startTime!)
      }
      if (filter.endTime) {
        entries = entries.filter(e => e.timestamp <= filter.endTime!)
      }
      if (filter.source) {
        entries = entries.filter(e =>
          e.source?.file?.includes(filter.source!)
        )
      }
    }

    return entries
  }

  /**
   * Get all used tags
   */
  getTags(): string[] {
    return Array.from(this.tags)
  }

  /**
   * Get statistics
   */
  getStats(): {
    total: number
    byLevel: Record<LogLevel, number>
    byTag: Record<string, number>
    avgEntriesPerMinute: number
    errorRate: number
  } {
    const byLevel: Record<LogLevel, number> = {
      trace: 0,
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
      fatal: 0,
    }

    const byTag: Record<string, number> = {}

    this.entries.forEach(entry => {
      byLevel[entry.level]++
      entry.tags?.forEach(tag => {
        byTag[tag] = (byTag[tag] ?? 0) + 1
      })
    })

    const timeSpan = this.entries.length > 1
      ? (this.entries[this.entries.length - 1].timestamp.getTime() -
         this.entries[0].timestamp.getTime()) / 60000
      : 1

    const errorCount = byLevel.error + byLevel.fatal

    return {
      total: this.entries.length,
      byLevel,
      byTag,
      avgEntriesPerMinute: this.entries.length / timeSpan,
      errorRate: this.entries.length > 0 ? errorCount / this.entries.length : 0,
    }
  }

  /**
   * Export entries
   */
  export(options: ConsoleExportOptions): string {
    const entries = this.getEntries(options.filter)

    switch (options.format) {
      case 'json':
        return JSON.stringify(
          entries.map(e => ({
            ...e,
            stack: options.includeStack ? e.stack : undefined,
          })),
          null,
          options.prettyPrint ? 2 : 0
        )

      case 'csv': {
        const headers = ['timestamp', 'level', 'message', 'tags', 'context']
        const rows = entries.map(e => [
          e.timestamp.toISOString(),
          e.level,
          `"${e.message.replace(/"/g, '""')}"`,
          e.tags?.join(';') ?? '',
          JSON.stringify(e.context ?? {}),
        ])
        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
      }

      case 'markdown': {
        const lines = ['# Debug Console Export', '', `Exported: ${new Date().toISOString()}`, '']

        entries.forEach(e => {
          const icon = LOG_LEVEL_ICONS[e.level]
          lines.push(`## ${icon} [${e.level.toUpperCase()}] ${e.timestamp.toISOString()}`)
          lines.push('')
          lines.push(`**Message:** ${e.message}`)
          if (e.tags?.length) {
            lines.push(`**Tags:** ${e.tags.join(', ')}`)
          }
          if (e.context && Object.keys(e.context).length > 0) {
            lines.push('**Context:**')
            lines.push('```json')
            lines.push(JSON.stringify(e.context, null, 2))
            lines.push('```')
          }
          if (options.includeStack && e.stack) {
            lines.push('**Stack:**')
            lines.push('```')
            lines.push(e.stack)
            lines.push('```')
          }
          lines.push('')
        })

        return lines.join('\n')
      }

      case 'html': {
        const levelColors: Record<LogLevel, string> = {
          trace: '#888',
          debug: '#0ff',
          info: '#0f0',
          warn: '#ff0',
          error: '#f00',
          fatal: '#f00',
        }

        const rows = entries.map(e => `
          <tr style="background: ${e.level === 'error' || e.level === 'fatal' ? '#330000' : 'inherit'}">
            <td style="color: ${levelColors[e.level]}">${LOG_LEVEL_ICONS[e.level]} ${e.level}</td>
            <td>${e.timestamp.toISOString()}</td>
            <td>${e.message}</td>
            <td>${e.tags?.join(', ') ?? ''}</td>
          </tr>
        `).join('')

        return `
<!DOCTYPE html>
<html>
<head>
  <title>Debug Console Export</title>
  <style>
    body { font-family: monospace; background: #1e1e1e; color: #d4d4d4; padding: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #333; }
    th { background: #333; }
  </style>
</head>
<body>
  <h1>🐛 Debug Console Export</h1>
  <p>Exported: ${new Date().toISOString()}</p>
  <table>
    <thead>
      <tr>
        <th>Level</th>
        <th>Timestamp</th>
        <th>Message</th>
        <th>Tags</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`
      }

      default:
        return ''
    }
  }

  /**
   * Replay logs (useful for debugging)
   */
  replay(filter?: ConsoleFilter, delay: number = 100): Promise<void> {
    return new Promise((resolve) => {
      const entries = this.getEntries(filter)
      let index = 0

      const replayNext = () => {
        if (index >= entries.length) {
          resolve()
          return
        }

        const entry = entries[index]
        const colorFn = LOG_LEVEL_COLORS[entry.level]
        const icon = LOG_LEVEL_ICONS[entry.level]

        console.log(
          colorFn(`[REPLAY] ${icon} [${entry.level.toUpperCase()}] ${entry.message}`),
          ...entry.args
        )

        index++
        setTimeout(replayNext, delay)
      }

      replayNext()
    })
  }

  /**
   * Print formatted report
   */
  printReport(): void {
    const stats = this.getStats()

    console.log('')
    console.log(infoBox('Enhanced Console Report', '📊 Debug Console Stats'))
    console.log('')

    // Level breakdown
    const levelData: Record<string, string> = {}
    Object.entries(stats.byLevel).forEach(([level, count]) => {
      if (count > 0) {
        levelData[LOG_LEVEL_ICONS[level as LogLevel] + ' ' + level] =
          chalk.cyan(count.toString())
      }
    })
    console.log(keyValueTable(levelData))
    console.log('')

    // Summary stats
    const summaryData: Record<string, string> = {
      'Total Entries': chalk.cyan(stats.total.toString()),
      'Entries/min': chalk.cyan(stats.avgEntriesPerMinute.toFixed(2)),
      'Error Rate': stats.errorRate > 0.1
        ? chalk.red((stats.errorRate * 100).toFixed(1) + '%')
        : chalk.green((stats.errorRate * 100).toFixed(1) + '%'),
    }
    console.log(keyValueTable(summaryData))
    console.log('')

    // Recent errors
    const recentErrors = this.getEntries({ levels: ['error', 'fatal'] }).slice(-5)
    if (recentErrors.length > 0) {
      console.log(errorBox('Recent Errors', '❌ Errors'))
      recentErrors.forEach(e => {
        console.log(chalk.red(`  • ${e.message}`))
      })
      console.log('')
    }
  }

  /**
   * Internal log method
   */
  private log(
    level: LogLevel,
    message: string,
    args: unknown[],
    additionalContext?: Record<string, unknown>,
    tags?: string[]
  ): EnhancedLogEntry | null {
    if (!this.enabled) return null
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.minLevel]) return null

    const entry: EnhancedLogEntry = {
      id: this.generateId(),
      level,
      timestamp: new Date(),
      message,
      args,
      context: { ...this.context, ...additionalContext },
      tags,
      groupId: this.currentGroup ?? undefined,
      source: this.captureSource(),
      stack: level === 'error' || level === 'fatal' ? this.captureStack() : undefined,
    }

    this.entries.push(entry)

    // Maintain max entries
    if (this.entries.length > this.maxEntries) {
      this.entries.shift()
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(entry))

    // Output to console
    this.output(entry)

    return entry
  }

  /**
   * Output entry to console
   */
  private output(entry: EnhancedLogEntry): void {
    const colorFn = LOG_LEVEL_COLORS[entry.level]
    const icon = LOG_LEVEL_ICONS[entry.level]
    const timestamp = entry.timestamp.toISOString()

    const prefix = colorFn(`[${timestamp}] ${icon} [${entry.level.toUpperCase()}]`)
    const tagsStr = entry.tags?.length ? chalk.gray(` [${entry.tags.join(', ')}]`) : ''

    const output = this.originalConsole.log ?? console.log
    output(prefix + tagsStr, entry.message, ...entry.args)
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Capture source location
   */
  private captureSource(): EnhancedLogEntry['source'] {
    const stack = new Error().stack
    if (!stack) return undefined

    // Skip internal frames to find caller
    const lines = stack.split('\n').slice(4)
    const match = lines[0]?.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/)

    if (match) {
      return {
        function: match[1],
        file: match[2],
        line: parseInt(match[3], 10),
        column: parseInt(match[4], 10),
      }
    }

    return undefined
  }

  /**
   * Capture stack trace
   */
  private captureStack(): string {
    const stack = new Error().stack
    return stack?.split('\n').slice(4).join('\n') ?? ''
  }
}

// Global instance
let globalConsole: EnhancedConsole | null = null

/**
 * Get the global enhanced console instance
 */
export function getEnhancedConsole(): EnhancedConsole {
  if (!globalConsole) {
    globalConsole = new EnhancedConsole({
      enabled: process.env.NODE_ENV === 'development',
    })
  }
  return globalConsole
}

/**
 * Create a new enhanced console instance
 */
export function createEnhancedConsole(options?: {
  maxEntries?: number
  minLevel?: LogLevel
  enabled?: boolean
  interceptConsole?: boolean
  context?: Record<string, unknown>
}): EnhancedConsole {
  return new EnhancedConsole(options)
}

export default EnhancedConsole
