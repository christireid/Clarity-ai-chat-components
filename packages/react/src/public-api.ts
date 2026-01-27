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
 * import { ClarityChatApp, Message } from '@clarity-chat/react'
 *
 * // Streaming chat in 3 minutes
 * <ClarityChatApp api="/api/chat" />
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
} from './hooks/use-clarity-chat/use-clarity-chat'

// 3. Message List - Virtualized, accessible message display
export { VirtualizedMessageList as MessageList } from './components/chat/VirtualizedMessageList'
export type { VirtualizedMessageListProps as MessageListProps } from './components/chat/VirtualizedMessageList'

// 4. Chat Input - Feature-rich input component
export { ChatInput } from './components/input/ChatInput'
export type { ChatInputProps } from './components/input/ChatInput'

// 5. Markdown Renderer - The one true markdown renderer
export { EnhancedMarkdownRenderer as MarkdownRenderer } from './components/ai/EnhancedMarkdownRenderer'
export type { EnhancedMarkdownRendererProps as MarkdownRendererProps } from './components/ai/EnhancedMarkdownRenderer'

// ============================================================================
// CORE TYPES (Essential type definitions)
// ============================================================================

// Message types - What messages look like
export type {
  Message,
  UserMessage,
  AssistantMessage,
  SystemMessage,
  MessageRole,
  MessageId,
  ToolInvocation,
  ToolResult,
} from '@clarity-chat/types'

// Config types - How to configure the chat
export type { ChatConfig, ChatFeatures, ChatPreset } from './types/config'

// ============================================================================
// UTILITIES (2 genuinely useful utilities)
// ============================================================================

// 1. cn() - The only utility that matters (classname merging)
export { cn } from './utils/cn'

// 2. Message creators - Type-safe message creation
export {
  createUserMessage,
  createAssistantMessage,
  createSystemMessage,
} from './utils/message-utils'

// ============================================================================
// THAT'S IT - EVERYTHING ELSE IS ADVANCED/ENTERPRISE/INTERNAL
// ============================================================================

/**
 * For advanced features, use subpath imports:
 *
 * @example Token Management
 * ```tsx
 * import { AccurateTokenCounter } from '@clarity-chat/react/token-optimization'
 * ```
 *
 * @example Memory Features
 * ```tsx
 * import { MemoryPanel } from '@clarity-chat/react/memory'
 * ```
 *
 * @example Prompt Engineering
 * ```tsx
 * import { PromptLibrary } from '@clarity-chat/react/advanced'
 * ```
 *
 * @example Enterprise Features
 * ```tsx
 * import { SecurityAudit } from '@clarity-chat/react/enterprise'
 * ```
 */
