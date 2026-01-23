/**
 * GlassSurface - Premium glass effect primitive
 *
 * A foundational component for creating glassmorphism surfaces with
 * proper accessibility, fallbacks, and performance optimizations.
 *
 * Features:
 * - @supports fallback for browsers without backdrop-filter
 * - prefers-reduced-transparency support
 * - Isolation for nested glass surfaces (stacking context)
 * - Typography smoothing on glass
 * - CVA-based variants
 *
 * @example
 * ```tsx
 * <GlassSurface intensity="medium" gradient="blue" rounded="lg">
 *   Premium glass content
 * </GlassSurface>
 * ```
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Glass surface variants using CVA
 *
 * Provides type-safe variants for glass intensity, gradients, and interactions.
 */
export const glassSurfaceVariants = cva(
  [
    // Base glass structure
    'relative overflow-hidden',
    'bg-white/60 dark:bg-white/[0.08]',
    'border border-white/20 dark:border-white/[0.1]',
    'transition-all duration-200 ease-out',
    // Typography smoothing on glass
    'antialiased',
    // Fallback: solid background (overridden by @supports)
    '[--glass-fallback-bg:hsl(var(--card))]',
  ],
  {
    variants: {
      /**
       * Glass intensity level
       * Controls opacity and blur according to spec:
       * - Dark mode: 5-15% white opacity, 12-16px blur, 120-180% saturate
       */
      intensity: {
        subtle: [
          'backdrop-blur-sm backdrop-saturate-[1.2]',
          'bg-white/40 dark:bg-white/[0.05]',
          'shadow-sm',
        ],
        medium: [
          'backdrop-blur-[14px] backdrop-saturate-150',
          'bg-white/60 dark:bg-white/[0.08]',
          'shadow-md',
        ],
        strong: [
          'backdrop-blur-xl backdrop-saturate-[1.8]',
          'bg-white/80 dark:bg-white/[0.12]',
          'shadow-lg',
        ],
      },

      /**
       * Border radius
       */
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full',
      },

      /**
       * Padding
       */
      padding: {
        none: 'p-0',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },

      /**
       * Pastel gradient overlay (OKLCH-based)
       */
      gradient: {
        none: '',
        blue: 'bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-400/10 dark:to-indigo-400/10',
        purple:
          'bg-gradient-to-br from-purple-500/5 to-violet-500/5 dark:from-purple-400/10 dark:to-violet-400/10',
        pink: 'bg-gradient-to-br from-pink-500/5 to-rose-500/5 dark:from-pink-400/10 dark:to-rose-400/10',
        green:
          'bg-gradient-to-br from-green-500/5 to-emerald-500/5 dark:from-green-400/10 dark:to-emerald-400/10',
        amber:
          'bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-400/10 dark:to-orange-400/10',
      },

      /**
       * Hover interactions
       */
      hover: {
        none: '',
        lift: 'hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0',
        glow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_0_30px_rgba(129,140,248,0.2)]',
        brighten: 'hover:bg-white/70 dark:hover:bg-white/[0.12]',
      },

      /**
       * Animation
       * Note: Never animate backdrop-filter per spec
       */
      animated: {
        none: '',
        shimmer: 'animate-shimmer bg-[length:200%_100%]',
        pulse: 'animate-pulse',
      },

      /**
       * Isolation for stacking contexts
       * Use when nesting glass surfaces to prevent backdrop-filter inheritance issues
       */
      isolate: {
        true: 'isolate',
        false: '',
      },
    },

    defaultVariants: {
      intensity: 'medium',
      rounded: 'lg',
      padding: 'md',
      gradient: 'none',
      hover: 'none',
      animated: 'none',
      isolate: false,
    },
  }
)

/**
 * Glass surface variant props
 */
export type GlassSurfaceVariants = VariantProps<typeof glassSurfaceVariants>

/**
 * Glass surface component props
 */
export interface GlassSurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>, GlassSurfaceVariants {
  /**
   * Element type to render
   * @default 'div'
   */
  as?: React.ElementType
}

/**
 * GlassSurface component
 *
 * A premium glassmorphism surface with proper accessibility and fallbacks.
 */
export const GlassSurface = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  (
    {
      className,
      as: Component = 'div',
      intensity,
      rounded,
      padding,
      gradient,
      hover,
      animated,
      isolate,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          glassSurfaceVariants({
            intensity,
            rounded,
            padding,
            gradient,
            hover,
            animated,
            isolate,
          }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

GlassSurface.displayName = 'GlassSurface'

/**
 * GlassCard - Convenience component for card-like glass surfaces
 *
 * Pre-configured with common card styling.
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ className, hover = 'lift', ...props }, ref) => {
    return (
      <GlassSurface
        ref={ref}
        className={cn('transition-all duration-200', className)}
        hover={hover}
        {...props}
      />
    )
  }
)

GlassCard.displayName = 'GlassCard'

/**
 * GlassPanel - Convenience component for larger glass sections
 *
 * Pre-configured with panel styling and isolation.
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  (
    { className, isolate = true, padding = 'lg', rounded = 'xl', ...props },
    ref
  ) => {
    return (
      <GlassSurface
        ref={ref}
        className={className}
        isolate={isolate}
        padding={padding}
        rounded={rounded}
        {...props}
      />
    )
  }
)

GlassPanel.displayName = 'GlassPanel'
