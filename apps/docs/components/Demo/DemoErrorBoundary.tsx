'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { DemoErrorFallback } from './DemoErrorFallback'

interface Props {
  children: ReactNode
  demoName?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary component for demo pages
 * Catches JavaScript errors in child component tree and displays fallback UI
 *
 * @example
 * <DemoErrorBoundary demoName="Token Visualizer">
 *   <TokenVisualizerDemo />
 * </DemoErrorBoundary>
 */
export class DemoErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      logger.error('Demo Error:', error)
      logger.error('Component Stack:', errorInfo.componentStack)
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo)

    // Track error in analytics (if available)
    if (typeof window !== 'undefined' && (window as { gtag?: (...args: unknown[]) => void }).gtag) {
      const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag
      gtag('event', 'demo_error', {
        event_category: 'demos',
        event_label: this.props.demoName || 'unknown',
        error_message: error.message,
      })
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Use default fallback
      return (
        <DemoErrorFallback
          demoName={this.props.demoName}
          error={this.state.error}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

export default DemoErrorBoundary
