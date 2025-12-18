'use client'

/**
 * @clarity-chat/react/internal
 *
 * INTERNAL EXPORTS - NOT PART OF PUBLIC API
 *
 * These exports are provided for advanced use cases only.
 * They may change without notice between minor versions.
 *
 * For stable APIs, use the main '@clarity-chat/react' import.
 *
 * @internal
 */

// Re-export everything from public API
export * from './public-api'

// ============================================================================
// INTERNAL UTILITIES (Development warnings, debug, assertions)
// ============================================================================
export * from './internal/index'

// ============================================================================
// STREAMING HOOKS (Advanced)
// ============================================================================
export * from './hooks/streaming'

// ============================================================================
// RESILIENCE HOOKS (AI-Ops)
// ============================================================================
export * from './hooks/resilience'

// ============================================================================
// ANALYTICS & OBSERVABILITY
// ============================================================================
export * from './analytics'
export * from './observability'

// ============================================================================
// ENTERPRISE FEATURES
// ============================================================================
export * from './quotas'
export * from './rbac'
export * from './multi-tenancy'
export * from './audit'
export * from './webhooks'

// ============================================================================
// ADVANCED COMPONENTS
// ============================================================================
export * from './components/dashboards'
export * from './components/ai-ops'
export * from './components/enterprise'
export * from './components/ab-testing'
export * from './components/pro'

// ============================================================================
// VECTOR STORES & EMBEDDINGS
// ============================================================================
export * from './vector-stores'

// ============================================================================
// RERANKING
// ============================================================================
export * from './reranking'

// ============================================================================
// PLUGIN & EXTENSION SYSTEM
// ============================================================================
export * from './plugins'
export * from './extensions'

// ============================================================================
// AGENTS & TOOLS
// ============================================================================
export * from './agents/tool-ui-registry'

// ============================================================================
// TEMPLATES
// ============================================================================
export * from './templates'

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================
export * from './animations'
