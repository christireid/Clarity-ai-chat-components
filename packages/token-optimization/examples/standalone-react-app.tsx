/**
 * Complete Standalone React App Example
 *
 * This example shows token-optimization working in ANY React app
 * with ZERO dependencies on Clarity Chat components.
 *
 * Works with:
 * - Next.js
 * - Vite
 * - Create React App
 * - Remix
 * - Any React 18+ framework
 */

import React, { useState } from 'react'

// ============================================================================
// IMPORTS - All standalone, no @clarity-chat dependencies!
// ============================================================================

import {
  // Hooks (Week 3)
  useContextWindow,
  useQualityRouter,
  useCacheStats,
  useEstimateCost,
  useBudgetAlerts,
  MODEL_PRICING_PRESETS,
  // Types
  type ConversationMessage,
} from '@clarity-chat/token-optimization'

import {
  // Vision (Week 4)
  VisionTokenCounter,
  ImageOptimizer,
  MultimodalCostEstimator,
  createMultimodalMessage,
  createImageContent,
  MULTIMODAL_MODEL_PRICING,
} from '@clarity-chat/token-optimization/vision'

import {
  // Compression (Week 1)
  SlidingWindowStrategy,
  ImportanceBasedStrategy,
} from '@clarity-chat/token-optimization/compression'

import {
  // Routing (Week 2)
  CascadingRouter,
  createOpenAICascadingRouter,
} from '@clarity-chat/token-optimization/routing'

// ============================================================================
// EXAMPLE 1: Optimized Chat Component
// ============================================================================

export function OptimizedChatExample() {
  const [input, setInput] = useState('')

  // Context management with auto-optimization
  const {
    messages,
    addMessage,
    currentTokens,
    utilization,
    lastOptimization,
  } = useContextWindow({
    maxTokens: 4000,
    strategy: 'adaptive',
    autoOptimize: true,
    optimizationThreshold: 0.8,
  })

  // Quality-based model routing
  const {
    execute,
    isGenerating,
    lastResult,
    averageCost,
  } = useQualityRouter({
    provider: 'openai',
    qualityThreshold: 0.7,
  })

  // Budget monitoring
  const {
    totalCost,
    budgetRemaining,
    budgetUtilization,
    alerts,
    dismiss,
    addCost,
  } = useBudgetAlerts({
    dailyBudget: 10,
    warningThreshold: 0.75,
    criticalThreshold: 0.9,
  })

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    addMessage({ role: 'user', content: input })
    setInput('')

    try {
      // Generate with quality routing
      const result = await execute(input, async (model) => {
        // YOUR API call - works with any provider
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: input }],
            model: model.name,
          }),
        })

        if (!response.ok) throw new Error('API error')

        const data = await response.json()
        return {
          response: data.text,
          inputTokens: data.usage.prompt_tokens,
          outputTokens: data.usage.completion_tokens,
        }
      })

      // Add assistant response
      addMessage({ role: 'assistant', content: result.response })

      // Track cost
      addCost(result.totalCost)
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }

  // YOUR OWN UI - No Clarity Chat components needed!
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Token-Optimized Chat</h1>

      {/* Budget Alerts */}
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: alert.severity === 'critical' ? '#fee' : '#ffc',
            borderRadius: '4px',
          }}
        >
          {alert.message}
          <button onClick={() => dismiss(alert.id)} style={{ float: 'right' }}>
            ×
          </button>
        </div>
      ))}

      {/* Metrics Dashboard - Your own styling! */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
          <h3>Context Window</h3>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#eee',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${utilization * 100}%`,
                height: '100%',
                backgroundColor: utilization > 0.8 ? '#f44' : '#4a4',
              }}
            />
          </div>
          <p>{currentTokens} / 4000 tokens ({(utilization * 100).toFixed(1)}%)</p>
          {lastOptimization && (
            <small>Saved {lastOptimization.tokensSaved} tokens</small>
          )}
        </div>

        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
          <h3>Budget</h3>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#eee',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(budgetUtilization * 100, 100)}%`,
                height: '100%',
                backgroundColor: budgetUtilization > 0.9 ? '#f44' : budgetUtilization > 0.75 ? '#fa4' : '#4a4',
              }}
            />
          </div>
          <p>${totalCost.toFixed(2)} / $10.00</p>
          <small>${budgetRemaining.toFixed(2)} remaining</small>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
          <h3>Routing</h3>
          <p>Avg cost: ${averageCost.toFixed(6)}</p>
          {lastResult && (
            <small>Last model: {lastResult.finalModel.name}</small>
          )}
        </div>
      </div>

      {/* Chat Messages - Your own styling! */}
      <div
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: '10px',
              padding: '8px',
              backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
              borderRadius: '4px',
            }}
          >
            <strong>{msg.role}:</strong>
            <p style={{ margin: '5px 0 0 0' }}>{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Input - Your own styling! */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Type your message..."
          disabled={isGenerating}
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={handleSend}
          disabled={isGenerating}
          style={{
            padding: '10px 20px',
            backgroundColor: isGenerating ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
          }}
        >
          {isGenerating ? 'Generating...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// EXAMPLE 2: Cost Estimation Dashboard
// ============================================================================

export function CostEstimationExample() {
  const [text, setText] = useState('')
  const [model, setModel] = useState('gpt-4o')

  const { estimate, pricing, setPricing, getBreakdown } = useEstimateCost({
    pricing: MODEL_PRICING_PRESETS[model],
    estimatedOutputTokens: 500,
    cacheHitRate: 0.6,
    contextOptimizationRatio: 0.5,
    routingSavingsRatio: 0.7,
  })

  const handleModelChange = (newModel: string) => {
    setModel(newModel)
    setPricing(MODEL_PRICING_PRESETS[newModel])
  }

  const costEstimate = estimate(text)
  const breakdown = getBreakdown(costEstimate.totalCost)

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Cost Calculator</h1>

      {/* Model Selection */}
      <select
        value={model}
        onChange={(e) => handleModelChange(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      >
        {Object.keys(MODEL_PRICING_PRESETS).map((m) => (
          <option key={m} value={m}>
            {MODEL_PRICING_PRESETS[m].model}
          </option>
        ))}
      </select>

      {/* Text Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to estimate cost..."
        rows={10}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          fontFamily: 'monospace',
        }}
      />

      {/* Cost Breakdown */}
      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
        <h3>Base Cost</h3>
        <table style={{ width: '100%', marginBottom: '15px' }}>
          <tbody>
            <tr>
              <td>Input tokens:</td>
              <td>{costEstimate.inputTokens}</td>
            </tr>
            <tr>
              <td>Output tokens:</td>
              <td>{costEstimate.outputTokens}</td>
            </tr>
            <tr>
              <td>Input cost:</td>
              <td>${costEstimate.inputCost.toFixed(6)}</td>
            </tr>
            <tr>
              <td>Output cost:</td>
              <td>${costEstimate.outputCost.toFixed(6)}</td>
            </tr>
            <tr style={{ borderTop: '2px solid #000', fontWeight: 'bold' }}>
              <td>Total:</td>
              <td>${costEstimate.totalCost.toFixed(6)}</td>
            </tr>
          </tbody>
        </table>

        <h3>With Optimizations</h3>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td>Base cost:</td>
              <td>${breakdown.baseCost.toFixed(6)}</td>
            </tr>
            <tr style={{ color: '#4a4' }}>
              <td>Context savings:</td>
              <td>-${breakdown.contextSavings.toFixed(6)}</td>
            </tr>
            <tr style={{ color: '#4a4' }}>
              <td>Cache savings:</td>
              <td>-${breakdown.cacheSavings.toFixed(6)}</td>
            </tr>
            <tr style={{ color: '#4a4' }}>
              <td>Routing savings:</td>
              <td>-${breakdown.routingSavings.toFixed(6)}</td>
            </tr>
            <tr style={{ borderTop: '2px solid #000', fontWeight: 'bold' }}>
              <td>Final cost:</td>
              <td>${breakdown.finalCost.toFixed(6)}</td>
            </tr>
            <tr style={{ color: '#4a4', fontWeight: 'bold' }}>
              <td>Total savings:</td>
              <td>{breakdown.savingsPercentage.toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================================
// EXAMPLE 3: Vision/Multimodal
// ============================================================================

export function VisionExample() {
  const [imageUrl, setImageUrl] = useState('')
  const [width, setWidth] = useState(1024)
  const [height, setHeight] = useState(1024)

  // Vision token counter
  const counter = new VisionTokenCounter({ provider: 'openai' })
  const tokens = counter.count({ dimensions: { width, height } })

  // Image optimizer
  const optimizer = new ImageOptimizer({
    provider: 'openai',
    strategy: 'balanced',
  })
  const optimized = optimizer.optimize({ width, height })

  // Cost estimator
  const estimator = new MultimodalCostEstimator({
    pricing: MULTIMODAL_MODEL_PRICING['gpt-4o'],
  })

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Vision Token Calculator</h1>

      {/* Image Dimensions */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Width:
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
            style={{ marginLeft: '10px', padding: '5px', width: '100px' }}
          />
        </label>
        <label style={{ marginLeft: '20px' }}>
          Height:
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            style={{ marginLeft: '10px', padding: '5px', width: '100px' }}
          />
        </label>
      </div>

      {/* Token Calculation */}
      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
        <h3>Token Count</h3>
        <p>Base tokens: {tokens.baseTokens}</p>
        <p>Tile tokens: {tokens.tileTokens}</p>
        <p>Total tokens: <strong>{tokens.tokens}</strong></p>
        {tokens.tileCount && <p>Tiles: {tokens.tileCount}</p>}
      </div>

      {/* Optimization Result */}
      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
        <h3>Optimized</h3>
        <p>Original: {optimized.tokensBefore} tokens</p>
        <p>Optimized: {optimized.tokensAfter} tokens</p>
        <p>Savings: <strong style={{ color: '#4a4' }}>{(optimized.tokenSavings * 100).toFixed(1)}%</strong></p>
        <p>Dimensions: {optimized.dimensions.width}×{optimized.dimensions.height}</p>

        <h4>Steps:</h4>
        <ul>
          {optimized.optimizationSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>

        {optimized.recommendations.length > 0 && (
          <>
            <h4>Recommendations:</h4>
            <ul>
              {optimized.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// EXAMPLE 4: Cache Performance Monitoring
// ============================================================================

export function CacheMonitoringExample({ cache }: { cache: any }) {
  const {
    stats,
    performance,
    updateStats,
    resetStats,
  } = useCacheStats({
    cache,
    updateInterval: 5000,
    avgTokensPerResponse: 500,
    tokenCostPer1M: 2.5,
  })

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Cache Performance</h1>

      {/* Hit Rate */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{
          color: performance.color === 'green' ? '#4a4' :
                 performance.color === 'blue' ? '#44a' :
                 performance.color === 'yellow' ? '#aa4' : '#a44'
        }}>
          {(stats.hitRate * 100).toFixed(1)}% Hit Rate
        </h2>
        <p>Rating: {performance.rating}</p>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
          <h3>Operations</h3>
          <p>Hits: {stats.hits}</p>
          <p>Misses: {stats.misses}</p>
          <p>Total: {stats.totalOperations}</p>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
          <h3>Savings</h3>
          <p>Tokens: {stats.tokensSaved.toLocaleString()}</p>
          <p>Cost: ${stats.costSaved.toFixed(4)}</p>
          <p>Size: {stats.size} entries</p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={updateStats} style={{ padding: '10px 20px' }}>
          Refresh
        </button>
        <button onClick={resetStats} style={{ padding: '10px 20px' }}>
          Reset Stats
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN APP - Choose your example
// ============================================================================

export default function StandaloneApp() {
  const [example, setExample] = useState<'chat' | 'cost' | 'vision' | 'cache'>('chat')

  return (
    <div>
      {/* Example Selector */}
      <div style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
        <button onClick={() => setExample('chat')} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Chat Example
        </button>
        <button onClick={() => setExample('cost')} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Cost Calculator
        </button>
        <button onClick={() => setExample('vision')} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Vision Tokens
        </button>
        <button onClick={() => setExample('cache')} style={{ padding: '8px 16px' }}>
          Cache Monitor
        </button>
      </div>

      {/* Render Selected Example */}
      {example === 'chat' && <OptimizedChatExample />}
      {example === 'cost' && <CostEstimationExample />}
      {example === 'vision' && <VisionExample />}
      {example === 'cache' && <CacheMonitoringExample cache={null} />}
    </div>
  )
}

// ============================================================================
// USAGE IN DIFFERENT FRAMEWORKS
// ============================================================================

// Next.js (App Router)
// ----------------------
// app/page.tsx
// 'use client'
// import StandaloneApp from './standalone-app'
// export default function Page() { return <StandaloneApp /> }

// Next.js (Pages Router)
// ----------------------
// pages/index.tsx
// import StandaloneApp from '../components/standalone-app'
// export default StandaloneApp

// Vite / Create React App
// -----------------------
// src/App.tsx
// import StandaloneApp from './standalone-app'
// function App() { return <StandaloneApp /> }
// export default App

// Remix
// -----
// app/routes/_index.tsx
// import StandaloneApp from '~/components/standalone-app'
// export default StandaloneApp
