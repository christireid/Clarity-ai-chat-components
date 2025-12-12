/**
 * Usage and billing type definitions
 *
 * This module contains types for tracking usage metrics,
 * costs, credits, limits, and billing history.
 *
 * @packageDocumentation
 */

/**
 * Time period for usage aggregation.
 */
export type UsagePeriod = 'hour' | 'day' | 'week' | 'month' | 'year'

/**
 * Usage metrics for tracking consumption.
 *
 * @example
 * ```typescript
 * const metrics: UsageMetrics = {
 *   messagesCount: 150,
 *   tokensUsed: 50000,
 *   filesUploaded: 5,
 *   exportsGenerated: 3,
 *   storageUsed: 10485760, // 10MB
 *   apiCalls: 200,
 * }
 * ```
 */
export interface UsageMetrics {
  /** Number of messages sent/received */
  messagesCount: number
  /** Total tokens consumed */
  tokensUsed: number
  /** Number of files uploaded */
  filesUploaded: number
  /** Number of exports generated */
  exportsGenerated: number
  /** Storage used in bytes */
  storageUsed: number
  /** Number of API calls made */
  apiCalls: number
}

/**
 * Cost breakdown by category.
 *
 * @example
 * ```typescript
 * const breakdown: CostBreakdown = {
 *   category: 'AI Tokens',
 *   amount: 5.00,
 *   quantity: 50000,
 *   unitPrice: 0.0001,
 * }
 * ```
 */
export interface CostBreakdown {
  /** Category name */
  category: string
  /** Total amount for this category */
  amount: number
  /** Quantity consumed */
  quantity: number
  /** Price per unit */
  unitPrice: number
}

/**
 * Usage statistics for a time period.
 *
 * @example
 * ```typescript
 * const stats: UsageStats = {
 *   period: 'month',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 *   metrics: { messagesCount: 500, tokensUsed: 150000, ... },
 *   costs: {
 *     total: 15.00,
 *     breakdown: [{ category: 'AI Tokens', amount: 15.00, ... }],
 *   },
 * }
 * ```
 */
export interface UsageStats {
  /** Aggregation period */
  period: UsagePeriod
  /** Period start date */
  startDate: Date
  /** Period end date */
  endDate: Date
  /** Usage metrics for the period */
  metrics: UsageMetrics
  /** Cost information */
  costs: {
    /** Total cost for the period */
    total: number
    /** Breakdown by category */
    breakdown: CostBreakdown[]
  }
}

/**
 * User's credit balance information.
 *
 * @example
 * ```typescript
 * const balance: CreditBalance = {
 *   userId: 'user-1',
 *   available: 75.00,
 *   used: 25.00,
 *   total: 100.00,
 *   nextRefillDate: new Date('2024-02-01'),
 *   autoRefill: true,
 * }
 * ```
 */
export interface CreditBalance {
  /** User ID */
  userId: string
  /** Available credits */
  available: number
  /** Credits used this period */
  used: number
  /** Total credits allocated */
  total: number
  /** When credits will be refilled */
  nextRefillDate?: Date
  /** Whether auto-refill is enabled */
  autoRefill: boolean
}

/**
 * Usage limit for a specific metric.
 *
 * @example
 * ```typescript
 * const limit: UsageLimit = {
 *   metric: 'tokensUsed',
 *   limit: 100000,
 *   current: 75000,
 *   resetDate: new Date('2024-02-01'),
 * }
 * ```
 */
export interface UsageLimit {
  /** The metric being limited */
  metric: keyof UsageMetrics
  /** Maximum allowed value */
  limit: number
  /** Current usage */
  current: number
  /** When the limit resets */
  resetDate: Date
}

/**
 * Billing history entry.
 *
 * @example
 * ```typescript
 * const billing: BillingHistory = {
 *   id: 'inv-123',
 *   date: new Date('2024-01-15'),
 *   amount: 29.99,
 *   description: 'Pro Plan - January 2024',
 *   status: 'paid',
 *   invoiceUrl: 'https://billing.example.com/invoices/123',
 * }
 * ```
 */
export interface BillingHistory {
  /** Invoice/transaction ID */
  id: string
  /** Transaction date */
  date: Date
  /** Amount charged */
  amount: number
  /** Description of the charge */
  description: string
  /** Payment status */
  status: 'paid' | 'pending' | 'failed'
  /** URL to download invoice */
  invoiceUrl?: string
}

/**
 * Usage alert configuration.
 *
 * @example
 * ```typescript
 * const alert: UsageAlert = {
 *   id: 'alert-1',
 *   metric: 'tokensUsed',
 *   threshold: 80000,
 *   message: 'You have used 80% of your token limit',
 *   severity: 'warning',
 * }
 * ```
 */
export interface UsageAlert {
  /** Alert ID */
  id: string
  /** Metric being monitored */
  metric: keyof UsageMetrics
  /** Threshold value that triggers the alert */
  threshold: number
  /** Alert message to display */
  message: string
  /** Alert severity level */
  severity: 'info' | 'warning' | 'critical'
}
