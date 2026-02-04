/**
 * URL validation and sanitization utilities
 *
 * Delegates to canonical validation utilities from @clarity-chat/utils
 * while providing UI-specific URL helpers
 */

import {
  isValidUrl as utilsIsValidUrl,
  sanitizeUrl as utilsSanitizeUrl,
  getDomain as utilsGetDomain
} from '@clarity-chat/utils/validation'

/**
 * Validates if a string is a safe HTTP/HTTPS URL
 * @param urlString - The URL string to validate
 * @returns true if the URL is valid and safe
 */
export function isValidUrl(urlString: string): boolean {
  // Use canonical validation with default security options
  return utilsIsValidUrl(urlString)
}

/**
 * Sanitizes a URL by ensuring it's valid and safe
 * @param urlString - The URL to sanitize
 * @returns The sanitized URL or a safe fallback
 */
export function sanitizeUrl(urlString: string): string {
  // Use canonical sanitization
  return utilsSanitizeUrl(urlString)
}

/**
 * Extracts domain from a URL safely
 */
export function getDomain(url: string): string {
  // Use canonical domain extraction
  return utilsGetDomain(url)
}
