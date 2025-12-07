import { useEffect, useRef } from 'react'

type ResizeCallback = () => void

/**
 * Hook to handle window resize events with debouncing.
 * Useful for expensive operations that shouldn't run on every resize event.
 *
 * @param callback - Function to call on resize (debounced)
 * @param delay - Debounce delay in milliseconds (default: 150ms)
 * @param enabled - Whether the resize listener is enabled (default: true)
 *
 * @example
 * ```tsx
 * useWindowResize(() => {
 *   // Handle resize
 * }, 150)
 * ```
 */
export function useWindowResize(
  callback: ResizeCallback,
  delay: number = 150,
  enabled: boolean = true
): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const callbackRef = useRef(callback)
  const isMountedRef = useRef(true)

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    isMountedRef.current = true

    if (!enabled || typeof window === 'undefined') return

    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          callbackRef.current()
        }
      }, delay)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      isMountedRef.current = false
    }
  }, [delay, enabled])
}
