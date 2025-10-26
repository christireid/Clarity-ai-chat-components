/**
 * Enhanced Error Boundary System
 * 
 * Comprehensive error boundary with:
 * - Error recovery and retry mechanisms
 * - Error logging and reporting
 * - Fallback UI with context
 * - Reset functionality
 * - Development vs production modes
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { AlertCircleIcon, RefreshIcon, XCircleIcon } from './icons'
import { InteractiveButton } from './interactive-card'

export interface ErrorInfo {
  componentStack: string
}

export interface ErrorBoundaryProps {
  /** Custom fallback UI */
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => React.ReactNode
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Callback before reset */
  onReset?: () => void
  /** Show detailed error in development */
  showDetails?: boolean
  /** Children to wrap */
  children: React.ReactNode
  /** Custom className */
  className?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorCount: number
}

/**
 * Enhanced Error Boundary Class Component
 */
export class ErrorBoundaryEnhanced extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError } = this.props

    // Update state with error info
    this.setState((prev) => ({
      errorInfo: errorInfo as ErrorInfo,
      errorCount: prev.errorCount + 1,
    }))

    // Log error
    console.error('Error caught by boundary:', error, errorInfo)

    // Call error callback
    onError?.(error, errorInfo as ErrorInfo)

    // Report to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      ;(window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      })
    }
  }

  handleReset = () => {
    const { onReset } = this.props

    // Call reset callback
    onReset?.()

    // Reset state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    const { hasError, error, errorInfo, errorCount } = this.state
    const { children, fallback, showDetails = process.env.NODE_ENV === 'development', className } = this.props

    if (hasError && error && errorInfo) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo, this.handleReset)
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          errorCount={errorCount}
          showDetails={showDetails}
          onReset={this.handleReset}
          className={className}
        />
      )
    }

    return children
  }
}

/**
 * Default Error Fallback UI
 */
interface DefaultErrorFallbackProps {
  error: Error
  errorInfo: ErrorInfo
  errorCount: number
  showDetails: boolean
  onReset: () => void
  className?: string
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  errorInfo,
  errorCount,
  showDetails,
  onReset,
  className,
}) => {
  const [showStack, setShowStack] = React.useState(false)

  // Too many errors, show warning
  const tooManyErrors = errorCount > 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center justify-center min-h-[400px] p-8',
        className
      )}
    >
      <div className="max-w-md w-full space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1] }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10"
          >
            {tooManyErrors ? (
              <XCircleIcon size={32} className="text-destructive" />
            ) : (
              <AlertCircleIcon size={32} className="text-destructive" />
            )}
          </motion.div>
        </div>

        {/* Error Message */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">
            {tooManyErrors ? 'Multiple Errors Detected' : 'Something went wrong'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {tooManyErrors
              ? 'The component has crashed multiple times. Please refresh the page or contact support.'
              : 'An unexpected error occurred. You can try again or refresh the page.'}
          </p>
        </div>

        {/* Error Details (Development) */}
        {showDetails && (
          <div className="space-y-2">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="font-mono text-sm space-y-1">
                <div className="font-semibold text-destructive">
                  {error.name}: {error.message}
                </div>
                {error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                      Show stack trace
                    </summary>
                    <pre className="mt-2 text-xs overflow-x-auto whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>

            {/* Component Stack */}
            {errorInfo.componentStack && (
              <div className="p-4 rounded-lg bg-muted border">
                <button
                  onClick={() => setShowStack(!showStack)}
                  className="text-sm font-medium hover:underline"
                >
                  {showStack ? 'Hide' : 'Show'} component stack
                </button>
                {showStack && (
                  <pre className="mt-2 text-xs overflow-x-auto whitespace-pre-wrap text-muted-foreground">
                    {errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          {!tooManyErrors && (
            <InteractiveButton
              variant="primary"
              icon={<RefreshIcon size={18} />}
              onClick={onReset}
            >
              Try Again
            </InteractiveButton>
          )}
          <InteractiveButton
            variant="ghost"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </InteractiveButton>
        </div>

        {/* Error Count */}
        {errorCount > 1 && (
          <div className="text-center text-xs text-muted-foreground">
            Error occurred {errorCount} time{errorCount > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Functional Error Boundary Hook (Experimental)
 * 
 * Note: This is a simplified version. Class components are still
 * recommended for error boundaries until React adds official hook support.
 */
export function useErrorHandler(): (error: Error) => void {
  const [, setError] = React.useState<Error>()

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error
    })
  }, [])
}

/**
 * Error Boundary for async operations
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ErrorBoundaryEnhanced {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundaryEnhanced>
    )
  }

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}

/**
 * Mini error boundary for inline errors
 */
export const InlineErrorBoundary: React.FC<{
  children: React.ReactNode
  fallback?: React.ReactNode
}> = ({ children, fallback }) => {
  return (
    <ErrorBoundaryEnhanced
      fallback={(error) => (
        fallback || (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircleIcon size={16} />
              <span className="font-medium">Error: {error.message}</span>
            </div>
          </div>
        )
      )}
    >
      {children}
    </ErrorBoundaryEnhanced>
  )
}
