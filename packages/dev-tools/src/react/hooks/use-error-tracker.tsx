/**
 * React hook for Error Tracking and Recovery
 *
 * Automatically categorizes errors, tracks recovery attempts, and provides
 * actionable recommendations for error resolution.
 *
 * @module useErrorTracker
 *
 * @example
 * ```tsx
 * import { useErrorTracker } from '@clarity-chat/dev-tools'
 *
 * function DataFetcher() {
 *   const { track, errors, withErrorTracking, getRecommendations } = useErrorTracker({
 *     component: 'DataFetcher',
 *     autoTrack: true,
 *     onError: (event) => analytics.track('error', event)
 *   })
 *
 *   const fetchData = () => withErrorTracking(async () => {
 *     const response = await fetch('/api/data')
 *     if (!response.ok) throw new Error('Fetch failed')
 *     return response.json()
 *   })
 *
 *   return <div>{errors.length} errors tracked</div>
 * }
 * ```
 */

'use client'

import * as React from 'react'
import {
  getErrorTracker,
  createErrorTracker,
  type ErrorTracker,
  type ErrorEvent,
  type ErrorCategory,
  type ErrorSeverity,
  type RecoveryAttempt,
  type ErrorStats,
} from '../../debug/error-tracker'

export interface UseErrorTrackerOptions {
  enabled?: boolean
  component?: string
  autoTrack?: boolean
  onError?: (event: ErrorEvent) => void
}

export interface UseErrorTrackerReturn {
  stats: ErrorStats
  errors: ErrorEvent[]
  activeErrors: ErrorEvent[]
  track: (
    error: Error,
    options?: {
      severity?: ErrorSeverity
      category?: ErrorCategory
      context?: Record<string, unknown>
    }
  ) => ErrorEvent
  trackRecovery: (
    eventId: string,
    options: {
      strategy: string
      successful: boolean
      duration: number
      error?: string
    }
  ) => RecoveryAttempt | null
  resolve: (eventId: string) => boolean
  getRecommendations: () => string[]
  clear: () => void
  withErrorTracking: <T>(
    fn: () => Promise<T>,
    options?: {
      recoveryStrategy?: string
      onError?: (error: Error) => void
    }
  ) => Promise<T>
}

/**
 * Hook to track errors and recovery
 */
export function useErrorTracker(
  options: UseErrorTrackerOptions = {}
): UseErrorTrackerReturn {
  const {
    enabled = process.env.NODE_ENV === 'development',
    component,
    autoTrack = true,
    onError,
  } = options

  const tracker = React.useMemo(() => {
    return getErrorTracker()
  }, [])

  const [stats, setStats] = React.useState<ErrorStats>(() => tracker.getStats())
  const [errors, setErrors] = React.useState<ErrorEvent[]>([])

  // Subscribe to error events
  React.useEffect(() => {
    if (!enabled) return

    const unsubscribe = tracker.addListener((event) => {
      setStats(tracker.getStats())
      setErrors(tracker.getErrors())
      onError?.(event)
    })

    // Initial load
    setStats(tracker.getStats())
    setErrors(tracker.getErrors())

    return unsubscribe
  }, [tracker, enabled, onError])

  // Auto-track global errors
  React.useEffect(() => {
    if (!enabled || !autoTrack) return undefined

    const handleError = (event: ErrorEvent) => {
      tracker.track({
        error:
          event.error instanceof Error
            ? event.error
            : new Error(String(event.error)),
        component,
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      tracker.track({
        error:
          event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason)),
        component,
        category: 'unknown',
      })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('error', handleError as unknown as EventListener)
      window.addEventListener('unhandledrejection', handleUnhandledRejection)

      return () => {
        window.removeEventListener(
          'error',
          handleError as unknown as EventListener
        )
        window.removeEventListener(
          'unhandledrejection',
          handleUnhandledRejection
        )
      }
    }

    return undefined
  }, [enabled, autoTrack, component, tracker])

  const track = React.useCallback(
    (
      error: Error,
      trackOptions?: {
        severity?: ErrorSeverity
        category?: ErrorCategory
        context?: Record<string, unknown>
      }
    ) => {
      return tracker.track({
        error,
        component,
        ...trackOptions,
      })
    },
    [tracker, component]
  )

  const trackRecovery = React.useCallback(
    (
      eventId: string,
      recoveryOptions: {
        strategy: string
        successful: boolean
        duration: number
        error?: string
      }
    ) => {
      const result = tracker.trackRecovery(eventId, recoveryOptions)
      setStats(tracker.getStats())
      setErrors(tracker.getErrors())
      return result
    },
    [tracker]
  )

  const resolve = React.useCallback(
    (eventId: string) => {
      const result = tracker.resolve(eventId)
      setStats(tracker.getStats())
      setErrors(tracker.getErrors())
      return result
    },
    [tracker]
  )

  const getRecommendations = React.useCallback(() => {
    return tracker.getRecommendations()
  }, [tracker])

  const clear = React.useCallback(() => {
    tracker.clear()
    setStats(tracker.getStats())
    setErrors([])
  }, [tracker])

  const withErrorTracking = React.useCallback(
    async <T,>(
      fn: () => Promise<T>,
      trackingOptions?: {
        recoveryStrategy?: string
        onError?: (error: Error) => void
      }
    ): Promise<T> => {
      const startTime = performance.now()
      let event: ErrorEvent | null = null

      try {
        return await fn()
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        event = track(err)
        trackingOptions?.onError?.(err)
        throw error
      } finally {
        if (event && trackingOptions?.recoveryStrategy) {
          const duration = performance.now() - startTime
          trackRecovery(event.id, {
            strategy: trackingOptions.recoveryStrategy,
            successful: !event,
            duration,
          })
        }
      }
    },
    [track, trackRecovery]
  )

  const activeErrors = React.useMemo(() => {
    return errors.filter((e) => !e.resolved)
  }, [errors])

  return {
    stats,
    errors,
    activeErrors,
    track,
    trackRecovery,
    resolve,
    getRecommendations,
    clear,
    withErrorTracking,
  }
}

/**
 * Error boundary hook (renamed to avoid conflict with @clarity-chat/error-handling)
 */
export function useErrorTrackerBoundary(options?: UseErrorTrackerOptions) {
  const [error, setError] = React.useState<Error | null>(null)
  const tracker = useErrorTracker(options)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback(
    (err: Error) => {
      setError(err)
      tracker.track(err)
    },
    [tracker]
  )

  return {
    error,
    resetError,
    captureError,
    ...tracker,
  }
}

export default useErrorTracker
