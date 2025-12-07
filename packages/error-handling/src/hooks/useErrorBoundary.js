import { useCallback, useState } from 'react';
/**
 * Hook for programmatic error throwing to nearest error boundary
 * Uses React's error throwing mechanism to trigger the nearest error boundary.
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
export function useErrorBoundary() {
    const [error, setError] = useState(null);
    // Throw during render if error is set
    if (error) {
        throw error;
    }
    const showBoundary = useCallback((error) => {
        // Setting state will trigger re-render, which will throw in the render phase
        setError(error);
    }, []);
    const resetBoundary = useCallback(() => {
        setError(null);
    }, []);
    return {
        /** Current error, if any */
        error,
        /** Throw an error to be caught by the nearest error boundary */
        showBoundary,
        /** Reset the error boundary state */
        resetBoundary,
    };
}
//# sourceMappingURL=useErrorBoundary.js.map