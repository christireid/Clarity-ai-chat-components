/**
 * @clarity-chat/react
 *
 * Premium AI Chat Components for React
 *
 * Note: Individual component files contain 'use client' directives.
 * This barrel export file intentionally omits the directive to avoid
 * bundling issues with tsup/esbuild.
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

// Export the new unified App API (recommended)
export * from './app-api'

// Export the curated public API (legacy, still supported)
export * from './public-api'
