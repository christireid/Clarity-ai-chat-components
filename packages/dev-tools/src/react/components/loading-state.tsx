/**
 * Loading State Components
 * Reusable loading indicators for dev tools panels
 */

'use client'

import * as React from 'react'

export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg'
  /** Additional CSS class */
  className?: string
  /** Accessible label */
  label?: string
}

/**
 * Animated loading spinner
 */
export function LoadingSpinner({
  size = 'md',
  className,
  label = 'Loading...',
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
  }
  const spinnerSize = sizeMap[size]

  return (
    <div
      className={`loading-spinner loading-spinner-${size} ${className || ''}`}
      role="status"
      aria-label={label}
    >
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="loading-spinner-track"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.25"
        />
        <circle
          className="loading-spinner-progress"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.42"
          strokeDashoffset="10"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  )
}

export interface LoadingOverlayProps {
  /** Whether the loading overlay is visible */
  isLoading: boolean
  /** Loading message */
  message?: string
  /** Children to render underneath the overlay */
  children: React.ReactNode
  /** Blur the content behind the overlay */
  blur?: boolean
  /** Additional CSS class */
  className?: string
}

/**
 * Loading overlay that covers content
 */
export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  children,
  blur = true,
  className,
}: LoadingOverlayProps) {
  return (
    <div className={`loading-overlay-container ${className || ''}`}>
      <div
        className={`loading-overlay-content ${isLoading && blur ? 'loading-blurred' : ''}`}
      >
        {children}
      </div>
      {isLoading && (
        <div className="loading-overlay" role="alert" aria-busy="true">
          <div className="loading-overlay-inner">
            <LoadingSpinner size="lg" />
            {message && <p className="loading-overlay-message">{message}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export interface LoadingSkeletonProps {
  /** Width of the skeleton */
  width?: string | number
  /** Height of the skeleton */
  height?: string | number
  /** Border radius */
  radius?: 'sm' | 'md' | 'lg' | 'full'
  /** Additional CSS class */
  className?: string
  /** Number of skeleton lines */
  lines?: number
}

/**
 * Skeleton loading placeholder
 */
export function LoadingSkeleton({
  width = '100%',
  height = '1em',
  radius = 'md',
  className,
  lines = 1,
}: LoadingSkeletonProps) {
  const radiusMap = {
    sm: 'var(--dt-radius-sm)',
    md: 'var(--dt-radius-md)',
    lg: 'var(--dt-radius-lg)',
    full: 'var(--dt-radius-full)',
  }

  if (lines > 1) {
    return (
      <div className={`loading-skeleton-group ${className || ''}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="loading-skeleton"
            style={{
              width: i === lines - 1 ? '60%' : width,
              height,
              borderRadius: radiusMap[radius],
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`loading-skeleton ${className || ''}`}
      style={{
        width,
        height,
        borderRadius: radiusMap[radius],
      }}
      aria-hidden="true"
    />
  )
}

export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the button is in loading state */
  isLoading: boolean
  /** Loading text */
  loadingText?: string
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Button with loading state
 */
export function LoadingButton({
  isLoading,
  loadingText,
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  const sizeClass = size !== 'md' ? `dt-btn-${size}` : ''

  return (
    <button
      className={`dt-btn dt-btn-${variant} ${sizeClass} ${className || ''}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default LoadingSpinner
