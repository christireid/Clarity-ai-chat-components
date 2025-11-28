'use client'

import * as React from 'react'
import { cn } from '../lib/utils'
import { ErrorMessage } from './error-message'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  ref?: React.Ref<HTMLInputElement>
  /** Visible label for the checkbox */
  label?: string
  /** Error message to display */
  error?: string
  /** Label position relative to checkbox */
  labelPosition?: 'left' | 'right'
}

export const Checkbox = ({
  className,
  ref,
  id,
  label,
  error,
  required,
  disabled,
  labelPosition = 'right',
  'aria-label': ariaLabel,
  ...props
}: CheckboxProps) => {
  // Generate stable ID for label association
  const generatedId = React.useId()
  const checkboxId = id || generatedId
  const errorId = error ? `${checkboxId}-error` : undefined

  const checkboxElement = (
    <input
      ref={ref}
      type="checkbox"
      id={checkboxId}
      disabled={disabled}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={errorId}
      aria-label={!label ? ariaLabel : undefined}
      className={cn(
        'h-4 w-4 rounded border border-input/60 text-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:border-input/80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_3px_rgba(var(--primary),0.1)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 ease-out checked:bg-primary checked:border-primary',
        error && 'border-destructive focus-visible:ring-destructive/50',
        className
      )}
      {...props}
    />
  )

  // Simple checkbox without label
  if (!label) {
    return (
      <div className="inline-flex flex-col">
        {checkboxElement}
        <ErrorMessage error={error} id={errorId} />
      </div>
    )
  }

  // Checkbox with label
  return (
    <div className="flex flex-col gap-1">
      <div className={cn('flex items-center gap-2', labelPosition === 'left' && 'flex-row-reverse justify-end')}>
        {checkboxElement}
        <label
          htmlFor={checkboxId}
          className={cn(
            'text-sm font-medium leading-none select-none',
            disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
          )}
        >
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      </div>
      <ErrorMessage error={error} id={errorId} />
    </div>
  )
}

Checkbox.displayName = 'Checkbox'

export default Checkbox
