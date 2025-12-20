'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ShowcaseErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ShowcaseErrorBoundary caught error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="h-[700px] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-2xl border border-red-200 dark:border-red-800 overflow-hidden shadow-xl flex items-center justify-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle
                className="w-8 h-8 text-red-500"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              The demo encountered an unexpected error.
            </p>
            {this.state.error && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
              aria-label="Retry loading the demo"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
