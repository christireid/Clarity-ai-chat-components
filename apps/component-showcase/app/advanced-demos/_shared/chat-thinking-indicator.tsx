'use client'

import { memo } from 'react'
import { Bot, Loader2 } from 'lucide-react'

interface ChatThinkingIndicatorProps {
  /** Whether to show the indicator. */
  visible: boolean
  /** Gradient classes for the avatar (e.g. "from-violet-500 to-purple-600"). */
  avatarGradient: string
  /** Label text (e.g. "Thinking..." or "Researching..."). */
  label?: string
}

export const ChatThinkingIndicator = memo(function ChatThinkingIndicator({
  visible,
  avatarGradient,
  label = 'Thinking...',
}: ChatThinkingIndicatorProps) {
  if (!visible) return null
  return (
    <div
      className="flex gap-3"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarGradient} flex items-center justify-center shrink-0`}
      >
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-muted/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>{label}</span>
        </div>
      </div>
    </div>
  )
})
