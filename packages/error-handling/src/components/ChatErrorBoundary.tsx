'use client'

import * as React from 'react'
import {
  EnhancedErrorBoundary,
  type FallbackProps,
} from './EnhancedErrorBoundary'
import { isStreamingError, isProviderError } from '../errors/type-guards'
import { isClarityError } from '../errors/base-error'

interface ChatErrorFallbackProps extends FallbackProps {
  /** Partial content received before error */
  partialContent?: string
  /** Provider that caused the error */
  provider?: string
}

/**
 * Chat-specific fallback with context-aware messaging
 */
function ChatErrorFallback({
  error,
  resetErrorBoundary,
}: ChatErrorFallbackProps) {
  const isStreaming = isStreamingError(error)
  const isProvider = isProviderError(error)
  const isClarity = isClarityError(error)

  let title = 'Chat Error'
  let message = 'Something went wrong with the chat.'
  let showRetry = true
  let iconColor = '#d97706' // amber

  if (isStreaming) {
    title = 'Connection Error'
    message = 'Lost connection to the chat server.'
    showRetry = error.recoverable
    iconColor = '#ef4444' // red
  } else if (isProvider) {
    title = `${error.provider.charAt(0).toUpperCase() + error.provider.slice(1)} Error`
    message = error.userMessage
    showRetry = error.recoverable
    iconColor = '#f59e0b' // amber
  } else if (isClarity) {
    message = error.userMessage
    showRetry = error.recoverable
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '20rem',
          borderRadius: '0.5rem',
          border: '1px solid #fcd34d',
          backgroundColor: '#fffbeb',
          padding: '1.5rem',
        }}
      >
        <svg
          style={{
            width: '3rem',
            height: '3rem',
            color: iconColor,
            margin: '0 auto',
          }}
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
        <h3
          style={{
            marginTop: '1rem',
            fontSize: '1.125rem',
            fontWeight: 500,
            color: '#92400e',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#b45309',
          }}
        >
          {message}
        </p>
        {isStreaming && error.hasPartialContent && (
          <p
            style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#059669',
            }}
          >
            Your partial response has been preserved.
          </p>
        )}
        {isProvider && error.retryAfter && (
          <p
            style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#6b7280',
            }}
          >
            Try again in {error.retryAfter} seconds.
          </p>
        )}
        {showRetry && (
          <button
            onClick={resetErrorBoundary}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
            }}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

export interface ChatErrorBoundaryProps {
  children: React.ReactNode
  /** Chat session ID for error context */
  chatId?: string
  /** Provider name for error context */
  provider?: string
  /** Called when retrying */
  onRetry?: () => void
  /** Called when error occurs */
  onError?: (error: Error) => void
}

/**
 * Specialized error boundary for chat components
 *
 * Provides chat-specific error handling with support for streaming errors,
 * provider errors, and partial content preservation.
 *
 * @example
 * ```tsx
 * <ChatErrorBoundary
 *   chatId={chatId}
 *   provider="openai"
 *   onRetry={() => refetchMessages()}
 * >
 *   <ChatWindow />
 * </ChatErrorBoundary>
 * ```
 */
export function ChatErrorBoundary({
  children,
  chatId,
  provider,
  onRetry,
  onError,
}: ChatErrorBoundaryProps) {
  const handleError = React.useCallback(
    (error: Error, info: React.ErrorInfo) => {
      console.error('[ChatErrorBoundary]', {
        chatId,
        provider,
        error: isClarityError(error) ? error.toJSON() : error,
        componentStack: info.componentStack,
      })
      onError?.(error)
    },
    [chatId, provider, onError]
  )

  const handleReset = React.useCallback(() => {
    onRetry?.()
  }, [onRetry])

  return (
    <EnhancedErrorBoundary
      FallbackComponent={ChatErrorFallback}
      onError={handleError}
      onReset={handleReset}
      resetKeys={[chatId]}
      enableLogging={true}
    >
      {children}
    </EnhancedErrorBoundary>
  )
}
