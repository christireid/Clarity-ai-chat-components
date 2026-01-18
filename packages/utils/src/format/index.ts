/**
 * Formatting Utilities
 *
 * Consistent formatting functions for bytes, duration, numbers, and percentages.
 * These are the canonical implementations used across all Clarity Chat packages.
 *
 * @module @clarity-chat/utils/format
 *
 * @example
 * ```ts
 * import { formatBytes, formatDuration, formatNumber } from '@clarity-chat/utils/format'
 *
 * formatBytes(1536) // "1.5 KB"
 * formatDuration(90000) // "1m 30s"
 * formatNumber(1234567) // "1,234,567"
 * ```
 */

/**
 * Format bytes to human-readable string
 *
 * @param bytes - Number of bytes to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Human-readable string (e.g., "1.5 KB", "2.3 MB")
 *
 * @example
 * ```ts
 * formatBytes(1024) // "1 KB"
 * formatBytes(1536) // "1.5 KB"
 * formatBytes(0) // "0 B"
 * formatBytes(1024 * 1024 * 2.5) // "2.5 MB"
 * ```
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

/**
 * Alias for formatBytes for convenience
 *
 * @param bytes - Number of bytes to format
 * @returns Human-readable string
 *
 * @example
 * ```ts
 * formatSize(1536) // "1.5 KB"
 * ```
 */
export const formatSize = formatBytes

/**
 * Format a numeric delta with arrow indicator
 *
 * @param current - Current value
 * @param previous - Previous value to compare against
 * @param unit - Optional unit suffix
 * @returns Formatted string with delta indicator (e.g., "100 (↑ +10)")
 *
 * @example
 * ```ts
 * formatDelta(110, 100) // "110 (↑ +10)"
 * formatDelta(90, 100) // "90 (↓ -10)"
 * formatDelta(100, 100) // "100 (no change)"
 * formatDelta(110, 100, ' items') // "110 items (↑ +10)"
 * ```
 */
export function formatDelta(
  current: number,
  previous: number,
  unit = ''
): string {
  const delta = current - previous
  if (delta === 0) return `${current.toLocaleString()}${unit} (no change)`
  const arrow = delta > 0 ? '↑' : '↓'
  const sign = delta > 0 ? '+' : ''
  return `${current.toLocaleString()}${unit} (${arrow} ${sign}${delta.toLocaleString()})`
}

/**
 * Format duration in milliseconds to human-readable string
 *
 * @param ms - Duration in milliseconds
 * @returns Human-readable duration (e.g., "1.5s", "250ms", "2m 30s")
 *
 * @example
 * ```ts
 * formatDuration(500) // "500ms"
 * formatDuration(1500) // "1.5s"
 * formatDuration(90000) // "1m 30s"
 * formatDuration(3600000) // "60m 0s"
 * ```
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`

  const minutes = Math.floor(ms / 60000)
  const seconds = Math.round((ms % 60000) / 1000)

  if (seconds === 0) return `${minutes}m`
  return `${minutes}m ${seconds}s`
}

/**
 * Format a number with locale-aware separators
 *
 * @param num - Number to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 *
 * @example
 * ```ts
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234.5678, { maximumFractionDigits: 2 }) // "1,234.57"
 * formatNumber(0.5, { style: 'percent' }) // "50%"
 * ```
 */
export function formatNumber(
  num: number,
  options?: Intl.NumberFormatOptions
): string {
  return num.toLocaleString(undefined, options)
}

/**
 * Format a percentage value
 *
 * @param value - Value (0-100 or 0-1 depending on isDecimal)
 * @param decimals - Number of decimal places (default: 1)
 * @param isDecimal - If true, treats value as 0-1 range (default: false)
 * @returns Formatted percentage string
 *
 * @example
 * ```ts
 * formatPercent(75.5) // "75.5%"
 * formatPercent(0.755, 1, true) // "75.5%"
 * formatPercent(100, 0) // "100%"
 * ```
 */
export function formatPercent(
  value: number,
  decimals = 1,
  isDecimal = false
): string {
  const pct = isDecimal ? value * 100 : value
  return `${pct.toFixed(decimals)}%`
}

/**
 * Format a date relative to now (e.g., "2 hours ago", "in 3 days")
 *
 * @param date - Date to format (Date object, ISO string, or timestamp number)
 * @param now - Reference date (defaults to current time)
 * @returns Human-readable relative time string
 *
 * @example
 * ```ts
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 * formatRelativeTime(new Date(Date.now() + 86400000)) // "in 1 day"
 * formatRelativeTime("2025-01-15T10:30:00Z") // Works with ISO strings
 * formatRelativeTime(1736935800000) // Works with timestamps
 * ```
 */
export function formatRelativeTime(
  date: Date | string | number,
  now = new Date()
): string {
  // Handle string dates (from JSON/localStorage) and timestamps
  const d = date instanceof Date ? date : new Date(date)
  const diffMs = d.getTime() - now.getTime()
  const absDiffMs = Math.abs(diffMs)
  const isFuture = diffMs > 0

  const seconds = Math.floor(absDiffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  let value: number
  let unit: string

  if (days > 0) {
    value = days
    unit = days === 1 ? 'day' : 'days'
  } else if (hours > 0) {
    value = hours
    unit = hours === 1 ? 'hour' : 'hours'
  } else if (minutes > 0) {
    value = minutes
    unit = minutes === 1 ? 'minute' : 'minutes'
  } else {
    value = seconds
    unit = seconds === 1 ? 'second' : 'seconds'
  }

  return isFuture ? `in ${value} ${unit}` : `${value} ${unit} ago`
}

/**
 * Truncate a string to a maximum length with ellipsis
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length including ellipsis
 * @param ellipsis - Ellipsis string (default: "...")
 * @returns Truncated string
 *
 * @example
 * ```ts
 * truncate("Hello World", 8) // "Hello..."
 * truncate("Hi", 10) // "Hi"
 * truncate("Hello World", 8, "…") // "Hello W…"
 * ```
 */
export function truncate(
  str: string,
  maxLength: number,
  ellipsis = '...'
): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - ellipsis.length) + ellipsis
}

// =============================================================================
// Date and Time Formatting
// =============================================================================

/**
 * Date format presets for common use cases
 */
export type DateFormatPreset = 'short' | 'medium' | 'long' | 'full'

/**
 * Time format presets for common use cases
 */
export type TimeFormatPreset = 'short' | 'medium' | 'full'

/**
 * Format a date to a human-readable string
 *
 * @param date - Date to format (Date object or ISO string)
 * @param preset - Format preset or Intl.DateTimeFormatOptions
 * @param locale - Locale string (default: user's locale)
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatDate(new Date()) // "January 15, 2025" (medium, default)
 * formatDate(new Date(), 'short') // "1/15/25"
 * formatDate(new Date(), 'long') // "January 15, 2025"
 * formatDate(new Date(), 'full') // "Wednesday, January 15, 2025"
 * formatDate('2025-01-15T10:30:00Z') // Works with ISO strings
 * ```
 */
export function formatDate(
  date: Date | string,
  preset: DateFormatPreset | Intl.DateTimeFormatOptions = 'medium',
  locale?: string
): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (typeof preset === 'object') {
    return d.toLocaleDateString(locale, preset)
  }

  const options: Record<DateFormatPreset, Intl.DateTimeFormatOptions> = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'long', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  }

  return d.toLocaleDateString(locale, options[preset])
}

/**
 * Format a time to a human-readable string
 *
 * @param date - Date to format (Date object or ISO string)
 * @param preset - Format preset or Intl.DateTimeFormatOptions
 * @param locale - Locale string (default: user's locale)
 * @returns Formatted time string
 *
 * @example
 * ```ts
 * formatTime(new Date()) // "10:30 AM" (short, default)
 * formatTime(new Date(), 'medium') // "10:30:45 AM"
 * formatTime(new Date(), 'full') // "10:30:45.123"
 * formatTime(new Date(), { hour12: false }) // "10:30"
 * ```
 */
export function formatTime(
  date: Date | string,
  preset: TimeFormatPreset | Intl.DateTimeFormatOptions = 'short',
  locale?: string
): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (typeof preset === 'object') {
    return d.toLocaleTimeString(locale, preset)
  }

  // Note: fractionalSecondDigits is part of ES2021 Intl but not all TS libs include it
  const options: Record<TimeFormatPreset, Intl.DateTimeFormatOptions> = {
    short: { hour: 'numeric', minute: '2-digit' },
    medium: { hour: 'numeric', minute: '2-digit', second: '2-digit' },
    full: {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    } as Intl.DateTimeFormatOptions,
  }

  return d.toLocaleTimeString(locale, options[preset])
}

/**
 * Format a timestamp (date + time) to a human-readable string
 *
 * @param date - Date to format (Date object or ISO string)
 * @param options - Formatting options
 * @returns Formatted timestamp string
 *
 * @example
 * ```ts
 * formatTimestamp(new Date()) // "Jan 15, 2025, 10:30 AM"
 * formatTimestamp(new Date(), { datePreset: 'short' }) // "1/15/25, 10:30 AM"
 * formatTimestamp(new Date(), { timePreset: 'medium' }) // "Jan 15, 2025, 10:30:45 AM"
 * formatTimestamp(new Date(), { separator: ' at ' }) // "Jan 15, 2025 at 10:30 AM"
 * ```
 */
export function formatTimestamp(
  date: Date | string,
  options: {
    datePreset?: DateFormatPreset | Intl.DateTimeFormatOptions
    timePreset?: TimeFormatPreset | Intl.DateTimeFormatOptions
    separator?: string
    locale?: string
  } = {}
): string {
  const {
    datePreset = 'medium',
    timePreset = 'short',
    separator = ', ',
    locale,
  } = options

  const dateStr = formatDate(date, datePreset, locale)
  const timeStr = formatTime(date, timePreset, locale)

  return `${dateStr}${separator}${timeStr}`
}

/**
 * Get a friendly date separator label (Today, Yesterday, weekday, or date)
 *
 * @param date - Date to format
 * @param now - Reference date (defaults to current time)
 * @returns Friendly label string
 *
 * @example
 * ```ts
 * getDateSeparator(new Date()) // "Today"
 * getDateSeparator(new Date(Date.now() - 86400000)) // "Yesterday"
 * getDateSeparator(new Date(Date.now() - 2 * 86400000)) // "Tuesday" (weekday)
 * getDateSeparator(new Date(Date.now() - 10 * 86400000)) // "January 5, 2025"
 * ```
 */
export function getDateSeparator(date: Date | string, now = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const messageDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.floor(
    (today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) {
    return d.toLocaleDateString(undefined, { weekday: 'long' })
  }
  return formatDate(d, 'medium')
}

// =============================================================================
// Token Estimation
// =============================================================================

/**
 * Average characters per token for different languages/content types
 * English typically averages ~4 characters per token with most tokenizers
 */
export const CHARS_PER_TOKEN = {
  /** Default for English text */
  default: 4,
  /** English text (GPT-style tokenizers) */
  english: 4,
  /** Code tends to be more token-dense */
  code: 3.5,
  /** CJK (Chinese, Japanese, Korean) characters are often 1-2 tokens each */
  cjk: 1.5,
} as const

/**
 * Estimate the number of tokens in a text string
 *
 * Uses a simple heuristic of ~4 characters per token for English text.
 * This is a rough approximation - actual token counts vary by model and content.
 *
 * For accurate token counts, use the specific tokenizer for your model:
 * - OpenAI: tiktoken
 * - Anthropic: Claude's tokenizer
 * - Local: model-specific tokenizer
 *
 * @param text - Text to estimate tokens for
 * @param charsPerToken - Characters per token ratio (default: 4)
 * @returns Estimated token count
 *
 * @example
 * ```ts
 * estimateTokens("Hello, world!") // ~4 tokens
 * estimateTokens("This is a longer sentence with more words.") // ~11 tokens
 * estimateTokens(codeString, CHARS_PER_TOKEN.code) // More accurate for code
 * ```
 */
export function estimateTokens(text: string, charsPerToken = CHARS_PER_TOKEN.default): number {
  if (!text) return 0
  return Math.ceil(text.length / charsPerToken)
}

/**
 * Estimate tokens for a message or array of messages
 *
 * @param messages - Single message string or array of message objects with content
 * @param charsPerToken - Characters per token ratio (default: 4)
 * @returns Estimated total token count
 *
 * @example
 * ```ts
 * estimateMessageTokens([
 *   { role: 'user', content: 'Hello' },
 *   { role: 'assistant', content: 'Hi there!' }
 * ]) // ~5 tokens
 * ```
 */
export function estimateMessageTokens(
  messages: string | Array<{ content?: string; [key: string]: unknown }>,
  charsPerToken = CHARS_PER_TOKEN.default
): number {
  if (typeof messages === 'string') {
    return estimateTokens(messages, charsPerToken)
  }

  return messages.reduce((total, msg) => {
    const content = msg.content || ''
    return total + estimateTokens(content, charsPerToken)
  }, 0)
}
