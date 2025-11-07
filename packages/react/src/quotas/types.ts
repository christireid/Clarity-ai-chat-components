/**
 * Usage Quota Types
 *
 * Track and enforce usage limits for cost control.
 * Bring your own storage and billing integration.
 */

export interface UsageQuota {
  /** Quota ID */
  id: string
  /** User/tenant identifier */
  identifier: string
  /** Quota type */
  type: 'tokens' | 'requests' | 'storage' | 'custom'
  /** Maximum allowed */
  limit: number
  /** Current usage */
  used: number
  /** Reset period in ms */
  resetPeriod: number
  /** When quota resets */
  resetsAt: number
  /** Soft limit warning threshold (0-1) */
  warningThreshold?: number
  /** Whether quota is exceeded */
  exceeded: boolean
}

export interface UsageRecord {
  /** Record ID */
  id: string
  /** User/tenant identifier */
  identifier: string
  /** Usage type */
  type: 'tokens' | 'requests' | 'storage' | 'custom'
  /** Amount used */
  amount: number
  /** Timestamp */
  timestamp: number
  /** Associated resource */
  resourceId?: string
  /** Cost (if applicable) */
  cost?: number
  /** Metadata */
  metadata?: Record<string, any>
}

export interface QuotaConfig {
  /** Default limits by type */
  limits: {
    tokens?: number
    requests?: number
    storage?: number
    custom?: Record<string, number>
  }
  /** Reset period (daily, weekly, monthly) */
  resetPeriod: 'daily' | 'weekly' | 'monthly' | number
  /** Warning threshold (0-1) */
  warningThreshold?: number
  /** Storage backend */
  storage: QuotaStorage
  /** Callbacks */
  onWarning?: (quota: UsageQuota) => void
  onExceeded?: (quota: UsageQuota) => void
}

export interface QuotaStorage {
  /**
   * Get quota for identifier
   */
  getQuota(identifier: string, type: string): Promise<UsageQuota | null>

  /**
   * Update quota
   */
  updateQuota(quota: UsageQuota): Promise<void>

  /**
   * Record usage
   */
  recordUsage(record: UsageRecord): Promise<void>

  /**
   * Get usage history
   */
  getUsage(identifier: string, type: string, startTime?: number, endTime?: number): Promise<UsageRecord[]>

  /**
   * Reset quota
   */
  resetQuota(identifier: string, type: string): Promise<void>
}

