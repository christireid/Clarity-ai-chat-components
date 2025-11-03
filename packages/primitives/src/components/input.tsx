import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const inputVariants = cva(
  'flex w-full rounded-lg border border-border/60 bg-[hsl(var(--surface-elevated))] px-4 py-2.5 text-sm shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-all duration-200 placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-4 focus-visible:ring-ring/25 focus-visible:shadow-[0_0_0_4px_rgba(22,119,255,0.12)] disabled:cursor-not-allowed disabled:bg-[hsl(var(--surface-muted))] disabled:text-muted-foreground/60 file:border-0 file:bg-transparent file:text-sm file:font-medium',
  {
    variants: {
      variant: {
        default: '',
        surface: 'bg-[hsl(var(--surface-muted))] border-transparent shadow-none focus-visible:border-primary/60',
        error: 'border-destructive focus-visible:ring-destructive/25 focus-visible:shadow-[0_0_0_4px_rgba(255,77,79,0.16)] text-destructive placeholder:text-destructive/60',
        success: 'border-success/70 focus-visible:ring-success/25 focus-visible:shadow-[0_0_0_4px_rgba(34,197,94,0.16)] text-success placeholder:text-success/60',
      },
      inputSize: {
        default: 'h-11 text-sm',
        sm: 'h-9 rounded-md px-3 py-2 text-xs',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, error, icon, iconPosition = 'left', ...props }, ref) => {
    const hasError = error || variant === 'error'

    if (icon) {
      return (
        <div className="relative">
          {iconPosition === 'left' && (
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: hasError ? 'error' : variant, inputSize }),
              iconPosition === 'left' && 'pl-11',
              iconPosition === 'right' && 'pr-11',
              className
            )}
            ref={ref}
            {...props}
          />
          {iconPosition === 'right' && (
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70">
              {icon}
            </div>
          )}
          {error && (
            <p className="mt-1 text-xs font-medium text-destructive">{error}</p>
          )}
        </div>
      )
    }

    return (
      <div>
        <input
          type={type}
          className={cn(
            inputVariants({ variant: hasError ? 'error' : variant, inputSize }),
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
