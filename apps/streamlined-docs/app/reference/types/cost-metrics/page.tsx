import type { Metadata } from 'next'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import { PropsTable, PropDefinition } from '../../../../../components/Docs/PropsTable'
import { LiveDemoContainer } from '../../../../../components/Docs/LiveDemoContainer'
import { CodeBlock } from '../../../../../components/Docs/CodeBlock'
import { TocItem } from '../../../../../components/Docs/TableOfContents'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'CostMetrics Type | Clarity AI Chat Components',
  description:
    'Track your 50-70% cost reduction with precision. Complete type definition and implementation patterns for cost tracking, aggregation, and reporting.',
  openGraph: {
    title: 'CostMetrics Type',
    description: 'Precise cost tracking and aggregation for 50-70% reduction metrics',
    type: 'article',
  },
}

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'type-definition', title: 'Type Definition', level: 2 },
  { id: 'properties', title: 'Properties Reference', level: 2 },
  { id: 'usage-examples', title: 'Usage Examples', level: 2 },
  { id: 'cost-tracker', title: 'CostTracker Integration', level: 2 },
  { id: 'aggregation', title: 'Aggregation Patterns', level: 2 },
  { id: 'dashboard', title: 'Dashboard Integration', level: 2 },
  { id: 'export-formats', title: 'Export Formats', level: 2 },
  { id: 'time-based', title: 'Time-Based Aggregation', level: 2 },
  { id: 'enterprise', title: 'Enterprise Production', level: 2 },
  { id: 'related', title: 'Related APIs', level: 2 },
]

// Type properties definition
const typeProperties: PropDefinition[] = [
  {
    name: 'timestamp',
    type: 'Date',
    required: true,
    description: 'Timestamp when the cost was recorded (used for time-based aggregation)',
  },
  {
    name: 'model',
    type: 'string',
    required: true,
    description: 'Model identifier (e.g., "claude-3-5-sonnet-20241022", "gpt-4o")',
  },
  {
    name: 'provider',
    type: 'string',
    required: true,
    description: 'Provider name (e.g., "anthropic", "openai", "google")',
  },
  {
    name: 'inputTokens',
    type: 'number',
    required: true,
    description: 'Number of input tokens consumed in the request',
  },
  {
    name: 'outputTokens',
    type: 'number',
    required: true,
    description: 'Number of output tokens generated in the response',
  },
  {
    name: 'cachedTokens',
    type: 'number',
    required: true,
    description: 'Number of cached input tokens (provider caching) - saves 50-90% on these tokens',
  },
  {
    name: 'costUsd',
    type: 'number',
    required: true,
    description: 'Total cost in USD for this request (includes input, output, and cached token costs)',
  },
  {
    name: 'requestId',
    type: 'string',
    description: 'Optional unique identifier for the request (for debugging and audit trails)',
  },
]

export default function CostMetricsPage() {
  return (
    <DocumentationPage
      title="CostMetrics"
      description="Comprehensive cost tracking and aggregation type for measuring 50-70% cost reduction"
      category="Types"
      icon="📊"
      badges={[
        { label: 'Core Type', variant: 'primary' },
        { label: 'Cost Tracking', variant: 'warning' },
        { label: 'Token Optimization', variant: 'info' },
      ]}
      features={[
        'Track individual request costs with full breakdown',
        'Record provider caching savings (50-90% on cached tokens)',
        'Aggregate costs by model, provider, and time period',
        'Export to CSV and JSON for analytics platforms',
        'Time-based aggregation (today, week, month, all-time)',
        'Request-level granularity with optional requestId',
        'Integration with CostTracker for automatic tracking',
        'Dashboard-ready data structure for visualization',
        'Enterprise-grade audit trails',
        'Real-time cost reduction metrics',
      ]}
      tableOfContents={tableOfContents}
    >
      <Section id="overview" title="Overview">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          CostMetrics is the foundational type for tracking AI request costs with precision. It
          captures token usage (input, output, cached), cost calculations, and metadata needed for
          aggregation, reporting, and measuring your 50-70% cost reduction.
        </p>

        <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span>Track Your 50-70% Cost Reduction with Precision</span>
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Provider Caching Savings:</strong> Track 50-90%
                savings on cached tokens separately from normal tokens
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Model Distribution:</strong> See cost breakdown
                by model to verify smart routing is working
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Time-Based Trends:</strong> Compare daily,
                weekly, and monthly costs to measure improvement over time
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Audit Trails:</strong> Every request tracked
                with timestamp and optional requestId for compliance
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span>📈</span>
            <span>Real-World Cost Tracking Flow</span>
          </h4>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="font-mono text-foreground">1.</span>
              <span>
                Send optimized request → LLM processes with provider caching → Receive response with
                usage data
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-foreground">2.</span>
              <span>
                Create CostMetrics entry with inputTokens, outputTokens, cachedTokens, and costUsd
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-foreground">3.</span>
              <span>CostTracker stores entry for aggregation and reporting</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-foreground">4.</span>
              <span>
                Dashboard displays real-time cost reduction: "Before: $150/mo → After: $42/mo (72%
                reduction)"
              </span>
            </li>
          </ol>
        </div>
      </Section>

      <Section id="type-definition" title="Type Definition">
        <p className="text-muted-foreground mb-6">
          Complete TypeScript interface definition for CostMetrics.
        </p>

        <CodeBlock
          language="typescript"
          code={`/**
 * Cost metrics for a single AI request
 *
 * Captures token usage, cost calculation, and metadata for tracking
 * and measuring cost reduction over time.
 *
 * @example
 * \`\`\`typescript
 * const metrics: CostMetrics = {
 *   timestamp: new Date(),
 *   model: 'claude-3-5-sonnet-20241022',
 *   provider: 'anthropic',
 *   inputTokens: 1500,
 *   outputTokens: 300,
 *   cachedTokens: 800, // Provider caching saved 90% on these
 *   costUsd: 0.0042,
 *   requestId: 'req_abc123',
 * }
 * \`\`\`
 */
export interface CostMetrics {
  /** When the cost was recorded (for time-based aggregation) */
  timestamp: Date

  /** Model identifier (e.g., "claude-3-5-sonnet-20241022") */
  model: string

  /** Provider name (e.g., "anthropic", "openai", "google") */
  provider: string

  /** Number of input tokens consumed */
  inputTokens: number

  /** Number of output tokens generated */
  outputTokens: number

  /** Number of cached input tokens (provider caching) */
  cachedTokens: number

  /** Total cost in USD for this request */
  costUsd: number

  /** Optional unique identifier for the request */
  requestId?: string
}`}
          filename="packages/react/src/hooks/clarity-tokens/types.ts"
        />

        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
          <div className="font-semibold text-blue-500 mb-2">💡 Related Types</div>
          <p className="text-sm text-muted-foreground mb-3">
            CostMetrics is part of a family of cost tracking types:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • <code className="text-foreground">CostMetrics</code> - Individual request (this
              type)
            </li>
            <li>
              • <code className="text-foreground">CostTotals</code> - Aggregated totals with
              request count
            </li>
            <li>
              • <code className="text-foreground">CostTracking</code> - Time-based aggregations
              (today, week, month)
            </li>
            <li>
              • <code className="text-foreground">ModelPricing</code> - Pricing configuration for
              models
            </li>
          </ul>
        </div>
      </Section>

      <Section id="properties" title="Properties Reference">
        <p className="text-muted-foreground mb-6">
          Detailed description of each CostMetrics property.
        </p>
        <PropsTable props={typeProperties} />

        <div className="mt-6 space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
            <h4 className="font-semibold text-emerald-500 mb-2">
              🎯 Provider Caching: The Secret to 50-90% Savings
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              The <code className="text-foreground">cachedTokens</code> property tracks tokens that
              hit provider cache. These tokens cost 50-90% less than normal input tokens:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • <strong className="text-foreground">Anthropic:</strong> 90% discount ($0.30 vs
                $3.00 per 1M tokens)
              </li>
              <li>
                • <strong className="text-foreground">OpenAI:</strong> 50% discount ($2.50 vs $5.00
                per 1M tokens for GPT-4o)
              </li>
              <li>
                • <strong className="text-foreground">Google Gemini:</strong> 75% discount
              </li>
            </ul>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-500 mb-2">⚠️ Timestamp for Aggregation</h4>
            <p className="text-sm text-muted-foreground">
              Always use server-side <code className="text-foreground">new Date()</code> for
              timestamp. Client-side timestamps can be inaccurate due to clock skew, breaking
              time-based aggregation (daily, weekly, monthly reports).
            </p>
          </div>
        </div>
      </Section>

      <Section id="usage-examples" title="Usage Examples">
        <p className="text-muted-foreground mb-6">
          Common patterns for creating and working with CostMetrics.
        </p>

        <div className="space-y-8">
          {/* Example 1: Basic Creation */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>1️⃣</span>
              <span>Creating CostMetrics from LLM Response</span>
            </h4>
            <CodeBlock
              language="typescript"
              code={`import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Send request with provider caching
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: 'You are a helpful assistant.',
      cache_control: { type: 'ephemeral' }, // Enable caching
    },
  ],
  messages: [{ role: 'user', content: 'Hello!' }],
})

// Extract usage data
const usage = response.usage

// Create CostMetrics entry
const metrics: CostMetrics = {
  timestamp: new Date(),
  model: 'claude-3-5-sonnet-20241022',
  provider: 'anthropic',
  inputTokens: usage.input_tokens,
  outputTokens: usage.output_tokens,
  cachedTokens: usage.cache_read_input_tokens || 0,
  costUsd: calculateCost({
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    cachedTokens: usage.cache_read_input_tokens || 0,
    model: 'claude-3-5-sonnet-20241022',
  }),
  requestId: response.id,
}

console.log('Cost:', \`$\${metrics.costUsd.toFixed(4)}\`)
console.log('Cached tokens:', metrics.cachedTokens)`}
              filename="create-metrics.ts"
            />
          </div>

          {/* Example 2: Cost Calculation */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>2️⃣</span>
              <span>Cost Calculation with Provider Caching</span>
            </h4>
            <CodeBlock
              language="typescript"
              code={`interface CostCalculationParams {
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  model: string
}

function calculateCost(params: CostCalculationParams): number {
  const { inputTokens, outputTokens, cachedTokens, model } = params

  // Get pricing for model
  const pricing = getModelPricing(model)

  // Calculate costs
  const normalInputTokens = inputTokens - cachedTokens
  const inputCost = (normalInputTokens / 1_000_000) * pricing.inputPer1M
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPer1M
  const cachedCost = (cachedTokens / 1_000_000) * pricing.cachedInputPer1M

  return inputCost + outputCost + cachedCost
}

function getModelPricing(model: string) {
  const pricing = {
    'claude-3-5-sonnet-20241022': {
      inputPer1M: 3.0,
      outputPer1M: 15.0,
      cachedInputPer1M: 0.3, // 90% discount
    },
    'gpt-4o': {
      inputPer1M: 5.0,
      outputPer1M: 15.0,
      cachedInputPer1M: 2.5, // 50% discount
    },
  }

  return pricing[model] || pricing['claude-3-5-sonnet-20241022']
}

// Example usage
const cost = calculateCost({
  inputTokens: 1500,
  outputTokens: 300,
  cachedTokens: 800, // 800 tokens hit cache
  model: 'claude-3-5-sonnet-20241022',
})

console.log(\`Cost: $\${cost.toFixed(4)}\`)
// Cost: $0.0066 (vs $0.0105 without caching = 37% savings)`}
              filename="calculate-cost.ts"
            />
          </div>

          {/* Example 3: Batch Creation */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>3️⃣</span>
              <span>Batch Metrics Creation</span>
            </h4>
            <CodeBlock
              language="typescript"
              code={`interface LLMResponse {
  id: string
  model: string
  usage: {
    input_tokens: number
    output_tokens: number
    cache_read_input_tokens?: number
  }
}

function createMetricsBatch(
  responses: LLMResponse[],
  provider: string
): CostMetrics[] {
  return responses.map((response) => ({
    timestamp: new Date(),
    model: response.model,
    provider,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    cachedTokens: response.usage.cache_read_input_tokens || 0,
    costUsd: calculateCost({
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cachedTokens: response.usage.cache_read_input_tokens || 0,
      model: response.model,
    }),
    requestId: response.id,
  }))
}

// Example: Process 100 responses at once
const responses: LLMResponse[] = await processBatch(requests)
const metrics = createMetricsBatch(responses, 'anthropic')

// Store in database
await db.costMetrics.insertMany(metrics)

console.log(\`Tracked \${metrics.length} requests\`)
console.log(
  \`Total cost: $\${metrics.reduce((sum, m) => sum + m.costUsd, 0).toFixed(2)}\`
)`}
              filename="batch-metrics.ts"
            />
          </div>
        </div>
      </Section>

      <Section id="cost-tracker" title="CostTracker Integration">
        <p className="text-muted-foreground mb-6">
          CostMetrics is the core data structure used by useCostTracker for automatic cost tracking
          and aggregation.
        </p>

        <CodeBlock
          language="typescript"
          code={`import { useCostTracker } from '@clarity-chat/react'
import Anthropic from '@anthropic-ai/sdk'

export function ChatComponent() {
  // Initialize cost tracker
  const costTracker = useCostTracker({
    persist: true, // Save to localStorage
    storageKey: 'my-app-costs',
  })

  async function sendMessage(content: string) {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    // Send request
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: 'You are a helpful assistant.',
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content }],
    })

    // Track cost automatically
    costTracker.add({
      id: response.id,
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022',
      text: response.content[0].text,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        totalTokens:
          response.usage.input_tokens + response.usage.output_tokens,
      },
    }, {
      cachedTokens: response.usage.cache_read_input_tokens || 0,
    })

    return response.content[0].text
  }

  // Get current totals
  const totals = costTracker.totals()

  return (
    <div>
      {/* Chat UI */}
      <div>
        {/* Messages */}
      </div>

      {/* Cost display */}
      <div className="border-t p-4">
        <div className="text-sm text-muted-foreground">
          Total cost: ${totals.costUsd.toFixed(4)}
        </div>
        <div className="text-xs text-muted-foreground">
          {totals.inputTokens.toLocaleString()} input tokens,{' '}
          {totals.outputTokens.toLocaleString()} output tokens,{' '}
          {totals.cachedTokens.toLocaleString()} cached tokens
        </div>
      </div>
    </div>
  )
}`}
          filename="ChatWithCostTracking.tsx"
        />

        <div className="mt-6 bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-3">CostTracker Methods Using CostMetrics</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • <code className="text-foreground">add(response, options)</code> - Converts LLM
              response to CostMetrics
            </li>
            <li>
              • <code className="text-foreground">totals()</code> - Aggregates all CostMetrics
              entries
            </li>
            <li>
              • <code className="text-foreground">history()</code> - Returns array of CostMetrics
              entries
            </li>
            <li>
              • <code className="text-foreground">byModel()</code> - Groups CostMetrics by model
            </li>
            <li>
              • <code className="text-foreground">byProvider()</code> - Groups CostMetrics by
              provider
            </li>
            <li>
              • <code className="text-foreground">forPeriod(since)</code> - Filters CostMetrics by
              timestamp
            </li>
            <li>
              • <code className="text-foreground">exportJson()</code> - Exports CostMetrics as JSON
            </li>
            <li>
              • <code className="text-foreground">exportCsv()</code> - Exports CostMetrics as CSV
            </li>
          </ul>
        </div>
      </Section>

      <Section id="aggregation" title="Aggregation Patterns">
        <p className="text-muted-foreground mb-6">
          Common patterns for aggregating CostMetrics by model, provider, and time period.
        </p>

        <div className="space-y-8">
          {/* By Model */}
          <div>
            <h4 className="font-semibold mb-4">Aggregate by Model</h4>
            <CodeBlock
              language="typescript"
              code={`function aggregateByModel(
  entries: CostMetrics[]
): Record<string, CostTotals> {
  return entries.reduce((acc, entry) => {
    if (!acc[entry.model]) {
      acc[entry.model] = {
        inputTokens: 0,
        outputTokens: 0,
        cachedTokens: 0,
        costUsd: 0,
        requestCount: 0,
      }
    }

    acc[entry.model].inputTokens += entry.inputTokens
    acc[entry.model].outputTokens += entry.outputTokens
    acc[entry.model].cachedTokens += entry.cachedTokens
    acc[entry.model].costUsd += entry.costUsd
    acc[entry.model].requestCount += 1

    return acc
  }, {} as Record<string, CostTotals>)
}

// Example usage
const byModel = aggregateByModel(costMetrics)

console.log('Costs by model:')
Object.entries(byModel).forEach(([model, totals]) => {
  console.log(\`  \${model}: $\${totals.costUsd.toFixed(2)}\`)
  console.log(\`    \${totals.requestCount} requests\`)
  console.log(\`    \${totals.cachedTokens.toLocaleString()} cached tokens\`)
})

// Output:
// Costs by model:
//   claude-3-5-haiku-20241022: $12.50
//     2,500 requests
//     450,000 cached tokens
//   claude-3-5-sonnet-20241022: $87.30
//     1,200 requests
//     180,000 cached tokens`}
              filename="aggregate-by-model.ts"
            />
          </div>

          {/* By Time Period */}
          <div>
            <h4 className="font-semibold mb-4">Aggregate by Time Period</h4>
            <CodeBlock
              language="typescript"
              code={`function aggregateByDay(
  entries: CostMetrics[]
): Record<string, CostTotals> {
  return entries.reduce((acc, entry) => {
    const dateKey = entry.timestamp.toISOString().split('T')[0]

    if (!acc[dateKey]) {
      acc[dateKey] = {
        inputTokens: 0,
        outputTokens: 0,
        cachedTokens: 0,
        costUsd: 0,
        requestCount: 0,
      }
    }

    acc[dateKey].inputTokens += entry.inputTokens
    acc[dateKey].outputTokens += entry.outputTokens
    acc[dateKey].cachedTokens += entry.cachedTokens
    acc[dateKey].costUsd += entry.costUsd
    acc[dateKey].requestCount += 1

    return acc
  }, {} as Record<string, CostTotals>)
}

// Example: Daily cost trend
const dailyCosts = aggregateByDay(costMetrics)

console.log('Daily costs:')
Object.entries(dailyCosts)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([date, totals]) => {
    console.log(\`  \${date}: $\${totals.costUsd.toFixed(2)}\`)
  })

// Output:
// Daily costs:
//   2026-01-26: $42.15
//   2026-01-27: $38.92
//   2026-01-28: $41.03`}
              filename="aggregate-by-day.ts"
            />
          </div>

          {/* Cache Hit Rate */}
          <div>
            <h4 className="font-semibold mb-4">Calculate Cache Hit Rate</h4>
            <CodeBlock
              language="typescript"
              code={`function calculateCacheHitRate(entries: CostMetrics[]): number {
  const totalInputTokens = entries.reduce(
    (sum, e) => sum + e.inputTokens,
    0
  )
  const totalCachedTokens = entries.reduce(
    (sum, e) => sum + e.cachedTokens,
    0
  )

  if (totalInputTokens === 0) return 0

  return (totalCachedTokens / totalInputTokens) * 100
}

// Example usage
const cacheHitRate = calculateCacheHitRate(costMetrics)

console.log(\`Cache hit rate: \${cacheHitRate.toFixed(1)}%\`)

// Interpretation:
// - 60%+ = Excellent (provider caching working well)
// - 40-60% = Good (room for improvement)
// - <40% = Poor (check cache_control configuration)`}
              filename="cache-hit-rate.ts"
            />
          </div>
        </div>
      </Section>

      <Section id="dashboard" title="Dashboard Integration">
        <p className="text-muted-foreground mb-6">
          Build real-time cost dashboards using CostMetrics aggregations.
        </p>

        <CodeBlock
          language="typescript"
          code={`'use client'

import { useCostTracker } from '@clarity-chat/react'
import { useMemo } from 'react'

export function CostDashboard() {
  const costTracker = useCostTracker({ persist: true })

  // Get all metrics
  const history = costTracker.history()

  // Calculate aggregations
  const stats = useMemo(() => {
    const totals = costTracker.totals()
    const byModel = costTracker.byModel()

    // Time periods
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const todayCosts = costTracker.forPeriod(today)
    const weekCosts = costTracker.forPeriod(weekAgo)

    // Cache hit rate
    const cacheHitRate =
      totals.inputTokens > 0
        ? (totals.cachedTokens / totals.inputTokens) * 100
        : 0

    // Cost per request
    const avgCostPerRequest =
      totals.requestCount > 0
        ? totals.costUsd / totals.requestCount
        : 0

    return {
      totals,
      byModel,
      todayCosts,
      weekCosts,
      cacheHitRate,
      avgCostPerRequest,
    }
  }, [history])

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              \${stats.totals.costUsd.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totals.requestCount.toLocaleString()} requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              \${stats.todayCosts.costUsd.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.todayCosts.requestCount} requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cache Hit Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.cacheHitRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totals.cachedTokens.toLocaleString()} cached tokens
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Cost/Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              \${stats.avgCostPerRequest.toFixed(4)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost by Model */}
      <Card>
        <CardHeader>
          <CardTitle>Cost by Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.byModel).map(([model, totals]) => (
              <div key={model} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{model}</span>
                  <span className="text-sm">
                    \${totals.costUsd.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{totals.requestCount} requests</span>
                  <span>
                    {totals.cachedTokens.toLocaleString()} cached
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            const csv = costTracker.exportCsv()
            downloadFile(csv, 'cost-metrics.csv', 'text/csv')
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Export CSV
        </button>
        <button
          onClick={() => {
            const json = costTracker.exportJson()
            downloadFile(json, 'cost-metrics.json', 'application/json')
          }}
          className="px-4 py-2 border rounded-lg"
        >
          Export JSON
        </button>
      </div>
    </div>
  )
}

function downloadFile(
  content: string,
  filename: string,
  mimeType: string
) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}`}
          filename="CostDashboard.tsx"
        />
      </Section>

      <Section id="export-formats" title="Export Formats">
        <p className="text-muted-foreground mb-6">
          CostMetrics can be exported to CSV and JSON for integration with analytics platforms.
        </p>

        <div className="space-y-8">
          {/* CSV Format */}
          <div>
            <h4 className="font-semibold mb-4">CSV Export Format</h4>
            <CodeBlock
              language="typescript"
              code={`function exportCsv(entries: CostMetrics[]): string {
  const headers = [
    'timestamp',
    'model',
    'provider',
    'inputTokens',
    'outputTokens',
    'cachedTokens',
    'costUsd',
    'requestId',
  ]

  const rows = entries.map((entry) => [
    entry.timestamp.toISOString(),
    entry.model,
    entry.provider,
    entry.inputTokens.toString(),
    entry.outputTokens.toString(),
    entry.cachedTokens.toString(),
    entry.costUsd.toFixed(6),
    entry.requestId ?? '',
  ])

  return [headers.join(','), ...rows.map((row) => row.join(','))].join(
    '\\n'
  )
}

// Example CSV output:
// timestamp,model,provider,inputTokens,outputTokens,cachedTokens,costUsd,requestId
// 2026-01-28T10:30:00.000Z,claude-3-5-sonnet-20241022,anthropic,1500,300,800,0.004200,req_abc123
// 2026-01-28T10:31:15.000Z,claude-3-5-haiku-20241022,anthropic,800,150,400,0.000900,req_def456`}
              filename="export-csv.ts"
            />
          </div>

          {/* JSON Format */}
          <div>
            <h4 className="font-semibold mb-4">JSON Export Format</h4>
            <CodeBlock
              language="typescript"
              code={`function exportJson(entries: CostMetrics[]): string {
  const data = {
    exportedAt: new Date().toISOString(),
    totalEntries: entries.length,
    totals: {
      inputTokens: entries.reduce((sum, e) => sum + e.inputTokens, 0),
      outputTokens: entries.reduce((sum, e) => sum + e.outputTokens, 0),
      cachedTokens: entries.reduce((sum, e) => sum + e.cachedTokens, 0),
      costUsd: entries.reduce((sum, e) => sum + e.costUsd, 0),
    },
    entries: entries.map((entry) => ({
      ...entry,
      timestamp: entry.timestamp.toISOString(),
    })),
  }

  return JSON.stringify(data, null, 2)
}

// Example JSON output:
// {
//   "exportedAt": "2026-01-28T10:35:00.000Z",
//   "totalEntries": 2,
//   "totals": {
//     "inputTokens": 2300,
//     "outputTokens": 450,
//     "cachedTokens": 1200,
//     "costUsd": 0.0051
//   },
//   "entries": [
//     {
//       "timestamp": "2026-01-28T10:30:00.000Z",
//       "model": "claude-3-5-sonnet-20241022",
//       "provider": "anthropic",
//       "inputTokens": 1500,
//       "outputTokens": 300,
//       "cachedTokens": 800,
//       "costUsd": 0.0042,
//       "requestId": "req_abc123"
//     }
//   ]
// }`}
              filename="export-json.ts"
            />
          </div>
        </div>
      </Section>

      <Section id="time-based" title="Time-Based Aggregation">
        <p className="text-muted-foreground mb-6">
          Aggregate CostMetrics by time periods (hour, day, week, month) for trend analysis.
        </p>

        <CodeBlock
          language="typescript"
          code={`type TimePeriod = 'hour' | 'day' | 'week' | 'month'

function aggregateByTimePeriod(
  entries: CostMetrics[],
  period: TimePeriod
): Record<string, CostTotals> {
  return entries.reduce((acc, entry) => {
    const key = getTimePeriodKey(entry.timestamp, period)

    if (!acc[key]) {
      acc[key] = {
        inputTokens: 0,
        outputTokens: 0,
        cachedTokens: 0,
        costUsd: 0,
        requestCount: 0,
      }
    }

    acc[key].inputTokens += entry.inputTokens
    acc[key].outputTokens += entry.outputTokens
    acc[key].cachedTokens += entry.cachedTokens
    acc[key].costUsd += entry.costUsd
    acc[key].requestCount += 1

    return acc
  }, {} as Record<string, CostTotals>)
}

function getTimePeriodKey(date: Date, period: TimePeriod): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')

  switch (period) {
    case 'hour':
      return \`\${year}-\${month}-\${day} \${hour}:00\`
    case 'day':
      return \`\${year}-\${month}-\${day}\`
    case 'week':
      const weekNumber = getWeekNumber(date)
      return \`\${year}-W\${String(weekNumber).padStart(2, '0')}\`
    case 'month':
      return \`\${year}-\${month}\`
  }
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear =
    (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// Example: Monthly aggregation
const monthlyCosts = aggregateByTimePeriod(costMetrics, 'month')

console.log('Monthly costs:')
Object.entries(monthlyCosts)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([month, totals]) => {
    console.log(\`  \${month}: $\${totals.costUsd.toFixed(2)}\`)
    console.log(\`    Cache hit rate: \${(totals.cachedTokens / totals.inputTokens * 100).toFixed(1)}%\`)
  })

// Output:
// Monthly costs:
//   2025-12: $1,248.50
//     Cache hit rate: 58.2%
//   2026-01: $742.30
//     Cache hit rate: 64.7%`}
          filename="time-based-aggregation.ts"
        />
      </Section>

      <Section id="enterprise" title="Enterprise Production">
        <p className="text-muted-foreground mb-6">
          Best practices for using CostMetrics in enterprise production environments.
        </p>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>🏢</span>
              <span>Enterprise Requirements</span>
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Persistent Storage:</strong> Store
                  CostMetrics in database (PostgreSQL, MongoDB) for long-term analysis and
                  compliance
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Audit Trails:</strong> Always populate
                  requestId for debugging and compliance audits
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Budget Alerts:</strong> Monitor daily/monthly
                  aggregations and alert when exceeding budget thresholds
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Cost Attribution:</strong> Add userId,
                  teamId, projectId fields to CostMetrics for multi-tenant cost tracking
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Database Schema Example</h4>
            <CodeBlock
              language="sql"
              code={`-- PostgreSQL schema for CostMetrics
CREATE TABLE cost_metrics (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  model VARCHAR(100) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  cached_tokens INTEGER NOT NULL,
  cost_usd DECIMAL(10, 6) NOT NULL,
  request_id VARCHAR(100),
  user_id VARCHAR(100), -- For multi-tenant tracking
  team_id VARCHAR(100),
  project_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast aggregation
CREATE INDEX idx_timestamp ON cost_metrics(timestamp);
CREATE INDEX idx_model ON cost_metrics(model);
CREATE INDEX idx_provider ON cost_metrics(provider);
CREATE INDEX idx_user_id ON cost_metrics(user_id);
CREATE INDEX idx_team_id ON cost_metrics(team_id);

-- Query examples
-- Daily costs for a user
SELECT
  DATE(timestamp) as date,
  SUM(cost_usd) as total_cost,
  SUM(input_tokens) as total_input_tokens,
  SUM(cached_tokens) as total_cached_tokens
FROM cost_metrics
WHERE user_id = 'user_123'
  AND timestamp >= NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Model distribution for a team
SELECT
  model,
  COUNT(*) as request_count,
  SUM(cost_usd) as total_cost,
  AVG(cost_usd) as avg_cost_per_request
FROM cost_metrics
WHERE team_id = 'team_456'
  AND timestamp >= NOW() - INTERVAL '7 days'
GROUP BY model
ORDER BY total_cost DESC;`}
              filename="schema.sql"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="font-semibold text-blue-500 mb-2">
            📚 Learn More: Enterprise Production Pipeline
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            For complete enterprise deployment guidance including monitoring, scaling, and cost
            governance, see the Enterprise Production Pipeline cookbook.
          </p>
          <a
            href="/cookbook/enterprise-production-pipeline"
            className="text-sm text-blue-500 hover:underline"
          >
            View Enterprise Production Pipeline Cookbook →
          </a>
        </div>
      </Section>

      <Section id="related" title="Related APIs">
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/reference/hooks/use-cost-tracker"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              useCostTracker Hook →
            </h4>
            <p className="text-sm text-muted-foreground">
              React hook for automatic cost tracking, aggregation, and export using CostMetrics
            </p>
          </a>

          <a
            href="/reference/types/cost-totals"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              CostTotals Type →
            </h4>
            <p className="text-sm text-muted-foreground">
              Aggregated cost totals with request count for dashboard display
            </p>
          </a>

          <a
            href="/reference/types/cost-tracking"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              CostTracking Type →
            </h4>
            <p className="text-sm text-muted-foreground">
              Time-based cost aggregations (today, week, month, all-time) with model/category
              breakdowns
            </p>
          </a>

          <a
            href="/cookbook/enterprise-production-pipeline"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              Enterprise Production Pipeline →
            </h4>
            <p className="text-sm text-muted-foreground">
              Deploy CostMetrics tracking at scale with monitoring, alerts, and cost governance
            </p>
          </a>
        </div>
      </Section>
    </DocumentationPage>
  )
}
