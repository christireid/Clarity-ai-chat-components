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
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Initial backoff delay in ms (default: 1000) */
  initialBackoffMs?: number
  /** Maximum backoff delay in ms (default: 10000) */
  maxBackoffMs?: number
  /** Callback when max retries exceeded */
  onMaxRetriesExceeded?: (error: Error, attempts: number) => void
  /** Custom className for the error container */
  className?: string
}

interface DashboardErrorBoundaryState {
  hasError: boolean
  error: Error | null
  retryCount: number
  isRetrying: boolean
  nextRetryIn: number | null
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
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null
  private countdownIntervalId: ReturnType<typeof setInterval> | null = null

  constructor(props: DashboardErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
      nextRetryIn: null,
    }
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<DashboardErrorBoundaryState> {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to error reporting service
    logger.logger.error(
      `[DashboardErrorBoundary] Error in ${this.props.widgetName || 'widget'}:`,
      error,
      errorInfo
    )

    this.props.onError?.(error, errorInfo)
  }

  override componentWillUnmount(): void {
    this.clearTimers()
  }

  clearTimers = (): void => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
      this.retryTimeoutId = null
    }
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId)
      this.countdownIntervalId = null
    }
  }

  /**
   * Calculate backoff delay with exponential growth and jitter
   */
  calculateBackoff = (attempt: number): number => {
    const { initialBackoffMs = 1000, maxBackoffMs = 10000 } = this.props
    // Exponential backoff: delay = initial * 2^attempt
    const exponentialDelay = initialBackoffMs * Math.pow(2, attempt)
    // Add jitter (±20%) to prevent thundering herd
    const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5)
    return Math.min(exponentialDelay + jitter, maxBackoffMs)
  }

  handleRetry = (): void => {
    const { maxRetries = 3 } = this.props
    const newRetryCount = this.state.retryCount + 1

    if (newRetryCount > maxRetries) {
      // Max retries exceeded
      this.props.onMaxRetriesExceeded?.(this.state.error!, newRetryCount)
      return
    }

    const backoffMs = this.calculateBackoff(this.state.retryCount)

    this.setState({
      isRetrying: true,
      nextRetryIn: Math.ceil(backoffMs / 1000),
    })

    // Countdown timer for UI
    this.countdownIntervalId = setInterval(() => {
      this.setState((prev) => ({
        nextRetryIn:
          prev.nextRetryIn !== null ? Math.max(0, prev.nextRetryIn - 1) : null,
      }))
    }, 1000)

    // Actual retry after backoff
    this.retryTimeoutId = setTimeout(() => {
      this.clearTimers()
      this.setState({
        hasError: false,
        error: null,
        retryCount: newRetryCount,
        isRetrying: false,
        nextRetryIn: null,
      })
    }, backoffMs)
  }

  handleRetryNow = (): void => {
    this.clearTimers()
    const newRetryCount = this.state.retryCount + 1
    this.setState({
      hasError: false,
      error: null,
      retryCount: newRetryCount,
      isRetrying: false,
      nextRetryIn: null,
    })
  }

  handleReset = (): void => {
    this.clearTimers()
    this.setState({
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
      nextRetryIn: null,
    })
  }

  get hasExceededMaxRetries(): boolean {
    const { maxRetries = 3 } = this.props
    return this.state.retryCount >= maxRetries
  }

  override render(): React.ReactNode {
    const { maxRetries = 3 } = this.props

    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { isRetrying, nextRetryIn, retryCount } = this.state
      const retriesRemaining = maxRetries - retryCount

      // Max retries exceeded - show "give up" state
      if (this.hasExceededMaxRetries) {
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {this.props.widgetName
                  ? `${this.props.widgetName} is unavailable`
                  : 'Widget is unavailable'}
              </p>
              <p className="text-xs text-muted-foreground">
                Failed after {retryCount} attempts. Please try again later.
              </p>
            </div>

            <button
              type="button"
              onClick={this.handleReset}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2"
            >
              Start Over
            </button>
          </div>
        )
      }

      // Default error UI with retry state
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
            {isRetrying ? (
              <svg
                className="h-5 w-5 text-destructive animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
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
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isRetrying
                ? `Retrying${nextRetryIn ? ` in ${nextRetryIn}s` : '...'}`
                : this.props.widgetName
                  ? `${this.props.widgetName} failed to load`
                  : 'Widget failed to load'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isRetrying
                ? `Attempt ${retryCount + 1} of ${maxRetries}`
                : this.state.error?.message || 'An unexpected error occurred'}
            </p>
            {!isRetrying && retryCount > 0 && (
              <p className="text-xs text-muted-foreground/70">
                {retriesRemaining}{' '}
                {retriesRemaining === 1 ? 'retry' : 'retries'} remaining
              </p>
            )}
          </div>

          {this.props.showRetry !== false && (
            <div className="flex items-center gap-2 mt-2">
              {isRetrying ? (
                <button
                  type="button"
                  onClick={this.handleRetryNow}
                  className="inline-flex items-center gap-1.5 rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:ring-offset-2"
                >
                  Retry Now
                </button>
              ) : (
                <button
                  type="button"
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-1.5 rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:ring-offset-2"
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
