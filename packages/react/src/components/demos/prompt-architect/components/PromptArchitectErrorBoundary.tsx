'use client'

/**
 * PromptArchitectErrorBoundary
 *
 * Error boundary wrapper specifically for the Prompt Architect Studio.
 * This is a thin wrapper around the base ErrorBoundary with custom
 * fallback UI.
 *
 * @see {@link ../../../../components/feedback/error-boundary.tsx} for the base implementation
 */

import * as React from 'react'
import { ErrorBoundary } from '../../../feedback/error-boundary'
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

/**
 * Error boundary for the Prompt Architect demo
 *
 * Uses the base ErrorBoundary with a custom fallback UI styled
 * for the PromptArchitect context.
 */
export function PromptArchitectErrorBoundary({
  children,
  fallback,
  onError,
  onReset,
}: PromptArchitectErrorBoundaryProps) {
  // Use custom fallback or default ErrorFallback
  const renderFallback = React.useCallback(
    (error: Error, resetError: () => void) => {
      if (fallback) {
        return fallback({ error, resetError })
      }
      return <ErrorFallback error={error} resetError={resetError} />
    },
    [fallback]
  )

  return (
    <ErrorBoundary
      fallback={renderFallback}
      onError={onError}
      onReset={onReset}
      logError={(error, errorInfo) => {
        // Log to console in development with PromptArchitect context
        if (process.env.NODE_ENV === 'development') {
          console.error('[PromptArchitect] Error caught:', error)
          console.error('[PromptArchitect] Error info:', errorInfo)
        }
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default PromptArchitectErrorBoundary
