import { useEffect, useState } from 'react'

/**
 * Hook to detect and track user's reduced motion preference.
 * Respects the `prefers-reduced-motion` media query for accessibility.
 *
 * @returns `true` if user prefers reduced motion, `false` otherwise
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 * if (prefersReducedMotion) {
 *   // Disable animations
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches)
      }

      // Use addEventListener for modern browsers, fallback for older ones
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    } catch (error) {
      // Silently fail if matchMedia is not supported
      console.warn('prefers-reduced-motion media query not supported:', error)
    }
  }, [])

  return reducedMotion
}
