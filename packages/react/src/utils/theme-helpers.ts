/**
 * Theme Helpers - Easy Theming and Customization
 *
 * Utilities for creating, managing, and applying themes to Clarity Chat components
 * with minimal configuration and maximum flexibility.
 *
 * @module utils/theme-helpers
 */

import { createTheme, type Theme } from '../theme/create-theme'

// =============================================================================
// THEME PRESETS
// =============================================================================

/**
 * Pre-built theme presets for common design systems
 */
export const ThemePresets = {
  /** Modern light theme */
  Light: createTheme({
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      primary: '#0066cc',
      secondary: '#6b7280',
      accent: '#f3f4f6',
      muted: '#f9fafb',
      border: '#e5e7eb',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
    },
  }),

  /** Modern dark theme */
  Dark: createTheme({
    colors: {
      background: '#111827',
      foreground: '#f9fafb',
      primary: '#60a5fa',
      secondary: '#9ca3af',
      accent: '#374151',
      muted: '#1f2937',
      border: '#374151',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
    },
  }),

  /** Minimal theme */
  Minimal: createTheme({
    colors: {
      background: '#ffffff',
      foreground: '#111827',
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#f8fafc',
      muted: '#f1f5f9',
      border: '#e2e8f0',
    },
    spacing: {
      xs: '0.125rem',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      xl: '1.5rem',
    },
    typography: {
      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
      fontSize: {
        xs: '0.6875rem',
        sm: '0.8125rem',
        base: '0.9375rem',
        lg: '1.0625rem',
        xl: '1.1875rem',
      },
    },
  }),

  /** Warm theme */
  Warm: createTheme({
    colors: {
      background: '#fef7ed',
      foreground: '#9a3412',
      primary: '#ea580c',
      secondary: '#a16207',
      accent: '#fed7aa',
      muted: '#ffedd5',
      border: '#fdba74',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: 'Georgia, serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
    },
  }),

  /** Cool theme */
  Cool: createTheme({
    colors: {
      background: '#f0f9ff',
      foreground: '#0c4a6e',
      primary: '#0284c7',
      secondary: '#0369a1',
      accent: '#bae6fd',
      muted: '#e0f2fe',
      border: '#7dd3fc',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
    },
  }),
}

// =============================================================================
// THEME BUILDERS
// =============================================================================

/**
 * Create a theme from color palette
 */
export function createThemeFromPalette(palette: {
  primary: string
  secondary: string
  background: string
  foreground: string
  accent?: string
  muted?: string
  border?: string
}): Theme {
  return createTheme({
    colors: {
      primary: palette.primary,
      secondary: palette.secondary,
      background: palette.background,
      foreground: palette.foreground,
      accent: palette.accent || adjustColor(palette.background, 10),
      muted: palette.muted || adjustColor(palette.background, 5),
      border: palette.border || adjustColor(palette.foreground, -20),
    },
  })
}

/**
 * Create a theme from CSS custom properties
 */
export function createThemeFromCSSVariables(prefix = '--chat'): Theme {
  const getCSSVar = (name: string) => {
    if (typeof document === 'undefined') return undefined
    return getComputedStyle(document.documentElement).getPropertyValue(`${prefix}-${name}`).trim()
  }

  return createTheme({
    colors: {
      primary: getCSSVar('primary') || '#0066cc',
      secondary: getCSSVar('secondary') || '#6b7280',
      background: getCSSVar('background') || '#ffffff',
      foreground: getCSSVar('foreground') || '#000000',
      accent: getCSSVar('accent') || '#f3f4f6',
      muted: getCSSVar('muted') || '#f9fafb',
      border: getCSSVar('border') || '#e5e7eb',
    },
  })
}

/**
 * Merge multiple themes together
 */
export function mergeThemes(...themes: Theme[]): Theme {
  return themes.reduce((merged, theme) => ({
    ...merged,
    ...theme,
    colors: { ...merged.colors, ...theme.colors },
    spacing: { ...merged.spacing, ...theme.spacing },
    typography: { ...merged.typography, ...theme.typography },
  }), {} as Theme)
}

/**
 * Create a theme variant (light/dark mode)
 */
export function createThemeVariant(
  baseTheme: Theme,
  variant: 'light' | 'dark',
  adjustments?: Partial<Theme>
): Theme {
  const variantAdjustments = variant === 'dark' ? {
    colors: {
      background: '#111827',
      foreground: '#f9fafb',
      border: '#374151',
      muted: '#1f2937',
    },
  } : {}

  return mergeThemes(baseTheme, variantAdjustments, adjustments || {})
}

// =============================================================================
// THEME UTILITIES
// =============================================================================

/**
 * Adjust color brightness
 */
function adjustColor(color: string, amount: number): string {
  // Simple brightness adjustment (basic implementation)
  const usePound = color[0] === '#'
  const col = usePound ? color.slice(1) : color

  const num = parseInt(col, 16)
  let r = (num >> 16) + amount
  let g = (num >> 8 & 0x00FF) + amount
  let b = (num & 0x0000FF) + amount

  r = r > 255 ? 255 : r < 0 ? 0 : r
  g = g > 255 ? 255 : g < 0 ? 0 : g
  b = b > 255 ? 255 : b < 0 ? 0 : b

  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16)
}

/**
 * Generate theme-aware class names
 */
export function createThemeClasses(theme: Theme, prefix = 'chat'): Record<string, string> {
  const classes: Record<string, string> = {}

  // Color classes
  Object.entries(theme.colors || {}).forEach(([key, value]) => {
    classes[`${prefix}-color-${key}`] = `color: ${value}`
    classes[`${prefix}-bg-${key}`] = `background-color: ${value}`
    classes[`${prefix}-border-${key}`] = `border-color: ${value}`
  })

  // Spacing classes
  Object.entries(theme.spacing || {}).forEach(([key, value]) => {
    classes[`${prefix}-space-${key}`] = `padding: ${value}`
    classes[`${prefix}-margin-${key}`] = `margin: ${value}`
  })

  return classes
}

/**
 * Apply theme to CSS custom properties
 */
export function applyThemeToCSS(theme: Theme, prefix = '--chat'): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Apply colors
  Object.entries(theme.colors || {}).forEach(([key, value]) => {
    root.style.setProperty(`${prefix}-${key}`, value)
  })

  // Apply spacing
  Object.entries(theme.spacing || {}).forEach(([key, value]) => {
    root.style.setProperty(`${prefix}-space-${key}`, value)
  })

  // Apply typography
  Object.entries(theme.typography?.fontSize || {}).forEach(([key, value]) => {
    root.style.setProperty(`${prefix}-font-size-${key}`, value)
  })

  if (theme.typography?.fontFamily) {
    root.style.setProperty(`${prefix}-font-family`, theme.typography.fontFamily)
  }
}

// =============================================================================
// THEME HOOKS
// =============================================================================

/**
 * React hook for theme management
 */
export function useTheme(theme?: Theme) {
  const [currentTheme, setCurrentTheme] = React.useState(theme || ThemePresets.Light)

  React.useEffect(() => {
    applyThemeToCSS(currentTheme)
  }, [currentTheme])

  return {
    theme: currentTheme,
    setTheme: setCurrentTheme,
    applyTheme: (newTheme: Theme) => {
      setCurrentTheme(newTheme)
      applyThemeToCSS(newTheme)
    },
    resetTheme: () => {
      setCurrentTheme(ThemePresets.Light)
      applyThemeToCSS(ThemePresets.Light)
    },
  }
}

/**
 * Hook for responsive themes
 */
export function useResponsiveTheme() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return useTheme(isDark ? ThemePresets.Dark : ThemePresets.Light)
}

/**
 * Hook for custom theme with localStorage persistence
 */
export function usePersistentTheme(defaultTheme = ThemePresets.Light) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme

    try {
      const saved = localStorage.getItem('clarity-chat-theme')
      return saved ? JSON.parse(saved) : defaultTheme
    } catch {
      return defaultTheme
    }
  })

  const updateTheme = React.useCallback((newTheme: Theme) => {
    setTheme(newTheme)
    applyThemeToCSS(newTheme)

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('clarity-chat-theme', JSON.stringify(newTheme))
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [])

  React.useEffect(() => {
    applyThemeToCSS(theme)
  }, [theme])

  return { theme, setTheme: updateTheme }
}

// =============================================================================
// THEME COMPONENTS
// =============================================================================

/**
 * Theme provider component
 */
export const ThemeProvider: React.FC<{
  theme?: Theme
  children: React.ReactNode
}> = ({ theme = ThemePresets.Light, children }) => {
  const themeContext = useTheme(theme)

  return (
    <div data-theme="clarity-chat">
      {children}
    </div>
  )
}

/**
 * Theme toggle component
 */
export const ThemeToggle: React.FC<{
  themes?: { light: Theme, dark: Theme }
  className?: string
}> = ({
  themes = { light: ThemePresets.Light, dark: ThemePresets.Dark },
  className = ''
}) => {
  const { theme, setTheme } = useTheme()
  const isDark = theme === themes.dark

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={() => setTheme(isDark ? themes.light : themes.dark)}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

/**
 * Theme selector component
 */
export const ThemeSelector: React.FC<{
  themes?: Record<string, Theme>
  onThemeChange?: (theme: Theme) => void
  className?: string
}> = ({
  themes = ThemePresets,
  onThemeChange,
  className = ''
}) => {
  const { setTheme } = useTheme()

  const handleThemeChange = (themeName: string) => {
    const theme = themes[themeName]
    if (theme) {
      setTheme(theme)
      onThemeChange?.(theme)
    }
  }

  return (
    <select
      className={`theme-selector ${className}`}
      onChange={(e) => handleThemeChange(e.target.value)}
    >
      {Object.keys(themes).map((themeName) => (
        <option key={themeName} value={themeName}>
          {themeName}
        </option>
      ))}
    </select>
  )
}