/**
 * React Chat Example (Updated)
 *
 * Modern example using the latest Clarity Memory API (v1.0+)
 * Demonstrates basic chat functionality with memory storage.
 *
 * For more comprehensive examples, see /docs/examples/
 */

import React, { useState, useEffect } from 'react'
import { useMemoryService } from '../react' // Use updated hooks
import type { MemoryItem } from '../types'

export function ChatApp({
  userId,
  threadId,
}: {
  userId: string
  threadId: string
}) {
  const memory = useMemoryService() // Updated hook
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<MemoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load thread messages on mount
  useEffect(() => {
    loadMessages()
  }, [threadId])

  async function loadMessages() {
    try {
      setLoading(true)
      setError(null)

      // Query thread messages using updated API
      const threadMessages = await memory.query('', {
        filters: {
          type: 'episodic',
          scope: 'thread',
          metadata: { threadId },
        },
        limit: 50,
      })

      setMessages(threadMessages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading messages:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSend() {
    if (!message.trim()) return

    const userMessage = message
    setMessage('') // Optimistic update

    try {
      // Store user message using updated API
      await memory.add(userMessage, {
        type: 'episodic',
        scope: 'thread',
        metadata: {
          userId,
          threadId,
          role: 'user',
          timestamp: new Date().toISOString(),
        },
      })

      // Simulate AI response (replace with actual LLM call)
      const aiResponse = `Echo: ${userMessage}`

      // Store AI response
      await memory.add(aiResponse, {
        type: 'episodic',
        scope: 'thread',
        metadata: {
          userId,
          threadId,
          role: 'assistant',
          timestamp: new Date().toISOString(),
        },
      })

      // Reload messages
      await loadMessages()
    } catch (err) {
      // Revert optimistic update
      setMessage(userMessage)
      setError(err instanceof Error ? err.message : 'Failed to send message')
      if (process.env.NODE_ENV === 'development') {
        console.error('Error sending message:', err)
      }
    }
  }

  if (loading && messages.length === 0) {
    return <div>Loading conversation...</div>
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        padding: '20px',
      }}
    >
      <h2>Chat (Thread: {threadId})</h2>

      {error && (
        <div
          style={{
            background: '#fee',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
          }}
        >
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '10px' }}>
            Dismiss
          </button>
        </div>
      )}

      <div
        style={{
          flex: 1,
          border: '1px solid #ddd',
          padding: '10px',
          marginBottom: '10px',
          overflowY: 'auto',
          borderRadius: '4px',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: '15px',
              padding: '8px',
              background: msg.metadata.role === 'user' ? '#e3f2fd' : '#f5f5f5',
              borderRadius: '4px',
            }}
          >
            <strong
              style={{
                color: msg.metadata.role === 'user' ? '#1976d2' : '#388e3c',
              }}
            >
              {msg.metadata.role === 'user' ? 'You' : 'AI'}:
            </strong>{' '}
            {msg.content}
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
          placeholder="Type a message..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          style={{
            padding: '8px 16px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !message.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Memory Count: {messages.length} messages
      </div>
    </div>
  )
}

// Export a demo wrapper for easy testing
export function ChatAppDemo() {
  return <ChatApp userId="demo_user_123" threadId="demo_thread_456" />
}
