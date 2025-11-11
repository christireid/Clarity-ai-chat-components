/**
 * React 19 Hook for API Inspector
 * Uses useOptimistic for real-time log updates
 */

'use client'

import { useOptimistic, useCallback, useMemo } from 'react'
import { getAPIInspector, type APICallLog } from '../debug'

interface APIInspectorState {
  logs: APICallLog[]
  enabled: boolean
  verbose: boolean
}

function reducer(
  state: APIInspectorState,
  action: 
    | { type: 'ADD_LOG'; log: APICallLog }
    | { type: 'UPDATE_LOG'; id: string; updates: Partial<APICallLog> }
    | { type: 'CLEAR_LOGS' }
    | { type: 'SET_ENABLED'; enabled: boolean }
    | { type: 'SET_VERBOSE'; verbose: boolean }
): APIInspectorState {
  switch (action.type) {
    case 'ADD_LOG':
      return { ...state, logs: [...state.logs, action.log] }
    case 'UPDATE_LOG':
      return {
        ...state,
        logs: state.logs.map(log =>
          log.id === action.id ? { ...log, ...action.updates } : log
        ),
      }
    case 'CLEAR_LOGS':
      return { ...state, logs: [] }
    case 'SET_ENABLED':
      return { ...state, enabled: action.enabled }
    case 'SET_VERBOSE':
      return { ...state, verbose: action.verbose }
    default:
      return state
  }
}

/**
 * Hook for API Inspector with optimistic updates
 */
export function useAPIInspector() {
  const inspector = getAPIInspector()
  
  const [state, dispatch] = useOptimistic<APIInspectorState, any>(
    {
      logs: inspector.getLogs(),
      enabled: inspector['enabled'] || false,
      verbose: inspector['verbose'] || false,
    },
    reducer
  )

  const startCall = useCallback((options: {
    provider: string
    model: string
    endpoint: string
    method: string
    headers: Record<string, string>
    body: any
  }) => {
    const callId = inspector.startCall(options)
    
    // Optimistically add log
    const optimisticLog: APICallLog = {
      id: callId,
      timestamp: new Date(),
      provider: options.provider,
      model: options.model,
      endpoint: options.endpoint,
      request: {
        method: options.method,
        headers: options.headers,
        body: options.body,
      },
      timing: {
        startTime: performance.now(),
      },
    }
    
    dispatch({ type: 'ADD_LOG', log: optimisticLog })
    
    return callId
  }, [inspector, dispatch])

  const completeCall = useCallback((id: string, response: {
    status: number
    statusText: string
    headers: Record<string, string>
    body?: any
  }) => {
    inspector.completeCall(id, response)
    const log = inspector.getLog(id)
    if (log) {
      dispatch({ type: 'UPDATE_LOG', id, updates: log })
    }
  }, [inspector, dispatch])

  const recordError = useCallback((id: string, error: Error) => {
    inspector.recordError(id, error)
    const log = inspector.getLog(id)
    if (log) {
      dispatch({ type: 'UPDATE_LOG', id, updates: log })
    }
  }, [inspector, dispatch])

  const clearLogs = useCallback(() => {
    inspector.clear()
    dispatch({ type: 'CLEAR_LOGS' })
  }, [inspector, dispatch])

  const setEnabled = useCallback((enabled: boolean) => {
    inspector.setEnabled(enabled)
    dispatch({ type: 'SET_ENABLED', enabled })
  }, [inspector, dispatch])

  const setVerbose = useCallback((verbose: boolean) => {
    inspector.setVerbose(verbose)
    dispatch({ type: 'SET_VERBOSE', verbose })
  }, [inspector, dispatch])

  const stats = useMemo(() => {
    const completedLogs = state.logs.filter(log => log.timing.duration)
    const errorLogs = state.logs.filter(log => log.error)
    
    return {
      totalCalls: state.logs.length,
      completedCalls: completedLogs.length,
      errorCalls: errorLogs.length,
      averageResponseTime: completedLogs.length > 0
        ? completedLogs.reduce((sum, log) => sum + (log.timing.duration || 0), 0) / completedLogs.length
        : 0,
      totalUsage: inspector.getTotalUsage(),
    }
  }, [state.logs, inspector])

  return {
    logs: state.logs,
    enabled: state.enabled,
    verbose: state.verbose,
    stats,
    startCall,
    completeCall,
    recordError,
    clearLogs,
    setEnabled,
    setVerbose,
  }
}
