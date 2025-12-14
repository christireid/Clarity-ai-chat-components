'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { getErrorAriaAttributes } from '../lib/aria'
import { useComposedRefs } from '../hooks/use-composed-refs'
import { ErrorMessage } from './error-message'
import { Textarea as ShadcnTextarea } from './ui/textarea'
import { Label } from './ui/label'
import { CharacterCount } from './icons'

// ============================================================================
// Variants
// ============================================================================

const textareaVariants = cva(
  [
    'flex min-h-[80px] w-full rounded-xl border border-input bg-background',
    'px-3 py-2 text-sm shadow-xs ring-offset-background',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'focus-visible:ring-offset-1 focus-visible:border-primary focus-visible:shadow-xs',
    'hover:border-accent-foreground/20',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
    'transition-all duration-200 resize-none',
  ],
  {
    variants: {
      variant: {
        default: '',
        error: [
          'border-destructive',
          'focus-visible:border-destructive focus-visible:ring-destructive/20',
        ],
        success: [
          'border-success',
          'focus-visible:border-success focus-visible:ring-success/20',
        ],
      },
      textareaSize: {
        default: 'min-h-[80px]',
        sm: 'min-h-[60px] text-xs',
        lg: 'min-h-[120px] text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      textareaSize: 'default',
    },
  }
)

// ============================================================================
// Types
// ============================================================================

export interface TextareaProps
  extends
    Omit<React.ComponentProps<typeof ShadcnTextarea>, 'size'>,
    VariantProps<typeof textareaVariants> {
  /**
   * Label text (creates associated label element)
   */
  label?: string

  /**
   * Error message to display below textarea
   */
  error?: string

  /**
   * Helper text to display below textarea (hidden when error is shown)
   */
  helperText?: string

  /**
   * Auto-resize based on content
   * @default false
   */
  autoResize?: boolean

  /**
   * Maximum number of rows when auto-resizing
   */
  maxRows?: number

  /**
   * Maximum character length (shows counter when provided)
   */
  maxLength?: number

  /**
   * Show character count
   * @default false when maxLength is not set
   */
  showCharacterCount?: boolean

  /**
   * Whether the label should be visually hidden (still accessible)
   * @default false
   */
  hideLabel?: boolean

  /**
   * Whether the textarea is required (shows indicator in label)
   * @default false
   */
  required?: boolean

  /**
   * Size variant
   * @default 'default'
   */
  textareaSize?: 'default' | 'sm' | 'lg'

  /**
   * Additional wrapper className
   */
  wrapperClassName?: string
}

// ============================================================================
// Textarea Component
// ============================================================================

/**
 * Enhanced Textarea component with label, character count, and full accessibility
 *
 * @description
 * A fully-featured textarea component built on shadcn/ui patterns with additional
 * functionality commonly needed in production applications:
 * - Built-in label with proper accessibility associations
 * - Auto-resize based on content
 * - Character count with maxLength support
 * - Error and helper text with proper ARIA
 * - Multiple size variants
 *
 * @example
 * ```tsx
 * // Basic textarea with label
 * <Textarea label="Description" placeholder="Enter description..." />
 *
 * // With character count
 * <Textarea
 *   label="Bio"
 *   maxLength={500}
 *   showCharacterCount
 * />
 *
 * // Auto-resizing with max rows
 * <Textarea
 *   label="Comment"
 *   autoResize
 *   maxRows={10}
 * />
 * ```
 *
 * @accessibility
 * - Label properly associated via htmlFor/id
 * - Error messages linked via aria-describedby
 * - aria-invalid set when error present
 * - Character count announced to screen readers
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      textareaSize,
      label,
      error,
      helperText,
      autoResize = false,
      maxRows,
      maxLength,
      showCharacterCount,
      hideLabel = false,
      required = false,
      wrapperClassName,
      id,
      value,
      defaultValue,
      onChange,
      disabled,
      ...props
    },
    forwardedRef
  ) => {
    // Internal ref for auto-resize functionality
    const internalRef = React.useRef<HTMLTextAreaElement>(null)
    const composedRef = useComposedRefs(forwardedRef, internalRef)

    // Track value for character count
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '')
    const currentValue = value !== undefined ? value : internalValue
    const currentLength = String(currentValue).length

    // Determine if we have an error state
    const hasError = Boolean(error) || variant === 'error'
    const effectiveVariant = hasError ? 'error' : variant

    // Generate stable IDs
    const generatedId = React.useId()
    const textareaId = id || generatedId
    const errorId = error ? `${textareaId}-error` : undefined
    const helperId = helperText && !error ? `${textareaId}-helper` : undefined
    const labelId = label ? `${textareaId}-label` : undefined

    // Combine describedby IDs
    const describedBy =
      [errorId, helperId].filter(Boolean).join(' ') || undefined

    // Determine if character count should show
    const showCount =
      showCharacterCount ||
      (maxLength !== undefined && showCharacterCount !== false)

    // Auto-resize logic
    const adjustHeight = React.useCallback(() => {
      const textarea = internalRef.current
      if (!textarea || !autoResize) return

      // SSR safety check
      if (typeof window === 'undefined' || !window.getComputedStyle) {
        return
      }

      textarea.style.height = 'auto'
      // In non-visual DOM environments (jsdom), scrollHeight can be 0 which makes
      // the textarea effectively “not visible” to user interaction utilities.
      // Fall back to a sensible minimum height to keep it focusable/typable in tests.
      const rawScrollHeight = textarea.scrollHeight
      const scrollHeight = rawScrollHeight > 0 ? rawScrollHeight : 80

      if (maxRows && maxRows > 0) {
        const computedStyle = getComputedStyle(textarea)
        const lineHeightStr = computedStyle.lineHeight
        // Parse lineHeight, fallback to 1.2em (typical default) if invalid
        const lineHeight =
          lineHeightStr === 'normal'
            ? parseFloat(computedStyle.fontSize) * 1.2
            : parseFloat(lineHeightStr) ||
              parseFloat(computedStyle.fontSize) * 1.2

        if (isNaN(lineHeight) || lineHeight <= 0) {
          // Fallback: use fontSize * 1.2 if lineHeight is invalid
          const fontSize = parseFloat(computedStyle.fontSize) || 16
          const fallbackLineHeight = fontSize * 1.2
          const maxHeight = fallbackLineHeight * maxRows
          textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
        } else {
          const maxHeight = lineHeight * maxRows
          textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
        }
      } else {
        textarea.style.height = `${scrollHeight}px`
      }
    }, [autoResize, maxRows])

    React.useEffect(() => {
      adjustHeight()
    }, [adjustHeight, currentValue])

    // Handle change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value)
      }
      adjustHeight()
      onChange?.(e)
    }

    return (
      <div
        className={cn('w-full', wrapperClassName)}
        data-slot="textarea-wrapper"
      >
        {/* Label */}
        {label && (
          <Label
            id={labelId}
            htmlFor={textareaId}
            className={cn(
              'mb-1.5 block text-sm font-medium',
              hideLabel && 'sr-only',
              disabled && 'opacity-50'
            )}
          >
            {label}
            {required && (
              <span className="text-destructive ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </Label>
        )}

        {/* Textarea */}
        <ShadcnTextarea
          id={textareaId}
          ref={composedRef}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          className={cn(
            textareaVariants({ variant: effectiveVariant, textareaSize }),
            className
          )}
          {...getErrorAriaAttributes(hasError, errorId)}
          aria-describedby={describedBy}
          aria-labelledby={labelId}
          data-slot="textarea"
          data-variant={effectiveVariant}
          data-size={textareaSize || 'default'}
          {...props}
        />

        {/* Footer row: error/helper text + character count */}
        {(error || helperText || showCount) && (
          <div className="mt-1.5 flex items-start justify-between gap-2">
            <div className="flex-1">
              {/* Error message */}
              {error && <ErrorMessage error={error} id={errorId} />}

              {/* Helper text (hidden when error is shown) */}
              {helperText && !error && (
                <p
                  id={helperId}
                  className="text-xs text-muted-foreground"
                  data-slot="textarea-helper"
                >
                  {helperText}
                </p>
              )}
            </div>

            {/* Character count */}
            {showCount && (
              <CharacterCount current={currentLength} max={maxLength} />
            )}
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
