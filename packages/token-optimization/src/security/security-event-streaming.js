/**
 * Security Event Streaming System
 * Real-time streaming of security events for monitoring and analysis
 */
import { EventEmitter } from 'events';
export class SecurityEventStreamer extends EventEmitter {
    subscribers = new Map();
    eventQueue = [];
    metrics = {
        totalEvents: 0,
        eventsPerSecond: 0,
        eventsPerMinute: 0,
        eventsPerHour: 0,
        subscribers: 0,
        queueSize: 0,
        lastEvent: null
    };
    metricsInterval = null;
    MAX_QUEUE_SIZE = 10000;
    BATCH_SIZE = 100;
    constructor() {
        super();
        this.startMetricsCollection();
    }
    // Stream security events to subscribers
    async streamEvent(event) {
        // Add to queue for processing
        this.eventQueue.push(event);
        // Trim queue if it gets too large (prevent memory issues)
        if (this.eventQueue.length > this.MAX_QUEUE_SIZE) {
            this.eventQueue = this.eventQueue.slice(-this.MAX_QUEUE_SIZE);
        }
        // Update metrics
        this.updateMetrics(event);
        // Notify subscribers
        await this.notifySubscribers(event);
        // Emit for external listeners
        this.emit('security_event', event);
    }
    // Subscribe to security events
    subscribe(subscriber) {
        this.subscribers.set(subscriber.id, subscriber);
        this.metrics.subscribers = this.subscribers.size;
        console.log(`[SECURITY STREAM] New subscriber: ${subscriber.name} (${subscriber.id})`);
    }
    // Unsubscribe from security events
    unsubscribe(subscriberId) {
        const subscriber = this.subscribers.get(subscriberId);
        if (subscriber) {
            this.subscribers.delete(subscriberId);
            this.metrics.subscribers = this.subscribers.size;
            console.log(`[SECURITY STREAM] Unsubscribed: ${subscriber.name} (${subscriberId})`);
        }
    }
    // Process event queue in batches
    async processEventQueue() {
        if (this.eventQueue.length === 0)
            return;
        const eventsToProcess = this.eventQueue.splice(0, this.BATCH_SIZE);
        for (const event of eventsToProcess) {
            await this.notifySubscribers(event);
        }
        this.metrics.queueSize = this.eventQueue.length;
    }
    async notifySubscribers(event) {
        const notifications = [];
        for (const subscriber of this.subscribers.values()) {
            if (this.shouldNotifySubscriber(subscriber, event)) {
                try {
                    notifications.push(Promise.resolve(subscriber.callback(event)));
                }
                catch (error) {
                    console.error(`[SECURITY STREAM] Error notifying subscriber ${subscriber.id}:`, error);
                }
            }
        }
        // Wait for all notifications to complete
        try {
            await Promise.allSettled(notifications);
        }
        catch (error) {
            console.error('[SECURITY STREAM] Error in batch notification:', error);
        }
    }
    shouldNotifySubscriber(subscriber, event) {
        if (!subscriber.filter)
            return true;
        // Check severity filter
        if (subscriber.filter.severity && !subscriber.filter.severity.includes(event.severity)) {
            return false;
        }
        // Check category filter
        if (subscriber.filter.category && !subscriber.filter.category.includes(event.category)) {
            return false;
        }
        // Check userId filter
        if (subscriber.filter.userId && !subscriber.filter.userId.includes(event.userId || '')) {
            return false;
        }
        return true;
    }
    updateMetrics(_event) {
        this.metrics.totalEvents++;
        this.metrics.lastEvent = new Date();
        this.metrics.queueSize = this.eventQueue.length;
    }
    startMetricsCollection() {
        // Calculate rates every 10 seconds
        this.metricsInterval = setInterval(() => {
            this.calculateRates();
        }, 10000);
    }
    calculateRates() {
        const now = Date.now();
        const oneSecondAgo = now - 1000;
        const oneMinuteAgo = now - 60000;
        const oneHourAgo = now - 3600000;
        const recentEvents = this.eventQueue.filter(e => e.timestamp.getTime() > oneSecondAgo);
        const recentMinuteEvents = this.eventQueue.filter(e => e.timestamp.getTime() > oneMinuteAgo);
        const recentHourEvents = this.eventQueue.filter(e => e.timestamp.getTime() > oneHourAgo);
        this.metrics.eventsPerSecond = recentEvents.length;
        this.metrics.eventsPerMinute = recentMinuteEvents.length;
        this.metrics.eventsPerHour = recentHourEvents.length;
    }
    getMetrics() {
        return { ...this.metrics };
    }
    getSubscribers() {
        return Array.from(this.subscribers.values());
    }
    getQueueSize() {
        return this.eventQueue.length;
    }
    shutdown() {
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
            this.metricsInterval = null;
        }
        this.subscribers.clear();
        this.eventQueue = [];
        this.removeAllListeners();
        console.log('[SECURITY STREAM] Event streamer shutdown complete');
    }
}
// Pre-built subscribers for common use cases
export class SecurityStreamSubscribers {
    // Console logger subscriber
    static consoleLogger() {
        return {
            id: 'console-logger',
            name: 'Console Logger',
            callback: async (event) => {
                const logMessage = `[SECURITY EVENT] ${event.severity.toUpperCase()} - ${event.category}: ${event.type}`;
                switch (event.severity) {
                    case 'critical':
                        console.error(logMessage, event);
                        break;
                    case 'high':
                        console.warn(logMessage, event);
                        break;
                    default:
                        console.log(logMessage, event);
                }
            }
        };
    }
    // Alert system subscriber
    static alertSystem(alertCallback) {
        return {
            id: 'alert-system',
            name: 'Alert System',
            filter: {
                severity: ['high', 'critical']
            },
            callback: alertCallback
        };
    }
    // Audit logger subscriber
    static auditLogger(logCallback) {
        return {
            id: 'audit-logger',
            name: 'Audit Logger',
            callback: logCallback
        };
    }
    // Metrics collector subscriber
    static metricsCollector(metricsCallback) {
        return {
            id: 'metrics-collector',
            name: 'Metrics Collector',
            callback: metricsCallback
        };
    }
    // Compliance monitor subscriber
    static complianceMonitor(complianceCallback) {
        return {
            id: 'compliance-monitor',
            name: 'Compliance Monitor',
            filter: {
                category: ['compliance_violation']
            },
            callback: complianceCallback
        };
    }
}
// Factory function for creating event streamer
export function createSecurityEventStreamer() {
    return new SecurityEventStreamer();
}
// Integration helper for security managers
export function createStreamingSecurityEvent(originalEvent, category, severity) {
    return {
        ...originalEvent,
        id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        severity,
        category,
        metadata: {
            originalLength: originalEvent.originalLength,
            processedLength: originalEvent.processedLength,
            checks: originalEvent.checks
        }
    };
}
//# sourceMappingURL=security-event-streaming.js.map