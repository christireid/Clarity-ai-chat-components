import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createTheme,
  mergeTheme,
  generateCSSVariables,
  getThemeCSS,
} from '../create-theme'
import { modernThemes } from '../modern-presets'

describe('create-theme', () => {
  describe('createTheme', () => {
    it('should create a theme with default settings', () => {
      const theme = createTheme({})
      expect(theme).toHaveProperty('name')
      expect(theme).toHaveProperty('mode')
      expect(theme).toHaveProperty('colors')
      expect(theme).toHaveProperty('typography')
    })

    it('should create a dark theme when mode is dark', () => {
      const theme = createTheme({ mode: 'dark' })
      expect(theme.mode).toBe('dark')
    })

    it('should extend from a preset', () => {
      const theme = createTheme({ extends: 'neutral' })
      expect(theme.name).toBe('neutral')
    })

    it('should extend from a dark preset', () => {
      const theme = createTheme({ extends: 'neutral-dark' })
      expect(theme.mode).toBe('dark')
    })

    it('should apply brand color', () => {
      const theme = createTheme({ brandColor: '#10b981' })
      expect(theme.colors.primary).toBeDefined()
    })

    it('should apply hex color overrides', () => {
      const theme = createTheme({
        colors: {
          primary: '#ff0000',
        },
      })
      // Should be converted to HSL
      expect(theme.colors.primary).toContain('%')
    })

    it('should apply HSL color overrides directly', () => {
      const theme = createTheme({
        colors: {
          primary: '0 100% 50%',
        },
      })
      expect(theme.colors.primary).toBe('0 100% 50%')
    })

    it('should apply radius preset', () => {
      const theme = createTheme({ radius: 'xl' })
      expect(theme.borders.radius.lg).toBe('0.75rem')
    })

    it('should apply custom name', () => {
      const theme = createTheme({ name: 'my-custom-theme' })
      expect(theme.name).toBe('my-custom-theme')
    })

    it('should combine multiple customizations', () => {
      const theme = createTheme({
        extends: 'default',
        mode: 'dark',
        brandColor: '#6366f1',
        radius: 'lg',
        name: 'combined-theme',
      })
      expect(theme.name).toBe('combined-theme')
      expect(theme.mode).toBe('dark')
    })
  })

  describe('mergeTheme', () => {
    it('should merge overrides with a preset name', () => {
      const theme = mergeTheme('default', {
        colors: { primary: '120 100% 50%' },
      })
      expect(theme.colors.primary).toBe('120 100% 50%')
    })

    it('should merge overrides with a theme config', () => {
      const base = modernThemes['default']
      const theme = mergeTheme(base, {
        colors: { primary: '120 100% 50%' },
      })
      expect(theme.colors.primary).toBe('120 100% 50%')
    })

    it('should preserve non-overridden properties', () => {
      const theme = mergeTheme('default', {
        colors: { primary: '120 100% 50%' },
      })
      expect(theme.colors.background).toBeDefined()
      expect(theme.typography).toBeDefined()
    })
  })

  describe('generateCSSVariables', () => {
    it('should generate CSS variables from theme', () => {
      const theme = createTheme({})
      const vars = generateCSSVariables(theme)
      expect(vars).toHaveProperty('--clarity-primary')
      expect(vars).toHaveProperty('--clarity-background')
      expect(vars).toHaveProperty('--clarity-radius')
    })

    it('should convert camelCase to kebab-case', () => {
      const theme = createTheme({})
      const vars = generateCSSVariables(theme)
      expect(vars).toHaveProperty('--clarity-primary-foreground')
      expect(vars).toHaveProperty('--clarity-card-foreground')
    })
  })

  describe('getThemeCSS', () => {
    it('should generate valid CSS string', () => {
      const theme = createTheme({})
      const css = getThemeCSS(theme)
      expect(css).toContain(':root')
      expect(css).toContain('--clarity-primary')
    })

    it('should use custom selector', () => {
      const theme = createTheme({})
      const css = getThemeCSS(theme, '.my-theme')
      expect(css).toContain('.my-theme')
    })
  })

  describe('invalid preset warnings', () => {
    const originalEnv = process.env['NODE_ENV']
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      // Set to development to enable warnings
      process.env['NODE_ENV'] = 'development'
    })

    afterEach(() => {
      consoleWarnSpy.mockRestore()
      process.env['NODE_ENV'] = originalEnv
    })

    it('should warn when createTheme uses an invalid preset name', () => {
      // Use an invalid preset name that doesn't exist
      const theme = createTheme({ extends: 'ocean' as any })

      // Should still return a valid theme (fallback to default)
      expect(theme).toHaveProperty('colors')
      expect(theme).toHaveProperty('typography')

      // Should have warned about the invalid preset
      expect(consoleWarnSpy).toHaveBeenCalled()
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('ocean')
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('Unknown theme preset')
    })

    it('should warn with list of available presets', () => {
      createTheme({ extends: 'sunset' as any })

      expect(consoleWarnSpy).toHaveBeenCalled()
      const warningMessage = consoleWarnSpy.mock.calls[0][0]
      expect(warningMessage).toContain('default')
      expect(warningMessage).toContain('default-dark')
      expect(warningMessage).toContain('neutral')
      expect(warningMessage).toContain('vibrant')
      expect(warningMessage).toContain('high-contrast')
    })

    it('should not warn for valid preset names', () => {
      createTheme({ extends: 'default' })
      createTheme({ extends: 'neutral-dark' })
      createTheme({ extends: 'vibrant' })

      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    it('should not warn in production mode', () => {
      process.env['NODE_ENV'] = 'production'

      createTheme({ extends: 'invalid-preset' as any })

      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    it('should warn for legacy preset names', () => {
      const legacyPresets = [
        'ocean',
        'sunset',
        'forest',
        'corporate',
        'minimal',
        'playful',
      ]

      legacyPresets.forEach((preset) => {
        consoleWarnSpy.mockClear()
        createTheme({ extends: preset as any })
        expect(consoleWarnSpy).toHaveBeenCalled()
      })
    })
  })
})
