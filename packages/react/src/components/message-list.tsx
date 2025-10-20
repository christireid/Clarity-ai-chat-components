import * as React from 'react'
import type { Message as MessageType } from '@clarity-chat/types'
import { Message } from './message'
import { ScrollArea } from '@clarity-chat/primitives'

export interface MessageListProps {
  messages: MessageType[]
  onMessageCopy?: (messageId: string, content: string) => void
  onMessageFeedback?: (messageId: string, type: 'up' | 'down') => void
  onMessageRetry?: (messageId: string) => void
  className?: string
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onMessageCopy,
  onMessageFeedback,
  onMessageRetry,
  className,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <ScrollArea ref={scrollRef} className={className}>
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onCopy={(content) => onMessageCopy?.(message.id, content)}
            onFeedback={(type) => onMessageFeedback?.(message.id, type)}
            onRetry={() => onMessageRetry?.(message.id)}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
