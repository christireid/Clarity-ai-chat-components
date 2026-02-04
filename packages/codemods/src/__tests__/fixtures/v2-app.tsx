/**
 * Expected v2 application after transformations
 */

import React from 'react'
import { ChatInterface, toast, ClarityToaster } from '@clarity-chat/react'

const config = {
  credentials: {
    apiKey: process.env.CLARITY_API_KEY,
  },
  model: 'claude-3',
  temperature: 0.7,
}

export default function App() {
  const handleMessage = async (message: string) => {
    try {
      // Send message logic
      toast.success('Message sent successfully')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  return (
    <div className="app">
      <ClarityToaster />
      <header>
        <h1>Chat Application</h1>
      </header>
      <main>
        <ChatInterface
          onSend={handleMessage}
          config={config}
          className="chat-window"
        />
      </main>
    </div>
  )
}
