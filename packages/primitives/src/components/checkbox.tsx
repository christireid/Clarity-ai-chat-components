'use client'

import * as React from 'react'
import { cn } from '../lib/utils'
import { ErrorMessage } from './error-message'
import { Checkbox as ShadcnCheckbox } from './ui/checkbox'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'type'> {
  /** Visible label for the checkbox */
  label?: string
  /** Error message to display */
  error?: string
  /** Label position relative to checkbox */
  labelPosition?: 'left' | 'right'
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      id,
      label,
      error,
      required,
      disabled,
      labelPosition = 'right',
      'aria-label': ariaLabel,
      checked,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    // Generate stable ID for label association
    const generatedId = React.useId()
    const checkboxId = id || generatedId
    const errorId = error ? `${checkboxId}-error` : undefined

    const checkboxElement = (
      <ShadcnCheckbox
        ref={ref}
        id={checkboxId}
        disabled={disabled}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        aria-label={!label ? ariaLabel : undefined}
        className={cn(
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
        <div
          className={cn(
            'flex items-center gap-2',
            labelPosition === 'left' && 'flex-row-reverse justify-end'
          )}
        >
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
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
