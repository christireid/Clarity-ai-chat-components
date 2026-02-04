/**
 * Example v1 application for testing transformations
 */

import React from 'react'
import { ChatWindow, useToast, ToastProvider } from '@clarity-chat/react'

const config = {
  apiKey: process.env.CLARITY_API_KEY,
  model: 'claude-3',
  temperature: 0.7,
}

export default function App() {
  const { toast } = useToast()

  const handleMessage = async (message: string) => {
    try {
      // Send message logic
      toast.success('Message sent successfully')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  return (
    <ToastProvider>
      <div className="app">
        <header>
          <h1>Chat Application</h1>
        </header>
        <main>
          <ChatWindow
            onMessage={handleMessage}
            config={config}
            className="chat-window"
          />
        </main>
      </div>
    </ToastProvider>
  )
}
