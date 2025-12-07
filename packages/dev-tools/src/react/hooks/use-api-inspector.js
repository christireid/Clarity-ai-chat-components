/**
 * React 19 Hook for API Inspector
 * Uses useOptimistic for real-time log updates
 */
'use client';
import * as React from 'react';
import { useOptimistic, useCallback, useMemo } from 'react';
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
    const [initialState] = React.useState(() => ({
        logs: inspector.getLogs(),
        enabled: inspector.enabled || false,
        verbose: inspector.verbose || false,
    }));
    const [state, dispatch] = useOptimistic(initialState, reducer);
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
        dispatch({ type: 'ADD_LOG', log: optimisticLog });
        return callId;
    }, [inspector, dispatch]);
    const completeCall = useCallback((id, response) => {
        inspector.completeCall(id, response);
        const log = inspector.getLog(id);
        if (log) {
            dispatch({ type: 'UPDATE_LOG', id, updates: log });
        }
    }, [inspector, dispatch]);
    const recordError = useCallback((id, error) => {
        inspector.recordError(id, error);
        const log = inspector.getLog(id);
        if (log) {
            dispatch({ type: 'UPDATE_LOG', id, updates: log });
        }
    }, [inspector, dispatch]);
    const clearLogs = useCallback(() => {
        inspector.clear();
        dispatch({ type: 'CLEAR_LOGS' });
    }, [inspector, dispatch]);
    const setEnabled = useCallback((enabled) => {
        inspector.setEnabled(enabled);
        dispatch({ type: 'SET_ENABLED', enabled });
    }, [inspector, dispatch]);
    const setVerbose = useCallback((verbose) => {
        inspector.setVerbose(verbose);
        dispatch({ type: 'SET_VERBOSE', verbose });
    }, [inspector, dispatch]);
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