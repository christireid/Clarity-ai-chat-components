'use client'

/**
 * MODEL_PRICING Reference Documentation
 *
 * Comprehensive reference for model pricing data, cost calculation functions,
 * and token optimization utilities.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  DollarSign,
  Calculator,
  Database,
  TrendingDown,
  Info,
  AlertCircle,
  CheckCircle,
  Code,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { durations } from '@/lib/animations'

interface PricingTableRow {
  model: string
  provider: string
  inputPer1M: string
  outputPer1M: string
  cachedInputPer1M?: string
  contextWindow: string
  maxOutput: string
  capabilities: string[]
}

const pricingData: PricingTableRow[] = [
  // OpenAI GPT-4 Family
  {
    model: 'gpt-4',
    provider: 'OpenAI',
    inputPer1M: '$30.00',
    outputPer1M: '$60.00',
    contextWindow: '8K',
    maxOutput: '4K',
    capabilities: ['Function Calling', 'JSON Mode'],
  },
  {
    model: 'gpt-4-turbo',
    provider: 'OpenAI',
    inputPer1M: '$10.00',
    outputPer1M: '$30.00',
    cachedInputPer1M: '$5.00',
    contextWindow: '128K',
    maxOutput: '4K',
    capabilities: ['Vision', 'Function Calling', 'Caching'],
  },
  {
    model: 'gpt-4o',
    provider: 'OpenAI',
    inputPer1M: '$2.50',
    outputPer1M: '$10.00',
    cachedInputPer1M: '$1.25',
    contextWindow: '128K',
    maxOutput: '16K',
    capabilities: ['Vision', 'Function Calling', 'Caching'],
  },
  {
    model: 'gpt-4o-mini',
    provider: 'OpenAI',
    inputPer1M: '$0.15',
    outputPer1M: '$0.60',
    cachedInputPer1M: '$0.075',
    contextWindow: '128K',
    maxOutput: '16K',
    capabilities: ['Vision', 'Function Calling', 'Caching'],
  },
  {
    model: 'gpt-4.1',
    provider: 'OpenAI',
    inputPer1M: '$2.00',
    outputPer1M: '$8.00',
    cachedInputPer1M: '$0.50',
    contextWindow: '1M',
    maxOutput: '32K',
    capabilities: ['Vision', 'Function Calling', 'Caching'],
  },
  {
    model: 'gpt-3.5-turbo',
    provider: 'OpenAI',
    inputPer1M: '$0.50',
    outputPer1M: '$1.50',
    contextWindow: '16K',
    maxOutput: '4K',
    capabilities: ['Function Calling'],
  },

  // OpenAI Reasoning Models
  {
    model: 'o1',
    provider: 'OpenAI',
    inputPer1M: '$15.00',
    outputPer1M: '$60.00',
    cachedInputPer1M: '$7.50',
    contextWindow: '200K',
    maxOutput: '100K',
    capabilities: ['Reasoning', 'Vision', 'Caching'],
  },
  {
    model: 'o1-mini',
    provider: 'OpenAI',
    inputPer1M: '$3.00',
    outputPer1M: '$12.00',
    cachedInputPer1M: '$1.50',
    contextWindow: '128K',
    maxOutput: '65K',
    capabilities: ['Reasoning', 'Caching'],
  },
  {
    model: 'o3-mini',
    provider: 'OpenAI',
    inputPer1M: '$1.10',
    outputPer1M: '$4.40',
    cachedInputPer1M: '$0.55',
    contextWindow: '200K',
    maxOutput: '100K',
    capabilities: ['Reasoning', 'Caching'],
  },

  // Anthropic Claude Family
  {
    model: 'claude-3-opus',
    provider: 'Anthropic',
    inputPer1M: '$15.00',
    outputPer1M: '$75.00',
    cachedInputPer1M: '$1.50',
    contextWindow: '200K',
    maxOutput: '4K',
    capabilities: ['Vision', 'Function Calling', 'Caching'],
  },
  {
    model: 'claude-3-sonnet',
    provider: 'Anthropic',
    inputPer1M: '$3.00',
    outputPer1M: '$15.00',
    cachedInputPer1M: '$0.30',
    contextWindow: '200K',
    maxOutput: '4K',
    capabilities: ['Vision', 'Function Calling', 'Caching'],
  },
  {
    model: 'claude-3-haiku',
    provider: 'Anthropic',
    inputPer1M: '$0.25',
    outputPer1M: '$1.25',
    cachedInputPer1M: '$0.03',
    contextWindow: '200K',
    maxOutput: '4K',
    capabilities: ['Vision', 'Function Calling', 'Caching'],
  },
  {
    model: 'claude-sonnet-4',
    provider: 'Anthropic',
    inputPer1M: '$3.00',
    outputPer1M: '$15.00',
    cachedInputPer1M: '$0.30',
    contextWindow: '1M',
    maxOutput: '16K',
    capabilities: ['Vision', 'Function Calling', 'Caching'],
  },

  // Google Gemini Family
  {
    model: 'gemini-1.5-pro',
    provider: 'Google',
    inputPer1M: '$1.25',
    outputPer1M: '$5.00',
    cachedInputPer1M: '$0.31',
    contextWindow: '2M',
    maxOutput: '8K',
    capabilities: ['Vision', 'Function Calling', 'Caching'],
  },
  {
    model: 'gemini-1.5-flash',
    provider: 'Google',
    inputPer1M: '$0.075',
    outputPer1M: '$0.30',
    cachedInputPer1M: '$0.019',
    contextWindow: '1M',
    maxOutput: '8K',
    capabilities: ['Vision', 'Function Calling', 'Caching'],
  },
  {
    model: 'gemini-2.0-flash',
    provider: 'Google',
    inputPer1M: '$0.10',
    outputPer1M: '$0.40',
    cachedInputPer1M: '$0.025',
    contextWindow: '1M',
    maxOutput: '8K',
    capabilities: ['Vision', 'Function Calling', 'Caching'],
  },

  // DeepSeek Models
  {
    model: 'deepseek-chat',
    provider: 'DeepSeek',
    inputPer1M: '$0.14',
    outputPer1M: '$0.28',
    cachedInputPer1M: '$0.014',
    contextWindow: '64K',
    maxOutput: '8K',
    capabilities: ['Function Calling', 'Caching'],
  },
  {
    model: 'deepseek-r1',
    provider: 'DeepSeek',
    inputPer1M: '$0.55',
    outputPer1M: '$2.19',
    cachedInputPer1M: '$0.14',
    contextWindow: '128K',
    maxOutput: '32K',
    capabilities: ['Reasoning', 'Caching'],
  },
]

const codeExamples = [
  {
    title: 'Basic Cost Calculation',
    description: 'Calculate cost for a single request',
    code: `import { calculateCost } from '@clarity-chat/token-optimization'

const cost = calculateCost({
  model: 'gpt-4o',
  inputTokens: 1000,
  outputTokens: 500
})

console.log(\`Total: $\${cost.totalCost.toFixed(4)}\`)
// => "Total: $0.0075"

console.log(cost.breakdown)
// {
//   inputTokens: 1000,
//   outputTokens: 500,
//   inputCost: 0.0025,
//   outputCost: 0.0050,
//   totalCost: 0.0075
// }`,
  },
  {
    title: 'Cache Savings Calculation',
    description: 'Calculate savings from prompt caching',
    code: `import { calculateCacheSavings } from '@clarity-chat/token-optimization'

const savings = calculateCacheSavings({
  model: 'claude-3-sonnet',
  inputTokens: 10000,
  cacheHitRate: 0.8  // 80% cache hit rate
})

console.log(\`Savings: \${savings.savingsPercent.toFixed(1)}%\`)
// => "Savings: 72.0%"

console.log(\`Saved: $\${savings.savings.toFixed(4)}\`)
// => "Saved: $0.0216"`,
  },
  {
    title: 'Cost Tracker',
    description: 'Track cumulative costs over time',
    code: `import { CostTracker } from '@clarity-chat/token-optimization'

const tracker = new CostTracker('gpt-4o')

// Track each request
tracker.trackRequest({
  inputTokens: 5000,
  outputTokens: 500,
  cachedInputTokens: 4000
})

// Get report
const report = tracker.getReport()
console.log(\`Total saved: $\${report.cumulative.totalSavings.toFixed(4)}\`)
console.log(\`Average savings: \${report.cumulative.averageSavingsPercentage.toFixed(1)}%\`)`,
  },
  {
    title: 'Model Comparison',
    description: 'Compare costs across multiple models',
    code: `import { compareModelCosts } from '@clarity-chat/token-optimization'

const comparison = compareModelCosts({
  models: ['gpt-4o', 'claude-3-sonnet', 'gemini-1.5-flash'],
  inputTokens: 10000,
  outputTokens: 2000
})

comparison.forEach(result => {
  console.log(\`\${result.model}: $\${result.cost.toFixed(4)}\`)
  console.log(\`Savings: \${result.savingsPercent.toFixed(1)}%\`)
})`,
  },
  {
    title: 'Model Recommendation',
    description: 'Get recommended model based on budget',
    code: `import { recommendModel } from '@clarity-chat/token-optimization'

const recommendation = recommendModel({
  inputTokens: 5000,
  outputTokens: 1000,
  maxCostPerRequest: 0.01,  // $0.01 budget
  minContextWindow: 128000,
  providers: ['openai', 'anthropic']
})

console.log(\`Recommended: \${recommendation.recommended}\`)
console.log(\`Reasoning: \${recommendation.reasoning}\`)
console.log(\`Alternatives: \${recommendation.alternatives.join(', ')}\`)`,
  },
  {
    title: 'Estimate Conversation Cost',
    description: 'Calculate monthly costs for expected usage',
    code: `import { estimateConversationCost } from '@clarity-chat/token-optimization'

const estimate = estimateConversationCost({
  model: 'gpt-4o-mini',
  averageInputTokens: 500,
  averageOutputTokens: 200,
  messagesPerDay: 1000,
  daysPerMonth: 30
})

console.log(\`Cost per message: $\${estimate.costPerMessage.toFixed(6)}\`)
console.log(\`Cost per day: $\${estimate.costPerDay.toFixed(2)}\`)
console.log(\`Cost per month: $\${estimate.costPerMonth.toFixed(2)}\`)`,
  },
]

const utilities = [
  {
    name: 'MODEL_PRICING',
    description: 'Complete pricing database for all supported models',
    signature: 'Record<ModelId, ModelPricing>',
    returns: 'Model pricing configuration object',
  },
  {
    name: 'calculateCost()',
    description: 'Calculate cost for input/output tokens',
    signature:
      '({ model, inputTokens, outputTokens, cachedInputTokens? }) => CostCalculation',
    returns: 'Detailed cost breakdown with savings',
  },
  {
    name: 'calculateCacheSavings()',
    description: 'Calculate savings from prompt caching',
    signature: '({ model, inputTokens, cacheHitRate }) => SavingsCalculation',
    returns: 'Cost comparison with/without caching',
  },
  {
    name: 'estimateConversationCost()',
    description: 'Estimate costs for expected usage patterns',
    signature:
      '({ model, averageInputTokens, averageOutputTokens, messagesPerDay }) => CostEstimate',
    returns: 'Per-message, daily, and monthly cost estimates',
  },
  {
    name: 'compareModelCosts()',
    description: 'Compare costs across multiple models',
    signature: '({ models, inputTokens, outputTokens }) => ModelComparison[]',
    returns: 'Sorted array of models with costs and savings',
  },
  {
    name: 'recommendModel()',
    description: 'Get model recommendation based on requirements',
    signature:
      '({ inputTokens, outputTokens, maxCostPerRequest?, minContextWindow?, providers? }) => Recommendation',
    returns: 'Recommended model with alternatives',
  },
  {
    name: 'getModelPricing()',
    description: 'Get pricing info for a specific model',
    signature: '(modelId: ModelId) => ModelPricing | undefined',
    returns: 'Model pricing configuration or undefined',
  },
  {
    name: 'modelSupportsCaching()',
    description: 'Check if model supports prompt caching',
    signature: '(modelId: ModelId) => boolean',
    returns: 'true if caching is supported',
  },
  {
    name: 'getModelsWithCaching()',
    description: 'Get all models that support caching',
    signature: '() => ModelId[]',
    returns: 'Array of model IDs with caching support',
  },
  {
    name: 'CostTracker',
    description: 'Real-time cost tracking class',
    signature: 'class CostTracker(model: ModelId)',
    returns: 'Cumulative tracking and reporting',
  },
]

const typeDefinitions = [
  {
    name: 'ModelPricing',
    definition: `interface ModelPricing {
  inputCostPer1M: number
  outputCostPer1M: number
  cachedInputCostPer1M?: number
  contextWindow: number
  maxOutputTokens: number
  provider: PricingProvider
}`,
  },
  {
    name: 'CostCalculation',
    definition: `interface CostCalculation {
  inputCost: number
  outputCost: number
  cachedInputCost?: number
  totalCost: number
  model: string
  breakdown: {
    inputTokens: number
    outputTokens: number
    cachedInputTokens?: number
  }
}`,
  },
  {
    name: 'PricingProvider',
    definition: `type PricingProvider =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'deepseek'
  | 'other'`,
  },
]

export default function ModelPricingReferencePage() {
  const [selectedProvider, setSelectedProvider] = React.useState<string>('all')
  const [showOnlyCaching, setShowOnlyCaching] = React.useState(false)

  const providers = ['all', ...new Set(pricingData.map((p) => p.provider))]

  const filteredPricing = pricingData.filter((row) => {
    if (selectedProvider !== 'all' && row.provider !== selectedProvider)
      return false
    if (showOnlyCaching && !row.cachedInputPer1M) return false
    return true
  })

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <DollarSign className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-sm text-muted-foreground">
              Token Optimization
            </span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            MODEL_PRICING Reference
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            Comprehensive pricing data for all supported AI models, cost
            calculation utilities, and optimization functions. Essential for
            implementing transparent cost tracking and budget management.
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="text-2xl font-bold text-foreground">
                {pricingData.length}
              </div>
              <div className="text-sm text-muted-foreground">Models</div>
            </div>
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="text-2xl font-bold text-foreground">
                {
                  pricingData.filter((p) => p.cachedInputPer1M !== undefined)
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground">
                Support Caching
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="text-2xl font-bold text-foreground">
                50-90%
              </div>
              <div className="text-sm text-muted-foreground">
                Potential Savings
              </div>
            </div>
          </div>
        </motion.header>

        {/* Import instruction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12 p-6 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-500/5"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Package Import
              </h3>
              <pre className="text-sm bg-background/50 rounded-lg p-3 overflow-x-auto">
                <code className="text-blue-600 dark:text-blue-400">
                  {`import {
  MODEL_PRICING,
  calculateCost,
  calculateCacheSavings,
  CostTracker
} from '@clarity-chat/token-optimization'`}
                </code>
              </pre>
              <p className="text-xs text-muted-foreground mt-2">
                All pricing utilities are derived from MODEL_REGISTRY (single
                source of truth)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Table Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.slow,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-foreground">
              Pricing Table
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Provider:</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
              >
                {providers.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider === 'all'
                      ? 'All Providers'
                      : provider.charAt(0).toUpperCase() + provider.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={showOnlyCaching}
                onChange={(e) => setShowOnlyCaching(e.target.checked)}
                className="rounded"
              />
              Caching only
            </label>
          </div>

          {/* Pricing table */}
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Model</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Provider
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Input (/1M)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Output (/1M)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Cached (/1M)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Context
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Capabilities
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPricing.map((row, index) => (
                  <tr
                    key={row.model}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      {row.model}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-muted">
                        {row.provider}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {row.inputPer1M}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {row.outputPer1M}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {row.cachedInputPer1M ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {row.cachedInputPer1M}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {row.contextWindow}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {row.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="px-1.5 py-0.5 rounded text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredPricing.length} of {pricingData.length} models.
            Prices are per 1 million tokens in USD.
          </div>
        </motion.section>

        {/* Cost Functions Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.slow,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-foreground">
              Cost Calculation Functions
            </h2>
          </div>

          <div className="space-y-4">
            {utilities.map((util) => (
              <div
                key={util.name}
                className="p-6 rounded-xl border border-border/50 bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground font-mono">
                    {util.name}
                  </h3>
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {util.description}
                </p>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Signature:
                    </div>
                    <code className="text-xs bg-background/50 rounded px-2 py-1 block overflow-x-auto">
                      {util.signature}
                    </code>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Returns:
                    </div>
                    <div className="text-xs text-foreground">{util.returns}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Code Examples Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.slow,
            delay: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-foreground">
              Code Examples
            </h2>
          </div>

          <div className="space-y-6">
            {codeExamples.map((example, index) => (
              <div
                key={index}
                className="rounded-xl border border-border/50 bg-card overflow-hidden"
              >
                <div className="p-4 border-b border-border/50">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {example.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {example.description}
                  </p>
                </div>
                <pre className="p-4 bg-background/50 overflow-x-auto">
                  <code className="text-sm text-foreground">{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Type Definitions Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.slow,
            delay: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Type Definitions
          </h2>

          <div className="space-y-4">
            {typeDefinitions.map((type) => (
              <div
                key={type.name}
                className="rounded-xl border border-border/50 bg-card overflow-hidden"
              >
                <div className="p-4 border-b border-border/50">
                  <h3 className="text-lg font-semibold text-foreground font-mono">
                    {type.name}
                  </h3>
                </div>
                <pre className="p-4 bg-background/50 overflow-x-auto">
                  <code className="text-sm text-foreground">
                    {type.definition}
                  </code>
                </pre>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Key Concepts Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.slow,
            delay: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Key Concepts
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <div className="flex items-start gap-3 mb-3">
                <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Prompt Caching
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Models with cached input pricing support prompt caching,
                    which can reduce costs by 50-90% for repeated context.
                    Anthropic, OpenAI, and Google models support this feature.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Single Source of Truth
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    MODEL_PRICING is derived from MODEL_REGISTRY, ensuring
                    consistency across tokenization, pricing, and budget
                    monitoring modules.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <div className="flex items-start gap-3 mb-3">
                <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Cost Transparency
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    All cost calculations use precise token counts and current
                    pricing. Breakdown includes input, output, and cached token
                    costs separately.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <div className="flex items-start gap-3 mb-3">
                <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Custom Models
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use registerModel() to add pricing for fine-tuned or custom
                    models. All functions work with registered custom models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Related Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.slow,
            delay: 0.7,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Related Resources
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/reference/components/token-cost-preview"
              className="group p-6 rounded-xl border border-border/50 bg-card hover:border-brand-500/30 transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                TokenCostPreview
              </h3>
              <p className="text-sm text-muted-foreground">
                Display real-time cost estimates as users type
              </p>
            </Link>

            <Link
              href="/reference/components/token-counter"
              className="group p-6 rounded-xl border border-border/50 bg-card hover:border-brand-500/30 transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                TokenCounter
              </h3>
              <p className="text-sm text-muted-foreground">
                Visual token usage display with progress bars
              </p>
            </Link>

            <Link
              href="/reference/hooks/use-token-budget-monitor"
              className="group p-6 rounded-xl border border-border/50 bg-card hover:border-brand-500/30 transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                useTokenBudgetMonitor
              </h3>
              <p className="text-sm text-muted-foreground">
                Hook for tracking token budgets and spending
              </p>
            </Link>

            <Link
              href="/guides/token-optimization"
              className="group p-6 rounded-xl border border-border/50 bg-card hover:border-brand-500/30 transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Token Optimization Guide
              </h3>
              <p className="text-sm text-muted-foreground">
                Complete guide to reducing token costs
              </p>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
