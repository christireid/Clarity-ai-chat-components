'use client'

import * as React from 'react'
import {
  ErrorBoundary as ReactErrorBoundary,
  useErrorBoundary,
  type FallbackProps,
} from 'react-error-boundary'
import { isClarityError } from '../errors/base-error'

export interface EnhancedErrorBoundaryProps {
  children: React.ReactNode
  /** Custom fallback UI component */
  FallbackComponent?: React.ComponentType<FallbackProps>
  /** Simple fallback element (overridden by FallbackComponent) */
  fallback?: React.ReactNode
  /** Called when error is caught */
  onError?: (error: Error, info: React.ErrorInfo) => void
  /** Called when error boundary is reset */
  onReset?: (details: {
    reason: 'imperative-api' | 'keys'
    prev?: unknown[]
    next?: unknown[]
  }) => void
  /** Keys that trigger reset when changed */
  resetKeys?: unknown[]
  /** Enable error logging to external service */
  enableLogging?: boolean
  /** Custom class for the fallback container */
  className?: string
}

/**
 * Default fallback component with accessible error UI
 */
function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
  const isRecoverable = isClarityError(error) && error.recoverable

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center p-6 text-center"
    >
      <div
        style={{
          borderRadius: '0.5rem',
          border: '1px solid rgba(220, 38, 38, 0.5)',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          padding: '1rem',
          maxWidth: '24rem',
        }}
      >
        <svg
          style={{
            width: '3rem',
            height: '3rem',
            color: '#dc2626',
            margin: '0 auto',
          }}
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
        <h2
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#dc2626',
            marginTop: '0.5rem',
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}
        >
          {isClarityError(error)
            ? error.userMessage
            : 'An unexpected error occurred.'}
        </p>
        {isClarityError(error) && error.solution && (
          <p
            style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#059669',
            }}
          >
            {error.solution}
          </p>
        )}
        {isRecoverable && (
          <button
            onClick={resetErrorBoundary}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: '#2563eb',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb'
            }}
          >
            Try again
          </button>
        )}
      </div>
      {process.env['NODE_ENV'] === 'development' && (
        <details
          style={{
            marginTop: '1rem',
            maxWidth: '32rem',
            textAlign: 'left',
          }}
        >
          <summary
            style={{
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            Error details
          </summary>
          <pre
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              overflow: 'auto',
              maxHeight: '12rem',
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
 * Enhanced Error Boundary with logging and recovery support
 *
 * Uses react-error-boundary v5 for improved error handling patterns.
 *
 * @example
 * ```tsx
 * <EnhancedErrorBoundary
 *   onError={(error) => logToService(error)}
 *   onReset={() => clearCache()}
 * >
 *   <ChatWindow />
 * </EnhancedErrorBoundary>
 * ```
 */
export function EnhancedErrorBoundary({
  children,
  FallbackComponent = DefaultFallback,
  fallback,
  onError,
  onReset,
  resetKeys,
  enableLogging = true,
  className,
}: EnhancedErrorBoundaryProps) {
  const handleError = React.useCallback(
    (error: Error, info: React.ErrorInfo) => {
      // Log to external service
      if (enableLogging) {
        console.error('[EnhancedErrorBoundary] Caught error:', {
          error: isClarityError(error) ? error.toJSON() : error,
          componentStack: info.componentStack,
        })

        // TODO: Replace with actual error logging service
        // logErrorToService(error, info);
      }

      onError?.(error, info)
    },
    [enableLogging, onError]
  )

  const handleReset = React.useCallback(
    (details: {
      reason: 'imperative-api' | 'keys'
      prev?: unknown[]
      next?: unknown[]
    }) => {
      if (enableLogging) {
        console.info('[EnhancedErrorBoundary] Reset:', details.reason)
      }
      onReset?.(details)
    },
    [enableLogging, onReset]
  )

  // Simple fallback wrapper if provided
  const FallbackWrapper = fallback ? () => <>{fallback}</> : FallbackComponent

  return (
    <div className={className}>
      <ReactErrorBoundary
        FallbackComponent={FallbackWrapper}
        onError={handleError}
        onReset={handleReset}
        resetKeys={resetKeys}
      >
        {children}
      </ReactErrorBoundary>
    </div>
  )
}

// Re-export useErrorBoundary for async error handling
export { useErrorBoundary }
export type { FallbackProps }
