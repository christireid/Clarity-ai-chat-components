'use client'

/**
 * @clarity-chat/react - Core Package (Essential Components)
 *
 * The essential, easy-to-understand library for 90% of use cases.
 * Simple by default, comprehensive when needed.
 *
 * **Core Package** (you're here - essential 15 exports):
 * ```tsx
 * import { ClarityChatApp, useClarityChat } from '@clarity-chat/react'
 *
 * // Streaming chat in 3 minutes
 * export default function ChatPage() {
 *   return <ClarityChatApp api="/api/chat" />
 * }
 * ```
 *
 * **Extended Package** (comprehensive library - all necessary components):
 * ```tsx
 * import { CommandPaletteEnhanced, TokenOptimizationDashboard } from '@clarity-chat/react/extended'
 * ```
 *
 * **Advanced Package** (power users - specialized features):
 * ```tsx
 * import { optimizePrompt, useClarityObject } from '@clarity-chat/react/advanced'
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

// 6. Streaming Components - Real-time streaming UI
export { StreamingMessage } from './components/message/StreamingMessage'
export type { StreamingMessageProps } from './components/message/StreamingMessage'
export { StreamStatusProgress as StreamingProgress } from './components/ai/StreamingProgress'
export type { StreamStatusProgressProps as StreamingProgressProps } from './components/ai/StreamingProgress'

// 7. Token Optimization - Usage tracking and cost preview
export { TokenUsageMeter } from './components/token/TokenUsageMeter'
export type { TokenUsageMeterProps } from './components/token/TokenUsageMeter'
export { TokenBudgetBar } from './components/token/TokenBudgetBar'
export type { TokenBudgetBarProps } from './components/token/TokenBudgetBar'
export { useTokenBudget } from './prompt/hooks/use-token-budget'

// 8. Memory Features - Conversation memory and feedback
export { MemoryActivityIndicator } from './components/memory/MemoryActivityIndicator'
export type { MemoryActivityIndicatorProps } from './components/memory/MemoryActivityIndicator'
export { useMemoryFeedback } from './hooks/memory/use-memory-feedback'

// 8.5. Toast/Notification System
export { useToast, type ToastContextValue } from './hooks/ui/use-toast'

// 8.6. Additional Hooks
export {
  useStreaming,
  type UseStreamingOptions,
  type UseStreamingReturn,
} from './hooks/streaming/use-streaming'
export { useThrottledCallback } from './hooks/ui/use-throttle'
export {
  useLocalStorage,
  type UseLocalStorageOptions,
} from './hooks/storage/use-local-storage'
export {
  useAutoScroll,
  type UseAutoScrollOptions,
  type UseAutoScrollReturn,
} from './hooks/ui/use-auto-scroll'
export { useReducedMotion } from './hooks/ui/use-reduced-motion'
export {
  useClipboard,
  type UseClipboardOptions,
  type UseClipboardReturn,
} from './hooks/ui/use-clipboard'

// 8.7. Message Components
export {
  TypingIndicator,
  type TypingIndicatorProps,
  type TypingIndicatorVariant,
} from './components/message/TypingIndicator'

// 9. Command Palette - Quick actions and navigation
export { CommandPalette } from './components/navigation/CommandPalette'
export type { CommandPaletteProps } from './components/navigation/CommandPalette'

// 10. Search - Conversation search and filtering
export { SearchFiltersPanel } from './components/search/components/SearchFiltersPanel'
export type { SearchFiltersPanelProps } from './components/search/components/SearchFiltersPanel'

// 11. Prompts - Prompt library and templates
export { PromptLibrary } from './components/prompt/PromptLibrary'
export type { PromptLibraryProps } from './components/prompt/PromptLibrary'
export { TemplateMarketplace } from './components/prompt/TemplateMarketplace'
export type { TemplateMarketplaceProps } from './components/prompt/TemplateMarketplace'

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
// CORE API COMPLETE
// ============================================================================
// Essential components and hooks for 90% of use cases:
// - Chat: ClarityChatApp, MessageList, ChatInput
// - Streaming: StreamingMessage, StreamingProgress
// - Token Management: TokenUsageMeter, TokenBudgetBar, useTokenBudget
// - Memory: MemoryActivityIndicator, useMemoryFeedback
// - Navigation: CommandPalette
// - Search: SearchFiltersPanel
// - Prompts: PromptLibrary, TemplateMarketplace
// - Rendering: MarkdownRenderer

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
