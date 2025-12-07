'use client'

import { useMemo } from 'react'
import { useTheme } from 'next-themes'
import { useMounted } from './useMounted'

/**
 * Hook to determine if dark mode is currently active
 * SSR-safe and handles system theme preference
 * 
 * @returns boolean indicating if dark mode is active
 * 
 * @example
 * ```tsx
 * const isDark = useIsDark()
 * const color = isDark ? '#60a5fa' : '#3b82f6'
 * ```
 */
export function useIsDark(): boolean {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()

  return useMemo(() => {
    if (!mounted || typeof window === 'undefined') return false
    if (!resolvedTheme) return false

    if (resolvedTheme === 'dark') return true
    if (resolvedTheme === 'system') {
      try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      } catch {
        return false
      }
    }
    return false
  }, [mounted, resolvedTheme])
}
