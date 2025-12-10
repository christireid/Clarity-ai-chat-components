'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { ErrorMessage } from './error-message'
import { Input as ShadcnInput } from './ui/input'

const inputVariants = cva(
  'flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:border-primary focus-visible:shadow-xs hover:border-accent-foreground/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-200',
  {
    variants: {
      variant: {
        default: '',
        error: 'ring-destructive focus-visible:ring-destructive focus-visible:ring-destructive/20',
        success: 'ring-success focus-visible:ring-success focus-visible:ring-success/20',
      },
      inputSize: {
        default: 'h-10',
        sm: 'h-8 text-xs px-2',
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
  extends Omit<React.ComponentProps<typeof ShadcnInput>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  inputSize?: 'default' | 'sm' | 'lg'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, variant, inputSize, type, error, icon, iconPosition = 'left', id, ...props },
    ref
  ) => {
    const hasError = error || variant === 'error'
    // Generate stable fallback ID for accessibility (matches Checkbox pattern)
    const generatedId = React.useId()
    const inputId = id || generatedId
    const errorId = error ? `${inputId}-error` : undefined

    if (icon) {
      return (
        <div className="relative">
          {iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none">
              {icon}
            </div>
          )}
          <ShadcnInput
            type={type}
            id={inputId}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={errorId}
            className={cn(
              inputVariants({ variant: hasError ? 'error' : variant, inputSize }),
              iconPosition === 'left' && 'pl-10',
              iconPosition === 'right' && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none">
              {icon}
            </div>
          )}
          <ErrorMessage error={error} id={errorId} />
        </div>
      )
    }

    return (
      <div>
        <ShadcnInput
          type={type}
          id={inputId}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            inputVariants({ variant: hasError ? 'error' : variant, inputSize }),
            className
          )}
          ref={ref}
          {...props}
        />
        <ErrorMessage error={error} id={errorId} />
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
