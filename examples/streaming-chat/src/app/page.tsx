'use client'

import { useState, useRef } from 'react'
import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant with real-time streaming support. Try asking me something!',
      timestamp: Date.now() - 5000,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleSendMessage = async (content: string) => {
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Create streaming assistant message
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    }
    
    setMessages((prev) => [...prev, assistantMessage])

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController()

    try {
      // Call streaming API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No reader available')
      }

      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            
            if (data === '[DONE]') {
              break
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                accumulatedContent += parsed.content
                
                // Update message with new content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: accumulatedContent, isStreaming: true }
                      : msg
                  )
                )
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, isStreaming: false }
            : msg
        )
      )
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled')
        // Remove incomplete message
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessage.id))
      } else {
        console.error('Error:', error)
        // Update message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { 
                  ...msg, 
                  content: 'Sorry, I encountered an error. Please try again.',
                  isStreaming: false,
                  error: true,
                }
              : msg
          )
        )
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        marginBottom: '2rem',
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          marginBottom: '0.5rem',
        }}>
          Streaming Chat Demo
        </h1>
        <p style={{ 
          color: 'var(--foreground)',
          opacity: 0.7,
        }}>
          Real-time AI responses with Server-Sent Events (SSE) streaming
        </p>
      </div>
      
      <div style={{ 
        width: '100%', 
        maxWidth: '900px', 
        height: '600px',
        border: '1px solid rgba(128, 128, 128, 0.2)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onCancel={handleCancel}
        />
      </div>
    </main>
  )
}
