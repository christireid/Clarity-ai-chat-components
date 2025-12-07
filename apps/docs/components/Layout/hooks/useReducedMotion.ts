import { useEffect, useState } from 'react'

/**
 * Hook to detect and listen for changes to the `prefers-reduced-motion` media query.
 * 
 * @returns `true` if the user prefers reduced motion, `false` otherwise
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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }

      // Use addEventListener for better browser support
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    } catch {
      // Silently fail - reduced motion check is not critical
      // Default to false (no reduced motion) if API is unavailable
    }
  }, [])

  return prefersReducedMotion
}
