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

// ============================================================================
// STREAMING HOOKS (Advanced)
// ============================================================================
export * from './hooks/streaming'

// ============================================================================
// RESILIENCE HOOKS (AI-Ops)
// ============================================================================
export * from './hooks/resilience'

// ============================================================================
// ADAPTERS (Model-specific)
// ============================================================================
export * from './adapters'

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
// ADVANCED HOOKS
// ============================================================================
export * from './hooks/performance'
export * from './hooks/dashboard'
export * from './hooks/security'

// ============================================================================
// VECTOR STORES & EMBEDDINGS
// ============================================================================
export * from './vector-stores'
export * from './embeddings'

// ============================================================================
// DOCUMENT LOADERS
// ============================================================================
export * from './document-loaders'

// ============================================================================
// PROMPT SYSTEM
// ============================================================================
export * from './prompts'
export * from './prompt'

// ============================================================================
// SAFETY & SECURITY
// ============================================================================
export * from './safety'
export * from './security'

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
export {
  createAgent,
  type Agent,
  type Tool,
  type AgentExecution,
} from './agents'

// ============================================================================
// MESSAGE UTILITIES
// ============================================================================
export {
  convertCoreMessageToMessage,
  convertMessageToCoreMessage,
  convertCoreMessagesToMessages,
  convertMessagesToCoreMessages,
} from './utils/message'

// ============================================================================
// TOKEN OPTIMIZATION (Advanced)
// ============================================================================
export * from './hooks/token'
export * from './utils/optimization'
export {
  PromptCacheManager,
  createAnthropicCachedMessages,
  estimateCacheSavings,
} from './utils/prompt-caching'
export * from './utils/toon'

// ============================================================================
// ADDITIONAL UTILITIES
// ============================================================================
export * from './utils/mobile'
export * from './utils/search'
export * from './utils/api'
export * from './utils/resilience'
export * from './utils/config'
export * from './utils/security'
export * from './utils/tools'
export * from './utils/streaming'

// ============================================================================
// TEMPLATES
// ============================================================================
export * from './templates'

// ============================================================================
// ERROR SYSTEM
// ============================================================================
export * from './error'

// ============================================================================
// ALL COMPONENT DOMAINS
// ============================================================================
export * from './components/message'
export * from './components/chat'
export * from './components/input'
export * from './components/search'
export * from './components/token'
export * from './components/theme-components'
export * from './components/navigation'
export * from './components/conversation'
export * from './components/feedback'
export * from './components/media'
export * from './components/ui'
export * from './components/ai'
export * from './components/prompt'
export * from './components/context'
export * from './components/code'

// ============================================================================
// ALL HOOK DOMAINS
// ============================================================================
export * from './hooks/ui'
export * from './hooks/keyboard'
export * from './hooks/storage'
export * from './hooks/theme'
export * from './hooks/input'
export * from './hooks/context'
export * from './hooks/model'
export * from './hooks/message'
export * from './hooks/chat'

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================
export * from './animations'

// ============================================================================
// ACCESSIBILITY
// ============================================================================
export * from './accessibility'

// ============================================================================
// ALL TYPES
// ============================================================================
export * from './types/chat-types'
export * from './types/clarity-chat-types'
export * from './types/tool-result-types'
