/**
 * React 19 Hook for Performance Profiler
 * Uses useOptimistic for real-time metrics updates
 */

'use client'

import * as React from 'react'
import { useOptimistic, useCallback, useMemo, useTransition } from 'react'
import { getProfiler, type PerformanceMetrics } from '../../performance'

interface ProfilerState {
  metrics: PerformanceMetrics[]
  enabled: boolean
}

function reducer(
  state: ProfilerState,
  action:
    | { type: 'ADD_METRIC'; metric: PerformanceMetrics }
    | { type: 'UPDATE_METRIC'; name: string; updates: Partial<PerformanceMetrics> }
    | { type: 'CLEAR_METRICS' }
    | { type: 'SET_ENABLED'; enabled: boolean }
): ProfilerState {
  switch (action.type) {
    case 'ADD_METRIC':
      return { ...state, metrics: [...state.metrics, action.metric] }
    case 'UPDATE_METRIC':
      return {
        ...state,
        metrics: state.metrics.map(m =>
          m.name === action.name ? { ...m, ...action.updates } : m
        ),
      }
    case 'CLEAR_METRICS':
      return { ...state, metrics: [] }
    case 'SET_ENABLED':
      return { ...state, enabled: action.enabled }
    default:
      return state
  }
}

/**
 * Hook for Performance Profiler with optimistic updates
 */
export function useProfiler() {
  const profiler = getProfiler()
  
  // Initialize state from profiler
  const [initialState] = React.useState<ProfilerState>(() => ({
    metrics: profiler.getAllMetrics(),
    enabled: (profiler as any).enabled || false,
  }))

  const [state, dispatch] = useOptimistic<ProfilerState, any>(
    initialState,
    reducer
  )
  
  // React 19 requires useOptimistic updates to be called within a transition
  const [, startTransition] = useTransition()

  const start = useCallback((name: string, options: { trackMemory?: boolean } = {}) => {
    profiler.start(name, options)
    
    // Optimistically add metric
    const optimisticMetric: PerformanceMetrics = {
      name,
      startTime: performance.now(),
    }
    
    startTransition(() => {
      dispatch({ type: 'ADD_METRIC', metric: optimisticMetric })
    })
  }, [profiler, dispatch, startTransition])

  const end = useCallback((name: string, custom?: Record<string, any>) => {
    const metric = profiler.end(name, custom)
    if (metric) {
      startTransition(() => {
        dispatch({ type: 'UPDATE_METRIC', name, updates: metric })
      })
    }
  }, [profiler, dispatch, startTransition])

  const profile = useCallback(async <T,>(
    name: string,
    fn: () => Promise<T>,
    options: { trackMemory?: boolean } = {}
  ) => {
    start(name, options)
    try {
      const result = await fn()
      end(name)
      return { result, metrics: profiler.getMetrics(name) }
    } catch (error) {
      end(name)
      throw error
    }
  }, [profiler, start, end])

  const clear = useCallback(() => {
    profiler.clear()
    startTransition(() => {
      dispatch({ type: 'CLEAR_METRICS' })
    })
  }, [profiler, dispatch, startTransition])

  const setEnabled = useCallback((enabled: boolean) => {
    profiler.setEnabled(enabled)
    startTransition(() => {
      dispatch({ type: 'SET_ENABLED', enabled })
    })
  }, [profiler, dispatch, startTransition])

  const summary = useMemo(() => {
    return profiler.getSummary()
  }, [state.metrics, profiler])

  return {
    metrics: state.metrics,
    enabled: state.enabled,
    summary,
    start,
    end,
    profile,
    clear,
    setEnabled,
  }
}
