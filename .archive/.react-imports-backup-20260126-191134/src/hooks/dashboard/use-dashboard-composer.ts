'use client'

import * as React from 'react'

/**
 * Configuration for a single data source in the composer
 */
export interface DataSourceConfig<T> {
  /** Unique key for this data source */
  key: string
  /** Async function that fetches the data */
  fetcher: () => Promise<T>
  /** Whether this source is required for the dashboard to render */
  required?: boolean
  /** Time in ms until data is considered stale */
  staleTime?: number
  /** Retry attempts on failure */
  maxRetries?: number
}

/**
 * State for a single data source
 */
export interface DataSourceState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  isStale: boolean
  lastFetchedAt: number | null
}

/**
 * Combined state from useDashboardComposer
 */
export interface DashboardComposerState<T extends Record<string, unknown>> {
  /** Individual data source states keyed by source key */
  sources: { [K in keyof T]: DataSourceState<T[K]> }
  /** True if any required source is loading */
  isLoading: boolean
  /** True if all sources have completed (success or failure) */
  isReady: boolean
  /** True if any required source has an error */
  hasError: boolean
  /** Array of errors from all sources */
  errors: Array<{ key: string; error: Error }>
  /** True if any source is stale */
  isStale: boolean
  /** Progress of loading (0-100) */
  loadingProgress: number
}

/**
 * Actions from useDashboardComposer
 */
export interface DashboardComposerActions {
  /** Refetch all sources */
  refetchAll: () => Promise<void>
  /** Refetch a specific source by key */
  refetch: (key: string) => Promise<void>
  /** Invalidate all sources (mark as stale) */
  invalidateAll: () => void
  /** Invalidate a specific source */
  invalidate: (key: string) => void
  /** Reset all sources to initial state */
  reset: () => void
}

/**
 * Options for useDashboardComposer
 */
export interface UseDashboardComposerOptions<
  T extends Record<string, unknown>,
> {
  /** Array of data source configurations */
  sources: Array<DataSourceConfig<T[keyof T]>>
  /** Whether to fetch all sources on mount (default: true) */
  fetchOnMount?: boolean
  /** Fetch sources in parallel (default: true) or sequentially */
  parallel?: boolean
  /** Callback when all sources have loaded successfully */
  onAllSuccess?: (data: T) => void
  /** Callback when any source fails */
  onError?: (key: string, error: Error) => void
  /** Enable debug logging */
  debug?: boolean

  /**
   * Optional clock/scheduler injection (useful for deterministic tests).
   */
  clock?: {
    now: () => number
    setTimeout: (
      handler: (...args: any[]) => void,
      timeout?: number
    ) => ReturnType<typeof setTimeout>
    clearTimeout: (handle: ReturnType<typeof setTimeout>) => void
  }
}

type SourceAction<T> =
  | { type: 'FETCH_START'; key: string }
  | { type: 'FETCH_SUCCESS'; key: string; payload: T; fetchedAt: number }
  | { type: 'FETCH_ERROR'; key: string; error: Error }
  | { type: 'SET_STALE'; key: string }
  | { type: 'SET_ALL_STALE' }
  | { type: 'RESET' }

interface SourcesState<T extends Record<string, unknown>> {
  [key: string]: DataSourceState<T[keyof T]>
}

function createSourcesReducer<T extends Record<string, unknown>>(
  initialSources: string[]
) {
  const initialState: SourcesState<T> = {}
  for (const key of initialSources) {
    initialState[key] = {
      data: null,
      isLoading: false,
      error: null,
      isStale: false,
      lastFetchedAt: null,
    }
  }

  return function reducer(
    state: SourcesState<T>,
    action: SourceAction<T[keyof T]>
  ): SourcesState<T> {
    switch (action.type) {
      case 'FETCH_START':
        return {
          ...state,
          [action.key]: {
            ...state[action.key],
            isLoading: true,
            error: null,
          },
        }
      case 'FETCH_SUCCESS':
        return {
          ...state,
          [action.key]: {
            data: action.payload,
            isLoading: false,
            error: null,
            isStale: false,
            lastFetchedAt: action.fetchedAt,
          },
        }
      case 'FETCH_ERROR':
        return {
          ...state,
          [action.key]: {
            ...state[action.key],
            isLoading: false,
            error: action.error,
          },
        }
      case 'SET_STALE':
        return {
          ...state,
          [action.key]: {
            ...state[action.key],
            isStale: true,
          },
        }
      case 'SET_ALL_STALE': {
        const newState: SourcesState<T> = {}
        for (const key of Object.keys(state)) {
          newState[key] = {
            ...state[key],
            isStale: true,
          }
        }
        return newState
      }
      case 'RESET':
        return initialState
      default:
        return state
    }
  }
}

/**
 * Composes multiple data sources into a unified dashboard state.
 *
 * Provides coordinated loading states, error aggregation, and
 * loading progress tracking across multiple async data sources.
 *
 * @example
 * ```tsx
 * interface DashboardData {
 *   metrics: MetricsData
 *   usage: UsageData
 *   experiments: ExperimentData[]
 * }
 *
 * function Dashboard() {
 *   const {
 *     sources,
 *     isLoading,
 *     isReady,
 *     hasError,
 *     loadingProgress,
 *     refetchAll,
 *   } = useDashboardComposer<DashboardData>({
 *     sources: [
 *       { key: 'metrics', fetcher: fetchMetrics, required: true },
 *       { key: 'usage', fetcher: fetchUsage, required: true },
 *       { key: 'experiments', fetcher: fetchExperiments, required: false },
 *     ],
 *   })
 *
 *   if (isLoading) {
 *     return <DashboardSkeleton progress={loadingProgress} />
 *   }
 *
 *   if (hasError) {
 *     return <ErrorState onRetry={refetchAll} />
 *   }
 *
 *   return (
 *     <Dashboard
 *       metrics={sources.metrics.data}
 *       usage={sources.usage.data}
 *       experiments={sources.experiments.data}
 *     />
 *   )
 * }
 * ```
 */
export function useDashboardComposer<T extends Record<string, unknown>>(
  options: UseDashboardComposerOptions<T>
): DashboardComposerState<T> & DashboardComposerActions {
  const {
    sources: sourceConfigs,
    fetchOnMount = true,
    parallel = true,
    onAllSuccess,
    onError,
    debug = false,
    clock = {
      now: () => Date.now(),
      setTimeout: (handler, timeout) => setTimeout(handler, timeout),
      clearTimeout: (handle) => clearTimeout(handle),
    },
  } = options

  const sourceKeys = React.useMemo(
    () => sourceConfigs.map((s) => s.key),
    [sourceConfigs]
  )

  const reducer = React.useMemo(
    () => createSourcesReducer<T>(sourceKeys),
    [sourceKeys]
  )

  const [sourcesState, dispatch] = React.useReducer(reducer, undefined, () => {
    const initial: SourcesState<T> = {}
    for (const key of sourceKeys) {
      initial[key] = {
        data: null,
        isLoading: fetchOnMount,
        error: null,
        isStale: false,
        lastFetchedAt: null,
      }
    }
    return initial
  })

  const isMountedRef = React.useRef(true)
  const staleTimeoutsRef = React.useRef<
    Map<string, ReturnType<typeof setTimeout>>
  >(new Map())

  const log = React.useCallback(
    (message: string, ...args: unknown[]) => {
      if (debug) {
        console.log(`[useDashboardComposer] ${message}`, ...args)
      }
    },
    [debug]
  )

  const sourceConfigsMap = React.useMemo(() => {
    const map = new Map<string, DataSourceConfig<T[keyof T]>>()
    for (const config of sourceConfigs) {
      map.set(config.key, config)
    }
    return map
  }, [sourceConfigs])

  const requiredKeys = React.useMemo(
    () => sourceConfigs.filter((s) => s.required !== false).map((s) => s.key),
    [sourceConfigs]
  )

  const clearStaleTimeout = React.useCallback(
    (key: string) => {
      const timeout = staleTimeoutsRef.current.get(key)
      if (timeout) {
        clock.clearTimeout(timeout)
        staleTimeoutsRef.current.delete(key)
      }
    },
    [clock]
  )

  // Track lastFetchedAt to schedule staleness timers after commit (not during fetch)
  const lastFetchedAtRef = React.useRef<Map<string, number | null>>(new Map())

  const fetchSource = React.useCallback(
    async (key: string): Promise<void> => {
      const config = sourceConfigsMap.get(key)
      if (!config) {
        log(`Source ${key} not found`)
        return
      }

      log(`Fetching source: ${key}`)
      dispatch({ type: 'FETCH_START', key })

      let retries = 0
      const maxRetries = config.maxRetries ?? 3

      while (retries <= maxRetries) {
        try {
          const data = await config.fetcher()

          if (!isMountedRef.current) return

          log(`Source ${key} fetched successfully`)
          dispatch({
            type: 'FETCH_SUCCESS',
            key,
            payload: data,
            fetchedAt: clock.now(),
          })
          return
        } catch (err) {
          if (!isMountedRef.current) return

          const error = err instanceof Error ? err : new Error(String(err))

          if (retries < maxRetries) {
            retries++
            const backoff = 1000 * Math.pow(2, retries - 1)
            log(
              `Source ${key} failed, retrying in ${backoff}ms (${retries}/${maxRetries})`
            )
            await new Promise<void>((resolve) => {
              clock.setTimeout(() => resolve(), backoff)
            })
          } else {
            log(`Source ${key} failed after ${maxRetries} retries`, error)
            dispatch({ type: 'FETCH_ERROR', key, error })
            onError?.(key, error)
            return
          }
        }
      }
    },
    [sourceConfigsMap, onError, log, clock]
  )

  const refetchAll = React.useCallback(async () => {
    log('Refetching all sources')

    if (parallel) {
      await Promise.all(sourceKeys.map((key) => fetchSource(key)))
    } else {
      for (const key of sourceKeys) {
        await fetchSource(key)
      }
    }
  }, [sourceKeys, fetchSource, parallel, log])

  const refetch = React.useCallback(
    async (key: string) => {
      await fetchSource(key)
    },
    [fetchSource]
  )

  const invalidateAll = React.useCallback(() => {
    dispatch({ type: 'SET_ALL_STALE' })
  }, [])

  const invalidate = React.useCallback((key: string) => {
    dispatch({ type: 'SET_STALE', key })
  }, [])

  const reset = React.useCallback(() => {
    // Clear all stale timeouts
    for (const timeout of staleTimeoutsRef.current.values()) {
      clock.clearTimeout(timeout)
    }
    staleTimeoutsRef.current.clear()
    dispatch({ type: 'RESET' })
  }, [clock])

  // Initial fetch
  React.useEffect(() => {
    isMountedRef.current = true

    if (fetchOnMount) {
      refetchAll()
    }

    // Copy refs to local variables for cleanup
    const staleTimeouts = staleTimeoutsRef.current
    const clockRef = clock

    return () => {
      isMountedRef.current = false
      // Clear all stale timeouts
      for (const timeout of staleTimeouts.values()) {
        clockRef.clearTimeout(timeout)
      }
      staleTimeouts.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run on mount
  }, [])

  // Track if onAllSuccess has been called for current state
  const onAllSuccessCalledRef = React.useRef(false)

  // Check for all success
  React.useEffect(() => {
    const allLoaded = sourceKeys.every(
      (key) => sourcesState[key]?.data !== null && !sourcesState[key]?.isLoading
    )
    const noErrors = sourceKeys.every(
      (key) => sourcesState[key]?.error === null
    )

    if (allLoaded && noErrors && onAllSuccess && !onAllSuccessCalledRef.current) {
      const data = {} as T
      for (const key of sourceKeys) {
        ;(data as Record<string, unknown>)[key] = sourcesState[key].data
      }
      onAllSuccess(data)
      onAllSuccessCalledRef.current = true
    } else if (!allLoaded || !noErrors) {
      // Reset flag when state changes
      onAllSuccessCalledRef.current = false
    }
  }, [sourcesState, sourceKeys, onAllSuccess])

  // Schedule staleness timers AFTER state updates commit.
  // This is intentionally done in an effect (not inside fetchSource) so test helpers like
  // `vi.runAllTimersAsync()` can flush fetch-related timers without also fast-forwarding
  // long-lived stale timers.
  React.useEffect(() => {
    for (const key of sourceKeys) {
      const state = sourcesState[key]
      const config = sourceConfigsMap.get(key)
      const staleTime = config?.staleTime

      // Only enable staleness when explicitly configured.
      if (!state || staleTime === undefined || staleTime <= 0) {
        clearStaleTimeout(key)
        continue
      }

      // If already stale (manual invalidation), don't schedule.
      if (state.isStale) {
        clearStaleTimeout(key)
        continue
      }

      const prevLastFetchedAt = lastFetchedAtRef.current.get(key)
      if (prevLastFetchedAt === state.lastFetchedAt) {
        // No new fetch; keep existing timer.
        continue
      }

      lastFetchedAtRef.current.set(key, state.lastFetchedAt)
      clearStaleTimeout(key)

      if (state.lastFetchedAt === null) continue

      // Copy ref to local variable for timeout callback
      const isMounted = isMountedRef
      const timeout = clock.setTimeout(() => {
        if (!isMounted.current) return
        log(`Source ${key} marked as stale`)
        dispatch({ type: 'SET_STALE', key })
      }, staleTime)

      staleTimeoutsRef.current.set(key, timeout)
    }
  }, [
    sourceKeys,
    sourcesState,
    sourceConfigsMap,
    clearStaleTimeout,
    log,
    clock,
  ])

  // Compute derived state
  const isLoading = requiredKeys.some((key) => sourcesState[key]?.isLoading)

  const isReady = sourceKeys.every((key) => !sourcesState[key]?.isLoading)

  const hasError = requiredKeys.some((key) => sourcesState[key]?.error !== null)

  const errors = sourceKeys
    .filter((key) => sourcesState[key]?.error !== null)
    .map((key) => ({
      key,
      error: sourcesState[key].error as Error,
    }))

  const isStale = sourceKeys.some((key) => sourcesState[key]?.isStale)

  const loadedCount = sourceKeys.filter(
    (key) => !sourcesState[key]?.isLoading
  ).length
  const loadingProgress = Math.round((loadedCount / sourceKeys.length) * 100)

  return {
    sources: sourcesState as { [K in keyof T]: DataSourceState<T[K]> },
    isLoading,
    isReady,
    hasError,
    errors,
    isStale,
    loadingProgress,
    refetchAll,
    refetch,
    invalidateAll,
    invalidate,
    reset,
  }
}

/**
 * Utility to create a typed data source config
 */
export function createDataSource<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: Omit<DataSourceConfig<T>, 'key' | 'fetcher'> = {}
): DataSourceConfig<T> {
  return {
    key,
    fetcher,
    ...options,
  }
}
