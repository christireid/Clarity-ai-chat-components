import * as React from 'react'
import type { Message as MessageType } from '@clarity-chat/types'
import { Message } from './message'
import { ScrollArea, Button } from '@clarity-chat/primitives'
import { useAutoScroll } from '../hooks/use-auto-scroll'

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
  // Use auto-scroll hook with smooth scrolling
  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    behavior: 'smooth',
    threshold: 100,
  })

  return (
    <div className="relative">
      <ScrollArea ref={scrollRef as React.RefObject<HTMLDivElement>} className={className}>
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
      
      {/* Show scroll-to-bottom button when not at bottom */}
      {!isNearBottom && messages.length > 0 && (
        <div className="absolute bottom-4 right-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={scrollToBottom}
            className="shadow-lg"
          >
            ↓ Scroll to bottom
          </Button>
        </div>
      )}
    </div>
  )
}
