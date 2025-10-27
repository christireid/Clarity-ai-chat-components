/**
 * Type definitions for Analytics Console
 */

export interface AnalyticsEntry {
  id: string
  timestamp: Date
  provider: 'openai' | 'anthropic' | 'google'
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  responseTime: number
  userId?: string
  metadata?: Record<string, any>
}

export interface DailySummary {
  date: string
  totalRequests: number
  totalTokens: number
  totalCost: number
  byProvider: Record<string, ProviderStats>
  byModel: Record<string, ModelStats>
}

export interface ProviderStats {
  requests: number
  tokens: number
  cost: number
}

export interface ModelStats {
  requests: number
  tokens: number
  cost: number
  avgResponseTime: number
}

export interface SummaryStats {
  totalRequests: number
  totalTokens: number
  totalCost: number
  avgTokensPerRequest: number
  avgCostPerRequest: number
  avgResponseTime: number
  byProvider: Record<string, ProviderStats>
  byModel: Record<string, ModelStats>
}

export interface PricingInfo {
  input: number  // per 1K tokens
  output: number // per 1K tokens
}

export interface TimeRange {
  start: Date
  end: Date
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}
