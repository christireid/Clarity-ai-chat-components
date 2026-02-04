'use client'

/**
 * CompressionResult Type - API Reference Documentation
 *
 * Comprehensive reference for the CompressionResult interface returned by
 * LLMLingua compression functions. Includes quality metrics, token counts,
 * and compression analysis.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Code2,
  Copy,
  Check,
  ChevronRight,
  Zap,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Package,
  BarChart3,
  FileText,
  Brain,
  Target,
  Layers,
  Activity,
  PiggyBank,
  Sparkles,
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
// Property Table Component
// ============================================================================

interface PropertyDefinition {
  name: string
  type: string
  description: string
  example?: string
}

function PropertyTable({
  properties,
  title,
}: {
  properties: PropertyDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50 mb-8">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Property
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {properties.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-0',
                'hover:bg-muted/20 transition-colors'
              )}
            >
              <td className="px-4 py-3 font-mono text-xs text-foreground">
                {prop.name}
              </td>
              <td className="px-4 py-3">
                <code className="px-2 py-1 rounded bg-muted/50 text-xs font-mono text-brand-600 dark:text-brand-400">
                  {prop.type}
                </code>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.example && (
                  <div className="mt-2">
                    <code className="px-2 py-1 rounded bg-muted/30 text-xs font-mono">
                      {prop.example}
                    </code>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Feature Card Component
// ============================================================================

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
  color: 'blue' | 'purple' | 'green' | 'amber'
}

function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400',
    purple:
      'from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-600 dark:text-purple-400',
    green:
      'from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800/50 text-green-600 dark:text-green-400',
    amber:
      'from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: durations.moderate }}
      className={cn(
        'p-6 rounded-xl bg-gradient-to-br border',
        colorClasses[color]
      )}
    >
      <Icon className="w-8 h-8 mb-3" />
      <h3 className="font-semibold text-lg mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function CompressionResultTypePage() {
  // Type definition properties
  const coreProperties: PropertyDefinition[] = [
    {
      name: 'original',
      type: 'string',
      description: 'Original uncompressed input text',
      example: '"Your original prompt text here..."',
    },
    {
      name: 'compressed',
      type: 'string',
      description: 'Compressed output text with low-importance tokens removed',
      example: '"Compressed prompt text..."',
    },
    {
      name: 'compressionRatio',
      type: 'number',
      description:
        'Character-level compression ratio (compressed.length / original.length). Lower is better.',
      example: '0.45 (55% compression)',
    },
    {
      name: 'originalTokens',
      type: 'number',
      description: 'Estimated token count in original text',
      example: '1000',
    },
    {
      name: 'compressedTokens',
      type: 'number',
      description: 'Estimated token count in compressed text',
      example: '300',
    },
    {
      name: 'tokenReductionRatio',
      type: 'number',
      description:
        'Token-level reduction ratio (compressedTokens / originalTokens). Lower is better.',
      example: '0.30 (70% reduction)',
    },
  ]

  const qualityProperties: PropertyDefinition[] = [
    {
      name: 'quality.semanticSimilarity',
      type: 'number',
      description:
        'Cosine similarity of term vectors (0-1). Higher means better semantic preservation.',
      example: '0.88',
    },
    {
      name: 'quality.keyTermRetention',
      type: 'number',
      description:
        'Percentage of important terms preserved (0-1). Higher is better.',
      example: '0.92',
    },
    {
      name: 'quality.instructionRetention',
      type: 'number',
      description:
        'Percentage of instruction markers preserved (0-1). Critical for prompt quality.',
      example: '0.95',
    },
    {
      name: 'quality.overallQuality',
      type: 'number',
      description:
        'Weighted average quality score (0-1). Aim for 0.7+ for production use.',
      example: '0.89',
    },
  ]

  const optionalProperties: PropertyDefinition[] = [
    {
      name: 'warning',
      type: 'string | undefined',
      description:
        'Warning message if quality threshold could not be met or recursion limit reached',
      example: '"Quality threshold (0.75) could not be met..."',
    },
    {
      name: 'debug',
      type: 'LLMLinguaDebugInfo | undefined',
      description:
        'Debug information including token scores, processing time, and statistics (only if debug: true)',
    },
  ]

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Code2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-sm text-muted-foreground">
              API Reference / Types
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-foreground">
              CompressionResult
            </h1>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
              50-90% Savings
            </span>
          </div>

          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            Return type for LLMLingua compression functions. Provides
            comprehensive metrics on compression quality, token reduction, and
            cost savings. Essential for validating 2-20x compression results.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/reference/hooks/use-token-optimization"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors text-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              useTokenOptimization Hook
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cookbook/token-optimization/compression-comparison"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors text-sm font-medium"
            >
              <Package className="w-4 h-4" />
              Compression Cookbook
            </Link>
          </div>
        </motion.header>

        {/* Key Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.moderate, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Key Features
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={TrendingDown}
              title="2-20x Compression"
              description="Achieve dramatic token reduction while preserving semantic meaning. Monitor compression ratio and token reduction for cost optimization."
              color="purple"
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Quality Validation"
              description="Built-in quality metrics ensure compressed prompts maintain semantic similarity and instruction fidelity above configurable thresholds."
              color="green"
            />
            <FeatureCard
              icon={BarChart3}
              title="Detailed Analytics"
              description="Track semantic similarity (0.88-0.92), key term retention (0.92+), and instruction preservation for production monitoring."
              color="blue"
            />
            <FeatureCard
              icon={PiggyBank}
              title="Cost Impact Analysis"
              description="Calculate exact token savings and cost reduction. Essential for demonstrating ROI and optimizing AI spending."
              color="amber"
            />
          </div>
        </motion.section>

        {/* Type Definition */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.moderate, delay: 0.15 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Type Definition
          </h2>

          <div className="relative">
            <CodeBlock
              language="typescript"
              code={`interface CompressionResult {
  // Original and compressed content
  original: string
  compressed: string

  // Compression metrics
  compressionRatio: number        // Character-level ratio (0-1, lower = better)
  originalTokens: number          // Token count before compression
  compressedTokens: number        // Token count after compression
  tokenReductionRatio: number     // Token-level ratio (0-1, lower = better)

  // Quality metrics
  quality: {
    semanticSimilarity: number    // 0-1, target: 0.7+
    keyTermRetention: number      // 0-1, target: 0.8+
    instructionRetention: number  // 0-1, target: 0.9+
    overallQuality: number        // 0-1, weighted average
  }

  // Optional fields
  warning?: string                // Quality/recursion warnings
  debug?: LLMLinguaDebugInfo     // Debug info (if enabled)
}`}
              showLineNumbers
            />
            <div className="absolute top-4 right-4">
              <CopyButton
                text={`interface CompressionResult {
  original: string
  compressed: string
  compressionRatio: number
  originalTokens: number
  compressedTokens: number
  tokenReductionRatio: number
  quality: {
    semanticSimilarity: number
    keyTermRetention: number
    instructionRetention: number
    overallQuality: number
  }
  warning?: string
  debug?: LLMLinguaDebugInfo
}`}
              />
            </div>
          </div>
        </motion.section>

        {/* Properties */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.moderate, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Core Properties
          </h2>
          <PropertyTable properties={coreProperties} />

          <h2 className="text-2xl font-bold text-foreground mb-6 mt-12">
            Quality Metrics
          </h2>
          <PropertyTable properties={qualityProperties} />

          <h2 className="text-2xl font-bold text-foreground mb-6 mt-12">
            Optional Properties
          </h2>
          <PropertyTable properties={optionalProperties} />
        </motion.section>

        {/* Quality Threshold Explanation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.moderate, delay: 0.25 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Understanding Quality Thresholds
          </h2>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/50 mb-6">
            <div className="flex items-start gap-3">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  Quality Score Interpretation
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <strong className="text-foreground">0.9+ (Excellent):</strong>{' '}
                    Nearly identical semantic meaning. Safe for all use cases.
                  </div>
                  <div>
                    <strong className="text-foreground">0.7-0.9 (Good):</strong>{' '}
                    High quality with acceptable compression. Recommended for production.
                  </div>
                  <div>
                    <strong className="text-foreground">0.5-0.7 (Fair):</strong>{' '}
                    Moderate quality loss. Review compressed output before use.
                  </div>
                  <div>
                    <strong className="text-foreground">&lt;0.5 (Poor):</strong>{' '}
                    Significant semantic loss. Increase target ratio or disable compression.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                0.88-0.92
              </div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                Semantic Similarity
              </div>
              <div className="text-xs text-green-600/80 dark:text-green-400/80">
                Cosine similarity of term vectors
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                0.92+
              </div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                Key Term Retention
              </div>
              <div className="text-xs text-blue-600/80 dark:text-blue-400/80">
                Important terms preserved
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                0.95+
              </div>
              <div className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                Instruction Retention
              </div>
              <div className="text-xs text-purple-600/80 dark:text-purple-400/80">
                Critical markers preserved
              </div>
            </div>
          </div>
        </motion.section>

        {/* Cost Impact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.moderate, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            <div className="flex items-center gap-3">
              Cost Impact: Validate 2-20x Compression Quality
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                50-90% Savings
              </span>
            </div>
          </h2>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800/50 mb-6">
            <div className="flex items-start gap-3">
              <PiggyBank className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  Calculating Token Savings
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use CompressionResult to validate compression quality and
                  calculate exact cost reduction before production deployment.
                </p>

                <div className="relative">
                  <CodeBlock
                    language="typescript"
                    code={`// Calculate savings from compression result
const result = await compressor.compress(longPrompt, 0.3)

// Token reduction
const tokensReduced = result.originalTokens - result.compressedTokens
const reductionPercent = (1 - result.tokenReductionRatio) * 100

console.log(\`Reduced \${tokensReduced} tokens (\${reductionPercent.toFixed(1)}%)\`)
// "Reduced 700 tokens (70.0%)"

// Cost savings (assuming GPT-4: $0.03/1k input tokens)
const costPerToken = 0.03 / 1000
const costSavings = tokensReduced * costPerToken
const originalCost = result.originalTokens * costPerToken

console.log(\`Cost: $\${originalCost.toFixed(4)} → $\${(originalCost - costSavings).toFixed(4)}\`)
// "Cost: $0.0300 → $0.0090" (70% reduction)

// Quality validation
if (result.quality.overallQuality < 0.7) {
  console.warn('Quality below threshold:', result.warning)
  // Retry with higher target ratio or skip compression
}

// Production monitoring
trackCompressionMetrics({
  tokensReduced,
  reductionPercent,
  costSavings,
  quality: result.quality.overallQuality,
  semanticSimilarity: result.quality.semanticSimilarity,
})`}
                    showLineNumbers
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800/50">
              <Activity className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Real-Time Monitoring
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Track compression metrics in production:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  Average quality score over time
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  Total tokens and cost saved
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  Quality degradation alerts
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  Compression ratio trends
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/50">
              <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Quality Warnings
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Handle quality threshold failures:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  Check result.warning for issues
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  Retry with higher target ratio
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  Fall back to uncompressed text
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  Log for manual review
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Usage Examples */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.moderate, delay: 0.35 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Usage Examples
          </h2>

          <div className="space-y-8">
            {/* Basic Usage */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Basic Compression with Quality Check
              </h3>
              <div className="relative">
                <CodeBlock
                  language="typescript"
                  code={`import { LLMLinguaCompressor } from '@clarity-chat/token-optimization'

const compressor = new LLMLinguaCompressor()

// Compress with 50% target ratio
const result = await compressor.compress(longPrompt, 0.5, {
  preserveCode: true,
  preserveInstructions: true,
  minQuality: 0.7,
})

// Check quality before using compressed text
if (result.quality.overallQuality >= 0.7) {
  console.log('High quality compression achieved!')
  console.log(\`Tokens: \${result.originalTokens} → \${result.compressedTokens}\`)
  console.log(\`Quality: \${result.quality.overallQuality.toFixed(2)}\`)

  // Use compressed prompt
  await sendToLLM(result.compressed)
} else {
  console.warn('Quality below threshold, using original')
  console.warn(result.warning)

  // Fall back to original
  await sendToLLM(result.original)
}`}
                  showLineNumbers
                />
              </div>
            </div>

            {/* Advanced Usage */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Advanced: Production Monitoring
              </h3>
              <div className="relative">
                <CodeBlock
                  language="typescript"
                  code={`import { LLMLinguaCompressor } from '@clarity-chat/token-optimization'
import { trackMetrics } from './analytics'

const compressor = new LLMLinguaCompressor({ debug: true })

async function optimizePrompt(prompt: string) {
  const result = await compressor.compress(prompt, 0.3, {
    preserveCode: true,
    preserveInstructions: true,
    minQuality: 0.75,
  })

  // Track compression metrics
  trackMetrics({
    compressionRatio: result.compressionRatio,
    tokenReduction: 1 - result.tokenReductionRatio,
    quality: result.quality.overallQuality,
    semanticSimilarity: result.quality.semanticSimilarity,
    keyTermRetention: result.quality.keyTermRetention,
    instructionRetention: result.quality.instructionRetention,
  })

  // Check debug info
  if (result.debug) {
    console.log('Processing time:', result.debug.processingTimeMs, 'ms')
    console.log('Tokens kept:', result.debug.stats.keptTokens)
    console.log('Tokens removed:', result.debug.stats.removedTokens)
  }

  // Validate quality thresholds
  const qualityChecks = {
    overallQuality: result.quality.overallQuality >= 0.75,
    semanticSimilarity: result.quality.semanticSimilarity >= 0.80,
    keyTermRetention: result.quality.keyTermRetention >= 0.85,
    instructionRetention: result.quality.instructionRetention >= 0.90,
  }

  const allChecksPassed = Object.values(qualityChecks).every(Boolean)

  if (!allChecksPassed) {
    console.warn('Quality checks failed:', qualityChecks)
    if (result.warning) {
      console.warn('Warning:', result.warning)
    }
    return result.original // Fall back to original
  }

  return result.compressed
}`}
                  showLineNumbers
                />
              </div>
            </div>

            {/* Integration with compressWithLLMLingua */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Quick Helper: compressWithLLMLingua
              </h3>
              <div className="relative">
                <CodeBlock
                  language="typescript"
                  code={`import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

// Simple compression (returns just the compressed string)
const compressed = await compressWithLLMLingua(longPrompt, 0.5)

// For full metrics, use LLMLinguaCompressor directly
import { LLMLinguaCompressor } from '@clarity-chat/token-optimization'

const compressor = new LLMLinguaCompressor()
const result = await compressor.compress(longPrompt, 0.5)

// Now you have access to all metrics
console.log(\`Compression: \${(result.compressionRatio * 100).toFixed(1)}%\`)
console.log(\`Token reduction: \${((1 - result.tokenReductionRatio) * 100).toFixed(1)}%\`)
console.log(\`Quality: \${result.quality.overallQuality.toFixed(2)}\`)`}
                  showLineNumbers
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quality Metrics Interpretation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.moderate, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Quality Metrics Interpretation
          </h2>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800/50">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    Semantic Similarity (0.88-0.92 typical)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Measures how closely the compressed text matches the original
                    meaning using cosine similarity of term vectors.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">0.9+:</strong> Excellent
                        preservation
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">0.8-0.9:</strong> Good
                        semantic match
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">&lt;0.8:</strong> Review
                        required
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20 border border-purple-200 dark:border-purple-800/50">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    Key Term Retention (0.92+ typical)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Percentage of important domain-specific terms that were
                    preserved during compression.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">0.9+:</strong> Most key
                        terms preserved
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">&lt;0.9:</strong> Critical
                        terms may be lost
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800/50">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    Instruction Retention (0.95+ typical)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Percentage of critical instruction markers (must, important,
                    required, etc.) that were kept.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">0.95+:</strong>{' '}
                        Instructions intact
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">&lt;0.95:</strong> Critical
                        - may affect behavior
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Common Patterns */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.moderate, delay: 0.45 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Common Patterns and Best Practices
          </h2>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                Always Validate Quality Thresholds
              </h3>
              <CodeBlock
                language="typescript"
                code={`const result = await compressor.compress(text, 0.3)

// Define your quality requirements
const MIN_OVERALL_QUALITY = 0.75
const MIN_INSTRUCTION_RETENTION = 0.90

if (result.quality.overallQuality < MIN_OVERALL_QUALITY) {
  console.warn(\`Quality \${result.quality.overallQuality} below threshold \${MIN_OVERALL_QUALITY}\`)
  return text // Use original
}

if (result.quality.instructionRetention < MIN_INSTRUCTION_RETENTION) {
  console.warn('Critical instructions lost')
  return text // Use original
}

return result.compressed // Safe to use`}
                showLineNumbers
              />
            </div>

            <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Progressive Compression Strategy
              </h3>
              <CodeBlock
                language="typescript"
                code={`async function compressWithFallback(text: string) {
  // Try aggressive compression first
  let result = await compressor.compress(text, 0.2, { minQuality: 0.75 })

  if (result.quality.overallQuality >= 0.75) {
    return result // 80% compression with good quality
  }

  // Fall back to moderate compression
  result = await compressor.compress(text, 0.5, { minQuality: 0.75 })

  if (result.quality.overallQuality >= 0.75) {
    return result // 50% compression
  }

  // Use original if quality can't be maintained
  return {
    ...result,
    compressed: text,
    compressedTokens: result.originalTokens,
    compressionRatio: 1,
    tokenReductionRatio: 1,
  }
}`}
                showLineNumbers
              />
            </div>

            <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Track Compression Metrics Over Time
              </h3>
              <CodeBlock
                language="typescript"
                code={`interface CompressionMetrics {
  timestamp: Date
  originalTokens: number
  compressedTokens: number
  tokensSaved: number
  quality: number
  costSavings: number
}

const metrics: CompressionMetrics[] = []

async function compressAndTrack(text: string) {
  const result = await compressor.compress(text, 0.3)

  metrics.push({
    timestamp: new Date(),
    originalTokens: result.originalTokens,
    compressedTokens: result.compressedTokens,
    tokensSaved: result.originalTokens - result.compressedTokens,
    quality: result.quality.overallQuality,
    costSavings: (result.originalTokens - result.compressedTokens) * COST_PER_TOKEN,
  })

  // Aggregate metrics
  const totalSaved = metrics.reduce((sum, m) => sum + m.tokensSaved, 0)
  const avgQuality = metrics.reduce((sum, m) => sum + m.quality, 0) / metrics.length
  const totalCostSavings = metrics.reduce((sum, m) => sum + m.costSavings, 0)

  console.log(\`Total tokens saved: \${totalSaved}\`)
  console.log(\`Average quality: \${avgQuality.toFixed(2)}\`)
  console.log(\`Total cost savings: $\${totalCostSavings.toFixed(2)}\`)

  return result
}`}
                showLineNumbers
              />
            </div>
          </div>
        </motion.section>

        {/* Related Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.moderate, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Related Resources
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/reference/hooks/use-token-optimization"
              className="p-6 rounded-xl border border-border/50 hover:border-brand-500/30 hover:bg-muted/20 transition-all group"
            >
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    useTokenOptimization Hook
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    React hook for automatic compression with quality validation
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/cookbook/token-optimization/compression-comparison"
              className="p-6 rounded-xl border border-border/50 hover:border-brand-500/30 hover:bg-muted/20 transition-all group"
            >
              <div className="flex items-start gap-3">
                <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Compression Strategy Comparison
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Compare LLMLingua, Extractive, and Adaptive compression
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/cookbook/achieving-50-percent-reduction"
              className="p-6 rounded-xl border border-border/50 hover:border-brand-500/30 hover:bg-muted/20 transition-all group"
            >
              <div className="flex items-start gap-3">
                <TrendingDown className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Achieving 50% Token Reduction
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Step-by-step guide to production token optimization
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/reference/components/token-optimization"
              className="p-6 rounded-xl border border-border/50 hover:border-brand-500/30 hover:bg-muted/20 transition-all group"
            >
              <div className="flex items-start gap-3">
                <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Token Optimization System
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete guide to token optimization components
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.moderate, delay: 0.55 }}
          className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800/50"
        >
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Production Tip
              </h3>
              <p className="text-sm text-muted-foreground">
                Always validate CompressionResult quality metrics before deploying
                to production. Set minQuality thresholds (0.7-0.8) and implement
                fallback strategies for low-quality compressions. Monitor average
                quality scores and compression ratios to ensure consistent cost
                savings without degrading AI responses.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
