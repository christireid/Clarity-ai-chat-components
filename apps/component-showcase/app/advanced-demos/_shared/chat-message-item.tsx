'use client'

import React, { memo } from 'react'
import {
  MessageBubble,
  MarkdownRenderer,
  StreamingMessage,
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
  editingText: string
  onEditingTextChange: (text: string) => void
  onEditSave: (msgId: string) => void
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
 * Replaces ~100 lines of duplicated custom message JSX across all 3 demo pages.
 */
export const ChatMessageItem = memo(function ChatMessageItem({
  msg,
  isStreaming,
  assistantAvatar,
  timestamp,
  editingMessageId,
  editingText,
  onEditingTextChange,
  onEditSave,
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
        <div className="space-y-2">
          <textarea
            value={editingText}
            onChange={(e) => onEditingTextChange(e.target.value)}
            className="w-full bg-transparent border rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
            rows={3}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={onEditCancel}
              className="text-xs px-2 py-1 rounded bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={() => msgId && onEditSave(msgId)}
              className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground"
            >
              Save &amp; Resend
            </button>
          </div>
        </div>
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
