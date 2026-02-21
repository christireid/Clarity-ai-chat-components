'use client'

/**
 * Token Optimization Migration Guide (v2 → v3)
 *
 * Comprehensive guide for migrating from v2.x to v3.0 of @clarity-chat/token-optimization
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ScrollReveal,
  KineticText,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/Enhanced/ScrollReveal'
import { EnhancedCopyButton } from '@/components/Enhanced/EnhancedCopyButton'
import { CollapsibleSection } from '@/components/CollapsibleSection/CollapsibleSection'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Info,
  Zap,
  Package,
  FileCode,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Clock,
  Code2,
  Terminal,
  ChevronRight,
  BookOpen,
  Lightbulb,
  Gauge,
  BarChart3,
  Activity,
} from 'lucide-react'
import Link from 'next/link'

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const breakingChanges = [
  {
    title: 'useTokenBudgetMonitor Renamed to useTokenBudgetTracking',
    severity: 'low' as const,
    category: 'Hooks',
    oldCode: `// ❌ Deprecated in v2.x, removed in v3.0
import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'

function ChatMonitor() {
  const { usage, isWarning, updateMessages } = useTokenBudgetMonitor({
    maxInputTokens: 128000,
    reservedForOutput: 4096,
    onWarning: (usage) => console.warn('80% budget used'),
  })

  return <TokenDisplay usage={usage} />
}`,
    newCode: `// ✅ v3.0 - Renamed for clarity
import { useTokenBudgetTracking } from '@clarity-chat/token-optimization'

function ChatMonitor() {
  const { usage, isWarning, updateMessages } = useTokenBudgetTracking({
    maxInputTokens: 128000,
    reservedForOutput: 4096,
    onWarning: (usage) => console.warn('80% budget used'),
  })

  return <TokenDisplay usage={usage} />
}`,
    reason:
      'The name "useTokenBudgetMonitor" was confusing as it conflicted with component-specific usage. The new name "useTokenBudgetTracking" better reflects its purpose: tracking and analytics.',
    impact: 'Low - Simple import rename. API is identical.',
    migration: [
      'Find and replace: useTokenBudgetMonitor → useTokenBudgetTracking',
      'Update import statements',
      'No code changes needed - API is identical',
      'Deprecation warnings appeared since v2.5, so this should be expected',
    ],
  },
  {
    title: 'TokenUsage Type Renamed to TokenBudgetUsage',
    severity: 'low' as const,
    category: 'Types',
    oldCode: `// ❌ Deprecated in v2.x, removed in v3.0
import { TokenUsage } from '@clarity-chat/token-optimization'

function processUsage(usage: TokenUsage) {
  console.log(\`Used: \${usage.current}/\${usage.max}\`)
}`,
    newCode: `// ✅ v3.0 - Renamed for clarity
import { TokenBudgetUsage } from '@clarity-chat/token-optimization'

function processUsage(usage: TokenBudgetUsage) {
  console.log(\`Used: \${usage.current}/\${usage.max}\`)
}`,
    reason:
      'Renamed to avoid confusion with analytics/TokenUsage type used for API metrics. TokenBudgetUsage is specifically for budget tracking.',
    impact: 'Low - Type alias update only.',
    migration: [
      'Find and replace: TokenUsage → TokenBudgetUsage',
      'Update type imports and annotations',
      'Consider using TokenBudgetUsage for budget tracking',
      'Use analytics/TokenUsage for API metrics',
    ],
  },
  {
    title: 'TokenBudgetMonitorReturn Type Renamed',
    severity: 'low' as const,
    category: 'Types',
    oldCode: `// ❌ Deprecated in v2.x, removed in v3.0
import { TokenBudgetMonitorReturn } from '@clarity-chat/token-optimization'

type MonitorHook = TokenBudgetMonitorReturn

function useCustomMonitor(): TokenBudgetMonitorReturn {
  // Custom implementation
}`,
    newCode: `// ✅ v3.0 - Updated type name
import { TokenBudgetTrackingReturn } from '@clarity-chat/token-optimization'

type MonitorHook = TokenBudgetTrackingReturn

function useCustomMonitor(): TokenBudgetTrackingReturn {
  // Custom implementation
}`,
    reason: 'Matches the new hook name for consistency.',
    impact: 'Low - Type alias update only.',
    migration: [
      'Find and replace: TokenBudgetMonitorReturn → TokenBudgetTrackingReturn',
      'Update type imports and annotations',
      'No runtime impact',
    ],
  },
  {
    title: 'Enhanced Model Registry with Better Defaults',
    severity: 'low' as const,
    category: 'Model Registry',
    oldCode: `// v2.x - Limited model support
import { MODEL_REGISTRY } from '@clarity-chat/token-optimization'

// Only had ~15 models
const model = MODEL_REGISTRY['gpt-4o']`,
    newCode: `// ✅ v3.0 - Expanded registry with 40+ models
import { MODEL_REGISTRY, getModelConfig } from '@clarity-chat/token-optimization'

// Now includes 40+ models with detailed configs
const model = getModelConfig('gpt-4o')

// Type-safe model access with validation
import { isValidModelId } from '@clarity-chat/token-optimization'

if (isValidModelId('claude-3-5-sonnet-20241022')) {
  const config = getModelConfig('claude-3-5-sonnet-20241022')
  console.log(\`Context: \${config.contextWindow} tokens\`)
}`,
    reason:
      'Expanded model registry from 15 to 40+ models. Added better validation and type safety.',
    impact: 'Low - Backward compatible. Existing code continues to work.',
    migration: [
      'No changes required - fully backward compatible',
      'Consider using getModelConfig() for better error handling',
      'Use isValidModelId() for validation before accessing',
      'Explore new models: Gemini 2.0, Claude 3.5, GPT-4o-mini, etc.',
    ],
  },
]

const performanceImprovements = [
  {
    title: 'Provider-Native Counting Performance',
    improvement: '10x faster',
    description:
      'Anthropic and Gemini provider-native counting now uses optimized API endpoints',
    before: 'Average: 450ms per count',
    after: 'Average: 45ms per count',
    example: `// v3.0 - 10x faster provider counting
import { ProviderNativeCounter } from '@clarity-chat/token-optimization'

const counter = new ProviderNativeCounter({
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Now 10x faster with optimized API calls
const result = await counter.count(text)`,
  },
  {
    title: 'Compression Throughput Increased',
    improvement: '3x faster',
    description:
      'LLMLingua and extractive compression now use parallel processing',
    before: '~1,000 tokens/sec',
    after: '~3,000 tokens/sec',
    example: `// v3.0 - Parallel processing for compression
import { compressAdaptively } from '@clarity-chat/token-optimization'

// Automatically uses parallel processing for large texts
const result = await compressAdaptively(largeText, {
  targetRatio: 0.5,
  // v3.0 automatically chunks and processes in parallel
})`,
  },
  {
    title: 'Cache Hit Rate Optimization',
    improvement: '+15% hit rate',
    description: 'Improved semantic similarity matching and TTL management',
    before: 'Average: 65% hit rate',
    after: 'Average: 80% hit rate',
    example: `// v3.0 - Improved semantic cache
import { TieredCache } from '@clarity-chat/token-optimization'

const cache = new TieredCache({
  semantic: {
    enabled: true,
    threshold: 0.85, // v3.0 uses better similarity algorithm
  },
})`,
  },
  {
    title: 'Memory Usage Reduction',
    improvement: '-40% memory',
    description:
      'Optimized data structures and garbage collection in token counting',
    before: '~250 MB for large conversations',
    after: '~150 MB for large conversations',
    example: `// v3.0 - Memory-efficient token counting
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

const counter = new AccurateTokenCounter({
  model: 'gpt-4o',
  // v3.0 uses optimized memory management
})`,
  },
]

const newFeaturesV3 = [
  {
    title: 'Real-Time Budget Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    description:
      'Enhanced useTokenBudgetTracking with detailed analytics and trend detection',
    example: `import { useTokenBudgetTracking } from '@clarity-chat/token-optimization'

function AdvancedMonitor() {
  const {
    usage,
    isWarning,
    isCritical,
    wouldExceed,
    calculateTokens,
    trimToCritical,
  } = useTokenBudgetTracking({
    maxInputTokens: 128000,
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
    autoTrim: true,
    onAutoTrim: (result) => {
      console.log(\`Auto-trimmed \${result.tokensRemoved} tokens\`)
    },
  })

  // New in v3.0: Check before adding content
  const canAdd = !wouldExceed(5000)

  return (
    <div>
      <ProgressBar
        value={usage.utilizationPercent}
        status={usage.status}
      />
      {isCritical && (
        <Button onClick={trimToCritical}>
          Trim to Critical Threshold
        </Button>
      )}
    </div>
  )
}`,
    benefit:
      'Proactive budget management with predictive checks and auto-trimming capabilities.',
  },
  {
    title: 'Cost Optimization Dashboard',
    icon: <TrendingUp className="w-5 h-5" />,
    description:
      'Robust cost tracking with ROI calculations and savings reports',
    example: `import { CostTracker } from '@clarity-chat/token-optimization'

const tracker = new CostTracker('gpt-4o')

// Track all requests
tracker.trackRequest({
  inputTokens: 5000,
  outputTokens: 1000,
  cachedInputTokens: 4000,
})

// Get comprehensive savings report
const report = tracker.getReport()

console.log(\`Savings Report:
  Total Cost: $\${report.cumulative.totalCost.toFixed(4)}
  Cache Savings: $\${report.cumulative.cacheSavings.toFixed(4)}
  Compression Savings: $\${report.cumulative.compressionSavings.toFixed(4)}
  Hit Rate: \${report.cache.hitRate.toFixed(1)}%
  ROI: \${report.cumulative.roi.toFixed(1)}x
\`)`,
    benefit:
      'Understand actual cost savings and measure optimization effectiveness.',
  },
  {
    title: 'Enhanced Quality Gates',
    icon: <ShieldCheck className="w-5 h-5" />,
    description:
      'Advanced quality validation for compression with configurable thresholds',
    example: `import { QualityGate } from '@clarity-chat/token-optimization'

const gate = new QualityGate({
  minQuality: 0.8,
  minCoherence: 0.75,
  maxInformationLoss: 0.2,
})

const result = await gate.check(compressed, original)

if (!result.passed) {
  console.warn('Quality check failed:', result.violations)
  // Fall back to original or use less aggressive compression
}`,
    benefit: 'Ensure compression maintains acceptable quality and coherence.',
  },
  {
    title: 'Circuit Breaker Pattern',
    icon: <Activity className="w-5 h-5" />,
    description:
      'Automatic failure detection and recovery for compression and caching',
    example: `import { CircuitBreaker } from '@clarity-chat/token-optimization'

const breaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000, // 1 minute
  onOpen: () => console.warn('Circuit opened - too many failures'),
})

try {
  const result = await breaker.execute(async () => {
    return await expensiveOperation()
  })
} catch (error) {
  console.error('Circuit breaker rejected:', error)
  // Fallback to simpler approach
}`,
    benefit:
      'Production resilience with automatic failure recovery and graceful degradation.',
  },
]

const migrationPitfalls = [
  {
    pitfall: 'Forgetting to update TypeScript imports',
    solution:
      'Use your IDE\'s "Find and Replace" to update all imports at once',
    example: `// Search for:
import { useTokenBudgetMonitor, TokenUsage, TokenBudgetMonitorReturn }

// Replace with:
import { useTokenBudgetTracking, TokenBudgetUsage, TokenBudgetTrackingReturn }`,
  },
  {
    pitfall: 'Not updating test snapshots',
    solution: 'Run tests with --updateSnapshot after migration',
    example: `# Update all snapshots after migration
npm test -- --updateSnapshot

# Or for specific test files
npm test -- useTokenBudgetTracking.test.ts --updateSnapshot`,
  },
  {
    pitfall: 'Assuming API breaking changes',
    solution:
      'API is identical - only names changed. No code logic updates needed.',
    example: `// ✅ Same API, different name
const { usage, isWarning } = useTokenBudgetTracking(config)
// All methods, properties, and behavior identical to v2.x`,
  },
  {
    pitfall: 'Missing deprecation warnings in v2.x',
    solution: 'Check console for deprecation warnings before upgrading',
    example: `// v2.x showed these warnings:
// [Deprecation] useTokenBudgetMonitor will be renamed to useTokenBudgetTracking in v3.0
// [Deprecation] TokenUsage type will be renamed to TokenBudgetUsage in v3.0

// If you see these, update now before v3.0`,
  },
]

const upgradeSteps = [
  {
    step: 1,
    title: 'Update Package Version',
    description: 'Upgrade to v3.0 and verify peer dependencies',
    commands: [
      'npm install @clarity-chat/token-optimization@^3.0.0',
      'npm install react@^18.0.0 react-dom@^18.0.0',
    ],
    note: 'Requires React 18+ and Node.js 18+. Verify package.json after update.',
  },
  {
    step: 2,
    title: 'Find Deprecated Usage',
    description: 'Search your codebase for deprecated imports and types',
    commands: [
      'grep -r "useTokenBudgetMonitor" src/',
      'grep -r "TokenUsage" src/ | grep -v "TokenBudgetUsage"',
      'grep -r "TokenBudgetMonitorReturn" src/',
    ],
    note: 'Make note of all files that need updates before proceeding.',
  },
  {
    step: 3,
    title: 'Update Imports and Types',
    description: 'Replace deprecated names with v3.0 equivalents',
    commands: [
      "# Use your IDE's Find and Replace:",
      '# useTokenBudgetMonitor → useTokenBudgetTracking',
      '# TokenUsage → TokenBudgetUsage (careful not to replace analytics/TokenUsage)',
      '# TokenBudgetMonitorReturn → TokenBudgetTrackingReturn',
    ],
    note: 'No code logic changes needed - API is identical.',
  },
  {
    step: 4,
    title: 'Update Tests',
    description: 'Update test files and regenerate snapshots',
    commands: ['npm test -- --updateSnapshot', 'npm run typecheck'],
    note: 'Verify all tests pass and TypeScript has no errors.',
  },
  {
    step: 5,
    title: 'Verify Production Build',
    description: 'Ensure clean build and test in development',
    commands: ['npm run build', 'npm run dev'],
    note: 'Test all token optimization features in your application.',
  },
]

const compatibilityMatrix = [
  {
    feature: 'useTokenBudgetTracking Hook',
    v2: 'useTokenBudgetMonitor',
    v3: 'useTokenBudgetTracking',
    compatible: true,
    notes: 'API identical, renamed for clarity',
  },
  {
    feature: 'TokenBudgetUsage Type',
    v2: 'TokenUsage',
    v3: 'TokenBudgetUsage',
    compatible: true,
    notes: 'Type structure identical',
  },
  {
    feature: 'Provider-Native Counting',
    v2: 'Available (450ms avg)',
    v3: 'Available (45ms avg)',
    compatible: true,
    notes: '10x performance improvement',
  },
  {
    feature: 'Compression Strategies',
    v2: 'LLMLingua, Extractive, Adaptive',
    v3: 'LLMLingua, Extractive, Adaptive (3x faster)',
    compatible: true,
    notes: 'Parallel processing added',
  },
  {
    feature: 'Model Registry',
    v2: '15 models',
    v3: '40+ models',
    compatible: true,
    notes: 'Fully backward compatible',
  },
  {
    feature: 'Cache System',
    v2: 'Exact + Semantic + Provider',
    v3: 'Exact + Semantic + Provider (optimized)',
    compatible: true,
    notes: '+15% hit rate improvement',
  },
]

export default function MigrationV2V3Page() {
  const [selectedChange, setSelectedChange] = useState<number | null>(null)

  return (
    <div className="container-docs py-8 sm:py-12">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-full mb-6">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Migration Guide: v2.x → v3.0
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Token Optimization v3.0 Migration
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8">
            Smooth upgrade path from v2.x to v3.0. Minimal breaking changes
            (only naming updates), significant performance improvements (+10x
            counting, +3x compression), and powerful new features.
          </p>

          {/* Quick Stats */}
          <div className="inline-flex items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                4
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Breaking Changes
              </div>
            </div>
            <div className="h-12 w-px bg-emerald-200 dark:bg-emerald-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                4
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Performance Boosts
              </div>
            </div>
            <div className="h-12 w-px bg-emerald-200 dark:bg-emerald-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                4
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                New Features
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* What's New */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mb-16">
          <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl font-bold">What's New in v3.0</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Renamed hooks for clarity (useTokenBudgetTracking)',
                '10x faster provider-native counting',
                '3x faster compression with parallel processing',
                '+15% cache hit rate improvement',
                '40% memory usage reduction',
                'Enhanced analytics and cost tracking',
                'Robust circuit breaker pattern',
                'Quality gates for compression validation',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Upgrade Steps */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Step-by-Step Upgrade</h2>
          </div>

          <div className="space-y-6">
            {upgradeSteps.map((step, i) => (
              <StepCard key={i} number={step.step} title={step.title}>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {step.description}
                </p>

                {step.commands.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {step.commands.map((cmd, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 p-3 rounded-lg bg-neutral-950 text-neutral-100 font-mono text-sm"
                      >
                        <Code2 className="w-4 h-4 text-emerald-400" />
                        <code className="flex-1">{cmd}</code>
                        <EnhancedCopyButton
                          text={cmd}
                          label="Copy command"
                          size="sm"
                          celebration="pulse"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {step.note && (
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {step.note}
                      </span>
                    </div>
                  </div>
                )}
              </StepCard>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Breaking Changes */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">
              Breaking Changes (Naming Only)
            </h2>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 mb-6">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-blue-600 dark:text-blue-400">
                  Good news!
                </strong>{' '}
                All breaking changes are naming updates only. The API is
                identical - just find and replace the old names with new ones.
                No code logic changes required.
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {breakingChanges.map((change, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-xl border transition-all',
                  'bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm',
                  'border-neutral-200/60 dark:border-white/[0.06]',
                  selectedChange === i && 'ring-2 ring-brand-500'
                )}
              >
                <button
                  onClick={() =>
                    setSelectedChange(selectedChange === i ? null : i)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-900/50 rounded-t-xl transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        change.severity === 'low' &&
                          'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                      )}
                    >
                      {change.severity.toUpperCase()}
                    </div>
                    <span className="font-semibold">{change.title}</span>
                    <span className="text-sm text-neutral-500">
                      ({change.category})
                    </span>
                  </div>
                  <ChevronRight
                    className={cn(
                      'w-5 h-5 text-neutral-400 transition-transform',
                      selectedChange === i && 'rotate-90'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {selectedChange === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: durations.normal }}
                      viewport={{ once: true }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-4">
                        {/* Reason */}
                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">
                                Why this changed
                              </div>
                              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                {change.reason}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Impact */}
                        <div>
                          <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Impact
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {change.impact}
                          </div>
                        </div>

                        {/* Code Comparison */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <CodeComparisonBlock
                            title="Before (v2.x)"
                            code={change.oldCode}
                            type="old"
                          />
                          <CodeComparisonBlock
                            title="After (v3.0)"
                            code={change.newCode}
                            type="new"
                          />
                        </div>

                        {/* Migration Steps */}
                        <div>
                          <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Migration Steps
                          </div>
                          <ol className="space-y-2">
                            {change.migration.map((step, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm"
                              >
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 text-xs font-medium flex-shrink-0">
                                  {j + 1}
                                </span>
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  {step}
                                </span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Performance Improvements */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Gauge className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Performance Improvements</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            v3.0 brings massive performance improvements with no code changes
            required. Simply upgrade and benefit from these optimizations.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {performanceImprovements.map((perf, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{perf.title}</h3>
                  <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                    {perf.improvement}
                  </div>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {perf.description}
                </p>

                <div className="flex items-center gap-6 mb-4 text-sm">
                  <div>
                    <div className="text-neutral-500 dark:text-neutral-400 mb-1">
                      Before
                    </div>
                    <div className="font-medium text-red-600 dark:text-red-400">
                      {perf.before}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-emerald-500" />
                  <div>
                    <div className="text-neutral-500 dark:text-neutral-400 mb-1">
                      After
                    </div>
                    <div className="font-medium text-emerald-600 dark:text-emerald-400">
                      {perf.after}
                    </div>
                  </div>
                </div>

                <CollapsibleSection title="Code Example" badge="v3.0">
                  <CodeBlock
                    code={perf.example}
                    filename="performance-example.ts"
                  />
                </CollapsibleSection>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* New Features */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">New Features in v3.0</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Explore these powerful new capabilities after upgrading to v3.0.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {newFeaturesV3.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {feature.description}
                </p>

                <CollapsibleSection title="Example Code" badge="New">
                  <CodeBlock
                    code={feature.example}
                    filename="feature-example.ts"
                  />

                  <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          Benefit:{' '}
                        </strong>
                        {feature.benefit}
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Common Migration Pitfalls */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Common Migration Pitfalls</h2>
          </div>

          <div className="space-y-4">
            {migrationPitfalls.map((pitfall, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{pitfall.pitfall}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        Solution:{' '}
                      </strong>
                      {pitfall.solution}
                    </p>
                    <CodeBlock
                      code={pitfall.example}
                      filename="pitfall-solution.ts"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Compatibility Matrix */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Compatibility Matrix</h2>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <th className="px-4 py-3 text-left font-medium">Feature</th>
                    <th className="px-4 py-3 text-left font-medium">v2.x</th>
                    <th className="px-4 py-3 text-left font-medium">v3.0</th>
                    <th className="px-4 py-3 text-center font-medium">
                      Compatible
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {compatibilityMatrix.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-neutral-200/60 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                    >
                      <td className="px-4 py-3 font-medium">{row.feature}</td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                        {row.v2}
                      </td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                        {row.v3}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {row.compatible ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400">
                        {row.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.2}>
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Migrate?</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              The upgrade from v2.x to v3.0 is straightforward - just rename a
              few imports and enjoy massive performance improvements and new
              features.
            </p>
          </div>

          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Terminal className="w-5 h-5" />,
                  title: 'Quick Start',
                  description:
                    'Follow the 5-step upgrade process for a smooth migration',
                  href: '#upgrade-steps',
                },
                {
                  icon: <BookOpen className="w-5 h-5" />,
                  title: 'API Documentation',
                  description:
                    'Complete reference for all v3.0 APIs and features',
                  href: '/reference/hooks/use-token-budget-tracking',
                },
                {
                  icon: <FileCode className="w-5 h-5" />,
                  title: 'Examples',
                  description: 'See v3.0 features in action with live examples',
                  href: '/examples/token-optimization',
                },
              ].map((item, i) => (
                <ScrollRevealStaggerItem key={i}>
                  <Link
                    href={item.href}
                    className="block p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-brand-500 transition-colors flex items-center gap-2">
                      {item.title}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </Link>
                </ScrollRevealStaggerItem>
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>
    </div>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

interface StepCardProps {
  number: number
  title: string
  children: React.ReactNode
}

function StepCard({ number, title, children }: StepCardProps) {
  return (
    <div className="relative pl-12">
      <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white font-bold text-sm">
        {number}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        {children}
      </div>
    </div>
  )
}

interface CodeBlockProps {
  code: string
  filename: string
}

function CodeBlock({ code, filename }: CodeBlockProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-400">
          <FileCode className="w-4 h-4" />
          <span className="text-sm font-mono">{filename}</span>
        </div>
        <EnhancedCopyButton
          text={code}
          label={`Copy ${filename}`}
          size="sm"
          celebration="pulse"
        />
      </div>
      <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}

interface CodeComparisonBlockProps {
  title: string
  code: string
  type: 'old' | 'new'
}

function CodeComparisonBlock({ title, code, type }: CodeComparisonBlockProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-2 border-b border-neutral-800',
          type === 'old' ? 'bg-red-900/20' : 'bg-emerald-900/20'
        )}
      >
        {type === 'old' ? (
          <XCircle className="w-4 h-4 text-red-400" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        )}
        <span className="text-sm font-medium text-neutral-300">{title}</span>
      </div>
      <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}
