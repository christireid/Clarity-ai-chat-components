/**
 * Theme Value Sanitization
 *
 * Validates and sanitizes theme override values to prevent CSS injection attacks.
 */

import type {
  ThemeOverrides,
  ValidationResult,
  GlassOverrides,
} from './types'
import { GLASS_BOUNDS } from './types'

/**
 * Dangerous patterns that could be used for CSS injection.
 */
const DANGEROUS_PATTERNS = [
  /url\s*\(/i, // url()
  /expression\s*\(/i, // expression() - IE
  /javascript:/i, // javascript: protocol
  /behavior:/i, // behavior: - IE
  /-moz-binding/i, // -moz-binding
  /@import/i, // @import
  /\\</i, // HTML injection attempt
  /<!--/i, // HTML comment injection
]

/**
 * Valid color patterns.
 */
const COLOR_PATTERNS = {
  // Hex colors: #rgb, #rrggbb, #rrggbbaa
  hex: /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,

  // OKLCH: L% C H or L% C H / alpha
  oklch: /^[\d.]+%?\s+[\d.]+\s+[\d.]+(\s*\/\s*[\d.]+%?)?$/,

  // RGB/RGBA
  rgb: /^rgba?\(\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?(\s*[,\/]\s*[\d.]+%?)?\s*\)$/i,

  // HSL/HSLA
  hsl: /^hsla?\(\s*[\d.]+\s*[,\s]\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?(\s*[,\/]\s*[\d.]+%?)?\s*\)$/i,
}

/**
 * Valid length pattern (for radius, blur, etc.)
 */
const LENGTH_PATTERN = /^[\d.]+(px|rem|em|%|vw|vh)?$/

/**
 * Valid percentage pattern
 */
const PERCENTAGE_PATTERN = /^[\d.]+(%)$/

/**
 * Check if a value contains dangerous patterns.
 */
function containsDangerousPattern(value: string): boolean {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(value))
}

/**
 * Validate a color value.
 */
export function validateColor(value: string): ValidationResult {
  // Check for dangerous patterns first
  if (containsDangerousPattern(value)) {
    return {
      valid: false,
      error: 'Value contains blocked pattern',
    }
  }

  // Trim and normalize
  const trimmed = value.trim()

  // Check against valid patterns
  if (COLOR_PATTERNS.hex.test(trimmed)) {
    return { valid: true, sanitized: trimmed }
  }

  if (COLOR_PATTERNS.oklch.test(trimmed)) {
    return { valid: true, sanitized: trimmed }
  }

  if (COLOR_PATTERNS.rgb.test(trimmed)) {
    return { valid: true, sanitized: trimmed }
  }

  if (COLOR_PATTERNS.hsl.test(trimmed)) {
    return { valid: true, sanitized: trimmed }
  }

  return {
    valid: false,
    error: 'Invalid color format. Use hex, OKLCH, RGB, or HSL.',
  }
}

/**
 * Validate a length value.
 */
export function validateLength(value: string): ValidationResult {
  if (containsDangerousPattern(value)) {
    return {
      valid: false,
      error: 'Value contains blocked pattern',
    }
  }

  const trimmed = value.trim()

  if (LENGTH_PATTERN.test(trimmed)) {
    return { valid: true, sanitized: trimmed }
  }

  return {
    valid: false,
    error: 'Invalid length format. Use px, rem, em, %, vw, or vh.',
  }
}

/**
 * Validate a percentage value.
 */
export function validatePercentage(value: string): ValidationResult {
  if (containsDangerousPattern(value)) {
    return {
      valid: false,
      error: 'Value contains blocked pattern',
    }
  }

  const trimmed = value.trim()

  if (PERCENTAGE_PATTERN.test(trimmed)) {
    const numValue = parseFloat(trimmed)
    return { valid: true, sanitized: `${numValue}%` }
  }

  return {
    valid: false,
    error: 'Invalid percentage format. Use a number followed by %.',
  }
}

/**
 * Validate and clamp a number within bounds.
 */
export function validateNumber(
  value: number,
  min: number,
  max: number,
  defaultValue: number
): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return {
      valid: false,
      error: 'Value must be a number',
      sanitized: defaultValue,
    }
  }

  const clamped = Math.max(min, Math.min(max, value))

  if (clamped !== value) {
    return {
      valid: true,
      sanitized: clamped,
      error: `Value clamped to range [${min}, ${max}]`,
    }
  }

  return { valid: true, sanitized: value }
}

/**
 * Validate glass override parameters.
 */
export function validateGlassOverrides(glass: GlassOverrides): {
  valid: boolean
  sanitized: GlassOverrides
  errors: string[]
} {
  const errors: string[] = []
  const sanitized: GlassOverrides = {}

  if (glass.opacity !== undefined) {
    const result = validateNumber(
      glass.opacity,
      GLASS_BOUNDS.opacity.min,
      GLASS_BOUNDS.opacity.max,
      GLASS_BOUNDS.opacity.default
    )
    sanitized.opacity = result.sanitized as number
    if (result.error) errors.push(`opacity: ${result.error}`)
  }

  if (glass.blur !== undefined) {
    const blurResult = validateLength(glass.blur)
    if (blurResult.valid) {
      // Extract numeric value and clamp
      const numValue = parseFloat(glass.blur)
      if (
        numValue >= GLASS_BOUNDS.blur.min &&
        numValue <= GLASS_BOUNDS.blur.max
      ) {
        sanitized.blur = blurResult.sanitized as string
      } else {
        sanitized.blur = `${Math.max(GLASS_BOUNDS.blur.min, Math.min(GLASS_BOUNDS.blur.max, numValue))}px`
        errors.push(
          `blur: Value clamped to range [${GLASS_BOUNDS.blur.min}px, ${GLASS_BOUNDS.blur.max}px]`
        )
      }
    } else {
      errors.push(`blur: ${blurResult.error}`)
    }
  }

  if (glass.saturate !== undefined) {
    const satResult = validatePercentage(glass.saturate)
    if (satResult.valid) {
      const numValue = parseFloat(glass.saturate)
      if (
        numValue >= GLASS_BOUNDS.saturate.min &&
        numValue <= GLASS_BOUNDS.saturate.max
      ) {
        sanitized.saturate = satResult.sanitized as string
      } else {
        sanitized.saturate = `${Math.max(GLASS_BOUNDS.saturate.min, Math.min(GLASS_BOUNDS.saturate.max, numValue))}%`
        errors.push(
          `saturate: Value clamped to range [${GLASS_BOUNDS.saturate.min}%, ${GLASS_BOUNDS.saturate.max}%]`
        )
      }
    } else {
      errors.push(`saturate: ${satResult.error}`)
    }
  }

  if (glass.borderOpacity !== undefined) {
    const result = validateNumber(
      glass.borderOpacity,
      GLASS_BOUNDS.borderOpacity.min,
      GLASS_BOUNDS.borderOpacity.max,
      GLASS_BOUNDS.borderOpacity.default
    )
    sanitized.borderOpacity = result.sanitized as number
    if (result.error) errors.push(`borderOpacity: ${result.error}`)
  }

  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  }
}

/**
 * Validate complete theme overrides.
 * Invalid values are logged (dev only) and excluded from the result.
 */
export function validateThemeOverrides(overrides: ThemeOverrides): {
  valid: boolean
  sanitized: ThemeOverrides
  errors: string[]
} {
  const errors: string[] = []
  const sanitized: ThemeOverrides = {}

  // Validate colors
  if (overrides.colors) {
    sanitized.colors = {}

    for (const [key, value] of Object.entries(overrides.colors)) {
      if (value === undefined) continue

      const result = validateColor(value)
      if (result.valid) {
        ;(sanitized.colors as Record<string, string>)[key] =
          result.sanitized as string
      } else {
        errors.push(`colors.${key}: ${result.error}`)
      }
    }
  }

  // Validate radius
  if (overrides.radius !== undefined) {
    const result = validateLength(overrides.radius)
    if (result.valid) {
      sanitized.radius = result.sanitized as string
    } else {
      errors.push(`radius: ${result.error}`)
    }
  }

  // Validate glass parameters
  if (overrides.glass) {
    const glassResult = validateGlassOverrides(overrides.glass)
    sanitized.glass = glassResult.sanitized
    errors.push(...glassResult.errors)
  }

  // Log warnings in development
  if (errors.length > 0 && process.env.NODE_ENV !== 'production') {
    errors.forEach((error) => {
      console.warn(`[Clarity Theme] Invalid override: ${error}`)
    })
  }

  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  }
}
