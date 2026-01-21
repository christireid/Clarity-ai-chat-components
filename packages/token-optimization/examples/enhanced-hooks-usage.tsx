/**
 * Enhanced React Hooks Usage Examples
 *
 * Comprehensive examples demonstrating all Week 3 hooks:
 * - useContextWindow: Automatic conversation memory management
 * - useQualityRouter: Cascading model selection with quality assessment
 * - useCacheStats: Real-time cache performance monitoring
 * - useEstimateCost: Cost estimation and budget tracking
 */

import React, { useState } from 'react'
import {
  useContextWindow,
  useQualityRouter,
  useCacheStats,
  useEstimateCost,
  useBudgetAlerts,
  MODEL_PRICING_PRESETS,
  type ConversationMessage,
} from '@clarity-chat/token-optimization'

// ============================================================================
// Example 1: Basic Context Window Management
// ============================================================================

/**
 * Simple chat component with automatic context window optimization
 */
export function BasicContextWindowExample() {
  const {
    messages,
    addMessage,
    optimize,
    currentTokens,
    utilization,
    lastOptimization,
  } = useContextWindow({
    maxTokens: 4000,
    strategy: 'sliding-window',
    windowSize: 10,
    autoOptimize: true,
    optimizationThreshold: 0.8,
  })

  const handleSendMessage = async (content: string) => {
    addMessage({ role: 'user', content })

    // Context automatically optimizes when utilization > 80%

    // Simulate AI response
    const aiResponse = await callAI(messages)
    addMessage({ role: 'assistant', content: aiResponse })
  }

  return (
    <div>
      <h2>Chat with Auto-Optimization</h2>

      <div className="stats">
        <span>Tokens: {currentTokens} / 4000</span>
        <span>Utilization: {(utilization * 100).toFixed(1)}%</span>
        {lastOptimization && (
          <span>Saved: {lastOptimization.tokensSaved} tokens</span>
        )}
      </div>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <button onClick={() => optimize()}>
        Optimize Now
      </button>
    </div>
  )
}

// ============================================================================
// Example 2: Quality-Based Model Routing
// ============================================================================

/**
 * Chat with intelligent model routing (cheap → expensive)
 */
export function QualityRouterExample() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')

  const {
    execute,
    isGenerating,
    lastResult,
    stats,
    averageCost,
    successRate,
  } = useQualityRouter({
    provider: 'openai',
    qualityThreshold: 0.7,
  })

  const handleSubmit = async () => {
    const result = await execute(prompt, async (model) => {
      // Your API call here
      const apiResponse = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt, model: model.name }),
      })
      const data = await apiResponse.json()
      return {
        response: data.text,
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
      }
    })

    setResponse(result.response)
  }

  return (
    <div>
      <h2>Smart Model Routing</h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
      />

      <button onClick={handleSubmit} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>

      {lastResult && (
        <div className="result">
          <h3>Response:</h3>
          <p>{response}</p>

          <div className="details">
            <p>Model used: {lastResult.finalModel.name}</p>
            <p>Attempts: {lastResult.attempts.length}</p>
            <p>Cost: ${lastResult.totalCost.toFixed(6)}</p>
            <p>Quality: {(lastResult.attempts[lastResult.attempts.length - 1].quality.score * 100).toFixed(1)}%</p>
          </div>
        </div>
      )}

      <div className="stats">
        <h3>Statistics</h3>
        <p>Total requests: {stats.totalRequests}</p>
        <p>Success rate: {(successRate * 100).toFixed(1)}%</p>
        <p>Average cost: ${averageCost.toFixed(6)}</p>
        <p>Escalation rate: {(stats.escalationRate * 100).toFixed(1)}%</p>
      </div>
    </div>
  )
}

// ============================================================================
// Example 3: Real-Time Cache Performance Monitoring
// ============================================================================

/**
 * Dashboard showing cache performance metrics
 */
export function CacheMonitoringExample({ cache }: { cache: any }) {
  const {
    stats,
    performance,
    updateStats,
  } = useCacheStats({
    cache,
    updateInterval: 5000, // Update every 5 seconds
    avgTokensPerResponse: 500,
    tokenCostPer1M: 2.5, // GPT-4o input cost
  })

  return (
    <div>
      <h2>Cache Performance Dashboard</h2>

      <div className="metrics-grid">
        <div className="metric">
          <h3>Hit Rate</h3>
          <div
            className="percentage"
            style={{ color: performance.color }}
          >
            {(stats.hitRate * 100).toFixed(1)}%
          </div>
          <div className="rating">{performance.rating}</div>
        </div>

        <div className="metric">
          <h3>Operations</h3>
          <div className="count">
            <span className="hits">{stats.hits} hits</span>
            <span className="misses">{stats.misses} misses</span>
          </div>
        </div>

        <div className="metric">
          <h3>Savings</h3>
          <div className="savings">
            <p>{stats.tokensSaved.toLocaleString()} tokens</p>
            <p>${stats.costSaved.toFixed(4)}</p>
          </div>
        </div>

        <div className="metric">
          <h3>Cache Size</h3>
          <div className="size">{stats.size} entries</div>
        </div>
      </div>

      <button onClick={updateStats}>Refresh Stats</button>
    </div>
  )
}

// ============================================================================
// Example 4: Cost Estimation and Tracking
// ============================================================================

/**
 * Cost calculator for different models
 */
export function CostEstimatorExample() {
  const [text, setText] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-4o')

  const { estimate, pricing, setPricing, getBreakdown } = useEstimateCost({
    pricing: MODEL_PRICING_PRESETS[selectedModel],
    estimatedOutputTokens: 500,
    cacheHitRate: 0.6,
    contextOptimizationRatio: 0.5,
    routingSavingsRatio: 0.7,
  })

  const costEstimate = estimate(text)
  const breakdown = getBreakdown(costEstimate.totalCost)

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    setPricing(MODEL_PRICING_PRESETS[model])
  }

  return (
    <div>
      <h2>Cost Estimator</h2>

      <select value={selectedModel} onChange={(e) => handleModelChange(e.target.value)}>
        {Object.keys(MODEL_PRICING_PRESETS).map((model) => (
          <option key={model} value={model}>
            {MODEL_PRICING_PRESETS[model].model}
          </option>
        ))}
      </select>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to estimate cost..."
        rows={10}
      />

      <div className="estimates">
        <h3>Base Cost (No Optimizations)</h3>
        <div className="cost-breakdown">
          <p>Input tokens: {costEstimate.inputTokens}</p>
          <p>Output tokens: {costEstimate.outputTokens}</p>
          <p>Input cost: ${costEstimate.inputCost.toFixed(6)}</p>
          <p>Output cost: ${costEstimate.outputCost.toFixed(6)}</p>
          <p><strong>Total: ${costEstimate.totalCost.toFixed(6)}</strong></p>
        </div>

        <h3>With Optimizations</h3>
        <div className="optimization-breakdown">
          <p>Base cost: ${breakdown.baseCost.toFixed(6)}</p>
          <p>Context savings: -${breakdown.contextSavings.toFixed(6)}</p>
          <p>Cache savings: -${breakdown.cacheSavings.toFixed(6)}</p>
          <p>Routing savings: -${breakdown.routingSavings.toFixed(6)}</p>
          <p><strong>Final cost: ${breakdown.finalCost.toFixed(6)}</strong></p>
          <p className="savings">
            Total savings: {breakdown.savingsPercentage.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Example 5: Budget Alerts and Monitoring
// ============================================================================

/**
 * Budget monitoring with alerts
 */
export function BudgetMonitorExample() {
  const {
    addCost,
    totalCost,
    budgetRemaining,
    budgetUtilization,
    alerts,
    dismiss,
    callCount,
    averageCost,
    costHistory,
  } = useBudgetAlerts({
    dailyBudget: 10, // $10/day
    warningThreshold: 0.75,
    criticalThreshold: 0.9,
  })

  const simulateAPICall = async () => {
    // Simulate an API call with cost
    const cost = Math.random() * 0.05 // Random cost between $0-$0.05
    addCost(cost, {
      timestamp: Date.now(),
      model: 'gpt-4o',
    })
  }

  return (
    <div>
      <h2>Budget Monitor</h2>

      <div className="budget-overview">
        <div className="budget-bar">
          <div
            className="usage"
            style={{
              width: `${Math.min(budgetUtilization * 100, 100)}%`,
              backgroundColor: budgetUtilization > 0.9 ? 'red' : budgetUtilization > 0.75 ? 'orange' : 'green',
            }}
          />
        </div>

        <div className="budget-stats">
          <p>Used: ${totalCost.toFixed(2)} / $10.00</p>
          <p>Remaining: ${budgetRemaining.toFixed(2)}</p>
          <p>Utilization: {(budgetUtilization * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="alerts">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert alert-${alert.severity}`}>
            <p>{alert.message}</p>
            <button onClick={() => dismiss(alert.id)}>Dismiss</button>
          </div>
        ))}
      </div>

      <div className="statistics">
        <h3>Statistics</h3>
        <p>API calls: {callCount}</p>
        <p>Average cost: ${averageCost.toFixed(4)}</p>
      </div>

      <button onClick={simulateAPICall}>Simulate API Call</button>

      <div className="cost-history">
        <h3>Recent Calls</h3>
        {costHistory.slice(-10).reverse().map((entry, i) => (
          <div key={i} className="history-entry">
            <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
            <span>${entry.cost.toFixed(4)}</span>
            <span>Cumulative: ${entry.cumulativeCost.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Example 6: Combined Optimization (All Hooks Together)
// ============================================================================

/**
 * Full-featured chat application using all optimization hooks
 */
export function FullOptimizedChatExample({ cache }: { cache: any }) {
  const [input, setInput] = useState('')

  // Context window management
  const {
    messages,
    addMessage,
    currentTokens,
    utilization,
  } = useContextWindow({
    maxTokens: 8000,
    strategy: 'adaptive',
    autoOptimize: true,
    optimizationThreshold: 0.85,
  })

  // Quality-based routing
  const {
    execute,
    isGenerating,
    lastResult,
    stats: routerStats,
  } = useQualityRouter({
    provider: 'openai',
    qualityThreshold: 0.7,
  })

  // Cache monitoring
  const {
    stats: cacheStats,
    performance,
  } = useCacheStats({
    cache,
    updateInterval: 3000,
    avgTokensPerResponse: 500,
    tokenCostPer1M: 2.5,
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
    dailyBudget: 20,
    warningThreshold: 0.75,
    criticalThreshold: 0.9,
  })

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    addMessage({ role: 'user', content: input })
    setInput('')

    // Generate response with quality routing
    const result = await execute(input, async (model) => {
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: input }],
          model: model.name,
        }),
      })
      const data = await apiResponse.json()
      return {
        response: data.text,
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
      }
    })

    // Add assistant response
    addMessage({ role: 'assistant', content: result.response })

    // Track cost
    addCost(result.totalCost)
  }

  return (
    <div className="optimized-chat">
      <h1>Fully Optimized Chat</h1>

      {/* Budget Alerts */}
      <div className="alerts-container">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert alert-${alert.severity}`}>
            {alert.message}
            <button onClick={() => dismiss(alert.id)}>×</button>
          </div>
        ))}
      </div>

      {/* Dashboard */}
      <div className="dashboard">
        <div className="metric-card">
          <h3>Context Window</h3>
          <div className="progress-bar">
            <div style={{ width: `${utilization * 100}%` }} />
          </div>
          <p>{currentTokens} / 8000 tokens ({(utilization * 100).toFixed(1)}%)</p>
        </div>

        <div className="metric-card">
          <h3>Cache Performance</h3>
          <p className={`status status-${performance.color}`}>
            {(cacheStats.hitRate * 100).toFixed(1)}% hit rate
          </p>
          <p>Saved: {cacheStats.tokensSaved} tokens (${cacheStats.costSaved.toFixed(4)})</p>
        </div>

        <div className="metric-card">
          <h3>Budget</h3>
          <div className="progress-bar">
            <div
              style={{
                width: `${Math.min(budgetUtilization * 100, 100)}%`,
                backgroundColor: budgetUtilization > 0.9 ? 'red' : budgetUtilization > 0.75 ? 'orange' : 'green',
              }}
            />
          </div>
          <p>${totalCost.toFixed(2)} / $20.00 (${budgetRemaining.toFixed(2)} remaining)</p>
        </div>

        <div className="metric-card">
          <h3>Routing Stats</h3>
          <p>Requests: {routerStats.totalRequests}</p>
          <p>Escalations: {(routerStats.escalationRate * 100).toFixed(1)}%</p>
          {lastResult && (
            <p>Last model: {lastResult.finalModel.name}</p>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message message-${msg.role}`}>
              <strong>{msg.role}:</strong>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>

        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <button onClick={handleSendMessage} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Send'}
          </button>
        </div>
      </div>

      {/* Detailed Stats */}
      <details className="detailed-stats">
        <summary>Advanced Statistics</summary>
        <div className="stats-grid">
          <div>
            <h4>Context Optimization</h4>
            <p>Strategy: Adaptive</p>
            <p>Auto-optimize: Enabled</p>
            <p>Threshold: 85%</p>
          </div>

          <div>
            <h4>Quality Routing</h4>
            <p>Provider: OpenAI</p>
            <p>Quality threshold: 70%</p>
            <p>Total cost: ${routerStats.totalCost.toFixed(4)}</p>
          </div>

          <div>
            <h4>Cache</h4>
            <p>Hits: {cacheStats.hits}</p>
            <p>Misses: {cacheStats.misses}</p>
            <p>Size: {cacheStats.size}</p>
          </div>

          <div>
            <h4>Budget</h4>
            <p>Daily limit: $20.00</p>
            <p>Warning: 75%</p>
            <p>Critical: 90%</p>
          </div>
        </div>
      </details>
    </div>
  )
}

// ============================================================================
// Example 7: Message Cost Estimation
// ============================================================================

/**
 * Estimate cost of entire conversation
 */
export function ConversationCostExample() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is React?' },
    { role: 'assistant', content: 'React is a JavaScript library for building user interfaces.' },
  ])

  const { estimateMessages, pricing, setPricing } = useEstimateCost({
    pricing: MODEL_PRICING_PRESETS['gpt-4o'],
    estimatedOutputTokens: 500,
  })

  const conversationCost = estimateMessages(messages)

  return (
    <div>
      <h2>Conversation Cost Calculator</h2>

      <select
        onChange={(e) => setPricing(MODEL_PRICING_PRESETS[e.target.value])}
        defaultValue="gpt-4o"
      >
        {Object.keys(MODEL_PRICING_PRESETS).map((model) => (
          <option key={model} value={model}>
            {MODEL_PRICING_PRESETS[model].model}
          </option>
        ))}
      </select>

      <div className="conversation">
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="cost-summary">
        <h3>Cost Estimate</h3>
        <p>Model: {pricing.model}</p>
        <p>Input tokens: {conversationCost.inputTokens}</p>
        <p>Estimated output: {conversationCost.outputTokens}</p>
        <p>Total tokens: {conversationCost.totalTokens}</p>
        <p><strong>Total cost: ${conversationCost.totalCost.toFixed(6)}</strong></p>
        <p>Cost per token: ${conversationCost.costPerToken.toFixed(8)}</p>
      </div>

      <button
        onClick={() => {
          setMessages([
            ...messages,
            { role: 'user', content: 'Tell me more' },
            { role: 'assistant', content: 'React was created by Facebook...' },
          ])
        }}
      >
        Add Messages
      </button>
    </div>
  )
}

// ============================================================================
// Helper Functions
// ============================================================================

async function callAI(messages: ConversationMessage[]): Promise<string> {
  // Mock implementation
  return 'This is a simulated AI response'
}

// ============================================================================
// Styles (Optional - for demonstration)
// ============================================================================

const styles = `
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.metric {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.alert {
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-warning {
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
}

.alert-critical {
  background: #f8d7da;
  border: 1px solid #f44336;
  color: #721c24;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar > div {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s ease;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.metric-card {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.status {
  font-weight: bold;
  font-size: 1.2em;
}

.status-green { color: #4caf50; }
.status-blue { color: #2196f3; }
.status-yellow { color: #ff9800; }
.status-red { color: #f44336; }
`
