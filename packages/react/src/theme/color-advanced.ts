/**
 * Clarity Chat - Advanced Color Utilities
 *
 * Sophisticated color manipulation, palette generation, and accessibility tools.
 * Includes color blindness simulation, harmonious palette creation, gradient
 * generation, and advanced color space conversions.
 */

import type { HSLColor, RGBColor } from './color-utils'
import {
  hexToRGB,
  rgbToHSL,
  hslToRGB,
  rgbToHex,
  hexToHSLString,
  hslStringToHex,
  getContrastRatio,
  getLuminance,
} from './color-utils'

// ============================================================================
// Color Space Conversions
// ============================================================================

/**
 * OKLCH color components (perceptually uniform)
 */
export interface OKLCHColor {
  l: number // Lightness: 0-1
  c: number // Chroma: 0-0.4 (roughly)
  h: number // Hue: 0-360
}

/**
 * Linear RGB (used for color space conversions)
 */
interface LinearRGB {
  r: number // 0-1
  g: number // 0-1
  b: number // 0-1
}

/**
 * Convert sRGB to Linear RGB
 */
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/**
 * Convert Linear RGB to sRGB
 */
function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

/**
 * Convert RGB to OKLAB
 */
function rgbToOklab(rgb: RGBColor): { L: number; a: number; b: number } {
  const r = srgbToLinear(rgb.r / 255)
  const g = srgbToLinear(rgb.g / 255)
  const b = srgbToLinear(rgb.b / 255)

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  }
}

/**
 * Convert OKLAB to RGB
 */
function oklabToRgb(lab: { L: number; a: number; b: number }): RGBColor {
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b
  const s_ = lab.L - 0.0894841775 * lab.a - 1.291485548 * lab.b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  return {
    r: Math.round(Math.max(0, Math.min(255, linearToSrgb(r) * 255))),
    g: Math.round(Math.max(0, Math.min(255, linearToSrgb(g) * 255))),
    b: Math.round(Math.max(0, Math.min(255, linearToSrgb(b) * 255))),
  }
}

/**
 * Convert RGB to OKLCH
 */
export function rgbToOklch(rgb: RGBColor): OKLCHColor {
  const lab = rgbToOklab(rgb)
  const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b)
  let h = Math.atan2(lab.b, lab.a) * (180 / Math.PI)
  if (h < 0) h += 360
  return { l: lab.L, c, h }
}

/**
 * Convert OKLCH to RGB
 */
export function oklchToRgb(oklch: OKLCHColor): RGBColor {
  const hRad = oklch.h * (Math.PI / 180)
  const lab = {
    L: oklch.l,
    a: oklch.c * Math.cos(hRad),
    b: oklch.c * Math.sin(hRad),
  }
  return oklabToRgb(lab)
}

/**
 * Convert hex to OKLCH string
 */
export function hexToOklch(hex: string): string {
  const rgb = hexToRGB(hex)
  const oklch = rgbToOklch(rgb)
  return `${(oklch.l * 100).toFixed(1)}% ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)}`
}

/**
 * Convert OKLCH string to hex
 */
export function oklchToHex(oklchString: string): string {
  const parts = oklchString.split(' ')
  const l = parseFloat(parts[0] ?? '0') / 100
  const c = parseFloat(parts[1] ?? '0')
  const h = parseFloat(parts[2] ?? '0')
  const rgb = oklchToRgb({ l, c, h })
  return rgbToHex(rgb)
}

// ============================================================================
// Color Blindness Simulation
// ============================================================================

/**
 * Color blindness types
 */
export type ColorBlindnessType =
  | 'protanopia' // Red-blind
  | 'deuteranopia' // Green-blind
  | 'tritanopia' // Blue-blind
  | 'protanomaly' // Red-weak
  | 'deuteranomaly' // Green-weak
  | 'tritanomaly' // Blue-weak
  | 'achromatopsia' // Total color blindness
  | 'achromatomaly' // Partial color blindness

/**
 * Color blindness simulation matrices
 * Based on research by Machado et al. (2009)
 */
const colorBlindnessMatrices: Record<ColorBlindnessType, number[][]> = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  protanomaly: [
    [0.817, 0.183, 0],
    [0.333, 0.667, 0],
    [0, 0.125, 0.875],
  ],
  deuteranomaly: [
    [0.8, 0.2, 0],
    [0.258, 0.742, 0],
    [0, 0.142, 0.858],
  ],
  tritanomaly: [
    [0.967, 0.033, 0],
    [0, 0.733, 0.267],
    [0, 0.183, 0.817],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
  achromatomaly: [
    [0.618, 0.32, 0.062],
    [0.163, 0.775, 0.062],
    [0.163, 0.32, 0.516],
  ],
}

/**
 * Simulate how a color appears to someone with color blindness
 */
export function simulateColorBlindness(
  hex: string,
  type: ColorBlindnessType
): string {
  const rgb = hexToRGB(hex)
  const matrix = colorBlindnessMatrices[type]

  // Type-safe matrix access with fallback
  const row0 = matrix[0] ?? [1, 0, 0]
  const row1 = matrix[1] ?? [0, 1, 0]
  const row2 = matrix[2] ?? [0, 0, 1]

  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const newR = (row0[0] ?? 1) * r + (row0[1] ?? 0) * g + (row0[2] ?? 0) * b
  const newG = (row1[0] ?? 0) * r + (row1[1] ?? 1) * g + (row1[2] ?? 0) * b
  const newB = (row2[0] ?? 0) * r + (row2[1] ?? 0) * g + (row2[2] ?? 1) * b

  return rgbToHex({
    r: Math.round(Math.max(0, Math.min(255, newR * 255))),
    g: Math.round(Math.max(0, Math.min(255, newG * 255))),
    b: Math.round(Math.max(0, Math.min(255, newB * 255))),
  })
}

/**
 * Get all color blindness simulations for a color
 */
export function getAllColorBlindnessSimulations(
  hex: string
): Record<ColorBlindnessType, string> {
  const types: ColorBlindnessType[] = [
    'protanopia',
    'deuteranopia',
    'tritanopia',
    'protanomaly',
    'deuteranomaly',
    'tritanomaly',
    'achromatopsia',
    'achromatomaly',
  ]

  const result: Partial<Record<ColorBlindnessType, string>> = {}
  for (const type of types) {
    result[type] = simulateColorBlindness(hex, type)
  }
  return result as Record<ColorBlindnessType, string>
}

/**
 * Check if two colors are distinguishable for all color blindness types
 */
export function areColorsDistinguishable(
  hex1: string,
  hex2: string,
  minContrast: number = 3
): {
  distinguishable: boolean
  issues: ColorBlindnessType[]
} {
  const issues: ColorBlindnessType[] = []
  const types: ColorBlindnessType[] = [
    'protanopia',
    'deuteranopia',
    'tritanopia',
  ]

  for (const type of types) {
    const sim1 = simulateColorBlindness(hex1, type)
    const sim2 = simulateColorBlindness(hex2, type)
    const contrast = getContrastRatio(
      hexToHSLString(sim1),
      hexToHSLString(sim2)
    )
    if (contrast < minContrast) {
      issues.push(type)
    }
  }

  return {
    distinguishable: issues.length === 0,
    issues,
  }
}

// ============================================================================
// Harmonious Palette Generation
// ============================================================================

/**
 * Color harmony type
 */
export type ColorHarmony =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'split-complementary'
  | 'square'
  | 'monochromatic'

/**
 * Generate a harmonious color palette based on color theory
 */
export function generateHarmoniousPalette(
  baseHex: string,
  harmony: ColorHarmony,
  count: number = 5
): string[] {
  const rgb = hexToRGB(baseHex)
  const hsl = rgbToHSL(rgb)
  const results: string[] = [baseHex]

  switch (harmony) {
    case 'complementary':
      results.push(hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }))
      break

    case 'analogous':
      results.push(hslToHex({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l }))
      results.push(hslToHex({ h: (hsl.h + 330) % 360, s: hsl.s, l: hsl.l }))
      break

    case 'triadic':
      results.push(hslToHex({ h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l }))
      results.push(hslToHex({ h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l }))
      break

    case 'tetradic':
      results.push(hslToHex({ h: (hsl.h + 90) % 360, s: hsl.s, l: hsl.l }))
      results.push(hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }))
      results.push(hslToHex({ h: (hsl.h + 270) % 360, s: hsl.s, l: hsl.l }))
      break

    case 'split-complementary':
      results.push(hslToHex({ h: (hsl.h + 150) % 360, s: hsl.s, l: hsl.l }))
      results.push(hslToHex({ h: (hsl.h + 210) % 360, s: hsl.s, l: hsl.l }))
      break

    case 'square':
      results.push(hslToHex({ h: (hsl.h + 90) % 360, s: hsl.s, l: hsl.l }))
      results.push(hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }))
      results.push(hslToHex({ h: (hsl.h + 270) % 360, s: hsl.s, l: hsl.l }))
      break

    case 'monochromatic':
      for (let i = 1; i < count; i++) {
        const newL = Math.max(10, Math.min(90, hsl.l - 30 + i * 15))
        results.push(hslToHex({ h: hsl.h, s: hsl.s, l: newL }))
      }
      return results
  }

  // Fill remaining slots with variations
  while (results.length < count) {
    const baseIdx = results.length % (results.length - 1 || 1)
    const baseColor = hexToRGB(results[baseIdx] || baseHex)
    const baseHsl = rgbToHSL(baseColor)
    const variation = results.length % 2 === 0 ? 15 : -15
    results.push(
      hslToHex({
        h: baseHsl.h,
        s: Math.max(20, Math.min(100, baseHsl.s + variation)),
        l: Math.max(20, Math.min(80, baseHsl.l + variation)),
      })
    )
  }

  return results.slice(0, count)
}

function hslToHex(hsl: HSLColor): string {
  const rgb = hslToRGB(hsl)
  return rgbToHex(rgb)
}

/**
 * Generate a color scale (shades and tints) from a base color
 */
export function generateColorScale(
  baseHex: string,
  steps: number = 11
): Record<number, string> {
  const rgb = hexToRGB(baseHex)
  const oklch = rgbToOklch(rgb)
  const scale: Record<number, string> = {}

  // Generate steps from 50 to 950
  const stepValues = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  for (let i = 0; i < Math.min(steps, stepValues.length); i++) {
    const step = stepValues[i]
    // Map step to lightness (50 = lightest, 950 = darkest)
    const targetL = 0.98 - (step / 1000) * 0.92
    const newOklch = { ...oklch, l: targetL }
    const newRgb = oklchToRgb(newOklch)
    scale[step] = rgbToHex(newRgb)
  }

  return scale
}

/**
 * Generate semantic colors from a brand color
 */
export function generateSemanticColors(brandHex: string): {
  primary: string
  primaryLight: string
  primaryDark: string
  secondary: string
  accent: string
  success: string
  warning: string
  error: string
  info: string
} {
  const rgb = hexToRGB(brandHex)
  const hsl = rgbToHSL(rgb)

  return {
    primary: brandHex,
    primaryLight: hslToHex({ h: hsl.h, s: hsl.s, l: Math.min(90, hsl.l + 20) }),
    primaryDark: hslToHex({ h: hsl.h, s: hsl.s, l: Math.max(10, hsl.l - 20) }),
    secondary: hslToHex({
      h: (hsl.h + 30) % 360,
      s: Math.max(20, hsl.s - 20),
      l: hsl.l,
    }),
    accent: hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }),
    success: '#16a34a', // Forest green
    warning: '#d97706', // Amber
    error: '#dc2626', // Red
    info: '#0ea5e9', // Sky blue
  }
}

// ============================================================================
// Gradient Generation
// ============================================================================

/**
 * Gradient direction
 */
export type GradientDirection =
  | 'to-right'
  | 'to-left'
  | 'to-bottom'
  | 'to-top'
  | 'to-bottom-right'
  | 'to-bottom-left'
  | 'to-top-right'
  | 'to-top-left'
  | number // Degrees

/**
 * Gradient stop
 */
export interface GradientStop {
  color: string
  position?: number // 0-100
}

/**
 * Generate CSS gradient string
 */
export function generateGradient(
  stops: GradientStop[],
  direction: GradientDirection = 'to-right',
  type: 'linear' | 'radial' = 'linear'
): string {
  const directionMap: Record<string, string> = {
    'to-right': 'to right',
    'to-left': 'to left',
    'to-bottom': 'to bottom',
    'to-top': 'to top',
    'to-bottom-right': 'to bottom right',
    'to-bottom-left': 'to bottom left',
    'to-top-right': 'to top right',
    'to-top-left': 'to top left',
  }

  const dir =
    typeof direction === 'number'
      ? `${direction}deg`
      : directionMap[direction] || direction

  const stopsStr = stops
    .map((stop, i) => {
      const position =
        stop.position !== undefined
          ? `${stop.position}%`
          : `${(i / (stops.length - 1)) * 100}%`
      return `${stop.color} ${position}`
    })
    .join(', ')

  if (type === 'radial') {
    return `radial-gradient(circle, ${stopsStr})`
  }

  return `linear-gradient(${dir}, ${stopsStr})`
}

/**
 * Generate a smooth gradient between two colors using OKLCH interpolation
 */
export function generateSmoothGradient(
  startHex: string,
  endHex: string,
  steps: number = 5
): string[] {
  const startRgb = hexToRGB(startHex)
  const endRgb = hexToRGB(endHex)
  const startOklch = rgbToOklch(startRgb)
  const endOklch = rgbToOklch(endRgb)

  // Handle hue interpolation (shortest path)
  let hueStart = startOklch.h
  let hueEnd = endOklch.h
  if (Math.abs(hueEnd - hueStart) > 180) {
    if (hueEnd > hueStart) {
      hueStart += 360
    } else {
      hueEnd += 360
    }
  }

  const colors: string[] = []
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1)
    const l = startOklch.l + (endOklch.l - startOklch.l) * t
    const c = startOklch.c + (endOklch.c - startOklch.c) * t
    const h = (hueStart + (hueEnd - hueStart) * t) % 360
    const rgb = oklchToRgb({ l, c, h })
    colors.push(rgbToHex(rgb))
  }

  return colors
}

/**
 * Generate a mesh gradient (multiple colors)
 */
export function generateMeshGradient(colors: string[]): string {
  if (colors.length < 2) return colors[0] || '#000000'

  const gradients: string[] = []
  const positions = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
    { x: 50, y: 50 },
  ]

  colors.slice(0, 5).forEach((color, i) => {
    const pos = positions[i % positions.length]
    gradients.push(
      `radial-gradient(ellipse at ${pos.x}% ${pos.y}%, ${color}88 0%, transparent 60%)`
    )
  })

  return gradients.join(', ')
}

// ============================================================================
// Color Mixing and Blending
// ============================================================================

/**
 * Mix two colors in OKLCH space for perceptually uniform results
 */
export function mixColors(
  hex1: string,
  hex2: string,
  ratio: number = 0.5
): string {
  const rgb1 = hexToRGB(hex1)
  const rgb2 = hexToRGB(hex2)
  const oklch1 = rgbToOklch(rgb1)
  const oklch2 = rgbToOklch(rgb2)

  // Handle hue interpolation
  let h1 = oklch1.h
  let h2 = oklch2.h
  if (Math.abs(h2 - h1) > 180) {
    if (h2 > h1) h1 += 360
    else h2 += 360
  }

  const mixed = {
    l: oklch1.l + (oklch2.l - oklch1.l) * ratio,
    c: oklch1.c + (oklch2.c - oklch1.c) * ratio,
    h: (h1 + (h2 - h1) * ratio) % 360,
  }

  return rgbToHex(oklchToRgb(mixed))
}

/**
 * Blend modes
 */
export type BlendMode =
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'soft-light'

/**
 * Apply blend mode to two colors
 */
export function blendColors(
  baseHex: string,
  blendHex: string,
  mode: BlendMode
): string {
  const base = hexToRGB(baseHex)
  const blend = hexToRGB(blendHex)

  const blendChannel = (b: number, l: number): number => {
    b /= 255
    l /= 255
    let result: number

    switch (mode) {
      case 'multiply':
        result = b * l
        break
      case 'screen':
        result = 1 - (1 - b) * (1 - l)
        break
      case 'overlay':
        result = b < 0.5 ? 2 * b * l : 1 - 2 * (1 - b) * (1 - l)
        break
      case 'darken':
        result = Math.min(b, l)
        break
      case 'lighten':
        result = Math.max(b, l)
        break
      case 'color-dodge':
        result = l === 1 ? 1 : Math.min(1, b / (1 - l))
        break
      case 'color-burn':
        result = l === 0 ? 0 : Math.max(0, 1 - (1 - b) / l)
        break
      case 'soft-light':
        result =
          l < 0.5
            ? b - (1 - 2 * l) * b * (1 - b)
            : b + (2 * l - 1) * (Math.sqrt(b) - b)
        break
      default:
        result = b
    }

    return Math.round(Math.max(0, Math.min(255, result * 255)))
  }

  return rgbToHex({
    r: blendChannel(base.r, blend.r),
    g: blendChannel(base.g, blend.g),
    b: blendChannel(base.b, blend.b),
  })
}

// ============================================================================
// Auto-Adjustment Utilities
// ============================================================================

/**
 * Auto-adjust a color to meet contrast requirements
 */
export function autoAdjustForContrast(
  foregroundHex: string,
  backgroundHex: string,
  targetRatio: number = 4.5
): string {
  const fgHsl = hexToHSLString(foregroundHex)
  const bgHsl = hexToHSLString(backgroundHex)

  const currentRatio = getContrastRatio(fgHsl, bgHsl)
  if (currentRatio >= targetRatio) return foregroundHex

  const fgRgb = hexToRGB(foregroundHex)
  const bgRgb = hexToRGB(backgroundHex)
  const bgLuminance = getLuminance(bgRgb)

  // Determine if we should lighten or darken
  const shouldLighten = bgLuminance < 0.5

  const oklch = rgbToOklch(fgRgb)
  let adjustedL = oklch.l

  // Binary search for the right lightness
  let low = shouldLighten ? oklch.l : 0
  let high = shouldLighten ? 1 : oklch.l

  for (let i = 0; i < 20; i++) {
    adjustedL = (low + high) / 2
    const adjustedRgb = oklchToRgb({ ...oklch, l: adjustedL })
    const adjustedHsl = hexToHSLString(rgbToHex(adjustedRgb))
    const ratio = getContrastRatio(adjustedHsl, bgHsl)

    if (Math.abs(ratio - targetRatio) < 0.1) break

    if (ratio < targetRatio) {
      if (shouldLighten) low = adjustedL
      else high = adjustedL
    } else {
      if (shouldLighten) high = adjustedL
      else low = adjustedL
    }
  }

  return rgbToHex(oklchToRgb({ ...oklch, l: adjustedL }))
}

/**
 * Generate a readable text color for any background
 */
export function getReadableTextColor(backgroundHex: string): {
  light: string
  dark: string
  recommended: string
} {
  const bgRgb = hexToRGB(backgroundHex)
  const luminance = getLuminance(bgRgb)

  return {
    light: '#ffffff',
    dark: '#171717',
    recommended: luminance > 0.179 ? '#171717' : '#ffffff',
  }
}

/**
 * Analyze a color and provide useful information
 */
export function analyzeColor(hex: string): {
  hex: string
  rgb: RGBColor
  hsl: HSLColor
  oklch: OKLCHColor
  luminance: number
  isLight: boolean
  isDark: boolean
  recommendedTextColor: string
  scale: Record<number, string>
  colorBlindness: Record<ColorBlindnessType, string>
} {
  const rgb = hexToRGB(hex)
  const hsl = rgbToHSL(rgb)
  const oklch = rgbToOklch(rgb)
  const luminance = getLuminance(rgb)
  const isLight = luminance > 0.5
  const isDark = !isLight

  return {
    hex,
    rgb,
    hsl,
    oklch,
    luminance,
    isLight,
    isDark,
    recommendedTextColor: getReadableTextColor(hex).recommended,
    scale: generateColorScale(hex),
    colorBlindness: getAllColorBlindnessSimulations(hex),
  }
}
