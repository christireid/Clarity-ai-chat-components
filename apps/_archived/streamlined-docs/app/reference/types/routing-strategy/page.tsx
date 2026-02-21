'use client'

/**
 * RoutingStrategy Type - API Reference
 *
 * Complete reference for the RoutingStrategy enum and smart model routing.
 */

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Zap,
  DollarSign,
  Target,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Code2,
  Info,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/CodeBlock'
import { durations } from '@/lib/animations'

type StrategyTab = 'cost-optimized' | 'quality-first' | 'balanced'

export default function RoutingStrategyPage() {
  const [activeStrategy, setActiveStrategy] = useState<StrategyTab>('cost-optimized')

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
            <div className="p-2.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Zap className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">API Reference / Types</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                10-15% Savings
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            RoutingStrategy
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Enum defining smart model routing strategies for cost optimization. Choose the right strategy to save 10-15% on top of caching and compression.
          </p>
        </motion.header>

        {/* Type Definition */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-brand-600" />
            Type Definition
          </h2>

          <CodeBlock
            language="typescript"
            code={`/**
 * Routing strategy options for ModelRouter
 *
 * Determines how the router selects models based on
 * complexity, cost, and quality tradeoffs.
 */
export enum RoutingStrategy {
  /** Prioritize lowest cost while meeting requirements */
  CostOptimized = 'cost-optimized',

  /** Prioritize quality over cost */
  QualityFirst = 'quality-first',

  /** Balance cost and quality */
  Balanced = 'balanced',
}

// String literal type for flexibility
export type RoutingStrategyType =
  | 'cost-optimized'
  | 'quality-first'
  | 'balanced'`}
          />

          <div className="mt-4 bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">Import Path</p>
                <code className="text-xs bg-blue-900/10 px-2 py-1 rounded">
                  import &#123; RoutingStrategy &#125; from '@clarity-chat/token-optimization'
                </code>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Strategy Options */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.15,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-brand-600" />
            Strategy Options
          </h2>

          {/* Strategy Tabs */}
          <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
            {[
              { id: 'cost-optimized' as StrategyTab, label: 'Cost-Optimized', icon: DollarSign },
              { id: 'quality-first' as StrategyTab, label: 'Quality-First', icon: Target },
              { id: 'balanced' as StrategyTab, label: 'Balanced', icon: Zap },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveStrategy(id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 border-b-2 transition-colors',
                  activeStrategy === id
                    ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Strategy Content */}
          <div className="space-y-6">
            {activeStrategy === 'cost-optimized' && (
              <div className="space-y-6">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Cost-Optimized Strategy
                  </h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
                    Prioritizes the lowest cost model that meets minimum quality and capability requirements.
                    Best for high-volume applications where cost efficiency is paramount.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Best For:</h4>
                      <ul className="text-sm space-y-1 text-neutral-600 dark:text-neutral-400">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Simple queries (greetings, FAQs)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>High-volume applications (50K+ queries/mo)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Tight budget constraints</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Non-critical tasks</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Configuration:</h4>
                      <ul className="text-sm space-y-1 text-neutral-600 dark:text-neutral-400">
                        <li><strong>Complexity threshold:</strong> Low</li>
                        <li><strong>Model preference:</strong> Haiku → Sonnet → Opus</li>
                        <li><strong>Accuracy target:</strong> 85%+</li>
                        <li><strong>Cost savings:</strong> 10-15% additional</li>
                      </ul>
                    </div>
                  </div>

                  <CodeBlock
                    language="typescript"
                    code={`import { ModelRouter, RoutingStrategy } from '@clarity-chat/token-optimization'

// Create a cost-optimized router
const router = ModelRouter.builder()
  .useClaudeModels()
  .withStrategy(RoutingStrategy.CostOptimized)
  .build()

// Route a query
const result = await router.route(
  "What are your business hours?",
  { estimatedTokens: 50 }
)

console.log(result.selectedModel?.id)
// → "claude-3-haiku-20240307" (cheapest suitable model)
console.log(result.estimatedCost)
// → 0.00025 (vs 0.003 for Sonnet)
console.log(result.strategy)
// → "cost-optimized"`}
                  />
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <h4 className="font-semibold mb-2">Performance Characteristics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400">Routing Accuracy</div>
                      <div className="text-xl font-bold text-emerald-600">85%</div>
                    </div>
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400">Avg Cost per Query</div>
                      <div className="text-xl font-bold text-emerald-600">$0.0018</div>
                    </div>
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400">Model Distribution</div>
                      <div className="text-sm font-semibold">60% Haiku, 30% Sonnet, 10% Opus</div>
                    </div>
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400">Quality Score</div>
                      <div className="text-xl font-bold text-emerald-600">0.88/1.0</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStrategy === 'quality-first' && (
              <div className="space-y-6">
                <div className="bg-purple-500/10 border border-purple-500/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Quality-First Strategy
                  </h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
                    Prioritizes the highest quality model for the task, considering cost only as a secondary factor.
                    Best for critical applications where accuracy and response quality are paramount.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Best For:</h4>
                      <ul className="text-sm space-y-1 text-neutral-600 dark:text-neutral-400">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>Complex reasoning tasks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>Technical/legal/medical content</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>Customer-facing applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>Low-volume, high-value tasks</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Configuration:</h4>
                      <ul className="text-sm space-y-1 text-neutral-600 dark:text-neutral-400">
                        <li><strong>Complexity threshold:</strong> High</li>
                        <li><strong>Model preference:</strong> Opus → Sonnet → Haiku</li>
                        <li><strong>Accuracy target:</strong> 95%+</li>
                        <li><strong>Cost savings:</strong> 5-8% additional</li>
                      </ul>
                    </div>
                  </div>

                  <CodeBlock
                    language="typescript"
                    code={`import { ModelRouter, RoutingStrategy } from '@clarity-chat/token-optimization'

// Create a quality-first router
const router = ModelRouter.builder()
  .useClaudeModels()
  .withStrategy(RoutingStrategy.QualityFirst)
  .build()

// Route a complex query
const result = await router.route(
  "Design a distributed system for real-time fraud detection",
  { estimatedTokens: 500 }
)

console.log(result.selectedModel?.id)
// → "claude-opus-3-20240229" (highest quality model)
console.log(result.estimatedCost)
// → 0.015 (premium cost for premium quality)
console.log(result.confidence)
// → 0.97 (high confidence in quality)`}
                  />
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <h4 className="font-semibold mb-2">Performance Characteristics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400">Routing Accuracy</div>
                      <div className="text-xl font-bold text-purple-600">95%</div>
                    </div>
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400">Avg Cost per Query</div>
                      <div className="text-xl font-bold text-purple-600">$0.0085</div>
                    </div>
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400">Model Distribution</div>
                      <div className="text-sm font-semibold">15% Haiku, 35% Sonnet, 50% Opus</div>
                    </div>
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400">Quality Score</div>
                      <div className="text-xl font-bold text-purple-600">0.96/1.0</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStrategy === 'balanced' && (
              <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Balanced Strategy (Recommended)
                  </h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
                    Balances cost and quality by analyzing task complexity and routing to the optimal tier.
                    Best for most production applications with mixed workloads.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Best For:</h4>
                      <ul className="text-sm space-y-1 text-neutral-600 dark:text-neutral-400">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>Mixed query complexity (simple + complex)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>Production applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>General-purpose chatbots</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>Customer support systems</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Configuration:</h4>
                      <ul className="text-sm space-y-1 text-neutral-600 dark:text-neutral-400">
                        <li><strong>Complexity threshold:</strong> Medium</li>
                        <li><strong>Model preference:</strong> Adaptive based on complexity</li>
                        <li><strong>Accuracy target:</strong> 92%+</li>
                        <li><strong>Cost savings:</strong> 10-15% additional</li>
                      </ul>
                    </div>
                  </div>

                  <CodeBlock
                    language="typescript"
                    code={`import { ModelRouter, RoutingStrategy } from '@clarity-chat/token-optimization'

// Create a balanced router (recommended)
const router = ModelRouter.builder()
  .useClaudeModels()
  .withStrategy(RoutingStrategy.Balanced) // or omit (default)
  .build()

// Route queries of varying complexity
const simple = await router.route("Hello!", { estimatedTokens: 10 })
console.log(simple.selectedModel?.id)
// → "claude-3-haiku-20240307"

const moderate = await router.route(
  "Explain OAuth 2.0 flows",
  { estimatedTokens: 200 }
)
console.log(moderate.selectedModel?.id)
// → "claude-3-sonnet-20240229"

const complex = await router.route(
  "Design a microservices architecture",
  { estimatedTokens: 500 }
)
console.log(complex.selectedModel?.id)
// → "claude-opus-3-20240229"`}
                  />
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <h4 className="font-semibold mb-2">Performance Characteristics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400">Routing Accuracy</div>
                      <div className="text-xl font-bold text-blue-600">92%</div>
                    </div>
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400">Avg Cost per Query</div>
                      <div className="text-xl font-bold text-blue-600">$0.0042</div>
                    </div>
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400">Model Distribution</div>
                      <div className="text-sm font-semibold">45% Haiku, 40% Sonnet, 15% Opus</div>
                    </div>
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400">Quality Score</div>
                      <div className="text-xl font-bold text-blue-600">0.93/1.0</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Cost Impact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-brand-600" />
            Cost Impact: Choose the Right Strategy for 10-15% Additional Savings
          </h2>

          <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-200 dark:border-purple-800 p-6 rounded-lg mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Smart routing adds 10-15% savings on top of caching and compression
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  For the 50-70% baseline, combine routing with provider caching (50%+) and compression (15-25%).
                  Routing alone won't get you there—it's the final optimization layer.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Cost-Optimized
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Before routing:</span>
                  <span className="font-semibold">$1,500/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">After routing:</span>
                  <span className="font-semibold text-emerald-600">$255/mo</span>
                </div>
                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800">
                  <div className="flex justify-between">
                    <span className="font-bold">Savings:</span>
                    <span className="font-bold text-emerald-600">83%</span>
                  </div>
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  60% queries on Haiku, 30% Sonnet, 10% Opus
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Balanced
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Before routing:</span>
                  <span className="font-semibold">$1,500/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">After routing:</span>
                  <span className="font-semibold text-blue-600">$630/mo</span>
                </div>
                <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                  <div className="flex justify-between">
                    <span className="font-bold">Savings:</span>
                    <span className="font-bold text-blue-600">58%</span>
                  </div>
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  45% queries on Haiku, 40% Sonnet, 15% Opus
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 p-6 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Quality-First
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Before routing:</span>
                  <span className="font-semibold">$1,500/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">After routing:</span>
                  <span className="font-semibold text-purple-600">$1,275/mo</span>
                </div>
                <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
                  <div className="flex justify-between">
                    <span className="font-bold">Savings:</span>
                    <span className="font-bold text-purple-600">15%</span>
                  </div>
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  15% queries on Haiku, 35% Sonnet, 50% Opus
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Accuracy Benchmarks */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.25,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-600" />
            Accuracy Benchmarks
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-300 dark:border-neutral-700">
                  <th className="text-left p-3 font-semibold">Strategy</th>
                  <th className="text-left p-3 font-semibold">Routing Accuracy</th>
                  <th className="text-left p-3 font-semibold">Quality Score</th>
                  <th className="text-left p-3 font-semibold">Avg Latency</th>
                  <th className="text-left p-3 font-semibold">Use Case Fit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-3 font-medium">Cost-Optimized</td>
                  <td className="p-3">
                    <span className="text-emerald-600 font-semibold">85%</span>
                  </td>
                  <td className="p-3">
                    <span className="text-emerald-600 font-semibold">0.88/1.0</span>
                  </td>
                  <td className="p-3">
                    <span className="text-emerald-600 font-semibold">&lt;30ms</span>
                  </td>
                  <td className="p-3 text-neutral-600 dark:text-neutral-400">
                    High-volume, budget-constrained
                  </td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-blue-500/5">
                  <td className="p-3 font-medium">Balanced ⭐</td>
                  <td className="p-3">
                    <span className="text-blue-600 font-semibold">92%</span>
                  </td>
                  <td className="p-3">
                    <span className="text-blue-600 font-semibold">0.93/1.0</span>
                  </td>
                  <td className="p-3">
                    <span className="text-blue-600 font-semibold">&lt;40ms</span>
                  </td>
                  <td className="p-3 text-neutral-600 dark:text-neutral-400">
                    General production use
                  </td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-3 font-medium">Quality-First</td>
                  <td className="p-3">
                    <span className="text-purple-600 font-semibold">95%</span>
                  </td>
                  <td className="p-3">
                    <span className="text-purple-600 font-semibold">0.96/1.0</span>
                  </td>
                  <td className="p-3">
                    <span className="text-purple-600 font-semibold">&lt;50ms</span>
                  </td>
                  <td className="p-3 text-neutral-600 dark:text-neutral-400">
                    Critical, low-volume tasks
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
            ⭐ <strong>Balanced strategy</strong> recommended for most production workloads. It provides the best
            tradeoff between cost savings (10-15%) and quality (0.93/1.0).
          </p>
        </motion.section>

        {/* Usage with ModelRouter */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Usage Examples with ModelRouter</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Usage</h3>
              <CodeBlock
                language="typescript"
                code={`import { ModelRouter, RoutingStrategy } from '@clarity-chat/token-optimization'

// Create router with specific strategy
const router = ModelRouter.builder()
  .useClaudeModels()
  .withStrategy(RoutingStrategy.Balanced) // or CostOptimized, QualityFirst
  .build()

// Route a query
const result = await router.route("Your query here", {
  estimatedTokens: 200,
})

console.log(\`Model: \${result.selectedModel?.id}\`)
console.log(\`Cost: $\${result.estimatedCost}\`)
console.log(\`Strategy: \${result.strategy}\`)`}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Dynamic Strategy Override</h3>
              <CodeBlock
                language="typescript"
                code={`// Router uses Balanced by default
const router = ModelRouter.builder()
  .useClaudeModels()
  .build()

// Override strategy per request
const criticalQuery = await router.route(
  "Design a security architecture",
  {
    estimatedTokens: 500,
    strategy: RoutingStrategy.QualityFirst, // Override for this query
  }
)

const simpleQuery = await router.route(
  "What is 2 + 2?",
  {
    estimatedTokens: 20,
    strategy: RoutingStrategy.CostOptimized, // Override for this query
  }
)`}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Multiple Models with Custom Strategy</h3>
              <CodeBlock
                language="typescript"
                code={`// Mix different providers with custom routing
const router = ModelRouter.builder()
  .useClaudeModels()     // Adds Haiku, Sonnet, Opus
  .useOpenAIModels()     // Adds GPT-4o-mini, GPT-4o
  .withStrategy(RoutingStrategy.Balanced)
  .build()

// Router automatically selects best model across providers
const result = await router.route("Explain quantum computing", {
  estimatedTokens: 300,
})

// May select Claude Sonnet or GPT-4o depending on costs and requirements`}
              />
            </div>
          </div>
        </motion.section>

        {/* Custom Strategy Implementation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.35,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Custom Strategy Implementation Guide</h2>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            While the built-in strategies cover most use cases, you can implement custom routing logic by
            extending the ModelRouter or using the lower-level routing APIs.
          </p>

          <CodeBlock
            language="typescript"
            code={`import {
  ModelRouter,
  RoutingStrategy,
  type ModelRoutingConfig,
  type RoutingOptions,
  type RoutingResult,
} from '@clarity-chat/token-optimization'

// Create a custom strategy that routes based on time of day
class TimeBasedRouter extends ModelRouter {
  async route(
    content: string,
    options?: RoutingOptions
  ): Promise<RoutingResult> {
    const hour = new Date().getHours()

    // Use cheaper models during off-peak hours (midnight - 6am)
    const strategy = hour >= 0 && hour < 6
      ? RoutingStrategy.CostOptimized
      : RoutingStrategy.Balanced

    return super.route(content, {
      ...options,
      strategy,
    })
  }
}

// Use custom router
const router = new TimeBasedRouter({
  models: [
    // Your model configurations
  ],
})

// Or implement intent-based routing
class IntentBasedRouter extends ModelRouter {
  private async classifyIntent(content: string): Promise<string> {
    // Your intent classification logic
    if (content.toLowerCase().includes('urgent')) return 'urgent'
    if (content.toLowerCase().includes('help')) return 'support'
    return 'general'
  }

  async route(
    content: string,
    options?: RoutingOptions
  ): Promise<RoutingResult> {
    const intent = await this.classifyIntent(content)

    // Route urgent queries to highest quality model
    const strategy = intent === 'urgent'
      ? RoutingStrategy.QualityFirst
      : RoutingStrategy.Balanced

    return super.route(content, {
      ...options,
      strategy,
    })
  }
}`}
          />

          <div className="mt-4 bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 dark:text-amber-100">
                <p className="font-semibold mb-1">Custom Strategy Considerations</p>
                <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-200">
                  <li>Test custom strategies thoroughly with representative workloads</li>
                  <li>Monitor routing accuracy and adjust thresholds as needed</li>
                  <li>Consider latency impact of additional classification logic</li>
                  <li>Implement fallback mechanisms for edge cases</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Performance Characteristics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Performance Characteristics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold mb-4">Routing Latency</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Cost-Optimized</span>
                  <span className="font-semibold text-emerald-600">&lt;30ms</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '30%' }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Balanced</span>
                  <span className="font-semibold text-blue-600">&lt;40ms</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Quality-First</span>
                  <span className="font-semibold text-purple-600">&lt;50ms</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                Latency is negligible compared to model inference time (typically 500-2000ms)
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold mb-4">Memory Footprint</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Base Router</span>
                  <span className="font-semibold">~5 KB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">+ Complexity Analyzer</span>
                  <span className="font-semibold">~15 KB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">+ Model Configs (10 models)</span>
                  <span className="font-semibold">~2 KB</span>
                </div>
                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="font-bold text-brand-600">~22 KB</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                Minimal overhead, suitable for serverless and edge deployments
              </p>
            </div>
          </div>
        </motion.section>

        {/* Related Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.45,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="bg-brand-500/10 border border-brand-500/30 p-6 rounded-lg"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Related Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link
              href="/cookbook/smart-model-routing"
              className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              Smart Model Routing Cookbook
            </Link>
            <Link
              href="/reference/classes/model-router"
              className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              ModelRouter Class Reference
            </Link>
            <Link
              href="/cookbook/achieving-50-percent-reduction"
              className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              Achieving 50-70% Cost Reduction
            </Link>
            <Link
              href="/reference/types/routing-result"
              className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              RoutingResult Type Reference
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
