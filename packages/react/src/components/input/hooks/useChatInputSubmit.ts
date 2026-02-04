/**
 * useChatInputSubmit Hook
 *
 * Manages submission logic and state for PillChatInput.
 * Handles async submission, loading states, and validation.
 */

import * as React from 'react'

export interface UseChatInputSubmitOptions {
  /** Current input value */
  value: string
  /** Submit handler */
  onSubmit: (value: string) => void | Promise<void>
  /** Whether input is disabled */
  disabled: boolean
  /** Maximum character length */
  maxLength?: number
}

export interface UseChatInputSubmitReturn {
  /** Whether currently submitting */
  isSubmitting: boolean
  /** Whether submission is allowed */
  canSubmit: boolean
  /** Submit handler */
  handleSubmit: () => Promise<void>
}

/**
 * Hook for managing chat input submission
 *
 * @example
 * ```tsx
 * const { canSubmit, isSubmitting, handleSubmit } = useChatInputSubmit({
 *   value: input,
 *   onSubmit: handleMessage,
 *   disabled: false,
 * })
 * ```
 */
export function useChatInputSubmit({
  value,
  onSubmit,
  disabled,
  maxLength,
}: UseChatInputSubmitOptions): UseChatInputSubmitReturn {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Validation checks
  const hasContent = value.trim().length > 0
  const isOverLimit = maxLength ? value.length > maxLength : false
  const canSubmit = hasContent && !disabled && !isSubmitting && !isOverLimit

  const handleSubmit = React.useCallback(async () => {
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      await onSubmit(value.trim())
    } finally {
      setIsSubmitting(false)
    }
  }, [canSubmit, onSubmit, value])

  return {
    isSubmitting,
    canSubmit,
    handleSubmit,
  }
}
