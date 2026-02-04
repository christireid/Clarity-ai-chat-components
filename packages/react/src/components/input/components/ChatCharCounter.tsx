/**
 * ChatCharCounter Component
 *
 * Character counter display for PillChatInput.
 * Shows current count vs max with color-coded warning states.
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

export interface ChatCharCounterProps {
  /** Element ID for aria-describedby */
  id?: string
  /** Current character count */
  charCount: number
  /** Maximum characters allowed */
  maxLength: number
  /** Whether over the limit */
  isOverLimit: boolean
  /** Whether near the limit */
  isNearLimit: boolean
}

/**
 * ChatCharCounter - Character counter display
 *
 * Shows current/max characters with visual feedback based on usage.
 */
export const ChatCharCounter = React.memo(function ChatCharCounter({
  id,
  charCount,
  maxLength,
  isOverLimit,
  isNearLimit,
}: ChatCharCounterProps) {
  return (
    <div
      id={id}
      className={cn(
        'absolute right-4 -bottom-5 text-xs tabular-nums',
        isOverLimit
          ? 'text-destructive'
          : isNearLimit
            ? 'text-warning'
            : 'text-muted-foreground/60'
      )}
      aria-live="polite"
    >
      {charCount}/{maxLength}
    </div>
  )
})

ChatCharCounter.displayName = 'ChatCharCounter'
