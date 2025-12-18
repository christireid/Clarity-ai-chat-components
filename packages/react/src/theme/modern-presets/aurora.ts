/**
 * Aurora Theme Preset
 * 
 * Dynamic, flowing gradient themes inspired by natural aurora phenomena.
 * Perfect for AI chat interfaces that need immersive, captivating visuals.
 */

import type { CompleteThemeConfig, ThemeMetadata } from '../theme-config'
import { createPreset } from './base'

/**
 * Aurora light theme
 * Bright, flowing gradients with dawn-inspired colors
 */
export const auroraLightTheme: CompleteThemeConfig = {
  name: 'aurora-light',
  displayName: 'Aurora Light',
  mode: 'light',
  
  colors: {
    // Aurora-inspired base colors
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    foreground: '222 47% 11%',
    
    // Flowing aurora surfaces
    card: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
    cardForeground: '222 47% 11%',
    popover: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
    popoverForeground: '222 47% 11%',
    
    // Aurora primary gradients
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryForeground: '0 0% 100%',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    secondaryForeground: '0 0% 100%',
    accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    accentForeground: '0 0% 100%',
    
    // State colors with aurora gradients
    destructive: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    destructiveForeground: '0 0% 100%',
    success: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
    successForeground: '0 0% 100%',
    warning: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
    warningForeground: '222 47% 11%',
    info: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
    infoForeground: '0 0% 100%',
    
    // Aurora UI colors
    muted: '240 5% 75%',
    mutedForeground: '240 4% 56%',
    border: '240 6% 85%',
    input: '0 0% 100%',
    ring: '221 83% 53%',
    
    // Extended aurora surfaces
    surfaceMuted: 'linear-gradient(135deg, #f8f9ff 0%, #e8eeff 100%)',
    surfaceElevated: 'linear-gradient(135deg, #ffffff 0%, #f5f7ff 100%)',
    surfaceOverlay: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
  },
  
  spacing: {
    scale: 'rem',
    base: 0.25,
    ratio: 1.618, // Golden ratio
    unit: 'rem',
  },
  
  radius: {
    none: '0',
    sm: '0.5rem',
    DEFAULT: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 2px 4px 0 rgba(102, 126, 234, 0.1)',
    DEFAULT: '0 8px 25px -5px rgba(102, 126, 234, 0.15), 0 4px 10px -3px rgba(102, 126, 234, 0.1)',
    md: '0 15px 35px -8px rgba(102, 126, 234, 0.2), 0 6px 15px -5px rgba(102, 126, 234, 0.1)',
    lg: '0 25px 50px -12px rgba(102, 126, 234, 0.25), 0 15px 30px -8px rgba(102, 126, 234, 0.15)',
    xl: '0 35px 60px -15px rgba(102, 126, 234, 0.3)',
    '2xl': '0 45px 80px -20px rgba(102, 126, 234, 0.35)',
    inner: 'inset 0 4px 8px 0 rgba(102, 126, 234, 0.1)',
    aurora: '0 20px 40px -10px rgba(102, 126, 234, 0.3), 0 10px 20px -5px rgba(240, 147, 251, 0.2)',
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
      fast: '200ms',
      normal: '400ms',
      slow: '600ms',
      slower: '1000ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      aurora: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      flow: 'cubic-bezier(0.65, 0, 0.35, 1)',
    },
  },
  
  components: {
    button: {
      padding: '0.875rem 1.75rem',
      borderRadius: '0.75rem',
      fontWeight: 600,
      boxShadow: '0 8px 25px -5px rgba(102, 126, 234, 0.15)',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    input: {
      padding: '0.875rem 1.25rem',
      borderRadius: '0.75rem',
      border: '2px solid transparent',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
      backgroundClip: 'padding-box',
      position: 'relative',
    },
    card: {
      padding: '2rem',
      borderRadius: '1.25rem',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
      boxShadow: '0 25px 50px -12px rgba(102, 126, 234, 0.25)',
      border: '1px solid rgba(102, 126, 234, 0.1)',
    },
    message: {
      borderRadius: '1.25rem',
      padding: '1rem 1.25rem',
      maxWidth: '80%',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 255, 0.9) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(102, 126, 234, 0.2)',
      boxShadow: '0 8px 25px -5px rgba(102, 126, 234, 0.15)',
    },
  },
  
  custom: {
    aurora: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overlay: 'radial-gradient(ellipse at top, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
      glow: '0 20px 40px -10px rgba(102, 126, 234, 0.3)',
      flow: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe)',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      tertiary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      quaternary: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      quinary: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    animated: {
      background: 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
      backgroundSize: '400% 400%',
      animation: 'aurora 15s ease infinite',
    },
  },
}

/**
 * Aurora dark theme
 * Deep, flowing gradients with midnight-inspired colors
 */
export const auroraDarkTheme: CompleteThemeConfig = {
  name: 'aurora-dark',
  displayName: 'Aurora Dark',
  mode: 'dark',
  
  colors: {
    // Deep aurora background
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    foreground: '0 0% 95%',
    
    // Dark aurora surfaces
    card: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    cardForeground: '0 0% 95%',
    popover: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
    popoverForeground: '0 0% 95%',
    
    // Aurora primary gradients for dark mode
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryForeground: '0 0% 100%',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    secondaryForeground: '0 0% 100%',
    accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    accentForeground: '0 0% 100%',
    
    // State colors with dark aurora gradients
    destructive: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
    destructiveForeground: '0 0% 100%',
    success: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
    successForeground: '0 0% 100%',
    warning: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
    warningForeground: '0 0% 100%',
    info: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
    infoForeground: '0 0% 100%',
    
    // Aurora UI colors for dark mode
    muted: '240 5% 45%',
    mutedForeground: '240 4% 75%',
    border: '240 6% 35%',
    input: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    ring: '221 83% 64%',
    
    // Extended dark aurora surfaces
    surfaceMuted: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
    surfaceElevated: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    surfaceOverlay: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)',
  },
  
  spacing: {
    scale: 'rem',
    base: 0.25,
    ratio: 1.618, // Golden ratio
    unit: 'rem',
  },
  
  radius: {
    none: '0',
    sm: '0.5rem',
    DEFAULT: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 2px 4px 0 rgba(102, 126, 234, 0.2)',
    DEFAULT: '0 8px 25px -5px rgba(102, 126, 234, 0.25), 0 4px 10px -3px rgba(102, 126, 234, 0.15)',
    md: '0 15px 35px -8px rgba(102, 126, 234, 0.3), 0 6px 15px -5px rgba(102, 126, 234, 0.2)',
    lg: '0 25px 50px -12px rgba(102, 126, 234, 0.35), 0 15px 30px -8px rgba(102, 126, 234, 0.25)',
    xl: '0 35px 60px -15px rgba(102, 126, 234, 0.4)',
    '2xl': '0 45px 80px -20px rgba(102, 126, 234, 0.45)',
    inner: 'inset 0 4px 8px 0 rgba(102, 126, 234, 0.15)',
    aurora: '0 20px 40px -10px rgba(102, 126, 234, 0.4), 0 10px 20px -5px rgba(240, 147, 251, 0.3)',
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
      fast: '200ms',
      normal: '400ms',
      slow: '600ms',
      slower: '1000ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      aurora: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      flow: 'cubic-bezier(0.65, 0, 0.35, 1)',
    },
  },
  
  components: {
    button: {
      padding: '0.875rem 1.75rem',
      borderRadius: '0.75rem',
      fontWeight: 600,
      boxShadow: '0 8px 25px -5px rgba(102, 126, 234, 0.25)',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    input: {
      padding: '0.875rem 1.25rem',
      borderRadius: '0.75rem',
      border: '2px solid transparent',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      backgroundClip: 'padding-box',
      position: 'relative',
    },
    card: {
      padding: '2rem',
      borderRadius: '1.25rem',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      boxShadow: '0 25px 50px -12px rgba(102, 126, 234, 35%)',
      border: '1px solid rgba(102, 126, 234, 0.2)',
    },
    message: {
      borderRadius: '1.25rem',
      padding: '1rem 1.25rem',
      maxWidth: '80%',
      background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(22, 33, 62, 0.9) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(102, 126, 234, 0.3)',
      boxShadow: '0 8px 25px -5px rgba(102, 126, 234, 0.25)',
    },
  },
  
  custom: {
    aurora: {
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      overlay: 'radial-gradient(ellipse at top, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
      glow: '0 20px 40px -10px rgba(102, 126, 234, 0.4)',
      flow: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe)',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      tertiary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      quaternary: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      quinary: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    animated: {
      background: 'linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #1a1a2e)',
      backgroundSize: '400% 400%',
      animation: 'aurora 20s ease infinite',
    },
  },
}

/**
 * Aurora theme metadata
 */
export const auroraThemeMetadata: ThemeMetadata = {
  name: 'aurora',
  displayName: 'Aurora',
  description: 'Dynamic flowing gradients inspired by natural aurora phenomena',
  category: 'premium',
  tags: ['aurora', 'gradient', 'flowing', 'dynamic', 'premium', 'immersive'],
  popularity: 92,
  accessibility: {
    wcagRating: 'AA',
    contrastRatio: 6.8,
    colorBlindSafe: true,
  },
  designSystem: {
    primary: 'Flowing gradient backgrounds',
    secondary: 'Dynamic color transitions',
    accent: 'Aurora-inspired color palette',
  },
  useCases: [
    'Premium AI applications',
    'Creative platforms',
    'Modern SaaS products',
    'Entertainment apps',
    'Immersive experiences',
  ],
  features: [
    'Dynamic gradient flows',
    'Aurora-inspired colors',
    'Immersive backgrounds',
    'Premium aesthetics',
    'Smooth transitions',
  ],
  compatibility: {
    browsers: ['Chrome 70+', 'Firefox 65+', 'Safari 12+', 'Edge 79+'],
    features: ['CSS gradients', 'CSS animations', 'CSS filters', 'CSS Variables'],
  },
}

/**
 * Aurora theme preset
 */
export const auroraPreset = createPreset({
  light: auroraLightTheme,
  dark: auroraDarkTheme,
  metadata: auroraThemeMetadata,
})

// Themes are already exported with 'export const' declarations above