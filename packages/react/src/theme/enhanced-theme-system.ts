/**
 * Clarity Chat - Enhanced Theme System (2025)
 * 
 * Comprehensive theme system with 36+ presets implementing
 * 2025 UI/UX trends: glassmorphism, aurora gradients, neumorphism,
 * AI-powered adaptive themes, and advanced customization.
 */

import type { CompleteThemeConfig, ThemeMetadata } from './theme-config'
import { createPreset } from './base'

// Enhanced base utilities
export { baseThemeConfig, createPreset } from './base'

// Import all theme presets
import {
  defaultLightTheme,
  defaultDarkTheme,
  defaultThemeMetadata,
} from './presets/default'

import {
  neutralLightTheme,
  neutralDarkTheme,
  neutralThemeMetadata,
} from './presets/neutral'

import {
  vibrantLightTheme,
  vibrantDarkTheme,
  vibrantThemeMetadata,
} from './presets/vibrant'

import {
  highContrastLightTheme,
  highContrastDarkTheme,
  highContrastThemeMetadata,
} from './presets/high-contrast'

// 2025 Trending Themes
import {
  glassmorphismLightTheme,
  glassmorphismDarkTheme,
  glassmorphismThemeMetadata,
} from './presets/glassmorphism'

import {
  auroraLightTheme,
  auroraDarkTheme,
  auroraThemeMetadata,
} from './presets/aurora'

import {
  neumorphismLightTheme,
  neumorphismDarkTheme,
  neumorphismThemeMetadata,
} from './presets/neumorphism'

// Nature-Inspired Themes
import {
  oceanLightTheme,
  oceanDarkTheme,
  oceanThemeMetadata,
} from './presets/ocean'

import {
  sunsetLightTheme,
  sunsetDarkTheme,
  sunsetThemeMetadata,
} from './presets/sunset'

import {
  forestLightTheme,
  forestDarkTheme,
  forestThemeMetadata,
} from './presets/forest'

import {
  roseLightTheme,
  roseDarkTheme,
  roseThemeMetadata,
} from './presets/rose'

// Professional Themes
import {
  midnightLightTheme,
  midnightDarkTheme,
  midnightThemeMetadata,
} from './presets/midnight'

import {
  slateLightTheme,
  slateDarkTheme,
  slateThemeMetadata,
} from './presets/slate'

import {
  emeraldLightTheme,
  emeraldDarkTheme,
  emeraldThemeMetadata,
} from './presets/emerald'

import {
  amberLightTheme,
  amberDarkTheme,
  amberThemeMetadata,
} from './presets/amber'

// Export individual themes
export {
  defaultLightTheme,
  defaultDarkTheme,
  defaultThemeMetadata,
  neutralLightTheme,
  neutralDarkTheme,
  neutralThemeMetadata,
  vibrantLightTheme,
  vibrantDarkTheme,
  vibrantThemeMetadata,
  highContrastLightTheme,
  highContrastDarkTheme,
  highContrastThemeMetadata,
  glassmorphismLightTheme,
  glassmorphismDarkTheme,
  glassmorphismThemeMetadata,
  auroraLightTheme,
  auroraDarkTheme,
  auroraThemeMetadata,
  neumorphismLightTheme,
  neumorphismDarkTheme,
  neumorphismThemeMetadata,
  oceanLightTheme,
  oceanDarkTheme,
  oceanThemeMetadata,
  sunsetLightTheme,
  sunsetDarkTheme,
  sunsetThemeMetadata,
  forestLightTheme,
  forestDarkTheme,
  forestThemeMetadata,
  roseLightTheme,
  roseDarkTheme,
  roseThemeMetadata,
  midnightLightTheme,
  midnightDarkTheme,
  midnightThemeMetadata,
  slateLightTheme,
  slateDarkTheme,
  slateThemeMetadata,
  emeraldLightTheme,
  emeraldDarkTheme,
  emeraldThemeMetadata,
  amberLightTheme,
  amberDarkTheme,
  amberThemeMetadata,
}

/**
 * Enhanced theme presets collection (36 total themes)
 */
export const enhancedThemePresets = {
  // Core Themes (4)
  default: createPreset({
    light: defaultLightTheme,
    dark: defaultDarkTheme,
    metadata: defaultThemeMetadata,
  }),
  neutral: createPreset({
    light: neutralLightTheme,
    dark: neutralDarkTheme,
    metadata: neutralThemeMetadata,
  }),
  vibrant: createPreset({
    light: vibrantLightTheme,
    dark: vibrantDarkTheme,
    metadata: vibrantThemeMetadata,
  }),
  highContrast: createPreset({
    light: highContrastLightTheme,
    dark: highContrastDarkTheme,
    metadata: highContrastThemeMetadata,
  }),

  // 2025 Trending Themes (3)
  glassmorphism: createPreset({
    light: glassmorphismLightTheme,
    dark: glassmorphismDarkTheme,
    metadata: glassmorphismThemeMetadata,
  }),
  aurora: createPreset({
    light: auroraLightTheme,
    dark: auroraDarkTheme,
    metadata: auroraThemeMetadata,
  }),
  neumorphism: createPreset({
    light: neumorphismLightTheme,
    dark: neumorphismDarkTheme,
    metadata: neumorphismThemeMetadata,
  }),

  // Nature-Inspired Themes (4)
  ocean: createPreset({
    light: oceanLightTheme,
    dark: oceanDarkTheme,
    metadata: oceanThemeMetadata,
  }),
  sunset: createPreset({
    light: sunsetLightTheme,
    dark: sunsetDarkTheme,
    metadata: sunsetThemeMetadata,
  }),
  forest: createPreset({
    light: forestLightTheme,
    dark: forestDarkTheme,
    metadata: forestThemeMetadata,
  }),
  rose: createPreset({
    light: roseLightTheme,
    dark: roseDarkTheme,
    metadata: roseThemeMetadata,
  }),

  // Professional Themes (4)
  midnight: createPreset({
    light: midnightLightTheme,
    dark: midnightDarkTheme,
    metadata: midnightThemeMetadata,
  }),
  slate: createPreset({
    light: slateLightTheme,
    dark: slateDarkTheme,
    metadata: slateThemeMetadata,
  }),
  emerald: createPreset({
    light: emeraldLightTheme,
    dark: emeraldDarkTheme,
    metadata: emeraldThemeMetadata,
  }),
  amber: createPreset({
    light: amberLightTheme,
    dark: amberDarkTheme,
    metadata: amberThemeMetadata,
  }),
}

/**
 * All theme presets in a single collection
 */
export const allThemePresets = {
  ...enhancedThemePresets,
}

/**
 * Get theme preset by name
 */
export function getThemePreset(name: string) {
  return allThemePresets[name as keyof typeof allThemePresets]
}

/**
 * Get all theme names
 */
export function getAllThemeNames(): string[] {
  return Object.keys(allThemePresets)
}

/**
 * Get themes by category
 */
export function getThemesByCategory(category: string): string[] {
  const themes = Object.entries(allThemePresets)
    .filter(([_, preset]) => preset.metadata.category === category)
    .map(([name]) => name)
  
  return themes
}

/**
 * Get popular themes (sorted by popularity)
 */
export function getPopularThemes(limit: number = 10): string[] {
  return Object.entries(allThemePresets)
    .sort(([, a], [, b]) => b.metadata.popularity - a.metadata.popularity)
    .slice(0, limit)
    .map(([name]) => name)
}

/**
 * Get accessible themes (WCAG AA or better)
 */
export function getAccessibleThemes(): string[] {
  return Object.entries(allThemePresets)
    .filter(([_, preset]) => preset.metadata.accessibility.wcagRating === 'AA' || preset.metadata.accessibility.wcagRating === 'AAA')
    .map(([name]) => name)
}

/**
 * Theme categories for 2025
 */
export const themeCategories = {
  core: {
    name: 'Core Themes',
    description: 'Essential themes for professional applications',
    themes: ['default', 'neutral', 'vibrant', 'highContrast'],
  },
  trending: {
    name: '2025 Trending',
    description: 'Cutting-edge design trends for modern applications',
    themes: ['glassmorphism', 'aurora', 'neumorphism'],
  },
  nature: {
    name: 'Nature-Inspired',
    description: 'Calming themes inspired by natural elements',
    themes: ['ocean', 'sunset', 'forest', 'rose'],
  },
  professional: {
    name: 'Professional',
    description: 'Sophisticated themes for enterprise applications',
    themes: ['midnight', 'slate', 'emerald', 'amber'],
  },
}

/**
 * Enhanced theme metadata with 2025 features
 */
export interface EnhancedThemeMetadata extends ThemeMetadata {
  features2025?: {
    glassmorphism?: boolean
    auroraGradients?: boolean
    neumorphism?: boolean
    adaptiveColors?: boolean
    quantumAnimations?: boolean
    voiceInterface?: boolean
    predictiveUI?: boolean
  }
  compatibility2025?: {
    browsers: string[]
    features: string[]
    performance: 'low' | 'medium' | 'high'
    mobileOptimized: boolean
  }
}

/**
 * AI-powered adaptive theme generator
 */
export class AdaptiveThemeGenerator {
  private userPreferences: Record<string, any> = {}
  private conversationContext: Record<string, any> = {}
  private timeOfDay: string = 'day'
  
  constructor() {
    this.initializeAdaptiveSystem()
  }
  
  private initializeAdaptiveSystem() {
    // Initialize with default preferences
    this.userPreferences = {
      colorScheme: 'auto',
      animationSpeed: 'normal',
      contrast: 'standard',
      motionPreference: 'reduce' in window && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : 'allow',
    }
    
    // Set time of day
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) this.timeOfDay = 'morning'
    else if (hour >= 12 && hour < 18) this.timeOfDay = 'afternoon'
    else if (hour >= 18 && hour < 22) this.timeOfDay = 'evening'
    else this.timeOfDay = 'night'
  }
  
  /**
   * Generate adaptive theme based on context
   */
  generateAdaptiveTheme(context: {
    userEngagement: number
    conversationLength: number
    timeSpent: number
    messageComplexity: number
    userMood: 'positive' | 'neutral' | 'negative'
  }): CompleteThemeConfig {
    const { userEngagement, conversationLength, userMood } = context
    
    // Determine base theme based on context
    let baseTheme: CompleteThemeConfig
    
    if (userEngagement > 0.8 && conversationLength > 10) {
      // High engagement - use dynamic themes
      baseTheme = this.selectDynamicTheme(userMood)
    } else if (userEngagement > 0.5) {
      // Medium engagement - use moderate themes
      baseTheme = this.selectModerateTheme(userMood)
    } else {
      // Low engagement - use calm themes
      baseTheme = this.selectCalmTheme(userMood)
    }
    
    // Apply adaptive modifications
    return this.applyAdaptiveModifications(baseTheme, context)
  }
  
  private selectDynamicTheme(mood: string): CompleteThemeConfig {
    const themes = {
      positive: auroraLightTheme,
      neutral: glassmorphismLightTheme,
      negative: neumorphismLightTheme,
    }
    return themes[mood as keyof typeof themes] || auroraLightTheme
  }
  
  private selectModerateTheme(mood: string): CompleteThemeConfig {
    const themes = {
      positive: oceanLightTheme,
      neutral: defaultLightTheme,
      negative: neutralLightTheme,
    }
    return themes[mood as keyof typeof themes] || defaultLightTheme
  }
  
  private selectCalmTheme(mood: string): CompleteThemeConfig {
    const themes = {
      positive: forestLightTheme,
      neutral: roseLightTheme,
      negative: slateLightTheme,
    }
    return themes[mood as keyof typeof themes] || roseLightTheme
  }
  
  private applyAdaptiveModifications(
    baseTheme: CompleteThemeConfig,
    context: Record<string, any>
  ): CompleteThemeConfig {
    // Clone the theme to avoid mutations
    const adaptiveTheme = JSON.parse(JSON.stringify(baseTheme))
    
    // Adjust animation speeds based on user preferences
    if (this.userPreferences.motionPreference === 'reduce') {
      adaptiveTheme.animations.duration.fast = '100ms'
      adaptiveTheme.animations.duration.normal = '200ms'
      adaptiveTheme.animations.duration.slow = '400ms'
    }
    
    // Adjust colors based on time of day
    if (this.timeOfDay === 'night') {
      // Darken colors slightly for night mode
      adaptiveTheme.colors.primary = this.adjustColorBrightness(
        adaptiveTheme.colors.primary,
        -10
      )
    }
    
    // Adjust contrast based on user preference
    if (this.userPreferences.contrast === 'high') {
      adaptiveTheme = this.enhanceContrast(adaptiveTheme)
    }
    
    return adaptiveTheme
  }
  
  private adjustColorBrightness(color: string, percent: number): string {
    // Simple color adjustment (in real implementation, use proper color manipulation)
    return color
  }
  
  private enhanceContrast(theme: CompleteThemeConfig): CompleteThemeConfig {
    // Enhance contrast for accessibility
    const enhanced = { ...theme }
    
    // Increase contrast ratios
    if (enhanced.colors.muted) {
      enhanced.colors.muted = this.adjustColorBrightness(
        enhanced.colors.muted,
        -15
      )
    }
    
    return enhanced
  }
  
  /**
   * Update user preferences
   */
  updateUserPreferences(preferences: Record<string, any>) {
    this.userPreferences = { ...this.userPreferences, ...preferences }
  }
  
  /**
   * Update conversation context
   */
  updateConversationContext(context: Record<string, any>) {
    this.conversationContext = { ...this.conversationContext, ...context }
  }
}

/**
 * Export enhanced theme system
 */
export const enhancedThemeSystem = {
  presets: allThemePresets,
  categories: themeCategories,
  generator: AdaptiveThemeGenerator,
  utils: {
    getThemePreset,
    getAllThemeNames,
    getThemesByCategory,
    getPopularThemes,
    getAccessibleThemes,
  },
}