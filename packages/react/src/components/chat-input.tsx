import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Textarea,
  Button,
  cn,
  type ButtonState,
} from '@clarity-chat/primitives'
import { SendIcon } from './icons'

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
}

/**
 * ChatInput - Message input component for chat interfaces
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
}: ChatInputProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [buttonState, setButtonState] = React.useState<ButtonState>('idle')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // React 19: Compiler automatically optimizes these - no useMemo needed for simple calculations
  const charCount = value.length
  const isOverLimit = maxLength ? charCount > maxLength : false
  const isNearLimit = maxLength ? charCount >= maxLength * warningThreshold : false
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
      { duration: 400, easing: 'ease-in-out' }
    )
  }

  // React 19: Async action with built-in state management
  const handleSubmit = async () => {
    if (!value.trim() || isOverLimit || disabled || buttonState === 'loading') {
      return
    }

    setButtonState('loading')
    try {
      await onSubmit(value)
      setButtonState('success')
      // Auto-reset after showing success
      setTimeout(() => setButtonState('idle'), 1000)
    } catch (error) {
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
      if (value.trim() && !isOverLimit) {
        handleSubmit()
      } else if (isOverLimit) {
        triggerShakeAnimation()
      }
    }
  }

  // Simple handlers - compiler optimizes
  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)

  // Focus ring glow animation variants
  const containerVariants = {
    idle: {
      boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
    },
    focused: glowOnFocus
      ? {
          boxShadow: [
            '0 0 0 0 hsl(var(--primary) / 0)',
            '0 0 0 4px hsl(var(--primary) / 0.15)',
            '0 0 0 4px hsl(var(--primary) / 0.15)',
          ],
          transition: { duration: 0.3, ease: 'easeOut' },
        }
      : {},
  }

  return (
    <motion.div
      className={cn(
        'relative flex flex-col gap-2 p-4 border-t border-border/60 bg-background/95 backdrop-blur-sm shadow-[0_1px_3px_rgba(15,23,42,0.1)]',
        className
      )}
      initial="idle"
      animate={isFocused ? 'focused' : 'idle'}
      variants={containerVariants}
    >
      <div className="flex gap-2 items-end">
        {/* Textarea Container with smooth expand/contract */}
        <motion.div
          className="flex-1 relative"
          layout={animateHeight}
          transition={{ duration: 0.2, ease: 'easeOut' }}
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
            maxLength={maxLength}
            autoResize
            maxRows={6}
            variant={isOverLimit ? 'error' : 'default'}
            className={cn(
              'transition-all duration-200 shadow-[0_1px_3px_rgba(15,23,42,0.1)]',
              isFocused && glowOnFocus && 'ring-[3px] ring-ring/50 shadow-[0_4px_12px_rgba(15,23,42,0.15)]',
              isOverLimit && 'animate-[shake_0.4s_ease-in-out]'
            )}
          />

          {/* Character Counter with progress bar */}
          {maxLength && showCharCounter && (
            <AnimatePresence>
              {charCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute bottom-2 right-2 flex flex-col items-end gap-1"
                >
                  {/* Progress bar */}
                  <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={cn('h-full', progressColor)}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((charCount / maxLength) * 100, 100)}%`,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>

                  {/* Counter text */}
                  <motion.div
                    className={cn('text-xs tabular-nums', counterColor)}
                    animate={isOverLimit ? {
                      scale: [1, 1.05, 1],
                      transition: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    } : undefined}
                  >
                    {charCount}/{maxLength}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Send Button with state transitions */}
        <Button
          onClick={handleSubmit}
          disabled={disabled || !hasContent || isOverLimit}
          state={buttonState}
          size="icon"
          className={cn(
            'transition-all duration-200 ease-out shrink-0 h-11 w-11 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]',
            hasContent && !isOverLimit
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-[1px]'
              : 'bg-muted text-muted-foreground'
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
        >
          <AnimatePresence mode="wait">
            {buttonState === 'idle' && (
              <motion.div
                key="send"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <SendIcon size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {isOverLimit && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-destructive px-1"
          >
            Message exceeds maximum length by {charCount - (maxLength || 0)}{' '}
            characters
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hint text */}
      <AnimatePresence>
        {isFocused && !hasContent && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-muted-foreground px-1"
          >
            Press{' '}
            <kbd className="px-1.5 py-0.5 text-xs border rounded bg-muted">
              Enter
            </kbd>{' '}
            to send •{' '}
            <kbd className="px-1.5 py-0.5 text-xs border rounded bg-muted">
              Shift + Enter
            </kbd>{' '}
            for new line
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

ChatInput.displayName = 'ChatInput'
