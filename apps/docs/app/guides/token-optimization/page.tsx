'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'

export default function TokenOptimizationGuidePage() {
  return (
    <>
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <header>
          <h1 className="text-4xl font-bold mb-3">Token Optimization Guide</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive guide to reducing token usage and costs through TOON
            format, prompt caching, compression, semantic caching, history
            limiting, and model routing.
          </p>
        </header>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Overview</h2>
          <p className="mb-4">
            Token optimization is crucial for reducing costs and staying within
            model context limits. Clarity Chat provides multiple optimization
            strategies that can reduce token usage by 20-90%* depending on your
            use case.
          </p>
          <p className="text-sm text-muted-foreground italic mb-4">
            *Cost savings based on provider prompt caching specifications. Compression rates vary by content type and configuration. Actual savings may vary.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 border-2 border-destructive/20 rounded-xl">
              <div className="font-semibold text-destructive mb-2">
                ❌ Without Optimization
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• High token costs</li>
                <li>• Context window overflow</li>
                <li>• Slow responses</li>
                <li>• Repeated context sent</li>
                <li>• Inefficient model usage</li>
              </ul>
            </div>

            <div className="p-4 border-2 border-green-500/20 rounded-xl bg-green-500/5">
              <div className="font-semibold text-green-600 dark:text-green-400 mb-2">
                ✅ With Optimization
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 20-90% cost reduction*</li>
                <li>• Stay within context limits</li>
                <li>• Faster responses</li>
                <li>• Cached context reused</li>
                <li>• Smart model routing</li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <p>
              <strong>The Impact:</strong> Proper token optimization can reduce
              API costs by 50-80%* while improving response times and staying
              within model context limits. The strategies work together for
              maximum savings. *Based on provider prompt caching specifications. Actual savings may vary.
            </p>
          </Callout>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">
            Optimization Strategies
          </h2>
          <p className="mb-4">
            Clarity Chat provides multiple optimization strategies, each
            targeting different aspects of token usage:
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">
                    Strategy
                  </th>
                  <th className="border border-border p-2 text-left">
                    Savings
                  </th>
                  <th className="border border-border p-2 text-left">
                    Use Case
                  </th>
                  <th className="border border-border p-2 text-left">
                    Complexity
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">
                    <strong>TOON Format</strong>
                  </td>
                  <td className="border border-border p-2">30-60%*</td>
                  <td className="border border-border p-2">
                    Structured data (JSON)
                  </td>
                  <td className="border border-border p-2">Low</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Prompt Caching</strong>
                  </td>
                  <td className="border border-border p-2">50-90%**</td>
                  <td className="border border-border p-2">Repeated prompts</td>
                  <td className="border border-border p-2">Medium</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Prompt Compression</strong>
                  </td>
                  <td className="border border-border p-2">20-35%</td>
                  <td className="border border-border p-2">Long prompts</td>
                  <td className="border border-border p-2">Low</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Semantic Caching</strong>
                  </td>
                  <td className="border border-border p-2">30-70%</td>
                  <td className="border border-border p-2">Similar queries</td>
                  <td className="border border-border p-2">High</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>History Limiting</strong>
                  </td>
                  <td className="border border-border p-2">Variable</td>
                  <td className="border border-border p-2">
                    Long conversations
                  </td>
                  <td className="border border-border p-2">Low</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Model Routing</strong>
                  </td>
                  <td className="border border-border p-2">40-60%</td>
                  <td className="border border-border p-2">
                    Mixed complexity queries
                  </td>
                  <td className="border border-border p-2">Medium</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground italic mt-2">
            *Compression rates vary by content type and configuration.<br />
            **Based on provider prompt caching specifications (Anthropic, OpenAI, Google). Leverages provider-native caching when available.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">
            1. TOON Format (30-60% Savings)*
          </h2>
          <p className="text-sm text-muted-foreground italic mb-2">
            *Compression rates vary by content type and configuration.
          </p>
          <p className="mb-4">
            TOON (Token-Oriented Object Notation) is a compact format for
            structured data that reduces token usage by 30-60% compared to JSON.
            It's perfect for sending arrays of objects to LLMs.
          </p>

          <h3 className="text-2xl font-semibold mb-3">How TOON Works</h3>
          <p className="mb-4">
            TOON converts JSON arrays into a tabular format that's more
            token-efficient:
          </p>

          <EnhancedCodeBlock
            code={`// JSON (inefficient)
[
  { "name": "Alice", "age": 30, "city": "New York" },
  { "name": "Bob", "age": 25, "city": "San Francisco" }
]
// ~40 tokens

// TOON (efficient)
name, age, city
Alice, 30, New York
Bob, 25, San Francisco
// ~15 tokens (62% savings!)`}
            language="text"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">Using TOON</h3>
          <EnhancedCodeBlock
            code={`import { useTokenOptimization } from '@clarity-chat/react'

function ToonExample() {
  const { optimizeData } = useTokenOptimization({
    enableToon: true,
    toonMinSavings: 20, // Only use TOON if savings >= 20%
  })

  const handleOptimize = async () => {
    const data = [
      { name: 'Alice', age: 30, city: 'New York' },
      { name: 'Bob', age: 25, city: 'San Francisco' },
    ]

    const result = await optimizeData(data)
    console.log('Format:', result.format) // 'toon' or 'json'
    console.log('Content:', result.content)
    console.log('Savings:', result.optimizations.toon?.savingsPercent)
  }

  return <button onClick={handleOptimize}>Optimize with TOON</button>
}`}
            language="tsx"
            showLineNumbers
          />

          <Callout type="tip">
            <p>
              <strong>When to Use TOON:</strong> Use TOON for structured data
              like arrays of objects, tables, or lists. It's automatically
              selected when savings exceed your threshold (default 20%).
            </p>
          </Callout>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">
            2. Prompt Caching (50-90% Savings)*
          </h2>
          <p className="text-sm text-muted-foreground italic mb-2">
            *Leverages provider-native caching when available (Anthropic, OpenAI, Google). Based on provider specifications. Actual savings may vary.
          </p>
          <p className="mb-4">
            Prompt caching allows you to cache system prompts and context that
            doesn't change between requests, dramatically reducing token usage
            for repeated content.
          </p>

          <h3 className="text-2xl font-semibold mb-3">
            How Prompt Caching Works
          </h3>
          <p className="mb-4">
            With prompt caching, the first request sends the full prompt, and
            subsequent requests reference the cached version. This is especially
            effective for system prompts that remain constant.
          </p>

          <EnhancedCodeBlock
            code={`import { useTokenOptimization } from '@clarity-chat/react'

function PromptCachingExample() {
  const { prepareMessages } = useTokenOptimization({
    enablePromptCaching: true,
    cachingProvider: 'anthropic', // or 'openai' or 'auto'
  })

  const handlePrepare = async () => {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' }, // Cached on first use
      { role: 'user', content: 'What is the weather?' },
    ]

    // System message is cached, only user message sent
    const prepared = await prepareMessages(messages)
    // Subsequent requests reuse cached system prompt
  }

  return <button onClick={handlePrepare}>Prepare with Caching</button>
}`}
            language="tsx"
            showLineNumbers
          />

          <Callout type="info">
            <p>
              <strong>Provider Support:</strong> Prompt caching is supported by
              Anthropic (Claude) and OpenAI (GPT-4). The provider is
              auto-detected from your model, or you can specify it manually.
            </p>
          </Callout>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">
            3. Prompt Compression (20-35% Savings)
          </h2>
          <p className="mb-4">
            Prompt compression reduces token usage by removing redundancy,
            shortening verbose text, and preserving essential information. Three
            compression levels are available.
          </p>

          <h3 className="text-2xl font-semibold mb-3">Compression Levels</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              <strong>Conservative:</strong> Minimal changes, preserves most
              detail (20-25% savings)
            </li>
            <li>
              <strong>Balanced:</strong> Good balance of compression and quality
              (25-30% savings)
            </li>
            <li>
              <strong>Aggressive:</strong> Maximum compression, some detail loss
              (30-35% savings)
            </li>
          </ul>

          <EnhancedCodeBlock
            code={`import { useTokenOptimization } from '@clarity-chat/react'

function CompressionExample() {
  const { optimizePrompt } = useTokenOptimization({
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
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">
            4. Semantic Caching (30-70% Savings)
          </h2>
          <p className="mb-4">
            Semantic caching stores and retrieves responses based on semantic
            similarity, allowing you to reuse responses for similar queries
            without calling the LLM again.
          </p>

          <EnhancedCodeBlock
            code={`import { useTokenOptimization } from '@clarity-chat/react'

function SemanticCacheExample() {
  const { optimizePrompt } = useTokenOptimization({
    enableSemanticCaching: true,
    similarityThreshold: 0.85, // 85% similarity required
  })

  const handleQuery = async () => {
    // First query - calls LLM
    const result1 = await optimizePrompt('What is the weather in SF?')
    
    // Similar query - reuses cached response
    const result2 = await optimizePrompt('What is the weather in San Francisco?')
    // result2 may reuse result1 if similarity is high enough
  }

  return <button onClick={handleQuery}>Query with Semantic Cache</button>
}`}
            language="tsx"
            showLineNumbers
          />

          <Callout type="tip">
            <p>
              <strong>Similarity Threshold:</strong> Set a higher threshold
              (0.9+) for exact matches, or lower (0.7-0.8) for more flexible
              matching. Balance between cache hits and response quality.
            </p>
          </Callout>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">5. History Limiting</h2>
          <p className="mb-4">
            History limiting automatically trims old messages to stay within
            token budgets, keeping the most relevant context while removing
            older, less important messages.
          </p>

          <EnhancedCodeBlock
            code={`import { useTokenOptimization } from '@clarity-chat/react'

function HistoryLimitingExample() {
  const { optimizeHistory } = useTokenOptimization({
    enableHistoryLimiting: true,
    historyLimiting: {
      maxTokens: 8000,
      keepSystem: true, // Always keep system messages
      keepRecent: 5, // Keep last 5 messages
      strategy: 'oldest-first', // Trim oldest messages first
    },
  })

  const handleOptimize = async () => {
    const messages = [
      { role: 'system', content: 'You are helpful.' },
      { role: 'user', content: 'Message 1' },
      // ... many more messages
    ]

    // Oldest messages trimmed to stay within budget
    const optimized = await optimizeHistory(messages)
  }

  return <button onClick={handleOptimize}>Optimize History</button>
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">
            6. Model Routing (40-60% Savings)
          </h2>
          <p className="mb-4">
            Model routing automatically selects the most cost-effective model
            based on query complexity, using cheaper models for simple queries
            and more powerful models for complex ones.
          </p>

          <EnhancedCodeBlock
            code={`import { useTokenOptimization } from '@clarity-chat/react'

function ModelRoutingExample() {
  const { routeQuery } = useTokenOptimization({
    enableModelRouting: true,
    modelRouting: {
      simpleModel: 'gpt-3.5-turbo', // $0.0005/$0.0015 per 1K tokens
      complexModel: 'gpt-4', // $0.03/$0.06 per 1K tokens
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
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Using Presets</h2>
          <p className="mb-4">
            For quick setup, use presets that configure multiple optimizations
            at once:
          </p>

          <EnhancedCodeBlock
            code={`import { useTokenOptimization } from '@clarity-chat/react'

function PresetExample() {
  // Aggressive: All optimizations enabled, maximum savings
  const aggressive = useTokenOptimization({
    preset: 'aggressive',
  })

  // Balanced: Key optimizations, good UX
  const balanced = useTokenOptimization({
    preset: 'balanced',
  })

  // Conservative: Safe optimizations only
  const conservative = useTokenOptimization({
    preset: 'conservative',
  })

  // Realtime: Optimized for low latency
  const realtime = useTokenOptimization({
    preset: 'realtime',
  })

  return <div>Choose your preset</div>
}`}
            language="tsx"
            showLineNumbers
          />

          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Preset</th>
                  <th className="border border-border p-2 text-left">
                    Optimizations
                  </th>
                  <th className="border border-border p-2 text-left">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">
                    <strong>aggressive</strong>
                  </td>
                  <td className="border border-border p-2">
                    All optimizations
                  </td>
                  <td className="border border-border p-2">Maximum savings</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>balanced</strong>
                  </td>
                  <td className="border border-border p-2">
                    TOON, caching, compression, history limiting
                  </td>
                  <td className="border border-border p-2">Most use cases</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>conservative</strong>
                  </td>
                  <td className="border border-border p-2">
                    TOON, compression
                  </td>
                  <td className="border border-border p-2">
                    Safe optimizations
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>realtime</strong>
                  </td>
                  <td className="border border-border p-2">
                    TOON, semantic cache, conservative compression
                  </td>
                  <td className="border border-border p-2">Low latency</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Cost Tracking</h2>
          <p className="mb-4">
            Track real-time costs and savings from optimizations:
          </p>

          <EnhancedCodeBlock
            code={`import { useTokenOptimization } from '@clarity-chat/react'

function CostTrackingExample() {
  const { stats } = useTokenOptimization({
    model: 'gpt-4',
    enableCostTracking: true,
    preset: 'balanced',
  })

  return (
    <div>
      <p>Total Cost: \${stats.costs.totalCost.toFixed(4)}</p>
      <p>Input Cost: \${stats.costs.inputCost.toFixed(4)}</p>
      <p>Output Cost: \${stats.costs.outputCost.toFixed(4)}</p>
      <p>Savings: \${stats.costs.savingsFromOptimization.toFixed(4)}</p>
      <p>Total Tokens Saved: {stats.overall.totalTokensSaved}</p>
      <p>Average Savings: {stats.overall.averageSavingsPercent.toFixed(1)}%</p>
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>

          <h3 className="text-2xl font-semibold mb-3">1. Start with Presets</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              Use <code>preset: 'balanced'</code> for most use cases
            </li>
            <li>Customize individual options only if needed</li>
            <li>Monitor statistics to understand impact</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            2. Enable Cost Tracking
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              Set <code>enableCostTracking: true</code> to monitor savings
            </li>
            <li>
              Review <code>stats.costs</code> regularly
            </li>
            <li>Use savings data to justify optimizations</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            3. Use TOON for Structured Data
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              Enable <code>enableToon</code> for JSON/object data
            </li>
            <li>
              Set <code>toonMinSavings</code> threshold (default 20%)
            </li>
            <li>TOON is automatically selected when beneficial</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            4. Cache Repeated Prompts
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              Enable <code>enablePromptCaching</code> for system prompts
            </li>
            <li>Use with Anthropic or OpenAI models</li>
            <li>Provides 50-90% savings on repeated context* (Based on provider-native caching specifications)</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            5. Compress Long Prompts
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              Use <code>enablePromptCompression</code> for verbose prompts
            </li>
            <li>
              Start with <code>compressionLevel: 'balanced'</code>
            </li>
            <li>Use aggressive compression only if quality is acceptable</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            6. Limit History Appropriately
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              Enable <code>enableHistoryLimiting</code> for long conversations
            </li>
            <li>
              Set <code>maxTokens</code> based on your model's context window
            </li>
            <li>
              Always keep system messages (<code>keepSystem: true</code>)
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            7. Route Models Intelligently
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              Use <code>enableModelRouting</code> to save costs on simple
              queries
            </li>
            <li>
              Set appropriate <code>complexityThreshold</code>
            </li>
            <li>Monitor routing decisions to optimize thresholds</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Complete Example</h2>
          <p className="mb-4">
            Here's a complete example using multiple optimization strategies:
          </p>

          <EnhancedCodeBlock
            code={`import { useTokenOptimization } from '@clarity-chat/react'
import { useState } from 'react'

function CompleteOptimizationExample() {
  const [messages, setMessages] = useState([])

  const {
    optimizeData,
    optimizePrompt,
    prepareMessages,
    optimizeHistory,
    routeQuery,
    stats,
  } = useTokenOptimization({
    model: 'gpt-4',
    preset: 'balanced',
    enableCostTracking: true,
    enableStats: true,
  })

  const handleOptimize = async () => {
    // Optimize structured data with TOON
    const data = [{ name: 'Alice', age: 30 }]
    const optimizedData = await optimizeData(data)

    // Prepare messages with caching
    const prepared = await prepareMessages(messages)

    // Optimize history to stay within budget
    const optimizedHistory = await optimizeHistory(messages)

    // Route query to appropriate model
    const model = await routeQuery('What is 2+2?')

    console.log('Total savings:', stats.overall.totalCostSaved)
  }

  return (
    <div>
      <button onClick={handleOptimize}>Optimize</button>
      <div>
        <p>Tokens saved: {stats.overall.totalTokensSaved}</p>
        <p>Cost saved: \${stats.overall.totalCostSaved.toFixed(4)}</p>
        <p>Savings: {stats.overall.averageSavingsPercent.toFixed(1)}%</p>
      </div>
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Related</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <a
                href="/reference/hooks/use-token-optimization-enhanced"
                className="text-primary underline"
              >
                useTokenOptimization Hook
              </a>{' '}
              – Comprehensive token optimization hook
            </li>
            <li>
              <a
                href="/reference/hooks/use-token-budget-monitor"
                className="text-primary underline"
              >
                useTokenBudgetMonitor Hook
              </a>{' '}
              – Real-time token budget monitoring
            </li>
            <li>
              <a
                href="/reference/hooks/use-token-tracker"
                className="text-primary underline"
              >
                useTokenTracker Hook
              </a>{' '}
              – Token usage and cost tracking
            </li>
            <li>
              <a href="/guides/memory" className="text-primary underline">
                Memory System Guide
              </a>{' '}
              – Memory strategies for context management
            </li>
          </ul>
        </section>

      </div>
    </>
  )
}
