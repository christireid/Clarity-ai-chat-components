import { describe, it, expect } from 'vitest'
import {
  modernThemes,
  modernThemeMetadata,
  getModernThemeNames,
  getAllModernThemes,
  isValidModernThemeName,
  getModernDarkVariant,
  getModernLightVariant,
} from '../modern-presets'

describe('modern-presets', () => {
  describe('modernThemes', () => {
    it('should have 4 theme entries (light, dark with aliases)', () => {
      // default, light, default-dark, dark
      expect(Object.keys(modernThemes)).toHaveLength(4)
    })

    it('should have light and dark variants', () => {
      expect(modernThemes['default']).toBeDefined()
      expect(modernThemes['default-dark']).toBeDefined()
      expect(modernThemes['light']).toBeDefined()
      expect(modernThemes['dark']).toBeDefined()
    })

    it('should have light alias pointing to default', () => {
      expect(modernThemes['light']).toBe(modernThemes['default'])
    })

    it('should have dark alias pointing to default-dark', () => {
      expect(modernThemes['dark']).toBe(modernThemes['default-dark'])
    })

    it('should have correct mode for each theme', () => {
      expect(modernThemes['default'].mode).toBe('light')
      expect(modernThemes['default-dark'].mode).toBe('dark')
      expect(modernThemes['light'].mode).toBe('light')
      expect(modernThemes['dark'].mode).toBe('dark')
    })

    it('should have all required color properties', () => {
      const theme = modernThemes['default']
      expect(theme.colors).toHaveProperty('primary')
      expect(theme.colors).toHaveProperty('primaryForeground')
      expect(theme.colors).toHaveProperty('background')
      expect(theme.colors).toHaveProperty('foreground')
      expect(theme.colors).toHaveProperty('border')
      expect(theme.colors).toHaveProperty('destructive')
      expect(theme.colors).toHaveProperty('success')
    })
  })

  describe('modernThemeMetadata', () => {
    it('should have metadata for all themes', () => {
      const names = Object.keys(modernThemes)
      names.forEach((name) => {
        expect(
          modernThemeMetadata[name as keyof typeof modernThemeMetadata]
        ).toBeDefined()
      })
    })

    it('should have required metadata properties', () => {
      const metadata = modernThemeMetadata['default']
      expect(metadata).toHaveProperty('name')
      expect(metadata).toHaveProperty('displayName')
      expect(metadata).toHaveProperty('description')
      expect(metadata).toHaveProperty('preview')
    })

    it('should have preview colors', () => {
      const metadata = modernThemeMetadata['default']
      expect(metadata.preview).toHaveProperty('primaryColor')
      expect(metadata.preview).toHaveProperty('backgroundColor')
    })
  })

  describe('getModernThemeNames', () => {
    it('should return all theme names', () => {
      const names = getModernThemeNames()
      expect(names).toContain('default')
      expect(names).toContain('default-dark')
      expect(names).toContain('light')
      expect(names).toContain('dark')
    })

    it('should return exactly 4 names', () => {
      const names = getModernThemeNames()
      expect(names).toHaveLength(4)
    })
  })

  describe('getAllModernThemes', () => {
    it('should return unique themes with metadata and config', () => {
      const themes = getAllModernThemes()
      // Only returns unique themes (default and default-dark)
      expect(themes.length).toBe(2)
      themes.forEach((theme) => {
        expect(theme).toHaveProperty('name')
        expect(theme).toHaveProperty('metadata')
        expect(theme).toHaveProperty('config')
      })
    })
  })

  describe('isValidModernThemeName', () => {
    it('should return true for valid theme names', () => {
      expect(isValidModernThemeName('default')).toBe(true)
      expect(isValidModernThemeName('default-dark')).toBe(true)
      expect(isValidModernThemeName('light')).toBe(true)
      expect(isValidModernThemeName('dark')).toBe(true)
    })

    it('should return false for invalid theme names', () => {
      expect(isValidModernThemeName('invalid')).toBe(false)
      expect(isValidModernThemeName('')).toBe(false)
      // Legacy themes are no longer valid (but exports exist for backward compatibility)
      expect(isValidModernThemeName('neutral')).toBe(false)
      expect(isValidModernThemeName('vibrant')).toBe(false)
      expect(isValidModernThemeName('ocean-dark')).toBe(false)
    })
  })

  describe('getModernDarkVariant', () => {
    it('should return dark variant for light themes', () => {
      expect(getModernDarkVariant('default')).toBe('dark')
      expect(getModernDarkVariant('light')).toBe('dark')
    })

    it('should return null for dark themes', () => {
      expect(getModernDarkVariant('default-dark')).toBeNull()
      expect(getModernDarkVariant('dark')).toBeNull()
    })
  })

  describe('getModernLightVariant', () => {
    it('should return light variant for dark themes', () => {
      expect(getModernLightVariant('default-dark')).toBe('light')
      expect(getModernLightVariant('dark')).toBe('light')
    })

    it('should return null for light themes', () => {
      expect(getModernLightVariant('default')).toBeNull()
      expect(getModernLightVariant('light')).toBeNull()
    })
  })

  describe('backward compatibility', () => {
    it('should export deprecated themes that resolve to default', async () => {
      const {
        neutralLightTheme,
        vibrantLightTheme,
        oceanLightTheme,
        defaultLightTheme,
      } = await import('../modern-presets')

      // All deprecated light themes should resolve to defaultLightTheme
      expect(neutralLightTheme).toBe(defaultLightTheme)
      expect(vibrantLightTheme).toBe(defaultLightTheme)
      expect(oceanLightTheme).toBe(defaultLightTheme)
    })

    it('should export deprecated dark themes that resolve to default-dark', async () => {
      const {
        neutralDarkTheme,
        vibrantDarkTheme,
        oceanDarkTheme,
        defaultDarkTheme,
      } = await import('../modern-presets')

      // All deprecated dark themes should resolve to defaultDarkTheme
      expect(neutralDarkTheme).toBe(defaultDarkTheme)
      expect(vibrantDarkTheme).toBe(defaultDarkTheme)
      expect(oceanDarkTheme).toBe(defaultDarkTheme)
    })
  })
})
