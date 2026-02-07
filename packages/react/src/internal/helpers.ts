/**
 * Internal Helper Functions
 *
 * @internal
 * These utilities are for internal use only and are not part of the public API.
 * They provide common functionality used across the library.
 */

/**
 * Generate a unique ID
 * Re-exported from @clarity-chat/utils for backward compatibility
 */
export { generateId } from '@clarity-chat/utils'

/**
 * Sleep for a given number of milliseconds
 * Re-exported from @clarity-chat/utils for backward compatibility
 */
export { sleep } from '@clarity-chat/utils/async'

/**
 * Truncate a string to a maximum length with ellipsis
 * Re-exported from @clarity-chat/utils for backward compatibility
 */
export { truncate } from '@clarity-chat/utils/format'

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T
  }

  const cloned = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }

  return cloned
}

/**
 * Deep merge objects
 * Re-exported from @clarity-chat/utils for backward compatibility
 */
export { deepMerge } from '@clarity-chat/utils'

/**
 * Clamp a number between min and max
 * @deprecated Import from @clarity-chat/utils instead
 */
export { clamp } from '@clarity-chat/utils'

// NOTE: retry() has been removed from this file.
// Import retry from @clarity-chat/utils/async or use retryWithBackoff from @clarity-chat/react/utils/resilience/retry-with-backoff

/**
 * Format bytes to human-readable string
 * @deprecated Import from @clarity-chat/utils/format instead
 */
import { formatBytes as formatBytesUtil } from '@clarity-chat/utils/format'
export { formatBytes } from '@clarity-chat/utils/format'

/**
 * Create a cancellable promise
 */
export function cancellable<T>(promise: Promise<T>): {
  promise: Promise<T>
  cancel: () => void
} {
  let isCancelled = false

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise.then(
      (value) => {
        if (!isCancelled) {
          resolve(value)
        }
      },
      (error) => {
        if (!isCancelled) {
          reject(error)
        }
      }
    )
  })

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCancelled = true
    },
  }
}

/**
 * Check if code is running in a browser environment
 * @deprecated Import from @clarity-chat/utils/env instead
 */
export { isBrowser } from '@clarity-chat/utils/env'

/**
 * Check if code is running in a server environment
 * @deprecated Import from @clarity-chat/utils/env instead
 */
export { isServer } from '@clarity-chat/utils/env'

/**
 * Format a date/timestamp as relative time (e.g., "2h ago", "Just now")
 * Re-exported from @clarity-chat/utils/format for backward compatibility
 */
export { formatRelativeTime } from '@clarity-chat/utils/format'

/**
 * Alias for formatBytes - formats file size in human-readable format
 */
export const formatFileSize = formatBytesUtil

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}
