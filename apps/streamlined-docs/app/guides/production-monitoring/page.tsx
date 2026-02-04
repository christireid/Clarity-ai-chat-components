'use client'

/**
 * Production Monitoring Guide
 *
 * Comprehensive guide for monitoring optimized AI applications in production,
 * including metrics, logging, alerting, cost tracking, and troubleshooting.
 */

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Activity,
  BarChart3,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  ArrowRight,
  Zap,
  DollarSign,
  Target,
  Eye,
  Bell,
  Database,
  LineChart,
  Shield,
  Lightbulb,
  Settings,
  Code,
  Server,
  Package,
  AlertCircle,
  Info,
} from 'lucide-react'
import { CodeBlock } from '@/components/CodeBlock'
import { ScrollReveal } from '@/components/Enhanced/ScrollReveal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { cn } from '@/lib/utils'

export default function ProductionMonitoringGuidePage() {
  const [selectedProvider, setSelectedProvider] = useState<'datadog' | 'prometheus' | 'cloudwatch'>('datadog')
  const [selectedMetricCategory, setSelectedMetricCategory] = useState<'token' | 'performance' | 'cost' | 'quality'>('token')

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {/* Hero Section */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800/50 rounded-full">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Advanced Guide
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
              Production Monitoring for Optimized AI
            </h1>

            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Track and validate your 50-70% cost reduction with comprehensive monitoring,
              metrics, logging, and alerting for token-optimized AI applications in production.
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-6">
              <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  50-70%
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Cost Reduction Tracked
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-2">
                  &lt;100ms
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Monitoring Overhead
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  Real-time
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Cost Visibility
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* What You'll Learn */}
        <ScrollReveal direction="up" delay={0.2}>
          <section className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 text-white flex-shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">What You'll Learn</h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Comprehensive production monitoring for token-optimized AI applications
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Monitor token optimization metrics and cost savings',
                'Set up real-time cost tracking and budget alerts',
                'Implement cache hit rate monitoring and optimization',
                'Track compression ratios and routing accuracy',
                'Configure alerting for cost anomalies',
                'Build production dashboards with Datadog/Prometheus/Grafana',
                'Troubleshoot optimization issues in production',
                'Validate 50-70% cost reduction targets',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Prerequisites */}
        <ScrollReveal direction="up" delay={0.25}>
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Package className="w-8 h-8 text-brand-600" />
              Prerequisites
            </h2>

            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-brand-600" />
                  Package Installation
                </h3>
                <CodeBlock
                  code="npm install @clarity-chat/token-optimization @clarity-chat/monitoring"
                  language="bash"
                />
              </div>

              <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Server className="w-5 h-5 text-brand-600" />
                  Monitoring Infrastructure
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  You'll need one of the following monitoring platforms:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-600 dark:text-neutral-400 ml-4">
                  <li>Datadog (recommended for enterprises)</li>
                  <li>Prometheus + Grafana (open-source)</li>
                  <li>AWS CloudWatch (AWS-native)</li>
                  <li>New Relic or any APM with custom metrics</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brand-600" />
                  Environment Setup
                </h3>
                <CodeBlock
                  code={`# .env.local
# Monitoring Configuration
DATADOG_API_KEY=your_api_key_here
DATADOG_APP_KEY=your_app_key_here

# Cost Tracking
ENABLE_COST_MONITORING=true
COST_BUDGET_DAILY=100.00
COST_ALERT_THRESHOLD=0.8

# Token Monitoring
ENABLE_TOKEN_METRICS=true
TOKEN_BUDGET_PER_REQUEST=4000
CACHE_HIT_RATE_TARGET=0.75`}
                  language="bash"
                />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Monitoring Patterns */}
        <ScrollReveal direction="up" delay={0.3}>
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Eye className="w-8 h-8 text-brand-600" />
              Monitoring Patterns
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold">Metrics Collection</h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Track key performance indicators with structured metrics:
                </p>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-0.5">•</span>
                    <span>Token usage per request (input/output/cached)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-0.5">•</span>
                    <span>Cost per request and daily totals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-0.5">•</span>
                    <span>Cache hit rates and compression ratios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-0.5">•</span>
                    <span>Model routing decisions and accuracy</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-semibold">Structured Logging</h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Capture detailed context with JSON logging:
                </p>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>Optimization decision audit trails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>Cache miss reasons and patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>Compression effectiveness logs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>Error context and recovery steps</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-semibold">Smart Alerting</h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Get notified of important events and anomalies:
                </p>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Cost budget threshold alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Cache hit rate degradation warnings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Routing accuracy anomalies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Quality score drops below threshold</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <div className="flex items-center gap-3 mb-4">
                  <LineChart className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-xl font-semibold">Real-time Dashboards</h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Visualize optimization performance in real-time:
                </p>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    <span>Cost vs. baseline comparison charts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    <span>Token savings trend over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    <span>Cache performance heatmaps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    <span>SLA compliance tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Token Optimization Metrics */}
        <ScrollReveal direction="up" delay={0.35}>
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-brand-600" />
              Token Optimization Metrics
            </h2>

            {/* Metric Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              {[
                { id: 'token', label: 'Token Metrics', icon: Zap },
                { id: 'performance', label: 'Performance', icon: Activity },
                { id: 'cost', label: 'Cost Tracking', icon: DollarSign },
                { id: 'quality', label: 'Quality', icon: Shield },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedMetricCategory(id as typeof selectedMetricCategory)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedMetricCategory === id
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Token Metrics */}
            {selectedMetricCategory === 'token' && (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
                  <h3 className="text-lg font-semibold mb-4">Essential Token Metrics</h3>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Cache Hit Rate</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Target: ≥75%</span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        Percentage of requests using cached content. Higher rates = better optimization.
                      </p>
                      <CodeBlock
                        code={`import { trackMetric } from '@clarity-chat/monitoring'

// Track cache hit rate
trackMetric('token.cache_hit_rate', {
  value: cacheHits / totalRequests,
  tags: ['provider:anthropic', 'endpoint:/chat'],
  timestamp: Date.now(),
})`}
                        language="typescript"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Compression Ratio</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Target: ≥2.5x</span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        Original tokens / compressed tokens. Measures pruning effectiveness.
                      </p>
                      <CodeBlock
                        code={`// Track compression effectiveness
trackMetric('token.compression_ratio', {
  value: originalTokens / compressedTokens,
  tags: ['strategy:smart_pruning'],
  metadata: {
    original: originalTokens,
    compressed: compressedTokens,
    saved: originalTokens - compressedTokens,
  },
})`}
                        language="typescript"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Routing Accuracy</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Target: ≥95%</span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        Percentage of requests routed to optimal model (e.g., Haiku vs Sonnet).
                      </p>
                      <CodeBlock
                        code={`// Track model routing accuracy
trackMetric('token.routing_accuracy', {
  value: correctRoutingDecisions / totalDecisions,
  tags: [
    'router:smart',
    \`model_selected:\${selectedModel}\`,
    \`complexity:\${complexity}\`,
  ],
})`}
                        language="typescript"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Tokens Per Request</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Lower is better</span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        Average token usage broken down by input, output, and cached tokens.
                      </p>
                      <CodeBlock
                        code={`// Track detailed token usage
trackMetric('token.usage_per_request', {
  value: totalTokens,
  tags: ['type:total'],
  metadata: {
    input: inputTokens,
    output: outputTokens,
    cached: cachedTokens,
    breakdown: {
      system_prompt: systemTokens,
      user_message: userTokens,
      history: historyTokens,
    },
  },
})`}
                        language="typescript"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            {selectedMetricCategory === 'performance' && (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
                  <h3 className="text-lg font-semibold mb-4">Performance Monitoring</h3>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Response Latency</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Target: P95 &lt;2s</span>
                      </div>
                      <CodeBlock
                        code={`// Track response latency with percentiles
const start = Date.now()
const response = await chat(message)
const latency = Date.now() - start

trackMetric('performance.latency', {
  value: latency,
  tags: [
    'optimization:enabled',
    \`model:\${model}\`,
    \`cached:\${usedCache}\`,
  ],
})`}
                        language="typescript"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Time to First Token (TTFT)</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Target: &lt;500ms</span>
                      </div>
                      <CodeBlock
                        code={`// Track streaming performance
const streamStart = Date.now()
let firstTokenTime = null

for await (const chunk of stream) {
  if (firstTokenTime === null) {
    firstTokenTime = Date.now() - streamStart
    trackMetric('performance.ttft', {
      value: firstTokenTime,
      tags: ['streaming:true'],
    })
  }
}`}
                        language="typescript"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Throughput (Tokens/Second)</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Higher is better</span>
                      </div>
                      <CodeBlock
                        code={`// Track token generation speed
trackMetric('performance.throughput', {
  value: outputTokens / (totalTime / 1000),
  tags: ['phase:streaming'],
  metadata: {
    tokens: outputTokens,
    duration_ms: totalTime,
  },
})`}
                        language="typescript"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cost Metrics */}
            {selectedMetricCategory === 'cost' && (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">Cost Tracking and Validation</h3>

                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingDown className="w-6 h-6" />
                      <span className="font-bold text-lg">Track Your 50-70% Cost Reduction</span>
                    </div>
                    <p className="text-sm opacity-90">
                      Monitor real-time cost savings vs. baseline to validate optimization impact
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Cost Per Request</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Track trend over time</span>
                      </div>
                      <CodeBlock
                        code={`// Calculate and track cost per request
const cost = calculateCost({
  inputTokens,
  outputTokens,
  cachedTokens,
  model,
  provider,
})

trackMetric('cost.per_request', {
  value: cost,
  tags: [
    \`model:\${model}\`,
    \`optimization:\${optimizationEnabled}\`,
  ],
  metadata: {
    baseline_cost: baselineCost,
    savings: baselineCost - cost,
    savings_percentage: ((baselineCost - cost) / baselineCost) * 100,
  },
})`}
                        language="typescript"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Daily Cost vs. Budget</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Alert at 80% threshold</span>
                      </div>
                      <CodeBlock
                        code={`// Track daily spending against budget
const dailyCost = await getDailyCost()
const budget = parseFloat(process.env.COST_BUDGET_DAILY || '100')
const utilizationRate = dailyCost / budget

trackMetric('cost.daily_total', {
  value: dailyCost,
  tags: ['period:daily'],
  metadata: {
    budget,
    utilizationRate,
    remaining: budget - dailyCost,
  },
})

// Alert if approaching budget
if (utilizationRate > 0.8) {
  sendAlert('cost_budget_warning', {
    current: dailyCost,
    budget,
    percentage: utilizationRate * 100,
  })
}`}
                        language="typescript"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Savings Validation</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Target: 50-70% reduction</span>
                      </div>
                      <CodeBlock
                        code={`// Validate cost reduction target
const baseline = await getBaselineCost(timeRange)
const optimized = await getOptimizedCost(timeRange)
const savingsPercentage = ((baseline - optimized) / baseline) * 100

trackMetric('cost.savings_percentage', {
  value: savingsPercentage,
  tags: ['timeframe:7d'],
  metadata: {
    baseline_cost: baseline,
    optimized_cost: optimized,
    absolute_savings: baseline - optimized,
    target_met: savingsPercentage >= 50,
  },
})

// Alert if below target
if (savingsPercentage < 50) {
  sendAlert('savings_target_miss', {
    current: savingsPercentage,
    target: 50,
    gap: 50 - savingsPercentage,
  })
}`}
                        language="typescript"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quality Metrics */}
            {selectedMetricCategory === 'quality' && (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/50">
                  <h3 className="text-lg font-semibold mb-4">Quality Monitoring</h3>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Response Quality Score</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Target: ≥0.8</span>
                      </div>
                      <CodeBlock
                        code={`// Monitor quality doesn't degrade with optimization
const qualityScore = await evaluateQuality(response)

trackMetric('quality.response_score', {
  value: qualityScore,
  tags: [
    \`optimization:\${optimizationLevel}\`,
    \`model:\${model}\`,
  ],
  metadata: {
    threshold: 0.8,
    meets_threshold: qualityScore >= 0.8,
  },
})`}
                        language="typescript"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Error Rate</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Target: &lt;1%</span>
                      </div>
                      <CodeBlock
                        code={`// Track optimization-related errors
trackMetric('quality.error_rate', {
  value: errors / totalRequests,
  tags: [
    'optimization:enabled',
    \`error_type:\${errorType}\`,
  ],
})`}
                        language="typescript"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </ScrollReveal>

        {/* Provider-Specific Implementation */}
        <ScrollReveal direction="up" delay={0.4}>
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Server className="w-8 h-8 text-brand-600" />
              Provider-Specific Setup
            </h2>

            {/* Provider Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'datadog', label: 'Datadog' },
                { id: 'prometheus', label: 'Prometheus + Grafana' },
                { id: 'cloudwatch', label: 'AWS CloudWatch' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedProvider(id as typeof selectedProvider)}
                  className={cn(
                    'px-6 py-3 rounded-lg text-sm font-medium transition-all',
                    selectedProvider === id
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Datadog */}
            {selectedProvider === 'datadog' && (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                  <h3 className="text-xl font-semibold mb-4">Datadog Integration</h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Step 1: Install Datadog Client</h4>
                      <CodeBlock
                        code="npm install dd-trace @datadog/browser-logs"
                        language="bash"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Step 2: Initialize Monitoring</h4>
                      <CodeBlock
                        code={`// lib/monitoring/datadog.ts
import tracer from 'dd-trace'
import { datadogLogs } from '@datadog/browser-logs'

// Initialize tracer
tracer.init({
  service: 'ai-chat-app',
  env: process.env.NODE_ENV,
  version: process.env.APP_VERSION,
  logInjection: true,
})

// Initialize browser logs
datadogLogs.init({
  clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN!,
  site: 'datadoghq.com',
  service: 'ai-chat-app',
  env: process.env.NODE_ENV,
  forwardErrorsToLogs: true,
  sessionSampleRate: 100,
})

export { tracer, datadogLogs }`}
                        language="typescript"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Step 3: Track Custom Metrics</h4>
                      <CodeBlock
                        code={`// lib/monitoring/metrics.ts
import { metrics } from 'datadog-metrics'

metrics.init({
  apiKey: process.env.DATADOG_API_KEY!,
  prefix: 'ai.optimization.',
  defaultTags: ['env:production', 'service:chat'],
})

export function trackTokenMetric(
  name: string,
  value: number,
  tags: string[] = []
) {
  metrics.gauge(\`token.\${name}\`, value, tags)
}

export function trackCostMetric(
  name: string,
  value: number,
  tags: string[] = []
) {
  metrics.gauge(\`cost.\${name}\`, value, tags)
}

// Usage
trackTokenMetric('cache_hit_rate', 0.85, ['provider:anthropic'])
trackCostMetric('per_request', 0.001, ['model:haiku'])`}
                        language="typescript"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Step 4: Create Dashboard</h4>
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                          Import this dashboard JSON into Datadog:
                        </p>
                        <CodeBlock
                          code={`{
  "title": "AI Token Optimization",
  "widgets": [
    {
      "definition": {
        "title": "Cost Savings (7 days)",
        "type": "timeseries",
        "requests": [{
          "q": "avg:ai.optimization.cost.savings_percentage{*}",
          "display_type": "line"
        }]
      }
    },
    {
      "definition": {
        "title": "Cache Hit Rate",
        "type": "query_value",
        "requests": [{
          "q": "avg:ai.optimization.token.cache_hit_rate{*}",
          "aggregator": "avg"
        }]
      }
    },
    {
      "definition": {
        "title": "Daily Cost vs Budget",
        "type": "timeseries",
        "requests": [
          {
            "q": "sum:ai.optimization.cost.daily_total{*}",
            "display_type": "bars"
          },
          {
            "q": "100",
            "display_type": "line",
            "style": { "palette": "warm" }
          }
        ]
      }
    }
  ]
}`}
                          language="json"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Prometheus + Grafana */}
            {selectedProvider === 'prometheus' && (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                  <h3 className="text-xl font-semibold mb-4">Prometheus + Grafana Setup</h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Step 1: Install Prometheus Client</h4>
                      <CodeBlock
                        code="npm install prom-client"
                        language="bash"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Step 2: Define Metrics</h4>
                      <CodeBlock
                        code={`// lib/monitoring/prometheus.ts
import { Registry, Gauge, Histogram, Counter } from 'prom-client'

const register = new Registry()

// Token metrics
export const tokenCacheHitRate = new Gauge({
  name: 'ai_token_cache_hit_rate',
  help: 'Percentage of requests using cached tokens',
  labelNames: ['provider', 'endpoint'],
  registers: [register],
})

export const tokenCompressionRatio = new Gauge({
  name: 'ai_token_compression_ratio',
  help: 'Compression ratio (original/compressed)',
  labelNames: ['strategy'],
  registers: [register],
})

// Cost metrics
export const costPerRequest = new Histogram({
  name: 'ai_cost_per_request_dollars',
  help: 'Cost per request in dollars',
  buckets: [0.0001, 0.001, 0.01, 0.1, 1],
  labelNames: ['model', 'optimization'],
  registers: [register],
})

export const costSavingsPercentage = new Gauge({
  name: 'ai_cost_savings_percentage',
  help: 'Cost savings percentage vs baseline',
  registers: [register],
})

// Performance metrics
export const responseLatency = new Histogram({
  name: 'ai_response_latency_ms',
  help: 'Response latency in milliseconds',
  buckets: [100, 500, 1000, 2000, 5000],
  labelNames: ['model', 'cached'],
  registers: [register],
})

export { register }`}
                        language="typescript"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Step 3: Expose Metrics Endpoint</h4>
                      <CodeBlock
                        code={`// app/api/metrics/route.ts
import { NextResponse } from 'next/server'
import { register } from '@/lib/monitoring/prometheus'

export async function GET() {
  const metrics = await register.metrics()

  return new NextResponse(metrics, {
    headers: {
      'Content-Type': register.contentType,
    },
  })
}`}
                        language="typescript"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Step 4: Configure Prometheus</h4>
                      <CodeBlock
                        code={`# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'ai-chat-app'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 10s`}
                        language="yaml"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Step 5: Grafana Dashboard</h4>
                      <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                          Example Grafana queries for visualization:
                        </p>
                        <CodeBlock
                          code={`# Cache Hit Rate (%)
100 * avg(ai_token_cache_hit_rate)

# Cost Savings Trend
ai_cost_savings_percentage

# Average Cost Per Request
avg(ai_cost_per_request_dollars)

# P95 Response Latency
histogram_quantile(0.95,
  rate(ai_response_latency_ms_bucket[5m])
)

# Daily Cost
sum(increase(ai_cost_per_request_dollars_sum[1d]))`}
                          language="promql"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CloudWatch */}
            {selectedProvider === 'cloudwatch' && (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                  <h3 className="text-xl font-semibold mb-4">AWS CloudWatch Integration</h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Step 1: Install AWS SDK</h4>
                      <CodeBlock
                        code="npm install @aws-sdk/client-cloudwatch @aws-sdk/client-cloudwatch-logs"
                        language="bash"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Step 2: Configure CloudWatch Client</h4>
                      <CodeBlock
                        code={`// lib/monitoring/cloudwatch.ts
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch'

const client = new CloudWatchClient({
  region: process.env.AWS_REGION || 'us-east-1',
})

const NAMESPACE = 'AI/TokenOptimization'

export async function putMetric(
  metricName: string,
  value: number,
  unit: string = 'None',
  dimensions: Record<string, string> = {}
) {
  const command = new PutMetricDataCommand({
    Namespace: NAMESPACE,
    MetricData: [
      {
        MetricName: metricName,
        Value: value,
        Unit: unit,
        Timestamp: new Date(),
        Dimensions: Object.entries(dimensions).map(([Name, Value]) => ({
          Name,
          Value,
        })),
      },
    ],
  })

  await client.send(command)
}

// Usage
await putMetric('CacheHitRate', 0.85, 'Percent', {
  Provider: 'Anthropic',
  Endpoint: '/chat',
})

await putMetric('CostPerRequest', 0.001, 'None', {
  Model: 'claude-3-haiku',
  Optimization: 'enabled',
})`}
                        language="typescript"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Step 3: Create CloudWatch Dashboard</h4>
                      <CodeBlock
                        code={`// scripts/create-dashboard.ts
import { CloudWatchClient, PutDashboardCommand } from '@aws-sdk/client-cloudwatch'

const dashboardBody = {
  widgets: [
    {
      type: 'metric',
      properties: {
        title: 'Cost Savings Percentage',
        metrics: [
          ['AI/TokenOptimization', 'CostSavingsPercentage']
        ],
        period: 300,
        stat: 'Average',
        region: 'us-east-1',
        yAxis: { left: { min: 0, max: 100 } }
      }
    },
    {
      type: 'metric',
      properties: {
        title: 'Cache Hit Rate',
        metrics: [
          ['AI/TokenOptimization', 'CacheHitRate', { stat: 'Average' }]
        ]
      }
    },
    {
      type: 'metric',
      properties: {
        title: 'Daily Cost',
        metrics: [
          ['AI/TokenOptimization', 'CostPerRequest', { stat: 'Sum' }]
        ],
        period: 86400
      }
    }
  ]
}

const client = new CloudWatchClient({})
await client.send(new PutDashboardCommand({
  DashboardName: 'AI-Token-Optimization',
  DashboardBody: JSON.stringify(dashboardBody),
}))`}
                        language="typescript"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </ScrollReveal>

        {/* Alert Configurations */}
        <ScrollReveal direction="up" delay={0.45}>
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Bell className="w-8 h-8 text-brand-600" />
              Alert Configurations
            </h2>

            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/50">
                <h3 className="text-xl font-semibold mb-4">Cost Anomaly Alerts</h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold">Daily Budget Exceeded</span>
                    </div>
                    <CodeBlock
                      code={`// lib/alerts/cost-budget.ts
import { sendAlert } from './notifier'

export async function checkDailyBudget() {
  const dailyCost = await getDailyCost()
  const budget = parseFloat(process.env.COST_BUDGET_DAILY || '100')

  if (dailyCost > budget * 0.8) {
    await sendAlert({
      severity: dailyCost > budget ? 'critical' : 'warning',
      title: 'Daily Cost Budget Alert',
      message: \`Daily cost: $\${dailyCost.toFixed(2)} / $\${budget}\`,
      tags: ['cost', 'budget'],
      metadata: {
        current: dailyCost,
        budget,
        percentage: (dailyCost / budget) * 100,
      },
    })
  }
}`}
                      language="typescript"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold">Cost Spike Detection</span>
                    </div>
                    <CodeBlock
                      code={`// Detect unusual cost increases
export async function detectCostSpike() {
  const currentHourCost = await getHourlyCost()
  const avgHourlyCost = await getAverageHourlyCost(7) // 7-day average

  const percentageIncrease =
    ((currentHourCost - avgHourlyCost) / avgHourlyCost) * 100

  if (percentageIncrease > 50) {
    await sendAlert({
      severity: 'critical',
      title: 'Cost Spike Detected',
      message: \`Cost increased by \${percentageIncrease.toFixed(1)}%\`,
      tags: ['cost', 'anomaly'],
      metadata: {
        current: currentHourCost,
        average: avgHourlyCost,
        increase: percentageIncrease,
      },
    })
  }
}`}
                      language="typescript"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold">Savings Target Miss</span>
                    </div>
                    <CodeBlock
                      code={`// Alert if not meeting 50% savings target
export async function checkSavingsTarget() {
  const savingsPercentage = await calculateSavings(7)

  if (savingsPercentage < 50) {
    await sendAlert({
      severity: 'warning',
      title: 'Savings Target Not Met',
      message: \`Current savings: \${savingsPercentage.toFixed(1)}% (target: 50%)\`,
      tags: ['cost', 'savings', 'target'],
      metadata: {
        current: savingsPercentage,
        target: 50,
        gap: 50 - savingsPercentage,
      },
    })
  }
}`}
                      language="typescript"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
                <h3 className="text-xl font-semibold mb-4">Performance Alerts</h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">Cache Hit Rate Degradation</span>
                    </div>
                    <CodeBlock
                      code={`// Alert on cache performance issues
export async function checkCachePerformance() {
  const hitRate = await getCacheHitRate()
  const target = 0.75

  if (hitRate < target) {
    await sendAlert({
      severity: 'warning',
      title: 'Cache Hit Rate Below Target',
      message: \`Current: \${(hitRate * 100).toFixed(1)}% (target: 75%)\`,
      tags: ['cache', 'performance'],
      metadata: { hitRate, target },
    })
  }
}`}
                      language="typescript"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold">High Latency Alert</span>
                    </div>
                    <CodeBlock
                      code={`// Alert on latency spikes
export async function checkLatency() {
  const p95Latency = await getP95Latency()
  const threshold = 2000 // 2 seconds

  if (p95Latency > threshold) {
    await sendAlert({
      severity: 'warning',
      title: 'High P95 Latency',
      message: \`P95: \${p95Latency}ms (threshold: \${threshold}ms)\`,
      tags: ['latency', 'performance'],
    })
  }
}`}
                      language="typescript"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Dashboard Templates */}
        <ScrollReveal direction="up" delay={0.5}>
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <LineChart className="w-8 h-8 text-brand-600" />
              Dashboard Templates
            </h2>

            <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="text-xl font-semibold mb-4">Essential Visualizations</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800/50">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-purple-600" />
                    Cost Savings Over Time
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Line chart showing cost reduction percentage vs baseline
                  </p>
                  <ul className="text-xs text-neutral-500 dark:text-neutral-500 space-y-1">
                    <li>• X-axis: Time (hourly/daily)</li>
                    <li>• Y-axis: Savings % (target line at 50%)</li>
                    <li>• Color: Green if above 50%, amber if below</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800/50">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    Cache Performance Heatmap
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Heatmap of cache hit rates by endpoint and time
                  </p>
                  <ul className="text-xs text-neutral-500 dark:text-neutral-500 space-y-1">
                    <li>• X-axis: Time</li>
                    <li>• Y-axis: Endpoint</li>
                    <li>• Color: Hit rate % (red to green)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/50">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Cost Breakdown by Model
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Pie/bar chart of cost distribution across models
                  </p>
                  <ul className="text-xs text-neutral-500 dark:text-neutral-500 space-y-1">
                    <li>• Segment by model (Haiku, Sonnet, Opus)</li>
                    <li>• Show $ and % of total</li>
                    <li>• Highlight routing savings</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/50">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-600" />
                    Token Usage Waterfall
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Waterfall showing token reduction stages
                  </p>
                  <ul className="text-xs text-neutral-500 dark:text-neutral-500 space-y-1">
                    <li>• Original → After cache → After compression</li>
                    <li>• Show savings at each stage</li>
                    <li>• Highlight biggest wins</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Production Troubleshooting */}
        <ScrollReveal direction="up" delay={0.55}>
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Shield className="w-8 h-8 text-brand-600" />
              Production Troubleshooting
            </h2>

            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800/50">
                <h3 className="text-xl font-semibold mb-4">Common Issues and Solutions</h3>

                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Cache Hit Rate Suddenly Drops</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          Symptoms: Hit rate falls from 75% to 20%
                        </p>
                      </div>
                    </div>

                    <div className="ml-8 space-y-3">
                      <div>
                        <p className="text-sm font-semibold mb-2">Diagnosis:</p>
                        <CodeBlock
                          code={`// Check cache TTL and invalidation patterns
const cacheStats = await getCacheStats()
console.log({
  hitRate: cacheStats.hitRate,
  missRate: cacheStats.missRate,
  avgTTL: cacheStats.avgTTL,
  invalidations: cacheStats.invalidations,
})

// Check for cache key format changes
const recentKeys = await getRecentCacheKeys(100)
const keyPatterns = analyzeKeyPatterns(recentKeys)
console.log('Key pattern changes:', keyPatterns.changes)`}
                          language="typescript"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-2">Solutions:</p>
                        <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Verify cache breakpoint tokens still meet 1024 minimum</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Check if system prompts changed (invalidates cache)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Ensure cache_control markers are properly applied</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Review recent deployments for cache-breaking changes</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Cost Unexpectedly High</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          Symptoms: Daily cost exceeds budget despite optimization
                        </p>
                      </div>
                    </div>

                    <div className="ml-8 space-y-3">
                      <div>
                        <p className="text-sm font-semibold mb-2">Diagnosis:</p>
                        <CodeBlock
                          code={`// Analyze cost by component
const breakdown = await getCostBreakdown()
console.log({
  byModel: breakdown.byModel,
  byEndpoint: breakdown.byEndpoint,
  byOptimization: breakdown.byOptimization,
})

// Check for routing failures
const routingStats = await getRoutingStats()
console.log({
  accurateRoutes: routingStats.accurate,
  incorrectRoutes: routingStats.incorrect,
  fallbacksToExpensive: routingStats.fallbacks,
})`}
                          language="typescript"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-2">Solutions:</p>
                        <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Verify smart routing is directing simple queries to Haiku</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Check if compression is failing (large token counts)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Audit endpoints for unexpected traffic spikes</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Review model selection thresholds for tuning</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Quality Degradation</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          Symptoms: Response quality drops after enabling optimization
                        </p>
                      </div>
                    </div>

                    <div className="ml-8 space-y-3">
                      <div>
                        <p className="text-sm font-semibold mb-2">Diagnosis:</p>
                        <CodeBlock
                          code={`// Compare quality scores
const qualityComparison = await compareQuality({
  baseline: { optimization: false },
  optimized: { optimization: true },
})

console.log({
  baselineScore: qualityComparison.baseline.avg,
  optimizedScore: qualityComparison.optimized.avg,
  degradation: qualityComparison.degradation,
})

// Check compression aggressiveness
const compressionMetrics = await getCompressionMetrics()
console.log({
  ratio: compressionMetrics.ratio,
  contextLoss: compressionMetrics.contextLoss,
})`}
                          language="typescript"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-2">Solutions:</p>
                        <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Reduce compression aggressiveness (lower ratio target)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Whitelist important context from pruning</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Adjust routing thresholds to use more powerful models</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Implement gradual rollout to compare quality metrics</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Real-World Example */}
        <ScrollReveal direction="up" delay={0.6}>
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Server className="w-8 h-8 text-brand-600" />
              Real-World Example: Enterprise Monitoring
            </h2>

            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800/50">
              <h3 className="text-xl font-semibold mb-4">E-commerce Support Chat</h3>

              <div className="space-y-6">
                <div>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    A large e-commerce company implemented token optimization across their customer support chat.
                    Here's their complete monitoring setup:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">67%</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">Cost Reduction</div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="text-2xl font-bold text-blue-600 mb-1">82%</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">Cache Hit Rate</div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                      <div className="text-2xl font-bold text-purple-600 mb-1">$8.4K</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">Monthly Savings</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Complete Monitoring Implementation</h4>
                  <CodeBlock
                    code={`// Complete enterprise monitoring setup
import {
  trackTokenMetric,
  trackCostMetric,
  trackPerformanceMetric,
  setupAlerts
} from '@clarity-chat/monitoring'

// 1. Metrics Collection
export async function trackChatRequest(
  request: ChatRequest,
  response: ChatResponse
) {
  const { tokens, cost, performance, quality } = await analyze(request, response)

  // Token metrics
  trackTokenMetric('cache_hit_rate', tokens.cacheHitRate, ['provider:anthropic'])
  trackTokenMetric('compression_ratio', tokens.compressionRatio, ['strategy:smart'])
  trackTokenMetric('routing_accuracy', tokens.routingAccuracy, ['router:complexity'])

  // Cost metrics
  trackCostMetric('per_request', cost.amount, [\`model:\${response.model}\`])
  trackCostMetric('savings_vs_baseline', cost.savings, ['timeframe:request'])

  // Performance metrics
  trackPerformanceMetric('latency', performance.totalTime, [\`cached:\${tokens.usedCache}\`])
  trackPerformanceMetric('ttft', performance.firstTokenTime, ['streaming:true'])

  // Quality metrics
  trackMetric('quality.score', quality.score, ['optimization:enabled'])
}

// 2. Alert Configuration
setupAlerts({
  cost: {
    dailyBudget: {
      limit: 100,
      warningThreshold: 0.8,
      criticalThreshold: 1.0,
    },
    costSpike: {
      percentageIncrease: 50,
      timeWindow: 3600, // 1 hour
    },
    savingsTarget: {
      minimumPercentage: 50,
      evaluationWindow: 604800, // 7 days
    },
  },
  performance: {
    cacheHitRate: {
      minimumRate: 0.75,
      evaluationWindow: 3600,
    },
    latency: {
      p95Threshold: 2000, // 2 seconds
    },
  },
  quality: {
    minimumScore: 0.8,
    errorRateThreshold: 0.01, // 1%
  },
})

// 3. Real-time Dashboard
export const dashboardConfig = {
  refreshInterval: 30000, // 30 seconds
  widgets: [
    {
      type: 'timeseries',
      title: 'Cost Savings Trend',
      metric: 'cost.savings_percentage',
      timeRange: '7d',
      targetLine: 50,
    },
    {
      type: 'gauge',
      title: 'Cache Hit Rate',
      metric: 'token.cache_hit_rate',
      target: 0.75,
      thresholds: { warning: 0.65, critical: 0.50 },
    },
    {
      type: 'cost_breakdown',
      title: 'Cost by Model',
      metrics: ['cost.per_request'],
      groupBy: 'model',
    },
    {
      type: 'heatmap',
      title: 'Performance by Hour',
      metric: 'performance.latency',
      groupBy: ['hour', 'endpoint'],
    },
  ],
}

// 4. Automated Reporting
export async function generateWeeklyReport() {
  const report = await compileMetrics({
    timeRange: '7d',
    metrics: [
      'cost.savings_percentage',
      'cost.total',
      'token.cache_hit_rate',
      'token.compression_ratio',
      'performance.latency.p95',
      'quality.score.avg',
    ],
  })

  return {
    summary: {
      totalSavings: report.cost.total_savings,
      savingsPercentage: report.cost.savings_percentage,
      targetMet: report.cost.savings_percentage >= 50,
    },
    details: {
      cachePerformance: report.token.cache_hit_rate,
      compressionEffectiveness: report.token.compression_ratio,
      performanceImpact: report.performance.latency_change,
      qualityMaintained: report.quality.score_maintained,
    },
    recommendations: generateRecommendations(report),
  }
}`}
                    language="typescript"
                  />
                </div>

                <div className="p-4 rounded-lg bg-white/80 dark:bg-white/[0.05]">
                  <h4 className="font-semibold mb-3">Key Learnings</h4>
                  <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          Start with comprehensive metrics:
                        </span>
                        {' '}Track everything from day one to establish baselines and identify optimization opportunities.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          Alert on anomalies, not absolutes:
                        </span>
                        {' '}Focus on percentage changes and trends rather than fixed thresholds.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          Validate savings weekly:
                        </span>
                        {' '}Regular reporting ensures optimization continues to deliver ROI over time.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          Monitor quality closely:
                        </span>
                        {' '}Track response quality alongside cost to ensure optimization doesn't harm user experience.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Next Steps */}
        <ScrollReveal direction="up" delay={0.65}>
          <section>
            <h2 className="text-3xl font-bold mb-6">Next Steps</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/cookbook/enterprise-production-pipeline"
                className="group p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-500/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                    <Server className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Enterprise Production Pipeline
                  </h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Complete guide for deploying token optimization at enterprise scale with security and compliance.
                </p>
                <div className="flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                  View cookbook
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/guides/troubleshooting"
                className="group p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-500/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Troubleshooting Guide
                  </h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Common issues, debugging techniques, and solutions for production problems.
                </p>
                <div className="flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                  View guide
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/cookbook/token-optimization"
                className="group p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-500/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Token Optimization Cookbook
                  </h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Explore all token optimization strategies and implementation patterns.
                </p>
                <div className="flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                  View recipes
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/reference/components/token-optimization"
                className="group p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-500/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Code className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Component Reference
                  </h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  API documentation for all monitoring and optimization components.
                </p>
                <div className="flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                  View reference
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </section>
        </ScrollReveal>

        {/* Additional Resources */}
        <ScrollReveal direction="up" delay={0.7}>
          <div className="p-6 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900/50 dark:to-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Additional Resources</h3>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>
                    <Link href="/tools/token-optimization-roi-calculator" className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                      Token ROI Calculator
                    </Link>
                    {' '}— Calculate expected savings for your use case
                  </li>
                  <li>
                    <Link href="/guides/performance" className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                      Performance Optimization Guide
                    </Link>
                    {' '}— Optimize latency and throughput
                  </li>
                  <li>
                    <Link href="/guides/testing" className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                      Testing Guide
                    </Link>
                    {' '}— Test optimization before production deployment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
