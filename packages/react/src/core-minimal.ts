/**
 * @clarity-chat/react/core-minimal
 *
 * Ultra-minimal entry point for the most size-sensitive applications.
 * This is a subset of @clarity-chat/react/core.
 *
 * For most applications, use @clarity-chat/react or @clarity-chat/react/core instead.
 *
 * @packageDocumentation
 */

// Core Components (Essential)
export { ChatWindow } from './components/chat/ChatWindow'
export { MessageList } from './components/message/MessageList'
export { Message } from './components/message/message'
export { ChatInput } from './components/chat/ChatInput'

// Core Hook
export { useClarityChat } from './hooks/use-clarity-chat'
export { useAutoScroll } from './hooks/ui/use-auto-scroll'

// Essential Types
export type { Message as MessageType } from '@clarity-chat/types'
