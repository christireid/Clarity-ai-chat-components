import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  validateThemeConfig,
  assertValidTheme,
  validateThemeWithWarnings,
} from '../theme-validator'
import { modernThemes } from '../modern-presets'
import type { CompleteThemeConfig } from '../theme-config'

describe('validateThemeConfig', () => {
  describe('valid themes', () => {
    it('should validate built-in default theme', () => {
      const result = validateThemeConfig(modernThemes['default'])
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate built-in dark theme', () => {
      const result = validateThemeConfig(modernThemes['default-dark'])
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate high-contrast theme', () => {
      const result = validateThemeConfig(modernThemes['high-contrast'])
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate all built-in themes', () => {
      const themes = Object.values(modernThemes)
      for (const theme of themes) {
        const result = validateThemeConfig(theme)
        expect(result.valid).toBe(true)
      }
    })
  })

  describe('missing required fields', () => {
    it('should error when name is missing', () => {
      const theme = { ...modernThemes['default'], name: undefined }
      const result = validateThemeConfig(theme as Partial<CompleteThemeConfig>)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_NAME',
          path: 'name',
        })
      )
    })

    it('should error when mode is missing', () => {
      const theme = { ...modernThemes['default'], mode: undefined }
      const result = validateThemeConfig(theme as Partial<CompleteThemeConfig>)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_MODE',
          path: 'mode',
        })
      )
    })

    it('should error when colors is missing', () => {
      const theme = { ...modernThemes['default'], colors: undefined }
      const result = validateThemeConfig(theme as Partial<CompleteThemeConfig>)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_COLORS',
          path: 'colors',
        })
      )
    })

    it('should error for invalid mode value', () => {
      const theme = { ...modernThemes['default'], mode: 'invalid' as 'light' }
      const result = validateThemeConfig(theme)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'INVALID_MODE',
          path: 'mode',
        })
      )
    })
  })

  describe('HSL format validation', () => {
    it('should accept valid HSL strings', () => {
      const theme = { ...modernThemes['default'] }
      const result = validateThemeConfig(theme)
      expect(result.valid).toBe(true)
    })

    it('should accept hex colors (they get converted)', () => {
      const theme = {
        ...modernThemes['default'],
        colors: {
          ...modernThemes['default'].colors,
          primary: '#6366f1',
        },
      }
      const result = validateThemeConfig(theme)
      // Hex colors should not cause errors - they get converted
      const primaryErrors = result.errors.filter((e) =>
        e.path.includes('primary')
      )
      expect(primaryErrors).toHaveLength(0)
    })

    it('should error for invalid HSL format', () => {
      const theme = {
        ...modernThemes['default'],
        colors: {
          ...modernThemes['default'].colors,
          primary: 'not-valid-hsl',
        },
      }
      const result = validateThemeConfig(theme)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'INVALID_HSL',
          path: 'colors.primary',
        })
      )
    })

    it('should error for out-of-range hue', () => {
      const theme = {
        ...modernThemes['default'],
        colors: {
          ...modernThemes['default'].colors,
          primary: '400 50% 50%', // Hue > 360
        },
      }
      const result = validateThemeConfig(theme)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'HSL_RANGE',
          path: 'colors.primary',
        })
      )
    })

    it('should error for out-of-range saturation', () => {
      const theme = {
        ...modernThemes['default'],
        colors: {
          ...modernThemes['default'].colors,
          primary: '220 150% 50%', // Saturation > 100
        },
      }
      const result = validateThemeConfig(theme)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'HSL_RANGE',
        })
      )
    })

    it('should error for out-of-range lightness', () => {
      const theme = {
        ...modernThemes['default'],
        colors: {
          ...modernThemes['default'].colors,
          primary: '220 50% 150%', // Lightness > 100
        },
      }
      const result = validateThemeConfig(theme)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'HSL_RANGE',
        })
      )
    })
  })

  describe('warnings', () => {
    it('should warn for missing color keys', () => {
      const theme = {
        name: 'test-theme',
        mode: 'light' as const,
        colors: {
          primary: '220 90% 56%',
          // Missing other required colors
        },
      }
      const result = validateThemeConfig(
        theme as unknown as Partial<CompleteThemeConfig>
      )
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_COLOR',
        })
      )
    })

    it('should warn for low contrast ratios', () => {
      const theme = {
        ...modernThemes['default'],
        colors: {
          ...modernThemes['default'].colors,
          foreground: '0 0% 80%', // Light gray on white = low contrast
          background: '0 0% 100%',
        },
      }
      const result = validateThemeConfig(theme)
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: 'LOW_CONTRAST',
        })
      )
    })
  })

  describe('contrast pair validation', () => {
    it('should check all required contrast pairs', () => {
      // Create a theme with all low contrast pairs
      const theme = {
        ...modernThemes['default'],
        colors: {
          ...modernThemes['default'].colors,
          // All these pairs should trigger contrast warnings
          foreground: '0 0% 60%',
          background: '0 0% 70%',
          primaryForeground: '220 50% 50%',
          primary: '220 50% 55%',
        },
      }
      const result = validateThemeConfig(theme)
      const contrastWarnings = result.warnings.filter(
        (w) => w.code === 'LOW_CONTRAST'
      )
      expect(contrastWarnings.length).toBeGreaterThan(0)
    })

    it('should include popover in contrast checks', () => {
      const theme = {
        ...modernThemes['default'],
        colors: {
          ...modernThemes['default'].colors,
          popoverForeground: '0 0% 60%',
          popover: '0 0% 65%', // Low contrast pair
        },
      }
      const result = validateThemeConfig(theme)
      const popoverWarning = result.warnings.find(
        (w) => w.code === 'LOW_CONTRAST' && w.path.includes('popover')
      )
      expect(popoverWarning).toBeDefined()
    })
  })

  describe('typography validation', () => {
    it('should warn for missing font families', () => {
      const theme = {
        ...modernThemes['default'],
        typography: {
          ...modernThemes['default'].typography,
          fontFamily: {
            sans: undefined as unknown as string,
            mono: undefined as unknown as string,
          },
        },
      }
      const result = validateThemeConfig(theme)
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_FONT',
          path: 'typography.fontFamily.sans',
        })
      )
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_FONT',
          path: 'typography.fontFamily.mono',
        })
      )
    })
  })

  describe('border radius validation', () => {
    it('should error for non-string radius values', () => {
      const theme = {
        ...modernThemes['default'],
        borders: {
          ...modernThemes['default'].borders,
          radius: {
            ...modernThemes['default'].borders.radius,
            md: 123 as unknown as string, // Invalid type
          },
        },
      }
      const result = validateThemeConfig(theme)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'INVALID_RADIUS',
          path: 'borders.radius.md',
        })
      )
    })
  })
})

describe('assertValidTheme', () => {
  it('should not throw for valid themes', () => {
    expect(() => {
      assertValidTheme(modernThemes['default'])
    }).not.toThrow()
  })

  it('should throw for invalid themes', () => {
    const invalidTheme = { mode: 'light' } as Partial<CompleteThemeConfig>
    expect(() => {
      assertValidTheme(invalidTheme)
    }).toThrow('Invalid theme configuration')
  })

  it('should include error details in thrown message', () => {
    const invalidTheme = {} as Partial<CompleteThemeConfig>
    expect(() => {
      assertValidTheme(invalidTheme)
    }).toThrow(/MISSING_NAME/)
  })
})

describe('validateThemeWithWarnings', () => {
  const originalEnv = process.env['NODE_ENV']

  beforeEach(() => {
    process.env['NODE_ENV'] = 'development'
  })

  afterEach(() => {
    process.env['NODE_ENV'] = originalEnv
  })

  it('should return true for valid themes', () => {
    const result = validateThemeWithWarnings(modernThemes['default'])
    expect(result).toBe(true)
  })

  it('should return false for invalid themes', () => {
    const invalidTheme = {} as Partial<CompleteThemeConfig>
    const result = validateThemeWithWarnings(invalidTheme)
    expect(result).toBe(false)
  })

  it('should log warnings in development', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const theme = {
      name: 'test',
      mode: 'light' as const,
      colors: {
        primary: '220 90% 56%',
        // Missing colors will generate warnings
      },
    }
    validateThemeWithWarnings(theme as Partial<CompleteThemeConfig>)
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('should log errors in development', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const invalidTheme = {} as Partial<CompleteThemeConfig>
    validateThemeWithWarnings(invalidTheme)
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
