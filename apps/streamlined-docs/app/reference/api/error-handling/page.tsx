'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingDown,
  Activity,
  Shield,
  Zap,
  ArrowRight,
  Code,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'

export default function ErrorHandlingAPIReference() {
  const [activePattern, setActivePattern] = useState<'retry' | 'fallback' | 'circuit-breaker'>('retry')

  return (
    <div className="space-y-12 max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-sm">
          <Shield className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold text-white">50-70% Savings</span>
        </div>

        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Error Handling API Reference
        </h1>

        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Production-ready error handling with optimization fallbacks. Maintain 50-70% cost savings even during
          errors with intelligent retry, fallback chains, and circuit breakers.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-6">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">50-70%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Savings Maintained</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">3-tier</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Fallback Chain</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">99.9%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Uptime</div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <p className="text-neutral-700 dark:text-neutral-300 mb-4">
          Production AI systems require robust error handling to maintain both reliability and cost optimization.
          This API reference covers three essential patterns with optimization-aware fallback strategies:
        </p>
        <ul className="space-y-3">
          {[
            {
              icon: RefreshCw,
              title: 'Retry with Exponential Backoff',
              desc: 'Automatically retry failed requests with intelligent backoff',
            },
            {
              icon: TrendingDown,
              title: 'Fallback Chains',
              desc: 'Degraded mode strategies: optimized → baseline → cached',
            },
            {
              icon: Activity,
              title: 'Circuit Breaker',
              desc: 'Protect against cascading failures with cost tracking',
            },
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <item.icon className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{item.title}:</span>
                <span className="text-neutral-700 dark:text-neutral-300"> {item.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Cost Impact Banner */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Cost Impact Guarantee</h3>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
              These error handling patterns are designed to maintain your <strong>50-70% cost savings</strong> even
              during degraded modes. Fallback chains prioritize optimized paths before falling back to baseline.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Optimized path (50-70% savings)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Baseline fallback (0% savings)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Cached response (95%+ savings)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Cost tracking throughout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Handling Patterns */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Error Handling Patterns</h2>

        {/* Pattern Selection Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
          {[
            { id: 'retry', label: 'Retry', icon: RefreshCw },
            { id: 'fallback', label: 'Fallback Chains', icon: TrendingDown },
            { id: 'circuit-breaker', label: 'Circuit Breaker', icon: Activity },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActivePattern(id as typeof activePattern)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activePattern === id
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Pattern Content */}
        <div className="space-y-8">
          {activePattern === 'retry' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Retry with Exponential Backoff</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Automatically retry failed optimization requests with intelligent backoff and jitter to prevent
                  thundering herd problems.
                </p>

                <div className="bg-brand-500/10 border border-brand-500/30 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-brand-900 dark:text-brand-100 mb-2">When to Use</h4>
                  <ul className="text-sm text-brand-800 dark:text-brand-200 space-y-1">
                    <li>• Transient API errors (rate limits, timeouts)</li>
                    <li>• Network connectivity issues</li>
                    <li>• Temporary service degradation</li>
                    <li>• Provider caching cache misses</li>
                  </ul>
                </div>

                <CodeBlock
                  language="typescript"
                  code={`import { OptimizationClient, RetryConfig } from '@clarity-chat/token-optimization'

// Configure retry behavior
const retryConfig: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,      // Start with 1s
  maxDelay: 10000,      // Cap at 10s
  backoffMultiplier: 2, // Double delay each time
  jitter: true,         // Add randomness to prevent thundering herd
  retryableErrors: [
    'RATE_LIMIT_EXCEEDED',
    'TIMEOUT',
    'NETWORK_ERROR',
    'CACHE_MISS'
  ]
}

const client = new OptimizationClient({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  retry: retryConfig,
  onRetry: (attempt, error, delay) => {
    console.log(\`Retry attempt \${attempt}/\${retryConfig.maxAttempts}\`)
    console.log(\`Error: \${error.code}, retrying in \${delay}ms\`)
  }
})

// Usage - automatic retry on failure
async function sendOptimizedMessage(messages: Message[]) {
  try {
    const result = await client.sendMessage(messages, {
      enableCaching: true,
      enableCompression: true,
      enableRouting: true
    })

    console.log(\`Cost: $\${result.cost.toFixed(4)} (saved \${result.savingsPercent}%)\`)
    return result
  } catch (error) {
    // All retries exhausted
    console.error('Failed after all retry attempts:', error)
    throw error
  }
}

// Result: 95% of transient errors resolved within 3 attempts`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Retry with Cost Tracking</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Track costs across retry attempts to understand the impact of failures:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`interface RetryMetrics {
  totalAttempts: number
  successfulAttempt: number
  totalCost: number
  costPerAttempt: number[]
  totalDuration: number
}

async function sendWithRetryMetrics(messages: Message[]): Promise<{
  result: OptimizationResult
  metrics: RetryMetrics
}> {
  const metrics: RetryMetrics = {
    totalAttempts: 0,
    successfulAttempt: 0,
    totalCost: 0,
    costPerAttempt: [],
    totalDuration: 0
  }

  const startTime = Date.now()

  const result = await client.sendMessage(messages, {
    enableCaching: true,
    enableCompression: true,
    onRetry: (attempt, error, delay) => {
      metrics.totalAttempts = attempt
      // Track partial costs if available
      if (error.partialCost) {
        metrics.costPerAttempt.push(error.partialCost)
        metrics.totalCost += error.partialCost
      }
    }
  })

  metrics.successfulAttempt = metrics.totalAttempts + 1
  metrics.costPerAttempt.push(result.cost)
  metrics.totalCost += result.cost
  metrics.totalDuration = Date.now() - startTime

  return { result, metrics }
}

// Usage
const { result, metrics } = await sendWithRetryMetrics(messages)
console.log(\`Success on attempt \${metrics.successfulAttempt}\`)
console.log(\`Total cost: $\${metrics.totalCost.toFixed(4)}\`)
console.log(\`Duration: \${metrics.totalDuration}ms\`)

// Example output:
// Success on attempt 2
// Total cost: $0.0045 (50% savings maintained)
// Duration: 3200ms`}
                />
              </div>
            </div>
          )}

          {activePattern === 'fallback' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">3-Tier Fallback Chain</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Implement degraded mode strategies that prioritize cost optimization while ensuring reliability:
                  <br />
                  <strong>Optimized → Baseline → Cached</strong>
                </p>

                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                    Fallback Strategy
                  </h4>
                  <ol className="text-sm text-emerald-800 dark:text-emerald-200 space-y-2 list-decimal list-inside">
                    <li>
                      <strong>Optimized Path (Tier 1):</strong> Full optimization (caching + compression + routing) -
                      50-70% savings
                    </li>
                    <li>
                      <strong>Baseline Path (Tier 2):</strong> Direct API call without optimization - 0% savings but
                      guaranteed response
                    </li>
                    <li>
                      <strong>Cached Response (Tier 3):</strong> Return previously cached response - 95%+ savings,
                      slightly stale
                    </li>
                  </ol>
                </div>

                <CodeBlock
                  language="typescript"
                  code={`import {
  OptimizationClient,
  BaselineClient,
  CacheClient,
  FallbackChain
} from '@clarity-chat/token-optimization'

// Create fallback chain
const fallbackChain = new FallbackChain({
  // Tier 1: Optimized (preferred)
  primary: new OptimizationClient({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    enableCaching: true,
    enableCompression: true,
    enableRouting: true,
    timeout: 5000 // Fail fast if optimization is slow
  }),

  // Tier 2: Baseline (fallback)
  fallback: new BaselineClient({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    timeout: 10000
  }),

  // Tier 3: Cache (last resort)
  lastResort: new CacheClient({
    redis: process.env.REDIS_URL!,
    maxAge: 3600, // Use cache up to 1 hour old
    staleWhileRevalidate: true
  }),

  // Track which tier was used
  onFallback: (tier, reason) => {
    console.warn(\`Fallback to tier \${tier}: \${reason}\`)
    metrics.increment(\`fallback.tier_\${tier}\`)
  }
})

// Usage
async function sendMessage(messages: Message[]) {
  const result = await fallbackChain.send(messages)

  // Result includes tier information
  console.log(\`Response from: \${result.tier}\`) // 'optimized', 'baseline', or 'cached'
  console.log(\`Cost: $\${result.cost.toFixed(4)}\`)
  console.log(\`Savings: \${result.savingsPercent}%\`)
  console.log(\`Is stale: \${result.isStale || false}\`)

  return result
}

// Example flow:
// 1. Try optimized (caching + compression + routing)
//    → Success: $0.003, 70% savings ✓
// 2. If optimized fails, try baseline
//    → Success: $0.010, 0% savings (but reliable)
// 3. If baseline fails, return cached response
//    → Success: $0.0001, 99% savings (but 5 min old)`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Degraded Mode with Cost Tracking</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Monitor the cost impact of degraded modes in production:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`import { CostTracker } from '@clarity-chat/token-optimization'

const costTracker = new CostTracker()

async function sendWithDegradedTracking(messages: Message[]) {
  const result = await fallbackChain.send(messages)

  // Track cost by tier
  await costTracker.record({
    timestamp: new Date(),
    tier: result.tier,
    cost: result.cost,
    savingsPercent: result.savingsPercent,
    isStale: result.isStale || false,
    duration: result.duration
  })

  return result
}

// Get degraded mode report
const report = await costTracker.getDegradedModeReport({
  startDate: new Date('2026-01-01'),
  endDate: new Date()
})

console.log(report)
// {
//   optimizedRequests: 9500 (95%),
//   optimizedCost: $285.00,
//   optimizedSavings: 70%,
//
//   baselineRequests: 450 (4.5%),
//   baselineCost: $45.00,
//   baselineSavings: 0%,
//
//   cachedRequests: 50 (0.5%),
//   cachedCost: $0.50,
//   cachedSavings: 95%,
//
//   totalRequests: 10000,
//   totalCost: $330.50,
//   averageSavings: 67% // Maintained 50-70% target!
// }

// Result: Even with 5% fallback to baseline, you maintain 67% overall savings`}
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      Cost Impact of Degraded Modes
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      With proper fallback chains, even if 10% of requests fall back to baseline (0% savings), you
                      still maintain <strong>63% overall savings</strong> (90% × 70% + 10% × 0% = 63%). This is well
                      within the 50-70% target and provides excellent reliability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePattern === 'circuit-breaker' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Circuit Breaker with Cost Tracking</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Protect against cascading failures while tracking the cost impact of circuit states (closed, open,
                  half-open).
                </p>

                <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Circuit States</h4>
                  <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-2">
                    <li>
                      <strong>Closed (Normal):</strong> All requests use optimized path (50-70% savings)
                    </li>
                    <li>
                      <strong>Open (Failed):</strong> All requests bypass optimization, use baseline (0% savings)
                    </li>
                    <li>
                      <strong>Half-Open (Testing):</strong> Some requests test optimization, others use baseline
                    </li>
                  </ul>
                </div>

                <CodeBlock
                  language="typescript"
                  code={`import CircuitBreaker from 'opossum'
import { OptimizationClient, CostTracker } from '@clarity-chat/token-optimization'

const costTracker = new CostTracker()

// Create circuit breaker for optimization
const optimizationBreaker = new CircuitBreaker(
  async (messages: Message[]) => {
    const result = await optimizationClient.sendMessage(messages)

    // Track successful optimization
    await costTracker.record({
      timestamp: new Date(),
      source: 'optimization',
      cost: result.cost,
      savingsPercent: result.savingsPercent
    })

    return result
  },
  {
    timeout: 5000,              // 5s timeout
    errorThresholdPercentage: 50, // Open if 50% fail
    resetTimeout: 30000,        // Try again after 30s
    rollingCountTimeout: 10000, // 10s rolling window
    volumeThreshold: 10,        // Minimum 10 requests before opening
  }
)

// Fallback to baseline when circuit is open
optimizationBreaker.fallback(async (messages: Message[]) => {
  console.warn('Circuit breaker OPEN, using baseline API')

  const result = await baselineClient.sendMessage(messages)

  // Track fallback cost
  await costTracker.record({
    timestamp: new Date(),
    source: 'baseline_fallback',
    cost: result.cost,
    savingsPercent: 0,
    reason: 'circuit_breaker_open'
  })

  return result
})

// Monitor circuit state changes
optimizationBreaker.on('open', () => {
  console.error('🔴 Circuit breaker OPEN - optimization bypassed')
  metrics.increment('circuit_breaker.opened')

  // Alert operations team
  alertOps({
    severity: 'warning',
    message: 'Optimization circuit breaker opened. Using baseline API.',
    impact: 'Cost savings reduced from 70% to 0% until resolved'
  })
})

optimizationBreaker.on('halfOpen', () => {
  console.warn('🟡 Circuit breaker HALF-OPEN - testing optimization')
  metrics.increment('circuit_breaker.half_open')
})

optimizationBreaker.on('close', () => {
  console.log('🟢 Circuit breaker CLOSED - optimization restored')
  metrics.increment('circuit_breaker.closed')

  // Alert recovery
  alertOps({
    severity: 'info',
    message: 'Optimization circuit breaker closed. Cost savings restored.',
    impact: '70% cost savings resumed'
  })
})

// Usage
export async function sendMessage(messages: Message[]) {
  try {
    return await optimizationBreaker.fire(messages)
  } catch (error) {
    // Fallback already executed, error means both paths failed
    console.error('Both optimization and baseline failed:', error)
    throw error
  }
}`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Circuit Breaker Cost Report</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Generate reports showing the cost impact of circuit breaker states:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`// Generate circuit breaker cost report
const report = await costTracker.getCircuitBreakerReport({
  startDate: new Date('2026-01-01'),
  endDate: new Date()
})

console.log(report)
// {
//   totalRequests: 100000,
//   totalCost: $3350.00,
//
//   closedState: {
//     requests: 98000 (98%),
//     cost: $2940.00,
//     avgSavings: 70%,
//     duration: '99.2% of time'
//   },
//
//   openState: {
//     requests: 1800 (1.8%),
//     cost: $405.00,
//     avgSavings: 0%,
//     duration: '0.7% of time',
//     incidents: 3
//   },
//
//   halfOpenState: {
//     requests: 200 (0.2%),
//     cost: $5.00,
//     avgSavings: 35%, // Mixed optimization/baseline
//     duration: '0.1% of time'
//   },
//
//   overallSavings: 67%, // Maintained 50-70% target!
//
//   incidents: [
//     {
//       timestamp: '2026-01-15T10:30:00Z',
//       duration: '5 minutes',
//       requestsDuringOpen: 600,
//       extraCost: $135.00, // Cost above optimized baseline
//       reason: 'API rate limit exceeded'
//     },
//     // ... more incidents
//   ]
// }

// Result: Even with 3 circuit breaker incidents, maintained 67% overall savings`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Production Monitoring & Alerting</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Set up alerts for circuit breaker events and cost overruns:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`import { AlertManager } from './lib/alerts'

const alerts = new AlertManager({
  slack: process.env.SLACK_WEBHOOK,
  pagerduty: process.env.PAGERDUTY_KEY
})

// Alert on circuit breaker open
optimizationBreaker.on('open', async () => {
  await alerts.send({
    severity: 'warning',
    title: 'Optimization Circuit Breaker Opened',
    message: \`
      The optimization circuit breaker has opened due to high failure rate.

      Impact:
      - Cost savings reduced from 70% to 0%
      - Estimated cost increase: $50/hour
      - All requests now using baseline API

      Action Required:
      - Check optimization service health
      - Review recent error logs
      - Verify API keys and rate limits
      - Circuit will auto-retry in 30 seconds
    \`,
    metrics: await costTracker.getCurrentMetrics()
  })
})

// Alert on cost spike
costTracker.on('costSpike', async (spike) => {
  if (spike.percentIncrease > 20) {
    await alerts.send({
      severity: 'critical',
      title: 'AI Cost Spike Detected',
      message: \`
        Cost has increased by \${spike.percentIncrease}% in the last hour.

        Current cost: $\${spike.currentCost}/hour
        Expected cost: $\${spike.expectedCost}/hour
        Difference: +$\${spike.difference}/hour

        Possible causes:
        - Circuit breaker open (\${optimizationBreaker.opened ? 'YES ⚠️' : 'no'})
        - Cache hit rate drop (\${spike.cacheHitRate}%)
        - Model routing issues

        Investigate immediately to restore cost savings.
      \`,
      metrics: spike
    })
  }
})

// Daily summary report
cron.schedule('0 9 * * *', async () => {
  const summary = await costTracker.getDailySummary()

  await alerts.send({
    severity: 'info',
    title: 'Daily AI Cost Summary',
    message: \`
      Yesterday's AI Cost Report:

      Total Requests: \${summary.totalRequests.toLocaleString()}
      Total Cost: $\${summary.totalCost.toFixed(2)}
      Average Savings: \${summary.avgSavings}% ✓

      Breakdown:
      - Optimized: \${summary.optimizedPercent}% of requests
      - Baseline fallback: \${summary.baselinePercent}%
      - Cached: \${summary.cachedPercent}%

      Circuit Breaker:
      - Incidents: \${summary.circuitBreakerIncidents}
      - Total downtime: \${summary.circuitBreakerDowntime}

      Status: \${summary.avgSavings >= 50 ? '✅ On target' : '⚠️ Below target'}
    \`,
    metrics: summary
  })
})`}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Working Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Working Examples</h2>

        <div className="space-y-6">
          {/* Example 1: Rate Limit Error */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Example 1: Rate Limit Error with Retry
              </h3>
            </div>
            <div className="p-4">
              <CodeBlock
                language="typescript"
                code={`// Scenario: API rate limit exceeded, retry with backoff
const result = await client.sendMessage(messages, {
  retry: {
    maxAttempts: 3,
    baseDelay: 2000, // 2s, 4s, 8s
    retryableErrors: ['RATE_LIMIT_EXCEEDED']
  }
})

// Output:
// Attempt 1: RATE_LIMIT_EXCEEDED, retrying in 2000ms
// Attempt 2: RATE_LIMIT_EXCEEDED, retrying in 4000ms
// Attempt 3: Success! Cost: $0.0035 (65% savings maintained)`}
              />
            </div>
          </div>

          {/* Example 2: Service Outage */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Example 2: Optimization Service Outage
              </h3>
            </div>
            <div className="p-4">
              <CodeBlock
                language="typescript"
                code={`// Scenario: Optimization service is down, fallback to baseline
const result = await fallbackChain.send(messages)

// Flow:
// 1. Try optimized: TIMEOUT after 5s
// 2. Try baseline: Success!
// 3. Result: tier='baseline', cost=$0.010, savings=0%

// Even in degraded mode, request succeeded
console.log(\`Tier: \${result.tier}\`) // 'baseline'
console.log(\`Cost: $\${result.cost}\`) // $0.010 (vs $0.003 optimized)
console.log(\`Extra cost: $\${result.cost - result.optimizedCost}\`) // +$0.007

// Cost impact: If 5% of requests hit this scenario:
// 95% × $0.003 + 5% × $0.010 = $0.00335/request average
// Still 67% overall savings maintained!`}
              />
            </div>
          </div>

          {/* Example 3: Cache Stale Response */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Example 3: Both APIs Down, Return Cached Response
              </h3>
            </div>
            <div className="p-4">
              <CodeBlock
                language="typescript"
                code={`// Scenario: Complete outage, return stale cache
const result = await fallbackChain.send(messages)

// Flow:
// 1. Try optimized: CONNECTION_ERROR
// 2. Try baseline: CONNECTION_ERROR
// 3. Try cache: Success! (but 10 minutes old)

console.log(\`Tier: \${result.tier}\`) // 'cached'
console.log(\`Cost: $\${result.cost}\`) // $0.0001 (cache read)
console.log(\`Is stale: \${result.isStale}\`) // true
console.log(\`Age: \${result.ageMinutes}\`) // 10 minutes

// Show warning to user
if (result.isStale) {
  showBanner({
    type: 'warning',
    message: 'Using cached response (10 minutes old). Service will retry shortly.'
  })
}

// Cost impact: Minimal ($0.0001 vs $0.010 baseline)
// Savings: 99% on cached responses!`}
              />
            </div>
          </div>

          {/* Example 4: Production Error Recovery */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Example 4: Complete Production Setup
              </h3>
            </div>
            <div className="p-4">
              <CodeBlock
                language="typescript"
                code={`import {
  OptimizationClient,
  FallbackChain,
  CircuitBreaker,
  CostTracker,
  AlertManager
} from '@clarity-chat/token-optimization'

// Production configuration
const production = {
  // Tier 1: Optimized with circuit breaker
  optimized: new CircuitBreaker(
    new OptimizationClient({
      apiKey: process.env.ANTHROPIC_API_KEY!,
      enableCaching: true,
      enableCompression: true,
      enableRouting: true,
      timeout: 5000
    }),
    {
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
      volumeThreshold: 10
    }
  ),

  // Tier 2: Baseline with retry
  baseline: new BaselineClient({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    retry: { maxAttempts: 3, baseDelay: 1000 },
    timeout: 10000
  }),

  // Tier 3: Cache (stale-while-revalidate)
  cache: new CacheClient({
    redis: process.env.REDIS_URL!,
    maxAge: 3600,
    staleWhileRevalidate: true
  }),

  // Cost tracking
  costTracker: new CostTracker({
    database: process.env.DATABASE_URL!
  }),

  // Alerting
  alerts: new AlertManager({
    slack: process.env.SLACK_WEBHOOK,
    pagerduty: process.env.PAGERDUTY_KEY
  })
}

// Create fallback chain
const chain = new FallbackChain(production.optimized, {
  fallback: production.baseline,
  lastResort: production.cache,
  costTracker: production.costTracker,
  alerts: production.alerts
})

// Production endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const result = await chain.send(req.body.messages)

    // Log result
    logger.info('chat_request', {
      userId: req.headers['x-user-id'],
      tier: result.tier,
      cost: result.cost,
      savings: result.savingsPercent,
      isStale: result.isStale
    })

    res.json({
      content: result.content,
      cost: result.cost,
      tier: result.tier,
      isStale: result.isStale
    })
  } catch (error) {
    logger.error('chat_request_failed', { error })
    res.status(500).json({ error: 'Service temporarily unavailable' })
  }
})

// Result: 99.9% uptime, 67% average savings across all requests`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Monitoring & Alerting */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Monitoring & Alerting</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Key metrics to monitor in production:
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-600" />
              Error Rates
            </h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• Retry success rate: &gt;95%</li>
              <li>• Fallback rate: &lt;5%</li>
              <li>• Circuit breaker opens: &lt;3/day</li>
              <li>• Cache staleness: &lt;1%</li>
            </ul>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Cost Metrics
            </h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• Average savings: 50-70%</li>
              <li>• Cost per request: Track p50, p95, p99</li>
              <li>• Daily spend: Alert if &gt;budget</li>
              <li>• Tier distribution: 95% optimized</li>
            </ul>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Performance
            </h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• Latency p95: &lt;500ms</li>
              <li>• Retry latency: Track extra time</li>
              <li>• Cache hit rate: &gt;60%</li>
              <li>• Circuit breaker recovery time</li>
            </ul>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" />
              Reliability
            </h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• Uptime SLA: 99.9%</li>
              <li>• Error rate: &lt;1%</li>
              <li>• Fallback coverage: 100%</li>
              <li>• Recovery time: &lt;30s</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="bg-brand-500/10 border border-brand-500/30 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Code className="w-5 h-5" />
          Related Resources
        </h2>
        <div className="space-y-3">
          <Link
            href="/cookbook/enterprise-production-pipeline"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Enterprise Production Pipeline cookbook
          </Link>
          <Link
            href="/cookbook/achieving-50-percent-reduction"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Achieving 50-70% cost reduction
          </Link>
          <Link
            href="/reference/api/optimization-middleware"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            OptimizationMiddleware API reference
          </Link>
          <Link
            href="/reference/api/cost-tracker"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            CostTracker API reference
          </Link>
        </div>
      </section>

      {/* API Summary Table */}
      <section>
        <h2 className="text-2xl font-bold mb-6">API Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-300 dark:border-neutral-700">
                <th className="text-left py-3 px-4 font-semibold">Class / Function</th>
                <th className="text-left py-3 px-4 font-semibold">Purpose</th>
                <th className="text-left py-3 px-4 font-semibold">Cost Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-3 px-4">
                  <code className="text-brand-600 dark:text-brand-400">RetryConfig</code>
                </td>
                <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                  Configure retry behavior with exponential backoff
                </td>
                <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                  Maintains 50-70% savings on retry success
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-3 px-4">
                  <code className="text-brand-600 dark:text-brand-400">FallbackChain</code>
                </td>
                <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                  3-tier fallback: optimized → baseline → cached
                </td>
                <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                  Guarantees 50-70% avg savings even with 5% fallback
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-3 px-4">
                  <code className="text-brand-600 dark:text-brand-400">CircuitBreaker</code>
                </td>
                <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                  Prevent cascading failures with automatic recovery
                </td>
                <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                  Maintains 60%+ savings with &lt;3 incidents/day
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-3 px-4">
                  <code className="text-brand-600 dark:text-brand-400">CostTracker</code>
                </td>
                <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                  Track costs across tiers and circuit states
                </td>
                <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                  Monitor degraded mode cost impact in real-time
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-3 px-4">
                  <code className="text-brand-600 dark:text-brand-400">AlertManager</code>
                </td>
                <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                  Send alerts for cost spikes and circuit events
                </td>
                <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                  Prevent cost overruns with proactive alerts
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Production Best Practices */}
      <section className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4">Production Best Practices</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Always implement all three patterns
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Use retry for transient errors, fallback chains for degraded modes, and circuit breakers for
                cascading failure protection.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Track costs by tier and circuit state
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Monitor the cost impact of degraded modes to ensure you maintain 50-70% savings target.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Set up proactive alerting
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Alert on circuit breaker opens, cost spikes &gt;20%, and fallback rates &gt;5%.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Test failure scenarios in staging
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Simulate API outages, rate limits, and timeouts to verify fallback chains work correctly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Cache stale responses as last resort
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                A slightly stale cached response (99% cost savings) is better than a complete failure.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
