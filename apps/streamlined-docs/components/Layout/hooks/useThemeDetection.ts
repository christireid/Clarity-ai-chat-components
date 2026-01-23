import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

/**
 * Custom hook for detecting dark mode with system preference fallback
 * Handles SSR safety and theme changes automatically
 *
 * @returns Whether dark mode is active
 */
export function useThemeDetection(): boolean {
  const { resolvedTheme } = useTheme()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (typeof window === 'undefined') {
      return
    }

    const determineTheme = () => {
      if (resolvedTheme === 'dark') {
        setIsDarkMode(true)
      } else if (resolvedTheme === 'light') {
        setIsDarkMode(false)
      } else {
        // Fallback to system preference
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setIsDarkMode(darkModeQuery.matches)
      }
    }

    determineTheme()

    // Only listen to system preference if resolvedTheme is not explicitly set
    if (!resolvedTheme) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleThemeChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches)
      }

      darkModeQuery.addEventListener('change', handleThemeChange)

      return () => {
        darkModeQuery.removeEventListener('change', handleThemeChange)
      }
    }
  }, [resolvedTheme])

  // Return false during SSR to prevent hydration mismatch
  if (!mounted) {
    return false
  }

  return isDarkMode
}
