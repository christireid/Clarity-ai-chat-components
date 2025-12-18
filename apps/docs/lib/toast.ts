/**
 * Toast Notification System
 *
 * Centralized toast management using @clarity-chat/react ToastProvider.
 * Provides consistent, accessible notifications throughout the application.
 *
 * Features:
 * - Type-safe toast creation
 * - Consistent styling and animations
 * - Accessibility (ARIA live regions)
 * - Auto-dismiss with progress indicator
 * - Action buttons support
 * - Swipe-to-dismiss (mobile)
 *
 * @example
 * ```tsx
 * import { toast } from '@/lib/toast'
 *
 * // Success
 * toast.success('Settings saved!')
 *
 * // Error with action
 * toast.error('Failed to load', {
 *   action: {
 *     label: 'Retry',
 *     onClick: () => refetch()
 *   }
 * })
 * ```
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  /**
   * Toast type (affects icon and color)
   * @default 'info'
   */
  type?: ToastType

  /**
   * Duration in milliseconds before auto-dismiss
   * @default 3000
   */
  duration?: number

  /**
   * Optional action button
   */
  action?: ToastAction

  /**
   * Prevent auto-dismiss (user must manually close)
   * @default false
   */
  persistent?: boolean

  /**
   * Custom icon (overrides type-based icon)
   */
  icon?: React.ReactNode

  /**
   * Position on screen
   * @default 'top-right'
   */
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
}

/**
 * Toast state managed globally
 * Imported by components to show toasts
 */
let toastHandler: ((message: string, options?: ToastOptions) => void) | null =
  null

/**
 * Register the toast handler (called by ToastManager component)
 * @internal
 */
export function registerToastHandler(
  handler: (message: string, options?: ToastOptions) => void
) {
  toastHandler = handler
}

/**
 * Unregister the toast handler
 * @internal
 */
export function unregisterToastHandler() {
  toastHandler = null
}

/**
 * Core toast function
 */
function showToast(message: string, options?: ToastOptions) {
  if (!toastHandler) {
    logger.warn(
      'Toast handler not registered. Did you add <ToastManager /> to your app?'
    )
    return
  }
  toastHandler(message, options)
}

/**
 * Toast API
 * Provides type-specific convenience methods
 */
export const toast = {
  /**
   * Show a success toast
   */
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => {
    showToast(message, { ...options, type: 'success' })
  },

  /**
   * Show an error toast
   */
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => {
    showToast(message, {
      ...options,
      type: 'error',
      duration: options?.duration ?? 5000,
    })
  },

  /**
   * Show a warning toast
   */
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => {
    showToast(message, {
      ...options,
      type: 'warning',
      duration: options?.duration ?? 4000,
    })
  },

  /**
   * Show an info toast
   */
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => {
    showToast(message, { ...options, type: 'info' })
  },

  /**
   * Show a custom toast
   */
  custom: (message: string, options?: ToastOptions) => {
    showToast(message, options)
  },

  /**
   * Promise-based toast (shows loading, then success/error)
   */
  promise: async <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ): Promise<T> => {
    const loadingToast = showToast(messages.loading, {
      type: 'info',
      persistent: true,
    })

    try {
      const data = await promise
      const successMessage =
        typeof messages.success === 'function'
          ? messages.success(data)
          : messages.success
      showToast(successMessage, { type: 'success' })
      return data
    } catch (error) {
      const errorMessage =
        typeof messages.error === 'function'
          ? messages.logger.error(error as Error)
          : messages.error
      showToast(errorMessage, { type: 'error' })
      throw error
    }
  },
}

/**
 * Common toast messages
 * Provides consistency across the application
 */
export const toastMessages = {
  // Copy actions
  copied: 'Copied to clipboard!',
  copyFailed: 'Failed to copy to clipboard',

  // Save actions
  saved: 'Settings saved successfully',
  saveFailed: 'Failed to save settings',

  // Theme
  themeChanged: (theme: string) => `Switched to ${theme} theme`,

  // Search
  searchFailed: 'Search failed - please try again',
  noResults: 'No results found',

  // Network
  offline: 'You are offline',
  online: 'Connection restored',

  // Errors
  genericError: 'Something went wrong',
  tryAgain: 'Please try again',

  // Loading
  loading: 'Loading...',
  processing: 'Processing...',

  // API
  apiError: 'API request failed',
  timeout: 'Request timed out',

  // Forms
  validationError: 'Please fix the errors in the form',
  submitted: 'Form submitted successfully',
}
