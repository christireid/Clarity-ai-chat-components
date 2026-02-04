/**
 * useChatInputCharCount Hook
 *
 * Manages character counting and validation for PillChatInput.
 * Provides character count, limit validation, and warning states.
 */

import * as React from 'react'

export interface UseChatInputCharCountOptions {
  /** Current input value */
  value: string
  /** Maximum character length */
  maxLength?: number
  /** Warning threshold (default: 0.8 = 80%) */
  warningThreshold?: number
}

export interface UseChatInputCharCountReturn {
  /** Current character count */
  charCount: number
  /** Whether over the limit */
  isOverLimit: boolean
  /** Whether near the limit (warning) */
  isNearLimit: boolean
}

/**
 * Hook for managing character count in chat input
 *
 * @example
 * ```tsx
 * const { charCount, isOverLimit, isNearLimit } = useChatInputCharCount({
 *   value: input,
 *   maxLength: 500,
 * })
 * ```
 */
export function useChatInputCharCount({
  value,
  maxLength,
  warningThreshold = 0.8,
}: UseChatInputCharCountOptions): UseChatInputCharCountReturn {
  const charCount = value.length

  const isOverLimit = React.useMemo(
    () => (maxLength ? charCount > maxLength : false),
    [charCount, maxLength]
  )

  const isNearLimit = React.useMemo(
    () => (maxLength ? charCount > maxLength * warningThreshold : false),
    [charCount, maxLength, warningThreshold]
  )

  return {
    charCount,
    isOverLimit,
    isNearLimit,
  }
}
