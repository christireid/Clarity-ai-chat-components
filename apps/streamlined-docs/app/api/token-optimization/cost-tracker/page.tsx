import type { Metadata } from 'next'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import { PropsTable, PropDefinition } from '../../../../../components/Docs/PropsTable'
import { LiveDemoContainer } from '../../../../../components/Docs/LiveDemoContainer'
import { CodeBlock } from '../../../../../components/Docs/CodeBlock'
import { TocItem } from '../../../../../components/Docs/TableOfContents'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'useCostTracker Hook | Clarity AI Chat Components',
  description:
    'Real-time cost tracking hook that accumulates token usage and estimates costs across models and providers. Track savings, export reports, and monitor spending patterns.',
  openGraph: {
    title: 'useCostTracker Hook',
    description: 'Real-time cost tracking with cumulative statistics and savings reports',
    type: 'article',
  },
}

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  { id: 'api-reference', title: 'API Reference', level: 2 },
  { id: 'config-options', title: 'Configuration Options', level: 2 },
  { id: 'return-values', title: 'Return Values', level: 2 },
  { id: 'real-time-tracking', title: 'Real-Time Cost Tracking', level: 2 },
  { id: 'cumulative-statistics', title: 'Cumulative Statistics', level: 2 },
  { id: 'savings-reports', title: 'Savings Reports', level: 2 },
  { id: 'multi-model-tracking', title: 'Multi-Model Tracking', level: 2 },
  { id: 'time-period-analysis', title: 'Time Period Analysis', level: 2 },
  { id: 'export-functionality', title: 'Export Functionality', level: 2 },
  { id: 'persistence', title: 'Persistence & Storage', level: 2 },
  { id: 'cost-estimation', title: 'Cost Estimation', level: 2 },
  { id: 'integration-examples', title: 'Integration Examples', level: 2 },
  { id: 'best-practices', title: 'Best Practices', level: 2 },
  { id: 'related', title: 'Related APIs', level: 2 },
]

// Configuration props
const configProps: PropDefinition[] = [
  {
    name: 'pricing',
    type: 'Record<string, ModelPricing>',
    description:
      'Custom pricing overrides for models. ModelPricing contains inputPer1K, outputPer1K, and optional cachedInputPer1K.',
  },
  {
    name: 'persist',
    type: 'boolean',
    default: 'false',
    description: 'Enable persistence to localStorage for tracking across sessions',
  },
  {
    name: 'storageKey',
    type: 'string',
    default: "'clarity-tokens-cost-tracker'",
    description: 'Storage key for localStorage persistence',
  },
  {
    name: 'maxHistoryEntries',
    type: 'number',
    default: '1000',
    description: 'Maximum number of entries to keep in history (oldest entries are pruned)',
  },
]

// Return value methods
const returnMethods: PropDefinition[] = [
  {
    name: 'add',
    type: '(res: LLMResponse, options?: { cached?: boolean; cachedTokens?: number }) => void',
    required: true,
    description:
      'Add an LLM response to track. Automatically calculates cost based on usage and model pricing.',
  },
  {
    name: 'totals',
    type: '() => CostTotals',
    required: true,
    description:
      'Get cumulative totals across all tracked requests (inputTokens, outputTokens, cachedTokens, costUsd, requestCount)',
  },
  {
    name: 'history',
    type: '() => CostEntry[]',
    required: true,
    description: 'Get complete cost history as array of CostEntry objects with timestamps',
  },
  {
    name: 'byModel',
    type: '() => Record<string, CostTotals>',
    required: true,
    description: 'Get aggregated totals grouped by model name (e.g., gpt-4, claude-3-opus)',
  },
  {
    name: 'byProvider',
    type: '() => Record<string, CostTotals>',
    required: true,
    description: 'Get aggregated totals grouped by provider (e.g., OpenAI, Anthropic)',
  },
  {
    name: 'forPeriod',
    type: '(since: Date) => CostTotals',
    required: true,
    description: 'Get totals for entries since a specific date (useful for daily/weekly reports)',
  },
  {
    name: 'reset',
    type: '() => void',
    required: true,
    description: 'Clear all tracking data and reset to initial state',
  },
  {
    name: 'exportJson',
    type: '() => string',
    required: true,
    description: 'Export all data as formatted JSON string with totals, byModel, byProvider, and history',
  },
  {
    name: 'exportCsv',
    type: '() => string',
    required: true,
    description: 'Export history as CSV string with headers for spreadsheet analysis',
  },
  {
    name: 'estimate',
    type: '(model: string, inputTokens: number, outputTokens: number) => number',
    required: true,
    description: 'Estimate cost for a planned request before making it',
  },
]

export default function CostTrackerPage() {
  return (
    <DocumentationPage
      title="useCostTracker"
      description="Real-time cost tracking with cumulative statistics and savings reports"
      category="Token Optimization"
      icon="💰"
      badges={[
        { label: 'Medium Priority', variant: 'default' },
        { label: 'Cost Management', variant: 'info' },
        { label: 'Analytics', variant: 'primary' },
      ]}
      features={[
        'Real-time cost accumulation across all LLM calls',
        'Cumulative statistics (total tokens, cost, request count)',
        'Multi-model and multi-provider cost tracking',
        'Time period analysis (daily, weekly, monthly costs)',
        'Cached token cost calculation with reduced pricing',
        'Export to JSON and CSV formats',
        'Optional localStorage persistence',
        'Cost estimation for planned requests',
        'Aggregation by model and provider',
        'Automatic history pruning (configurable max entries)',
      ]}
      tableOfContents={tableOfContents}
    >
      <Section id="overview" title="Overview">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          useCostTracker is a React hook that accumulates token usage and estimated costs across all
          your LLM API calls. Perfect for tracking spending patterns, generating cost reports, and
          identifying optimization opportunities.
        </p>

        <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span>Why Track Costs?</span>
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Budget Control:</strong> Monitor spending in
                real-time to stay within budget limits
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Cost Attribution:</strong> Track costs by model,
                provider, or time period for detailed reports
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Optimization Insights:</strong> Identify which
                models or features consume the most tokens
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Savings Measurement:</strong> Quantify cost
                reductions from caching and optimization strategies
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span>📊</span>
            <span>Key Capabilities</span>
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium mb-1">Real-Time Tracking</div>
              <p className="text-muted-foreground">
                Accumulate costs as responses arrive with automatic token and cost calculation
              </p>
            </div>
            <div>
              <div className="font-medium mb-1">Multi-Model Support</div>
              <p className="text-muted-foreground">
                Track costs across GPT-4, Claude, Gemini, and other models with accurate pricing
              </p>
            </div>
            <div>
              <div className="font-medium mb-1">Time-Based Analysis</div>
              <p className="text-muted-foreground">
                Generate daily, weekly, or monthly cost reports with forPeriod()
              </p>
            </div>
            <div>
              <div className="font-medium mb-1">Export & Reporting</div>
              <p className="text-muted-foreground">
                Export to JSON or CSV for further analysis in spreadsheets or BI tools
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="installation" title="Installation">
        <CodeBlock
          language="bash"
          code={`# Install the React components package
pnpm add @clarity-chat/react

# Or with npm
npm install @clarity-chat/react

# Or with yarn
yarn add @clarity-chat/react`}
          filename="terminal"
        />
      </Section>

      <Section id="basic-usage" title="Basic Usage">
        <p className="text-muted-foreground mb-6">
          The simplest integration: track costs as responses arrive from your LLM API.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useCostTracker } from '@clarity-chat/react'

export function ChatWithCostTracking() {
  const cost = useCostTracker()

  const handleResponse = async (userMessage: string) => {
    // Make LLM API call
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: userMessage }),
    })

    const data = await response.json()

    // Track the response cost
    cost.add({
      id: data.id,
      provider: 'openai',
      model: 'gpt-4',
      text: data.text,
      usage: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
    })
  }

  // Display current costs
  const { costUsd, requestCount } = cost.totals()

  return (
    <div>
      <div className="cost-summary">
        Total Cost: \${costUsd.toFixed(4)} | Requests: {requestCount}
      </div>
      {/* Your chat UI */}
    </div>
  )
}`}
          filename="ChatWithCostTracking.tsx"
        />

        <div className="mt-6 bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-3">Default Behavior</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Automatically calculates costs using built-in pricing for popular models</li>
            <li>• Tracks input tokens, output tokens, and total cost per request</li>
            <li>• Maintains cumulative statistics across all requests</li>
            <li>• Stores up to 1,000 entries in memory (configurable)</li>
            <li>• No persistence (data lost on page reload unless enabled)</li>
          </ul>
        </div>
      </Section>

      <Section id="api-reference" title="API Reference">
        <h3 className="text-xl font-semibold mb-4">Hook Signature</h3>
        <CodeBlock
          language="typescript"
          code={`function useCostTracker(
  config?: UseCostTrackerConfig
): UseCostTrackerReturn`}
          filename="api.ts"
        />
      </Section>

      <Section id="config-options" title="Configuration Options">
        <p className="text-muted-foreground mb-6">
          Configure the hook with custom pricing, persistence, and history limits.
        </p>
        <PropsTable props={configProps} />

        <div className="mt-6">
          <h4 className="font-semibold mb-4">Example Configuration</h4>
          <CodeBlock
            language="tsx"
            code={`import { useCostTracker } from '@clarity-chat/react'

const cost = useCostTracker({
  // Custom pricing for specific models
  pricing: {
    'gpt-4-turbo': {
      inputPer1K: 0.01,    // $0.01 per 1K input tokens
      outputPer1K: 0.03,   // $0.03 per 1K output tokens
      cachedInputPer1K: 0.005  // $0.005 per 1K cached tokens (50% off)
    }
  },

  // Enable persistence across sessions
  persist: true,
  storageKey: 'my-app-cost-tracker',

  // Keep last 5000 entries
  maxHistoryEntries: 5000,
})`}
            filename="config.tsx"
          />
        </div>
      </Section>

      <Section id="return-values" title="Return Values">
        <p className="text-muted-foreground mb-6">
          The hook returns an object with methods for tracking, querying, and exporting cost data.
        </p>
        <PropsTable props={returnMethods} />

        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="font-semibold text-blue-500 mb-2">💡 Type Definitions</div>
          <CodeBlock
            language="typescript"
            code={`interface CostTotals {
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  costUsd: number
  requestCount: number
}

interface CostEntry {
  timestamp: Date
  model: string
  provider: string
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  costUsd: number
  requestId?: string
}

interface LLMResponse {
  id: string
  provider: string
  model: string
  text: string
  usage?: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
}`}
            filename="types.ts"
          />
        </div>
      </Section>

      <Section id="real-time-tracking" title="Real-Time Cost Tracking">
        <p className="text-muted-foreground mb-6">
          Track costs as streaming responses arrive, with support for cached tokens.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useCostTracker } from '@clarity-chat/react'
import { useState } from 'react'

export function StreamingChatWithCosts() {
  const cost = useCostTracker()
  const [currentCost, setCurrentCost] = useState(0)

  const handleStreamingResponse = async (message: string) => {
    const response = await fetch('/api/chat/streaming', {
      method: 'POST',
      body: JSON.stringify({ message }),
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const data = JSON.parse(chunk)

      // Track each chunk
      if (data.usage) {
        cost.add({
          id: data.id,
          provider: 'anthropic',
          model: 'claude-3-opus',
          text: data.text,
          usage: data.usage,
        }, {
          // Track cached tokens for cost savings
          cached: data.cached,
          cachedTokens: data.usage.cached_tokens,
        })

        // Update display
        const totals = cost.totals()
        setCurrentCost(totals.costUsd)
      }
    }
  }

  return (
    <div>
      <div className="live-cost">
        Current Cost: \${currentCost.toFixed(6)}
      </div>
      {/* Chat UI */}
    </div>
  )
}`}
          filename="StreamingChatWithCosts.tsx"
        />

        <div className="mt-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 rounded-xl p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <span>💵</span>
            <span>Cached Token Savings</span>
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            When using prompt caching, cached tokens typically cost 50-90% less than regular input
            tokens. useCostTracker automatically applies reduced pricing when you provide cached
            token counts.
          </p>
          <CodeBlock
            language="tsx"
            code={`// Track response with cached tokens
cost.add(response, {
  cached: true,              // Mark as using cache
  cachedTokens: 2000,        // Number of cached tokens
})

// Cost calculation:
// Regular input tokens: (3000 - 2000) * $0.003/1K = $0.003
// Cached tokens: 2000 * $0.0015/1K = $0.003 (50% off)
// Output tokens: 500 * $0.015/1K = $0.0075
// Total: $0.0135 instead of $0.0225 (40% savings)`}
            filename="cached-savings.tsx"
          />
        </div>
      </Section>

      <Section id="cumulative-statistics" title="Cumulative Statistics">
        <p className="text-muted-foreground mb-6">
          Get aggregated statistics across all tracked requests with totals().
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useCostTracker } from '@clarity-chat/react'

export function CostDashboard() {
  const cost = useCostTracker({ persist: true })

  const {
    inputTokens,
    outputTokens,
    cachedTokens,
    costUsd,
    requestCount,
  } = cost.totals()

  // Calculate savings from caching
  const totalTokens = inputTokens + outputTokens
  const cacheHitRate = (cachedTokens / totalTokens) * 100

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Cost</h3>
        <p className="value">\${costUsd.toFixed(2)}</p>
      </div>

      <div className="stat-card">
        <h3>Total Requests</h3>
        <p className="value">{requestCount.toLocaleString()}</p>
      </div>

      <div className="stat-card">
        <h3>Total Tokens</h3>
        <p className="value">{totalTokens.toLocaleString()}</p>
        <p className="breakdown">
          Input: {inputTokens.toLocaleString()} |
          Output: {outputTokens.toLocaleString()} |
          Cached: {cachedTokens.toLocaleString()}
        </p>
      </div>

      <div className="stat-card">
        <h3>Cache Hit Rate</h3>
        <p className="value">{cacheHitRate.toFixed(1)}%</p>
        <p className="description">
          Higher is better - more savings!
        </p>
      </div>

      <div className="stat-card">
        <h3>Avg Cost/Request</h3>
        <p className="value">
          \${(costUsd / requestCount).toFixed(4)}
        </p>
      </div>
    </div>
  )
}`}
          filename="CostDashboard.tsx"
        />
      </Section>

      <Section id="savings-reports" title="Savings Reports">
        <p className="text-muted-foreground mb-6">
          Calculate cost savings from optimization strategies like caching and model selection.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useCostTracker } from '@clarity-chat/react'

export function SavingsReport() {
  const cost = useCostTracker()

  const generateSavingsReport = () => {
    const totals = cost.totals()

    // Calculate what cost would have been without caching
    const cachedTokenCost = (totals.cachedTokens / 1000) * 0.003 // Full price
    const actualCachedCost = (totals.cachedTokens / 1000) * 0.0015 // 50% off
    const cacheSavings = cachedTokenCost - actualCachedCost

    // Calculate savings from using efficient models
    const byModel = cost.byModel()
    let modelSavings = 0

    Object.entries(byModel).forEach(([model, stats]) => {
      if (model === 'gpt-3.5-turbo') {
        // What it would cost with GPT-4
        const gpt4Cost =
          (stats.inputTokens / 1000) * 0.03 +
          (stats.outputTokens / 1000) * 0.06
        modelSavings += gpt4Cost - stats.costUsd
      }
    })

    return {
      cacheSavings: cacheSavings.toFixed(4),
      modelSavings: modelSavings.toFixed(4),
      totalSavings: (cacheSavings + modelSavings).toFixed(4),
      savingsPercentage: (
        ((cacheSavings + modelSavings) / totals.costUsd) * 100
      ).toFixed(1),
    }
  }

  const savings = generateSavingsReport()

  return (
    <div className="savings-report">
      <h2>Cost Optimization Savings</h2>

      <div className="savings-breakdown">
        <div className="savings-item">
          <span>Prompt Caching</span>
          <span className="amount">-\${savings.cacheSavings}</span>
        </div>

        <div className="savings-item">
          <span>Efficient Model Selection</span>
          <span className="amount">-\${savings.modelSavings}</span>
        </div>

        <div className="savings-total">
          <span>Total Savings</span>
          <span className="amount">
            -\${savings.totalSavings} ({savings.savingsPercentage}%)
          </span>
        </div>
      </div>

      <div className="insight">
        Your optimization strategies have reduced costs by{' '}
        {savings.savingsPercentage}% compared to baseline usage.
      </div>
    </div>
  )
}`}
          filename="SavingsReport.tsx"
        />
      </Section>

      <Section id="multi-model-tracking" title="Multi-Model Tracking">
        <p className="text-muted-foreground mb-6">
          Track and compare costs across different models and providers.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useCostTracker } from '@clarity-chat/react'

export function ModelCostComparison() {
  const cost = useCostTracker()

  const byModel = cost.byModel()
  const byProvider = cost.byProvider()

  return (
    <div className="cost-breakdown">
      {/* By Model */}
      <div className="breakdown-section">
        <h3>Cost by Model</h3>
        <div className="breakdown-list">
          {Object.entries(byModel)
            .sort(([, a], [, b]) => b.costUsd - a.costUsd)
            .map(([model, stats]) => (
              <div key={model} className="breakdown-item">
                <div className="model-name">{model}</div>
                <div className="model-stats">
                  <span>\${stats.costUsd.toFixed(4)}</span>
                  <span className="requests">
                    {stats.requestCount} requests
                  </span>
                  <span className="tokens">
                    {stats.inputTokens + stats.outputTokens} tokens
                  </span>
                </div>
                <div className="cost-bar" style={{
                  width: \`\${(stats.costUsd / cost.totals().costUsd) * 100}%\`
                }} />
              </div>
            ))}
        </div>
      </div>

      {/* By Provider */}
      <div className="breakdown-section">
        <h3>Cost by Provider</h3>
        <div className="breakdown-list">
          {Object.entries(byProvider)
            .sort(([, a], [, b]) => b.costUsd - a.costUsd)
            .map(([provider, stats]) => (
              <div key={provider} className="breakdown-item">
                <div className="provider-name">{provider}</div>
                <div className="provider-stats">
                  <span>\${stats.costUsd.toFixed(4)}</span>
                  <span className="requests">
                    {stats.requestCount} requests
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}`}
          filename="ModelCostComparison.tsx"
        />

        <div className="mt-6 bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-3">Built-in Model Pricing</h4>
          <p className="text-sm text-muted-foreground mb-4">
            useCostTracker includes pricing for popular models. Custom pricing overrides any
            built-in values.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Model</th>
                  <th className="text-left py-3 px-4 font-semibold">Input (per 1K)</th>
                  <th className="text-left py-3 px-4 font-semibold">Output (per 1K)</th>
                  <th className="text-left py-3 px-4 font-semibold">Cached (per 1K)</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">gpt-4</td>
                  <td className="py-3 px-4 font-mono">$0.03</td>
                  <td className="py-3 px-4 font-mono">$0.06</td>
                  <td className="py-3 px-4 font-mono">-</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">gpt-4-turbo</td>
                  <td className="py-3 px-4 font-mono">$0.01</td>
                  <td className="py-3 px-4 font-mono">$0.03</td>
                  <td className="py-3 px-4 font-mono">-</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">gpt-3.5-turbo</td>
                  <td className="py-3 px-4 font-mono">$0.0015</td>
                  <td className="py-3 px-4 font-mono">$0.002</td>
                  <td className="py-3 px-4 font-mono">-</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">claude-3-opus</td>
                  <td className="py-3 px-4 font-mono">$0.015</td>
                  <td className="py-3 px-4 font-mono">$0.075</td>
                  <td className="py-3 px-4 font-mono">$0.0075</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">claude-3-sonnet</td>
                  <td className="py-3 px-4 font-mono">$0.003</td>
                  <td className="py-3 px-4 font-mono">$0.015</td>
                  <td className="py-3 px-4 font-mono">$0.0015</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section id="time-period-analysis" title="Time Period Analysis">
        <p className="text-muted-foreground mb-6">
          Generate cost reports for specific time periods using forPeriod().
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useCostTracker } from '@clarity-chat/react'

export function TimePeriodReports() {
  const cost = useCostTracker({ persist: true })

  const generateDailyReport = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return cost.forPeriod(today)
  }

  const generateWeeklyReport = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    weekAgo.setHours(0, 0, 0, 0)
    return cost.forPeriod(weekAgo)
  }

  const generateMonthlyReport = () => {
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    monthAgo.setHours(0, 0, 0, 0)
    return cost.forPeriod(monthAgo)
  }

  const todayStats = generateDailyReport()
  const weekStats = generateWeeklyReport()
  const monthStats = generateMonthlyReport()

  return (
    <div className="period-reports">
      <div className="period-card">
        <h3>Today</h3>
        <p className="cost">\${todayStats.costUsd.toFixed(4)}</p>
        <p className="requests">{todayStats.requestCount} requests</p>
        <p className="tokens">
          {(todayStats.inputTokens + todayStats.outputTokens).toLocaleString()} tokens
        </p>
      </div>

      <div className="period-card">
        <h3>Last 7 Days</h3>
        <p className="cost">\${weekStats.costUsd.toFixed(2)}</p>
        <p className="requests">{weekStats.requestCount} requests</p>
        <p className="avg">
          Avg: \${(weekStats.costUsd / 7).toFixed(4)}/day
        </p>
      </div>

      <div className="period-card">
        <h3>Last 30 Days</h3>
        <p className="cost">\${monthStats.costUsd.toFixed(2)}</p>
        <p className="requests">{monthStats.requestCount} requests</p>
        <p className="avg">
          Avg: \${(monthStats.costUsd / 30).toFixed(4)}/day
        </p>
      </div>

      {/* Trend indicator */}
      <div className="trend-card">
        <h3>Spending Trend</h3>
        {(() => {
          const dailyAvg = todayStats.costUsd
          const weeklyAvg = weekStats.costUsd / 7
          const trend = ((dailyAvg - weeklyAvg) / weeklyAvg) * 100

          return (
            <p className={trend > 0 ? 'trend-up' : 'trend-down'}>
              {trend > 0 ? '📈' : '📉'}{' '}
              {Math.abs(trend).toFixed(1)}%{' '}
              {trend > 0 ? 'higher' : 'lower'} than 7-day average
            </p>
          )
        })()}
      </div>
    </div>
  )
}`}
          filename="TimePeriodReports.tsx"
        />
      </Section>

      <Section id="export-functionality" title="Export Functionality">
        <p className="text-muted-foreground mb-6">
          Export cost data to JSON or CSV for further analysis in spreadsheets or BI tools.
        </p>

        <div className="space-y-8">
          {/* JSON Export */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>1️⃣</span>
              <span>Export to JSON</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { useCostTracker } from '@clarity-chat/react'

export function ExportToJSON() {
  const cost = useCostTracker()

  const handleExport = () => {
    const jsonData = cost.exportJson()

    // Create download
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`cost-report-\${new Date().toISOString()}.json\`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button onClick={handleExport}>
      Export JSON Report
    </button>
  )
}

// JSON format:
// {
//   "exportedAt": "2026-01-28T...",
//   "totals": { ... },
//   "byModel": { ... },
//   "byProvider": { ... },
//   "history": [ ... ]
// }`}
              filename="ExportJSON.tsx"
            />
          </div>

          {/* CSV Export */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>2️⃣</span>
              <span>Export to CSV</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { useCostTracker } from '@clarity-chat/react'

export function ExportToCSV() {
  const cost = useCostTracker()

  const handleExport = () => {
    const csvData = cost.exportCsv()

    // Create download
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`cost-history-\${new Date().toISOString()}.csv\`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button onClick={handleExport}>
      Export CSV for Excel
    </button>
  )
}

// CSV format:
// timestamp,model,provider,inputTokens,outputTokens,cachedTokens,costUsd,requestId
// 2026-01-28T...,gpt-4,openai,1500,500,0,0.0525,req_123
// 2026-01-28T...,claude-3-opus,anthropic,2000,600,1000,0.0615,req_124`}
              filename="ExportCSV.tsx"
            />
          </div>

          {/* Scheduled Export */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>3️⃣</span>
              <span>Scheduled Daily Export</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { useCostTracker } from '@clarity-chat/react'
import { useEffect } from 'react'

export function AutomatedReporting() {
  const cost = useCostTracker({ persist: true })

  useEffect(() => {
    // Check if we should export (once per day)
    const lastExport = localStorage.getItem('last-export-date')
    const today = new Date().toDateString()

    if (lastExport !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)

      const yesterdayStats = cost.forPeriod(yesterday)

      // Send to analytics endpoint
      fetch('/api/analytics/daily-costs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: yesterday.toISOString(),
          stats: yesterdayStats,
          breakdown: cost.byModel(),
        }),
      })

      localStorage.setItem('last-export-date', today)
    }
  }, [cost])

  return null // Background process
}`}
              filename="AutomatedReporting.tsx"
            />
          </div>
        </div>
      </Section>

      <Section id="persistence" title="Persistence & Storage">
        <p className="text-muted-foreground mb-6">
          Enable localStorage persistence to track costs across sessions and page reloads.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useCostTracker } from '@clarity-chat/react'
import { useEffect, useState } from 'react'

export function PersistentCostTracker() {
  const cost = useCostTracker({
    persist: true,
    storageKey: 'my-app-costs',
    maxHistoryEntries: 5000,
  })

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Wait for initial load from localStorage
    setLoaded(true)

    // Show restored data
    const totals = cost.totals()
    console.log('Restored cost data:', totals)
  }, [cost])

  if (!loaded) {
    return <div>Loading cost history...</div>
  }

  return (
    <div className="cost-tracker">
      {/* Cost tracking UI */}
      <CostDisplay totals={cost.totals()} />

      {/* Clear history button */}
      <button
        onClick={() => {
          if (confirm('Clear all cost history?')) {
            cost.reset()
          }
        }}
      >
        Clear History
      </button>
    </div>
  )
}`}
          filename="PersistentCostTracker.tsx"
        />

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="font-semibold text-yellow-500 mb-2">⚠️ Storage Limits</div>
            <p className="text-sm text-muted-foreground">
              localStorage has a 5-10MB limit per domain. For large history (5000+ entries), consider
              periodic exports to avoid hitting limits. The maxHistoryEntries option automatically
              prunes oldest entries when exceeded.
            </p>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="font-semibold text-blue-500 mb-2">💡 Best Practice</div>
            <p className="text-sm text-muted-foreground">
              For production apps, combine localStorage (short-term) with server-side storage
              (long-term). Export to your backend periodically for permanent records and analytics.
            </p>
          </div>
        </div>
      </Section>

      <Section id="cost-estimation" title="Cost Estimation">
        <p className="text-muted-foreground mb-6">
          Estimate costs before making requests to help users make informed decisions.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useCostTracker } from '@clarity-chat/react'
import { useState } from 'react'

export function CostEstimator() {
  const cost = useCostTracker()
  const [inputText, setInputText] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-4')

  // Rough estimation: 4 chars ≈ 1 token
  const estimatedInputTokens = Math.ceil(inputText.length / 4)
  const estimatedOutputTokens = estimatedInputTokens * 0.5 // Assume 50% output length

  const estimatedCost = cost.estimate(
    selectedModel,
    estimatedInputTokens,
    estimatedOutputTokens
  )

  return (
    <div className="cost-estimator">
      <div className="input-section">
        <label>Model</label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Cheapest)</option>
          <option value="gpt-4">GPT-4 (Balanced)</option>
          <option value="gpt-4-turbo">GPT-4 Turbo (Fast)</option>
          <option value="claude-3-opus">Claude 3 Opus (Best)</option>
        </select>

        <label>Your Message</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message to estimate cost..."
          rows={5}
        />
      </div>

      <div className="estimate-display">
        <h4>Cost Estimate</h4>
        <div className="estimate-details">
          <div>Input: ~{estimatedInputTokens} tokens</div>
          <div>Expected Output: ~{estimatedOutputTokens} tokens</div>
          <div className="total-cost">
            Estimated Cost: <strong>\${estimatedCost.toFixed(6)}</strong>
          </div>
        </div>

        {estimatedCost > 0.01 && (
          <div className="warning">
            ⚠️ This request may be expensive. Consider using a cheaper model.
          </div>
        )}
      </div>
    </div>
  )
}`}
          filename="CostEstimator.tsx"
        />
      </Section>

      <Section id="integration-examples" title="Integration Examples">
        <p className="text-muted-foreground mb-6">
          Real-world integration patterns for different use cases.
        </p>

        <div className="space-y-8">
          {/* Admin Dashboard */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>1️⃣</span>
              <span>Admin Dashboard with Budget Alerts</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { useCostTracker } from '@clarity-chat/react'
import { useEffect } from 'react'

export function AdminCostDashboard() {
  const cost = useCostTracker({ persist: true })
  const MONTHLY_BUDGET = 100.00 // $100/month

  useEffect(() => {
    // Check budget daily
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const monthlyStats = cost.forPeriod(thirtyDaysAgo)
    const budgetUsed = (monthlyStats.costUsd / MONTHLY_BUDGET) * 100

    if (budgetUsed > 90) {
      alert(\`⚠️ Budget Alert: \${budgetUsed.toFixed(1)}% of monthly budget used!\`)
    }
  }, [cost])

  const totals = cost.totals()
  const byModel = cost.byModel()

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Cost Management Dashboard</h1>
        <div className="total-cost">
          Total Spent: \${totals.costUsd.toFixed(2)}
        </div>
      </header>

      <section className="budget-monitor">
        <h2>Monthly Budget</h2>
        <div className="budget-bar">
          <div
            className="budget-used"
            style={{
              width: \`\${(totals.costUsd / MONTHLY_BUDGET) * 100}%\`
            }}
          />
        </div>
        <p>
          \${totals.costUsd.toFixed(2)} / \${MONTHLY_BUDGET.toFixed(2)}
        </p>
      </section>

      <section className="model-breakdown">
        <h2>Cost by Model</h2>
        {Object.entries(byModel).map(([model, stats]) => (
          <div key={model} className="model-row">
            <span>{model}</span>
            <span>\${stats.costUsd.toFixed(4)}</span>
            <span>{stats.requestCount} requests</span>
          </div>
        ))}
      </section>

      <div className="export-actions">
        <button onClick={() => {
          const data = cost.exportCsv()
          downloadCSV(data, 'monthly-cost-report.csv')
        }}>
          Export Monthly Report
        </button>
      </div>
    </div>
  )
}`}
              filename="AdminDashboard.tsx"
            />
          </div>

          {/* User-Facing Cost Display */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>2️⃣</span>
              <span>User-Facing Cost Display</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { useCostTracker } from '@clarity-chat/react'

export function UserCostIndicator() {
  const cost = useCostTracker({ persist: true })

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayStats = cost.forPeriod(todayStart)
  const totals = cost.totals()

  return (
    <div className="user-cost-indicator">
      {/* Compact display in header */}
      <div className="cost-badge">
        💰 Today: \${todayStats.costUsd.toFixed(4)}
      </div>

      {/* Detailed tooltip on hover */}
      <div className="cost-tooltip">
        <div className="tooltip-section">
          <strong>Today</strong>
          <div>\${todayStats.costUsd.toFixed(4)}</div>
          <div className="subtitle">{todayStats.requestCount} requests</div>
        </div>

        <div className="tooltip-section">
          <strong>All Time</strong>
          <div>\${totals.costUsd.toFixed(2)}</div>
          <div className="subtitle">{totals.requestCount} requests</div>
        </div>

        <div className="tooltip-footer">
          <a href="/account/billing">View detailed breakdown →</a>
        </div>
      </div>
    </div>
  )
}`}
              filename="UserCostIndicator.tsx"
            />
          </div>

          {/* API Route Integration */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>3️⃣</span>
              <span>API Route with Cost Tracking</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(request: NextRequest) {
  const { message } = await request.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
  })

  // Return response with usage info for client-side tracking
  return NextResponse.json({
    id: response.id,
    provider: 'openai',
    model: 'gpt-4',
    text: response.choices[0].message.content,
    usage: {
      inputTokens: response.usage.prompt_tokens,
      outputTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens,
    },
  })
}

// Client-side integration
import { useCostTracker } from '@clarity-chat/react'

export function ChatComponent() {
  const cost = useCostTracker({ persist: true })

  const handleSendMessage = async (message: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    })

    const data = await response.json()

    // Track cost
    cost.add(data)

    return data.text
  }

  return <Chat onSend={handleSendMessage} />
}`}
              filename="api-integration.tsx"
            />
          </div>
        </div>
      </Section>

      <Section id="best-practices" title="Best Practices">
        <div className="space-y-6">
          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <h4 className="font-semibold mb-4">Optimization Strategies</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Track Everything:</strong> Call cost.add() for
                  every LLM response to get accurate cost data
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Enable Persistence:</strong> Set persist: true
                  to maintain history across sessions
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Monitor Cached Tokens:</strong> Always pass
                  cachedTokens when using prompt caching to see savings
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Export Regularly:</strong> Export to CSV/JSON
                  weekly for long-term analytics and backup
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Set Budget Alerts:</strong> Use forPeriod() to
                  check monthly spend and alert users
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Compare Models:</strong> Use byModel() to
                  identify which models are most cost-effective
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-yellow-500 mb-4">⚠️ Common Pitfalls</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 shrink-0">!</span>
                <div>
                  <strong className="text-foreground">Don't Skip Responses:</strong> Forgetting to
                  call cost.add() creates gaps in tracking
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 shrink-0">!</span>
                <div>
                  <strong className="text-foreground">Watch Storage Limits:</strong> Without
                  persistence, data is lost on refresh. With persistence, watch localStorage limits
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 shrink-0">!</span>
                <div>
                  <strong className="text-foreground">Update Pricing:</strong> Model pricing changes
                  over time. Keep custom pricing config up to date
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 shrink-0">!</span>
                <div>
                  <strong className="text-foreground">Validate Usage Data:</strong> Ensure your API
                  responses include accurate usage.inputTokens and usage.outputTokens
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="related" title="Related APIs">
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/reference/components/token-counter"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              TokenCounter Component →
            </h4>
            <p className="text-sm text-muted-foreground">
              Visual display of token usage with progress bars and threshold warnings
            </p>
          </a>

          <a
            href="/reference/components/token-cost-preview"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              TokenCostPreview Component →
            </h4>
            <p className="text-sm text-muted-foreground">
              Real-time cost estimation as users type their messages
            </p>
          </a>

          <a
            href="/reference/hooks/use-token-budget-monitor"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              useTokenBudgetMonitor Hook →
            </h4>
            <p className="text-sm text-muted-foreground">
              Enforce token budgets with automatic alerts and request blocking
            </p>
          </a>

          <a
            href="/reference/components/token-optimization-panel"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              TokenOptimizationPanel Component →
            </h4>
            <p className="text-sm text-muted-foreground">
              Comprehensive dashboard for token analytics and optimization insights
            </p>
          </a>
        </div>
      </Section>
    </DocumentationPage>
  )
}
