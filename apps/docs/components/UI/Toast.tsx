'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { fadeIn, slideInRight, durations, springs } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { ToastType } from '@/lib/toast'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  persistent?: boolean
  icon?: React.ReactNode
}

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

/**
 * Toast Item Component
 *
 * Individual toast notification with:
 * - Type-based icon and color
 * - Auto-dismiss with progress bar
 * - Action button support
 * - Swipe-to-dismiss gesture
 * - Smooth animations
 */
function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const getTypeConfig = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          bgClass: 'bg-success/10 border-success/50',
          textClass: 'text-success',
          progressClass: 'bg-success',
        }
      case 'error':
        return {
          icon: <XCircle className="w-5 h-5" />,
          bgClass: 'bg-error/10 border-error/50',
          textClass: 'text-error',
          progressClass: 'bg-error',
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgClass: 'bg-warning/10 border-warning/50',
          textClass: 'text-warning',
          progressClass: 'bg-warning',
        }
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          bgClass: 'bg-brand-500/10 border-brand-500/50',
          textClass: 'text-brand-600 dark:text-brand-400',
          progressClass: 'bg-brand-500',
        }
    }
  }

  const config = getTypeConfig(toast.type)
  const duration = toast.duration ?? 3000

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) {
          onDismiss(toast.id)
        }
      }}
      transition={springs.smooth}
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
        'min-w-[320px] max-w-md',
        config.bgClass
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Icon */}
      <div className={cn('flex-shrink-0 mt-0.5', config.textClass)}>
        {toast.icon ?? config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary break-words">
          {toast.message}
        </p>

        {/* Action Button */}
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick()
              onDismiss(toast.id)
            }}
            className={cn(
              'mt-2 text-xs font-semibold underline underline-offset-2',
              'hover:no-underline transition-all',
              config.textClass
            )}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className={cn(
          'flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10',
          'transition-colors',
          config.textClass
        )}
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar (Auto-dismiss indicator) */}
      {!toast.persistent && (
        <motion.div
          className={cn(
            'absolute bottom-0 left-0 h-1 rounded-b-lg',
            config.progressClass
          )}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{
            duration: duration / 1000,
            ease: 'linear',
          }}
          onAnimationComplete={() => onDismiss(toast.id)}
        />
      )}
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
}

/**
 * Toast Container Component
 *
 * Manages multiple toast notifications with:
 * - Stacked layout
 * - Position configuration
 * - Entrance/exit animations
 * - Accessibility (live region)
 */
export function ToastContainer({
  toasts,
  onDismiss,
  position = 'top-right',
}: ToastContainerProps) {
  const getPositionClasses = () => {
    const base = 'fixed z-50 flex flex-col gap-2 p-4'

    switch (position) {
      case 'top-left':
        return `${base} top-0 left-0`
      case 'top-center':
        return `${base} top-0 left-1/2 -translate-x-1/2`
      case 'top-right':
        return `${base} top-0 right-0`
      case 'bottom-left':
        return `${base} bottom-0 left-0`
      case 'bottom-center':
        return `${base} bottom-0 left-1/2 -translate-x-1/2`
      case 'bottom-right':
        return `${base} bottom-0 right-0`
      default:
        return `${base} top-0 right-0`
    }
  }

  return (
    <div className={getPositionClasses()} aria-label="Notifications">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}
