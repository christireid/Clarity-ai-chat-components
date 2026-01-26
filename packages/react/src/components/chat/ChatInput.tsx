'use client'

import { logger } from '@clarity-chat/utils/logger'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Textarea, Button, cn, glassVariants } from '@clarity-chat/primitives'
import { SendIcon } from '../ui/icons'
import {
  useRequestDeduplication,
  isDebouncedError,
} from '../../hooks/resilience/use-request-deduplication'
import {
  validateStringProp,
  validateFunctionProp,
} from '../../utils/config/runtime-validation'
import { DURATION_SECONDS, ANIMATION_PRESETS } from '../../animations/constants'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'

/** Button state for submit button */
type ButtonState = 'idle' | 'loading' | 'success' | 'error'

export interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void | Promise<void>
  placeholder?: string
  disabled?: boolean
  /** Maximum character length */
  maxLength?: number
  /** Show character counter (default: true if maxLength is set) */
  showCharCounter?: boolean
  /** Warning threshold percentage (default: 80%) */
  warningThreshold?: number
  /** Enable smooth expand/contract animation */
  animateHeight?: boolean
  /** Enable focus ring glow animation */
  glowOnFocus?: boolean
  className?: string
  /** HTML id attribute for skip link targeting */
  id?: string
  /** ARIA label for screen readers */
  'aria-label'?: string
}

/**
 * ChatInput - Mid-Level Composable Component
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat UI
 *
 * A composable input component for chat interfaces with character counting,
 * validation, and smooth animations.
 *
 * For drop-in usage, use top-level `ClarityChat` component instead.
 * For custom input rendering, use low-level primitives.
 *
 * @example
 * ```tsx
 * const [input, setInput] = useState('')
 *
 * <ChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={async (value) => {
 *     await sendMessage(value)
 *     setInput('')
 *   }}
 *   maxLength={1000}
 * />
 * ```
 *
 * A mid-level building block for chat input functionality. Provides a textarea
 * with character counting, validation, animations, and submit handling.
 *
 * **Features:**
 * - Character counter with warning thresholds
 * - Auto-resizing textarea
 * - Smooth animations (height, focus glow)
 * - Keyboard shortcuts (Enter to submit, Shift+Enter for newline)
 * - Disabled state handling
 * - Max length validation
 *
 * **When to use:**
 * - Building custom chat interfaces
 * - Need input with character counting
 * - Want smooth animations
 *
 * **When NOT to use:**
 * - For simplest setup, use `ClarityChat` component (includes input)
 * - For basic text input without chat features, use standard HTML input
 *
 * @param props - ChatInput configuration
 * @param props.value - Current input value (controlled)
 * @param props.onChange - Callback when value changes
 * @param props.onSubmit - Callback when form is submitted (Enter key or button click)
 * @param props.placeholder - Placeholder text (default: 'Type a message...')
 * @param props.disabled - Disable input (default: false)
 * @param props.maxLength - Maximum character length
 * @param props.showCharCounter - Show character counter (default: true if maxLength is set)
 * @param props.warningThreshold - Warning threshold percentage (default: 0.8 = 80%)
 * @param props.animateHeight - Enable smooth expand/contract animation (default: true)
 * @param props.glowOnFocus - Enable focus ring glow animation (default: true)
 * @param props.className - Optional CSS class name
 *
 * @example Basic usage
 * ```tsx
 * function MyChatInput() {
 *   const [value, setValue] = useState('')
 *
 *   return (
 *     <ChatInput
 *       value={value}
 *       onChange={setValue}
 *       onSubmit={(text) => {
 *         sendMessage(text)
 *         setValue('')
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @example With character limit
 * ```tsx
 * <ChatInput
 *   value={value}
 *   onChange={setValue}
 *   onSubmit={handleSubmit}
 *   maxLength={500}
 *   showCharCounter
 *   warningThreshold={0.9} // Warn at 90%
 * />
 * ```
 *
 * @example Disabled state
 * ```tsx
 * <ChatInput
 *   value={value}
 *   onChange={setValue}
 *   onSubmit={handleSubmit}
 *   disabled={isLoading}
 * />
 * ```
 */
export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type a message...',
  disabled = false,
  maxLength,
  showCharCounter = true,
  warningThreshold = 0.8,
  animateHeight = true,
  glowOnFocus = true,
  className,
  id,
  'aria-label': ariaLabel,
}: ChatInputProps) {
  // Development-only runtime validation
  if (process.env.NODE_ENV === 'development') {
    try {
      validateStringProp(value, 'value', 'ChatInput')
      validateFunctionProp(onChange, 'onChange', 'ChatInput')
      validateFunctionProp(onSubmit, 'onSubmit', 'ChatInput')
    } catch (error) {
      console.error(error)
    }
  }
  const [isFocused, setIsFocused] = React.useState(false)
  const [buttonState, setButtonState] = React.useState<ButtonState>('idle')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Request deduplication to prevent double-submit on rapid clicks
  const { execute: dedupeExecute, isPending } = useRequestDeduplication({
    debounceMs: 300,
  })

  // Validate maxLength prop
  const validMaxLength = maxLength && maxLength > 0 ? maxLength : undefined

  // React 19: Compiler automatically optimizes these - no useMemo needed for simple calculations
  const charCount = value.length
  const isOverLimit = validMaxLength ? charCount > validMaxLength : false
  const isNearLimit = validMaxLength
    ? charCount >= validMaxLength * warningThreshold
    : false
  const hasContent = value.trim().length > 0

  // Derived styling - compiler optimizes
  const counterColor = isOverLimit
    ? 'text-destructive font-semibold'
    : isNearLimit
      ? 'text-[hsl(var(--warning))] font-medium'
      : charCount > 0
        ? 'text-primary'
        : 'text-muted-foreground'

  const progressColor = isOverLimit
    ? 'bg-destructive'
    : isNearLimit
      ? 'bg-[hsl(var(--warning))]'
      : 'bg-primary'

  // Shake animation - keep this as it references DOM directly
  const triggerShakeAnimation = () => {
    textareaRef.current?.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: DURATION_SECONDS.slower * 1000, easing: 'ease-in-out' }
    )
  }

  // Check if submit is blocked by deduplication
  const isSubmitPending = isPending('chat-submit')

  // React 19: Async action with built-in state management + deduplication
  const handleSubmit = async () => {
    const trimmedValue = value.trim()
    if (
      !trimmedValue ||
      isOverLimit ||
      disabled ||
      buttonState === 'loading' ||
      isSubmitPending
    ) {
      return
    }

    setButtonState('loading')
    try {
      // Wrap submission with deduplication to prevent double-submit
      await dedupeExecute('chat-submit', async () => {
        await onSubmit(trimmedValue)
      })
      setButtonState('success')
      // Auto-reset after showing success
      setTimeout(() => setButtonState('idle'), 1000)
    } catch (error) {
      // Ignore debounced/deduplicated requests
      if (isDebouncedError(error)) {
        setButtonState('idle')
        return
      }
      setButtonState('error')
      console.error('[ChatInput] Submit error:', error)
      // Auto-reset after showing error
      setTimeout(() => setButtonState('idle'), 2000)
    }
  }

  // React 19: Compiler optimizes event handlers - no useCallback needed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isOverLimit && !disabled) {
        handleSubmit()
      } else if (isOverLimit) {
        triggerShakeAnimation()
      }
    }
  }

  // Simple handlers - compiler optimizes
  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    onChange(e.target.value)

  // Focus ring glow animation variants
  // Leveraging Framer Motion v12's improved type inference - no explicit type needed
  const containerVariants = {
    idle: {
      boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
    },
    focused:
      glowOnFocus && !prefersReducedMotion
        ? {
            boxShadow: [
              '0 0 0 0 hsl(var(--primary) / 0)',
              '0 0 0 4px hsl(var(--primary) / 0.15)',
              '0 0 0 4px hsl(var(--primary) / 0.15)',
            ],
            transition: { duration: DURATION_SECONDS.slow, ease: 'easeOut' },
          }
        : {
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
          },
  } as const satisfies import('framer-motion').Variants

  return (
    <motion.div
      id={id}
      className={cn(
        glassVariants({
          intensity: 'strong',
          gradient: 'none',
          border: 'none', // No border needed as it has border-t
          animated: 'none',
        }),
        'relative flex flex-col gap-3 px-5 py-4',
        'border-t border-glass-light dark:border-glass-dark-light',
        className
      )}
      initial="idle"
      animate={isFocused ? 'focused' : 'idle'}
      variants={containerVariants}
      viewport={{ once: true }}
      tabIndex={-1} // Allow focus for skip link targeting
    >
      <div className="flex gap-3 items-end">
        {/* Textarea Container with smooth expand/contract */}
        <motion.div
          className="flex-1 relative"
          layout={animateHeight && !prefersReducedMotion}
          transition={{
            duration: prefersReducedMotion ? 0 : DURATION_SECONDS.normal,
            ease: 'easeOut',
          }}
          viewport={{ once: true }}
        >
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={validMaxLength}
            aria-label={ariaLabel ?? 'Message'}
            aria-disabled={disabled}
            aria-invalid={isOverLimit}
            aria-errormessage={isOverLimit ? 'char-limit-error' : undefined}
            autoResize
            maxRows={6}
            variant={isOverLimit ? 'error' : 'default'}
            className={cn(
              'transition-all duration-200 shadow-sm border-border/40',
              isFocused &&
                glowOnFocus &&
                'ring-2 ring-ring/30 shadow-md border-ring/50',
              isOverLimit && 'animate-[shake_0.4s_ease-in-out]'
            )}
          />

          {/* Character Counter with progress bar */}
          {validMaxLength &&
            showCharCounter &&
            charCount > 0 &&
            (prefersReducedMotion ? (
              <div
                id="char-counter"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5"
              >
                {/* Progress bar */}
                <div className="w-20 h-1.5 bg-muted/60 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={cn('h-full', progressColor)}
                    style={{
                      width: `${validMaxLength ? Math.min((charCount / validMaxLength) * 100, 100) : 0}%`,
                    }}
                  />
                </div>

                {/* Counter text */}
                <div className={cn('text-xs tabular-nums', counterColor)}>
                  {charCount}/{validMaxLength ?? 0}
                </div>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  id="char-counter"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  {...ANIMATION_PRESETS.slideUp}
                  className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5"
                >
                  {/* Progress bar */}
                  <div className="w-20 h-1.5 bg-muted/60 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className={cn('h-full', progressColor)}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${validMaxLength ? Math.min((charCount / validMaxLength) * 100, 100) : 0}%`,
                      }}
                      transition={{ duration: DURATION_SECONDS.normal }}
                    />
                  </div>

                  {/* Counter text */}
                  <motion.div
                    className={cn('text-xs tabular-nums', counterColor)}
                    animate={
                      isOverLimit
                        ? {
                            scale: [1, 1.05, 1],
                            transition: {
                              duration: DURATION_SECONDS.slower,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            },
                          }
                        : undefined
                    }
                  >
                    {charCount}/{validMaxLength ?? 0}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            ))}
        </motion.div>

        {/* Send Button with state transitions - Enhanced with gradient and glow */}
        <Button
          onClick={handleSubmit}
          disabled={disabled || !hasContent || isOverLimit || isSubmitPending}
          state={buttonState}
          size="icon"
          className={cn(
            'transition-all duration-200 ease-out shrink-0 h-11 w-11 rounded-xl',
            hasContent && !isOverLimit
              ? [
                  'bg-gradient-to-br from-primary via-primary to-primary/85',
                  'text-primary-foreground',
                  'shadow-[0_4px_14px_-3px_hsl(var(--primary)/0.4)]',
                  'hover:shadow-[0_6px_20px_-3px_hsl(var(--primary)/0.5)]',
                  'hover:scale-[1.03] hover:-translate-y-0.5',
                  'active:scale-[0.97] active:translate-y-0',
                  'active:shadow-[0_2px_8px_-2px_hsl(var(--primary)/0.4)]',
                ]
              : 'bg-muted/50 text-muted-foreground border border-border/30 shadow-sm'
          )}
          aria-label={
            buttonState === 'loading'
              ? 'Sending message...'
              : buttonState === 'success'
                ? 'Message sent!'
                : buttonState === 'error'
                  ? 'Failed to send'
                  : 'Send message'
          }
          aria-describedby={
            validMaxLength && showCharCounter ? 'char-counter' : undefined
          }
        >
          {prefersReducedMotion ? (
            buttonState === 'idle' && <SendIcon size={19} />
          ) : (
            <AnimatePresence mode="wait">
              {buttonState === 'idle' && (
                <motion.div
                  key="send"
                  {...ANIMATION_PRESETS.pop}
                  transition={{ duration: DURATION_SECONDS.fast }}
                >
                  <SendIcon size={19} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </Button>
      </div>

      {/* Error message */}
      {isOverLimit &&
        validMaxLength &&
        (prefersReducedMotion ? (
          <p
            id="char-limit-error"
            role="alert"
            aria-live="assertive"
            className="text-xs text-destructive px-1 font-medium"
          >
            Message exceeds maximum length by {charCount - validMaxLength}{' '}
            characters
          </p>
        ) : (
          <AnimatePresence>
            <motion.p
              id="char-limit-error"
              role="alert"
              aria-live="assertive"
              {...ANIMATION_PRESETS.collapse}
              className="text-xs text-destructive px-1 font-medium"
            >
              Message exceeds maximum length by {charCount - validMaxLength}{' '}
              characters
            </motion.p>
          </AnimatePresence>
        ))}

      {/* Hint text - increased spacing to prevent crowding with focus ring */}
      {isFocused &&
        !hasContent &&
        (prefersReducedMotion ? (
          <p className="text-xs text-muted-foreground/80 px-1 mt-1">
            Press{' '}
            <kbd className="px-2 py-0.5 text-[10px] font-semibold border border-border/60 rounded-md bg-muted/50 shadow-sm">
              Enter
            </kbd>{' '}
            to send •{' '}
            <kbd className="px-2 py-0.5 text-[10px] font-semibold border border-border/60 rounded-md bg-muted/50 shadow-sm">
              Shift + Enter
            </kbd>{' '}
            for new line
          </p>
        ) : (
          <AnimatePresence>
            <motion.p
              {...ANIMATION_PRESETS.slideDown}
              className="text-xs text-muted-foreground/80 px-1 mt-1"
            >
              Press{' '}
              <kbd className="px-2 py-0.5 text-[10px] font-semibold border border-border/60 rounded-md bg-muted/50 shadow-sm">
                Enter
              </kbd>{' '}
              to send •{' '}
              <kbd className="px-2 py-0.5 text-[10px] font-semibold border border-border/60 rounded-md bg-muted/50 shadow-sm">
                Shift + Enter
              </kbd>{' '}
              for new line
            </motion.p>
          </AnimatePresence>
        ))}
    </motion.div>
  )
}

ChatInput.displayName = 'ChatInput'
