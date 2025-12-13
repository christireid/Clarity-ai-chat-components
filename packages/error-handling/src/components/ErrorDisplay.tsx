'use client'

import * as React from 'react'
import { isClarityError, ClarityError } from '../errors/base-error'
import { isProviderError } from '../errors/type-guards'
import { usePrefersReducedMotion, useAnnounce } from '../hooks/useAccessibility'

// =============================================================================
// Types
// =============================================================================

export type ErrorSeverity = 'error' | 'warning' | 'info'
export type ErrorSize = 'sm' | 'md' | 'lg'
export type ErrorVariant = 'default' | 'minimal' | 'card' | 'banner' | 'inline'

export interface ErrorDisplayProps {
  /** The error to display */
  error: Error | null
  /** Error severity level */
  severity?: ErrorSeverity
  /** Visual size */
  size?: ErrorSize
  /** Display variant */
  variant?: ErrorVariant
  /** Custom title override */
  title?: string
  /** Custom message override */
  message?: string
  /** Show solution hint if available */
  showSolution?: boolean
  /** Show documentation link if available */
  showDocs?: boolean
  /** Show technical details (dev mode) */
  showDetails?: boolean
  /** Retry button handler */
  onRetry?: () => void
  /** Dismiss button handler */
  onDismiss?: () => void
  /** Custom action buttons */
  actions?: React.ReactNode
  /** Additional CSS class */
  className?: string
  /** Icon override */
  icon?: React.ReactNode
  /** Animation style */
  animationStyle?: 'fade' | 'slide' | 'bounce' | 'none'
  /** Auto-focus on mount for accessibility */
  autoFocus?: boolean
}

// =============================================================================
// Styling Constants
// =============================================================================

const severityConfig = {
  error: {
    bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(185, 28, 28, 0.04) 100%)',
    border: 'rgba(239, 68, 68, 0.3)',
    iconBg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    iconShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
    titleColor: '#dc2626',
    accentGlow: 'rgba(239, 68, 68, 0.2)',
  },
  warning: {
    bg: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(217, 119, 6, 0.04) 100%)',
    border: 'rgba(251, 191, 36, 0.3)',
    iconBg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    iconShadow: '0 4px 14px rgba(251, 191, 36, 0.4)',
    titleColor: '#d97706',
    accentGlow: 'rgba(251, 191, 36, 0.2)',
  },
  info: {
    bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(29, 78, 216, 0.04) 100%)',
    border: 'rgba(59, 130, 246, 0.3)',
    iconBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    iconShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
    titleColor: '#2563eb',
    accentGlow: 'rgba(59, 130, 246, 0.2)',
  },
}

const sizeConfig = {
  sm: {
    padding: '0.75rem 1rem',
    iconSize: 32,
    titleSize: '0.875rem',
    messageSize: '0.75rem',
    buttonPadding: '0.375rem 0.75rem',
    buttonSize: '0.75rem',
    maxWidth: '20rem',
    gap: '0.5rem',
  },
  md: {
    padding: '1.25rem 1.5rem',
    iconSize: 44,
    titleSize: '1rem',
    messageSize: '0.875rem',
    buttonPadding: '0.5rem 1rem',
    buttonSize: '0.875rem',
    maxWidth: '28rem',
    gap: '0.75rem',
  },
  lg: {
    padding: '1.75rem 2rem',
    iconSize: 56,
    titleSize: '1.25rem',
    messageSize: '1rem',
    buttonPadding: '0.625rem 1.25rem',
    buttonSize: '1rem',
    maxWidth: '36rem',
    gap: '1rem',
  },
}

// =============================================================================
// Icons
// =============================================================================

function ErrorIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
      <path
        d="M12 7v5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1" fill={color} />
    </svg>
  )
}

function WarningIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2L2 20h20L12 2z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M12 9v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill={color} />
    </svg>
  )
}

function InfoIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
      <path d="M12 11v5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill={color} />
    </svg>
  )
}

function getIcon(severity: ErrorSeverity, size: number, color: string) {
  switch (severity) {
    case 'error':
      return <ErrorIcon size={size} color={color} />
    case 'warning':
      return <WarningIcon size={size} color={color} />
    case 'info':
      return <InfoIcon size={size} color={color} />
  }
}

// =============================================================================
// Animation Keyframes (inline for portability)
// =============================================================================

const keyframes = `
  @keyframes errorDisplayFadeIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes errorDisplaySlideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes errorDisplayBounceIn {
    0% { opacity: 0; transform: scale(0.3); }
    50% { opacity: 1; transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); }
  }
  @keyframes errorDisplayPulse {
    0%, 100% { box-shadow: 0 0 0 0 var(--glow-color); }
    50% { box-shadow: 0 0 20px 4px var(--glow-color); }
  }
  @keyframes errorIconFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  @keyframes errorShimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`

// =============================================================================
// Component
// =============================================================================

/**
 * A beautifully designed error display component with rich visual feedback,
 * smooth animations, and excellent accessibility.
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   error={error}
 *   severity="error"
 *   onRetry={() => refetch()}
 *   showSolution
 *   animationStyle="bounce"
 * />
 * ```
 */
export function ErrorDisplay({
  error,
  severity = 'error',
  size = 'md',
  variant = 'default',
  title,
  message,
  showSolution = true,
  showDocs = true,
  showDetails = process.env['NODE_ENV'] === 'development',
  onRetry,
  onDismiss,
  actions,
  className,
  icon,
  animationStyle = 'fade',
  autoFocus = true,
}: ErrorDisplayProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { announce } = useAnnounce()
  const [isHovered, setIsHovered] = React.useState(false)
  const [showFullDetails, setShowFullDetails] = React.useState(false)

  const isClarity = error && isClarityError(error)
  const isProvider = error && isProviderError(error)

  // Derive display values
  const displayTitle =
    title ||
    (isProvider
      ? `${(error as unknown as { provider: string }).provider.charAt(0).toUpperCase() + (error as unknown as { provider: string }).provider.slice(1)} Error`
      : isClarity
        ? error.name.replace('Error', ' Error')
        : 'Something went wrong')

  const displayMessage =
    message ||
    (isClarity ? (error as ClarityError).userMessage : error?.message) ||
    'An unexpected error occurred. Please try again.'

  const solution = isClarity ? (error as ClarityError).solution : undefined
  const docs = isClarity ? (error as ClarityError).docs : undefined
  const canRecover = isClarity ? (error as ClarityError).recoverable : true

  const colors = severityConfig[severity]
  const sizes = sizeConfig[size]

  // Announce error to screen readers
  React.useEffect(() => {
    if (error && announce) {
      announce(`${severity}: ${displayTitle}. ${displayMessage}`, 'assertive')
    }
  }, [error, severity, displayTitle, displayMessage, announce])

  // Auto-focus container for accessibility
  React.useEffect(() => {
    if (autoFocus && containerRef.current && error) {
      containerRef.current.focus()
    }
  }, [autoFocus, error])

  if (!error) return null

  const animationName = prefersReducedMotion
    ? 'none'
    : animationStyle === 'fade'
      ? 'errorDisplayFadeIn'
      : animationStyle === 'slide'
        ? 'errorDisplaySlideIn'
        : animationStyle === 'bounce'
          ? 'errorDisplayBounceIn'
          : 'none'

  const containerStyle: React.CSSProperties = {
    '--glow-color': colors.accentGlow,
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: variant === 'banner' ? '0' : '16px',
    padding: sizes.padding,
    maxWidth: variant === 'banner' ? '100%' : sizes.maxWidth,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    animation:
      animationName !== 'none'
        ? `${animationName} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`
        : 'none',
    backdropFilter: 'blur(10px)',
    boxShadow: isHovered
      ? `0 8px 32px ${colors.accentGlow}, 0 0 0 1px ${colors.border}`
      : `0 4px 20px rgba(0, 0, 0, 0.08)`,
    transition: 'box-shadow 0.3s ease, transform 0.2s ease',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    outline: 'none',
  } as React.CSSProperties

  const renderIcon = () => {
    if (icon) return icon

    const iconContainerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: sizes.iconSize,
      height: sizes.iconSize,
      borderRadius: '12px',
      background: colors.iconBg,
      boxShadow: colors.iconShadow,
      flexShrink: 0,
      animation: !prefersReducedMotion
        ? 'errorIconFloat 3s ease-in-out infinite'
        : 'none',
    }

    return (
      <div style={iconContainerStyle}>
        {getIcon(severity, sizes.iconSize * 0.5, 'white')}
      </div>
    )
  }

  return (
    <>
      <style>{keyframes}</style>
      <div
        ref={containerRef}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        tabIndex={-1}
        className={className}
        style={containerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Decorative gradient accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: colors.iconBg,
            borderRadius: '16px 16px 0 0',
          }}
          aria-hidden="true"
        />

        {/* Shimmer effect */}
        {!prefersReducedMotion && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'errorShimmer 3s ease-in-out infinite',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
        )}

        <div
          style={{
            display: 'flex',
            alignItems: variant === 'inline' ? 'center' : 'flex-start',
            gap: sizes.gap,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {variant !== 'minimal' && renderIcon()}

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <h3
              style={{
                margin: 0,
                fontSize: sizes.titleSize,
                fontWeight: 600,
                color: colors.titleColor,
                lineHeight: 1.4,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {displayTitle}
              {isClarity && (error as ClarityError).code && (
                <span
                  style={{
                    fontSize: '0.65em',
                    fontWeight: 500,
                    padding: '0.125rem 0.375rem',
                    borderRadius: '4px',
                    background: `${colors.border}`,
                    color: colors.titleColor,
                    opacity: 0.8,
                  }}
                >
                  {(error as ClarityError).code}
                </span>
              )}
            </h3>

            {/* Message */}
            <p
              style={{
                margin: `${sizes.gap} 0 0`,
                fontSize: sizes.messageSize,
                color: '#4b5563',
                lineHeight: 1.6,
              }}
            >
              {displayMessage}
            </p>

            {/* Solution hint */}
            {showSolution && solution && (
              <div
                style={{
                  marginTop: sizes.gap,
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  background:
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1,
                  }}
                  aria-hidden="true"
                >
                  💡
                </span>
                <span
                  style={{
                    fontSize: sizes.messageSize,
                    color: '#059669',
                    lineHeight: 1.5,
                  }}
                >
                  {solution}
                </span>
              </div>
            )}

            {/* Documentation link */}
            {showDocs && docs && (
              <a
                href={docs}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  marginTop: sizes.gap,
                  fontSize: sizes.messageSize,
                  color: '#3b82f6',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#2563eb')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#3b82f6')}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View documentation
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}

            {/* Technical details (development) */}
            {showDetails && (
              <details
                style={{
                  marginTop: sizes.gap,
                }}
                open={showFullDetails}
                onToggle={(e) =>
                  setShowFullDetails((e.target as HTMLDetailsElement).open)
                }
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    color: 'var(--error-color-muted, #6b7280)',
                    userSelect: 'none',
                    outline: 'none',
                    padding: '0.25rem 0',
                    borderRadius: '4px',
                  }}
                >
                  {showFullDetails ? 'Hide' : 'Show'} technical details
                </summary>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    fontSize: '0.7rem',
                    fontFamily:
                      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
                    background: 'rgba(0, 0, 0, 0.04)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    overflow: 'auto',
                    maxHeight: '200px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: '#374151',
                  }}
                >
                  {isClarity
                    ? JSON.stringify((error as ClarityError).toJSON(), null, 2)
                    : error.stack || error.message}
                </pre>
              </details>
            )}

            {/* Action buttons */}
            {(onRetry || onDismiss || actions) && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginTop: sizes.gap,
                  paddingTop: sizes.gap,
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                {onRetry && canRecover && (
                  <button
                    onClick={onRetry}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: sizes.buttonPadding,
                      fontSize: sizes.buttonSize,
                      fontWeight: 500,
                      color: 'white',
                      background: colors.iconBg,
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: `0 2px 8px ${colors.accentGlow}`,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = `0 4px 12px ${colors.accentGlow}`
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = `0 2px 8px ${colors.accentGlow}`
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = `2px solid ${colors.titleColor}`
                      e.currentTarget.style.outlineOffset = '2px'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = 'none'
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M23 4v6h-6" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    Try again
                  </button>
                )}

                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: sizes.buttonPadding,
                      fontSize: sizes.buttonSize,
                      fontWeight: 500,
                      color: 'var(--error-color-muted, #6b7280)',
                      background: 'transparent',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)'
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.15)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid #6b7280'
                      e.currentTarget.style.outlineOffset = '2px'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = 'none'
                    }}
                  >
                    Dismiss
                  </button>
                )}

                {actions}
              </div>
            )}
          </div>

          {/* Dismiss button (absolute positioned) */}
          {onDismiss && variant !== 'minimal' && (
            <button
              onClick={onDismiss}
              aria-label="Dismiss error"
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                padding: 0,
                background: 'rgba(0, 0, 0, 0.04)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: 'var(--error-color-muted, #9ca3af)',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.08)'
                e.currentTarget.style.color = '#6b7280'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)'
                e.currentTarget.style.color = '#9ca3af'
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #9ca3af'
                e.currentTarget.style.outlineOffset = '2px'
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none'
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default ErrorDisplay
