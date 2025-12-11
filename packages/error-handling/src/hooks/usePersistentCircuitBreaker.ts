/**
 * Persistent circuit breaker state management
 *
 * Survives page refreshes and component remounts using localStorage
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export type CircuitState = 'closed' | 'open' | 'half-open'

interface PersistedCircuitState {
  state: CircuitState
  openedAt: number | null
  failureCount: number
  lastFailureAt: number | null
}

interface UsePersistentCircuitBreakerOptions {
  /** Unique key for localStorage persistence */
  persistKey: string
  /** Number of failures before circuit opens */
  threshold?: number
  /** Time in ms before circuit transitions to half-open */
  resetTime?: number
  /** Called when circuit state changes */
  onStateChange?: (state: CircuitState, prevState: CircuitState) => void
  /** Disable persistence (use in-memory only) */
  disablePersistence?: boolean
}

interface UsePersistentCircuitBreakerReturn {
  /** Current circuit state */
  state: CircuitState
  /** Number of consecutive failures */
  failureCount: number
  /** Whether requests should be allowed */
  canRequest: boolean
  /** Record a failure */
  recordFailure: () => void
  /** Record a success (resets failure count) */
  recordSuccess: () => void
  /** Manually reset the circuit */
  reset: () => void
  /** Time remaining until reset (ms), or null if not open */
  timeUntilReset: number | null
}

const STORAGE_PREFIX = 'circuit-breaker-'

function getStorageKey(persistKey: string): string {
  return `${STORAGE_PREFIX}${persistKey}`
}

function loadPersistedState(persistKey: string): PersistedCircuitState | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(getStorageKey(persistKey))
    if (!stored) return null

    const parsed = JSON.parse(stored) as PersistedCircuitState
    return parsed
  } catch {
    return null
  }
}

function savePersistedState(
  persistKey: string,
  state: PersistedCircuitState
): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(getStorageKey(persistKey), JSON.stringify(state))
  } catch {
    // Storage full or not available
  }
}

function clearPersistedState(persistKey: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(getStorageKey(persistKey))
  } catch {
    // Ignore
  }
}

/**
 * Hook for persistent circuit breaker state
 *
 * Circuit breaker pattern that persists across page refreshes.
 * Useful for rate limiting where the provider's reset time
 * exceeds a typical user session.
 *
 * @example
 * ```tsx
 * const { state, canRequest, recordFailure, recordSuccess } =
 *   usePersistentCircuitBreaker({
 *     persistKey: 'openai-chat',
 *     threshold: 5,
 *     resetTime: 60000,
 *   });
 *
 * if (!canRequest) {
 *   return <RateLimitMessage timeUntilReset={timeUntilReset} />;
 * }
 *
 * try {
 *   await sendMessage();
 *   recordSuccess();
 * } catch (error) {
 *   recordFailure();
 * }
 * ```
 */
export function usePersistentCircuitBreaker({
  persistKey,
  threshold = 5,
  resetTime = 30000,
  onStateChange,
  disablePersistence = false,
}: UsePersistentCircuitBreakerOptions): UsePersistentCircuitBreakerReturn {
  const [internalState, setInternalState] = useState<PersistedCircuitState>(
    () => {
      if (disablePersistence) {
        return {
          state: 'closed',
          openedAt: null,
          failureCount: 0,
          lastFailureAt: null,
        }
      }

      const persisted = loadPersistedState(persistKey)
      if (persisted) {
        // Check if we should transition from open to half-open
        if (
          persisted.state === 'open' &&
          persisted.openedAt &&
          Date.now() - persisted.openedAt >= resetTime
        ) {
          return { ...persisted, state: 'half-open' }
        }
        return persisted
      }

      return {
        state: 'closed',
        openedAt: null,
        failureCount: 0,
        lastFailureAt: null,
      }
    }
  )

  const [timeUntilReset, setTimeUntilReset] = useState<number | null>(null)
  const prevStateRef = useRef(internalState.state)

  // Persist state changes
  useEffect(() => {
    if (!disablePersistence) {
      savePersistedState(persistKey, internalState)
    }
  }, [persistKey, internalState, disablePersistence])

  // Handle state change callback
  useEffect(() => {
    if (internalState.state !== prevStateRef.current) {
      onStateChange?.(internalState.state, prevStateRef.current)
      prevStateRef.current = internalState.state
    }
  }, [internalState.state, onStateChange])

  // Timer for half-open transition
  useEffect(() => {
    if (internalState.state !== 'open' || !internalState.openedAt) {
      setTimeUntilReset(null)
      return
    }

    const updateTimeUntilReset = () => {
      const elapsed = Date.now() - (internalState.openedAt || 0)
      const remaining = Math.max(0, resetTime - elapsed)

      if (remaining === 0) {
        setInternalState((prev) => ({
          ...prev,
          state: 'half-open',
        }))
        setTimeUntilReset(null)
      } else {
        setTimeUntilReset(remaining)
      }
    }

    updateTimeUntilReset()
    const interval = setInterval(updateTimeUntilReset, 1000)

    return () => clearInterval(interval)
  }, [internalState.state, internalState.openedAt, resetTime])

  const recordFailure = useCallback(() => {
    setInternalState((prev) => {
      const newFailureCount = prev.failureCount + 1
      const now = Date.now()

      if (prev.state === 'half-open') {
        // Any failure in half-open reopens the circuit
        return {
          state: 'open',
          openedAt: now,
          failureCount: newFailureCount,
          lastFailureAt: now,
        }
      }

      if (prev.state === 'closed' && newFailureCount >= threshold) {
        // Threshold exceeded, open circuit
        return {
          state: 'open',
          openedAt: now,
          failureCount: newFailureCount,
          lastFailureAt: now,
        }
      }

      return {
        ...prev,
        failureCount: newFailureCount,
        lastFailureAt: now,
      }
    })
  }, [threshold])

  const recordSuccess = useCallback(() => {
    setInternalState((prev) => {
      if (prev.state === 'half-open') {
        // Success in half-open closes the circuit
        return {
          state: 'closed',
          openedAt: null,
          failureCount: 0,
          lastFailureAt: null,
        }
      }

      if (prev.state === 'closed') {
        // Reset failure count on success
        return {
          ...prev,
          failureCount: 0,
        }
      }

      return prev
    })
  }, [])

  const reset = useCallback(() => {
    setInternalState({
      state: 'closed',
      openedAt: null,
      failureCount: 0,
      lastFailureAt: null,
    })
    if (!disablePersistence) {
      clearPersistedState(persistKey)
    }
  }, [persistKey, disablePersistence])

  const canRequest = internalState.state !== 'open'

  return {
    state: internalState.state,
    failureCount: internalState.failureCount,
    canRequest,
    recordFailure,
    recordSuccess,
    reset,
    timeUntilReset,
  }
}

/**
 * Clean up stale circuit breaker entries from localStorage
 *
 * Call this on app startup to remove entries older than maxAge
 */
export function cleanupStaleCircuitBreakers(maxAgeMs: number = 86400000): void {
  if (typeof window === 'undefined') return

  try {
    const keysToRemove: string[] = []
    const now = Date.now()

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith(STORAGE_PREFIX)) continue

      try {
        const value = localStorage.getItem(key)
        if (!value) continue

        const parsed = JSON.parse(value) as PersistedCircuitState
        const lastActivity = parsed.lastFailureAt || parsed.openedAt || 0

        if (now - lastActivity > maxAgeMs) {
          keysToRemove.push(key)
        }
      } catch {
        // Invalid entry, remove it
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch {
    // Storage not available
  }
}
