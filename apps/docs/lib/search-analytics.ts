/**
 * Search Analytics
 *
 * Lightweight, privacy-friendly analytics for search behavior.
 * Data is stored in localStorage and never sent to external servers.
 */

interface SearchQuery {
  query: string
  resultsCount: number
  timestamp: number
}

interface SearchClick {
  query: string
  href: string
  title: string
  timestamp: number
}

interface SearchAnalytics {
  queries: SearchQuery[]
  clicks: SearchClick[]
  noResults: string[]
}

const STORAGE_KEY = 'clarity-search-analytics'
const MAX_ENTRIES = 500

/**
 * Get current analytics data from localStorage
 */
function getAnalytics(): SearchAnalytics {
  if (typeof window === 'undefined') {
    return { queries: [], clicks: [], noResults: [] }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Silently fail on parse errors
  }

  return { queries: [], clicks: [], noResults: [] }
}

/**
 * Save analytics data to localStorage
 */
function saveAnalytics(data: SearchAnalytics): void {
  if (typeof window === 'undefined') return

  try {
    // Trim to max entries to prevent unbounded growth
    const trimmed: SearchAnalytics = {
      queries: data.queries.slice(-MAX_ENTRIES),
      clicks: data.clicks.slice(-MAX_ENTRIES),
      noResults: [...new Set(data.noResults)].slice(-MAX_ENTRIES),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // Silently fail on storage errors (e.g., quota exceeded)
  }
}

/**
 * Track a search query
 */
export function trackSearchQuery(query: string, resultsCount: number): void {
  const analytics = getAnalytics()

  // Deduplicate rapid-fire queries (don't track same query twice within 1 second)
  const recentQuery = analytics.queries[analytics.queries.length - 1]
  if (
    recentQuery &&
    recentQuery.query === query &&
    Date.now() - recentQuery.timestamp < 1000
  ) {
    return
  }

  analytics.queries.push({
    query: query.toLowerCase().trim(),
    resultsCount,
    timestamp: Date.now(),
  })

  // Track "no results" queries separately for easy access
  if (resultsCount === 0) {
    analytics.noResults.push(query.toLowerCase().trim())
  }

  saveAnalytics(analytics)
}

/**
 * Track a search result click
 */
export function trackSearchClick(
  query: string,
  href: string,
  title: string
): void {
  const analytics = getAnalytics()

  analytics.clicks.push({
    query: query.toLowerCase().trim(),
    href,
    title,
    timestamp: Date.now(),
  })

  saveAnalytics(analytics)
}

/**
 * Get analytics summary (for dev tools / debugging)
 */
export function getAnalyticsSummary(): {
  totalQueries: number
  uniqueQueries: number
  totalClicks: number
  noResultsQueries: string[]
  topQueries: { query: string; count: number }[]
  topClicks: { href: string; title: string; count: number }[]
} {
  const analytics = getAnalytics()

  // Count query frequency
  const queryCounts = new Map<string, number>()
  analytics.queries.forEach((q) => {
    queryCounts.set(q.query, (queryCounts.get(q.query) || 0) + 1)
  })

  // Count click frequency
  const clickCounts = new Map<
    string,
    { href: string; title: string; count: number }
  >()
  analytics.clicks.forEach((c) => {
    const existing = clickCounts.get(c.href)
    if (existing) {
      existing.count++
    } else {
      clickCounts.set(c.href, { href: c.href, title: c.title, count: 1 })
    }
  })

  // Sort by frequency
  const topQueries = Array.from(queryCounts.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  const topClicks = Array.from(clickCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  return {
    totalQueries: analytics.queries.length,
    uniqueQueries: queryCounts.size,
    totalClicks: analytics.clicks.length,
    noResultsQueries: [...new Set(analytics.noResults)],
    topQueries,
    topClicks,
  }
}

/**
 * Clear all analytics data
 */
export function clearAnalytics(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Export analytics data as JSON (for debugging/analysis)
 */
export function exportAnalytics(): string {
  return JSON.stringify(getAnalytics(), null, 2)
}
