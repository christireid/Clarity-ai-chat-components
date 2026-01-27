/**
 * Contrast Ratio Tests
 *
 * Tests WCAG AA compliance for message bubble gradients
 * WCAG AA requires 4.5:1 for normal text, 3:1 for large text
 */

import { describe, it, expect } from 'vitest'

/**
 * Calculate relative luminance for RGB color
 * https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-procedure
 */
function getContrastRatio(
  color1: [number, number, number],
  color2: [number, number, number]
): number {
  const lum1 = getLuminance(...color1)
  const lum2 = getLuminance(...color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100

  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ]
}

/**
 * Blend two RGB colors with given opacity
 */
function blendColors(
  fg: [number, number, number],
  bg: [number, number, number],
  opacity: number
): [number, number, number] {
  return [
    Math.round(fg[0] * opacity + bg[0] * (1 - opacity)),
    Math.round(fg[1] * opacity + bg[1] * (1 - opacity)),
    Math.round(fg[2] * opacity + bg[2] * (1 - opacity)),
  ]
}

describe('Message Bubble Gradient Contrast', () => {
  describe('Light Mode (FIXED)', () => {
    const primaryMessageStart = hslToRgb(214, 90, 48) // --primary-message (start)
    const primaryMessageEnd = hslToRgb(214, 90, 45) // --primary-message-end (end)
    const primaryForeground = hslToRgb(0, 0, 100) // white text

    it('should have sufficient contrast at gradient start', () => {
      const ratio = getContrastRatio(primaryForeground, primaryMessageStart)

      // WCAG AA requires 4.5:1 for normal text
      expect(ratio).toBeGreaterThanOrEqual(4.5)

      if (process.env.NODE_ENV === 'development') {
        console.log(
          '✓ Light mode gradient start contrast:',
          ratio.toFixed(2) + ':1'
        )
      }
    })

    it('should have sufficient contrast at gradient end', () => {
      const ratio = getContrastRatio(primaryForeground, primaryMessageEnd)

      // WCAG AA requires 4.5:1 for normal text
      expect(ratio).toBeGreaterThanOrEqual(4.5)

      if (process.env.NODE_ENV === 'development') {
        console.log(
          '✓ Light mode gradient end contrast:',
          ratio.toFixed(2) + ':1'
        )
      }
    })
  })

  describe('Light Mode (OLD - Should Fail)', () => {
    const lightBackground = hslToRgb(210, 20, 98) // --background in light mode
    const primaryColor = hslToRgb(214, 90, 55) // OLD --primary in light mode
    const primaryForeground = hslToRgb(0, 0, 100) // white text

    it('should FAIL contrast at gradient start (OLD)', () => {
      const ratio = getContrastRatio(primaryForeground, primaryColor)

      if (process.env.NODE_ENV === 'development') {
        console.log(
          '✗ OLD Light mode gradient start contrast:',
          ratio.toFixed(2) + ':1'
        )
      }

      // This should fail to show the problem was real
      expect(ratio).toBeLessThan(4.5)
    })

    it('should FAIL contrast at gradient end (OLD with 90% opacity)', () => {
      // At 90% opacity, primary blends with background
      const blendedBg = blendColors(primaryColor, lightBackground, 0.9)
      const ratio = getContrastRatio(primaryForeground, blendedBg)

      if (process.env.NODE_ENV === 'development') {
        console.log(
          '✗ OLD Light mode gradient end contrast:',
          ratio.toFixed(2) + ':1'
        )
      }

      // This should fail even more
      expect(ratio).toBeLessThan(4.5)
    })
  })

  describe('Dark Mode', () => {
    const darkBackground = hslToRgb(222, 47, 11) // --background in dark mode
    const primaryColor = hslToRgb(214, 88, 72) // --primary in dark mode (lighter blue)
    const primaryForeground = hslToRgb(222, 47, 11) // very dark text (same as background!)

    it('should have sufficient contrast at gradient start (100% opacity)', () => {
      const ratio = getContrastRatio(primaryForeground, primaryColor)

      if (process.env.NODE_ENV === 'development') {
        console.log(
          'Dark mode gradient start contrast:',
          ratio.toFixed(2) + ':1'
        )
      }

      // WCAG AA requires 4.5:1 for normal text
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })

    it('should have sufficient contrast at gradient end (90% opacity)', () => {
      // At 90% opacity, primary blends with background
      const blendedBg = blendColors(primaryColor, darkBackground, 0.9)
      const ratio = getContrastRatio(primaryForeground, blendedBg)

      if (process.env.NODE_ENV === 'development') {
        console.log('Dark mode gradient end contrast:', ratio.toFixed(2) + ':1')
        console.log('Blended background RGB:', blendedBg)
      }

      // This is likely passing since both fg and bg are dark
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })
  })
})
