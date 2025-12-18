/**
 * Reset strategies for error boundaries
 *
 * Provides multiple ways to automatically reset error boundaries
 * based on different conditions.
 */

import { useEffect, useRef, useCallback, useState } from 'react'

export interface ResetStrategiesOptions {
  /** Reset when these keys change */
  resetKeys?: unknown[]
  /** Reset after this many milliseconds */
  resetAfterTimeout?: number
  /** Reset when network comes back online */
  resetOnNetworkRestore?: boolean
  /** Reset when visibility changes (tab becomes active) */
  resetOnVisibilityChange?: boolean
  /** Reset when specific events are dispatched */
  resetOnCustomEvent?: string
  /** Called when reset is triggered */
  onReset?: (reason: ResetReason) => void
}

export type ResetReason =
  | 'keys-changed'
  | 'timeout'
  | 'network-restored'
  | 'visibility-changed'
  | 'custom-event'
  | 'manual'

interface UseResetStrategiesReturn {
  /** Manually trigger a reset */
  reset: (reason?: ResetReason) => void
  /** Register that an error has occurred (starts timeout if configured) */
  registerError: () => void
  /** Clear error state (stops timeout) */
  clearError: () => void
}

/**
 * Hook providing multiple reset strategies for error boundaries
 *
 * @example
 * ```tsx
 * function MyErrorBoundary({ children }) {
 *   const { reset, registerError } = useResetStrategies({
 *     resetAfterTimeout: 30000,
 *     resetOnNetworkRestore: true,
 *     onReset: (reason) => console.debug('Reset:', reason),
 *   });
 *
 *   // Use with error boundary
 * }
 * ```
 */
export function useResetStrategies(
  options: ResetStrategiesOptions = {}
): UseResetStrategiesReturn {
  const {
    resetKeys,
    resetAfterTimeout,
    resetOnNetworkRestore,
    resetOnVisibilityChange,
    resetOnCustomEvent,
    onReset,
  } = options

  const hasError = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
  const prevKeysRef = useRef<unknown[] | undefined>(undefined)

  const reset = useCallback(
    (reason: ResetReason = 'manual') => {
      hasError.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
      onReset?.(reason)
    },
    [onReset]
  )

  const registerError = useCallback(() => {
    hasError.current = true

    // Start timeout if configured
    if (resetAfterTimeout && resetAfterTimeout > 0) {
      timeoutRef.current = setTimeout(() => {
        if (hasError.current) {
          reset('timeout')
        }
      }, resetAfterTimeout)
    }
  }, [resetAfterTimeout, reset])

  const clearError = useCallback(() => {
    hasError.current = false
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }, [])

  // Reset on keys change
  useEffect(() => {
    if (!resetKeys) return

    const prevKeys = prevKeysRef.current
    prevKeysRef.current = resetKeys

    if (!prevKeys) return

    // Check if any key changed
    const keysChanged =
      resetKeys.length !== prevKeys.length ||
      resetKeys.some((key, index) => !Object.is(key, prevKeys[index]))

    if (keysChanged && hasError.current) {
      reset('keys-changed')
    }
  }, [resetKeys, reset])

  // Reset on network restore
  useEffect(() => {
    if (!resetOnNetworkRestore) return

    const handleOnline = () => {
      if (hasError.current) {
        reset('network-restored')
      }
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [resetOnNetworkRestore, reset])

  // Reset on visibility change
  useEffect(() => {
    if (!resetOnVisibilityChange) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasError.current) {
        reset('visibility-changed')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [resetOnVisibilityChange, reset])

  // Reset on custom event
  useEffect(() => {
    if (!resetOnCustomEvent) return

    const handleCustomEvent = () => {
      if (hasError.current) {
        reset('custom-event')
      }
    }

    window.addEventListener(resetOnCustomEvent, handleCustomEvent)
    return () =>
      window.removeEventListener(resetOnCustomEvent, handleCustomEvent)
  }, [resetOnCustomEvent, reset])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    reset,
    registerError,
    clearError,
  }
}

/**
 * Dispatch a custom reset event
 *
 * Use this to trigger error boundary resets from anywhere in the app.
 *
 * @example
 * ```typescript
 * // In error boundary config:
 * useResetStrategies({ resetOnCustomEvent: 'app-reset' })
 *
 * // To trigger reset:
 * dispatchResetEvent('app-reset')
 * ```
 */
export function dispatchResetEvent(eventName: string): void {
  window.dispatchEvent(new CustomEvent(eventName))
}

/**
 * Hook to detect network status changes
 */
export function useNetworkStatus(): {
  isOnline: boolean
  wasOffline: boolean
} {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
    }

    const handleOnline = () => {
      setIsOnline(true)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  return {
    isOnline,
    wasOffline,
  }
}

/**
 * Hook to trigger action on route change (framework-agnostic)
 *
 * Works by listening for popstate events and optionally
 * a custom route change event.
 */
export function useRouteChangeReset(
  onRouteChange: () => void,
  customEventName?: string
): void {
  useEffect(() => {
    const handlePopState = () => {
      onRouteChange()
    }

    window.addEventListener('popstate', handlePopState)

    // Also listen for custom route change events (from routers like Next.js)
    if (customEventName) {
      window.addEventListener(customEventName, handlePopState)
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
      if (customEventName) {
        window.removeEventListener(customEventName, handlePopState)
      }
    }
  }, [onRouteChange, customEventName])
}
