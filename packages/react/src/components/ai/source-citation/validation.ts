/**
 * Validation functions for SourceCitation component
 *
 * Uses canonical validation utilities from @clarity-chat/utils
 */

import { isValidUrl, isNonEmptyString } from '@clarity-chat/utils/validation'
import type { Source } from './types'

/**
 * Validate a source object has required fields
 */
export function validateSource(source: Source): boolean {
  return Boolean(
    source &&
    isNonEmptyString(source.url) &&
    isNonEmptyString(source.title) &&
    isNonEmptyString(source.snippet)
  )
}

// Re-export isValidUrl from canonical source for backward compatibility
export { isValidUrl }

/**
 * Validate confidence score is in range [0, 1]
 */
export function isValidConfidence(confidence: number): boolean {
  return typeof confidence === 'number' && confidence >= 0 && confidence <= 1
}

/**
 * Validate date format
 */
export function isValidDate(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  return d instanceof Date && !isNaN(d.getTime())
}

/**
 * Sanitize source data, removing invalid fields
 */
export function sanitizeSource(source: Source): Source {
  const sanitized: Source = {
    url: source.url,
    title: source.title,
    snippet: source.snippet,
  }

  if (source.favicon && isValidUrl(source.favicon)) {
    sanitized.favicon = source.favicon
  }

  if (source.confidence !== undefined && isValidConfidence(source.confidence)) {
    sanitized.confidence = source.confidence
  }

  if (source.domain && source.domain.trim().length > 0) {
    sanitized.domain = source.domain
  }

  if (source.date && isValidDate(source.date)) {
    sanitized.date = source.date
  }

  if (source.author && source.author.trim().length > 0) {
    sanitized.author = source.author
  }

  if (source.metadata && typeof source.metadata === 'object') {
    sanitized.metadata = source.metadata
  }

  return sanitized
}

/**
 * Filter out invalid sources from an array
 */
export function filterValidSources(sources: Source[]): Source[] {
  return sources.filter(validateSource).map(sanitizeSource)
}
