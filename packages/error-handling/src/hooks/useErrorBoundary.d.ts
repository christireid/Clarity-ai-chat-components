/**
 * Hook for programmatic error throwing to nearest error boundary
 *
 * @example
 * ```tsx
 * const { showBoundary, resetBoundary } = useErrorBoundary()
 *
 * const handleCriticalError = () => {
 *   showBoundary(new Error('Critical failure'))
 * }
 * ```
 */
export declare function useErrorBoundary(): {
    /** Current error, if any */
    error: Error | null;
    /** Throw an error to be caught by the nearest error boundary */
    showBoundary: (error: Error) => never;
    /** Reset the error boundary state */
    resetBoundary: () => void;
};
//# sourceMappingURL=useErrorBoundary.d.ts.map