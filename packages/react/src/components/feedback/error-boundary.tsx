import * as React from 'react'
import {
  EnhancedErrorBoundary,
  type FallbackProps,
} from '@clarity-chat/error-handling'

/**
 * Error boundary props
 */
export interface ErrorBoundaryProps {
  /** Child components to render */
  children: React.ReactNode

  /** Fallback UI to render when error occurs */
  fallback?:
    | React.ReactNode
    | ((error: Error, resetError: () => void) => React.ReactNode)

  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void

  /** Callback when error boundary is reset */
  onReset?: () => void

  /** Keys that trigger reset when changed */
  resetKeys?: Array<string | number>

  /** Custom error logging function */
  logError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

/**
 * Production-ready Error Boundary component for graceful error handling.
 *
 * Delegates to the canonical EnhancedErrorBoundary from @clarity-chat/error-handling
 * while maintaining backward-compatible props interface.
 *
 * **Features:**
 * - Catches JavaScript errors anywhere in child component tree
 * - Logs error information for debugging
 * - Displays fallback UI when errors occur
 * - Provides reset functionality to recover from errors
 * - Supports custom fallback components
 * - Automatic reset when resetKeys change
 * - Development mode shows detailed error info
 *
 * @example
 * ```tsx
 * // Basic usage with default fallback
 * <ErrorBoundary>
 *   <ChatWindow />
 * </ErrorBoundary>
 *
 * // Custom fallback UI
 * <ErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <h1>Chat Error: {error.message}</h1>
 *       <button onClick={reset}>Retry</button>
 *     </div>
 *   )}
 *   onError={(error, errorInfo) => {
 *     console.error('Chat error:', error, errorInfo)
 *     analytics.track('chat_error', { error: error.message })
 *   }}
 * >
 *   <ChatWindow />
 * </ErrorBoundary>
 *
 * // Auto-reset on conversation change
 * <ErrorBoundary
 *   resetKeys={[conversationId]}
 *   onReset={() => {
 *     console.debug('Error boundary reset for new conversation')
 *   }}
 * >
 *   <ChatWindow conversationId={conversationId} />
 * </ErrorBoundary>
 * ```
 */
export function ErrorBoundary({
  children,
  fallback,
  onError,
  onReset,
  resetKeys,
  logError,
}: ErrorBoundaryProps) {
  // Combine onError and logError callbacks
  const handleError = React.useCallback(
    (error: Error, info: React.ErrorInfo) => {
      logError?.(error, info)
      onError?.(error, info)
    },
    [logError, onError]
  )

  // Adapt the onReset signature (canonical uses details object, we use void)
  const handleReset = React.useCallback(() => {
    onReset?.()
  }, [onReset])

  // If fallback is a function, adapt to FallbackComponent interface
  if (typeof fallback === 'function') {
    const FallbackAdapter = ({ error, resetErrorBoundary }: FallbackProps) => (
      <>{fallback(error, resetErrorBoundary)}</>
    )

    return (
      <EnhancedErrorBoundary
        FallbackComponent={FallbackAdapter}
        onError={handleError}
        onReset={handleReset}
        resetKeys={resetKeys}
      >
        {children}
      </EnhancedErrorBoundary>
    )
  }

  // If fallback is a ReactNode or undefined, use the fallback prop directly
  return (
    <EnhancedErrorBoundary
      fallback={fallback}
      onError={handleError}
      onReset={handleReset}
      resetKeys={resetKeys}
    >
      {children}
    </EnhancedErrorBoundary>
  )
}
