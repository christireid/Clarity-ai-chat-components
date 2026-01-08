/**
 * React hook for Error Tracking and Recovery
 *
 * Automatically categorizes errors, tracks recovery attempts, and provides
 * actionable recommendations for error resolution.
 *
 * @module useErrorTracker
 *
 * @example
 * ```tsx
 * import { useErrorTracker } from '@clarity-chat/dev-tools'
 *
 * function DataFetcher() {
 *   const { track, errors, withErrorTracking, getRecommendations } = useErrorTracker({
 *     component: 'DataFetcher',
 *     autoTrack: true,
 *     onError: (event) => analytics.track('error', event)
 *   })
 *
 *   const fetchData = () => withErrorTracking(async () => {
 *     const response = await fetch('/api/data')
 *     if (!response.ok) throw new Error('Fetch failed')
 *     return response.json()
 *   })
 *
 *   return <div>{errors.length} errors tracked</div>
 * }
 * ```
 */
'use client';
import * as React from 'react';
import { getErrorTracker, createErrorTracker, } from '../../debug/error-tracker';
/**
 * Hook to track errors and recovery
 */
export function useErrorTracker(options = {}) {
    const { enabled = process.env.NODE_ENV === 'development', component, autoTrack = true, onError, } = options;
    const tracker = React.useMemo(() => {
        return getErrorTracker();
    }, []);
    const [stats, setStats] = React.useState(() => tracker.getStats());
    const [errors, setErrors] = React.useState([]);
    // Subscribe to error events
    React.useEffect(() => {
        if (!enabled)
            return;
        const unsubscribe = tracker.addListener((event) => {
            setStats(tracker.getStats());
            setErrors(tracker.getErrors());
            onError?.(event);
        });
        // Initial load
        setStats(tracker.getStats());
        setErrors(tracker.getErrors());
        return unsubscribe;
    }, [tracker, enabled, onError]);
    // Auto-track global errors
    React.useEffect(() => {
        if (!enabled || !autoTrack)
            return undefined;
        const handleError = (event) => {
            tracker.track({
                error: event.error instanceof Error
                    ? event.error
                    : new Error(String(event.error)),
                component,
            });
        };
        const handleUnhandledRejection = (event) => {
            tracker.track({
                error: event.reason instanceof Error
                    ? event.reason
                    : new Error(String(event.reason)),
                component,
                category: 'unknown',
            });
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('error', handleError);
            window.addEventListener('unhandledrejection', handleUnhandledRejection);
            return () => {
                window.removeEventListener('error', handleError);
                window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            };
        }
        return undefined;
    }, [enabled, autoTrack, component, tracker]);
    const track = React.useCallback((error, trackOptions) => {
        return tracker.track({
            error,
            component,
            ...trackOptions,
        });
    }, [tracker, component]);
    const trackRecovery = React.useCallback((eventId, recoveryOptions) => {
        const result = tracker.trackRecovery(eventId, recoveryOptions);
        setStats(tracker.getStats());
        setErrors(tracker.getErrors());
        return result;
    }, [tracker]);
    const resolve = React.useCallback((eventId) => {
        const result = tracker.resolve(eventId);
        setStats(tracker.getStats());
        setErrors(tracker.getErrors());
        return result;
    }, [tracker]);
    const getRecommendations = React.useCallback(() => {
        return tracker.getRecommendations();
    }, [tracker]);
    const clear = React.useCallback(() => {
        tracker.clear();
        setStats(tracker.getStats());
        setErrors([]);
    }, [tracker]);
    const withErrorTracking = React.useCallback(async (fn, trackingOptions) => {
        const startTime = performance.now();
        let event = null;
        try {
            return await fn();
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            event = track(err);
            trackingOptions?.onError?.(err);
            throw error;
        }
        finally {
            if (event && trackingOptions?.recoveryStrategy) {
                const duration = performance.now() - startTime;
                trackRecovery(event.id, {
                    strategy: trackingOptions.recoveryStrategy,
                    successful: !event,
                    duration,
                });
            }
        }
    }, [track, trackRecovery]);
    const activeErrors = React.useMemo(() => {
        return errors.filter((e) => !e.resolved);
    }, [errors]);
    return {
        stats,
        errors,
        activeErrors,
        track,
        trackRecovery,
        resolve,
        getRecommendations,
        clear,
        withErrorTracking,
    };
}
/**
 * Error boundary hook
 */
export function useErrorBoundary(options) {
    const [error, setError] = React.useState(null);
    const tracker = useErrorTracker(options);
    const resetError = React.useCallback(() => {
        setError(null);
    }, []);
    const captureError = React.useCallback((err) => {
        setError(err);
        tracker.track(err);
    }, [tracker]);
    return {
        error,
        resetError,
        captureError,
        ...tracker,
    };
}
export default useErrorTracker;
//# sourceMappingURL=use-error-tracker.js.map