'use client'

import * as React from 'react'
import { Button, cn } from '@clarity-chat/primitives'
import { Check, X, Loader2 } from 'lucide-react'

export interface EditMessageModeProps {
  messageId: string
  initialContent: string
  onSave: (messageId: string, newContent: string) => void | Promise<void>
  onCancel: () => void
  placeholder?: string
  maxLength?: number
  minLength?: number
  autoFocus?: boolean
  showCharacterCount?: boolean
  validateContent?: (content: string) => string | null // Returns error message if invalid
  className?: string
}

/**
 * EditMessageMode - Inline message editing component
 *
 * Features:
 * - Inline editing with textarea
 * - Save/Cancel actions
 * - Character count
 * - Content validation
 * - Loading state during save
 * - Keyboard shortcuts (Cmd/Ctrl+Enter to save, Esc to cancel)
 * - Auto-resize textarea
 *
 * @example
 * ```tsx
 * <EditMessageMode
 *   messageId="msg-123"
 *   initialContent="Original message"
 *   onSave={async (id, content) => {
 *     await updateMessage(id, content)
 *   }}
 *   onCancel={() => setEditMode(false)}
 *   maxLength={500}
 *   showCharacterCount
 * />
 * ```
 */
export function EditMessageMode({
  messageId,
  initialContent,
  onSave,
  onCancel,
  placeholder = 'Edit message...',
  maxLength,
  minLength = 1,
  autoFocus = true,
  showCharacterCount = false,
  validateContent,
  className,
}: EditMessageModeProps) {
  const [content, setContent] = React.useState(initialContent)
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const adjustHeight = () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }

    adjustHeight()
    textarea.addEventListener('input', adjustHeight)
    return () => textarea.removeEventListener('input', adjustHeight)
  }, [])

  // Auto-focus on mount
  React.useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
      // Set cursor at end
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      )
    }
  }, [autoFocus])

  const handleSave = async () => {
    // Validate content
    if (content.length < minLength) {
      setError(`Message must be at least ${minLength} character${minLength !== 1 ? 's' : ''}`)
      return
    }

    if (maxLength && content.length > maxLength) {
      setError(`Message must not exceed ${maxLength} characters`)
      return
    }

    if (validateContent) {
      const validationError = validateContent(content)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    // Check if content changed
    if (content.trim() === initialContent.trim()) {
      onCancel()
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      await onSave(messageId, content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save message')
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Save on Cmd/Ctrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
    // Cancel on Escape
    if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  const isContentChanged = content.trim() !== initialContent.trim()
  const canSave = content.length >= minLength && (!maxLength || content.length <= maxLength) && isContentChanged

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setError(null)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isSaving}
          className={cn(
            'w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px]',
            error && 'border-destructive focus:ring-destructive',
            isSaving && 'opacity-50 cursor-not-allowed'
          )}
          maxLength={maxLength}
        />

        {/* Character Count */}
        {showCharacterCount && maxLength && (
          <div
            className={cn(
              'absolute bottom-2 right-2 text-xs',
              content.length > maxLength * 0.9
                ? 'text-destructive'
                : 'text-muted-foreground'
            )}
          >
            {content.length}/{maxLength}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-3 w-3" />
              Save
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="gap-2"
        >
          <X className="h-3 w-3" />
          Cancel
        </Button>

        {/* Keyboard Hint */}
        <span className="text-xs text-muted-foreground ml-auto">
          {!isSaving && (
            <>
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
              </kbd>{' '}
              to save
            </>
          )}
        </span>
      </div>

      {/* Edit History Indicator (optional) */}
      {isContentChanged && !error && (
        <p className="text-xs text-muted-foreground">
          This message will show as edited
        </p>
      )}
    </div>
  )
}
