/**
 * Utility functions for SourceCitation component
 */

import type { Source } from './types'

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

/**
 * Get favicon URL for a domain
 */
export function getFaviconUrl(url: string, providedFavicon?: string): string {
  if (providedFavicon) return providedFavicon
  try {
    const urlObj = new URL(url)
    // Use Google's favicon service as fallback
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
  } catch {
    return ''
  }
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get confidence label and color
 */
export function getConfidenceDisplay(confidence: number): {
  label: string
  color: string
  bgColor: string
} {
  if (confidence >= 0.9) {
    return {
      label: 'High',
      color: 'text-success',
      bgColor: 'bg-success/10',
    }
  }
  if (confidence >= 0.7) {
    return {
      label: 'Medium',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    }
  }
  if (confidence >= 0.5) {
    return {
      label: 'Low',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    }
  }
  return {
    label: 'Very Low',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/30',
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Group sources by domain
 */
export function groupSourcesByDomain(sources: Source[]): Map<string, Source[]> {
  const groups = new Map<string, Source[]>()
  sources.forEach((source) => {
    const domain = source.domain || extractDomain(source.url)
    const existing = groups.get(domain) || []
    groups.set(domain, [...existing, source])
  })
  return groups
}
