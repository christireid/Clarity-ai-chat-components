import React, { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react'

function ThemedDemo() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      chatId: 'demo',
      role: 'assistant',
      content: 'This chat has custom styling! Try sending a message.',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    },
  ])

  const handleSendMessage = content => {
    const newMessage = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }

    setMessages(prev => [...prev, newMessage])

    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        chatId: 'demo',
        role: 'assistant',
        content: `Echo: ${content}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }

      setMessages(prev => [...prev, response])
    }, 1000)
  }

  return (
    <div
      style={{
        width: '100%',
        height: '600px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '12px',
      }}
    >
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        className="custom-chat"
      />
    </div>
  )
}

export default ThemedDemo
