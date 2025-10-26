/**
 * Built-in Theme Presets
 * 
 * 10 beautiful, production-ready themes covering various styles:
 * - Default (Light/Dark)
 * - Minimal (Light/Dark)
 * - Vibrant (Light/Dark)
 * - Ocean
 * - Sunset
 * - Forest
 * - Corporate
 */

import type { CompleteThemeConfig, ThemeMetadata } from './theme-config'

// ============================================================================
// 1. DEFAULT LIGHT THEME
// ============================================================================

export const defaultLightTheme: CompleteThemeConfig = {
  name: 'default-light',
  mode: 'light',
  colors: {
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    card: '0 0% 100%',
    cardForeground: '222.2 84% 4.9%',
    popover: '0 0% 100%',
    popoverForeground: '222.2 84% 4.9%',
    primary: '221.2 83.2% 53.3%',
    primaryForeground: '210 40% 98%',
    secondary: '210 40% 96.1%',
    secondaryForeground: '222.2 47.4% 11.2%',
    muted: '210 40% 96.1%',
    mutedForeground: '215.4 16.3% 46.9%',
    accent: '210 40% 96.1%',
    accentForeground: '222.2 47.4% 11.2%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '210 40% 98%',
    success: '142 76% 36%',
    successForeground: '210 40% 98%',
    warning: '38 92% 50%',
    warningForeground: '222.2 47.4% 11.2%',
    info: '199 89% 48%',
    infoForeground: '210 40% 98%',
    border: '214.3 31.8% 91.4%',
    input: '214.3 31.8% 91.4%',
    ring: '221.2 83.2% 53.3%',
  },
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  borders: {
    width: {
      thin: '1px',
      normal: '2px',
      thick: '4px',
    },
    radius: {
      none: '0',
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.5rem',
      full: '9999px',
    },
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
}

// ============================================================================
// 2. DEFAULT DARK THEME
// ============================================================================

export const defaultDarkTheme: CompleteThemeConfig = {
  ...defaultLightTheme,
  name: 'default-dark',
  mode: 'dark',
  colors: {
    background: '222.2 84% 4.9%',
    foreground: '210 40% 98%',
    card: '222.2 84% 4.9%',
    cardForeground: '210 40% 98%',
    popover: '222.2 84% 4.9%',
    popoverForeground: '210 40% 98%',
    primary: '217.2 91.2% 59.8%',
    primaryForeground: '222.2 47.4% 11.2%',
    secondary: '217.2 32.6% 17.5%',
    secondaryForeground: '210 40% 98%',
    muted: '217.2 32.6% 17.5%',
    mutedForeground: '215 20.2% 65.1%',
    accent: '217.2 32.6% 17.5%',
    accentForeground: '210 40% 98%',
    destructive: '0 62.8% 30.6%',
    destructiveForeground: '210 40% 98%',
    success: '142 76% 36%',
    successForeground: '210 40% 98%',
    warning: '38 92% 50%',
    warningForeground: '222.2 47.4% 11.2%',
    info: '199 89% 48%',
    infoForeground: '210 40% 98%',
    border: '217.2 32.6% 17.5%',
    input: '217.2 32.6% 17.5%',
    ring: '224.3 76.3% 48%',
  },
}

// ============================================================================
// 3. MINIMAL LIGHT THEME
// ============================================================================

export const minimalLightTheme: CompleteThemeConfig = {
  ...defaultLightTheme,
  name: 'minimal-light',
  mode: 'light',
  colors: {
    background: '0 0% 100%',
    foreground: '0 0% 10%',
    card: '0 0% 98%',
    cardForeground: '0 0% 10%',
    popover: '0 0% 100%',
    popoverForeground: '0 0% 10%',
    primary: '0 0% 10%',
    primaryForeground: '0 0% 98%',
    secondary: '0 0% 96%',
    secondaryForeground: '0 0% 10%',
    muted: '0 0% 96%',
    mutedForeground: '0 0% 45%',
    accent: '0 0% 96%',
    accentForeground: '0 0% 10%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '0 0% 98%',
    success: '142 76% 36%',
    successForeground: '0 0% 98%',
    warning: '38 92% 50%',
    warningForeground: '0 0% 10%',
    info: '199 89% 48%',
    infoForeground: '0 0% 98%',
    border: '0 0% 90%',
    input: '0 0% 90%',
    ring: '0 0% 10%',
  },
  borders: {
    ...defaultLightTheme.borders,
    radius: {
      none: '0',
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
    },
  },
}

// ============================================================================
// 4. MINIMAL DARK THEME
// ============================================================================

export const minimalDarkTheme: CompleteThemeConfig = {
  ...minimalLightTheme,
  name: 'minimal-dark',
  mode: 'dark',
  colors: {
    background: '0 0% 10%',
    foreground: '0 0% 98%',
    card: '0 0% 12%',
    cardForeground: '0 0% 98%',
    popover: '0 0% 10%',
    popoverForeground: '0 0% 98%',
    primary: '0 0% 98%',
    primaryForeground: '0 0% 10%',
    secondary: '0 0% 16%',
    secondaryForeground: '0 0% 98%',
    muted: '0 0% 16%',
    mutedForeground: '0 0% 60%',
    accent: '0 0% 16%',
    accentForeground: '0 0% 98%',
    destructive: '0 62.8% 30.6%',
    destructiveForeground: '0 0% 98%',
    success: '142 76% 36%',
    successForeground: '0 0% 98%',
    warning: '38 92% 50%',
    warningForeground: '0 0% 10%',
    info: '199 89% 48%',
    infoForeground: '0 0% 98%',
    border: '0 0% 20%',
    input: '0 0% 20%',
    ring: '0 0% 98%',
  },
}

// ============================================================================
// 5. VIBRANT LIGHT THEME
// ============================================================================

export const vibrantLightTheme: CompleteThemeConfig = {
  ...defaultLightTheme,
  name: 'vibrant-light',
  mode: 'light',
  colors: {
    background: '0 0% 100%',
    foreground: '240 10% 3.9%',
    card: '0 0% 100%',
    cardForeground: '240 10% 3.9%',
    popover: '0 0% 100%',
    popoverForeground: '240 10% 3.9%',
    primary: '262.1 83.3% 57.8%',
    primaryForeground: '0 0% 100%',
    secondary: '340 82% 52%',
    secondaryForeground: '0 0% 100%',
    muted: '240 4.8% 95.9%',
    mutedForeground: '240 3.8% 46.1%',
    accent: '340 82% 52%',
    accentForeground: '0 0% 100%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '0 0% 100%',
    success: '142 76% 36%',
    successForeground: '0 0% 100%',
    warning: '38 92% 50%',
    warningForeground: '240 10% 3.9%',
    info: '199 89% 48%',
    infoForeground: '0 0% 100%',
    border: '240 5.9% 90%',
    input: '240 5.9% 90%',
    ring: '262.1 83.3% 57.8%',
  },
}

// ============================================================================
// 6. VIBRANT DARK THEME
// ============================================================================

export const vibrantDarkTheme: CompleteThemeConfig = {
  ...vibrantLightTheme,
  name: 'vibrant-dark',
  mode: 'dark',
  colors: {
    background: '240 10% 3.9%',
    foreground: '0 0% 98%',
    card: '240 10% 3.9%',
    cardForeground: '0 0% 98%',
    popover: '240 10% 3.9%',
    popoverForeground: '0 0% 98%',
    primary: '263.4 70% 50.4%',
    primaryForeground: '0 0% 100%',
    secondary: '340 82% 52%',
    secondaryForeground: '0 0% 100%',
    muted: '240 3.7% 15.9%',
    mutedForeground: '240 5% 64.9%',
    accent: '340 82% 52%',
    accentForeground: '0 0% 100%',
    destructive: '0 62.8% 30.6%',
    destructiveForeground: '0 0% 98%',
    success: '142 76% 36%',
    successForeground: '0 0% 98%',
    warning: '38 92% 50%',
    warningForeground: '240 10% 3.9%',
    info: '199 89% 48%',
    infoForeground: '0 0% 98%',
    border: '240 3.7% 15.9%',
    input: '240 3.7% 15.9%',
    ring: '263.4 70% 50.4%',
  },
}

// ============================================================================
// 7. OCEAN THEME
// ============================================================================

export const oceanTheme: CompleteThemeConfig = {
  ...defaultLightTheme,
  name: 'ocean',
  mode: 'light',
  colors: {
    background: '200 20% 98%',
    foreground: '200 50% 10%',
    card: '180 25% 96%',
    cardForeground: '200 50% 10%',
    popover: '200 20% 98%',
    popoverForeground: '200 50% 10%',
    primary: '199 89% 48%',
    primaryForeground: '0 0% 100%',
    secondary: '187 85% 53%',
    secondaryForeground: '0 0% 100%',
    muted: '180 20% 92%',
    mutedForeground: '200 25% 40%',
    accent: '187 85% 53%',
    accentForeground: '0 0% 100%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '0 0% 100%',
    success: '142 76% 36%',
    successForeground: '0 0% 100%',
    warning: '38 92% 50%',
    warningForeground: '200 50% 10%',
    info: '199 89% 48%',
    infoForeground: '0 0% 100%',
    border: '180 20% 88%',
    input: '180 20% 88%',
    ring: '199 89% 48%',
  },
}

// ============================================================================
// 8. SUNSET THEME
// ============================================================================

export const sunsetTheme: CompleteThemeConfig = {
  ...defaultLightTheme,
  name: 'sunset',
  mode: 'light',
  colors: {
    background: '30 40% 98%',
    foreground: '20 70% 15%',
    card: '30 35% 96%',
    cardForeground: '20 70% 15%',
    popover: '30 40% 98%',
    popoverForeground: '20 70% 15%',
    primary: '14 90% 53%',
    primaryForeground: '0 0% 100%',
    secondary: '340 82% 52%',
    secondaryForeground: '0 0% 100%',
    muted: '30 30% 92%',
    mutedForeground: '20 40% 40%',
    accent: '340 82% 52%',
    accentForeground: '0 0% 100%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '0 0% 100%',
    success: '142 76% 36%',
    successForeground: '0 0% 100%',
    warning: '38 92% 50%',
    warningForeground: '20 70% 15%',
    info: '199 89% 48%',
    infoForeground: '0 0% 100%',
    border: '30 25% 88%',
    input: '30 25% 88%',
    ring: '14 90% 53%',
  },
}

// ============================================================================
// 9. FOREST THEME
// ============================================================================

export const forestTheme: CompleteThemeConfig = {
  ...defaultLightTheme,
  name: 'forest',
  mode: 'light',
  colors: {
    background: '120 20% 98%',
    foreground: '140 60% 15%',
    card: '120 15% 96%',
    cardForeground: '140 60% 15%',
    popover: '120 20% 98%',
    popoverForeground: '140 60% 15%',
    primary: '142 76% 36%',
    primaryForeground: '0 0% 100%',
    secondary: '80 60% 45%',
    secondaryForeground: '0 0% 100%',
    muted: '120 15% 92%',
    mutedForeground: '140 30% 40%',
    accent: '80 60% 45%',
    accentForeground: '0 0% 100%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '0 0% 100%',
    success: '142 76% 36%',
    successForeground: '0 0% 100%',
    warning: '38 92% 50%',
    warningForeground: '140 60% 15%',
    info: '199 89% 48%',
    infoForeground: '0 0% 100%',
    border: '120 15% 88%',
    input: '120 15% 88%',
    ring: '142 76% 36%',
  },
}

// ============================================================================
// 10. CORPORATE THEME
// ============================================================================

export const corporateTheme: CompleteThemeConfig = {
  ...defaultLightTheme,
  name: 'corporate',
  mode: 'light',
  colors: {
    background: '210 15% 98%',
    foreground: '220 15% 20%',
    card: '210 12% 96%',
    cardForeground: '220 15% 20%',
    popover: '210 15% 98%',
    popoverForeground: '220 15% 20%',
    primary: '220 70% 50%',
    primaryForeground: '0 0% 100%',
    secondary: '210 20% 70%',
    secondaryForeground: '220 15% 20%',
    muted: '210 15% 92%',
    mutedForeground: '220 10% 45%',
    accent: '210 20% 70%',
    accentForeground: '220 15% 20%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '0 0% 100%',
    success: '142 76% 36%',
    successForeground: '0 0% 100%',
    warning: '38 92% 50%',
    warningForeground: '220 15% 20%',
    info: '199 89% 48%',
    infoForeground: '0 0% 100%',
    border: '210 15% 88%',
    input: '210 15% 88%',
    ring: '220 70% 50%',
  },
  borders: {
    ...defaultLightTheme.borders,
    radius: {
      none: '0',
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.625rem',
      '2xl': '0.75rem',
      full: '9999px',
    },
  },
}

// ============================================================================
// THEME REGISTRY
// ============================================================================

export const themes = {
  'default-light': defaultLightTheme,
  'default-dark': defaultDarkTheme,
  'minimal-light': minimalLightTheme,
  'minimal-dark': minimalDarkTheme,
  'vibrant-light': vibrantLightTheme,
  'vibrant-dark': vibrantDarkTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  forest: forestTheme,
  corporate: corporateTheme,
} as const

export type ThemePresetName = keyof typeof themes

// ============================================================================
// THEME METADATA
// ============================================================================

export const themeMetadata: Record<ThemePresetName, ThemeMetadata> = {
  'default-light': {
    name: 'default-light',
    displayName: 'Default Light',
    description: 'Clean and modern light theme with blue accents',
    author: 'Clarity Chat',
    version: '1.0.0',
    preview: {
      primaryColor: '#3b82f6',
      secondaryColor: '#e5e7eb',
      backgroundColor: '#ffffff',
    },
  },
  'default-dark': {
    name: 'default-dark',
    displayName: 'Default Dark',
    description: 'Sleek dark theme with blue accents',
    author: 'Clarity Chat',
    version: '1.0.0',
    preview: {
      primaryColor: '#60a5fa',
      secondaryColor: '#1e293b',
      backgroundColor: '#0f172a',
    },
  },
  'minimal-light': {
    name: 'minimal-light',
    displayName: 'Minimal Light',
    description: 'Minimalist design with neutral tones',
    author: 'Clarity Chat',
    version: '1.0.0',
    preview: {
      primaryColor: '#1a1a1a',
      secondaryColor: '#f5f5f5',
      backgroundColor: '#ffffff',
    },
  },
  'minimal-dark': {
    name: 'minimal-dark',
    displayName: 'Minimal Dark',
    description: 'Minimalist dark theme with high contrast',
    author: 'Clarity Chat',
    version: '1.0.0',
    preview: {
      primaryColor: '#fafafa',
      secondaryColor: '#292929',
      backgroundColor: '#1a1a1a',
    },
  },
  'vibrant-light': {
    name: 'vibrant-light',
    displayName: 'Vibrant Light',
    description: 'Energetic theme with purple and pink accents',
    author: 'Clarity Chat',
    version: '1.0.0',
    preview: {
      primaryColor: '#a855f7',
      secondaryColor: '#ec4899',
      backgroundColor: '#ffffff',
    },
  },
  'vibrant-dark': {
    name: 'vibrant-dark',
    displayName: 'Vibrant Dark',
    description: 'Bold dark theme with vibrant colors',
    author: 'Clarity Chat',
    version: '1.0.0',
    preview: {
      primaryColor: '#a855f7',
      secondaryColor: '#ec4899',
      backgroundColor: '#0a0a0f',
    },
  },
  ocean: {
    name: 'ocean',
    displayName: 'Ocean',
    description: 'Refreshing theme inspired by the sea',
    author: 'Clarity Chat',
    version: '1.0.0',
    preview: {
      primaryColor: '#06b6d4',
      secondaryColor: '#22d3ee',
      backgroundColor: '#f0f9ff',
    },
  },
  sunset: {
    name: 'sunset',
    displayName: 'Sunset',
    description: 'Warm theme with orange and pink tones',
    author: 'Clarity Chat',
    version: '1.0.0',
    preview: {
      primaryColor: '#f97316',
      secondaryColor: '#ec4899',
      backgroundColor: '#fef3f2',
    },
  },
  forest: {
    name: 'forest',
    displayName: 'Forest',
    description: 'Natural theme with green tones',
    author: 'Clarity Chat',
    version: '1.0.0',
    preview: {
      primaryColor: '#16a34a',
      secondaryColor: '#84cc16',
      backgroundColor: '#f7fef7',
    },
  },
  corporate: {
    name: 'corporate',
    displayName: 'Corporate',
    description: 'Professional theme for business applications',
    author: 'Clarity Chat',
    version: '1.0.0',
    preview: {
      primaryColor: '#3b68d4',
      secondaryColor: '#94a3b8',
      backgroundColor: '#f8f9fb',
    },
  },
}
