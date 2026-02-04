/**
 * useChatInputKeyboard Hook
 *
 * Manages keyboard interactions for PillChatInput.
 * Handles Enter key submission and Shift+Enter for new lines.
 */

import * as React from 'react'

export interface UseChatInputKeyboardOptions {
  /** Whether AI is currently generating */
  isGenerating: boolean
  /** Stop generation handler */
  onStop?: () => void
  /** Submit handler */
  onSubmit: () => void
  /** Whether submission is allowed */
  canSubmit: boolean
}

export interface UseChatInputKeyboardReturn {
  /** Keyboard event handler */
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

/**
 * Hook for managing keyboard interactions in chat input
 *
 * @example
 * ```tsx
 * const { handleKeyDown } = useChatInputKeyboard({
 *   isGenerating: false,
 *   onSubmit: handleSubmit,
 *   canSubmit: true,
 * })
 *
 * <textarea onKeyDown={handleKeyDown} />
 * ```
 */
export function useChatInputKeyboard({
  isGenerating,
  onStop,
  onSubmit,
  canSubmit,
}: UseChatInputKeyboardOptions): UseChatInputKeyboardReturn {
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter without shift to submit
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()

        if (isGenerating && onStop) {
          // Stop generation if currently generating
          onStop()
        } else if (canSubmit) {
          // Submit if allowed
          onSubmit()
        }
      }
    },
    [isGenerating, onStop, onSubmit, canSubmit]
  )

  return {
    handleKeyDown,
  }
}
