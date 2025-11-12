import React, { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react'

const initialMessages = [
  {
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: "Hello! I'm your AI assistant. How can I help you today?",
    createdAt: new Date(Date.now() - 5000),
    updatedAt: new Date(Date.now() - 5000),
    status: 'sent',
  },
]

function BasicChatDemo() {
  const [messages, setMessages] = useState(initialMessages)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async content => {
    const userMessage = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        chatId: 'demo',
        role: 'assistant',
        content: `You said: "${content}". This is a simulated response from the AI.`,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }

      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

export default BasicChatDemo
