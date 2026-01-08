/**
 * Event Emitter for MCP Server
 *
 * Lightweight, type-safe event emitter for internal communication
 * and plugin system hooks.
 *
 * @module utils/events
 */
import { logger } from './logger.js';
/**
 * Type-safe Event Emitter
 */
export class EventEmitter {
    listeners = new Map();
    maxListeners = 100;
    maxTotalListeners = 1000;
    subscriptionIdCounter = 0;
    handlerToSubscription = new WeakMap();
    /**
     * Get total listener count across all events
     */
    getTotalListenerCount() {
        let total = 0;
        for (const set of this.listeners.values()) {
            total += set.size;
        }
        return total;
    }
    /**
     * Subscribe to an event
     * @returns Unsubscribe function
     */
    on(event, handler) {
        // Check total listener limit
        if (this.getTotalListenerCount() >= this.maxTotalListeners) {
            logger.warn('Max total listeners exceeded, rejecting new listener', {
                event: String(event),
                max: this.maxTotalListeners,
            });
            return () => { }; // Return no-op unsubscribe
        }
        let eventListeners = this.listeners.get(event);
        if (!eventListeners) {
            eventListeners = new Set();
            this.listeners.set(event, eventListeners);
        }
        if (eventListeners.size >= this.maxListeners) {
            logger.warn('Max listeners exceeded for event', {
                event: String(event),
                max: this.maxListeners,
            });
        }
        const subscription = {
            handler: handler,
            once: false,
            id: ++this.subscriptionIdCounter,
        };
        eventListeners.add(subscription);
        this.handlerToSubscription.set(handler, subscription);
        return () => {
            eventListeners.delete(subscription);
            if (eventListeners.size === 0) {
                this.listeners.delete(event);
            }
        };
    }
    /**
     * Subscribe to an event (fires once then unsubscribes)
     * @returns Unsubscribe function
     */
    once(event, handler) {
        // Check total listener limit
        if (this.getTotalListenerCount() >= this.maxTotalListeners) {
            logger.warn('Max total listeners exceeded, rejecting new listener', {
                event: String(event),
                max: this.maxTotalListeners,
            });
            return () => { };
        }
        let eventListeners = this.listeners.get(event);
        if (!eventListeners) {
            eventListeners = new Set();
            this.listeners.set(event, eventListeners);
        }
        const subscription = {
            handler: handler,
            once: true,
            id: ++this.subscriptionIdCounter,
        };
        eventListeners.add(subscription);
        this.handlerToSubscription.set(handler, subscription);
        return () => {
            eventListeners.delete(subscription);
            if (eventListeners.size === 0) {
                this.listeners.delete(event);
            }
        };
    }
    /**
     * Remove a specific handler from an event
     */
    offHandler(event, handler) {
        const eventListeners = this.listeners.get(event);
        if (!eventListeners)
            return false;
        // Find and remove the subscription with this handler
        const subscription = this.handlerToSubscription.get(handler);
        if (subscription) {
            eventListeners.delete(subscription);
            if (eventListeners.size === 0) {
                this.listeners.delete(event);
            }
            return true;
        }
        // Fallback: search through subscriptions
        for (const sub of eventListeners) {
            if (sub.handler === handler) {
                eventListeners.delete(sub);
                if (eventListeners.size === 0) {
                    this.listeners.delete(event);
                }
                return true;
            }
        }
        return false;
    }
    /**
     * Emit an event to all subscribers
     */
    emit(event, data) {
        const eventListeners = this.listeners.get(event);
        if (!eventListeners)
            return;
        const toRemove = [];
        for (const subscription of eventListeners) {
            try {
                const result = subscription.handler(data);
                // Handle async handlers without awaiting
                if (result instanceof Promise) {
                    result.catch((error) => {
                        logger.error(`Async event handler error for ${String(event)}`, error instanceof Error ? error : undefined);
                    });
                }
            }
            catch (error) {
                logger.error(`Event handler error for ${String(event)}`, error instanceof Error ? error : undefined);
            }
            if (subscription.once) {
                toRemove.push(subscription);
            }
        }
        // Remove one-time handlers
        for (const subscription of toRemove) {
            eventListeners.delete(subscription);
        }
    }
    /**
     * Emit an event and wait for all async handlers to complete
     */
    async emitAsync(event, data) {
        const eventListeners = this.listeners.get(event);
        if (!eventListeners)
            return;
        const toRemove = [];
        const promises = [];
        for (const subscription of eventListeners) {
            try {
                const result = subscription.handler(data);
                if (result instanceof Promise) {
                    promises.push(result);
                }
            }
            catch (error) {
                logger.error(`Event handler error for ${String(event)}`, error instanceof Error ? error : undefined);
            }
            if (subscription.once) {
                toRemove.push(subscription);
            }
        }
        // Wait for all async handlers
        await Promise.allSettled(promises);
        // Remove one-time handlers
        for (const subscription of toRemove) {
            eventListeners.delete(subscription);
        }
    }
    /**
     * Remove all listeners for an event
     */
    off(event) {
        this.listeners.delete(event);
    }
    /**
     * Remove all listeners
     */
    removeAllListeners() {
        this.listeners.clear();
    }
    /**
     * Get listener count for an event
     */
    listenerCount(event) {
        return this.listeners.get(event)?.size ?? 0;
    }
    /**
     * Set maximum listeners per event
     */
    setMaxListeners(max) {
        this.maxListeners = max;
    }
    /**
     * Get all event names with listeners
     */
    eventNames() {
        return Array.from(this.listeners.keys());
    }
}
/**
 * Global MCP server event emitter
 */
export const serverEvents = new EventEmitter();
// =============================================================================
// Event Middleware Helper
// =============================================================================
/**
 * Create a middleware that emits events before and after an operation
 */
export function withEvents(operation, options) {
    return (async (...args) => {
        const context = options.getContext(...args);
        const startTime = Date.now();
        if (options.before) {
            serverEvents.emit(options.before, context);
        }
        try {
            const result = await operation(...args);
            if (options.after) {
                serverEvents.emit(options.after, {
                    ...context,
                    duration: Date.now() - startTime,
                });
            }
            return result;
        }
        catch (error) {
            if (options.error) {
                serverEvents.emit(options.error, {
                    ...context,
                    error: error instanceof Error ? error : new Error(String(error)),
                });
            }
            throw error;
        }
    });
}
//# sourceMappingURL=events.js.map