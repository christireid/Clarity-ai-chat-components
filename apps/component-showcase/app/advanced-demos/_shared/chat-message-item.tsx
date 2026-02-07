'use client'

import React, { memo } from 'react'
import {
  MessageBubble,
  MarkdownRenderer,
  StreamingMessage,
  EditableMessageContent,
  type MessageAvatar,
} from '@clarity-chat/react'
import { MessageActions } from './message-actions'
import type { HookMessage } from './types'
import { getTextContent, MARKDOWN_CONFIG } from './types'

export interface ChatMessageItemProps {
  msg: HookMessage
  /** Whether this message is currently streaming */
  isStreaming: boolean
  /** Custom avatar component to show for assistant messages */
  assistantAvatar: React.ReactNode
  /** Timestamp for this message, if tracked */
  timestamp?: Date
  /** Editing state */
  editingMessageId: string | null
  onEditSaveWithText: (msgId: string, newText: string) => void
  onEditCancel: () => void
  /** Message action callbacks */
  feedback?: 'up' | 'down' | null
  onFeedback: (msgId: string, fb: 'up' | 'down') => void
  onRegenerate: (msgId: string) => void
  onDelete: (msgId: string) => void
  onEditStart: (msgId: string) => void
  /** Extra content to render below the message (e.g. SourceList) */
  extraContent?: React.ReactNode
}

/**
 * Shared message item that wraps the library's MessageBubble component.
 * Uses library's EditableMessageContent for inline editing (keyboard shortcuts,
 * auto-focus, character count, animated transitions).
 */
export const ChatMessageItem = memo(function ChatMessageItem({
  msg,
  isStreaming,
  assistantAvatar,
  timestamp,
  editingMessageId,
  onEditSaveWithText,
  onEditCancel,
  feedback,
  onFeedback,
  onRegenerate,
  onDelete,
  onEditStart,
  extraContent,
}: ChatMessageItemProps) {
  const content = getTextContent(msg.content)
  const msgId = msg.id || ''
  const role = msg.role as 'user' | 'assistant'

  const avatar: MessageAvatar | undefined =
    role === 'assistant' ? { component: assistantAvatar } : undefined

  const isEditing = editingMessageId === msg.id

  const actions = msgId ? (
    <MessageActions
      role={role}
      feedback={feedback}
      onFeedback={(fb) => onFeedback(msgId, fb)}
      copyText={content}
      onRegenerate={
        role === 'assistant' ? () => onRegenerate(msgId) : undefined
      }
      onDelete={() => onDelete(msgId)}
      onEdit={role === 'user' ? () => onEditStart(msgId) : undefined}
    />
  ) : undefined

  return (
    <MessageBubble
      role={role}
      avatar={avatar}
      showAvatar={role === 'assistant'}
      isStreaming={isStreaming}
      showCursor={isStreaming}
      timestamp={timestamp}
      id={msgId ? `msg-${msgId}` : undefined}
      actions={actions}
      disableAnimation={false}
    >
      {isEditing ? (
        <EditableMessageContent
          content={content}
          isEditing={true}
          onSave={(newText) => onEditSaveWithText(msgId, newText)}
          onCancel={onEditCancel}
        />
      ) : isStreaming ? (
        <StreamingMessage
          content={content}
          isStreaming={true}
          onRetry={undefined}
          smoothStreaming={false}
        />
      ) : (
        <MarkdownRenderer content={content} config={MARKDOWN_CONFIG} />
      )}
      {extraContent}
    </MessageBubble>
  )
})
