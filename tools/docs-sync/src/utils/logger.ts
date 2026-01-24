/**
 * Logger and Progress Indicator Utilities
 *
 * Provides consistent logging, progress bars, and spinners for CLI operations
 */

import pc from 'picocolors'
import ora, { type Ora } from 'ora'

export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error'

interface LoggerOptions {
  verbose?: boolean
  silent?: boolean
  timestamps?: boolean
}

const DEFAULT_OPTIONS: LoggerOptions = {
  verbose: false,
  silent: false,
  timestamps: true,
}

let globalOptions: LoggerOptions = { ...DEFAULT_OPTIONS }
let currentSpinner: Ora | null = null

/** Configure global logger options */
export function configureLogger(options: Partial<LoggerOptions>): void {
  globalOptions = { ...globalOptions, ...options }
}

/** Get current timestamp string */
function getTimestamp(): string {
  return new Date().toISOString().split('T')[1]?.slice(0, 8) ?? ''
}

/** Format a log message */
function formatMessage(message: string, level: LogLevel): string {
  const timestamp = globalOptions.timestamps ? `[${getTimestamp()}] ` : ''

  const icons: Record<LogLevel, string> = {
    debug: '🔍',
    info: 'ℹ',
    success: '✓',
    warn: '⚠',
    error: '✗',
  }

  const colors: Record<LogLevel, (s: string) => string> = {
    debug: pc.gray,
    info: pc.blue,
    success: pc.green,
    warn: pc.yellow,
    error: pc.red,
  }

  const icon = icons[level]
  const color = colors[level]

  return color(`${timestamp}${icon} ${message}`)
}

/** Log a message */
export function log(message: string, level: LogLevel = 'info'): void {
  if (globalOptions.silent) return
  if (level === 'debug' && !globalOptions.verbose) return

  // Stop spinner temporarily if active
  if (currentSpinner) {
    currentSpinner.stop()
  }

  console.log(formatMessage(message, level))

  // Resume spinner if it was active
  if (currentSpinner) {
    currentSpinner.start()
  }
}

/** Log debug message (only in verbose mode) */
export function debug(message: string): void {
  log(message, 'debug')
}

/** Log info message */
export function info(message: string): void {
  log(message, 'info')
}

/** Log success message */
export function success(message: string): void {
  log(message, 'success')
}

/** Log warning message */
export function warn(message: string): void {
  log(message, 'warn')
}

/** Log error message */
export function error(message: string): void {
  log(message, 'error')
}

/** Create a spinner for long-running operations */
export function startSpinner(text: string): Ora {
  if (globalOptions.silent) {
    return ora({ text, isSilent: true })
  }

  // Stop any existing spinner
  if (currentSpinner) {
    currentSpinner.stop()
  }

  currentSpinner = ora({
    text,
    color: 'cyan',
    spinner: 'dots',
  }).start()

  return currentSpinner
}

/** Update spinner text */
export function updateSpinner(text: string): void {
  if (currentSpinner) {
    currentSpinner.text = text
  }
}

/** Stop spinner with success */
export function succeedSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.succeed(text)
    currentSpinner = null
  }
}

/** Stop spinner with failure */
export function failSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.fail(text)
    currentSpinner = null
  }
}

/** Stop spinner with warning */
export function warnSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.warn(text)
    currentSpinner = null
  }
}

/** Stop spinner without status */
export function stopSpinner(): void {
  if (currentSpinner) {
    currentSpinner.stop()
    currentSpinner = null
  }
}

/** Progress tracker for multi-step operations */
export class ProgressTracker {
  private total: number
  private current: number
  private startTime: number
  private label: string
  private spinner: Ora | null = null

  constructor(total: number, label: string) {
    this.total = total
    this.current = 0
    this.label = label
    this.startTime = Date.now()
  }

  /** Start tracking progress */
  start(): void {
    if (!globalOptions.silent) {
      this.spinner = startSpinner(`${this.label} (0/${this.total})`)
    }
  }

  /** Increment progress */
  increment(itemName?: string): void {
    this.current++
    const percent = Math.round((this.current / this.total) * 100)
    const text = itemName
      ? `${this.label} (${this.current}/${this.total}) - ${itemName}`
      : `${this.label} (${this.current}/${this.total}) ${percent}%`

    if (this.spinner) {
      this.spinner.text = text
    }
  }

  /** Complete progress tracking */
  complete(message?: string): void {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2)
    const finalMessage =
      message ?? `${this.label} completed (${this.total} items in ${duration}s)`

    if (this.spinner) {
      this.spinner.succeed(finalMessage)
      this.spinner = null
      currentSpinner = null
    }
  }

  /** Fail progress tracking */
  fail(message?: string): void {
    const finalMessage =
      message ?? `${this.label} failed at ${this.current}/${this.total}`

    if (this.spinner) {
      this.spinner.fail(finalMessage)
      this.spinner = null
      currentSpinner = null
    }
  }

  /** Get elapsed time in seconds */
  getElapsedTime(): number {
    return (Date.now() - this.startTime) / 1000
  }

  /** Get current progress */
  getProgress(): { current: number; total: number; percent: number } {
    return {
      current: this.current,
      total: this.total,
      percent: Math.round((this.current / this.total) * 100),
    }
  }
}

/** Create a summary box for output */
export function printSummary(
  title: string,
  items: Array<{
    label: string
    value: string | number
    color?: 'green' | 'yellow' | 'red' | 'blue'
  }>
): void {
  if (globalOptions.silent) return

  const width = 50
  const line = '═'.repeat(width)

  console.log('')
  console.log(line)
  console.log(pc.bold(title))
  console.log(line)

  for (const item of items) {
    const colorFn = item.color ? pc[item.color] : (s: string) => s
    console.log(`${item.label}: ${colorFn(String(item.value))}`)
  }

  console.log(line)
}

/** Format file size for display */
export function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
