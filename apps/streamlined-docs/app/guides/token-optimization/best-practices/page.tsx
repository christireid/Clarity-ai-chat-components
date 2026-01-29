'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Database,
  Zap,
  Target,
  Clock,
  AlertTriangle,
  Info,
  ArrowRight,
  Shield,
  Gauge,
  FileCode,
  Settings,
  BarChart3,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCopyButton } from '@/components/Enhanced/EnhancedCopyButton'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Best Practice Categories
// ============================================================================

interface BestPractice {
  title: string
  description: string
  dos: string[]
  donts: string[]
  example?: string
  impact: 'high' | 'medium' | 'low'
}

const cachingPractices: BestPractice = {
  title: 'When to Use Caching',
  description:
    'Provider caching offers 50-90% cost reduction on repeated content. Understanding when and how to cache is critical for maximizing savings.',
  impact: 'high',
  dos: [
    'Cache static system prompts that remain constant across requests',
    'Use caching for large context documents (technical specs, user manuals)',
    'Cache conversation history that is reused in subsequent messages',
    'Ensure cached content meets minimum token thresholds (1024+ for Anthropic, 32K+ for Google)',
    'Place cacheable content at the beginning of message arrays',
    'Monitor cache hit rates and adjust strategies accordingly',
  ],
  donts: [
    "Don't cache frequently changing user inputs or dynamic data",
    "Don't use caching for content below the minimum token threshold",
    "Don't cache sensitive information without proper security review",
    "Don't assume caching is always beneficial - measure actual savings",
    "Don't mix cacheable and non-cacheable content in the same message block",
    "Don't forget to set appropriate TTL values based on content volatility",
  ],
  example: `// Good: Cacheable system prompt
const messages = [
  {
    role: 'system',
    content: largeSystemPrompt, // 2000+ tokens, rarely changes
    // Anthropic will cache this automatically
  },
  {
    role: 'user',
    content: userQuery, // Dynamic, not cached
  },
]

// Bad: Content too small for caching
const messages = [
  {
    role: 'system',
    content: 'You are a helpful assistant.', // Only 6 tokens - won't cache
  },
  { role: 'user', content: userQuery },
]

// Best: Strategic caching with estimation
import { estimateCacheSavings } from '@clarity-chat/token-optimization'

const savings = await estimateCacheSavings(messages, 'anthropic')
if (savings.eligible) {
  console.log(savings.recommendation)
  // "Anthropic caching enabled. Expected to cache ~5000 tokens with 90% cost reduction."
} else {
  console.log('Content too small for caching benefits')
}`,
}

const compressionPractices: BestPractice = {
  title: 'Compression Guidelines',
  description:
    'Context compression reduces token usage by 20-60% while preserving semantic meaning. The key is choosing the right strategy and compression level for your content type.',
  impact: 'high',
  dos: [
    'Use adaptive compression for mixed content types (automatically selects best strategy)',
    'Apply lighter compression (70-80% retention) for technical or structured content',
    'Use aggressive compression (40-50% retention) for general text and summaries',
    'Preserve first and last paragraphs to maintain context boundaries',
    'Compress conversation history older than 5-10 turns',
    'Test compression quality with representative samples before production',
  ],
  donts: [
    "Don't compress code snippets or API responses that require exact formatting",
    "Don't use aggressive compression on short content (under 500 tokens)",
    "Don't compress without preserving key phrases and domain-specific terminology",
    "Don't assume compression maintains 100% semantic accuracy - validate outputs",
    "Don't compress legal, medical, or safety-critical content without review",
    "Don't forget to monitor quality metrics after enabling compression",
  ],
  example: `import {
  compressAdaptively,
  CompressionLevel,
} from '@clarity-chat/token-optimization'

// Good: Adaptive compression with quality preservation
const result = await compressAdaptively(longDocument, {
  targetRatio: 0.6, // Keep 60% of content
  preserveKeyPhrases: true,
  preserveFirst: true,
  preserveLast: true,
  model: 'gpt-4o',
})

console.log(\`Saved \${result.tokensSaved} tokens (\${result.savingsPercent}%)\`)

// Bad: Over-aggressive compression on structured data
const apiResponse = JSON.stringify(complexData)
const compressed = await compressAdaptively(apiResponse, {
  targetRatio: 0.3, // Too aggressive - may break structure
  preserveStructure: false, // Bad for JSON/code
})

// Best: Content-aware compression
async function compressConversationHistory(
  messages: Message[],
  keepRecent: number = 5
) {
  const recentMessages = messages.slice(-keepRecent)
  const oldMessages = messages.slice(0, -keepRecent)

  // Don't compress recent context
  const compressedOld = await Promise.all(
    oldMessages.map((msg) =>
      compressAdaptively(msg.content, {
        targetRatio: 0.5,
        preserveKeyPhrases: true,
      })
    )
  )

  return [...compressedOld.map((c) => c.compressed), ...recentMessages]
}`,
}

const routingPractices: BestPractice = {
  title: 'Model Routing Strategies',
  description:
    'Intelligent model routing saves 30-50% by directing simple queries to cheaper models while using premium models only when necessary.',
  impact: 'high',
  dos: [
    'Use cost-optimized routing for production workloads to maximize savings',
    'Route FAQ-style queries and simple questions to mini/haiku models',
    'Reserve premium models (GPT-4, Claude Opus) for complex reasoning tasks',
    'Set model constraints based on required capabilities (function calling, vision)',
    'Track routing statistics to validate cost savings assumptions',
    'Implement fallback to premium models when cheaper ones fail',
  ],
  donts: [
    "Don't route all queries to premium models 'just to be safe'",
    "Don't ignore complexity analysis - trust the router's recommendations",
    "Don't route long-form generation to models with small context windows",
    "Don't forget to consider output token costs when routing",
    "Don't route without validating that cheaper models meet your quality bar",
    "Don't hardcode model selections - use dynamic routing",
  ],
  example: `import { ModelRouter } from '@clarity-chat/token-optimization'

// Good: Cost-optimized routing with constraints
const router = ModelRouter.builder()
  .useOpenAIModels()
  .useClaudeModels()
  .withStrategy('cost-optimized')
  .build()

const result = router.route(prompt, {
  estimatedInputTokens: 2000,
  estimatedOutputTokens: 500,
  requiredCapabilities: ['function_calling'],
})

console.log(\`Selected: \${result.selectedModel?.id}\`)
console.log(\`Estimated cost: $\${result.estimatedCost?.toFixed(4)}\`)

// Bad: Always using the most expensive model
const response = await openai.chat.completions.create({
  model: 'gpt-4', // Expensive, even for simple queries
  messages,
})

// Best: Adaptive routing with quality monitoring
class AdaptiveRouter {
  private router: ModelRouter
  private qualityScores = new Map<string, number[]>()

  async routeWithQualityTracking(prompt: string) {
    const result = this.router.route(prompt)
    const response = await this.sendToModel(result.selectedModel, prompt)

    // Track quality for this model tier
    const quality = await this.evaluateQuality(response)
    this.recordQuality(result.selectedModel.id, quality)

    // Escalate to premium if quality is consistently low
    if (this.shouldEscalate(result.selectedModel.id)) {
      return this.router.route(prompt, {
        allowedModels: ['gpt-4o', 'claude-3-5-sonnet'],
      })
    }

    return result
  }
}`,
}

const qualityPractices: BestPractice = {
  title: 'Quality Thresholds',
  description:
    'Optimization should never compromise response quality. Establish clear thresholds and monitoring to ensure cost savings don\'t degrade user experience.',
  impact: 'high',
  dos: [
    'Define minimum quality scores for different use cases (accuracy, coherence, relevance)',
    'A/B test optimization strategies against unoptimized baselines',
    'Set up automated quality monitoring with alerts for degradation',
    'Use human evaluation for critical applications',
    'Establish per-model quality benchmarks before routing decisions',
    'Monitor user feedback and satisfaction scores continuously',
  ],
  donts: [
    "Don't optimize without measuring impact on response quality",
    "Don't assume cost savings are worth any quality trade-off",
    "Don't deploy compression or routing without baseline quality metrics",
    "Don't ignore user complaints about response quality after optimization",
    "Don't set quality thresholds too low to justify aggressive cost cutting",
    "Don't forget to validate quality across different content types",
  ],
  example: `import {
  calculateCost,
  useTokenOptimization,
} from '@clarity-chat/token-optimization'

// Good: Quality-gated optimization
interface QualityMetrics {
  accuracy: number // 0-1
  coherence: number // 0-1
  relevance: number // 0-1
}

class QualityGatedOptimizer {
  private qualityThresholds = {
    accuracy: 0.85,
    coherence: 0.90,
    relevance: 0.88,
  }

  async optimizeWithQualityCheck(prompt: string) {
    // Try optimized approach
    const optimized = await this.getOptimizedResponse(prompt)
    const optimizedQuality = await this.evaluateQuality(optimized)

    // Validate against thresholds
    if (this.meetsQualityBar(optimizedQuality)) {
      console.log('Quality maintained with optimization')
      return optimized
    }

    // Fallback to unoptimized if quality drops
    console.warn('Quality below threshold, using premium model')
    return this.getPremiumResponse(prompt)
  }

  private meetsQualityBar(metrics: QualityMetrics): boolean {
    return (
      metrics.accuracy >= this.qualityThresholds.accuracy &&
      metrics.coherence >= this.qualityThresholds.coherence &&
      metrics.relevance >= this.qualityThresholds.relevance
    )
  }
}

// Best: Continuous quality monitoring
class QualityMonitor {
  private samples: Array<{
    timestamp: number
    quality: QualityMetrics
    cost: number
    strategy: string
  }> = []

  recordResponse(response: any, strategy: string) {
    this.samples.push({
      timestamp: Date.now(),
      quality: this.evaluateQuality(response),
      cost: this.calculateCost(response),
      strategy,
    })

    // Alert on quality degradation
    const recentQuality = this.getRecentAverageQuality()
    if (recentQuality < 0.85) {
      this.alertQualityDegradation(recentQuality, strategy)
    }
  }

  generateReport() {
    return {
      averageQuality: this.getAverageQuality(),
      averageCost: this.getAverageCost(),
      costPerQualityPoint: this.getCostEfficiency(),
      strategyPerformance: this.compareStrategies(),
    }
  }
}`,
}

const budgetPractices: BestPractice = {
  title: 'Budget Management',
  description:
    'Proactive budget management prevents cost overruns and ensures predictable spending. Set limits, monitor usage, and implement guardrails.',
  impact: 'medium',
  dos: [
    'Set per-conversation token budgets based on model context windows',
    'Implement warning thresholds at 75-80% of budget',
    'Enable auto-trimming of old messages when approaching limits',
    'Track daily/monthly spend across all conversations',
    'Set up alerts for unusual spending patterns',
    'Review and adjust budgets based on actual usage patterns',
  ],
  donts: [
    "Don't wait until budgets are exceeded to take action",
    "Don't trim important context just to stay under budget",
    "Don't set budgets so low that they impact functionality",
    "Don't forget to account for cached token savings in budgets",
    "Don't ignore budget warnings until critical threshold",
    "Don't use the same budget limits for all use cases",
  ],
  example: `import {
  useTokenBudgetTracking,
  createModelBudgetMonitor,
} from '@clarity-chat/token-optimization'

// Good: Proactive budget management
function ChatWithBudget() {
  const config = createModelBudgetMonitor('gpt-4o', {
    warningThreshold: 0.75, // Alert at 75%
    criticalThreshold: 0.90, // Critical at 90%
    autoTrim: true,
    onWarning: (usage) => {
      console.log(\`Warning: \${usage.utilizationPercent}% budget used\`)
      notifyUser('Approaching token limit. Consider starting new conversation.')
    },
    onCritical: (usage) => {
      console.error(\`Critical: \${usage.utilizationPercent}% budget used\`)
      showNotification('Token budget critical. Auto-trimming enabled.')
    },
    onAutoTrim: (result) => {
      console.log(\`Trimmed \${result.tokensRemoved} tokens\`)
      updateUI({ trimmedMessages: result.removedMessages.length })
    },
  })

  const { usage, updateMessages, isWarning, isCritical } =
    useTokenBudgetTracking(config)

  return (
    <div>
      <BudgetIndicator
        current={usage.current}
        limit={usage.limit}
        status={usage.status}
      />
      {isWarning && (
        <Alert variant="warning">Approaching token limit</Alert>
      )}
      {isCritical && (
        <Alert variant="error">
          Token budget critical - old messages being trimmed
        </Alert>
      )}
    </div>
  )
}

// Best: Tiered budget strategy
class TieredBudgetManager {
  private budgetTiers = {
    free: { daily: 10000, monthly: 250000 },
    pro: { daily: 50000, monthly: 1200000 },
    enterprise: { daily: 200000, monthly: 5000000 },
  }

  getBudgetForUser(userId: string, tier: keyof typeof this.budgetTiers) {
    const limits = this.budgetTiers[tier]
    const usage = this.getCurrentUsage(userId)

    return {
      remainingDaily: limits.daily - usage.daily,
      remainingMonthly: limits.monthly - usage.monthly,
      shouldThrottle: usage.daily > limits.daily * 0.9,
      shouldBlock: usage.daily >= limits.daily,
    }
  }
}`,
}

const monitoringPractices: BestPractice = {
  title: 'Monitoring & Analytics',
  description:
    'Continuous monitoring provides visibility into optimization effectiveness and helps identify opportunities for improvement.',
  impact: 'medium',
  dos: [
    'Track token usage, costs, and savings across all optimization strategies',
    'Monitor cache hit rates and compression ratios',
    'Log routing decisions and model selection reasoning',
    'Set up dashboards for real-time cost visibility',
    'Compare actual vs. estimated costs regularly',
    'Generate weekly/monthly reports on optimization impact',
  ],
  donts: [
    "Don't optimize without measuring - establish baseline metrics first",
    "Don't ignore cost anomalies or unexpected spending spikes",
    "Don't rely solely on estimated costs - validate with actual provider bills",
    "Don't forget to track quality metrics alongside cost metrics",
    "Don't monitor in isolation - correlate costs with user activity",
    "Don't neglect to review and act on monitoring insights",
  ],
  example: `import {
  CostTracker,
  calculateCost,
} from '@clarity-chat/token-optimization'

// Good: Comprehensive monitoring
class OptimizationMonitor {
  private tracker = new CostTracker()
  private metrics = {
    totalTokens: 0,
    tokensSaved: 0,
    cacheHits: 0,
    cacheMisses: 0,
    compressionRatio: [] as number[],
    routingDecisions: new Map<string, number>(),
  }

  recordRequest(request: {
    inputTokens: number
    outputTokens: number
    cachedTokens?: number
    model: string
    compressed?: boolean
    compressionRatio?: number
  }) {
    // Track cost
    this.tracker.recordUsage({
      model: request.model,
      inputTokens: request.inputTokens,
      outputTokens: request.outputTokens,
      cachedInputTokens: request.cachedTokens,
    })

    // Track optimization metrics
    this.metrics.totalTokens += request.inputTokens + request.outputTokens
    if (request.cachedTokens) {
      this.metrics.cacheHits++
      this.metrics.tokensSaved += request.cachedTokens * 0.9 // 90% savings
    } else {
      this.metrics.cacheMisses++
    }

    if (request.compressed && request.compressionRatio) {
      this.metrics.compressionRatio.push(request.compressionRatio)
    }

    // Track routing
    const count = this.metrics.routingDecisions.get(request.model) || 0
    this.metrics.routingDecisions.set(request.model, count + 1)
  }

  generateReport() {
    const costReport = this.tracker.generateReport()
    const avgCompression =
      this.metrics.compressionRatio.reduce((a, b) => a + b, 0) /
      this.metrics.compressionRatio.length

    return {
      // Cost metrics
      totalCost: costReport.totalCost,
      costByModel: costReport.byModel,
      estimatedSavings: this.calculateSavings(),

      // Optimization metrics
      tokensSaved: this.metrics.tokensSaved,
      savingsPercent:
        (this.metrics.tokensSaved / this.metrics.totalTokens) * 100,
      cacheHitRate:
        this.metrics.cacheHits /
        (this.metrics.cacheHits + this.metrics.cacheMisses),
      avgCompressionRatio: avgCompression,

      // Routing metrics
      modelDistribution: Object.fromEntries(
        this.metrics.routingDecisions
      ),
      recommendedActions: this.generateRecommendations(),
    }
  }

  private generateRecommendations() {
    const recommendations = []

    // Low cache hit rate
    if (this.getCacheHitRate() < 0.4) {
      recommendations.push({
        type: 'cache',
        priority: 'high',
        message: 'Cache hit rate is low. Consider increasing cacheable content or reviewing cache strategy.',
      })
    }

    // Expensive model overuse
    const premiumUsage = this.getPremiumModelUsage()
    if (premiumUsage > 0.5) {
      recommendations.push({
        type: 'routing',
        priority: 'medium',
        message: \`\${(premiumUsage * 100).toFixed(0)}% of requests use premium models. Review routing strategy.\`,
      })
    }

    return recommendations
  }
}`,
}

// ============================================================================
// Interactive Decision Flow
// ============================================================================

interface DecisionNode {
  id: string
  question: string
  options: Array<{
    label: string
    nextId: string | null
    recommendation?: string
  }>
}

const optimizationDecisionFlow: DecisionNode[] = [
  {
    id: 'start',
    question: 'What is your primary optimization goal?',
    options: [
      { label: 'Reduce costs immediately', nextId: 'cost-primary' },
      { label: 'Maintain quality, reduce costs where safe', nextId: 'quality-primary' },
      { label: 'Balance cost and quality', nextId: 'balanced' },
    ],
  },
  {
    id: 'cost-primary',
    question: 'Do you have large static content (system prompts, documents)?',
    options: [
      {
        label: 'Yes, 1000+ tokens of static content',
        nextId: null,
        recommendation:
          '1. Enable provider caching (90% savings on static content)\n2. Use aggressive compression (50% retention)\n3. Route to cost-optimized models',
      },
      {
        label: 'No, mostly dynamic content',
        nextId: null,
        recommendation:
          '1. Use model routing (cheaper models for simple queries)\n2. Apply moderate compression (60-70% retention)\n3. Set strict token budgets with auto-trimming',
      },
    ],
  },
  {
    id: 'quality-primary',
    question: 'How much quality degradation can you tolerate?',
    options: [
      {
        label: 'None - quality is critical',
        nextId: null,
        recommendation:
          '1. Use provider caching only (no quality impact)\n2. Light compression on old messages only (80% retention)\n3. Route only for very simple queries',
      },
      {
        label: 'Minimal - 5-10% degradation acceptable',
        nextId: null,
        recommendation:
          '1. Enable caching for static content\n2. Moderate compression (70% retention) with quality checks\n3. Balanced routing with quality monitoring',
      },
    ],
  },
  {
    id: 'balanced',
    question: 'What is your use case?',
    options: [
      {
        label: 'Customer support / FAQ',
        nextId: null,
        recommendation:
          '1. Cache support documentation and FAQs (50-70% savings)\n2. Route simple questions to mini models (40% savings)\n3. Compress conversation history after 10 turns',
      },
      {
        label: 'Document analysis',
        nextId: null,
        recommendation:
          '1. Cache large documents with Google Context Caching (75% savings)\n2. Use aggressive compression for summaries (50% retention)\n3. Route based on analysis complexity',
      },
      {
        label: 'Code generation / technical',
        nextId: null,
        recommendation:
          '1. Cache codebase context (90% savings on repeated context)\n2. No compression on code (breaks structure)\n3. Route based on task complexity (debugging vs refactoring)',
      },
    ],
  },
]

function DecisionFlowTool() {
  const [currentNodeId, setCurrentNodeId] = React.useState('start')
  const [recommendation, setRecommendation] = React.useState<string | null>(null)

  const currentNode = optimizationDecisionFlow.find((n) => n.id === currentNodeId)

  const handleChoice = (nextId: string | null, rec?: string) => {
    if (rec) {
      setRecommendation(rec)
    } else if (nextId) {
      setCurrentNodeId(nextId)
    }
  }

  const reset = () => {
    setCurrentNodeId('start')
    setRecommendation(null)
  }

  if (!currentNode) return null

  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card">
      {!recommendation ? (
        <>
          <h3 className="text-lg font-semibold mb-4">{currentNode.question}</h3>
          <div className="space-y-2">
            {currentNode.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(option.nextId, option.recommendation)}
                className="w-full p-4 text-left rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <div className="flex items-center gap-2 text-emerald-500 mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Recommended Strategy</h3>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 mb-4">
            <pre className="text-sm whitespace-pre-wrap text-emerald-800 dark:text-emerald-200">
              {recommendation}
            </pre>
          </div>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function BestPracticesPage() {
  const practices = [
    cachingPractices,
    compressionPractices,
    routingPractices,
    qualityPractices,
    budgetPractices,
    monitoringPractices,
  ]

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumbs />

      <div className="container-docs py-8">
        <div className="max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.moderate }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Token Optimization Best Practices</h1>
                <p className="text-muted-foreground">
                  Production-tested strategies for maximizing cost savings while maintaining quality
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: TrendingDown, label: 'Cost Reduction', value: '50-70%', color: 'text-emerald-500' },
                { icon: Database, label: 'Cache Savings', value: '90%', color: 'text-purple-500' },
                { icon: Zap, label: 'Strategies', value: '6+', color: 'text-amber-500' },
                { icon: Target, label: 'Quality Target', value: '85%+', color: 'text-blue-500' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-border/50 bg-card"
                >
                  <stat.icon className={cn('w-5 h-5 mb-2', stat.color)} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Overview */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
              <div className="flex items-start gap-4">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    Token optimization is about making strategic decisions that balance cost savings with quality.
                    This guide covers when to cache, how to compress, which models to route to, and how to
                    maintain quality thresholds. Follow these best practices to achieve 50-70% cost reduction
                    without compromising user experience.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Decision Flow Tool */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.moderate, delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-4">Find Your Optimization Strategy</h2>
            <p className="text-muted-foreground mb-6">
              Not sure where to start? Use this interactive tool to get personalized recommendations
              based on your use case and goals.
            </p>
            <DecisionFlowTool />
          </motion.section>

          {/* Best Practices Sections */}
          {practices.map((practice, idx) => (
            <motion.section
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: durations.moderate, delay: 0.1 + idx * 0.05 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    practice.impact === 'high' && 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400',
                    practice.impact === 'medium' && 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
                    practice.impact === 'low' && 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                  )}
                >
                  {practice.impact.toUpperCase()} IMPACT
                </div>
                <h2 className="text-2xl font-bold">{practice.title}</h2>
              </div>

              <p className="text-muted-foreground mb-6">{practice.description}</p>

              {/* Do's and Don'ts */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Do's */}
                <div className="p-6 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">
                      Do's
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {practice.dos.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-emerald-500 shrink-0 mt-1">✓</span>
                        <span className="text-emerald-900 dark:text-emerald-100">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Don'ts */}
                <div className="p-6 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/20">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <h4 className="font-semibold text-red-700 dark:text-red-300">
                      Don'ts
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {practice.donts.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-red-500 shrink-0 mt-1">✗</span>
                        <span className="text-red-900 dark:text-red-100">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Code Example */}
              {practice.example && (
                <div className="rounded-xl border border-border/50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <FileCode className="w-4 h-4" />
                      <span className="text-sm font-mono">Example Implementation</span>
                    </div>
                    <EnhancedCopyButton
                      text={practice.example}
                      label="Copy example"
                      size="sm"
                      celebration="pulse"
                    />
                  </div>
                  <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
                    <code>{practice.example}</code>
                  </pre>
                </div>
              )}
            </motion.section>
          ))}

          {/* Quick Reference */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.moderate }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Quick Reference Guide</h2>
            <div className="space-y-4">
              {[
                {
                  title: 'When to Cache',
                  criteria: [
                    'Content is 1024+ tokens (Anthropic) or 32K+ tokens (Google)',
                    'Content is static or semi-static (system prompts, docs)',
                    'Content is reused across multiple requests',
                    'TTL matches content update frequency',
                  ],
                  icon: Database,
                  color: 'purple',
                },
                {
                  title: 'When to Compress',
                  criteria: [
                    'Content is longer than 500 tokens',
                    'Semantic meaning matters more than exact wording',
                    'Content is narrative or explanatory (not code/data)',
                    'Quality can tolerate 10-20% degradation',
                  ],
                  icon: Layers,
                  color: 'teal',
                },
                {
                  title: 'When to Route to Cheaper Models',
                  criteria: [
                    'Query is simple or FAQ-style',
                    'No advanced reasoning required',
                    'Output length is short (<500 tokens)',
                    'Quality bar is medium (not critical)',
                  ],
                  icon: Target,
                  color: 'indigo',
                },
                {
                  title: 'When to Set Quality Thresholds',
                  criteria: [
                    'User-facing applications',
                    'Mission-critical outputs',
                    'A/B testing optimization strategies',
                    'Validating cost-quality trade-offs',
                  ],
                  icon: Shield,
                  color: 'blue',
                },
              ].map((guide, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-border/50 bg-card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-lg',
                        `bg-${guide.color}-500/10 text-${guide.color}-500`
                      )}
                    >
                      <guide.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{guide.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {guide.criteria.map((criterion, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-brand-500 shrink-0 mt-1">•</span>
                        <span className="text-muted-foreground">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Production Checklist */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.moderate }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Production Readiness Checklist</h2>
            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <div className="space-y-3">
                {[
                  'Baseline metrics established (cost, quality, latency)',
                  'Optimization strategies tested against baseline',
                  'Quality thresholds defined and monitored',
                  'Budget limits set with alerts configured',
                  'Caching enabled for eligible static content',
                  'Compression tested and validated for quality',
                  'Model routing configured with fallbacks',
                  'Monitoring dashboards operational',
                  'Error handling and retry logic implemented',
                  'Documentation updated with optimization details',
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-2 border-border text-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    />
                    <span className="text-sm group-hover:text-brand-500 transition-colors">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Related Resources */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.moderate }}
          >
            <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
            <div className="grid gap-4">
              <Link
                href="/guides/token-optimization"
                className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-brand-500" />
                  <div className="flex-1">
                    <h4 className="font-semibold group-hover:text-brand-500 transition-colors">
                      Token Optimization Guide
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Complete guide to token counting, caching, compression, and routing
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link
                href="/reference/components/token-optimization"
                className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-brand-500" />
                  <div className="flex-1">
                    <h4 className="font-semibold group-hover:text-brand-500 transition-colors">
                      API Reference
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Detailed API documentation for all optimization functions and hooks
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link
                href="/playground"
                className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-brand-500" />
                  <div className="flex-1">
                    <h4 className="font-semibold group-hover:text-brand-500 transition-colors">
                      Interactive Playground
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Test optimization strategies with live examples and visualizations
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
