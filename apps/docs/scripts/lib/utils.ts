/**
 * Shared utilities for llms.txt generation scripts
 *
 * NOTE: formatBytes is duplicated across the codebase (9+ copies).
 * This is tracked as technical debt. When a shared @clarity-chat/utils
 * package is created, these functions should be imported from there.
 *
 * Existing implementations:
 * - packages/memory/src/utils/core.ts
 * - packages/dev-tools/src/performance/profiler.ts
 * - packages/react/src/components/performance-dashboard.tsx
 * - tools/scripts/analyze-bundle.js
 *
 * @see https://github.com/anthropics/claude-code/issues/XXX (tech debt tracking)
 */

/**
 * Format bytes to human-readable string
 *
 * @param bytes - Number of bytes
 * @returns Human-readable string (e.g., "1.5 KB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format a numeric delta with arrow indicator
 *
 * @param current - Current value
 * @param previous - Previous value to compare against
 * @param unit - Optional unit suffix
 * @returns Formatted string with delta indicator (e.g., "100 (↑ +10)")
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
 * Check if a directory exists
 *
 * @param path - Path to check
 * @returns Promise<boolean>
 */
export async function directoryExists(path: string): Promise<boolean> {
  const { access } = await import('fs/promises')
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}
