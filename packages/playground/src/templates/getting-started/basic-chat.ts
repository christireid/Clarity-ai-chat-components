/**
 * Basic Chat Template
 *
 * A simple chat interface with message input and display
 */

import type { PlaygroundTemplate } from '../../types'

export const basicChat: PlaygroundTemplate = {
  id: 'basic-chat',
  name: 'Basic Chat',
  description: 'A simple chat interface with message input and display',
  category: 'getting-started',
  tags: ['beginner', 'chat', 'messages'],
  code: `import React, { useState } from 'react'

function Component() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleSend = () => {
    if (!message.trim()) return

    setMessages([...messages, {
      id: Date.now(),
      role: 'user',
      content: message
    }])

    setMessage('')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Basic Chat</h2>

      <div style={{
        height: '400px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        overflowY: 'auto'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            marginBottom: '12px',
            padding: '8px 12px',
            background: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
            borderRadius: '8px'
          }}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '8px'
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '8px 16px',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Component`,
}
