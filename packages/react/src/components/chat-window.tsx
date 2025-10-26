import * as React from 'react'
import type { Message, AIStatus } from '@clarity-chat/types'
import { Card } from '@clarity-chat/primitives'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ThinkingIndicator } from './thinking-indicator'
import { BotIcon } from './icons'

export interface ChatWindowProps {
  messages: Message[]
  isLoading?: boolean
  /** AI processing status for thinking indicator */
  aiStatus?: AIStatus
  onSendMessage: (content: string) => void
  /** Callback when message is copied */
  onMessageCopy?: (messageId: string, content: string) => void
  /** Callback when feedback is given */
  onMessageFeedback?: (messageId: string, type: 'up' | 'down') => void
  /** Callback when retry is requested */
  onMessageRetry?: (messageId: string) => void
  /** Custom empty state */
  emptyState?: React.ReactNode
  className?: string
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading = false,
  aiStatus,
  onSendMessage,
  onMessageCopy,
  onMessageFeedback,
  onMessageRetry,
  emptyState,
  className,
}) => {
  const [input, setInput] = React.useState('')

  const handleSubmit = (content: string) => {
    onSendMessage(content)
    setInput('')
  }

  // Default empty state
  const defaultEmptyState = (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
        <BotIcon size={32} className="text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Start a conversation</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Send a message to begin chatting with the AI assistant
        </p>
      </div>
    </div>
  )

  return (
    <Card className={className}>
      <div className="flex flex-col h-full">
        <MessageList 
          messages={messages} 
          isLoading={isLoading}
          onMessageCopy={onMessageCopy}
          onMessageFeedback={onMessageFeedback}
          onMessageRetry={onMessageRetry}
          emptyState={emptyState || defaultEmptyState}
          className="flex-1" 
        />
        
        {isLoading && <ThinkingIndicator status={aiStatus} />}
        
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={isLoading}
        />
      </div>
    </Card>
  )
}
