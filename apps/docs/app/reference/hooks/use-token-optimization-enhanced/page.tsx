import type { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const metadata: Metadata = {
  title: 'useTokenOptimizationEnhanced Hook | Clarity Chat',
  description:
    'Comprehensive token optimization with TOON, accurate tokenization, prompt caching, semantic caching, and real-time cost tracking. Save 50-90% on AI costs.',
}

const optionsProps: Prop[] = [
  {
    name: 'model',
    type: 'ModelName',
    description: 'Model identifier for token counting and cost calculation.',
  },
  {
    name: 'enableToon',
    type: 'boolean',
    default: 'false',
    description:
      'Enable TOON format optimization (30-60% savings on structured data).',
  },
  {
    name: 'toonMinSavings',
    type: 'number',
    default: '20',
    description:
      'Minimum TOON savings threshold as percentage (0-100). Only use TOON if savings >= this threshold. Default: 20%.',
  },
  {
    name: 'enableAccurateTokenization',
    type: 'boolean',
    default: 'false',
    description:
      'Enable accurate tokenization using js-tiktoken (model-specific counting).',
  },
  {
    name: 'enablePromptCaching',
    type: 'boolean',
    default: 'false',
    description: 'Enable prompt caching (50-90% savings on repeated content).',
  },
  {
    name: 'cachingProvider',
    type: '"anthropic" | "openai" | "auto"',
    default: '"auto"',
    description: 'Prompt caching provider. Auto detects based on model.',
  },
  {
    name: 'enableSemanticCaching',
    type: 'boolean',
    default: 'false',
    description: 'Enable semantic caching with similarity matching.',
  },
  {
    name: 'similarityThreshold',
    type: 'number',
    default: '0.85',
    description: 'Similarity threshold for semantic cache hits (0-1).',
  },
  {
    name: 'enablePromptCompression',
    type: 'boolean',
    default: 'false',
    description: 'Enable prompt compression (20-35% savings).',
  },
  {
    name: 'compressionLevel',
    type: '"conservative" | "balanced" | "aggressive"',
    default: '"balanced"',
    description: 'Compression aggressiveness level.',
  },
  {
    name: 'enableCostTracking',
    type: 'boolean',
    default: 'false',
    description: 'Enable real-time cost tracking and calculation.',
  },
  {
    name: 'enableStats',
    type: 'boolean',
    default: 'true',
    description: 'Enable statistics collection for optimization metrics.',
  },
  {
    name: 'preset',
    type: '"aggressive" | "balanced" | "conservative" | "realtime"',
    description: 'Configuration preset for quick setup. See presets section.',
  },
]

export default function UseTokenOptimizationEnhancedPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
          <span>🆕</span>
          <span>2025 Enhanced Feature</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          useTokenOptimizationEnhanced
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          Comprehensive token optimization hook with TOON support, accurate
          tokenization, prompt caching, semantic caching, and real-time cost
          tracking. Save 50-90% on AI costs.
        </p>
        <p className="text-muted-foreground">
          <strong>Since:</strong> 2.0.0 • <strong>Domain:</strong> Token
          Optimization
        </p>
      </div>

      <Callout type="info" title="Cost Savings">
        <p className="mb-2">
          This hook can save you <strong>50-90% on AI API costs</strong>{' '}
          through:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>
            <strong>TOON Format:</strong> 30-60% savings on structured data
          </li>
          <li>
            <strong>Prompt Caching:</strong> 50-90% savings on repeated content
          </li>
          <li>
            <strong>Semantic Caching:</strong> 40-60% savings with similarity
            matching
          </li>
          <li>
            <strong>Prompt Compression:</strong> 20-35% additional savings
          </li>
        </ul>
        <p>
          Combined with other optimizations, total savings can reach{' '}
          <strong>90%</strong>.
        </p>
      </Callout>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <CodePlayground
          code={`import { useTokenOptimizationEnhanced, ChatWindow } from '@clarity-chat/react'

function OptimizedChat() {
  const { optimizeData, calculateCost, stats } = useTokenOptimizationEnhanced({
    model: 'gpt-4',
    enableToon: true,
    enablePromptCaching: true,
    enableSemanticCaching: true,
    enablePromptCompression: true,
    enableCostTracking: true,
  })

  const handleSend = async (content: string) => {
    try {
      // Optimize the data
      const optimized = await optimizeData(content)
      
      // Calculate cost (note: calculateCost takes { inputTokens, outputTokens })
      // TokenCount.input and output are optional, so we use total as fallback
      const inputTokens = optimized.tokens.input ?? optimized.tokens.total
      const outputTokens = optimized.tokens.output ?? 0
      const cost = calculateCost({
        inputTokens,
        outputTokens,
      })
      
      // Use optimized content
      logger.debug('Tokens:', optimized.tokens.total)
      logger.debug('Cost: $', cost.total)
      if (stats) {
        logger.debug('Savings: $', stats.overall.totalCostSaved)
      }
    } catch (error) {
      console.error('Optimization failed:', error)
    }
  }

  return (
    <div>
      <ChatWindow onSendMessage={handleSend} />
      {stats && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p>Total Tokens Saved: {stats.overall.totalTokensSaved}</p>
          <p>Total Cost Saved: ${stats.overall.totalCostSaved.toFixed(2)}</p>
          <p>Average Savings: {stats.overall.averageSavingsPercent.toFixed(1)}%</p>
        </div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Using Presets</h2>
        <p className="text-muted-foreground mb-4">
          Quick setup with pre-configured optimization levels:
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Aggressive Preset</h3>
            <CodePlayground
              code={`const { optimizeData } = useTokenOptimizationEnhanced({
  preset: 'aggressive', // All optimizations, max savings
  model: 'gpt-4',
})`}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Enables all optimizations for maximum cost savings. Best for
              cost-sensitive applications.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Balanced Preset</h3>
            <CodePlayground
              code={`const { optimizeData } = useTokenOptimizationEnhanced({
  preset: 'balanced', // Key optimizations, good UX
  model: 'gpt-4',
})`}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Enables key optimizations while maintaining good user experience.
              Recommended for most use cases.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Conservative Preset</h3>
            <CodePlayground
              code={`const { optimizeData } = useTokenOptimizationEnhanced({
  preset: 'conservative', // Safe optimizations only
  model: 'gpt-4',
})`}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Enables only safe optimizations. Best when you need guaranteed
              quality.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Realtime Preset</h3>
            <CodePlayground
              code={`const { optimizeData } = useTokenOptimizationEnhanced({
  preset: 'realtime', // Optimized for low latency
  model: 'gpt-4',
})`}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Optimized for low latency. Skips caching for fastest response
              times.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">
          TOON Format Optimization
        </h2>
        <p className="text-muted-foreground mb-4">
          TOON (Token-Oriented Object Notation) provides 30-60% token savings
          for structured data.
        </p>
        <CodePlayground
          code={`import { useTokenOptimizationEnhanced, ChatWindow } from '@clarity-chat/react'

function ToonOptimized() {
  const { optimizeData } = useTokenOptimizationEnhanced({
    enableToon: true,
    toonMinSavings: 30, // Only use TOON if savings >= 30% (value is percentage: 0-100)
    model: 'gpt-4',
  })

  const handleSend = async (content: string) => {
    try {
      const data = {
        users: [
          { id: 1, name: 'Alice', email: 'alice@example.com' },
          { id: 2, name: 'Bob', email: 'bob@example.com' },
        ],
        metadata: { version: '1.0', timestamp: Date.now() },
      }

      const optimized = await optimizeData(data)
      // Result: 30-60% fewer tokens, same data
      logger.debug('Format:', optimized.format) // 'toon'
      logger.debug('Tokens:', optimized.tokens.total)
      logger.debug('Savings:', optimized.optimizations.toon?.savingsPercent)
    } catch (error) {
      console.error('TOON optimization failed:', error)
    }
  }

  return <ChatWindow onSendMessage={handleSend} />
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Prompt Caching</h2>
        <p className="text-muted-foreground mb-4">
          Save 50-90% on costs by caching repeated prompt content
          (Anthropic/OpenAI).
        </p>
        <CodePlayground
          code={`import { useTokenOptimizationEnhanced, ChatWindow } from '@clarity-chat/react'

function CachedChat() {
  const { optimizeData } = useTokenOptimizationEnhanced({
    enablePromptCaching: true,
    cachingProvider: 'auto', // Auto-detect based on model
    model: 'gpt-4',
  })

  const handleSend = async (content: string) => {
    try {
      const optimized = await optimizeData({
        systemPrompt: 'You are a helpful assistant.', // This will be cached
        userMessage: content,
      })

      if (optimized.optimizations.cached) {
        logger.debug('Used cached prompt - 50-90% cost savings!')
      }
    } catch (error) {
      console.error('Caching failed:', error)
    }
  }

  return <ChatWindow onSendMessage={handleSend} />
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Semantic Caching</h2>
        <p className="text-muted-foreground mb-4">
          Cache responses based on semantic similarity for 40-60% savings.
        </p>
        <CodePlayground
          code={`import { useTokenOptimizationEnhanced, ChatWindow } from '@clarity-chat/react'

function SemanticCachedChat() {
  const { optimizeData, stats } = useTokenOptimizationEnhanced({
    enableSemanticCaching: true,
    similarityThreshold: 0.85, // 85% similarity required for cache hit
    model: 'gpt-4',
  })

  const handleSend = async (content: string) => {
    try {
      const optimized = await optimizeData(content)
      
      // Check cache stats (stats may be undefined initially)
      if (stats) {
        logger.debug('Cache Hit Rate:', stats.semanticCache.hitRate)
        logger.debug('Tokens Saved:', stats.semanticCache.tokensSaved)
      }
    } catch (error) {
      console.error('Semantic caching failed:', error)
    }
  }

  return <ChatWindow onSendMessage={handleSend} />
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Cost Tracking</h2>
        <p className="text-muted-foreground mb-4">
          Track costs in real-time and see savings from optimizations.
        </p>
        <CodePlayground
          code={`import { useTokenOptimizationEnhanced, ChatWindow } from '@clarity-chat/react'

function CostTrackedChat() {
  const { optimizeData, calculateCost, stats } = useTokenOptimizationEnhanced({
    enableCostTracking: true,
    model: 'gpt-4',
  })

  const handleSend = async (content: string) => {
    try {
      const optimized = await optimizeData(content)
      
      // Calculate cost (note: calculateCost takes { inputTokens, outputTokens })
      // TokenCount.input and output are optional, so we use total as fallback
      const inputTokens = optimized.tokens.input ?? optimized.tokens.total
      const outputTokens = optimized.tokens.output ?? 0
      const cost = calculateCost({
        inputTokens,
        outputTokens,
      })

      logger.debug('Input Cost: $', cost.input)
      logger.debug('Output Cost: $', cost.output)
      logger.debug('Total Cost: $', cost.total)
      
      if (stats) {
        logger.debug('Savings: $', stats.costs.savingsFromOptimization)
      }
    } catch (error) {
      console.error('Cost tracking failed:', error)
    }
  }

  return (
    <div>
      <ChatWindow onSendMessage={handleSend} />
      {stats && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3>Cost Breakdown</h3>
          <p>Total Cost: ${stats.costs.totalCost.toFixed(4)}</p>
          <p>Input Cost: ${stats.costs.inputCost.toFixed(4)}</p>
          <p>Output Cost: ${stats.costs.outputCost.toFixed(4)}</p>
          <p>Cached Cost: ${stats.costs.cachedCost.toFixed(4)}</p>
          <p className="text-green-600">
            Savings: ${stats.costs.savingsFromOptimization.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Options Reference</h2>
        <PropsTable props={optionsProps} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Return Value</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-semibold">Property</th>
                <th className="text-left p-3 font-semibold">Type</th>
                <th className="text-left p-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-sm">optimizeData</td>
                <td className="p-3 font-mono text-sm">
                  (data: any) =&gt; Promise{'<'}
                  {'EnhancedOptimizationResult'}
                  {'>'}
                </td>
                <td className="p-3 text-sm text-muted-foreground">
                  Optimize data with all enabled optimizations. Returns
                  optimized content, tokens, cost, and optimization breakdown.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-sm">calculateCost</td>
                <td className="p-3 font-mono text-sm">
                  (params: {'{'} inputTokens: number, outputTokens: number {'}'}
                  ) =&gt; CostCalculation
                </td>
                <td className="p-3 text-sm text-muted-foreground">
                  Calculate cost for given token counts based on model pricing.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-sm">stats</td>
                <td className="p-3 font-mono text-sm">
                  EnhancedOptimizationStats
                </td>
                <td className="p-3 text-sm text-muted-foreground">
                  Comprehensive statistics including TOON, compression, caching,
                  cost tracking, and overall savings.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Start with Balanced Preset</h3>
            <p className="text-sm text-muted-foreground">
              Use{' '}
              <code className="bg-muted px-1 rounded">preset: 'balanced'</code>{' '}
              for most use cases. It provides good savings while maintaining
              quality.
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">
              Enable Cost Tracking in Production
            </h3>
            <p className="text-sm text-muted-foreground">
              Always enable{' '}
              <code className="bg-muted px-1 rounded">enableCostTracking</code>{' '}
              to monitor your API costs and savings in real-time.
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Use TOON for Structured Data</h3>
            <p className="text-sm text-muted-foreground">
              Enable TOON when sending structured data (JSON objects, arrays)
              for 30-60% token savings.
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">
              Enable Prompt Caching for Repeated Content
            </h3>
            <p className="text-sm text-muted-foreground">
              If you have repeated system prompts or context, enable prompt
              caching for 50-90% savings on that content.
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Monitor Statistics</h3>
            <p className="text-sm text-muted-foreground">
              Regularly check{' '}
              <code className="bg-muted px-1 rounded">stats</code> to understand
              which optimizations are providing the most value.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/hooks/use-token-optimization"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useTokenOptimization</h3>
            <p className="text-sm text-muted-foreground">
              Basic token optimization hook. Use this for simpler use cases.
            </p>
          </Link>
          <Link
            href="/guides/token-optimization"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Token Optimization Guide</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive guide on reducing API costs with token optimization.
            </p>
          </Link>
          <Link
            href="/reference/components/token-optimization-dashboard"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">TokenOptimizationDashboard</h3>
            <p className="text-sm text-muted-foreground">
              UI component for visualizing token optimization metrics.
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-token-tracker"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useTokenTracker</h3>
            <p className="text-sm text-muted-foreground">
              Hook for tracking token usage and costs in real-time.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
