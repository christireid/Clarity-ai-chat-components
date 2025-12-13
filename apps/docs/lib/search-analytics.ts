/**
 * Premium Search Analytics
 *
 * Privacy-first, comprehensive analytics for search behavior.
 * Data is stored in localStorage and never sent to external servers.
 *
 * Features:
 * - Query tracking with deduplication
 * - Click-through rate (CTR) analysis
 * - Session tracking
 * - Time-series analytics
 * - Search performance metrics
 * - Trend detection
 * - Conversion funnel analysis
 * - Export in multiple formats
 */

export interface SearchQuery {
  id: string
  query: string
  resultsCount: number
  timestamp: number
  sessionId: string
  duration?: number
  filters?: Record<string, string>
}

export interface SearchClick {
  id: string
  query: string
  href: string
  title: string
  position: number
  timestamp: number
  sessionId: string
}

export interface SearchSession {
  id: string
  startTime: number
  endTime?: number
  queryCount: number
  clickCount: number
  hasConversion: boolean
}

export interface SearchAnalytics {
  queries: SearchQuery[]
  clicks: SearchClick[]
  noResults: string[]
  sessions: SearchSession[]
  version: string
}

export interface TimeSeriesPoint {
  date: string
  queries: number
  clicks: number
  ctr: number
  avgResults: number
}

export interface SearchInsight {
  type: 'trending' | 'declining' | 'opportunity' | 'performance'
  message: string
  data: unknown
  severity: 'info' | 'warning' | 'success'
}

const STORAGE_KEY = 'clarity-search-analytics'
const MAX_ENTRIES = 1000
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const ANALYTICS_VERSION = '2.0'

let currentSession: SearchSession | null = null
let sessionTimeoutId: ReturnType<typeof setTimeout> | null = null

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Get current session or create a new one
 */
function getOrCreateSession(): SearchSession {
  const now = Date.now()

  if (
    currentSession &&
    sessionTimeoutId &&
    (!currentSession.endTime || now - currentSession.endTime < SESSION_TIMEOUT_MS)
  ) {
    // Extend session
    if (sessionTimeoutId) clearTimeout(sessionTimeoutId)
    sessionTimeoutId = setTimeout(endSession, SESSION_TIMEOUT_MS)
    return currentSession
  }

  // Create new session
  currentSession = {
    id: generateId(),
    startTime: now,
    queryCount: 0,
    clickCount: 0,
    hasConversion: false,
  }

  sessionTimeoutId = setTimeout(endSession, SESSION_TIMEOUT_MS)

  return currentSession
}

/**
 * End current session
 */
function endSession(): void {
  if (currentSession) {
    currentSession.endTime = Date.now()

    const analytics = getAnalytics()
    analytics.sessions.push(currentSession)
    saveAnalytics(analytics)

    currentSession = null
    sessionTimeoutId = null
  }
}

/**
 * Get current analytics data from localStorage
 */
function getAnalytics(): SearchAnalytics {
  if (typeof window === 'undefined') {
    return { queries: [], clicks: [], noResults: [], sessions: [], version: ANALYTICS_VERSION }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      // Migrate old format if needed
      if (!data.version) {
        return {
          queries: data.queries || [],
          clicks: data.clicks || [],
          noResults: data.noResults || [],
          sessions: [],
          version: ANALYTICS_VERSION,
        }
      }
      return data
    }
  } catch {
    // Silently fail on parse errors
  }

  return { queries: [], clicks: [], noResults: [], sessions: [], version: ANALYTICS_VERSION }
}

/**
 * Save analytics data to localStorage with quota handling
 */
function saveAnalytics(data: SearchAnalytics): void {
  if (typeof window === 'undefined') return

  try {
    // Trim to max entries
    const trimmed: SearchAnalytics = {
      queries: data.queries.slice(-MAX_ENTRIES),
      clicks: data.clicks.slice(-MAX_ENTRIES),
      noResults: [...new Set(data.noResults)].slice(-MAX_ENTRIES),
      sessions: data.sessions.slice(-Math.floor(MAX_ENTRIES / 10)),
      version: ANALYTICS_VERSION,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (error) {
    // Handle QuotaExceededError by reducing data size
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      try {
        // Try with reduced data
        const reduced: SearchAnalytics = {
          queries: data.queries.slice(-Math.floor(MAX_ENTRIES / 2)),
          clicks: data.clicks.slice(-Math.floor(MAX_ENTRIES / 2)),
          noResults: [...new Set(data.noResults)].slice(-Math.floor(MAX_ENTRIES / 2)),
          sessions: data.sessions.slice(-Math.floor(MAX_ENTRIES / 20)),
          version: ANALYTICS_VERSION,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced))
      } catch {
        // If still failing, remove old data
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    // Silently fail on other storage errors
  }
}

/**
 * Track a search query with enhanced metadata
 */
export function trackSearchQuery(
  query: string,
  resultsCount: number,
  options?: {
    duration?: number
    filters?: Record<string, string>
  }
): void {
  const analytics = getAnalytics()
  const session = getOrCreateSession()

  // Deduplicate rapid-fire queries
  const recentQuery = analytics.queries[analytics.queries.length - 1]
  if (
    recentQuery &&
    recentQuery.query === query.toLowerCase().trim() &&
    Date.now() - recentQuery.timestamp < 1000
  ) {
    return
  }

  const searchQuery: SearchQuery = {
    id: generateId(),
    query: query.toLowerCase().trim(),
    resultsCount,
    timestamp: Date.now(),
    sessionId: session.id,
    duration: options?.duration,
    filters: options?.filters,
  }

  analytics.queries.push(searchQuery)
  session.queryCount++

  // Track "no results" queries
  if (resultsCount === 0) {
    analytics.noResults.push(query.toLowerCase().trim())
  }

  saveAnalytics(analytics)
}

/**
 * Track a search result click with position
 */
export function trackSearchClick(
  query: string,
  href: string,
  title: string,
  position: number = 0
): void {
  const analytics = getAnalytics()
  const session = getOrCreateSession()

  const click: SearchClick = {
    id: generateId(),
    query: query.toLowerCase().trim(),
    href,
    title,
    position,
    timestamp: Date.now(),
    sessionId: session.id,
  }

  analytics.clicks.push(click)
  session.clickCount++

  saveAnalytics(analytics)
}

/**
 * Track a conversion (e.g., user completed a desired action)
 */
export function trackConversion(): void {
  if (currentSession) {
    currentSession.hasConversion = true
  }
}

/**
 * Get time-series analytics for the last N days
 */
export function getTimeSeriesData(days: number = 30): TimeSeriesPoint[] {
  const analytics = getAnalytics()
  const now = Date.now()
  const startTime = now - days * 24 * 60 * 60 * 1000

  // Group by date
  const dateData = new Map<string, { queries: SearchQuery[]; clicks: SearchClick[] }>()

  for (const query of analytics.queries) {
    if (query.timestamp >= startTime) {
      const date = new Date(query.timestamp).toISOString().split('T')[0]
      if (!dateData.has(date)) {
        dateData.set(date, { queries: [], clicks: [] })
      }
      dateData.get(date)!.queries.push(query)
    }
  }

  for (const click of analytics.clicks) {
    if (click.timestamp >= startTime) {
      const date = new Date(click.timestamp).toISOString().split('T')[0]
      if (!dateData.has(date)) {
        dateData.set(date, { queries: [], clicks: [] })
      }
      dateData.get(date)!.clicks.push(click)
    }
  }

  // Convert to time series
  const result: TimeSeriesPoint[] = []

  for (let i = 0; i < days; i++) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const data = dateData.get(date) || { queries: [], clicks: [] }

    const queries = data.queries.length
    const clicks = data.clicks.length
    const ctr = queries > 0 ? (clicks / queries) * 100 : 0
    const avgResults =
      data.queries.length > 0
        ? data.queries.reduce((sum, q) => sum + q.resultsCount, 0) / data.queries.length
        : 0

    result.unshift({ date, queries, clicks, ctr, avgResults })
  }

  return result
}

/**
 * Get search funnel metrics
 */
export function getSearchFunnel(): {
  totalSearches: number
  searchesWithResults: number
  searchesWithClicks: number
  conversions: number
  searchToResultsRate: number
  resultsToClickRate: number
  clickToConversionRate: number
} {
  const analytics = getAnalytics()

  const totalSearches = analytics.queries.length
  const searchesWithResults = analytics.queries.filter((q) => q.resultsCount > 0).length
  const uniqueQueriesWithClicks = new Set(analytics.clicks.map((c) => c.query)).size
  const conversions = analytics.sessions.filter((s) => s.hasConversion).length

  const searchToResultsRate = totalSearches > 0 ? (searchesWithResults / totalSearches) * 100 : 0
  const resultsToClickRate =
    searchesWithResults > 0 ? (uniqueQueriesWithClicks / searchesWithResults) * 100 : 0
  const clickToConversionRate =
    uniqueQueriesWithClicks > 0 ? (conversions / uniqueQueriesWithClicks) * 100 : 0

  return {
    totalSearches,
    searchesWithResults,
    searchesWithClicks: uniqueQueriesWithClicks,
    conversions,
    searchToResultsRate,
    resultsToClickRate,
    clickToConversionRate,
  }
}

/**
 * Get search insights and recommendations
 */
export function getSearchInsights(): SearchInsight[] {
  const analytics = getAnalytics()
  const insights: SearchInsight[] = []

  // No results analysis
  const noResultsQueries = [...new Set(analytics.noResults)]
  if (noResultsQueries.length > 5) {
    insights.push({
      type: 'opportunity',
      message: `${noResultsQueries.length} searches returned no results. Consider adding content for these queries.`,
      data: noResultsQueries.slice(0, 10),
      severity: 'warning',
    })
  }

  // CTR analysis
  const timeSeries = getTimeSeriesData(7)
  // Avoid division by zero if no data
  const avgCtr = timeSeries.length > 0
    ? timeSeries.reduce((sum, d) => sum + d.ctr, 0) / timeSeries.length
    : 0

  if (avgCtr < 20) {
    insights.push({
      type: 'performance',
      message: `Click-through rate is low (${avgCtr.toFixed(1)}%). Consider improving search relevance or result presentation.`,
      data: { avgCtr },
      severity: 'warning',
    })
  } else if (avgCtr > 50) {
    insights.push({
      type: 'performance',
      message: `Great click-through rate (${avgCtr.toFixed(1)}%)! Users are finding what they need.`,
      data: { avgCtr },
      severity: 'success',
    })
  }

  // Trending queries (queries with increasing frequency)
  const recentQueries = analytics.queries.filter(
    (q) => q.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000
  )
  const olderQueries = analytics.queries.filter(
    (q) =>
      q.timestamp > Date.now() - 14 * 24 * 60 * 60 * 1000 &&
      q.timestamp <= Date.now() - 7 * 24 * 60 * 60 * 1000
  )

  const recentCounts = new Map<string, number>()
  const olderCounts = new Map<string, number>()

  recentQueries.forEach((q) => {
    recentCounts.set(q.query, (recentCounts.get(q.query) || 0) + 1)
  })
  olderQueries.forEach((q) => {
    olderCounts.set(q.query, (olderCounts.get(q.query) || 0) + 1)
  })

  const trending: string[] = []
  for (const [query, recentCount] of recentCounts) {
    const olderCount = olderCounts.get(query) || 0
    if (recentCount > olderCount * 1.5 && recentCount >= 3) {
      trending.push(query)
    }
  }

  if (trending.length > 0) {
    insights.push({
      type: 'trending',
      message: `Trending searches this week: ${trending.slice(0, 5).join(', ')}`,
      data: trending,
      severity: 'info',
    })
  }

  return insights
}

/**
 * Get comprehensive analytics summary
 */
export function getAnalyticsSummary(): {
  // Basic metrics
  totalQueries: number
  uniqueQueries: number
  totalClicks: number
  totalSessions: number
  noResultsQueries: string[]
  // Rankings
  topQueries: { query: string; count: number; ctr: number }[]
  topClicks: { href: string; title: string; count: number; avgPosition: number }[]
  // Performance
  avgResultsPerQuery: number
  avgClickPosition: number
  overallCtr: number
  // Time-based
  queriesLast24h: number
  queriesLast7d: number
  queriesLast30d: number
  // Insights
  insights: SearchInsight[]
} {
  const analytics = getAnalytics()
  const now = Date.now()

  // Count query frequency with CTR
  const queryData = new Map<string, { count: number; clicks: number }>()
  analytics.queries.forEach((q) => {
    const existing = queryData.get(q.query) || { count: 0, clicks: 0 }
    existing.count++
    queryData.set(q.query, existing)
  })

  // Count clicks per query
  analytics.clicks.forEach((c) => {
    const existing = queryData.get(c.query)
    if (existing) {
      existing.clicks++
    }
  })

  // Count click frequency with position
  const clickData = new Map<string, { href: string; title: string; count: number; totalPosition: number }>()
  analytics.clicks.forEach((c) => {
    const existing = clickData.get(c.href)
    if (existing) {
      existing.count++
      existing.totalPosition += c.position
    } else {
      clickData.set(c.href, { href: c.href, title: c.title, count: 1, totalPosition: c.position })
    }
  })

  // Sort by frequency
  const topQueries = Array.from(queryData.entries())
    .map(([query, data]) => ({
      query,
      count: data.count,
      ctr: data.count > 0 ? (data.clicks / data.count) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  const topClicks = Array.from(clickData.values())
    .map((data) => ({
      href: data.href,
      title: data.title,
      count: data.count,
      avgPosition: data.count > 0 ? data.totalPosition / data.count : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  // Calculate averages
  const avgResultsPerQuery =
    analytics.queries.length > 0
      ? analytics.queries.reduce((sum, q) => sum + q.resultsCount, 0) / analytics.queries.length
      : 0

  const avgClickPosition =
    analytics.clicks.length > 0
      ? analytics.clicks.reduce((sum, c) => sum + c.position, 0) / analytics.clicks.length
      : 0

  const overallCtr =
    analytics.queries.length > 0
      ? (analytics.clicks.length / analytics.queries.length) * 100
      : 0

  // Time-based counts
  const queriesLast24h = analytics.queries.filter(
    (q) => q.timestamp > now - 24 * 60 * 60 * 1000
  ).length
  const queriesLast7d = analytics.queries.filter(
    (q) => q.timestamp > now - 7 * 24 * 60 * 60 * 1000
  ).length
  const queriesLast30d = analytics.queries.filter(
    (q) => q.timestamp > now - 30 * 24 * 60 * 60 * 1000
  ).length

  return {
    totalQueries: analytics.queries.length,
    uniqueQueries: queryData.size,
    totalClicks: analytics.clicks.length,
    totalSessions: analytics.sessions.length,
    noResultsQueries: [...new Set(analytics.noResults)],
    topQueries,
    topClicks,
    avgResultsPerQuery,
    avgClickPosition,
    overallCtr,
    queriesLast24h,
    queriesLast7d,
    queriesLast30d,
    insights: getSearchInsights(),
  }
}

/**
 * Clear all analytics data
 */
export function clearAnalytics(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  currentSession = null
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId)
    sessionTimeoutId = null
  }
}

/**
 * Export analytics data in various formats
 */
export function exportAnalytics(format: 'json' | 'csv' = 'json'): string {
  const analytics = getAnalytics()

  if (format === 'csv') {
    // Export queries as CSV
    const headers = ['timestamp', 'query', 'resultsCount', 'sessionId']
    const rows = analytics.queries.map((q) =>
      [
        new Date(q.timestamp).toISOString(),
        `"${q.query.replace(/"/g, '""')}"`,
        q.resultsCount,
        q.sessionId,
      ].join(',')
    )
    return [headers.join(','), ...rows].join('\n')
  }

  return JSON.stringify(analytics, null, 2)
}

/**
 * Import analytics data (for backup restoration)
 */
export function importAnalytics(data: string): boolean {
  try {
    const parsed = JSON.parse(data) as SearchAnalytics
    if (parsed.queries && parsed.clicks) {
      saveAnalytics(parsed)
      return true
    }
    return false
  } catch {
    return false
  }
}

/**
 * Get raw analytics data (for advanced analysis)
 */
export function getRawAnalytics(): SearchAnalytics {
  return getAnalytics()
}
