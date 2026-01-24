/**
 * Message Bubble Template
 *
 * Custom-styled message bubbles with different alignments
 */

import type { PlaygroundTemplate } from '../../types'

export const messageBubble: PlaygroundTemplate = {
  id: 'message-bubble',
  name: 'Message Bubble',
  description: 'Custom-styled message bubbles with different alignments',
  category: 'chat-components',
  tags: ['message', 'bubble', 'styling'],
  code: `import React from 'react'

function Component() {
  const messages = [
    { id: 1, role: 'user', content: 'Hello! How are you?' },
    { id: 2, role: 'assistant', content: "I'm doing well, thank you for asking! How can I help you today?" },
    { id: 3, role: 'user', content: 'Can you explain React hooks?' }
  ]

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Message Bubble Component</h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '20px'
      }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? '#007bff' : '#e9ecef',
              color: msg.role === 'user' ? 'white' : 'black',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Component`,
}
