import { useMemo, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

/**
 * Hook to safely detect the current theme mode (dark/light) with SSR support.
 * 
 * @returns `true` if dark mode is active, `false` for light mode
 * 
 * @example
 * ```tsx
 * const isDark = useThemeMode()
 * const config = isDark ? darkConfig : lightConfig
 * ```
 */
export function useThemeMode(): boolean {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Compute isDark only when mounted
  const isDark = useMemo(() => {
    if (!mounted) return false
    return resolvedTheme === 'dark' || theme === 'dark'
  }, [mounted, resolvedTheme, theme])

  return isDark
}
