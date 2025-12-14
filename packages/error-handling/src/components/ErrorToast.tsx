'use client'

import * as React from 'react'
import { usePrefersReducedMotion } from '../hooks/useAccessibility'
import { isClarityError, ClarityError } from '../errors/base-error'

// =============================================================================
// Types
// =============================================================================

export type ToastType = 'error' | 'warning' | 'success' | 'info'
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
  progress?: boolean
  error?: Error
}

export interface ToastProviderProps {
  children: React.ReactNode
  /** Position of toast container */
  position?: ToastPosition
  /** Maximum number of toasts to display */
  maxToasts?: number
  /** Default duration in ms (0 = no auto-dismiss) */
  defaultDuration?: number
  /** Gap between toasts */
  gap?: number
  /** Container offset from edge */
  offset?: number
}

export interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAll: () => void
  showError: (error: Error | string, options?: Partial<Toast>) => string
  showWarning: (message: string, options?: Partial<Toast>) => string
  showSuccess: (message: string, options?: Partial<Toast>) => string
  showInfo: (message: string, options?: Partial<Toast>) => string
}

// =============================================================================
// Animations
// =============================================================================

const toastKeyframes = `
  @keyframes toastSlideIn {
    from {
      opacity: 0;
      transform: translateX(100%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
  @keyframes toastSlideInLeft {
    from {
      opacity: 0;
      transform: translateX(-100%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
  @keyframes toastSlideInCenter {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  @keyframes toastSlideOut {
    from {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateX(100%) scale(0.95);
    }
  }
  @keyframes toastProgress {
    from { width: 100%; }
    to { width: 0%; }
  }
  @keyframes toastShake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
    20%, 40%, 60%, 80% { transform: translateX(4px); }
  }
  @keyframes toastPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @keyframes toastIconPop {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes toastSuccessCheck {
    0% { stroke-dashoffset: 24; }
    100% { stroke-dashoffset: 0; }
  }
`

// =============================================================================
// Toast Type Configurations
// =============================================================================

const toastConfigs = {
  error: {
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    bgGradient:
      'linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(220, 38, 38, 0.02) 100%)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    iconBg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    progressColor: '#ef4444',
    titleColor: '#dc2626',
    shadowColor: 'rgba(239, 68, 68, 0.2)',
  },
  warning: {
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    bgGradient:
      'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(217, 119, 6, 0.02) 100%)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    progressColor: '#f59e0b',
    titleColor: '#d97706',
    shadowColor: 'rgba(245, 158, 11, 0.2)',
  },
  success: {
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    bgGradient:
      'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(5, 150, 105, 0.02) 100%)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    progressColor: '#10b981',
    titleColor: '#059669',
    shadowColor: 'rgba(16, 185, 129, 0.2)',
  },
  info: {
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    bgGradient:
      'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(37, 99, 235, 0.02) 100%)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
    iconBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    progressColor: '#3b82f6',
    titleColor: '#2563eb',
    shadowColor: 'rgba(59, 130, 246, 0.2)',
  },
}

// =============================================================================
// Icons
// =============================================================================

function ErrorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function SuccessIcon({ animate }: { animate: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path
        d="M9 12l2 2 4-4"
        style={{
          strokeDasharray: 24,
          strokeDashoffset: animate ? 0 : 24,
          animation: animate
            ? 'toastSuccessCheck 0.4s ease-out 0.2s forwards'
            : 'none',
        }}
      />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function getIcon(type: ToastType, animate: boolean) {
  switch (type) {
    case 'error':
      return <ErrorIcon />
    case 'warning':
      return <WarningIcon />
    case 'success':
      return <SuccessIcon animate={animate} />
    case 'info':
      return <InfoIcon />
  }
}

// =============================================================================
// Toast Context
// =============================================================================

const ToastContext = React.createContext<ToastContextValue | null>(null)

// =============================================================================
// Individual Toast Component
// =============================================================================

interface ToastItemProps {
  toast: Toast
  onRemove: () => void
  position: ToastPosition
  index: number
}

function ToastItem({ toast, onRemove, position, index }: ToastItemProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isExiting, setIsExiting] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [progress, setProgress] = React.useState(100)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = React.useRef<number>(Date.now())
  const remainingTimeRef = React.useRef<number>(toast.duration ?? 5000)
  const isMountedRef = React.useRef(true)

  // Track mount state to prevent memory leaks
  React.useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const config = toastConfigs[toast.type]
  const showProgress = toast.progress !== false && (toast.duration ?? 5000) > 0

  // Determine animation direction
  const getAnimation = () => {
    if (prefersReducedMotion) return 'none'
    if (isExiting) return 'toastSlideOut 0.3s ease-out forwards'
    if (position.includes('left'))
      return 'toastSlideInLeft 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
    if (position.includes('center'))
      return 'toastSlideInCenter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
    return 'toastSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
  }

  // Define handleDismiss before useEffects that use it
  const handleDismiss = React.useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsExiting(true)
    setTimeout(() => {
      if (isMountedRef.current) {
        onRemove()
      }
    }, 300)
  }, [onRemove])

  // Handle auto-dismiss timer with proper cleanup
  React.useEffect(() => {
    const duration = toast.duration ?? 5000
    if (duration <= 0) return

    startTimeRef.current = Date.now()
    remainingTimeRef.current = duration

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const remaining = remainingTimeRef.current - elapsed
      const newProgress = Math.max(0, (remaining / duration) * 100)
      setProgress(newProgress)

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current)
        handleDismiss()
      }
    }, 50)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [toast.duration, handleDismiss])

  // Pause timer on hover
  React.useEffect(() => {
    const duration = toast.duration ?? 5000
    if (duration <= 0) return

    if (isHovered) {
      // Pause: save remaining time and clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
        remainingTimeRef.current = Math.max(
          0,
          remainingTimeRef.current - (Date.now() - startTimeRef.current)
        )
      }
    } else if (remainingTimeRef.current > 0) {
      // Resume: restart timer with remaining time
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        const remaining = remainingTimeRef.current - elapsed
        const newProgress = Math.max(0, (remaining / duration) * 100)
        setProgress(newProgress)

        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleDismiss()
        }
      }, 50)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isHovered, toast.duration, handleDismiss])

  // Extract error details if present
  let errorCode: string | undefined
  let errorSolution: string | undefined
  if (toast.error && isClarityError(toast.error)) {
    errorCode = (toast.error as ClarityError).code
    errorSolution = (toast.error as ClarityError).solution
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'relative',
        width: '360px',
        maxWidth: 'calc(100vw - 32px)',
        padding: '14px 16px',
        borderRadius: '14px',
        background: config.bgGradient,
        backdropFilter: 'blur(16px)',
        border: `1px solid ${config.borderColor}`,
        boxShadow: isHovered
          ? `0 16px 40px -8px ${config.shadowColor}, 0 0 0 1px ${config.borderColor}`
          : `0 8px 24px -6px rgba(0, 0, 0, 0.1)`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        animation: getAnimation(),
        animationDelay: `${index * 50}ms`,
        overflow: 'hidden',
      }}
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
          height: '3px',
          background: config.gradient,
        }}
        aria-hidden="true"
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Icon */}
        <div
          style={{
            flexShrink: 0,
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: config.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${config.shadowColor}`,
            animation: !prefersReducedMotion
              ? 'toastIconPop 0.4s ease-out'
              : 'none',
          }}
        >
          {getIcon(toast.type, !prefersReducedMotion)}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          {toast.title && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--error-color-text, #1f2937)',
                  lineHeight: 1.3,
                }}
              >
                {toast.title}
              </h4>
              {errorCode && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: `${config.borderColor}`,
                    color: config.titleColor,
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  {errorCode}
                </span>
              )}
            </div>
          )}

          {/* Message */}
          <p
            style={{
              margin: 0,
              fontSize: '0.8125rem',
              color: 'var(--error-color-muted, #6b7280)',
              lineHeight: 1.5,
              wordBreak: 'break-word',
            }}
          >
            {toast.message}
          </p>

          {/* Solution */}
          {errorSolution && (
            <p
              style={{
                margin: '8px 0 0',
                fontSize: '0.75rem',
                color: '#059669',
                lineHeight: 1.4,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '4px',
              }}
            >
              <span aria-hidden="true">💡</span>
              {errorSolution}
            </p>
          )}

          {/* Action button */}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              style={{
                marginTop: '10px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'white',
                background: config.gradient,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = `0 4px 12px ${config.shadowColor}`
              }}
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
                e.currentTarget.style.outline = '2px solid white'
                e.currentTarget.style.outlineOffset = '2px'
              }}
              onBlur={(e: React.FocusEvent<HTMLButtonElement>) => {
                e.currentTarget.style.outline = 'none'
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Dismiss button */}
        {toast.dismissible !== false && (
          <button
            onClick={handleDismiss}
            aria-label="Dismiss notification"
            style={{
              flexShrink: 0,
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.04)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'var(--error-color-muted, #9ca3af)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.08)'
              e.currentTarget.style.color = 'var(--error-color-muted, #6b7280)'
            }}
            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)'
              e.currentTarget.style.color = 'var(--error-color-muted, #9ca3af)'
            }}
            onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
              e.currentTarget.style.outline =
                '2px solid var(--error-color-info, #3b82f6)'
              e.currentTarget.style.outlineOffset = '2px'
            }}
            onBlur={(e: React.FocusEvent<HTMLButtonElement>) => {
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
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: config.progressColor,
              transition: isHovered ? 'none' : 'width 0.05s linear',
            }}
          />
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Toast Provider Component
// =============================================================================

/**
 * Toast notification provider with beautiful, accessible toast notifications.
 *
 * @example
 * ```tsx
 * <ToastProvider position="top-right">
 *   <App />
 * </ToastProvider>
 *
 * // Inside a component:
 * const { showError, showSuccess } = useToast()
 * showError(error)
 * showSuccess('Operation completed!')
 * ```
 */
export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
  defaultDuration = 5000,
  gap = 12,
  offset = 16,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback(
    (toast: Omit<Toast, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration ?? defaultDuration,
        dismissible: toast.dismissible ?? true,
        progress: toast.progress ?? true,
      }

      setToasts((prev) => {
        const updated = [newToast, ...prev]
        return updated.slice(0, maxToasts)
      })

      return id
    },
    [defaultDuration, maxToasts]
  )

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearAll = React.useCallback(() => {
    setToasts([])
  }, [])

  const showError = React.useCallback(
    (error: Error | string, options?: Partial<Toast>): string => {
      const err = typeof error === 'string' ? new Error(error) : error
      const isClarity = isClarityError(err)

      return addToast({
        type: 'error',
        title: options?.title ?? (isClarity ? err.name : 'Error'),
        message:
          options?.message ??
          (isClarity ? (err as ClarityError).userMessage : err.message),
        error: err,
        ...options,
      })
    },
    [addToast]
  )

  const showWarning = React.useCallback(
    (message: string, options?: Partial<Toast>): string => {
      return addToast({
        type: 'warning',
        title: options?.title ?? 'Warning',
        message,
        ...options,
      })
    },
    [addToast]
  )

  const showSuccess = React.useCallback(
    (message: string, options?: Partial<Toast>): string => {
      return addToast({
        type: 'success',
        title: options?.title ?? 'Success',
        message,
        ...options,
      })
    },
    [addToast]
  )

  const showInfo = React.useCallback(
    (message: string, options?: Partial<Toast>): string => {
      return addToast({
        type: 'info',
        title: options?.title,
        message,
        ...options,
      })
    },
    [addToast]
  )

  const value = React.useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      clearAll,
      showError,
      showWarning,
      showSuccess,
      showInfo,
    }),
    [
      toasts,
      addToast,
      removeToast,
      clearAll,
      showError,
      showWarning,
      showSuccess,
      showInfo,
    ]
  )

  // Calculate container position styles
  const getPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: `${gap}px`,
      pointerEvents: 'none',
    }

    switch (position) {
      case 'top-right':
        return { ...base, top: offset, right: offset }
      case 'top-left':
        return { ...base, top: offset, left: offset }
      case 'bottom-right':
        return {
          ...base,
          bottom: offset,
          right: offset,
          flexDirection: 'column-reverse',
        }
      case 'bottom-left':
        return {
          ...base,
          bottom: offset,
          left: offset,
          flexDirection: 'column-reverse',
        }
      case 'top-center':
        return {
          ...base,
          top: offset,
          left: '50%',
          transform: 'translateX(-50%)',
        }
      case 'bottom-center':
        return {
          ...base,
          bottom: offset,
          left: '50%',
          transform: 'translateX(-50%)',
          flexDirection: 'column-reverse',
        }
      default:
        return base
    }
  }

  return (
    <ToastContext.Provider value={value}>
      <style>{toastKeyframes}</style>
      {children}
      {/* Toast container */}
      <div
        style={getPositionStyles()}
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast, index) => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem
              toast={toast}
              onRemove={() => removeToast(toast.id)}
              position={position}
              index={index}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Hook to access toast notifications
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { showError, showSuccess } = useToast()
 *
 *   const handleSubmit = async () => {
 *     try {
 *       await submitForm()
 *       showSuccess('Form submitted successfully!')
 *     } catch (error) {
 *       showError(error)
 *     }
 *   }
 * }
 * ```
 */
export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

/**
 * Optional hook that returns null if not within provider
 */
export function useToastOptional(): ToastContextValue | null {
  return React.useContext(ToastContext)
}

export default ToastProvider
