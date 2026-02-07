/**
 * @clarity-chat/react - Namespaced Exports
 *
 * This module provides a cleaner, namespaced API for Clarity Chat.
 * Instead of 200+ flat exports, components and hooks are organized
 * into logical namespaces.
 *
 * @example
 * ```tsx
 * import { Clarity } from '@clarity-chat/react/namespaced'
 *
 * // Components
 * <Clarity.Chat api="/api/chat" />
 * <Clarity.Window messages={messages} />
 * <Clarity.Input onSend={handleSend} />
 *
 * // Hooks
 * const chat = Clarity.hooks.useChat({ api: '/api/chat' })
 * const handlers = Clarity.hooks.useChatHandlers({ chat })
 *
 * // Types
 * type Props = Clarity.types.ClarityChatProps
 * ```
 *
 * @packageDocumentation
 */

// Import components
import {
  ClarityChat,
  type ClarityChatProps,
} from './components/chat/ClarityChat'
import { ChatWindow, type ChatWindowProps } from './components/chat/ChatWindow'
import { ChatInput, type ChatInputProps } from './components/chat/ChatInput'
/** @deprecated Use TanStackMessageList instead. See CODE_REUSE_AUDIT.md P0-12 */
import MessageList, {
  type MessageListProps,
} from './components/chat/VirtualizedMessageList'
import {
  TanStackMessageList,
  type TanStackMessageListProps,
} from './components/chat/tanstack-message-list'
import { Message, type MessageProps } from './components/message/message'
import { ThinkingIndicator } from './components/message/ThinkingIndicator'
import {
  PromptSuggestions,
  type PromptSuggestion,
} from './components/prompt/PromptSuggestions'

// Import hooks
import {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from './hooks/use-clarity-chat'
import {
  useChatHandlers,
  type UseChatHandlersOptions,
  type ChatHandlers,
} from './hooks/chat/use-chat-handlers'
import { useKeyboardShortcuts } from './hooks/keyboard/use-keyboard-shortcuts'
import { useChatHistory } from './hooks/chat/use-chat-history'

// Import types
import type {
  CoreMessage,
  CoreMessageContent,
  MessageRole,
} from './hooks/chat/use-chat-enhanced'
import type { Message as MessageType, AIStatus } from '@clarity-chat/types'

// Import utilities
import { convertCoreMessagesToMessages } from './utils/message/message-conversion'

/**
 * Namespaced hooks for chat functionality
 */
export const hooks = {
  /** Primary chat hook with all options - replaces deprecated useChat */
  useClarityChat,
  /** Pre-configured handlers for ChatWindow */
  useChatHandlers,
  /** Keyboard shortcuts hook */
  useKeyboardShortcuts,
  /** Chat history management */
  useChatHistory,
} as const

/**
 * Namespaced type definitions
 */
export const types = {
  // Re-export for namespace access - types are accessed via Clarity.types.X
} as const

// Type exports for TypeScript consumers
export type {
  // Component props
  ClarityChatProps,
  ChatWindowProps,
  ChatInputProps,
  MessageListProps,
  TanStackMessageListProps,
  MessageProps,
  PromptSuggestion,
  // Hook options and returns (UseChatOptions/UseChatReturn removed in v2.0)
  UseClarityChatOptions,
  UseClarityChatReturn,
  UseChatHandlersOptions,
  ChatHandlers,
  // Core types
  CoreMessage,
  CoreMessageContent,
  MessageRole,
  MessageType,
  AIStatus,
}

/**
 * Namespaced utilities
 */
export const utils = {
  /** Convert CoreMessage[] to Message[] for display */
  convertCoreMessagesToMessages,
} as const

/**
 * Clarity - Namespaced API for Clarity Chat
 *
 * Provides a cleaner, organized API structure:
 * - `Clarity.Chat` - Drop-in chat component
 * - `Clarity.Window` - Chat window component
 * - `Clarity.Input` - Chat input component
 * - `Clarity.hooks.*` - All chat hooks
 * - `Clarity.utils.*` - Utility functions
 *
 * @example
 * ```tsx
 * import { Clarity } from '@clarity-chat/react/namespaced'
 *
 * function App() {
 *   return <Clarity.Chat api="/api/chat" />
 * }
 * ```
 */
export const Clarity = {
  // Core drop-in component
  Chat: ClarityChat,

  // Mid-level components
  Window: ChatWindow,
  Input: ChatInput,
  /** @deprecated Use TanStackMessages instead. See CODE_REUSE_AUDIT.md P0-12 */
  Messages: MessageList,
  TanStackMessages: TanStackMessageList,
  Message: Message,

  // UI components
  ThinkingIndicator,
  PromptSuggestions,

  // Hooks namespace
  hooks,

  // Utils namespace
  utils,
} as const

// Default export for convenient usage
export default Clarity
