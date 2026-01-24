/**
 * Streaming Response Template
 *
 * Demonstrates word-by-word streaming text display
 */

import type { PlaygroundTemplate } from '../../types'

export const streamingResponse: PlaygroundTemplate = {
  id: 'streaming',
  name: 'Streaming Response',
  description: 'Demonstrates word-by-word streaming text display',
  category: 'streaming',
  tags: ['streaming', 'animation', 'ai-response'],
  code: `import React, { useState } from 'react'

function Component() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')

  const simulateStreaming = async () => {
    setIsStreaming(true)
    setStreamedText('')

    const text = "This is a simulated streaming response. Each word appears one at a time, mimicking real AI streaming. This creates a more engaging and natural user experience."
    const words = text.split(' ')

    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 80))
      setStreamedText(prev => prev + word + ' ')
    }

    setIsStreaming(false)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Streaming Response Demo</h2>

      <div style={{
        minHeight: '200px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        background: '#f9f9f9'
      }}>
        <p style={{ lineHeight: 1.6 }}>
          {streamedText}
          {isStreaming && <span style={{ animation: 'blink 1s infinite' }}>▋</span>}
        </p>
      </div>

      <button
        onClick={simulateStreaming}
        disabled={isStreaming}
        style={{
          padding: '10px 20px',
          background: isStreaming ? '#ccc' : '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isStreaming ? 'not-allowed' : 'pointer',
          fontSize: '14px'
        }}
      >
        {isStreaming ? 'Streaming...' : 'Start Streaming'}
      </button>

      <style>
        {\`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        \`}
      </style>
    </div>
  )
}

export default Component`,
}
