import { logger } from '@clarity-chat/utils/logger';
/**
 * Clarity Chat - Color Utilities
 *
 * Utilities for color conversion, manipulation, and palette generation.
 * Supports both hex and HSL color formats.
 */

/**
 * HSL color components
 */
export interface HSLColor {
  h: number // 0-360
  s: number // 0-100
  l: number // 0-100
}

/**
 * RGB color components
 */
export interface RGBColor {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
}

/**
 * Check if a string is a valid hex color
 */
export function isHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

/**
 * Check if a string is a valid HSL string (space-separated)
 */
export function isHSLString(color: string): boolean {
  const parts = color.split(' ')
  if (parts.length !== 3) return false
  const [h, s, l] = parts
  return (
    !isNaN(parseFloat(h ?? '')) &&
    (s?.endsWith('%') ?? false) &&
    (l?.endsWith('%') ?? false)
  )
}

/**
 * Parse hex color to RGB
 */
export function hexToRGB(hex: string): RGBColor {
  let h = hex.replace('#', '')

  // Handle 3-character hex
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }

  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

/**
 * Convert RGB to HSL
 */
export function rgbToHSL(rgb: RGBColor): HSLColor {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Convert HSL to RGB
 */
export function hslToRGB(hsl: HSLColor): RGBColor {
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

/**
 * Convert hex color to HSL string
 */
export function hexToHSLString(hex: string): string {
  const rgb = hexToRGB(hex)
  const hsl = rgbToHSL(rgb)
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`
}

/**
 * Convert HSL string to hex color
 * Returns fallback (#000000) for invalid input
 */
export function hslStringToHex(hslString: string): string {
  const [hStr, sStr, lStr] = hslString.split(' ')
  const h = parseFloat(hStr ?? '0')
  const s = parseFloat(sStr?.replace('%', '') ?? '0')
  const l = parseFloat(lStr?.replace('%', '') ?? '0')

  // Validate parsed values - return black for invalid input
  if (isNaN(h) || isNaN(s) || isNaN(l)) {
    return '#000000'
  }

  const hsl: HSLColor = {
    h: Math.max(0, Math.min(360, h)),
    s: Math.max(0, Math.min(100, s)),
    l: Math.max(0, Math.min(100, l)),
  }
  const rgb = hslToRGB(hsl)
  return rgbToHex(rgb)
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(rgb: RGBColor): string {
  const toHex = (n: number): string => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

/**
 * Default fallback color (neutral gray) for invalid inputs
 */
const FALLBACK_HSL = '0 0% 50%'

/**
 * Parse any color format to HSL string
 * Returns a valid HSL string or fallback for invalid input
 */
export function toHSLString(color: string): string {
  if (!color || typeof color !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      logger.warn(
        `[Clarity Chat] Invalid color value: ${color}. Using fallback.`
      )
    }
    return FALLBACK_HSL
  }

  if (isHexColor(color)) {
    return hexToHSLString(color)
  }
  if (isHSLString(color)) {
    return color
  }

  // Warn about invalid color in development
  if (process.env.NODE_ENV !== 'production') {
    logger.warn(
      `[Clarity Chat] Unrecognized color format: "${color}". ` +
        `Expected hex (#RRGGBB) or HSL (H S% L%). Using fallback.`
    )
  }
  return FALLBACK_HSL
}

/**
 * Adjust the lightness of an HSL color
 */
export function adjustLightness(hslString: string, amount: number): string {
  const [h, s, l] = hslString.split(' ')
  const newL = Math.max(0, Math.min(100, parseFloat(l ?? '0') + amount))
  return `${h ?? 0} ${s ?? '0%'} ${newL}%`
}

/**
 * Adjust the saturation of an HSL color
 */
export function adjustSaturation(hslString: string, amount: number): string {
  const [h, s, l] = hslString.split(' ')
  const newS = Math.max(
    0,
    Math.min(100, parseFloat(s?.replace('%', '') ?? '0') + amount)
  )
  return `${h ?? 0} ${newS}% ${l ?? '0%'}`
}

/**
 * Calculate the relative luminance of an RGB color
 * Used for WCAG contrast calculations
 */
export function getLuminance(rgb: RGBColor): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0)
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = isHexColor(color1)
    ? hexToRGB(color1)
    : hslToRGB(parseHSLString(color1))
  const rgb2 = isHexColor(color2)
    ? hexToRGB(color2)
    : hslToRGB(parseHSLString(color2))

  const l1 = getLuminance(rgb1)
  const l2 = getLuminance(rgb2)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Parse HSL string to HSLColor object
 * Returns clamped, valid values (NaN becomes 0)
 */
function parseHSLString(hslString: string): HSLColor {
  const [h, s, l] = hslString.split(' ')
  const hue = parseFloat(h ?? '0')
  const sat = parseFloat(s?.replace('%', '') ?? '0')
  const light = parseFloat(l?.replace('%', '') ?? '0')

  return {
    h: isNaN(hue) ? 0 : Math.max(0, Math.min(360, hue)),
    s: isNaN(sat) ? 0 : Math.max(0, Math.min(100, sat)),
    l: isNaN(light) ? 0 : Math.max(0, Math.min(100, light)),
  }
}

/**
 * Check if contrast meets WCAG requirements
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background)
  const required =
    level === 'AAA' ? (isLargeText ? 4.5 : 7) : isLargeText ? 3 : 4.5
  return ratio >= required
}

/**
 * Generate a contrasting foreground color (white or black)
 */
export function getContrastingForeground(background: string): string {
  const rgb = isHexColor(background)
    ? hexToRGB(background)
    : hslToRGB(parseHSLString(background))
  const luminance = getLuminance(rgb)
  // Use white for dark backgrounds, black for light
  return luminance > 0.179 ? '0 0% 9%' : '0 0% 100%'
}

/**
 * Generate a complete color palette from a single brand color
 * Returns semantic colors derived from the input
 */
export function generatePaletteFromBrandColor(brandColor: string): {
  primary: string
  primaryForeground: string
  accent: string
  accentForeground: string
  ring: string
} {
  const hsl = toHSLString(brandColor)
  const foreground = getContrastingForeground(brandColor)

  // Create accent by shifting hue slightly and adjusting saturation
  const [h, s, l] = hsl.split(' ')
  const hue = parseFloat(h ?? '0')
  const sat = parseFloat(s?.replace('%', '') ?? '0')
  const light = parseFloat(l?.replace('%', '') ?? '0')

  // Accent is shifted 30 degrees on the color wheel
  const accentHue = (hue + 30) % 360
  const accent = `${accentHue} ${Math.min(100, sat + 10)}% ${light}%`
  const accentForeground = getContrastingForeground(accent)

  return {
    primary: hsl,
    primaryForeground: foreground,
    accent,
    accentForeground,
    ring: hsl,
  }
}
