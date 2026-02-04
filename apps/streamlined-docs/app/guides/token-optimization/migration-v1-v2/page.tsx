'use client'

/**
 * Token Optimization Migration Guide (v1 → v2)
 *
 * Comprehensive guide for migrating from v1.x to v2.0 of @clarity-chat/token-optimization
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
} from 'lucide-react'
import Link from 'next/link'

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const breakingChanges = [
  {
    title: 'DynamicCompressionEngine Removed',
    severity: 'high' as const,
    category: 'Compression',
    oldCode: `// ❌ Removed in v2.0
import { DynamicCompressionEngine } from '@clarity-chat/token-optimization'

const engine = new DynamicCompressionEngine({
  targetRatio: 0.5,
  adaptiveThreshold: 0.7
})
const result = engine.compress(text)`,
    newCode: `// ✅ v2.0 - Use LLMLinguaCompressor for real compression
import { LLMLinguaCompressor } from '@clarity-chat/token-optimization'

const compressor = new LLMLinguaCompressor({
  targetRatio: 0.5,
  preserveQuestions: true,
  preserveEntities: true,
})
const result = await compressor.compress(text)

// Or use AdaptiveCompressor (auto-selects best strategy)
import { compressAdaptively } from '@clarity-chat/token-optimization'
const result = await compressAdaptively(text, { targetRatio: 0.5 })`,
    reason: 'Only achieved 10-20% whitespace normalization, not the claimed 70-85% compression.',
    impact: 'High - Breaking change. Update all imports and usage.',
    migration: [
      'Replace DynamicCompressionEngine with LLMLinguaCompressor',
      'Update configuration to match new API',
      'Note: compress() is now async',
      'Test compression results to ensure quality meets requirements',
    ],
  },
  {
    title: 'BasicCompressionEngine Made Internal',
    severity: 'medium' as const,
    category: 'Compression',
    oldCode: `// ❌ No longer exported in v2.0
import { BasicCompressionEngine } from '@clarity-chat/token-optimization'

const engine = new BasicCompressionEngine()
const result = engine.compress(text)`,
    newCode: `// ✅ v2.0 - Use normalizeWhitespace utility
import { normalizeWhitespace } from '@clarity-chat/token-optimization'

const normalized = normalizeWhitespace(text)

// If you need more control:
import { TextNormalizer } from '@clarity-chat/token-optimization'
const normalizer = new TextNormalizer({
  collapseWhitespace: true,
  trimLines: true,
  removeEmptyLines: true,
})
const result = normalizer.normalize(text)`,
    reason: 'Only performs whitespace normalization. Moved to internal utilities.',
    impact: 'Medium - Only affects direct usage of BasicCompressionEngine.',
    migration: [
      'Replace with normalizeWhitespace() function',
      'Or use TextNormalizer class for advanced control',
      'No API key required for normalization',
    ],
  },
  {
    title: 'countTokens() Default Model Changed',
    severity: 'low' as const,
    category: 'Token Counting',
    oldCode: `// v1.x - Defaulted to 'gpt-3.5-turbo'
import { countTokens } from '@clarity-chat/token-optimization'

const count = countTokens(text) // Used gpt-3.5-turbo encoding`,
    newCode: `// ✅ v2.0 - Defaults to 'gpt-4o'
import { countTokens } from '@clarity-chat/token-optimization'

const count = countTokens(text) // Uses gpt-4o encoding (cl100k_base)

// Explicitly specify model for backward compatibility:
const count = countTokens(text, { model: 'gpt-3.5-turbo' })`,
    reason: 'GPT-4o is now the most commonly used model. Better default for modern applications.',
    impact: 'Low - Token counts may differ slightly (~1-2%). Update tests if needed.',
    migration: [
      'Update tests with new token count expectations',
      'Or explicitly specify model: "gpt-3.5-turbo" if needed',
      'Both models use cl100k_base encoding, so differences are minimal',
    ],
  },
  {
    title: 'ModelRouter API Simplified',
    severity: 'medium' as const,
    category: 'Routing',
    oldCode: `// v1.x - Complex initialization
import { ModelRouter } from '@clarity-chat/token-optimization'

const router = new ModelRouter({
  models: [
    { id: 'gpt-4o', tier: 'premium', cost: 0.01 },
    { id: 'gpt-4o-mini', tier: 'standard', cost: 0.002 },
  ],
  strategy: 'cost-optimized',
  complexityWeights: {
    length: 0.3,
    vocabulary: 0.3,
    structure: 0.4,
  },
})`,
    newCode: `// ✅ v2.0 - Simplified builder pattern
import { ModelRouter } from '@clarity-chat/token-optimization'

// Quick start with defaults
const router = ModelRouter.default()

// Or customize with builder
const router = ModelRouter.builder()
  .useOpenAIModels()
  .useClaudeModels()
  .withStrategy('cost-optimized')
  .build()

// Advanced: Custom models still supported
const router = ModelRouter.builder()
  .addModel({ id: 'custom-model', tier: 'standard', cost: 0.001 })
  .withStrategy('balanced')
  .build()`,
    reason: 'Simplified API with sensible defaults. Builder pattern for customization.',
    impact: 'Medium - Update initialization code.',
    migration: [
      'Use ModelRouter.default() for quick setup',
      'Use ModelRouter.builder() for customization',
      'Remove manual model configuration unless needed',
    ],
  },
  {
    title: 'TieredCache Constructor Changed',
    severity: 'low' as const,
    category: 'Caching',
    oldCode: `// v1.x - Positional parameters
import { TieredCache } from '@clarity-chat/token-optimization'

const cache = new TieredCache(1000, 3600000, true)`,
    newCode: `// ✅ v2.0 - Named configuration object
import { TieredCache } from '@clarity-chat/token-optimization'

const cache = new TieredCache({
  maxSize: 1000,
  ttl: 3600000,
  enableSemanticSearch: true,
})

// Or use defaults
const cache = TieredCache.create()`,
    reason: 'Named parameters are clearer and more maintainable.',
    impact: 'Low - Simple parameter reordering.',
    migration: [
      'Convert positional parameters to object',
      'Or use TieredCache.create() with defaults',
    ],
  },
]

const deprecatedAPIs = [
  {
    api: 'ProviderCachingManager',
    status: 'Deprecated in v1.5, removed in v2.0',
    replacement: 'ProviderCachingFormatter',
    example: `// ❌ Removed
import { ProviderCachingManager } from '@clarity-chat/token-optimization'

// ✅ Use ProviderCachingFormatter
import { ProviderCachingFormatter } from '@clarity-chat/token-optimization'

const formatter = new ProviderCachingFormatter({ provider: 'anthropic' })
const result = await formatter.format(messages)`,
  },
  {
    api: 'estimateTokens()',
    status: 'Deprecated in v1.8, removed in v2.0',
    replacement: 'countTokens()',
    example: `// ❌ Removed
import { estimateTokens } from '@clarity-chat/token-optimization'

// ✅ Use countTokens
import { countTokens } from '@clarity-chat/token-optimization'
const count = countTokens(text)`,
  },
  {
    api: 'QualityValidator.validate()',
    status: 'Deprecated in v1.7, removed in v2.0',
    replacement: 'QualityGate.check()',
    example: `// ❌ Removed
import { QualityValidator } from '@clarity-chat/token-optimization'

// ✅ Use QualityGate
import { QualityGate } from '@clarity-chat/token-optimization'
const gate = new QualityGate({ minQuality: 0.8 })
await gate.check(compressed, original)`,
  },
]

const newFeatures = [
  {
    title: 'Provider-Native Token Counting',
    icon: <Zap className="w-5 h-5" />,
    description: '100% accurate counting via Anthropic and Gemini APIs',
    example: `import { ProviderNativeCounter } from '@clarity-chat/token-optimization'

// 100% accurate counting via Anthropic API (free)
const counter = new ProviderNativeCounter({
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const result = await counter.count('Your message here')
console.log(\`\${result.tokens} tokens (100% accurate!)\`)`,
    benefit: 'Exact token counts from the source. No more estimation errors.',
  },
  {
    title: 'Unified Cache API',
    icon: <RefreshCw className="w-5 h-5" />,
    description: 'Single API for exact match, semantic, and provider caching',
    example: `import { CacheManager } from '@clarity-chat/token-optimization'

const cache = CacheManager.create({
  exactMatch: { enabled: true, maxSize: 1000 },
  semantic: { enabled: true, threshold: 0.85 },
  provider: { enabled: true, provider: 'anthropic' },
})

// Check all cache layers automatically
const result = await cache.get(prompt)
if (result.hit) {
  console.log(\`Cache hit! Source: \${result.source}\`)
}`,
    benefit: 'Simplified caching with automatic fallback between layers.',
  },
  {
    title: 'Cost Tracking Dashboard',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Real-time cost analytics with savings visualization',
    example: `import { CostTracker } from '@clarity-chat/token-optimization'

const tracker = new CostTracker('gpt-4o')

// Track requests
tracker.trackRequest({
  inputTokens: 5000,
  outputTokens: 1000,
  cachedInputTokens: 4000,
})

// Get detailed report
const report = tracker.getReport()
console.log(\`Total saved: $\${report.cumulative.totalSavings}\`)
console.log(\`Cache hit rate: \${report.cache.hitRate}%\`)`,
    benefit: 'Understand actual savings and optimize caching strategy.',
  },
  {
    title: 'Security Enhancements',
    icon: <ShieldCheck className="w-5 h-5" />,
    description: 'OWASP LLM Top 10 compliance with prompt injection detection',
    example: `import { SecurityValidator } from '@clarity-chat/token-optimization'

const validator = new SecurityValidator({
  detectPromptInjection: true,
  detectPII: true,
  maxTokens: 10000,
})

const result = await validator.validate(userInput)
if (!result.safe) {
  console.error(\`Security issue: \${result.violations[0].message}\`)
}`,
    benefit: 'Production-grade security built-in.',
  },
]

const upgradeSteps = [
  {
    step: 1,
    title: 'Update Package Version',
    description: 'Upgrade to v2.0 and update peer dependencies',
    commands: [
      'npm install @clarity-chat/token-optimization@^2.0.0',
      'npm update react react-dom',
    ],
    note: 'Requires React 18+ and Node.js 18+',
  },
  {
    step: 2,
    title: 'Run Migration Assistant',
    description: 'Automatically detect deprecated API usage',
    commands: [
      'npx @clarity-chat/token-optimization migrate',
      'npx @clarity-chat/token-optimization migrate --fix',
    ],
    note: 'Review changes before committing. Use --fix cautiously.',
  },
  {
    step: 3,
    title: 'Update Breaking Changes',
    description: 'Manually fix breaking changes identified in step 2',
    commands: [],
    note: 'See "Breaking Changes" section below for detailed migration examples.',
  },
  {
    step: 4,
    title: 'Update Tests',
    description: 'Token counts may differ slightly due to model changes',
    commands: [
      'npm test -- --updateSnapshot',
    ],
    note: 'Review snapshot changes. Count differences of 1-2% are expected.',
  },
  {
    step: 5,
    title: 'Test Thoroughly',
    description: 'Run full test suite and manual QA',
    commands: [
      'npm test',
      'npm run build',
    ],
    note: 'Pay special attention to compression and caching behavior.',
  },
]

const compatibilityTable = [
  {
    feature: 'Token Counting',
    v1: 'gpt-tokenizer (99%+ accurate)',
    v2: 'Provider APIs + gpt-tokenizer (100% accurate)',
    compatible: true,
  },
  {
    feature: 'Compression',
    v1: 'LLMLingua, Extractive',
    v2: 'LLMLingua, Extractive, Adaptive',
    compatible: true,
  },
  {
    feature: 'Caching',
    v1: 'Exact match, Semantic',
    v2: 'Unified (Exact + Semantic + Provider)',
    compatible: true,
  },
  {
    feature: 'Model Routing',
    v1: 'Manual configuration',
    v2: 'Builder pattern + defaults',
    compatible: false,
  },
  {
    feature: 'DynamicCompressionEngine',
    v1: 'Available',
    v2: 'Removed',
    compatible: false,
  },
]

export default function MigrationV1V2Page() {
  const [selectedChange, setSelectedChange] = useState<number | null>(null)

  return (
    <div className="container-docs py-8 sm:py-12">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 rounded-full mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Migration Guide: v1.x → v2.0
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Token Optimization v2.0 Migration
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8">
            Comprehensive guide for upgrading from v1.x to v2.0 of @clarity-chat/token-optimization.
            Learn about breaking changes, deprecated APIs, new features, and step-by-step migration instructions.
          </p>

          {/* Quick Stats */}
          <div className="inline-flex items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">5</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Breaking Changes</div>
            </div>
            <div className="h-12 w-px bg-blue-200 dark:bg-blue-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">3</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Deprecated APIs</div>
            </div>
            <div className="h-12 w-px bg-blue-200 dark:bg-blue-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">4</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">New Features</div>
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
              <h2 className="text-xl font-bold">What's New in v2.0</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Provider-native token counting (100% accurate)',
                'Unified cache API (exact + semantic + provider)',
                'Real-time cost tracking dashboard',
                'Enhanced security (OWASP LLM Top 10)',
                'Improved compression strategies',
                'Builder pattern for model routing',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{item}</span>
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
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Breaking Changes</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            These changes require code updates. Use the migration assistant or update manually
            following the examples below.
          </p>

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
                  onClick={() => setSelectedChange(selectedChange === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-900/50 rounded-t-xl transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        change.severity === 'high' &&
                          'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400',
                        change.severity === 'medium' &&
                          'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
                        change.severity === 'low' &&
                          'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                      )}
                    >
                      {change.severity.toUpperCase()}
                    </div>
                    <span className="font-semibold">{change.title}</span>
                    <span className="text-sm text-neutral-500">({change.category})</span>
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
                            title="Before (v1.x)"
                            code={change.oldCode}
                            type="old"
                          />
                          <CodeComparisonBlock
                            title="After (v2.0)"
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
                              <li key={j} className="flex items-start gap-2 text-sm">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 text-xs font-medium flex-shrink-0">
                                  {j + 1}
                                </span>
                                <span className="text-neutral-600 dark:text-neutral-400">{step}</span>
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

      {/* Deprecated APIs */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Deprecated APIs Removed</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            These APIs were deprecated in v1.x and have been removed in v2.0. If you missed the
            deprecation warnings, update your code with the replacements below.
          </p>

          <div className="space-y-4">
            {deprecatedAPIs.map((api, i) => (
              <CollapsibleSection key={i} title={api.api} badge={api.status}>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Use instead: <code className="text-brand-500">{api.replacement}</code>
                      </div>
                    </div>
                  </div>

                  <CodeBlock code={api.example} filename="migration-example.ts" />
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* New Features */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">New Features in v2.0</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Take advantage of these new capabilities after migrating to v2.0.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {newFeatures.map((feature, i) => (
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
                  <CodeBlock code={feature.example} filename="feature-example.ts" />

                  <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        <strong className="text-emerald-600 dark:text-emerald-400">Benefit: </strong>
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

      {/* Compatibility Matrix */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
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
                    <th className="px-4 py-3 text-left font-medium">v1.x</th>
                    <th className="px-4 py-3 text-left font-medium">v2.0</th>
                    <th className="px-4 py-3 text-center font-medium">Compatible</th>
                  </tr>
                </thead>
                <tbody>
                  {compatibilityTable.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-neutral-200/60 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                    >
                      <td className="px-4 py-3 font-medium">{row.feature}</td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{row.v1}</td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{row.v2}</td>
                      <td className="px-4 py-3 text-center">
                        {row.compatible ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                        )}
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
              Follow the upgrade steps above, and explore the new v2.0 features to optimize
              your token usage even further.
            </p>
          </div>

          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Terminal className="w-5 h-5" />,
                  title: 'Migration Assistant',
                  description: 'Automated tool to detect and fix deprecated API usage',
                  href: '#upgrade-steps',
                },
                {
                  icon: <BookOpen className="w-5 h-5" />,
                  title: 'API Documentation',
                  description: 'Complete reference for all v2.0 APIs and features',
                  href: '/api/token-optimization',
                },
                {
                  icon: <FileCode className="w-5 h-5" />,
                  title: 'Changelog',
                  description: 'Detailed list of all changes in v2.0',
                  href: 'https://github.com/clarity-chat/token-optimization/blob/main/CHANGELOG.md',
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
        <EnhancedCopyButton text={code} label={`Copy ${filename}`} size="sm" celebration="pulse" />
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
          type === 'old'
            ? 'bg-red-900/20'
            : 'bg-emerald-900/20'
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
