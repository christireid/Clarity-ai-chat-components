/**
 * Model Selector Template
 *
 * Dropdown to select AI model with descriptions
 */

import type { PlaygroundTemplate } from '../../types'

export const modelSelector: PlaygroundTemplate = {
  id: 'model-selector',
  name: 'Model Selector',
  description: 'Dropdown to select AI model with descriptions',
  category: 'controls',
  tags: ['model', 'selector', 'dropdown'],
  code: `import React, { useState } from 'react'

function Component() {
  const [selectedModel, setSelectedModel] = useState('gpt-4')

  const models = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model', icon: '🌟' },
    { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', description: 'Fast and efficient', icon: '⚡' },
    { id: 'claude-3', name: 'Claude 3 Opus', description: 'Advanced reasoning', icon: '🧠' },
    { id: 'gemini', name: 'Gemini Pro', description: 'Multimodal capabilities', icon: '💎' }
  ]

  const selected = models.find(m => m.id === selectedModel)

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Model Selector</h2>

      <div style={{ marginTop: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          Select Model:
        </label>

        <div style={{ display: 'grid', gap: '8px' }}>
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                border: selectedModel === model.id ? '2px solid #2196f3' : '2px solid #e0e0e0',
                borderRadius: '8px',
                background: selectedModel === model.id ? '#e3f2fd' : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '24px' }}>{model.icon}</span>
              <div>
                <div style={{ fontWeight: 'bold' }}>{model.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{model.description}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f0f7ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
            Selected:
          </div>
          <div style={{ fontWeight: 'bold', color: '#0066cc' }}>
            {selected?.icon} {selected?.name}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component`,
}
