'use client'

/**
 * @clarity-chat/react
 *
 * Premium AI Chat Components for React
 *
 * Quick Start (NEW - Recommended):
 * ```tsx
 * import { ClarityChatApp } from '@clarity-chat/react'
 *
 * // Basic usage - streaming chat in 3 minutes
 * <ClarityChatApp api="/api/chat" />
 *
 * // With memory enabled (one flag)
 * <ClarityChatApp api="/api/chat" features={{ memory: true }} />
 *
 * // Enterprise preset with all features
 * <ClarityChatApp api="/api/chat" preset="enterprise" />
 * ```
 *
 * Legacy Quick Start:
 * ```tsx
 * import { initializeClarity, ClarityChat } from '@clarity-chat/react'
 *
 * // Initialize once at app startup
 * initializeClarity({ license: process.env.CLARITY_LICENSE })
 *
 * // Use the component
 * <ClarityChat api="/api/chat" />
 * ```
 *
 * For advanced features, import from '@clarity-chat/react/internal'
 *
 * @packageDocumentation
 */

// Initialize license check in production
import { checkLicense } from './utils/license'
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'development') {
  checkLicense(process.env.CLARITY_LICENSE_KEY)
}

// Export the new unified App API (recommended)
export * from './app-api'

// Export the curated public API (legacy, still supported)
export * from './public-api'
