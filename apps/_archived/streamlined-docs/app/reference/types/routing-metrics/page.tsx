'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, BarChart3, Clock, Target, DollarSign, TrendingUp, AlertCircle, CheckCircle2, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/CodeBlock'

export default function RoutingMetricsPage() {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'usage' | 'dashboard'>('overview')

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/reference/types"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Types
          </Link>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">RoutingMetrics</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Performance metrics for smart model routing with accuracy tracking and cost impact analysis.
              </p>
            </div>

            {/* Token Optimization Badge */}
            <div className="hidden sm:block">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                <DollarSign className="w-3.5 h-3.5" />
                10-15% Savings
              </span>
            </div>
          </div>

          {/* Cost Impact Callout */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg mt-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                  Measure routing accuracy to maximize 10-15% additional savings
                </p>
                <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                  Track model distribution, quality scores, and cost impact to optimize your routing strategy beyond the 50-70% baseline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Type Definition */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Type Definition</h2>

          <CodeBlock
            language="typescript"
            code={`interface RoutingMetrics {
  // Overview Metrics
  totalQueries: number
  period: string // 'last_24_hours' | 'last_7_days' | 'last_30_days' | 'custom'

  // Accuracy Metrics
  accuracy: number // 0-100 percentage
  confidenceScore: number // 0-1 average confidence
  misrouteCount: number

  // Latency Metrics
  avgLatency: number // milliseconds
  p95Latency: number // 95th percentile
  p99Latency: number // 99th percentile

  // Model Distribution
  modelDistribution: {
    haiku: number // percentage
    sonnet: number // percentage
    opus: number // percentage
    [key: string]: number
  }

  // Cost Impact
  avgCostPerQuery: number // USD
  totalCost: number // USD
  savingsPercent: number // vs baseline
  savingsAmount: number // USD saved

  // Quality Metrics
  qualityByModel: {
    haiku: number // 0-1 quality score
    sonnet: number
    opus: number
    [key: string]: number
  }

  // Trends (optional)
  trends?: {
    accuracyTrend: 'improving' | 'stable' | 'declining'
    costTrend: 'decreasing' | 'stable' | 'increasing'
    qualityTrend: 'improving' | 'stable' | 'declining'
  }
}`}
          />
        </section>

        {/* Properties */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Properties</h2>

          <div className="space-y-8">
            {/* Accuracy Metrics */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-600" />
                Accuracy Metrics
              </h3>

              <div className="space-y-4">
                <div className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <code className="text-sm font-semibold">accuracy</code>
                    <span className="text-xs text-muted-foreground">number (0-100)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Percentage of queries routed to the optimal model. Target: &gt;90%
                  </p>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-xs font-mono text-muted-foreground mb-1">Example:</p>
                    <code className="text-xs">accuracy: 93 // 93% of queries routed correctly</code>
                  </div>
                </div>

                <div className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <code className="text-sm font-semibold">confidenceScore</code>
                    <span className="text-xs text-muted-foreground">number (0-1)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Average confidence of routing decisions. Higher is better.
                  </p>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-xs font-mono text-muted-foreground mb-1">Example:</p>
                    <code className="text-xs">confidenceScore: 0.87 // 87% average confidence</code>
                  </div>
                </div>

                <div className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <code className="text-sm font-semibold">misrouteCount</code>
                    <span className="text-xs text-muted-foreground">number</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Number of queries routed to suboptimal models (quality score &lt;0.8).
                  </p>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-xs font-mono text-muted-foreground mb-1">Example:</p>
                    <code className="text-xs">misrouteCount: 42 // Out of 1000 queries</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Latency Metrics */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Latency Metrics
              </h3>

              <div className="space-y-4">
                <div className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <code className="text-sm font-semibold">avgLatency</code>
                    <span className="text-xs text-muted-foreground">number (ms)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Average routing decision time. Target: &lt;50ms
                  </p>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-xs font-mono text-muted-foreground mb-1">Example:</p>
                    <code className="text-xs">avgLatency: 38 // 38ms average</code>
                  </div>
                </div>

                <div className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <code className="text-sm font-semibold">p95Latency / p99Latency</code>
                    <span className="text-xs text-muted-foreground">number (ms)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    95th and 99th percentile latencies for tail performance monitoring.
                  </p>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-xs font-mono text-muted-foreground mb-1">Example:</p>
                    <code className="text-xs">p95Latency: 68, p99Latency: 95</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Impact */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Cost Impact
              </h3>

              <div className="space-y-4">
                <div className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <code className="text-sm font-semibold">savingsPercent</code>
                    <span className="text-xs text-muted-foreground">number (0-100)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Cost reduction percentage vs. baseline (all queries on Sonnet).
                  </p>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-md">
                    <p className="text-xs font-mono text-emerald-800 dark:text-emerald-200 mb-1">Target:</p>
                    <code className="text-xs text-emerald-900 dark:text-emerald-100">
                      savingsPercent: 12 // 12% additional savings on top of caching + compression
                    </code>
                  </div>
                </div>

                <div className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <code className="text-sm font-semibold">avgCostPerQuery</code>
                    <span className="text-xs text-muted-foreground">number (USD)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Average cost per query across all routed models.
                  </p>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-xs font-mono text-muted-foreground mb-1">Example:</p>
                    <code className="text-xs">avgCostPerQuery: 0.0018 // $0.0018 per query</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mb-16">
          <div className="flex gap-2 mb-6 border-b border-border/50">
            {[
              { id: 'overview', label: 'Usage Example', icon: Zap },
              { id: 'usage', label: 'Benchmarking', icon: BarChart3 },
              { id: 'dashboard', label: 'Dashboard Integration', icon: TrendingUp },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 border-b-2 transition-colors',
                  activeTab === id
                    ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Usage Example */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Basic Usage with ModelRouter</h3>
                <p className="text-muted-foreground mb-4">
                  Enable metrics collection and retrieve routing performance data:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`import { ModelRouter, RoutingMetrics } from '@clarity-chat/token-optimization'

// Step 1: Enable metrics when creating router
const router = ModelRouter.builder()
  .useClaudeModels()
  .withStrategy('hybrid')
  .withMetrics(true) // Enable metrics collection
  .build()

// Step 2: Process queries (routing happens automatically)
for (const query of userQueries) {
  const routing = await router.route(query.text)
  const response = await callModel(routing.model, query.text)

  // Step 3: Record outcome for accuracy tracking
  await router.recordOutcome({
    queryId: query.id,
    model: routing.model,
    actualCost: response.cost,
    qualityScore: response.qualityScore, // 0-1 from user feedback
    wasCorrectRoute: response.qualityScore >= 0.8,
  })
}

// Step 4: Retrieve metrics
const metrics: RoutingMetrics = await router.getMetrics({
  period: 'last_7_days',
})

console.log('Routing Performance:')
console.log(\`- Accuracy: \${metrics.accuracy}%\`)
console.log(\`- Avg latency: \${metrics.avgLatency}ms\`)
console.log(\`- Cost per query: $\${metrics.avgCostPerQuery}\`)
console.log(\`- Savings: \${metrics.savingsPercent}%\`)

// Model distribution
console.log('Model Distribution:')
console.log(\`- Haiku: \${metrics.modelDistribution.haiku}%\`)
console.log(\`- Sonnet: \${metrics.modelDistribution.sonnet}%\`)
console.log(\`- Opus: \${metrics.modelDistribution.opus}%\`)`}
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Expected Output
                </h4>
                <div className="text-sm space-y-1 text-blue-800 dark:text-blue-200 font-mono">
                  <p>Routing Performance:</p>
                  <p>- Accuracy: 93%</p>
                  <p>- Avg latency: 38ms</p>
                  <p>- Cost per query: $0.0018</p>
                  <p>- Savings: 12%</p>
                  <p className="mt-2">Model Distribution:</p>
                  <p>- Haiku: 55%</p>
                  <p>- Sonnet: 35%</p>
                  <p>- Opus: 10%</p>
                </div>
              </div>
            </div>
          )}

          {/* Benchmarking */}
          {activeTab === 'usage' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Benchmarking & Evaluation</h3>
                <p className="text-muted-foreground mb-4">
                  Evaluate routing accuracy and identify areas for improvement:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`import { ModelRouter, RoutingMetrics } from '@clarity-chat/token-optimization'

const router = ModelRouter.builder()
  .useClaudeModels()
  .withStrategy('hybrid')
  .withMetrics(true)
  .build()

// Get comprehensive metrics
const metrics = await router.getMetrics({ period: 'last_7_days' })

// Quality assurance checks
function evaluateRoutingPerformance(metrics: RoutingMetrics) {
  const issues: string[] = []

  // Check 1: Accuracy threshold
  if (metrics.accuracy < 90) {
    issues.push(\`Low accuracy: \${metrics.accuracy}% (target: >90%)\`)
  }

  // Check 2: Latency threshold
  if (metrics.avgLatency > 50) {
    issues.push(\`High latency: \${metrics.avgLatency}ms (target: <50ms)\`)
  }

  // Check 3: Quality scores
  Object.entries(metrics.qualityByModel).forEach(([model, score]) => {
    if (score < 0.8) {
      issues.push(\`Low quality for \${model}: \${score} (target: >0.8)\`)
    }
  })

  // Check 4: Model distribution (should favor cheaper models)
  if (metrics.modelDistribution.haiku < 40) {
    issues.push(\`Too few Haiku routes: \${metrics.modelDistribution.haiku}% (target: >40%)\`)
  }

  if (metrics.modelDistribution.opus > 15) {
    issues.push(\`Too many Opus routes: \${metrics.modelDistribution.opus}% (target: <15%)\`)
  }

  // Check 5: Savings target
  if (metrics.savingsPercent < 10) {
    issues.push(\`Low savings: \${metrics.savingsPercent}% (target: 10-15%)\`)
  }

  return {
    passed: issues.length === 0,
    issues,
    score: calculatePerformanceScore(metrics),
  }
}

function calculatePerformanceScore(metrics: RoutingMetrics): number {
  let score = 0

  // Accuracy (40 points)
  score += Math.min(metrics.accuracy / 90 * 40, 40)

  // Latency (20 points)
  score += metrics.avgLatency < 50 ? 20 : (50 / metrics.avgLatency * 20)

  // Quality (20 points)
  const avgQuality = Object.values(metrics.qualityByModel).reduce((a, b) => a + b, 0) /
    Object.keys(metrics.qualityByModel).length
  score += avgQuality * 20

  // Savings (20 points)
  score += Math.min(metrics.savingsPercent / 15 * 20, 20)

  return Math.round(score)
}

// Run evaluation
const evaluation = evaluateRoutingPerformance(metrics)

console.log(\`Performance Score: \${evaluation.score}/100\`)
if (!evaluation.passed) {
  console.log('Issues detected:')
  evaluation.issues.forEach(issue => console.log(\`  - \${issue}\`))
}

// Identify misroutes for debugging
const misroutes = await router.getMisroutes({ limit: 10 })
console.log(\`\\nTop \${misroutes.length} Misroutes:\`)
misroutes.forEach((m, i) => {
  console.log(\`\${i + 1}. "\${m.query}"\`)
  console.log(\`   Routed to: \${m.routedModel}\`)
  console.log(\`   Should be: \${m.optimalModel}\`)
  console.log(\`   Quality: \${m.qualityScore}\`)
})`}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                    Excellent Performance (90-100)
                  </h4>
                  <ul className="text-sm space-y-1 text-emerald-800 dark:text-emerald-200">
                    <li>• Accuracy &gt;95%</li>
                    <li>• Latency &lt;40ms</li>
                    <li>• Quality &gt;0.9 all models</li>
                    <li>• Savings 12-15%</li>
                  </ul>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Needs Improvement (&lt;70)
                  </h4>
                  <ul className="text-sm space-y-1 text-amber-800 dark:text-amber-200">
                    <li>• Accuracy &lt;85%</li>
                    <li>• Latency &gt;80ms</li>
                    <li>• Quality &lt;0.8 on any model</li>
                    <li>• Savings &lt;8%</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Integration */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Real-Time Dashboard Integration</h3>
                <p className="text-muted-foreground mb-4">
                  Display routing metrics in your monitoring dashboard:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`import { ModelRouter, RoutingMetrics } from '@clarity-chat/token-optimization'
import { TokenOptimizationPanel } from '@clarity-chat/react'

function RoutingDashboard() {
  const [metrics, setMetrics] = React.useState<RoutingMetrics | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Poll metrics every 30 seconds
  React.useEffect(() => {
    async function fetchMetrics() {
      const router = ModelRouter.builder()
        .useClaudeModels()
        .withStrategy('hybrid')
        .withMetrics(true)
        .build()

      const data = await router.getMetrics({
        period: 'last_24_hours',
      })

      setMetrics(data)
      setIsLoading(false)
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading || !metrics) {
    return <div>Loading metrics...</div>
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Routing Accuracy"
          value={\`\${metrics.accuracy}%\`}
          trend={metrics.trends?.accuracyTrend}
          target=">90%"
          status={metrics.accuracy >= 90 ? 'good' : 'warning'}
        />

        <MetricCard
          title="Avg Latency"
          value={\`\${metrics.avgLatency}ms\`}
          trend={metrics.trends?.costTrend}
          target="<50ms"
          status={metrics.avgLatency < 50 ? 'good' : 'warning'}
        />

        <MetricCard
          title="Cost Savings"
          value={\`\${metrics.savingsPercent}%\`}
          trend={metrics.trends?.costTrend}
          target="10-15%"
          status={metrics.savingsPercent >= 10 ? 'good' : 'warning'}
        />

        <MetricCard
          title="Avg Cost/Query"
          value={\`$\${metrics.avgCostPerQuery.toFixed(4)}\`}
          delta={\`-\${metrics.savingsPercent}%\`}
          status="good"
        />
      </div>

      {/* Model Distribution Chart */}
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Model Distribution</h3>
        <ModelDistributionChart distribution={metrics.modelDistribution} />
      </div>

      {/* Quality Scores */}
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Quality by Model</h3>
        <QualityScoreTable scores={metrics.qualityByModel} />
      </div>

      {/* Alerts */}
      {metrics.accuracy < 90 && (
        <Alert variant="warning">
          Routing accuracy is below 90%. Review misrouted queries.
        </Alert>
      )}

      {metrics.avgLatency > 50 && (
        <Alert variant="warning">
          Routing latency is above 50ms. Consider caching classification results.
        </Alert>
      )}
    </div>
  )
}

// Metric Card Component
function MetricCard({
  title,
  value,
  trend,
  target,
  status,
  delta
}: {
  title: string
  value: string
  trend?: 'improving' | 'stable' | 'declining'
  target?: string
  status?: 'good' | 'warning' | 'error'
  delta?: string
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="text-sm text-muted-foreground mb-1">{title}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        {delta && (
          <div className="text-sm text-emerald-600">{delta}</div>
        )}
      </div>
      {target && (
        <div className="text-xs text-muted-foreground mt-1">
          Target: {target}
        </div>
      )}
      {trend && (
        <TrendIndicator trend={trend} />
      )}
    </div>
  )
}`}
                />
              </div>

              <div className="bg-brand-500/10 border border-brand-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-brand-900 dark:text-brand-100 mb-2">
                  Performance Monitoring Best Practices
                </h4>
                <ul className="text-sm space-y-2 text-brand-800 dark:text-brand-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Poll metrics every 30-60 seconds for real-time monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Set up alerts for accuracy &lt;90% or latency &gt;50ms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Review misrouted queries weekly to improve classification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Track quality scores by model to identify underperforming routes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Monitor model distribution (target: 40-60% on Haiku)</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Related Resources */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Resources</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/cookbook/smart-model-routing"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Smart Model Routing Cookbook</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn how to implement routing strategies and track metrics
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/reference/classes/model-router"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">ModelRouter API</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete API reference for the ModelRouter class
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/reference/components/token-optimization-dashboard"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">TokenOptimizationDashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Pre-built dashboard component for routing metrics
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/cookbook/achieving-50-percent-reduction"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Achieving 50-70% Cost Reduction</h3>
                  <p className="text-sm text-muted-foreground">
                    Combine routing with caching and compression
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
