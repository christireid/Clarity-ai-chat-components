import React from 'react'
import { cn } from '../../../utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-red-600 text-white',
      outline: 'border border-border text-foreground',
    }

    return (
      <div
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'