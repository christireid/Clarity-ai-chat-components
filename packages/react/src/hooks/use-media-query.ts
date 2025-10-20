import * as React from 'react'

/**
 * Track media query matches with SSR support
 * 
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * const isDark = useMediaQuery('(prefers-color-scheme: dark)')
 * const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
 * 
 * return isMobile ? <MobileNav /> : <DesktopNav />
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    
    // Update state if query result changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Set initial value
    setMatches(mediaQuery.matches)

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [query])

  return matches
}

/**
 * Get current breakpoint based on Tailwind's defaults
 * 
 * @example
 * ```tsx
 * const breakpoint = useBreakpoint()
 * 
 * // Returns: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'base'
 * return breakpoint === 'md' ? <TabletView /> : <MobileView />
 * ```
 */
export function useBreakpoint(): 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  const is2xl = useMediaQuery('(min-width: 1536px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isMd = useMediaQuery('(min-width: 768px)')
  const isSm = useMediaQuery('(min-width: 640px)')

  if (is2xl) return '2xl'
  if (isXl) return 'xl'
  if (isLg) return 'lg'
  if (isMd) return 'md'
  if (isSm) return 'sm'
  return 'base'
}
