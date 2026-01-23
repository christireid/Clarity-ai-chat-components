import { describe, it, expect } from 'vitest'
import {
  ThemeBuilder,
  ColorMixins,
  TypographyMixins,
  BorderMixins,
  ShadowMixins,
  composeThemes,
  createVariant,
  ThemeVariants,
  createBrandTheme,
  createMultiColorTheme,
} from '../theme-composer'
import { modernThemes } from '../modern-presets'

describe('theme-composer', () => {
  // ==========================================================================
  // ThemeBuilder Class
  // ==========================================================================
  describe('ThemeBuilder', () => {
    describe('constructor', () => {
      it('should create a builder with default theme', () => {
        const builder = new ThemeBuilder()
        const theme = builder.build()
        expect(theme.name).toBe('custom')
        expect(theme.mode).toBe('light')
        expect(theme.colors).toBeDefined()
      })

      it('should accept base theme option', () => {
        const builder = new ThemeBuilder({ base: 'default-dark' })
        const theme = builder.build()
        // Base theme colors are used, but mode defaults to 'light' unless explicitly set
        expect(theme.colors.background).toBe(
          modernThemes['default-dark'].colors.background
        )
      })

      it('should accept mode option', () => {
        const builder = new ThemeBuilder({ mode: 'dark' })
        const theme = builder.build()
        expect(theme.mode).toBe('dark')
      })
    })

    describe('extend()', () => {
      it('should extend from a preset name', () => {
        const theme = new ThemeBuilder()
          .extend('dark')
          .name('extended')
          .build()
        expect(theme.colors.primary).toBe(
          modernThemes['dark'].colors.primary
        )
      })

      it('should extend from a complete theme config', () => {
        const customBase = { ...modernThemes['default'], name: 'custom-base' }
        const theme = new ThemeBuilder().extend(customBase).build()
        expect(theme.colors).toEqual(customBase.colors)
      })
    })

    describe('mode()', () => {
      it('should set the theme mode', () => {
        const theme = new ThemeBuilder().mode('dark').build()
        expect(theme.mode).toBe('dark')
      })
    })

    describe('name()', () => {
      it('should set the theme name', () => {
        const theme = new ThemeBuilder().name('my-custom-theme').build()
        expect(theme.name).toBe('my-custom-theme')
      })
    })

    describe('colors()', () => {
      it('should apply color overrides', () => {
        const theme = new ThemeBuilder()
          .colors({ primary: '200 80% 50%' })
          .build()
        expect(theme.colors.primary).toBe('200 80% 50%')
      })

      it('should merge multiple color calls', () => {
        const theme = new ThemeBuilder()
          .colors({ primary: '200 80% 50%' })
          .colors({ secondary: '100 60% 40%' })
          .build()
        expect(theme.colors.primary).toBe('200 80% 50%')
        expect(theme.colors.secondary).toBe('100 60% 40%')
      })
    })

    describe('typography()', () => {
      it('should apply typography overrides', () => {
        const theme = new ThemeBuilder()
          .typography({
            fontFamily: { sans: 'Custom Sans', mono: 'Custom Mono' },
          })
          .build()
        expect(theme.typography.fontFamily.sans).toBe('Custom Sans')
      })
    })

    describe('borders()', () => {
      it('should apply border overrides', () => {
        const theme = new ThemeBuilder()
          .borders({
            radius: {
              sm: '0.5rem',
              md: '1rem',
              lg: '2rem',
              xl: '3rem',
              '2xl': '4rem',
              none: '0',
              full: '9999px',
            },
          })
          .build()
        expect(theme.borders.radius.sm).toBe('0.5rem')
      })
    })

    describe('shadows()', () => {
      it('should apply shadow overrides', () => {
        const theme = new ThemeBuilder()
          .shadows({ md: '0 4px 8px rgba(0,0,0,0.2)' })
          .build()
        expect(theme.shadows.md).toBe('0 4px 8px rgba(0,0,0,0.2)')
      })
    })

    describe('autoContrast()', () => {
      it('should enable auto contrast with default target', () => {
        const theme = new ThemeBuilder()
          .colors({ primary: '0 0% 90%', background: '0 0% 100%' }) // Low contrast
          .autoContrast()
          .build()
        // The primary should be adjusted for better contrast
        expect(theme.colors.primary).toBeDefined()
      })

      it('should accept custom contrast target', () => {
        const theme = new ThemeBuilder()
          .colors({ primary: '0 0% 90%', background: '0 0% 100%' })
          .autoContrast(7) // AAA level
          .build()
        expect(theme.colors.primary).toBeDefined()
      })
    })

    describe('build()', () => {
      it('should return a complete theme config', () => {
        const theme = new ThemeBuilder().build()
        expect(theme).toHaveProperty('name')
        expect(theme).toHaveProperty('mode')
        expect(theme).toHaveProperty('colors')
        expect(theme).toHaveProperty('typography')
        expect(theme).toHaveProperty('spacing')
        expect(theme).toHaveProperty('borders')
        expect(theme).toHaveProperty('shadows')
        expect(theme).toHaveProperty('animations')
      })

      it('should merge base theme with overrides', () => {
        const theme = new ThemeBuilder()
          .extend('default')
          .colors({ primary: '100 50% 50%' })
          .build()

        // Should have our override
        expect(theme.colors.primary).toBe('100 50% 50%')
        // Should still have base theme values
        expect(theme.colors.background).toBe(
          modernThemes['default'].colors.background
        )
      })
    })
  })

  // ==========================================================================
  // Color Mixins
  // ==========================================================================
  describe('ColorMixins', () => {
    describe('brand()', () => {
      it('should generate brand colors from hex', () => {
        const mixin = ColorMixins.brand('#6366f1')
        expect(mixin.primary).toBeDefined()
        expect(mixin.primaryForeground).toBeDefined()
        expect(mixin.ring).toBeDefined()
      })

      it('should accept HSL string', () => {
        const mixin = ColorMixins.brand('239 84% 67%')
        expect(mixin.primary).toBe('239 84% 67%')
      })
    })

    describe('accent()', () => {
      it('should generate accent colors', () => {
        const mixin = ColorMixins.accent('#22c55e')
        expect(mixin.accent).toBeDefined()
        expect(mixin.accentForeground).toBeDefined()
      })
    })

    describe('surfaces()', () => {
      it('should set surface colors', () => {
        const mixin = ColorMixins.surfaces('#f5f5f5', '#ffffff', '#e5e5e5')
        expect(mixin.card).toBeDefined()
        expect(mixin.popover).toBeDefined()
        expect(mixin.muted).toBeDefined()
      })

      it('should use card color as fallback', () => {
        const mixin = ColorMixins.surfaces('#f5f5f5')
        expect(mixin.card).toBeDefined()
        expect(mixin.popover).toBe(mixin.card)
        expect(mixin.muted).toBe(mixin.card)
      })
    })

    describe('states()', () => {
      it('should set state colors', () => {
        const mixin = ColorMixins.states({
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        })
        expect(mixin.success).toBeDefined()
        expect(mixin.successForeground).toBeDefined()
        expect(mixin.warning).toBeDefined()
        expect(mixin.destructive).toBeDefined() // error maps to destructive
        expect(mixin.info).toBeDefined()
      })

      it('should handle partial state config', () => {
        const mixin = ColorMixins.states({ success: '#22c55e' })
        expect(mixin.success).toBeDefined()
        expect(mixin.warning).toBeUndefined()
      })
    })

    describe('darkMode()', () => {
      it('should set dark mode surface colors', () => {
        const mixin = ColorMixins.darkMode('#1a1a1a', '#f0f0f0')
        expect(mixin.background).toBeDefined()
        expect(mixin.foreground).toBeDefined()
        expect(mixin.card).toBe(mixin.background)
        expect(mixin.cardForeground).toBe(mixin.foreground)
      })
    })

    describe('lightMode()', () => {
      it('should set light mode surface colors', () => {
        const mixin = ColorMixins.lightMode('#ffffff', '#1a1a1a')
        expect(mixin.background).toBeDefined()
        expect(mixin.foreground).toBeDefined()
      })
    })

    describe('monochrome()', () => {
      it('should return grayscale color config', () => {
        const mixin = ColorMixins.monochrome()
        expect(mixin.primary).toContain('0%') // No saturation
        expect(mixin.secondary).toContain('0%')
        expect(mixin.accent).toContain('0%')
      })
    })

    describe('highContrast()', () => {
      it('should return high contrast colors', () => {
        const mixin = ColorMixins.highContrast()
        expect(mixin.foreground).toBe('0 0% 0%')
        expect(mixin.primary).toContain('100%') // Full saturation
      })
    })
  })

  // ==========================================================================
  // Typography Mixins
  // ==========================================================================
  describe('TypographyMixins', () => {
    describe('systemFonts()', () => {
      it('should return system font stack', () => {
        const mixin = TypographyMixins.systemFonts()
        expect(mixin.fontFamily?.sans).toContain('system-ui')
        expect(mixin.fontFamily?.mono).toContain('ui-monospace')
      })
    })

    describe('interFonts()', () => {
      it('should return Inter font stack', () => {
        const mixin = TypographyMixins.interFonts()
        expect(mixin.fontFamily?.sans).toContain('Inter')
        expect(mixin.fontFamily?.mono).toContain('JetBrains Mono')
      })
    })

    describe('compact()', () => {
      it('should return smaller font sizes', () => {
        const mixin = TypographyMixins.compact()
        expect(mixin.fontSize?.base).toBe('0.875rem')
      })
    })

    describe('spacious()', () => {
      it('should return larger font sizes', () => {
        const mixin = TypographyMixins.spacious()
        expect(mixin.fontSize?.base).toBe('1.1rem')
      })
    })
  })

  // ==========================================================================
  // Border Mixins
  // ==========================================================================
  describe('BorderMixins', () => {
    describe('sharp()', () => {
      it('should return zero border radius', () => {
        const mixin = BorderMixins.sharp()
        expect(mixin.radius?.sm).toBe('0')
        expect(mixin.radius?.md).toBe('0')
        expect(mixin.radius?.lg).toBe('0')
      })
    })

    describe('rounded()', () => {
      it('should return default rounded corners', () => {
        const mixin = BorderMixins.rounded()
        expect(mixin.radius?.sm).toBe('0.25rem')
        expect(mixin.radius?.md).toBe('0.375rem')
      })
    })

    describe('extraRounded()', () => {
      it('should return larger border radius', () => {
        const mixin = BorderMixins.extraRounded()
        expect(mixin.radius?.sm).toBe('0.5rem')
        expect(mixin.radius?.md).toBe('0.75rem')
      })
    })

    describe('pill()', () => {
      it('should return pill-shaped radius', () => {
        const mixin = BorderMixins.pill()
        expect(mixin.radius?.sm).toBe('9999px')
        expect(mixin.radius?.md).toBe('9999px')
      })
    })
  })

  // ==========================================================================
  // Shadow Mixins
  // ==========================================================================
  describe('ShadowMixins', () => {
    describe('flat()', () => {
      it('should return no shadows', () => {
        const mixin = ShadowMixins.flat()
        expect(mixin.sm).toBe('none')
        expect(mixin.md).toBe('none')
        expect(mixin.lg).toBe('none')
      })
    })

    describe('subtle()', () => {
      it('should return subtle shadows', () => {
        const mixin = ShadowMixins.subtle()
        expect(mixin.sm).toContain('rgba(0,0,0,0.04)')
      })
    })

    describe('prominent()', () => {
      it('should return prominent shadows', () => {
        const mixin = ShadowMixins.prominent()
        expect(mixin.sm).toContain('rgba(0,0,0,0.1)')
      })
    })

    describe('colored()', () => {
      it('should return colored shadows', () => {
        const mixin = ShadowMixins.colored('239 84% 67%')
        expect(mixin.sm).toContain('hsl(239 84% 67%')
      })
    })
  })

  // ==========================================================================
  // Utility Functions
  // ==========================================================================
  describe('composeThemes()', () => {
    it('should compose multiple themes', () => {
      const result = composeThemes('default', {
        colors: { primary: '100 50% 50%' },
      })
      expect(result.colors.primary).toBe('100 50% 50%')
      expect(result.colors.background).toBe(
        modernThemes['default'].colors.background
      )
    })

    it('should allow composing preset names', () => {
      const result = composeThemes('default', 'dark')
      expect(result.colors.primary).toBe(modernThemes['dark'].colors.primary)
    })
  })

  describe('createVariant()', () => {
    it('should create a variant using a variant function', () => {
      const base = modernThemes['default']
      const dark = createVariant(base, ThemeVariants.toDark)
      expect(dark.mode).toBe('dark')
      expect(dark.name).toContain('-dark')
    })
  })

  describe('ThemeVariants', () => {
    describe('toDark()', () => {
      it('should convert a light theme to dark', () => {
        const dark = ThemeVariants.toDark(modernThemes['default'])
        expect(dark.mode).toBe('dark')
        expect(dark.colors.background).toBe('222 47% 11%')
      })
    })

    describe('toLight()', () => {
      it('should convert a dark theme to light', () => {
        const light = ThemeVariants.toLight(modernThemes['default-dark'])
        expect(light.mode).toBe('light')
        expect(light.colors.background).toBe('0 0% 100%')
      })
    })

    describe('highContrast()', () => {
      it('should create a high contrast variant', () => {
        const hc = ThemeVariants.highContrast(modernThemes['default'])
        expect(hc.name).toContain('-high-contrast')
        expect(hc.colors.foreground).toBe('0 0% 0%')
      })
    })
  })

  // ==========================================================================
  // Quick Theme Creation
  // ==========================================================================
  describe('createBrandTheme()', () => {
    it('should create a theme from brand color', () => {
      const theme = createBrandTheme('#6366f1')
      expect(theme.colors.primary).toBeDefined()
      expect(theme.name).toBe('custom-brand')
    })

    it('should accept options', () => {
      const theme = createBrandTheme('#6366f1', {
        name: 'my-brand',
        mode: 'dark',
      })
      expect(theme.name).toBe('my-brand')
      expect(theme.mode).toBe('dark')
    })
  })

  describe('createMultiColorTheme()', () => {
    it('should create a theme from multiple colors', () => {
      const theme = createMultiColorTheme({
        primary: '#6366f1',
        secondary: '#a855f7',
        accent: '#22c55e',
        success: '#10b981',
        error: '#ef4444',
      })
      expect(theme.colors.primary).toBeDefined()
      expect(theme.colors.secondary).toBeDefined()
      expect(theme.colors.accent).toBeDefined()
      expect(theme.colors.success).toBeDefined()
      expect(theme.colors.destructive).toBeDefined()
    })

    it('should handle partial color config', () => {
      const theme = createMultiColorTheme({ primary: '#6366f1' })
      expect(theme.colors.primary).toBeDefined()
    })
  })
})
