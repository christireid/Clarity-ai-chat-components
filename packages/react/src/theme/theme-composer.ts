import { logger } from '@clarity-chat/utils/logger';
/**
 * Clarity Chat - Theme Composer
 *
 * Advanced theme composition utilities for creating, extending,
 * and mixing themes. Provides a fluent API for building custom themes.
 */

import type {
  CompleteThemeConfig,
  PartialThemeConfig,
  ColorConfig,
  TypographyConfig,
  BorderConfig,
  ShadowConfig,
  AnimationConfig,
  ComponentOverrides,
} from './theme-config'
import { modernThemes, type ModernThemePresetName } from './modern-presets'
import {
  hexToHSLString,
  hslStringToHex,
  getContrastingForeground,
} from './color-utils'
import { autoAdjustForContrast, generateColorScale } from './color-advanced'

// ============================================================================
// Types
// ============================================================================

/**
 * Theme mixin - partial theme configuration
 */
export type ThemeMixin = Partial<Omit<CompleteThemeConfig, 'name' | 'mode'>>

/**
 * Color mixin - partial color configuration
 */
export type ColorMixin = Partial<ColorConfig>

/**
 * Theme variant generator function
 */
export type ThemeVariantFn = (base: CompleteThemeConfig) => CompleteThemeConfig

/**
 * Theme builder options
 */
export interface ThemeBuilderOptions {
  /** Base theme to extend */
  base?: ModernThemePresetName | CompleteThemeConfig
  /** Theme mode */
  mode?: 'light' | 'dark'
  /** Auto-fix contrast issues */
  autoFixContrast?: boolean
  /** Target contrast ratio for auto-fix */
  targetContrast?: number
}

// ============================================================================
// Color Mixins
// ============================================================================

/**
 * Pre-built color mixins for common customizations
 */
export const ColorMixins = {
  /**
   * Brand color mixin - generates a consistent brand palette
   */
  brand: (brandColor: string): ColorMixin => {
    const hsl = brandColor.startsWith('#')
      ? hexToHSLString(brandColor)
      : brandColor
    const foreground = getContrastingForeground(brandColor)
    return {
      primary: hsl,
      primaryForeground: foreground,
      ring: hsl,
    }
  },

  /**
   * Accent color mixin
   */
  accent: (accentColor: string): ColorMixin => {
    const hsl = accentColor.startsWith('#')
      ? hexToHSLString(accentColor)
      : accentColor
    const foreground = getContrastingForeground(accentColor)
    return {
      accent: hsl,
      accentForeground: foreground,
    }
  },

  /**
   * Surface colors mixin for card/popover customization
   */
  surfaces: (
    cardBg: string,
    popoverBg?: string,
    mutedBg?: string
  ): ColorMixin => {
    const card = cardBg.startsWith('#') ? hexToHSLString(cardBg) : cardBg
    const popover = popoverBg
      ? popoverBg.startsWith('#')
        ? hexToHSLString(popoverBg)
        : popoverBg
      : card
    const muted = mutedBg
      ? mutedBg.startsWith('#')
        ? hexToHSLString(mutedBg)
        : mutedBg
      : card

    return {
      card,
      popover,
      muted,
    }
  },

  /**
   * State colors mixin
   */
  states: (config: {
    success?: string
    warning?: string
    error?: string
    info?: string
  }): ColorMixin => {
    const result: ColorMixin = {}

    if (config.success) {
      const hsl = config.success.startsWith('#')
        ? hexToHSLString(config.success)
        : config.success
      result.success = hsl
      result.successForeground = getContrastingForeground(config.success)
    }

    if (config.warning) {
      const hsl = config.warning.startsWith('#')
        ? hexToHSLString(config.warning)
        : config.warning
      result.warning = hsl
      result.warningForeground = getContrastingForeground(config.warning)
    }

    if (config.error) {
      const hsl = config.error.startsWith('#')
        ? hexToHSLString(config.error)
        : config.error
      result.destructive = hsl
      result.destructiveForeground = getContrastingForeground(config.error)
    }

    if (config.info) {
      const hsl = config.info.startsWith('#')
        ? hexToHSLString(config.info)
        : config.info
      result.info = hsl
      result.infoForeground = getContrastingForeground(config.info)
    }

    return result
  },

  /**
   * Dark mode colors mixin
   */
  darkMode: (bgColor: string, fgColor: string): ColorMixin => {
    const bg = bgColor.startsWith('#') ? hexToHSLString(bgColor) : bgColor
    const fg = fgColor.startsWith('#') ? hexToHSLString(fgColor) : fgColor

    return {
      background: bg,
      foreground: fg,
      card: bg,
      cardForeground: fg,
      popover: bg,
      popoverForeground: fg,
    }
  },

  /**
   * Light mode colors mixin
   */
  lightMode: (bgColor: string, fgColor: string): ColorMixin => {
    const bg = bgColor.startsWith('#') ? hexToHSLString(bgColor) : bgColor
    const fg = fgColor.startsWith('#') ? hexToHSLString(fgColor) : fgColor

    return {
      background: bg,
      foreground: fg,
      card: bg,
      cardForeground: fg,
      popover: bg,
      popoverForeground: fg,
    }
  },

  /**
   * Monochrome mixin - grayscale theme
   */
  monochrome: (): ColorMixin => ({
    primary: '0 0% 15%',
    primaryForeground: '0 0% 100%',
    secondary: '0 0% 96%',
    secondaryForeground: '0 0% 15%',
    accent: '0 0% 96%',
    accentForeground: '0 0% 15%',
    muted: '0 0% 96%',
    mutedForeground: '0 0% 45%',
    border: '0 0% 90%',
    input: '0 0% 90%',
    ring: '0 0% 15%',
  }),

  /**
   * High contrast mixin
   */
  highContrast: (): ColorMixin => ({
    foreground: '0 0% 0%',
    primary: '239 100% 40%',
    primaryForeground: '0 0% 100%',
    border: '0 0% 70%',
    ring: '239 100% 40%',
  }),
}

// ============================================================================
// Typography Mixins
// ============================================================================

/**
 * Typography mixins
 */
export const TypographyMixins = {
  /**
   * System font stack
   */
  systemFonts: (): Partial<TypographyConfig> => ({
    fontFamily: {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    },
  }),

  /**
   * Inter font family
   */
  interFonts: (): Partial<TypographyConfig> => ({
    fontFamily: {
      sans: '"Inter", system-ui, -apple-system, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace',
    },
  }),

  /**
   * Serif fonts (for editorial/blog themes)
   */
  serifFonts: (): Partial<TypographyConfig> => ({
    fontFamily: {
      sans: '"Georgia", "Times New Roman", serif',
      mono: '"Courier New", Courier, monospace',
    },
  }),

  /**
   * Compact typography
   */
  compact: (): Partial<TypographyConfig> => ({
    fontSize: {
      xs: '0.65rem',
      sm: '0.75rem',
      base: '0.875rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '1.875rem',
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.5,
    },
  }),

  /**
   * Spacious typography
   */
  spacious: (): Partial<TypographyConfig> => ({
    fontSize: {
      xs: '0.8rem',
      sm: '0.95rem',
      base: '1.1rem',
      lg: '1.25rem',
      xl: '1.4rem',
      '2xl': '1.75rem',
      '3xl': '2.25rem',
      '4xl': '3rem',
    },
    lineHeight: {
      tight: 1.3,
      normal: 1.6,
      relaxed: 1.75,
    },
  }),
}

// ============================================================================
// Border & Shadow Mixins
// ============================================================================

/**
 * Border mixins
 */
export const BorderMixins = {
  /**
   * Sharp corners (no border radius)
   */
  sharp: (): Partial<BorderConfig> => ({
    radius: {
      none: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      full: '0',
    },
  }),

  /**
   * Rounded corners (default)
   */
  rounded: (): Partial<BorderConfig> => ({
    radius: {
      none: '0',
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
    },
  }),

  /**
   * Extra rounded corners
   */
  extraRounded: (): Partial<BorderConfig> => ({
    radius: {
      none: '0',
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem',
      '2xl': '2rem',
      full: '9999px',
    },
  }),

  /**
   * Pill-shaped corners
   */
  pill: (): Partial<BorderConfig> => ({
    radius: {
      none: '0',
      sm: '9999px',
      md: '9999px',
      lg: '9999px',
      xl: '9999px',
      '2xl': '9999px',
      full: '9999px',
    },
  }),
}

/**
 * Shadow mixins
 */
export const ShadowMixins = {
  /**
   * No shadows (flat design)
   */
  flat: (): Partial<ShadowConfig> => ({
    none: 'none',
    sm: 'none',
    md: 'none',
    lg: 'none',
    xl: 'none',
    '2xl': 'none',
    inner: 'none',
  }),

  /**
   * Subtle shadows
   */
  subtle: (): Partial<ShadowConfig> => ({
    sm: '0 1px 2px rgba(0,0,0,0.04)',
    md: '0 2px 4px rgba(0,0,0,0.06)',
    lg: '0 4px 8px rgba(0,0,0,0.08)',
    xl: '0 8px 16px rgba(0,0,0,0.1)',
    '2xl': '0 16px 32px rgba(0,0,0,0.12)',
  }),

  /**
   * Prominent shadows
   */
  prominent: (): Partial<ShadowConfig> => ({
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.15)',
    lg: '0 8px 16px rgba(0,0,0,0.2)',
    xl: '0 16px 32px rgba(0,0,0,0.25)',
    '2xl': '0 24px 48px rgba(0,0,0,0.3)',
  }),

  /**
   * Colored shadows (based on primary color)
   */
  colored: (primaryHsl: string): Partial<ShadowConfig> => ({
    sm: `0 2px 4px hsl(${primaryHsl} / 0.1)`,
    md: `0 4px 8px hsl(${primaryHsl} / 0.15)`,
    lg: `0 8px 16px hsl(${primaryHsl} / 0.2)`,
    xl: `0 16px 32px hsl(${primaryHsl} / 0.25)`,
    '2xl': `0 24px 48px hsl(${primaryHsl} / 0.3)`,
  }),
}

// ============================================================================
// Theme Builder Class
// ============================================================================

/**
 * Fluent theme builder for creating custom themes
 *
 * @example
 * ```ts
 * const myTheme = new ThemeBuilder()
 *   .extend('default')
 *   .mode('dark')
 *   .colors(ColorMixins.brand('#6366f1'))
 *   .colors(ColorMixins.states({ success: '#22c55e', error: '#ef4444' }))
 *   .typography(TypographyMixins.interFonts())
 *   .borders(BorderMixins.extraRounded())
 *   .name('My Custom Theme')
 *   .build()
 * ```
 */
export class ThemeBuilder {
  private baseTheme: CompleteThemeConfig
  private overrides: PartialThemeConfig = {}
  private themeName: string = 'custom'
  private themeMode: 'light' | 'dark' = 'light'
  private shouldAutoFixContrast: boolean = false
  private contrastTarget: number = 4.5

  constructor(options: ThemeBuilderOptions = {}) {
    // Initialize base theme
    if (options.base) {
      this.baseTheme =
        typeof options.base === 'string'
          ? { ...modernThemes[options.base] }
          : { ...options.base }
    } else {
      this.baseTheme = { ...modernThemes['default'] }
    }

    if (options.mode) {
      this.themeMode = options.mode
    }

    if (options.autoFixContrast) {
      this.shouldAutoFixContrast = true
      this.contrastTarget = options.targetContrast || 4.5
    }
  }

  /**
   * Extend from a preset theme
   */
  extend(preset: ModernThemePresetName | CompleteThemeConfig): ThemeBuilder {
    this.baseTheme =
      typeof preset === 'string' ? { ...modernThemes[preset] } : { ...preset }
    return this
  }

  /**
   * Set theme mode
   */
  mode(mode: 'light' | 'dark'): ThemeBuilder {
    this.themeMode = mode
    return this
  }

  /**
   * Set theme name
   */
  name(name: string): ThemeBuilder {
    this.themeName = name
    return this
  }

  /**
   * Apply color overrides/mixins
   */
  colors(colors: ColorMixin): ThemeBuilder {
    this.overrides.colors = {
      ...this.overrides.colors,
      ...colors,
    }
    return this
  }

  /**
   * Apply typography overrides/mixins
   */
  typography(typography: Partial<TypographyConfig>): ThemeBuilder {
    this.overrides.typography = {
      ...this.overrides.typography,
      ...typography,
    } as TypographyConfig
    return this
  }

  /**
   * Apply border overrides/mixins
   */
  borders(borders: Partial<BorderConfig>): ThemeBuilder {
    this.overrides.borders = {
      ...this.overrides.borders,
      ...borders,
    } as BorderConfig
    return this
  }

  /**
   * Apply shadow overrides/mixins
   */
  shadows(shadows: Partial<ShadowConfig>): ThemeBuilder {
    this.overrides.shadows = {
      ...this.overrides.shadows,
      ...shadows,
    } as ShadowConfig
    return this
  }

  /**
   * Apply animation overrides
   */
  animations(animations: Partial<AnimationConfig>): ThemeBuilder {
    this.overrides.animations = {
      ...this.overrides.animations,
      ...animations,
    } as AnimationConfig
    return this
  }

  /**
   * Apply component overrides
   */
  components(components: ComponentOverrides): ThemeBuilder {
    this.overrides.components = {
      ...this.overrides.components,
      ...components,
    }
    return this
  }

  /**
   * Enable auto-contrast fixing
   */
  autoContrast(target: number = 4.5): ThemeBuilder {
    this.shouldAutoFixContrast = true
    this.contrastTarget = target
    return this
  }

  /**
   * Build the final theme
   */
  build(): CompleteThemeConfig {
    // Merge base with overrides
    const merged: CompleteThemeConfig = {
      name: this.themeName,
      mode: this.themeMode,
      colors: {
        ...this.baseTheme.colors,
        ...this.overrides.colors,
      },
      typography: {
        ...this.baseTheme.typography,
        ...this.overrides.typography,
      } as TypographyConfig,
      spacing: this.baseTheme.spacing,
      borders: {
        width: {
          ...this.baseTheme.borders.width,
          ...this.overrides.borders?.width,
        },
        radius: {
          ...this.baseTheme.borders.radius,
          ...this.overrides.borders?.radius,
        },
      },
      shadows: {
        ...this.baseTheme.shadows,
        ...this.overrides.shadows,
      } as ShadowConfig,
      animations: {
        ...this.baseTheme.animations,
        ...this.overrides.animations,
      } as AnimationConfig,
      components: {
        ...this.baseTheme.components,
        ...this.overrides.components,
      },
    }

    // Auto-fix contrast if enabled
    if (this.shouldAutoFixContrast) {
      merged.colors = this.fixContrast(merged.colors)
    }

    return merged
  }

  /**
   * Fix contrast issues in color config
   * Automatically adjusts foreground colors to meet WCAG contrast requirements
   */
  private fixContrast(colors: ColorConfig): ColorConfig {
    const fixed = { ...colors }

    // Helper to convert HSL string to hex for color calculations
    const toHex = (color: string): string => {
      if (color.startsWith('#')) return color
      return hslStringToHex(color)
    }

    try {
      // Fix primary/background contrast
      const primaryHex = toHex(colors.primary)
      const bgHex = toHex(colors.background)
      const adjustedPrimary = autoAdjustForContrast(
        primaryHex,
        bgHex,
        this.contrastTarget
      )
      if (adjustedPrimary !== primaryHex) {
        fixed.primary = hexToHSLString(adjustedPrimary)
      }

      // Fix foreground/background contrast
      const fgHex = toHex(colors.foreground)
      const adjustedFg = autoAdjustForContrast(
        fgHex,
        bgHex,
        this.contrastTarget
      )
      if (adjustedFg !== fgHex) {
        fixed.foreground = hexToHSLString(adjustedFg)
      }

      // Fix destructive contrast
      if (colors.destructive) {
        const destructiveHex = toHex(colors.destructive)
        const adjustedDestructive = autoAdjustForContrast(
          destructiveHex,
          bgHex,
          this.contrastTarget
        )
        if (adjustedDestructive !== destructiveHex) {
          fixed.destructive = hexToHSLString(adjustedDestructive)
        }
      }
    } catch {
      // If contrast fixing fails, return original colors
      logger.warn(
        '[ThemeBuilder] Auto-contrast adjustment failed, using original colors'
      )
    }

    return fixed
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Compose multiple themes together
 * Later themes override earlier ones
 */
export function composeThemes(
  ...themes: (
    | ModernThemePresetName
    | CompleteThemeConfig
    | PartialThemeConfig
  )[]
): CompleteThemeConfig {
  let result: CompleteThemeConfig = { ...modernThemes['default'] }

  for (const theme of themes) {
    if (typeof theme === 'string') {
      result = { ...result, ...modernThemes[theme] }
    } else {
      result = deepMergeTheme(result, theme as PartialThemeConfig)
    }
  }

  return result
}

/**
 * Deep merge theme configurations
 */
function deepMergeTheme(
  base: CompleteThemeConfig,
  override: PartialThemeConfig
): CompleteThemeConfig {
  return {
    name: override.name ?? base.name,
    mode: override.mode ?? base.mode,
    colors: { ...base.colors, ...override.colors },
    typography: {
      ...base.typography,
      ...override.typography,
      fontFamily: {
        ...base.typography.fontFamily,
        ...override.typography?.fontFamily,
      },
      fontSize: {
        ...base.typography.fontSize,
        ...override.typography?.fontSize,
      },
      fontWeight: {
        ...base.typography.fontWeight,
        ...override.typography?.fontWeight,
      },
      lineHeight: {
        ...base.typography.lineHeight,
        ...override.typography?.lineHeight,
      },
      letterSpacing: {
        ...base.typography.letterSpacing,
        ...override.typography?.letterSpacing,
      },
    },
    spacing: { ...base.spacing, ...override.spacing },
    borders: {
      width: { ...base.borders.width, ...override.borders?.width },
      radius: { ...base.borders.radius, ...override.borders?.radius },
    },
    shadows: { ...base.shadows, ...override.shadows },
    animations: { ...base.animations, ...override.animations },
    components: { ...base.components, ...override.components },
  }
}

/**
 * Create a theme variant (e.g., dark version from light)
 */
export function createVariant(
  base: CompleteThemeConfig,
  variantFn: ThemeVariantFn
): CompleteThemeConfig {
  return variantFn(base)
}

/**
 * Common variant functions
 */
export const ThemeVariants = {
  /**
   * Create dark variant from light theme
   */
  toDark: (base: CompleteThemeConfig): CompleteThemeConfig => ({
    ...base,
    name: `${base.name}-dark`,
    mode: 'dark',
    colors: {
      ...base.colors,
      background: '222 47% 11%',
      foreground: '210 40% 98%',
      card: '222 47% 11%',
      cardForeground: '210 40% 98%',
      popover: '222 47% 11%',
      popoverForeground: '210 40% 98%',
      muted: '217 33% 17%',
      mutedForeground: '215 20% 65%',
      border: '217 33% 22%',
      input: '217 33% 17%',
    },
  }),

  /**
   * Create light variant from dark theme
   */
  toLight: (base: CompleteThemeConfig): CompleteThemeConfig => ({
    ...base,
    name: base.name.replace('-dark', ''),
    mode: 'light',
    colors: {
      ...base.colors,
      background: '0 0% 100%',
      foreground: '222 47% 11%',
      card: '0 0% 100%',
      cardForeground: '222 47% 11%',
      popover: '0 0% 100%',
      popoverForeground: '222 47% 11%',
      muted: '240 5% 96%',
      mutedForeground: '240 4% 46%',
      border: '240 6% 90%',
      input: '240 6% 90%',
    },
  }),

  /**
   * Increase contrast for accessibility
   */
  highContrast: (base: CompleteThemeConfig): CompleteThemeConfig => ({
    ...base,
    name: `${base.name}-high-contrast`,
    colors: {
      ...base.colors,
      ...ColorMixins.highContrast(),
    },
  }),
}

// ============================================================================
// Quick Theme Creation
// ============================================================================

/**
 * Quick function to create a custom theme from a brand color
 */
export function createBrandTheme(
  brandColor: string,
  options: {
    name?: string
    mode?: 'light' | 'dark'
    base?: ModernThemePresetName
  } = {}
): CompleteThemeConfig {
  const builder = new ThemeBuilder({
    base:
      options.base || (options.mode === 'dark' ? 'default-dark' : 'default'),
    mode: options.mode || 'light',
  })

  return builder
    .name(options.name || 'custom-brand')
    .colors(ColorMixins.brand(brandColor))
    .build()
}

/**
 * Quick function to create theme from multiple brand colors
 */
export function createMultiColorTheme(
  colors: {
    primary: string
    secondary?: string
    accent?: string
    success?: string
    warning?: string
    error?: string
  },
  options: {
    name?: string
    mode?: 'light' | 'dark'
    base?: ModernThemePresetName
  } = {}
): CompleteThemeConfig {
  const builder = new ThemeBuilder({
    base:
      options.base || (options.mode === 'dark' ? 'default-dark' : 'default'),
    mode: options.mode || 'light',
  })
    .name(options.name || 'custom-multi')
    .colors(ColorMixins.brand(colors.primary))

  if (colors.secondary) {
    const hsl = colors.secondary.startsWith('#')
      ? hexToHSLString(colors.secondary)
      : colors.secondary
    builder.colors({
      secondary: hsl,
      secondaryForeground: getContrastingForeground(colors.secondary),
    })
  }

  if (colors.accent) {
    builder.colors(ColorMixins.accent(colors.accent))
  }

  if (colors.success || colors.warning || colors.error) {
    builder.colors(
      ColorMixins.states({
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
      })
    )
  }

  return builder.build()
}
