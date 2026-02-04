/**
 * error Handling Template
 */

import type { PlaygroundTemplate } from '../../types'

export const errorHandling: PlaygroundTemplate = {
  id: 'error-handling',
  name: 'Error Handling',
  description: 'Error states, retry logic, and error messages',
  category: 'patterns',
  tags: ['error', 'handling', 'retry', 'ux'],
  code: `import React, { useState } from 'react'

function Component() {
  const [status, setStatus] = useState('idle')
  const [retryCount, setRetryCount] = useState(0)

  const simulateRequest = async () => {
    setStatus('loading')

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 50% chance of error for demo
    if (Math.random() > 0.5) {
      setStatus('error')
      setRetryCount(prev => prev + 1)
    } else {
      setStatus('success')
      setRetryCount(0)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Error Handling Patterns</h2>

      <div style={{
        marginTop: '20px',
        padding: '24px',
        borderRadius: '12px',
        background: status === 'error' ? '#fef2f2' :
                   status === 'success' ? '#f0fdf4' : '#f8fafc',
        border: status === 'error' ? '1px solid #fecaca' :
               status === 'success' ? '1px solid #bbf7d0' : '1px solid #e5e7eb',
        transition: 'all 0.3s ease'
      }}>
        {status === 'idle' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚀</div>
            <p style={{ color: '#6b7280', margin: 0 }}>Click the button to simulate a request</p>
          </div>
        )}

        {status === 'loading' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              margin: '0 auto 12px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #6366f1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#6b7280', margin: 0 }}>Processing request...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#fee2e2',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                ❌
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#dc2626' }}>Request Failed</h4>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#9ca3af' }}>
                  Attempt {retryCount} of 3
                </p>
              </div>
            </div>
            <p style={{ color: '#b91c1c', fontSize: '14px', margin: '0 0 16px' }}>
              Unable to complete request. Please try again.
            </p>
            <button
              onClick={simulateRequest}
              disabled={retryCount >= 3}
              style={{
                padding: '10px 20px',
                background: retryCount >= 3 ? '#d1d5db' : '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: retryCount >= 3 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {retryCount >= 3 ? 'Max retries reached' : 'Retry'}
            </button>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              margin: '0 auto 12px',
              background: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px'
            }}>
              ✓
            </div>
            <h4 style={{ margin: 0, color: '#059669' }}>Success!</h4>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '8px 0 0' }}>
              Request completed successfully
            </p>
          </div>
        )}
      </div>

      {status !== 'loading' && (
        <button
          onClick={() => { setStatus('idle'); simulateRequest(); }}
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          {status === 'idle' ? 'Make Request' : 'Try Again'}
        </button>
      )}

      <style>
        {\`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        \`}
      </style>
    </div>
  )
}

export default Component`,
}
