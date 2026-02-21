'use client'

/**
 * BeforeAfterComparison Component - API Reference Documentation
 *
 * A visual comparison component for displaying optimization results with
 * animated transitions, percentage savings, and strategy breakdowns.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  TrendingDown,
  Copy,
  Check,
  ChevronRight,
  DollarSign,
  Zap,
  Clock,
  BarChart3,
  Sparkles,
  Eye,
  Keyboard,
  Award,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// Import the component for live demo
import { BeforeAfterComparison } from '@clarity-chat/react'

// ISR Configuration: API documentation changes with code updates
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
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span className="text-brand-600 dark:text-brand-400">
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-brand-500/10">
          <Icon className="w-5 h-5 text-brand-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function BeforeAfterComparisonPage() {
  const breadcrumbItems = [
    { label: 'Reference', href: '/reference' },
    { label: 'Components', href: '/reference/components' },
    { label: 'BeforeAfterComparison' },
  ]

  // Props definitions
  const mainProps: PropDefinition[] = [
    {
      name: 'before',
      type: 'BeforeMetrics',
      required: true,
      description: 'Before optimization metrics including value, label, and description',
    },
    {
      name: 'after',
      type: 'AfterMetrics',
      required: true,
      description: 'After optimization metrics including value, label, and description',
    },
    {
      name: 'comparisonType',
      type: "'cost' | 'tokens' | 'latency' | 'custom'",
      default: "'cost'",
      description: 'Type of comparison being made (affects formatting and icons)',
    },
    {
      name: 'unit',
      type: 'string',
      description: 'Custom unit for display (overrides default based on comparisonType)',
    },
    {
      name: 'strategies',
      type: 'StrategyContribution[]',
      default: '[]',
      description: 'Array of strategies showing individual contributions to total savings',
    },
    {
      name: 'showAnimation',
      type: 'boolean',
      default: 'true',
      description: 'Enable animated transition when component appears',
    },
    {
      name: 'showSavingsBadge',
      type: 'boolean',
      default: 'true',
      description: 'Display prominent percentage savings badge',
    },
    {
      name: 'showStrategies',
      type: 'boolean',
      default: 'true',
      description: 'Display strategy breakdown section',
    },
    {
      name: 'visualStyle',
      type: "'bars' | 'cards' | 'minimal'",
      default: "'bars'",
      description: 'Visualization style for the comparison',
    },
    {
      name: 'title',
      type: 'string',
      description: 'Custom title for the comparison',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes',
    },
    {
      name: 'disableAnimations',
      type: 'boolean',
      default: 'false',
      description: 'Disable all animations',
    },
    {
      name: 'onAnimationComplete',
      type: '() => void',
      description: 'Callback fired when animation completes',
    },
  ]

  const typeProps: PropDefinition[] = [
    {
      name: 'value',
      type: 'number',
      required: true,
      description: 'Primary metric value (cost, tokens, or latency)',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Optional label override (defaults to "Before/After Optimization")',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Optional description providing additional context',
    },
  ]

  const strategyProps: PropDefinition[] = [
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'Strategy name (e.g., "Prompt Caching", "Model Routing")',
    },
    {
      name: 'savingsPercent',
      type: 'number',
      required: true,
      description: 'Percentage contribution to total savings (0-100)',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Optional description of the strategy',
    },
    {
      name: 'color',
      type: 'string',
      description: 'Optional color for visualization (CSS color value)',
    },
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
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">
                    BeforeAfterComparison
                  </h1>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                    Stable
                  </span>
                </div>
                <p className="text-lg text-muted-foreground">
                  Visual comparison component showing optimization results with animated transitions
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <TrendingDown className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Savings Display</p>
                  <p className="text-sm font-semibold text-foreground">
                    Percentage Badge
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <BarChart3 className="w-5 h-5 text-brand-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Visual Styles</p>
                  <p className="text-sm font-semibold text-foreground">
                    3 Options
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Strategy</p>
                  <p className="text-sm font-semibold text-foreground">
                    Breakdown
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <Award className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Animated</p>
                  <p className="text-sm font-semibold text-foreground">
                    Transitions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <Section id="features" title="Key Features">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <FeatureCard
                icon={TrendingDown}
                title="Percentage Savings Badge"
                description="Prominently display savings percentage with animated counter and color-coded badges based on savings level"
              />
              <FeatureCard
                icon={BarChart3}
                title="Multiple Visual Styles"
                description="Choose from bar charts, side-by-side cards, or minimal comparison to match your design"
              />
              <FeatureCard
                icon={Sparkles}
                title="Strategy Breakdown"
                description="Show individual strategy contributions with animated progress bars and descriptions"
              />
              <FeatureCard
                icon={Award}
                title="Smart Formatting"
                description="Automatically formats costs, tokens, and latency with appropriate units and precision"
              />
            </div>
          </Section>

          {/* Live Demo */}
          <Section id="demo" title="Live Demo" className="mb-12">
            <p className="text-muted-foreground mb-6">
              Interactive examples showing different comparison types and visual styles.
            </p>

            <div className="space-y-8">
              {/* Cost Comparison with Strategies */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  Cost Comparison with Strategy Breakdown (Bar Style)
                </h4>
                <div className="rounded-xl border border-border/50 bg-card p-6">
                  <BeforeAfterComparison
                    before={{
                      value: 1250,
                      label: 'Monthly AI Costs',
                      description: 'Before implementing optimization strategies',
                    }}
                    after={{
                      value: 187.5,
                      label: 'Optimized Monthly Costs',
                      description: 'After applying caching, compression, and smart routing',
                    }}
                    comparisonType="cost"
                    visualStyle="bars"
                    strategies={[
                      {
                        name: 'Prompt Caching',
                        savingsPercent: 45,
                        description: 'Anthropic prompt caching for system prompts',
                      },
                      {
                        name: 'Smart Model Routing',
                        savingsPercent: 30,
                        description: 'Route simple queries to GPT-3.5',
                      },
                      {
                        name: 'Context Compression',
                        savingsPercent: 15,
                        description: 'LLMLingua compression for long contexts',
                      },
                      {
                        name: 'Response Caching',
                        savingsPercent: 10,
                        description: 'Semantic cache for common queries',
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Token Comparison with Cards */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  Token Usage Comparison (Card Style)
                </h4>
                <div className="rounded-xl border border-border/50 bg-card p-6">
                  <BeforeAfterComparison
                    before={{ value: 85000 }}
                    after={{ value: 34000 }}
                    comparisonType="tokens"
                    visualStyle="cards"
                    showStrategies={false}
                  />
                </div>
              </div>

              {/* Latency Comparison Minimal */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  Latency Reduction (Minimal Style)
                </h4>
                <div className="rounded-xl border border-border/50 bg-card p-6">
                  <BeforeAfterComparison
                    before={{ value: 2400 }}
                    after={{ value: 850 }}
                    comparisonType="latency"
                    visualStyle="minimal"
                    showSavingsBadge={false}
                    showStrategies={false}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Installation */}
          <Section id="installation" title="Installation" className="mb-12">
            <CodeBlock
              code={`npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react`}
              language="bash"
            />
          </Section>

          {/* Basic Usage */}
          <Section id="usage" title="Basic Usage" className="mb-12">
            <SubSection
              id="cost-comparison"
              title="Cost Comparison"
              className="mb-8"
            >
              <p className="text-muted-foreground mb-4">
                Display cost savings from optimization:
              </p>
              <CodeBlock
                code={`import { BeforeAfterComparison } from '@clarity-chat/react'

function CostSavingsDemo() {
  return (
    <BeforeAfterComparison
      before={{ value: 1250 }}
      after={{ value: 187.5 }}
      comparisonType="cost"
      title="Monthly AI Cost Reduction"
    />
  )
}`}
                language="tsx"
              />
            </SubSection>

            <SubSection
              id="with-strategies"
              title="With Strategy Breakdown"
              className="mb-8"
            >
              <p className="text-muted-foreground mb-4">
                Show how different strategies contribute to savings:
              </p>
              <CodeBlock
                code={`import { BeforeAfterComparison } from '@clarity-chat/react'

function StrategyBreakdownDemo() {
  return (
    <BeforeAfterComparison
      before={{
        value: 1250,
        label: 'Baseline Costs',
        description: 'Using GPT-4 for all queries without optimization',
      }}
      after={{
        value: 187.5,
        label: 'Optimized Costs',
        description: 'After implementing multi-strategy optimization',
      }}
      comparisonType="cost"
      strategies={[
        {
          name: 'Prompt Caching',
          savingsPercent: 45,
          description: 'Anthropic prompt caching reduces repeated context',
          color: 'rgb(34, 197, 94)', // green-500
        },
        {
          name: 'Smart Model Routing',
          savingsPercent: 30,
          description: 'Route to GPT-3.5 for simple queries',
          color: 'rgb(59, 130, 246)', // blue-500
        },
        {
          name: 'Context Compression',
          savingsPercent: 15,
          description: 'LLMLingua compression for long contexts',
          color: 'rgb(168, 85, 247)', // purple-500
        },
      ]}
    />
  )
}`}
                language="tsx"
              />
            </SubSection>

            <SubSection
              id="token-comparison"
              title="Token Usage Comparison"
              className="mb-8"
            >
              <p className="text-muted-foreground mb-4">
                Compare token usage before and after optimization:
              </p>
              <CodeBlock
                code={`import { BeforeAfterComparison } from '@clarity-chat/react'

function TokenComparisonDemo() {
  return (
    <BeforeAfterComparison
      before={{ value: 85000 }}
      after={{ value: 34000 }}
      comparisonType="tokens"
      visualStyle="cards"
      title="Daily Token Usage Reduction"
    />
  )
}`}
                language="tsx"
              />
            </SubSection>

            <SubSection
              id="latency-comparison"
              title="Latency Comparison"
              className="mb-8"
            >
              <p className="text-muted-foreground mb-4">
                Show latency improvements:
              </p>
              <CodeBlock
                code={`import { BeforeAfterComparison } from '@clarity-chat/react'

function LatencyDemo() {
  return (
    <BeforeAfterComparison
      before={{ value: 2400 }}
      after={{ value: 850 }}
      comparisonType="latency"
      visualStyle="minimal"
      showStrategies={false}
    />
  )
}`}
                language="tsx"
              />
            </SubSection>

            <SubSection
              id="custom-metrics"
              title="Custom Metrics"
              className="mb-8"
            >
              <p className="text-muted-foreground mb-4">
                Compare any custom metric with custom units:
              </p>
              <CodeBlock
                code={`import { BeforeAfterComparison } from '@clarity-chat/react'

function CustomMetricDemo() {
  return (
    <BeforeAfterComparison
      before={{ value: 150 }}
      after={{ value: 45 }}
      comparisonType="custom"
      unit="API calls/min"
      title="API Request Rate Optimization"
      visualStyle="bars"
    />
  )
}`}
                language="tsx"
              />
            </SubSection>
          </Section>

          {/* Props API */}
          <Section id="props" title="Props API" className="mb-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Component Props
                </h3>
                <PropsTable props={mainProps} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  BeforeMetrics / AfterMetrics
                </h3>
                <PropsTable props={typeProps} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  StrategyContribution
                </h3>
                <PropsTable props={strategyProps} />
              </div>
            </div>
          </Section>

          {/* Visual Styles */}
          <Section id="visual-styles" title="Visual Styles" className="mb-12">
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-3">Bars (Default)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Horizontal bar chart with before/after comparison. Best for showing dramatic differences.
                </p>
                <CodeBlock
                  code={`<BeforeAfterComparison
  before={{ value: 1000 }}
  after={{ value: 200 }}
  visualStyle="bars"
/>`}
                  language="tsx"
                />
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-3">Cards</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Side-by-side cards with gradient backgrounds. Best for equal emphasis on both values.
                </p>
                <CodeBlock
                  code={`<BeforeAfterComparison
  before={{ value: 1000 }}
  after={{ value: 200 }}
  visualStyle="cards"
/>`}
                  language="tsx"
                />
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-3">Minimal</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Clean, simple comparison with arrow. Best for space-constrained layouts.
                </p>
                <CodeBlock
                  code={`<BeforeAfterComparison
  before={{ value: 1000 }}
  after={{ value: 200 }}
  visualStyle="minimal"
/>`}
                  language="tsx"
                />
              </div>
            </div>
          </Section>

          {/* Use Cases */}
          <Section id="use-cases" title="Use Cases & Best Practices" className="mb-12">
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-border/50 bg-card">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Cost Savings Dashboards
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Display ROI and cost reduction from optimization strategies on dashboards and reports.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc list-inside">
                  <li>Monthly cost comparisons for executive reports</li>
                  <li>Real-time savings tracking on optimization dashboards</li>
                  <li>A/B test results showing cost impact of different strategies</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-card">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-500" />
                  Performance Optimization
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Show improvements in token usage, latency, or other performance metrics.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc list-inside">
                  <li>Token reduction from compression strategies</li>
                  <li>Latency improvements from caching</li>
                  <li>API rate reduction from batching</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-card">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  Documentation & Tutorials
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Use in cookbook recipes and guides to illustrate optimization impact.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc list-inside">
                  <li>Show expected results at the end of tutorials</li>
                  <li>Compare different optimization approaches</li>
                  <li>Visualize strategy effectiveness</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Related APIs */}
          <Section id="related" title="Related Components & APIs" className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/reference/components/token-roi-calculator"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <TrendingDown className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  TokenROICalculator
                </h3>
                <p className="text-sm text-muted-foreground">
                  Calculate ROI and cost savings with interactive sliders
                </p>
              </Link>

              <Link
                href="/reference/components/token-optimization-dashboard"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <BarChart3 className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  TokenOptimizationDashboard
                </h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive dashboard for token optimization metrics
                </p>
              </Link>

              <Link
                href="/reference/components/token-cost-preview"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <DollarSign className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  TokenCostPreview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Preview estimated costs before sending requests
                </p>
              </Link>

              <Link
                href="/cookbook/token-optimization"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <Sparkles className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Token Optimization Cookbook
                </h3>
                <p className="text-sm text-muted-foreground">
                  Real-world recipes achieving 50-90% cost reduction
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
                    Keyboard Navigation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All interactive elements are keyboard accessible. The component is primarily
                    informational and doesn't require specific keyboard interactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Eye className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Screen Reader Support
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Semantic HTML and ARIA labels ensure all information is accessible to screen
                    readers. Numerical values are formatted for clarity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Zap className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Reduced Motion
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Respects <code className="text-xs bg-muted px-1.5 py-0.5 rounded">prefers-reduced-motion</code>.
                    Set <code className="text-xs bg-muted px-1.5 py-0.5 rounded">disableAnimations={'{true}'}</code> to
                    disable all animations programmatically.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-border/50">
            <Link
              href="/reference/components/token-roi-calculator"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              TokenROICalculator
            </Link>
            <Link
              href="/reference/components/token-optimization-dashboard"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-500 transition-colors"
            >
              TokenOptimizationDashboard
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
