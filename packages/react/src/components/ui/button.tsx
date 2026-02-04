import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { withGlass, type GlassComponentProps } from '../../lib/with-glass'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'destructive'
    | 'outline'
    | 'accent'
    | 'glass'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      loading,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      outline:
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      accent: 'gradient-accent',
      glass: '',
    }

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-lg',
    }

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading && <span className="mr-2">Loading...</span>}
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    )
  }
)

ButtonBase.displayName = 'ButtonBase'

// Glass-enhanced Button
export const GlassButton = withGlass(ButtonBase, {
  intensity: 'medium',
  border: 'light',
  hover: 'brighten',
})

// Export default Button (non-glass)
export const Button = ButtonBase
