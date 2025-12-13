/**
 * Event Emitter for MCP Server
 *
 * Lightweight, type-safe event emitter for internal communication
 * and plugin system hooks.
 *
 * @module utils/events
 */

import { logger } from './logger.js'

type EventHandler<T = unknown> = (data: T) => void | Promise<void>

interface EventSubscription {
  handler: EventHandler
  once: boolean
  id: number
}

/**
 * Type-safe Event Emitter
 */
export class EventEmitter<EventMap extends { [K: string]: unknown } = Record<string, unknown>> {
  private listeners = new Map<keyof EventMap, Set<EventSubscription>>()
  private maxListeners = 100
  private maxTotalListeners = 1000
  private subscriptionIdCounter = 0
  private handlerToSubscription = new WeakMap<EventHandler, EventSubscription>()

  /**
   * Get total listener count across all events
   */
  private getTotalListenerCount(): number {
    let total = 0
    for (const set of this.listeners.values()) {
      total += set.size
    }
    return total
  }

  /**
   * Subscribe to an event
   * @returns Unsubscribe function
   */
  on<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
  ): () => void {
    // Check total listener limit
    if (this.getTotalListenerCount() >= this.maxTotalListeners) {
      logger.warn('Max total listeners exceeded, rejecting new listener', {
        event: String(event),
        max: this.maxTotalListeners,
      })
      return () => {} // Return no-op unsubscribe
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    const eventListeners = this.listeners.get(event)!
    if (eventListeners.size >= this.maxListeners) {
      logger.warn('Max listeners exceeded for event', {
        event: String(event),
        max: this.maxListeners,
      })
    }

    const subscription: EventSubscription = {
      handler: handler as EventHandler,
      once: false,
      id: ++this.subscriptionIdCounter,
    }
    eventListeners.add(subscription)
    this.handlerToSubscription.set(handler as EventHandler, subscription)

    return () => {
      eventListeners.delete(subscription)
      if (eventListeners.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  /**
   * Subscribe to an event (fires once then unsubscribes)
   * @returns Unsubscribe function
   */
  once<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
  ): () => void {
    // Check total listener limit
    if (this.getTotalListenerCount() >= this.maxTotalListeners) {
      logger.warn('Max total listeners exceeded, rejecting new listener', {
        event: String(event),
        max: this.maxTotalListeners,
      })
      return () => {}
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    const subscription: EventSubscription = {
      handler: handler as EventHandler,
      once: true,
      id: ++this.subscriptionIdCounter,
    }
    this.listeners.get(event)!.add(subscription)
    this.handlerToSubscription.set(handler as EventHandler, subscription)

    return () => {
      this.listeners.get(event)?.delete(subscription)
    }
  }

  /**
   * Remove a specific handler from an event
   */
  offHandler<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
  ): boolean {
    const eventListeners = this.listeners.get(event)
    if (!eventListeners) return false

    // Find and remove the subscription with this handler
    const subscription = this.handlerToSubscription.get(handler as EventHandler)
    if (subscription) {
      eventListeners.delete(subscription)
      if (eventListeners.size === 0) {
        this.listeners.delete(event)
      }
      return true
    }

    // Fallback: search through subscriptions
    for (const sub of eventListeners) {
      if (sub.handler === handler) {
        eventListeners.delete(sub)
        if (eventListeners.size === 0) {
          this.listeners.delete(event)
        }
        return true
      }
    }

    return false
  }

  /**
   * Emit an event to all subscribers
   */
  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const eventListeners = this.listeners.get(event)
    if (!eventListeners) return

    const toRemove: EventSubscription[] = []

    for (const subscription of eventListeners) {
      try {
        const result = subscription.handler(data)
        // Handle async handlers without awaiting
        if (result instanceof Promise) {
          result.catch((error) => {
            logger.error(
              `Async event handler error for ${String(event)}`,
              error instanceof Error ? error : undefined
            )
          })
        }
      } catch (error) {
        logger.error(
          `Event handler error for ${String(event)}`,
          error instanceof Error ? error : undefined
        )
      }

      if (subscription.once) {
        toRemove.push(subscription)
      }
    }

    // Remove one-time handlers
    for (const subscription of toRemove) {
      eventListeners.delete(subscription)
    }
  }

  /**
   * Emit an event and wait for all async handlers to complete
   */
  async emitAsync<K extends keyof EventMap>(
    event: K,
    data: EventMap[K]
  ): Promise<void> {
    const eventListeners = this.listeners.get(event)
    if (!eventListeners) return

    const toRemove: EventSubscription[] = []
    const promises: Promise<void>[] = []

    for (const subscription of eventListeners) {
      try {
        const result = subscription.handler(data)
        if (result instanceof Promise) {
          promises.push(result)
        }
      } catch (error) {
        logger.error(
          `Event handler error for ${String(event)}`,
          error instanceof Error ? error : undefined
        )
      }

      if (subscription.once) {
        toRemove.push(subscription)
      }
    }

    // Wait for all async handlers
    await Promise.allSettled(promises)

    // Remove one-time handlers
    for (const subscription of toRemove) {
      eventListeners.delete(subscription)
    }
  }

  /**
   * Remove all listeners for an event
   */
  off<K extends keyof EventMap>(event: K): void {
    this.listeners.delete(event)
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners.clear()
  }

  /**
   * Get listener count for an event
   */
  listenerCount<K extends keyof EventMap>(event: K): number {
    return this.listeners.get(event)?.size ?? 0
  }

  /**
   * Set maximum listeners per event
   */
  setMaxListeners(max: number): void {
    this.maxListeners = max
  }

  /**
   * Get all event names with listeners
   */
  eventNames(): Array<keyof EventMap> {
    return Array.from(this.listeners.keys())
  }
}

// =============================================================================
// Global Event Types for MCP Server
// =============================================================================

/**
 * MCP Server event types
 */
export type MCPServerEvents = {
  // Server lifecycle
  'server:starting': { version: string }
  'server:started': { tools: number; resources: number; prompts: number }
  'server:stopping': { reason: string }
  'server:stopped': { uptime: number }
  'server:error': { error: Error; fatal: boolean }

  // Tool events
  'tool:called': { name: string; args: Record<string, unknown>; requestId: string }
  'tool:success': { name: string; duration: number; requestId: string }
  'tool:error': { name: string; error: Error; requestId: string }

  // Resource events
  'resource:read': { uri: string; requestId: string }
  'resource:success': { uri: string; duration: number; requestId: string }
  'resource:error': { uri: string; error: Error; requestId: string }

  // Prompt events
  'prompt:get': { name: string; args: Record<string, string>; requestId: string }
  'prompt:success': { name: string; duration: number; requestId: string }
  'prompt:error': { name: string; error: Error; requestId: string }

  // Plugin events
  'plugin:registered': { pluginId: string }
  'plugin:enabled': { pluginId: string }
  'plugin:disabled': { pluginId: string }
  'plugin:unregistered': { pluginId: string }
  'plugin:error': { pluginId: string; error: Error }

  // Cache events
  'cache:hit': { key: string; cache: string }
  'cache:miss': { key: string; cache: string }
  'cache:evicted': { key: string; cache: string }
  'cache:cleared': { cache: string }

  // Rate limiting events
  'ratelimit:exceeded': { clientId: string; limit: number }
  'ratelimit:warning': { clientId: string; remaining: number }

  // Index signature for extensibility
  [key: string]: unknown
}

/**
 * Global MCP server event emitter
 */
export const serverEvents = new EventEmitter<MCPServerEvents>()

// =============================================================================
// Event Middleware Helper
// =============================================================================

/**
 * Create a middleware that emits events before and after an operation
 */
export function withEvents<T extends (...args: any[]) => Promise<any>>(
  operation: T,
  options: {
    before?: keyof MCPServerEvents
    after?: keyof MCPServerEvents
    error?: keyof MCPServerEvents
    getContext: (...args: Parameters<T>) => Record<string, unknown>
  }
): T {
  return (async (...args: Parameters<T>) => {
    const context = options.getContext(...args)
    const startTime = Date.now()

    if (options.before) {
      serverEvents.emit(options.before, context as any)
    }

    try {
      const result = await operation(...args)

      if (options.after) {
        serverEvents.emit(options.after, {
          ...context,
          duration: Date.now() - startTime,
        } as any)
      }

      return result
    } catch (error) {
      if (options.error) {
        serverEvents.emit(options.error, {
          ...context,
          error: error instanceof Error ? error : new Error(String(error)),
        } as any)
      }
      throw error
    }
  }) as T
}
