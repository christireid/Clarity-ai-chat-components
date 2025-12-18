/**
 * React hook for Developer Notifications
 *
 * Real-time developer feedback and notifications for build events,
 * performance warnings, errors, and custom alerts.
 *
 * @module useDevNotifications
 *
 * @example
 * ```tsx
 * import { useDevNotifications } from '@clarity-chat/dev-tools'
 *
 * function DevPanel() {
 *   const { notifications, active, info, error, dismiss } = useDevNotifications({
 *     channel: 'build'
 *   })
 *
 *   // Show build status
 *   const handleBuildStart = () => info('Build', 'Compilation started...')
 *   const handleBuildError = (err) => error('Build Failed', err.message)
 *
 *   return (
 *     <div>
 *       {active.map(n => (
 *         <div key={n.id} onClick={() => dismiss(n.id)}>
 *           {n.title}: {n.message}
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */

'use client'

import * as React from 'react'
import {
  getDevNotifications,
  createDevNotifications,
  type DevNotifications,
  type DevNotification,
  type NotificationType,
  type NotificationPriority,
  type NotificationAction,
  type NotificationConfig,
} from '../../debug/dev-notifications'

export interface UseDevNotificationsOptions {
  channel?: string
  config?: NotificationConfig
}

export interface UseDevNotificationsReturn {
  notifications: DevNotification[]
  active: DevNotification[]
  stats: {
    total: number
    active: number
    dismissed: number
    byType: Record<NotificationType, number>
    byPriority: Record<NotificationPriority, number>
  }
  notify: (options: {
    type: NotificationType
    title: string
    message: string
    priority?: NotificationPriority
    duration?: number
    actions?: NotificationAction[]
    data?: Record<string, unknown>
  }) => DevNotification
  info: (title: string, message: string) => DevNotification
  success: (title: string, message: string) => DevNotification
  warning: (title: string, message: string) => DevNotification
  error: (title: string, message: string) => DevNotification
  performance: (title: string, message: string) => DevNotification
  build: (title: string, message: string) => DevNotification
  dismiss: (id: string) => void
  dismissAll: () => void
  clear: () => void
}

/**
 * Hook to use developer notifications with channel filtering and auto-dismiss
 *
 * @param options - Configuration for notification channel and behavior
 * @returns Object with notifications list, helper methods, and stats
 *
 * @see {@link DevNotifications} for the underlying implementation
 */
export function useDevNotifications(
  options: UseDevNotificationsOptions = {}
): UseDevNotificationsReturn {
  const { channel = 'all', config } = options

  const notifier = React.useMemo(() => {
    if (config) {
      return createDevNotifications(config)
    }
    return getDevNotifications()
  }, [config])

  const [notifications, setNotifications] = React.useState<DevNotification[]>(
    []
  )
  const [active, setActive] = React.useState<DevNotification[]>([])

  // Subscribe to notifications
  React.useEffect(() => {
    const unsubscribe = notifier.subscribe((notification) => {
      setNotifications(notifier.getAll())
      setActive(notifier.getActive(channel))
    }, channel)

    // Initial load
    setNotifications(notifier.getAll())
    setActive(notifier.getActive(channel))

    return unsubscribe
  }, [notifier, channel])

  const notify = React.useCallback(
    (notifyOptions: {
      type: NotificationType
      title: string
      message: string
      priority?: NotificationPriority
      duration?: number
      actions?: NotificationAction[]
      data?: Record<string, unknown>
    }) => {
      const notification = notifier.notify(notifyOptions)
      setNotifications(notifier.getAll())
      setActive(notifier.getActive(channel))
      return notification
    },
    [notifier, channel]
  )

  const info = React.useCallback(
    (title: string, message: string) => {
      return notify({ type: 'info', title, message })
    },
    [notify]
  )

  const success = React.useCallback(
    (title: string, message: string) => {
      return notify({ type: 'success', title, message })
    },
    [notify]
  )

  const warning = React.useCallback(
    (title: string, message: string) => {
      return notify({ type: 'warning', title, message, priority: 'high' })
    },
    [notify]
  )

  const error = React.useCallback(
    (title: string, message: string) => {
      return notify({
        type: 'error',
        title,
        message,
        priority: 'urgent',
        duration: 0,
      })
    },
    [notify]
  )

  const performance = React.useCallback(
    (title: string, message: string) => {
      return notify({ type: 'performance', title, message })
    },
    [notify]
  )

  const build = React.useCallback(
    (title: string, message: string) => {
      return notify({ type: 'build', title, message })
    },
    [notify]
  )

  const dismiss = React.useCallback(
    (id: string) => {
      notifier.dismiss(id)
      setNotifications(notifier.getAll())
      setActive(notifier.getActive(channel))
    },
    [notifier, channel]
  )

  const dismissAll = React.useCallback(() => {
    notifier.dismissAll()
    setNotifications(notifier.getAll())
    setActive([])
  }, [notifier])

  const clear = React.useCallback(() => {
    notifier.clear()
    setNotifications([])
    setActive([])
  }, [notifier])

  const stats = React.useMemo(() => {
    return notifier.getStats()
  }, [notifier, notifications])

  return {
    notifications,
    active,
    stats,
    notify,
    info,
    success,
    warning,
    error,
    performance,
    build,
    dismiss,
    dismissAll,
    clear,
  }
}

/**
 * Context for global notifications across components
 */
const DevNotificationsContext =
  React.createContext<UseDevNotificationsReturn | null>(null)

/**
 * Provider for developer notifications context
 *
 * Wrap your app or component tree to enable useNotifications() hook access.
 *
 * @example
 * ```tsx
 * <DevNotificationsProvider config={{ maxNotifications: 10 }}>
 *   <App />
 * </DevNotificationsProvider>
 * ```
 */
export function DevNotificationsProvider({
  children,
  config,
}: {
  children: React.ReactNode
  config?: NotificationConfig
}) {
  const notifications = useDevNotifications({ config })

  return (
    <DevNotificationsContext.Provider value={notifications}>
      {children}
    </DevNotificationsContext.Provider>
  )
}

/**
 * Hook to access notifications from DevNotificationsProvider context
 *
 * @throws {Error} When used outside of DevNotificationsProvider
 * @returns The notification state and methods from the provider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { info, error } = useNotifications()
 *   return <button onClick={() => info('Hello', 'World!')}>Notify</button>
 * }
 * ```
 */
export function useNotifications(): UseDevNotificationsReturn {
  const context = React.useContext(DevNotificationsContext)
  if (!context) {
    throw new Error(
      'useNotifications must be used within DevNotificationsProvider'
    )
  }
  return context
}

export default useDevNotifications
