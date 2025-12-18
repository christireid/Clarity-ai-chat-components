'use client'


import * as React from 'react'
import {
  ErrorBoundary as ReactErrorBoundary,
  useErrorBoundary,
  type FallbackProps,
} from 'react-error-boundary'
import { isClarityError, ClarityError } from '../errors/base-error'
import { usePrefersReducedMotion } from '../hooks/useAccessibility'

export interface EnhancedErrorBoundaryProps {
  children: React.ReactNode
  /** Custom fallback UI component */
  FallbackComponent?: React.ComponentType<FallbackProps>
  /** Simple fallback element (overridden by FallbackComponent) */
  fallback?: React.ReactNode
  /** Called when error is caught */
  onError?: (error: Error, info: React.ErrorInfo) => void
  /** Called when error boundary is reset */
  onReset?: (details: {
    reason: 'imperative-api' | 'keys'
    prev?: unknown[]
    next?: unknown[]
  }) => void
  /** Keys that trigger reset when changed */
  resetKeys?: unknown[]
  /** Enable error logging to external service */
  enableLogging?: boolean
  /** Custom class for the fallback container */
  className?: string
  /** Visual variant */
  variant?: 'default' | 'minimal' | 'fullscreen'
  /** Color scheme */
  colorScheme?: 'auto' | 'light' | 'dark'
}

// Animation keyframes
const keyframes = `
  @keyframes enhancedErrorFadeIn {
    from { opacity: 0; transform: translateY(-12px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes enhancedErrorIconPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }
  @keyframes enhancedErrorGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.2); }
    50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.35); }
  }
  @keyframes enhancedErrorShimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes enhancedErrorFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes enhancedErrorSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

/**
 * Beautiful default fallback component with premium error UI
 */
function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isRetrying, setIsRetrying] = React.useState(false)
  const [showDetails, setShowDetails] = React.useState(false)

  const isClarity = isClarityError(error)
  const isRecoverable = isClarity && error.recoverable

  // Extract error details
  const errorCode = isClarity ? (error as ClarityError).code : undefined
  const errorSolution = isClarity ? (error as ClarityError).solution : undefined
  const errorDocs = isClarity ? (error as ClarityError).docs : undefined
  const userMessage = isClarity
    ? (error as ClarityError).userMessage
    : 'An unexpected error occurred. Please try again.'

  // Auto-focus for accessibility
  React.useEffect(() => {
    containerRef.current?.focus()
  }, [])

  const handleRetry = async () => {
    setIsRetrying(true)
    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 300))
    resetErrorBoundary()
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2.5rem',
    minHeight: '280px',
    textAlign: 'center',
    animation: !prefersReducedMotion
      ? 'enhancedErrorFadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
      : 'none',
    outline: 'none',
  }

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    maxWidth: '28rem',
    width: '100%',
    padding: '2rem',
    borderRadius: '20px',
    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    boxShadow: isHovered
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(239, 68, 68, 0.1)'
      : '0 20px 40px -12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    overflow: 'hidden',
  }

  const iconContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '72px',
    height: '72px',
    margin: '0 auto 1.5rem',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.35)',
    animation: !prefersReducedMotion
      ? 'enhancedErrorFloat 4s ease-in-out infinite'
      : 'none',
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
        style={containerStyle}
      >
        <div
          style={cardStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Top accent bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background:
                'linear-gradient(90deg, #ef4444 0%, #f87171 50%, #ef4444 100%)',
              backgroundSize: '200% 100%',
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
                overflow: 'hidden',
                borderRadius: '20px',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '50%',
                  height: '100%',
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'enhancedErrorShimmer 3s ease-in-out infinite',
                }}
              />
            </div>
          )}

          {/* Error Icon */}
          <div style={iconContainerStyle}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {/* Glow effect */}
            {!prefersReducedMotion && (
              <div
                style={{
                  position: 'absolute',
                  inset: '-4px',
                  borderRadius: '24px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  animation: 'enhancedErrorGlow 2s ease-in-out infinite',
                  zIndex: -1,
                }}
                aria-hidden="true"
              />
            )}
          </div>

          {/* Title */}
          <h2
            style={{
              margin: 0,
              fontSize: '1.375rem',
              fontWeight: 700,
              color: 'var(--error-color-text, #1f2937)',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
            }}
          >
            Something went wrong
          </h2>

          {/* Error code badge */}
          {errorCode && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                marginTop: '0.75rem',
                padding: '0.25rem 0.625rem',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#ef4444',
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#dc2626',
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {errorCode}
              </span>
            </div>
          )}

          {/* Message */}
          <p
            style={{
              margin: '1rem 0 0',
              fontSize: '0.9375rem',
              color: 'var(--error-color-muted, #6b7280)',
              lineHeight: 1.65,
            }}
          >
            {userMessage}
          </p>

          {/* Solution */}
          {errorSolution && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  fontSize: '1.125rem',
                  lineHeight: 1,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                💡
              </span>
              <span
                style={{
                  fontSize: '0.8125rem',
                  color: '#059669',
                  lineHeight: 1.55,
                  fontWeight: 500,
                }}
              >
                {errorSolution}
              </span>
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.75rem',
              marginTop: '1.5rem',
            }}
          >
            {isRecoverable && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'white',
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: isRetrying ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
                  transition: 'all 0.2s ease',
                  opacity: isRetrying ? 0.7 : 1,
                }}
                onMouseOver={(e) => {
                  if (!isRetrying) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow =
                      '0 6px 20px rgba(59, 130, 246, 0.45)'
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow =
                    '0 4px 14px rgba(59, 130, 246, 0.35)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #3b82f6'
                  e.currentTarget.style.outlineOffset = '2px'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none'
                }}
              >
                {isRetrying ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        animation: !prefersReducedMotion
                          ? 'enhancedErrorSpin 1s linear infinite'
                          : 'none',
                      }}
                      aria-hidden="true"
                    >
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Retrying...
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M23 4v6h-6" />
                      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                    </svg>
                    Try again
                  </>
                )}
              </button>
            )}

            {errorDocs && (
              <a
                href={errorDocs}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#4b5563',
                  background: 'rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.06)'
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)'
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #4b5563'
                  e.currentTarget.style.outlineOffset = '2px'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none'
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                </svg>
                View docs
              </a>
            )}
          </div>

          {/* Development details */}
          {process.env['NODE_ENV'] === 'development' && (
            <details
              style={{
                marginTop: '1.5rem',
                textAlign: 'left',
              }}
              open={showDetails}
              onToggle={(e) =>
                setShowDetails((e.target as HTMLDetailsElement).open)
              }
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  color: 'var(--error-color-muted, #9ca3af)',
                  fontWeight: 500,
                  userSelect: 'none',
                  padding: '0.375rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    transform: showDetails ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                Developer details
              </summary>
              <pre
                style={{
                  marginTop: '0.75rem',
                  padding: '1rem',
                  fontSize: '0.7rem',
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                  background: '#1f2937',
                  color: '#e5e7eb',
                  borderRadius: '10px',
                  overflow: 'auto',
                  maxHeight: '240px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                }}
              >
                {isClarity
                  ? JSON.stringify((error as ClarityError).toJSON(), null, 2)
                  : error.stack || error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </>
  )
}

/**
 * Enhanced Error Boundary with logging and recovery support
 *
 * Uses react-error-boundary v5 for improved error handling patterns.
 *
 * @example
 * ```tsx
 * <EnhancedErrorBoundary
 *   onError={(error) => logToService(error)}
 *   onReset={() => clearCache()}
 * >
 *   <ChatWindow />
 * </EnhancedErrorBoundary>
 * ```
 */
export function EnhancedErrorBoundary({
  children,
  FallbackComponent = DefaultFallback,
  fallback,
  onError,
  onReset,
  resetKeys,
  enableLogging = true,
  className,
}: EnhancedErrorBoundaryProps) {
  const handleError = React.useCallback(
    (error: Error, info: React.ErrorInfo) => {
      // Log to external service
      if (enableLogging) {
        logger.error('[EnhancedErrorBoundary] Caught error:', {
          error: isClarityError(error) ? error.toJSON() : error,
          componentStack: info.componentStack,
        })

        // TODO: Replace with actual error logging service
        // logErrorToService(error, info);
      }

      onError?.(error, info)
    },
    [enableLogging, onError]
  )

  const handleReset = React.useCallback(
    (details: {
      reason: 'imperative-api' | 'keys'
      prev?: unknown[]
      next?: unknown[]
    }) => {
      if (enableLogging) {
        logger.info('[EnhancedErrorBoundary] Reset:', details.reason)
      }
      onReset?.(details)
    },
    [enableLogging, onReset]
  )

  // Simple fallback wrapper if provided
  const FallbackWrapper = fallback ? () => <>{fallback}</> : FallbackComponent

  return (
    <div className={className}>
      <ReactErrorBoundary
        FallbackComponent={FallbackWrapper}
        onError={handleError}
        onReset={handleReset}
        resetKeys={resetKeys}
      >
        {children}
      </ReactErrorBoundary>
    </div>
  )
}

// Re-export useErrorBoundary for async error handling
export { useErrorBoundary }
export type { FallbackProps }
