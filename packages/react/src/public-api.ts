'use client'

/**
 * @clarity-chat/react - Minimal Public API
 *
 * This is the ONLY public API surface. Everything else is internal.
 *
 * **Philosophy**: Ship 10 exports that cover 90% of use cases.
 * Everything else lives in subpath exports for advanced users.
 *
 * **Basic Usage** (covers 90% of cases):
 * ```tsx
 * import { ClarityChatApp, useClarityChat } from '@clarity-chat/react'
 *
 * // Streaming chat in 3 minutes
 * export default function ChatPage() {
 *   return <ClarityChatApp api="/api/chat" />
 * }
 * ```
 *
 * **Advanced Usage** (power users only):
 * ```tsx
 * import { PromptLibrary } from '@clarity-chat/react/advanced'
 * import { TokenOptimizer } from '@clarity-chat/react/enterprise'
 * ```
 *
 * @packageDocumentation
 */

// ============================================================================
// CORE API (10-15 exports - what 90% of users need)
// ============================================================================

// 1. Primary Component - Drop-in chat interface
export { ClarityChatApp } from './app-api'
export type { ClarityChatAppProps } from './app-api'

// 2. Primary Hook - Full-featured chat state management
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from './hooks/use-clarity-chat'

// 3. Message List - Virtualized, accessible message display
export { VirtualizedMessageList as MessageList } from './components/chat/VirtualizedMessageList'
export type { VirtualizedMessageListProps as MessageListProps } from './components/chat/VirtualizedMessageList'

// 4. Chat Input - Feature-rich input component
export { ChatInput } from './components/chat/ChatInput'
export type { ChatInputProps } from './components/chat/ChatInput'

// 5. Markdown Renderer - Enhanced markdown with syntax highlighting
export { EnhancedMarkdownRenderer as MarkdownRenderer } from './components/ai/EnhancedMarkdownRenderer'
export type { EnhancedMarkdownRendererProps as MarkdownRendererProps } from './components/ai/EnhancedMarkdownRenderer'

// ============================================================================
// CORE TYPES (Essential type definitions from @clarity-chat/types)
// ============================================================================

// Message types - What messages look like
export type {
  Message,
  MessageRole,
  MessageMetadata,
  StreamMessage,
} from '@clarity-chat/types'

// ============================================================================
// UTILITIES (Re-export from primitives)
// ============================================================================

// cn() - Classname merging utility (from primitives package)
export { cn } from '@clarity-chat/primitives'

// ============================================================================
// THAT'S IT - 13 EXPORTS TOTAL
// ============================================================================

/**
 * For advanced features, use subpath imports:
 *
 * @example Token Management
 * ```tsx
 * import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
 * ```
 *
 * @example Memory Features
 * ```tsx
 * import { useMemory } from '@clarity-chat/memory'
 * ```
 *
 * @example Advanced Utilities
 * ```tsx
 * import { formatBytes, retry } from '@clarity-chat/utils'
 * ```
 *
 * @example Error Handling
 * ```tsx
 * import { ErrorBoundary } from '@clarity-chat/error-handling'
 * ```
 */
