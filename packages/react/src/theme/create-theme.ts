/**
 * Clarity Chat - Theme Creation Utilities
 *
 * Simplified API for creating custom themes.
 * Supports hex colors, brand color shortcuts, and partial overrides.
 */

import type {
  CompleteThemeConfig,
  PartialThemeConfig,
  ColorConfig,
} from './theme-config'
import {
  modernThemes,
  type ModernThemePresetName,
  isValidModernThemeName,
} from './modern-presets'
import { toHSLString, generatePaletteFromBrandColor } from './color-utils'
import { CSS_VAR_PREFIX } from './tokens/colors'

/**
 * Theme preset name type
 */
export type ThemePresetName = ModernThemePresetName

/**
 * Simplified theme configuration
 * Accepts hex colors and provides shortcuts
 */
export interface SimpleThemeConfig {
  /**
   * Base theme to extend from
   * @default 'default'
   */
  extends?: ThemePresetName

  /**
   * Single brand color to generate a palette from
   * Can be hex (#6366f1) or HSL (239 84% 67%)
   */
  brandColor?: string

  /**
   * Theme mode
   * @default 'light'
   */
  mode?: 'light' | 'dark'

  /**
   * Color overrides (accepts hex or HSL)
   */
  colors?: Partial<{
    [K in keyof ColorConfig]: string
  }>

  /**
   * Border radius preset
   * @default 'lg'
   */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

  /**
   * Custom theme name
   */
  name?: string
}

/**
 * Deep merge utility for theme configurations
 */
function deepMerge(
  target: CompleteThemeConfig,
  source: Partial<CompleteThemeConfig>
): CompleteThemeConfig {
  const result: CompleteThemeConfig = {
    name: source.name ?? target.name,
    mode: source.mode ?? target.mode,
    colors: source.colors
      ? { ...target.colors, ...source.colors }
      : target.colors,
    typography: source.typography
      ? { ...target.typography, ...source.typography }
      : target.typography,
    spacing: source.spacing
      ? { ...target.spacing, ...source.spacing }
      : target.spacing,
    borders: source.borders
      ? {
          width: { ...target.borders.width, ...source.borders.width },
          radius: { ...target.borders.radius, ...source.borders.radius },
        }
      : target.borders,
    shadows: source.shadows
      ? { ...target.shadows, ...source.shadows }
      : target.shadows,
    animations: source.animations
      ? { ...target.animations, ...source.animations }
      : target.animations,
    components: source.components
      ? { ...target.components, ...source.components }
      : target.components,
  }

  return result
}

/**
 * Convert color values to HSL format
 */
function normalizeColors(
  colors: Partial<{ [K in keyof ColorConfig]: string }>
): Partial<ColorConfig> {
  const normalized: Partial<ColorConfig> = {}

  for (const [key, value] of Object.entries(colors)) {
    if (value) {
      normalized[key as keyof ColorConfig] = toHSLString(value)
    }
  }

  return normalized
}

/**
 * Get radius value based on preset
 */
function getRadiusValue(
  preset: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
): string {
  const radiusMap = {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  }
  return radiusMap[preset]
}

/**
 * Get a theme by name
 */
function getThemeByName(name: string): CompleteThemeConfig {
  if (isValidModernThemeName(name)) {
    return modernThemes[name]
  }
  // Warn about invalid preset and fallback to default
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[Clarity Chat] Unknown theme preset "${name}". ` +
        `Available presets: ${Object.keys(modernThemes).join(', ')}. ` +
        `Falling back to "default".`
    )
  }
  return modernThemes['default']
}

/**
 * Create a custom theme with simplified configuration
 *
 * @example
 * // Simple brand color theme
 * const theme = createTheme({ brandColor: '#6366f1' })
 *
 * @example
 * // Custom colors
 * const theme = createTheme({
 *   colors: {
 *     primary: '#3b82f6',
 *     background: '#fafafa',
 *   },
 *   radius: 'lg',
 * })
 *
 * @example
 * // Extend existing theme
 * const theme = createTheme({
 *   extends: 'neutral-dark',
 *   colors: { primary: '#10b981' },
 * })
 */
export function createTheme(config: SimpleThemeConfig): CompleteThemeConfig {
  // Determine base theme
  const baseThemeName =
    config.extends ?? (config.mode === 'dark' ? 'default-dark' : 'default')
  const baseTheme = getThemeByName(baseThemeName)

  // Start with base theme
  let result: CompleteThemeConfig = { ...baseTheme }

  // Apply brand color if provided
  if (config.brandColor) {
    const palette = generatePaletteFromBrandColor(config.brandColor)
    result = deepMerge(result, {
      colors: palette,
    } as Partial<CompleteThemeConfig>)
  }

  // Apply color overrides
  if (config.colors) {
    const normalizedColors = normalizeColors(config.colors)
    result = deepMerge(result, {
      colors: normalizedColors,
    } as Partial<CompleteThemeConfig>)
  }

  // Apply radius preset
  if (config.radius) {
    const radiusValue = getRadiusValue(config.radius)
    // Update the lg radius which is used as the base
    result = deepMerge(result, {
      borders: {
        radius: {
          ...result.borders.radius,
          lg: radiusValue,
        },
      },
    } as Partial<CompleteThemeConfig>)
  }

  // Apply mode
  if (config.mode) {
    result.mode = config.mode
  }

  // Apply custom name
  if (config.name) {
    result.name = config.name
  }

  return result
}

/**
 * Merge a partial theme config with a complete theme
 * Lower-level API for advanced customization
 */
export function mergeTheme(
  base: ThemePresetName | CompleteThemeConfig,
  overrides: PartialThemeConfig
): CompleteThemeConfig {
  const baseTheme = typeof base === 'string' ? getThemeByName(base) : base
  return deepMerge(baseTheme, overrides as Partial<CompleteThemeConfig>)
}

/**
 * Generate CSS custom properties from a theme config
 */
export function generateCSSVariables(
  theme: CompleteThemeConfig
): Record<string, string> {
  const vars: Record<string, string> = {}

  // Colors
  for (const [key, value] of Object.entries(theme.colors)) {
    const cssKey = `--${CSS_VAR_PREFIX}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    vars[cssKey] = value
  }

  // Radius (use lg as the base)
  vars[`--${CSS_VAR_PREFIX}-radius`] = theme.borders.radius.lg

  // Font families
  vars[`--${CSS_VAR_PREFIX}-font-sans`] = theme.typography.fontFamily.sans
  vars[`--${CSS_VAR_PREFIX}-font-mono`] = theme.typography.fontFamily.mono

  return vars
}

/**
 * Apply theme CSS variables to a DOM element
 */
export function applyThemeVariables(
  element: HTMLElement,
  theme: CompleteThemeConfig
): void {
  const vars = generateCSSVariables(theme)

  for (const [key, value] of Object.entries(vars)) {
    element.style.setProperty(key, value)
  }

  // Apply mode class
  element.classList.remove('light', 'dark')
  element.classList.add(theme.mode)
}

/**
 * Remove theme CSS variables from a DOM element
 */
export function removeThemeVariables(element: HTMLElement): void {
  // Remove all clarity CSS variables
  const style = element.style
  const toRemove: string[] = []

  for (let i = 0; i < style.length; i++) {
    const prop = style[i]
    if (prop?.startsWith(`--${CSS_VAR_PREFIX}-`)) {
      toRemove.push(prop)
    }
  }

  toRemove.forEach((prop) => style.removeProperty(prop))

  // Remove mode classes
  element.classList.remove('light', 'dark')
}

/**
 * Get CSS string for a theme (useful for SSR)
 */
export function getThemeCSS(
  theme: CompleteThemeConfig,
  selector: string = ':root'
): string {
  const vars = generateCSSVariables(theme)
  const declarations = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  return `${selector} {\n${declarations}\n}`
}
