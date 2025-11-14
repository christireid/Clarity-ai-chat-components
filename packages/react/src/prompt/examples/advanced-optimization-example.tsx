/**
 * Advanced Prompt Optimization Example
 * 
 * Demonstrates:
 * - Automatic prompt optimization
 * - Model routing
 * - Real-time token visualization
 * - Optimization stages
 * - Compression visualization
 */

import React, { useState, useMemo } from 'react'
import {
  usePromptOptimizer,
  useDynamicModelRouting,
  usePromptDebugger,
  createPromptRecipe,
  getModelProfile,
  MODEL_PROFILES,
} from '../../index'
import type { ModelMetadata } from '../core/types'

/**
 * Example component showing advanced prompt optimization
 */
export function AdvancedOptimizationExample() {
  const [messages, setMessages] = useState<any[]>([])
  const [currentModelId, setCurrentModelId] = useState<string>('gpt-4')
  const [targetTokens, setTargetTokens] = useState(4000)
  const [costBudget, setCostBudget] = useState(0.10)

  // Get current model
  const currentModel = useMemo(() => {
    return getModelProfile(currentModelId) || MODEL_PROFILES['gpt-4']
  }, [currentModelId])

  // Available models for routing
  const availableModels = useMemo(
    () => [
      { model: MODEL_PROFILES['gpt-4'], priority: 1 },
      { model: MODEL_PROFILES['gpt-4o-mini'], priority: 2 },
      { model: MODEL_PROFILES['gpt-3.5-turbo'], priority: 3 },
    ],
    []
  )

  // Create a prompt recipe
  const recipe = useMemo(
    () =>
      createPromptRecipe({
        id: 'advanced-chat',
        name: 'Advanced Chat',
        system: 'You are a helpful AI assistant. Be concise and accurate.',
        user: '{{userMessage}}',
        variables: [{ name: 'userMessage', required: true }],
      }),
    []
  )

  // Use prompt optimizer
  const {
    optimizedMessages,
    tokenStats,
    costEstimate,
    diagnostics,
    strategy,
    isOptimizing,
    optimize,
  } = usePromptOptimizer({
    toon: recipe,
    messages: messages as any,
    model: currentModel,
    targetTokens,
    autoOptimize: true,
    costBudget,
    debug: true,
  })

  // Use dynamic model routing
  const { decision, getBestModel } = useDynamicModelRouting({
    messages: optimizedMessages as any,
    currentModel,
    availableModels: availableModels as any,
    targetTokens,
    costBudget,
  })

  // Use prompt debugger
  const { debugInfo, enabled, toggle, exportDebugInfo } = usePromptDebugger({
    result: {
      messages: optimizedMessages as any,
      tokenStats,
      costEstimate,
      diagnostics: diagnostics as any,
      strategy,
    } as any,
    originalMessages: messages as any,
    model: currentModel,
    enabled: true,
  })

  // Handle message send
  const handleSend = (text: string) => {
    const newMessage = {
      role: 'user' as const,
      content: text,
    }
    setMessages(prev => [...prev, newMessage])
  }

  // Switch to recommended model
  const handleSwitchModel = () => {
    if (decision.shouldSwitch) {
      setCurrentModelId(decision.recommendedModel.id)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Advanced Prompt Optimization Demo</h1>

      {/* Model Selection */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Model Selection</h2>
        <select
          value={currentModelId}
          onChange={e => setCurrentModelId(e.target.value)}
        >
          {Object.keys(MODEL_PROFILES).map(id => (
            <option key={id} value={id}>
              {MODEL_PROFILES[id as keyof typeof MODEL_PROFILES].name}
            </option>
          ))}
        </select>
        {decision.shouldSwitch && (
          <div style={{ marginTop: '10px', padding: '10px', background: '#fff3cd' }}>
            <p>
              <strong>Recommendation:</strong> Switch to{' '}
              {decision.recommendedModel.name}
            </p>
            <p>{decision.reason}</p>
            {decision.estimatedSavings && (
              <p>
                Estimated savings: ${decision.estimatedSavings.toFixed(4)}
              </p>
            )}
            <button onClick={handleSwitchModel}>Switch Model</button>
          </div>
        )}
      </div>

      {/* Token Budget Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Token Budget</h2>
        <label>
          Target Tokens:{' '}
          <input
            type="number"
            value={targetTokens}
            onChange={e => setTargetTokens(Number(e.target.value))}
          />
        </label>
        <label style={{ marginLeft: '20px' }}>
          Cost Budget ($):{' '}
          <input
            type="number"
            step="0.01"
            value={costBudget}
            onChange={e => setCostBudget(Number(e.target.value))}
          />
        </label>
      </div>

      {/* Token Statistics */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Token Statistics</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <strong>Original:</strong> {tokenStats.originalTokens} tokens
          </div>
          <div>
            <strong>Optimized:</strong> {tokenStats.optimizedTokens} tokens
          </div>
          <div>
            <strong>Savings:</strong> {tokenStats.savings} tokens (
            {tokenStats.savingsPercent.toFixed(1)}%)
          </div>
          <div>
            <strong>Usage:</strong> {tokenStats.usagePercent.toFixed(1)}% of
            budget
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <strong>Cost:</strong> ${costEstimate.optimizedCost.toFixed(4)} (
          {costEstimate.savings > 0 ? 'saved' : 'spent'}{' '}
          ${Math.abs(costEstimate.savings).toFixed(4)})
        </div>
        <div style={{ marginTop: '10px' }}>
          <strong>Strategy:</strong> {strategy}
        </div>
      </div>

      {/* Token Graph */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Token Usage Graph</h2>
        <div
          style={{
            width: '100%',
            height: '30px',
            background: '#e0e0e0',
            borderRadius: '5px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(tokenStats.usagePercent, 100)}%`,
              height: '100%',
              background:
                tokenStats.usagePercent > 100
                  ? '#f44336'
                  : tokenStats.usagePercent > 80
                    ? '#ff9800'
                    : '#4caf50',
              transition: 'width 0.3s',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#000',
              fontWeight: 'bold',
            }}
          >
            {tokenStats.usagePercent.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Optimization Stages */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Optimization Stages</h2>
        {debugInfo.stages.map((stage, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              padding: '10px',
              background: '#f5f5f5',
              borderRadius: '5px',
            }}
          >
            <strong>{stage.name}</strong>
            <div>
              Tokens: {stage.tokensBefore} → {stage.tokensAfter} (
              {stage.tokensBefore - stage.tokensAfter > 0 ? '-' : '+'}
              {Math.abs(stage.tokensBefore - stage.tokensAfter)})
            </div>
            <div>
              Messages: {stage.messagesBefore} → {stage.messagesAfter}
            </div>
            {stage.details && (
              <div style={{ marginTop: '5px', fontSize: '0.9em', color: '#666' }}>
                {stage.details.map((detail, i) => (
                  <div key={i}>{detail}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message Breakdown */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Message Breakdown</h2>
        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
          {debugInfo.messageBreakdown.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: '5px',
                padding: '5px',
                background: msg.modified ? '#fff3cd' : '#f5f5f5',
                borderRadius: '3px',
              }}
            >
              <strong>{msg.role}</strong> ({msg.tokens} tokens)
              {msg.modified && (
                <span style={{ color: '#666', marginLeft: '10px' }}>
                  {msg.modificationDetails}
                </span>
              )}
              <div style={{ fontSize: '0.8em', color: '#666' }}>
                {msg.contentPreview}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compression Logs */}
      {debugInfo.compressionLogs.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Compression Logs</h2>
          {debugInfo.compressionLogs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      )}

      {/* Chat Interface */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Chat</h2>
        <div style={{ marginBottom: '10px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              <strong>{msg.role}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          onKeyPress={e => {
            if (e.key === 'Enter' && e.currentTarget.value) {
              handleSend(e.currentTarget.value)
              e.currentTarget.value = ''
            }
          }}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>

      {/* Debug Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Debug Controls</h2>
        <button onClick={toggle}>
          {enabled ? 'Disable' : 'Enable'} Debugger
        </button>
        <button
          onClick={() => {
            const json = exportDebugInfo()
            console.log('Debug Info:', JSON.parse(json))
            alert('Debug info exported to console')
          }}
          style={{ marginLeft: '10px' }}
        >
          Export Debug Info
        </button>
        {isOptimizing && <span style={{ marginLeft: '10px' }}>Optimizing...</span>}
      </div>
    </div>
  )
}

/**
 * Strategy Comparison Example
 */
export function StrategyComparisonExample() {
  const [messages] = useState([
    { role: 'user' as const, content: 'Hello!' },
    { role: 'assistant' as const, content: 'Hi there!' },
    { role: 'user' as const, content: 'What is React?' },
    { role: 'assistant' as const, content: 'React is a JavaScript library...' },
  ])

  const model: ModelMetadata = {
    id: 'gpt-4',
    maxTokens: 8192,
    inputPricePer1K: 0.03,
  }

  const strategies = [
    'sliding-window',
    'summarize-old',
    'drop-low-priority',
    'hybrid',
  ] as const

  return (
    <div style={{ padding: '20px' }}>
      <h1>Strategy Comparison</h1>
      {strategies.map(strategy => {
        const { tokenStats, diagnostics } = usePromptOptimizer({
          messages: messages as any,
          model,
          targetTokens: 100,
          strategies: [strategy],
          autoOptimize: true,
        })

        return (
          <div key={strategy} style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5' }}>
            <h3>{strategy}</h3>
            <div>Original: {tokenStats.originalTokens} tokens</div>
            <div>Optimized: {tokenStats.optimizedTokens} tokens</div>
            <div>Savings: {tokenStats.savings} tokens ({tokenStats.savingsPercent.toFixed(1)}%)</div>
            <div>Dropped: {diagnostics.droppedMessages} messages</div>
            <div>Summarized: {diagnostics.summarizedMessages} messages</div>
          </div>
        )
      })}
    </div>
  )
}
