'use client'

import { useState, useEffect, useCallback } from 'react'
import { ToastContainer } from './Toast'
import {
  registerToastHandler,
  unregisterToastHandler,
  type ToastOptions,
} from '@/lib/toast'
import type { Toast } from './Toast'

/**
 * Toast Manager Component
 *
 * Global toast notification manager.
 * Handles toast lifecycle, stacking, and auto-dismiss.
 *
 * Usage:
 * 1. Add <ToastManager /> to your root layout (once)
 * 2. Use toast.success(), toast.error(), etc. anywhere in your app
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * import { ToastManager } from '@/components/UI/ToastManager'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <ToastManager />
 *       </body>
 *     </html>
 *   )
 * }
 *
 * // In any component
 * import { toast } from '@/lib/toast'
 *
 * function MyComponent() {
 *   const handleSave = async () => {
 *     try {
 *       await saveData()
 *       toast.success('Saved successfully!')
 *     } catch (error) {
 *       toast.error('Failed to save')
 *     }
 *   }
 * }
 * ```
 */
export function ToastManager() {
  const [toasts, setToasts] = useState<Toast[]>([])

  /**
   * Add a new toast
   */
  const addToast = useCallback((message: string, options?: ToastOptions) => {
    const id = `toast-${Date.now()}-${Math.random()}`

    const newToast: Toast = {
      id,
      message,
      type: options?.type ?? 'info',
      duration: options?.duration ?? 3000,
      action: options?.action,
      persistent: options?.persistent ?? false,
      icon: options?.icon,
    }

    setToasts((prev) => {
      // Limit to 5 toasts max (prevent stack overflow)
      const updatedToasts = [...prev, newToast]
      if (updatedToasts.length > 5) {
        return updatedToasts.slice(1) // Remove oldest
      }
      return updatedToasts
    })
  }, [])

  /**
   * Remove a toast
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  /**
   * Register global toast handler
   */
  useEffect(() => {
    registerToastHandler(addToast)
    return () => {
      unregisterToastHandler()
    }
  }, [addToast])

  return (
    <ToastContainer
      toasts={toasts}
      onDismiss={removeToast}
      position="top-right"
    />
  )
}
