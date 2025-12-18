import { logger } from '@clarity-chat/utils/logger';
/**
 * Simple Chat with Handlers Example
 * 
 * Demonstrates using useChatHandlers to reduce boilerplate.
 * This is the recommended pattern when you need more control than ClarityChat.
 */

import { useClarityChat, ChatWindow, useChatHandlers } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function SimpleChatWithHandlers() {
  const chat = useClarityChat({
    api: '/api/chat',
  })

  // Pre-configured handlers - no boilerplate needed! ✨
  const handlers = useChatHandlers({
    chat,
    onMessageSent: (content) => {
      logger.debug('Message sent:', content)
    },
    onMessageError: (error) => {
      logger.error('Failed to send message:', error)
    },
  })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handlers.onSendMessage}
      onClear={handlers.onClear}
      onMessageRetry={handlers.onRetry}
      onEditMessage={(id) => {
        // For editing, you might want to show an input
        // This is just a simple example
        const message = chat.messages.find((m) => m.id === id)
        if (message) {
          const newContent = prompt('Edit message:', String(message.content))
          if (newContent) {
            handlers.onEdit(id, newContent)
          }
        }
      }}
    />
  )
}
