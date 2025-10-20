import * as React from 'react'

/**
 * Error boundary props
 */
export interface ErrorBoundaryProps {
  /** Child components to render */
  children: React.ReactNode
  
  /** Fallback UI to render when error occurs */
  fallback?: React.ReactNode | ((error: Error, resetError: () => void) => React.ReactNode)
  
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
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Default fallback component
 */
const DefaultFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError,
}) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-red-50 dark:bg-red-900/10 rounded-lg border-2 border-red-200 dark:border-red-800"
    >
      <div className="flex items-center gap-3 mb-4">
        <svg
          className="w-8 h-8 text-red-600 dark:text-red-400"
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
        <h2 className="text-xl font-semibold text-red-900 dark:text-red-100">
          Something went wrong
        </h2>
      </div>
      
      <p className="text-sm text-red-800 dark:text-red-200 mb-4 text-center max-w-md">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      
      <button
        onClick={resetError}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Try Again
      </button>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left w-full max-w-2xl">
          <summary className="text-sm text-red-700 dark:text-red-300 cursor-pointer hover:underline">
            Error Details (Development Only)
          </summary>
          <pre className="mt-2 p-3 bg-red-100 dark:bg-red-900/20 rounded text-xs text-red-900 dark:text-red-100 overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  )
}

/**
 * Production-ready Error Boundary component for graceful error handling.
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
 * **Use Cases:**
 * - Wrap entire chat application for top-level error handling
 * - Wrap individual message components for isolated error handling
 * - Wrap streaming components to handle API failures
 * - Wrap third-party integrations
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
 *     console.log('Error boundary reset for new conversation')
 *   }}
 * >
 *   <ChatWindow conversationId={conversationId} />
 * </ErrorBoundary>
 * 
 * // Custom error logging
 * <ErrorBoundary
 *   logError={(error, errorInfo) => {
 *     Sentry.captureException(error, {
 *       contexts: {
 *         react: {
 *           componentStack: errorInfo.componentStack,
 *         },
 *       },
 *     })
 *   }}
 * >
 *   <ChatWindow />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console
    console.error('[ErrorBoundary] Error caught:', error, errorInfo)

    // Custom error logging
    if (this.props.logError) {
      this.props.logError(error, errorInfo)
    }

    // Call onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys } = this.props
    const { hasError } = this.state

    // Reset error when resetKeys change
    if (
      hasError &&
      resetKeys &&
      prevProps.resetKeys &&
      resetKeys.length === prevProps.resetKeys.length &&
      resetKeys.some((key, index) => key !== prevProps.resetKeys![index])
    ) {
      this.reset()
    }
  }

  reset = (): void => {
    // Call onReset callback
    if (this.props.onReset) {
      this.props.onReset()
    }

    // Reset state
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render(): React.ReactNode {
    const { hasError, error } = this.state
    const { children, fallback } = this.props

    if (hasError && error) {
      // Render custom fallback
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, this.reset)
        }
        return fallback
      }

      // Render default fallback
      return <DefaultFallback error={error} resetError={this.reset} />
    }

    // Render children normally
    return children
  }
}
