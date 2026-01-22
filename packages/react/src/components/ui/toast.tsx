'use client'
/**
 * Toast Notification System
 *
 * Provides toast notifications for success, error, info, and warning messages.
 * Supports auto-dismiss, queue management, and custom durations.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  AlertCircleIcon,
  CloseIcon,
} from './icons'
import { ANIMATION_DURATION } from '../../animations'
import { useReducedMotion } from '@clarity-chat/primitives'
import {
  getMotionSafeDuration,
  getMotionSafeValue,
} from '../../animations/motion-safe'

// ============================================================================
// TYPES
// ============================================================================

export type ToastType = 'success' | 'error' | 'info' | 'warning'
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface Toast {
  id: string
  type: ToastType
  title?: string
  description: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ToastProps extends Toast {
  onClose: (id: string) => void
}

/**
 * Individual toast component
 */
export function ToastItem({
  id,
  type,
  title,
  description,
  action,
  onClose,
}: ToastProps) {
  const prefersReducedMotion = useReducedMotion()

  // Memoize icon selection
  const Icon = React.useMemo(
    () =>
      ({
        success: CheckCircleIcon,
        error: XCircleIcon,
        info: InfoIcon,
        warning: AlertCircleIcon,
      })[type],
    [type]
  )

  // Memoize color classes
  const colorClasses = React.useMemo(
    () =>
      ({
        success: 'bg-success/10 border-success/30 text-success-foreground',
        error:
          'bg-destructive/10 border-destructive/30 text-destructive-foreground',
        info: 'bg-info/10 border-info/30 text-info-foreground',
        warning: 'bg-warning/10 border-warning/30 text-warning-foreground',
      })[type],
    [type]
  )

  // Memoize icon color classes
  const iconColorClasses = React.useMemo(
    () =>
      ({
        success: 'text-success',
        error: 'text-destructive',
        info: 'text-info',
        warning: 'text-warning',
      })[type],
    [type]
  )

  // Memoize close handler
  const handleClose = React.useCallback(() => onClose(id), [onClose, id])

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: getMotionSafeValue(prefersReducedMotion, -20, 0),
        scale: getMotionSafeValue(prefersReducedMotion, 0.95, 1),
      }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: getMotionSafeValue(prefersReducedMotion, 100, 0),
        scale: getMotionSafeValue(prefersReducedMotion, 0.95, 1),
      }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: getMotionSafeDuration(
          prefersReducedMotion,
          ANIMATION_DURATION.normal / 1000
        ),
      }}
      className={cn(
        'relative flex gap-3.5 px-4 py-3.5 rounded-xl border border-border/40 shadow-lg backdrop-blur-xl',
        'min-w-[340px] max-w-[440px]',
        colorClasses
      )}
    >
      <div className={cn('flex-shrink-0 mt-0.5', iconColorClasses)}>
        <Icon size={18} />
      </div>
      <div className="flex-1 space-y-1.5">
        {title && (
          <div className="font-bold text-sm leading-tight">{title}</div>
        )}
        <div className="text-sm leading-relaxed opacity-95">{description}</div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-bold underline underline-offset-2 hover:no-underline mt-1.5 transition-all"
            aria-label={action.label}
          >
            {action.label}
          </button>
        )}
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClose}
        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-background/40 transition-all duration-200"
        aria-label="Close notification"
      >
        <CloseIcon size={14} />
      </motion.button>
    </motion.div>
  )
}

ToastItem.displayName = 'ToastItem'

// Position classes
const POSITION_CLASSES: Record<ToastPosition, string> = {
  'top-left': 'top-6 left-6 items-start',
  'top-center': 'top-6 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-6 right-6 items-end',
  'bottom-left': 'bottom-6 left-6 items-start',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-6 right-6 items-end',
}

/**
 * Toast container component
 */
export interface ToastContainerProps {
  toasts: Toast[]
  position?: ToastPosition
  onClose: (id: string) => void
}

export function ToastContainer({
  toasts,
  position = 'top-right',
  onClose,
}: ToastContainerProps) {
  const positionClass = React.useMemo(
    () => POSITION_CLASSES[position],
    [position]
  )

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2.5 pointer-events-none',
        positionClass
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem {...toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

ToastContainer.displayName = 'ToastContainer'

/**
 * Toast context value type
 */
export interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  success: (description: string, title?: string, duration?: number) => string
  error: (description: string, title?: string, duration?: number) => string
  info: (description: string, title?: string, duration?: number) => string
  warning: (description: string, title?: string, duration?: number) => string
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
)

/**
 * Toast provider props
 */
export interface ToastProviderProps {
  children: React.ReactNode
  position?: ToastPosition
  defaultDuration?: number
  maxToasts?: number
}

export function ToastProvider({
  children,
  position = 'top-right',
  defaultDuration = 5000,
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const timeoutRefs = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  )

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
      timeoutRefs.current.clear()
    }
  }, [])

  // Remove toast
  const removeToast = React.useCallback((id: string) => {
    const timeout = timeoutRefs.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutRefs.current.delete(id)
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Add toast
  const addToast = React.useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: Toast = { ...toast, id }

      setToasts((prev) => {
        const updated = [...prev, newToast]
        if (updated.length > maxToasts) {
          return updated.slice(-maxToasts)
        }
        return updated
      })

      const duration = toast.duration ?? defaultDuration
      if (duration > 0) {
        const timeout = setTimeout(() => {
          removeToast(id)
        }, duration)
        timeoutRefs.current.set(id, timeout)
      }

      return id
    },
    [defaultDuration, maxToasts, removeToast]
  )

  // Convenience methods
  const success = React.useCallback(
    (description: string, title?: string, duration?: number) => {
      return addToast({ type: 'success', description, title, duration })
    },
    [addToast]
  )

  const error = React.useCallback(
    (description: string, title?: string, duration?: number) => {
      return addToast({ type: 'error', description, title, duration })
    },
    [addToast]
  )

  const info = React.useCallback(
    (description: string, title?: string, duration?: number) => {
      return addToast({ type: 'info', description, title, duration })
    },
    [addToast]
  )

  const warning = React.useCallback(
    (description: string, title?: string, duration?: number) => {
      return addToast({ type: 'warning', description, title, duration })
    },
    [addToast]
  )

  const value = React.useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      success,
      error,
      info,
      warning,
    }),
    [toasts, addToast, removeToast, success, error, info, warning]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        toasts={toasts}
        position={position}
        onClose={removeToast}
      />
    </ToastContext.Provider>
  )
}

/**
 * useToast hook
 */
export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext)
  if (!context) {
    // Graceful fallback for missing provider
    if (process.env.NODE_ENV !== 'production') {
      const globalObj = globalThis as {
        __clarityChatToastProviderWarned?: boolean
      }
      globalObj.__clarityChatToastProviderWarned ??= false
      if (!globalObj.__clarityChatToastProviderWarned) {
        globalObj.__clarityChatToastProviderWarned = true
        console.warn(
          '[Clarity Chat] ToastProvider missing; falling back to no-op toasts.'
        )
      }
    }
    return {
      toasts: [],
      addToast: () => '',
      removeToast: () => {},
      success: (description, title) => {
        toast.success(description, title)
        return ''
      },
      error: (description, title) => {
        toast.error(description, title)
        return ''
      },
      info: (description, title) => {
        toast.info(description, title)
        return ''
      },
      warning: (description, title) => {
        toast.warning(description, title)
        return ''
      },
    }
  }
  return context
}

/**
 * Standalone toast object for fallback when ToastProvider is missing.
 */
export const toast = {
  success: (description: string, title?: string) => {
    console.log('[Toast Success]', title ? `${title}:` : '', description)
  },
  error: (description: string, title?: string) => {
    console.error('[Toast Error]', title ? `${title}:` : '', description)
  },
  info: (description: string, title?: string) => {
    console.info('[Toast Info]', title ? `${title}:` : '', description)
  },
  warning: (description: string, title?: string) => {
    console.warn('[Toast Warning]', title ? `${title}:` : '', description)
  },
}
