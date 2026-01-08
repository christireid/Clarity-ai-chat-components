/**
 * React 19 Hook for Performance Profiler
 * Uses useOptimistic for real-time metrics updates
 */
'use client';
import * as React from 'react';
import { useOptimistic, useCallback, useMemo, useTransition } from 'react';
import { getProfiler } from '../../performance';
function reducer(state, action) {
    switch (action.type) {
        case 'ADD_METRIC':
            return { ...state, metrics: [...state.metrics, action.metric] };
        case 'UPDATE_METRIC':
            return {
                ...state,
                metrics: state.metrics.map(m => m.name === action.name ? { ...m, ...action.updates } : m),
            };
        case 'CLEAR_METRICS':
            return { ...state, metrics: [] };
        case 'SET_ENABLED':
            return { ...state, enabled: action.enabled };
        default:
            return state;
    }
}
/**
 * Hook for Performance Profiler with optimistic updates
 */
export function useProfiler() {
    const profiler = getProfiler();
    // Initialize state from profiler
    // Note: enabled is private, so we start with a sensible default
    // The state will be updated via setEnabled calls
    const [initialState] = React.useState(() => ({
        metrics: profiler.getAllMetrics(),
        enabled: false,
    }));
    const [state, dispatch] = useOptimistic(initialState, reducer);
    // React 19 requires useOptimistic updates to be called within a transition
    const [, startTransition] = useTransition();
    const start = useCallback((name, options = {}) => {
        profiler.start(name, options);
        // Optimistically add metric
        const optimisticMetric = {
            name,
            startTime: performance.now(),
        };
        startTransition(() => {
            dispatch({ type: 'ADD_METRIC', metric: optimisticMetric });
        });
    }, [profiler, dispatch, startTransition]);
    const end = useCallback((name, custom) => {
        const metric = profiler.end(name, custom);
        if (metric) {
            startTransition(() => {
                dispatch({ type: 'UPDATE_METRIC', name, updates: metric });
            });
        }
    }, [profiler, dispatch, startTransition]);
    const profile = useCallback(async (name, fn, options = {}) => {
        start(name, options);
        try {
            const result = await fn();
            end(name);
            return { result, metrics: profiler.getMetrics(name) };
        }
        catch (error) {
            end(name);
            throw error;
        }
    }, [profiler, start, end]);
    const clear = useCallback(() => {
        profiler.clear();
        startTransition(() => {
            dispatch({ type: 'CLEAR_METRICS' });
        });
    }, [profiler, dispatch, startTransition]);
    const setEnabled = useCallback((enabled) => {
        profiler.setEnabled(enabled);
        startTransition(() => {
            dispatch({ type: 'SET_ENABLED', enabled });
        });
    }, [profiler, dispatch, startTransition]);
    const summary = useMemo(() => {
        return profiler.getSummary();
    }, [state.metrics, profiler]);
    return {
        metrics: state.metrics,
        enabled: state.enabled,
        summary,
        start,
        end,
        profile,
        clear,
        setEnabled,
    };
}
//# sourceMappingURL=use-profiler.js.map