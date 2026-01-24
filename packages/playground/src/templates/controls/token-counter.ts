/**
 * Token Counter Template
 *
 * Visual token count with progress indicator
 */

import type { PlaygroundTemplate } from '../../types'

export const tokenCounter: PlaygroundTemplate = {
  id: 'token-counter',
  name: 'Token Counter',
  description: 'Visual token count with progress indicator',
  category: 'controls',
  tags: ['tokens', 'counter', 'progress'],
  code: `import React, { useState, useMemo } from 'react'

function Component() {
  const [text, setText] = useState('')

  // Simple token estimation (roughly 1 token per 4 characters)
  const tokenCount = useMemo(() => {
    if (!text.trim()) return 0
    return Math.ceil(text.length / 4)
  }, [text])

  const maxTokens = 4096
  const percentage = (tokenCount / maxTokens) * 100
  const isWarning = percentage > 80
  const isError = percentage > 95

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Token Counter</h2>

      <div style={{ marginTop: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          Enter text:
        </label>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace',
            resize: 'vertical'
          }}
        />

        <div style={{ marginTop: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
              Token Count: <span style={{
                color: isError ? '#dc3545' : isWarning ? '#ffc107' : '#28a745'
              }}>{tokenCount.toLocaleString()}</span> / {maxTokens.toLocaleString()}
            </span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {percentage.toFixed(1)}%
            </span>
          </div>

          <div style={{
            width: '100%',
            height: '24px',
            background: '#e0e0e0',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: \`\${Math.min(percentage, 100)}%\`,
              height: '100%',
              background: isError ? '#dc3545' : isWarning ? '#ffc107' : '#28a745',
              transition: 'all 0.3s ease',
              borderRadius: '12px'
            }} />
          </div>

          {isError && (
            <div style={{
              marginTop: '8px',
              padding: '8px',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33',
              fontSize: '12px'
            }}>
              Token limit exceeded! Please reduce text length.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Component`,
}
