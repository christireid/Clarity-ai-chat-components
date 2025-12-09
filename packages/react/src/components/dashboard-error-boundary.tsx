'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

export interface DashboardErrorBoundaryProps {
  /** Child components to wrap */
  children: React.ReactNode
  /** Custom fallback UI when an error occurs */
  fallback?: React.ReactNode
  /** Widget name for error context */
  widgetName?: string
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** Whether to show retry button */
  showRetry?: boolean
  /** Custom className for the error container */
  className?: string
}

interface DashboardErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary specifically designed for dashboard widgets.
 *
 * Isolates widget failures to prevent full dashboard crashes.
 * Each widget can fail independently while others continue working.
 *
 * @example
 * ```tsx
 * <DashboardErrorBoundary widgetName="Analytics">
 *   <AnalyticsWidget data={data} />
 * </DashboardErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * // With custom fallback
 * <DashboardErrorBoundary
 *   widgetName="Performance"
 *   fallback={<CustomErrorCard />}
 *   onError={(error) => logToService(error)}
 * >
 *   <PerformanceChart />
 * </DashboardErrorBoundary>
 * ```
 */
export class DashboardErrorBoundary extends React.Component<
  DashboardErrorBoundaryProps,
  DashboardErrorBoundaryState
> {
  static displayName = 'DashboardErrorBoundary'

  constructor(props: DashboardErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): DashboardErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to error reporting service
    console.error(
      `[DashboardErrorBoundary] Error in ${this.props.widgetName || 'widget'}:`,
      error,
      errorInfo
    )

    this.props.onError?.(error, errorInfo)
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI - fast loading (< 100ms)
      return (
        <div
          role="alert"
          aria-live="assertive"
          className={cn(
            'flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center',
            this.props.className
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-5 w-5 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {this.props.widgetName
                ? `${this.props.widgetName} failed to load`
                : 'Widget failed to load'}
            </p>
            <p className="text-xs text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>

          {this.props.showRetry !== false && (
            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:ring-offset-2"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </button>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook for programmatically showing error boundary from event handlers.
 *
 * Since error boundaries only catch errors during render, this hook
 * allows you to handle async errors and event handler errors.
 *
 * @example
 * ```tsx
 * function Widget() {
 *   const { showBoundary } = useDashboardErrorHandler()
 *
 *   async function fetchData() {
 *     try {
 *       await fetch('/api/data')
 *     } catch (error) {
 *       showBoundary(error)
 *     }
 *   }
 * }
 * ```
 */
export function useDashboardErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const showBoundary = React.useCallback((err: unknown) => {
    setError(err instanceof Error ? err : new Error(String(err)))
  }, [])

  const resetBoundary = React.useCallback(() => {
    setError(null)
  }, [])

  // Throw the error to trigger nearest error boundary
  if (error) {
    throw error
  }

  return { showBoundary, resetBoundary }
}
