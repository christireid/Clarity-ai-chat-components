/**
 * Toast Notification System
 *
 * Provides toast notifications for success, error, info, and warning messages.
 * Supports auto-dismiss, queue management, and custom durations.
 */

import { useState, useCallback, useRef, useEffect, memo, createContext, useContext, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  AlertCircleIcon,
  CloseIcon,
} from './icons'
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  // createSlideVariant, // Reserved for future use
} from '../animations'
import type { ReactNode } from 'react'

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

// Icon mapping - extracted as constant
const TOAST_ICONS = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InfoIcon,
  warning: AlertCircleIcon,
} as const

// Color classes - extracted as constants
const TOAST_COLOR_CLASSES = {
  success: 'bg-success/10 border-success/20 text-success-foreground',
  error: 'bg-destructive/10 border-destructive/20 text-destructive-foreground',
  info: 'bg-info/10 border-info/20 text-info-foreground',
  warning: 'bg-warning/10 border-warning/20 text-warning-foreground',
} as const

const TOAST_ICON_COLOR_CLASSES = {
  success: 'text-success',
  error: 'text-destructive',
  info: 'text-info',
  warning: 'text-warning',
} as const

/**
 * Individual toast component
 */
export const ToastItem = memo(function ToastItem({
  id,
  type,
  title,
  description,
  action,
  onClose,
}: ToastProps) {
  const Icon = TOAST_ICONS[type]
  const handleClose = useCallback(() => onClose(id), [id, onClose])
  const handleAction = useCallback(() => {
    action?.onClick()
  }, [action])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{
        duration: ANIMATION_DURATION.normal / 1000,
        ease: ANIMATION_EASING.spring,
      }}
      className={cn(
        'relative flex gap-3 p-4 rounded-xl border-2 shadow-xl backdrop-blur-md',
        'min-w-[320px] max-w-[420px]',
        TOAST_COLOR_CLASSES[type]
      )}
    >
      {/* Icon */}
      <div className={cn('flex-shrink-0 mt-0.5', TOAST_ICON_COLOR_CLASSES[type])}>
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        {title && (
          <div className="font-semibold text-sm leading-none">{title}</div>
        )}
        <div className="text-sm opacity-90">{description}</div>
        {action && (
          <button
            onClick={handleAction}
            className="text-sm font-medium underline hover:no-underline mt-2"
            aria-label={action.label}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded hover:bg-background/20 transition-colors"
        aria-label="Close notification"
      >
        <CloseIcon size={16} />
      </motion.button>
    </motion.div>
  )
})

ToastItem.displayName = 'ToastItem'

/**
 * Toast container component
 */
export interface ToastContainerProps {
  toasts: Toast[]
  position?: ToastPosition
  onClose: (id: string) => void
}

// Position classes - extracted as constant
const POSITION_CLASSES = {
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
} as const

export const ToastContainer = memo(function ToastContainer({
  toasts,
  position = 'top-right',
  onClose,
}: ToastContainerProps) {
  const positionClass = useMemo(() => POSITION_CLASSES[position], [position])

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
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
})

ToastContainer.displayName = 'ToastContainer'

/**
 * Toast Context
 */
interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  success: (description: string, title?: string, duration?: number) => string
  error: (description: string, title?: string, duration?: number) => string
  info: (description: string, title?: string, duration?: number) => string
  warning: (description: string, title?: string, duration?: number) => string
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

/**
 * Toast Provider
 */
export interface ToastProviderProps {
  children: ReactNode
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
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
      timeoutRefs.current.clear()
    }
  }, [])

  // Remove toast
  const removeToast = useCallback((id: string) => {
    // Clear timeout if exists
    const timeout = timeoutRefs.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutRefs.current.delete(id)
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Add toast
  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>): string => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: Toast = { ...toast, id }

      setToasts((prev) => {
        // Limit number of toasts
        const updated = [...prev, newToast]
        if (updated.length > maxToasts) {
          return updated.slice(-maxToasts)
        }
        return updated
      })

      // Auto-dismiss
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
  const success = useCallback(
    (description: string, title?: string, duration?: number) => {
      return addToast({ type: 'success', description, title, duration })
    },
    [addToast]
  )

  const error = useCallback(
    (description: string, title?: string, duration?: number) => {
      return addToast({ type: 'error', description, title, duration })
    },
    [addToast]
  )

  const info = useCallback(
    (description: string, title?: string, duration?: number) => {
      return addToast({ type: 'info', description, title, duration })
    },
    [addToast]
  )

  const warning = useCallback(
    (description: string, title?: string, duration?: number) => {
      return addToast({ type: 'warning', description, title, duration })
    },
    [addToast]
  )

  const value: ToastContextValue = useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }), [toasts, addToast, removeToast, success, error, info, warning])

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
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

/**
 * Standalone toast function (without provider)
 * Useful for one-off toasts without setting up provider
 */
// Reserved for future implementation
// let toastContainerRoot: HTMLDivElement | null = null

// function _getToastContainer(): HTMLDivElement {
//   if (!toastContainerRoot) {
//     toastContainerRoot = document.createElement('div')
//     toastContainerRoot.id = 'toast-root'
//     document.body.appendChild(toastContainerRoot)
//   }
//   return toastContainerRoot
// }

export const toast = {
  success: (description: string, title?: string) => {
    console.log('[Toast] Success:', title, description)
    // Implementation would render toast outside React tree
  },
  error: (description: string, title?: string) => {
    console.log('[Toast] Error:', title, description)
  },
  info: (description: string, title?: string) => {
    console.log('[Toast] Info:', title, description)
  },
  warning: (description: string, title?: string) => {
    console.log('[Toast] Warning:', title, description)
  },
}
