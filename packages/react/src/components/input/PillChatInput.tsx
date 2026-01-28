'use client'

/**
 * PillChatInput Component
 *
 * Modern, pill-shaped chat input with a clean, floating design.
 * Inspired by modern AI chat interfaces like Claude, ChatGPT, and prompt-kit.
 *
 * Features:
 * - Pill-shaped container with rounded corners
 * - Floating appearance with subtle shadow
 * - Auto-resizing textarea
 * - Send button integrated into the design
 * - Attachment button support
 * - Stop generation button
 * - Character counter
 * - Focus states with glow effect
 * - Fully accessible
 *
 * @example
 * ```tsx
 * // Basic usage
 * <PillChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={handleSubmit}
 * />
 *
 * // With streaming control
 * <PillChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={handleSubmit}
 *   isGenerating={isStreaming}
 *   onStop={stopGeneration}
 * />
 *
 * // With attachments
 * <PillChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={handleSubmit}
 *   onAttach={handleAttachment}
 * />
 * ```
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Size variants
 */
export type PillChatInputSize = 'sm' | 'md' | 'lg'

/**
 * Props for PillChatInput
 */
export interface PillChatInputProps {
  /** Current value (controlled) */
  value: string
  /** Value change handler */
  onChange: (value: string) => void
  /** Submit handler (Enter key or button) */
  onSubmit: (value: string) => void | Promise<void>
  /** Placeholder text */
  placeholder?: string
  /** Whether input is disabled */
  disabled?: boolean
  /** Whether AI is currently generating */
  isGenerating?: boolean
  /** Stop generation handler */
  onStop?: () => void
  /** Attachment handler */
  onAttach?: () => void
  /** Maximum character length */
  maxLength?: number
  /** Show character counter */
  showCharCounter?: boolean
  /** Size variant */
  size?: PillChatInputSize
  /** Auto-focus on mount */
  autoFocus?: boolean
  /** Minimum rows */
  minRows?: number
  /** Maximum rows (before scrolling) */
  maxRows?: number
  /** Additional CSS class */
  className?: string
  /** ID for the input element */
  id?: string
  /** ARIA label */
  'aria-label'?: string
  /** Disable animations */
  disableAnimations?: boolean
  /** Left slot (before textarea) */
  leftSlot?: React.ReactNode
  /** Right slot (after send button) */
  rightSlot?: React.ReactNode
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Size configurations
 */
const SIZE_CONFIG: Record<PillChatInputSize, {
  container: string
  textarea: string
  button: string
  iconSize: number
}> = {
  sm: {
    container: 'chat-input-pill px-3 py-2',
    textarea: 'text-sm min-h-[32px]',
    button: 'w-7 h-7',
    iconSize: 14,
  },
  md: {
    container: 'chat-input-pill px-4 py-3',
    textarea: 'text-base min-h-[40px]',
    button: 'w-9 h-9',
    iconSize: 18,
  },
  lg: {
    container: 'chat-input-pill px-5 py-4',
    textarea: 'text-lg min-h-[48px]',
    button: 'w-11 h-11',
    iconSize: 22,
  },
}

// =============================================================================
// ICONS
// =============================================================================

const SendIcon = React.memo(function SendIcon({
  size = 18,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
})

SendIcon.displayName = 'SendIcon'

const StopIcon = React.memo(function StopIcon({
  size = 18,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  )
})

StopIcon.displayName = 'StopIcon'

const AttachIcon = React.memo(function AttachIcon({
  size = 18,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
})

AttachIcon.displayName = 'AttachIcon'

// =============================================================================
// AUTO-RESIZE TEXTAREA
// =============================================================================

interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number
  maxRows?: number
}

const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(function AutoResizeTextarea(
  { minRows = 1, maxRows = 5, className, value, onChange, ...props },
  ref
) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const combinedRef = React.useCallback(
    (node: HTMLTextAreaElement) => {
      textareaRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref]
  )

  // Auto-resize effect
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get accurate scrollHeight
    textarea.style.height = 'auto'

    // Calculate line height from computed styles
    const computedStyle = window.getComputedStyle(textarea)
    const lineHeight = parseInt(computedStyle.lineHeight, 10) || 24
    const paddingTop = parseInt(computedStyle.paddingTop, 10) || 0
    const paddingBottom = parseInt(computedStyle.paddingBottom, 10) || 0

    const minHeight = lineHeight * minRows + paddingTop + paddingBottom
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom

    // Set height based on content, clamped between min and max
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
    textarea.style.height = `${newHeight}px`
  }, [value, minRows, maxRows])

  return (
    <textarea
      ref={combinedRef}
      value={value}
      onChange={onChange}
      className={cn(
        'resize-none bg-transparent outline-none w-full',
        'placeholder:text-muted-foreground/60',
        'scrollbar-hide',
        className
      )}
      rows={minRows}
      {...props}
    />
  )
})

AutoResizeTextarea.displayName = 'AutoResizeTextarea'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * PillChatInput - Modern pill-shaped chat input
 *
 * A clean, modern chat input with a floating pill design. Integrates
 * seamlessly with the CSS classes defined in globals.css.
 */
export function PillChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Message...',
  disabled = false,
  isGenerating = false,
  onStop,
  onAttach,
  maxLength,
  showCharCounter = false,
  size = 'md',
  autoFocus = false,
  minRows = 1,
  maxRows = 5,
  className,
  id,
  'aria-label': ariaLabel = 'Chat input',
  disableAnimations = false,
  leftSlot,
  rightSlot,
}: PillChatInputProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const sizeConfig = SIZE_CONFIG[size]

  // Character count
  const charCount = value.length
  const isOverLimit = maxLength ? charCount > maxLength : false
  const isNearLimit = maxLength ? charCount > maxLength * 0.8 : false

  // Can submit check
  const canSubmit = value.trim().length > 0 && !disabled && !isSubmitting && !isOverLimit

  // Handle submit
  const handleSubmit = React.useCallback(async () => {
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      await onSubmit(value.trim())
    } finally {
      setIsSubmitting(false)
    }
  }, [canSubmit, onSubmit, value])

  // Keyboard handler
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter without shift to submit
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (isGenerating && onStop) {
          onStop()
        } else {
          handleSubmit()
        }
      }
    },
    [handleSubmit, isGenerating, onStop]
  )

  // Focus management
  React.useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className={cn('relative', className)}>
      {/* Main container */}
      <motion.div
        animate={
          isFocused && !prefersReducedMotion
            ? { boxShadow: '0 0 0 2px hsl(var(--primary) / 0.2)' }
            : { boxShadow: '0 0 0 0px transparent' }
        }
        transition={{
          duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
          ease: EASING_FRAMER.out,
        }}
        className={cn(
          sizeConfig.container,
          isFocused && 'chat-input-focus',
          disabled && 'opacity-50 pointer-events-none',
        )}
      >
        <div className="flex items-end gap-2">
          {/* Left slot (attachment button) */}
          {(leftSlot || onAttach) && (
            <div className="flex-shrink-0 pb-0.5">
              {leftSlot || (
                <button
                  type="button"
                  onClick={onAttach}
                  className={cn(
                    'flex items-center justify-center rounded-full',
                    'text-muted-foreground hover:text-foreground',
                    'hover:bg-muted/50 transition-colors',
                    sizeConfig.button
                  )}
                  aria-label="Attach file"
                >
                  <AttachIcon size={sizeConfig.iconSize} />
                </button>
              )}
            </div>
          )}

          {/* Textarea */}
          <div className="flex-1 min-w-0">
            <AutoResizeTextarea
              ref={textareaRef}
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled || isSubmitting}
              maxLength={maxLength}
              minRows={minRows}
              maxRows={maxRows}
              className={sizeConfig.textarea}
              aria-label={ariaLabel}
              aria-describedby={showCharCounter ? `${id}-counter` : undefined}
            />
          </div>

          {/* Action button */}
          <div className="flex-shrink-0 pb-0.5">
            <AnimatePresence mode="wait">
              {isGenerating && onStop ? (
                <motion.button
                  key="stop"
                  type="button"
                  onClick={onStop}
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.fast,
                    ease: EASING_FRAMER.out,
                  }}
                  className={cn(
                    'chat-input-send-btn',
                    'bg-destructive text-destructive-foreground',
                    'hover:bg-destructive/90',
                    sizeConfig.button
                  )}
                  aria-label="Stop generation"
                >
                  <StopIcon size={sizeConfig.iconSize - 4} />
                </motion.button>
              ) : (
                <motion.button
                  key="send"
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.fast,
                    ease: EASING_FRAMER.out,
                  }}
                  className={cn(
                    'chat-input-send-btn',
                    sizeConfig.button,
                    canSubmit
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                  aria-label={isSubmitting ? 'Sending...' : 'Send message'}
                >
                  {isSubmitting ? (
                    <div
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <SendIcon size={sizeConfig.iconSize} />
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Right slot */}
          {rightSlot && (
            <div className="flex-shrink-0 pb-0.5">
              {rightSlot}
            </div>
          )}
        </div>
      </motion.div>

      {/* Character counter */}
      {showCharCounter && maxLength && (
        <div
          id={`${id}-counter`}
          className={cn(
            'absolute right-4 -bottom-5 text-xs tabular-nums',
            isOverLimit
              ? 'text-destructive'
              : isNearLimit
                ? 'text-warning'
                : 'text-muted-foreground/60'
          )}
          aria-live="polite"
        >
          {charCount}/{maxLength}
        </div>
      )}
    </div>
  )
}

PillChatInput.displayName = 'PillChatInput'

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook for managing PillChatInput state
 */
export interface UsePillChatInputOptions {
  /** Initial value */
  initialValue?: string
  /** Clear on submit */
  clearOnSubmit?: boolean
  /** Submit handler */
  onSubmit?: (value: string) => void | Promise<void>
}

export interface UsePillChatInputReturn {
  /** Current value */
  value: string
  /** Set value */
  setValue: (value: string) => void
  /** Clear value */
  clear: () => void
  /** Handle submit */
  handleSubmit: (value: string) => Promise<void>
  /** Props for PillChatInput */
  inputProps: {
    value: string
    onChange: (value: string) => void
    onSubmit: (value: string) => void | Promise<void>
  }
}

export function usePillChatInput({
  initialValue = '',
  clearOnSubmit = true,
  onSubmit,
}: UsePillChatInputOptions = {}): UsePillChatInputReturn {
  const [value, setValue] = React.useState(initialValue)

  const clear = React.useCallback(() => {
    setValue('')
  }, [])

  const handleSubmit = React.useCallback(
    async (val: string) => {
      if (onSubmit) {
        await onSubmit(val)
      }
      if (clearOnSubmit) {
        clear()
      }
    },
    [onSubmit, clearOnSubmit, clear]
  )

  return {
    value,
    setValue,
    clear,
    handleSubmit,
    inputProps: {
      value,
      onChange: setValue,
      onSubmit: handleSubmit,
    },
  }
}
