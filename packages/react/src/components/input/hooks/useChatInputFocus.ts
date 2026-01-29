/**
 * useChatInputFocus Hook
 *
 * Manages focus state and auto-focus behavior for PillChatInput.
 */

import * as React from 'react'

export interface UseChatInputFocusOptions {
  /** Auto-focus on mount */
  autoFocus: boolean
  /** Textarea ref */
  textareaRef: React.RefObject<HTMLTextAreaElement>
}

export interface UseChatInputFocusReturn {
  /** Whether input is focused */
  isFocused: boolean
  /** Focus handler */
  handleFocus: () => void
  /** Blur handler */
  handleBlur: () => void
}

/**
 * Hook for managing focus state in chat input
 *
 * @example
 * ```tsx
 * const textareaRef = useRef<HTMLTextAreaElement>(null)
 * const { isFocused, handleFocus, handleBlur } = useChatInputFocus({
 *   autoFocus: true,
 *   textareaRef,
 * })
 * ```
 */
export function useChatInputFocus({
  autoFocus,
  textareaRef,
}: UseChatInputFocusOptions): UseChatInputFocusReturn {
  const [isFocused, setIsFocused] = React.useState(false)

  const handleFocus = React.useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = React.useCallback(() => {
    setIsFocused(false)
  }, [])

  // Auto-focus effect
  React.useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus, textareaRef])

  return {
    isFocused,
    handleFocus,
    handleBlur,
  }
}
