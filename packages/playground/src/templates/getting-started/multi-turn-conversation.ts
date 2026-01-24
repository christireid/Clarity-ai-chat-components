/**
 * Multi-Turn Conversation Template
 *
 * A conversation with system messages and multiple turns
 */

import type { PlaygroundTemplate } from '../../types'

export const multiTurnConversation: PlaygroundTemplate = {
  id: 'conversation',
  name: 'Multi-Turn Conversation',
  description: 'A conversation with system messages and multiple turns',
  category: 'getting-started',
  tags: ['conversation', 'multi-turn', 'system-message'],
  code: `import React, { useState } from 'react'

function Component() {
  const [input, setInput] = useState('')
  const [conversation, setConversation] = useState([
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ])

  const handleSend = () => {
    if (!input.trim()) return

    setConversation([
      ...conversation,
      { role: 'user', content: input },
      { role: 'assistant', content: 'This is a simulated response. In a real application, this would come from an AI model.' }
    ])

    setInput('')
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Multi-Turn Conversation</h2>

      <div style={{
        height: '450px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        overflowY: 'auto',
        background: '#fafafa'
      }}>
        {conversation.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: '12px',
            padding: '12px',
            background: msg.role === 'user' ? '#e3f2fd' :
                       msg.role === 'assistant' ? '#fff' : '#f5f5f5',
            borderRadius: '8px',
            border: msg.role === 'system' ? '1px dashed #ccc' : 'none'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginBottom: '4px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {msg.role}
            </div>
            <div style={{ lineHeight: 1.5 }}>{msg.content}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '8px'
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '12px 24px',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
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
