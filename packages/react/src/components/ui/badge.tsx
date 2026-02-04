import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { withGlass, type GlassComponentProps } from '../../lib/with-glass'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'glass'
}

const BadgeBase = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-red-600 text-white',
      outline: 'border border-border text-foreground',
      glass: '',
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

BadgeBase.displayName = 'BadgeBase'

// Glass-enhanced Badge
export const GlassBadge = withGlass(BadgeBase, {
  intensity: 'subtle',
  border: 'light',
  hover: 'brighten',
})

// Export default Badge (non-glass)
export const Badge = BadgeBase
