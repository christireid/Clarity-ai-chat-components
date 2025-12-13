import React from 'react'

export interface ErrorBannerProps {
  message: string
  onDismiss?: () => void
  variant?: 'light' | 'dark'
}

export function ErrorBanner({
  message,
  onDismiss,
  variant = 'light',
}: ErrorBannerProps) {
  const isDark = variant === 'dark'

  return (
    <div
      className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
        isDark
          ? 'bg-red-500/10 border border-red-500/30'
          : 'bg-red-50 border border-red-200'
      }`}
    >
      <span>⚠️</span>
      <p
        className={`text-sm flex-1 ${isDark ? 'text-red-400' : 'text-red-700'}`}
      >
        {message}
      </p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`text-sm font-medium ${
            isDark
              ? 'text-red-400 hover:text-red-300'
              : 'text-red-700 hover:text-red-900'
          }`}
        >
          Dismiss
        </button>
      )}
    </div>
  )
}

export default ErrorBanner
