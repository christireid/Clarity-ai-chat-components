/**
 * useRetryWithBackoff - React Hook for Retry with Exponential Backoff
 *
 * Provides React-friendly retry functionality with state tracking,
 * automatic cleanup, and abort support.
 *
 * @example
 * ```tsx
 * const { execute, isRetrying, attempt, cancel, lastError } = useRetryWithBackoff({
 *   maxRetries: 3,
 *   baseDelay: 1000,
 *   onRetry: (attempt, delay) => {
 *     toast.info(`Retrying... (attempt ${attempt})`)
 *   },
 * })
 *
 * const handleSubmit = async () => {
 *   try {
 *     const { result } = await execute(() => submitForm(data))
 *     toast.success('Submitted!')
 *   } catch (error) {
 *     toast.error('Failed after all retries')
 *   }
 * }
 * ```
 */
'use client';
import * as React from 'react';
import { retryWithBackoff, } from '../../utils/resilience/retry-with-backoff';
/**
 * React hook for retry with exponential backoff
 *
 * Automatically handles cleanup on unmount and provides React-friendly state.
 *
 * @param options - Retry configuration
 * @returns Retry controls and state
 */
export function useRetryWithBackoff(options = {}) {
    const { onRetry: userOnRetry, ...retryOptions } = options;
    const [isRetrying, setIsRetrying] = React.useState(false);
    const [attempt, setAttempt] = React.useState(0);
    const [lastError, setLastError] = React.useState(null);
    // AbortController for cancellation
    const controllerRef = React.useRef(null);
    const mountedRef = React.useRef(true);
    // Track mounted state
    React.useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            // Cancel on unmount
            controllerRef.current?.abort();
        };
    }, []);
    // Cancel function
    const cancel = React.useCallback(() => {
        controllerRef.current?.abort();
        controllerRef.current = null;
        if (mountedRef.current) {
            setIsRetrying(false);
            setAttempt(0);
        }
    }, []);
    // Reset function
    const reset = React.useCallback(() => {
        cancel();
        setLastError(null);
    }, [cancel]);
    // Execute with retry
    const execute = React.useCallback(async (fn) => {
        // Cancel any existing operation
        cancel();
        // Create new controller
        controllerRef.current = new AbortController();
        if (mountedRef.current) {
            setIsRetrying(true);
            setAttempt(0);
            setLastError(null);
        }
        try {
            const result = await retryWithBackoff(fn, {
                ...retryOptions,
                signal: controllerRef.current.signal,
                onRetry: (attemptNum, delay, error) => {
                    if (mountedRef.current) {
                        setAttempt(attemptNum);
                        setLastError(error);
                    }
                    userOnRetry?.(attemptNum, delay, error);
                },
            });
            if (mountedRef.current) {
                setIsRetrying(false);
                setAttempt(0);
            }
            return result;
        }
        catch (error) {
            if (mountedRef.current) {
                setIsRetrying(false);
                setLastError(error);
            }
            throw error;
        }
        finally {
            controllerRef.current = null;
        }
    }, [retryOptions, userOnRetry, cancel]);
    return {
        execute,
        isRetrying,
        attempt,
        cancel,
        lastError,
        reset,
    };
}
//# sourceMappingURL=use-retry-with-backoff.js.map