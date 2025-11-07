import { memo, useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Textarea,
  Button,
  cn,
  type ButtonState,
} from '@clarity-chat/primitives'
import { SendIcon } from './icons'
import { FeedbackAnimations } from '../animations/microanimations'

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

// Shake animation keyframes - extracted as constant
const SHAKE_KEYFRAMES = [
  { transform: 'translateX(0)' },
  { transform: 'translateX(-8px)' },
  { transform: 'translateX(8px)' },
  { transform: 'translateX(-8px)' },
  { transform: 'translateX(8px)' },
  { transform: 'translateX(0)' },
] as const

const SHAKE_OPTIONS = { duration: 400, easing: 'ease-in-out' } as const

export const ChatInput = memo(function ChatInput({
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
  const [isFocused, setIsFocused] = useState(false)
  const [buttonState, setButtonState] = useState<ButtonState>('idle')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Memoized computed values
  const charCount = useMemo(() => value.length, [value])
  const isOverLimit = useMemo(
    () => (maxLength ? charCount > maxLength : false),
    [maxLength, charCount]
  )
  const isNearLimit = useMemo(
    () => (maxLength ? charCount >= maxLength * warningThreshold : false),
    [maxLength, charCount, warningThreshold]
  )
  const hasContent = useMemo(() => value.trim().length > 0, [value])

  // Memoized character counter color
  const counterColor = useMemo(() => {
    if (isOverLimit) return 'text-destructive font-semibold'
    if (isNearLimit) return 'text-[hsl(var(--warning))] font-medium'
    if (charCount > 0) return 'text-primary'
    return 'text-muted-foreground'
  }, [isOverLimit, isNearLimit, charCount])

  // Memoized progress bar color
  const progressColor = useMemo(() => {
    if (isOverLimit) return 'bg-destructive'
    if (isNearLimit) return 'bg-[hsl(var(--warning))]'
    return 'bg-primary'
  }, [isOverLimit, isNearLimit])

  // Memoized container animation variants
  const containerVariants = useMemo(
    () => ({
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
    }),
    [glowOnFocus]
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Optimized submit handler with useCallback
  const handleSubmit = useCallback(async () => {
    if (!value.trim() || isOverLimit || disabled || buttonState === 'loading')
      return

    setButtonState('loading')
    try {
      await onSubmit(value)
      setButtonState('success')
      // Auto-reset after showing success
      timeoutRef.current = setTimeout(() => setButtonState('idle'), 1000)
    } catch (error) {
      setButtonState('error')
      console.error('[ChatInput] Submit error:', error)
      // Auto-reset after showing error
      timeoutRef.current = setTimeout(() => setButtonState('idle'), 2000)
    }
  }, [value, isOverLimit, disabled, buttonState, onSubmit])

  // Optimized keydown handler with useCallback
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (value.trim() && !isOverLimit) {
          handleSubmit()
        } else if (isOverLimit) {
          // Shake animation for error feedback
          textareaRef.current?.animate(SHAKE_KEYFRAMES, SHAKE_OPTIONS)
        }
      }
    },
    [value, isOverLimit, handleSubmit]
  )

  // Memoized change handler
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  // Memoized focus handlers
  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  // Memoized progress percentage
  const progressPercentage = useMemo(() => {
    if (!maxLength) return 0
    return Math.min((charCount / maxLength) * 100, 100)
  }, [maxLength, charCount])

  return (
    <motion.div
      className={cn(
        'relative flex flex-col gap-2 p-4 border-t-2 bg-background/95 backdrop-blur-sm',
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
              'transition-all duration-200 shadow-sm',
              isFocused && glowOnFocus && 'ring-2 ring-primary/30 shadow-md',
              isOverLimit && 'animate-[shake_0.4s_ease-in-out]'
            )}
            aria-label="Message input"
            aria-invalid={isOverLimit}
            aria-describedby={isOverLimit ? 'chat-input-error' : undefined}
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
                  <div className="w-16 h-1 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={charCount} aria-valuemin={0} aria-valuemax={maxLength}>
                    <motion.div
                      className={cn('h-full', progressColor)}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${progressPercentage}%`,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>

                  {/* Counter text */}
                  <motion.div
                    className={cn('text-xs tabular-nums', counterColor)}
                    animate={isOverLimit ? FeedbackAnimations.pulse : {}}
                    aria-live="polite"
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
            'transition-all duration-200 shrink-0 shadow-sm',
            hasContent && !isOverLimit
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5'
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
            id="chat-input-error"
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-destructive px-1"
            aria-live="assertive"
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
            to send ?{' '}
            <kbd className="px-1.5 py-0.5 text-xs border rounded bg-muted">
              Shift + Enter
            </kbd>{' '}
            for new line
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

ChatInput.displayName = 'ChatInput'
