/**
 * Internal Helper Functions
 *
 * @internal
 * These utilities are for internal use only and are not part of the public API.
 *
 * IMPORTANT: Prefer importing from @clarity-chat/utils when possible.
 * This file contains only React-specific utilities or thin wrappers.
 */

// =============================================================================
// Re-exports from @clarity-chat/utils (canonical source)
// =============================================================================

// Async utilities
export {
  debounce,
  throttle,
  retry,
  sleep,
} from '@clarity-chat/utils'

// Format utilities
export {
  formatBytes,
  formatRelativeTime,
  truncate,
} from '@clarity-chat/utils'

// Cache utilities
export { memoize } from '@clarity-chat/utils'

// Math utilities
export { clamp, calculatePercentage } from '@clarity-chat/utils'

// Environment detection - re-export as computed constants for backward compatibility
import {
  isBrowser as _isBrowser,
  isServer as _isServer,
} from '@clarity-chat/utils'

/**
 * Check if code is running in a browser environment
 * @deprecated Use isBrowser() function from @clarity-chat/utils instead
 */
export const isBrowser = _isBrowser()

/**
 * Check if code is running in a server environment
 * @deprecated Use isServer() function from @clarity-chat/utils instead
 */
export const isServer = _isServer()

// ID generation - re-export with wrapper for backward compatibility
import {
  generateId as _generateId,
  generatePrefixedId,
} from '@clarity-chat/utils'

/**
 * Generate a unique ID (wrapper for backward compatibility with prefix support)
 */
export function generateId(prefix = ''): string {
  return prefix ? generatePrefixedId(prefix, '_') : _generateId()
}

// =============================================================================
// React-specific utilities (not in @clarity-chat/utils)
// =============================================================================

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
 * Alias for formatBytes - formats file size in human-readable format
 */
export { formatBytes as formatFileSize } from '@clarity-chat/utils'
