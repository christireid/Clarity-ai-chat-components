import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-ring/50 focus:ring-offset-1',
  {
    variants: {
      variant: {
        default:
          'bg-primary/10 text-primary hover:bg-primary/15',
        secondary:
          'bg-secondary/10 text-secondary-foreground hover:bg-secondary/15',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/15',
        outline: 
          'border border-border/40 text-foreground hover:bg-accent/50 hover:border-border/60',
        success:
          'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/15',
        warning:
          'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/15',
        info: 
          'bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/15',
        subtle:
          'bg-muted/50 text-muted-foreground hover:bg-muted/70',
        ghost:
          'hover:bg-accent/50 hover:text-accent-foreground',
      },
      size: {
        sm: 'px-2 py-0 text-[10px]',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Show animated dot indicator */
  dot?: boolean
  /** Enable pulse animation for notifications */
  pulse?: boolean
  /** Enable glow effect */
  glow?: boolean
  /** React 19: ref is now a regular prop! */
  ref?: React.Ref<HTMLDivElement>
}

function Badge({ className, variant, size, dot = false, pulse = false, glow = false, children, ref, ...props }: BadgeProps) {
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

export { Badge, badgeVariants }
