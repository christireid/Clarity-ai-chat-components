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
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target

  const source = sources.shift()
  if (source === undefined) return target

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        target[key] = deepMerge(
          { ...targetValue } as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>]
      } else {
        target[key] = sourceValue as T[Extract<keyof T, string>]
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * Clamp a number between min and max
 * @deprecated Import from @clarity-chat/utils instead
 */
export { clamp } from '@clarity-chat/utils'

/**
 * Retry an async operation with exponential backoff
 * @deprecated Import retry from @clarity-chat/utils/async instead
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    baseDelay?: number
    maxDelay?: number
    shouldRetry?: (error: unknown) => boolean
  } = {}
): Promise<T> {
  const { retry: retryUtil } = await import('@clarity-chat/utils/async')
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    shouldRetry = () => true,
  } = options

  return retryUtil(fn, {
    retries: maxAttempts - 1, // retry() counts retries, not total attempts
    delay: baseDelay,
    backoffFactor: 2,
    maxDelay,
    shouldRetry: (error) => shouldRetry(error),
  })
}

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
