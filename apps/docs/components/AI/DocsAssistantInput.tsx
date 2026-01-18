'use client'

/**
 * DocsAssistantInput - Premium Chat Input with Command Support
 *
 * Features:
 * - Slash commands (/) for actions like /help, /clear, /diagram
 * - @ mentions for component/hook lookups like @ChatInput, @useChat
 * - Keyboard navigation for command menu
 * - Smooth animations with reduced motion support
 * - Premium glass-morphism styling
 */

import { useState, useRef, useCallback, memo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Textarea, Button } from '@clarity-chat/primitives'
import { useReducedMotion } from '@clarity-chat/react'
import { toast } from '@/lib/toast'
import { Send, Loader2, Command } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommandMenu, useSlashCommands, type Command as CommandType } from './CommandMenu'

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
  placeholder = 'Ask about Clarity Chat...',
  className,
}: DocsAssistantInputProps) {
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

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
      const newCursorPosition = e.target.selectionStart
      setValue(newValue)
      setCursorPosition(newCursorPosition)
      handleInputChange(newValue, newCursorPosition)
    },
    [handleInputChange]
  )

  // Handle command selection from menu
  const handleSelectCommand = useCallback(
    (command: CommandType) => {
      const actionText = handleCommandSelect(command)

      if (actionText === null) {
        // Special action handled (clear/export)
        setValue('')
        closeMenu()
        return
      }

      // Replace the trigger + filter with the action
      // Find the trigger position relative to cursor (not lastIndexOf which could be wrong)
      const triggerChar = command.type === 'slash' ? '/' : '@'
      
      // Look backwards from cursor position to find the trigger
      let triggerIndex = -1
      for (let i = cursorPosition - 1; i >= 0; i--) {
        const char = value[i]
        if (char === ' ' || char === '\n') {
          break // Hit whitespace, no trigger found
        }
        if (char === triggerChar) {
          // Verify it's at start of input or after whitespace
          if (i === 0 || value[i - 1] === ' ' || value[i - 1] === '\n') {
            triggerIndex = i
            break
          }
        }
      }

      if (triggerIndex !== -1) {
        // Replace from trigger to cursor with the action
        const newValue = value.slice(0, triggerIndex) + actionText + value.slice(cursorPosition)
        setValue(newValue)
        
        // Close menu after selection
        closeMenu()

        // Focus textarea and move cursor to end of inserted text
        const newCursorPos = triggerIndex + actionText.length
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus()
            textareaRef.current.selectionStart = newCursorPos
            textareaRef.current.selectionEnd = newCursorPos
            setCursorPosition(newCursorPos)
          }
        }, 0)
      } else {
        // If trigger not found, just insert at cursor and close menu
        const newValue = value.slice(0, cursorPosition) + actionText + value.slice(cursorPosition)
        setValue(newValue)
        closeMenu()
        setTimeout(() => {
          if (textareaRef.current) {
            const newCursorPos = cursorPosition + actionText.length
            textareaRef.current.focus()
            textareaRef.current.selectionStart = newCursorPos
            textareaRef.current.selectionEnd = newCursorPos
            setCursorPosition(newCursorPos)
          }
        }, 0)
      }
    },
    [value, cursorPosition, handleCommandSelect, closeMenu]
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
        'relative',
        // Premium gradient border effect when focused
        'before:absolute before:inset-0 before:rounded-t-xl before:p-[1px]',
        'before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent',
        'before:opacity-0 before:transition-opacity before:duration-300',
        isFocused && 'before:opacity-100',
        className
      )}
    >
      <div className={cn(
        'relative flex flex-col gap-2',
        'px-3 sm:px-4 md:px-5 py-3 sm:py-4',
        // Premium background gradient
        'bg-gradient-to-t from-gray-50/90 via-white/80 to-white/60',
        'dark:from-gray-800/90 dark:via-gray-900/80 dark:to-gray-900/60',
        // Border with subtle shadow
        'border-t border-gray-100 dark:border-gray-800/80',
        'shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]',
        // Mobile safe area
        'pb-safe',
      )}>
        {/* Input Area */}
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            {/* Command Menu - positioned above input */}
            <CommandMenu
              isOpen={isMenuOpen}
              onClose={closeMenu}
              onSelect={handleSelectCommand}
              filter={filter}
              triggerType={triggerType}
              inputRef={textareaRef}
            />
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={isDisabled}
              aria-label="Message input"
              aria-expanded={isMenuOpen}
              aria-haspopup="listbox"
              aria-describedby={isMenuOpen ? "command-menu-description" : undefined}
              aria-controls={isMenuOpen ? "command-menu" : undefined}
              role="textbox"
              aria-multiline="true"
              autoResize
              maxRows={6}
              className={cn(
                'w-full',
                'text-sm leading-relaxed',
                'resize-none',
                // Premium styling
                'rounded-xl',
                'bg-white dark:bg-gray-800/80',
                'border border-gray-200/80 dark:border-gray-700/50',
                'shadow-sm',
                // Focus states with smooth transitions
                'focus:ring-2 focus:ring-primary/20 focus:border-primary/40',
                'dark:focus:ring-primary/30 dark:focus:border-primary/50',
                'focus:shadow-md focus:shadow-primary/10',
                // Transition
                'transition-all duration-200 ease-out',
                // Command menu active state
                isMenuOpen && 'ring-2 ring-primary/30 border-primary/50 shadow-md shadow-primary/10',
                // Hover state
                'hover:border-gray-300/80 dark:hover:border-gray-600/50'
              )}
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSubmit}
            disabled={isDisabled || !hasContent}
            size="icon"
            className={cn(
              'shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-xl',
              'touch-manipulation', // Better touch handling
              'transition-all duration-200',
              hasContent && !isDisabled
                ? [
                    // Active gradient button
                    'bg-gradient-to-br from-primary via-primary to-primary/85',
                    'text-white',
                    'shadow-lg shadow-primary/25',
                    'hover:shadow-xl hover:shadow-primary/30',
                    'hover:scale-[1.03]',
                    'active:scale-[0.97]',
                    // Focus ring
                    'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
                  ]
                : [
                    // Inactive state
                    'bg-gray-100 dark:bg-gray-800',
                    'text-gray-400 dark:text-gray-500',
                    'border border-gray-200/60 dark:border-gray-700/50',
                  ]
            )}
            aria-label={isSubmitting ? 'Sending...' : 'Send message'}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Send className="w-4.5 h-4.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Keyboard Hints */}
        <AnimatePresence>
          {!hasContent && !isMenuOpen && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between px-1"
            >
              <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <kbd className={cn(
                    'inline-flex items-center justify-center',
                    'px-1.5 py-0.5 min-w-[22px]',
                    'text-[10px] font-semibold',
                    'bg-gray-100 dark:bg-gray-800',
                    'border border-gray-200/80 dark:border-gray-700/60',
                    'rounded'
                  )}>
                    Enter
                  </kbd>
                  <span>send</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className={cn(
                    'inline-flex items-center justify-center',
                    'px-1.5 py-0.5 min-w-[18px]',
                    'text-[10px] font-semibold',
                    'bg-gray-100 dark:bg-gray-800',
                    'border border-gray-200/80 dark:border-gray-700/60',
                    'rounded'
                  )}>
                    /
                  </kbd>
                  <span>commands</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className={cn(
                    'inline-flex items-center justify-center',
                    'px-1.5 py-0.5 min-w-[18px]',
                    'text-[10px] font-semibold',
                    'bg-gray-100 dark:bg-gray-800',
                    'border border-gray-200/80 dark:border-gray-700/60',
                    'rounded'
                  )}>
                    @
                  </kbd>
                  <span>mention</span>
                </span>
              </div>

              {/* Shift+Enter hint on desktop */}
              <span className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                <kbd className={cn(
                  'inline-flex items-center justify-center',
                  'px-1.5 py-0.5',
                  'text-[10px] font-semibold',
                  'bg-gray-100 dark:bg-gray-800',
                  'border border-gray-200/80 dark:border-gray-700/60',
                  'rounded'
                )}>
                  Shift+Enter
                </kbd>
                <span>new line</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
})
