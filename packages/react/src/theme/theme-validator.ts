/**
 * Theme Validator
 *
 * Comprehensive runtime validation for theme configurations.
 * Catches issues early and provides actionable error messages.
 */

import type { CompleteThemeConfig, ColorConfig } from './theme-config'
import { isHSLString, getContrastRatio, hslStringToHex } from './color-utils'

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
}

/**
 * Individual validation issue
 */
export interface ValidationIssue {
  code: string
  message: string
  path: string
  suggestion?: string
}

/**
 * Required color keys for a complete theme
 */
const REQUIRED_COLORS: (keyof ColorConfig)[] = [
  'primary',
  'primaryForeground',
  'secondary',
  'secondaryForeground',
  'background',
  'foreground',
  'muted',
  'mutedForeground',
  'accent',
  'accentForeground',
  'card',
  'cardForeground',
  'popover',
  'popoverForeground',
  'border',
  'input',
  'ring',
  'destructive',
  'destructiveForeground',
]

/**
 * Color pairs to check for contrast
 */
const CONTRAST_PAIRS: Array<{
  fg: keyof ColorConfig
  bg: keyof ColorConfig
  name: string
  minRatio: number
}> = [
  {
    fg: 'foreground',
    bg: 'background',
    name: 'Text on Background',
    minRatio: 4.5,
  },
  {
    fg: 'primaryForeground',
    bg: 'primary',
    name: 'Primary Button Text',
    minRatio: 4.5,
  },
  {
    fg: 'secondaryForeground',
    bg: 'secondary',
    name: 'Secondary Button Text',
    minRatio: 4.5,
  },
  {
    fg: 'destructiveForeground',
    bg: 'destructive',
    name: 'Destructive Button Text',
    minRatio: 4.5,
  },
  { fg: 'cardForeground', bg: 'card', name: 'Card Text', minRatio: 4.5 },
  {
    fg: 'popoverForeground',
    bg: 'popover',
    name: 'Popover Text',
    minRatio: 4.5,
  },
  { fg: 'mutedForeground', bg: 'muted', name: 'Muted Text', minRatio: 4.5 },
  { fg: 'accentForeground', bg: 'accent', name: 'Accent Text', minRatio: 4.5 },
]

/**
 * Validate HSL string format
 */
function validateHSLFormat(
  value: string,
  path: string
): ValidationIssue | null {
  if (!value) {
    return {
      code: 'MISSING_VALUE',
      message: `Missing color value`,
      path,
      suggestion: 'Provide an HSL string like "220 90% 56%"',
    }
  }

  // Skip validation for hex colors (they get converted)
  if (value.startsWith('#')) {
    return null
  }

  if (!isHSLString(value)) {
    return {
      code: 'INVALID_HSL',
      message: `Invalid HSL format: "${value}"`,
      path,
      suggestion:
        'Use format "H S% L%" (e.g., "220 90% 56%") without the hsl() wrapper',
    }
  }

  // Check value ranges
  const parts = value.split(/\s+/)
  const h = parseFloat(parts[0] || '0')
  const s = parseFloat(parts[1]?.replace('%', '') || '0')
  const l = parseFloat(parts[2]?.replace('%', '') || '0')

  if (h < 0 || h > 360) {
    return {
      code: 'HSL_RANGE',
      message: `Hue value ${h} is out of range (0-360)`,
      path,
      suggestion: 'Hue should be between 0 and 360',
    }
  }

  if (s < 0 || s > 100) {
    return {
      code: 'HSL_RANGE',
      message: `Saturation value ${s}% is out of range (0-100%)`,
      path,
      suggestion: 'Saturation should be between 0% and 100%',
    }
  }

  if (l < 0 || l > 100) {
    return {
      code: 'HSL_RANGE',
      message: `Lightness value ${l}% is out of range (0-100%)`,
      path,
      suggestion: 'Lightness should be between 0% and 100%',
    }
  }

  return null
}

/**
 * Validate color contrast
 */
function validateContrast(
  fgValue: string,
  bgValue: string,
  name: string,
  minRatio: number,
  path: string
): ValidationIssue | null {
  try {
    const fgHex = fgValue.startsWith('#') ? fgValue : hslStringToHex(fgValue)
    const bgHex = bgValue.startsWith('#') ? bgValue : hslStringToHex(bgValue)
    const ratio = getContrastRatio(fgHex, bgHex)

    if (ratio < minRatio) {
      return {
        code: 'LOW_CONTRAST',
        message: `${name} has insufficient contrast: ${ratio.toFixed(2)}:1 (minimum: ${minRatio}:1)`,
        path,
        suggestion: `Increase contrast by making the foreground darker or lighter, or adjusting the background`,
      }
    }
  } catch {
    // Skip contrast check if colors can't be converted
  }

  return null
}

/**
 * Validate a complete theme configuration
 *
 * @example
 * ```ts
 * import { validateThemeConfig } from '@clarity-chat/react'
 *
 * const result = validateThemeConfig(myTheme)
 * if (!result.valid) {
 *   logger.logger.error('Theme validation failed:', result.errors)
 * }
 * if (result.warnings.length > 0) {
 *   logger.warn('Theme warnings:', result.warnings)
 * }
 * ```
 */
export function validateThemeConfig(
  theme: Partial<CompleteThemeConfig>
): ValidationResult {
  const errors: ValidationIssue[] = []
  const warnings: ValidationIssue[] = []

  // Check required top-level fields
  if (!theme.name) {
    errors.push({
      code: 'MISSING_NAME',
      message: 'Theme name is required',
      path: 'name',
      suggestion: 'Add a unique name to identify your theme',
    })
  }

  if (!theme.mode) {
    errors.push({
      code: 'MISSING_MODE',
      message: 'Theme mode is required',
      path: 'mode',
      suggestion: 'Set mode to "light" or "dark"',
    })
  } else if (theme.mode !== 'light' && theme.mode !== 'dark') {
    errors.push({
      code: 'INVALID_MODE',
      message: `Invalid mode "${theme.mode}"`,
      path: 'mode',
      suggestion: 'Mode must be "light" or "dark"',
    })
  }

  // Validate colors
  if (!theme.colors) {
    errors.push({
      code: 'MISSING_COLORS',
      message: 'Colors configuration is required',
      path: 'colors',
      suggestion: 'Provide a colors object with all required color values',
    })
  } else {
    // Check for required colors
    for (const colorKey of REQUIRED_COLORS) {
      if (!theme.colors[colorKey]) {
        warnings.push({
          code: 'MISSING_COLOR',
          message: `Missing color: ${colorKey}`,
          path: `colors.${colorKey}`,
          suggestion: `Add ${colorKey} to your colors configuration`,
        })
      }
    }

    // Validate HSL format for each color
    for (const [key, value] of Object.entries(theme.colors)) {
      if (value) {
        const issue = validateHSLFormat(value, `colors.${key}`)
        if (issue) {
          errors.push(issue)
        }
      }
    }

    // Check contrast ratios
    for (const pair of CONTRAST_PAIRS) {
      const fgValue = theme.colors[pair.fg]
      const bgValue = theme.colors[pair.bg]

      if (fgValue && bgValue) {
        const issue = validateContrast(
          fgValue,
          bgValue,
          pair.name,
          pair.minRatio,
          `colors.${pair.fg}/${pair.bg}`
        )
        if (issue) {
          warnings.push(issue)
        }
      }
    }
  }

  // Validate typography
  if (theme.typography) {
    if (theme.typography.fontFamily) {
      const { sans, mono } = theme.typography.fontFamily
      if (!sans) {
        warnings.push({
          code: 'MISSING_FONT',
          message: 'Sans-serif font family not specified',
          path: 'typography.fontFamily.sans',
          suggestion: 'Specify a sans-serif font stack',
        })
      }
      if (!mono) {
        warnings.push({
          code: 'MISSING_FONT',
          message: 'Monospace font family not specified',
          path: 'typography.fontFamily.mono',
          suggestion: 'Specify a monospace font stack for code',
        })
      }
    }
  }

  // Validate borders
  if (theme.borders?.radius) {
    const { md, lg } = theme.borders.radius
    if (md && typeof md !== 'string') {
      errors.push({
        code: 'INVALID_RADIUS',
        message: 'Border radius must be a string (e.g., "0.5rem")',
        path: 'borders.radius.md',
      })
    }
    if (lg && typeof lg !== 'string') {
      errors.push({
        code: 'INVALID_RADIUS',
        message: 'Border radius must be a string (e.g., "0.75rem")',
        path: 'borders.radius.lg',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Assert that a theme is valid, throwing if not
 *
 * @throws Error if theme is invalid
 *
 * @example
 * ```ts
 * import { assertValidTheme } from '@clarity-chat/react'
 *
 * // Throws if invalid
 * assertValidTheme(myTheme)
 * ```
 */
export function assertValidTheme(theme: Partial<CompleteThemeConfig>): void {
  const result = validateThemeConfig(theme)

  if (!result.valid) {
    const errorMessages = result.errors
      .map(
        (e) =>
          `- [${e.code}] ${e.message} (at ${e.path})${e.suggestion ? `\n  Suggestion: ${e.suggestion}` : ''}`
      )
      .join('\n')

    throw new Error(`Invalid theme configuration:\n${errorMessages}`)
  }
}

/**
 * Validate theme and log warnings in development
 *
 * @example
 * ```ts
 * import { validateThemeWithWarnings } from '@clarity-chat/react'
 *
 * // In development, logs warnings to console
 * const isValid = validateThemeWithWarnings(myTheme)
 * ```
 */
export function validateThemeWithWarnings(
  theme: Partial<CompleteThemeConfig>
): boolean {
  const result = validateThemeConfig(theme)

  if (process.env['NODE_ENV'] !== 'production') {
    // Log warnings
    if (result.warnings.length > 0) {
      console.warn(
        '[Clarity Chat] Theme validation warnings:\n' +
          result.warnings
            .map(
              (w) => `- ${w.message}${w.suggestion ? ` (${w.suggestion})` : ''}`
            )
            .join('\n')
      )
    }

    // Log errors
    if (result.errors.length > 0) {
      console.error(
        '[Clarity Chat] Theme validation errors:\n' +
          result.errors
            .map(
              (e) => `- ${e.message}${e.suggestion ? ` (${e.suggestion})` : ''}`
            )
            .join('\n')
      )
    }
  }

  return result.valid
}

export default {
  validateThemeConfig,
  assertValidTheme,
  validateThemeWithWarnings,
}
