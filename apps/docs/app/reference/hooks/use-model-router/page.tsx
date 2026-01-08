import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'useModelRouter - Clarity Chat Hooks',
  description:
    'Intelligently route requests to different models based on cost, latency, and quality.',
}

export default function UseModelRouterPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useModelRouter</h1>
        <p className="docs-lead">
          Route requests to optimal models based on complexity, cost, and
          performance requirements.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>useModelRouter</code> hook automatically selects the best
          model for each request based on configurable routing rules, balancing
          cost, speed, and quality.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          code={`function Chat() {
  const { route, currentModel } = useModelRouter({
    models: [
      { name: 'gpt-4', cost: 0.03, maxTokens: 8192, quality: 'high' },
      { name: 'gpt-3.5-turbo', cost: 0.001, maxTokens: 4096, quality: 'medium' },
      { name: 'claude-3-haiku', cost: 0.00025, maxTokens: 200000, quality: 'medium' }
    ],
    strategy: 'cost-optimized'
  })

  const handleSend = async (message: string) => {
    const model = await route(message)
    logger.debug(\`Using model: \${model.name}\`)
    // Use selected model for request
  }

  return <div>Current: {currentModel}</div>
}

render(<Chat />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Complexity-Based Routing</h2>
        <CodePlayground
          code={`function SmartChat() {
  const { route } = useModelRouter({
    models: [
      { name: 'gpt-4', quality: 'high', cost: 0.03 },
      { name: 'gpt-3.5-turbo', quality: 'medium', cost: 0.001 }
    ],
    strategy: 'complexity-based',
    complexityThreshold: 0.7,  // 0-1 scale
    complexityIndicators: [
      'code generation',
      'mathematical reasoning',
      'multi-step planning',
      'creative writing'
    ]
  })

  return <ChatWindow onRoute={route} />
}

render(<SmartChat />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable title="useModelRouter Parameters" data={hookParams} />
      </section>

      <section className="docs-section">
        <h2>Routing Strategies</h2>

        <h3>Cost-Optimized</h3>
        <p>Use cheapest model that meets quality requirements:</p>
        <pre>
          <code>{`{
  strategy: 'cost-optimized',
  qualityThreshold: 0.8  // Minimum acceptable quality
}`}</code>
        </pre>

        <h3>Latency-Optimized</h3>
        <p>Use fastest model:</p>
        <pre>
          <code>{`{
  strategy: 'latency-optimized',
  maxLatencyMs: 2000
}`}</code>
        </pre>

        <h3>Quality-Optimized</h3>
        <p>Use highest quality model:</p>
        <pre>
          <code>{`{
  strategy: 'quality-optimized',
  maxCostPer1kTokens: 0.05  // Cost ceiling
}`}</code>
        </pre>

        <h3>Complexity-Based</h3>
        <p>Route based on task complexity:</p>
        <pre>
          <code>{`{
  strategy: 'complexity-based',
  simpleTaskModel: 'gpt-3.5-turbo',
  complexTaskModel: 'gpt-4',
  complexityThreshold: 0.7
}`}</code>
        </pre>

        <h3>Custom Rules</h3>
        <p>Define custom routing logic:</p>
        <pre>
          <code>{`{
  strategy: 'custom',
  routingFn: async (message, models) => {
    if (message.includes('translate')) {
      return models.find(m => m.name === 'gpt-4')
    }
    if (message.length < 100) {
      return models.find(m => m.cost < 0.001)
    }
    return models.find(m => m.quality === 'high')
  }
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Advanced Example</h2>
        <pre>
          <code>{`import { useModelRouter } from '@clarity-chat/react/hooks'

function ProductionChat() {
  const { route, stats, override } = useModelRouter({
    models: [
      {
        name: 'gpt-4-turbo',
        cost: 0.01,
        latencyMs: 1500,
        quality: 0.95,
        contextWindow: 128000
      },
      {
        name: 'gpt-3.5-turbo',
        cost: 0.0015,
        latencyMs: 800,
        quality: 0.85,
        contextWindow: 16385
      },
      {
        name: 'claude-3-haiku',
        cost: 0.00025,
        latencyMs: 500,
        quality: 0.80,
        contextWindow: 200000
      }
    ],
    strategy: 'adaptive',
    
    // Fallback chain
    fallbacks: [
      { from: 'gpt-4-turbo', to: 'gpt-3.5-turbo' },
      { from: 'gpt-3.5-turbo', to: 'claude-3-haiku' }
    ],
    
    // A/B testing
    experimentalRouting: {
      enabled: true,
      trafficSplit: { 'gpt-4-turbo': 0.2, 'gpt-3.5-turbo': 0.8 }
    },
    
    // Budget constraints
    budget: {
      maxCostPerUser: 10.0,
      maxCostPerDay: 1000.0,
      onBudgetExceeded: (user) => {
        logger.warn(\`Budget exceeded for \${user}\`)
      }
    },
    
    // Monitoring
    onRoute: (model, message, decision) => {
      analytics.track('model_routed', {
        model: model.name,
        reason: decision.reason,
        estimatedCost: decision.estimatedCost
      })
    }
  })

  // Manual override for specific cases
  const handleSend = async (message: string) => {
    const model = message.startsWith('/gpt4')
      ? override('gpt-4-turbo')
      : await route(message)
    
    // Send with selected model
  }

  return (
    <div>
      <div className="stats">
        <p>Total cost: \${stats.totalCost.toFixed(4)}</p>
        <p>Avg latency: {stats.avgLatency}ms</p>
        <p>Model usage: {JSON.stringify(stats.modelUsage)}</p>
      </div>
      <ChatWindow onSend={handleSend} />
    </div>
  )
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Start with cost-optimized strategy and monitor quality metrics
          </li>
          <li>Set up fallback chains for reliability</li>
          <li>Track routing decisions for analysis and optimization</li>
          <li>A/B test different strategies with a subset of traffic</li>
          <li>Set budget limits to prevent runaway costs</li>
          <li>Cache routing decisions for similar queries</li>
          <li>
            Consider context window limits when routing long conversations
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/reference/hooks/use-token-optimization"
            className="docs-card"
          >
            <h3>useTokenOptimization</h3>
            <p>Reduce token usage</p>
          </a>
          <a href="/reference/components/usage-dashboard" className="docs-card">
            <h3>UsageDashboard</h3>
            <p>Monitor costs</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const hookParams = [
  {
    name: 'config',
    type: 'ModelRouterConfig',
    required: true,
    description: 'Router configuration',
  },
  {
    name: 'config.models',
    type: 'Model[]',
    required: true,
    description: 'Available models',
  },
  {
    name: 'config.strategy',
    type: "'cost-optimized' | 'latency-optimized' | 'quality-optimized' | 'complexity-based' | 'adaptive' | 'custom'",
    required: true,
    description: 'Routing strategy',
  },
  {
    name: 'config.fallbacks',
    type: 'Fallback[]',
    required: false,
    description: 'Fallback model chain',
  },
  {
    name: 'config.budget',
    type: 'BudgetConfig',
    required: false,
    description: 'Cost constraints',
  },
  {
    name: 'config.onRoute',
    type: '(model: Model, message: string, decision: Decision) => void',
    required: false,
    description: 'Callback after routing decision',
  },
]
