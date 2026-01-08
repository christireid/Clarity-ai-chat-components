'use client';
import * as React from 'react';
function createReducer(initialData) {
    return function reducer(state, action) {
        switch (action.type) {
            case 'FETCH_START':
                return {
                    ...state,
                    isLoading: true,
                    error: null,
                };
            case 'FETCH_SUCCESS':
                return {
                    ...state,
                    data: action.payload,
                    isLoading: false,
                    isRefetching: false,
                    error: null,
                    isStale: false,
                    lastFetchedAt: action.fetchedAt,
                    retryCount: 0,
                };
            case 'FETCH_ERROR':
                return {
                    ...state,
                    isLoading: false,
                    isRefetching: false,
                    error: action.payload,
                };
            case 'REFETCH_START':
                return {
                    ...state,
                    isRefetching: true,
                    error: null,
                };
            case 'SET_STALE':
                return {
                    ...state,
                    isStale: true,
                };
            case 'INCREMENT_RETRY':
                return {
                    ...state,
                    retryCount: state.retryCount + 1,
                };
            case 'RESET_RETRY':
                return {
                    ...state,
                    retryCount: 0,
                };
            case 'RESET':
                return {
                    data: initialData ?? null,
                    isLoading: false,
                    error: null,
                    isStale: false,
                    isRefetching: false,
                    lastFetchedAt: null,
                    retryCount: 0,
                };
            case 'SET_DATA':
                return {
                    ...state,
                    data: action.payload,
                };
            case 'OPTIMISTIC_UPDATE':
                return {
                    ...state,
                    data: action.payload,
                    // Don't update lastFetchedAt since this isn't from the server
                };
            default:
                return state;
        }
    };
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
export function useDashboardData(options) {
    const { fetcher, initialData, fetchOnMount = true, pollingInterval = null, enableRetry = true, maxRetries = 3, retryBackoffMs = 1000, staleTime = 0, // disabled by default (opt-in)
    onSuccess, onError, dependencies = [], debug = false, clock = {
        now: () => Date.now(),
        setTimeout: (handler, timeout) => setTimeout(handler, timeout),
        clearTimeout: (handle) => clearTimeout(handle),
    }, } = options;
    if (typeof fetcher !== 'function') {
        throw new Error('useDashboardData: "fetcher" is required and must be a function returning a Promise.');
    }
    const reducer = React.useMemo(() => createReducer(initialData), [initialData]);
    const [state, dispatch] = React.useReducer(reducer, {
        data: initialData ?? null,
        isLoading: fetchOnMount,
        error: null,
        isStale: false,
        isRefetching: false,
        lastFetchedAt: null,
        retryCount: 0,
    });
    const isMountedRef = React.useRef(true);
    const retryTimeoutRef = React.useRef(null);
    const pollingIntervalRef = React.useRef(null);
    const staleTimeoutRef = React.useRef(null);
    const [pollTick, setPollTick] = React.useState(0);
    // Track current request to avoid stale responses
    const requestIdRef = React.useRef(0);
    // Track if a fetch is in progress to avoid overlapping requests
    const isFetchingRef = React.useRef(false);
    // Track retry count in ref to avoid stale closure issues
    const retryCountRef = React.useRef(0);
    const log = React.useCallback((message, ...args) => {
        if (debug) {
            console.log(`[useDashboardData] ${message}`, ...args);
        }
    }, [debug]);
    const clearTimers = React.useCallback(() => {
        if (retryTimeoutRef.current) {
            clock.clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
        if (pollingIntervalRef.current) {
            clock.clearTimeout(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        if (staleTimeoutRef.current) {
            clock.clearTimeout(staleTimeoutRef.current);
            staleTimeoutRef.current = null;
        }
    }, [clock]);
    const clearStaleTimer = React.useCallback(() => {
        if (staleTimeoutRef.current) {
            clock.clearTimeout(staleTimeoutRef.current);
            staleTimeoutRef.current = null;
        }
    }, [clock]);
    const fetchData = React.useCallback(async (isRefetch = false) => {
        // Prevent overlapping requests during polling
        if (isFetchingRef.current && isRefetch) {
            log('Skipping fetch - request already in progress');
            return;
        }
        // Increment request ID to track this specific request
        const currentRequestId = ++requestIdRef.current;
        isFetchingRef.current = true;
        log(isRefetch ? 'Refetching data...' : 'Fetching data...', {
            requestId: currentRequestId,
        });
        dispatch({ type: isRefetch ? 'REFETCH_START' : 'FETCH_START' });
        try {
            // Clear staleness timer while a request is in-flight to avoid scheduling churn during polling.
            clearStaleTimer();
            const data = await fetcher();
            // Check if this request is still the current one (not stale)
            if (requestIdRef.current !== currentRequestId) {
                log('Discarding stale response', {
                    requestId: currentRequestId,
                    currentId: requestIdRef.current,
                });
                return;
            }
            if (!isMountedRef.current)
                return;
            log('Fetch successful', data);
            dispatch({
                type: 'FETCH_SUCCESS',
                payload: data,
                fetchedAt: clock.now(),
            });
            // Reset retry count on success
            retryCountRef.current = 0;
            onSuccess?.(data);
        }
        catch (err) {
            // Check if this request is still the current one (not stale)
            if (requestIdRef.current !== currentRequestId) {
                log('Discarding stale error', {
                    requestId: currentRequestId,
                    currentId: requestIdRef.current,
                });
                return;
            }
            if (!isMountedRef.current)
                return;
            const error = err instanceof Error ? err : new Error(String(err));
            log('Fetch failed', error);
            dispatch({ type: 'FETCH_ERROR', payload: error });
            onError?.(error);
            // Retry logic using ref to avoid stale closure
            if (enableRetry && retryCountRef.current < maxRetries) {
                retryCountRef.current++;
                dispatch({ type: 'INCREMENT_RETRY' });
                const backoff = retryBackoffMs * Math.pow(2, retryCountRef.current - 1);
                log(`Scheduling retry in ${backoff}ms (attempt ${retryCountRef.current}/${maxRetries})`);
                retryTimeoutRef.current = clock.setTimeout(() => {
                    if (isMountedRef.current) {
                        fetchData(true);
                    }
                }, backoff);
            }
        }
        finally {
            // Only clear fetching flag if this is still the current request
            if (requestIdRef.current === currentRequestId) {
                isFetchingRef.current = false;
            }
        }
    }, [
        fetcher,
        onSuccess,
        onError,
        enableRetry,
        maxRetries,
        retryBackoffMs,
        clearStaleTimer,
        log,
        clock,
    ]);
    const refetch = React.useCallback(async () => {
        // Reset retry count in both state and ref
        retryCountRef.current = 0;
        dispatch({ type: 'RESET_RETRY' });
        await fetchData(state.data !== null);
    }, [fetchData, state.data]);
    const reset = React.useCallback(() => {
        clearTimers();
        // Reset all refs to initial state
        retryCountRef.current = 0;
        isFetchingRef.current = false;
        requestIdRef.current = 0;
        dispatch({ type: 'RESET' });
    }, [clearTimers]);
    const invalidate = React.useCallback(() => {
        dispatch({ type: 'SET_STALE' });
    }, []);
    // Store previous data for rollback
    const previousDataRef = React.useRef(null);
    const setData = React.useCallback((newData) => {
        log('Setting data directly');
        dispatch({ type: 'SET_DATA', payload: newData });
    }, [log]);
    const setOptimistic = React.useCallback((newData) => {
        // Store current data for potential rollback
        previousDataRef.current = state.data;
        log('Optimistically updating data', newData);
        dispatch({ type: 'OPTIMISTIC_UPDATE', payload: newData });
        return {
            rollback: () => {
                log('Rolling back optimistic update');
                if (previousDataRef.current !== null) {
                    dispatch({ type: 'SET_DATA', payload: previousDataRef.current });
                }
            },
        };
    }, [state.data, log]);
    // Initial fetch
    React.useEffect(() => {
        isMountedRef.current = true;
        if (fetchOnMount) {
            fetchData(false);
        }
        return () => {
            isMountedRef.current = false;
            clearTimers();
        };
    }, []);
    // Refetch on dependency changes
    React.useEffect(() => {
        if (dependencies.length > 0 && state.lastFetchedAt !== null) {
            log('Dependencies changed, refetching...');
            refetch();
        }
    }, dependencies);
    // Staleness timer (scheduled after commit, not during fetch).
    React.useEffect(() => {
        clearStaleTimer();
        if (!state.lastFetchedAt || staleTime <= 0 || state.isStale)
            return;
        staleTimeoutRef.current = clock.setTimeout(() => {
            if (!isMountedRef.current)
                return;
            log('Data marked as stale');
            dispatch({ type: 'SET_STALE' });
        }, staleTime);
    }, [
        state.lastFetchedAt,
        staleTime,
        state.isStale,
        log,
        clearStaleTimer,
        clock,
    ]);
    // Polling
    React.useEffect(() => {
        if (pollingInterval && pollingInterval > 0) {
            log(`Starting polling with interval ${pollingInterval}ms`);
            // Use a single-shot timer + tick state to avoid `runAllTimersAsync()` infinite loops in tests,
            // and to avoid overlapping fetches (fetchData has its own overlap guard).
            pollingIntervalRef.current = clock.setTimeout(() => {
                if (!isMountedRef.current)
                    return;
                Promise.resolve(fetchData(true)).finally(() => {
                    if (isMountedRef.current) {
                        setPollTick((t) => t + 1);
                    }
                });
            }, pollingInterval);
            return () => {
                if (pollingIntervalRef.current) {
                    clock.clearTimeout(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
            };
        }
        return undefined;
    }, [pollingInterval, fetchData, log, pollTick, clock]);
    return {
        ...state,
        refetch,
        reset,
        invalidate,
        setOptimistic,
        setData,
    };
}
/**
 * Simple wrapper for useDashboardData when you just need loading/error states
 */
export function useSimpleDashboardData(fetcher, deps = []) {
    const result = useDashboardData({
        fetcher,
        dependencies: deps,
    });
    return {
        data: result.data,
        isLoading: result.isLoading,
        error: result.error,
        refetch: result.refetch,
    };
}
//# sourceMappingURL=use-dashboard-data.js.map