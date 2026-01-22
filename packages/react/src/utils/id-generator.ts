/**
 * ID Generation Utilities
 *
 * Centralized utilities for generating unique identifiers across the tool calling system.
 *
 * @module id-generator
 */

/**
 * Generates a unique tool call ID with timestamp and random component
 *
 * @param prefix - Prefix for the ID (e.g., 'call', 'exec', 'audit')
 * @returns Unique ID string in format: `{prefix}_{timestamp}_{random}`
 *
 * @example
 * ```typescript
 * const callId = generateToolCallId('call')
 * // => "call_1706123456789_a1b2c3d"
 *
 * const execId = generateToolCallId('exec')
 * // => "exec_1706123456790_x4y5z6w"
 * ```
 */
export function generateToolCallId(prefix: string = 'call'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `${prefix}_${timestamp}_${random}`
}

/**
 * Generates a session ID for tool execution contexts
 *
 * @returns Session ID string
 *
 * @example
 * ```typescript
 * const sessionId = generateSessionId()
 * // => "session_1706123456789_a1b2c3d"
 * ```
 */
export function generateSessionId(): string {
  return generateToolCallId('session')
}

/**
 * Generates a cache key for tool result caching
 *
 * @param toolName - Name of the tool
 * @param args - Tool arguments
 * @returns Cache key string
 *
 * @example
 * ```typescript
 * const key = generateCacheKey('weatherTool', { city: 'London' })
 * // => "weatherTool:city=London"
 * ```
 */
export function generateCacheKey(
  toolName: string,
  args: Record<string, unknown>
): string {
  // Sort keys for consistent cache keys
  const sortedKeys = Object.keys(args).sort()
  const argsStr = sortedKeys
    .map((key) => `${key}=${JSON.stringify(args[key])}`)
    .join(':')
  return `${toolName}:${argsStr}`
}

/**
 * Validates if a string is a valid tool call ID
 *
 * @param id - String to validate
 * @returns true if valid tool call ID format
 *
 * @example
 * ```typescript
 * isValidToolCallId('call_1706123456789_a1b2c3d') // => true
 * isValidToolCallId('invalid-id') // => false
 * ```
 */
export function isValidToolCallId(id: string): boolean {
  // Format: {prefix}_{timestamp}_{random}
  const pattern = /^[a-z]+_\d{13}_[a-z0-9]{7}$/
  return pattern.test(id)
}

/**
 * Extracts the prefix from a tool call ID
 *
 * @param id - Tool call ID
 * @returns Prefix string or null if invalid
 *
 * @example
 * ```typescript
 * extractPrefix('call_1706123456789_a1b2c3d') // => 'call'
 * extractPrefix('exec_1706123456790_x4y5z6w') // => 'exec'
 * extractPrefix('invalid-id') // => null
 * ```
 */
export function extractPrefix(id: string): string | null {
  const match = id.match(/^([a-z]+)_\d{13}_[a-z0-9]{7}$/)
  return match ? match[1] : null
}

/**
 * Extracts the timestamp from a tool call ID
 *
 * @param id - Tool call ID
 * @returns Timestamp in milliseconds or null if invalid
 *
 * @example
 * ```typescript
 * const timestamp = extractTimestamp('call_1706123456789_a1b2c3d')
 * // => 1706123456789
 * ```
 */
export function extractTimestamp(id: string): number | null {
  const match = id.match(/^[a-z]+_(\d{13})_[a-z0-9]{7}$/)
  return match ? parseInt(match[1], 10) : null
}
