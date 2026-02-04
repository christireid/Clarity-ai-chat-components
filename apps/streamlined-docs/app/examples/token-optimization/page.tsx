'use client'

/**
 * Token Optimization Examples Page
 *
 * Interactive demos showcasing token optimization features:
 * - Real-time token budget monitoring
 * - Automatic context trimming
 * - Cost estimation across models
 * - Live token counting
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Gauge,
  Scissors,
  Coins,
  Calculator,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { TokenBudgetDemo } from '@/components/Demos/TokenBudgetDemo'
import { AutoTrimDemo } from '@/components/Demos/AutoTrimDemo'
import { CostEstimationDemo } from '@/components/Demos/CostEstimationDemo'
import { TokenCounterDemo } from '@/components/Demos/TokenCounterDemo'

interface DemoSection {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType
  complexity: 'Basic' | 'Intermediate' | 'Advanced'
  features: string[]
}

const demos: DemoSection[] = [
  {
    id: 'token-counter',
    title: 'Token Counter',
    description:
      'Count tokens in real-time as you type. See character, word, and token statistics with instant updates.',
    icon: Calculator,
    component: TokenCounterDemo,
    complexity: 'Basic',
    features: [
      'Real-time counting',
      'Character & word stats',
      'Model comparison',
      'Debounced updates',
    ],
  },
  {
    id: 'budget-monitor',
    title: 'Token Budget Monitor',
    description:
      'Visualize token usage with threshold warnings. Track context utilization and receive alerts at warning and critical levels.',
    icon: Gauge,
    component: TokenBudgetDemo,
    complexity: 'Intermediate',
    features: [
      'Visual budget bar',
      'Warning thresholds',
      'Real-time metrics',
      'Status indicators',
    ],
  },
  {
    id: 'auto-trim',
    title: 'Auto-Trim Context',
    description:
      'Automatically manage context by removing older messages when approaching limits. Priority-based trimming keeps important content.',
    icon: Scissors,
    component: AutoTrimDemo,
    complexity: 'Advanced',
    features: [
      'Automatic trimming',
      'Priority system',
      'Protected messages',
      'Trim history',
    ],
  },
  {
    id: 'cost-estimation',
    title: 'Cost Estimation',
    description:
      'Calculate API costs across different models. Compare pricing and find the most cost-effective option for your use case.',
    icon: Coins,
    component: CostEstimationDemo,
    complexity: 'Intermediate',
    features: [
      'Multi-model comparison',
      'Monthly cost projection',
      'Savings calculator',
      'Real-time estimates',
    ],
  },
]

const complexityColors = {
  Basic: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Intermediate:
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Advanced:
    'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
}

export default function TokenOptimizationExamplesPage() {
  const [activeDemo, setActiveDemo] = React.useState<string>(demos[0].id)
  const activeDemoData = demos.find((d) => d.id === activeDemo) || demos[0]
  const ActiveDemoComponent = activeDemoData.component

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: durations.moderate,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                  Interactive
                </span>
                <span className="text-xs text-muted-foreground">
                  @clarity-chat/token-optimization
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Token Optimization Examples
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore interactive demos showcasing token management, budget monitoring,
            automatic trimming, and cost estimation. All demos run entirely in your
            browser with real-time updates.
          </p>
        </motion.header>

        {/* Demo Grid Layout */}
        <div className="grid lg:grid-cols-[300px,1fr] gap-8">
          {/* Sidebar - Demo Selector */}
          <aside className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              Select Demo
            </h2>
            {demos.map((demo, index) => {
              const Icon = demo.icon
              return (
                <motion.button
                  key={demo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveDemo(demo.id)}
                  className={cn(
                    'w-full text-left p-4 rounded-lg border transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-brand-500',
                    activeDemo === demo.id
                      ? 'bg-brand-500/10 border-brand-500 shadow-sm'
                      : 'bg-muted/20 border-border/50 hover:border-brand-500/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'p-2 rounded-md shrink-0',
                        activeDemo === demo.id
                          ? 'bg-brand-500/20'
                          : 'bg-muted/50'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-5 h-5',
                          activeDemo === demo.id
                            ? 'text-brand-600 dark:text-brand-400'
                            : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={cn(
                          'font-semibold text-sm mb-1',
                          activeDemo === demo.id
                            ? 'text-brand-700 dark:text-brand-300'
                            : 'text-foreground'
                        )}
                      >
                        {demo.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {demo.description}
                      </p>
                      <div
                        className={cn(
                          'mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium border',
                          complexityColors[demo.complexity]
                        )}
                      >
                        {demo.complexity}
                      </div>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </aside>

          {/* Main Demo Area */}
          <main className="space-y-6">
            {/* Demo Header */}
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {activeDemoData.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {activeDemoData.description}
                  </p>
                </div>
                <div
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium border shrink-0',
                    complexityColors[activeDemoData.complexity]
                  )}
                >
                  {activeDemoData.complexity}
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {activeDemoData.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 rounded-md bg-muted/30 border border-border/50 text-xs text-muted-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Demo Component */}
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-6 rounded-lg bg-muted/30 border border-border/50"
            >
              <ActiveDemoComponent />
            </motion.div>

            {/* Implementation Link */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
              <div>
                <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-1">
                  Ready to implement?
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Check out the API reference for implementation details
                </p>
              </div>
              <Link
                href="/reference/hooks/use-token-optimization"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md',
                  'bg-blue-600 dark:bg-blue-500 text-white',
                  'hover:bg-blue-700 dark:hover:bg-blue-600',
                  'transition-colors font-medium text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              >
                View API Docs
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </main>
        </div>

        {/* Use Cases Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 space-y-6"
        >
          <h2 className="text-2xl font-bold text-foreground">Common Use Cases</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Production Chatbots',
                description:
                  'Monitor token usage in real-time to prevent context overflow and manage API costs effectively.',
                features: [
                  'Real-time budget monitoring',
                  'Cost tracking per conversation',
                  'Automatic context trimming',
                ],
              },
              {
                title: 'Content Generation',
                description:
                  'Track token counts for prompts and outputs to optimize generation quality and costs.',
                features: [
                  'Pre-generation cost estimation',
                  'Token-aware prompt building',
                  'Model cost comparison',
                ],
              },
              {
                title: 'Multi-Turn Conversations',
                description:
                  'Maintain conversation history while staying within context limits through smart trimming.',
                features: [
                  'Priority-based message retention',
                  'System prompt protection',
                  'Automatic history management',
                ],
              },
              {
                title: 'Cost Optimization',
                description:
                  'Compare costs across different models and find the most economical option for your workload.',
                features: [
                  'Cross-model cost analysis',
                  'Monthly projection',
                  'Savings identification',
                ],
              },
            ].map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="p-6 rounded-lg bg-muted/30 border border-border/50"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {useCase.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {useCase.description}
                </p>
                <ul className="space-y-1">
                  {useCase.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-xs text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-brand-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Related Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-lg bg-muted/30 border border-border/50"
        >
          <h2 className="text-xl font-bold text-foreground mb-4">Learn More</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                title: 'API Reference',
                href: '/reference/hooks/use-token-optimization',
                description: 'Complete hook documentation',
              },
              {
                title: 'Getting Started',
                href: '/guides/quickstart',
                description: 'Setup and basic usage',
              },
              {
                title: 'Best Practices',
                href: '/guides/best-practices',
                description: 'Optimization tips & patterns',
              },
            ].map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={cn(
                  'group p-4 rounded-lg border border-border/50',
                  'hover:border-brand-500/30 hover:shadow-sm transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-brand-500'
                )}
              >
                <h3 className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
                  {link.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
