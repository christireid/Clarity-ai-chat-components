/**
 * ID Generation Utilities
 *
 * Centralized utilities for generating unique identifiers across all packages.
 * Uses timestamp + random string for collision resistance.
 *
 * @module id
 */

/**
 * Generate a unique ID with optional prefix
 *
 * @param prefix - Optional prefix for the ID (e.g., 'msg', 'session', 'batch')
 * @returns Unique ID string in format: `{prefix}_{timestamp}_{random}` or `{timestamp}_{random}` if no prefix
 *
 * @example
 * ```typescript
 * const id = generateId()
 * // => "1706123456789_a1b2c3d4e"
 *
 * const msgId = generateId('msg')
 * // => "msg_1706123456789_a1b2c3d4e"
 *
 * const sessionId = generateId('session')
 * // => "session_1706123456789_a1b2c3d4e"
 * ```
 */
export function generateId(prefix = ''): string {
  const random = Math.random().toString(36).substring(2, 11)
  const timestamp = Date.now().toString(36)
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`
}

/**
 * Generate a unique message ID
 *
 * @returns Message ID string in format: `msg_{timestamp}_{random}`
 *
 * @example
 * ```typescript
 * const msgId = generateMessageId()
 * // => "msg_1706123456789_a1b2c3d4e"
 * ```
 */
export function generateMessageId(): string {
  return generateId('msg')
}

/**
 * Generate a unique session ID
 *
 * @returns Session ID string in format: `session_{timestamp}_{random}`
 *
 * @example
 * ```typescript
 * const sessionId = generateSessionId()
 * // => "session_1706123456789_a1b2c3d4e"
 * ```
 */
export function generateSessionId(): string {
  return generateId('session')
}

/**
 * Generate a unique batch ID
 *
 * @returns Batch ID string in format: `batch_{timestamp}_{random}`
 *
 * @example
 * ```typescript
 * const batchId = generateBatchId()
 * // => "batch_1706123456789_a1b2c3d4e"
 * ```
 */
export function generateBatchId(): string {
  return generateId('batch')
}
