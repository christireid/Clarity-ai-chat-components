/**
 * OKLCH Color Utilities
 *
 * Type-safe utilities for manipulating OKLCH colors
 * and checking accessibility contrast.
 */

export interface OklchColor {
  /** Lightness: 0-100% */
  l: number
  /** Chroma (saturation): 0-0.4 */
  c: number
  /** Hue: 0-360 */
  h: number
  /** Alpha: 0-1 */
  a?: number
}

/**
 * Parse OKLCH string: "75% 0.18 195" or "oklch(75% 0.18 195)"
 */
export function parseOklch(value: string): OklchColor {
  const cleaned = value.replace(/oklch\(|\)/g, '').trim()
  const match = cleaned.match(
    /(\d+(?:\.\d+)?%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/
  )

  if (!match) {
    throw new Error(`Invalid OKLCH value: ${value}`)
  }

  const l = parseFloat(match[1].replace('%', ''))
  const c = parseFloat(match[2])
  const h = parseFloat(match[3])
  const a = match[4] ? parseFloat(match[4]) : 1

  return { l, c, h, a }
}

/**
 * Convert OklchColor to CSS string
 */
export function toOklchString(color: OklchColor): string {
  const alpha = color.a !== undefined && color.a < 1 ? ` / ${color.a}` : ''
  return `oklch(${color.l}% ${color.c} ${color.h}${alpha})`
}

/**
 * Lighten color by percentage (0-100)
 */
export function lighten(color: OklchColor, amount: number): OklchColor {
  return { ...color, l: Math.min(100, color.l + amount) }
}

/**
 * Darken color by percentage (0-100)
 */
export function darken(color: OklchColor, amount: number): OklchColor {
  return { ...color, l: Math.max(0, color.l - amount) }
}

/**
 * Increase saturation (chroma)
 */
export function saturate(color: OklchColor, amount: number): OklchColor {
  return { ...color, c: Math.min(0.4, color.c + amount) }
}

/**
 * Decrease saturation (chroma)
 */
export function desaturate(color: OklchColor, amount: number): OklchColor {
  return { ...color, c: Math.max(0, color.c - amount) }
}

/**
 * Shift hue by degrees
 */
export function rotateHue(color: OklchColor, degrees: number): OklchColor {
  return { ...color, h: (color.h + degrees + 360) % 360 }
}

/**
 * Set alpha/opacity
 */
export function setAlpha(color: OklchColor, alpha: number): OklchColor {
  return { ...color, a: Math.max(0, Math.min(1, alpha)) }
}

/**
 * Mix two colors (0 = first color, 1 = second color)
 */
export function mix(
  color1: OklchColor,
  color2: OklchColor,
  ratio: number = 0.5
): OklchColor {
  const r = Math.max(0, Math.min(1, ratio))
  return {
    l: color1.l + (color2.l - color1.l) * r,
    c: color1.c + (color2.c - color1.c) * r,
    h: color1.h + (color2.h - color1.h) * r,
    a: (color1.a ?? 1) + ((color2.a ?? 1) - (color1.a ?? 1)) * r,
  }
}

/**
 * Calculate approximate contrast ratio between two OKLCH colors
 */
export function contrastRatio(fg: OklchColor, bg: OklchColor): number {
  const fgLum = Math.pow(fg.l / 100, 2.2)
  const bgLum = Math.pow(bg.l / 100, 2.2)

  const lighter = Math.max(fgLum, bgLum)
  const darker = Math.min(fgLum, bgLum)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
 */
export function meetsWcagAA(
  fg: OklchColor,
  bg: OklchColor,
  largeText: boolean = false
): boolean {
  const ratio = contrastRatio(fg, bg)
  return largeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * Check if contrast meets WCAG AAA (7:1 for normal text, 4.5:1 for large text)
 */
export function meetsWcagAAA(
  fg: OklchColor,
  bg: OklchColor,
  largeText: boolean = false
): boolean {
  const ratio = contrastRatio(fg, bg)
  return largeText ? ratio >= 4.5 : ratio >= 7
}

/**
 * Suggest a lightness adjustment to meet contrast requirement
 */
export function suggestContrastAdjustment(
  fg: OklchColor,
  bg: OklchColor,
  targetRatio: number = 4.5
): number {
  const currentRatio = contrastRatio(fg, bg)
  if (currentRatio >= targetRatio) return 0

  const fgIsLighter = fg.l > bg.l
  let adjustment = 0
  let step = 25

  for (let i = 0; i < 10; i++) {
    const testColor = fgIsLighter
      ? lighten(fg, adjustment + step)
      : darken(fg, adjustment + step)

    if (contrastRatio(testColor, bg) >= targetRatio) {
      step /= 2
    } else {
      adjustment += step
    }
  }

  return fgIsLighter ? adjustment : -adjustment
}
