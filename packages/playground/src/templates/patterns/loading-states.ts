/**
 * loading States Template
 */

import type { PlaygroundTemplate } from '../../types'

export const loadingStates: PlaygroundTemplate = {
  id: 'loading-states',
  name: 'Loading States',
  description: 'Various loading states and skeleton screens',
  category: 'patterns',
  tags: ['loading', 'skeleton', 'states', 'ux'],
  code: `import React, { useState } from 'react'

function Component() {
  const [loadingType, setLoadingType] = useState('spinner')

  const LoadingSpinner = () => (
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  )

  const LoadingDots = () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#6366f1',
            animation: \`pulse 1.4s ease-in-out \${i * 0.2}s infinite\`
          }}
        />
      ))}
    </div>
  )

  const LoadingSkeleton = () => (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '60%',
        height: '20px',
        background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
        backgroundSize: '200% 100%',
        borderRadius: '4px',
        animation: 'shimmer 1.5s infinite',
        marginBottom: '12px'
      }} />
      <div style={{
        width: '100%',
        height: '16px',
        background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
        backgroundSize: '200% 100%',
        borderRadius: '4px',
        animation: 'shimmer 1.5s infinite',
        marginBottom: '8px'
      }} />
      <div style={{
        width: '80%',
        height: '16px',
        background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
        backgroundSize: '200% 100%',
        borderRadius: '4px',
        animation: 'shimmer 1.5s infinite'
      }} />
    </div>
  )

  const LoadingProgress = () => (
    <div style={{
      width: '100%',
      height: '6px',
      background: '#e5e7eb',
      borderRadius: '3px',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '30%',
        height: '100%',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        borderRadius: '3px',
        animation: 'progress 2s ease-in-out infinite'
      }} />
    </div>
  )

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Loading States</h2>

      <div style={{ display: 'flex', gap: '8px', marginTop: '20px', marginBottom: '24px' }}>
        {['spinner', 'dots', 'skeleton', 'progress'].map(type => (
          <button
            key={type}
            onClick={() => setLoadingType(type)}
            style={{
              padding: '8px 16px',
              background: loadingType === type ? '#6366f1' : '#e5e7eb',
              color: loadingType === type ? 'white' : '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              textTransform: 'capitalize'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div style={{
        padding: '40px',
        background: '#f8fafc',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '150px'
      }}>
        {loadingType === 'spinner' && <LoadingSpinner />}
        {loadingType === 'dots' && <LoadingDots />}
        {loadingType === 'skeleton' && <LoadingSkeleton />}
        {loadingType === 'progress' && <LoadingProgress />}
      </div>

      <style>
        {\`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.5); opacity: 0.5; }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
        \`}
      </style>
    </div>
  )
}

export default Component`,
}
