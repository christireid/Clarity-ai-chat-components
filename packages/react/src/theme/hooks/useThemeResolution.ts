import * as React from 'react'
import type { CompleteThemeConfig } from '../theme-config'
import type { ThemeConfig, ThemePresetName } from '../theme-types'
import { modernThemes, isValidModernThemeName } from '../modern-presets'
import {
  createTheme as createThemeLegacy,
  applyThemeToDocument,
} from '../theme-builder'
import { createTheme as createThemeModern } from '../create-theme'
import { getMotionSafeDuration } from '../../animations/motion-safe'
import { animationSpeedMap } from '../ThemeProvider.utils'

/**
 * Hook to resolve theme configuration and mode
 */
export function useThemeResolution(
  theme: ThemeConfig,
  prefersReducedMotion: boolean,
  animationSpeed: 'none' | 'fast' | 'normal' | 'slow'
) {
  // Resolve actual mode (light/dark) from system preference if needed
  const [resolvedMode, setResolvedMode] = React.useState<'light' | 'dark'>(
    'light'
  )

  // Resolved theme configuration
  const [resolvedTheme, setResolvedTheme] =
    React.useState<CompleteThemeConfig | null>(null)

  // Helper to get theme by preset name
  const getThemeByPreset = React.useCallback(
    (preset: ThemePresetName): CompleteThemeConfig => {
      if (isValidModernThemeName(preset)) {
        return modernThemes[preset]
      }
      // Warn about invalid preset and fallback to default
      if (process.env['NODE_ENV'] === 'development') {
        console.warn(
          `[Clarity Chat] Unknown theme preset "${preset}". ` +
            `Available presets: ${Object.keys(modernThemes).join(', ')}. ` +
            `Falling back to "default".`
        )
      }
      return modernThemes['default']
    },
    []
  )

  // Listen to system preference changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateMode = () => {
      if (theme.mode === 'system') {
        setResolvedMode(mediaQuery.matches ? 'dark' : 'light')
      } else {
        setResolvedMode(theme.mode)
      }
    }

    updateMode()

    // Listen for changes
    mediaQuery.addEventListener('change', updateMode)
    return () => mediaQuery.removeEventListener('change', updateMode)
  }, [theme.mode])

  // Build complete theme configuration
  React.useEffect(() => {
    let complete: CompleteThemeConfig

    // If custom theme provided, use it
    if (theme.customTheme) {
      complete = theme.customTheme
    }
    // If simple config provided (modern API), use it
    else if (theme.simpleConfig) {
      complete = createThemeModern(theme.simpleConfig)
    }
    // If preset specified, load it
    else if (theme.preset) {
      const baseTheme = getThemeByPreset(theme.preset)
      complete = theme.customizations
        ? createThemeLegacy(baseTheme, theme.customizations)
        : baseTheme
    }
    // Otherwise, use default based on resolved mode
    else {
      const defaultPreset = resolvedMode === 'dark' ? 'default-dark' : 'default'
      complete = modernThemes[defaultPreset]
    }

    setResolvedTheme(complete)
  }, [theme, resolvedMode, getThemeByPreset])

  // Apply theme to document
  React.useEffect(() => {
    if (!resolvedTheme) return

    const root = document.documentElement
    // Disable transitions if user prefers reduced motion, explicitly disabled, or animation is 'none'
    const enableTransitions =
      theme.enableTransitions !== false &&
      !prefersReducedMotion &&
      animationSpeed !== 'none'

    // Use animationSpeed prop, but allow theme.transitionDuration to override if set
    const baseTransitionDuration =
      theme.transitionDuration || animationSpeedMap[animationSpeed]
    const transitionDuration = getMotionSafeDuration(
      prefersReducedMotion,
      baseTransitionDuration
    )

    // Add transition class for smooth color changes
    if (enableTransitions) {
      root.style.setProperty(
        '--theme-transition-duration',
        `${transitionDuration}ms`
      )
      root.classList.add('theme-transitioning')
    }

    // Apply theme
    applyThemeToDocument(resolvedTheme)

    // Remove transition class after animation completes
    if (enableTransitions) {
      const timeout = setTimeout(() => {
        root.classList.remove('theme-transitioning')
      }, transitionDuration)

      return () => clearTimeout(timeout)
    }
    return undefined
  }, [
    resolvedTheme,
    theme.enableTransitions,
    theme.transitionDuration,
    prefersReducedMotion,
    animationSpeed,
  ])

  return {
    resolvedMode,
    resolvedTheme,
    getThemeByPreset,
  }
}
