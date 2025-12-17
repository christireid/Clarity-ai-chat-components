import { logger } from '@clarity-chat/utils/logger';
'use client'

import * as React from 'react'
import type { ButtonState } from '@clarity-chat/primitives'

export interface UseSubmitButtonStateOptions {
  onSubmit: (value: string) => void | Promise<void>
  value: string
  disabled?: boolean
  isOverLimit?: boolean
}

export interface SubmitButtonStateResult {
  buttonState: ButtonState
  handleSubmit: () => Promise<void>
  resetState: () => void
}

/**
 * Custom hook for managing submit button state
 * 
 * @example
 * ```tsx
 * const { buttonState, handleSubmit } = useSubmitButtonState({
 *   onSubmit: async (value) => {
 *     await sendMessage(value)
 *   },
 *   value: inputValue,
 *   disabled: isLoading,
 *   isOverLimit: counter.isOverLimit
 * })
 * ```
 */
export function useSubmitButtonState({
  onSubmit,
  value,
  disabled = false,
  isOverLimit = false,
}: UseSubmitButtonStateOptions): SubmitButtonStateResult {
  const [buttonState, setButtonState] = React.useState<ButtonState>('idle')
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  const resetState = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setButtonState('idle')
  }, [])

  const handleSubmit = React.useCallback(async () => {
    if (!value.trim() || isOverLimit || disabled || buttonState === 'loading')
      return

    setButtonState('loading')
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    try {
      await onSubmit(value)
      setButtonState('success')
      // Auto-reset after showing success
      timeoutRef.current = setTimeout(() => {
        setButtonState('idle')
      }, 1000)
    } catch (error) {
      setButtonState('error')
      logger.logger.error('[ChatInput] Submit error:', error)
      // Auto-reset after showing error
      timeoutRef.current = setTimeout(() => {
        setButtonState('idle')
      }, 2000)
    }
  }, [value, isOverLimit, disabled, buttonState, onSubmit])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    buttonState,
    handleSubmit,
    resetState,
  }
}
