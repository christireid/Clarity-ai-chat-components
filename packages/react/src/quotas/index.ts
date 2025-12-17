import { logger } from '@clarity-chat/utils/logger';
/**
 * Usage Quota System
 *
 * Track and enforce usage limits for cost control.
 * Perfect for managing API costs, rate limiting, and billing.
 *
 * @example
 * ```tsx
 * import { QuotaManager, MemoryQuotaStorage } from '@clarity-chat/react'
 *
 * const quotas = new QuotaManager({
 *   limits: {
 *     tokens: 100000,  // 100k tokens per month
 *     requests: 1000,  // 1k requests per month
 *   },
 *   resetPeriod: 'monthly',
 *   storage: new MemoryQuotaStorage(),
 *   onWarning: (quota) => {
 *     logger.debug(`Warning: ${quota.used}/${quota.limit} used`)
 *   },
 *   onExceeded: (quota) => {
 *     logger.debug('Quota exceeded!')
 *   },
 * })
 *
 * // Check before operation
 * const check = await quotas.checkQuota('user-123', 'tokens', 500)
 *
 * if (check.allowed) {
 *   // Perform operation
 *   await doAIOperation()
 *
 *   // Record actual usage
 *   await quotas.recordUsage('user-123', 'tokens', 500, {
 *     cost: 0.01,
 *   })
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Get usage history
 * const history = await quotas.getUsageHistory(
 *   'user-123',
 *   'tokens',
 *   Date.now() - 86400000 // Last 24h
 * )
 *
 * const totalCost = history.reduce((sum, r) => sum + (r.cost || 0), 0)
 * ```
 */

export * from './types'
export * from './quota-manager'

