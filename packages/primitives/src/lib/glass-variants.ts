/**
 * Glassmorphism Variant System
 *
 * Type-safe glass effect variants using Class Variance Authority (CVA).
 * Provides a shadcn/ui-like API for applying sophisticated glassmorphism
 * with OKLCH-based pastel gradients to components.
 *
 * @example
 * ```tsx
 * import { glassVariants } from '@clarity-chat/primitives/glass-variants'
 *
 * <div className={glassVariants({
 *   intensity: 'medium',
 *   gradient: 'blue',
 *   animated: 'gradient',
 *   hover: 'lift'
 * })}>
 *   Premium glass card
 * </div>
 * ```
 *
 * @packageDocumentation
 */

import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Core glassmorphism variant system
 *
 * Creates type-safe glass effect variants following shadcn/ui patterns.
 * Combines backdrop blur, OKLCH gradients, and sophisticated animations.
 */
export const glassVariants = cva(
  [
    // Base glass structure
    'relative overflow-hidden',
    'backdrop-blur-md',
    'border border-glass-light dark:border-glass-dark-light',
    'shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
    'transition-all duration-300 ease-smooth',
  ],
  {
    variants: {
      /**
       * Glass intensity level
       * Controls opacity and blur amount for different visual weights
       */
      intensity: {
        subtle: [
          'backdrop-blur-sm backdrop-saturate-150',
          'bg-white/40 dark:bg-background/40',
        ],
        medium: [
          'backdrop-blur-md backdrop-saturate-150',
          'bg-white/60 dark:bg-background/60',
        ],
        strong: [
          'backdrop-blur-lg backdrop-saturate-200',
          'bg-white/80 dark:bg-background/80',
        ],
      },

      /**
       * Pastel gradient overlay
       * OKLCH-based gradients for sophisticated color transitions
       */
      gradient: {
        none: '',
        blue: 'bg-glass-pastel-blue dark:bg-glass-pastel-blue-dark',
        purple: 'bg-glass-pastel-purple dark:bg-glass-pastel-purple-dark',
        pink: 'bg-glass-pastel-pink dark:bg-glass-pastel-pink-dark',
        green: 'bg-glass-pastel-green dark:bg-glass-pastel-green-dark',
        amber: 'bg-glass-pastel-amber dark:bg-glass-pastel-amber-dark',
      },

      /**
       * Border styling
       * OKLCH-based borders with alpha transparency
       */
      border: {
        none: 'border-0',
        light: 'border border-glass-light dark:border-glass-dark-light',
        medium: 'border-2 border-glass-medium dark:border-glass-dark-medium',
        strong: 'border-2 border-glass-strong dark:border-glass-dark-strong',
      },

      /**
       * Animation effects
       * Subtle, premium animations (respects prefers-reduced-motion)
       */
      animated: {
        none: '',
        gradient: 'glass-animated',
        glow: 'glass-glow',
        both: 'glass-animated glass-glow',
      },

      /**
       * Hover interactions
       * Micro-interactions for enhanced tactility
       */
      hover: {
        none: '',
        lift: 'hover:-translate-y-0.5 hover:shadow-lg transition-transform',
        glow: 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]',
        brighten: 'hover:bg-white/70 dark:hover:bg-background/70',
      },
    },

    /**
     * Compound variants for specialized combinations
     * Uses intensity-specific gradient utilities with opacity baked into OKLCH
     */
    compoundVariants: [
      // Subtle intensity + gradient combinations (40% opacity)
      {
        intensity: 'subtle',
        gradient: 'blue',
        className: 'bg-glass-pastel-blue-subtle dark:bg-glass-pastel-blue-dark-subtle',
      },
      {
        intensity: 'subtle',
        gradient: 'purple',
        className: 'bg-glass-pastel-purple-subtle dark:bg-glass-pastel-purple-dark-subtle',
      },
      {
        intensity: 'subtle',
        gradient: 'pink',
        className: 'bg-glass-pastel-pink-subtle dark:bg-glass-pastel-pink-dark-subtle',
      },
      {
        intensity: 'subtle',
        gradient: 'green',
        className: 'bg-glass-pastel-green-subtle dark:bg-glass-pastel-green-dark-subtle',
      },
      {
        intensity: 'subtle',
        gradient: 'amber',
        className: 'bg-glass-pastel-amber-subtle dark:bg-glass-pastel-amber-dark-subtle',
      },

      // Medium intensity + gradient combinations (60% opacity)
      {
        intensity: 'medium',
        gradient: 'blue',
        className: 'bg-glass-pastel-blue-medium dark:bg-glass-pastel-blue-dark-medium',
      },
      {
        intensity: 'medium',
        gradient: 'purple',
        className: 'bg-glass-pastel-purple-medium dark:bg-glass-pastel-purple-dark-medium',
      },
      {
        intensity: 'medium',
        gradient: 'pink',
        className: 'bg-glass-pastel-pink-medium dark:bg-glass-pastel-pink-dark-medium',
      },
      {
        intensity: 'medium',
        gradient: 'green',
        className: 'bg-glass-pastel-green-medium dark:bg-glass-pastel-green-dark-medium',
      },
      {
        intensity: 'medium',
        gradient: 'amber',
        className: 'bg-glass-pastel-amber-medium dark:bg-glass-pastel-amber-dark-medium',
      },

      // Strong intensity + gradient combinations (80% opacity)
      {
        intensity: 'strong',
        gradient: 'blue',
        className: 'bg-glass-pastel-blue-strong dark:bg-glass-pastel-blue-dark-strong',
      },
      {
        intensity: 'strong',
        gradient: 'purple',
        className: 'bg-glass-pastel-purple-strong dark:bg-glass-pastel-purple-dark-strong',
      },
      {
        intensity: 'strong',
        gradient: 'pink',
        className: 'bg-glass-pastel-pink-strong dark:bg-glass-pastel-pink-dark-strong',
      },
      {
        intensity: 'strong',
        gradient: 'green',
        className: 'bg-glass-pastel-green-strong dark:bg-glass-pastel-green-dark-strong',
      },
      {
        intensity: 'strong',
        gradient: 'amber',
        className: 'bg-glass-pastel-amber-strong dark:bg-glass-pastel-amber-dark-strong',
      },
    ],

    defaultVariants: {
      intensity: 'medium',
      gradient: 'none',
      border: 'light',
      animated: 'none',
      hover: 'none',
    },
  }
)

/**
 * Type helper for glass variant props
 *
 * Use this type when extending component props with glass variants
 *
 * @example
 * ```tsx
 * interface MyComponentProps extends GlassVariants {
 *   children: React.ReactNode
 * }
 * ```
 */
export type GlassVariants = VariantProps<typeof glassVariants>

/**
 * Glass button variant extension
 *
 * Extends existing button variants with glass effect option.
 * Use this in combination with base button variants.
 *
 * @example
 * ```tsx
 * import { buttonVariants } from './button'
 * import { glassButtonVariants } from './glass-variants'
 *
 * <button className={cn(
 *   buttonVariants({ variant: 'default' }),
 *   glassButtonVariants({ glass: true })
 * )}>
 *   Glass button
 * </button>
 * ```
 */
export const glassButtonVariants = cva([], {
  variants: {
    glass: {
      true: [
        'backdrop-blur-md backdrop-saturate-150',
        'bg-white/60 dark:bg-background/60',
        'border border-glass-light dark:border-glass-dark-light',
        'hover:bg-white/70 dark:hover:bg-background/70',
        'hover:shadow-lg',
        'transition-all duration-200',
      ],
      false: '',
    },
  },
  defaultVariants: {
    glass: false,
  },
})

/**
 * Type helper for glass button variant props
 */
export type GlassButtonVariants = VariantProps<typeof glassButtonVariants>

/**
 * Gradient color mapping for semantic usage
 *
 * Use this to maintain consistent gradient-to-purpose mappings
 * across the application.
 */
export const GRADIENT_SEMANTIC_MAP = {
  /** Token counts, analytics, informational data */
  analytics: 'blue',
  /** Savings, positive metrics, success states */
  success: 'green',
  /** Premium features, enhanced capabilities */
  premium: 'purple',
  /** Highlights, special states, attention */
  highlight: 'pink',
  /** Warnings, cache stats, moderate alerts */
  warning: 'amber',
} as const

/**
 * Get semantic gradient color
 *
 * @param semantic - Semantic purpose of the gradient
 * @returns Gradient color name for glassVariants
 *
 * @example
 * ```tsx
 * <div className={glassVariants({
 *   gradient: getSemanticGradient('success')
 * })}>
 *   90% cost savings!
 * </div>
 * ```
 */
export function getSemanticGradient(
  semantic: keyof typeof GRADIENT_SEMANTIC_MAP
): NonNullable<GlassVariants['gradient']> {
  return GRADIENT_SEMANTIC_MAP[semantic] as NonNullable<
    GlassVariants['gradient']
  >
}
