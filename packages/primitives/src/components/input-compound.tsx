'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'
import { durations } from '../lib/animation-presets'
import { getErrorAriaAttributes } from '../lib/aria'
import { useComposedRefs } from '../hooks/use-composed-refs'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { Label } from './ui/label'
import { CloseIcon, CharacterCount as SharedCharacterCount } from './icons'

// ============================================================================
// Input Context
// ============================================================================

interface InputContextValue {
  inputId: string
  labelId: string
  errorId: string
  helperId: string
  descriptionId: string
  hasError: boolean
  disabled: boolean
  required: boolean
  value: string
  maxLength?: number
  inputRef: React.RefObject<HTMLInputElement | null>
  setInternalValue: (value: string) => void
  onClear?: () => void
  prefersReducedMotion: boolean
}

const InputContext = React.createContext<InputContextValue | null>(null)

function useInputContext() {
  const context = React.useContext(InputContext)
  if (!context) {
    throw new Error('Input compound components must be used within Input.Root')
  }
  return context
}

// ============================================================================
// Variants
// ============================================================================

const inputFieldVariants = cva(
  [
    'flex w-full rounded-lg border border-input bg-background',
    'px-3 py-2 text-sm shadow-xs ring-offset-background',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'focus-visible:ring-offset-1 focus-visible:border-primary focus-visible:shadow-xs',
    'hover:border-accent-foreground/20',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
    'transition-all duration-200',
  ],
  {
    variants: {
      variant: {
        default: '',
        error: [
          'border-destructive',
          'focus-visible:ring-destructive/20 focus-visible:border-destructive',
        ],
        success: [
          'border-success',
          'focus-visible:ring-success/20 focus-visible:border-success',
        ],
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

// ============================================================================
// Input.Root
// ============================================================================

export interface InputRootProps extends VariantProps<
  typeof inputFieldVariants
> {
  children: React.ReactNode
  className?: string
  /**
   * Controlled value
   */
  value?: string
  /**
   * Default value for uncontrolled mode
   */
  defaultValue?: string
  /**
   * Change handler
   */
  onChange?: (value: string) => void
  /**
   * Error state or message
   */
  error?: boolean | string
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Required state
   */
  required?: boolean
  /**
   * Maximum character length
   */
  maxLength?: number
  /**
   * Clear handler
   */
  onClear?: () => void
  /**
   * Custom ID for the input
   */
  id?: string
}

function InputRoot({
  children,
  className,
  value: controlledValue,
  defaultValue = '',
  onChange,
  error,
  disabled = false,
  required = false,
  maxLength,
  onClear,
  id,
  variant,
  inputSize,
}: InputRootProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Generate IDs
  const generatedId = React.useId()
  const inputId = id || generatedId
  const labelId = `${inputId}-label`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`
  const descriptionId = `${inputId}-description`

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValueState] = React.useState(defaultValue)
  // Handle null/undefined controlled values safely (coerce to empty string)
  const value =
    controlledValue !== undefined && controlledValue !== null
      ? controlledValue
      : internalValue

  const setInternalValue = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValueState(newValue)
      }
      onChange?.(newValue)
    },
    [controlledValue, onChange]
  )

  // Determine error state
  const hasError = Boolean(error)
  const effectiveVariant = hasError ? 'error' : variant

  const contextValue = React.useMemo<InputContextValue>(
    () => ({
      inputId,
      labelId,
      errorId,
      helperId,
      descriptionId,
      hasError,
      disabled,
      required,
      value,
      maxLength,
      inputRef,
      setInternalValue,
      onClear,
      prefersReducedMotion,
    }),
    [
      inputId,
      labelId,
      errorId,
      helperId,
      descriptionId,
      hasError,
      disabled,
      required,
      value,
      maxLength,
      setInternalValue,
      onClear,
      prefersReducedMotion,
    ]
  )

  return (
    <InputContext.Provider value={contextValue}>
      <div
        className={cn('w-full', className)}
        data-slot="input-root"
        data-variant={effectiveVariant}
        data-size={inputSize || 'default'}
        data-disabled={disabled || undefined}
        data-error={hasError || undefined}
      >
        {children}
      </div>
    </InputContext.Provider>
  )
}

InputRoot.displayName = 'Input.Root'

// ============================================================================
// Input.Label
// ============================================================================

export interface InputLabelProps {
  children: React.ReactNode
  className?: string
  /**
   * Visually hide the label (still accessible)
   */
  hidden?: boolean
}

function InputLabel({ children, className, hidden = false }: InputLabelProps) {
  const { labelId, inputId, disabled, required } = useInputContext()

  return (
    <Label
      id={labelId}
      htmlFor={inputId}
      className={cn(
        'mb-1.5 block text-sm font-medium',
        hidden && 'sr-only',
        disabled && 'opacity-50',
        className
      )}
      data-slot="input-label"
    >
      {children}
      {required && (
        <span className="text-destructive ml-0.5" aria-hidden="true">
          *
        </span>
      )}
    </Label>
  )
}

InputLabel.displayName = 'Input.Label'

// ============================================================================
// Input.Field
// ============================================================================

export interface InputFieldProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'value' | 'onChange' | 'disabled' | 'required' | 'maxLength' | 'id'
    >,
    VariantProps<typeof inputFieldVariants> {
  /**
   * Icon element to display
   */
  icon?: React.ReactNode
  /**
   * Position of the icon
   * @default 'left'
   */
  iconPosition?: 'left' | 'right'
  /**
   * Show clear button
   * @default false
   */
  showClear?: boolean
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      variant,
      inputSize,
      icon,
      iconPosition = 'left',
      showClear = false,
      ...props
    },
    forwardedRef
  ) => {
    const {
      inputId,
      labelId,
      errorId,
      helperId,
      hasError,
      disabled,
      required,
      value,
      maxLength,
      inputRef,
      setInternalValue,
      onClear,
      prefersReducedMotion,
    } = useInputContext()

    const composedRef = useComposedRefs(forwardedRef, inputRef)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value)
    }

    const handleClear = () => {
      setInternalValue('')
      onClear?.()
      inputRef.current?.focus()
    }

    const showClearButton = showClear && value.length > 0 && !disabled
    const hasLeftIcon = icon && iconPosition === 'left'
    const hasRightIcon = icon && iconPosition === 'right'

    const paddingLeft = hasLeftIcon ? 'pl-10' : ''
    const paddingRight = cn(
      hasRightIcon && !showClearButton && 'pr-10',
      showClearButton && !hasRightIcon && 'pr-10',
      showClearButton && hasRightIcon && 'pr-16'
    )

    const effectiveVariant = hasError ? 'error' : variant
    const describedBy = [hasError ? errorId : null, helperId]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="relative" data-slot="input-field-wrapper">
        {/* Left icon */}
        {hasLeftIcon && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          id={inputId}
          ref={composedRef}
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          className={cn(
            inputFieldVariants({ variant: effectiveVariant, inputSize }),
            paddingLeft,
            paddingRight,
            className
          )}
          {...getErrorAriaAttributes(hasError, errorId)}
          aria-describedby={describedBy || undefined}
          aria-labelledby={labelId}
          data-slot="input-field"
          {...props}
        />

        {/* Right icon (when no clear button) */}
        {hasRightIcon && !showClearButton && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}

        {/* Right icon (when clear button present) */}
        {hasRightIcon && showClearButton && (
          <div
            className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}

        {/* Clear button with animation */}
        <AnimatePresence>
          {showClearButton && (
            <motion.button
              type="button"
              onClick={handleClear}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'text-muted-foreground hover:text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring/40 rounded',
                'transition-colors duration-150'
              )}
              aria-label="Clear input"
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: durations.fast }}
            >
              <CloseIcon className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

InputField.displayName = 'Input.Field'

// ============================================================================
// Input.Error
// ============================================================================

export interface InputErrorProps {
  children?: React.ReactNode
  className?: string
}

function InputError({ children, className }: InputErrorProps) {
  const { errorId, hasError } = useInputContext()

  if (!hasError || !children) return null

  return (
    <p
      id={errorId}
      className={cn(
        'text-xs text-destructive flex items-center gap-1',
        className
      )}
      role="alert"
      data-slot="input-error"
    >
      <svg
        className="h-3.5 w-3.5 flex-shrink-0"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M7.5 0.875C3.83152 0.875 0.875 3.83152 0.875 7.5C0.875 11.1685 3.83152 14.125 7.5 14.125C11.1685 14.125 14.125 11.1685 14.125 7.5C14.125 3.83152 11.1685 0.875 7.5 0.875ZM7.5 4.25C7.84518 4.25 8.125 4.52982 8.125 4.875V8.125C8.125 8.47018 7.84518 8.75 7.5 8.75C7.15482 8.75 6.875 8.47018 6.875 8.125V4.875C6.875 4.52982 7.15482 4.25 7.5 4.25ZM7.5 10.75C7.84518 10.75 8.125 10.4702 8.125 10.125C8.125 9.77982 7.84518 9.5 7.5 9.5C7.15482 9.5 6.875 9.77982 6.875 10.125C6.875 10.4702 7.15482 10.75 7.5 10.75Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
      {children}
    </p>
  )
}

InputError.displayName = 'Input.Error'

// ============================================================================
// Input.Helper
// ============================================================================

export interface InputHelperProps {
  children: React.ReactNode
  className?: string
}

function InputHelper({ children, className }: InputHelperProps) {
  const { helperId, hasError } = useInputContext()

  // Hide helper when error is shown
  if (hasError) return null

  return (
    <p
      id={helperId}
      className={cn('text-xs text-muted-foreground', className)}
      data-slot="input-helper"
    >
      {children}
    </p>
  )
}

InputHelper.displayName = 'Input.Helper'

// ============================================================================
// Input.CharacterCount
// ============================================================================

export interface InputCharacterCountProps {
  className?: string
  /**
   * Override max value (defaults to maxLength from Root)
   */
  max?: number
}

function InputCharacterCount({ className, max }: InputCharacterCountProps) {
  const { value, maxLength } = useInputContext()
  const effectiveMax = max ?? maxLength

  return (
    <SharedCharacterCount
      current={value.length}
      max={effectiveMax}
      className={className}
    />
  )
}

InputCharacterCount.displayName = 'Input.CharacterCount'

// ============================================================================
// Input.Footer (convenience wrapper for error/helper/count)
// ============================================================================

export interface InputFooterProps {
  children: React.ReactNode
  className?: string
}

function InputFooter({ children, className }: InputFooterProps) {
  return (
    <div
      className={cn('mt-1.5 flex items-start justify-between gap-2', className)}
      data-slot="input-footer"
    >
      {children}
    </div>
  )
}

InputFooter.displayName = 'Input.Footer'

// ============================================================================
// Compound Component Export
// ============================================================================

export const InputCompound = {
  Root: InputRoot,
  Label: InputLabel,
  Field: InputField,
  Error: InputError,
  Helper: InputHelper,
  CharacterCount: InputCharacterCount,
  Footer: InputFooter,
}

// Also export individual components for flexibility
export {
  InputRoot,
  InputLabel,
  InputField,
  InputError,
  InputHelper,
  InputCharacterCount,
  InputFooter,
}
