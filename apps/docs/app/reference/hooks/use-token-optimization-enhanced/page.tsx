import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useTokenOptimizationEnhanced - Clarity Chat Components',
  description: 'Comprehensive token optimization hook with TOON support, prompt caching, semantic caching, and advanced features.',
}

const optionsProps: Prop[] = [
  {
    name: 'model',
    type: 'ModelName',
    description: 'Model to use for tokenization and optimization',
  },
  {
    name: 'enableToon',
    type: 'boolean',
    description: 'Enable TOON format optimization (30-60% savings on structured data)',
  },
  {
    name: 'enableAccurateTokenization',
    type: 'boolean',
    description: 'Enable accurate tokenization using tiktoken',
  },
  {
    name: 'enablePromptCaching',
    type: 'boolean',
    description: 'Enable prompt caching (50-90% savings)',
  },
  {
    name: 'cachingProvider',
    type: '"anthropic" | "openai" | "auto"',
    description: 'Prompt caching provider',
  },
  {
    name: 'enableSemanticCaching',
    type: 'boolean',
    description: 'Enable semantic caching for similar queries',
  },
  {
    name: 'similarityThreshold',
    type: 'number',
    description: 'Similarity threshold for semantic caching (0-1)',
  },
  {
    name: 'enablePromptCompression',
    type: 'boolean',
    description: 'Enable prompt compression',
  },
  {
    name: 'compressionLevel',
    type: '"conservative" | "balanced" | "aggressive"',
    description: 'Compression aggressiveness',
  },
  {
    name: 'enableCostTracking',
    type: 'boolean',
    description: 'Enable real-time cost tracking',
  },
  {
    name: 'enableHistoryLimiting',
    type: 'boolean',
    description: 'Enable history limiting',
  },
  {
    name: 'enableThrottling',
    type: 'boolean',
    description: 'Enable request throttling',
  },
  {
    name: 'enableModelRouting',
    type: 'boolean',
    description: 'Enable intelligent model routing',
  },
]

export default function UseTokenOptimizationEnhancedPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useTokenOptimizationEnhanced</h1>
        <p className="docs-lead">
          Comprehensive token optimization hook with TOON support, prompt caching, semantic caching, history limiting, model routing, and advanced features.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Optimize tokens with TOON format (30-60% savings)',
          'Enable prompt caching (50-90% savings)',
          'Use semantic caching for similar queries',
          'Configure history limiting and throttling',
          'Enable intelligent model routing',
          'Track costs and optimization statistics',
        ]}
      />

      <Callout type="info">
        <p>
          <strong>Unified Hook:</strong> This hook combines all token optimization features from the basic <code>useTokenOptimization</code> hook with enhanced capabilities.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Enable basic token optimization:
        </p>
        <CodePlayground
          initialCode={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function OptimizedChat({ messages }: { messages: Message[] }) {
  const {
    optimizedMessages,
    stats,
    cost,
    optimize,
  } = useTokenOptimizationEnhanced({
    model: 'gpt-4',
    enableToon: true,
    enablePromptCaching: true,
    enableCostTracking: true,
  })

  React.useEffect(() => {
    optimize(messages)
  }, [messages, optimize])

  return (
    <div>
      <div>Tokens saved: {stats?.tokensSaved || 0}</div>
      <div>Cost: ${cost?.total || 0}</div>
      <ChatWindow messages={optimizedMessages} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>TOON Optimization</h2>
        <p>
          Enable TOON format for structured data (30-60% token savings):
        </p>
        <CodePlayground
          initialCode={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function ToonOptimized() {
  const { optimizedMessages, stats } = useTokenOptimizationEnhanced({
    enableToon: true,
    toonMinSavings: 0.3,  // Only use TOON if savings >= 30%
  })

  return (
    <div>
      {stats?.toonSavings && (
        <div>TOON saved {stats.toonSavings} tokens</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Prompt Caching</h2>
        <p>
          Enable prompt caching for repeated system prompts (50-90% savings):
        </p>
        <CodePlayground
          initialCode={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function CachedPrompts() {
  const { optimizedMessages, cacheStats } = useTokenOptimizationEnhanced({
    enablePromptCaching: true,
    cachingProvider: 'anthropic',  // or 'openai' or 'auto'
  })

  return (
    <div>
      {cacheStats && (
        <div>
          Cache hits: {cacheStats.hits}
          Cache savings: {cacheStats.tokensSaved} tokens
        </div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Semantic Caching</h2>
        <p>
          Cache semantically similar queries:
        </p>
        <CodePlayground
          initialCode={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function SemanticCached() {
  const { optimizedMessages } = useTokenOptimizationEnhanced({
    enableSemanticCaching: true,
    similarityThreshold: 0.85,  // 85% similarity required
  })

  // Similar queries will reuse cached responses
  return <ChatWindow messages={optimizedMessages} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>History Limiting</h2>
        <p>
          Automatically limit conversation history to stay within token budgets:
        </p>
        <CodePlayground
          initialCode={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function LimitedHistory() {
  const { optimizedMessages } = useTokenOptimizationEnhanced({
    enableHistoryLimiting: true,
    historyLimiting: {
      maxMessages: 50,
      maxTokens: 8000,
      strategy: 'keep-recent',  // or 'keep-important'
    },
  })

  return <ChatWindow messages={optimizedMessages} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Model Routing</h2>
        <p>
          Intelligently route to cheaper models when appropriate:
        </p>
        <CodePlayground
          initialCode={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function RoutedModels() {
  const { optimizedMessages, routingStats } = useTokenOptimizationEnhanced({
    enableModelRouting: true,
    modelRouting: {
      primaryModel: 'gpt-4',
      fallbackModels: ['gpt-3.5-turbo'],
      complexityThreshold: 0.7,
    },
  })

  return (
    <div>
      {routingStats && (
        <div>Estimated savings: ${routingStats.estimatedSavings}</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Cost Tracking</h2>
        <p>
          Track real-time costs across all optimizations:
        </p>
        <CodePlayground
          initialCode={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function CostTracking() {
  const { cost, stats } = useTokenOptimizationEnhanced({
    enableCostTracking: true,
    enableStats: true,
  })

  return (
    <div>
      <div>Total cost: ${cost?.total || 0}</div>
      <div>Input cost: ${cost?.input || 0}</div>
      <div>Output cost: ${cost?.output || 0}</div>
      <div>Tokens saved: {stats?.totalTokensSaved || 0}</div>
      <div>Savings: ${stats?.costSavings || 0}</div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Options</h2>
        <PropsTable props={optionsProps} />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ul>
          <li><code>optimizedMessages</code>: Optimized message array</li>
          <li><code>stats</code>: Optimization statistics (tokens saved, cache hits, etc.)</li>
          <li><code>cost</code>: Cost calculations (total, input, output)</li>
          <li><code>optimize</code>: Function to trigger optimization</li>
          <li><code>cacheStats</code>: Prompt cache statistics</li>
          <li><code>routingStats</code>: Model routing statistics</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Enable <code>enableToon</code> for structured data (JSON, arrays, objects)</li>
          <li>Use <code>enablePromptCaching</code> when system prompts are repeated</li>
          <li>Set <code>similarityThreshold</code> between 0.8-0.9 for semantic caching</li>
          <li>Enable <code>enableHistoryLimiting</code> for long conversations</li>
          <li>Use <code>enableModelRouting</code> to reduce costs on simple queries</li>
          <li>Enable <code>enableCostTracking</code> to monitor spending</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/hooks/use-token-budget-monitor">useTokenBudgetMonitor</a> - Real-time budget monitoring</li>
          <li><a href="/reference/hooks/use-context-monitor">useContextMonitor</a> - Context utilization monitoring</li>
          <li><a href="/reference/components/token-counter">TokenCounter</a> - Token usage display</li>
          <li><a href="/guides/token-optimization">Token Optimization Guide</a> - Optimization strategies</li>
        </ul>
      </section>
    </div>
  )
}
