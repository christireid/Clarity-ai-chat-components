/**
 * React 19 Hook for API Inspector
 * Uses useOptimistic for real-time log updates
 */
'use client';
import * as React from 'react';
import { useOptimistic, useCallback, useMemo, useTransition } from 'react';
import { getAPIInspector } from '../../debug';
function reducer(state, action) {
    switch (action.type) {
        case 'ADD_LOG':
            return { ...state, logs: [...state.logs, action.log] };
        case 'UPDATE_LOG':
            return {
                ...state,
                logs: state.logs.map(log => log.id === action.id ? { ...log, ...action.updates } : log),
            };
        case 'CLEAR_LOGS':
            return { ...state, logs: [] };
        case 'SET_ENABLED':
            return { ...state, enabled: action.enabled };
        case 'SET_VERBOSE':
            return { ...state, verbose: action.verbose };
        default:
            return state;
    }
}
/**
 * Hook for API Inspector with optimistic updates
 */
export function useAPIInspector() {
    const inspector = getAPIInspector();
    // Initialize state from inspector
    // Note: enabled and verbose are private, so we start with sensible defaults
    // The state will be updated via setEnabled/setVerbose calls
    const [initialState] = React.useState(() => ({
        logs: inspector.getLogs(),
        enabled: false,
        verbose: false,
    }));
    const [state, dispatch] = useOptimistic(initialState, reducer);
    // React 19 requires useOptimistic updates to be called within a transition
    const [, startTransition] = useTransition();
    const startCall = useCallback((options) => {
        const callId = inspector.startCall(options);
        // Optimistically add log
        const optimisticLog = {
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
        };
        startTransition(() => {
            dispatch({ type: 'ADD_LOG', log: optimisticLog });
        });
        return callId;
    }, [inspector, dispatch, startTransition]);
    const completeCall = useCallback((id, response) => {
        inspector.completeCall(id, response);
        const log = inspector.getLog(id);
        if (log) {
            startTransition(() => {
                dispatch({ type: 'UPDATE_LOG', id, updates: log });
            });
        }
    }, [inspector, dispatch, startTransition]);
    const recordError = useCallback((id, error) => {
        inspector.recordError(id, error);
        const log = inspector.getLog(id);
        if (log) {
            startTransition(() => {
                dispatch({ type: 'UPDATE_LOG', id, updates: log });
            });
        }
    }, [inspector, dispatch, startTransition]);
    const clearLogs = useCallback(() => {
        inspector.clear();
        startTransition(() => {
            dispatch({ type: 'CLEAR_LOGS' });
        });
    }, [inspector, dispatch, startTransition]);
    const setEnabled = useCallback((enabled) => {
        inspector.setEnabled(enabled);
        startTransition(() => {
            dispatch({ type: 'SET_ENABLED', enabled });
        });
    }, [inspector, dispatch, startTransition]);
    const setVerbose = useCallback((verbose) => {
        inspector.setVerbose(verbose);
        startTransition(() => {
            dispatch({ type: 'SET_VERBOSE', verbose });
        });
    }, [inspector, dispatch, startTransition]);
    const stats = useMemo(() => {
        // Single pass through logs for better performance
        let completedCount = 0;
        let errorCount = 0;
        let totalDuration = 0;
        for (const log of state.logs) {
            if (log.timing.duration) {
                completedCount++;
                totalDuration += log.timing.duration;
            }
            if (log.error) {
                errorCount++;
            }
        }
        return {
            totalCalls: state.logs.length,
            completedCalls: completedCount,
            errorCalls: errorCount,
            averageResponseTime: completedCount > 0 ? totalDuration / completedCount : 0,
            totalUsage: inspector.getTotalUsage(),
        };
    }, [state.logs, inspector]);
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
    };
}
//# sourceMappingURL=use-api-inspector.js.map