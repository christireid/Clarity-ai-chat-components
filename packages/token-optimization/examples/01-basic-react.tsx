/**
 * Example 01: Basic React Token Counter
 *
 * The simplest way to count tokens in React.
 * Copy-paste this and it works immediately.
 */

import { useState } from 'react'
import { useTokenCount } from '@clarity-chat/token-optimization'

// ============================================================================
// Basic Token Counter
// ============================================================================

export function TokenCounter() {
  const [text, setText] = useState('')
  const { count, isLoading, info } = useTokenCount(text)

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <h3>Token Counter</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
        style={{ width: '100%', height: 100 }}
      />
      <div style={{ marginTop: 8 }}>
        <strong>{isLoading ? '...' : count}</strong> tokens
        <span style={{ color: '#666', marginLeft: 16 }}>
          {info.words} words • {info.characters} characters
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// With Token Limit Warning
// ============================================================================

export function TokenLimitWarning({ maxTokens = 4096 }) {
  const [text, setText] = useState('')
  const { count, isLoading } = useTokenCount(text)

  const percentage = Math.min((count / maxTokens) * 100, 100)
  const isOverLimit = count > maxTokens
  const isNearLimit = percentage > 80

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <h3>Prompt Editor</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your prompt..."
        style={{
          width: '100%',
          height: 150,
          borderColor: isOverLimit ? 'red' : isNearLimit ? 'orange' : '#ccc',
        }}
      />

      {/* Progress bar */}
      <div
        style={{
          background: '#eee',
          borderRadius: 4,
          height: 8,
          marginTop: 8,
        }}
      >
        <div
          style={{
            background: isOverLimit ? 'red' : isNearLimit ? 'orange' : 'green',
            width: `${percentage}%`,
            height: '100%',
            borderRadius: 4,
            transition: 'width 0.2s',
          }}
        />
      </div>

      {/* Token count */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
        }}
      >
        <span style={{ color: isOverLimit ? 'red' : 'inherit' }}>
          {isLoading ? '...' : count} / {maxTokens} tokens
        </span>
        {isOverLimit && (
          <span style={{ color: 'red' }}>
            Reduce by {count - maxTokens} tokens
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Model Selector with Token Count
// ============================================================================

const MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', maxTokens: 128000 },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', maxTokens: 128000 },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', maxTokens: 200000 },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', maxTokens: 1000000 },
]

export function ModelAwareCounter() {
  const [text, setText] = useState('')
  const [modelId, setModelId] = useState('gpt-4o')
  const { count, isLoading } = useTokenCount(text, { model: modelId })

  const model = MODELS.find((m) => m.id === modelId)!
  const percentage = (count / model.maxTokens) * 100

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <h3>Model-Aware Counter</h3>

      <select
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
        style={{ marginBottom: 8 }}
      >
        {MODELS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text..."
        style={{ width: '100%', height: 100 }}
      />

      <div style={{ marginTop: 8 }}>
        <strong>{isLoading ? '...' : count.toLocaleString()}</strong> /{' '}
        {model.maxTokens.toLocaleString()} tokens ({percentage.toFixed(2)}%)
      </div>
    </div>
  )
}
