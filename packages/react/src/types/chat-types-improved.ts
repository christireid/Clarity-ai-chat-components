/**
 * Improved TypeScript Types for Better DX
 * 
 * These types provide better autocomplete and type inference
 */

import type { Message } from '@clarity-chat/types'
import type { CoreMessage } from '../hooks/use-chat-enhanced'

/**
 * Message role type with better autocomplete
 */
export type MessageRole = 'user' | 'assistant' | 'system'

/**
 * Message status with better autocomplete
 */
export type MessageStatus = 'sending' | 'sent' | 'streaming' | 'error'

/**
 * Chat configuration with better defaults
 */
export interface ChatConfig {
  /** API endpoint */
  api: string
  /** Chat ID */
  chatId?: string
  /** Enable auto-scroll */
  autoScroll?: boolean
}

/**
 * Message handler types - consistent naming
 */
export interface MessageHandlers {
  /** Called when message is sent */
  onSend?: (content: string) => void | Promise<void>
  /** Called when message is copied */
  onCopy?: (messageId: string, content: string) => void
  /** Called when feedback is given */
  onFeedback?: (messageId: string, type: 'up' | 'down') => void
  /** Called when message is retried */
  onRetry?: (messageId: string) => void
  /** Called when message is edited */
  onEdit?: (messageId: string) => void
  /** Called when message is regenerated */
  onRegenerate?: (messageId: string) => void
  /** Called when message is deleted */
  onDelete?: (messageId: string) => void
}

/**
 * Chat state - simplified state object
 */
export interface ChatState {
  /** Messages */
  messages: Message[]
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: Error | null
  /** Input value */
  input: string
}

/**
 * Chat actions - available actions
 */
export interface ChatActions {
  /** Send a message */
  send: (content: string) => Promise<void>
  /** Set input value */
  setInput: (value: string) => void
  /** Clear all messages */
  clear: () => void
  /** Retry last message */
  retry: () => Promise<void>
}

/**
 * Complete chat interface
 */
export interface Chat extends ChatState, ChatActions {
  /** Full chat object for advanced access */
  chat: {
    messages: CoreMessage[]
    append: (message: CoreMessage) => Promise<void>
    setMessages: (messages: CoreMessage[]) => void
    [key: string]: unknown
  }
}

/**
 * Helper type for component props that accept message handlers
 */
export type WithMessageHandlers<T = {}> = T & MessageHandlers

/**
 * Helper type for component props that accept chat config
 */
export type WithChatConfig<T = {}> = T & ChatConfig

/**
 * Preset type with better inference
 */
export type PresetConfig<T> = {
  [K in keyof T]?: T[K] extends object ? PresetConfig<T[K]> : T[K]
}
