/**
 * Theme Builder Utilities
 *
 * Utilities for creating, customizing, and exporting themes
 */

import type {
  CompleteThemeConfig,
  PartialThemeConfig,
  ColorConfig,
  ExportableTheme,
  ThemeMetadata,
} from './theme-config'
import {
  modernThemes,
  modernThemeMetadata,
  type ModernThemePresetName,
} from './modern-presets'
import {
  hslToRGB,
  rgbToHSL,
  rgbToHex,
  adjustLightness as adjustLightnessUtil,
  getContrastRatio as getContrastRatioUtil,
  getLuminance,
} from './color-utils'

// Re-export for backwards compatibility
export type ThemePresetName = ModernThemePresetName

// Use modern themes as the themes registry
const themes = modernThemes
const themeMetadata = modernThemeMetadata

/**
 * Deep merge two objects
 */
function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target }

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(result[key] || ({} as any), source[key]!)
    } else if (source[key] !== undefined) {
      result[key] = source[key]!
    }
  }

  return result
}

/**
 * Create a complete theme from a base theme and customizations
 */
export function createTheme(
  baseTheme: ThemePresetName | CompleteThemeConfig,
  customizations?: PartialThemeConfig
): CompleteThemeConfig {
  const base = typeof baseTheme === 'string' ? themes[baseTheme] : baseTheme

  if (!customizations) {
    return base
  }

  return deepMerge(base, customizations as Partial<CompleteThemeConfig>)
}

/**
 * Convert HSL string to RGB object (wrapper for color-utils)
 */
function hslToRgb(hsl: string): { r: number; g: number; b: number } {
  const [hVal, sVal, lVal] = hsl.split(' ').map((v) => parseFloat(v))
  return hslToRGB({ h: hVal ?? 0, s: sVal ?? 0, l: lVal ?? 0 })
}

/**
 * Convert RGB to HSL string (wrapper for color-utils)
 */
function rgbToHsl(r: number, g: number, b: number): string {
  const hsl = rgbToHSL({ r, g, b })
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`
}

/**
 * Convert hex color to HSL string
 */
export function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '')

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return rgbToHsl(r, g, b)
}

/**
 * Convert HSL string to hex color
 */
export function hslToHex(hsl: string): string {
  const { r, g, b } = hslToRgb(hsl)
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

/**
 * Lighten or darken an HSL color (wrapper for color-utils)
 */
export function adjustLightness(hsl: string, amount: number): string {
  return adjustLightnessUtil(hsl, amount)
}

/**
 * Calculate contrast ratio between two HSL colors (wrapper for color-utils)
 */
export function getContrastRatio(hsl1: string, hsl2: string): number {
  return getContrastRatioUtil(hsl1, hsl2)
}

/**
 * Check if contrast ratio meets WCAG AA or AAA standards
 */
export function checkContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): { passes: boolean; ratio: number; required: number } {
  const ratio = getContrastRatio(foreground, background)

  let required: number
  if (level === 'AAA') {
    required = isLargeText ? 4.5 : 7
  } else {
    required = isLargeText ? 3 : 4.5
  }

  return {
    passes: ratio >= required,
    ratio,
    required,
  }
}

/**
 * Generate foreground color with sufficient contrast
 */
export function generateForegroundColor(
  background: string,
  targetRatio: number = 7
): string {
  // Try white first
  const whiteContrast = getContrastRatio('0 0% 100%', background)
  if (whiteContrast >= targetRatio) {
    return '0 0% 100%'
  }

  // Try black
  const blackContrast = getContrastRatio('0 0% 0%', background)
  if (blackContrast >= targetRatio) {
    return '0 0% 0%'
  }

  // Return whichever has better contrast
  return whiteContrast > blackContrast ? '0 0% 100%' : '0 0% 0%'
}

/**
 * Generate a complete color palette from a primary color
 */
export function generatePalette(primaryColor: string): Partial<ColorConfig> {
  const primaryHsl =
    typeof primaryColor === 'string' && primaryColor.startsWith('#')
      ? hexToHsl(primaryColor)
      : primaryColor

  return {
    primary: primaryHsl,
    primaryForeground: generateForegroundColor(primaryHsl),
    secondary: adjustLightness(primaryHsl, 30),
    secondaryForeground: generateForegroundColor(
      adjustLightness(primaryHsl, 30)
    ),
    accent: adjustLightness(primaryHsl, 20),
    accentForeground: generateForegroundColor(adjustLightness(primaryHsl, 20)),
  }
}

/**
 * Apply theme to document root
 */
export function applyThemeToDocument(theme: CompleteThemeConfig): void {
  const root = document.documentElement

  // Remove old mode classes
  root.classList.remove('light', 'dark')

  // Add new mode class
  root.classList.add(theme.mode)

  // Apply color CSS variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVarName, value)
  })

  // Apply border radius
  if (theme.borders.radius.lg) {
    root.style.setProperty('--radius', theme.borders.radius.lg)
  }

  // Apply font family
  if (theme.typography.fontFamily.sans) {
    root.style.setProperty('--font-sans', theme.typography.fontFamily.sans)
  }

  if (theme.typography.fontFamily.mono) {
    root.style.setProperty('--font-mono', theme.typography.fontFamily.mono)
  }
}

/**
 * Export theme as JSON
 */
export function exportTheme(
  theme: CompleteThemeConfig,
  metadata?: Partial<ThemeMetadata>
): ExportableTheme {
  const defaultMetadata: ThemeMetadata = {
    name: theme.name,
    displayName: theme.name,
    description: 'Custom theme',
    version: '1.0.0',
    preview: {
      primaryColor: hslToHex(theme.colors.primary),
      secondaryColor: hslToHex(theme.colors.secondary),
      backgroundColor: hslToHex(theme.colors.background),
    },
  }

  return {
    metadata: { ...defaultMetadata, ...metadata },
    config: theme,
  }
}

/**
 * Import theme from JSON
 */
export function importTheme(exported: ExportableTheme): CompleteThemeConfig {
  return exported.config
}

/**
 * Get theme by name
 */
export function getTheme(name: ThemePresetName): CompleteThemeConfig {
  return themes[name]
}

/**
 * Get all available theme names
 */
export function getThemeNames(): ThemePresetName[] {
  return Object.keys(themes) as ThemePresetName[]
}

/**
 * Get theme metadata
 */
export function getThemeMetadata(name: ThemePresetName): ThemeMetadata {
  return themeMetadata[name]
}

/**
 * Get all themes with metadata
 */
export function getAllThemes(): Array<{
  name: ThemePresetName
  metadata: ThemeMetadata
  config: CompleteThemeConfig
}> {
  return getThemeNames().map((name) => ({
    name,
    metadata: getThemeMetadata(name),
    config: getTheme(name),
  }))
}

/**
 * Create theme variants (light/dark) from a base theme
 */
export function createThemeVariants(baseTheme: CompleteThemeConfig): {
  light: CompleteThemeConfig
  dark: CompleteThemeConfig
} {
  // For light variant, use base colors
  const light: CompleteThemeConfig = {
    ...baseTheme,
    name: `${baseTheme.name}-light`,
    mode: 'light',
  }

  // For dark variant, invert lightness values
  const dark: CompleteThemeConfig = {
    ...baseTheme,
    name: `${baseTheme.name}-dark`,
    mode: 'dark',
    colors: {
      ...baseTheme.colors,
      background: adjustLightness(baseTheme.colors.background, -90),
      foreground: adjustLightness(baseTheme.colors.foreground, 85),
      card: adjustLightness(baseTheme.colors.card, -90),
      cardForeground: adjustLightness(baseTheme.colors.cardForeground, 85),
      popover: adjustLightness(baseTheme.colors.popover, -90),
      popoverForeground: adjustLightness(
        baseTheme.colors.popoverForeground,
        85
      ),
      muted: adjustLightness(baseTheme.colors.muted, -75),
      mutedForeground: adjustLightness(baseTheme.colors.mutedForeground, 20),
      border: adjustLightness(baseTheme.colors.border, -70),
      input: adjustLightness(baseTheme.colors.input, -70),
    },
  }

  return { light, dark }
}

/**
 * Validate theme configuration
 */
export function validateTheme(theme: CompleteThemeConfig): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required fields
  if (!theme.name) errors.push('Theme name is required')
  if (!theme.mode) errors.push('Theme mode is required')
  if (!theme.colors) errors.push('Colors configuration is required')

  // Check contrast ratios (WCAG AA minimum)
  if (theme.colors) {
    const contrastChecks = [
      {
        fg: theme.colors.foreground,
        bg: theme.colors.background,
        name: 'foreground/background',
      },
      {
        fg: theme.colors.primaryForeground,
        bg: theme.colors.primary,
        name: 'primary',
      },
      {
        fg: theme.colors.secondaryForeground,
        bg: theme.colors.secondary,
        name: 'secondary',
      },
      {
        fg: theme.colors.destructiveForeground,
        bg: theme.colors.destructive,
        name: 'destructive',
      },
    ]

    contrastChecks.forEach(({ fg, bg, name }) => {
      const result = checkContrast(fg, bg, 'AA')
      if (!result.passes) {
        warnings.push(
          `${name} contrast ratio (${result.ratio.toFixed(2)}) is below WCAG AA minimum (${result.required})`
        )
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
