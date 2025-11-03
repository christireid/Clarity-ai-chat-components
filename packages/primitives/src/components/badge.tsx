import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva(
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
