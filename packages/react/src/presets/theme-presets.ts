/**
 * Theme Presets - Pre-configured theme configurations
 *
 * Provides theme presets for light, dark, system, and custom color schemes.
 * Each preset includes color palettes, typography, spacing, and component styles.
 *
 * @example
 * ```tsx
 * import { lightThemePreset, darkThemePreset, customThemePreset } from './presets'
 *
 * // Apply light theme
 * <App theme={lightThemePreset} />
 *
 * // Apply dark theme
 * <App theme={darkThemePreset} />
 *
 * // Create custom theme
 * const myTheme = createCustomThemePreset({
 *   name: 'Ocean Blue',
 *   primary: '#0066cc',
 *   secondary: '#00cc99'
 * })
 * ```
 */

// ============================================================================
// Types
// ============================================================================

/** Color palette for theme */
export interface ThemePalette {
  /** Primary brand color */
  primary: string
  /** Secondary accent color */
  secondary: string
  /** Background color */
  background: string
  /** Surface color */
  surface: string
  /** Text primary color */
  textPrimary: string
  /** Text secondary color */
  textSecondary: string
  /** Tertiary accent color */
  tertiary?: string
  /** Error/danger color */
  error?: string
  /** Warning color */
  warning?: string
  /** Success color */
  success?: string
  /** Info color */
  info?: string
  /** Divider color */
  divider?: string
  /** Disabled color */
  disabled?: string
}

/** Typography configuration */
export interface ThemeTypography {
  /** Font family stack */
  fontFamily: string
  /** Heading font family */
  fontFamilyHeading?: string
  /** Base font size */
  fontSize: number
  /** Font sizes for different scales */
  fontSizes?: {
    xs: number
    sm: number
    base: number
    lg: number
    xl: number
    '2xl': number
    '3xl': number
  }
  /** Line height */
  lineHeight: number
}

/** Spacing configuration */
export interface ThemeSpacing {
  /** Base spacing unit */
  baseUnit: number
  /** Multiplier for spacing scale */
  scale?: {
    0: number
    1: number
    2: number
    3: number
    4: number
    6: number
    8: number
    12: number
    16: number
    20: number
    24: number
  }
}

/** Border radius configuration */
export interface ThemeBorderRadius {
  /** Small radius (buttons, inputs) */
  sm: string
  /** Medium radius (cards) */
  md: string
  /** Large radius (modals) */
  lg: string
  /** Full border radius (circles) */
  full: string
}

/** Shadow configuration */
export interface ThemeShadows {
  /** Small shadow */
  sm: string
  /** Medium shadow */
  md: string
  /** Large shadow */
  lg: string
  /** Extra large shadow */
  xl: string
}

/** Component-specific theme configuration */
export interface ThemeComponents {
  /** Button styles */
  button?: {
    borderRadius: string
    padding: string
    fontSize: number
  }
  /** Input styles */
  input?: {
    borderRadius: string
    padding: string
    fontSize: number
  }
  /** Card styles */
  card?: {
    borderRadius: string
    padding: string
    shadow: string
  }
  /** Chat message styles */
  chatMessage?: {
    borderRadius: string
    padding: string
    maxWidth?: string
  }
}

/** Complete theme preset */
export interface ThemePreset {
  /** Theme name */
  name: string
  /** Theme description */
  description: string
  /** Color scheme type */
  scheme: 'light' | 'dark' | 'auto'
  /** Color palette */
  palette: ThemePalette
  /** Typography configuration */
  typography: ThemeTypography
  /** Spacing configuration */
  spacing: ThemeSpacing
  /** Border radius configuration */
  borderRadius: ThemeBorderRadius
  /** Shadow configuration */
  shadows: ThemeShadows
  /** Component-specific styles */
  components?: ThemeComponents
  /** Whether theme supports dark mode */
  supportsDarkMode?: boolean
  /** CSS variables prefix */
  cssPrefix?: string
}

/** Options for creating custom theme */
export interface CreateCustomThemePresetOptions {
  name: string
  description?: string
  scheme?: 'light' | 'dark' | 'auto'
  palette?: Partial<ThemePalette>
  typography?: Partial<ThemeTypography>
  spacing?: Partial<ThemeSpacing>
  borderRadius?: Partial<ThemeBorderRadius>
  shadows?: Partial<ThemeShadows>
  components?: ThemeComponents
  cssPrefix?: string
}

// ============================================================================
// Light Theme Preset
// ============================================================================

export const lightThemePreset: ThemePreset = {
  name: 'Light',
  description: 'Clean, bright light theme',
  scheme: 'light',
  palette: {
    primary: '#0066cc',
    secondary: '#00cc99',
    tertiary: '#ff6b35',
    background: '#ffffff',
    surface: '#f7f7f7',
    textPrimary: '#1a1a1a',
    textSecondary: '#666666',
    error: '#cc0000',
    warning: '#ff9900',
    success: '#00cc66',
    info: '#0099cc',
    divider: '#e0e0e0',
    disabled: '#cccccc',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontFamilyHeading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 16,
    fontSizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
    },
    lineHeight: 1.5,
  },
  spacing: {
    baseUnit: 4,
    scale: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      6: 24,
      8: 32,
      12: 48,
      16: 64,
      20: 80,
      24: 96,
    },
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },
  components: {
    button: {
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: 14,
    },
    input: {
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: 16,
    },
    card: {
      borderRadius: '12px',
      padding: '16px',
      shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    chatMessage: {
      borderRadius: '12px',
      padding: '12px 16px',
    },
  },
  supportsDarkMode: true,
  cssPrefix: '--light',
}

// ============================================================================
// Dark Theme Preset
// ============================================================================

export const darkThemePreset: ThemePreset = {
  name: 'Dark',
  description: 'Modern dark theme with reduced eye strain',
  scheme: 'dark',
  palette: {
    primary: '#4da6ff',
    secondary: '#4dffcc',
    tertiary: '#ffb366',
    background: '#0a0e27',
    surface: '#1a1f3a',
    textPrimary: '#f0f0f0',
    textSecondary: '#a0a0a0',
    error: '#ff6666',
    warning: '#ffcc00',
    success: '#66ff99',
    info: '#66ccff',
    divider: '#2a2f4a',
    disabled: '#4a4a4a',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontFamilyHeading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 16,
    fontSizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
    },
    lineHeight: 1.5,
  },
  spacing: {
    baseUnit: 4,
    scale: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      6: 24,
      8: 32,
      12: 48,
      16: 64,
      20: 80,
      24: 96,
    },
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
  },
  components: {
    button: {
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: 14,
    },
    input: {
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: 16,
    },
    card: {
      borderRadius: '12px',
      padding: '16px',
      shadow: '0 4px 6px rgba(0, 0, 0, 0.4)',
    },
    chatMessage: {
      borderRadius: '12px',
      padding: '12px 16px',
    },
  },
  supportsDarkMode: true,
  cssPrefix: '--dark',
}

// ============================================================================
// System Theme Preset
// ============================================================================

export const systemThemePreset: ThemePreset = {
  name: 'System',
  description: 'Automatically adapts to system preferences',
  scheme: 'auto',
  palette: {
    primary: '#0066cc',
    secondary: '#00cc99',
    tertiary: '#ff6b35',
    background: '#ffffff',
    surface: '#f7f7f7',
    textPrimary: '#1a1a1a',
    textSecondary: '#666666',
    error: '#cc0000',
    warning: '#ff9900',
    success: '#00cc66',
    info: '#0099cc',
    divider: '#e0e0e0',
    disabled: '#cccccc',
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 16,
    fontSizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
    },
    lineHeight: 1.5,
  },
  spacing: {
    baseUnit: 4,
    scale: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      6: 24,
      8: 32,
      12: 48,
      16: 64,
      20: 80,
      24: 96,
    },
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },
  supportsDarkMode: true,
  cssPrefix: '--system',
}

// ============================================================================
// Custom Theme Preset
// ============================================================================

export const customThemePreset: ThemePreset = {
  name: 'Custom',
  description: 'Fully customizable theme template',
  scheme: 'light',
  palette: {
    primary: '#000000',
    secondary: '#666666',
    background: '#ffffff',
    surface: '#f5f5f5',
    textPrimary: '#000000',
    textSecondary: '#666666',
  },
  typography: {
    fontFamily: 'inherit',
    fontSize: 16,
    lineHeight: 1.5,
  },
  spacing: {
    baseUnit: 4,
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: 'none',
    md: 'none',
    lg: 'none',
    xl: 'none',
  },
  cssPrefix: '--custom',
}

// ============================================================================
// Theme Map
// ============================================================================

export const THEME_PRESETS = {
  light: lightThemePreset,
  dark: darkThemePreset,
  system: systemThemePreset,
  custom: customThemePreset,
} as const

export type ThemePresetName = keyof typeof THEME_PRESETS

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get a theme preset by name
 */
export function getThemePreset(name: ThemePresetName): ThemePreset | undefined {
  return THEME_PRESETS[name]
}

/**
 * List all available theme names
 */
export function listThemePresets(): ThemePresetName[] {
  return Object.keys(THEME_PRESETS) as ThemePresetName[]
}

/**
 * Create a custom theme preset from options
 */
export function createCustomThemePreset(
  options: CreateCustomThemePresetOptions,
  baseTheme: ThemePreset = customThemePreset
): ThemePreset {
  return {
    name: options.name,
    description: options.description || 'Custom theme',
    scheme: options.scheme || baseTheme.scheme,
    palette: {
      ...baseTheme.palette,
      ...(options.palette || {}),
    },
    typography: {
      ...baseTheme.typography,
      ...(options.typography || {}),
    },
    spacing: {
      ...baseTheme.spacing,
      ...(options.spacing || {}),
    },
    borderRadius: {
      ...baseTheme.borderRadius,
      ...(options.borderRadius || {}),
    },
    shadows: {
      ...baseTheme.shadows,
      ...(options.shadows || {}),
    },
    components: options.components || baseTheme.components,
    supportsDarkMode: options.scheme !== 'light',
    cssPrefix: options.cssPrefix,
  }
}

/**
 * Merge theme presets
 */
export function mergeThemePresets(
  ...themes: (ThemePreset | Partial<ThemePreset>)[]
): ThemePreset {
  if (themes.length === 0) {
    return lightThemePreset
  }

  return themes.reduce((acc, theme) => {
    if (!theme) return acc

    return {
      name: theme.name || acc.name,
      description: theme.description || acc.description,
      scheme: theme.scheme || acc.scheme,
      palette: {
        ...acc.palette,
        ...(theme.palette || {}),
      },
      typography: {
        ...acc.typography,
        ...(theme.typography || {}),
      },
      spacing: {
        ...acc.spacing,
        ...(theme.spacing || {}),
      },
      borderRadius: {
        ...acc.borderRadius,
        ...(theme.borderRadius || {}),
      },
      shadows: {
        ...acc.shadows,
        ...(theme.shadows || {}),
      },
      components: theme.components ? { ...acc.components, ...theme.components } : acc.components,
      supportsDarkMode: theme.supportsDarkMode ?? acc.supportsDarkMode,
      cssPrefix: theme.cssPrefix || acc.cssPrefix,
    }
  })
}

/**
 * Clone a theme with optional overrides
 */
export function cloneThemePreset(
  theme: ThemePreset,
  overrides: Partial<ThemePreset> = {}
): ThemePreset {
  return {
    name: overrides.name ?? theme.name,
    description: overrides.description ?? theme.description,
    scheme: overrides.scheme ?? theme.scheme,
    palette: {
      ...theme.palette,
      ...(overrides.palette || {}),
    },
    typography: {
      ...theme.typography,
      ...(overrides.typography || {}),
    },
    spacing: {
      ...theme.spacing,
      ...(overrides.spacing || {}),
    },
    borderRadius: {
      ...theme.borderRadius,
      ...(overrides.borderRadius || {}),
    },
    shadows: {
      ...theme.shadows,
      ...(overrides.shadows || {}),
    },
    components: overrides.components || theme.components,
    supportsDarkMode: overrides.supportsDarkMode ?? theme.supportsDarkMode,
    cssPrefix: overrides.cssPrefix ?? theme.cssPrefix,
  }
}

/**
 * Generate CSS variables from a theme
 */
export function generateThemeCssVariables(theme: ThemePreset): Record<string, string> {
  const prefix = theme.cssPrefix || '--theme'
  const vars: Record<string, string> = {}

  // Palette colors
  Object.entries(theme.palette).forEach(([key, value]) => {
    vars[`${prefix}-${key}`] = value
  })

  // Spacing
  if (theme.spacing.scale) {
    Object.entries(theme.spacing.scale).forEach(([key, value]) => {
      vars[`${prefix}-space-${key}`] = `${value}px`
    })
  }

  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    vars[`${prefix}-radius-${key}`] = value
  })

  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    vars[`${prefix}-shadow-${key}`] = value
  })

  return vars
}
