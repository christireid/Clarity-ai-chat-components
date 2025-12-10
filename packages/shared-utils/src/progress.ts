/**
 * Progress Tracking Utilities
 *
 * Shared progress indicators and spinners for CLI operations
 */

import ora, { type Ora } from 'ora'

let currentSpinner: Ora | null = null
let isSilent = false

/**
 * Configure progress utilities
 */
export function configureProgress(options: { silent?: boolean }): void {
  isSilent = options.silent ?? false
}

/**
 * Create a spinner for long-running operations
 */
export function startSpinner(text: string): Ora {
  if (isSilent) {
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

/**
 * Update spinner text
 */
export function updateSpinner(text: string): void {
  if (currentSpinner) {
    currentSpinner.text = text
  }
}

/**
 * Stop spinner with success
 */
export function succeedSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.succeed(text)
    currentSpinner = null
  }
}

/**
 * Stop spinner with failure
 */
export function failSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.fail(text)
    currentSpinner = null
  }
}

/**
 * Stop spinner with warning
 */
export function warnSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.warn(text)
    currentSpinner = null
  }
}

/**
 * Stop spinner without status
 */
export function stopSpinner(): void {
  if (currentSpinner) {
    currentSpinner.stop()
    currentSpinner = null
  }
}

/**
 * Pause spinner for logging
 */
export function pauseSpinner(): void {
  if (currentSpinner) {
    currentSpinner.stop()
  }
}

/**
 * Resume spinner after logging
 */
export function resumeSpinner(): void {
  if (currentSpinner) {
    currentSpinner.start()
  }
}

/**
 * Progress tracker for multi-step operations
 */
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

  /**
   * Start tracking progress
   */
  start(): void {
    if (!isSilent) {
      this.spinner = startSpinner(`${this.label} (0/${this.total})`)
    }
  }

  /**
   * Increment progress
   */
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

  /**
   * Complete progress tracking
   */
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

  /**
   * Fail progress tracking
   */
  fail(message?: string): void {
    const finalMessage =
      message ?? `${this.label} failed at ${this.current}/${this.total}`

    if (this.spinner) {
      this.spinner.fail(finalMessage)
      this.spinner = null
      currentSpinner = null
    }
  }

  /**
   * Get elapsed time in seconds
   */
  getElapsedTime(): number {
    return (Date.now() - this.startTime) / 1000
  }

  /**
   * Get current progress
   */
  getProgress(): { current: number; total: number; percent: number } {
    return {
      current: this.current,
      total: this.total,
      percent: Math.round((this.current / this.total) * 100),
    }
  }
}

/**
 * Format duration for display
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`
  }
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.round((ms % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

/**
 * Format file size for display
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
