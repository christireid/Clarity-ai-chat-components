import { useCallback, useState } from 'react'

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
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null)

  const showBoundary = useCallback((error: Error) => {
    setError(error)
    // This will be caught by the nearest error boundary
    throw error
  }, [])

  const resetBoundary = useCallback(() => {
    setError(null)
  }, [])

  return {
    /** Current error, if any */
    error,
    /** Throw an error to be caught by the nearest error boundary */
    showBoundary,
    /** Reset the error boundary state */
    resetBoundary,
  }
}
