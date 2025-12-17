/**
 * useRequestDeduplication - React Hook for Request Deduplication
 *
 * Prevents duplicate API requests from double-clicks, StrictMode re-renders,
 * or rapid user interactions.
 *
 * @example
 * ```tsx
 * const { execute, isPending, stats } = useRequestDeduplication({
 *   debounceMs: 300,
 *   onDedupe: () => console.log('Duplicate request blocked'),
 * })
 *
 * const handleSubmit = async () => {
 *   try {
 *     const result = await execute('submit-form', () => submitForm(data))
 *     toast.success('Submitted!')
 *   } catch (error) {
 *     if (isDebouncedError(error)) {
 *       // Request was debounced, ignore
 *       return
 *     }
 *     toast.console.error('Failed to submit')
 *   }
 * }
 * ```
 */

'use client'

import * as React from 'react'
import {
  RequestDeduplicator,
  DebouncedError,
  isDebouncedError,
  createMessageKey,
  type DeduplicationOptions,
  type DeduplicationStats,
} from '../../utils/api/request-deduplication'

export interface UseRequestDeduplicationOptions extends DeduplicationOptions {}

export interface UseRequestDeduplicationReturn {
  /** Execute a request with deduplication */
  execute: <T>(key: string, fn: () => Promise<T>) => Promise<T>
  /** Execute with debounce (waits for debounce window) */
  executeDebounced: <T>(key: string, fn: () => Promise<T>) => Promise<T>
  /** Check if a request is pending */
  isPending: (key: string) => boolean
  /** Cancel a pending debounced request */
  cancelDebounced: (key: string) => boolean
  /** Get current statistics */
  stats: DeduplicationStats
  /** Clear all pending state */
  clear: () => void
  /** The underlying deduplicator instance */
  deduplicator: RequestDeduplicator
}

/**
 * React hook for request deduplication
 *
 * Automatically handles cleanup on unmount and provides React-friendly API.
 *
 * @param options - Deduplication configuration
 * @returns Deduplication controls and state
 */
export function useRequestDeduplication(
  options: UseRequestDeduplicationOptions = {}
): UseRequestDeduplicationReturn {
  const [stats, setStats] = React.useState<DeduplicationStats>({
    totalRequests: 0,
    deduplicatedRequests: 0,
    pendingCount: 0,
  })

  // Create deduplicator with stats tracking
  const deduplicatorRef = React.useRef<RequestDeduplicator | null>(null)

  if (!deduplicatorRef.current) {
    deduplicatorRef.current = new RequestDeduplicator({
      ...options,
      onDedupe: (key) => {
        options.onDedupe?.(key)
        // Update stats on dedupe
        setStats(deduplicatorRef.current!.getStats())
      },
    })
  }

  const deduplicator = deduplicatorRef.current

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      deduplicatorRef.current?.destroy()
    }
  }, [])

  // Update stats helper
  const updateStats = React.useCallback(() => {
    setStats(deduplicator.getStats())
  }, [deduplicator])

  // Execute with stats update
  const execute = React.useCallback(
    async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
      try {
        const result = await deduplicator.execute(key, fn)
        updateStats()
        return result
      } catch (error) {
        updateStats()
        throw error
      }
    },
    [deduplicator, updateStats]
  )

  // Execute debounced with stats update
  const executeDebounced = React.useCallback(
    async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
      try {
        const result = await deduplicator.executeDebounced(key, fn)
        updateStats()
        return result
      } catch (error) {
        updateStats()
        throw error
      }
    },
    [deduplicator, updateStats]
  )

  // isPending
  const isPending = React.useCallback(
    (key: string) => deduplicator.isPending(key),
    [deduplicator]
  )

  // cancelDebounced
  const cancelDebounced = React.useCallback(
    (key: string) => {
      const result = deduplicator.cancelDebounced(key)
      updateStats()
      return result
    },
    [deduplicator, updateStats]
  )

  // clear
  const clear = React.useCallback(() => {
    deduplicator.clear()
    updateStats()
  }, [deduplicator, updateStats])

  return {
    execute,
    executeDebounced,
    isPending,
    cancelDebounced,
    stats,
    clear,
    deduplicator,
  }
}

// Re-export types and utilities for convenience
export { DebouncedError, isDebouncedError, createMessageKey }
export type { DeduplicationOptions, DeduplicationStats }
