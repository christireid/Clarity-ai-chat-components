/**
 * Skeleton Theme System
 */

import * as React from 'react'
import type { SkeletonTheme, SkeletonThemeProviderProps } from '../types'

export const SkeletonThemeContext = React.createContext<SkeletonTheme>({})

export const SkeletonThemeProvider: React.FC<SkeletonThemeProviderProps> = ({
  theme = {},
  children,
}) => {
  const effectiveTheme = React.useMemo(
    () => ({
      primaryColor: '#f1f5f9',
      secondaryColor: '#e2e8f0',
      animationSpeed: 1500,
      borderRadius: 4,
      reducedMotion: false,
      ...theme,
    }),
    [theme]
  )

  React.useEffect(() => {
    if (theme.reducedMotion && typeof window !== 'undefined') {
      document.documentElement.style.setProperty(
        '--skeleton-reduced-motion',
        '1'
      )
    }
  }, [theme.reducedMotion])

  return (
    <SkeletonThemeContext.Provider value={effectiveTheme}>
      {children}
    </SkeletonThemeContext.Provider>
  )
}

export const useSkeletonTheme = () => React.useContext(SkeletonThemeContext)
