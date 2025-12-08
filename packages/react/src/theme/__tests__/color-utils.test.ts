import { describe, it, expect } from 'vitest'
import {
  hexToRGB,
  rgbToHSL,
  hslToRGB,
  hexToHSLString,
  hslStringToHex,
  toHSLString,
  isHexColor,
  isHSLString,
  adjustLightness,
  adjustSaturation,
  getContrastRatio,
  meetsContrastRequirement,
  getContrastingForeground,
  generatePaletteFromBrandColor,
} from '../color-utils'

describe('color-utils', () => {
  describe('isHexColor', () => {
    it('should return true for valid 6-character hex colors', () => {
      expect(isHexColor('#ffffff')).toBe(true)
      expect(isHexColor('#000000')).toBe(true)
      expect(isHexColor('#6366f1')).toBe(true)
      expect(isHexColor('#AABBCC')).toBe(true)
    })

    it('should return true for valid 3-character hex colors', () => {
      expect(isHexColor('#fff')).toBe(true)
      expect(isHexColor('#000')).toBe(true)
      expect(isHexColor('#abc')).toBe(true)
    })

    it('should return false for invalid colors', () => {
      expect(isHexColor('ffffff')).toBe(false)
      expect(isHexColor('#gggggg')).toBe(false)
      expect(isHexColor('#12345')).toBe(false)
      expect(isHexColor('rgb(0,0,0)')).toBe(false)
    })
  })

  describe('isHSLString', () => {
    it('should return true for valid HSL strings', () => {
      expect(isHSLString('239 84% 67%')).toBe(true)
      expect(isHSLString('0 0% 100%')).toBe(true)
      expect(isHSLString('360 100% 50%')).toBe(true)
    })

    it('should return false for invalid HSL strings', () => {
      expect(isHSLString('239 84 67')).toBe(false)
      expect(isHSLString('#ffffff')).toBe(false)
      expect(isHSLString('hsl(239, 84%, 67%)')).toBe(false)
    })
  })

  describe('hexToRGB', () => {
    it('should convert hex to RGB', () => {
      expect(hexToRGB('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
      expect(hexToRGB('#000000')).toEqual({ r: 0, g: 0, b: 0 })
      expect(hexToRGB('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should handle 3-character hex', () => {
      expect(hexToRGB('#fff')).toEqual({ r: 255, g: 255, b: 255 })
      expect(hexToRGB('#000')).toEqual({ r: 0, g: 0, b: 0 })
    })
  })

  describe('rgbToHSL', () => {
    it('should convert RGB to HSL', () => {
      expect(rgbToHSL({ r: 255, g: 255, b: 255 })).toEqual({
        h: 0,
        s: 0,
        l: 100,
      })
      expect(rgbToHSL({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 })
      expect(rgbToHSL({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
    })
  })

  describe('hslToRGB', () => {
    it('should convert HSL to RGB', () => {
      expect(hslToRGB({ h: 0, s: 0, l: 100 })).toEqual({
        r: 255,
        g: 255,
        b: 255,
      })
      expect(hslToRGB({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0 })
      expect(hslToRGB({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 })
    })
  })

  describe('hexToHSLString', () => {
    it('should convert hex to HSL string', () => {
      expect(hexToHSLString('#ffffff')).toBe('0 0% 100%')
      expect(hexToHSLString('#000000')).toBe('0 0% 0%')
    })
  })

  describe('hslStringToHex', () => {
    it('should convert HSL string to hex', () => {
      expect(hslStringToHex('0 0% 100%')).toBe('#ffffff')
      expect(hslStringToHex('0 0% 0%')).toBe('#000000')
    })
  })

  describe('toHSLString', () => {
    it('should convert hex to HSL string', () => {
      expect(toHSLString('#ffffff')).toBe('0 0% 100%')
    })

    it('should pass through valid HSL strings', () => {
      expect(toHSLString('239 84% 67%')).toBe('239 84% 67%')
    })

    it('should return fallback for invalid values', () => {
      // Invalid values now return a safe fallback instead of passing through
      expect(toHSLString('invalid')).toBe('0 0% 50%')
      expect(toHSLString('')).toBe('0 0% 50%')
    })
  })

  describe('adjustLightness', () => {
    it('should increase lightness', () => {
      expect(adjustLightness('0 0% 50%', 10)).toBe('0 0% 60%')
    })

    it('should decrease lightness', () => {
      expect(adjustLightness('0 0% 50%', -10)).toBe('0 0% 40%')
    })

    it('should clamp to valid range', () => {
      expect(adjustLightness('0 0% 95%', 20)).toBe('0 0% 100%')
      expect(adjustLightness('0 0% 5%', -20)).toBe('0 0% 0%')
    })
  })

  describe('adjustSaturation', () => {
    it('should increase saturation', () => {
      expect(adjustSaturation('0 50% 50%', 10)).toBe('0 60% 50%')
    })

    it('should decrease saturation', () => {
      expect(adjustSaturation('0 50% 50%', -10)).toBe('0 40% 50%')
    })
  })

  describe('getContrastRatio', () => {
    it('should calculate contrast between white and black', () => {
      const ratio = getContrastRatio('#ffffff', '#000000')
      expect(ratio).toBeCloseTo(21, 0)
    })

    it('should return 1 for same colors', () => {
      const ratio = getContrastRatio('#ffffff', '#ffffff')
      expect(ratio).toBe(1)
    })
  })

  describe('meetsContrastRequirement', () => {
    it('should pass for high contrast pairs at AA level', () => {
      expect(meetsContrastRequirement('#000000', '#ffffff', 'AA')).toBe(true)
    })

    it('should pass for high contrast pairs at AAA level', () => {
      expect(meetsContrastRequirement('#000000', '#ffffff', 'AAA')).toBe(true)
    })

    it('should fail for low contrast pairs', () => {
      expect(meetsContrastRequirement('#cccccc', '#ffffff', 'AA')).toBe(false)
    })
  })

  describe('getContrastingForeground', () => {
    it('should return dark color for light backgrounds', () => {
      const result = getContrastingForeground('#ffffff')
      expect(result).toContain('0%') // Should be dark (low lightness)
    })

    it('should return light color for dark backgrounds', () => {
      const result = getContrastingForeground('#000000')
      expect(result).toContain('100%') // Should be light (high lightness)
    })
  })

  describe('generatePaletteFromBrandColor', () => {
    it('should generate a complete palette from hex color', () => {
      const palette = generatePaletteFromBrandColor('#6366f1')
      expect(palette).toHaveProperty('primary')
      expect(palette).toHaveProperty('primaryForeground')
      expect(palette).toHaveProperty('accent')
      expect(palette).toHaveProperty('accentForeground')
      expect(palette).toHaveProperty('ring')
    })

    it('should generate palette from HSL string', () => {
      const palette = generatePaletteFromBrandColor('239 84% 67%')
      expect(palette.primary).toBe('239 84% 67%')
    })
  })
})
