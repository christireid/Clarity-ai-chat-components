'use client'

/**
 * Sonner Toast Integration
 *
 * Industry-standard toast notifications powered by Sonner.
 * Provides a drop-in replacement for the custom toast system with
 * better animations, accessibility, and maintenance.
 *
 * @see https://sonner.emilkowal.ski/
 * @license MIT
 */

import * as React from 'react'
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner'
import type { ToasterProps } from 'sonner'

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface ClarityToasterProps {
  /** Position of the toasts */
  position?: ToastPosition
  /** Whether to expand toasts by default */
  expand?: boolean
  /** Whether toasts are rich (more padding) */
  richColors?: boolean
  /** Close button visibility */
  closeButton?: boolean
  /** Theme (auto follows system) */
  theme?: 'light' | 'dark' | 'system'
  /** Custom class name */
  className?: string
  /** Duration in ms (default: 5000) */
  duration?: number
  /** Gap between toasts in px */
  gap?: number
  /** Offset from edge in px */
  offset?: number | string
  /** Whether toasts can be dragged to dismiss */
  swipeToDismiss?: boolean
  /** Additional Sonner props */
  toasterProps?: Omit<
    ToasterProps,
    'position' | 'expand' | 'richColors' | 'closeButton' | 'theme'
  >
}

/**
 * Clarity Toast Provider - Sonner-powered toast container
 *
 * Add this component once at the root of your app to enable toasts.
 *
 * @example
 * ```tsx
 * // In your root layout
 * import { ClarityToaster } from '@clarity-chat/react'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <ClarityToaster position="bottom-right" richColors />
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function ClarityToaster({
  position = 'bottom-right',
  expand = false,
  richColors = true,
  closeButton = true,
  theme = 'system',
  className,
  duration = 5000,
  gap = 8,
  offset = 16,
  swipeToDismiss = true,
  toasterProps,
}: ClarityToasterProps) {
  return (
    <SonnerToaster
      position={position}
      expand={expand}
      richColors={richColors}
      closeButton={closeButton}
      theme={theme}
      className={className}
      duration={duration}
      gap={gap}
      offset={offset}
      visibleToasts={5}
      toastOptions={{
        classNames: {
          toast: 'clarity-toast',
          title: 'clarity-toast-title',
          description: 'clarity-toast-description',
          actionButton: 'clarity-toast-action',
          cancelButton: 'clarity-toast-cancel',
          closeButton: 'clarity-toast-close',
        },
      }}
      {...(swipeToDismiss ? {} : { swipeDirections: [] })}
      {...toasterProps}
    />
  )
}

ClarityToaster.displayName = 'ClarityToaster'

/**
 * Toast API - Compatible with existing useToast interface
 *
 * @example
 * ```tsx
 * import { toast } from '@clarity-chat/react'
 *
 * // Simple usage
 * toast.success('File uploaded successfully')
 * toast.error('Failed to save changes')
 * toast.info('Processing your request...')
 * toast.warning('Your session will expire soon')
 *
 * // With title
 * toast.success('File uploaded', { title: 'Success' })
 *
 * // With action
 * toast.error('Failed to save', {
 *   action: {
 *     label: 'Retry',
 *     onClick: () => saveAgain()
 *   }
 * })
 *
 * // With custom duration
 * toast.info('Please wait...', { duration: 10000 })
 *
 * // Promise toast (shows loading, then success/error)
 * toast.promise(saveData(), {
 *   loading: 'Saving...',
 *   success: 'Data saved!',
 *   error: 'Failed to save'
 * })
 * ```
 */
export interface ToastOptions {
  /** Toast title */
  title?: string
  /** Duration in ms (0 = persistent) */
  duration?: number
  /** Action button */
  action?: {
    label: string
    onClick: () => void
  }
  /** Cancel button */
  cancel?: {
    label: string
    onClick?: () => void
  }
  /** Custom ID for deduplication */
  id?: string
  /** Called when toast is dismissed */
  onDismiss?: () => void
  /** Called when auto-dismiss timer completes */
  onAutoClose?: () => void
}

export interface PromiseToastOptions<T> {
  loading: string
  success: string | ((data: T) => string)
  error: string | ((error: unknown) => string)
  description?: string
  duration?: number
}

/**
 * Unified toast API that works with or without ClarityToaster
 */
export const toast = {
  /**
   * Success toast
   */
  success: (message: string, options?: ToastOptions): string | number => {
    return sonnerToast.success(options?.title || message, {
      description: options?.title ? message : undefined,
      duration: options?.duration,
      id: options?.id,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      cancel: options?.cancel
        ? {
            label: options.cancel.label,
            onClick: options.cancel.onClick ?? (() => {}),
          }
        : undefined,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose,
    })
  },

  /**
   * Error toast
   */
  error: (message: string, options?: ToastOptions): string | number => {
    return sonnerToast.error(options?.title || message, {
      description: options?.title ? message : undefined,
      duration: options?.duration,
      id: options?.id,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      cancel: options?.cancel
        ? {
            label: options.cancel.label,
            onClick: options.cancel.onClick ?? (() => {}),
          }
        : undefined,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose,
    })
  },

  /**
   * Info toast
   */
  info: (message: string, options?: ToastOptions): string | number => {
    return sonnerToast.info(options?.title || message, {
      description: options?.title ? message : undefined,
      duration: options?.duration,
      id: options?.id,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      cancel: options?.cancel
        ? {
            label: options.cancel.label,
            onClick: options.cancel.onClick ?? (() => {}),
          }
        : undefined,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose,
    })
  },

  /**
   * Warning toast
   */
  warning: (message: string, options?: ToastOptions): string | number => {
    return sonnerToast.warning(options?.title || message, {
      description: options?.title ? message : undefined,
      duration: options?.duration,
      id: options?.id,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      cancel: options?.cancel
        ? {
            label: options.cancel.label,
            onClick: options.cancel.onClick ?? (() => {}),
          }
        : undefined,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose,
    })
  },

  /**
   * Loading toast (persistent until dismissed)
   */
  loading: (
    message: string,
    options?: Omit<ToastOptions, 'duration'>
  ): string | number => {
    return sonnerToast.loading(message, {
      id: options?.id,
      description: options?.title,
      onDismiss: options?.onDismiss,
    })
  },

  /**
   * Promise toast - shows loading, then success/error
   */
  promise: <T,>(
    promise: Promise<T>,
    options: PromiseToastOptions<T>
  ): string | number => {
    const result = sonnerToast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: options.error,
      description: options.description,
      duration: options.duration,
    })
    // Return the toast ID for potential dismissal
    return typeof result === 'object' ? 0 : result
  },

  /**
   * Custom toast with JSX content
   */
  custom: (
    content: React.ReactElement,
    options?: Omit<ToastOptions, 'title'>
  ): string | number => {
    return sonnerToast.custom(() => content, {
      duration: options?.duration,
      id: options?.id,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose,
    })
  },

  /**
   * Dismiss a specific toast or all toasts
   */
  dismiss: (id?: string | number): void => {
    if (id) {
      sonnerToast.dismiss(id)
    } else {
      sonnerToast.dismiss()
    }
  },

  /**
   * Message toast (neutral, no icon)
   */
  message: (message: string, options?: ToastOptions): string | number => {
    return sonnerToast.message(options?.title || message, {
      description: options?.title ? message : undefined,
      duration: options?.duration,
      id: options?.id,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      onDismiss: options?.onDismiss,
      onAutoClose: options?.onAutoClose,
    })
  },
}

// Re-export Sonner's toast for advanced usage
export { sonnerToast as sonner }

export default ClarityToaster
