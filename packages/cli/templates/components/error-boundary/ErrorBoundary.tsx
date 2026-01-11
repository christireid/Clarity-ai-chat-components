/**
 * Error Boundary Component
 * Graceful error handling for chat components
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.handleReset)
      }

      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error: Error
  onReset: () => void
}

function DefaultErrorFallback({ error, onReset }: DefaultErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2 text-red-600 mb-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="text-lg font-semibold">Something went wrong</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
        {error.message || 'An unexpected error occurred'}
      </p>

      <button
        onClick={onReset}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
      >
        Try again
      </button>

      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 w-full max-w-md">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
            Error details
          </summary>
          <pre className="mt-2 p-2 text-xs bg-gray-100 rounded overflow-auto max-h-32">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  )
}

// Hook for functional error handling
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  // Throw error to be caught by ErrorBoundary
  if (error) {
    throw error
  }

  return { handleError, clearError }
}
