'use client'

/**
 * @clarity-chat/react
 *
 * Premium AI Chat Components for React
 *
 * Quick Start:
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

// Export the curated public API
export * from './public-api'
