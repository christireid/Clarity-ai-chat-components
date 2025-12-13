import React from 'react'
import { TypingIndicator } from './TypingIndicator'

export interface StreamingIndicatorProps {
  message?: string
  onCancel?: () => void
  variant?: 'light' | 'dark'
}

export function StreamingIndicator({
  message = 'Streaming response...',
  onCancel,
  variant = 'light',
}: StreamingIndicatorProps) {
  const isDark = variant === 'dark'

  return (
    <div
      className={`mb-4 px-4 py-3 rounded-lg flex items-center justify-between ${
        isDark
          ? 'bg-blue-500/10 border border-blue-500/30'
          : 'bg-blue-50 border border-blue-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <TypingIndicator color={isDark ? 'bg-blue-400' : 'bg-blue-500'} />
        <span
          className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-700'}`}
        >
          {message}
        </span>
      </div>
      {onCancel && (
        <button
          onClick={onCancel}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            isDark
              ? 'bg-slate-700 text-white hover:bg-slate-600'
              : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
          }`}
        >
          Stop
        </button>
      )}
    </div>
  )
}

export default StreamingIndicator
