/**
 * In-memory analytics storage
 * Production should use a database (PostgreSQL, MongoDB, etc.)
 */

import type { AnalyticsEntry, DailySummary, SummaryStats } from '../types/analytics'

// In-memory storage
const entries: AnalyticsEntry[] = []

/**
 * Add an analytics entry
 */
export function addEntry(entry: Omit<AnalyticsEntry, 'id' | 'timestamp'>): AnalyticsEntry {
  const newEntry: AnalyticsEntry = {
    ...entry,
    id: `entry-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    timestamp: new Date(),
    totalTokens: entry.promptTokens + entry.completionTokens
  }
  
  entries.push(newEntry)
  return newEntry
}

/**
 * Get all entries
 */
export function getEntries(limit?: number): AnalyticsEntry[] {
  if (limit) {
    return entries.slice(-limit)
  }
  return entries
}

/**
 * Get entries within time range
 */
export function getEntriesByDateRange(start: Date, end: Date): AnalyticsEntry[] {
  return entries.filter(entry => {
    const entryDate = new Date(entry.timestamp)
    return entryDate >= start && entryDate <= end
  })
}

/**
 * Get summary statistics
 */
export function getSummaryStats(): SummaryStats {
  if (entries.length === 0) {
    return {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      avgTokensPerRequest: 0,
      avgCostPerRequest: 0,
      avgResponseTime: 0,
      byProvider: {},
      byModel: {}
    }
  }
  
  const totalRequests = entries.length
  const totalTokens = entries.reduce((sum, e) => sum + e.totalTokens, 0)
  const totalCost = entries.reduce((sum, e) => sum + e.cost, 0)
  const totalResponseTime = entries.reduce((sum, e) => sum + e.responseTime, 0)
  
  // Group by provider
  const byProvider: Record<string, any> = {}
  entries.forEach(entry => {
    if (!byProvider[entry.provider]) {
      byProvider[entry.provider] = {
        requests: 0,
        tokens: 0,
        cost: 0
      }
    }
    byProvider[entry.provider].requests++
    byProvider[entry.provider].tokens += entry.totalTokens
    byProvider[entry.provider].cost += entry.cost
  })
  
  // Group by model
  const byModel: Record<string, any> = {}
  entries.forEach(entry => {
    if (!byModel[entry.model]) {
      byModel[entry.model] = {
        requests: 0,
        tokens: 0,
        cost: 0,
        responseTime: 0
      }
    }
    byModel[entry.model].requests++
    byModel[entry.model].tokens += entry.totalTokens
    byModel[entry.model].cost += entry.cost
    byModel[entry.model].responseTime += entry.responseTime
  })
  
  // Calculate averages for models
  Object.keys(byModel).forEach(model => {
    byModel[model].avgResponseTime = byModel[model].responseTime / byModel[model].requests
  })
  
  return {
    totalRequests,
    totalTokens,
    totalCost,
    avgTokensPerRequest: totalTokens / totalRequests,
    avgCostPerRequest: totalCost / totalRequests,
    avgResponseTime: totalResponseTime / totalRequests,
    byProvider,
    byModel
  }
}

/**
 * Get daily summaries
 */
export function getDailySummaries(days: number = 30): DailySummary[] {
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - days)
  
  const dailyMap = new Map<string, DailySummary>()
  
  entries.forEach(entry => {
    const entryDate = new Date(entry.timestamp)
    if (entryDate >= startDate) {
      const dateKey = entryDate.toISOString().split('T')[0]
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: dateKey,
          totalRequests: 0,
          totalTokens: 0,
          totalCost: 0,
          byProvider: {},
          byModel: {}
        })
      }
      
      const daily = dailyMap.get(dateKey)!
      daily.totalRequests++
      daily.totalTokens += entry.totalTokens
      daily.totalCost += entry.cost
      
      // By provider
      if (!daily.byProvider[entry.provider]) {
        daily.byProvider[entry.provider] = { requests: 0, tokens: 0, cost: 0 }
      }
      daily.byProvider[entry.provider].requests++
      daily.byProvider[entry.provider].tokens += entry.totalTokens
      daily.byProvider[entry.provider].cost += entry.cost
      
      // By model
      if (!daily.byModel[entry.model]) {
        daily.byModel[entry.model] = { requests: 0, tokens: 0, cost: 0, avgResponseTime: 0 }
      }
      daily.byModel[entry.model].requests++
      daily.byModel[entry.model].tokens += entry.totalTokens
      daily.byModel[entry.model].cost += entry.cost
    }
  })
  
  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Clear all entries (for testing)
 */
export function clearAllEntries(): void {
  entries.length = 0
}

/**
 * Get entry count
 */
export function getEntryCount(): number {
  return entries.length
}
