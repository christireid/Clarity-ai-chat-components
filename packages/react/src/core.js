'use client';
/**
 * @clarity-chat/react/core - Minimal Bundle Entry Point
 *
 * This file exports only the most essential APIs for a minimal bundle size.
 * Use this entry point when you want just the basics without the full library.
 *
 * Bundle size: ~30% smaller than the full library
 *
 * ## When to Use
 *
 * Use this entry point when:
 * - You only need basic chat functionality
 * - Bundle size is critical (e.g., mobile apps)
 * - You'll add features incrementally
 *
 * ## What's Included
 *
 * - Core Components: ClarityChat, ChatWindow, ChatInput, MessageList
 * - Primary Hook: useClarityChat
 * - Essential Types: Message, MessageRole
 * - Error Handling: ErrorBoundary, ChatWithErrorBoundary
 * - Memory: createMemoryStore
 *
 * @example
 * ```tsx
 * import { ClarityChat, useClarityChat } from '@clarity-chat/react/core'
 *
 * function App() {
 *   return <ClarityChat api="/api/chat" />
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Start minimal, add features as needed from main package
 * import { ClarityChat } from '@clarity-chat/react/core'
 * import { TokenBudgetProvider } from '@clarity-chat/react'
 * ```
 *
 * @packageDocumentation
 */
// Main high-level component
export { ClarityChat, } from './components/chat/clarity-chat';
export { ClarityChatSimple, } from './components/chat/clarity-chat-simple';
// Types are exported above with their components
// =============================================================================
// PRIMARY HOOK
// =============================================================================
/**
 * Primary chat state management hook
 */
export { useClarityChat, } from './hooks/chat/use-clarity-chat';
// Core components
export { ChatWindow } from './components/chat/chat-window';
export { ChatInput } from './components/chat/chat-input';
export { MessageList } from './components/message/message-list';
// =============================================================================
// MESSAGE UTILITIES
// =============================================================================
/**
 * Message conversion utilities
 */
export { convertCoreMessagesToMessages, convertMessagesToCoreMessages, } from './utils/message/message-conversion';
// Error handling
export { ErrorBoundary } from './components/feedback/error-boundary';
export { ChatWithErrorBoundary, } from './components/chat/chat-with-error-boundary';
// =============================================================================
// MEMORY
// =============================================================================
/**
 * Memory store factory for conversation persistence
 */
export { createMemoryStore, } from './memory/create-memory-store';
//# sourceMappingURL=core.js.map