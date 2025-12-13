'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, CornerDownLeft } from 'lucide-react'
import { durations } from '@/lib/animations'

interface HeroChatMessageEditorProps {
  initialContent: string
  onSave: (content: string) => void
  onCancel: () => void
  maxLength?: number
}

export function HeroChatMessageEditor({
  initialContent,
  onSave,
  onCancel,
  maxLength = 4000,
}: HeroChatMessageEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus and select all on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content])

  const handleSave = useCallback(async () => {
    const trimmed = content.trim()
    if (!trimmed || trimmed === initialContent) {
      onCancel()
      return
    }

    setIsSaving(true)
    try {
      onSave(trimmed)
    } finally {
      setIsSaving(false)
    }
  }, [content, initialContent, onSave, onCancel])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleSave()
      }
    },
    [onCancel, handleSave]
  )

  const hasChanges = content.trim() !== initialContent
  const isOverLimit = content.length > maxLength
  const charCount = content.length
  const charPercent = (charCount / maxLength) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: durations.fast }}
      className="w-full"
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none focus:outline-none transition-colors ${
            isOverLimit
              ? 'border-red-500 focus:border-red-500'
              : 'border-indigo-500 focus:border-indigo-600'
          }`}
          rows={1}
          aria-label="Edit message"
          aria-invalid={isOverLimit}
        />

        {/* Character count indicator */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <span
            className={`text-xs ${
              isOverLimit
                ? 'text-red-500'
                : charPercent > 80
                  ? 'text-amber-500'
                  : 'text-slate-400'
            }`}
          >
            {charCount}/{maxLength}
          </span>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <CornerDownLeft className="w-3 h-3" />
          <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs">
            {typeof navigator !== 'undefined' &&
            navigator.platform?.includes('Mac')
              ? '⌘'
              : 'Ctrl'}
            +Enter
          </kbd>
          to save
        </p>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={onCancel}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving}
          >
            <X className="w-4 h-4" />
            Cancel
          </motion.button>

          <motion.button
            onClick={handleSave}
            disabled={!hasChanges || isOverLimit || isSaving}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              hasChanges && !isOverLimit
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
            whileHover={hasChanges && !isOverLimit ? { scale: 1.02 } : {}}
            whileTap={hasChanges && !isOverLimit ? { scale: 0.98 } : {}}
          >
            {isSaving ? (
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: durations.slower,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Save
          </motion.button>
        </div>
      </div>

      {/* Warning for significant changes */}
      <AnimatePresence>
        {hasChanges && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-xs text-amber-600 dark:text-amber-400"
          >
            Editing will regenerate the assistant&apos;s response to this
            message.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * Hook to manage message editing state
 */
export function useMessageEditing() {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)

  const startEditing = useCallback((messageId: string) => {
    setEditingMessageId(messageId)
  }, [])

  const stopEditing = useCallback(() => {
    setEditingMessageId(null)
  }, [])

  const isEditing = useCallback(
    (messageId: string) => editingMessageId === messageId,
    [editingMessageId]
  )

  return {
    editingMessageId,
    startEditing,
    stopEditing,
    isEditing,
  }
}
