/**
 * Shared utilities for demo components
 * Centralizes common functionality to reduce duplication and ensure consistent behavior
 */

/**
 * Generate a unique ID with fallback for browsers without crypto.randomUUID
 * Uses crypto.randomUUID when available, falls back to timestamp + random string
 */
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Copy text to clipboard with fallback for older browsers
 * Uses modern Clipboard API with textarea fallback for execCommand
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves when copy is complete
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for browsers without Clipboard API or when permission denied
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      textarea.style.top = '-9999px'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    } catch {
      return false
    }
  }
}

/**
 * Sleep utility for async delays
 * @param ms - Milliseconds to sleep
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Estimate token count from text (rough approximation)
 * Uses ~4 characters per token as average
 * @param text - Text to estimate tokens for
 */
export const estimateTokens = (text: string): number =>
  Math.ceil(text.length / 4)

/**
 * Format a number as currency
 * @param amount - Amount to format
 * @param decimals - Number of decimal places
 */
export const formatCurrency = (amount: number, decimals = 4): string =>
  `$${amount.toFixed(decimals)}`

/**
 * Format a number with locale-aware separators
 * @param num - Number to format
 */
export const formatNumber = (num: number): string =>
  num.toLocaleString()

/**
 * Create a random variation within a range
 * @param base - Base value
 * @param variance - Maximum variance (positive or negative)
 */
export const randomVariance = (base: number, variance: number): number =>
  base + Math.floor(Math.random() * variance * 2 - variance)

/**
 * Clamp a number between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))
