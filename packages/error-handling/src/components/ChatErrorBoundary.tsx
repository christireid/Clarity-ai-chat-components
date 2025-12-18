'use client'

import * as React from 'react'
import {
  EnhancedErrorBoundary,
  type FallbackProps,
} from './EnhancedErrorBoundary'
import { isStreamingError, isProviderError } from '../errors/type-guards'
import { isClarityError, ClarityError } from '../errors/base-error'
import { usePrefersReducedMotion } from '../hooks/useAccessibility'
import type { StreamingError } from '../errors/streaming-error'
import type { ProviderError } from '../errors/provider-error'

interface ChatErrorFallbackProps extends FallbackProps {
  /** Partial content received before error */
  partialContent?: string
  /** Provider that caused the error */
  provider?: string
}

// Animation keyframes
const chatErrorKeyframes = `
  @keyframes chatErrorSlideIn {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  @keyframes chatErrorIconBounce {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(0.9); }
    50% { transform: scale(1.1); }
    75% { transform: scale(0.95); }
  }
  @keyframes chatErrorPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes chatErrorWave {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes chatErrorCountdown {
    from { stroke-dashoffset: 0; }
    to { stroke-dashoffset: 100; }
  }
  @keyframes chatErrorSparkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
  }
`

// Error type configurations
const errorConfigs = {
  streaming: {
    title: 'Connection Lost',
    icon: 'wifi',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    bgGradient:
      'linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(220, 38, 38, 0.02) 100%)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    accentColor: '#ef4444',
    shadowColor: 'rgba(239, 68, 68, 0.25)',
  },
  provider: {
    title: 'Service Issue',
    icon: 'server',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    bgGradient:
      'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(217, 119, 6, 0.02) 100%)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    accentColor: '#f59e0b',
    shadowColor: 'rgba(245, 158, 11, 0.25)',
  },
  rateLimit: {
    title: 'Rate Limited',
    icon: 'clock',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    bgGradient:
      'linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(124, 58, 237, 0.02) 100%)',
    borderColor: 'rgba(139, 92, 246, 0.2)',
    accentColor: '#8b5cf6',
    shadowColor: 'rgba(139, 92, 246, 0.25)',
  },
  default: {
    title: 'Oops!',
    icon: 'alert',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    bgGradient:
      'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(79, 70, 229, 0.02) 100%)',
    borderColor: 'rgba(99, 102, 241, 0.2)',
    accentColor: '#6366f1',
    shadowColor: 'rgba(99, 102, 241, 0.25)',
  },
}

// Icon components
function WifiOffIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" />
      <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0122.58 9" />
      <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
      <path d="M8.53 16.11a6 6 0 016.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  )
}

function ServerIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  )
}

function ClockIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function AlertIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function getIcon(type: string, size: number) {
  switch (type) {
    case 'wifi':
      return <WifiOffIcon size={size} />
    case 'server':
      return <ServerIcon size={size} />
    case 'clock':
      return <ClockIcon size={size} />
    default:
      return <AlertIcon size={size} />
  }
}

/**
 * Premium chat-specific fallback with context-aware messaging and beautiful UI
 */
function ChatErrorFallback({
  error,
  resetErrorBoundary,
}: ChatErrorFallbackProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isRetrying, setIsRetrying] = React.useState(false)
  const [countdown, setCountdown] = React.useState<number | null>(null)

  const isStreaming = isStreamingError(error)
  const isProvider = isProviderError(error)
  const isClarity = isClarityError(error)

  // Determine error type and config
  let errorType: 'streaming' | 'provider' | 'rateLimit' | 'default' = 'default'
  let title = 'Something went wrong'
  let message = 'We encountered an issue with your chat.'
  let showRetry = true
  let retryAfter: number | undefined
  let hasPartialContent = false
  let solution: string | undefined

  if (isStreaming) {
    errorType = 'streaming'
    title = 'Connection Lost'
    message = 'Lost connection to the chat server. Your conversation is safe.'
    showRetry = (error as StreamingError).recoverable
    hasPartialContent = (error as StreamingError).hasPartialContent
    solution = isClarity
      ? (error as unknown as ClarityError).solution
      : undefined
  } else if (isProvider) {
    const providerErr = error as ProviderError
    if (providerErr.retryAfter) {
      errorType = 'rateLimit'
      retryAfter = providerErr.retryAfter
      title = 'Please Wait'
      message = `We've hit a rate limit. Automatic retry in ${retryAfter} seconds.`
    } else {
      errorType = 'provider'
      title = `${providerErr.provider.charAt(0).toUpperCase() + providerErr.provider.slice(1)} Issue`
      message = providerErr.userMessage
    }
    showRetry = providerErr.recoverable
    solution = providerErr.solution
  } else if (isClarity) {
    message = (error as ClarityError).userMessage
    showRetry = (error as ClarityError).recoverable
    solution = (error as ClarityError).solution
  }

  const config = errorConfigs[errorType]

  // Countdown timer for rate limits
  React.useEffect(() => {
    if (!retryAfter || retryAfter <= 0) {
      return undefined
    }

    setCountdown(retryAfter)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return null
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [retryAfter])

  // Auto-retry when countdown reaches 0
  React.useEffect(() => {
    if (countdown === 0) {
      handleRetry()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]) // handleRetry is stable - only depends on resetErrorBoundary

  // Focus for accessibility
  React.useEffect(() => {
    containerRef.current?.focus()
  }, [])

  const handleRetry = async () => {
    setIsRetrying(true)
    await new Promise((r) => setTimeout(r, 400))
    resetErrorBoundary()
  }

  return (
    <>
      <style>{chatErrorKeyframes}</style>
      <div
        ref={containerRef}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        tabIndex={-1}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          animation: !prefersReducedMotion
            ? 'chatErrorSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
            : 'none',
          outline: 'none',
        }}
      >
        <div
          style={{
            position: 'relative',
            maxWidth: '22rem',
            width: '100%',
            padding: '1.75rem',
            borderRadius: '20px',
            background: config.bgGradient,
            border: `1px solid ${config.borderColor}`,
            backdropFilter: 'blur(16px)',
            boxShadow: isHovered
              ? `0 20px 40px -12px ${config.shadowColor}, 0 0 0 1px ${config.borderColor}`
              : `0 12px 28px -8px rgba(0, 0, 0, 0.08)`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
            overflow: 'hidden',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Top accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: config.gradient,
            }}
            aria-hidden="true"
          />

          {/* Animated wave effect */}
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
                  width: '60%',
                  height: '100%',
                  background: `linear-gradient(90deg, transparent, ${config.accentColor}08, transparent)`,
                  animation: 'chatErrorWave 4s ease-in-out infinite',
                }}
              />
            </div>
          )}

          {/* Icon with background */}
          <div
            style={{
              position: 'relative',
              width: '60px',
              height: '60px',
              margin: '0 auto 1.25rem',
              borderRadius: '16px',
              background: config.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 20px ${config.shadowColor}`,
              animation: !prefersReducedMotion
                ? 'chatErrorIconBounce 0.6s ease-out'
                : 'none',
            }}
          >
            {getIcon(config.icon, 26)}
          </div>

          {/* Title */}
          <h3
            style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--error-color-text, #1f2937)',
              textAlign: 'center',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>

          {/* Message */}
          <p
            style={{
              margin: '0.625rem 0 0',
              fontSize: '0.875rem',
              color: 'var(--error-color-muted, #6b7280)',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            {message}
          </p>

          {/* Countdown timer for rate limits */}
          {countdown !== null && countdown > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                marginTop: '1.25rem',
                padding: '0.875rem',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
              }}
            >
              <div
                style={{ position: 'relative', width: '36px', height: '36px' }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  style={{ transform: 'rotate(-90deg)' }}
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.2)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(countdown / (retryAfter || 1)) * 94.2} 94.2`}
                    style={{
                      transition: 'stroke-dasharray 1s linear',
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
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#8b5cf6',
                  }}
                >
                  {countdown}
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.8125rem',
                  color: '#7c3aed',
                  fontWeight: 500,
                }}
              >
                Auto-retrying soon...
              </span>
            </div>
          )}

          {/* Partial content preserved notice */}
          {hasPartialContent && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '10px',
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#059669',
                  fontWeight: 500,
                }}
              >
                Response preserved - you can continue
              </span>
            </div>
          )}

          {/* Solution hint */}
          {solution && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.06)',
                border: '1px solid rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <span
                style={{ fontSize: '0.875rem', lineHeight: 1 }}
                aria-hidden="true"
              >
                💡
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#2563eb',
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                {solution}
              </span>
            </div>
          )}

          {/* Action buttons */}
          {showRetry && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1.25rem',
              }}
            >
              <button
                onClick={handleRetry}
                disabled={isRetrying || (countdown !== null && countdown > 0)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'white',
                  background:
                    isRetrying || (countdown !== null && countdown > 0)
                      ? '#9ca3af'
                      : config.gradient,
                  border: 'none',
                  borderRadius: '10px',
                  cursor:
                    isRetrying || (countdown !== null && countdown > 0)
                      ? 'not-allowed'
                      : 'pointer',
                  boxShadow:
                    isRetrying || (countdown !== null && countdown > 0)
                      ? 'none'
                      : `0 4px 12px ${config.shadowColor}`,
                  transition: 'all 0.2s ease',
                  opacity: isRetrying ? 0.8 : 1,
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isRetrying && !(countdown !== null && countdown > 0)) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 6px 16px ${config.shadowColor}`
                  }
                }}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = `0 4px 12px ${config.shadowColor}`
                }}
                onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.outline = `2px solid ${config.accentColor}`
                  e.currentTarget.style.outlineOffset = '2px'
                }}
                onBlur={(e: React.FocusEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.outline = 'none'
                }}
              >
                {isRetrying ? (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        animation: !prefersReducedMotion
                          ? 'chatErrorPulse 1s ease-in-out infinite'
                          : 'none',
                      }}
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    Reconnecting...
                  </>
                ) : (
                  <>
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
                      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                    </svg>
                    {hasPartialContent ? 'Continue' : 'Try Again'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export interface ChatErrorBoundaryProps {
  children: React.ReactNode
  /** Chat session ID for error context */
  chatId?: string
  /** Provider name for error context */
  provider?: string
  /** Called when retrying */
  onRetry?: () => void
  /** Called when error occurs */
  onError?: (error: Error) => void
}

/**
 * Specialized error boundary for chat components
 *
 * Provides chat-specific error handling with support for streaming errors,
 * provider errors, and partial content preservation.
 *
 * @example
 * ```tsx
 * <ChatErrorBoundary
 *   chatId={chatId}
 *   provider="openai"
 *   onRetry={() => refetchMessages()}
 * >
 *   <ChatWindow />
 * </ChatErrorBoundary>
 * ```
 */
export function ChatErrorBoundary({
  children,
  chatId,
  provider,
  onRetry,
  onError,
}: ChatErrorBoundaryProps) {
  const handleError = React.useCallback(
    (error: Error, info: React.ErrorInfo) => {
      console.error('[ChatErrorBoundary]', {
        chatId,
        provider,
        error: isClarityError(error) ? error.toJSON() : error,
        componentStack: info.componentStack,
      })
      onError?.(error)
    },
    [chatId, provider, onError]
  )

  const handleReset = React.useCallback(() => {
    onRetry?.()
  }, [onRetry])

  return (
    <EnhancedErrorBoundary
      FallbackComponent={ChatErrorFallback}
      onError={handleError}
      onReset={handleReset}
      resetKeys={[chatId]}
      enableLogging={true}
    >
      {children}
    </EnhancedErrorBoundary>
  )
}
