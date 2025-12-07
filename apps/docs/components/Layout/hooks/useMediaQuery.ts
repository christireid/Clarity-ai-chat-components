import { useEffect, useState } from 'react'

/**
 * Custom hook for tracking media query matches
 * Handles SSR safety and cleanup automatically
 *
 * @param query - Media query string (e.g., '(prefers-reduced-motion: reduce)')
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  // Return false during SSR to prevent hydration mismatch
  if (!mounted) {
    return false
  }

  return matches
}
