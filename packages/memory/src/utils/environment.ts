/**
 * Environment Detection Utilities
 *
 * Auto-detect runtime environment and provide helpful defaults
 *
 * @deprecated Import environment detection from @clarity-chat/utils/env instead
 */

// Import from canonical source
import { detectEnvironment } from '@clarity-chat/utils/env'
import type { RuntimeEnvironment } from '@clarity-chat/utils/env'

// Re-export for backwards compatibility
export { detectEnvironment }
export type { RuntimeEnvironment }

/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null
  } catch {
    return false
  }
}

/**
 * Check if fetch is available
 */
export function isFetchAvailable(): boolean {
  return typeof fetch !== 'undefined'
}

/**
 * Get recommended storage type for environment
 */
export function getRecommendedStorageType():
  | 'in-memory'
  | 'indexeddb'
  | 'redis'
  | 'postgres' {
  const env = detectEnvironment()

  switch (env) {
    case 'browser':
      return isIndexedDBAvailable() ? 'indexeddb' : 'in-memory'
    case 'serverless':
      return 'in-memory' // Serverless functions are stateless
    case 'node':
      return 'in-memory' // Default, user should configure for production
    default:
      return 'in-memory'
  }
}

/**
 * Get environment-specific recommendations
 */
export function getEnvironmentRecommendations(): {
  storage: string
  embedding: string
  warnings: string[]
} {
  const env = detectEnvironment()
  const recommendations: {
    storage: string
    embedding: string
    warnings: string[]
  } = {
    storage: getRecommendedStorageType(),
    embedding: 'none',
    warnings: [],
  }

  // Storage recommendations
  if (env === 'browser' && !isIndexedDBAvailable()) {
    recommendations.warnings.push(
      'IndexedDB is not available. Using in-memory storage. Data will be lost on page refresh.'
    )
  }

  if (env === 'serverless') {
    recommendations.warnings.push(
      'Serverless environment detected. Consider using Redis or external storage for persistence.'
    )
  }

  // Embedding recommendations
  if (!isFetchAvailable()) {
    recommendations.warnings.push(
      'Fetch API not available. Embedding providers requiring network access will not work.'
    )
  }

  return recommendations
}
