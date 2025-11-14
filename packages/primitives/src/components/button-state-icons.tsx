import * as React from 'react'

/**
 * Loading spinner icon for button loading state
 */
export const LoadingIcon: React.FC<{ className?: string }> = React.memo(
  ({ className = 'h-4 w-4' }) => (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
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
  )
)
LoadingIcon.displayName = 'LoadingIcon'

/**
 * Success checkmark icon for button success state
 */
export const SuccessIcon: React.FC<{ className?: string }> = React.memo(
  ({ className = 'h-4 w-4' }) => (
    <svg
      className={`animate-[scale-in_0.2s_ease-out] ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
)
SuccessIcon.displayName = 'SuccessIcon'

/**
 * Error X icon for button error state
 */
export const ErrorIcon: React.FC<{ className?: string }> = React.memo(
  ({ className = 'h-4 w-4' }) => (
    <svg
      className={`animate-[shake_0.4s_ease-in-out] ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
)
ErrorIcon.displayName = 'ErrorIcon'
