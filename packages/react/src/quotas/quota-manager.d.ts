/**
 * Quota Manager
 *
 * Track and enforce usage limits for cost control.
 */
import type { UsageQuota, UsageRecord, QuotaConfig, QuotaStorage } from './types';
export declare class QuotaManager {
    private config;
    constructor(config: QuotaConfig);
    /**
     * Check if usage is allowed
     */
    checkQuota(identifier: string, type: 'tokens' | 'requests' | 'storage' | 'custom', amount?: number): Promise<{
        allowed: boolean;
        quota: UsageQuota;
        remaining: number;
    }>;
    /**
     * Record usage
     */
    recordUsage(identifier: string, type: 'tokens' | 'requests' | 'storage' | 'custom', amount: number, metadata?: {
        resourceId?: string;
        cost?: number;
        metadata?: Record<string, any>;
    }): Promise<void>;
    /**
     * Get current quota
     */
    getQuota(identifier: string, type: string): Promise<UsageQuota | null>;
    /**
     * Get usage history
     */
    getUsageHistory(identifier: string, type: string, startTime?: number, endTime?: number): Promise<UsageRecord[]>;
    /**
     * Reset quota for identifier
     */
    resetQuota(identifier: string, type: string): Promise<void>;
    /**
     * Get or create quota
     */
    private getOrCreateQuota;
    private getLimit;
    private getResetPeriodMs;
    private generateId;
}
/**
 * Memory Quota Storage (for development/testing)
 */
export declare class MemoryQuotaStorage implements QuotaStorage {
    private quotas;
    private usage;
    getQuota(identifier: string, type: string): Promise<UsageQuota | null>;
    updateQuota(quota: UsageQuota): Promise<void>;
    recordUsage(record: UsageRecord): Promise<void>;
    getUsage(identifier: string, type: string, startTime?: number, endTime?: number): Promise<UsageRecord[]>;
    resetQuota(identifier: string, type: string): Promise<void>;
    deleteOlderThan(timestamp: number): Promise<number>;
}
//# sourceMappingURL=quota-manager.d.ts.map