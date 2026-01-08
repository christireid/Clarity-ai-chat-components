'use client';
import * as React from 'react';
/**
 * Smart throttle hook with token optimization tracking
 *
 * @example
 * ```tsx
 * function SearchInput() {
 *   const [query, setQuery] = useState('')
 *   const {
 *     throttledValue,
 *     isThrottled,
 *     callsSaved,
 *   } = useSmartThrottle({
 *     delay: 500,
 *     adaptive: true,
 *     minLength: 3,
 *     trackSavings: true,
 *   })
 *
 *   React.useEffect(() => {
 *     if (throttledValue) {
 *       // Only execute when throttled value updates
 *       performSearch(throttledValue)
 *     }
 *   }, [throttledValue])
 *
 *   return (
 *     <div>
 *       <input
 *         value={query}
 *         onChange={(e) => setQuery(e.target.value)}
 *       />
 *       {isThrottled && <span>Waiting...</span>}
 *       <div>API calls saved: {callsSaved}</div>
 *     </div>
 *   )
 * }
 * ```
 */
export function useSmartThrottle(options = {}) {
    const { delay: baseDelay = 500, adaptive = true, minLength = 0, cancelOnNew = false, trackSavings = true, onThrottle, onExecute, } = options;
    const [currentValue, setCurrentValue] = React.useState();
    const [throttledValue, setThrottledValue] = React.useState();
    const [isThrottled, setIsThrottled] = React.useState(false);
    const [stats, setStats] = React.useState({
        throttleCount: 0,
        totalInputs: 0,
    });
    const timerRef = React.useRef(undefined);
    const lastExecutionRef = React.useRef(0);
    const execute = React.useCallback(() => {
        setThrottledValue(currentValue);
        setIsThrottled(false);
        lastExecutionRef.current = Date.now();
        onExecute?.(currentValue);
    }, [currentValue, onExecute]);
    const setValue = React.useCallback((value) => {
        setCurrentValue(value);
        // Track input
        if (trackSavings) {
            setStats((prev) => ({
                ...prev,
                totalInputs: prev.totalInputs + 1,
            }));
        }
        // Check minimum length
        if (minLength > 0 && typeof value === 'string' && value.length < minLength) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            setIsThrottled(false);
            return;
        }
        // Cancel previous timer if cancelOnNew is true
        if (cancelOnNew && timerRef.current) {
            clearTimeout(timerRef.current);
            if (trackSavings) {
                setStats((prev) => ({
                    ...prev,
                    throttleCount: prev.throttleCount + 1,
                }));
            }
        }
        // Calculate adaptive delay
        let effectiveDelay = baseDelay;
        if (adaptive && typeof value === 'string') {
            // Longer delay for shorter inputs (user still typing)
            const length = value.length;
            if (length < 10) {
                effectiveDelay = baseDelay * 1.5;
            }
            else if (length < 20) {
                effectiveDelay = baseDelay * 1.2;
            }
        }
        setIsThrottled(true);
        onThrottle?.();
        // Schedule execution
        timerRef.current = setTimeout(() => {
            execute();
        }, effectiveDelay);
    }, [
        baseDelay,
        adaptive,
        minLength,
        cancelOnNew,
        trackSavings,
        execute,
        onThrottle,
    ]);
    const executeNow = React.useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        execute();
    }, [execute]);
    const cancel = React.useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = undefined;
        }
        setIsThrottled(false);
    }, []);
    const resetStats = React.useCallback(() => {
        setStats({
            throttleCount: 0,
            totalInputs: 0,
        });
    }, []);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);
    // Calculate calls saved (inputs that were throttled/cancelled)
    const callsSaved = stats.throttleCount;
    return {
        throttledValue,
        isThrottled,
        setValue,
        executeNow,
        cancel,
        throttleCount: stats.throttleCount,
        callsSaved,
        resetStats,
    };
}
/**
 * Hook for throttling streaming responses to prevent rapid-fire requests
 */
export function useStreamThrottle(delay = 300) {
    const [isReady, setIsReady] = React.useState(true);
    const timerRef = React.useRef(undefined);
    const throttle = React.useCallback(() => {
        setIsReady(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = undefined;
        }
        timerRef.current = setTimeout(() => {
            setIsReady(true);
            timerRef.current = undefined;
        }, delay);
    }, [delay]);
    const reset = React.useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = undefined;
        }
        setIsReady(true);
    }, []);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = undefined;
            }
        };
    }, []);
    return {
        isReady,
        throttle,
        reset,
    };
}
//# sourceMappingURL=use-smart-throttle.js.map