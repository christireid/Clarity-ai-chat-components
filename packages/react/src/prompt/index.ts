/**
 * Prompt & Token Optimization Layer
 * 
 * Optional addon layer for advanced prompt composition and token optimization.
 * Built around the toon prompt DSL.
 * 
 * @example
 * ```tsx
 * // Enable prompt optimization in useClarityChat
 * const chat = useClarityChat({
 *   api: '/api/chat',
 *   promptOptimization: {
 *     enabled: true,
 *     targetTokens: 4000,
 *     strategy: 'hybrid',
 *   },
 * })
 * ```
 */

// Core utilities (framework-agnostic)
export * from './core'

// React hooks
export * from './hooks'

// Utilities
export * from './utils'
