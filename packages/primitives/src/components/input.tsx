import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { ErrorMessage } from './error-message'

const inputVariants = cva(
  'flex w-full rounded-lg border border-input/40 bg-background px-3.5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:ring-offset-1 focus-visible:border-input focus-visible:shadow-focus-primary hover:border-input/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-200',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive/60 focus-visible:border-destructive focus-visible:ring-destructive/20 focus-visible:shadow-focus-destructive',
        success: 'border-green-500/60 focus-visible:border-green-500 focus-visible:ring-green-500/20 focus-visible:shadow-focus-success',
      },
      inputSize: {
        default: 'h-10',
        sm: 'h-8 text-xs px-2.5',
        lg: 'h-12 text-base px-4',
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
  /** React 19: ref is now a regular prop! */
  ref?: React.Ref<HTMLInputElement>
}

function Input({ className, variant, inputSize, type, error, icon, iconPosition = 'left', ref, ...props }: InputProps) {
    const hasError = error || variant === 'error'

    if (icon) {
      return (
        <div className="relative">
          {iconPosition === 'left' && (
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: hasError ? 'error' : variant, inputSize }),
              iconPosition === 'left' && 'pl-9',
              iconPosition === 'right' && 'pr-9',
              className
            )}
            ref={ref}
            {...props}
          />
          {iconPosition === 'right' && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <ErrorMessage error={error} />
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
          <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
            <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
}

export { Input, inputVariants }
