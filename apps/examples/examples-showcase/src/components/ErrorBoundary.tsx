/**
 * ErrorBoundary Component
 *
 * Catches errors in React component tree and displays a beautiful
 * glassmorphism-styled error UI with recovery options
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: (error: Error, resetError: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  enableReporting?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }))

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Report error if enabled
    if (this.props.enableReporting) {
      this.reportError(error, errorInfo)
    }
  }

  reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In production, send to error tracking service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }

      // Example: Send to error reporting service
      console.log('Error report:', errorReport)

      // Uncomment to send to actual service:
      // await fetch('/api/error-report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // })
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  reloadPage = () => {
    window.location.reload()
  }

  copyErrorDetails = () => {
    const { error, errorInfo } = this.state
    const errorDetails = `
Error: ${error?.message}

Stack:
${error?.stack}

Component Stack:
${errorInfo?.componentStack}
    `.trim()

    navigator.clipboard.writeText(errorDetails).then(() => {
      alert('Error details copied to clipboard!')
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.resetError)
      }

      // Default glassmorphism error UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-backdrop" />

          <div className="error-boundary-content">
            <div className="error-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1 className="error-title">Oops! Something went wrong</h1>
            <p className="error-subtitle">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            <div className="error-details">
              <div className="error-message">
                <strong>Error:</strong> {this.state.error?.message}
              </div>

              {this.state.errorCount > 1 && (
                <div className="error-count">
                  This error has occurred {this.state.errorCount} times
                </div>
              )}
            </div>

            <div className="error-actions">
              <button
                className="error-button error-button-primary"
                onClick={this.resetError}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Try Again
              </button>

              <button
                className="error-button error-button-secondary"
                onClick={this.reloadPage}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <polyline points="23 20 23 14 17 14" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
                Reload Page
              </button>

              <button
                className="error-button error-button-tertiary"
                onClick={this.copyErrorDetails}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Error Details
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-stack">
                <summary>View Error Stack</summary>
                <pre className="error-stack-content">
                  {this.state.error?.stack}
                </pre>
                {this.state.errorInfo && (
                  <pre className="error-stack-content">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            <div className="error-footer">
              <p>
                If this problem persists, please{' '}
                <a
                  href="https://github.com/christireid/Clarity-ai-chat-components/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  report an issue
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
