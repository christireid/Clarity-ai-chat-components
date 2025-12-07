/**
 * Core Exports - Essential APIs Only
 *
 * This file exports only the most essential APIs for a simpler import experience.
 * Use this if you want to import just the basics without the full library.
 *
 * @example
 * ```tsx
 * import { ClarityChat } from '@clarity-chat/react/core'
 * ```
 *
 * @fileoverview Core essential APIs
 */
// Main high-level component
export { ClarityChat } from './components/clarity-chat';
export { ClarityChatSimple } from './components/clarity-chat-simple';
// Main hook
export { useClarityChat, } from './hooks/use-clarity-chat';
// Core components
export { ChatWindow } from './components/chat-window';
export { ChatInput } from './components/chat-input';
export { MessageList } from './components/message-list';
// Core utilities
export { convertCoreMessagesToMessages, convertMessagesToCoreMessages, } from './utils/message-conversion';
// Error handling
export { ErrorBoundary } from './components/error-boundary';
// Composed hooks
export { useChatWithOperations, } from './hooks/use-chat-with-operations';
// Simplified hook
export { useChatSimple, } from './hooks/use-chat-simple';
// Memory store factory
export { createMemoryStore, } from './memory/create-memory-store';
//# sourceMappingURL=core.js.map