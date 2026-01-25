'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, Button } from '@clarity-chat/primitives'
import { duration, EASING_FRAMER } from '../../animations/constants'
import { useReducedMotion } from '@/hooks/accessibility/use-reduced-motion'

export type NetworkStatus = 'online' | 'offline' | 'reconnecting' | 'slow'

export interface NetworkStatusBannerProps {
  /**
   * Current network status
   * @default 'online'
   */
  status?: NetworkStatus
  /**
   * Custom message to display (overrides default messages)
   */
  message?: string
  /**
   * Callback when retry button is clicked (only shown when offline)
   */
  onRetry?: () => void
  /**
   * Callback when dismiss button is clicked
   */
  onDismiss?: () => void
  /**
   * Whether to show the banner
   * @default true when status is not 'online'
   */
  show?: boolean
  /**
   * Auto-hide after X milliseconds (0 = never)
   * @default 0 for offline, 5000 for reconnecting/slow
   */
  autoHideMs?: number
  /**
   * Additional CSS classes
   */
  className?: string
}

const STATUS_CONFIG: Record<
  NetworkStatus,
  { message: string; icon: React.ReactNode; className: string }
> = {
  online: {
    message: 'Connected',
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    className:
      'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-300',
  },
  offline: {
    message: 'No internet connection',
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
        />
      </svg>
    ),
    className:
      'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300',
  },
  reconnecting: {
    message: 'Reconnecting...',
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    className:
      'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300',
  },
  slow: {
    message: 'Slow connection detected',
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    className:
      'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/30 dark:border-orange-800 dark:text-orange-300',
  },
}

/**
 * NetworkStatusBanner - Displays network connectivity status
 *
 * A banner component that shows the current network status and provides
 * user actions like retry or dismiss.
 *
 * @example
 * ```tsx
 * // Auto-detection with useNetworkStatus hook
 * function App() {
 *   const status = useNetworkStatus()
 *   return <NetworkStatusBanner status={status} />
 * }
 *
 * // Manual control
 * <NetworkStatusBanner
 *   status="offline"
 *   onRetry={() => refetchData()}
 *   onDismiss={() => setDismissed(true)}
 * />
 * ```
 */
export function NetworkStatusBanner({
  status = 'online',
  message,
  onRetry,
  onDismiss,
  show,
  autoHideMs,
  className,
}: NetworkStatusBannerProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isVisible, setIsVisible] = React.useState(true)

  // Determine if banner should be shown
  const shouldShow = show ?? (status !== 'online' && isVisible)

  // Auto-hide logic
  React.useEffect(() => {
    if (status === 'online') {
      setIsVisible(true)
      return
    }

    const hideDelay = autoHideMs ?? (status === 'offline' ? 0 : 5000)
    if (hideDelay === 0) return

    const timer = setTimeout(() => {
      setIsVisible(false)
    }, hideDelay)

    return () => clearTimeout(timer)
  }, [status, autoHideMs])

  // Reset visibility when status changes
  React.useEffect(() => {
    setIsVisible(true)
  }, [status])

  const config = STATUS_CONFIG[status]
  const displayMessage = message || config.message

  return (
    <>
      {shouldShow && (
        prefersReducedMotion ? (
          <div
            className={cn('border-b', config.className, className)}
            role="status"
            aria-live="polite"
          >
          <div className="flex items-center justify-between gap-3 px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              {config.icon}
              <span className="text-sm font-medium">{displayMessage}</span>
            </div>
            <div className="flex items-center gap-2">
              {status === 'offline' && onRetry && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={onRetry}
                  className="h-7 px-3 text-xs font-medium"
                >
                  Retry
                </Button>
              )}
              {onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsVisible(false)
                    onDismiss()
                  }}
                  className="h-7 w-7 p-0"
                  aria-label="Dismiss"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              )}
            </div>
          </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: duration('normal'),
              ease: EASING_FRAMER.sharp,
            }}
            className={cn('border-b', config.className, className)}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                {config.icon}
                <span className="text-sm font-medium">{displayMessage}</span>
              </div>
              <div className="flex items-center gap-2">
                {status === 'offline' && onRetry && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={onRetry}
                    className="h-7 px-3 text-xs font-medium"
                  >
                    Retry
                  </Button>
                )}
                {onDismiss && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsVisible(false)
                      onDismiss()
                    }}
                    className="h-7 w-7 p-0"
                    aria-label="Dismiss"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )
      )}
    </>
  )
}

NetworkStatusBanner.displayName = 'NetworkStatusBanner'

/**
 * Hook to detect network connectivity status
 *
 * Uses the Network Information API when available, falls back to
 * navigator.onLine for basic online/offline detection.
 *
 * @example
 * ```tsx
 * function App() {
 *   const status = useNetworkStatus()
 *   return <NetworkStatusBanner status={status} />
 * }
 * ```
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = React.useState<NetworkStatus>(() => {
    if (typeof navigator === 'undefined') return 'online'
    return navigator.onLine ? 'online' : 'offline'
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => {
      // Brief reconnecting state before online
      setStatus('reconnecting')
      setTimeout(() => setStatus('online'), 1000)
    }

    const handleOffline = () => {
      setStatus('offline')
    }

    // Network Information API for connection quality
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection

    const handleConnectionChange = () => {
      if (!connection) return

      // Check for slow connection
      const effectiveType = connection.effectiveType as string
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        setStatus('slow')
      } else if (!navigator.onLine) {
        setStatus('offline')
      } else if (status === 'slow' || status === 'offline') {
        setStatus('online')
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if (connection) {
      connection.addEventListener('change', handleConnectionChange)
      // Initial check
      handleConnectionChange()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [status])

  return status
}
