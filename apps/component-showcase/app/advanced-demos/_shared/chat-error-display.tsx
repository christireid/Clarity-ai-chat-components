'use client'

import { memo } from 'react'
import { Bot, AlertCircle } from 'lucide-react'

interface ChatErrorDisplayProps {
  /** The error to display. Renders nothing when null/undefined. */
  error: Error | null | undefined
  /** 'inline' shows a simple box; 'chat-bubble' shows a chat-style bubble with avatar. */
  variant?: 'inline' | 'chat-bubble'
  /** Avatar style for 'chat-bubble' variant. */
  avatarIcon?: 'bot' | 'alert'
  /** Gradient class for bot avatar (e.g. 'from-red-500 to-rose-600'). */
  avatarGradient?: string
  /** Retry callback. Shows a retry button when provided. */
  onRetry?: () => void
}

export const ChatErrorDisplay = memo(function ChatErrorDisplay({
  error,
  variant = 'inline',
  avatarIcon = 'bot',
  avatarGradient = 'from-red-500 to-rose-600',
  onRetry,
}: ChatErrorDisplayProps) {
  if (!error) return null

  const message = error.message || 'An error occurred. Please try again.'

  if (variant === 'inline') {
    return (
      <div
        className="mx-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500"
        role="alert"
      >
        {message}
      </div>
    )
  }

  const Icon = avatarIcon === 'alert' ? AlertCircle : Bot
  const avatarClasses =
    avatarIcon === 'alert'
      ? 'bg-destructive/20'
      : `bg-gradient-to-br ${avatarGradient}`

  return (
    <div className="flex gap-3">
      <div
        className={`w-8 h-8 rounded-lg ${avatarClasses} flex items-center justify-center shrink-0`}
      >
        <Icon
          className={`h-4 w-4 ${avatarIcon === 'alert' ? 'text-destructive' : 'text-white'}`}
        />
      </div>
      <div
        className="max-w-[75%] rounded-2xl px-4 py-3 bg-destructive/10 border border-destructive/20"
        role="alert"
      >
        <p className="text-sm text-destructive">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs px-3 py-1 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
})
