'use client'

import * as React from 'react'
import { cn } from '../lib/cn'
import { announce } from '../lib/aria'
import { ErrorMessage } from './error-message'
import { Checkbox as ShadcnCheckbox } from './ui/checkbox'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

// ============================================================================
// Types
// ============================================================================

export interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'type'
> {
  /**
   * Visible label for the checkbox
   */
  label?: string

  /**
   * Error message to display
   */
  error?: string

  /**
   * Helper text to display below the checkbox
   */
  helperText?: string

  /**
   * Label position relative to checkbox
   * @default 'right'
   */
  labelPosition?: 'left' | 'right'

  /**
   * Announce state changes to screen readers
   * @default false
   */
  announceStateChange?: boolean

  /**
   * Custom announcement messages
   */
  announcements?: {
    checked?: string
    unchecked?: string
    indeterminate?: string
  }

  /**
   * Description text shown below label (for longer explanations)
   */
  description?: string

  /**
   * Additional wrapper className
   */
  wrapperClassName?: string
}

// ============================================================================
// Component
// ============================================================================

/**
 * Enhanced Checkbox component with accessibility features
 *
 * @description
 * A fully-featured checkbox component built on Radix UI primitives with:
 * - Built-in label with proper accessibility associations
 * - Helper text and description support
 * - Error state handling
 * - Screen reader announcements for state changes
 * - Indeterminate state support
 *
 * @example
 * ```tsx
 * // Basic checkbox with label
 * <Checkbox label="Accept terms" />
 *
 * // With description
 * <Checkbox
 *   label="Marketing emails"
 *   description="Receive updates about new features and promotions"
 * />
 *
 * // With state change announcements
 * <Checkbox
 *   label="Newsletter"
 *   announceStateChange
 *   announcements={{
 *     checked: "Subscribed to newsletter",
 *     unchecked: "Unsubscribed from newsletter"
 *   }}
 * />
 * ```
 *
 * @accessibility
 * - Uses Radix UI primitives for proper keyboard navigation
 * - Label properly associated via htmlFor/id
 * - Error messages linked via aria-describedby
 * - Optional screen reader announcements for state changes
 * - Supports indeterminate state
 */
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
      helperText,
      required,
      disabled,
      labelPosition = 'right',
      announceStateChange = false,
      announcements,
      description,
      wrapperClassName,
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
    const helperId = helperText ? `${checkboxId}-helper` : undefined
    const descriptionId = description ? `${checkboxId}-description` : undefined

    // Combine describedby IDs
    const describedBy =
      [errorId, helperId, descriptionId].filter(Boolean).join(' ') || undefined

    // Handle state change with optional announcement
    const handleCheckedChange = React.useCallback(
      (newChecked: CheckboxPrimitive.CheckedState) => {
        if (announceStateChange) {
          const defaultAnnouncements = {
            checked: `${label || 'Checkbox'} checked`,
            unchecked: `${label || 'Checkbox'} unchecked`,
            indeterminate: `${label || 'Checkbox'} indeterminate`,
          }

          const effectiveAnnouncements = {
            ...defaultAnnouncements,
            ...announcements,
          }

          if (newChecked === true) {
            announce(effectiveAnnouncements.checked, { assertive: false })
          } else if (newChecked === false) {
            announce(effectiveAnnouncements.unchecked, { assertive: false })
          } else if (newChecked === 'indeterminate') {
            announce(effectiveAnnouncements.indeterminate, { assertive: false })
          }
        }

        onCheckedChange?.(newChecked)
      },
      [announceStateChange, announcements, label, onCheckedChange]
    )

    const checkboxElement = (
      <ShadcnCheckbox
        ref={ref}
        id={checkboxId}
        disabled={disabled}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        aria-label={!label ? ariaLabel : undefined}
        className={cn(
          error && 'border-destructive focus-visible:ring-destructive/50',
          className
        )}
        data-slot="checkbox"
        {...props}
      />
    )

    // Simple checkbox without label
    if (!label) {
      return (
        <div
          className={cn('inline-flex flex-col', wrapperClassName)}
          data-slot="checkbox-wrapper"
        >
          {checkboxElement}
          {/* Helper text */}
          {helperText && !error && (
            <p
              id={helperId}
              className="mt-1 text-xs text-muted-foreground"
              data-slot="checkbox-helper"
            >
              {helperText}
            </p>
          )}
          <ErrorMessage error={error} id={errorId} />
        </div>
      )
    }

    // Checkbox with label
    return (
      <div
        className={cn('flex flex-col gap-1', wrapperClassName)}
        data-slot="checkbox-wrapper"
      >
        <div
          className={cn(
            'flex items-start gap-2',
            labelPosition === 'left' && 'flex-row-reverse justify-end'
          )}
        >
          <div className="mt-0.5">{checkboxElement}</div>
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor={checkboxId}
              className={cn(
                'text-sm font-medium leading-none select-none',
                disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
              )}
              data-slot="checkbox-label"
            >
              {label}
              {required && (
                <span className="text-destructive ml-0.5" aria-hidden="true">
                  *
                </span>
              )}
            </label>
            {/* Description */}
            {description && (
              <p
                id={descriptionId}
                className="text-xs text-muted-foreground"
                data-slot="checkbox-description"
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Helper text */}
        {helperText && !error && (
          <p
            id={helperId}
            className="text-xs text-muted-foreground ml-6"
            data-slot="checkbox-helper"
          >
            {helperText}
          </p>
        )}

        <ErrorMessage error={error} id={errorId} className="ml-6" />
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
