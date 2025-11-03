import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1',
  {
    variants: {
      variant: {
        default: 'bg-primary/12 text-primary border border-primary/35 shadow-[0_2px_6px_rgba(22,119,255,0.18)]',
        secondary: 'bg-secondary text-secondary-foreground border border-secondary/60',
        destructive: 'bg-destructive/10 text-destructive border border-destructive/30',
        outline: 'bg-transparent text-foreground border border-border/60',
        success: 'bg-success/10 text-success border border-success/30',
        warning: 'bg-warning/15 text-warning-foreground border border-warning/40',
        info: 'bg-info/10 text-info border border-info/30',
        subtle: 'bg-[hsl(var(--surface-muted))] text-muted-foreground border border-border/40',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, dot = false, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props}>
        {dot && (
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_0_4px_rgba(255,255,255,0.2)] animate-ping" />
        )}
        {children}
      </div>
    )
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
