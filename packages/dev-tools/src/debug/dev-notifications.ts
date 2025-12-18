/**
 * Developer Notifications System for Clarity Chat Developer Tools
 *
 * Real-time developer feedback and notifications:
 * - Toast-style notifications for dev mode
 * - Performance alerts
 * - Error notifications with actions
 * - Build/HMR status updates
 * - Custom notification channels
 * - Notification history and replay
 */

import chalk from 'chalk'
import { infoBox, warningBox, errorBox, successBox } from '../ui/box'

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'performance' | 'build'

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface NotificationAction {
  label: string
  handler: () => void | Promise<void>
  primary?: boolean
}

export interface DevNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  priority: NotificationPriority
  duration: number // ms, 0 = persistent
  channel?: string
  actions?: NotificationAction[]
  data?: Record<string, unknown>
  dismissed: boolean
  dismissedAt?: Date
  source?: string
  stack?: string
}

export interface NotificationChannel {
  id: string
  name: string
  enabled: boolean
  filter?: (notification: DevNotification) => boolean
  transform?: (notification: DevNotification) => DevNotification
}

export interface NotificationConfig {
  maxNotifications?: number
  defaultDuration?: number
  enableConsoleOutput?: boolean
  enableSound?: boolean
  groupSimilar?: boolean
  channels?: NotificationChannel[]
}

const DEFAULT_CONFIG: Required<NotificationConfig> = {
  maxNotifications: 100,
  defaultDuration: 5000,
  enableConsoleOutput: true,
  enableSound: false,
  groupSimilar: true,
  channels: [],
}

const TYPE_ICONS: Record<NotificationType, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  performance: '⚡',
  build: '🔨',
}

const TYPE_COLORS: Record<NotificationType, (text: string) => string> = {
  info: chalk.blue,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  performance: chalk.magenta,
  build: chalk.cyan,
}

/**
 * Developer Notifications System
 * Real-time feedback for developers
 */
export class DevNotifications {
  private notifications: DevNotification[] = []
  private config: Required<NotificationConfig>
  private channels: Map<string, NotificationChannel> = new Map()
  private listeners: Map<string, Set<(notification: DevNotification) => void>> = new Map()
  private enabled: boolean = true

  constructor(config?: NotificationConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config }

    // Register default channels
    this.registerChannel({
      id: 'all',
      name: 'All Notifications',
      enabled: true,
    })

    this.registerChannel({
      id: 'errors',
      name: 'Errors Only',
      enabled: true,
      filter: (n) => n.type === 'error',
    })

    this.registerChannel({
      id: 'performance',
      name: 'Performance Alerts',
      enabled: true,
      filter: (n) => n.type === 'performance',
    })

    // Register custom channels from config
    this.config.channels.forEach(channel => this.registerChannel(channel))
  }

  /**
   * Show a notification
   */
  notify(options: {
    type: NotificationType
    title: string
    message: string
    priority?: NotificationPriority
    duration?: number
    channel?: string
    actions?: NotificationAction[]
    data?: Record<string, unknown>
    source?: string
  }): DevNotification {
    const notification: DevNotification = {
      id: this.generateId(),
      type: options.type,
      title: options.title,
      message: options.message,
      timestamp: new Date(),
      priority: options.priority ?? 'normal',
      duration: options.duration ?? this.config.defaultDuration,
      channel: options.channel,
      actions: options.actions,
      data: options.data,
      dismissed: false,
      source: options.source,
      stack: options.type === 'error' ? new Error().stack : undefined,
    }

    if (this.enabled) {
      // Group similar notifications if enabled
      if (this.config.groupSimilar) {
        const similar = this.notifications.find(
          n => !n.dismissed &&
               n.type === notification.type &&
               n.title === notification.title &&
               n.message === notification.message
        )
        if (similar) {
          // Update existing notification
          similar.timestamp = notification.timestamp
          return similar
        }
      }

      this.notifications.push(notification)

      // Maintain max notifications
      if (this.notifications.length > this.config.maxNotifications) {
        this.notifications.shift()
      }

      // Output to console
      if (this.config.enableConsoleOutput) {
        this.consoleOutput(notification)
      }

      // Notify listeners
      this.notifyListeners(notification)

      // Auto-dismiss after duration
      if (notification.duration > 0) {
        setTimeout(() => {
          this.dismiss(notification.id)
        }, notification.duration)
      }
    }

    return notification
  }

  /**
   * Convenience method for info notification
   */
  info(title: string, message: string, options?: Partial<Omit<Parameters<typeof this.notify>[0], 'type' | 'title' | 'message'>>): DevNotification {
    return this.notify({ type: 'info', title, message, ...options })
  }

  /**
   * Convenience method for success notification
   */
  success(title: string, message: string, options?: Partial<Omit<Parameters<typeof this.notify>[0], 'type' | 'title' | 'message'>>): DevNotification {
    return this.notify({ type: 'success', title, message, ...options })
  }

  /**
   * Convenience method for warning notification
   */
  warning(title: string, message: string, options?: Partial<Omit<Parameters<typeof this.notify>[0], 'type' | 'title' | 'message'>>): DevNotification {
    return this.notify({ type: 'warning', title, message, priority: 'high', ...options })
  }

  /**
   * Convenience method for error notification
   */
  error(title: string, message: string, options?: Partial<Omit<Parameters<typeof this.notify>[0], 'type' | 'title' | 'message'>>): DevNotification {
    return this.notify({ type: 'error', title, message, priority: 'urgent', duration: 0, ...options })
  }

  /**
   * Convenience method for performance notification
   */
  performance(title: string, message: string, options?: Partial<Omit<Parameters<typeof this.notify>[0], 'type' | 'title' | 'message'>>): DevNotification {
    return this.notify({ type: 'performance', title, message, ...options })
  }

  /**
   * Convenience method for build notification
   */
  build(title: string, message: string, options?: Partial<Omit<Parameters<typeof this.notify>[0], 'type' | 'title' | 'message'>>): DevNotification {
    return this.notify({ type: 'build', title, message, ...options })
  }

  /**
   * Dismiss a notification
   */
  dismiss(id: string): boolean {
    const notification = this.notifications.find(n => n.id === id)
    if (!notification) return false

    notification.dismissed = true
    notification.dismissedAt = new Date()
    return true
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    const now = new Date()
    this.notifications.forEach(n => {
      if (!n.dismissed) {
        n.dismissed = true
        n.dismissedAt = now
      }
    })
  }

  /**
   * Get active (non-dismissed) notifications
   */
  getActive(channel?: string): DevNotification[] {
    let notifications = this.notifications.filter(n => !n.dismissed)

    if (channel) {
      const ch = this.channels.get(channel)
      if (ch?.filter) {
        notifications = notifications.filter(ch.filter)
      }
    }

    return notifications.sort((a, b) => {
      // Sort by priority then timestamp
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 }
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.timestamp.getTime() - a.timestamp.getTime()
    })
  }

  /**
   * Get all notifications
   */
  getAll(): DevNotification[] {
    return [...this.notifications]
  }

  /**
   * Get notification by ID
   */
  get(id: string): DevNotification | undefined {
    return this.notifications.find(n => n.id === id)
  }

  /**
   * Register a notification channel
   */
  registerChannel(channel: NotificationChannel): void {
    this.channels.set(channel.id, channel)
    this.listeners.set(channel.id, new Set())
  }

  /**
   * Unregister a channel
   */
  unregisterChannel(channelId: string): void {
    this.channels.delete(channelId)
    this.listeners.delete(channelId)
  }

  /**
   * Enable/disable a channel
   */
  setChannelEnabled(channelId: string, enabled: boolean): void {
    const channel = this.channels.get(channelId)
    if (channel) {
      channel.enabled = enabled
    }
  }

  /**
   * Subscribe to notifications
   */
  subscribe(listener: (notification: DevNotification) => void, channel: string = 'all'): () => void {
    const channelListeners = this.listeners.get(channel)
    if (!channelListeners) {
      this.listeners.set(channel, new Set())
    }
    this.listeners.get(channel)!.add(listener)
    return () => this.listeners.get(channel)?.delete(listener)
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notifications = []
  }

  /**
   * Enable/disable notifications
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Get statistics
   */
  getStats(): {
    total: number
    active: number
    dismissed: number
    byType: Record<NotificationType, number>
    byPriority: Record<NotificationPriority, number>
  } {
    const byType: Record<NotificationType, number> = {
      info: 0,
      success: 0,
      warning: 0,
      error: 0,
      performance: 0,
      build: 0,
    }

    const byPriority: Record<NotificationPriority, number> = {
      low: 0,
      normal: 0,
      high: 0,
      urgent: 0,
    }

    this.notifications.forEach(n => {
      byType[n.type]++
      byPriority[n.priority]++
    })

    return {
      total: this.notifications.length,
      active: this.notifications.filter(n => !n.dismissed).length,
      dismissed: this.notifications.filter(n => n.dismissed).length,
      byType,
      byPriority,
    }
  }

  /**
   * Export notifications
   */
  export(): string {
    return JSON.stringify({
      notifications: this.notifications,
      stats: this.getStats(),
      exportedAt: new Date().toISOString(),
    }, null, 2)
  }

  /**
   * Notify listeners
   */
  private notifyListeners(notification: DevNotification): void {
    // Notify 'all' channel listeners
    this.listeners.get('all')?.forEach(listener => listener(notification))

    // Notify specific channel listeners
    this.channels.forEach((channel, channelId) => {
      if (channelId === 'all') return
      if (!channel.enabled) return
      if (channel.filter && !channel.filter(notification)) return

      const transformed = channel.transform ? channel.transform(notification) : notification
      this.listeners.get(channelId)?.forEach(listener => listener(transformed))
    })
  }

  /**
   * Output notification to console
   */
  private consoleOutput(notification: DevNotification): void {
    const icon = TYPE_ICONS[notification.type]
    const color = TYPE_COLORS[notification.type]
    const priorityBadge = notification.priority === 'urgent'
      ? chalk.bgRed.white(' URGENT ')
      : notification.priority === 'high'
        ? chalk.bgYellow.black(' HIGH ')
        : ''

    console.log('')
    console.log(color(`${icon} ${notification.title} ${priorityBadge}`))
    console.log(chalk.gray(`   ${notification.message}`))
    if (notification.source) {
      console.log(chalk.gray(`   Source: ${notification.source}`))
    }
    console.log('')
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Print notification summary
   */
  printSummary(): void {
    const stats = this.getStats()
    const active = this.getActive()

    console.log('')
    console.log(infoBox('Developer Notifications', '🔔 Notifications'))
    console.log('')

    // Stats
    console.log(chalk.gray(`Total: ${stats.total} | Active: ${stats.active} | Dismissed: ${stats.dismissed}`))
    console.log('')

    // Active notifications
    if (active.length === 0) {
      console.log(chalk.green('  ✓ No active notifications'))
    } else {
      active.slice(0, 10).forEach(n => {
        const icon = TYPE_ICONS[n.type]
        const color = TYPE_COLORS[n.type]
        const time = n.timestamp.toLocaleTimeString()
        console.log(color(`  ${icon} [${time}] ${n.title}`))
        console.log(chalk.gray(`      ${n.message}`))
      })

      if (active.length > 10) {
        console.log(chalk.gray(`      ... and ${active.length - 10} more`))
      }
    }

    console.log('')
  }
}

// Global instance
let globalNotifications: DevNotifications | null = null

/**
 * Get the global notifications instance
 */
export function getDevNotifications(): DevNotifications {
  if (!globalNotifications) {
    globalNotifications = new DevNotifications({
      enableConsoleOutput: process.env.NODE_ENV === 'development',
    })
  }
  return globalNotifications
}

/**
 * Create a new notifications instance
 */
export function createDevNotifications(config?: NotificationConfig): DevNotifications {
  return new DevNotifications(config)
}

/**
 * Quick notification helpers
 */
export const devNotify = {
  info: (title: string, message: string) => getDevNotifications().info(title, message),
  success: (title: string, message: string) => getDevNotifications().success(title, message),
  warning: (title: string, message: string) => getDevNotifications().warning(title, message),
  error: (title: string, message: string) => getDevNotifications().error(title, message),
  performance: (title: string, message: string) => getDevNotifications().performance(title, message),
  build: (title: string, message: string) => getDevNotifications().build(title, message),
}

export default DevNotifications
