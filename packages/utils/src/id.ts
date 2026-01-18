/**
 * ID Generation Utilities
 *
 * Centralized, consistent ID generation for use across all Clarity Chat packages.
 * Uses timestamp + random string for uniqueness without external dependencies.
 *
 * @module @clarity-chat/utils/id
 *
 * @example
 * ```ts
 * import { generateId, generatePrefixedId } from '@clarity-chat/utils/id'
 *
 * generateId() // "m5f3k2j1a_9h7g6d"
 * generatePrefixedId('msg') // "msg_m5f3k2j1a_9h7g6d"
 * generatePrefixedId('mem', '_') // "mem_m5f3k2j1a_9h7g6d"
 * ```
 */

/**
 * Default length for random portion of ID (characters after timestamp)
 */
const DEFAULT_RANDOM_LENGTH = 9

/**
 * Generate a unique ID using timestamp + random string
 *
 * Format: `{timestamp_base36}_{random_base36}`
 * Example: "m5f3k2j1a_9h7g6d4s3"
 *
 * @param randomLength - Length of random portion (default: 9)
 * @returns Unique ID string
 *
 * @example
 * ```ts
 * generateId() // "m5f3k2j1a_9h7g6d4s3"
 * generateId(6) // "m5f3k2j1a_9h7g6d"
 * ```
 */
export function generateId(randomLength = DEFAULT_RANDOM_LENGTH): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 2 + randomLength)
  return `${timestamp}_${random}`
}

/**
 * Generate a unique ID with a prefix
 *
 * Format: `{prefix}{separator}{timestamp_base36}_{random_base36}`
 * Example: "msg_m5f3k2j1a_9h7g6d4s3"
 *
 * @param prefix - Prefix to add to the ID
 * @param separator - Separator between prefix and ID (default: "_")
 * @param randomLength - Length of random portion (default: 9)
 * @returns Prefixed unique ID string
 *
 * @example
 * ```ts
 * generatePrefixedId('msg') // "msg_m5f3k2j1a_9h7g6d4s3"
 * generatePrefixedId('user', '-') // "user-m5f3k2j1a_9h7g6d4s3"
 * generatePrefixedId('mem', '_', 6) // "mem_m5f3k2j1a_9h7g6d"
 * ```
 */
export function generatePrefixedId(
  prefix: string,
  separator = '_',
  randomLength = DEFAULT_RANDOM_LENGTH
): string {
  return `${prefix}${separator}${generateId(randomLength)}`
}

/**
 * Generate a simple random ID without timestamp
 *
 * Useful when you don't need time-ordering or want shorter IDs.
 * Note: Less unique than generateId() - use generateId() for most cases.
 *
 * @param length - Length of the ID (default: 12)
 * @returns Random ID string
 *
 * @example
 * ```ts
 * generateSimpleId() // "9h7g6d4s3a2b"
 * generateSimpleId(8) // "9h7g6d4s"
 * ```
 */
export function generateSimpleId(length = 12): string {
  let result = ''
  while (result.length < length) {
    result += Math.random().toString(36).substring(2)
  }
  return result.substring(0, length)
}

/**
 * Check if a string looks like a generated ID
 *
 * Checks for the timestamp_random format. Useful for validation.
 *
 * @param id - String to check
 * @returns True if the string matches the ID format
 *
 * @example
 * ```ts
 * isGeneratedId('m5f3k2j1a_9h7g6d4s3') // true
 * isGeneratedId('msg_m5f3k2j1a_9h7g6d4s3') // true (with prefix)
 * isGeneratedId('hello') // false
 * ```
 */
export function isGeneratedId(id: string): boolean {
  // Matches: optional_prefix + base36_timestamp + _ + base36_random
  return /^([a-z0-9]+_)?[a-z0-9]+_[a-z0-9]+$/i.test(id)
}

/**
 * Extract timestamp from a generated ID
 *
 * @param id - Generated ID string
 * @returns Date object or null if invalid
 *
 * @example
 * ```ts
 * const id = generateId()
 * const date = extractTimestamp(id) // Date object
 *
 * extractTimestamp('invalid') // null
 * ```
 */
export function extractTimestamp(id: string): Date | null {
  // Handle prefixed IDs by getting the last two parts
  const parts = id.split('_')
  if (parts.length < 2) return null

  // Timestamp is second-to-last part (or first part if no prefix)
  const timestampPart = parts.length >= 2 ? parts[parts.length - 2] : parts[0]
  if (!timestampPart) return null

  try {
    const timestamp = parseInt(timestampPart, 36)
    if (isNaN(timestamp) || timestamp < 0) return null

    // Sanity check: timestamp should be a reasonable date
    const date = new Date(timestamp)
    const year = date.getFullYear()
    if (year < 2020 || year > 2100) return null

    return date
  } catch {
    return null
  }
}
