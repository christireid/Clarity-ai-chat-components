/**
 * useRequestDeduplication - React Hook for Request Deduplication
 *
 * Prevents duplicate API requests from double-clicks, StrictMode re-renders,
 * or rapid user interactions.
 *
 * @example
 * ```tsx
 * const { execute, isPending, stats } = useRequestDeduplication({
 *   debounceMs: 300,
 *   onDedupe: () => logger.debug('Duplicate request blocked'),
 * })
 *
 * const handleSubmit = async () => {
 *   try {
 *     const result = await execute('submit-form', () => submitForm(data))
 *     toast.success('Submitted!')
 *   } catch (error) {
 *     if (isDebouncedError(error)) {
 *       // Request was debounced, ignore
 *       return
 *     }
 *     toast.error('Failed to submit')
 *   }
 * }
 * ```
 */
'use client';
import * as React from 'react';
import { RequestDeduplicator, DebouncedError, isDebouncedError, createMessageKey, } from '../../utils/api/request-deduplication';
/**
 * React hook for request deduplication
 *
 * Automatically handles cleanup on unmount and provides React-friendly API.
 *
 * @param options - Deduplication configuration
 * @returns Deduplication controls and state
 */
export function useRequestDeduplication(options = {}) {
    const [stats, setStats] = React.useState({
        totalRequests: 0,
        deduplicatedRequests: 0,
        pendingCount: 0,
    });
    // Create deduplicator with stats tracking
    const deduplicatorRef = React.useRef(null);
    if (!deduplicatorRef.current) {
        deduplicatorRef.current = new RequestDeduplicator({
            ...options,
            onDedupe: (key) => {
                options.onDedupe?.(key);
                // Update stats on dedupe
                setStats(deduplicatorRef.current.getStats());
            },
        });
    }
    const deduplicator = deduplicatorRef.current;
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            deduplicatorRef.current?.destroy();
        };
    }, []);
    // Update stats helper
    const updateStats = React.useCallback(() => {
        setStats(deduplicator.getStats());
    }, [deduplicator]);
    // Execute with stats update
    const execute = React.useCallback(async (key, fn) => {
        try {
            const result = await deduplicator.execute(key, fn);
            updateStats();
            return result;
        }
        catch (error) {
            updateStats();
            throw error;
        }
    }, [deduplicator, updateStats]);
    // Execute debounced with stats update
    const executeDebounced = React.useCallback(async (key, fn) => {
        try {
            const result = await deduplicator.executeDebounced(key, fn);
            updateStats();
            return result;
        }
        catch (error) {
            updateStats();
            throw error;
        }
    }, [deduplicator, updateStats]);
    // isPending
    const isPending = React.useCallback((key) => deduplicator.isPending(key), [deduplicator]);
    // cancelDebounced
    const cancelDebounced = React.useCallback((key) => {
        const result = deduplicator.cancelDebounced(key);
        updateStats();
        return result;
    }, [deduplicator, updateStats]);
    // clear
    const clear = React.useCallback(() => {
        deduplicator.clear();
        updateStats();
    }, [deduplicator, updateStats]);
    return {
        execute,
        executeDebounced,
        isPending,
        cancelDebounced,
        stats,
        clear,
        deduplicator,
    };
}
// Re-export types and utilities for convenience
export { DebouncedError, isDebouncedError, createMessageKey };
//# sourceMappingURL=use-request-deduplication.js.map