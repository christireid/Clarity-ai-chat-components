/**
 * Options for async error handling with retry logic
 */
export interface UseAsyncErrorOptions {
    /** Maximum number of retry attempts (default: 3) */
    maxRetries?: number;
    /** Delay between retries in milliseconds (default: 1000) */
    retryDelay?: number;
    /** Callback function when an error occurs */
    onError?: (error: Error) => void;
    /** Callback function when operation succeeds */
    onSuccess?: () => void;
}
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
export declare function useAsyncError<T = any>(): {
    /** Current error, if any */
    error: Error | null;
    /** Whether an async operation is in progress */
    isLoading: boolean;
    /** Current retry attempt count */
    retryCount: number;
    /** Execute an async function with retry logic */
    executeAsync: (asyncFn: () => Promise<T>, options?: UseAsyncErrorOptions) => Promise<T | null>;
    /** Reset error state */
    reset: () => void;
};
//# sourceMappingURL=useAsyncError.d.ts.map