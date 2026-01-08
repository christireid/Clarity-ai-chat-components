/**
 * @clarity-chat/react/slim - Minimal bundle entry point
 *
 * This entry point provides only the essential components and hooks
 * for basic chat functionality, resulting in a significantly smaller
 * bundle size (~200KB vs ~3MB for the full package).
 *
 * Use this when you only need:
 * - Drop-in ClarityChat component
 * - Core useClarityChat hook
 *
 * @example
 * ```tsx
 * import { ClarityChat } from '@clarity-chat/react/slim'
 * import '@clarity-chat/react/styles.css'
 *
 * function App() {
 *   return <ClarityChat api="/api/chat" />
 * }
 * ```
 *
 * @example
 * ```tsx
 * import { useClarityChat } from '@clarity-chat/react/slim'
 *
 * function ChatPage() {
 *   const { messages, append, isLoading } = useClarityChat({ api: '/api/chat' })
 *   // ...
 * }
 * ```
 *
 * @packageDocumentation
 */
// ============================================================================
// CORE COMPONENTS - Drop-in chat UI
// ============================================================================
export { ClarityChat, } from './components/chat/clarity-chat';
export { ChatWindow } from './components/chat/chat-window';
export { ChatInput } from './components/chat/chat-input';
export { default as MessageList, } from './components/chat/virtualized-message-list';
export { Message } from './components/message/message';
// ============================================================================
// CORE HOOKS - Essential chat state management
// ============================================================================
export { useChat, } from './hooks/chat/use-chat-unified';
export { useClarityChat, } from './hooks/chat/use-clarity-chat';
export { useChatHandlers, } from './hooks/chat/use-chat-handlers';
// ============================================================================
// UTILITIES - Message conversion helpers
// ============================================================================
export { convertCoreMessagesToMessages } from './utils/message/message-conversion';
//# sourceMappingURL=slim.js.map