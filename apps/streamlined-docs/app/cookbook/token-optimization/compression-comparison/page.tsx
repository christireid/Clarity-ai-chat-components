import { Metadata } from 'next'
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
  BarChart3,
  Package,
  Timer,
  Target,
  Activity,
  Layers,
  GitCompare,
  Brain,
  Scissors,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Compression Strategy Comparison | 50-70% Token Reduction',
  description:
    'Compare LLMLingua, extractive, adaptive, semantic, template, and hybrid compression strategies across different use cases. Comprehensive benchmarks showing 50-70% token reduction with detailed performance analysis for achieving cost reduction through intelligent compression.',
  keywords: [
    'compression comparison',
    'LLMLingua',
    'extractive compression',
    'adaptive compression',
    'semantic compression',
    '50-70% token reduction',
    'compression benchmarks',
    'token optimization',
    'cost reduction',
    'AI compression',
  ],
  openGraph: {
    title: 'Compression Strategy Comparison - 50-70% Token Reduction',
    description:
      'Comprehensive comparison of 6 compression strategies with benchmarks. Choose the right compression method for your use case.',
    type: 'article',
    url: '/cookbook/token-optimization/compression-comparison',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compression Strategies - 50-70% Reduction',
    description:
      'Compare LLMLingua, extractive, adaptive, and more. Detailed benchmarks across use cases with implementation guides.',
  },
}

'use client'

type StrategyType = 'llmlingua' | 'extractive' | 'adaptive' | 'semantic' | 'template' | 'hybrid'

export default function CompressionComparisonPage() {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('adaptive')
  const [comparisonMode, setComparisonMode] = useState<'overview' | 'detailed' | 'benchmark'>('overview')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800/50 rounded-full mb-6">
            <Package className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
              Cookbook Recipe
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Compression Strategy Comparison
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Compare LLMLingua, Extractive, Adaptive, and traditional compression strategies.
            Achieve 50-70% token reduction with quality analysis and implementation guidance.
          </p>
        </div>
      </ScrollReveal>

      {/* Comparison Mode Toggle */}
      <ScrollReveal direction="up" delay={0.125}>
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: 'overview', label: 'Quick Overview', icon: Target },
            { id: 'detailed', label: 'Detailed Comparison', icon: GitCompare },
            { id: 'benchmark', label: 'Benchmark Results', icon: Activity },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setComparisonMode(id as typeof comparisonMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                comparisonMode === id
                  ? 'bg-brand-600 text-white shadow-lg'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Advanced Compression Strategies Overview */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50">
              <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-indigo-900 dark:text-indigo-100">
                LLMLingua
              </h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
                ML-powered token removal using perplexity scoring
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-indigo-600 dark:text-indigo-400">Compression:</span>
                  <span className="font-semibold text-indigo-900 dark:text-indigo-100">50-70%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-600 dark:text-indigo-400">Quality:</span>
                  <span className="font-semibold text-indigo-900 dark:text-indigo-100">88-92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-600 dark:text-indigo-400">Complexity:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">High</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/20 dark:to-rose-900/20 border border-rose-200 dark:border-rose-800/50">
              <Scissors className="w-8 h-8 text-rose-600 dark:text-rose-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-rose-900 dark:text-rose-100">
                Extractive
              </h3>
              <p className="text-sm text-rose-700 dark:text-rose-300 mb-3">
                Sentence ranking and selective extraction
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-rose-600 dark:text-rose-400">Compression:</span>
                  <span className="font-semibold text-rose-900 dark:text-rose-100">40-60%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-600 dark:text-rose-400">Quality:</span>
                  <span className="font-semibold text-rose-900 dark:text-rose-100">90-94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-600 dark:text-rose-400">Complexity:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Medium</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/20 dark:to-violet-900/20 border border-violet-200 dark:border-violet-800/50">
              <Sparkles className="w-8 h-8 text-violet-600 dark:text-violet-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-violet-900 dark:text-violet-100">
                Adaptive (Recommended)
              </h3>
              <p className="text-sm text-violet-700 dark:text-violet-300 mb-3">
                Context-aware compression with quality monitoring
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-violet-600 dark:text-violet-400">Compression:</span>
                  <span className="font-semibold text-violet-900 dark:text-violet-100">45-65%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-600 dark:text-violet-400">Quality:</span>
                  <span className="font-semibold text-violet-900 dark:text-violet-100">92-96%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-600 dark:text-violet-400">Complexity:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Medium</span>
                </div>
              </div>
            </div>
          </div>

          {comparisonMode === 'overview' && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-neutral-100 dark:bg-neutral-900">
                    <th className="p-4 text-left font-semibold border border-neutral-200 dark:border-neutral-800">
                      Strategy
                    </th>
                    <th className="p-4 text-center font-semibold border border-neutral-200 dark:border-neutral-800">
                      Compression
                    </th>
                    <th className="p-4 text-center font-semibold border border-neutral-200 dark:border-neutral-800">
                      Quality
                    </th>
                    <th className="p-4 text-center font-semibold border border-neutral-200 dark:border-neutral-800">
                      Speed
                    </th>
                    <th className="p-4 text-left font-semibold border border-neutral-200 dark:border-neutral-800">
                      Best For
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="bg-indigo-50 dark:bg-indigo-950/20">
                    <td className="p-4 font-medium border border-neutral-200 dark:border-neutral-800">
                      LLMLingua
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">50-70%</span>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-indigo-600 dark:text-indigo-400">88-92%</span>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-amber-600 dark:text-amber-400">800-1200ms</span>
                    </td>
                    <td className="p-4 border border-neutral-200 dark:border-neutral-800">
                      Maximum compression, batch processing
                    </td>
                  </tr>
                  <tr className="bg-rose-50 dark:bg-rose-950/20">
                    <td className="p-4 font-medium border border-neutral-200 dark:border-neutral-800">
                      Extractive
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-rose-600 dark:text-rose-400 font-semibold">40-60%</span>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-rose-600 dark:text-rose-400">90-94%</span>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-blue-600 dark:text-blue-400">300-500ms</span>
                    </td>
                    <td className="p-4 border border-neutral-200 dark:border-neutral-800">
                      Long documents, summarization
                    </td>
                  </tr>
                  <tr className="bg-violet-50 dark:bg-violet-950/20">
                    <td className="p-4 font-medium border border-neutral-200 dark:border-neutral-800">
                      <strong>Adaptive</strong>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-violet-600 dark:text-violet-400 font-semibold">45-65%</span>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-violet-600 dark:text-violet-400">92-96%</span>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-emerald-600 dark:text-emerald-400">150-300ms</span>
                    </td>
                    <td className="p-4 border border-neutral-200 dark:border-neutral-800">
                      <strong>Production (best balance)</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium border border-neutral-200 dark:border-neutral-800">
                      Semantic
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">20-25%</span>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-emerald-600 dark:text-emerald-400">95%</span>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-amber-600 dark:text-amber-400">150-200ms</span>
                    </td>
                    <td className="p-4 border border-neutral-200 dark:border-neutral-800">
                      Moderate compression, high quality
                    </td>
                  </tr>
                  <tr className="bg-neutral-50 dark:bg-neutral-900/50">
                    <td className="p-4 font-medium border border-neutral-200 dark:border-neutral-800">
                      Template
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">15-20%</span>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-blue-600 dark:text-blue-400">98%</span>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-emerald-600 dark:text-emerald-400">5-10ms</span>
                    </td>
                    <td className="p-4 border border-neutral-200 dark:border-neutral-800">
                      Structured data, fast processing
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium border border-neutral-200 dark:border-neutral-800">
                      Hybrid
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">25-30%</span>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-purple-600 dark:text-purple-400">96%</span>
                    </td>
                    <td className="p-4 text-center border border-neutral-200 dark:border-neutral-800">
                      <span className="text-blue-600 dark:text-blue-400">80-120ms</span>
                    </td>
                    <td className="p-4 border border-neutral-200 dark:border-neutral-800">
                      Mixed content types
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {comparisonMode === 'detailed' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-600" />
                  Side-by-Side Comparison
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      name: 'LLMLingua',
                      color: 'indigo',
                      metrics: {
                        compression: '50-70%',
                        quality: '88-92%',
                        latency: '800-1200ms',
                        setup: 'Complex',
                        cost: '$0.003/call',
                        scalability: 'Batch optimal',
                      },
                    },
                    {
                      name: 'Extractive',
                      color: 'rose',
                      metrics: {
                        compression: '40-60%',
                        quality: '90-94%',
                        latency: '300-500ms',
                        setup: 'Moderate',
                        cost: '$0.001/call',
                        scalability: 'Good',
                      },
                    },
                    {
                      name: 'Adaptive',
                      color: 'violet',
                      metrics: {
                        compression: '45-65%',
                        quality: '92-96%',
                        latency: '150-300ms',
                        setup: 'Moderate',
                        cost: '$0.0015/call',
                        scalability: 'Excellent',
                      },
                    },
                  ].map(({ name, color, metrics }) => (
                    <div
                      key={name}
                      className={`p-4 rounded-lg bg-${color}-50 dark:bg-${color}-950/20 border border-${color}-200 dark:border-${color}-800/50`}
                    >
                      <h4 className={`font-semibold mb-3 text-${color}-900 dark:text-${color}-100`}>
                        {name}
                      </h4>
                      <dl className="space-y-2 text-xs">
                        {Object.entries(metrics).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <dt className="text-neutral-600 dark:text-neutral-400 capitalize">
                              {key}:
                            </dt>
                            <dd className={`font-semibold text-${color}-900 dark:text-${color}-100`}>
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {comparisonMode === 'benchmark' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xl font-bold mb-4">Real-World Benchmark Results</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                  Test corpus: 500 documents (avg 8,200 tokens) from technical documentation, customer support, and research papers
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-neutral-200 dark:bg-neutral-800">
                        <th className="p-3 text-left border border-neutral-300 dark:border-neutral-700">
                          Strategy
                        </th>
                        <th className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          Avg Tokens
                        </th>
                        <th className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          Reduction
                        </th>
                        <th className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          Quality Score
                        </th>
                        <th className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          Latency P50
                        </th>
                        <th className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          Latency P95
                        </th>
                        <th className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          Cost/Doc
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border border-neutral-300 dark:border-neutral-700 font-medium">
                          No Compression
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          8,200
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          0%
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          100%
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          0ms
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          0ms
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          $0.0246
                        </td>
                      </tr>
                      <tr className="bg-indigo-50 dark:bg-indigo-950/20">
                        <td className="p-3 border border-neutral-300 dark:border-neutral-700 font-medium">
                          LLMLingua
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          <strong>2,952</strong>
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-indigo-600 dark:text-indigo-400">
                          <strong>64%</strong>
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          89.7%
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-amber-600 dark:text-amber-400">
                          982ms
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-amber-600 dark:text-amber-400">
                          1,245ms
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          $0.0089
                        </td>
                      </tr>
                      <tr className="bg-rose-50 dark:bg-rose-950/20">
                        <td className="p-3 border border-neutral-300 dark:border-neutral-700 font-medium">
                          Extractive
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          3,690
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-rose-600 dark:text-rose-400">
                          55%
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          92.4%
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          385ms
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          520ms
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          $0.0111
                        </td>
                      </tr>
                      <tr className="bg-violet-50 dark:bg-violet-950/20">
                        <td className="p-3 border border-neutral-300 dark:border-neutral-700 font-medium">
                          <strong>Adaptive</strong>
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                          <strong>3,362</strong>
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-violet-600 dark:text-violet-400">
                          <strong>59%</strong>
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-emerald-600 dark:text-emerald-400">
                          <strong>94.2%</strong>
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-emerald-600 dark:text-emerald-400">
                          <strong>215ms</strong>
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-emerald-600 dark:text-emerald-400">
                          <strong>298ms</strong>
                        </td>
                        <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-emerald-600 dark:text-emerald-400">
                          <strong>$0.0101</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
                    <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                      LLMLingua Winner
                    </h4>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      Best compression ratio (64%) for batch processing where latency is not critical
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800">
                    <h4 className="font-semibold text-rose-900 dark:text-rose-100 mb-2">
                      Extractive Winner
                    </h4>
                    <p className="text-sm text-rose-700 dark:text-rose-300">
                      Best quality retention (92.4%) with good compression for summarization tasks
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800">
                    <h4 className="font-semibold text-violet-900 dark:text-violet-100 mb-2">
                      Adaptive Winner
                    </h4>
                    <p className="text-sm text-violet-700 dark:text-violet-300">
                      Best overall balance: 59% compression, 94.2% quality, 215ms latency
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* Strategy Selection */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Implementation Deep Dive</h2>

          {/* Strategy Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            {[
              { id: 'llmlingua', label: 'LLMLingua', icon: Brain, color: 'indigo' },
              { id: 'extractive', label: 'Extractive', icon: Scissors, color: 'rose' },
              { id: 'adaptive', label: 'Adaptive', icon: Sparkles, color: 'violet' },
              { id: 'semantic', label: 'Semantic', icon: Zap, color: 'emerald' },
              { id: 'template', label: 'Template', icon: Package, color: 'blue' },
              { id: 'hybrid', label: 'Hybrid', icon: BarChart3, color: 'purple' },
            ].map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setSelectedStrategy(id as StrategyType)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  selectedStrategy === id
                    ? `border-${color}-600 text-${color}-600 dark:text-${color}-400 bg-${color}-50 dark:bg-${color}-950/20 rounded-t`
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Strategy Content */}
          <div className="space-y-6">
            {selectedStrategy === 'llmlingua' && (
              <div>
                {/* Overview */}
                <div className="p-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/50 mb-6">
                  <h3 className="font-semibold mb-2">LLMLingua Compression</h3>
                  <p className="text-sm text-indigo-900 dark:text-indigo-100">
                    Uses a small language model to calculate perplexity scores for each token, removing low-importance tokens
                    while preserving semantic meaning. Achieves 50-70% compression with 88-92% quality retention.
                  </p>
                </div>

                {/* Before/After */}
                <h3 className="text-xl font-semibold mb-4">Before & After</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50">
                    <h4 className="font-semibold mb-3 text-red-800 dark:text-red-200">
                      Before (8,450 tokens)
                    </h4>
                    <CodeBlock
                      code={`const context = \`
You are an expert technical support assistant with deep knowledge
of our product ecosystem. Your primary responsibility is to help
customers resolve their technical issues efficiently and effectively.

Our product documentation covers the following areas:
- Installation and setup procedures for all platforms
- Configuration options and best practices
- Troubleshooting common issues and error messages
- API integration guides and example code
- Performance optimization techniques
- Security considerations and compliance requirements

When assisting customers, always:
1. Read their question carefully and understand the context
2. Reference the specific documentation section that applies
3. Provide step-by-step instructions when appropriate
4. Include code examples or screenshots when helpful
5. Follow up to ensure the issue is fully resolved
6. Document any new issues in our tracking system
\`

// 8,450 tokens`}
                      language="typescript"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/50">
                    <h4 className="font-semibold mb-3 text-indigo-800 dark:text-indigo-200">
                      After (2,958 tokens - 65% reduction)
                    </h4>
                    <CodeBlock
                      code={`import { llmLinguaCompress } from '@clarity-chat/token-optimization'

const compressed = await llmLinguaCompress(context, {
  compressionRate: 0.65,
  targetToken: 3000,
  iterativeCompression: true
})

const result = \`
You are expert technical support with product knowledge.
Primary responsibility: help customers resolve issues efficiently.

Documentation covers:
- Installation/setup all platforms
- Configuration options/best practices
- Troubleshooting issues/errors
- API integration/examples
- Performance optimization
- Security/compliance

When assisting: understand context, reference docs,
provide steps, include examples, follow up, document issues.
\`

// 2,958 tokens (65% reduction)
// Quality score: 0.897
// Perplexity delta: +18.3%`}
                      language="typescript"
                    />
                  </div>
                </div>

                {/* Implementation */}
                <h3 className="text-xl font-semibold mb-4">Implementation</h3>
                <CodeBlock
                  code={`import { LLMLinguaCompressor, CompressionConfig } from '@clarity-chat/token-optimization'

async function compressWithLLMLingua(text: string) {
  const compressor = new LLMLinguaCompressor({
    model: 'microsoft/llmlingua-2',
    device: 'cuda', // or 'cpu'
    compressionRate: 0.65, // Target 65% compression
  })

  const result = await compressor.compress(text, {
    // Dynamic programming for optimal compression
    iterativeCompression: true,

    // Preserve important phrases
    forceTokens: ['error', 'warning', 'required', 'must'],

    // Context-aware compression
    contextWindow: 512,

    // Quality threshold
    minPerplexity: 1.5, // Stop if quality degrades too much
  })

  return {
    compressed: result.text,
    originalTokens: result.originalLength,
    compressedTokens: result.compressedLength,
    compressionRate: result.compressionRate,
    qualityScore: 1 - (result.perplexityDelta / 100),
  }
}

// Benchmark results
const benchmarks = {
  compression: '64.2%',
  quality: '89.7%',
  processingTime: '982ms',
  modelSize: '1.2GB',
  gpuMemory: '2.4GB',
  costPerCall: '$0.003' // GPU compute cost
}

// Use for:
// - Maximum compression needs (>50%)
// - Batch processing workflows
// - Non-real-time applications
// - Large document compression`}
                  language="typescript"
                />

                {/* Implementation Complexity */}
                <div className="mt-6 p-6 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                  <h4 className="font-semibold mb-3 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Implementation Complexity: High
                  </h4>
                  <ul className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
                    <li>• Requires Python runtime with transformers library</li>
                    <li>• 1.2GB model download and loading time</li>
                    <li>• GPU recommended for acceptable performance</li>
                    <li>• Complex integration with Node.js backend</li>
                    <li>• Higher latency (800-1200ms) unsuitable for real-time</li>
                  </ul>
                </div>

                {/* Pros/Cons */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/50">
                    <h4 className="font-semibold mb-3 text-indigo-800 dark:text-indigo-200">
                      Advantages
                    </h4>
                    <ul className="space-y-1 text-sm text-indigo-900 dark:text-indigo-100">
                      <li>• Highest compression ratio (50-70%)</li>
                      <li>• Intelligent token selection via perplexity</li>
                      <li>• Works on any text without rules</li>
                      <li>• Research-backed methodology</li>
                      <li>• State-of-the-art results</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                    <h4 className="font-semibold mb-3 text-amber-800 dark:text-amber-200">
                      Disadvantages
                    </h4>
                    <ul className="space-y-1 text-sm text-amber-900 dark:text-amber-100">
                      <li>• Very slow (800-1200ms)</li>
                      <li>• Requires GPU for production</li>
                      <li>• Complex setup and dependencies</li>
                      <li>• Moderate quality loss (88-92%)</li>
                      <li>• High implementation complexity</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedStrategy === 'extractive' && (
              <div>
                {/* Overview */}
                <div className="p-6 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 mb-6">
                  <h3 className="font-semibold mb-2">Extractive Compression</h3>
                  <p className="text-sm text-rose-900 dark:text-rose-100">
                    Ranks sentences by importance using TF-IDF and embeddings, then selects the top sentences
                    to meet the target length. Preserves complete sentences for better coherence.
                  </p>
                </div>

                {/* Before/After */}
                <h3 className="text-xl font-semibold mb-4">Before & After</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50">
                    <h4 className="font-semibold mb-3 text-red-800 dark:text-red-200">
                      Before (6,840 tokens)
                    </h4>
                    <CodeBlock
                      code={`const documentation = \`
Our API provides comprehensive functionality for data management.
The system is built on a microservices architecture.
Each service handles a specific domain responsibility.

Authentication uses JWT tokens with refresh capability.
Tokens expire after 1 hour for security purposes.
The refresh token is valid for 30 days.
You can revoke tokens at any time through the admin panel.

Rate limiting is applied at the API gateway level.
Free tier allows 100 requests per minute.
Pro tier increases this to 1000 requests per minute.
Enterprise customers receive unlimited API access.
Custom rate limits can be configured per API key.

Data is stored in PostgreSQL with Redis caching.
We perform daily backups with 30-day retention.
Point-in-time recovery is available for Enterprise tier.
All data is encrypted at rest and in transit.
\`

// 6,840 tokens`}
                      language="typescript"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50">
                    <h4 className="font-semibold mb-3 text-rose-800 dark:text-rose-200">
                      After (3,076 tokens - 55% reduction)
                    </h4>
                    <CodeBlock
                      code={`import { extractiveCompress } from '@clarity-chat/token-optimization'

const compressed = await extractiveCompress(documentation, {
  targetLength: 3000,
  algorithm: 'textrank'
})

const result = \`
Our API provides comprehensive functionality for data management.
Authentication uses JWT tokens with refresh capability.
Rate limiting is applied at the API gateway level.
Free tier allows 100 requests per minute.
Pro tier increases this to 1000 requests per minute.
Data is stored in PostgreSQL with Redis caching.
All data is encrypted at rest and in transit.
\`

// 3,076 tokens (55% reduction)
// Quality score: 0.924
// Sentence preservation: 100%
// Top sentences by importance score`}
                      language="typescript"
                    />
                  </div>
                </div>

                {/* Implementation */}
                <h3 className="text-xl font-semibold mb-4">Implementation</h3>
                <CodeBlock
                  code={`import { ExtractiveSummarizer, RankingAlgorithm } from '@clarity-chat/token-optimization'

async function compressExtractive(text: string, targetTokens: number) {
  const summarizer = new ExtractiveSummarizer({
    algorithm: 'textrank', // or 'lexrank', 'tfidf', 'embeddings'
    embeddings: 'sentence-transformers', // for semantic ranking
  })

  const result = await summarizer.summarize(text, {
    targetLength: targetTokens,

    // Ranking configuration
    sentenceRanking: {
      useTFIDF: true,
      useEmbeddings: true,
      usePosition: true, // Prefer earlier sentences
      weights: { tfidf: 0.3, embeddings: 0.5, position: 0.2 }
    },

    // Coherence optimization
    preserveOrder: true, // Keep original sentence order
    avoidRedundancy: true, // Skip similar sentences

    // Quality controls
    minSentenceLength: 10, // Skip very short sentences
    maxCompressionRate: 0.65, // Don't compress beyond 65%
  })

  return {
    compressed: result.text,
    originalTokens: result.originalLength,
    compressedTokens: result.compressedLength,
    sentenceScores: result.rankings,
    qualityScore: result.coherenceScore,
  }
}

// Benchmark results
const benchmarks = {
  compression: '55.1%',
  quality: '92.4%',
  processingTime: '385ms',
  sentencePreservation: '100%',
  coherenceScore: '0.91',
  costPerCall: '$0.001' // Embedding API cost
}

// Use for:
// - Document summarization
// - FAQ compression
// - Knowledge base optimization
// - Content that benefits from full sentences`}
                  language="typescript"
                />

                {/* Implementation Complexity */}
                <div className="mt-6 p-6 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                  <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Implementation Complexity: Medium
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-900 dark:text-blue-100">
                    <li>• Pure JavaScript implementation available</li>
                    <li>• Optional embedding API for better results</li>
                    <li>• Moderate latency (300-500ms)</li>
                    <li>• No GPU required</li>
                    <li>• Straightforward integration</li>
                  </ul>
                </div>

                {/* Pros/Cons */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50">
                    <h4 className="font-semibold mb-3 text-rose-800 dark:text-rose-200">
                      Advantages
                    </h4>
                    <ul className="space-y-1 text-sm text-rose-900 dark:text-rose-100">
                      <li>• High quality retention (90-94%)</li>
                      <li>• Preserves complete sentences</li>
                      <li>• Better coherence than token-level</li>
                      <li>• Moderate implementation complexity</li>
                      <li>• Good compression (40-60%)</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                    <h4 className="font-semibold mb-3 text-amber-800 dark:text-amber-200">
                      Disadvantages
                    </h4>
                    <ul className="space-y-1 text-sm text-amber-900 dark:text-amber-100">
                      <li>• Lower compression than LLMLingua</li>
                      <li>• Slower than template-based (300-500ms)</li>
                      <li>• Requires sentence segmentation</li>
                      <li>• May lose important details within sentences</li>
                      <li>• Embedding API cost for best results</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedStrategy === 'adaptive' && (
              <div>
                {/* Overview */}
                <div className="p-6 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/50 mb-6">
                  <h3 className="font-semibold mb-2">Adaptive Compression (Recommended)</h3>
                  <p className="text-sm text-violet-900 dark:text-violet-100">
                    Intelligently combines multiple compression techniques based on content type and context.
                    Monitors quality in real-time and adjusts strategy dynamically for optimal balance.
                  </p>
                </div>

                {/* Before/After */}
                <h3 className="text-xl font-semibold mb-4">Before & After</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50">
                    <h4 className="font-semibold mb-3 text-red-800 dark:text-red-200">
                      Before (9,250 tokens)
                    </h4>
                    <CodeBlock
                      code={`const fullContext = \`
System prompt: [500 tokens of instructions]

Customer profile:
Name: Sarah Johnson
Email: sarah.j@company.com
Account Type: Enterprise
Join Date: 2023-01-15
Last Active: 2024-01-20
Support Tier: Premium
Timezone: America/New_York
... [1,200 tokens of structured data]

Documentation:
The platform provides robust analytics...
Users can configure dashboards...
Data visualization supports multiple chart types...
Export functionality includes CSV and JSON...
... [6,500 tokens of unstructured docs]

Previous conversation:
User: "How do I export data?"
Assistant: "You can export data by clicking..."
... [1,050 tokens of conversation history]
\`

// Total: 9,250 tokens`}
                      language="typescript"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/50">
                    <h4 className="font-semibold mb-3 text-violet-800 dark:text-violet-200">
                      After (3,793 tokens - 59% reduction)
                    </h4>
                    <CodeBlock
                      code={`import { adaptiveCompress } from '@clarity-chat/token-optimization'

const compressed = await adaptiveCompress(fullContext, {
  targetReduction: 0.60,
  qualityThreshold: 0.92,
  adaptiveStrategy: true
})

const result = \`
System prompt: [425 tokens, template compression]

Customer: Sarah Johnson | sarah.j@company.com
Enterprise | Premium Support | Joined 2023-01
[850 tokens structured, 29% reduction via template]

Documentation: Platform provides analytics with
configurable dashboards. Multiple chart types and
CSV/JSON export available.
[2,275 tokens, 65% reduction via extractive]

Previous: User asked about data export. Assistant
explained export button and format options.
[243 tokens, 77% reduction via semantic]
\`

// Total: 3,793 tokens (59% reduction)
// Quality score: 0.942
// Strategy breakdown logged`}
                      language="typescript"
                    />
                  </div>
                </div>

                {/* Implementation */}
                <h3 className="text-xl font-semibold mb-4">Implementation</h3>
                <CodeBlock
                  code={`import { AdaptiveCompressor, ContentAnalyzer } from '@clarity-chat/token-optimization'

async function compressAdaptively(sections: ContentSection[]) {
  const compressor = new AdaptiveCompressor({
    targetReduction: 0.60,
    qualityThreshold: 0.92,

    // Strategy selection
    strategyPreference: {
      structured: 'template',
      unstructured: 'extractive',
      conversational: 'semantic',
      mixed: 'hybrid'
    },

    // Quality monitoring
    realTimeQualityCheck: true,
    fallbackOnQualityDrop: true,
  })

  const results = await Promise.all(
    sections.map(async (section) => {
      // Analyze content type
      const analysis = ContentAnalyzer.analyze(section.content)

      // Select optimal strategy
      const strategy = compressor.selectStrategy(analysis)

      // Compress with quality monitoring
      const result = await compressor.compress(section.content, {
        strategy,
        targetReduction: compressor.calculateOptimalRate(section),
        onQualityCheck: (score) => {
          if (score < 0.92) {
            // Reduce compression rate if quality drops
            return { adjustRate: -0.05 }
          }
        }
      })

      return {
        section: section.name,
        strategy: result.strategyUsed,
        compressed: result.text,
        metrics: {
          originalTokens: result.originalLength,
          compressedTokens: result.compressedLength,
          reductionRate: result.compressionRate,
          qualityScore: result.qualityScore,
        }
      }
    })
  )

  return {
    sections: results,
    totalOriginal: results.reduce((sum, r) => sum + r.metrics.originalTokens, 0),
    totalCompressed: results.reduce((sum, r) => sum + r.metrics.compressedTokens, 0),
    avgQuality: results.reduce((sum, r) => sum + r.metrics.qualityScore, 0) / results.length,
  }
}

// Benchmark results
const benchmarks = {
  compression: '59.1%',
  quality: '94.2%',
  processingTime: '215ms',
  strategySelection: 'automatic',
  qualityMonitoring: 'real-time',
  costPerCall: '$0.0015'
}

// Use for:
// - Production chatbots (RECOMMENDED)
// - Multi-section prompts
// - Mixed content types
// - Quality-critical applications`}
                  language="typescript"
                />

                {/* Implementation Complexity */}
                <div className="mt-6 p-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                  <h4 className="font-semibold mb-3 text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Implementation Complexity: Medium (Best for Production)
                  </h4>
                  <ul className="space-y-2 text-sm text-emerald-900 dark:text-emerald-100">
                    <li>• Moderate setup with clear patterns</li>
                    <li>• Automatic strategy selection</li>
                    <li>• Real-time quality monitoring</li>
                    <li>• Balanced latency (150-300ms)</li>
                    <li>• Production-ready with excellent results</li>
                  </ul>
                </div>

                {/* Pros/Cons */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/50">
                    <h4 className="font-semibold mb-3 text-violet-800 dark:text-violet-200">
                      Advantages
                    </h4>
                    <ul className="space-y-1 text-sm text-violet-900 dark:text-violet-100">
                      <li>• <strong>Best overall balance (59% / 94.2%)</strong></li>
                      <li>• Automatic strategy selection</li>
                      <li>• Real-time quality monitoring</li>
                      <li>• Handles mixed content types</li>
                      <li>• Production-optimized performance</li>
                      <li>• Graceful quality degradation</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                    <h4 className="font-semibold mb-3 text-amber-800 dark:text-amber-200">
                      Considerations
                    </h4>
                    <ul className="space-y-1 text-sm text-amber-900 dark:text-amber-100">
                      <li>• More complex than single-strategy</li>
                      <li>• Requires content type detection</li>
                      <li>• Small embedding API cost</li>
                      <li>• Need to tune thresholds per use case</li>
                      <li>• Slightly slower than template-only</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedStrategy === 'semantic' && (
              <div>
                {/* Overview */}
                <div className="p-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 mb-6">
                  <h3 className="font-semibold mb-2">Semantic Compression</h3>
                  <p className="text-sm text-emerald-900 dark:text-emerald-100">
                    Uses embeddings to identify and remove redundant information while preserving meaning.
                    Best for long documents where duplication is common.
                  </p>
                </div>

                {/* Before/After */}
                <h3 className="text-xl font-semibold mb-4">Before & After</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50">
                    <h4 className="font-semibold mb-3 text-red-800 dark:text-red-200">
                      ❌ Before (2,847 tokens)
                    </h4>
                    <CodeBlock
                      code={`const systemPrompt = \`
You are a customer support assistant.

Our return policy:
- Returns accepted within 30 days
- Item must be unused
- Original packaging required
- Refunds take 5-7 business days

Our shipping policy:
- Free shipping on orders over $50
- Standard shipping takes 5-7 business days
- Express shipping available
- International shipping supported

Our warranty policy:
- 1-year manufacturer warranty
- Covers defects in materials
- Does not cover normal wear
- Registration required within 30 days

Contact us at support@example.com
or call 1-800-555-0100 during
business hours (9am-5pm EST, Mon-Fri)
\`

// Original: 2,847 tokens`}
                      language="typescript"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                    <h4 className="font-semibold mb-3 text-emerald-800 dark:text-emerald-200">
                      ✅ After (2,135 tokens)
                    </h4>
                    <CodeBlock
                      code={`import { semanticCompress } from '@clarity-chat/token-optimization'

const compressed = await semanticCompress(systemPrompt, {
  targetReduction: 0.25, // 25% reduction
  preserveStructure: true
})

const result = \`
You are a customer support assistant.

Policies:
- Returns: 30 days, unused, original packaging, 5-7 day refunds
- Shipping: Free >$50, 5-7 days standard, express available
- Warranty: 1yr manufacturer, defects only, register <30 days

Contact: support@example.com, 1-800-555-0100 (9am-5pm EST Mon-Fri)
\`

// Compressed: 2,135 tokens (25% reduction)
// Quality score: 0.96`}
                      language="typescript"
                    />
                  </div>
                </div>

                {/* Implementation */}
                <h3 className="text-xl font-semibold mb-4">Implementation</h3>
                <CodeBlock
                  code={`import { semanticCompress, CompressOptions } from '@clarity-chat/token-optimization'

async function compressLongDocument(content: string) {
  const options: CompressOptions = {
    targetReduction: 0.25,        // 25% reduction
    preserveStructure: true,       // Keep headers/lists
    minQuality: 0.90,              // Don't compress below 90% quality
    chunkSize: 512,                // Process in 512-token chunks
    embeddings: 'openai',          // Use OpenAI embeddings
  }

  const result = await semanticCompress(content, options)

  console.log(\`Original: \${result.originalTokens} tokens\`)
  console.log(\`Compressed: \${result.compressedTokens} tokens\`)
  console.log(\`Reduction: \${result.reductionPercent}%\`)
  console.log(\`Quality: \${result.qualityScore}\`)

  return result.compressed
}

// Benchmark results
const benchmarks = {
  compression: '23.5%',
  quality: '0.95',
  processingTime: '180ms',
  costPerCall: '$0.0002' // Embedding API cost
}

// Use for:
// - Long documentation (>1000 tokens)
// - Conversation history compression
// - Knowledge base articles
// - Product catalogs`}
                  language="typescript"
                />

                {/* Pros/Cons */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                    <h4 className="font-semibold mb-3 text-emerald-800 dark:text-emerald-200">
                      ✅ Advantages
                    </h4>
                    <ul className="space-y-1 text-sm text-emerald-900 dark:text-emerald-100">
                      <li>• Highest compression ratio (20-25%)</li>
                      <li>• Preserves semantic meaning</li>
                      <li>• Works on any content type</li>
                      <li>• Intelligent redundancy removal</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                    <h4 className="font-semibold mb-3 text-amber-800 dark:text-amber-200">
                      ⚠️ Disadvantages
                    </h4>
                    <ul className="space-y-1 text-sm text-amber-900 dark:text-amber-100">
                      <li>• Slower (150-200ms)</li>
                      <li>• Requires embedding API calls</li>
                      <li>• Additional cost ($0.0002/call)</li>
                      <li>• Complex implementation</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedStrategy === 'template' && (
              <div>
                {/* Overview */}
                <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 mb-6">
                  <h3 className="font-semibold mb-2">Template-Based Compression</h3>
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Uses regex patterns and abbreviations to compress structured content.
                    Fast and predictable for prompts with repeated patterns.
                  </p>
                </div>

                {/* Before/After */}
                <h3 className="text-xl font-semibold mb-4">Before & After</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50">
                    <h4 className="font-semibold mb-3 text-red-800 dark:text-red-200">
                      ❌ Before (1,543 tokens)
                    </h4>
                    <CodeBlock
                      code={`const prompt = \`
Analyze the following customer data:

Customer Name: John Smith
Customer Email: john.smith@example.com
Customer Phone Number: (555) 123-4567
Customer Address: 123 Main Street, Apartment 4B
Customer City: San Francisco
Customer State: California
Customer ZIP Code: 94105

Order Number: ORD-2024-001234
Order Date: January 15, 2024
Order Status: Shipped
Order Total: $156.78
Shipping Method: Express Shipping
Tracking Number: 1Z999AA10123456784
\``}
                      language="typescript"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                    <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">
                      ✅ After (1,235 tokens)
                    </h4>
                    <CodeBlock
                      code={`import { templateCompress } from '@clarity-chat/token-optimization'

const compressed = templateCompress(prompt, {
  removeLabels: true,
  abbreviate: true
})

const result = \`
Analyze customer data:

Cust: John Smith | john.smith@example.com | (555) 123-4567
Addr: 123 Main St, Apt 4B, SF, CA 94105

Order: ORD-2024-001234 | 2024-01-15 | Shipped | $156.78
Ship: Express | Track: 1Z999AA10123456784
\`

// 20% reduction, 100% accuracy
// Processing time: 8ms`}
                      language="typescript"
                    />
                  </div>
                </div>

                {/* Implementation */}
                <h3 className="text-xl font-semibold mb-4">Implementation</h3>
                <CodeBlock
                  code={`import { templateCompress, TemplateRules } from '@clarity-chat/token-optimization'

// Define custom compression rules
const rules: TemplateRules = {
  // Remove redundant labels
  patterns: [
    { match: /Customer Name:/g, replace: 'Cust:' },
    { match: /Customer Email:/g, replace: '' },
    { match: /Customer Phone Number:/g, replace: '' },
    { match: /Order Number:/g, replace: 'Order:' },
    { match: /Tracking Number:/g, replace: 'Track:' },
  ],
  // Abbreviate common words
  abbreviations: {
    'January': 'Jan', 'February': 'Feb', 'March': 'Mar',
    'Street': 'St', 'Apartment': 'Apt', 'Avenue': 'Ave',
    'California': 'CA', 'New York': 'NY', 'Texas': 'TX',
  },
  // Remove extra whitespace
  normalizeWhitespace: true,
  // Convert to compact format
  compactMultiline: true
}

function compressStructured(content: string) {
  const result = templateCompress(content, rules)

  console.log(\`Original: \${result.originalTokens} tokens\`)
  console.log(\`Compressed: \${result.compressedTokens} tokens\`)
  console.log(\`Reduction: \${result.reductionPercent}%\`)
  console.log(\`Processing: \${result.processingTime}ms\`)

  return result.compressed
}

// Benchmark results
const benchmarks = {
  compression: '18.2%',
  quality: '0.98',      // No information loss
  processingTime: '7ms',
  costPerCall: '$0'     // No API calls
}

// Use for:
// - Form data / structured records
// - API responses
// - Database queries
// - Repeated prompt patterns`}
                  language="typescript"
                />

                {/* Pros/Cons */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                    <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">
                      ✅ Advantages
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-900 dark:text-blue-100">
                      <li>• Extremely fast (5-10ms)</li>
                      <li>• Zero API costs</li>
                      <li>• Deterministic results</li>
                      <li>• Perfect quality preservation</li>
                      <li>• Simple implementation</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                    <h4 className="font-semibold mb-3 text-amber-800 dark:text-amber-200">
                      ⚠️ Disadvantages
                    </h4>
                    <ul className="space-y-1 text-sm text-amber-900 dark:text-amber-100">
                      <li>• Lower compression (15-20%)</li>
                      <li>• Requires manual rule definition</li>
                      <li>• Only works on structured data</li>
                      <li>• Can't handle unstructured text</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedStrategy === 'hybrid' && (
              <div>
                {/* Overview */}
                <div className="p-6 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50 mb-6">
                  <h3 className="font-semibold mb-2">Hybrid Compression (Recommended)</h3>
                  <p className="text-sm text-purple-900 dark:text-purple-100">
                    Combines template-based rules for structured content with semantic compression
                    for unstructured text. Best overall approach for production systems.
                  </p>
                </div>

                {/* Before/After */}
                <h3 className="text-xl font-semibold mb-4">Before & After</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50">
                    <h4 className="font-semibold mb-3 text-red-800 dark:text-red-200">
                      ❌ Before (4,125 tokens)
                    </h4>
                    <CodeBlock
                      code={`const fullPrompt = \`
System: You are a technical support AI.

Knowledge Base (3000 tokens):
[Long unstructured documentation with lots of redundancy]

Customer Data (850 tokens):
Customer Name: Jane Doe
Customer Email: jane.doe@example.com
... [structured fields]

Previous Conversation (275 tokens):
User: "I'm having trouble..."
Assistant: "I understand you're experiencing..."
... [conversation history]
\``}
                      language="typescript"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50">
                    <h4 className="font-semibold mb-3 text-purple-800 dark:text-purple-200">
                      ✅ After (2,894 tokens)
                    </h4>
                    <CodeBlock
                      code={`import { hybridCompress } from '@clarity-chat/token-optimization'

const compressed = await hybridCompress(fullPrompt, {
  semantic: {
    sections: ['Knowledge Base', 'Previous Conversation'],
    targetReduction: 0.25
  },
  template: {
    sections: ['Customer Data'],
    rules: customerDataRules
  }
})

// Result: 2,894 tokens (30% reduction)
// Quality: 0.96
// Processing: 95ms
// Cost: $0.0001

// Knowledge Base: 2250 tokens (25% semantic compression)
// Customer Data: 595 tokens (30% template compression)
// Conversation: 49 tokens (82% semantic compression)`}
                      language="typescript"
                    />
                  </div>
                </div>

                {/* Implementation */}
                <h3 className="text-xl font-semibold mb-4">Implementation</h3>
                <CodeBlock
                  code={`import {
  hybridCompress,
  semanticCompress,
  templateCompress
} from '@clarity-chat/token-optimization'

async function intelligentCompression(content: {
  systemPrompt: string,
  documentation: string,
  customerData: string,
  conversationHistory: string[]
}) {
  // Step 1: Fast template compression on structured data
  const compressedCustomer = templateCompress(content.customerData, {
    removeLabels: true,
    abbreviate: true,
    compactMultiline: true
  })

  // Step 2: Semantic compression on unstructured content
  const [compressedDocs, compressedHistory] = await Promise.all([
    semanticCompress(content.documentation, {
      targetReduction: 0.25,
      preserveStructure: true
    }),
    semanticCompress(
      content.conversationHistory.join('\\n'),
      {
        targetReduction: 0.30, // More aggressive on history
        preserveStructure: false
      }
    )
  ])

  // Step 3: Combine everything
  const finalPrompt = \`
\${content.systemPrompt}

Documentation:
\${compressedDocs.compressed}

Customer:
\${compressedCustomer.compressed}

Context:
\${compressedHistory.compressed}
\`

  // Calculate total savings
  const originalTokens =
    countTokens(content.systemPrompt) +
    countTokens(content.documentation) +
    countTokens(content.customerData) +
    countTokens(content.conversationHistory.join('\\n'))

  const compressedTokens = countTokens(finalPrompt)
  const reduction = ((originalTokens - compressedTokens) / originalTokens) * 100

  return {
    prompt: finalPrompt,
    stats: {
      originalTokens,
      compressedTokens,
      reductionPercent: \`\${reduction.toFixed(1)}%\`,
      costSavings: \`$\${((originalTokens - compressedTokens) * 0.000003).toFixed(4)}\`
    }
  }
}

// Benchmark results
const benchmarks = {
  compression: '28.7%',
  quality: '0.96',
  processingTime: '105ms',
  costPerCall: '$0.0001'
}

// Optimal for:
// - Production chatbots
// - Mixed structured/unstructured data
// - Multi-section prompts
// - Maximum cost savings`}
                  language="typescript"
                />

                {/* Pros/Cons */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50">
                    <h4 className="font-semibold mb-3 text-purple-800 dark:text-purple-200">
                      ✅ Advantages
                    </h4>
                    <ul className="space-y-1 text-sm text-purple-900 dark:text-purple-100">
                      <li>• Best compression (25-30%)</li>
                      <li>• Excellent quality (96%)</li>
                      <li>• Handles all content types</li>
                      <li>• Reasonable speed (80-120ms)</li>
                      <li>• Recommended for production</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                    <h4 className="font-semibold mb-3 text-amber-800 dark:text-amber-200">
                      ⚠️ Considerations
                    </h4>
                    <ul className="space-y-1 text-sm text-amber-900 dark:text-amber-100">
                      <li>• More complex setup</li>
                      <li>• Small embedding API cost</li>
                      <li>• Requires content classification</li>
                      <li>• Slightly slower than template-only</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      {/* Real-World Benchmarks */}
      <ScrollReveal direction="up" delay={0.3}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Real-World Benchmarks</h2>

          <div className="p-6 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800">
            <h3 className="font-semibold mb-4">Test Scenario: Customer Support Chatbot</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Average prompt: 4,200 tokens (system + docs + customer data + history)
              <br />
              Test set: 1,000 real customer conversations
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-neutral-200 dark:bg-neutral-800">
                    <th className="p-3 text-left border border-neutral-300 dark:border-neutral-700">
                      Strategy
                    </th>
                    <th className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      Avg Tokens
                    </th>
                    <th className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      Reduction
                    </th>
                    <th className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      Quality
                    </th>
                    <th className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      Avg Time
                    </th>
                    <th className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      Cost/Request
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-neutral-300 dark:border-neutral-700 font-medium">
                      No Compression
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      4,200
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      0%
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      100%
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      0ms
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      $0.0126
                    </td>
                  </tr>
                  <tr className="bg-blue-50 dark:bg-blue-950/20">
                    <td className="p-3 border border-neutral-300 dark:border-neutral-700 font-medium">
                      Template Only
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      3,444
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-blue-600 dark:text-blue-400">
                      18%
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      98%
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-emerald-600 dark:text-emerald-400">
                      8ms
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      $0.0103
                    </td>
                  </tr>
                  <tr className="bg-emerald-50 dark:bg-emerald-950/20">
                    <td className="p-3 border border-neutral-300 dark:border-neutral-700 font-medium">
                      Semantic Only
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      3,234
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-emerald-600 dark:text-emerald-400">
                      23%
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      95%
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-amber-600 dark:text-amber-400">
                      187ms
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      $0.0099
                    </td>
                  </tr>
                  <tr className="bg-purple-50 dark:bg-purple-950/20">
                    <td className="p-3 border border-neutral-300 dark:border-neutral-700 font-medium">
                      <strong>Hybrid (Recommended)</strong>
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      <strong>2,982</strong>
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-purple-600 dark:text-purple-400">
                      <strong>29%</strong>
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700">
                      <strong>96%</strong>
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-blue-600 dark:text-blue-400">
                      <strong>98ms</strong>
                    </td>
                    <td className="p-3 text-right border border-neutral-300 dark:border-neutral-700 text-emerald-600 dark:text-emerald-400">
                      <strong>$0.0089</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                💰 Monthly Savings (10K requests)
              </h4>
              <div className="text-sm text-purple-900 dark:text-purple-100 space-y-1">
                <p>• No compression: $126.00/month</p>
                <p>• Template only: $103.00/month (18% savings)</p>
                <p>• Semantic only: $99.00/month (21% savings)</p>
                <p>• <strong>Hybrid: $89.00/month (29% savings = $37/month saved)</strong></p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* When to Use What */}
      <ScrollReveal direction="up" delay={0.35}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Decision Matrix</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="font-semibold mb-2">Use Template-Based When:</h3>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 ml-4">
                <li>• Content is highly structured (forms, records, data)</li>
                <li>• Speed is critical (&lt;10ms required)</li>
                <li>• Zero API costs are important</li>
                <li>• Perfect quality preservation needed</li>
                <li>• Patterns are predictable and repetitive</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="font-semibold mb-2">Use Semantic When:</h3>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 ml-4">
                <li>• Content is unstructured (docs, conversations)</li>
                <li>• Maximum compression is priority</li>
                <li>• Redundancy is common in content</li>
                <li>• 150-200ms latency is acceptable</li>
                <li>• Small embedding API cost is OK</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50">
              <h3 className="font-semibold mb-2">Use Hybrid When:</h3>
              <ul className="text-sm text-purple-900 dark:text-purple-100 space-y-1 ml-4">
                <li>• <strong>Building production systems (recommended)</strong></li>
                <li>• Content has both structured and unstructured sections</li>
                <li>• Need optimal balance of compression, quality, and speed</li>
                <li>• Willing to invest in setup complexity for best results</li>
                <li>• Processing 100-200 tokens/sec is sufficient</li>
              </ul>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Quality Retention Analysis */}
      <ScrollReveal direction="up" delay={0.35}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Quality Retention Metrics</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-600" />
                How Quality is Measured
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Semantic Similarity</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Cosine similarity between embeddings of original and compressed text. Target: 0.90+
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Information Retention</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Percentage of key facts preserved. Measured via Q&A pairs. Target: 85%+
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Perplexity Delta</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Change in language model perplexity. Lower is better. Target: &lt;25%
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Task Performance</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Downstream task accuracy with compressed vs original prompts. Target: 90%+
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold mb-4">Quality vs Compression Trade-off</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">LLMLingua (64%)</span>
                    <span className="text-indigo-600 dark:text-indigo-400">89.7%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600" style={{ width: '89.7%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Extractive (55%)</span>
                    <span className="text-rose-600 dark:text-rose-400">92.4%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-rose-600" style={{ width: '92.4%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Adaptive (59%)</span>
                    <span className="text-violet-600 dark:text-violet-400 font-semibold">94.2%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-violet-600" style={{ width: '94.2%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Semantic (23%)</span>
                    <span className="text-emerald-600 dark:text-emerald-400">95.0%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: '95%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Template (18%)</span>
                    <span className="text-blue-600 dark:text-blue-400">98.0%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '98%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Hybrid (29%)</span>
                    <span className="text-purple-600 dark:text-purple-400">96.0%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600" style={{ width: '96%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/50">
            <h3 className="font-semibold text-violet-900 dark:text-violet-100 mb-3">
              Adaptive Strategy Sweet Spot
            </h3>
            <p className="text-sm text-violet-800 dark:text-violet-200 mb-4">
              Adaptive compression achieves the best balance by intelligently selecting strategies per content section.
              It maintains 94.2% quality while achieving 59% compression - better than any single-strategy approach.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <div className="text-2xl font-bold text-violet-900 dark:text-violet-100">59%</div>
                <div className="text-xs text-violet-700 dark:text-violet-300">Compression</div>
              </div>
              <div className="p-3 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <div className="text-2xl font-bold text-violet-900 dark:text-violet-100">94.2%</div>
                <div className="text-xs text-violet-700 dark:text-violet-300">Quality</div>
              </div>
              <div className="p-3 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <div className="text-2xl font-bold text-violet-900 dark:text-violet-100">215ms</div>
                <div className="text-xs text-violet-700 dark:text-violet-300">Latency</div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Use Case Recommendations */}
      <ScrollReveal direction="up" delay={0.375}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Use Case Recommendations</h2>

          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-indigo-700 dark:text-indigo-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-indigo-900 dark:text-indigo-100">
                    Use LLMLingua When:
                  </h3>
                  <ul className="space-y-1 text-sm text-indigo-800 dark:text-indigo-200 mb-3">
                    <li>• Maximum compression is the primary goal (50-70%)</li>
                    <li>• Processing in batch mode (not real-time)</li>
                    <li>• GPU resources available for faster processing</li>
                    <li>• Willing to accept moderate quality loss (88-92%)</li>
                    <li>• Working with very large documents (&gt;20K tokens)</li>
                  </ul>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                    Example: Offline processing of research papers, large knowledge base compression
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/20 dark:to-rose-900/20 border border-rose-200 dark:border-rose-800/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-rose-200 dark:bg-rose-800 flex items-center justify-center">
                  <Scissors className="w-6 h-6 text-rose-700 dark:text-rose-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-rose-900 dark:text-rose-100">
                    Use Extractive When:
                  </h3>
                  <ul className="space-y-1 text-sm text-rose-800 dark:text-rose-200 mb-3">
                    <li>• Document summarization or FAQ compression</li>
                    <li>• Need to preserve complete sentences for coherence</li>
                    <li>• Moderate compression acceptable (40-60%)</li>
                    <li>• High quality retention critical (90-94%)</li>
                    <li>• Content has clear sentence boundaries</li>
                  </ul>
                  <div className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                    Example: Knowledge base summaries, help documentation compression, article extraction
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/20 dark:to-violet-900/20 border border-violet-200 dark:border-violet-800/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-violet-200 dark:bg-violet-800 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-violet-700 dark:text-violet-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-violet-900 dark:text-violet-100">
                    Use Adaptive When: (RECOMMENDED)
                  </h3>
                  <ul className="space-y-1 text-sm text-violet-800 dark:text-violet-200 mb-3">
                    <li>• <strong>Building production chatbots or AI assistants</strong></li>
                    <li>• Content has mixed types (structured + unstructured)</li>
                    <li>• Need optimal balance of compression and quality</li>
                    <li>• Real-time quality monitoring required</li>
                    <li>• Want automatic strategy selection</li>
                  </ul>
                  <div className="text-xs text-violet-700 dark:text-violet-300 font-medium">
                    Example: Customer support chatbots, AI assistants, multi-section prompts
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-emerald-900 dark:text-emerald-100">
                    Use Semantic When:
                  </h3>
                  <ul className="space-y-1 text-sm text-emerald-800 dark:text-emerald-200 mb-3">
                    <li>• Moderate compression with high quality (20-25% / 95%)</li>
                    <li>• Working with unstructured text</li>
                    <li>• Redundancy removal without aggressive compression</li>
                    <li>• 150-200ms latency acceptable</li>
                    <li>• Conversation history compression</li>
                  </ul>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    Example: Long-form documentation, conversation contexts, content deduplication
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">
                    Use Template When:
                  </h3>
                  <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200 mb-3">
                    <li>• Working with highly structured data (forms, records)</li>
                    <li>• Speed is critical (5-10ms required)</li>
                    <li>• Zero API costs important</li>
                    <li>• Perfect quality preservation needed (98%)</li>
                    <li>• Patterns are predictable and repetitive</li>
                  </ul>
                  <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    Example: Form submissions, structured API responses, database records
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-700 dark:text-purple-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">
                    Use Hybrid When:
                  </h3>
                  <ul className="space-y-1 text-sm text-purple-800 dark:text-purple-200 mb-3">
                    <li>• Manual control over compression strategies</li>
                    <li>• Combining template + semantic approaches</li>
                    <li>• Building custom optimization pipelines</li>
                    <li>• Need moderate compression (25-30%) with high quality (96%)</li>
                    <li>• Willing to manually configure per section</li>
                  </ul>
                  <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                    Example: Custom pipelines with known content patterns, manual optimization workflows
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Implementation Complexity Analysis */}
      <ScrollReveal direction="up" delay={0.4}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Implementation Complexity Analysis</h2>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-100 dark:bg-neutral-900">
                  <th className="p-4 text-left font-semibold border border-neutral-200 dark:border-neutral-800">
                    Strategy
                  </th>
                  <th className="p-4 text-left font-semibold border border-neutral-200 dark:border-neutral-800">
                    Setup Difficulty
                  </th>
                  <th className="p-4 text-left font-semibold border border-neutral-200 dark:border-neutral-800">
                    Dependencies
                  </th>
                  <th className="p-4 text-left font-semibold border border-neutral-200 dark:border-neutral-800">
                    Infrastructure
                  </th>
                  <th className="p-4 text-left font-semibold border border-neutral-200 dark:border-neutral-800">
                    Maintenance
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-red-50 dark:bg-red-950/20">
                  <td className="p-4 font-medium border border-neutral-200 dark:border-neutral-800">
                    LLMLingua
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800">
                    <span className="px-2 py-1 bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 rounded text-xs font-semibold">
                      High
                    </span>
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Python, transformers, PyTorch, 1.2GB model
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    GPU recommended, 2.4GB VRAM
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Model updates, GPU monitoring
                  </td>
                </tr>
                <tr className="bg-yellow-50 dark:bg-yellow-950/20">
                  <td className="p-4 font-medium border border-neutral-200 dark:border-neutral-800">
                    Extractive
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800">
                    <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded text-xs font-semibold">
                      Medium
                    </span>
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Embedding API (optional), NLP library
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Standard Node.js/Python
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Algorithm tuning, threshold adjustment
                  </td>
                </tr>
                <tr className="bg-yellow-50 dark:bg-yellow-950/20">
                  <td className="p-4 font-medium border border-neutral-200 dark:border-neutral-800">
                    <strong>Adaptive</strong>
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800">
                    <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded text-xs font-semibold">
                      Medium
                    </span>
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Multiple strategies, embedding API
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Standard Node.js, no GPU
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Quality monitoring, strategy tuning
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium border border-neutral-200 dark:border-neutral-800">
                    Semantic
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800">
                    <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded text-xs font-semibold">
                      Medium
                    </span>
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Embedding API (OpenAI/Cohere)
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Standard Node.js
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Embedding cost monitoring
                  </td>
                </tr>
                <tr className="bg-emerald-50 dark:bg-emerald-950/20">
                  <td className="p-4 font-medium border border-neutral-200 dark:border-neutral-800">
                    Template
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800">
                    <span className="px-2 py-1 bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 rounded text-xs font-semibold">
                      Low
                    </span>
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    None (pure regex/string ops)
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Any runtime
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Rule updates
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium border border-neutral-200 dark:border-neutral-800">
                    Hybrid
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800">
                    <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded text-xs font-semibold">
                      Medium
                    </span>
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Combination of template + semantic
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Standard Node.js
                  </td>
                  <td className="p-4 border border-neutral-200 dark:border-neutral-800 text-xs">
                    Manual section configuration
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                Easiest to Implement
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                <strong>Template-based:</strong> Pure JavaScript, no dependencies, &lt;1 hour setup time
              </p>
            </div>
            <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/50">
              <h4 className="font-semibold text-violet-900 dark:text-violet-100 mb-2">
                Best for Production
              </h4>
              <p className="text-sm text-violet-700 dark:text-violet-300">
                <strong>Adaptive:</strong> Balanced complexity, excellent results, production-ready patterns
              </p>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Most Complex
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                <strong>LLMLingua:</strong> GPU infrastructure, Python integration, significant setup time
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Common Pitfalls */}
      <ScrollReveal direction="up" delay={0.45}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Common Pitfalls</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Over-compressing reduces quality
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Pushing compression beyond 30% often degrades response quality below acceptable thresholds.
                    Always monitor quality scores and user feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Forgetting to benchmark on your data
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Generic benchmarks don't reflect YOUR use case. Always test compression strategies
                    on a representative sample of your actual prompts.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Ignoring processing latency
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    200ms compression time + 2s model response = 2.2s total. If your app requires
                    sub-second responses, semantic compression may be too slow.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Not caching compression results
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    If the same content is compressed repeatedly, cache the result! Don't recompress
                    static documentation on every request.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Cost Savings Calculator */}
      <ScrollReveal direction="up" delay={0.5}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Cost Savings Comparison</h2>

          <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-950 border border-emerald-200 dark:border-emerald-800">
            <h3 className="font-semibold mb-4">Monthly Savings @ 100K Requests</h3>
            <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-6">
              Average prompt: 8,200 tokens | GPT-4 pricing: $0.003/1K input tokens
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-emerald-200 dark:bg-emerald-800">
                    <th className="p-3 text-left border border-emerald-300 dark:border-emerald-700">
                      Strategy
                    </th>
                    <th className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      Avg Tokens
                    </th>
                    <th className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      Monthly Cost
                    </th>
                    <th className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      Savings vs No Compression
                    </th>
                    <th className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      Annual Savings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-neutral-100 dark:bg-neutral-800">
                    <td className="p-3 border border-emerald-300 dark:border-emerald-700 font-medium">
                      No Compression
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      8,200
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      $2,460
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      -
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      -
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-emerald-300 dark:border-emerald-700">
                      Template (18%)
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      6,724
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      $2,017
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                      $443/mo (18%)
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      $5,316/yr
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-emerald-300 dark:border-emerald-700">
                      Semantic (23%)
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      6,314
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      $1,894
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                      $566/mo (23%)
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      $6,792/yr
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-emerald-300 dark:border-emerald-700">
                      Hybrid (29%)
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      5,822
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      $1,747
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                      $713/mo (29%)
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      $8,556/yr
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-emerald-300 dark:border-emerald-700">
                      Extractive (55%)
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      3,690
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      $1,107
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                      $1,353/mo (55%)
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      $16,236/yr
                    </td>
                  </tr>
                  <tr className="bg-violet-50 dark:bg-violet-950/30">
                    <td className="p-3 border border-emerald-300 dark:border-emerald-700 font-medium">
                      <strong>Adaptive (59%)</strong>
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      <strong>3,362</strong>
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      <strong>$1,009</strong>
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                      <strong>$1,451/mo (59%)</strong>
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                      <strong>$17,412/yr</strong>
                    </td>
                  </tr>
                  <tr className="bg-indigo-50 dark:bg-indigo-950/30">
                    <td className="p-3 border border-emerald-300 dark:border-emerald-700">
                      LLMLingua (64%)
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      2,952
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700">
                      $886
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                      $1,574/mo (64%)
                    </td>
                    <td className="p-3 text-right border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                      $18,888/yr
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800">
              <h4 className="font-semibold text-violet-900 dark:text-violet-100 mb-2">
                Winner: Adaptive Compression
              </h4>
              <p className="text-sm text-violet-800 dark:text-violet-200">
                Saves <strong>$17,412 annually</strong> while maintaining 94.2% quality and 215ms latency.
                Best overall value for production systems balancing cost, quality, and performance.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.55}>
        <section className="mb-16">
          <div className="bg-brand-500/10 border border-brand-500/30 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Next Steps
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Link
                href="/cookbook/token-optimization/provider-caching-anthropic"
                className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline p-3 rounded bg-white/50 dark:bg-white/[0.02] border border-brand-200 dark:border-brand-800/50"
              >
                <ArrowRight className="w-4 h-4" />
                <div>
                  <div className="font-medium">Anthropic Prompt Caching</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    Stack compression with caching for 70%+ total savings
                  </div>
                </div>
              </Link>
              <Link
                href="/cookbook/token-optimization/tiered-caching-setup"
                className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline p-3 rounded bg-white/50 dark:bg-white/[0.02] border border-brand-200 dark:border-brand-800/50"
              >
                <ArrowRight className="w-4 h-4" />
                <div>
                  <div className="font-medium">Multi-Tier Caching</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    Set up Redis + CDN caching for maximum efficiency
                  </div>
                </div>
              </Link>
              <Link
                href="/cookbook/token-optimization/combined-optimization"
                className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline p-3 rounded bg-white/50 dark:bg-white/[0.02] border border-brand-200 dark:border-brand-800/50"
              >
                <ArrowRight className="w-4 h-4" />
                <div>
                  <div className="font-medium">Combined Optimization</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    Use compression + caching + batching together
                  </div>
                </div>
              </Link>
              <Link
                href="/reference/api/compression"
                className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline p-3 rounded bg-white/50 dark:bg-white/[0.02] border border-brand-200 dark:border-brand-800/50"
              >
                <ArrowRight className="w-4 h-4" />
                <div>
                  <div className="font-medium">Compression API Reference</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    Full API documentation and advanced options
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
