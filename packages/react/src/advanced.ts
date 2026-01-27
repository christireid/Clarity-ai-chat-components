/**
 * @clarity-chat/react/advanced - Advanced Features
 *
 * Power-user exports for specialized use cases.
 * Most users should use @clarity-chat/react (core) or @clarity-chat/react/extended.
 *
 * @example
 * ```tsx
 * import { optimizePrompt, useClarityObject } from '@clarity-chat/react/advanced'
 * ```
 *
 * @packageDocumentation
 */

'use client'

// ============================================================================
// ADVANCED COMPONENTS (For power users)
// ============================================================================

// Prompt Engineering (Advanced)
export { PromptVariablesEditor } from './components/prompt/PromptVariablesEditor'
export { CommandPaletteEnhanced } from './components/navigation/CommandPaletteEnhanced'

// Memory Components (Advanced)
export { MemoryInspector } from './components/context/MemoryInspector'

// Advanced Chat Components
export { ConversationTimeline } from './components/conversation/ConversationTimeline'
export { MessageThreadView } from './components/message/MessageThreadView'

// Token Optimization (Advanced)
export { TokenOptimizationPanel } from './components/token/TokenOptimizationPanel'
export { TokenOptimizationDashboard } from './components/token/TokenOptimizationDashboard'
export { TokenCostPreview } from './components/token/TokenCostPreview'

// ============================================================================
// ADVANCED HOOKS (For complex state management)
// ============================================================================

// Prompt Engineering
export { usePromptRecipe } from './prompt/hooks/use-prompt-recipe'

// Tool Integration
export { useClarityChatWithTools } from './hooks/chat/use-clarity-chat-with-tools'
export { useClarityObject } from './hooks/chat/use-clarity-object'

// ============================================================================
// ADVANCED UTILITIES (For custom implementations)
// ============================================================================

// Prompt Building
export { buildModelPrompt } from './prompt/core/builder'
export { optimizePrompt } from './prompt/core/engine/prompt-optimizer'

// Tool Execution
export {
  executeWithRetry,
  executeWithFallback,
  executeWithTimeout,
  executeWithLogging,
  executeWithAll,
} from './utils/tool-execution'

// ============================================================================
// ADVANCED TYPES
// ============================================================================

export type { PromptRecipe } from './prompt/core/recipe'

export type { TokenBudgetConfig } from './utils/tokenization/token-budget-validator'

export type {
  UseClarityChatWithToolsOptions,
  UseClarityChatWithToolsReturn,
} from './hooks/chat/use-clarity-chat-with-tools'

export type {
  UseClarityObjectOptions,
  UseClarityObjectReturn,
} from './hooks/chat/use-clarity-object'
