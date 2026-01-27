import * as React from 'react'

/**
 * Hook to listen to and apply accessibility preferences
 * Handles high contrast mode and forced colors mode (Windows High Contrast)
 */
export function useAccessibilityPreferences() {
  // Listen to high contrast mode preference (WCAG 2.4.3)
  React.useEffect(() => {
    const highContrastQuery = window.matchMedia('(prefers-contrast: more)')

    const updateContrastMode = () => {
      if (highContrastQuery.matches) {
        document.documentElement.classList.add('high-contrast')
        // Apply high contrast adjustments via CSS
        document.documentElement.style.setProperty('--primary', '214 90% 35%') // Darker for more contrast
        document.documentElement.style.setProperty('--border', '216 22% 50%') // Darker borders
      } else {
        document.documentElement.classList.remove('high-contrast')
        // Remove inline styles to let theme control colors
        document.documentElement.style.removeProperty('--primary')
        document.documentElement.style.removeProperty('--border')
      }
    }

    updateContrastMode()

    // Listen for changes
    highContrastQuery.addEventListener('change', updateContrastMode)
    return () =>
      highContrastQuery.removeEventListener('change', updateContrastMode)
  }, [])

  // Listen to forced colors mode (Windows High Contrast)
  React.useEffect(() => {
    const forcedColorsQuery = window.matchMedia('(forced-colors: active)')

    const updateForcedColorsMode = () => {
      if (forcedColorsQuery.matches) {
        document.documentElement.classList.add('forced-colors')
        // In forced colors mode, let the OS control all colors
        // Remove custom colors to allow system colors
      } else {
        document.documentElement.classList.remove('forced-colors')
      }
    }

    updateForcedColorsMode()

    // Listen for changes
    forcedColorsQuery.addEventListener('change', updateForcedColorsMode)
    return () =>
      forcedColorsQuery.removeEventListener('change', updateForcedColorsMode)
  }, [])
}
