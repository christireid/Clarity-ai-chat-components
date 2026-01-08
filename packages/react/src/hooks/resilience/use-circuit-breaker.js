/**
 * useCircuitBreaker - React Hook for Circuit Breaker Pattern
 *
 * Provides React-friendly circuit breaker functionality with
 * automatic state tracking and cleanup.
 *
 * @example
 * ```tsx
 * const { execute, state, stats, reset } = useCircuitBreaker({
 *   name: 'api-calls',
 *   failureThreshold: 5,
 *   resetTimeout: 30000,
 *   onOpen: () => toast.error('Service temporarily unavailable'),
 * })
 *
 * const handleFetch = async () => {
 *   try {
 *     const result = await execute(() => fetch('/api/data'))
 *     setData(result)
 *   } catch (error) {
 *     if (isCircuitOpenError(error)) {
 *       // Use cached data or show fallback UI
 *     }
 *   }
 * }
 * ```
 */
'use client';
import * as React from 'react';
import { CircuitBreaker, CircuitOpenError, isCircuitOpenError, } from '../../utils/resilience/circuit-breaker';
/**
 * React hook for circuit breaker pattern
 *
 * Automatically tracks circuit state and provides React-friendly API.
 *
 * @param options - Circuit breaker configuration
 * @returns Circuit breaker controls and state
 */
export function useCircuitBreaker(options) {
    const { onStateChange: userOnStateChange, ...breakerOptions } = options;
    const [state, setState] = React.useState('CLOSED');
    const [stats, setStats] = React.useState({
        state: 'CLOSED',
        failures: 0,
        successes: 0,
        totalRequests: 0,
        totalFailures: 0,
    });
    // Create breaker with state tracking
    const breakerRef = React.useRef(null);
    if (!breakerRef.current) {
        breakerRef.current = new CircuitBreaker({
            ...breakerOptions,
            onStateChange: (newState, name) => {
                setState(newState);
                userOnStateChange?.(newState, name);
            },
        });
    }
    const breaker = breakerRef.current;
    // Update stats after each operation
    const updateStats = React.useCallback(() => {
        setStats(breaker.getStats());
    }, [breaker]);
    // Wrapped execute that updates stats
    const execute = React.useCallback(async (fn) => {
        try {
            const result = await breaker.execute(fn);
            updateStats();
            return result;
        }
        catch (error) {
            updateStats();
            throw error;
        }
    }, [breaker, updateStats]);
    // Reset with state update
    const reset = React.useCallback(() => {
        breaker.reset();
        setState('CLOSED');
        updateStats();
    }, [breaker, updateStats]);
    // Check if allowed
    const isAllowed = React.useMemo(() => breaker.isAllowed(), [breaker, state]);
    return {
        execute,
        state,
        stats,
        reset,
        isAllowed,
        breaker,
    };
}
// Re-export types and utilities for convenience
export { CircuitOpenError, isCircuitOpenError };
//# sourceMappingURL=use-circuit-breaker.js.map