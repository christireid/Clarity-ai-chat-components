'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

// Extended badge variants that include custom variants and sizes
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border border-primary/30 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md hover:scale-105',
        secondary:
          'border border-border/60 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:border-border/80 hover:scale-105',
        destructive:
          'border border-destructive/30 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md hover:scale-105',
        outline:
          'border border-border/60 bg-background text-foreground hover:bg-accent/50 hover:border-border/80 hover:scale-105',
        success:
          'border border-success/30 bg-success text-success-foreground shadow-sm hover:bg-success/90 hover:shadow-md hover:scale-105',
        warning:
          'border border-warning/30 bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 hover:shadow-md hover:scale-105',
        info: 'border border-info/30 bg-info text-info-foreground shadow-sm hover:bg-info/90 hover:shadow-md hover:scale-105',
        subtle:
          'border border-border/40 bg-muted text-muted-foreground hover:bg-muted/70 hover:border-border/60 hover:scale-105',
        ghost:
          'border border-transparent hover:bg-accent/50 hover:text-accent-foreground hover:border-border/20 hover:scale-105',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px] tracking-wide',
        default: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm tracking-normal',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Show animated dot indicator */
  dot?: boolean
  /** Enable pulse animation for notifications */
  pulse?: boolean
  /** Enable glow effect */
  glow?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      dot = false,
      pulse = false,
      glow = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size }),
          pulse && 'animate-[badge-pulse_2s_ease-in-out_infinite]',
          glow && 'animate-[glow_2s_ease-in-out_infinite]',
          className
        )}
        {...props}
      >
        {dot && (
          <span className="relative mr-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
          </span>
        )}
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
