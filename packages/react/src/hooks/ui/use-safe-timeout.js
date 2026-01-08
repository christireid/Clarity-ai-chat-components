'use client';
import { useCallback, useEffect, useRef } from 'react';
/**
 * Hook for managing timeouts with automatic cleanup on unmount
 *
 * This hook solves the common memory leak pattern where setTimeout callbacks
 * fire after a component unmounts, potentially causing "setState on unmounted
 * component" warnings or other issues.
 *
 * @returns Object with setSafeTimeout, clearSafeTimeout, and clearAllTimeouts functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { setSafeTimeout, clearSafeTimeout } = useSafeTimeout()
 *
 *   const handleClick = () => {
 *     setSafeTimeout(() => {
 *       // This won't fire if component unmounts
 *       setShowMessage(false)
 *     }, 3000)
 *   }
 *
 *   return <button onClick={handleClick}>Show Message</button>
 * }
 * ```
 */
export function useSafeTimeout() {
    const timeoutIds = useRef(new Set());
    const setSafeTimeout = useCallback((callback, delay) => {
        const id = setTimeout(() => {
            timeoutIds.current.delete(id);
            callback();
        }, delay);
        timeoutIds.current.add(id);
        return id;
    }, []);
    const clearSafeTimeout = useCallback((id) => {
        clearTimeout(id);
        timeoutIds.current.delete(id);
    }, []);
    const clearAllTimeouts = useCallback(() => {
        timeoutIds.current.forEach(clearTimeout);
        timeoutIds.current.clear();
    }, []);
    // Cleanup all timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutIds.current.forEach(clearTimeout);
            timeoutIds.current.clear();
        };
    }, []);
    return { setSafeTimeout, clearSafeTimeout, clearAllTimeouts };
}
/**
 * Hook for managing intervals with automatic cleanup on unmount
 *
 * @returns Object with setSafeInterval, clearSafeInterval, and clearAllIntervals functions
 *
 * @example
 * ```tsx
 * function PollingComponent() {
 *   const { setSafeInterval } = useSafeInterval()
 *
 *   useEffect(() => {
 *     setSafeInterval(() => {
 *       // This won't fire after unmount
 *       fetchData()
 *     }, 5000)
 *   }, [setSafeInterval])
 * }
 * ```
 */
export function useSafeInterval() {
    const intervalIds = useRef(new Set());
    const setSafeInterval = useCallback((callback, delay) => {
        const id = setInterval(callback, delay);
        intervalIds.current.add(id);
        return id;
    }, []);
    const clearSafeInterval = useCallback((id) => {
        clearInterval(id);
        intervalIds.current.delete(id);
    }, []);
    const clearAllIntervals = useCallback(() => {
        intervalIds.current.forEach(clearInterval);
        intervalIds.current.clear();
    }, []);
    // Cleanup all intervals on unmount
    useEffect(() => {
        return () => {
            intervalIds.current.forEach(clearInterval);
            intervalIds.current.clear();
        };
    }, []);
    return { setSafeInterval, clearSafeInterval, clearAllIntervals };
}
/**
 * Hook for managing requestAnimationFrame with automatic cleanup on unmount
 *
 * @returns Object with requestSafeAnimationFrame, cancelSafeAnimationFrame, and cancelAllAnimationFrames
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const { requestSafeAnimationFrame } = useSafeAnimationFrame()
 *
 *   const animate = () => {
 *     // Animation logic
 *     requestSafeAnimationFrame(animate)
 *   }
 *
 *   useEffect(() => {
 *     requestSafeAnimationFrame(animate)
 *   }, [requestSafeAnimationFrame])
 * }
 * ```
 */
export function useSafeAnimationFrame() {
    const frameIds = useRef(new Set());
    const requestSafeAnimationFrame = useCallback((callback) => {
        const id = requestAnimationFrame((time) => {
            frameIds.current.delete(id);
            callback(time);
        });
        frameIds.current.add(id);
        return id;
    }, []);
    const cancelSafeAnimationFrame = useCallback((id) => {
        cancelAnimationFrame(id);
        frameIds.current.delete(id);
    }, []);
    const cancelAllAnimationFrames = useCallback(() => {
        frameIds.current.forEach(cancelAnimationFrame);
        frameIds.current.clear();
    }, []);
    // Cleanup all frames on unmount
    useEffect(() => {
        return () => {
            frameIds.current.forEach(cancelAnimationFrame);
            frameIds.current.clear();
        };
    }, []);
    return {
        requestSafeAnimationFrame,
        cancelSafeAnimationFrame,
        cancelAllAnimationFrames,
    };
}
//# sourceMappingURL=use-safe-timeout.js.map