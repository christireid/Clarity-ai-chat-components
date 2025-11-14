/**
 * Quota Manager
 *
 * Track and enforce usage limits for cost control.
 */

import type { UsageQuota, UsageRecord, QuotaConfig, QuotaStorage } from './types'

export class QuotaManager {
  private config: QuotaConfig

  constructor(config: QuotaConfig) {
    this.config = config
  }

  /**
   * Check if usage is allowed
   */
  async checkQuota(
    identifier: string,
    type: 'tokens' | 'requests' | 'storage' | 'custom',
    amount = 1
  ): Promise<{
    allowed: boolean
    quota: UsageQuota
    remaining: number
  }> {
    const quota = await this.getOrCreateQuota(identifier, type)

    // Check if quota would be exceeded
    const newUsage = quota.used + amount
    const allowed = newUsage <= quota.limit

    // Calculate remaining
    const remaining = Math.max(0, quota.limit - newUsage)

    // Check warning threshold
    if (
      this.config.warningThreshold &&
      newUsage / quota.limit >= this.config.warningThreshold &&
      quota.used / quota.limit < this.config.warningThreshold
    ) {
      if (this.config.onWarning) {
        this.config.onWarning({ ...quota, used: newUsage })
      }
    }

    // Check if exceeded
    if (!allowed && this.config.onExceeded) {
      this.config.onExceeded({ ...quota, used: newUsage, exceeded: true })
    }

    return {
      allowed,
      quota: { ...quota, used: newUsage, exceeded: !allowed },
      remaining,
    }
  }

  /**
   * Record usage
   */
  async recordUsage(
    identifier: string,
    type: 'tokens' | 'requests' | 'storage' | 'custom',
    amount: number,
    metadata?: {
      resourceId?: string
      cost?: number
      metadata?: Record<string, any>
    }
  ): Promise<void> {
    // Get quota
    const quota = await this.getOrCreateQuota(identifier, type)

    // Record usage
    const record: UsageRecord = {
      id: this.generateId(),
      identifier,
      type,
      amount,
      timestamp: Date.now(),
      resourceId: metadata?.resourceId,
      cost: metadata?.cost,
      metadata: metadata?.metadata,
    }

    await this.config.storage.recordUsage(record)

    // Update quota
    quota.used += amount
    quota.exceeded = quota.used > quota.limit

    await this.config.storage.updateQuota(quota)
  }

  /**
   * Get current quota
   */
  async getQuota(identifier: string, type: string): Promise<UsageQuota | null> {
    return await this.config.storage.getQuota(identifier, type)
  }

  /**
   * Get usage history
   */
  async getUsageHistory(
    identifier: string,
    type: string,
    startTime?: number,
    endTime?: number
  ): Promise<UsageRecord[]> {
    return await this.config.storage.getUsage(identifier, type, startTime, endTime)
  }

  /**
   * Reset quota for identifier
   */
  async resetQuota(identifier: string, type: string): Promise<void> {
    await this.config.storage.resetQuota(identifier, type)
  }

  /**
   * Get or create quota
   */
  private async getOrCreateQuota(
    identifier: string,
    type: 'tokens' | 'requests' | 'storage' | 'custom'
  ): Promise<UsageQuota> {
    let quota = await this.config.storage.getQuota(identifier, type)

    if (!quota) {
      // Create new quota
      const limit = this.getLimit(type)
      const resetPeriod = this.getResetPeriodMs()

      quota = {
        id: this.generateId(),
        identifier,
        type,
        limit,
        used: 0,
        resetPeriod,
        resetsAt: Date.now() + resetPeriod,
        exceeded: false,
      }

      await this.config.storage.updateQuota(quota)
    } else if (quota.resetsAt < Date.now()) {
      // Reset quota
      quota.used = 0
      quota.resetsAt = Date.now() + quota.resetPeriod
      quota.exceeded = false

      await this.config.storage.updateQuota(quota)
    }

    return quota
  }

  private getLimit(type: string): number {
    switch (type) {
      case 'tokens':
        return this.config.limits.tokens || 100000
      case 'requests':
        return this.config.limits.requests || 1000
      case 'storage':
        return this.config.limits.storage || 1073741824 // 1GB
      default:
        return this.config.limits.custom?.[type] || 1000
    }
  }

  private getResetPeriodMs(): number {
    if (typeof this.config.resetPeriod === 'number') {
      return this.config.resetPeriod
    }

    switch (this.config.resetPeriod) {
      case 'daily':
        return 24 * 60 * 60 * 1000
      case 'weekly':
        return 7 * 24 * 60 * 60 * 1000
      case 'monthly':
        return 30 * 24 * 60 * 60 * 1000
      default:
        return 24 * 60 * 60 * 1000
    }
  }

  private generateId(): string {
    return `quota-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }
}

/**
 * Memory Quota Storage (for development/testing)
 */
export class MemoryQuotaStorage implements QuotaStorage {
  private quotas = new Map<string, UsageQuota>()
  private usage: UsageRecord[] = []

  async getQuota(identifier: string, type: string): Promise<UsageQuota | null> {
    const key = `${identifier}:${type}`
    return this.quotas.get(key) || null
  }

  async updateQuota(quota: UsageQuota): Promise<void> {
    const key = `${quota.identifier}:${quota.type}`
    this.quotas.set(key, quota)
  }

  async recordUsage(record: UsageRecord): Promise<void> {
    this.usage.push(record)
  }

  async getUsage(
    identifier: string,
    type: string,
    startTime?: number,
    endTime?: number
  ): Promise<UsageRecord[]> {
    let records = this.usage.filter((r) => r.identifier === identifier && r.type === type)

    if (startTime) {
      records = records.filter((r) => r.timestamp >= startTime)
    }

    if (endTime) {
      records = records.filter((r) => r.timestamp <= endTime)
    }

    return records.sort((a, b) => b.timestamp - a.timestamp)
  }

  async resetQuota(identifier: string, type: string): Promise<void> {
    const quota = await this.getQuota(identifier, type)
    if (quota) {
      quota.used = 0
      quota.exceeded = false
      quota.resetsAt = Date.now() + quota.resetPeriod
      await this.updateQuota(quota)
    }
  }

  async deleteOlderThan(timestamp: number): Promise<number> {
    const before = this.usage.length
    this.usage = this.usage.filter((r) => r.timestamp >= timestamp)
    return before - this.usage.length
  }
}

