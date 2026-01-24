/**
 * Chat Window Template
 *
 * A complete chat window with header, messages, and input
 */

import type { PlaygroundTemplate } from '../../types'

export const chatWindow: PlaygroundTemplate = {
  id: 'chat-window',
  name: 'Chat Window',
  description: 'A complete chat window with header, messages, and input',
  category: 'chat-components',
  tags: ['chat', 'window', 'complete'],
  code: `import React, { useState } from 'react'

function Component() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hi! How can I help you today?' },
    { id: 2, role: 'user', content: 'Tell me about React' },
    { id: 3, role: 'assistant', content: 'React is a JavaScript library for building user interfaces. It uses a component-based architecture and virtual DOM for efficient updates.' }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { id: Date.now(), role: 'user', content: input }])
    setInput('')

    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: 'This is a demo response. In production, this would come from an AI API.'
      }])
    }, 500)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h3 style={{ margin: 0 }}>AI Assistant</h3>
        <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.9 }}>
          Online
        </p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        background: '#f5f5f5'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '12px'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: msg.role === 'user' ? '#667eea' : 'white',
              color: msg.role === 'user' ? 'white' : 'black',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #e0e0e0',
        background: 'white'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '24px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Component`,
}
