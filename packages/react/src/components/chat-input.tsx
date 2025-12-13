'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Textarea,
  Button,
  cn,
  type ButtonState,
} from '@clarity-chat/primitives'
import { SendIcon, MicIcon, PaperclipIcon, XCircleIcon } from './icons'
import {
  useRequestDeduplication,
  isDebouncedError,
} from '../hooks/use-request-deduplication'
import { DURATION_SECONDS } from '../animations/constants'

export interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string, attachments?: File[]) => void | Promise<void>
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
  /** Enable file attachments */
  allowAttachments?: boolean
  /** Enable voice input */
  allowVoice?: boolean
}

/**
 * ChatInput - Mid-Level Composable Component
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat UI
 *
 * A composable input component for chat interfaces with character counting,
 * validation, smooth animations, and support for file attachments and voice input.
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
  allowAttachments = true,
  allowVoice = true,
}: ChatInputProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [buttonState, setButtonState] = React.useState<ButtonState>('idle')
  const [attachments, setAttachments] = React.useState<File[]>([])
  const [isRecording, setIsRecording] = React.useState(false)
  
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Request deduplication to prevent double-submit on rapid clicks
  const { execute: dedupeExecute, isPending } = useRequestDeduplication({
    debounceMs: 300,
  })

  // Validate maxLength prop
  const validMaxLength = maxLength && maxLength > 0 ? maxLength : undefined

  const charCount = value.length
  const isOverLimit = validMaxLength ? charCount > validMaxLength : false
  const isNearLimit = validMaxLength
    ? charCount >= validMaxLength * warningThreshold
    : false
  const hasContent = value.trim().length > 0 || attachments.length > 0

  // Derived styling
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

  const isSubmitPending = isPending('chat-submit')

  const handleSubmit = async () => {
    if (
      (!value.trim() && attachments.length === 0) ||
      isOverLimit ||
      disabled ||
      buttonState === 'loading' ||
      isSubmitPending
    ) {
      return
    }

    setButtonState('loading')
    try {
      await dedupeExecute('chat-submit', async () => {
        await onSubmit(value, attachments)
      })
      setAttachments([]) // Clear attachments on success
      setButtonState('success')
      setTimeout(() => setButtonState('idle'), 1000)
    } catch (error) {
      if (isDebouncedError(error)) {
        setButtonState('idle')
        return
      }
      setButtonState('error')
      console.error('[ChatInput] Submit error:', error)
      setTimeout(() => setButtonState('idle'), 2000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if ((value.trim() || attachments.length > 0) && !isOverLimit && !disabled) {
        handleSubmit()
      } else if (isOverLimit) {
        triggerShakeAnimation()
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)])
      // Reset input value so same file can be selected again
      e.target.value = ''
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const toggleVoice = () => {
    setIsRecording(!isRecording)
    // TODO: Implement actual Web Speech API integration
    if (!isRecording) {
      // Mock dictation
      setTimeout(() => {
        onChange(value + " (Voice input simulation)")
        setIsRecording(false)
      }, 2000)
    }
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    onChange(e.target.value)

  const containerVariants = {
    idle: { boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)' },
    focused: glowOnFocus
      ? {
          boxShadow: [
            '0 0 0 0 hsl(var(--primary) / 0)',
            '0 0 0 4px hsl(var(--primary) / 0.15)',
            '0 0 0 4px hsl(var(--primary) / 0.15)',
          ],
          transition: { duration: DURATION_SECONDS.slow, ease: 'easeOut' },
        }
      : { boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)' },
  } as const satisfies import('framer-motion').Variants

  return (
    <motion.div
      className={cn(
        'relative flex flex-col gap-3 px-5 py-4 border-t border-border/80 bg-background/95 backdrop-blur-md shadow-sm',
        className
      )}
      initial="idle"
      animate={isFocused ? 'focused' : 'idle'}
      variants={containerVariants}
    >
      {/* File Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          >
            {attachments.map((file, i) => (
              <motion.div
                key={`${file.name}-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group shrink-0 flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-border/60 text-xs font-medium max-w-[200px]"
              >
                <span className="truncate">{file.name}</span>
                <button 
                  onClick={() => removeAttachment(i)}
                  className="p-0.5 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                >
                  <XCircleIcon size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 items-end">
        {/* Helper Actions (Left) */}
        {(allowAttachments || allowVoice) && (
          <div className="flex gap-1 pb-1">
            {allowAttachments && (
              <>
                <input 
                  type="file" 
                  multiple 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileSelect}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach file"
                >
                  <PaperclipIcon size={18} />
                </Button>
              </>
            )}
            {allowVoice && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-lg transition-colors",
                  isRecording ? "text-destructive bg-destructive/10 hover:bg-destructive/20" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={toggleVoice}
                title="Voice input"
              >
                <MicIcon size={18} className={isRecording ? "animate-pulse" : ""} />
              </Button>
            )}
          </div>
        )}

        {/* Textarea Container */}
        <motion.div
          className="flex-1 relative"
          layout={animateHeight}
          transition={{ duration: DURATION_SECONDS.normal, ease: 'easeOut' }}
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

          {/* Character Counter */}
          {validMaxLength && showCharCounter && (
            <AnimatePresence>
              {charCount > 0 && (
                <motion.div
                  id="char-counter"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5"
                >
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
                  <motion.div
                    className={cn('text-xs tabular-nums', counterColor)}
                    animate={isOverLimit ? { scale: [1, 1.05, 1], transition: { repeat: Infinity } } : undefined}
                  >
                    {charCount}/{validMaxLength ?? 0}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Send Button */}
        <Button
          onClick={handleSubmit}
          disabled={disabled || !hasContent || isOverLimit || isSubmitPending}
          state={buttonState}
          size="icon"
          className={cn(
            'transition-all duration-200 ease-out shrink-0 h-11 w-11 rounded-xl shadow-sm',
            hasContent && !isOverLimit
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-muted/60 text-muted-foreground border border-border/40'
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
                transition={{ duration: DURATION_SECONDS.fast }}
              >
                <SendIcon size={19} />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {isOverLimit && validMaxLength && (
          <motion.p
            id="char-limit-error"
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-destructive px-1 font-medium"
          >
            Message exceeds maximum length by {charCount - validMaxLength}{' '}
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
            className="text-xs text-muted-foreground/80 px-1 mt-1 ml-[44px]"
          >
            Press <kbd className="px-1 py-0.5 text-[10px] font-semibold border rounded bg-muted/50">Enter</kbd> to send
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

ChatInput.displayName = 'ChatInput'
