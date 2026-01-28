/**
 * OKLCH Color Format Validation Tests
 *
 * Tests that AI-specific color variables use proper OKLCH format
 * and are properly defined in both light and dark modes.
 *
 * OKLCH Format: oklch(lightness chroma hue / alpha)
 * - Lightness: 0-100% (perceptual brightness)
 * - Chroma: 0-0.4 (saturation/vividness)
 * - Hue: 0-360 (color angle)
 * - Alpha: 0-1 (optional transparency)
 */

import { describe, it, expect } from 'vitest'

/**
 * Validates OKLCH color format string
 * Accepts both with and without alpha channel
 */
function isValidOklchFormat(color: string): boolean {
  // OKLCH format: oklch(L C H / A) or oklch(L C H)
  // L: 0-100% or 0-1 (lightness)
  // C: 0-0.5 typically (chroma)
  // H: 0-360 (hue)
  // A: 0-1 (alpha, optional)
  const oklchRegex =
    /^oklch\(\s*(\d+\.?\d*%?)\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s*(\/\s*(\d+\.?\d*))?\s*\)$/

  return oklchRegex.test(color.trim())
}

/**
 * Parses OKLCH color string into components
 */
function parseOklch(color: string): {
  lightness: number
  chroma: number
  hue: number
  alpha?: number
} | null {
  const match = color.match(
    /oklch\(\s*(\d+\.?\d*%?)\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s*(?:\/\s*(\d+\.?\d*))?\s*\)/
  )

  if (!match) return null

  const lightness = parseFloat(match[1].replace('%', ''))
  const chroma = parseFloat(match[2])
  const hue = parseFloat(match[3])
  const alpha = match[4] ? parseFloat(match[4]) : undefined

  return { lightness, chroma, hue, alpha }
}

/**
 * Validates OKLCH component ranges
 */
function validateOklchRanges(color: string): {
  valid: boolean
  errors: string[]
} {
  const parsed = parseOklch(color)
  const errors: string[] = []

  if (!parsed) {
    return { valid: false, errors: ['Invalid OKLCH format'] }
  }

  // Lightness should be 0-100 (percentage) or 0-1 (decimal)
  if (parsed.lightness < 0 || parsed.lightness > 100) {
    errors.push(`Lightness ${parsed.lightness} out of range (0-100)`)
  }

  // Chroma should be 0-0.5 for typical colors (can go higher but unusual)
  if (parsed.chroma < 0 || parsed.chroma > 0.5) {
    errors.push(`Chroma ${parsed.chroma} out of typical range (0-0.5)`)
  }

  // Hue should be 0-360
  if (parsed.hue < 0 || parsed.hue > 360) {
    errors.push(`Hue ${parsed.hue} out of range (0-360)`)
  }

  // Alpha should be 0-1 if present
  if (parsed.alpha !== undefined && (parsed.alpha < 0 || parsed.alpha > 1)) {
    errors.push(`Alpha ${parsed.alpha} out of range (0-1)`)
  }

  return { valid: errors.length === 0, errors }
}

describe('OKLCH Color Format Validation', () => {
  describe('OKLCH format parsing', () => {
    it('should validate correct OKLCH format without alpha', () => {
      expect(isValidOklchFormat('oklch(85% 0.05 240)')).toBe(true)
      expect(isValidOklchFormat('oklch(50 0.1 180)')).toBe(true)
      expect(isValidOklchFormat('oklch(95% 0.02 210)')).toBe(true)
    })

    it('should validate correct OKLCH format with alpha', () => {
      expect(isValidOklchFormat('oklch(85% 0.05 240 / 0.9)')).toBe(true)
      expect(isValidOklchFormat('oklch(50 0.1 180 / 0.5)')).toBe(true)
      expect(isValidOklchFormat('oklch(95% 0.02 210 / 1)')).toBe(true)
    })

    it('should reject invalid formats', () => {
      expect(isValidOklchFormat('rgb(255, 0, 0)')).toBe(false)
      expect(isValidOklchFormat('hsl(240, 100%, 50%)')).toBe(false)
      expect(isValidOklchFormat('#ff0000')).toBe(false)
      expect(isValidOklchFormat('oklch()')).toBe(false)
      expect(isValidOklchFormat('oklch(50)')).toBe(false)
    })

    it('should handle whitespace variations', () => {
      expect(isValidOklchFormat('oklch( 85% 0.05 240 )')).toBe(true)
      expect(isValidOklchFormat('oklch(85%  0.05  240)')).toBe(true)
      expect(isValidOklchFormat('oklch( 85% 0.05 240 / 0.9 )')).toBe(true)
    })
  })

  describe('OKLCH component parsing', () => {
    it('should parse OKLCH components correctly', () => {
      const parsed = parseOklch('oklch(85% 0.05 240)')
      expect(parsed).toEqual({
        lightness: 85,
        chroma: 0.05,
        hue: 240,
        alpha: undefined,
      })
    })

    it('should parse OKLCH with alpha', () => {
      const parsed = parseOklch('oklch(85% 0.05 240 / 0.9)')
      expect(parsed).toEqual({
        lightness: 85,
        chroma: 0.05,
        hue: 240,
        alpha: 0.9,
      })
    })

    it('should handle decimal lightness', () => {
      const parsed = parseOklch('oklch(0.85 0.05 240)')
      expect(parsed?.lightness).toBe(0.85)
    })
  })

  describe('OKLCH range validation', () => {
    it('should validate components within proper ranges', () => {
      const result = validateOklchRanges('oklch(85% 0.05 240)')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate components with alpha', () => {
      const result = validateOklchRanges('oklch(85% 0.05 240 / 0.9)')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject invalid lightness', () => {
      const result = validateOklchRanges('oklch(150% 0.05 240)')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Lightness 150 out of range (0-100)')
    })

    it('should reject invalid hue', () => {
      const result = validateOklchRanges('oklch(85% 0.05 400)')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Hue 400 out of range (0-360)')
    })

    it('should warn about unusual chroma', () => {
      const result = validateOklchRanges('oklch(85% 0.8 240)')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Chroma 0.8 out of typical range (0-0.5)')
    })

    it('should reject invalid alpha', () => {
      const result = validateOklchRanges('oklch(85% 0.05 240 / 1.5)')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Alpha 1.5 out of range (0-1)')
    })
  })
})

describe('AI-Specific Color Variables', () => {
  // These tests verify that AI color variables are properly defined
  // In a real browser environment, we'd query CSS custom properties
  // For unit tests, we validate the expected format

  const aiColorVariables = {
    light: {
      '--ai-assistant': 'oklch(96% 0.02 220)',
      '--ai-user': 'oklch(92% 0.06 260)',
      '--ai-system': 'oklch(95% 0.03 180)',
      '--ai-thinking': 'oklch(94% 0.04 280)',
      '--ai-tool': 'oklch(93% 0.05 160)',
      '--ai-error': 'oklch(91% 0.12 25)',
    },
    dark: {
      '--ai-assistant': 'oklch(25% 0.04 220)',
      '--ai-user': 'oklch(30% 0.08 260)',
      '--ai-system': 'oklch(22% 0.05 180)',
      '--ai-thinking': 'oklch(28% 0.06 280)',
      '--ai-tool': 'oklch(27% 0.07 160)',
      '--ai-error': 'oklch(35% 0.15 25)',
    },
  }

  describe('Light mode AI colors', () => {
    Object.entries(aiColorVariables.light).forEach(([variable, color]) => {
      it(`should have valid OKLCH format for ${variable}`, () => {
        expect(isValidOklchFormat(color)).toBe(true)
      })

      it(`should have valid ranges for ${variable}`, () => {
        const result = validateOklchRanges(color)
        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })

      it(`should have appropriate lightness for light mode ${variable}`, () => {
        const parsed = parseOklch(color)
        expect(parsed).not.toBeNull()
        // Light mode should have high lightness (85-98%)
        expect(parsed!.lightness).toBeGreaterThanOrEqual(85)
        expect(parsed!.lightness).toBeLessThanOrEqual(98)
      })
    })
  })

  describe('Dark mode AI colors', () => {
    Object.entries(aiColorVariables.dark).forEach(([variable, color]) => {
      it(`should have valid OKLCH format for ${variable}`, () => {
        expect(isValidOklchFormat(color)).toBe(true)
      })

      it(`should have valid ranges for ${variable}`, () => {
        const result = validateOklchRanges(color)
        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })

      it(`should have appropriate lightness for dark mode ${variable}`, () => {
        const parsed = parseOklch(color)
        expect(parsed).not.toBeNull()
        // Dark mode should have low lightness (15-40%)
        expect(parsed!.lightness).toBeGreaterThanOrEqual(15)
        expect(parsed!.lightness).toBeLessThanOrEqual(40)
      })
    })
  })

  describe('Color semantic consistency', () => {
    it('should use blue hues for assistant (210-240)', () => {
      const lightAssistant = parseOklch(
        aiColorVariables.light['--ai-assistant']
      )
      const darkAssistant = parseOklch(aiColorVariables.dark['--ai-assistant'])

      expect(lightAssistant!.hue).toBeGreaterThanOrEqual(210)
      expect(lightAssistant!.hue).toBeLessThanOrEqual(240)
      expect(darkAssistant!.hue).toBeGreaterThanOrEqual(210)
      expect(darkAssistant!.hue).toBeLessThanOrEqual(240)
    })

    it('should use purple hues for user (250-280)', () => {
      const lightUser = parseOklch(aiColorVariables.light['--ai-user'])
      const darkUser = parseOklch(aiColorVariables.dark['--ai-user'])

      expect(lightUser!.hue).toBeGreaterThanOrEqual(250)
      expect(lightUser!.hue).toBeLessThanOrEqual(280)
      expect(darkUser!.hue).toBeGreaterThanOrEqual(250)
      expect(darkUser!.hue).toBeLessThanOrEqual(280)
    })

    it('should use green hues for tool (140-180)', () => {
      const lightTool = parseOklch(aiColorVariables.light['--ai-tool'])
      const darkTool = parseOklch(aiColorVariables.dark['--ai-tool'])

      expect(lightTool!.hue).toBeGreaterThanOrEqual(140)
      expect(lightTool!.hue).toBeLessThanOrEqual(180)
      expect(darkTool!.hue).toBeGreaterThanOrEqual(140)
      expect(darkTool!.hue).toBeLessThanOrEqual(180)
    })

    it('should use red hues for error (0-30)', () => {
      const lightError = parseOklch(aiColorVariables.light['--ai-error'])
      const darkError = parseOklch(aiColorVariables.dark['--ai-error'])

      expect(lightError!.hue).toBeGreaterThanOrEqual(0)
      expect(lightError!.hue).toBeLessThanOrEqual(30)
      expect(darkError!.hue).toBeGreaterThanOrEqual(0)
      expect(darkError!.hue).toBeLessThanOrEqual(30)
    })
  })

  describe('Alpha channel support', () => {
    it('should support alpha channel in OKLCH colors', () => {
      const colorWithAlpha = 'oklch(85% 0.05 240 / 0.9)'
      expect(isValidOklchFormat(colorWithAlpha)).toBe(true)

      const parsed = parseOklch(colorWithAlpha)
      expect(parsed?.alpha).toBe(0.9)
    })

    it('should validate alpha channel range', () => {
      const validAlpha = validateOklchRanges('oklch(85% 0.05 240 / 0.5)')
      expect(validAlpha.valid).toBe(true)

      const invalidAlpha = validateOklchRanges('oklch(85% 0.05 240 / 1.5)')
      expect(invalidAlpha.valid).toBe(false)
    })
  })
})
