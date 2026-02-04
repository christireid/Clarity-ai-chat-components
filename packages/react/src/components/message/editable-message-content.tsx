'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, cn, Textarea } from '@clarity-chat/primitives'
import { CheckIcon, CloseIcon } from '../ui/icons'
import { DURATION_SECONDS as durations } from '../../animations/constants'

/** Maximum recommended content length before warning */
const MAX_CONTENT_LENGTH = 10000

export interface EditableMessageContentProps {
  /** Original content */
  content: string
  /** Whether currently in edit mode */
  isEditing: boolean
  /** Callback when edit is saved */
  onSave: (newContent: string) => void
  /** Callback when edit is cancelled */
  onCancel: () => void
  /** Additional class names */
  className?: string
  /** Maximum content length before showing warning (default: 10000) */
  maxLength?: number
}

/**
 * EditableMessageContent - Inline editor for user messages
 *
 * Provides a smooth transition between view and edit modes with:
 * - Auto-focusing textarea
 * - Keyboard shortcuts (Escape to cancel, Cmd/Ctrl+Enter to save)
 * - Save/Cancel buttons
 * - Animated transitions
 */
export const EditableMessageContent = React.memo<EditableMessageContentProps>(
  ({
    content,
    isEditing,
    onSave,
    onCancel,
    className,
    maxLength = MAX_CONTENT_LENGTH,
  }) => {
    const [editValue, setEditValue] = React.useState(content)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    // Detect if user is on Mac for keyboard hint
    // Note: navigator.platform is deprecated but navigator.userAgentData is not
    // widely supported yet. Use userAgent as fallback.
    const isMac = React.useMemo(() => {
      if (typeof navigator === 'undefined') return false
      // Try modern API first (Chrome 90+)
      const platform = (
        navigator as Navigator & { userAgentData?: { platform: string } }
      ).userAgentData?.platform
      if (platform) {
        return /mac/i.test(platform)
      }
      // Fallback to userAgent (more reliable than deprecated platform)
      return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)
    }, [])

    // Reset edit value when entering edit mode
    React.useEffect(() => {
      if (isEditing) {
        setEditValue(content)
        // Focus textarea after animation starts
        setTimeout(() => {
          textareaRef.current?.focus()
          // Move cursor to end
          textareaRef.current?.setSelectionRange(content.length, content.length)
        }, 50)
      }
    }, [isEditing, content])

    // Handle keyboard shortcuts
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onCancel()
        } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          const trimmed = editValue.trim()
          // Only save if content is non-empty AND has changes
          if (trimmed && trimmed !== content) {
            onSave(trimmed)
          }
        }
      },
      [editValue, content, onSave, onCancel]
    )

    const handleSave = React.useCallback(() => {
      const trimmed = editValue.trim()
      // Only save if content is non-empty AND has changes (defense in depth)
      if (trimmed && trimmed !== content) {
        onSave(trimmed)
      }
    }, [editValue, content, onSave])

    const hasChanges = editValue.trim() !== content
    const isEmpty = !editValue.trim()
    const isOverLimit = editValue.length > maxLength

    return (
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: durations.fast }}
            className={cn('space-y-3', className)}
          >
            {/* Edit textarea */}
            <Textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                'min-h-[100px] max-h-64 overflow-y-auto resize-none',
                'bg-background border-2',
                isOverLimit
                  ? 'border-amber-500/70 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  : 'border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20',
                'rounded-xl p-3',
                'text-foreground',
                'transition-all duration-200'
              )}
              placeholder="Edit your message..."
              aria-label="Edit message"
              aria-describedby={isOverLimit ? 'edit-length-warning' : undefined}
            />

            {/* Character count and length warning */}
            <div className="flex items-center justify-between -mt-1">
              {/* Warning message - only announced to screen readers when over limit */}
              {isOverLimit ? (
                <span
                  id="edit-length-warning"
                  className="text-xs text-amber-600 dark:text-amber-400"
                  role="alert"
                >
                  Message is very long and may affect performance
                </span>
              ) : (
                <span />
              )}
              {/* Character count - decorative, hidden from screen readers */}
              <span
                className={cn(
                  'text-xs text-right',
                  isOverLimit
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-muted-foreground'
                )}
                aria-hidden="true"
              >
                {editValue.length.toLocaleString()} characters
              </span>
            </div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: durations.fast }}
              className="flex items-center justify-end gap-2"
            >
              {/* Keyboard hint - OS-appropriate modifier key */}
              <span className="text-xs text-muted-foreground mr-2 hidden sm:inline">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                  Esc
                </kbd>{' '}
                cancel ·{' '}
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                  {isMac ? '⌘' : 'Ctrl'}+↵
                </kbd>{' '}
                save
              </span>

              {/* Cancel button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <CloseIcon size={14} />
                Cancel
              </Button>

              {/* Save button */}
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={isEmpty || !hasChanges}
                className="gap-1.5"
              >
                <CheckIcon size={14} />
                Save
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    )
  }
)

EditableMessageContent.displayName = 'EditableMessageContent'
