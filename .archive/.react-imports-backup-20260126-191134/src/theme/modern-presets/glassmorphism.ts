/**
 * Glassmorphism Theme Preset
 *
 * Modern glassmorphism design with frosted glass effects,
 * transparency, and depth. Perfect for AI chat interfaces
 * that need a sophisticated, premium feel.
 */

import type { CompleteThemeConfig, ThemeMetadata } from '../theme-config'
import { createPreset } from './base'

/**
 * Glassmorphism light theme
 * Clean, transparent interface with glass effects
 */
export const glassmorphismLightTheme = {
  name: 'glassmorphism-light',
  displayName: 'Glass Light',
  mode: 'light',

  colors: {
    // Base glass colors
    background: '0 0% 100%',
    foreground: '222 47% 11%',

    // Glass surfaces
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',

    // Primary with glass effect
    primary: '221 83% 53%',
    primaryForeground: '0 0% 100%',
    secondary: '240 5% 96%',
    secondaryForeground: '222 47% 11%',
    accent: '221 83% 53%',
    accentForeground: '0 0% 100%',

    // State colors with subtle glass
    destructive: '0 84% 60%',
    destructiveForeground: '0 0% 100%',
    success: '142 71% 45%',
    successForeground: '0 0% 100%',
    warning: '35 91% 65%',
    warningForeground: '222 47% 11%',
    info: '221 83% 53%',
    infoForeground: '0 0% 100%',

    // Glass UI colors
    muted: '240 5% 65%',
    mutedForeground: '240 4% 46%',
    border: '240 6% 90%',
    input: '0 0% 100%',
    ring: '221 83% 53%',

    // Extended glass surfaces
    surfaceMuted: '240 5% 98%',
    surfaceElevated: '0 0% 100%',
    surfaceOverlay: '0 0% 100%',
  },

  spacing: {
    scale: 'rem',
    base: 0.25,
    ratio: 1.5,
    unit: 'rem',
  },

  radius: {
    none: '0',
    sm: '0.375rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  animations: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      glass: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },

  components: {
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: 500,
      boxShadow: '0 4px 6px -1px oklch(0% 0% 0 / 0.1)',
      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    input: {
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      border: '1px solid oklch(92% 0.01 240 / 0.2)',
      background: 'oklch(97% 0.015 240 / 0.5)',
      backdropFilter: 'blur(10px) saturate(150%)',
    },
    card: {
      padding: '1.5rem',
      borderRadius: '1rem',
      background: 'oklch(97% 0.015 240 / 0.6)',
      backdropFilter: 'blur(20px) saturate(150%)',
      border: '1px solid oklch(92% 0.01 240 / 0.2)',
      boxShadow: '0 8px 32px oklch(0% 0% 0 / 0.1)',
    },
    message: {
      borderRadius: '1rem',
      padding: '0.75rem 1rem',
      maxWidth: '80%',
      backdropFilter: 'blur(10px) saturate(150%)',
      border: '1px solid oklch(92% 0.01 240 / 0.2)',
    },
  },

  custom: {
    glass: {
      background: 'oklch(97% 0.015 240 / 0.6)',
      backdropFilter: 'blur(20px) saturate(150%)',
      border: '1px solid oklch(92% 0.01 240 / 0.2)',
      boxShadow: '0 8px 32px oklch(0% 0% 0 / 0.1)',
    },
    glassHover: {
      background: 'oklch(97% 0.015 240 / 0.7)',
      backdropFilter: 'blur(25px) saturate(150%)',
      border: '1px solid oklch(92% 0.01 240 / 0.3)',
      boxShadow: '0 12px 40px oklch(0% 0% 0 / 0.15)',
    },
    glassActive: {
      background: 'oklch(97% 0.015 240 / 0.5)',
      backdropFilter: 'blur(15px) saturate(150%)',
      border: '1px solid oklch(92% 0.01 240 / 0.15)',
    },
    pastelGradients: {
      blue: 'linear-gradient(135deg, oklch(95% 0.02 240) 0%, oklch(97% 0.015 260) 100%)',
      purple: 'linear-gradient(135deg, oklch(95% 0.025 280) 0%, oklch(97% 0.02 300) 100%)',
      pink: 'linear-gradient(135deg, oklch(96% 0.03 350) 0%, oklch(98% 0.02 340) 100%)',
      green: 'linear-gradient(135deg, oklch(95% 0.03 160) 0%, oklch(97% 0.02 140) 100%)',
      amber: 'linear-gradient(135deg, oklch(96% 0.04 80) 0%, oklch(98% 0.025 70) 100%)',
    },
  },
}

/**
 * Glassmorphism dark theme
 * Deep, sophisticated dark theme with glass effects
 */
export const glassmorphismDarkTheme = {
  name: 'glassmorphism-dark',
  displayName: 'Glass Dark',
  mode: 'dark',

  colors: {
    // Deep glass background
    background: '222 47% 11%',
    foreground: '0 0% 95%',

    // Dark glass surfaces
    card: '222 35% 15%',
    cardForeground: '0 0% 95%',
    popover: '222 25% 20%',
    popoverForeground: '0 0% 95%',

    // Primary with enhanced contrast
    primary: '221 83% 64%',
    primaryForeground: '0 0% 100%',
    secondary: '240 5% 20%',
    secondaryForeground: '0 0% 95%',
    accent: '221 83% 64%',
    accentForeground: '0 0% 100%',

    // State colors with enhanced visibility
    destructive: '0 84% 70%',
    destructiveForeground: '0 0% 100%',
    success: '142 71% 55%',
    successForeground: '0 0% 100%',
    warning: '35 91% 75%',
    warningForeground: '222 47% 11%',
    info: '221 83% 64%',
    infoForeground: '0 0% 100%',

    // Glass UI colors for dark mode
    muted: '240 5% 35%',
    mutedForeground: '240 4% 65%',
    border: '240 6% 25%',
    input: '222 47% 15%',
    ring: '221 83% 64%',

    // Extended dark glass surfaces
    surfaceMuted: '222 25% 18%',
    surfaceElevated: '222 35% 20%',
    surfaceOverlay: '222 15% 25%',
  },

  spacing: {
    scale: 'rem',
    base: 0.25,
    ratio: 1.5,
    unit: 'rem',
  },

  radius: {
    none: '0',
    sm: '0.375rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    DEFAULT:
      '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.6)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  animations: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      glass: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },

  components: {
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: 500,
      boxShadow: '0 4px 6px -1px oklch(0% 0% 0 / 0.4)',
      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    input: {
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      border: '1px solid oklch(30% 0.02 240 / 0.2)',
      background: 'oklch(18% 0.02 240 / 0.5)',
      backdropFilter: 'blur(10px) saturate(150%)',
    },
    card: {
      padding: '1.5rem',
      borderRadius: '1rem',
      background: 'oklch(18% 0.02 240 / 0.6)',
      backdropFilter: 'blur(20px) saturate(150%)',
      border: '1px solid oklch(30% 0.02 240 / 0.2)',
      boxShadow: '0 8px 32px oklch(0% 0% 0 / 0.4)',
    },
    message: {
      borderRadius: '1rem',
      padding: '0.75rem 1rem',
      maxWidth: '80%',
      backdropFilter: 'blur(10px) saturate(150%)',
      border: '1px solid oklch(30% 0.02 240 / 0.2)',
    },
  },

  custom: {
    glass: {
      background: 'oklch(18% 0.02 240 / 0.6)',
      backdropFilter: 'blur(20px) saturate(150%)',
      border: '1px solid oklch(30% 0.02 240 / 0.2)',
      boxShadow: '0 8px 32px oklch(0% 0% 0 / 0.4)',
    },
    glassHover: {
      background: 'oklch(20% 0.025 240 / 0.7)',
      backdropFilter: 'blur(25px) saturate(150%)',
      border: '1px solid oklch(35% 0.025 240 / 0.3)',
      boxShadow: '0 12px 40px oklch(0% 0% 0 / 0.5)',
    },
    glassActive: {
      background: 'oklch(16% 0.018 240 / 0.5)',
      backdropFilter: 'blur(15px) saturate(150%)',
      border: '1px solid oklch(28% 0.018 240 / 0.15)',
    },
    pastelGradients: {
      blue: 'linear-gradient(135deg, oklch(18% 0.04 240) 0%, oklch(20% 0.035 260) 100%)',
      purple: 'linear-gradient(135deg, oklch(18% 0.045 280) 0%, oklch(20% 0.04 300) 100%)',
      pink: 'linear-gradient(135deg, oklch(19% 0.05 350) 0%, oklch(21% 0.04 340) 100%)',
      green: 'linear-gradient(135deg, oklch(18% 0.05 160) 0%, oklch(20% 0.04 140) 100%)',
      amber: 'linear-gradient(135deg, oklch(19% 0.06 80) 0%, oklch(21% 0.045 70) 100%)',
    },
  },
}

/**
 * Glassmorphism theme metadata
 */
export const glassmorphismThemeMetadata: ThemeMetadata = {
  name: 'glassmorphism',
  displayName: 'Glassmorphism',
  description:
    'Modern glass design with frosted glass effects and transparency',
  category: 'modern',
  tags: ['glass', 'transparent', 'frosted', 'modern', 'premium'],
  popularity: 95,
  accessibility: {
    wcagRating: 'AA',
    contrastRatio: 7.1,
    colorBlindSafe: true,
  },
  designSystem: {
    primary: 'Glass effects with backdrop filters',
    secondary: 'Subtle transparency and depth',
    accent: 'Frosted glass overlays',
  },
  useCases: [
    'Premium applications',
    'Modern SaaS platforms',
    'AI-powered interfaces',
    'Creative applications',
    'Enterprise dashboards',
  ],
  features: [
    'Frosted glass effects',
    'Backdrop filter blur',
    'Subtle transparency',
    'Modern aesthetics',
    'Premium feel',
  ],
  compatibility: {
    browsers: ['Chrome 76+', 'Firefox 70+', 'Safari 14+', 'Edge 79+'],
    features: ['backdrop-filter', 'CSS filters', 'CSS Grid', 'CSS Variables'],
  },
}

/**
 * Glassmorphism theme preset
 */
export const glassmorphismPreset = createPreset({
  light: glassmorphismLightTheme,
  dark: glassmorphismDarkTheme,
  metadata: glassmorphismThemeMetadata,
})

// Themes are already exported with 'export const' declarations above
