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

// Color classes - refined with better opacity
const TOAST_COLOR_CLASSES = {
  success: 'bg-green-50 dark:bg-green-950/40 border-green-200/60 dark:border-green-800/40 text-green-900 dark:text-green-100',
  error: 'bg-red-50 dark:bg-red-950/40 border-red-200/60 dark:border-red-800/40 text-red-900 dark:text-red-100',
  info: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/40 text-blue-900 dark:text-blue-100',
  warning: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/40 text-amber-900 dark:text-amber-100',
} as const

const TOAST_ICON_COLOR_CLASSES = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-amber-600 dark:text-amber-400',
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
  // Memoize icon selection
  const Icon = React.useMemo(
    () =>
      ({
        success: CheckCircleIcon,
        error: XCircleIcon,
        info: InfoIcon,
        warning: AlertCircleIcon,
      }[type]),
    [type]
  )

  // Memoize color classes using constants
  const colorClasses = React.useMemo(() => TOAST_COLOR_CLASSES[type], [type])
  const iconColorClasses = React.useMemo(() => TOAST_ICON_COLOR_CLASSES[type], [type])

  // Memoize close handler
  const handleClose = React.useCallback(() => onClose(id), [onClose, id])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.96, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{
        duration: 0.25,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        'relative flex gap-3 p-4 rounded-2xl border backdrop-blur-md',
        'min-w-[320px] max-w-[420px]',
        'shadow-[0_8px_24px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)]',
        colorClasses
      )}
    >
      {/* Icon with entrance animation */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 500, damping: 30 }}
        className={cn('flex-shrink-0 mt-0.5', iconColorClasses)}
      >
        <Icon size={20} />
      </motion.div>

      {/* Content */}
      <div className="flex-1 space-y-1.5">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-semibold text-sm leading-none"
          >
            {title}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-sm opacity-90"
        >
          {description}
        </motion.div>
        {action && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.2 }}
            onClick={() => { action.onClick(); handleClose(); }}
            className="text-sm font-medium underline hover:no-underline mt-2 transition-colors duration-150"
            aria-label={action.label}
          >
            {action.label}
          </motion.button>
        )}
      </div>

      {/* Close button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClose}
        className="flex-shrink-0 h-6 w-6 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-150 flex items-center justify-center"
        aria-label="Close notification"
      >
        <CloseIcon size={14} />
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
