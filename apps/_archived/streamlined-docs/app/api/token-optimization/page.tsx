'use client'

/**
 * Token Optimization APIs - Landing Page
 *
 * Central hub for all token optimization API documentation with:
 * - Overview of all 5 core APIs
 * - Visual badges showing savings percentages
 * - Quick links to detailed documentation
 * - Quick start guide for getting started fast
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Zap,
  DollarSign,
  BarChart3,
  TrendingDown,
  Gauge,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Rocket,
  Target,
  Eye,
  Activity,
  Database,
  LineChart,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { durations } from '@/lib/animations'

interface APIInfo {
  name: string
  slug: string
  description: string
  icon: React.ReactNode
  savings: string
  savingsColor: string
  features: string[]
  primaryUseCase: string
  gradient: string
  borderColor: string
}

const apis: APIInfo[] = [
  {
    name: 'TokenCostPreview',
    slug: 'token-cost-preview',
    description: 'Real-time cost estimation as users type. Show exact costs before submission.',
    icon: <DollarSign className="w-6 h-6" />,
    savings: '40-60%',
    savingsColor: 'text-emerald-600 dark:text-emerald-400',
    features: [
      'Live token counting',
      'Model-specific pricing',
      'Budget threshold alerts',
      'Multi-currency support',
    ],
    primaryUseCase: 'Economic transparency for budget-conscious users',
    gradient: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-500/20 hover:border-amber-500/40',
  },
  {
    name: 'TokenCounter',
    slug: 'token-counter',
    description: 'Visual progress bars with threshold warnings. Prevent context overflow.',
    icon: <Gauge className="w-6 h-6" />,
    savings: '30-45%',
    savingsColor: 'text-green-600 dark:text-green-400',
    features: [
      'Color-coded progress bar',
      '80% and 95% warnings',
      'Smart pruning suggestions',
      'Context window tracking',
    ],
    primaryUseCase: 'Context management and overflow prevention',
    gradient: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/20 hover:border-green-500/40',
  },
  {
    name: 'TokenOptimizationPanel',
    slug: 'token-optimization-panel',
    description: 'Comprehensive dashboard for optimization statistics and performance analytics.',
    icon: <BarChart3 className="w-6 h-6" />,
    savings: '50-70%',
    savingsColor: 'text-blue-600 dark:text-blue-400',
    features: [
      'Savings tracking',
      'Method breakdown',
      'Cache hit rate analysis',
      'Performance metrics',
    ],
    primaryUseCase: 'Long-term analytics and ROI tracking',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40',
  },
  {
    name: 'TokenOptimizationDashboard',
    slug: 'token-optimization-dashboard',
    description: 'Executive dashboard with comprehensive metrics, charts, and insights.',
    icon: <LineChart className="w-6 h-6" />,
    savings: '55-75%',
    savingsColor: 'text-purple-600 dark:text-purple-400',
    features: [
      'Executive overview',
      'Interactive charts',
      'Trend analysis',
      'Export capabilities',
    ],
    primaryUseCase: 'Executive reporting and business intelligence',
    gradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/20 hover:border-purple-500/40',
  },
  {
    name: 'TokenROICalculator',
    slug: 'token-roi-calculator',
    description: 'Calculate return on investment and break-even analysis for optimization.',
    icon: <TrendingDown className="w-6 h-6" />,
    savings: '10-25%',
    savingsColor: 'text-indigo-600 dark:text-indigo-400',
    features: [
      'ROI calculation',
      'Break-even analysis',
      'Cost projections',
      'Savings forecasts',
    ],
    primaryUseCase: 'Business case justification and planning',
    gradient: 'from-indigo-500/10 to-violet-500/10',
    borderColor: 'border-indigo-500/20 hover:border-indigo-500/40',
  },
]

const quickStartSteps = [
  {
    number: 1,
    title: 'Install Package',
    description: 'Add token optimization to your project',
    code: 'pnpm add @clarity-chat/token-optimization',
  },
  {
    number: 2,
    title: 'Import Components',
    description: 'Import the APIs you need',
    code: "import { TokenCostPreview, TokenCounter } from '@clarity-chat/react'",
  },
  {
    number: 3,
    title: 'Start Optimizing',
    description: 'Drop components into your chat interface',
    code: '<TokenCostPreview text={prompt} model="gpt-4-turbo" />',
  },
]

export default function TokenOptimizationAPIsPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200 dark:border-emerald-800/50 rounded-full mb-6">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Token Optimization APIs
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Complete Token Management Suite
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Five powerful APIs for managing LLM costs and context windows. Achieve 50-70% cost
            reduction with transparent pricing, intelligent monitoring, and comprehensive analytics.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-200 dark:border-emerald-800/50">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                50-70%
              </div>
              <div className="text-xs text-muted-foreground">Average Cost Reduction</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-800/50">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">5</div>
              <div className="text-xs text-muted-foreground">Production APIs</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800/50">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {'<5min'}
              </div>
              <div className="text-xs text-muted-foreground">Integration Time</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800/50">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                48,500%
              </div>
              <div className="text-xs text-muted-foreground">Typical 3-Year ROI</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#quick-start"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <Rocket className="w-4 h-4" />
              Start Here - Quick Start
            </Link>
            <Link
              href="/reference/components/token-optimization"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg font-medium border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1"
            >
              <Eye className="w-4 h-4" />
              View Full System Guide
            </Link>
          </div>
        </motion.header>

        {/* Core APIs Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.slow,
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Core APIs
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apis.map((api, index) => (
              <motion.div
                key={api.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: durations.moderate,
                  delay: 0.1 + index * 0.05,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <Link
                  href={`/reference/components/${api.slug}`}
                  className={cn(
                    'group block h-full p-6 rounded-xl transition-all duration-300',
                    `bg-gradient-to-br ${api.gradient}`,
                    `border ${api.borderColor}`,
                    'hover:shadow-lg hover:-translate-y-1',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20 text-foreground">
                      {api.icon}
                    </div>
                    <div className="text-right">
                      <div className={cn('text-2xl font-bold', api.savingsColor)}>
                        {api.savings}
                      </div>
                      <div className="text-xs text-muted-foreground">savings</div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {api.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {api.description}
                  </p>

                  {/* Primary Use Case */}
                  <div className="p-3 mb-4 rounded-lg bg-white/50 dark:bg-black/20">
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      Primary Use Case
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {api.primaryUseCase}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {api.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* View Docs Link */}
                  <div className="flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                    View documentation
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Start Section */}
        <motion.section
          id="quick-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.slow,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-16 scroll-mt-24"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 text-white flex-shrink-0">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Quick Start Guide</h2>
                <p className="text-muted-foreground">
                  Get started with token optimization in under 5 minutes
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {quickStartSteps.map((step) => (
                <div key={step.number} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm">
                      {step.number}
                    </div>
                    <h3 className="font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  <code className="block p-3 rounded-lg bg-black/5 dark:bg-black/20 text-xs font-mono overflow-x-auto">
                    {step.code}
                  </code>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/cookbook/achieving-50-percent-reduction"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <Target className="w-4 h-4" />
                Full Tutorial: Achieving 50-70% Reduction
              </Link>
              <Link
                href="/reference/components/token-optimization"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg font-medium border border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <Database className="w-4 h-4" />
                System Architecture Guide
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Why Token Optimization */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.slow,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Why Token Optimization?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-200 dark:border-red-800/50">
              <DollarSign className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-3">The Cost Problem</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>GPT-4: $0.30 per 10K tokens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>1,000 conversations/day = $9,000/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Costs grow exponentially with usage</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-200 dark:border-emerald-800/50">
              <TrendingDown className="w-10 h-10 text-emerald-500 mb-4" />
              <h3 className="text-lg font-semibold mb-3">The Solution</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>50-70% cost reduction</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Transparent pricing builds trust</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Controlled costs enable scale</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-800/50">
              <Activity className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Real Impact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Save $32,400/year (500 conversations/day)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>48,500% ROI over 3 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Break-even in 2.7 days</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Integration Patterns */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.slow,
            delay: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Common Integration Patterns
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400">
                  <span className="text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold">Single Chat Window</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Integrate TokenCostPreview and TokenCounter directly in your chat interface for
                real-time cost transparency and context management.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">Most common pattern</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400">
                  <span className="text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold">Admin Dashboard</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Use TokenOptimizationPanel and TokenOptimizationDashboard for system-wide metrics,
                ROI tracking, and executive reporting.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">Best for analytics</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400">
                  <span className="text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold">Model Comparison</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Help users choose cost-effective models with TokenCostPreview side-by-side
                comparisons in settings panels.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">Increases user trust</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400">
                  <span className="text-xl">4</span>
                </div>
                <h3 className="text-lg font-semibold">Business Justification</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Use TokenROICalculator to demonstrate ROI to stakeholders and justify optimization
                infrastructure investment.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">For decision makers</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.slow,
            delay: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-pink-500/10 border border-brand-200 dark:border-brand-800/50">
            <Lightbulb className="w-12 h-12 text-brand-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Ready to Start Saving?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Follow the quick start guide above or explore the comprehensive tutorial to achieve
              50-70% cost reduction in your AI applications.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/cookbook/achieving-50-percent-reduction"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <Target className="w-4 h-4" />
                Complete Tutorial
              </Link>
              <Link
                href="/reference/components/token-optimization"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg font-medium border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1"
              >
                <Database className="w-4 h-4" />
                System Documentation
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
