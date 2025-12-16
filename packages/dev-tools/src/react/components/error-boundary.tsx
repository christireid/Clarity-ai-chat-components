import { logger } from '@clarity-chat/utils/logger';
/**
 * Error Boundary Component
 * Catches JavaScript errors in child component trees
 * and displays a graceful fallback UI
 */

'use client'

import * as React from 'react'
import { AlertTriangleIcon } from './icons'

export interface ErrorBoundaryProps {
  /** Child components to render */
  children: React.ReactNode
  /** Custom fallback UI (optional) */
  fallback?: React.ReactNode
  /** Name of the component for error reporting */
  componentName?: string
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** Whether to show detailed error info in development */
  showDetails?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 */
export class ErrorBoundary extends React.Component<
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

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      logger.logger.error(
        `[ErrorBoundary${this.props.componentName ? `: ${this.props.componentName}` : ''}]`,
        error,
        errorInfo
      )
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          componentName={this.props.componentName}
          showDetails={this.props.showDetails}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Default Error Fallback UI
 */
interface ErrorFallbackProps {
  error: Error | null
  errorInfo: React.ErrorInfo | null
  componentName?: string
  showDetails?: boolean
  onRetry: () => void
}

function ErrorFallback({
  error,
  errorInfo,
  componentName,
  showDetails = process.env.NODE_ENV === 'development',
  onRetry,
}: ErrorFallbackProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div className="error-boundary-fallback" role="alert">
      <div className="error-boundary-content">
        <div className="error-boundary-icon" aria-hidden="true">
          <AlertTriangleIcon size="xl" />
        </div>
        <h3 className="error-boundary-title">
          {componentName ? `${componentName} Error` : 'Something went wrong'}
        </h3>
        <p className="error-boundary-message">
          {error?.message || 'An unexpected error occurred'}
        </p>

        <div className="error-boundary-actions">
          <button
            className="dt-btn dt-btn-primary"
            onClick={onRetry}
            aria-label="Retry loading component"
          >
            Try Again
          </button>
          {showDetails && error && (
            <button
              className="dt-btn dt-btn-ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </button>
          )}
        </div>

        {showDetails && isExpanded && (
          <details className="error-boundary-details" open>
            <summary className="sr-only">Error details</summary>
            <div className="error-details-content">
              <div className="error-section">
                <h4>Error Message</h4>
                <pre className="code-block">
                  <code>{error?.message}</code>
                </pre>
              </div>
              {error?.stack && (
                <div className="error-section">
                  <h4>Stack Trace</h4>
                  <pre className="code-block">
                    <code>{error.stack}</code>
                  </pre>
                </div>
              )}
              {errorInfo?.componentStack && (
                <div className="error-section">
                  <h4>Component Stack</h4>
                  <pre className="code-block">
                    <code>{errorInfo.componentStack}</code>
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}

/**
 * HOC to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...options}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}

/**
 * Panel-specific error boundary with consistent styling
 */
export interface PanelErrorBoundaryProps {
  /** Child components to render */
  children: React.ReactNode
  /** Panel name for error identification */
  panelName: string
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function PanelErrorBoundary({
  children,
  panelName,
  onError,
}: PanelErrorBoundaryProps) {
  return (
    <ErrorBoundary
      componentName={panelName}
      onError={onError}
      fallback={
        <div className="panel-error-fallback" role="alert">
          <div className="panel-error-content">
            <AlertTriangleIcon size="lg" />
            <div className="panel-error-text">
              <h4>{panelName} encountered an error</h4>
              <p>
                Please try refreshing the panel or contact support if the issue
                persists.
              </p>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary
