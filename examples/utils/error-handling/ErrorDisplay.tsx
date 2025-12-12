'use client'

/**
 * ErrorDisplay Component
 *
 * A reusable error display component for chat applications.
 * Shows user-friendly error messages with appropriate styling and retry options.
 */

import { useState, useEffect } from 'react'
import type { ChatError, ErrorSeverity } from './index'
import {
  formatErrorForUser,
  shouldShowRetryButton,
  getErrorColor,
} from './index'

// ============================================================================
// Types
// ============================================================================

export interface ErrorDisplayProps {
  error: ChatError | Error | string | null
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
  showDetails?: boolean
  autoDismiss?: boolean
  autoDismissDelay?: number
}

// ============================================================================
// Icons
// ============================================================================

function InfoIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function CriticalIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function getIcon(severity: ErrorSeverity) {
  switch (severity) {
    case 'info':
      return <InfoIcon />
    case 'warning':
      return <WarningIcon />
    case 'error':
      return <ErrorIcon />
    case 'critical':
      return <CriticalIcon />
    default:
      return <ErrorIcon />
  }
}

// ============================================================================
// Component
// ============================================================================

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  className = '',
  showDetails = false,
  autoDismiss = false,
  autoDismissDelay = 5000,
}: ErrorDisplayProps) {
  const [dismissed, setDismissed] = useState(false)

  // Auto-dismiss effect
  useEffect(() => {
    if (autoDismiss && error) {
      const timer = setTimeout(() => {
        setDismissed(true)
        onDismiss?.()
      }, autoDismissDelay)
      return () => clearTimeout(timer)
    }
  }, [autoDismiss, autoDismissDelay, error, onDismiss])

  // Reset dismissed state when error changes
  useEffect(() => {
    setDismissed(false)
  }, [error])

  if (!error || dismissed) return null

  // Convert to ChatError if needed
  let chatError: ChatError
  if (typeof error === 'string') {
    chatError = {
      code: 'UNKNOWN_ERROR',
      message: error,
      severity: 'error',
      timestamp: Date.now(),
      recoverable: true,
      retryable: true,
    }
  } else if (error instanceof Error) {
    chatError = {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      severity: 'error',
      timestamp: Date.now(),
      recoverable: true,
      retryable: true,
    }
  } else {
    chatError = error
  }

  const colorClasses = getErrorColor(chatError.severity)
  const message = formatErrorForUser(chatError)
  const showRetry = onRetry && shouldShowRetryButton(chatError)

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${colorClasses} ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0">{getIcon(chatError.severity)}</div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>

        {showDetails && chatError.details && (
          <details className="mt-2 text-xs opacity-75">
            <summary className="cursor-pointer">Technical details</summary>
            <pre className="mt-1 p-2 bg-white/50 rounded overflow-auto">
              {JSON.stringify(chatError.details, null, 2)}
            </pre>
          </details>
        )}

        {(showRetry || onDismiss) && (
          <div className="flex gap-2 mt-3">
            {showRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1 text-sm font-medium bg-white/50 hover:bg-white/80 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
              >
                Try again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={() => {
                  setDismissed(true)
                  onDismiss()
                }}
                className="px-3 py-1 text-sm opacity-75 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1"
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorDisplay
