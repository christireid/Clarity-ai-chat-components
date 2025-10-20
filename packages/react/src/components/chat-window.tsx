import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import { Card } from '@clarity-chat/primitives'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ThinkingIndicator } from './thinking-indicator'

export interface ChatWindowProps {
  messages: Message[]
  isLoading?: boolean
  onSendMessage: (content: string) => void
  className?: string
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading = false,
  onSendMessage,
  className,
}) => {
  const [input, setInput] = React.useState('')

  const handleSubmit = (content: string) => {
    onSendMessage(content)
    setInput('')
  }

  return (
    <Card className={className}>
      <div className="flex flex-col h-full">
        <MessageList messages={messages} className="flex-1" />
        
        {isLoading && <ThinkingIndicator />}
        
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
