'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useTokenOptimization Hook | Clarity Chat',
  description: 'Coordinate token budgeting, compression, caching, and routing for cost-efficient AI conversations.',
}

const useTokenOptimizationOptions: Prop[] = [
  {
    name: 'maxContextWindow',
    type: 'number',
    default: '128000',
    description: 'Maximum context window size in tokens.',
  },
  {
    name: 'budgetUsd',
    type: 'number',
    description: 'Maximum budget in USD for token usage.',
  },
  {
    name: 'targets',
    type: '{ latencyMs?: number; accuracy?: number; costSavings?: number }',
    description: 'Optimization targets (latency, accuracy, cost savings).',
  },
  {
    name: 'enableCompression',
    type: 'boolean',
    default: 'true',
    description: 'Enable prompt compression when nearing budget.',
  },
  {
    name: 'enableCaching',
    type: 'boolean',
    default: 'true',
    description: 'Enable smart caching to reuse responses.',
  },
  {
    name: 'enableRouting',
    type: 'boolean',
    default: 'true',
    description: 'Enable model routing for cost optimization.',
  },
]

const useTokenOptimizationReturn: Prop[] = [
  {
    name: 'optimizeContext',
    type: '(input: ContextInput) => OptimizedContext',
    description: 'Function to optimize context based on budget and targets.',
  },
  {
    name: 'recommendation',
    type: '{ model: string; provider: string; rationale: string }',
    description: 'Recommended model/provider based on optimization targets.',
  },
  {
    name: 'state',
    type: '{ budget: number; savings: number; compressionRatio: number; throttlingStatus: string }',
    description: 'Current optimization state and statistics.',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset optimization state.',
  },
]

export default function UseTokenOptimizationPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useTokenOptimization</h1>

      <p className="lead">
        Central coordinator for Clarity Chat's token optimization suite. Automatically
        balances context window allocation, compression, caching, throttling, and provider routing.
      </p>

      <Callout type="info" title="Cost Optimization">
        <p>
          This hook can reduce token costs by 40-60% through intelligent compression,
          caching, and model routing while maintaining quality.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useTokenOptimization } from '@clarity-chat/react'

function Chat() {
  const { optimizeContext, recommendation, state } = useTokenOptimization({
    maxContextWindow: 128_000,
    budgetUsd: 25,
    targets: {
      latencyMs: 4_000,
      accuracy: 0.92,
      costSavings: 0.6,
    },
  })

  // Use optimized context when sending messages
  const optimized = optimizeContext({
    systemPrompt: 'You are a helpful assistant.',
    recentMessages: messages,
  })

  return (
    <div>
      <div>Recommended: {recommendation.model}</div>
      <div>Savings: {state.savings.toFixed(2)}%</div>
      <ChatWindow messages={optimized.messages} />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with useTokenOptimization:
        </p>
        <CodePlayground
          initialCode={`import { useTokenOptimization } from '@clarity-chat/react'

function Example() {
  const { optimizeContext, recommendation, state } = useTokenOptimization({
    maxContextWindow: 8000,
    budgetUsd: 10,
    targets: {
      costSavings: 0.5,
    },
  })

  const optimized = optimizeContext({
    systemPrompt: 'You are helpful.',
    recentMessages: [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ],
  })

  return (
    <div>
      <p>Model: {recommendation.model}</p>
      <p>Savings: {state.savings}%</p>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Budget Constraints</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useTokenOptimization } from '@clarity-chat/react'

function BudgetChat() {
  const { optimizeContext, state } = useTokenOptimization({
    maxContextWindow: 32_000,
    budgetUsd: 5, // $5 budget
    targets: {
      costSavings: 0.7, // Target 70% savings
    },
  })

  // Automatically compresses when budget is exceeded
  const optimized = optimizeContext({
    systemPrompt: systemPrompt,
    recentMessages: messages,
  })

  if (state.budget > budgetUsd * 0.9) {
    return <div>Warning: Approaching budget limit</div>
  }

  return <ChatWindow messages={optimized.messages} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Model Routing</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useTokenOptimization, useModelRouter } from '@clarity-chat/react'

function OptimizedChat() {
  const { optimizeContext, recommendation } = useTokenOptimization({
    maxContextWindow: 128_000,
    enableRouting: true,
    targets: {
      latencyMs: 2000,
      accuracy: 0.9,
      costSavings: 0.5,
    },
  })

  // Use recommended model
  const chat = useClarityChat({
    api: '/api/chat',
    model: recommendation.model, // Use optimized model
  })

  return <ChatWindow messages={chat.messages} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Compression</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useTokenOptimization } from '@clarity-chat/react'

function CompressedChat() {
  const { optimizeContext, state } = useTokenOptimization({
    maxContextWindow: 16_000,
    enableCompression: true,
    targets: {
      costSavings: 0.6,
    },
  })

  // Context is automatically compressed when needed
  const optimized = optimizeContext({
    systemPrompt: longSystemPrompt,
    recentMessages: longMessageHistory,
  })

  return (
    <div>
      {state.compressionRatio > 0 && (
        <div>Compressed by {state.compressionRatio.toFixed(1)}%</div>
      )}
      <ChatWindow messages={optimized.messages} />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useTokenOptimizationOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useTokenOptimizationReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">What It Does</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Evaluates conversation state</strong> - Analyzes token counts, roles, and metadata</li>
          <li><strong>Optimizes context</strong> - Returns trimmed context bundles respecting budgets</li>
          <li><strong>Triggers compression</strong> - Automatically compresses when nearing budget</li>
          <li><strong>Recommends models</strong> - Suggests optimal model/provider based on targets</li>
          <li><strong>Integrates caching</strong> - Works with useSmartCache to reuse responses</li>
          <li><strong>Tracks savings</strong> - Provides real-time savings statistics</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related Hooks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-token-tracker" className="docs-card">
            <h3>useTokenTracker Hook</h3>
            <p>Live token and cost tracking</p>
          </a>
          <a href="/reference/hooks/use-model-router" className="docs-card">
            <h3>useModelRouter Hook</h3>
            <p>Intelligent model routing</p>
          </a>
          <a href="/reference/hooks/use-smart-cache" className="docs-card">
            <h3>useSmartCache Hook</h3>
            <p>Response caching</p>
          </a>
          <a href="/guides/token-optimization" className="docs-card">
            <h3>Token Optimization Guide</h3>
            <p>Complete optimization guide</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'useTokenTracker', href: '/reference/hooks/use-token-tracker' }}
        next={{ title: 'useModelRouter', href: '/reference/hooks/use-model-router' }}
      />
    </>
  )
}
