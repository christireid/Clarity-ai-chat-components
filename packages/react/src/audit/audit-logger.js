/**
 * Audit Logger
 *
 * Simple, flexible audit logging for compliance and security.
 */
export class AuditLogger {
    config;
    constructor(config) {
        this.config = {
            captureUserAgent: config.captureUserAgent ?? true,
            captureIpAddress: config.captureIpAddress ?? true,
            retentionDays: config.retentionDays ?? 90,
            redactFields: config.redactFields ?? [],
            ...config,
        };
    }
    /**
     * Log an audit event
     */
    async log(action, data, options) {
        const event = {
            id: this.generateId(),
            action,
            userId: options?.userId,
            sessionId: options?.sessionId,
            tenantId: options?.tenantId,
            resource: options?.resource,
            data: this.redactSensitiveData(data),
            timestamp: Date.now(),
            result: options?.result || 'success',
            error: options?.error,
        };
        // Capture additional context
        if (this.config.captureUserAgent && typeof navigator !== 'undefined') {
            event.userAgent = navigator.userAgent;
        }
        await this.config.storage.store(event);
        return event;
    }
    /**
     * Query audit logs
     */
    async query(query) {
        return await this.config.storage.query(query);
    }
    /**
     * Get event by ID
     */
    async getEvent(id) {
        return await this.config.storage.get(id);
    }
    /**
     * Clean up old events based on retention policy
     */
    async cleanup() {
        const retentionMs = this.config.retentionDays * 24 * 60 * 60 * 1000;
        const cutoff = Date.now() - retentionMs;
        return await this.config.storage.deleteOlderThan(cutoff);
    }
    /**
     * Redact sensitive fields from data
     */
    redactSensitiveData(data) {
        if (this.config.redactFields.length === 0) {
            return data;
        }
        const redacted = { ...data };
        for (const field of this.config.redactFields) {
            if (field in redacted) {
                redacted[field] = '[REDACTED]';
            }
        }
        return redacted;
    }
    generateId() {
        return `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    }
}
/**
 * Memory Audit Storage (for development/testing)
 */
export class MemoryAuditStorage {
    events = [];
    async store(event) {
        this.events.push(event);
    }
    async query(query) {
        let results = [...this.events];
        if (query.userId) {
            results = results.filter((e) => e.userId === query.userId);
        }
        if (query.action) {
            results = results.filter((e) => e.action === query.action);
        }
        if (query.resourceType) {
            results = results.filter((e) => e.resource?.type === query.resourceType);
        }
        if (query.result) {
            results = results.filter((e) => e.result === query.result);
        }
        if (query.startTime) {
            results = results.filter((e) => e.timestamp >= query.startTime);
        }
        if (query.endTime) {
            results = results.filter((e) => e.timestamp <= query.endTime);
        }
        // Sort by timestamp (newest first)
        results.sort((a, b) => b.timestamp - a.timestamp);
        // Pagination
        const offset = query.offset || 0;
        const limit = query.limit || 100;
        return results.slice(offset, offset + limit);
    }
    async get(id) {
        return this.events.find((e) => e.id === id) || null;
    }
    async deleteOlderThan(timestamp) {
        const before = this.events.length;
        this.events = this.events.filter((e) => e.timestamp >= timestamp);
        return before - this.events.length;
    }
    /**
     * Get all events (for testing)
     */
    getAll() {
        return [...this.events];
    }
    /**
     * Clear all events
     */
    clear() {
        this.events = [];
    }
}
//# sourceMappingURL=audit-logger.js.map