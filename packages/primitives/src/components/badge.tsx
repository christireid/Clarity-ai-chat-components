import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary/90 text-primary-foreground hover:bg-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)] hover:shadow-[0_2px_4px_rgba(15,23,42,0.12)]',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_1px_2px_rgba(15,23,42,0.08)] hover:shadow-[0_2px_4px_rgba(15,23,42,0.12)]',
        destructive:
          'border-transparent bg-destructive/90 text-destructive-foreground hover:bg-destructive shadow-[0_1px_2px_rgba(239,68,68,0.2)] hover:shadow-[0_2px_4px_rgba(239,68,68,0.25)]',
        outline: 
          'border-2 border-border/60 text-foreground hover:bg-accent hover:border-primary/40 hover:shadow-[0_2px_4px_rgba(15,23,42,0.08)]',
        success:
          'border-transparent bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]/90 shadow-[0_1px_2px_rgba(34,197,94,0.2)] hover:shadow-[0_2px_4px_rgba(34,197,94,0.25)]',
        warning:
          'border-transparent bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning))]/90 shadow-[0_1px_2px_rgba(234,179,8,0.2)] hover:shadow-[0_2px_4px_rgba(234,179,8,0.25)]',
        info: 
          'border-transparent bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] hover:bg-[hsl(var(--info))]/90 shadow-[0_1px_2px_rgba(59,130,246,0.2)] hover:shadow-[0_2px_4px_rgba(59,130,246,0.25)]',
        subtle:
          'border-transparent bg-muted text-muted-foreground hover:bg-muted/80',
        ghost:
          'border-transparent hover:bg-accent hover:text-accent-foreground',
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
