/**
 * Formatting utilities for Clarity Chat
 *
 * This module provides consistent formatting functions used across the codebase.
 * Import these instead of creating local copies.
 *
 * @module @clarity-chat/utils/format
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
 * @param decimals - Number of decimal places
 * @param isDecimal - If true, treats value as 0-1 range
 * @returns Formatted percentage string
 *
 * @example
 * ```ts
 * formatPercent(75.5) // "75.5%"
 * formatPercent(0.755, 1, true) // "75.5%"
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
