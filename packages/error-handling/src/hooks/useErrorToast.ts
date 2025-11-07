import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Toast notification configuration
 */
export interface ErrorToast {
  id: string
  message: string
  type: 'error' | 'warning' | 'info'
  duration?: number
}

/**
 * Hook for managing error toast notifications
 * 
 * @example
 * ```tsx
 * const { toasts, showToast, hideToast, clearAll } = useErrorToast()
 * 
 * // Show an error toast
 * showToast('Something went wrong', 'error', 5000)
 * 
 * // Render toasts
 * {toasts.map(toast => (
 *   <ErrorToast
 *     key={toast.id}
 *     message={toast.message}
 *     type={toast.type}
 *     onClose={() => hideToast(toast.id)}
 *   />
 * ))}
 * ```
 */
export function useErrorToast() {
  const [toasts, setToasts] = useState<ErrorToast[]>([])

  // Track timeouts to cleanup on unmount
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
      timeoutRefs.current.clear()
    }
  }, [])

  const showToast = useCallback(
    (
      message: string,
      type: 'error' | 'warning' | 'info' = 'error',
      duration: number = 5000
    ) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      const toast: ErrorToast = { id, message, type, duration }

      setToasts((prev) => [...prev, toast])

      // Auto-dismiss after duration
      if (duration > 0) {
        const timeout = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
          timeoutRefs.current.delete(id)
        }, duration)
        timeoutRefs.current.set(id, timeout)
      }

      return id
    },
    []
  )

  const hideToast = useCallback((id: string) => {
    // Clear timeout if toast is manually dismissed
    const timeout = timeoutRefs.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutRefs.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    /** Array of active toasts */
    toasts,
    /** Show a new toast notification */
    showToast,
    /** Hide a specific toast */
    hideToast,
    /** Clear all toasts */
    clearAll,
  }
}
