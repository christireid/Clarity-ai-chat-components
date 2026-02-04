/**
 * Enhanced OKLCH Color System Tests
 *
 * Additional test coverage for:
 * - OKLCH utility functions (manipulation, conversion)
 * - Tailwind integration with OKLCH
 * - Color transformation edge cases
 * - WCAG contrast validation
 * - CSS variable integration
 */

import { describe, it, expect } from 'vitest'
import {
  parseOklch,
  toOklchString,
  lighten,
  darken,
  saturate,
  desaturate,
  rotateHue,
  setAlpha,
  mix,
  contrastRatio,
  meetsWcagAA,
  meetsWcagAAA,
  suggestContrastAdjustment,
  type OklchColor,
} from '../../utils/color/oklch'

describe('OKLCH Utility Functions', () => {
  describe('parseOklch', () => {
    it('should parse OKLCH with percentage lightness', () => {
      const result = parseOklch('oklch(85% 0.05 240)')
      expect(result).toEqual({ l: 85, c: 0.05, h: 240, a: 1 })
    })

    it('should parse OKLCH with decimal lightness', () => {
      const result = parseOklch('oklch(0.85 0.05 240)')
      expect(result).toEqual({ l: 0.85, c: 0.05, h: 240, a: 1 })
    })

    it('should parse OKLCH without oklch() wrapper', () => {
      const result = parseOklch('85% 0.05 240')
      expect(result).toEqual({ l: 85, c: 0.05, h: 240, a: 1 })
    })

    it('should parse OKLCH with alpha channel', () => {
      const result = parseOklch('oklch(85% 0.05 240 / 0.9)')
      expect(result).toEqual({ l: 85, c: 0.05, h: 240, a: 0.9 })
    })

    it('should throw on invalid format', () => {
      expect(() => parseOklch('invalid')).toThrow('Invalid OKLCH value')
      expect(() => parseOklch('rgb(255, 0, 0)')).toThrow('Invalid OKLCH value')
    })

    it('should handle edge case values', () => {
      expect(parseOklch('oklch(0% 0 0)')).toEqual({ l: 0, c: 0, h: 0, a: 1 })
      expect(parseOklch('oklch(100% 0.4 360)')).toEqual({
        l: 100,
        c: 0.4,
        h: 360,
        a: 1,
      })
    })
  })

  describe('toOklchString', () => {
    it('should convert OklchColor to CSS string', () => {
      const color: OklchColor = { l: 85, c: 0.05, h: 240 }
      expect(toOklchString(color)).toBe('oklch(85% 0.05 240)')
    })

    it('should include alpha when present', () => {
      const color: OklchColor = { l: 85, c: 0.05, h: 240, a: 0.9 }
      expect(toOklchString(color)).toBe('oklch(85% 0.05 240 / 0.9)')
    })

    it('should omit alpha when 1', () => {
      const color: OklchColor = { l: 85, c: 0.05, h: 240, a: 1 }
      expect(toOklchString(color)).toBe('oklch(85% 0.05 240)')
    })

    it('should handle edge case values', () => {
      const black: OklchColor = { l: 0, c: 0, h: 0 }
      expect(toOklchString(black)).toBe('oklch(0% 0 0)')

      const white: OklchColor = { l: 100, c: 0, h: 0 }
      expect(toOklchString(white)).toBe('oklch(100% 0 0)')
    })
  })

  describe('lighten', () => {
    it('should increase lightness by percentage', () => {
      const color: OklchColor = { l: 50, c: 0.1, h: 200 }
      const result = lighten(color, 10)
      expect(result.l).toBe(60)
    })

    it('should cap lightness at 100', () => {
      const color: OklchColor = { l: 95, c: 0.1, h: 200 }
      const result = lighten(color, 10)
      expect(result.l).toBe(100)
    })

    it('should not modify other properties', () => {
      const color: OklchColor = { l: 50, c: 0.1, h: 200, a: 0.8 }
      const result = lighten(color, 10)
      expect(result.c).toBe(0.1)
      expect(result.h).toBe(200)
      expect(result.a).toBe(0.8)
    })
  })

  describe('darken', () => {
    it('should decrease lightness by percentage', () => {
      const color: OklchColor = { l: 50, c: 0.1, h: 200 }
      const result = darken(color, 10)
      expect(result.l).toBe(40)
    })

    it('should cap lightness at 0', () => {
      const color: OklchColor = { l: 5, c: 0.1, h: 200 }
      const result = darken(color, 10)
      expect(result.l).toBe(0)
    })
  })

  describe('saturate', () => {
    it('should increase chroma', () => {
      const color: OklchColor = { l: 50, c: 0.1, h: 200 }
      const result = saturate(color, 0.05)
      expect(result.c).toBeCloseTo(0.15, 10)
    })

    it('should cap chroma at 0.4', () => {
      const color: OklchColor = { l: 50, c: 0.38, h: 200 }
      const result = saturate(color, 0.05)
      expect(result.c).toBe(0.4)
    })
  })

  describe('desaturate', () => {
    it('should decrease chroma', () => {
      const color: OklchColor = { l: 50, c: 0.1, h: 200 }
      const result = desaturate(color, 0.05)
      expect(result.c).toBe(0.05)
    })

    it('should cap chroma at 0', () => {
      const color: OklchColor = { l: 50, c: 0.02, h: 200 }
      const result = desaturate(color, 0.05)
      expect(result.c).toBe(0)
    })
  })

  describe('rotateHue', () => {
    it('should rotate hue by degrees', () => {
      const color: OklchColor = { l: 50, c: 0.1, h: 200 }
      const result = rotateHue(color, 60)
      expect(result.h).toBe(260)
    })

    it('should wrap hue at 360 degrees', () => {
      const color: OklchColor = { l: 50, c: 0.1, h: 340 }
      const result = rotateHue(color, 40)
      expect(result.h).toBe(20)
    })

    it('should handle negative rotation', () => {
      const color: OklchColor = { l: 50, c: 0.1, h: 20 }
      const result = rotateHue(color, -40)
      expect(result.h).toBe(340)
    })
  })

  describe('setAlpha', () => {
    it('should set alpha value', () => {
      const color: OklchColor = { l: 50, c: 0.1, h: 200 }
      const result = setAlpha(color, 0.5)
      expect(result.a).toBe(0.5)
    })

    it('should clamp alpha to 0-1 range', () => {
      const color: OklchColor = { l: 50, c: 0.1, h: 200 }
      expect(setAlpha(color, 1.5).a).toBe(1)
      expect(setAlpha(color, -0.5).a).toBe(0)
    })
  })

  describe('mix', () => {
    it('should mix two colors at 50%', () => {
      const color1: OklchColor = { l: 0, c: 0, h: 0 }
      const color2: OklchColor = { l: 100, c: 0.4, h: 360 }
      const result = mix(color1, color2, 0.5)

      expect(result.l).toBe(50)
      expect(result.c).toBe(0.2)
      expect(result.h).toBe(180)
    })

    it('should return first color at ratio 0', () => {
      const color1: OklchColor = { l: 20, c: 0.1, h: 100 }
      const color2: OklchColor = { l: 80, c: 0.3, h: 200 }
      const result = mix(color1, color2, 0)

      expect(result).toEqual({ ...color1, a: 1 })
    })

    it('should return second color at ratio 1', () => {
      const color1: OklchColor = { l: 20, c: 0.1, h: 100 }
      const color2: OklchColor = { l: 80, c: 0.3, h: 200 }
      const result = mix(color1, color2, 1)

      expect(result).toEqual({ ...color2, a: 1 })
    })

    it('should handle alpha mixing', () => {
      const color1: OklchColor = { l: 50, c: 0.1, h: 200, a: 0.2 }
      const color2: OklchColor = { l: 50, c: 0.1, h: 200, a: 0.8 }
      const result = mix(color1, color2, 0.5)

      expect(result.a).toBe(0.5)
    })
  })
})

describe('WCAG Contrast Validation', () => {
  describe('contrastRatio', () => {
    it('should calculate contrast ratio for light text on dark bg', () => {
      const fg: OklchColor = { l: 95, c: 0, h: 0 } // near white
      const bg: OklchColor = { l: 20, c: 0, h: 0 } // dark gray

      const ratio = contrastRatio(fg, bg)
      expect(ratio).toBeGreaterThan(10) // Should be high contrast
    })

    it('should calculate contrast ratio for dark text on light bg', () => {
      const fg: OklchColor = { l: 20, c: 0, h: 0 } // dark gray
      const bg: OklchColor = { l: 95, c: 0, h: 0 } // near white

      const ratio = contrastRatio(fg, bg)
      expect(ratio).toBeGreaterThan(10) // Should be high contrast
    })

    it('should return low ratio for similar colors', () => {
      const fg: OklchColor = { l: 50, c: 0.1, h: 200 }
      const bg: OklchColor = { l: 55, c: 0.1, h: 200 }

      const ratio = contrastRatio(fg, bg)
      expect(ratio).toBeLessThan(2)
    })

    it('should return 1 for identical colors', () => {
      const color: OklchColor = { l: 50, c: 0.1, h: 200 }
      const ratio = contrastRatio(color, color)

      expect(ratio).toBeCloseTo(1, 1)
    })

    it('should handle AI-specific colors from CSS', () => {
      // Light mode assistant background
      const lightAssistant = parseOklch('oklch(96% 0.02 220)')
      // Dark text on it
      const darkText: OklchColor = { l: 20, c: 0, h: 0 }

      const ratio = contrastRatio(darkText, lightAssistant)
      expect(ratio).toBeGreaterThan(4.5) // Should meet WCAG AA
    })
  })

  describe('meetsWcagAA', () => {
    it('should pass for sufficient contrast (normal text)', () => {
      const fg: OklchColor = { l: 95, c: 0, h: 0 }
      const bg: OklchColor = { l: 30, c: 0, h: 0 }

      expect(meetsWcagAA(fg, bg, false)).toBe(true)
    })

    it('should fail for insufficient contrast (normal text)', () => {
      const fg: OklchColor = { l: 60, c: 0.1, h: 200 }
      const bg: OklchColor = { l: 65, c: 0.1, h: 200 }

      expect(meetsWcagAA(fg, bg, false)).toBe(false)
    })

    it('should pass for large text with 3:1 ratio', () => {
      const fg: OklchColor = { l: 80, c: 0.1, h: 200 }
      const bg: OklchColor = { l: 30, c: 0.1, h: 200 }

      expect(meetsWcagAA(fg, bg, true)).toBe(true)
    })

    it('should validate light mode AI colors meet WCAG AA', () => {
      const assistant = parseOklch('oklch(96% 0.02 220)')
      const user = parseOklch('oklch(92% 0.06 260)')
      const darkText: OklchColor = { l: 20, c: 0, h: 0 }

      expect(meetsWcagAA(darkText, assistant)).toBe(true)
      expect(meetsWcagAA(darkText, user)).toBe(true)
    })
  })

  describe('meetsWcagAAA', () => {
    it('should pass for very high contrast (normal text)', () => {
      const fg: OklchColor = { l: 100, c: 0, h: 0 }
      const bg: OklchColor = { l: 0, c: 0, h: 0 }

      expect(meetsWcagAAA(fg, bg, false)).toBe(true)
    })

    it('should fail for moderate contrast (normal text)', () => {
      const fg: OklchColor = { l: 70, c: 0.1, h: 200 }
      const bg: OklchColor = { l: 30, c: 0.1, h: 200 }

      expect(meetsWcagAAA(fg, bg, false)).toBe(false)
    })

    it('should pass for large text with 4.5:1 ratio', () => {
      const fg: OklchColor = { l: 80, c: 0.1, h: 200 }
      const bg: OklchColor = { l: 30, c: 0.1, h: 200 }

      expect(meetsWcagAAA(fg, bg, true)).toBe(true)
    })
  })

  describe('suggestContrastAdjustment', () => {
    it('should suggest lightness increase for light foreground', () => {
      const fg: OklchColor = { l: 60, c: 0.1, h: 200 }
      const bg: OklchColor = { l: 40, c: 0.1, h: 200 }

      const adjustment = suggestContrastAdjustment(fg, bg, 4.5)
      expect(adjustment).toBeGreaterThan(0) // Should lighten
    })

    it('should suggest lightness decrease for dark foreground', () => {
      const fg: OklchColor = { l: 40, c: 0.1, h: 200 }
      const bg: OklchColor = { l: 60, c: 0.1, h: 200 }

      const adjustment = suggestContrastAdjustment(fg, bg, 4.5)
      expect(adjustment).toBeLessThan(0) // Should darken
    })

    it('should return 0 when contrast is already sufficient', () => {
      const fg: OklchColor = { l: 95, c: 0, h: 0 }
      const bg: OklchColor = { l: 20, c: 0, h: 0 }

      const adjustment = suggestContrastAdjustment(fg, bg, 4.5)
      expect(adjustment).toBe(0)
    })
  })
})

describe('Edge Cases and Invalid Values', () => {
  describe('Boundary value testing', () => {
    it('should handle lightness at boundaries', () => {
      expect(() => parseOklch('oklch(0% 0.1 200)')).not.toThrow()
      expect(() => parseOklch('oklch(100% 0.1 200)')).not.toThrow()
    })

    it('should handle chroma at boundaries', () => {
      expect(() => parseOklch('oklch(50% 0 200)')).not.toThrow()
      expect(() => parseOklch('oklch(50% 0.5 200)')).not.toThrow()
    })

    it('should handle hue at boundaries', () => {
      expect(() => parseOklch('oklch(50% 0.1 0)')).not.toThrow()
      expect(() => parseOklch('oklch(50% 0.1 360)')).not.toThrow()
    })

    it('should handle alpha at boundaries', () => {
      expect(() => parseOklch('oklch(50% 0.1 200 / 0)')).not.toThrow()
      expect(() => parseOklch('oklch(50% 0.1 200 / 1)')).not.toThrow()
    })
  })

  describe('Negative values', () => {
    it('should parse negative lightness (may occur in calculations)', () => {
      const color: OklchColor = { l: -10, c: 0.1, h: 200 }
      const result = darken(color, 5)
      expect(result.l).toBe(0) // Should clamp to 0
    })

    it('should parse negative chroma (may occur in calculations)', () => {
      const color: OklchColor = { l: 50, c: -0.1, h: 200 }
      const result = desaturate(color, 0.05)
      expect(result.c).toBe(0) // Should clamp to 0
    })
  })

  describe('Decimal precision', () => {
    it('should handle high-precision decimal values', () => {
      const color = parseOklch('oklch(85.123456% 0.051234 240.789)')
      expect(color.l).toBeCloseTo(85.123456, 4)
      expect(color.c).toBeCloseTo(0.051234, 4)
      expect(color.h).toBeCloseTo(240.789, 4)
    })

    it('should round-trip conversions accurately', () => {
      const original = 'oklch(85.5% 0.125 240.75 / 0.85)'
      const parsed = parseOklch(original)
      const stringified = toOklchString(parsed)
      const reparsed = parseOklch(stringified)

      expect(reparsed.l).toBeCloseTo(parsed.l, 2)
      expect(reparsed.c).toBeCloseTo(parsed.c, 4)
      expect(reparsed.h).toBeCloseTo(parsed.h, 2)
      expect(reparsed.a).toBeCloseTo(parsed.a!, 2)
    })
  })
})

describe('Integration with Tailwind CSS Variables', () => {
  describe('AI color variables format', () => {
    it('should parse all light mode AI colors', () => {
      const aiColors = {
        assistant: 'oklch(96% 0.02 220)',
        user: 'oklch(92% 0.06 260)',
        system: 'oklch(95% 0.03 180)',
        thinking: 'oklch(94% 0.04 280)',
        tool: 'oklch(93% 0.05 160)',
        error: 'oklch(91% 0.12 25)',
      }

      Object.entries(aiColors).forEach(([name, value]) => {
        expect(() => parseOklch(value)).not.toThrow()
        const parsed = parseOklch(value)
        expect(parsed.l).toBeGreaterThanOrEqual(85)
        expect(parsed.l).toBeLessThanOrEqual(98)
      })
    })

    it('should parse all dark mode AI colors', () => {
      const aiColorsDark = {
        assistant: 'oklch(25% 0.04 220)',
        user: 'oklch(30% 0.08 260)',
        system: 'oklch(22% 0.05 180)',
        thinking: 'oklch(28% 0.06 280)',
        tool: 'oklch(27% 0.07 160)',
        error: 'oklch(35% 0.15 25)',
      }

      Object.entries(aiColorsDark).forEach(([name, value]) => {
        expect(() => parseOklch(value)).not.toThrow()
        const parsed = parseOklch(value)
        expect(parsed.l).toBeGreaterThanOrEqual(15)
        expect(parsed.l).toBeLessThanOrEqual(40)
      })
    })
  })

  describe('Tailwind glass gradients', () => {
    it('should parse glass pastel gradients from tailwind.config', () => {
      // Simulate parsing gradient start/end colors
      const glassBlue = {
        start: parseOklch('oklch(95% 0.02 240)'),
        end: parseOklch('oklch(97% 0.015 260)'),
      }

      expect(glassBlue.start.l).toBeLessThan(glassBlue.end.l)
      expect(glassBlue.start.c).toBeGreaterThan(glassBlue.end.c)
    })

    it('should validate dark mode glass gradients', () => {
      const glassBlueDark = {
        start: parseOklch('oklch(18% 0.04 240)'),
        end: parseOklch('oklch(20% 0.035 260)'),
      }

      expect(glassBlueDark.start.l).toBeLessThan(glassBlueDark.end.l)
      expect(glassBlueDark.start.c).toBeGreaterThan(glassBlueDark.end.c)
    })
  })

  describe('CSS custom property integration', () => {
    it('should validate format matches CSS custom property syntax', () => {
      const color = parseOklch('oklch(96% 0.02 220)')
      const cssString = toOklchString(color)

      // Should be usable directly as --variable: oklch(...)
      expect(cssString).toMatch(/^oklch\(\d+\.?\d*% \d+\.?\d* \d+\.?\d*\)$/)
    })

    it('should support var() references in parsing context', () => {
      // When reading from computed styles, we get the resolved value
      const resolvedValue = 'oklch(96% 0.02 220)'
      expect(() => parseOklch(resolvedValue)).not.toThrow()
    })
  })
})

describe('Color Manipulation Workflows', () => {
  describe('Creating color variants', () => {
    it('should create hover state (lighten for dark, darken for light)', () => {
      const baseLight: OklchColor = { l: 92, c: 0.06, h: 260 }
      const baseHover = darken(baseLight, 5)

      expect(baseHover.l).toBe(87)
      expect(baseHover.c).toBe(0.06)
    })

    it('should create muted variant (desaturate)', () => {
      const vibrant: OklchColor = { l: 60, c: 0.15, h: 200 }
      const muted = desaturate(vibrant, 0.1)

      expect(muted.c).toBeCloseTo(0.05, 10)
      expect(muted.l).toBe(60)
    })

    it('should create complementary color (rotate 180°)', () => {
      const primary: OklchColor = { l: 60, c: 0.15, h: 240 }
      const complement = rotateHue(primary, 180)

      expect(complement.h).toBe(60)
    })
  })

  describe('Creating accessible color pairs', () => {
    it('should adjust foreground to meet WCAG AA', () => {
      const bg: OklchColor = { l: 95, c: 0.02, h: 220 }
      let fg: OklchColor = { l: 60, c: 0.1, h: 240 }

      // Check if it meets WCAG AA, if not adjust
      if (!meetsWcagAA(fg, bg)) {
        const adjustment = suggestContrastAdjustment(fg, bg, 4.5)
        fg = adjustment > 0 ? lighten(fg, adjustment) : darken(fg, -adjustment)
      }

      // Should now meet WCAG AA after adjustment (within tolerance)
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.4)
    })
  })

  describe('Theme generation', () => {
    it('should generate light/dark mode pair from base color', () => {
      const baseHue = 220
      const baseChroma = 0.08

      const lightMode: OklchColor = { l: 92, c: baseChroma, h: baseHue }
      const darkMode: OklchColor = { l: 30, c: baseChroma * 1.2, h: baseHue }

      expect(lightMode.l).toBeGreaterThan(darkMode.l)
      expect(darkMode.c).toBeGreaterThan(lightMode.c) // More saturated in dark
    })

    it('should create semantic color scale', () => {
      const base: OklchColor = { l: 60, c: 0.1, h: 220 }

      const scale = {
        50: lighten(base, 40),
        100: lighten(base, 35),
        200: lighten(base, 25),
        300: lighten(base, 15),
        400: lighten(base, 5),
        500: base,
        600: darken(base, 5),
        700: darken(base, 15),
        800: darken(base, 25),
        900: darken(base, 35),
      }

      expect(scale[50].l).toBeGreaterThan(scale[900].l)
      Object.values(scale).forEach((color) => {
        expect(color.c).toBe(0.1) // Chroma stays constant
        expect(color.h).toBe(220) // Hue stays constant
      })
    })
  })
})
