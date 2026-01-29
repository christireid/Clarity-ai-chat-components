'use client'

/**
 * Batch Processing with Token Optimization - API Reference
 *
 * Comprehensive guide to batch processing patterns with token optimization,
 * including parallel, sequential, and rate-limited strategies. Achieve 60-75%
 * cost reduction through intelligent batching and shared provider caching.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Layers,
  Copy,
  Check,
  ChevronRight,
  TrendingDown,
  Zap,
  AlertCircle,
  Keyboard,
  Eye,
  Database,
  BarChart3,
  GitMerge,
  Clock,
  RefreshCw,
  Target,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div id={id} className={cn('scroll-mt-24', className)}>
      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-sm">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Feature Card Component
// ============================================================================

function FeatureCard({
  icon: Icon,
  title,
  description,
  stat,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  stat?: string
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-brand-500/10">
          <Icon className="w-5 h-5 text-brand-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          {stat && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold">
              {stat}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function BatchOptimizationPage() {
  const breadcrumbItems = [
    { label: 'Reference', href: '/reference' },
    { label: 'API', href: '/reference/api' },
    { label: 'Batch Optimization' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container-docs py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-lg">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">
                    Batch Processing
                  </h1>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                    60-75% Savings
                  </span>
                </div>
                <p className="text-lg text-muted-foreground">
                  Intelligent batch processing with token optimization for massive cost reduction
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <TrendingDown className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Cost Reduction</p>
                  <p className="text-sm font-semibold text-foreground">60-75%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <Database className="w-5 h-5 text-brand-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Shared Cache</p>
                  <p className="text-sm font-semibold text-foreground">90% Savings</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <GitMerge className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Patterns</p>
                  <p className="text-sm font-semibold text-foreground">3 Types</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <Activity className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Tracking</p>
                  <p className="text-sm font-semibold text-foreground">Real-time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <Section id="features" title="Key Features">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <FeatureCard
                icon={GitMerge}
                title="Three Batch Patterns"
                description="Parallel, sequential, and rate-limited processing strategies for different use cases"
              />
              <FeatureCard
                icon={Database}
                title="Shared Provider Cache"
                description="Batch requests share provider-level cache for 90% savings on repeated content"
                stat="90% Cache Savings"
              />
              <FeatureCard
                icon={Target}
                title="Cost Tracking"
                description="Real-time cost monitoring across batches with detailed savings breakdown"
              />
              <FeatureCard
                icon={Zap}
                title="Performance Benchmarks"
                description="Built-in benchmarking and optimization metrics for batch operations"
              />
            </div>
          </Section>

          {/* Overview */}
          <Section id="overview" title="Overview" className="mb-12">
            <p className="text-muted-foreground mb-6">
              Batch processing combines multiple AI requests into groups for significant cost savings.
              When combined with token optimization and provider caching, you can achieve 60-75%
              overall cost reduction compared to individual requests.
            </p>

            <div className="p-6 rounded-xl border border-border/50 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-500" />
                Cost Breakdown Example
              </h4>
              <div className="space-y-3 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                    <p className="font-medium text-red-700 dark:text-red-300 mb-2">
                      Individual Requests (1000×)
                    </p>
                    <p className="font-mono text-sm">500 tokens × $3.00/1M × 1000</p>
                    <p className="font-mono text-xl text-red-600 mt-2">= $1,500/month</p>
                  </div>
                  <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                    <p className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                      Batch + Cache (1000×)
                    </p>
                    <p className="font-mono text-sm">50% batch discount</p>
                    <p className="font-mono text-sm">+ 90% cache on 80% requests</p>
                    <p className="font-mono text-xl text-emerald-600 mt-2">= $450/month</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-emerald-300 dark:border-emerald-700">
                  <p className="font-bold text-lg">
                    Total Savings: $1,050/month (70% reduction)
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Installation */}
          <Section id="installation" title="Installation" className="mb-12">
            <CodeBlock
              code={`npm install @clarity-chat/react @clarity-chat/utils
# or
pnpm add @clarity-chat/react @clarity-chat/utils
# or
yarn add @clarity-chat/react @clarity-chat/utils`}
              language="bash"
            />
          </Section>

          {/* Batch Patterns */}
          <Section id="patterns" title="Batch Processing Patterns" className="mb-12">
            <SubSection id="parallel-batch" title="1. Parallel Batching" className="mb-8">
              <p className="text-muted-foreground mb-4">
                Process multiple independent requests simultaneously. Best for analytics, bulk
                operations, and non-interactive tasks.
              </p>
              <CodeBlock
                code={`import { BatchRequestManager } from '@clarity-chat/react'

const manager = new BatchRequestManager({
  provider: 'openai',
  maxBatchSize: 50,      // Process 50 at once
  maxWaitTime: 60000,    // Wait up to 60s to fill batch
})

// Add requests (non-blocking)
const requests = Array.from({ length: 100 }, (_, i) => ({
  id: \`req-\${i}\`,
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: \`Query \${i}\` }],
  priority: 'low',
}))

// Queue all requests
const promises = requests.map(req => manager.addRequest(req))

// Submit batch
const job = await manager.submitBatch()
console.log('Batch submitted:', job.id)

// Wait for completion
const results = await Promise.all(promises)
console.log(\`Processed \${results.length} requests\`)

// Check savings
const stats = manager.getStats()
console.log(\`Savings: $\${stats.totalSavings.toFixed(2)}\`)`}
                language="typescript"
              />

              <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Best for:
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 list-disc list-inside space-y-1">
                  <li>Analytics and reporting (process 1000s of data points)</li>
                  <li>Bulk content generation (product descriptions, summaries)</li>
                  <li>Batch translation or classification tasks</li>
                  <li>Scheduled jobs and background processing</li>
                </ul>
              </div>
            </SubSection>

            <SubSection id="sequential-batch" title="2. Sequential Batching" className="mb-8">
              <p className="text-muted-foreground mb-4">
                Process requests in order with dependencies. Ideal for multi-step workflows where
                each step depends on the previous result.
              </p>
              <CodeBlock
                code={`import { BatchRequestManager } from '@clarity-chat/react'

const manager = new BatchRequestManager({
  provider: 'anthropic',
  maxBatchSize: 10,
  maxWaitTime: 30000,
})

// Multi-step workflow
async function processDocument(document: string) {
  // Step 1: Extract key points
  const step1Result = await manager.addRequest({
    id: 'extract-points',
    model: 'claude-3-5-haiku',
    messages: [{
      role: 'user',
      content: \`Extract key points from: \${document}\`
    }],
    priority: 'normal',
  })

  // Step 2: Generate summary (depends on step 1)
  const step2Result = await manager.addRequest({
    id: 'generate-summary',
    model: 'claude-3-5-haiku',
    messages: [{
      role: 'user',
      content: \`Summarize these points: \${step1Result.content}\`
    }],
    priority: 'normal',
  })

  // Step 3: Create action items (depends on step 2)
  const step3Result = await manager.addRequest({
    id: 'action-items',
    model: 'claude-3-5-haiku',
    messages: [{
      role: 'user',
      content: \`Create action items from: \${step2Result.content}\`
    }],
    priority: 'normal',
  })

  return {
    keyPoints: step1Result.content,
    summary: step2Result.content,
    actionItems: step3Result.content,
  }
}

// Process multiple documents
const documents = ['doc1.txt', 'doc2.txt', 'doc3.txt']
const results = await Promise.all(
  documents.map(doc => processDocument(doc))
)`}
                language="typescript"
              />

              <div className="mt-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Best for:
                </p>
                <ul className="text-sm text-purple-800 dark:text-purple-200 list-disc list-inside space-y-1">
                  <li>Multi-step document processing pipelines</li>
                  <li>Iterative refinement workflows</li>
                  <li>Code review → fix suggestions → validation</li>
                  <li>Research → summarize → fact-check</li>
                </ul>
              </div>
            </SubSection>

            <SubSection id="rate-limited-batch" title="3. Rate-Limited Batching" className="mb-8">
              <p className="text-muted-foreground mb-4">
                Control request throughput to stay within API rate limits while maximizing batch
                efficiency. Essential for high-volume production systems.
              </p>
              <CodeBlock
                code={`import { BatchRequestManager } from '@clarity-chat/react'
import { RateLimiter } from '@clarity-chat/utils'

// Create rate limiter (60 requests per minute)
const rateLimiter = new RateLimiter({
  maxRequests: 60,
  windowMs: 60000,
})

const manager = new BatchRequestManager({
  provider: 'openai',
  maxBatchSize: 20,
  maxWaitTime: 5000,
  onProgress: (completed, total) => {
    console.log(\`Progress: \${completed}/\${total}\`)
  },
})

// Rate-limited batch processing
async function processBatchWithRateLimit(requests: any[]) {
  const batches = []

  // Split into batches
  for (let i = 0; i < requests.length; i += 20) {
    batches.push(requests.slice(i, i + 20))
  }

  const results = []

  for (const batch of batches) {
    // Wait for rate limit
    await rateLimiter.waitForCapacity(batch.length)

    // Process batch
    const batchPromises = batch.map(req => manager.addRequest(req))
    await manager.submitBatch()

    // Collect results
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    console.log(\`Completed batch: \${results.length}/\${requests.length}\`)
  }

  return results
}

// Process 1000 requests respecting rate limits
const largeJobRequests = Array.from({ length: 1000 }, (_, i) => ({
  id: \`job-\${i}\`,
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: \`Task \${i}\` }],
  priority: 'low',
}))

const results = await processBatchWithRateLimit(largeJobRequests)
console.log(\`Processed \${results.length} requests within rate limits\`)`}
                language="typescript"
              />

              <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                  Best for:
                </p>
                <ul className="text-sm text-amber-800 dark:text-amber-200 list-disc list-inside space-y-1">
                  <li>High-volume production systems (1000s of daily requests)</li>
                  <li>Multi-tenant applications with shared quotas</li>
                  <li>Staying within tier-based rate limits</li>
                  <li>Preventing 429 rate limit errors</li>
                </ul>
              </div>
            </SubSection>
          </Section>

          {/* Optimization Integration */}
          <Section id="optimization" title="Integration with Token Optimization" className="mb-12">
            <SubSection id="shared-cache" title="Shared Provider Cache" className="mb-8">
              <p className="text-muted-foreground mb-4">
                When batching requests with common context (system prompts, documentation), share
                provider-level cache across all batch items for 90% savings on cached content.
              </p>
              <CodeBlock
                code={`import { BatchRequestManager, formatForCaching } from '@clarity-chat/react'

// Large shared context (3000+ tokens)
const systemPrompt = \`You are a customer support AI.

# Product Documentation
\${productDocs}  // 2000 tokens

# Support Guidelines
\${guidelines}   // 1000 tokens\`

// Format for provider caching
const cachedMessages = await formatForCaching(
  [{ role: 'system', content: systemPrompt }],
  { provider: 'anthropic', minTokens: 1024 }
)

const manager = new BatchRequestManager({
  provider: 'anthropic',
  maxBatchSize: 50,
})

// All requests share the same cached system prompt
const userQueries = [
  'How do I reset my password?',
  'What are your business hours?',
  'How do I cancel my subscription?',
  // ... 47 more queries
]

const requests = userQueries.map((query, i) => ({
  id: \`support-\${i}\`,
  model: 'claude-3-5-sonnet-20241022',
  messages: [
    ...cachedMessages.messages,  // Shared cached context
    { role: 'user', content: query }
  ],
  priority: 'low',
}))

// Process batch
const promises = requests.map(req => manager.addRequest(req))
const job = await manager.submitBatch()

// Cost analysis
const results = await Promise.all(promises)

// First request: Creates cache (3000 tokens @ $3.00/1M = $0.009)
// Next 49 requests: Use cache (3000 tokens @ $0.30/1M = $0.0009 each)
// Total: $0.009 + (49 × $0.0009) = $0.0531
// Without cache: 50 × $0.009 = $0.45
// Savings: $0.3969 (88% reduction on this batch)`}
                language="typescript"
              />

              <div className="mt-4 p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
                <h4 className="font-semibold mb-4">💰 Real-World Savings Example</h4>
                <div className="space-y-3 text-sm">
                  <p className="font-medium">Scenario: 10,000 customer support queries/day with shared context</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                      <p className="font-medium text-red-700 dark:text-red-300 mb-2">Without Batching</p>
                      <p className="font-mono text-xs">10K requests</p>
                      <p className="font-mono text-xs">3K token context each</p>
                      <p className="font-mono text-xs">No caching</p>
                      <p className="font-mono text-lg text-red-600 mt-2">$300/day</p>
                    </div>
                    <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                      <p className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">With Batch + Cache</p>
                      <p className="font-mono text-xs">200 batches of 50</p>
                      <p className="font-mono text-xs">90% cache hit rate</p>
                      <p className="font-mono text-xs">50% batch discount</p>
                      <p className="font-mono text-lg text-emerald-600 mt-2">$75/day</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-emerald-300 dark:border-emerald-700">
                    <p className="font-bold text-lg">Monthly Savings: $6,750 (75% reduction)</p>
                  </div>
                </div>
              </div>
            </SubSection>

            <SubSection id="compression" title="Batch with Compression" className="mb-8">
              <p className="text-muted-foreground mb-4">
                Combine batching with prompt compression for even greater savings. Compress
                context before batching to reduce tokens across all requests.
              </p>
              <CodeBlock
                code={`import {
  BatchRequestManager,
  compressContext,
  formatForCaching
} from '@clarity-chat/react'

// Large context to compress
const originalContext = \`
  [Full product documentation - 5000 tokens]
  [Complete support guidelines - 3000 tokens]
  [FAQ database - 2000 tokens]
  Total: 10,000 tokens
\`

// Compress context (60% reduction typical)
const compressed = await compressContext(originalContext, {
  targetReduction: 0.6,
  preserveKeyInfo: true,
})
// Result: ~4000 tokens (60% reduction)

// Format compressed context for caching
const cachedMessages = await formatForCaching(
  [{ role: 'system', content: compressed.text }],
  { provider: 'anthropic', minTokens: 1024 }
)

const manager = new BatchRequestManager({
  provider: 'anthropic',
  maxBatchSize: 100,
})

// Batch with compressed + cached context
const requests = userQueries.map((query, i) => ({
  id: \`compressed-\${i}\`,
  model: 'claude-3-5-haiku',
  messages: [
    ...cachedMessages.messages,  // Compressed + cached
    { role: 'user', content: query }
  ],
  priority: 'low',
}))

// Triple savings:
// 1. 60% from compression
// 2. 90% from caching (on compressed tokens)
// 3. 50% from batching
// Combined: ~85% total cost reduction`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* Cost Tracking */}
          <Section id="cost-tracking" title="Cost Tracking Across Batches" className="mb-12">
            <SubSection id="real-time-monitoring" title="Real-Time Cost Monitoring" className="mb-8">
              <CodeBlock
                code={`import { BatchRequestManager, CostTracker } from '@clarity-chat/react'

// Create cost tracker
const costTracker = new CostTracker({
  provider: 'openai',
  model: 'gpt-4o-mini',
  alertThreshold: 100, // Alert at $100
})

const manager = new BatchRequestManager({
  provider: 'openai',
  maxBatchSize: 50,
  onProgress: (completed, total) => {
    const progress = (completed / total) * 100
    console.log(\`Batch progress: \${progress.toFixed(1)}%\`)
  },
  onStatusChange: (job) => {
    if (job.status === 'completed') {
      const results = manager.getResults(job.id)
      if (results) {
        // Track costs
        const totalTokens = results.reduce((sum, r) =>
          sum + (r.usage?.inputTokens || 0) + (r.usage?.outputTokens || 0),
          0
        )

        costTracker.track({
          inputTokens: results.reduce((s, r) => s + (r.usage?.inputTokens || 0), 0),
          outputTokens: results.reduce((s, r) => s + (r.usage?.outputTokens || 0), 0),
          cacheReadTokens: 0, // Provider-specific
          cacheWriteTokens: 0,
        })

        console.log('Batch Cost Summary:')
        console.log(\`  Input tokens: \${costTracker.getStats().inputTokens}\`)
        console.log(\`  Output tokens: \${costTracker.getStats().outputTokens}\`)
        console.log(\`  Total cost: $\${costTracker.getTotalCost().toFixed(4)}\`)
        console.log(\`  Savings: $\${costTracker.getSavings().toFixed(4)}\`)
      }
    }
  },
})

// Add requests
const requests = Array.from({ length: 100 }, (_, i) => ({
  id: \`req-\${i}\`,
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: \`Query \${i}\` }],
  priority: 'low',
}))

const promises = requests.map(req => manager.addRequest(req))
await manager.submitBatch()
await Promise.all(promises)

// Final cost report
console.log('\\nFinal Cost Report:')
console.log(JSON.stringify(costTracker.getDetailedReport(), null, 2))`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="batch-analytics" title="Batch Analytics Dashboard" className="mb-8">
              <CodeBlock
                code={`import { BatchRequestManager, useBatchAnalytics } from '@clarity-chat/react'

function BatchDashboard() {
  const [manager] = React.useState(() =>
    new BatchRequestManager({
      provider: 'openai',
      maxBatchSize: 50,
      maxWaitTime: 30000,
    })
  )

  const analytics = useBatchAnalytics(manager)

  return (
    <div className="space-y-6">
      <h2>Batch Processing Analytics</h2>

      {/* Queue Status */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Queue Size</p>
          <p className="text-2xl font-bold">{analytics.queueSize}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Active Jobs</p>
          <p className="text-2xl font-bold">{analytics.activeJobs}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold">{analytics.totalCompleted}</p>
        </div>
      </div>

      {/* Savings */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
        <h3 className="font-semibold mb-4">Cost Savings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Savings</p>
            <p className="text-3xl font-bold text-emerald-600">
              $\{analytics.totalSavings.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Batch Size</p>
            <p className="text-3xl font-bold text-brand-600">
              {analytics.averageBatchSize.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div>
        <h3 className="font-semibold mb-4">Recent Jobs</h3>
        <div className="space-y-2">
          {analytics.recentJobs.map(job => (
            <div key={job.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">{job.id}</span>
                <span className={\`px-2 py-1 text-xs rounded-full \${
                  job.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : job.status === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }\`}>
                  {job.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {job.requestIds.length} requests
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* Performance Benchmarks */}
          <Section id="benchmarks" title="Performance Benchmarks" className="mb-12">
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-4">
                  Batch Size vs. Cost Efficiency
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border/50">
                      <tr>
                        <th className="text-left py-3 px-4">Batch Size</th>
                        <th className="text-left py-3 px-4">Wait Time</th>
                        <th className="text-left py-3 px-4">Throughput</th>
                        <th className="text-left py-3 px-4">Cost Savings</th>
                        <th className="text-left py-3 px-4">Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="py-3 px-4 font-mono">10</td>
                        <td className="py-3 px-4">~5s</td>
                        <td className="py-3 px-4">120 req/min</td>
                        <td className="py-3 px-4 text-amber-600">55%</td>
                        <td className="py-3 px-4">Real-time apps</td>
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="py-3 px-4 font-mono">50</td>
                        <td className="py-3 px-4">~30s</td>
                        <td className="py-3 px-4">100 req/min</td>
                        <td className="py-3 px-4 text-green-600">70%</td>
                        <td className="py-3 px-4">Background jobs</td>
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="py-3 px-4 font-mono">100</td>
                        <td className="py-3 px-4">~60s</td>
                        <td className="py-3 px-4">90 req/min</td>
                        <td className="py-3 px-4 text-emerald-600">75%</td>
                        <td className="py-3 px-4">Analytics</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono">200</td>
                        <td className="py-3 px-4">~120s</td>
                        <td className="py-3 px-4">75 req/min</td>
                        <td className="py-3 px-4 text-emerald-700 font-semibold">78%</td>
                        <td className="py-3 px-4">Bulk processing</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Optimization Tip
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Larger batches (50-100) provide the best cost savings but require longer wait
                      times. For interactive applications, use smaller batches (10-20) with sequential
                      processing. For analytics, maximize batch size (100-200).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Error Handling */}
          <Section id="error-handling" title="Error Handling & Retry Logic" className="mb-12">
            <SubSection id="retry-failed" title="Automatic Retry on Failure" className="mb-8">
              <CodeBlock
                code={`import { BatchRequestManager, RetryStrategy } from '@clarity-chat/react'

const retryStrategy = new RetryStrategy({
  maxRetries: 3,
  backoffMs: 1000,
  backoffMultiplier: 2,
  retryableErrors: ['rate_limit_exceeded', 'server_error'],
})

const manager = new BatchRequestManager({
  provider: 'openai',
  maxBatchSize: 50,
  onStatusChange: (job) => {
    if (job.status === 'failed') {
      console.error('Batch failed:', job.error)

      // Retry failed requests
      const failedRequests = job.requestIds.map(id =>
        /* retrieve original request */
      )

      retryStrategy.retry(async () => {
        const retryPromises = failedRequests.map(req =>
          manager.addRequest(req)
        )
        await manager.submitBatch()
        return Promise.all(retryPromises)
      })
    }
  },
})

// Graceful degradation
async function processWithFallback(requests: any[]) {
  try {
    // Try batch processing first
    const promises = requests.map(req => manager.addRequest(req))
    const job = await manager.submitBatch()
    return await Promise.all(promises)
  } catch (error) {
    console.warn('Batch failed, falling back to individual requests')

    // Fall back to individual processing
    return await Promise.all(
      requests.map(req =>
        fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify(req),
        }).then(r => r.json())
      )
    )
  }
}`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="partial-failures" title="Handling Partial Failures" className="mb-8">
              <CodeBlock
                code={`import { BatchRequestManager } from '@clarity-chat/react'

const manager = new BatchRequestManager({
  provider: 'anthropic',
  maxBatchSize: 50,
})

async function processBatchWithPartialFailureHandling(requests: any[]) {
  const promises = requests.map(req => manager.addRequest(req))
  const job = await manager.submitBatch()

  // Wait for all results (both success and failure)
  const results = await Promise.allSettled(promises)

  // Separate successes and failures
  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<any>).value)

  const failed = results
    .filter(r => r.status === 'rejected')
    .map((r, i) => ({
      request: requests[i],
      error: (r as PromiseRejectedResult).reason,
    }))

  console.log(\`Successful: \${successful.length}\`)
  console.log(\`Failed: \${failed.length}\`)

  // Retry failed requests individually
  if (failed.length > 0) {
    console.log('Retrying failed requests...')
    const retryResults = await Promise.all(
      failed.map(({ request }) =>
        fetch('/api/chat/single', {
          method: 'POST',
          body: JSON.stringify(request),
        }).then(r => r.json())
      )
    )

    return [...successful, ...retryResults]
  }

  return successful
}`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* Related APIs */}
          <Section id="related" title="Related Components & APIs" className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/cookbook/provider-caching-setup"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <Database className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Provider Caching Setup
                </h3>
                <p className="text-sm text-muted-foreground">
                  Configure provider-level caching for 90% savings on repeated content
                </p>
              </Link>

              <Link
                href="/reference/components/token-optimization"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <BarChart3 className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Token Optimization System
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complete token optimization guide with cost estimation and monitoring
                </p>
              </Link>

              <Link
                href="/reference/hooks/use-token-budget-monitor"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <Eye className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  useTokenBudgetMonitor
                </h3>
                <p className="text-sm text-muted-foreground">
                  Real-time token budget monitoring with alerts and limits
                </p>
              </Link>

              <Link
                href="/cookbook/rate-limiting-quotas"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <Clock className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Rate Limiting & Quotas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Implement rate limiting to stay within API quotas
                </p>
              </Link>
            </div>
          </Section>

          {/* Accessibility */}
          <Section id="accessibility" title="Accessibility" className="mb-12">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Keyboard className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Progress Announcements
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Batch progress updates include ARIA live regions for screen reader announcements.
                    Use the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">onProgress</code> callback
                    to provide real-time status updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Eye className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Visual Progress Indicators
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All batch processing UI components include accessible progress bars with
                    aria-valuemin, aria-valuemax, and aria-valuenow attributes for assistive
                    technologies.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-border/50">
            <Link
              href="/reference/api/optimization-middleware"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Optimization Middleware
            </Link>
            <Link
              href="/cookbook/provider-caching-setup"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-500 transition-colors"
            >
              Provider Caching Setup
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
