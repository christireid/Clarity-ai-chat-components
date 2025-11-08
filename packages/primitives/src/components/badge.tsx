import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary/90 text-primary-foreground hover:bg-primary shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.15)]',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]',
        destructive:
          'border-transparent bg-destructive/90 text-destructive-foreground hover:bg-destructive shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_6px_rgba(239,68,68,0.2)]',
        outline: 
          'border border-border/60 text-foreground hover:bg-accent hover:border-border hover:shadow-[0_1px_3px_rgba(0,0,0,0.08)]',
        success:
          'border-transparent bg-green-500/90 text-white hover:bg-green-500 shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_6px_rgba(34,197,94,0.2)]',
        warning:
          'border-transparent bg-amber-500/90 text-white hover:bg-amber-500 shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_6px_rgba(245,158,11,0.2)]',
        info: 
          'border-transparent bg-blue-500/90 text-white hover:bg-blue-500 shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_6px_rgba(59,130,246,0.2)]',
        subtle:
          'border-transparent bg-muted text-muted-foreground hover:bg-muted/80',
        ghost:
          'border-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px] tracking-wider',
        default: 'px-2.5 py-0.5 text-xs tracking-wide',
        lg: 'px-3 py-1 text-sm tracking-wide',
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
          pulse && 'animate-[badge-pulse_3s_ease-in-out_infinite]',
          glow && 'animate-[glow_3s_ease-in-out_infinite]',
          className
        )}
        {...props}
      >
        {dot && (
          <span className="relative mr-1.5 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-current opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
          </span>
        )}
        {children}
      </div>
    )
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
