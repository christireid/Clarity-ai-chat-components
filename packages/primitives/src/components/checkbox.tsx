'use client'

import * as React from 'react'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { cn } from '../lib/utils'
import { ErrorMessage } from './error-message'
import { Checkbox as BaseCheckbox } from './ui/checkbox'

type BaseCheckboxProps = React.ComponentPropsWithoutRef<typeof BaseCheckbox>

type NativeCheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'defaultChecked' | 'onChange'
>

export interface CheckboxProps extends BaseCheckboxProps, NativeCheckboxProps {
  /** Visible label for the checkbox */
  label?: React.ReactNode
  /** Error message to display */
  error?: string
  /** Label position relative to checkbox */
  labelPosition?: 'left' | 'right'
  /** Native change handler compatibility */
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof BaseCheckbox>,
  CheckboxProps
>(
  (
    {
      className,
      label,
      error,
      labelPosition = 'right',
      required,
      disabled,
      name,
      value,
      form,
      id,
      onChange,
      checked,
      defaultChecked,
      onCheckedChange,
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) => {
    const generatedId = React.useId()
    const checkboxId = id || generatedId
    const errorId = error ? `${checkboxId}-error` : undefined
    const hiddenInputRef = React.useRef<HTMLInputElement>(null)

    const isControlled = checked !== undefined
    const [internalState, setInternalState] = React.useState<CheckedState>(
      defaultChecked ?? false
    )
    const resolvedChecked = (isControlled ? checked : internalState) ?? false

    React.useEffect(() => {
      if (!isControlled && defaultChecked !== undefined) {
        setInternalState(defaultChecked)
      }
    }, [defaultChecked, isControlled])

    React.useEffect(() => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.checked = resolvedChecked === true
        hiddenInputRef.current.indeterminate = resolvedChecked === 'indeterminate'
      }
    }, [resolvedChecked])

    const emitNativeChange = React.useCallback(
      (nextState: CheckedState) => {
        if (!onChange || !hiddenInputRef.current) {
          return
        }

        const syntheticEvent = {
          target: hiddenInputRef.current,
          currentTarget: hiddenInputRef.current,
          bubbles: true,
          cancelable: false,
          defaultPrevented: false,
          isTrusted: false,
          preventDefault() {},
          stopPropagation() {},
          nativeEvent: undefined,
        } as React.ChangeEvent<HTMLInputElement>

        onChange(syntheticEvent)
      },
      [onChange]
    )

    const handleCheckedChange = (nextState: CheckedState) => {
      const normalizedState = nextState ?? false
      if (!isControlled) {
        setInternalState(normalizedState)
      }

      onCheckedChange?.(normalizedState)
      emitNativeChange(normalizedState)
    }

    const checkboxElement = (
      <BaseCheckbox
        id={checkboxId}
        ref={ref}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        aria-label={!label ? ariaLabel : undefined}
        checked={resolvedChecked}
        onCheckedChange={handleCheckedChange}
        className={cn(
          'grid place-content-center h-4 w-4 shrink-0 rounded border border-input/60 text-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-150 ease-out hover:border-input/80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_3px_rgba(var(--primary),0.1)] data-[state=checked]:bg-primary data-[state=checked]:border-primary disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive/50 data-[state=checked]:border-destructive data-[state=checked]:bg-destructive',
          className
        )}
        {...rest}
      />
    )

    const hiddenInput = (
      <input
        ref={hiddenInputRef}
        type="checkbox"
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        value={value ?? 'on'}
        form={form}
        required={required}
        disabled={disabled}
        className="sr-only"
        data-checkbox-hidden-input
        readOnly
      />
    )

    if (!label) {
      return (
        <div className="inline-flex flex-col">
          {checkboxElement}
          {hiddenInput}
          <ErrorMessage error={error} id={errorId} />
        </div>
      )
    }

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
            {required && <span className="ml-0.5 text-destructive">*</span>}
          </label>
          {hiddenInput}
        </div>
        <ErrorMessage error={error} id={errorId} />
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
