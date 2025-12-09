'use client'

import * as React from 'react'

/**
 * State returned by useDashboardData hook
 */
export interface DashboardDataState<T> {
  /** The fetched data, null until loaded */
  data: T | null
  /** Loading state */
  isLoading: boolean
  /** Error if fetch failed */
  error: Error | null
  /** Whether data is stale (needs refresh) */
  isStale: boolean
  /** Whether currently refetching in background */
  isRefetching: boolean
  /** Last successful fetch timestamp */
  lastFetchedAt: number | null
  /** Number of retry attempts */
  retryCount: number
}

/**
 * Actions returned by useDashboardData hook
 */
export interface DashboardDataActions {
  /** Manually trigger a refetch */
  refetch: () => Promise<void>
  /** Reset to initial state */
  reset: () => void
  /** Mark data as stale */
  invalidate: () => void
}

/**
 * Options for useDashboardData hook
 */
export interface UseDashboardDataOptions<T> {
  /** Async function that fetches the data */
  fetcher: () => Promise<T>
  /** Initial data (used before first fetch) */
  initialData?: T
  /** Whether to fetch on mount (default: true) */
  fetchOnMount?: boolean
  /** Polling interval in ms (null to disable) */
  pollingInterval?: number | null
  /** Enable automatic retry on error (default: true) */
  enableRetry?: boolean
  /** Maximum retry attempts (default: 3) */
  maxRetries?: number
  /** Initial backoff delay in ms (default: 1000) */
  retryBackoffMs?: number
  /** Time in ms until data is considered stale (default: 5 minutes) */
  staleTime?: number
  /** Callback when fetch succeeds */
  onSuccess?: (data: T) => void
  /** Callback when fetch fails */
  onError?: (error: Error) => void
  /** Dependencies that trigger refetch when changed */
  dependencies?: React.DependencyList
  /** Enable debug logging */
  debug?: boolean
}

type Action<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; payload: Error }
  | { type: 'REFETCH_START' }
  | { type: 'SET_STALE' }
  | { type: 'RESET' }
  | { type: 'INCREMENT_RETRY' }
  | { type: 'RESET_RETRY' }

function createReducer<T>(initialData?: T) {
  return function reducer(
    state: DashboardDataState<T>,
    action: Action<T>
  ): DashboardDataState<T> {
    switch (action.type) {
      case 'FETCH_START':
        return {
          ...state,
          isLoading: true,
          error: null,
        }
      case 'FETCH_SUCCESS':
        return {
          ...state,
          data: action.payload,
          isLoading: false,
          isRefetching: false,
          error: null,
          isStale: false,
          lastFetchedAt: Date.now(),
          retryCount: 0,
        }
      case 'FETCH_ERROR':
        return {
          ...state,
          isLoading: false,
          isRefetching: false,
          error: action.payload,
        }
      case 'REFETCH_START':
        return {
          ...state,
          isRefetching: true,
          error: null,
        }
      case 'SET_STALE':
        return {
          ...state,
          isStale: true,
        }
      case 'INCREMENT_RETRY':
        return {
          ...state,
          retryCount: state.retryCount + 1,
        }
      case 'RESET_RETRY':
        return {
          ...state,
          retryCount: 0,
        }
      case 'RESET':
        return {
          data: initialData ?? null,
          isLoading: false,
          error: null,
          isStale: false,
          isRefetching: false,
          lastFetchedAt: null,
          retryCount: 0,
        }
      default:
        return state
    }
  }
}

/**
 * Standardized hook for fetching and managing dashboard data.
 *
 * Provides loading/error states, automatic retry with exponential backoff,
 * polling support, and stale data detection.
 *
 * @example
 * ```tsx
 * function AnalyticsDashboard() {
 *   const { data, isLoading, error, refetch } = useDashboardData({
 *     fetcher: () => fetchAnalyticsData(),
 *     pollingInterval: 30000, // Refresh every 30 seconds
 *     staleTime: 60000, // Consider data stale after 1 minute
 *   })
 *
 *   if (isLoading && !data) {
 *     return <AnalyticsDashboardSkeleton />
 *   }
 *
 *   if (error && !data) {
 *     return <ErrorState error={error} onRetry={refetch} />
 *   }
 *
 *   return <AnalyticsDashboard data={data} />
 * }
 * ```
 */
export function useDashboardData<T>(
  options: UseDashboardDataOptions<T>
): DashboardDataState<T> & DashboardDataActions {
  const {
    fetcher,
    initialData,
    fetchOnMount = true,
    pollingInterval = null,
    enableRetry = true,
    maxRetries = 3,
    retryBackoffMs = 1000,
    staleTime = 5 * 60 * 1000, // 5 minutes
    onSuccess,
    onError,
    dependencies = [],
    debug = false,
  } = options

  const reducer = React.useMemo(
    () => createReducer<T>(initialData),
    [initialData]
  )

  const [state, dispatch] = React.useReducer(reducer, {
    data: initialData ?? null,
    isLoading: fetchOnMount,
    error: null,
    isStale: false,
    isRefetching: false,
    lastFetchedAt: null,
    retryCount: 0,
  })

  const isMountedRef = React.useRef(true)
  const retryTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const pollingIntervalRef = React.useRef<ReturnType<
    typeof setInterval
  > | null>(null)
  const staleTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  const log = React.useCallback(
    (message: string, ...args: unknown[]) => {
      if (debug) {
        console.log(`[useDashboardData] ${message}`, ...args)
      }
    },
    [debug]
  )

  const clearTimers = React.useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    if (staleTimeoutRef.current) {
      clearTimeout(staleTimeoutRef.current)
      staleTimeoutRef.current = null
    }
  }, [])

  const scheduleStaleCheck = React.useCallback(() => {
    if (staleTime > 0) {
      staleTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          log('Data marked as stale')
          dispatch({ type: 'SET_STALE' })
        }
      }, staleTime)
    }
  }, [staleTime, log])

  const fetchData = React.useCallback(
    async (isRefetch = false) => {
      log(isRefetch ? 'Refetching data...' : 'Fetching data...')

      dispatch({ type: isRefetch ? 'REFETCH_START' : 'FETCH_START' })

      try {
        const data = await fetcher()

        if (!isMountedRef.current) return

        log('Fetch successful', data)
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
        onSuccess?.(data)

        // Schedule stale check
        if (staleTimeoutRef.current) {
          clearTimeout(staleTimeoutRef.current)
        }
        scheduleStaleCheck()
      } catch (err) {
        if (!isMountedRef.current) return

        const error = err instanceof Error ? err : new Error(String(err))
        log('Fetch failed', error)

        dispatch({ type: 'FETCH_ERROR', payload: error })
        onError?.(error)

        // Retry logic
        if (enableRetry && state.retryCount < maxRetries) {
          dispatch({ type: 'INCREMENT_RETRY' })
          const backoff = retryBackoffMs * Math.pow(2, state.retryCount)
          log(
            `Scheduling retry in ${backoff}ms (attempt ${state.retryCount + 1}/${maxRetries})`
          )

          retryTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              fetchData(true)
            }
          }, backoff)
        }
      }
    },
    [
      fetcher,
      onSuccess,
      onError,
      enableRetry,
      maxRetries,
      retryBackoffMs,
      state.retryCount,
      scheduleStaleCheck,
      log,
    ]
  )

  const refetch = React.useCallback(async () => {
    dispatch({ type: 'RESET_RETRY' })
    await fetchData(state.data !== null)
  }, [fetchData, state.data])

  const reset = React.useCallback(() => {
    clearTimers()
    dispatch({ type: 'RESET' })
  }, [clearTimers])

  const invalidate = React.useCallback(() => {
    dispatch({ type: 'SET_STALE' })
  }, [])

  // Initial fetch
  React.useEffect(() => {
    isMountedRef.current = true

    if (fetchOnMount) {
      fetchData(false)
    }

    return () => {
      isMountedRef.current = false
      clearTimers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Refetch on dependency changes
  React.useEffect(() => {
    if (dependencies.length > 0 && state.lastFetchedAt !== null) {
      log('Dependencies changed, refetching...')
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  // Polling
  React.useEffect(() => {
    if (pollingInterval && pollingInterval > 0) {
      log(`Starting polling with interval ${pollingInterval}ms`)
      pollingIntervalRef.current = setInterval(() => {
        if (isMountedRef.current) {
          fetchData(true)
        }
      }, pollingInterval)

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
      }
    }
  }, [pollingInterval, fetchData, log])

  return {
    ...state,
    refetch,
    reset,
    invalidate,
  }
}

/**
 * Simple wrapper for useDashboardData when you just need loading/error states
 */
export function useSimpleDashboardData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
): Pick<DashboardDataState<T>, 'data' | 'isLoading' | 'error'> &
  Pick<DashboardDataActions, 'refetch'> {
  const result = useDashboardData({
    fetcher,
    dependencies: deps,
  })

  return {
    data: result.data,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch,
  }
}
