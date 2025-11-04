/**
 * Quota Manager
 *
 * Track and enforce usage limits for cost control.
 */
export class QuotaManager {
    constructor(config) {
        this.config = config;
    }
    /**
     * Check if usage is allowed
     */
    async checkQuota(identifier, type, amount = 1) {
        const quota = await this.getOrCreateQuota(identifier, type);
        // Check if quota would be exceeded
        const newUsage = quota.used + amount;
        const allowed = newUsage <= quota.limit;
        // Calculate remaining
        const remaining = Math.max(0, quota.limit - newUsage);
        // Check warning threshold
        if (this.config.warningThreshold &&
            newUsage / quota.limit >= this.config.warningThreshold &&
            quota.used / quota.limit < this.config.warningThreshold) {
            if (this.config.onWarning) {
                this.config.onWarning({ ...quota, used: newUsage });
            }
        }
        // Check if exceeded
        if (!allowed && this.config.onExceeded) {
            this.config.onExceeded({ ...quota, used: newUsage, exceeded: true });
        }
        return {
            allowed,
            quota: { ...quota, used: newUsage, exceeded: !allowed },
            remaining,
        };
    }
    /**
     * Record usage
     */
    async recordUsage(identifier, type, amount, metadata) {
        // Get quota
        const quota = await this.getOrCreateQuota(identifier, type);
        // Record usage
        const record = {
            id: this.generateId(),
            identifier,
            type,
            amount,
            timestamp: Date.now(),
            resourceId: metadata?.resourceId,
            cost: metadata?.cost,
            metadata: metadata?.metadata,
        };
        await this.config.storage.recordUsage(record);
        // Update quota
        quota.used += amount;
        quota.exceeded = quota.used > quota.limit;
        await this.config.storage.updateQuota(quota);
    }
    /**
     * Get current quota
     */
    async getQuota(identifier, type) {
        return await this.config.storage.getQuota(identifier, type);
    }
    /**
     * Get usage history
     */
    async getUsageHistory(identifier, type, startTime, endTime) {
        return await this.config.storage.getUsage(identifier, type, startTime, endTime);
    }
    /**
     * Reset quota for identifier
     */
    async resetQuota(identifier, type) {
        await this.config.storage.resetQuota(identifier, type);
    }
    /**
     * Get or create quota
     */
    async getOrCreateQuota(identifier, type) {
        let quota = await this.config.storage.getQuota(identifier, type);
        if (!quota) {
            // Create new quota
            const limit = this.getLimit(type);
            const resetPeriod = this.getResetPeriodMs();
            quota = {
                id: this.generateId(),
                identifier,
                type,
                limit,
                used: 0,
                resetPeriod,
                resetsAt: Date.now() + resetPeriod,
                exceeded: false,
            };
            await this.config.storage.updateQuota(quota);
        }
        else if (quota.resetsAt < Date.now()) {
            // Reset quota
            quota.used = 0;
            quota.resetsAt = Date.now() + quota.resetPeriod;
            quota.exceeded = false;
            await this.config.storage.updateQuota(quota);
        }
        return quota;
    }
    getLimit(type) {
        switch (type) {
            case 'tokens':
                return this.config.limits.tokens || 100000;
            case 'requests':
                return this.config.limits.requests || 1000;
            case 'storage':
                return this.config.limits.storage || 1073741824; // 1GB
            default:
                return this.config.limits.custom?.[type] || 1000;
        }
    }
    getResetPeriodMs() {
        if (typeof this.config.resetPeriod === 'number') {
            return this.config.resetPeriod;
        }
        switch (this.config.resetPeriod) {
            case 'daily':
                return 24 * 60 * 60 * 1000;
            case 'weekly':
                return 7 * 24 * 60 * 60 * 1000;
            case 'monthly':
                return 30 * 24 * 60 * 60 * 1000;
            default:
                return 24 * 60 * 60 * 1000;
        }
    }
    generateId() {
        return `quota-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    }
}
/**
 * Memory Quota Storage (for development/testing)
 */
export class MemoryQuotaStorage {
    constructor() {
        this.quotas = new Map();
        this.usage = [];
    }
    async getQuota(identifier, type) {
        const key = `${identifier}:${type}`;
        return this.quotas.get(key) || null;
    }
    async updateQuota(quota) {
        const key = `${quota.identifier}:${quota.type}`;
        this.quotas.set(key, quota);
    }
    async recordUsage(record) {
        this.usage.push(record);
    }
    async getUsage(identifier, type, startTime, endTime) {
        let records = this.usage.filter((r) => r.identifier === identifier && r.type === type);
        if (startTime) {
            records = records.filter((r) => r.timestamp >= startTime);
        }
        if (endTime) {
            records = records.filter((r) => r.timestamp <= endTime);
        }
        return records.sort((a, b) => b.timestamp - a.timestamp);
    }
    async resetQuota(identifier, type) {
        const quota = await this.getQuota(identifier, type);
        if (quota) {
            quota.used = 0;
            quota.exceeded = false;
            quota.resetsAt = Date.now() + quota.resetPeriod;
            await this.updateQuota(quota);
        }
    }
    async deleteOlderThan(timestamp) {
        const before = this.usage.length;
        this.usage = this.usage.filter((r) => r.timestamp >= timestamp);
        return before - this.usage.length;
    }
}
//# sourceMappingURL=quota-manager.js.map