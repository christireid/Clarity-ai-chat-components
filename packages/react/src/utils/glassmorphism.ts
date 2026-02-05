/**
 * Glassmorphism Utility
 *
 * Generates glassmorphism styles for components with various configurations.
 * Provides consistent glass effects across dashboard and feedback components.
 */

import { cn } from './cn'

export type GlassIntensity = 'subtle' | 'medium' | 'strong'
export type GlassGradient = 'blue' | 'green' | 'purple' | 'neutral' | 'none'
export type GlassBorder = 'none' | 'light' | 'medium' | 'strong'
export type GlassHover = 'none' | 'lift' | 'glow' | 'scale'
export type GlassAnimation = 'none' | 'gradient' | 'shimmer' | 'pulse'

export interface GlassmorphismConfig {
  /** Glass effect intensity */
  intensity?: GlassIntensity
  /** Gradient color theme */
  gradient?: GlassGradient
  /** Border style */
  border?: GlassBorder
  /** Hover effect */
  hover?: GlassHover
  /** Animation effect */
  animated?: GlassAnimation
  /** Additional Tailwind classes */
  className?: string
}

/**
 * Intensity configurations
 */
const INTENSITY_CONFIGS: Record<GlassIntensity, string> = {
  subtle: 'bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm',
  medium: 'bg-white/40 dark:bg-gray-900/40 backdrop-blur-md',
  strong: 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg',
}

/**
 * Gradient configurations
 */
const GRADIENT_CONFIGS: Record<GlassGradient, string> = {
  blue: 'bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10',
  green: 'bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10',
  purple: 'bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10',
  neutral: 'bg-gradient-to-br from-gray-500/5 via-transparent to-gray-500/5',
  none: '',
}

/**
 * Border configurations
 */
const BORDER_CONFIGS: Record<GlassBorder, string> = {
  none: '',
  light: 'border border-white/10 dark:border-gray-700/30',
  medium: 'border border-white/20 dark:border-gray-700/40',
  strong: 'border-2 border-white/30 dark:border-gray-700/50',
}

/**
 * Hover effect configurations
 */
const HOVER_CONFIGS: Record<GlassHover, string> = {
  none: '',
  lift: 'hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300',
  glow: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-shadow duration-300',
  scale: 'hover:scale-[1.02] transition-transform duration-300',
}

/**
 * Animation configurations
 */
const ANIMATION_CONFIGS: Record<GlassAnimation, string> = {
  none: '',
  gradient:
    'animate-gradient bg-[length:200%_200%] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10',
  shimmer:
    'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-shimmer',
  pulse: 'animate-pulse-subtle',
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<Omit<GlassmorphismConfig, 'className'>> = {
  intensity: 'medium',
  gradient: 'none',
  border: 'light',
  hover: 'none',
  animated: 'none',
}

/**
 * Generate glassmorphism class names
 *
 * @param config - Glassmorphism configuration
 * @returns Combined class name string
 *
 * @example
 * ```tsx
 * <div className={glass({ intensity: 'medium', gradient: 'blue', border: 'light', hover: 'lift' })}>
 *   Content
 * </div>
 * ```
 */
export function glass(config: GlassmorphismConfig = {}): string {
  const {
    intensity = DEFAULT_CONFIG.intensity,
    gradient = DEFAULT_CONFIG.gradient,
    border = DEFAULT_CONFIG.border,
    hover = DEFAULT_CONFIG.hover,
    animated = DEFAULT_CONFIG.animated,
    className,
  } = config

  return cn(
    // Base glass effect
    'rounded-xl shadow-xl',
    INTENSITY_CONFIGS[intensity],

    // Gradient overlay
    gradient !== 'none' && GRADIENT_CONFIGS[gradient],

    // Border
    BORDER_CONFIGS[border],

    // Hover effects
    HOVER_CONFIGS[hover],

    // Animations
    ANIMATION_CONFIGS[animated],

    // Custom classes
    className
  )
}

/**
 * Preset configurations for common use cases
 */
export const GLASS_PRESETS = {
  dashboardCard: {
    intensity: 'medium' as GlassIntensity,
    gradient: 'blue' as GlassGradient,
    border: 'light' as GlassBorder,
    hover: 'lift' as GlassHover,
  },
  metricsPanel: {
    intensity: 'medium' as GlassIntensity,
    gradient: 'green' as GlassGradient,
    animated: 'gradient' as GlassAnimation,
  },
  chart: {
    intensity: 'subtle' as GlassIntensity,
    border: 'light' as GlassBorder,
  },
  feedbackPanel: {
    intensity: 'medium' as GlassIntensity,
    gradient: 'neutral' as GlassGradient,
    border: 'light' as GlassBorder,
    hover: 'glow' as GlassHover,
  },
  statsCard: {
    intensity: 'medium' as GlassIntensity,
    gradient: 'blue' as GlassGradient,
    border: 'light' as GlassBorder,
    hover: 'lift' as GlassHover,
  },
} as const

/**
 * Apply glassmorphism to a component
 *
 * Helper function to easily apply glass effects with presets
 *
 * @example
 * ```tsx
 * <div className={applyGlass('dashboardCard')}>
 *   Dashboard content
 * </div>
 * ```
 */
export function applyGlass(
  preset: keyof typeof GLASS_PRESETS,
  overrides?: GlassmorphismConfig
): string {
  return glass({ ...GLASS_PRESETS[preset], ...overrides })
}
