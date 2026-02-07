'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  sectionTitle?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const section = this.props.sectionTitle || 'Unknown'
    console.error(
      `[SectionErrorBoundary] Error in "${section}":`,
      error,
      errorInfo.componentStack
    )
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="rounded-lg border border-red-500/30 bg-red-500/5 p-6"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h4 className="font-medium text-red-400">
                {this.props.sectionTitle
                  ? `Failed to render "${this.props.sectionTitle}"`
                  : 'Component render error'}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {this.state.error?.message || 'An unexpected error occurred.'}
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="mt-3 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
