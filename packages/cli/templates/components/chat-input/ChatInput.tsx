/**
 * Chat Input Component
 * Rich text input with keyboard shortcuts and submit handling
 */

import React, { useState, useRef, useCallback, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSubmit: (message: string) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  autoFocus?: boolean
  className?: string
}

export function ChatInput({
  onSubmit,
  placeholder = 'Type a message...',
  disabled = false,
  maxLength = 4000,
  autoFocus = true,
  className = '',
}: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(() => {
    const trimmedValue = value.trim()
    if (!trimmedValue || disabled) return

    onSubmit(trimmedValue)
    setValue('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, disabled, onSubmit])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Enter (without Shift)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      if (newValue.length <= maxLength) {
        setValue(newValue)

        // Auto-resize textarea
        const textarea = e.target
        textarea.style.height = 'auto'
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
      }
    },
    [maxLength]
  )

  const remainingChars = maxLength - value.length

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-end gap-2 p-3 bg-white border rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          rows={1}
          className="flex-1 resize-none border-0 bg-transparent focus:outline-none focus:ring-0 disabled:opacity-50 min-h-[24px] max-h-[200px]"
          aria-label="Message input"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>

      {/* Character count indicator */}
      {value.length > 0 && remainingChars < 500 && (
        <div
          className={`absolute bottom-1 right-16 text-xs ${
            remainingChars < 100 ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          {remainingChars} remaining
        </div>
      )}

      {/* Keyboard hint */}
      <div className="mt-1 text-xs text-gray-400">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  )
}
