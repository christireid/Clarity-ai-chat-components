'use client'

/**
 * ErrorFallback Component
 *
 * A friendly error fallback UI for the Prompt Architect Studio.
 * Shows when an error occurs during rendering.
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

export interface ErrorFallbackProps {
  /** The error that was caught */
  error: Error
  /** Callback to reset the error state */
  resetError: () => void
  /** Additional class name */
  className?: string
}

/**
 * Error fallback UI for the Prompt Architect demo
 */
export function ErrorFallback({
  error,
  resetError,
  className,
}: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex flex-col items-center justify-center h-full min-h-[400px] p-8',
        'bg-background rounded-xl border border-border',
        className
      )}
    >
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="text-5xl mb-4" role="img" aria-label="Error">
          ⚠️
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Something went wrong
        </h2>

        {/* Error message */}
        <p className="text-sm text-muted-foreground mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>

        {/* Error details (collapsed) */}
        <details className="text-left mb-6">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
            Show technical details
          </summary>
          <pre className="mt-2 p-3 text-xs bg-muted rounded-lg overflow-auto scrollbar-hide max-h-32 text-foreground">
            {error.stack || error.toString()}
          </pre>
        </details>

        {/* Reset button */}
        <button
          type="button"
          onClick={resetError}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary/50'
          )}
        >
          Try Again
        </button>

        {/* Help text */}
        <p className="text-xs text-muted-foreground mt-4">
          If this problem persists, try refreshing the page or clearing your
          browser cache.
        </p>
      </div>
    </div>
  )
}

export default ErrorFallback
