/**
 * Shared formatting helpers for showcase demo pages.
 *
 * Centralizes common inline formatting patterns (`.toFixed()`, `Math.round()`,
 * division for K/M notation) that appear 20+ times across showcase pages.
 *
 * These are lightweight wrappers — for the full formatting API, see
 * `@clarity-chat/utils` (formatNumber, formatDuration, formatBytes, formatPercent).
 *
 * @module hooks/format-helpers
 */

/**
 * Format a number with K/M suffix for compact display.
 *
 * @example
 * ```ts
 * formatCompact(1500)    // "1.5K"
 * formatCompact(2500000) // "2.50M"
 * formatCompact(42)      // "42"
 * ```
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`
  }
  return String(Math.round(value))
}

/**
 * Format a percentage from a decimal ratio (0-1 → "80%").
 *
 * @example
 * ```ts
 * formatPercent(0.856)  // "86%"
 * formatPercent(0.856, 1) // "85.6%"
 * ```
 */
export function formatPercent(ratio: number, decimals = 0): string {
  return `${(ratio * 100).toFixed(decimals)}%`
}

/**
 * Format a dollar cost value.
 *
 * @example
 * ```ts
 * formatCost(0.0234) // "$0.0234"
 * formatCost(1.5)    // "$1.50"
 * ```
 */
export function formatCost(value: number, decimals = 4): string {
  return `$${value.toFixed(decimals)}`
}

/**
 * Format a duration from seconds.
 *
 * @example
 * ```ts
 * formatDurationSec(1.5) // "1.5s"
 * formatDurationSec(0.3) // "0.3s"
 * ```
 */
export function formatDurationSec(seconds: number, decimals = 1): string {
  return `${seconds.toFixed(decimals)}s`
}
