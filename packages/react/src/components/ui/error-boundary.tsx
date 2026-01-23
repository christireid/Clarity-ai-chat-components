/**
 * Error Boundary Components
 *
 * Comprehensive error boundary system for content components.
 * Provides graceful error handling, fallback UI, and error reporting.
 */

import React from 'react'
import { Button } from './button'
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
  showErrorDetails?: boolean
  enableReporting?: boolean
  componentName?: string
}

export interface ErrorFallbackProps {
  error: Error
  errorInfo?: React.ErrorInfo
  resetError: () => void
  componentName?: string
  showDetails?: boolean
}

export interface ErrorReport {
  timestamp: number
  componentName?: string
  error: {
    name: string
    message: string
    stack?: string
  }
  errorInfo?: {
    componentStack: string
  }
  userAgent: string
  url: string
  additionalData?: Record<string, any>
}

// ============================================================================
// ERROR REPORTING
// ============================================================================

/**
 * Error reporting service
 */
class ErrorReporter {
  private static instance: ErrorReporter
  private reports: ErrorReport[] = []
  private maxReports = 100

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter()
    }
    return ErrorReporter.instance
  }

  /**
   * Report an error
   */
  report(report: Omit<ErrorReport, 'timestamp' | 'userAgent' | 'url'>): void {
    const fullReport: ErrorReport = {
      timestamp: Date.now(),
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      ...report,
    }

    this.reports.push(fullReport)

    // Keep only the most recent reports
    if (this.reports.length > this.maxReports) {
      this.reports = this.reports.slice(-this.maxReports)
    }

    // Log in development
    if (process.env['NODE_ENV'] === 'development') {
      console.error('Error Boundary caught an error:', fullReport)
    }

    // In production, you might want to send this to an error reporting service
    // this.sendToErrorReportingService(fullReport)
  }

  /**
   * Get all error reports
   */
  getReports(): ErrorReport[] {
    return this.reports
  }

  /**
   * Clear error reports
   */
  clearReports(): void {
    this.reports = []
  }

  /**
   * Get error summary
   */
  getErrorSummary(): {
    totalErrors: number
    errorsByComponent: Record<string, number>
    recentErrors: ErrorReport[]
  } {
    const errorsByComponent: Record<string, number> = {}

    this.reports.forEach((report) => {
      const component = report.componentName || 'unknown'
      errorsByComponent[component] = (errorsByComponent[component] || 0) + 1
    })

    return {
      totalErrors: this.reports.length,
      errorsByComponent,
      recentErrors: this.reports.slice(-10),
    }
  }
}

// Global error reporter instance
export const errorReporter = ErrorReporter.getInstance()

// ============================================================================
// DEFAULT ERROR FALLBACK COMPONENTS
// ============================================================================

/**
 * Default error fallback for content components
 */
export function ContentErrorFallback({
  error,
  errorInfo,
  resetError,
  componentName,
  showDetails = false,
}: ErrorFallbackProps) {
  const [showStack, setShowStack] = React.useState(false)

  return (
    <div className="flex flex-col items-center justify-center p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20 dark:border-red-800">
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
        <div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Content Error
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300">
            {componentName
              ? `${componentName} failed to render`
              : 'Something went wrong'}
          </p>
        </div>
      </div>

      <div className="text-center mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {error.message || 'An unexpected error occurred'}
        </p>

        {showDetails && (
          <details className="text-left">
            <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
              Error Details
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto max-h-32">
              {error.stack}
              {errorInfo?.componentStack && (
                <>
                  {'\n\nComponent Stack:\n'}
                  {errorInfo.componentStack}
                </>
              )}
            </pre>
          </details>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={resetError}
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>

        <Button
          onClick={() => setShowStack(!showStack)}
          size="sm"
          variant="ghost"
          className="flex items-center gap-2"
        >
          <Bug className="w-4 h-4" />
          {showStack ? 'Hide' : 'Debug'}
        </Button>
      </div>

      {showStack && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-left w-full max-h-48 overflow-auto">
          <div className="font-semibold mb-2">Error Stack:</div>
          {error.stack}
          {errorInfo?.componentStack && (
            <>
              <div className="font-semibold mt-3 mb-2">Component Stack:</div>
              {errorInfo.componentStack}
            </>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Minimal error fallback for inline content
 */
export function InlineErrorFallback({
  error,
  resetError,
  componentName,
}: ErrorFallbackProps) {
  return (
    <span
      className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded cursor-pointer hover:bg-red-200"
      onClick={resetError}
      title={`${componentName || 'Component'} error: ${error.message}`}
    >
      <AlertTriangle className="w-3 h-3 mr-1" />
      Error
    </span>
  )
}

/**
 * Empty state error fallback
 */
export function EmptyStateErrorFallback({
  error,
  resetError,
  componentName,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Unable to Load Content
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md">
        {componentName
          ? `${componentName} encountered an error`
          : 'This content could not be loaded'}
        {error.message && `: ${error.message}`}
      </p>
      <Button onClick={resetError} variant="outline" size="sm">
        Retry
      </Button>
    </div>
  )
}

// ============================================================================
// ERROR BOUNDARY COMPONENTS
// ============================================================================

/**
 * Base error boundary class component
 */
export class BaseErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<typeof BaseErrorBoundary.prototype.state> {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })

    // Report the error
    if (this.props.enableReporting !== false) {
      errorReporter.report({
        componentName: this.props.componentName,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        errorInfo: {
          componentStack: errorInfo.componentStack || '',
        },
      })
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    // Reset error state if reset keys changed
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      )

      if (hasResetKeyChanged) {
        this.resetError()
      }
    }

    // Reset error state if props changed and resetOnPropsChange is true
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetError()
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  override render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || ContentErrorFallback

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo || undefined}
          resetError={this.resetError}
          componentName={this.props.componentName}
          showDetails={this.props.showErrorDetails}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Content Error Boundary - Specialized for content components
 */
export function ContentErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <BaseErrorBoundary
      {...props}
      fallback={props.fallback || ContentErrorFallback}
      componentName={props.componentName || 'ContentComponent'}
    />
  )
}

/**
 * Inline Content Error Boundary - For small inline content
 */
export function InlineContentErrorBoundary(
  props: Omit<ErrorBoundaryProps, 'fallback'>
) {
  return (
    <BaseErrorBoundary
      {...props}
      fallback={InlineErrorFallback}
      componentName={props.componentName || 'InlineContent'}
    />
  )
}

/**
 * Media Error Boundary - Specialized for media components
 */
export function MediaErrorBoundary(props: ErrorBoundaryProps) {
  const MediaFallback = ({
    error,
    resetError,
    componentName,
  }: ErrorFallbackProps) => (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
      <AlertTriangle className="w-8 h-8 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500 text-center">
        {componentName || 'Media'} failed to load
      </p>
      <p className="text-xs text-gray-400 mt-1">{error.message}</p>
      <Button onClick={resetError} variant="ghost" size="sm" className="mt-2">
        Retry
      </Button>
    </div>
  )

  return (
    <BaseErrorBoundary
      {...props}
      fallback={props.fallback || MediaFallback}
      componentName={props.componentName || 'MediaComponent'}
    />
  )
}

/**
 * Async Content Error Boundary - For components that load content asynchronously
 */
export function AsyncContentErrorBoundary(props: ErrorBoundaryProps) {
  const AsyncFallback = ({
    error,
    resetError,
    componentName,
  }: ErrorFallbackProps) => (
    <div className="flex items-center justify-center p-4 border border-yellow-200 rounded bg-yellow-50 dark:bg-yellow-950/20">
      <div className="text-center">
        <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          Failed to Load {componentName || 'Content'}
        </p>
        <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
          {error.message}
        </p>
        <Button
          onClick={resetError}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Reload
        </Button>
      </div>
    </div>
  )

  return (
    <BaseErrorBoundary
      {...props}
      fallback={props.fallback || AsyncFallback}
      componentName={props.componentName || 'AsyncContent'}
    />
  )
}

// ============================================================================
// HOOKS FOR ERROR HANDLING
// ============================================================================

/**
 * Hook for manual error handling in functional components
 */
export function useErrorHandler(componentName?: string) {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback(
    (error: Error, errorInfo?: React.ErrorInfo) => {
      setError(error)

      if (errorInfo) {
        errorReporter.report({
          componentName: componentName || 'UnknownComponent',
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          errorInfo: {
            componentStack: errorInfo.componentStack || '',
          },
        })
      }
    },
    [componentName]
  )

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  // Throw error to trigger error boundary
  if (error) {
    throw error
  }

  return { handleError, resetError, hasError: !!error }
}

/**
 * Hook for async error handling
 */
export function useAsyncErrorHandler(componentName?: string) {
  const [asyncError, setAsyncError] = React.useState<Error | null>(null)

  const handleAsyncError = React.useCallback(
    (error: Error | unknown) => {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error))
      setAsyncError(normalizedError)

      errorReporter.report({
        componentName: componentName || 'AsyncComponent',
        error: {
          name: normalizedError.name,
          message: normalizedError.message,
          stack: normalizedError.stack,
        },
      })
    },
    [componentName]
  )

  const resetAsyncError = React.useCallback(() => {
    setAsyncError(null)
  }, [])

  // Wrap async functions with error handling
  const wrapAsync = React.useCallback(
    <T extends any[], R>(asyncFn: (...args: T) => Promise<R>) => {
      return (...args: T): Promise<R> => {
        return asyncFn(...args).catch((error) => {
          handleAsyncError(error)
          throw error // Rethrow to maintain Promise<R> type
        })
      }
    },
    [handleAsyncError]
  )

  return {
    asyncError,
    handleAsyncError,
    resetAsyncError,
    wrapAsync,
    hasAsyncError: !!asyncError,
  }
}

// ============================================================================
// HIGHER-ORDER COMPONENT
// ============================================================================

/**
 * HOC that wraps a component with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<ErrorBoundaryProps, 'children'> = {}
) {
  const WrappedComponent = (props: P) => (
    <ContentErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ContentErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

/**
 * Error boundary that only shows fallback after multiple failures
 */
export function ResilientErrorBoundary({
  children,
  maxRetries = 3,
  resetTimeout = 5000,
  ...props
}: ErrorBoundaryProps & { maxRetries?: number; resetTimeout?: number }) {
  const [retryCount, setRetryCount] = React.useState(0)

  const handleReset = () => {
    setRetryCount(0)
  }

  const customFallback = (fallbackProps: ErrorFallbackProps) => {
    if (retryCount < maxRetries) {
      // Auto-retry after timeout
      setTimeout(() => {
        setRetryCount((prev) => prev + 1)
        fallbackProps.resetError()
      }, resetTimeout)

      return (
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-gray-600">
              Retrying... ({retryCount + 1}/{maxRetries})
            </p>
          </div>
        </div>
      )
    }

    // Show final fallback
    return <ContentErrorFallback {...fallbackProps} />
  }

  return (
    <BaseErrorBoundary
      {...props}
      fallback={customFallback}
      resetKeys={[retryCount]}
    >
      {children}
    </BaseErrorBoundary>
  )
}

/**
 * Error boundary with reporting toggle
 */
export function ReportableErrorBoundary({
  children,
  enableReporting = true,
  ...props
}: ErrorBoundaryProps & { enableReporting?: boolean }) {
  return (
    <ContentErrorBoundary {...props} enableReporting={enableReporting}>
      {children}
    </ContentErrorBoundary>
  )
}

// ============================================================================
// DEVELOPMENT HELPERS
// ============================================================================

/**
 * Development-only error overlay
 */
export function ErrorOverlay({
  error,
  errorInfo,
}: {
  error: Error
  errorInfo?: React.ErrorInfo
}) {
  if (process.env['NODE_ENV'] !== 'development') {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 0, 0, 0.1)',
        zIndex: 9999,
        padding: '20px',
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#d32f2f',
        overflow: 'auto',
      }}
    >
      <h2 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
        🚨 Development Error Overlay
      </h2>
      <div
        style={{
          background: 'white',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '10px',
        }}
      >
        <strong>
          {error.name}: {error.message}
        </strong>
      </div>
      <details
        style={{ background: 'white', padding: '10px', borderRadius: '4px' }}
      >
        <summary>Stack Trace</summary>
        <pre style={{ margin: '10px 0', whiteSpace: 'pre-wrap' }}>
          {error.stack}
        </pre>
        {errorInfo?.componentStack && (
          <>
            <summary>Component Stack</summary>
            <pre style={{ margin: '10px 0', whiteSpace: 'pre-wrap' }}>
              {errorInfo.componentStack}
            </pre>
          </>
        )}
      </details>
    </div>
  )
}
