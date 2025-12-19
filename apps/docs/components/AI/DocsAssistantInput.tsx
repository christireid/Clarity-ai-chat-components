'use client'

/**
 * DocsAssistantInput - Custom input with slash and @ command support
 *
 * Features:
 * - Slash commands (/) for actions like /help, /clear, /diagram
 * - @ mentions for component/hook lookups like @ChatInput, @useChat
 * - Keyboard navigation for command menu
 * - Smooth animations with reduced motion support
 */

import { useState, useRef, useCallback, memo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Textarea, Button } from '@clarity-chat/primitives'
import { useReducedMotion, useToast } from '@clarity-chat/react'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DURATION_SECONDS as durations } from '@/lib/animations'
import { CommandMenu, useSlashCommands, type Command } from './CommandMenu'

// ============================================================================
// Types
// ============================================================================

export interface DocsAssistantInputProps {
  onSendMessage: (message: string) => void
  onClear?: () => void
  onExport?: () => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

// ============================================================================
// Component
// ============================================================================

export const DocsAssistantInput = memo(function DocsAssistantInput({
  onSendMessage,
  onClear,
  onExport,
  disabled = false,
  placeholder = 'Ask about Clarity Chat... (Type / for commands, @ to mention)',
  className,
}: DocsAssistantInputProps) {
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const toast = useToast()

  // Command menu state
  const {
    isMenuOpen,
    triggerType,
    filter,
    handleInputChange,
    handleCommandSelect,
    closeMenu,
  } = useSlashCommands({
    onClear: () => {
      onClear?.()
      setValue('')
      toast.info('Conversation cleared')
    },
    onExport: () => {
      onExport?.()
      toast.success('Conversation exported')
    },
  })

  // Handle input changes and detect commands
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      const cursorPosition = e.target.selectionStart
      setValue(newValue)
      handleInputChange(newValue, cursorPosition)
    },
    [handleInputChange]
  )

  // Handle command selection from menu
  const handleSelectCommand = useCallback(
    (command: Command) => {
      const actionText = handleCommandSelect(command)

      if (actionText === null) {
        // Special action handled (clear/export)
        setValue('')
        return
      }

      // Replace the trigger + filter with the action
      // Find the trigger position
      const triggerChar = command.type === 'slash' ? '/' : '@'
      const lastTriggerIndex = value.lastIndexOf(triggerChar)

      if (lastTriggerIndex !== -1) {
        // Replace from trigger to cursor with the action
        const newValue = value.slice(0, lastTriggerIndex) + actionText
        setValue(newValue)

        // Focus textarea and move cursor to end
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus()
            textareaRef.current.selectionStart = newValue.length
            textareaRef.current.selectionEnd = newValue.length
          }
        }, 0)
      }
    },
    [value, handleCommandSelect]
  )

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    const trimmedValue = value.trim()
    if (!trimmedValue || disabled || isSubmitting) return

    // Close command menu if open
    if (isMenuOpen) {
      closeMenu()
    }

    setIsSubmitting(true)
    try {
      await onSendMessage(trimmedValue)
      setValue('')
    } finally {
      setIsSubmitting(false)
    }
  }, [value, disabled, isSubmitting, isMenuOpen, closeMenu, onSendMessage])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Don't handle if command menu is handling keyboard events
      if (isMenuOpen) {
        // Let CommandMenu handle arrow keys, enter, and escape
        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'Enter' ||
          e.key === 'Escape' ||
          e.key === 'Tab'
        ) {
          return // Let the event bubble up to CommandMenu's handler
        }
      }

      // Submit on Enter (without Shift)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }

      // Close menu on Escape when menu is not open
      if (e.key === 'Escape' && !isMenuOpen) {
        e.currentTarget.blur()
      }
    },
    [isMenuOpen, handleSubmit]
  )

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen, closeMenu])

  const hasContent = value.trim().length > 0
  const isDisabled = disabled || isSubmitting

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex flex-col gap-2 px-4 py-3',
        'border-t border-border/60',
        'bg-gradient-to-t from-background via-background to-background/95',
        className
      )}
    >
      {/* Command Menu */}
      <CommandMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onSelect={handleSelectCommand}
        filter={filter}
        triggerType={triggerType}
        inputRef={textareaRef}
      />

      {/* Input Area */}
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isDisabled}
            aria-label="Message input"
            aria-expanded={isMenuOpen}
            aria-haspopup="listbox"
            autoResize
            maxRows={6}
            className={cn(
              'transition-all duration-200 shadow-sm border-border/40',
              'pr-4 text-sm',
              isMenuOpen && 'ring-2 ring-ring/30 border-ring/50'
            )}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSubmit}
          disabled={isDisabled || !hasContent}
          size="icon"
          className={cn(
            'transition-all duration-200 ease-out shrink-0 h-10 w-10 rounded-lg',
            hasContent && !isDisabled
              ? [
                  'bg-gradient-to-br from-primary via-primary to-primary/85',
                  'text-primary-foreground',
                  'shadow-[0_4px_14px_-3px_hsl(var(--primary)/0.4)]',
                  'hover:shadow-[0_6px_20px_-3px_hsl(var(--primary)/0.5)]',
                  'hover:scale-[1.03]',
                  'active:scale-[0.97]',
                ]
              : 'bg-muted/50 text-muted-foreground border border-border/30'
          )}
          aria-label={isSubmitting ? 'Sending...' : 'Send message'}
        >
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div
                key="loading"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: durations.fast }}
              >
                <Loader2 className="w-4 h-4 animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="send"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: durations.fast }}
              >
                <Send className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Hint */}
      <AnimatePresence>
        {!hasContent && !isMenuOpen && (
          <motion.p
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -5 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            className="text-[11px] text-muted-foreground/60 px-1"
          >
            Press{' '}
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold border border-border/60 rounded bg-muted/50">
              Enter
            </kbd>{' '}
            to send •{' '}
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold border border-border/60 rounded bg-muted/50">
              /
            </kbd>{' '}
            commands •{' '}
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold border border-border/60 rounded bg-muted/50">
              @
            </kbd>{' '}
            mention
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
})
