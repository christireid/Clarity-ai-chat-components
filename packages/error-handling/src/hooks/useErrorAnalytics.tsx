'use client'


import * as React from 'react'
import { isClarityError } from '../errors/base-error'

/**
 * Error analytics entry
 */
export interface ErrorAnalyticsEntry {
  timestamp: string
  errorType: string
  errorCode?: string
  message: string
  recoverable: boolean
  provider?: string
  retryCount: number
  recovered: boolean
  timeToRecovery?: number
}

/**
 * Aggregated error statistics
 */
export interface ErrorStats {
  totalErrors: number
  errorsByType: Record<string, number>
  errorsByCode: Record<string, number>
  retryAttempts: number
  retrySuccesses: number
  retrySuccessRate: number
  circuitBreakerTrips: number
  meanTimeToRecovery: number | null
  errorsPerMinute: number
}

/**
 * Analytics callbacks for external integration
 */
export interface ErrorAnalyticsCallbacks {
  onErrorRecorded?: (entry: ErrorAnalyticsEntry) => void
  onRetryAttempt?: (errorType: string, attempt: number) => void
  onRetrySuccess?: (
    errorType: string,
    attempts: number,
    durationMs: number
  ) => void
  onRetryFailure?: (errorType: string, attempts: number) => void
  onCircuitTrip?: (errorType: string, failureCount: number) => void
  onCircuitReset?: (errorType: string) => void
}

/**
 * Error analytics context value
 */
interface ErrorAnalyticsContextValue {
  /** Record a new error */
  recordError: (error: Error, context?: Record<string, unknown>) => void
  /** Record a retry attempt */
  recordRetryAttempt: (errorType: string, attempt: number) => void
  /** Record a successful retry */
  recordRetrySuccess: (
    errorType: string,
    attempts: number,
    durationMs: number
  ) => void
  /** Record a failed retry (max retries exceeded) */
  recordRetryFailure: (errorType: string, attempts: number) => void
  /** Record circuit breaker trip */
  recordCircuitTrip: (errorType: string, failureCount: number) => void
  /** Record circuit breaker reset */
  recordCircuitReset: (errorType: string) => void
  /** Get current statistics */
  getStats: () => ErrorStats
  /** Get error history */
  getHistory: () => ErrorAnalyticsEntry[]
  /** Clear all analytics data */
  clear: () => void
  /** Export data for dashboards */
  exportData: () => {
    stats: ErrorStats
    history: ErrorAnalyticsEntry[]
    exportedAt: string
  }
}

const ErrorAnalyticsContext =
  React.createContext<ErrorAnalyticsContextValue | null>(null)

export interface ErrorAnalyticsProviderProps {
  children: React.ReactNode
  /** Maximum history entries to keep */
  maxHistorySize?: number
  /** Callbacks for external integration */
  callbacks?: ErrorAnalyticsCallbacks
  /** Enable console logging of analytics events */
  enableLogging?: boolean
}

/**
 * Provider for error analytics throughout the app
 *
 * @example
 * ```tsx
 * <ErrorAnalyticsProvider
 *   callbacks={{
 *     onErrorRecorded: (entry) => sendToAnalytics(entry),
 *     onCircuitTrip: (type, count) => alertOps(type, count),
 *   }}
 * >
 *   <App />
 * </ErrorAnalyticsProvider>
 * ```
 */
export function ErrorAnalyticsProvider({
  children,
  maxHistorySize = 100,
  callbacks,
  enableLogging = false,
}: ErrorAnalyticsProviderProps) {
  const historyRef = React.useRef<ErrorAnalyticsEntry[]>([])
  const statsRef = React.useRef<{
    errorsByType: Record<string, number>
    errorsByCode: Record<string, number>
    retryAttempts: number
    retrySuccesses: number
    circuitTrips: number
    recoveryTimes: number[]
    errorTimestamps: number[]
  }>({
    errorsByType: {},
    errorsByCode: {},
    retryAttempts: 0,
    retrySuccesses: 0,
    circuitTrips: 0,
    recoveryTimes: [],
    errorTimestamps: [],
  })

  const log = React.useCallback(
    (message: string, data?: unknown) => {
      if (enableLogging) {
        logger.debug(`[ErrorAnalytics] ${message}`, data)
      }
    },
    [enableLogging]
  )

  const recordError = React.useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      const isClarity = isClarityError(error)
      const entry: ErrorAnalyticsEntry = {
        timestamp: new Date().toISOString(),
        errorType: error.name,
        errorCode: isClarity ? error.code : undefined,
        message: error.message,
        recoverable: isClarity ? error.recoverable : true,
        provider: context?.['provider'] as string | undefined,
        retryCount: 0,
        recovered: false,
      }

      // Add to history
      historyRef.current.unshift(entry)
      if (historyRef.current.length > maxHistorySize) {
        historyRef.current.pop()
      }

      // Update stats
      const stats = statsRef.current
      stats.errorsByType[error.name] = (stats.errorsByType[error.name] || 0) + 1
      if (entry.errorCode) {
        stats.errorsByCode[entry.errorCode] =
          (stats.errorsByCode[entry.errorCode] || 0) + 1
      }
      stats.errorTimestamps.push(Date.now())

      // Cleanup old timestamps (keep last minute)
      const oneMinuteAgo = Date.now() - 60000
      stats.errorTimestamps = stats.errorTimestamps.filter(
        (t) => t > oneMinuteAgo
      )

      log('Error recorded', entry)
      callbacks?.onErrorRecorded?.(entry)
    },
    [maxHistorySize, callbacks, log]
  )

  const recordRetryAttempt = React.useCallback(
    (errorType: string, attempt: number) => {
      statsRef.current.retryAttempts++
      log('Retry attempt', { errorType, attempt })
      callbacks?.onRetryAttempt?.(errorType, attempt)
    },
    [callbacks, log]
  )

  const recordRetrySuccess = React.useCallback(
    (errorType: string, attempts: number, durationMs: number) => {
      statsRef.current.retrySuccesses++
      statsRef.current.recoveryTimes.push(durationMs)

      // Keep last 100 recovery times
      if (statsRef.current.recoveryTimes.length > 100) {
        statsRef.current.recoveryTimes.shift()
      }

      // Update most recent error entry as recovered
      const recentError = historyRef.current.find(
        (e) => e.errorType === errorType && !e.recovered
      )
      if (recentError) {
        recentError.recovered = true
        recentError.timeToRecovery = durationMs
        recentError.retryCount = attempts
      }

      log('Retry success', { errorType, attempts, durationMs })
      callbacks?.onRetrySuccess?.(errorType, attempts, durationMs)
    },
    [callbacks, log]
  )

  const recordRetryFailure = React.useCallback(
    (errorType: string, attempts: number) => {
      log('Retry failure', { errorType, attempts })
      callbacks?.onRetryFailure?.(errorType, attempts)
    },
    [callbacks, log]
  )

  const recordCircuitTrip = React.useCallback(
    (errorType: string, failureCount: number) => {
      statsRef.current.circuitTrips++
      log('Circuit breaker tripped', { errorType, failureCount })
      callbacks?.onCircuitTrip?.(errorType, failureCount)
    },
    [callbacks, log]
  )

  const recordCircuitReset = React.useCallback(
    (errorType: string) => {
      log('Circuit breaker reset', { errorType })
      callbacks?.onCircuitReset?.(errorType)
    },
    [callbacks, log]
  )

  const getStats = React.useCallback((): ErrorStats => {
    const stats = statsRef.current
    const history = historyRef.current

    const retrySuccessRate =
      stats.retryAttempts > 0
        ? (stats.retrySuccesses / stats.retryAttempts) * 100
        : 0

    const meanTimeToRecovery =
      stats.recoveryTimes.length > 0
        ? stats.recoveryTimes.reduce((a, b) => a + b, 0) /
          stats.recoveryTimes.length
        : null

    return {
      totalErrors: history.length,
      errorsByType: { ...stats.errorsByType },
      errorsByCode: { ...stats.errorsByCode },
      retryAttempts: stats.retryAttempts,
      retrySuccesses: stats.retrySuccesses,
      retrySuccessRate,
      circuitBreakerTrips: stats.circuitTrips,
      meanTimeToRecovery,
      errorsPerMinute: stats.errorTimestamps.length,
    }
  }, [])

  const getHistory = React.useCallback(() => [...historyRef.current], [])

  const clear = React.useCallback(() => {
    historyRef.current = []
    statsRef.current = {
      errorsByType: {},
      errorsByCode: {},
      retryAttempts: 0,
      retrySuccesses: 0,
      circuitTrips: 0,
      recoveryTimes: [],
      errorTimestamps: [],
    }
    log('Analytics cleared')
  }, [log])

  const exportData = React.useCallback(() => {
    return {
      stats: getStats(),
      history: getHistory(),
      exportedAt: new Date().toISOString(),
    }
  }, [getStats, getHistory])

  const value = React.useMemo(
    () => ({
      recordError,
      recordRetryAttempt,
      recordRetrySuccess,
      recordRetryFailure,
      recordCircuitTrip,
      recordCircuitReset,
      getStats,
      getHistory,
      clear,
      exportData,
    }),
    [
      recordError,
      recordRetryAttempt,
      recordRetrySuccess,
      recordRetryFailure,
      recordCircuitTrip,
      recordCircuitReset,
      getStats,
      getHistory,
      clear,
      exportData,
    ]
  )

  return (
    <ErrorAnalyticsContext.Provider value={value}>
      {children}
    </ErrorAnalyticsContext.Provider>
  )
}

/**
 * Hook to access error analytics
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { getStats, getHistory } = useErrorAnalytics();
 *   const stats = getStats();
 *
 *   return (
 *     <div>
 *       <p>Total errors: {stats.totalErrors}</p>
 *       <p>Retry success rate: {stats.retrySuccessRate.toFixed(1)}%</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useErrorAnalytics(): ErrorAnalyticsContextValue {
  const context = React.useContext(ErrorAnalyticsContext)
  if (!context) {
    throw new Error(
      'useErrorAnalytics must be used within ErrorAnalyticsProvider'
    )
  }
  return context
}

/**
 * Optional hook that returns null if not within provider
 * (for components that work with or without analytics)
 */
export function useErrorAnalyticsOptional(): ErrorAnalyticsContextValue | null {
  return React.useContext(ErrorAnalyticsContext)
}
