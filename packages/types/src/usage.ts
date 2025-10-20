/**
 * Usage and billing type definitions
 */

export type UsagePeriod = 'hour' | 'day' | 'week' | 'month' | 'year'

export interface UsageMetrics {
  messagesCount: number
  tokensUsed: number
  filesUploaded: number
  exportsGenerated: number
  storageUsed: number
  apiCalls: number
}

export interface CostBreakdown {
  category: string
  amount: number
  quantity: number
  unitPrice: number
}

export interface UsageStats {
  period: UsagePeriod
  startDate: Date
  endDate: Date
  metrics: UsageMetrics
  costs: {
    total: number
    breakdown: CostBreakdown[]
  }
}

export interface CreditBalance {
  userId: string
  available: number
  used: number
  total: number
  nextRefillDate?: Date
  autoRefill: boolean
}

export interface UsageLimit {
  metric: keyof UsageMetrics
  limit: number
  current: number
  resetDate: Date
}

export interface BillingHistory {
  id: string
  date: Date
  amount: number
  description: string
  status: 'paid' | 'pending' | 'failed'
  invoiceUrl?: string
}

export interface UsageAlert {
  id: string
  metric: keyof UsageMetrics
  threshold: number
  message: string
  severity: 'info' | 'warning' | 'critical'
}
