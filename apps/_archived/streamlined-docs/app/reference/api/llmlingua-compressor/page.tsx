'use client'

import { useState } from 'react'
import { CodeBlock } from '@/components/CodeBlock'
import { ScrollReveal } from '@/components/Enhanced/ScrollReveal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import {
  Zap,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  BarChart3,
  Settings,
  Activity,
  Shield,
  Layers,
  Code,
  FileText,
  Gauge,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import Link from 'next/link'

export default function LLMLinguaCompressorPage() {
  const [selectedRatio, setSelectedRatio] = useState<number>(0.5)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 rounded-full mb-6">
            <Zap className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Token Optimization
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">LLMLinguaCompressor</h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Statistical token-level compression achieving 50-70% token reduction while maintaining
            semantic quality. Based on the{' '}
            <a
              href="https://arxiv.org/abs/2310.05736"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              LLMLingua research paper
            </a>
            .
          </p>

          {/* Token Reduction Badge */}
          <div className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg">
            <TrendingDown className="w-5 h-5" />
            <span className="font-semibold">Achieve 50-70% token reduction with maintained quality</span>
          </div>
        </div>
      </ScrollReveal>

      {/* Compression Ratio Selector */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="mb-16 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">Target Compression Ratio</label>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round((1 - selectedRatio) * 100)}% reduction
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={selectedRatio}
              onChange={(e) => setSelectedRatio(parseFloat(e.target.value))}
              className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              <span>Aggressive (10%)</span>
              <span>Moderate (50%)</span>
              <span>Conservative (90%)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Keep Tokens</div>
              <div className="text-2xl font-bold">{Math.round(selectedRatio * 100)}%</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Example: 1000 → </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(1000 * selectedRatio)}
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Tokens Saved</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(1000 * (1 - selectedRatio))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Overview */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Overview</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
              LLMLinguaCompressor uses statistical analysis to identify and remove low-importance
              tokens while preserving semantic meaning. It achieves compression through TF-IDF
              scoring, position-aware preservation, and intelligent token selection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500 text-white mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">High Compression</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                2-20x compression ratios while maintaining 70-90% semantic quality.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500 text-white mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Preservation</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                TF-IDF scoring and position weighting preserve critical information.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500 text-white mb-4">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Highly Configurable</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Preserve code blocks, instructions, specific words, and control quality thresholds.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Quick Start */}
      <ScrollReveal direction="up" delay={0.25}>
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Quick Start</h2>

          <div className="mb-8 bg-blue-500/10 border border-blue-500/30 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Recommended Starting Point
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Start with a target ratio of 0.5 (50% token retention) for a balance between
                  compression and quality. Adjust based on your quality requirements.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Installation</h3>
          <CodeBlock language="bash">
            {`npm install @clarity-chat/token-optimization
# or
pnpm add @clarity-chat/token-optimization
# or
yarn add @clarity-chat/token-optimization`}
          </CodeBlock>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Basic Usage</h3>
          <CodeBlock language="typescript">
            {`import { LLMLinguaCompressor } from '@clarity-chat/token-optimization/compression'

// Create a compressor instance
const compressor = new LLMLinguaCompressor()

// Compress text to 50% of original tokens
const result = await compressor.compress(text, 0.5)

console.log('Original tokens:', result.originalTokens)
console.log('Compressed tokens:', result.compressedTokens)
console.log('Compression ratio:', result.compressionRatio)
console.log('Quality score:', result.quality.overallQuality)
console.log('Compressed text:', result.compressed)`}
          </CodeBlock>

          <h3 className="text-2xl font-semibold mb-4 mt-8">With Configuration</h3>
          <CodeBlock language="typescript">
            {`import { LLMLinguaCompressor } from '@clarity-chat/token-optimization/compression'

const compressor = new LLMLinguaCompressor({
  preserveCode: true,           // Keep code blocks intact
  preserveInstructions: true,   // Preserve instruction markers
  minQuality: 0.7,              // Minimum acceptable quality
  preserveFirst: 10,            // Always keep first 10 tokens
  preserveLast: 5,              // Always keep last 5 tokens
})

// Compress to 30% (70% reduction)
const result = await compressor.compress(text, 0.3, {
  preserveWords: ['important', 'critical', 'must'],
  debug: true,  // Get detailed compression analysis
})`}
          </CodeBlock>
        </section>
      </ScrollReveal>

      {/* Complete API Reference */}
      <ScrollReveal direction="up" delay={0.3}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-8 h-8 text-purple-500" />
            <h2 className="text-3xl font-bold">Complete API Reference</h2>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Constructor</h3>
          <CodeBlock language="typescript">
            {`new LLMLinguaCompressor(defaultOptions?: Partial<LLMLinguaOptions>)`}
          </CodeBlock>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-200 dark:border-neutral-800">
                  <th className="text-left p-4 font-semibold">Option</th>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-left p-4 font-semibold">Default</th>
                  <th className="text-left p-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4 font-mono text-sm">preserveFirst</td>
                  <td className="p-4 text-sm">number</td>
                  <td className="p-4 text-sm">10</td>
                  <td className="p-4 text-sm">Number of tokens to preserve at the start</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4 font-mono text-sm">preserveLast</td>
                  <td className="p-4 text-sm">number</td>
                  <td className="p-4 text-sm">5</td>
                  <td className="p-4 text-sm">Number of tokens to preserve at the end</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4 font-mono text-sm">preserveInstructions</td>
                  <td className="p-4 text-sm">boolean</td>
                  <td className="p-4 text-sm">true</td>
                  <td className="p-4 text-sm">Preserve instruction markers like &quot;must&quot;, &quot;important&quot;</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4 font-mono text-sm">preserveCode</td>
                  <td className="p-4 text-sm">boolean</td>
                  <td className="p-4 text-sm">true</td>
                  <td className="p-4 text-sm">Keep code blocks intact</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4 font-mono text-sm">minQuality</td>
                  <td className="p-4 text-sm">number</td>
                  <td className="p-4 text-sm">0.7</td>
                  <td className="p-4 text-sm">Minimum quality threshold (0-1)</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4 font-mono text-sm">additionalStopWords</td>
                  <td className="p-4 text-sm">string[]</td>
                  <td className="p-4 text-sm">[]</td>
                  <td className="p-4 text-sm">Custom stop words to always remove</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4 font-mono text-sm">preserveWords</td>
                  <td className="p-4 text-sm">string[]</td>
                  <td className="p-4 text-sm">[]</td>
                  <td className="p-4 text-sm">Words to always preserve</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4 font-mono text-sm">maxRecursionDepth</td>
                  <td className="p-4 text-sm">number</td>
                  <td className="p-4 text-sm">5</td>
                  <td className="p-4 text-sm">Maximum retries for quality threshold (0-20)</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4 font-mono text-sm">debug</td>
                  <td className="p-4 text-sm">boolean</td>
                  <td className="p-4 text-sm">false</td>
                  <td className="p-4 text-sm">Enable detailed debug information</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-semibold mb-4 mt-8">compress() Method</h3>
          <CodeBlock language="typescript">
            {`async compress(
  text: string,
  targetRatio: number,
  options?: LLMLinguaOptions
): Promise<LLMLinguaResult>`}
          </CodeBlock>

          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <h4 className="font-semibold mb-2">Parameters</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <code className="text-purple-600 dark:text-purple-400">text</code>: Input text to
                  compress
                </li>
                <li>
                  <code className="text-purple-600 dark:text-purple-400">targetRatio</code>: Target
                  compression ratio (0.1-1.0). 0.5 = keep 50% = 2x compression
                </li>
                <li>
                  <code className="text-purple-600 dark:text-purple-400">options</code>: Optional
                  per-compression settings that override defaults
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <h4 className="font-semibold mb-2">Returns: LLMLinguaResult</h4>
              <CodeBlock language="typescript">
                {`interface LLMLinguaResult {
  original: string                    // Original input text
  compressed: string                  // Compressed output text
  compressionRatio: number            // compressed.length / original.length
  originalTokens: number              // Estimated tokens in original
  compressedTokens: number            // Estimated tokens in compressed
  tokenReductionRatio: number         // compressedTokens / originalTokens
  quality: LLMLinguaQualityMetrics    // Quality metrics
  warning?: string                    // Warning if quality threshold not met
  debug?: LLMLinguaDebugInfo          // Debug info if enabled
}`}
              </CodeBlock>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Compression Ratio Configuration */}
      <ScrollReveal direction="up" delay={0.35}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Gauge className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold">Compression Ratio Configuration</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            The target ratio determines how aggressively to compress. Lower values = more aggressive
            compression, but may reduce quality.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-lg">Conservative (0.7-0.9)</h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Minimal compression, highest quality. Use for critical content where accuracy is
                paramount.
              </p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Compression:</span>
                  <span className="font-semibold">1.1-1.4x</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <span className="font-semibold text-emerald-600">90-95%</span>
                </div>
                <div className="flex justify-between">
                  <span>Use case:</span>
                  <span className="font-semibold">Legal, technical docs</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Balanced (0.4-0.6)</h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Recommended for most use cases. Good balance between compression and quality.
              </p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Compression:</span>
                  <span className="font-semibold">1.7-2.5x</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <span className="font-semibold text-blue-600">75-85%</span>
                </div>
                <div className="flex justify-between">
                  <span>Use case:</span>
                  <span className="font-semibold">Chat, content summaries</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-lg">Aggressive (0.2-0.3)</h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                High compression for verbose content. May lose some nuance but preserves core
                meaning.
              </p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Compression:</span>
                  <span className="font-semibold">3.3-5x</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <span className="font-semibold text-purple-600">65-75%</span>
                </div>
                <div className="flex justify-between">
                  <span>Use case:</span>
                  <span className="font-semibold">Long articles, blogs</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800/50">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-pink-600" />
                <h3 className="font-semibold text-lg">Maximum (0.1-0.2)</h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Extreme compression for very long content. Extract only the most critical
                information.
              </p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Compression:</span>
                  <span className="font-semibold">5-10x</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <span className="font-semibold text-pink-600">60-70%</span>
                </div>
                <div className="flex justify-between">
                  <span>Use case:</span>
                  <span className="font-semibold">Indexing, search</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Adaptive Quality Adjustment</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            LLMLinguaCompressor automatically retries with a higher ratio if the quality threshold
            is not met:
          </p>
          <CodeBlock language="typescript">
            {`const compressor = new LLMLinguaCompressor({
  minQuality: 0.8,           // Require 80% quality
  maxRecursionDepth: 5,      // Up to 5 retries
})

// If quality < 0.8, automatically increases ratio by 0.1 and retries
const result = await compressor.compress(text, 0.3)

// Check if quality threshold was met
if (result.warning) {
  console.warn(result.warning)
  console.log('Actual quality:', result.quality.overallQuality)
}`}
          </CodeBlock>
        </section>
      </ScrollReveal>

      {/* Quality Metrics */}
      <ScrollReveal direction="up" delay={0.4}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-emerald-500" />
            <h2 className="text-3xl font-bold">Quality Retention Metrics</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            LLMLinguaCompressor tracks multiple quality metrics to ensure semantic preservation:
          </p>

          <CodeBlock language="typescript">
            {`interface LLMLinguaQualityMetrics {
  semanticSimilarity: number      // Cosine similarity of term vectors (0-1)
  keyTermRetention: number        // Percentage of key terms preserved (0-1)
  instructionRetention: number    // Percentage of instruction markers preserved (0-1)
  overallQuality: number          // Weighted average quality score (0-1)
}`}
          </CodeBlock>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Semantic Similarity
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Measures how similar the compressed text is to the original using term vector
                analysis.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm">
                    <strong>0.85-1.0:</strong> Excellent preservation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm">
                    <strong>0.70-0.85:</strong> Good preservation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm">
                    <strong>0.60-0.70:</strong> Acceptable with loss
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Key Term Retention
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Percentage of important terms (high TF-IDF scores) that were preserved in the
                output.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm">
                    <strong>0.90-1.0:</strong> Almost all key terms kept
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm">
                    <strong>0.75-0.90:</strong> Most key terms kept
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm">
                    <strong>0.60-0.75:</strong> Core terms kept
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-semibold mb-3">Overall Quality Calculation</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              The overall quality score is a weighted average:
            </p>
            <CodeBlock language="typescript">
              {`overallQuality =
  semanticSimilarity * 0.4 +
  keyTermRetention * 0.4 +
  instructionRetention * 0.2`}
            </CodeBlock>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
              This weighting prioritizes semantic preservation and key term retention while giving
              moderate weight to instruction markers.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Performance Characteristics */}
      <ScrollReveal direction="up" delay={0.45}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-orange-500" />
            <h2 className="text-3xl font-bold">Performance Characteristics</h2>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-200 dark:border-neutral-800">
                  <th className="text-left p-4 font-semibold">Input Size</th>
                  <th className="text-left p-4 font-semibold">Processing Time</th>
                  <th className="text-left p-4 font-semibold">Memory Usage</th>
                  <th className="text-left p-4 font-semibold">Throughput</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Small (&lt;500 tokens)</td>
                  <td className="p-4 text-emerald-600 font-semibold">&lt;10ms</td>
                  <td className="p-4">&lt;1 MB</td>
                  <td className="p-4 text-emerald-600">Very Fast</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Medium (500-2000 tokens)</td>
                  <td className="p-4 text-emerald-600 font-semibold">10-50ms</td>
                  <td className="p-4">1-5 MB</td>
                  <td className="p-4 text-emerald-600">Fast</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Large (2000-8000 tokens)</td>
                  <td className="p-4">50-200ms</td>
                  <td className="p-4">5-20 MB</td>
                  <td className="p-4">Good</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Very Large (&gt;8000 tokens)</td>
                  <td className="p-4">200-1000ms</td>
                  <td className="p-4">20-100 MB</td>
                  <td className="p-4">Acceptable</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Optimizations
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>Single-pass tokenization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>Efficient TF-IDF calculation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>Code block extraction caching</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>No external API calls</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Best Practices
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Reuse compressor instances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Batch compress similar content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Cache results when possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Use appropriate target ratios</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Use Case Recommendations */}
      <ScrollReveal direction="up" delay={0.5}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-8 h-8 text-indigo-500" />
            <h2 className="text-3xl font-bold">Use Case Recommendations</h2>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Long-Form Content</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    Ideal for compressing blog posts, articles, and documentation before sending to
                    LLMs.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold mb-1">Target Ratio</div>
                      <div className="text-emerald-600">0.3-0.5</div>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Expected Quality</div>
                      <div className="text-emerald-600">70-80%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
              <div className="flex items-start gap-4">
                <Activity className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Chat History Compression</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    Compress older messages in long conversations to maintain context within token
                    limits.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold mb-1">Target Ratio</div>
                      <div className="text-blue-600">0.4-0.6</div>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Expected Quality</div>
                      <div className="text-blue-600">75-85%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
              <div className="flex items-start gap-4">
                <Code className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Mixed Code and Text</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    Perfect for technical documentation with code examples. Code blocks are
                    preserved.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold mb-1">Target Ratio</div>
                      <div className="text-purple-600">0.5-0.7</div>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Expected Quality</div>
                      <div className="text-purple-600">80-90%</div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-purple-100/50 dark:bg-purple-900/20 rounded text-xs">
                    <strong>Tip:</strong> Enable <code>preserveCode: true</code> to keep code
                    blocks intact
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/50">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Instruction-Heavy Content</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    Great for compressing prompts while preserving important instructions and
                    constraints.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold mb-1">Target Ratio</div>
                      <div className="text-amber-600">0.6-0.8</div>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Expected Quality</div>
                      <div className="text-amber-600">85-95%</div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-amber-100/50 dark:bg-amber-900/20 rounded text-xs">
                    <strong>Tip:</strong> Enable <code>preserveInstructions: true</code> to keep
                    &quot;must&quot;, &quot;important&quot;, etc.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Comparison with Other Compressors */}
      <ScrollReveal direction="up" delay={0.55}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold">Comparison with Other Compressors</h2>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-200 dark:border-neutral-800">
                  <th className="text-left p-4 font-semibold">Strategy</th>
                  <th className="text-left p-4 font-semibold">Compression</th>
                  <th className="text-left p-4 font-semibold">Quality</th>
                  <th className="text-left p-4 font-semibold">Speed</th>
                  <th className="text-left p-4 font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-purple-50/30 dark:bg-purple-950/10">
                  <td className="p-4 font-semibold">LLMLingua</td>
                  <td className="p-4 text-purple-600 font-semibold">2-20x</td>
                  <td className="p-4 text-purple-600 font-semibold">70-90%</td>
                  <td className="p-4">Fast</td>
                  <td className="p-4">Prose, aggressive compression</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Extractive</td>
                  <td className="p-4">2-5x</td>
                  <td className="p-4">80-95%</td>
                  <td className="p-4 text-emerald-600">Very Fast</td>
                  <td className="p-4">Structured documents</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Adaptive</td>
                  <td className="p-4">Auto-select</td>
                  <td className="p-4">Varies</td>
                  <td className="p-4">Medium</td>
                  <td className="p-4">Mixed content</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Minimal</td>
                  <td className="p-4">1.1-1.2x</td>
                  <td className="p-4">99%</td>
                  <td className="p-4 text-emerald-600">Very Fast</td>
                  <td className="p-4">Code, structured data</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                When to Use LLMLingua
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Need high compression ratios (50%+ reduction)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Working with prose or natural language</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Can tolerate 10-30% quality loss</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Have verbose, redundant content</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                When to Use Alternatives
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">!</span>
                  <span>
                    <strong>Extractive:</strong> Structured docs, need sentence coherence
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">!</span>
                  <span>
                    <strong>Adaptive:</strong> Unsure about content type, want auto-selection
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">!</span>
                  <span>
                    <strong>Minimal:</strong> Code/data, need 99%+ quality preservation
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Production Deployment */}
      <ScrollReveal direction="up" delay={0.6}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-orange-500" />
            <h2 className="text-3xl font-bold">Production Deployment</h2>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Server-Side Compression</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Recommended approach: Compress on the server before sending to LLM providers.
          </p>
          <CodeBlock language="typescript">
            {`// app/api/chat/route.ts
import { LLMLinguaCompressor } from '@clarity-chat/token-optimization/compression'
import { Anthropic } from '@anthropic-ai/sdk'

const compressor = new LLMLinguaCompressor({
  preserveCode: true,
  preserveInstructions: true,
  minQuality: 0.7,
})

export async function POST(request: Request) {
  const { messages } = await request.json()

  // Compress conversation history (keep recent messages uncompressed)
  const compressedMessages = await Promise.all(
    messages.map(async (msg: any, index: number) => {
      // Keep last 3 messages uncompressed
      if (index >= messages.length - 3) {
        return msg
      }

      // Compress older messages
      const result = await compressor.compress(msg.content, 0.5)
      return {
        ...msg,
        content: result.compressed,
      }
    })
  )

  const anthropic = new Anthropic()
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: compressedMessages,
  })

  return Response.json(response)
}`}
          </CodeBlock>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Error Handling</h3>
          <CodeBlock language="typescript">
            {`import { LLMLinguaCompressor } from '@clarity-chat/token-optimization/compression'

const compressor = new LLMLinguaCompressor()

try {
  const result = await compressor.compress(text, 0.5)

  // Check for quality warnings
  if (result.warning) {
    console.warn('Compression quality warning:', result.warning)
    // Log to monitoring service
    analytics.track('compression_quality_warning', {
      targetRatio: 0.5,
      actualQuality: result.quality.overallQuality,
    })
  }

  // Use compressed text
  const llmResponse = await sendToLLM(result.compressed)

} catch (error) {
  console.error('Compression failed:', error)
  // Fallback to uncompressed
  const llmResponse = await sendToLLM(text)
}`}
          </CodeBlock>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Monitoring and Metrics</h3>
          <CodeBlock language="typescript">
            {`import { LLMLinguaCompressor } from '@clarity-chat/token-optimization/compression'

const compressor = new LLMLinguaCompressor({
  debug: true,  // Enable detailed metrics
})

const result = await compressor.compress(text, 0.5)

// Track compression metrics
analytics.track('compression_applied', {
  originalTokens: result.originalTokens,
  compressedTokens: result.compressedTokens,
  tokensSaved: result.originalTokens - result.compressedTokens,
  compressionRatio: result.compressionRatio,
  quality: result.quality.overallQuality,
  processingTime: result.debug?.processingTimeMs,
})

// Calculate cost savings (example pricing)
const costPerToken = 0.003 / 1000  // $0.003 per 1K tokens
const tokensSaved = result.originalTokens - result.compressedTokens
const costSavings = tokensSaved * costPerToken

console.log(\`Saved \${tokensSaved} tokens = $\${costSavings.toFixed(4)}\`)`}
          </CodeBlock>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Caching Compressed Results</h3>
          <CodeBlock language="typescript">
            {`import { LLMLinguaCompressor } from '@clarity-chat/token-optimization/compression'
import { createHash } from 'crypto'

const compressor = new LLMLinguaCompressor()
const compressionCache = new Map<string, string>()

async function compressWithCache(text: string, ratio: number): Promise<string> {
  // Create cache key
  const hash = createHash('sha256')
    .update(text + ratio.toString())
    .digest('hex')

  // Check cache
  if (compressionCache.has(hash)) {
    return compressionCache.get(hash)!
  }

  // Compress
  const result = await compressor.compress(text, ratio)

  // Cache result
  compressionCache.set(hash, result.compressed)

  // Optional: Implement cache eviction strategy
  if (compressionCache.size > 1000) {
    const firstKey = compressionCache.keys().next().value
    compressionCache.delete(firstKey)
  }

  return result.compressed
}`}
          </CodeBlock>
        </section>
      </ScrollReveal>

      {/* Advanced Examples */}
      <ScrollReveal direction="up" delay={0.65}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-8 h-8 text-indigo-500" />
            <h2 className="text-3xl font-bold">Advanced Examples</h2>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Progressive Compression</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Compress older messages more aggressively than recent ones:
          </p>
          <CodeBlock language="typescript">
            {`import { LLMLinguaCompressor } from '@clarity-chat/token-optimization/compression'

const compressor = new LLMLinguaCompressor()

async function compressConversation(messages: Message[]) {
  return Promise.all(
    messages.map(async (msg, index) => {
      const age = messages.length - index - 1

      // Calculate compression ratio based on message age
      let targetRatio: number
      if (age < 3) {
        // Recent: no compression
        targetRatio = 1.0
      } else if (age < 10) {
        // Medium age: moderate compression
        targetRatio = 0.6
      } else {
        // Old: aggressive compression
        targetRatio = 0.3
      }

      if (targetRatio < 1.0) {
        const result = await compressor.compress(msg.content, targetRatio)
        return { ...msg, content: result.compressed }
      }

      return msg
    })
  )
}`}
          </CodeBlock>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Content-Aware Compression</h3>
          <CodeBlock language="typescript">
            {`import { LLMLinguaCompressor } from '@clarity-chat/token-optimization/compression'

const compressor = new LLMLinguaCompressor()

async function smartCompress(text: string, contentType: string) {
  // Adjust settings based on content type
  const options: Partial<LLMLinguaOptions> = {}
  let targetRatio = 0.5

  switch (contentType) {
    case 'code':
      options.preserveCode = true
      options.minQuality = 0.85
      targetRatio = 0.7  // Conservative for code
      break

    case 'technical-docs':
      options.preserveInstructions = true
      options.preserveCode = true
      options.minQuality = 0.8
      targetRatio = 0.6
      break

    case 'blog-post':
      options.minQuality = 0.7
      targetRatio = 0.3  // Aggressive for prose
      break

    case 'chat-message':
      options.preserveInstructions = true
      targetRatio = 0.5  // Balanced
      break
  }

  return compressor.compress(text, targetRatio, options)
}`}
          </CodeBlock>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Debug Mode Analysis</h3>
          <CodeBlock language="typescript">
            {`import { LLMLinguaCompressor } from '@clarity-chat/token-optimization/compression'

const compressor = new LLMLinguaCompressor()

const result = await compressor.compress(text, 0.5, {
  debug: true,  // Enable detailed analysis
})

// Analyze token decisions
if (result.debug) {
  console.log('Processing time:', result.debug.processingTimeMs, 'ms')
  console.log('Total tokens analyzed:', result.debug.stats.totalTokens)
  console.log('Tokens kept:', result.debug.stats.keptTokens)
  console.log('Tokens removed:', result.debug.stats.removedTokens)

  // Find high-value tokens that were removed
  const removedHighValue = result.debug.tokenScores
    .filter(t => !t.kept && t.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  console.log('Top removed tokens:', removedHighValue)

  // Analyze preserved tokens
  console.log('Preserved by position:', result.debug.stats.preservedByPosition)
  console.log('Preserved by instruction:', result.debug.stats.preservedByInstruction)
  console.log('Preserved by code:', result.debug.stats.preservedByCode)
}`}
          </CodeBlock>
        </section>
      </ScrollReveal>

      {/* Related Resources */}
      <ScrollReveal direction="up" delay={0.7}>
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Related Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/reference/api/extractive-compressor"
              className="group p-6 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-purple-500 transition-colors">
                  Extractive Compressor
                </h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Sentence-level compression for structured documents
              </p>
            </Link>

            <Link
              href="/reference/api/adaptive-compressor"
              className="group p-6 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-blue-500 transition-colors">
                  Adaptive Compressor
                </h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Automatically selects the best compression strategy
              </p>
            </Link>

            <Link
              href="/cookbook/achieving-50-percent-reduction"
              className="group p-6 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-emerald-500 transition-colors">
                  50-70% Cost Reduction
                </h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Step-by-step guide to achieving baseline savings
              </p>
            </Link>

            <Link
              href="/reference/components/token-optimization"
              className="group p-6 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-pink-500 dark:hover:border-pink-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-pink-500 transition-colors">
                  Token Optimization Guide
                </h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Complete guide to token optimization strategies
              </p>
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.75}>
        <section className="mb-16">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
            <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Try the{' '}
                  <Link
                    href="/playground"
                    className="text-purple-500 hover:underline"
                  >
                    Interactive Playground
                  </Link>{' '}
                  to experiment with different compression ratios
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Review the{' '}
                  <Link
                    href="/cookbook/achieving-50-percent-reduction"
                    className="text-purple-500 hover:underline"
                  >
                    50-70% Cost Reduction Cookbook
                  </Link>{' '}
                  for production strategies
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Compare with{' '}
                  <Link
                    href="/reference/api/extractive-compressor"
                    className="text-purple-500 hover:underline"
                  >
                    Extractive
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/reference/api/adaptive-compressor"
                    className="text-purple-500 hover:underline"
                  >
                    Adaptive
                  </Link>{' '}
                  compressors
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
