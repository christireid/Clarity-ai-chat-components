import { useState, useCallback } from 'react';
/**
 * Hook for handling async operations with automatic retry logic and exponential backoff
 *
 * @example
 * ```tsx
 * const { executeAsync, isLoading, error, retryCount } = useAsyncError()
 *
 * const fetchData = async () => {
 *   const result = await executeAsync(
 *     async () => {
 *       const res = await fetch('/api/data')
 *       if (!res.ok) throw new Error('Request failed')
 *       return res.json()
 *     },
 *     { maxRetries: 3, retryDelay: 1000 }
 *   )
 * }
 * ```
 */
export function useAsyncError() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const reset = useCallback(() => {
        setError(null);
        setIsLoading(false);
        setRetryCount(0);
    }, []);
    const executeAsync = useCallback(async (asyncFn, options) => {
        const { maxRetries = 3, retryDelay = 1000, onError, onSuccess, } = options || {};
        setIsLoading(true);
        setError(null);
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const result = await asyncFn();
                setIsLoading(false);
                setRetryCount(0);
                onSuccess?.();
                return result;
            }
            catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                setRetryCount(attempt + 1);
                // If we haven't exhausted retries, wait and try again
                if (attempt < maxRetries) {
                    // Exponential backoff: 1s, 2s, 4s, etc. (proper exponential)
                    const backoffDelay = retryDelay * Math.pow(2, attempt);
                    await new Promise((resolve) => setTimeout(resolve, backoffDelay));
                }
                else {
                    // Final failure after all retries
                    setError(error);
                    setIsLoading(false);
                    onError?.(error);
                    return null;
                }
            }
        }
        // Should never reach here, but TypeScript needs it
        setIsLoading(false);
        return null;
    }, [] // Options are passed per call, so no deps needed
    );
    return {
        /** Current error, if any */
        error,
        /** Whether an async operation is in progress */
        isLoading,
        /** Current retry attempt count */
        retryCount,
        /** Execute an async function with retry logic */
        executeAsync,
        /** Reset error state */
        reset,
    };
}
//# sourceMappingURL=useAsyncError.js.map