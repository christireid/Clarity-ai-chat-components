import * as React from 'react'
import { cn } from '../lib/utils'

// ============================================================================
// Shared Icons & Display Components
// ============================================================================
// This file contains reusable icons and small display components used across
// the primitives package. Includes both generic icons (CloseIcon) and
// button-specific state icons (LoadingIcon, SuccessIcon, ErrorIcon).

/**
 * Close/X icon used in dialogs, input clear buttons, etc.
 * Uses Radix Icons' Cross2 icon path
 */
export const CloseIcon: React.FC<{ className?: string }> = React.memo(
  ({ className = 'h-4 w-4' }) => (
    <svg
      className={className}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
)
CloseIcon.displayName = 'CloseIcon'

/**
 * Character count display component for inputs and textareas
 * Shows current/max with over-limit styling
 */
export interface CharacterCountProps {
  /** Current character count */
  current: number
  /** Maximum allowed characters (optional) */
  max?: number
  /** Custom className */
  className?: string
}

export const CharacterCount: React.FC<CharacterCountProps> = React.memo(
  function CharacterCount({ current, max, className }) {
    // Normalize inputs: ensure non-negative integers, handle NaN
    const normalizedCurrent = Math.max(0, Math.floor(current) || 0)
    // Only use max if it's a positive number
    const normalizedMax =
      max !== undefined && Number.isFinite(max) && max > 0
        ? Math.floor(max)
        : undefined
    const isOverLimit =
      normalizedMax !== undefined && normalizedCurrent > normalizedMax

    return (
      <span
        className={cn(
          'text-xs tabular-nums',
          isOverLimit ? 'text-destructive' : 'text-muted-foreground',
          className
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {normalizedCurrent}
        {normalizedMax !== undefined && `/${normalizedMax}`}
      </span>
    )
  }
)
CharacterCount.displayName = 'CharacterCount'

// ============================================================================
// Button State Icons
// ============================================================================

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
