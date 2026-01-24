/**
 * typing Indicator Template
 */

import type { PlaygroundTemplate } from '../../types'

export const typingIndicator: PlaygroundTemplate = {
  id: 'typing-indicator',
  name: 'Typing Indicator',
  description: 'Animated typing indicator with three bouncing dots',
  category: 'patterns',
  tags: ['typing', 'animation', 'loading', 'indicator'],
  code: `import React, { useState } from 'react'

function Component() {
  const [isTyping, setIsTyping] = useState(true)

  const dotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#6366f1',
    display: 'inline-block',
    animation: 'bounce 1.4s ease-in-out infinite',
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Typing Indicator</h2>

      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '12px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {isTyping && (
          <>
            <div style={{ ...dotStyle, animationDelay: '0s' }} />
            <div style={{ ...dotStyle, animationDelay: '0.2s' }} />
            <div style={{ ...dotStyle, animationDelay: '0.4s' }} />
          </>
        )}
      </div>

      <div style={{ marginTop: '24px' }}>
        <button
          onClick={() => setIsTyping(!isTyping)}
          style={{
            padding: '10px 20px',
            background: isTyping ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isTyping ? 'Stop' : 'Start'} Typing
        </button>
      </div>

      <style>
        {\`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
          }
        \`}
      </style>
    </div>
  )
}

export default Component`,
}
