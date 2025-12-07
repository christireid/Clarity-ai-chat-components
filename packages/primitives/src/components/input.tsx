'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { ErrorMessage } from './error-message'
import { Input as BaseInput } from './ui/input'

const inputVariants = cva(
  'rounded-lg border border-input bg-background shadow-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:border-primary focus-visible:shadow-xs hover:border-accent-foreground/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-200',
  {
    variants: {
      variant: {
        default: '',
        error: 'ring-destructive focus-visible:ring-destructive focus-visible:border-destructive',
        success: 'ring-green-500 focus-visible:ring-green-500 focus-visible:border-green-500',
      },
      inputSize: {
        default: 'h-10 px-3 text-sm',
        sm: 'h-8 px-2 text-xs',
        lg: 'h-12 px-4 text-base',
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
  (
    {
      className,
      variant,
      inputSize,
      type,
      error,
      icon,
      iconPosition = 'left',
      id,
      ...props
    },
    forwardedRef
  ) => {
    const hasError = error || variant === 'error'
    const generatedId = React.useId()
    const inputId = id || generatedId
    const errorId = error ? `${inputId}-error` : undefined

    const assignRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          ;(forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node
        }
      },
      [forwardedRef]
    )

  const inputElement = (
    <BaseInput
      type={type}
      id={inputId}
      aria-invalid={hasError ? true : undefined}
      aria-describedby={errorId}
      className={cn(
        inputVariants({ variant: hasError ? 'error' : variant, inputSize }),
        icon && iconPosition === 'left' && 'pl-10',
        icon && iconPosition === 'right' && 'pr-10',
        className
      )}
      ref={assignRef}
      {...props}
    />
  )

  if (!icon) {
    return (
      <div>
        {inputElement}
        <ErrorMessage error={error} id={errorId} />
      </div>
    )
  }

  return (
    <div className="relative">
      {iconPosition === 'left' && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      {inputElement}
      {iconPosition === 'right' && (
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      <ErrorMessage error={error} id={errorId} />
    </div>
  )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
