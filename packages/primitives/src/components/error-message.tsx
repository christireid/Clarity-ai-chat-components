import * as React from 'react'
import { cn } from '../lib/utils'

export interface ErrorMessageProps {
  error?: string
  className?: string
}

/**
 * Reusable error message component for form inputs
 * 
 * @example
 * ```tsx
 * <ErrorMessage error="This field is required" />
 * ```
 */
export const ErrorMessage = React.memo<ErrorMessageProps>(
  ({ error, className }) => {
    if (!error) return null

    return (
      <p
        className={cn(
          'mt-1.5 text-xs text-destructive flex items-center gap-1.5 animate-in fade-in-0 slide-in-from-top-1 duration-150 font-medium',
          className
        )}
        role="alert"
        aria-live="polite"
      >
        <svg
          className="h-3 w-3 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {error}
      </p>
    )
  }
)

ErrorMessage.displayName = 'ErrorMessage'
