/**
 * GlassOverlay - Glass effect for overlay components
 *
 * Specifically designed for use in overlay components like dialogs,
 * sheets, popovers, etc. Includes portal-compatible styling and
 * proper z-index handling.
 *
 * Features:
 * - Optimized for overlay/portal use cases
 * - Proper backdrop styling
 * - Focus management considerations
 * - Animation-ready (but never animates backdrop-filter)
 *
 * @example
 * ```tsx
 * <GlassOverlay
 *   intensity="medium"
 *   backdrop
 * >
 *   <DialogContent>...</DialogContent>
 * </GlassOverlay>
 * ```
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Glass overlay variants
 */
export const glassOverlayVariants = cva(
  [
    // Base structure
    'relative',
    'bg-white/60 dark:bg-white/[0.08]',
    'border border-white/20 dark:border-white/[0.1]',
    // Typography smoothing
    'antialiased',
    // Shadow for elevation
    'shadow-xl',
  ],
  {
    variants: {
      /**
       * Glass intensity
       * Dark mode follows spec: 5-15% white, 12-16px blur
       */
      intensity: {
        subtle: [
          'backdrop-blur-sm backdrop-saturate-[1.2]',
          'bg-white/50 dark:bg-white/[0.05]',
        ],
        medium: [
          'backdrop-blur-[14px] backdrop-saturate-150',
          'bg-white/70 dark:bg-white/[0.08]',
        ],
        strong: [
          'backdrop-blur-xl backdrop-saturate-[1.8]',
          'bg-white/85 dark:bg-white/[0.12]',
        ],
        /**
         * Frosted variant - maximum glass effect
         * Use sparingly for key UI elements
         */
        frosted: [
          'backdrop-blur-2xl backdrop-saturate-[2]',
          'bg-white/90 dark:bg-white/[0.15]',
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
      },

      /**
       * Size presets for common overlay sizes
       */
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        full: 'max-w-full',
        auto: '',
      },

      /**
       * Whether to include backdrop overlay
       */
      backdrop: {
        true: '',
        false: '',
      },

      /**
       * Whether component is used in a portal
       * Adds isolation to prevent stacking context issues
       */
      portal: {
        true: 'isolate',
        false: '',
      },
    },

    defaultVariants: {
      intensity: 'medium',
      rounded: 'lg',
      size: 'auto',
      backdrop: false,
      portal: true,
    },
  }
)

/**
 * Glass overlay backdrop variants
 */
export const glassBackdropVariants = cva(
  ['fixed inset-0', 'bg-black/50 dark:bg-black/70', 'backdrop-blur-sm'],
  {
    variants: {
      /**
       * Backdrop intensity
       */
      intensity: {
        light: 'bg-black/30 dark:bg-black/50 backdrop-blur-[2px]',
        medium: 'bg-black/50 dark:bg-black/70 backdrop-blur-sm',
        heavy: 'bg-black/70 dark:bg-black/80 backdrop-blur-md',
      },
    },
    defaultVariants: {
      intensity: 'medium',
    },
  }
)

/**
 * Glass overlay variant props
 */
export type GlassOverlayVariants = VariantProps<typeof glassOverlayVariants>
export type GlassBackdropVariants = VariantProps<typeof glassBackdropVariants>

/**
 * Glass overlay component props
 */
export interface GlassOverlayProps
  extends React.HTMLAttributes<HTMLDivElement>, GlassOverlayVariants {
  /**
   * Backdrop intensity (only used when backdrop=true)
   */
  backdropIntensity?: GlassBackdropVariants['intensity']
}

/**
 * GlassOverlay component
 *
 * A glass surface optimized for overlay use cases.
 * Use for dialogs, sheets, popovers, dropdown menus, etc.
 */
export const GlassOverlay = React.forwardRef<HTMLDivElement, GlassOverlayProps>(
  (
    {
      className,
      intensity,
      rounded,
      size,
      backdrop,
      portal,
      backdropIntensity,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <>
        {backdrop && (
          <div
            className={cn(
              glassBackdropVariants({ intensity: backdropIntensity }),
              'animate-in fade-in-0'
            )}
            aria-hidden="true"
          />
        )}
        <div
          ref={ref}
          className={cn(
            glassOverlayVariants({
              intensity,
              rounded,
              size,
              backdrop,
              portal,
            }),
            className
          )}
          {...props}
        >
          {children}
        </div>
      </>
    )
  }
)

GlassOverlay.displayName = 'GlassOverlay'

/**
 * GlassDialogContent - Pre-configured glass overlay for dialogs
 */
export const GlassDialogContent = React.forwardRef<
  HTMLDivElement,
  Omit<GlassOverlayProps, 'portal' | 'backdrop'>
>(
  (
    { className, intensity = 'medium', rounded = 'xl', size = 'lg', ...props },
    ref
  ) => {
    return (
      <GlassOverlay
        ref={ref}
        className={cn('p-6', className)}
        intensity={intensity}
        rounded={rounded}
        size={size}
        portal
        {...props}
      />
    )
  }
)

GlassDialogContent.displayName = 'GlassDialogContent'

/**
 * GlassSheetContent - Pre-configured glass overlay for sheets
 */
export const GlassSheetContent = React.forwardRef<
  HTMLDivElement,
  Omit<GlassOverlayProps, 'portal' | 'rounded'> & {
    side?: 'top' | 'right' | 'bottom' | 'left'
  }
>(
  (
    { className, intensity = 'strong', side = 'right', size = 'md', ...props },
    ref
  ) => {
    const sideClasses = {
      top: 'rounded-b-2xl',
      right: 'rounded-l-2xl',
      bottom: 'rounded-t-2xl',
      left: 'rounded-r-2xl',
    }

    return (
      <GlassOverlay
        ref={ref}
        className={cn('p-6', sideClasses[side], className)}
        intensity={intensity}
        rounded="none"
        size={size}
        portal
        {...props}
      />
    )
  }
)

GlassSheetContent.displayName = 'GlassSheetContent'

/**
 * GlassPopoverContent - Pre-configured glass overlay for popovers
 */
export const GlassPopoverContent = React.forwardRef<
  HTMLDivElement,
  Omit<GlassOverlayProps, 'portal' | 'size'>
>(({ className, intensity = 'medium', rounded = 'lg', ...props }, ref) => {
  return (
    <GlassOverlay
      ref={ref}
      className={cn('p-3', className)}
      intensity={intensity}
      rounded={rounded}
      size="auto"
      portal
      {...props}
    />
  )
})

GlassPopoverContent.displayName = 'GlassPopoverContent'

/**
 * GlassTooltipContent - Pre-configured glass overlay for tooltips
 */
export const GlassTooltipContent = React.forwardRef<
  HTMLDivElement,
  Omit<GlassOverlayProps, 'portal' | 'size' | 'intensity'>
>(({ className, rounded = 'md', ...props }, ref) => {
  return (
    <GlassOverlay
      ref={ref}
      className={cn('px-3 py-1.5 text-sm', className)}
      intensity="subtle"
      rounded={rounded}
      size="auto"
      portal
      {...props}
    />
  )
})

GlassTooltipContent.displayName = 'GlassTooltipContent'
