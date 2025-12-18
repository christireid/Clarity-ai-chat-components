import { logger } from '@clarity-chat/utils/logger';
/**
 * Enhanced Error Boundary with Error Tracking Integration
 *
 * This is an enhanced version of ErrorBoundary that integrates with the error tracking system.
 * It automatically reports errors to configured providers and allows user feedback collection.
 */

'use client'

import React from 'react'
import { ErrorBoundary, type ErrorBoundaryProps } from './error-boundary'
import { ErrorFeedback } from '../../error/ErrorFeedback'
import { useErrorReporter } from '../../error/ErrorReporter'
import type { ErrorFeedback as ErrorFeedbackData } from '../error/types'

/**
 * Enhanced Error Boundary Props
 */
export interface ErrorBoundaryEnhancedProps extends Omit<
  ErrorBoundaryProps,
  'onError' | 'fallback'
> {
  /** Whether to show user feedback option */
  enableFeedback?: boolean

  /** Custom fallback component (receives error, reset, and showFeedback props) */
  fallback?: (
    error: Error,
    resetError: () => void,
    showFeedback: () => void
  ) => React.ReactNode

  /** Additional context to include in error reports */
  errorContext?: Record<string, any>

  /** Error severity level */
  severity?: 'fatal' | 'error' | 'warning'

  /** Callback when error is caught (in addition to automatic reporting) */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

/**
 * Default Enhanced Fallback component with feedback option
 */
const DefaultEnhancedFallback = React.memo(function DefaultEnhancedFallback({
  error,
  resetError,
  onFeedbackSubmit,
  enableFeedback,
}: {
  error: Error
  resetError: () => void
  onFeedbackSubmit: (feedback: ErrorFeedbackData) => void
  enableFeedback: boolean
}) {
  const [showFeedbackModal, setShowFeedbackModal] = React.useState(false)

  return (
    <div
      role="alert"
      className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]"
    >
      <div className="mb-4 flex items-center gap-3">
        <svg
          className="h-8 w-8 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-foreground">
          Something went wrong
        </h2>
      </div>

      <p className="mb-4 max-w-md text-center text-sm text-muted-foreground">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>

      <div className="flex gap-3">
        <button
          onClick={resetError}
          className="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground transition-all duration-150 ease-out hover:opacity-90 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2"
        >
          Try Again
        </button>

        {enableFeedback && (
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="rounded-lg border border-destructive bg-card px-4 py-2 text-destructive transition-all duration-150 ease-out hover:bg-destructive/10 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2"
          >
            Report Issue
          </button>
        )}
      </div>

      {process.env['NODE_ENV'] === 'development' && (
        <details className="mt-4 w-full max-w-2xl text-left">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:underline hover:text-foreground transition-colors">
            Error Details (Development Only)
          </summary>
          <pre className="mt-2 overflow-auto rounded-lg bg-muted p-3 text-xs text-foreground border border-border">
            {error.stack}
          </pre>
        </details>
      )}

      <ErrorFeedback
        show={showFeedbackModal}
        error={error}
        onSubmit={(feedback) => {
          onFeedbackSubmit(feedback)
          setShowFeedbackModal(false)
        }}
        onCancel={() => setShowFeedbackModal(false)}
      />
    </div>
  )
})

DefaultEnhancedFallback.displayName = 'DefaultEnhancedFallback'

/**
 * Enhanced Error Boundary Component with Error Tracking
 *
 * This component extends the standard ErrorBoundary with automatic error reporting
 * and optional user feedback collection. It requires ErrorReporterProvider to be
 * present in the component tree.
 *
 * @example
 * ```tsx
 * import { ErrorBoundaryEnhanced, ErrorReporterProvider, createSentryProvider } from '@chat-ui/react'
 *
 * function App() {
 *   return (
 *     <ErrorReporterProvider
 *       config={{
 *         providers: [createSentryProvider({ dsn: 'YOUR_DSN' })],
 *         enabled: true
 *       }}
 *     >
 *       <ErrorBoundaryEnhanced enableFeedback>
 *         <YourApp />
 *       </ErrorBoundaryEnhanced>
 *     </ErrorReporterProvider>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom fallback
 * <ErrorBoundaryEnhanced
 *   enableFeedback
 *   severity="error"
 *   errorContext={{ page: 'chat', feature: 'streaming' }}
 *   fallback={(error, reset, showFeedback) => (
 *     <div>
 *       <h1>Chat Error</h1>
 *       <p>{error.message}</p>
 *       <button onClick={reset}>Retry</button>
 *       <button onClick={showFeedback}>Report</button>
 *     </div>
 *   )}
 * >
 *   <ChatWindow />
 * </ErrorBoundaryEnhanced>
 * ```
 */
export function ErrorBoundaryEnhanced({
  children,
  enableFeedback = true,
  fallback,
  errorContext,
  severity = 'error',
  onError,
  ...props
}: ErrorBoundaryEnhancedProps) {
  const errorReporter = useErrorReporter()
  const [currentError, setCurrentError] = React.useState<Error | null>(null)
  const [currentErrorInfo, setCurrentErrorInfo] =
    React.useState<React.ErrorInfo | null>(null)

  const handleError = React.useCallback(
    (error: Error, errorInfo: React.ErrorInfo) => {
      setCurrentError(error)
      setCurrentErrorInfo(errorInfo)

      // Report to error tracking
      if (errorReporter.isEnabled) {
        errorReporter.reportErrorDetailed({
          message: error.message,
          stack: error.stack,
          severity: severity,
          componentStack: errorInfo.componentStack ?? undefined,
          context: errorContext,
          handled: false, // Error boundaries catch unhandled errors
          originalError: error,
        })
      }

      // Call custom onError callback
      onError?.(error, errorInfo)
    },
    [errorReporter, errorContext, severity, onError]
  )

  const handleFeedbackSubmit = React.useCallback(
    (feedback: ErrorFeedbackData) => {
      if (!currentError || !errorReporter.isEnabled) return

      // Report again with user feedback
      errorReporter.reportErrorDetailed({
        message: currentError.message,
        stack: currentError.stack,
        severity: severity,
        componentStack: currentErrorInfo?.componentStack ?? undefined,
        context: errorContext,
        userFeedback: JSON.stringify(feedback),
        handled: false,
        originalError: currentError,
      })

      logger.debug('[ErrorBoundaryEnhanced] User feedback submitted:', feedback)
    },
    [currentError, currentErrorInfo, errorReporter, errorContext, severity]
  )

  const handleShowFeedback = React.useCallback(() => {
    // Trigger feedback modal (handled by fallback component)
  }, [])

  const enhancedFallback = React.useCallback(
    (error: Error, resetError: () => void) => {
      if (fallback) {
        return fallback(error, resetError, handleShowFeedback)
      }

      return (
        <DefaultEnhancedFallback
          error={error}
          resetError={resetError}
          onFeedbackSubmit={handleFeedbackSubmit}
          enableFeedback={enableFeedback}
        />
      )
    },
    [fallback, handleFeedbackSubmit, enableFeedback, handleShowFeedback]
  )

  return (
    <ErrorBoundary {...props} fallback={enhancedFallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  )
}

/**
 * Hook to programmatically trigger error boundary
 * Useful for handling async errors that occur outside of render
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const throwError = useErrorBoundaryTrigger()
 *
 *   const handleAsyncAction = async () => {
 *     try {
 *       await somethingAsync()
 *     } catch (error) {
 *       throwError(error) // This will trigger the error boundary
 *     }
 *   }
 *
 *   return <button onClick={handleAsyncAction}>Do something</button>
 * }
 * ```
 */
export function useErrorBoundaryTrigger() {
  const [, setError] = React.useState<Error | null>(null)

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error
    })
  }, [])
}
