/**
 * Typing Indicator Component
 * Animated dots to show AI is processing/responding
 */

import React from 'react'

interface TypingIndicatorProps {
  visible?: boolean
  className?: string
  label?: string
}

export function TypingIndicator({
  visible = true,
  className = '',
  label = 'AI is typing',
}: TypingIndicatorProps) {
  if (!visible) return null

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-2xl ${className}`}
      role="status"
      aria-label={label}
    >
      <div className="flex gap-1">
        <span
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}
