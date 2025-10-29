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
import { themes, themeMetadata, type ThemePresetName } from './presets'

/**
 * Deep merge two objects
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
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
 * Convert HSL string to RGB object
 */
function hslToRgb(hsl: string): { r: number; g: number; b: number } {
  const [h, s, l] = hsl.split(' ').map(v => parseFloat(v))
  const sNorm = s / 100
  const lNorm = l / 100
  
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lNorm - c / 2
  
  let r = 0, g = 0, b = 0
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

/**
 * Convert RGB to HSL string
 */
function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  h = Math.round(h * 360)
  s = Math.round(s * 100)
  const lRounded = Math.round(l * 100)
  
  return `${h} ${s}% ${lRounded}%`
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
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * Lighten or darken an HSL color
 */
export function adjustLightness(hsl: string, amount: number): string {
  const [h, s, l] = hsl.split(' ').map(v => parseFloat(v))
  const newL = Math.max(0, Math.min(100, l + amount))
  return `${h} ${s}% ${newL}%`
}

/**
 * Calculate contrast ratio between two HSL colors
 */
export function getContrastRatio(hsl1: string, hsl2: string): number {
  const rgb1 = hslToRgb(hsl1)
  const rgb2 = hslToRgb(hsl2)
  
  const luminance = (rgb: { r: number; g: number; b: number }) => {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  
  const l1 = luminance(rgb1)
  const l2 = luminance(rgb2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
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
  const primaryHsl = typeof primaryColor === 'string' && primaryColor.startsWith('#') 
    ? hexToHsl(primaryColor) 
    : primaryColor
  
  return {
    primary: primaryHsl,
    primaryForeground: generateForegroundColor(primaryHsl),
    secondary: adjustLightness(primaryHsl, 30),
    secondaryForeground: generateForegroundColor(adjustLightness(primaryHsl, 30)),
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
  return getThemeNames().map(name => ({
    name,
    metadata: getThemeMetadata(name),
    config: getTheme(name),
  }))
}

/**
 * Create theme variants (light/dark) from a base theme
 */
export function createThemeVariants(
  baseTheme: CompleteThemeConfig
): {
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
      popoverForeground: adjustLightness(baseTheme.colors.popoverForeground, 85),
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
      { fg: theme.colors.foreground, bg: theme.colors.background, name: 'foreground/background' },
      { fg: theme.colors.primaryForeground, bg: theme.colors.primary, name: 'primary' },
      { fg: theme.colors.secondaryForeground, bg: theme.colors.secondary, name: 'secondary' },
      { fg: theme.colors.destructiveForeground, bg: theme.colors.destructive, name: 'destructive' },
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
