import { logger } from '@clarity-chat/utils/logger';
/**
 * React Example
 *
 * Example usage of Clarity Memory in a React component
 */

// @ts-expect-error - React is used in JSX
import React, { useState } from 'react'
import { useMemory } from '../react/use-memory'
import { MemoryInspector } from '../react/memory-inspector'

export function ChatApp() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])

  // @ts-expect-error - Example code uses partial config for demonstration
  const memoryHook = useMemory({
    storage: { type: 'indexeddb' },
  })
  
  const { add, recall, context, initialized, loading, error, memory } = memoryHook

  const handleSend = async () => {
    if (!message.trim() || !initialized) return

    try {
      // Add user message to memory
      await add(message, {
        type: 'episodic',
        scope: 'session',
        importance: 0.7,
      })

      // Recall relevant memories (for context building)
      await recall(message, { limit: 5 })

      // Get optimized context
      const ctx = await context({ maxTokens: 2000 })

      // Simulate LLM response (in real app, call your LLM API)
      const response = `Based on context: ${ctx.formatted?.slice(0, 100)}...`

      // Add assistant response to memory
      await add(response, {
        type: 'episodic',
        scope: 'session',
        importance: 0.6,
      })

      setMessages(prev => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: response },
      ])

      setMessage('')
    } catch (err) {
      logger.error('Error:', err)
    }
  }

  if (loading) {
    return <div>Initializing memory...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div style={{ flex: 1 }}>
        <h2>Chat</h2>
        <div style={{ border: '1px solid #ddd', padding: '10px', minHeight: '400px', marginBottom: '10px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <strong>{msg.role}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '8px' }}
          />
          <button onClick={handleSend} disabled={!initialized}>
            Send
          </button>
        </div>
      </div>
      
      <div style={{ flex: 1 }}>
        <h2>Memory Inspector</h2>
        {initialized && memory && <MemoryInspector memory={memory} />}
      </div>
    </div>
  )
}
