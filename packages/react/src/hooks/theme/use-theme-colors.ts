/**
 * useThemeColors Hook
 *
 * Convenience hook for accessing the current theme's colors.
 * Provides both the raw HSL values and computed hex values.
 *
 * @example
 * ```tsx
 * const { primary, background, isDark } = useThemeColors()
 *
 * // Use in inline styles
 * <div style={{ color: `hsl(${primary})` }}>
 *   Themed text
 * </div>
 *
 * // Or use hex values
 * const { hex } = useThemeColors()
 * <div style={{ backgroundColor: hex.primary }}>
 *   Primary background
 * </div>
 * ```
 */

import * as React from 'react'
import { useTheme } from '../../theme/ThemeProvider'
import { hslStringToHex } from '../../theme/color-utils'
import type { ColorConfig } from '../theme/theme-config'

/**
 * Color values in both HSL string and hex formats
 */
export interface ThemeColorValues {
  /** Primary brand color (HSL string without hsl()) */
  primary: string
  /** Primary foreground color */
  primaryForeground: string
  /** Secondary color */
  secondary: string
  /** Secondary foreground */
  secondaryForeground: string
  /** Background color */
  background: string
  /** Main foreground/text color */
  foreground: string
  /** Muted background */
  muted: string
  /** Muted foreground */
  mutedForeground: string
  /** Accent color */
  accent: string
  /** Accent foreground */
  accentForeground: string
  /** Card background */
  card: string
  /** Card foreground */
  cardForeground: string
  /** Border color */
  border: string
  /** Input border color */
  input: string
  /** Focus ring color */
  ring: string
  /** Destructive/error color */
  destructive: string
  /** Destructive foreground */
  destructiveForeground: string
  /** Popover background */
  popover: string
  /** Popover foreground */
  popoverForeground: string
}

/**
 * Return type for useThemeColors hook
 */
export interface UseThemeColorsReturn extends ThemeColorValues {
  /** Whether the current theme is dark mode */
  isDark: boolean
  /** Whether the current theme is light mode */
  isLight: boolean
  /** Current theme mode ('light' | 'dark') */
  mode: 'light' | 'dark'
  /** Theme name */
  themeName: string
  /** All colors as hex values */
  hex: ThemeColorValues
  /** Get a CSS variable value */
  getCSSVar: (colorName: keyof ThemeColorValues) => string
  /** Get an HSL color as a usable CSS value */
  getHSL: (colorName: keyof ThemeColorValues) => string
}

/**
 * Convert ColorConfig to ThemeColorValues
 */
function colorConfigToValues(colors: ColorConfig): ThemeColorValues {
  return {
    primary: colors.primary || '0 0% 0%',
    primaryForeground: colors.primaryForeground || '0 0% 100%',
    secondary: colors.secondary || '0 0% 96%',
    secondaryForeground: colors.secondaryForeground || '0 0% 9%',
    background: colors.background || '0 0% 100%',
    foreground: colors.foreground || '0 0% 3.9%',
    muted: colors.muted || '0 0% 96.1%',
    mutedForeground: colors.mutedForeground || '0 0% 45.1%',
    accent: colors.accent || '0 0% 96.1%',
    accentForeground: colors.accentForeground || '0 0% 9%',
    card: colors.card || '0 0% 100%',
    cardForeground: colors.cardForeground || '0 0% 3.9%',
    border: colors.border || '0 0% 89.8%',
    input: colors.input || '0 0% 89.8%',
    ring: colors.ring || '0 0% 3.9%',
    destructive: colors.destructive || '0 84.2% 60.2%',
    destructiveForeground: colors.destructiveForeground || '0 0% 98%',
    popover: colors.popover || '0 0% 100%',
    popoverForeground: colors.popoverForeground || '0 0% 3.9%',
  }
}

/**
 * Convert HSL strings to hex values
 */
function valuesToHex(values: ThemeColorValues): ThemeColorValues {
  const result: Partial<ThemeColorValues> = {}
  for (const [key, value] of Object.entries(values)) {
    try {
      result[key as keyof ThemeColorValues] = hslStringToHex(value)
    } catch {
      result[key as keyof ThemeColorValues] = '#000000'
    }
  }
  return result as ThemeColorValues
}

/**
 * Hook to access theme colors conveniently
 *
 * @returns Theme color values and utilities
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { primary, isDark, hex } = useThemeColors()
 *
 *   return (
 *     <div style={{
 *       backgroundColor: `hsl(${primary})`,
 *       color: isDark ? '#fff' : '#000'
 *     }}>
 *       <span>Hex: {hex.primary}</span>
 *     </div>
 *   )
 * }
 * ```
 */
export function useThemeColors(): UseThemeColorsReturn {
  const { resolvedTheme, mode } = useTheme()

  // Extract colors from resolved theme
  const colors = React.useMemo<ThemeColorValues>(() => {
    if (!resolvedTheme?.colors) {
      return colorConfigToValues({} as ColorConfig)
    }
    return colorConfigToValues(resolvedTheme.colors)
  }, [resolvedTheme])

  // Convert to hex values
  const hexColors = React.useMemo(() => valuesToHex(colors), [colors])

  // Helper to get CSS variable reference
  const getCSSVar = React.useCallback(
    (colorName: keyof ThemeColorValues): string => {
      const kebabName = colorName.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `var(--clarity-${kebabName})`
    },
    []
  )

  // Helper to get HSL as usable CSS value
  const getHSL = React.useCallback(
    (colorName: keyof ThemeColorValues): string => {
      return `hsl(${colors[colorName]})`
    },
    [colors]
  )

  return {
    ...colors,
    isDark: mode === 'dark',
    isLight: mode === 'light',
    mode,
    themeName: resolvedTheme?.name || 'unknown',
    hex: hexColors,
    getCSSVar,
    getHSL,
  }
}

export default useThemeColors
