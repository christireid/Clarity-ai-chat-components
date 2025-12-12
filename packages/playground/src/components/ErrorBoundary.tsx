/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in child components and displays
 * a fallback UI with recovery options.
 */

import { Component, type ReactNode } from 'react'
import { AlertCircle, RefreshCw, Copy } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)

    // Log to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    this.props.onReset?.()
  }

  handleCopyError = async () => {
    const { error, errorInfo } = this.state
    const errorText = `Error: ${error?.message}\n\nStack:\n${error?.stack}\n\nComponent Stack:\n${errorInfo?.componentStack}`
    try {
      await navigator.clipboard.writeText(errorText)
    } catch {
      // Silently fail
    }
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorInfo } = this.state

      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                Something went wrong
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                An error occurred while rendering the preview. This might be due
                to invalid code or a runtime error.
              </p>

              {error && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                    Error:
                  </p>
                  <pre className="text-sm text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/40 p-3 rounded-md overflow-x-auto whitespace-pre-wrap font-mono">
                    {error.message}
                  </pre>
                </div>
              )}

              {errorInfo?.componentStack && (
                <details className="mb-4">
                  <summary className="text-sm font-medium text-red-900 dark:text-red-100 cursor-pointer hover:underline">
                    Component Stack
                  </summary>
                  <pre className="mt-2 text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 p-3 rounded-md overflow-x-auto whitespace-pre-wrap font-mono max-h-48">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={this.handleReset}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={this.handleCopyError}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 text-sm font-medium rounded-md transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Error
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Preview-specific Error Boundary
 *
 * A simpler error boundary specifically for the preview iframe area.
 */
interface PreviewErrorBoundaryProps {
  children: ReactNode
  onRetry?: () => void
}

interface PreviewErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class PreviewErrorBoundary extends Component<
  PreviewErrorBoundaryProps,
  PreviewErrorBoundaryState
> {
  constructor(props: PreviewErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<PreviewErrorBoundaryState> {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Preview error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onRetry?.()
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Preview Error
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
            {this.state.error?.message || 'An error occurred in the preview'}
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
