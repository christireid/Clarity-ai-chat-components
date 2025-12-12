'use client'

import * as React from 'react'
import { usePrefersReducedMotion } from '../hooks/useAccessibility'

export interface RetryCountdownProps {
  /** Remaining time in milliseconds */
  remainingMs: number
  /** Called when countdown completes */
  onComplete?: () => void
  /** Called when user clicks "Retry now" */
  onRetryNow?: () => void
  /** Show progress ring visualization */
  showProgress?: boolean
  /** Size of the countdown display */
  size?: 'sm' | 'md' | 'lg'
  /** Custom class name */
  className?: string
}

/**
 * Visual countdown timer for retry delays
 *
 * Shows users when automatic retry will occur with optional progress ring.
 *
 * @example
 * ```tsx
 * <RetryCountdown
 *   remainingMs={5000}
 *   onComplete={() => triggerRetry()}
 *   onRetryNow={() => immediateRetry()}
 *   showProgress
 * />
 * ```
 */
export function RetryCountdown({
  remainingMs,
  onComplete,
  onRetryNow,
  showProgress = true,
  size = 'md',
  className,
}: RetryCountdownProps) {
  const [timeLeft, setTimeLeft] = React.useState(remainingMs)
  const prefersReducedMotion = usePrefersReducedMotion()
  const intervalRef = React.useRef<ReturnType<typeof setInterval>>()

  const totalTime = React.useRef(remainingMs)

  React.useEffect(() => {
    totalTime.current = remainingMs
    setTimeLeft(remainingMs)
  }, [remainingMs])

  React.useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.()
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 100
        if (newTime <= 0) {
          clearInterval(intervalRef.current)
          return 0
        }
        return newTime
      })
    }, 100)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timeLeft, onComplete])

  const seconds = Math.ceil(timeLeft / 1000)
  const progress = totalTime.current > 0 ? timeLeft / totalTime.current : 0

  const sizeStyles = {
    sm: { container: 60, ring: 50, stroke: 3, font: '1rem' },
    md: { container: 80, ring: 70, stroke: 4, font: '1.25rem' },
    lg: { container: 100, ring: 90, stroke: 5, font: '1.5rem' },
  }

  const styles = sizeStyles[size]
  const circumference = 2 * Math.PI * (styles.ring / 2 - styles.stroke)
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
      }}
      role="timer"
      aria-live="polite"
      aria-label={`Retrying in ${seconds} seconds`}
    >
      {showProgress ? (
        <div
          style={{
            position: 'relative',
            width: styles.container,
            height: styles.container,
          }}
        >
          <svg
            width={styles.container}
            height={styles.container}
            viewBox={`0 0 ${styles.ring} ${styles.ring}`}
            style={{
              transform: 'rotate(-90deg)',
            }}
          >
            {/* Background circle */}
            <circle
              cx={styles.ring / 2}
              cy={styles.ring / 2}
              r={styles.ring / 2 - styles.stroke}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={styles.stroke}
            />
            {/* Progress circle */}
            <circle
              cx={styles.ring / 2}
              cy={styles.ring / 2}
              r={styles.ring / 2 - styles.stroke}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={styles.stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: prefersReducedMotion
                  ? 'none'
                  : 'stroke-dashoffset 0.1s linear',
              }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: styles.font,
              fontWeight: 600,
              color: '#374151',
            }}
          >
            {seconds}
          </div>
        </div>
      ) : (
        <div
          style={{
            fontSize: styles.font,
            fontWeight: 600,
            color: '#374151',
          }}
        >
          Retrying in {seconds}...
        </div>
      )}

      <p
        style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: 0,
        }}
      >
        {seconds > 0 ? 'Automatic retry scheduled' : 'Retrying now...'}
      </p>

      {onRetryNow && seconds > 0 && (
        <button
          onClick={onRetryNow}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.75rem',
            color: '#3b82f6',
            backgroundColor: 'transparent',
            border: '1px solid #3b82f6',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            transition: 'background-color 0.15s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Retry now
        </button>
      )}
    </div>
  )
}
