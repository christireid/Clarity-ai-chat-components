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
import { ClarityChat, } from './components/chat/clarity-chat';
import { ChatWindow } from './components/chat/chat-window';
import { ChatInput } from './components/chat/chat-input';
import MessageList, {} from './components/chat/virtualized-message-list';
import { Message } from './components/message/message';
import { ThinkingIndicator } from './components/message/thinking-indicator';
import { PromptSuggestions, } from './components/prompt/prompt-suggestions';
// Import hooks
import { useChat, } from './hooks/chat/use-chat-unified';
import { useClarityChat, } from './hooks/chat/use-clarity-chat';
import { useChatHandlers, } from './hooks/chat/use-chat-handlers';
import { useKeyboardShortcuts } from './hooks/keyboard/use-keyboard-shortcuts';
import { useChatHistory } from './hooks/chat/use-chat-history';
// Import utilities
import { convertCoreMessagesToMessages } from './utils/message/message-conversion';
/**
 * Namespaced hooks for chat functionality
 */
export const hooks = {
    /** Simplified chat hook with sensible defaults */
    useChat,
    /** Full-featured chat hook with all options */
    useClarityChat,
    /** Pre-configured handlers for ChatWindow */
    useChatHandlers,
    /** Keyboard shortcuts hook */
    useKeyboardShortcuts,
    /** Chat history management */
    useChatHistory,
};
/**
 * Namespaced type definitions
 */
export const types = {
// Re-export for namespace access - types are accessed via Clarity.types.X
};
/**
 * Namespaced utilities
 */
export const utils = {
    /** Convert CoreMessage[] to Message[] for display */
    convertCoreMessagesToMessages,
};
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
    Messages: MessageList,
    Message: Message,
    // UI components
    ThinkingIndicator,
    PromptSuggestions,
    // Hooks namespace
    hooks,
    // Utils namespace
    utils,
};
// Default export for convenient usage
export default Clarity;
//# sourceMappingURL=namespaced.js.map