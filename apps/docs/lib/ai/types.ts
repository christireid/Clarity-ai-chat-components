/**
 * AI API Shared Types and Utilities
 *
 * Shared types, constants, and utilities for the AI documentation APIs.
 * These APIs are designed to be consumed by AI systems for RAG and indexing.
 */

// =============================================================================
// Constants
// =============================================================================

export const AI_API_VERSION = 'v1'
export const BASE_URL = 'https://clarity-chat.dev'
export const PACKAGE_VERSION = '0.1.0'

// Rate limiting headers (informational only - actual rate limiting requires middleware)
export const RATE_LIMIT_HEADERS = {
  'X-RateLimit-Limit': '100',
  'X-RateLimit-Window': '60',
} as const

// CORS headers for external API consumers
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
} as const

// Cache headers for optimal performance
export const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
} as const

// Combined headers for API responses
export const API_RESPONSE_HEADERS = {
  'Content-Type': 'application/json',
  ...CORS_HEADERS,
  ...CACHE_HEADERS,
  ...RATE_LIMIT_HEADERS,
} as const

// =============================================================================
// Component Types
// =============================================================================

export interface PropInfo {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
}

export interface ComponentInfo {
  name: string
  description: string
  category: ComponentCategory
  props: PropInfo[]
  importPath: string
  docsUrl: string
  examples: string[]
  relatedComponents: string[]
  accessibility: string[]
  version: string
}

export type ComponentCategory =
  | 'core'
  | 'ui'
  | 'feedback'
  | 'input'
  | 'display'
  | 'analytics'
  | 'enterprise'
  | 'layout'
  | 'general'

export interface ComponentsAPIResponse {
  name: string
  version: string
  apiVersion: string
  description: string
  totalComponents: number
  categories: ComponentCategory[]
  lastUpdated: string
  components: ComponentInfo[]
  usage: {
    installation: string
    basicImport: string
    documentation: string
  }
}

// =============================================================================
// Hook Types
// =============================================================================

export interface ParameterInfo {
  name: string
  type: string
  required: boolean
  description: string
}

export interface ReturnPropertyInfo {
  name: string
  type: string
  description: string
}

export interface ReturnInfo {
  type: string
  properties: ReturnPropertyInfo[]
}

export interface HookInfo {
  name: string
  description: string
  category: HookCategory
  signature: string
  parameters: ParameterInfo[]
  returns: ReturnInfo
  importPath: string
  docsUrl: string
  examples: string[]
  relatedHooks: string[]
  version: string
  deprecated?: boolean
}

export type HookCategory =
  | 'core'
  | 'ui'
  | 'utility'
  | 'storage'
  | 'accessibility'
  | 'input'
  | 'analytics'
  | 'error-handling'
  | 'chat'
  | 'streaming'
  | 'optimization'
  | 'persistence'
  | 'general'

export interface HooksAPIResponse {
  name: string
  version: string
  apiVersion: string
  description: string
  totalHooks: number
  categories: HookCategory[]
  lastUpdated: string
  hooks: HookInfo[]
  usage: {
    installation: string
    basicImport: string
    documentation: string
  }
}

// =============================================================================
// Search Types
// =============================================================================

export type SearchItemType =
  | 'component'
  | 'hook'
  | 'guide'
  | 'example'
  | 'cookbook'
  | 'concept'
  | 'deployment'
  | 'integration'

export const VALID_SEARCH_TYPES: SearchItemType[] = [
  'component',
  'hook',
  'guide',
  'example',
  'cookbook',
  'concept',
  'deployment',
  'integration',
]

export interface EnhancedSearchItem {
  title: string
  type: SearchItemType
  href: string
  fullUrl: string
  description: string
  category: string
  keywords: string[]
  lastUpdated: string
}

export interface SearchAPIResponse {
  name: string
  version: string
  apiVersion: string
  query: string | null
  filters: {
    type: string | null
    category: string | null
  }
  totalResults: number
  results: EnhancedSearchItem[]
  availableTypes: SearchItemType[]
  availableCategories: string[]
  usage: {
    searchByQuery: string
    filterByType: string
    filterByCategory: string
    combineFilters: string
  }
}

// =============================================================================
// Error Types
// =============================================================================

export interface APIErrorResponse {
  error: {
    code: string
    message: string
    details?: string
  }
  timestamp: string
  path: string
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  code: string,
  message: string,
  path: string,
  details?: string
): APIErrorResponse {
  return {
    error: {
      code,
      message,
      ...(details && { details }),
    },
    timestamp: new Date().toISOString(),
    path,
  }
}

/**
 * Validates search query parameters
 */
export function validateSearchParams(params: URLSearchParams): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  const query = params.get('q')
  const type = params.get('type')
  const limit = params.get('limit')

  // Query length validation
  if (query && query.length > 200) {
    errors.push('Query parameter "q" must not exceed 200 characters')
  }

  // Type validation
  const validTypes: SearchItemType[] = [
    'component',
    'hook',
    'guide',
    'example',
    'cookbook',
    'concept',
    'deployment',
    'integration',
  ]
  if (type && !validTypes.includes(type as SearchItemType)) {
    errors.push(
      `Invalid type "${type}". Must be one of: ${validTypes.join(', ')}`
    )
  }

  // Limit validation
  if (limit) {
    const limitNum = parseInt(limit, 10)
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be a number between 1 and 100')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Gets a stable timestamp for the current build
 * This prevents hydration mismatches by using a fixed date format
 */
export function getStableTimestamp(): string {
  // Use a date that's rounded to the hour to be somewhat fresh but stable
  const now = new Date()
  now.setMinutes(0, 0, 0)
  return now.toISOString()
}
