'use client'

import * as React from 'react'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { cn } from '../lib/cn'
import { ErrorMessage } from './error-message'
import { Switch as BaseSwitch } from './ui/switch'

type BaseSwitchProps = Omit<
  ComponentPropsWithoutRef<typeof BaseSwitch>,
  'onChange'
>

export interface SwitchProps extends BaseSwitchProps {
  /** Visible label displayed next to the switch */
  label?: React.ReactNode
  /** Optional supporting description text */
  description?: React.ReactNode
  /** Error text rendered below the control */
  error?: string
  /** Control vertical alignment between label/description and the switch thumb */
  align?: 'center' | 'start'
  /** Apply styles to the wrapper around the label/switch stack */
  containerClassName?: string
  /** Whether to visually hide the label while keeping it for screen readers */
  labelSrOnly?: boolean
  /** Native change handler for compatibility with existing checkbox handlers */
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  /** Name attribute for form submission */
  name?: string
  /** Value attribute for form submission */
  value?: string | number | readonly string[]
  /** Whether the field is required */
  required?: boolean
}

export const Switch = React.forwardRef<
  ElementRef<typeof BaseSwitch>,
  SwitchProps
>(
  (
    {
      id,
      label,
      description,
      error,
      className,
      containerClassName,
      labelSrOnly = false,
      align = 'center',
      name,
      value,
      required,
      disabled,
      checked,
      defaultChecked,
      onChange,
      onCheckedChange,
      ...rest
    },
    ref
  ) => {
    const generatedId = React.useId()
    const switchId = id || generatedId
    const labelId = label ? `${switchId}-label` : undefined
    const descriptionId = description ? `${switchId}-description` : undefined
    const errorId = error ? `${switchId}-error` : undefined
    const hiddenInputRef = React.useRef<HTMLInputElement>(null)

    const isControlled = checked !== undefined
    const [internalChecked, setInternalChecked] = React.useState<boolean>(
      defaultChecked ?? false
    )
    const resolvedChecked = (isControlled ? checked : internalChecked) ?? false

    React.useEffect(() => {
      if (!isControlled && defaultChecked !== undefined) {
        setInternalChecked(defaultChecked)
      }
    }, [defaultChecked, isControlled])

    React.useEffect(() => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.checked = !!resolvedChecked
      }
    }, [resolvedChecked])

    const emitNativeChange = React.useCallback(
      (nextState: boolean) => {
        if (!onChange || !hiddenInputRef.current) {
          return
        }

        hiddenInputRef.current.checked = nextState
        const syntheticEvent = {
          target: hiddenInputRef.current,
          currentTarget: hiddenInputRef.current,
          bubbles: true,
          cancelable: false,
          defaultPrevented: false,
          isTrusted: false,
          preventDefault() {},
          stopPropagation() {},
          nativeEvent: undefined as unknown,
          eventPhase: 0,
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
          persist: () => {},
          timeStamp: Date.now(),
          type: 'change',
        } as React.ChangeEvent<HTMLInputElement>

        onChange(syntheticEvent)
      },
      [onChange]
    )

    const handleCheckedChange = (nextState: boolean) => {
      if (!isControlled) {
        setInternalChecked(nextState)
      }

      onCheckedChange?.(nextState)
      emitNativeChange(nextState)
    }

    const describedByIds =
      [descriptionId, errorId].filter(Boolean).join(' ') || undefined

    const hiddenInput = (
      <input
        ref={hiddenInputRef}
        type="checkbox"
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        value={value ?? 'on'}
        required={required}
        disabled={disabled}
        className="sr-only"
        data-switch-hidden-input
        readOnly
      />
    )

    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        <div
          className={cn(
            'flex items-center justify-between gap-4',
            align === 'start' && 'items-start'
          )}
        >
          {(label || description) && (
            <div className="flex-1">
              {label && (
                <label
                  id={labelId}
                  htmlFor={switchId}
                  className={cn(
                    'text-sm font-medium text-foreground',
                    labelSrOnly && 'sr-only'
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p
                  id={descriptionId}
                  className={cn(
                    'text-xs text-muted-foreground mt-1',
                    labelSrOnly && 'mt-0'
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <BaseSwitch
              id={switchId}
              ref={ref}
              disabled={disabled}
              aria-required={required || undefined}
              aria-labelledby={labelId}
              aria-describedby={describedByIds}
              checked={resolvedChecked}
              onCheckedChange={handleCheckedChange}
              className={className}
              {...rest}
            />
            {hiddenInput}
          </div>
        </div>
        <ErrorMessage error={error} id={errorId} />
      </div>
    )
  }
)

Switch.displayName = 'Switch'
