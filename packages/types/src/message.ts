/**
 * Message-related type definitions
 */

export type MessageRole = 'user' | 'assistant' | 'system'

export type MessageStatus =
  | 'pending'
  | 'sending'
  | 'sent'
  | 'streaming'
  | 'error'

export type FeedbackType = 'up' | 'down'

export interface MessageMetadata {
  tokens?: number
  model?: string
  processingTime?: number
  cost?: number
  sources?: string[]
  [key: string]: any
}

export interface MessageAttachment {
  id: string
  type: 'image' | 'video' | 'document' | 'audio' | 'link'
  url: string
  name: string
  size?: number
  mimeType?: string
  thumbnail?: string
}

export interface MessageFeedback {
  type: FeedbackType
  timestamp: Date
  comment?: string
}

export interface Message {
  id: string
  chatId: string
  role: MessageRole
  content: string
  status: MessageStatus
  attachments?: MessageAttachment[]
  metadata?: MessageMetadata
  feedback?: MessageFeedback
  createdAt: Date
  updatedAt: Date
  editHistory?: MessageEdit[]
}

export interface MessageEdit {
  content: string
  timestamp: Date
}

export interface StreamingMessage extends Omit<Message, 'content'> {
  content: string
  delta?: string
  isComplete: boolean
}

export interface MessageAction {
  id: string
  label: string
  icon?: string
  onClick: (message: Message) => void
  condition?: (message: Message) => boolean
}

/**
 * StreamMessage - Client-side message type optimized for streaming UIs
 *
 * This type is designed for use in chat interfaces where messages are
 * streamed in real-time. It has optional fields to accommodate both
 * the streaming phase and the final state.
 *
 * @example
 * ```typescript
 * const message: StreamMessage = {
 *   id: '1',
 *   role: 'assistant',
 *   content: 'Hello...',
 *   isStreaming: true,
 *   status: 'sending',
 * }
 * ```
 */
export interface StreamMessage {
  /** Unique message identifier */
  id: string
  /** Optional chat/conversation identifier */
  chatId?: string
  /** Message sender role */
  role: MessageRole
  /** Message text content */
  content: string
  /** When the message was created */
  createdAt?: Date
  /** When the message was last updated */
  updatedAt?: Date
  /** Current message status */
  status?: 'sending' | 'sent' | 'error'
  /** Unix timestamp (milliseconds) - alternative to createdAt */
  timestamp?: number
  /** Whether the message is currently being streamed */
  isStreaming?: boolean
}
