/**
 * ToolCard Utilities
 *
 * Utility functions for ToolCard components
 * @packageDocumentation
 */

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

/**
 * Format JSON data for preview with max length
 */
export function formatPreview(data: unknown, maxLength = 50): string {
  if (data === null || data === undefined) return ''
  if (typeof data === 'string') {
    return data.length > maxLength ? data.slice(0, maxLength) + '...' : data
  }
  try {
    const str = JSON.stringify(data)
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
  } catch {
    return String(data)
  }
}
