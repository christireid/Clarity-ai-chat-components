'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  RefreshIcon,
  InfoIcon,
} from '../ui/icons'
import { RetryButton, type RetryErrorType } from './retry-button'
import { useReducedMotion } from '@clarity-chat/primitives'
import {
  getMotionSafeDuration,
  getMotionSafeValue,
} from '../../animations/motion-safe'
import { DURATION_SECONDS as durations } from '../../animations/constants'

/**
 * Error severity levels
 */
export type ErrorSeverity = 'error' | 'warning' | 'info'

/**
 * Detailed error information
 */
export interface ErrorDetails {
  /** Error type for appropriate handling */
  type: RetryErrorType
  /** User-friendly error title */
  title: string
  /** Detailed error message */
  message: string
  /** Error severity level */
  severity?: ErrorSeverity
  /** Suggested actions for resolution */
  suggestions?: string[]
  /** Technical error details (for debugging) */
  technicalDetails?: string
  /** Whether retry is available */
  canRetry?: boolean
  /** Custom retry button text */
  retryButtonText?: string
}

/**
 * ErrorMessage component props
 */
export interface ErrorMessageProps {
  /** Error details */
  error: ErrorDetails | string
  /** Retry callback */
  onRetry?: () => void | Promise<void>
  /** Dismiss callback */
  onDismiss?: () => void
  /** Show technical details toggle */
  showTechnicalDetails?: boolean
  /** Maximum retry attempts */
  maxRetryAttempts?: number
  /** Custom className */
  className?: string
  /** Compact mode (smaller, inline) */
  compact?: boolean
}

/**
 * Default error details for common error types
 */
const DEFAULT_ERROR_DETAILS: Record<
  RetryErrorType,
  Omit<ErrorDetails, 'type'>
> = {
  network: {
    title: 'Connection Lost',
    message:
      'Unable to connect to the server. Please check your internet connection.',
    severity: 'error',
    suggestions: [
      'Check your internet connection',
      'Disable VPN or proxy if enabled',
      'Try refreshing the page',
    ],
    canRetry: true,
  },
  ratelimit: {
    title: 'Too Many Requests',
    message:
      "You've sent too many requests. Please wait a moment before trying again.",
    severity: 'warning',
    suggestions: [
      'Wait a few seconds before retrying',
      'Reduce request frequency',
    ],
    canRetry: true,
    retryButtonText: 'Wait and Retry',
  },
  server: {
    title: 'Server Error',
    message:
      'The server encountered an error. This is temporary and will be resolved shortly.',
    severity: 'error',
    suggestions: [
      'Wait a moment and try again',
      'Check our status page for updates',
      'Contact support if issue persists',
    ],
    canRetry: true,
  },
  auth: {
    title: 'Authentication Failed',
    message: 'Your session has expired or authentication failed.',
    severity: 'error',
    suggestions: [
      'Sign in again',
      'Clear browser cookies and cache',
      'Check your account status',
    ],
    canRetry: false,
  },
  unknown: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred.',
    severity: 'error',
    suggestions: [
      'Try again',
      'Refresh the page',
      'Contact support if issue persists',
    ],
    canRetry: true,
  },
}

/**
 * Parse error into ErrorDetails
 */
function parseError(error: ErrorDetails | string): ErrorDetails {
  if (typeof error === 'string') {
    return {
      type: 'unknown',
      title: 'Error',
      message: error,
      severity: 'error',
      canRetry: true,
    }
  }

  // Merge with defaults for the error type
  const defaults = DEFAULT_ERROR_DETAILS[error.type]
  return {
    ...defaults,
    ...error,
  }
}

/**
 * Enhanced Error Message Component
 *
 * Displays user-friendly error messages with:
 * - Clear error explanations
 * - Suggested resolution actions
 * - Retry functionality with exponential backoff
 * - Technical details toggle (optional)
 * - Smooth animations
 * - Accessibility support
 *
 * @example
 * ```tsx
 * <ErrorMessage
 *   error={{
 *     type: 'network',
 *     title: 'Connection Lost',
 *     message: 'Unable to send message',
 *   }}
 *   onRetry={() => retrySendMessage()}
 * />
 *
 * // Compact mode
 * <ErrorMessage
 *   error="Failed to load data"
 *   onRetry={fetchData}
 *   compact
 * />
 * ```
 */
export function ErrorMessage({
  error,
  onRetry,
  onDismiss,
  showTechnicalDetails = false,
  maxRetryAttempts = 3,
  className,
  compact = false,
}: ErrorMessageProps) {
  const prefersReducedMotion = useReducedMotion()
  const errorDetails = parseError(error)
  const [showDetails, setShowDetails] = React.useState(false)

  const severityConfig = {
    error: {
      icon: AlertCircleIcon,
      iconColor: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
    },
    warning: {
      icon: AlertTriangleIcon,
      iconColor: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
    },
    info: {
      icon: InfoIcon,
      iconColor: 'text-info',
      bgColor: 'bg-info/10',
      borderColor: 'border-info/30',
    },
  }

  const config = severityConfig[errorDetails.severity || 'error']
  const IconComponent = config.icon

  if (compact) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: getMotionSafeValue(prefersReducedMotion, -10, 0),
        }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
        }}
        className={cn(
          'flex items-center gap-2.5 p-2.5 rounded-lg border shadow-sm',
          config.bgColor,
          config.borderColor,
          className
        )}
      >
        <IconComponent size={16} className={cn(config.iconColor, 'shrink-0')} />
        <span className="text-sm text-foreground/90 flex-1">
          {errorDetails.message}
        </span>
        {errorDetails.canRetry && onRetry && (
          <button
            onClick={onRetry}
            className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors"
            aria-label="Retry"
          >
            <RefreshIcon size={14} />
          </button>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: getMotionSafeValue(prefersReducedMotion, 10, 0),
        scale: 0.98,
      }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        // Framer Motion 12: Spring entrance for full error displays
        type: 'spring',
        damping: 25,
        stiffness: 280,
      }}
      className={cn(
        'relative p-4 rounded-lg border shadow-sm space-y-4',
        config.bgColor,
        config.borderColor,
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Header */}
      <div className="flex items-start gap-3.5">
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: getMotionSafeDuration(prefersReducedMotion, 0.4),
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        >
          <IconComponent size={24} className={config.iconColor} />
        </motion.div>

        <div className="flex-1 space-y-1.5">
          <h4 className="font-bold text-foreground">{errorDetails.title}</h4>
          <p className="text-sm text-muted-foreground/90">
            {errorDetails.message}
          </p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors"
            aria-label="Dismiss"
          >
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions */}
      {errorDetails.suggestions && errorDetails.suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{
            delay: getMotionSafeDuration(prefersReducedMotion, 0.1),
          }}
          className="space-y-2.5"
        >
          <p className="text-xs font-semibold text-foreground/90 uppercase tracking-wide">
            Suggested Actions
          </p>
          <ul className="space-y-2">
            {errorDetails.suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{
                  opacity: 0,
                  x: getMotionSafeValue(prefersReducedMotion, -10, 0),
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: getMotionSafeDuration(
                    prefersReducedMotion,
                    0.1 + index * 0.05
                  ),
                  duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
                }}
                className="flex items-start gap-2.5 text-sm text-foreground/90"
              >
                <span className="text-primary mt-0.5">•</span>
                <span>{suggestion}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Technical Details (collapsible) */}
      {showTechnicalDetails && errorDetails.technicalDetails && (
        <div className="space-y-2.5">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/90 hover:text-foreground transition-colors"
          >
            <motion.svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ rotate: showDetails ? 90 : 0 }}
              transition={{ duration: durations.normal }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </motion.svg>
            Technical Details
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.pre
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs bg-muted/50 rounded p-3 overflow-x-auto font-mono"
              >
                {errorDetails.technicalDetails}
              </motion.pre>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Retry Button */}
      {errorDetails.canRetry && onRetry && (
        <motion.div
          initial={{
            opacity: 0,
            y: getMotionSafeValue(prefersReducedMotion, 10, 0),
          }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: getMotionSafeDuration(prefersReducedMotion, 0.2),
          }}
        >
          <RetryButton
            onRetry={onRetry}
            errorType={errorDetails.type}
            maxAttempts={maxRetryAttempts}
            buttonText={errorDetails.retryButtonText}
            size="sm"
          />
        </motion.div>
      )}
    </motion.div>
  )
}

ErrorMessage.displayName = 'ErrorMessage'
