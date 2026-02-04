'use client'

/**
 * Specialized Error Boundaries
 *
 * Domain-specific error boundaries for different use cases:
 * - DashboardErrorBoundary: Widget-level error isolation with retry logic
 * - MediaErrorBoundary: Media/file loading errors
 * - InlineErrorBoundary: Compact inline error display
 * - PanelErrorBoundary: Panel/section error handling
 * - PreviewErrorBoundary: Code preview with error suggestions
 *
 * All built on top of EnhancedErrorBoundary for consistency.
 */

import * as React from 'react'
import {
  EnhancedErrorBoundary,
  type EnhancedErrorBoundaryProps,
  type FallbackProps,
} from './EnhancedErrorBoundary'
// import { isClarityError } from '../errors/base-error' // Currently unused
import { usePrefersReducedMotion } from '../hooks/useAccessibility'

// =============================================================================
// DASHBOARD ERROR BOUNDARY
// =============================================================================

export interface DashboardErrorBoundaryProps extends Omit<
  EnhancedErrorBoundaryProps,
  'FallbackComponent'
> {
  /** Widget name for error context */
  widgetName?: string
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

interface DashboardFallbackState {
  retryCount: number
  isRetrying: boolean
  nextRetryIn: number | null
}

function DashboardFallback({
  error,
  resetErrorBoundary,
  widgetName,
  showRetry = true,
  maxRetries = 3,
  initialBackoffMs = 1000,
  maxBackoffMs = 10000,
  onMaxRetriesExceeded,
  className,
}: FallbackProps & {
  widgetName?: string
  showRetry?: boolean
  maxRetries?: number
  initialBackoffMs?: number
  maxBackoffMs?: number
  onMaxRetriesExceeded?: (error: Error, attempts: number) => void
  className?: string
}) {
  const [state, setState] = React.useState<DashboardFallbackState>({
    retryCount: 0,
    isRetrying: false,
    nextRetryIn: null,
  })
  const retryTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current)
    }
  }, [])

  const calculateBackoff = (attempt: number): number => {
    const exponentialDelay = initialBackoffMs * Math.pow(2, attempt)
    const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5)
    return Math.min(exponentialDelay + jitter, maxBackoffMs)
  }

  const handleRetry = () => {
    const newRetryCount = state.retryCount + 1

    if (newRetryCount > maxRetries) {
      onMaxRetriesExceeded?.(error, newRetryCount)
      return
    }

    const backoffMs = calculateBackoff(state.retryCount)

    setState({
      isRetrying: true,
      retryCount: newRetryCount,
      nextRetryIn: Math.ceil(backoffMs / 1000),
    })

    countdownIntervalRef.current = setInterval(() => {
      setState((prev) => ({
        ...prev,
        nextRetryIn:
          prev.nextRetryIn !== null ? Math.max(0, prev.nextRetryIn - 1) : null,
      }))
    }, 1000)

    retryTimeoutRef.current = setTimeout(() => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current)

      setState({
        retryCount: newRetryCount,
        isRetrying: false,
        nextRetryIn: null,
      })

      resetErrorBoundary()
    }, backoffMs)
  }

  const handleRetryNow = () => {
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current)

    const newRetryCount = state.retryCount + 1
    setState({
      retryCount: newRetryCount,
      isRetrying: false,
      nextRetryIn: null,
    })

    resetErrorBoundary()
  }

  const handleReset = () => {
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current)

    setState({
      retryCount: 0,
      isRetrying: false,
      nextRetryIn: null,
    })

    resetErrorBoundary()
  }

  const hasExceededMaxRetries = state.retryCount >= maxRetries
  const retriesRemaining = maxRetries - state.retryCount
  const { isRetrying, nextRetryIn, retryCount } = state

  // Max retries exceeded - show "give up" state
  if (hasExceededMaxRetries) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          borderRadius: '0.5rem',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          background: 'rgba(239, 68, 68, 0.05)',
          padding: '1.5rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: '2.5rem',
            width: '2.5rem',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '9999px',
            background: 'rgba(239, 68, 68, 0.1)',
          }}
        >
          <svg
            style={{ height: '1.25rem', width: '1.25rem', color: '#ef4444' }}
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

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
        >
          <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {widgetName
              ? `${widgetName} is unavailable`
              : 'Widget is unavailable'}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Failed after {retryCount} attempts. Please try again later.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          style={{
            marginTop: '0.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            borderRadius: '0.375rem',
            background: '#f3f4f6',
            padding: '0.375rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#e5e7eb'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#f3f4f6'
          }}
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
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        background: 'rgba(239, 68, 68, 0.05)',
        padding: '1.5rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '2.5rem',
          width: '2.5rem',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '9999px',
          background: 'rgba(239, 68, 68, 0.1)',
        }}
      >
        {isRetrying ? (
          <svg
            style={{
              height: '1.25rem',
              width: '1.25rem',
              color: '#ef4444',
              animation: !prefersReducedMotion
                ? 'spin 1s linear infinite'
                : 'none',
            }}
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              style={{ opacity: 0.25 }}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              style={{ opacity: 0.75 }}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            style={{ height: '1.25rem', width: '1.25rem', color: '#ef4444' }}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {isRetrying
            ? `Retrying${nextRetryIn ? ` in ${nextRetryIn}s` : '...'}`
            : widgetName
              ? `${widgetName} failed to load`
              : 'Widget failed to load'}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          {isRetrying
            ? `Attempt ${retryCount + 1} of ${maxRetries}`
            : error.message || 'An unexpected error occurred'}
        </p>
        {!isRetrying && retryCount > 0 && (
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            {retriesRemaining} {retriesRemaining === 1 ? 'retry' : 'retries'}{' '}
            remaining
          </p>
        )}
      </div>

      {showRetry && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
          }}
        >
          {isRetrying ? (
            <button
              type="button"
              onClick={handleRetryNow}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                borderRadius: '0.375rem',
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#ef4444',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
              }}
            >
              Retry Now
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRetry}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                borderRadius: '0.375rem',
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#ef4444',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
              }}
            >
              <svg
                style={{ height: '0.75rem', width: '0.75rem' }}
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

/**
 * Dashboard Error Boundary
 *
 * Specialized for dashboard widgets with automatic retry and exponential backoff.
 * Isolates widget failures to prevent full dashboard crashes.
 *
 * @example
 * ```tsx
 * <DashboardErrorBoundary widgetName="Analytics" maxRetries={3}>
 *   <AnalyticsWidget data={data} />
 * </DashboardErrorBoundary>
 * ```
 */
export function DashboardErrorBoundary({
  children,
  widgetName,
  showRetry,
  maxRetries,
  initialBackoffMs,
  maxBackoffMs,
  onMaxRetriesExceeded,
  className,
  ...props
}: DashboardErrorBoundaryProps) {
  const FallbackWrapper = React.useCallback(
    (fallbackProps: FallbackProps) => (
      <DashboardFallback
        {...fallbackProps}
        widgetName={widgetName}
        showRetry={showRetry}
        maxRetries={maxRetries}
        initialBackoffMs={initialBackoffMs}
        maxBackoffMs={maxBackoffMs}
        onMaxRetriesExceeded={onMaxRetriesExceeded}
        className={className}
      />
    ),
    [
      widgetName,
      showRetry,
      maxRetries,
      initialBackoffMs,
      maxBackoffMs,
      onMaxRetriesExceeded,
      className,
    ]
  )

  return (
    <EnhancedErrorBoundary
      {...props}
      FallbackComponent={FallbackWrapper}
      className={className}
    >
      {children}
    </EnhancedErrorBoundary>
  )
}

/**
 * Hook for programmatically showing error boundary from event handlers
 */
export function useDashboardErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const showBoundary = React.useCallback((err: unknown) => {
    setError(err instanceof Error ? err : new Error(String(err)))
  }, [])

  const resetBoundary = React.useCallback(() => {
    setError(null)
  }, [])

  if (error) {
    throw error
  }

  return { showBoundary, resetBoundary }
}

// =============================================================================
// MEDIA ERROR BOUNDARY
// =============================================================================

function MediaFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        border: '2px dashed #d1d5db',
        borderRadius: '0.5rem',
        textAlign: 'center',
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9ca3af"
        strokeWidth="2"
        style={{ marginBottom: '0.5rem' }}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p
        style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginBottom: '0.25rem',
        }}
      >
        Media failed to load
      </p>
      <p
        style={{
          fontSize: '0.75rem',
          color: '#9ca3af',
          marginBottom: '0.5rem',
        }}
      >
        {error.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        style={{
          padding: '0.375rem 0.75rem',
          fontSize: '0.75rem',
          background: 'transparent',
          color: '#6b7280',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  )
}

/**
 * Media Error Boundary
 *
 * Specialized for media components (images, videos, files).
 *
 * @example
 * ```tsx
 * <MediaErrorBoundary>
 *   <ImageGallery images={images} />
 * </MediaErrorBoundary>
 * ```
 */
export function MediaErrorBoundary({
  children,
  ...props
}: EnhancedErrorBoundaryProps) {
  return (
    <EnhancedErrorBoundary {...props} FallbackComponent={MediaFallback}>
      {children}
    </EnhancedErrorBoundary>
  )
}

// =============================================================================
// INLINE ERROR BOUNDARY
// =============================================================================

function InlineFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <span
      onClick={resetErrorBoundary}
      title={error.message}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.125rem 0.5rem',
        fontSize: '0.75rem',
        background: '#fee2e2',
        color: '#991b1b',
        borderRadius: '0.25rem',
        cursor: 'pointer',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = '#fecaca'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = '#fee2e2'
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ marginRight: '0.25rem' }}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      Error
    </span>
  )
}

/**
 * Inline Error Boundary
 *
 * Minimal error display for inline content.
 *
 * @example
 * ```tsx
 * <InlineErrorBoundary>
 *   <InlineComponent />
 * </InlineErrorBoundary>
 * ```
 */
export function InlineErrorBoundary({
  children,
  ...props
}: EnhancedErrorBoundaryProps) {
  return (
    <EnhancedErrorBoundary {...props} FallbackComponent={InlineFallback}>
      {children}
    </EnhancedErrorBoundary>
  )
}

// =============================================================================
// PANEL ERROR BOUNDARY
// =============================================================================

export interface PanelErrorBoundaryProps {
  children: React.ReactNode
  panelName: string
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

function PanelFallback({ panelName }: FallbackProps & { panelName?: string }) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        background: '#fee2e2',
        borderRadius: '0.5rem',
        gap: '0.75rem',
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#991b1b"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div>
        <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>
          {panelName} encountered an error
        </h4>
        <p
          style={{
            margin: '0.25rem 0 0 0',
            fontSize: '0.75rem',
            color: '#6b7280',
          }}
        >
          Please try refreshing the panel or contact support if the issue
          persists.
        </p>
      </div>
    </div>
  )
}

/**
 * Panel Error Boundary
 *
 * For panel/section-level error handling.
 *
 * @example
 * ```tsx
 * <PanelErrorBoundary panelName="Settings Panel">
 *   <SettingsContent />
 * </PanelErrorBoundary>
 * ```
 */
export function PanelErrorBoundary({
  children,
  panelName,
  onError,
}: PanelErrorBoundaryProps) {
  const FallbackWrapper = React.useCallback(
    (props: FallbackProps) => (
      <PanelFallback {...props} panelName={panelName} />
    ),
    [panelName]
  )

  return (
    <EnhancedErrorBoundary
      FallbackComponent={FallbackWrapper}
      onError={onError}
    >
      {children}
    </EnhancedErrorBoundary>
  )
}

// =============================================================================
// PREVIEW ERROR BOUNDARY (for code playgrounds)
// =============================================================================

// Error suggestion patterns
const errorSuggestions: Array<{
  pattern: RegExp
  title: string
  suggestions: string[]
}> = [
  {
    pattern: /is not defined|is not a function/i,
    title: 'Undefined Reference',
    suggestions: [
      'Check if the variable or function is properly imported',
      'Verify the spelling and case sensitivity',
      'Make sure the component is exported correctly',
    ],
  },
  {
    pattern: /cannot read propert|undefined|null/i,
    title: 'Null Reference',
    suggestions: [
      'Add null checks before accessing properties',
      'Use optional chaining (?.) for safer property access',
      'Initialize state with default values',
    ],
  },
  {
    pattern: /invalid hook call|hooks can only be called/i,
    title: 'Invalid Hook Call',
    suggestions: [
      'Hooks must be called at the top level of your component',
      "Don't call hooks inside loops, conditions, or nested functions",
      'Ensure you have only one copy of React in your bundle',
    ],
  },
  {
    pattern: /jsx|unexpected token/i,
    title: 'Syntax Error',
    suggestions: [
      'Check for missing or extra brackets, parentheses, or braces',
      'Ensure JSX elements are properly closed',
      'Verify all imports are correct',
    ],
  },
  {
    pattern: /maximum update depth|infinite loop/i,
    title: 'Infinite Loop',
    suggestions: [
      'Check useEffect dependencies array',
      'Avoid setting state unconditionally in useEffect',
      'Use useCallback for functions passed as dependencies',
    ],
  },
  {
    pattern: /render|component/i,
    title: 'Render Error',
    suggestions: [
      'Check if all required props are passed',
      'Verify conditional rendering logic',
      'Make sure the component returns valid JSX',
    ],
  },
]

function getErrorSuggestion(errorMessage: string) {
  for (const suggestion of errorSuggestions) {
    if (suggestion.pattern.test(errorMessage)) {
      return suggestion
    }
  }
  return {
    title: 'Runtime Error',
    suggestions: [
      'Check the console for more details',
      'Review recent code changes',
      'Try resetting to the original template',
    ],
  }
}

export interface PreviewErrorBoundaryProps {
  children: React.ReactNode
  onRetry?: () => void
}

function PreviewFallback({
  error,
  resetErrorBoundary,
  onRetry,
}: FallbackProps & { onRetry?: () => void }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const suggestion = getErrorSuggestion(error.message || '')

  const handleRetry = () => {
    resetErrorBoundary()
    onRetry?.()
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
        textAlign: 'center',
        animation: !prefersReducedMotion ? 'fadeIn 0.3s ease-out' : 'none',
      }}
    >
      <div
        style={{
          width: '4rem',
          height: '4rem',
          borderRadius: '1rem',
          background:
            'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.1))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
        }}
      >
        Preview Error
      </h3>

      <span
        style={{
          display: 'inline-block',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#dc2626',
          fontSize: '0.75rem',
          fontWeight: 500,
          marginBottom: '0.75rem',
        }}
      >
        {suggestion.title}
      </span>

      <p
        style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginBottom: '1rem',
          maxWidth: '32rem',
        }}
      >
        {error.message || 'An error occurred in the preview'}
      </p>

      <div
        style={{
          marginBottom: '1.5rem',
          padding: '0.75rem 1rem',
          background: 'rgba(251, 191, 36, 0.05)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          textAlign: 'left',
          maxWidth: '32rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#d97706',
            }}
          >
            Quick Tip
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#d97706', margin: 0 }}>
          {suggestion.suggestions[0]}
        </p>
      </div>

      <button
        onClick={handleRetry}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.625rem 1.25rem',
          background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: 500,
          borderRadius: '0.75rem',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow =
            '0 6px 16px rgba(99, 102, 241, 0.35)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow =
            '0 4px 12px rgba(99, 102, 241, 0.25)'
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M23 4v6h-6" />
          <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
        </svg>
        Retry
      </button>
    </div>
  )
}

/**
 * Preview Error Boundary
 *
 * For code playgrounds with helpful error suggestions.
 *
 * @example
 * ```tsx
 * <PreviewErrorBoundary onRetry={() => resetPreview()}>
 *   <LiveCodePreview code={code} />
 * </PreviewErrorBoundary>
 * ```
 */
export function PreviewErrorBoundary({
  children,
  onRetry,
}: PreviewErrorBoundaryProps) {
  const FallbackWrapper = React.useCallback(
    (props: FallbackProps) => <PreviewFallback {...props} onRetry={onRetry} />,
    [onRetry]
  )

  return (
    <EnhancedErrorBoundary FallbackComponent={FallbackWrapper}>
      {children}
    </EnhancedErrorBoundary>
  )
}
