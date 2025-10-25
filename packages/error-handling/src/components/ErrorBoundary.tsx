import React, { Component, ReactNode } from 'react'
import { ClarityChatError } from '../errors'

/**
 * Error boundary props
 */
export interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode
  /** Custom fallback UI when error occurs */
  fallback?: (props: { error: Error; resetError: () => void }) => ReactNode
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** Callback when error boundary is reset */
  onReset?: () => void
}

/**
 * Error boundary state
 */
interface ErrorState {
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Default error fallback UI component
 */
function ErrorFallback({
  error,
  resetError,
}: {
  error: Error
  resetError: () => void
}) {
  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '8px',
        margin: '1rem 0',
      }}
    >
      <h2 style={{ color: '#c00', marginTop: 0 }}>Oops! Something went wrong</h2>
      <p style={{ color: '#600' }}>{error.message}</p>

      {error instanceof ClarityChatError && error.solution && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#fff',
            borderRadius: '4px',
          }}
        >
          <strong>💡 Solution:</strong>
          <p>{error.solution}</p>
        </div>
      )}

      <button
        onClick={resetError}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>

      {process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: '1rem' }}>
          <summary style={{ cursor: 'pointer', color: '#666' }}>
            Stack trace
          </summary>
          <pre
            style={{
              marginTop: '0.5rem',
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.875rem',
            }}
          >
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  )
}

/**
 * Error boundary class component (required by React)
 * Internal implementation wrapped by functional component
 */
class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorState> {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)

    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Clarity Chat Error')
      console.error('Error:', error)

      if (error instanceof ClarityChatError) {
        console.error('\n' + error.toString())
      }

      console.error('Component Stack:', errorInfo.componentStack)
      console.groupEnd()
    }
  }

  reset = () => {
    this.props.onReset?.()
    this.setState({ error: null, errorInfo: null })
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.reset,
        })
      }

      return <ErrorFallback error={this.state.error} resetError={this.reset} />
    }

    return this.props.children
  }
}

/**
 * Error Boundary component - catches errors in child components
 * 
 * Modern functional wrapper around required class component
 * 
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={({ error, resetError }) => (
 *     <div>
 *       <h1>Error: {error.message}</h1>
 *       <button onClick={resetError}>Try Again</button>
 *     </div>
 *   )}
 *   onError={(error, errorInfo) => {
 *     // Log to error tracking service
 *     logErrorToService(error, errorInfo)
 *   }}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorBoundaryClass {...props}>{props.children}</ErrorBoundaryClass>
}
