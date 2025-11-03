import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva(
<<<<<<< Current (Your changes)
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
=======
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/90 text-primary-foreground hover:bg-primary shadow-sm hover:shadow',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm',
        destructive: 'border-transparent bg-destructive/90 text-destructive-foreground hover:bg-destructive shadow-sm',
        outline: 'border-2 text-foreground hover:bg-accent',
        success: 'border-transparent bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow-green-500/20',
        warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm hover:shadow-yellow-500/20',
        info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-blue-500/20',
>>>>>>> Incoming (Background Agent changes)
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
