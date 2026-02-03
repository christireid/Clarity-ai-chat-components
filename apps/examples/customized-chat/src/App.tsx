/**
 * Customized Chat Example
 *
 * Shows how to build a simple chat interface with customizations.
 * This example demonstrates the core concepts without complex dependencies.
 */

import { useState } from 'react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function App() {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hello! I am a customized AI assistant. How can I help you today?',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate API response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a demo response to: "${userMessage.content}". In a real app, this would call the /api/chat endpoint.`,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Customized Chat Example</h1>

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', marginBottom: '1rem' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: '0.5rem 1rem',
                marginBottom: '0.5rem',
                backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                borderRadius: '8px',
              }}
            >
              <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>{' '}
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div style={{ padding: '0.5rem 1rem', color: '#666' }}>
              Thinking...
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', gap: '0.5rem' }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#1976d2',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
