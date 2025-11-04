/**
 * Options for error handler configuration
 */
export interface UseErrorHandlerOptions {
    /** Whether to log errors to console (default: true in development) */
    logErrors?: boolean;
    /** Whether to show toast notifications for errors (default: false) */
    showToast?: boolean;
    /** Custom error handler function */
    onError?: (error: Error) => void;
}
/**
 * Hook for centralized error handling with logging and notifications
 *
 * @example
 * ```tsx
 * const { handleError } = useErrorHandler({
 *   logErrors: true,
 *   showToast: true,
 *   onError: (error) => {
 *     // Send to error tracking service
 *     Sentry.captureException(error)
 *   }
 * })
 *
 * try {
 *   await riskyOperation()
 * } catch (error) {
 *   handleError(error)
 * }
 * ```
 */
export declare function useErrorHandler(options?: UseErrorHandlerOptions): {
    /** Handle an error with logging and notifications */
    handleError: (error: unknown) => void;
};
//# sourceMappingURL=useErrorHandler.d.ts.map