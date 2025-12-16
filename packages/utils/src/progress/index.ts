import { logger } from '@clarity-chat/utils/logger';
/**
 * Progress Tracking Utilities
 *
 * CLI progress indicators, spinners, and progress trackers for long-running operations.
 * Uses `ora` for spinner functionality when available.
 *
 * @module @clarity-chat/utils/progress
 *
 * @example
 * ```ts
 * import { startSpinner, succeedSpinner, ProgressTracker } from '@clarity-chat/utils/progress'
 *
 * const spinner = startSpinner('Processing files...')
 * // ... do work
 * succeedSpinner('Processed 100 files')
 *
 * // Or use ProgressTracker for multi-step operations
 * const tracker = new ProgressTracker(100, 'Processing')
 * tracker.start()
 * for (const item of items) {
 *   tracker.increment(item.name)
 * }
 * tracker.complete()
 * ```
 */

import { formatDuration } from '../format/index.js'

import { debug, error, warn } from '../logger';

// Spinner interface matching ora's API
interface Spinner {
  text: string
  start(): Spinner
  stop(): Spinner
  succeed(text?: string): Spinner
  fail(text?: string): Spinner
  warn(text?: string): Spinner
}

type OraFactory = (options: {
  text: string
  color?: string
  spinner?: string
  isSilent?: boolean
}) => Spinner



let oraFactory: OraFactory | null | undefined = undefined // undefined = not loaded yet
let currentSpinner: Spinner | null = null
let isSilent = false
let useFallbackOutput = true // Output to console when ora is not available

/**
 * Lazily load ora (only when first spinner is created)
 */
async function getOra(): Promise<OraFactory | null> {
  if (oraFactory !== undefined) {
    return oraFactory
  }

  try {
    const oraModule = await import('ora')
    oraFactory = oraModule.default as OraFactory
    return oraFactory
  } catch {
    // ora not available - will use console fallback
    oraFactory = null
    return null
  }
}

/**
 * Create a no-op spinner for silent mode
 */
function createNoOpSpinner(text: string): Spinner {
  const noOp: Spinner = {
    text,
    start: () => noOp,
    stop: () => noOp,
    succeed: () => noOp,
    fail: () => noOp,
    warn: () => noOp,
  }
  return noOp
}

/**
 * Create a console-based fallback spinner when ora is not available
 * Outputs to console with appropriate icons
 */
function createFallbackSpinner(initialText: string): Spinner {
  let currentText = initialText
  let isActive = false

  const fallback: Spinner = {
    get text() {
      return currentText
    },
    set text(value: string) {
      currentText = value
    },
    start: () => {
      if (!isActive) {
        isActive = true
        debug(`⏳ ${currentText}...`)
      }
      return fallback
    },
    stop: () => {
      isActive = false
      return fallback
    },
    succeed: (msg?: string) => {
      isActive = false
      debug(`✓ ${msg ?? currentText}`)
      return fallback
    },
    fail: (msg?: string) => {
      isActive = false
      logger.error(`✗ ${msg ?? currentText}`)
      return fallback
    },
    warn: (msg?: string) => {
      isActive = false
      warn(`⚠ ${msg ?? currentText}`)
      return fallback
    },
  }

  return fallback
}

/**
 * Configure progress utilities
 *
 * @param options - Configuration options
 * @param options.silent - Suppress all output
 * @param options.fallbackOutput - Use console output when ora is unavailable (default: true)
 */
export function configureProgress(options: {
  silent?: boolean
  fallbackOutput?: boolean
}): void {
  isSilent = options.silent ?? false
  useFallbackOutput = options.fallbackOutput ?? true
}

/**
 * Start a spinner for a long-running operation
 *
 * Note: This is an async function because ora is loaded lazily.
 * For synchronous operation, use `startSpinnerSync` which returns a no-op
 * if ora isn't loaded yet.
 *
 * @param text - Initial spinner text
 * @returns Spinner instance (or mock if ora not available)
 *
 * @example
 * ```ts
 * const spinner = await startSpinner('Loading data...')
 * // Later:
 * succeedSpinner('Data loaded successfully')
 * ```
 */
export async function startSpinner(text: string): Promise<Spinner> {
  if (isSilent) {
    return createNoOpSpinner(text)
  }

  const ora = await getOra()

  if (!ora) {
    // Use console fallback when ora is not available
    const spinner = useFallbackOutput
      ? createFallbackSpinner(text)
      : createNoOpSpinner(text)
    currentSpinner = spinner.start()
    return currentSpinner
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
 * Synchronous spinner start - returns no-op if ora isn't loaded
 *
 * Use this when you can't use async/await. If ora has been loaded
 * (e.g., by a previous startSpinner call), it will work normally.
 *
 * @param text - Initial spinner text
 * @returns Spinner instance
 */
export function startSpinnerSync(text: string): Spinner {
  if (isSilent) {
    return createNoOpSpinner(text)
  }

  if (!oraFactory) {
    // Use console fallback when ora is not available
    const spinner = useFallbackOutput
      ? createFallbackSpinner(text)
      : createNoOpSpinner(text)
    currentSpinner = spinner.start()
    return currentSpinner
  }

  // Stop any existing spinner
  if (currentSpinner) {
    currentSpinner.stop()
  }

  currentSpinner = oraFactory({
    text,
    color: 'cyan',
    spinner: 'dots',
  }).start()

  return currentSpinner
}

/**
 * Update the current spinner's text
 *
 * @param text - New spinner text
 */
export function updateSpinner(text: string): void {
  if (currentSpinner) {
    currentSpinner.text = text
  }
}

/**
 * Stop the current spinner with a success message
 *
 * @param text - Optional success message (defaults to spinner text)
 */
export function succeedSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.succeed(text)
    currentSpinner = null
  }
}

/**
 * Stop the current spinner with a failure message
 *
 * @param text - Optional failure message
 */
export function failSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.fail(text)
    currentSpinner = null
  }
}

/**
 * Stop the current spinner with a warning message
 *
 * @param text - Optional warning message
 */
export function warnSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.warn(text)
    currentSpinner = null
  }
}

/**
 * Stop the current spinner without any status indicator
 */
export function stopSpinner(): void {
  if (currentSpinner) {
    currentSpinner.stop()
    currentSpinner = null
  }
}

/**
 * Pause the spinner for logging
 * Call resumeSpinner() to restart
 */
export function pauseSpinner(): void {
  if (currentSpinner) {
    currentSpinner.stop()
  }
}

/**
 * Resume a paused spinner
 */
export function resumeSpinner(): void {
  if (currentSpinner) {
    currentSpinner.start()
  }
}

/**
 * Progress tracker for multi-step operations
 *
 * Provides a spinner that shows current progress (e.g., "Processing (5/100) 5%")
 *
 * @example
 * ```ts
 * const tracker = new ProgressTracker(files.length, 'Analyzing')
 * await tracker.start()
 *
 * for (const file of files) {
 *   await analyze(file)
 *   tracker.increment(file.name)
 * }
 *
 * tracker.complete('Analysis complete')
 * // Output: ✓ Analysis complete (100 items in 2.5s)
 * ```
 */
export class ProgressTracker {
  private total: number
  private current: number
  private startTime: number
  private label: string
  private spinner: Spinner | null = null

  /**
   * Create a new progress tracker
   *
   * @param total - Total number of items to process
   * @param label - Label for the progress (e.g., "Processing")
   */
  constructor(total: number, label: string) {
    this.total = total
    this.current = 0
    this.label = label
    this.startTime = Date.now()
  }

  /**
   * Start tracking progress (shows spinner)
   */
  async start(): Promise<void> {
    if (!isSilent) {
      this.spinner = await startSpinner(`${this.label} (0/${this.total})`)
    }
  }

  /**
   * Increment progress by one
   *
   * @param itemName - Optional name of current item being processed
   */
  increment(itemName?: string): void {
    this.current++
    const percent =
      this.total > 0 ? Math.round((this.current / this.total) * 100) : 0
    const text = itemName
      ? `${this.label} (${this.current}/${this.total}) - ${itemName}`
      : `${this.label} (${this.current}/${this.total}) ${percent}%`

    if (this.spinner) {
      this.spinner.text = text
    }
  }

  /**
   * Mark progress as complete
   *
   * @param message - Optional completion message
   */
  complete(message?: string): void {
    const duration = formatDuration(Date.now() - this.startTime)
    const finalMessage =
      message ?? `${this.label} completed (${this.total} items in ${duration})`

    if (this.spinner) {
      this.spinner.succeed(finalMessage)
      this.spinner = null
      currentSpinner = null
    }
  }

  /**
   * Mark progress as failed
   *
   * @param message - Optional failure message
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
   * Get elapsed time in milliseconds
   */
  getElapsedTime(): number {
    return Date.now() - this.startTime
  }

  /**
   * Get current progress statistics
   */
  getProgress(): { current: number; total: number; percent: number } {
    return {
      current: this.current,
      total: this.total,
      percent:
        this.total > 0 ? Math.round((this.current / this.total) * 100) : 0,
    }
  }
}
