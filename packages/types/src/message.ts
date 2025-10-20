/**
 * Message-related type definitions
 */

export type MessageRole = 'user' | 'assistant' | 'system'

export type MessageStatus = 'pending' | 'sending' | 'sent' | 'streaming' | 'error'

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
