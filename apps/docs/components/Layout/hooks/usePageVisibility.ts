import { useEffect, useRef } from 'react'

type VisibilityCallback = (isHidden: boolean) => void

/**
 * Hook to handle page visibility changes (when tab becomes hidden/visible).
 * Useful for pausing/resuming animations or other expensive operations.
 *
 * @param callback - Function called with `true` when hidden, `false` when visible
 * @param enabled - Whether the visibility listener is enabled (default: true)
 *
 * @example
 * ```tsx
 * usePageVisibility((isHidden) => {
 *   if (isHidden) {
 *     // Pause animations
 *   } else {
 *     // Resume animations
 *   }
 * })
 * ```
 */
export function usePageVisibility(
  callback: VisibilityCallback,
  enabled: boolean = true
): void {
  const callbackRef = useRef(callback)
  const isMountedRef = useRef(true)

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    isMountedRef.current = true

    if (!enabled || typeof document === 'undefined') return

    const handleVisibilityChange = () => {
      if (isMountedRef.current) {
        callbackRef.current(document.hidden)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      isMountedRef.current = false
    }
  }, [enabled])
}
