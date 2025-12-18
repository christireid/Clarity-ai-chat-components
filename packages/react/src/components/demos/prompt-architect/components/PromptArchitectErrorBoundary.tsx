'use client'

/**
 * PromptArchitectErrorBoundary
 *
 * Error boundary wrapper specifically for the Prompt Architect Studio.
 * Catches render errors and displays a friendly fallback UI.
 */

import * as React from 'react'
import { ErrorFallback } from './ErrorFallback'

export interface PromptArchitectErrorBoundaryProps {
  /** Child components to render */
  children: React.ReactNode
  /** Custom fallback component */
  fallback?: (props: {
    error: Error
    resetError: () => void
  }) => React.ReactNode
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** Callback when error boundary is reset */
  onReset?: () => void
}

interface ErrorBoundaryState {
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Error boundary for the Prompt Architect demo
 */
export class PromptArchitectErrorBoundary extends React.Component<
  PromptArchitectErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: PromptArchitectErrorBoundaryProps) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      logger.error('[PromptArchitect] Error caught:', error)
      logger.error('[PromptArchitect] Error info:', errorInfo)
    }
  }

  resetError = (): void => {
    this.setState({ error: null, errorInfo: null })
    this.props.onReset?.()
  }

  override render(): React.ReactNode {
    const { children, fallback } = this.props
    const { error } = this.state

    if (error) {
      if (fallback) {
        return fallback({ error, resetError: this.resetError })
      }

      return <ErrorFallback error={error} resetError={this.resetError} />
    }

    return children
  }
}

export default PromptArchitectErrorBoundary
