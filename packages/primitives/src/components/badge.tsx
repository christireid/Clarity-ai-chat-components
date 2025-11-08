import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-[3px] focus:ring-ring/50 focus:ring-offset-1 ring-1',
  {
    variants: {
      variant: {
        default:
          'ring-primary/20 bg-primary/90 text-primary-foreground hover:bg-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)]',
        secondary:
          'ring-border/20 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_1px_2px_rgba(15,23,42,0.08)]',
        destructive:
          'ring-destructive/20 bg-destructive/90 text-destructive-foreground hover:bg-destructive shadow-[0_1px_2px_rgba(239,68,68,0.2)]',
        outline: 
          'ring-border bg-transparent text-foreground hover:bg-accent hover:ring-border/70',
        success:
          'ring-green-500/20 bg-green-500 text-white hover:bg-green-600 shadow-[0_1px_2px_rgba(34,197,94,0.2)]',
        warning:
          'ring-yellow-500/20 bg-yellow-500 text-white hover:bg-yellow-600 shadow-[0_1px_2px_rgba(234,179,8,0.2)]',
        info: 
          'ring-blue-500/20 bg-blue-500 text-white hover:bg-blue-600 shadow-[0_1px_2px_rgba(59,130,246,0.2)]',
        subtle:
          'ring-border/20 bg-muted text-muted-foreground hover:bg-muted/80',
        ghost:
          'ring-transparent hover:bg-accent hover:text-accent-foreground hover:ring-border/20',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
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
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, dot = false, pulse = false, glow = false, children, ...props }, ref) => {
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
