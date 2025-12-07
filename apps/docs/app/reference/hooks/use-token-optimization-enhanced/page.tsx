'use client'

import { useState, useCallback } from 'react'
import { ToastProvider, useTokenOptimizationEnhanced } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Basic demo component
function BasicOptimizationDemo() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    optimizeData,
    optimizePrompt,
    stats,
  } = useTokenOptimizationEnhanced({
    preset: 'balanced',
  })

  const handleOptimize = useCallback(async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const optimized = await optimizeData({ text: input })
      setResult(optimized.content)
    } catch (err) {
      console.error('Optimization error:', err)
    } finally {
      setLoading(false)
    }
  }, [input, optimizeData])

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg p-4">
      <div className="space-y-4">
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text or JSON to optimize..."
            className="w-full px-3 py-2 border border-border rounded min-h-[100px]"
          />
        </div>
        <button
          onClick={handleOptimize}
          disabled={!input.trim() || loading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
          aria-label="Optimize content"
        >
          {loading ? 'Optimizing...' : 'Optimize'}
        </button>
        {result && (
          <div className="p-3 bg-muted rounded">
            <p className="text-sm font-semibold mb-1">Optimized:</p>
            <p className="text-sm">{result}</p>
          </div>
        )}
        {stats.overall.totalTokensSaved > 0 && (
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <p className="text-sm">
              Saved: {stats.overall.totalTokensSaved} tokens ({stats.overall.averageSavingsPercent.toFixed(1)}%)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const enhancedTokenOptimizationOptionsProps: Prop[] = [
  {
    name: 'model',
    type: 'ModelName',
    description: 'Model to use for token counting and cost calculation (e.g., "gpt-4", "claude-3-5-sonnet").',
  },
  {
    name: 'preset',
    type: '"aggressive" | "balanced" | "conservative" | "realtime"',
    description: 'Configuration preset for quick setup. Overrides individual options.',
  },
  {
    name: 'enableToon',
    type: 'boolean',
    description: 'Enable TOON format optimization (30-60% savings on structured data).',
  },
  {
    name: 'toonMinSavings',
    type: 'number',
    description: 'Minimum TOON savings threshold (percentage) to use TOON format.',
  },
  {
    name: 'enableAccurateTokenization',
    type: 'boolean',
    description: 'Enable accurate tokenization using js-tiktoken (slower but precise).',
  },
  {
    name: 'enablePromptCaching',
    type: 'boolean',
    description: 'Enable prompt caching (50-90% savings on repeated prompts).',
  },
  {
    name: 'cachingProvider',
    type: '"anthropic" | "openai" | "auto"',
    description: 'Prompt caching provider. "auto" detects from model.',
  },
  {
    name: 'enableSemanticCaching',
    type: 'boolean',
    description: 'Enable semantic caching (similarity-based response reuse).',
  },
  {
    name: 'similarityThreshold',
    type: 'number',
    description: 'Similarity threshold for semantic caching (0-1).',
  },
  {
    name: 'enablePromptCompression',
    type: 'boolean',
    description: 'Enable prompt compression (20-35% savings).',
  },
  {
    name: 'compressionLevel',
    type: '"conservative" | "balanced" | "aggressive"',
    description: 'Compression aggressiveness level.',
  },
  {
    name: 'enableCostTracking',
    type: 'boolean',
    description: 'Enable real-time cost tracking.',
  },
  {
    name: 'enableStats',
    type: 'boolean',
    description: 'Enable statistics collection.',
  },
  {
    name: 'enableHistoryLimiting',
    type: 'boolean',
    description: 'Enable history limiting to trim old messages.',
  },
  {
    name: 'historyLimiting',
    type: 'HistoryLimitingOptions',
    description: 'History limiting configuration options.',
  },
  {
    name: 'enableThrottling',
    type: 'boolean',
    description: 'Enable request throttling to avoid rate limits.',
  },
  {
    name: 'throttling',
    type: 'ThrottlingOptions',
    description: 'Throttling configuration options.',
  },
  {
    name: 'enableModelRouting',
    type: 'boolean',
    description: 'Enable model routing based on query complexity.',
  },
  {
    name: 'modelRouting',
    type: 'ModelRoutingOptions',
    description: 'Model routing configuration options.',
  },
  {
    name: 'enableReferences',
    type: 'boolean',
    description: 'Enable reference system for large data (store externally, reference in prompt).',
  },
  {
    name: 'references',
    type: 'ReferenceOptions',
    description: 'Reference system configuration options.',
  },
  {
    name: 'enableOutputLimits',
    type: 'boolean',
    description: 'Enable output limits to control response length.',
  },
  {
    name: 'outputLimits',
    type: 'OutputLimitOptions',
    description: 'Output limit configuration options.',
  },
  {
    name: 'enableBatching',
    type: 'boolean',
    description: 'Enable request batching to reduce HTTP overhead.',
  },
  {
    name: 'batching',
    type: 'BatchingOptions',
    description: 'Batching configuration options.',
  },
  {
    name: 'enablePrefilling',
    type: 'boolean',
    description: 'Enable response prefilling to skip LLM preambles.',
  },
  {
    name: 'prefillConfig',
    type: 'PrefillConfig',
    description: 'Prefill configuration options.',
  },
  {
    name: 'enablePromptStructure',
    type: 'boolean',
    description: 'Enable question-at-end prompt restructuring for better cache reuse.',
  },
  {
    name: 'promptStructureOptions',
    type: 'PromptStructureOptions',
    description: 'Prompt structure configuration options.',
  },
]

const enhancedTokenOptimizationReturnProps: Prop[] = [
  {
    name: 'optimizeData',
    type: '(data: any) => Promise<EnhancedOptimizationResult>',
    description: 'Optimize structured data (auto TOON/JSON). Returns optimized content with savings stats.',
  },
  {
    name: 'optimizePrompt',
    type: '(prompt: string) => Promise<EnhancedOptimizationResult>',
    description: 'Optimize a text prompt using compression and caching.',
  },
  {
    name: 'prepareMessages',
    type: '(messages: CoreMessage[]) => Promise<CoreMessage[]>',
    description: 'Prepare messages with cache control, compression, and history limiting.',
  },
  {
    name: 'optimizeHistory',
    type: '(messages: CoreMessage[]) => Promise<CoreMessage[]>',
    description: 'Optimize conversation history (trim, compress, limit).',
  },
  {
    name: 'routeQuery',
    type: '(query: string) => Promise<ModelName>',
    description: 'Route query to appropriate model based on complexity.',
  },
  {
    name: 'getPrefill',
    type: '(format: "json" | "xml" | "markdown") => string',
    description: 'Get prefill string for response format (e.g., "{" for JSON).',
  },
  {
    name: 'stats',
    type: 'EnhancedOptimizationStats',
    description: 'Comprehensive statistics on all optimizations applied.',
  },
  {
    name: 'resetStats',
    type: '() => void',
    description: 'Reset all statistics to zero.',
  },
]

export const dynamic = 'force-dynamic'

export default function UseTokenOptimizationEnhancedPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>useTokenOptimizationEnhanced</h1>

        <p className="lead">
          A comprehensive token optimization hook that combines all optimization features including TOON format,
          prompt caching, semantic caching, compression, cost tracking, history limiting, model routing, and more.
        </p>

        <Callout type="info">
          <p>
            This is the <strong>recommended</strong> token optimization hook. The older{' '}
            <a href="/reference/hooks/use-token-optimization">useTokenOptimization</a> is deprecated.
          </p>
        </Callout>

        <ViewInStorybook component="useTokenOptimizationEnhanced" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Try optimizing text or JSON data! See how different optimizations reduce token usage.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const { optimizeData, stats } = useTokenOptimizationEnhanced({
    preset: 'balanced',
  })

  const handleOptimize = async () => {
    const data = { name: 'Alice', age: 30, city: 'San Francisco' }
    const result = await optimizeData(data)
    console.log('Optimized:', result.content)
    console.log('Savings:', stats.overall.totalTokensSaved)
  }

  return (
    <div>
      <button onClick={handleOptimize}>Optimize</button>
      <p>Tokens saved: {stats.overall.totalTokensSaved}</p>
    </div>
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'
import type { EnhancedTokenOptimizationOptions, EnhancedOptimizationStats } from '@clarity-chat/react'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          Use a preset for quick setup:
        </p>

        <ComponentPreview
          title="Simple Optimization with Preset"
          description="Basic optimization using a preset configuration"
          code={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function SimpleOptimization() {
  const {
    optimizeData,
    optimizePrompt,
    stats,
  } = useTokenOptimizationEnhanced({
    preset: 'balanced', // 'aggressive' | 'balanced' | 'conservative' | 'realtime'
  })

  const handleOptimize = async () => {
    const result = await optimizeData({ name: 'Alice', age: 30 })
    console.log('Optimized:', result.content)
    console.log('Savings:', stats.overall.totalTokensSaved)
  }

  return (
    <div>
      <button onClick={handleOptimize}>Optimize</button>
    </div>
  )
}`}
        >
          <BasicOptimizationDemo />
        </ComponentPreview>

        <h2 id="presets">Presets</h2>

        <p>
          Choose a preset based on your needs:
        </p>

        <ul>
          <li>
            <strong>aggressive:</strong> All optimizations enabled, maximum savings (TOON, caching, compression, routing, prefilling)
          </li>
          <li>
            <strong>balanced:</strong> Key optimizations, good UX (TOON, caching, compression, history limiting, prefilling)
          </li>
          <li>
            <strong>conservative:</strong> Safe optimizations only (TOON, compression)
          </li>
          <li>
            <strong>realtime:</strong> Optimized for low latency (TOON, semantic caching, conservative compression, no prompt caching)
          </li>
        </ul>

        <h2 id="toon-optimization">TOON Optimization</h2>

        <p>
          TOON (Token-Oriented Object Notation) provides 30-60% savings on structured data:
        </p>

        <EnhancedCodeBlock
          code={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function ToonOptimization() {
  const { optimizeData } = useTokenOptimizationEnhanced({
    enableToon: true,
    toonMinSavings: 20, // Only use TOON if savings >= 20%
  })

  const handleOptimize = async () => {
    const data = {
      users: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
      ],
    }

    const result = await optimizeData(data)
    // If TOON is beneficial, result.format will be 'toon'
    // Otherwise, result.format will be 'json'
    console.log('Format:', result.format)
    console.log('Content:', result.content)
  }

  return <button onClick={handleOptimize}>Optimize with TOON</button>
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="prompt-caching">Prompt Caching</h2>

        <p>
          Prompt caching provides 50-90% savings on repeated prompts:
        </p>

        <EnhancedCodeBlock
          code={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function PromptCaching() {
  const { prepareMessages } = useTokenOptimizationEnhanced({
    enablePromptCaching: true,
    cachingProvider: 'anthropic', // or 'openai' or 'auto'
  })

  const handlePrepare = async () => {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the weather?' },
    ]

    // Messages are prepared with cache control
    const prepared = await prepareMessages(messages)
    // System message will be cached on first use
    // Subsequent requests reuse cached tokens
  }

  return <button onClick={handlePrepare}>Prepare Messages</button>
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="semantic-caching">Semantic Caching</h2>

        <p>
          Semantic caching reuses responses for similar queries:
        </p>

        <EnhancedCodeBlock
          code={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function SemanticCaching() {
  const { optimizePrompt } = useTokenOptimizationEnhanced({
    enableSemanticCaching: true,
    similarityThreshold: 0.85, // 85% similarity required
  })

  const handleOptimize = async () => {
    // Similar prompts will reuse cached responses
    const result1 = await optimizePrompt('What is the weather in SF?')
    const result2 = await optimizePrompt('What is the weather in San Francisco?')
    // result2 may reuse result1 if similarity is high enough
  }

  return <button onClick={handleOptimize}>Optimize with Semantic Cache</button>
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="prompt-compression">Prompt Compression</h2>

        <p>
          Prompt compression provides 20-35% savings:
        </p>

        <EnhancedCodeBlock
          code={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function PromptCompression() {
  const { optimizePrompt } = useTokenOptimizationEnhanced({
    enablePromptCompression: true,
    compressionLevel: 'balanced', // 'conservative' | 'balanced' | 'aggressive'
  })

  const handleCompress = async () => {
    const longPrompt = \`You are a helpful assistant. Please provide detailed,
    comprehensive answers to user questions. Be thorough and explain concepts
    clearly. Always consider multiple perspectives and provide balanced views.\`

    const result = await optimizePrompt(longPrompt)
    console.log('Original tokens:', result.tokens.original)
    console.log('Compressed tokens:', result.tokens.optimized)
    console.log('Savings:', result.optimizations.compression?.savingsPercent)
  }

  return <button onClick={handleCompress}>Compress Prompt</button>
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="history-limiting">History Limiting</h2>

        <p>
          Automatically trim old messages to stay within token budget:
        </p>

        <EnhancedCodeBlock
          code={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function HistoryLimiting() {
  const { optimizeHistory } = useTokenOptimizationEnhanced({
    enableHistoryLimiting: true,
    historyLimiting: {
      maxTokens: 8000,
      keepSystem: true,
      keepRecent: 5, // Keep last 5 messages
      strategy: 'oldest-first',
    },
  })

  const handleOptimize = async () => {
    const messages = [
      { role: 'system', content: 'You are helpful.' },
      { role: 'user', content: 'Message 1' },
      { role: 'assistant', content: 'Response 1' },
      // ... many more messages
    ]

    // Oldest messages are trimmed to stay within budget
    const optimized = await optimizeHistory(messages)
  }

  return <button onClick={handleOptimize}>Optimize History</button>
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="model-routing">Model Routing</h2>

        <p>
          Automatically route queries to appropriate models based on complexity:
        </p>

        <EnhancedCodeBlock
          code={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function ModelRouting() {
  const { routeQuery } = useTokenOptimizationEnhanced({
    enableModelRouting: true,
    modelRouting: {
      simpleModel: 'gpt-3.5-turbo',
      complexModel: 'gpt-4',
      complexityThreshold: 100, // tokens
    },
  })

  const handleRoute = async () => {
    const simpleQuery = 'What is 2+2?'
    const complexQuery = 'Explain quantum computing in detail with examples.'

    const model1 = await routeQuery(simpleQuery) // Returns 'gpt-3.5-turbo'
    const model2 = await routeQuery(complexQuery) // Returns 'gpt-4'
  }

  return <button onClick={handleRoute}>Route Query</button>
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="response-prefilling">Response Prefilling</h2>

        <p>
          Skip LLM preambles by prefilling response format:
        </p>

        <EnhancedCodeBlock
          code={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function ResponsePrefilling() {
  const { getPrefill } = useTokenOptimizationEnhanced({
    enablePrefilling: true,
  })

  const handleGetPrefill = () => {
    const jsonPrefill = getPrefill('json') // Returns '{'
    const xmlPrefill = getPrefill('xml') // Returns '<'
    const markdownPrefill = getPrefill('markdown') // Returns '#'

    // Use in API call to skip preamble tokens
    // e.g., systemPrompt: 'Respond in JSON format. Start with: {'
  }

  return <button onClick={handleGetPrefill}>Get Prefill</button>
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="cost-tracking">Cost Tracking</h2>

        <p>
          Track real-time costs:
        </p>

        <EnhancedCodeBlock
          code={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function CostTracking() {
  const { stats } = useTokenOptimizationEnhanced({
    model: 'gpt-4',
    enableCostTracking: true,
  })

  return (
    <div>
      <p>Total Cost: ${stats.costs.totalCost.toFixed(4)}</p>
      <p>Input Cost: ${stats.costs.inputCost.toFixed(4)}</p>
      <p>Output Cost: ${stats.costs.outputCost.toFixed(4)}</p>
      <p>Savings: ${stats.costs.savingsFromOptimization.toFixed(4)}</p>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="options">Options</h2>

        <PropsTable props={enhancedTokenOptimizationOptionsProps} />

        <h2 id="return-values">Return Values</h2>

        <PropsTable props={enhancedTokenOptimizationReturnProps} />

        <h2 id="statistics">Statistics</h2>

        <p>
          The <code>stats</code> object provides comprehensive statistics:
        </p>

        <EnhancedCodeBlock
          code={`interface EnhancedOptimizationStats {
  toon: {
    conversions: number
    totalTokensSaved: number
    averageSavingsPercent: number
  }
  compression: {
    compressions: number
    totalTokensSaved: number
    averageSavingsPercent: number
  }
  cache: CacheStats
  semanticCache: {
    hits: number
    misses: number
    hitRate: number
    tokensSaved: number
  }
  costs: {
    totalCost: number
    inputCost: number
    outputCost: number
    cachedCost: number
    savingsFromOptimization: number
  }
  overall: {
    totalTokensSaved: number
    totalCostSaved: number
    averageSavingsPercent: number
  }
  // ... more stats
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="complete-example">Complete Example</h2>

        <EnhancedCodeBlock
          code={`import { useState, useCallback } from 'react'
import { useTokenOptimizationEnhanced } from '@clarity-chat/react'
import type { CoreMessage } from '@clarity-chat/react'

function CompleteOptimizationExample() {
  const [messages, setMessages] = useState<CoreMessage[]>([])
  const [optimizedMessages, setOptimizedMessages] = useState<CoreMessage[]>([])

  const {
    optimizeData,
    optimizePrompt,
    prepareMessages,
    optimizeHistory,
    routeQuery,
    getPrefill,
    stats,
    resetStats,
  } = useTokenOptimizationEnhanced({
    model: 'gpt-4',
    preset: 'balanced',
    enableCostTracking: true,
    enableStats: true,
  })

  const handleOptimizeData = useCallback(async () => {
    const data = {
      users: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
      ],
    }

    const result = await optimizeData(data)
    console.log('Optimized:', result.content)
    console.log('Format:', result.format)
    console.log('Savings:', result.optimizations.toon?.savingsPercent)
  }, [optimizeData])

  const handlePrepareMessages = useCallback(async () => {
    const prepared = await prepareMessages(messages)
    setOptimizedMessages(prepared)
  }, [messages, prepareMessages])

  const handleOptimizeHistory = useCallback(async () => {
    const optimized = await optimizeHistory(messages)
    setOptimizedMessages(optimized)
  }, [messages, optimizeHistory])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={handleOptimizeData}>Optimize Data</button>
        <button onClick={handlePrepareMessages}>Prepare Messages</button>
        <button onClick={handleOptimizeHistory}>Optimize History</button>
        <button onClick={resetStats}>Reset Stats</button>
      </div>

      <div className="p-4 bg-muted rounded">
        <h3 className="font-semibold mb-2">Statistics</h3>
        <p>Total tokens saved: {stats.overall.totalTokensSaved}</p>
        <p>Total cost saved: ${stats.overall.totalCostSaved.toFixed(4)}</p>
        <p>Average savings: {stats.overall.averageSavingsPercent.toFixed(1)}%</p>
        <p>TOON conversions: {stats.toon.conversions}</p>
        <p>Cache hit rate: {(stats.semanticCache.hitRate * 100).toFixed(1)}%</p>
      </div>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="best-practices">Best Practices</h2>

        <ul>
          <li>
            <strong>Start with presets:</strong> Use <code>preset: 'balanced'</code> for most use cases
          </li>
          <li>
            <strong>Enable cost tracking:</strong> Set <code>enableCostTracking: true</code> to monitor savings
          </li>
          <li>
            <strong>Use TOON for structured data:</strong> Enable <code>enableToon</code> for JSON/object data
          </li>
          <li>
            <strong>Cache repeated prompts:</strong> Enable <code>enablePromptCaching</code> for system prompts
          </li>
          <li>
            <strong>Compress long prompts:</strong> Use <code>enablePromptCompression</code> for verbose prompts
          </li>
          <li>
            <strong>Limit history:</strong> Enable <code>enableHistoryLimiting</code> to stay within budget
          </li>
          <li>
            <strong>Route intelligently:</strong> Use <code>enableModelRouting</code> to save costs on simple queries
          </li>
          <li>
            <strong>Monitor statistics:</strong> Check <code>stats</code> regularly to understand optimization impact
          </li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/hooks/use-token-budget-monitor">useTokenBudgetMonitor</a> - Real-time token budget monitoring
          </li>
          <li>
            <a href="/reference/hooks/use-token-tracker">useTokenTracker</a> - Token usage and cost tracking
          </li>
          <li>
            <a href="/reference/hooks/use-token-optimization">useTokenOptimization</a> - Legacy hook (deprecated)
          </li>
          <li>
            <a href="/guides/token-optimization">Token Optimization Guide</a> - Comprehensive optimization strategies
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'useStreamableUI',
            href: '/reference/hooks/use-streamable-ui',
          }}
          next={{
            title: 'useTokenBudgetMonitor',
            href: '/reference/hooks/use-token-budget-monitor',
          }}
        />
      </>
    </ToastProvider>
  )
}
