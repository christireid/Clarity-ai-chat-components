import React, { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react'

function StreamingDemo() {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)

  const streamMessage = async content => {
    const words = content.split(' ')
    let accumulated = ''

    const streamingMsg = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'streaming',
    }

    setMessages(prev => [...prev, streamingMsg])
    setIsStreaming(true)

    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 100))
      accumulated += `${word} `

      setMessages(prev =>
        prev.map(msg =>
          msg.id === streamingMsg.id
            ? { ...msg, content: accumulated.trim() }
            : msg
        )
      )
    }

    setMessages(prev =>
      prev.map(msg =>
        msg.id === streamingMsg.id
          ? { ...msg, status: 'sent' }
          : msg
      )
    )
    setIsStreaming(false)
  }

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

    await streamMessage(
      'This is a simulated streaming response. Watch as the text appears word by word, creating a more engaging user experience.'
    )
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ChatWindow
        messages={messages}
        isLoading={isStreaming}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

export default StreamingDemo
