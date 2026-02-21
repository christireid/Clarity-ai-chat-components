'use client'

/**
 * TokenROICalculator Component - API Reference Documentation
 *
 * A comprehensive ROI calculator for analyzing return on investment from token optimization
 * strategies. Includes cost savings analysis, break-even calculations, scenario comparisons,
 * and visual reports.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Copy,
  Check,
  ChevronRight,
  DollarSign,
  Target,
  Calendar,
  AlertCircle,
  Keyboard,
  BarChart3,
  Zap,
  Eye,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// Import the component for live demo
import { TokenROICalculator } from '@clarity-chat/react'

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

export default function TokenROICalculatorPage() {
  const breadcrumbItems = [
    { label: 'Reference', href: '/reference' },
    { label: 'Components', href: '/reference/components' },
    { label: 'TokenROICalculator' },
  ]

  // Props definitions
  const mainProps: PropDefinition[] = [
    {
      name: 'requestsPerDay',
      type: 'number',
      default: '1000',
      description: 'Number of AI requests per day',
    },
    {
      name: 'tokensPerRequest',
      type: 'number',
      default: '500',
      description: 'Average tokens consumed per request before optimization',
    },
    {
      name: 'costPerInputToken',
      type: 'number',
      default: '0.00001',
      description: 'Cost per input token in dollars (e.g., $0.00001 for GPT-4)',
    },
    {
      name: 'costPerOutputToken',
      type: 'number',
      default: '0.00003',
      description: 'Cost per output token in dollars',
    },
    {
      name: 'optimizationPercent',
      type: 'number',
      default: '30',
      description: 'Expected token reduction percentage (0-100)',
    },
    {
      name: 'implementationCost',
      type: 'number',
      default: '500',
      description: 'One-time cost to implement optimization',
    },
    {
      name: 'maintenanceCost',
      type: 'number',
      default: '50',
      description: 'Monthly maintenance cost',
    },
    {
      name: 'period',
      type: "'daily' | 'weekly' | 'monthly' | 'yearly'",
      default: "'yearly'",
      description: 'Time period for ROI calculations',
    },
    {
      name: 'showBreakdown',
      type: 'boolean',
      default: 'true',
      description: 'Display detailed cost breakdown',
    },
    {
      name: 'showChart',
      type: 'boolean',
      default: 'true',
      description: 'Display comparison charts',
    },
    {
      name: 'showBreakEven',
      type: 'boolean',
      default: 'true',
      description: 'Display break-even timeline',
    },
    {
      name: 'enableSliders',
      type: 'boolean',
      default: 'true',
      description: 'Enable interactive parameter sliders',
    },
    {
      name: 'scenarios',
      type: 'OptimizationScenario[]',
      default: '[]',
      description: 'Custom optimization scenarios to compare',
    },
    {
      name: 'onCalculate',
      type: '(results: ROIResults) => void',
      description: 'Callback fired when calculations update',
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
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">
                    TokenROICalculator
                  </h1>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                    Stable
                  </span>
                </div>
                <p className="text-lg text-muted-foreground">
                  Calculate ROI and cost savings for token optimization strategies
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Savings Analysis</p>
                  <p className="text-sm font-semibold text-foreground">
                    Daily/Monthly/Yearly
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <Calendar className="w-5 h-5 text-brand-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Break-Even</p>
                  <p className="text-sm font-semibold text-foreground">
                    Timeline Analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Scenario</p>
                  <p className="text-sm font-semibold text-foreground">
                    Comparison
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <Activity className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Visual</p>
                  <p className="text-sm font-semibold text-foreground">
                    Reports
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <Section id="features" title="Key Features">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <FeatureCard
                icon={DollarSign}
                title="Cost Savings Analysis"
                description="Calculate actual dollar savings from token optimization across daily, monthly, and yearly periods"
              />
              <FeatureCard
                icon={Target}
                title="Break-Even Calculator"
                description="Determine exactly when your optimization investment will pay for itself"
              />
              <FeatureCard
                icon={BarChart3}
                title="Scenario Comparison"
                description="Compare multiple optimization strategies side-by-side to find the best approach"
              />
              <FeatureCard
                icon={Activity}
                title="Visual Reports"
                description="Interactive charts and progress bars for easy visualization of savings and costs"
              />
            </div>
          </Section>

          {/* Live Demo */}
          <Section id="demo" title="Live Demo" className="mb-12">
            <p className="text-muted-foreground mb-6">
              Try the interactive calculator below. Adjust the sliders to see how different
              optimization strategies affect your ROI.
            </p>

            <div className="rounded-xl border border-border/50 bg-card p-6">
              <TokenROICalculator
                requestsPerDay={1000}
                tokensPerRequest={500}
                costPerInputToken={0.00001}
                costPerOutputToken={0.00003}
                optimizationPercent={30}
                implementationCost={500}
                maintenanceCost={50}
                showBreakdown={true}
                showBreakEven={true}
                enableSliders={true}
              />
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
              id="basic-example"
              title="Simple ROI Calculator"
              className="mb-8"
            >
              <p className="text-muted-foreground mb-4">
                Basic usage with default values and interactive sliders:
              </p>
              <CodeBlock
                code={`import { TokenROICalculator } from '@clarity-chat/react'

function MyApp() {
  return (
    <TokenROICalculator
      requestsPerDay={1000}
      tokensPerRequest={500}
      optimizationPercent={30}
      enableSliders={true}
    />
  )
}`}
                language="tsx"
              />
            </SubSection>

            <SubSection
              id="with-callback"
              title="With Calculation Callback"
              className="mb-8"
            >
              <p className="text-muted-foreground mb-4">
                Track ROI results programmatically:
              </p>
              <CodeBlock
                code={`import { TokenROICalculator, type ROIResults } from '@clarity-chat/react'

function MyApp() {
  const handleCalculate = (results: ROIResults) => {
    console.log('Annual Savings:', results.savingsPerYear)
    console.log('ROI:', results.roiPercent)
    console.log('Break-even:', results.breakEvenDays, 'days')

    // Track to analytics
    analytics.track('roi_calculated', {
      savings: results.savingsPerYear,
      roi: results.roiPercent,
    })
  }

  return (
    <TokenROICalculator
      requestsPerDay={2000}
      tokensPerRequest={800}
      optimizationPercent={40}
      onCalculate={handleCalculate}
    />
  )
}`}
                language="tsx"
              />
            </SubSection>

            <SubSection
              id="custom-costs"
              title="Custom Cost Configuration"
              className="mb-8"
            >
              <p className="text-muted-foreground mb-4">
                Configure costs for different AI models:
              </p>
              <CodeBlock
                code={`import { TokenROICalculator } from '@clarity-chat/react'

// GPT-4 Turbo pricing
function GPT4ROICalculator() {
  return (
    <TokenROICalculator
      requestsPerDay={1500}
      tokensPerRequest={1000}
      costPerInputToken={0.00001}  // $0.01 per 1K tokens
      costPerOutputToken={0.00003}  // $0.03 per 1K tokens
      optimizationPercent={35}
      implementationCost={1000}
      maintenanceCost={100}
    />
  )
}

// Claude 3 Opus pricing
function ClaudeOpusROICalculator() {
  return (
    <TokenROICalculator
      requestsPerDay={1500}
      tokensPerRequest={1000}
      costPerInputToken={0.000015}  // $0.015 per 1K tokens
      costPerOutputToken={0.000075}  // $0.075 per 1K tokens
      optimizationPercent={35}
      implementationCost={1000}
      maintenanceCost={100}
    />
  )
}`}
                language="tsx"
              />
            </SubSection>

            <SubSection
              id="dashboard-integration"
              title="Integration with TokenOptimizationDashboard"
              className="mb-8"
            >
              <p className="text-muted-foreground mb-4">
                Combine with the optimization dashboard for complete visibility:
              </p>
              <CodeBlock
                code={`import {
  TokenROICalculator,
  TokenOptimizationDashboard,
  type ROIResults,
} from '@clarity-chat/react'

function OptimizationCenter() {
  const [roiResults, setRoiResults] = useState<ROIResults | null>(null)

  return (
    <div className="space-y-6">
      <h1>Token Optimization Center</h1>

      {/* Live metrics dashboard */}
      <TokenOptimizationDashboard
        currentUsage={45000}
        optimizedUsage={31500}
        estimatedSavings={roiResults?.savingsPerMonth || 0}
        showMetrics={true}
        showChart={true}
      />

      {/* ROI calculator */}
      <TokenROICalculator
        requestsPerDay={1000}
        tokensPerRequest={500}
        optimizationPercent={30}
        onCalculate={setRoiResults}
        enableSliders={true}
      />

      {/* Display key results */}
      {roiResults && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Annual Savings</p>
            <p className="text-2xl font-bold">
              {formatCurrency(roiResults.savingsPerYear)}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">ROI</p>
            <p className="text-2xl font-bold">
              {roiResults.roiPercent.toFixed(1)}%
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Break-Even</p>
            <p className="text-2xl font-bold">
              {Math.ceil(roiResults.breakEvenDays)} days
            </p>
          </div>
        </div>
      )}
    </div>
  )
}`}
                language="tsx"
              />
            </SubSection>
          </Section>

          {/* Props API */}
          <Section id="props" title="Props API" className="mb-12">
            <PropsTable props={mainProps} />
          </Section>

          {/* Type Definitions */}
          <Section id="types" title="Type Definitions" className="mb-12">
            <SubSection id="roi-results" title="ROIResults" className="mb-6">
              <CodeBlock
                code={`interface ROIResults {
  /** Total cost savings over the period */
  totalSavings: number

  /** Savings per day */
  savingsPerDay: number

  /** Savings per month */
  savingsPerMonth: number

  /** Savings per year */
  savingsPerYear: number

  /** ROI percentage */
  roiPercent: number

  /** Days until break-even */
  breakEvenDays: number

  /** Before optimization costs */
  beforeCosts: CostBreakdown

  /** After optimization costs */
  afterCosts: CostBreakdown

  /** Net benefit (total savings - implementation costs) */
  netBenefit: number
}`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="cost-breakdown" title="CostBreakdown" className="mb-6">
              <CodeBlock
                code={`interface CostBreakdown {
  /** Input token costs */
  inputCosts: number

  /** Output token costs */
  outputCosts: number

  /** Total token costs */
  totalTokenCosts: number

  /** Implementation costs (one-time) */
  implementationCosts: number

  /** Maintenance costs (recurring) */
  maintenanceCosts: number
}`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="optimization-scenario" title="OptimizationScenario" className="mb-6">
              <CodeBlock
                code={`interface OptimizationScenario {
  /** Scenario name for identification */
  name: string

  /** Average tokens per request before optimization */
  tokensPerRequest: number

  /** Optimization percentage (0-100) */
  optimizationPercent: number

  /** Optional one-time implementation cost */
  implementationCost?: number

  /** Optional monthly maintenance cost */
  maintenanceCost?: number
}`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* ROI Formulas */}
          <Section id="formulas" title="ROI Calculation Formulas" className="mb-12">
            <p className="text-muted-foreground mb-6">
              The TokenROICalculator uses these formulas to calculate savings and ROI:
            </p>

            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-3">Daily Token Savings</h4>
                <CodeBlock
                  code={`dailyTokensBefore = requestsPerDay × tokensPerRequest
dailyTokensAfter = dailyTokensBefore × (1 - optimizationPercent / 100)
tokensSaved = dailyTokensBefore - dailyTokensAfter`}
                  language="text"
                />
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-3">Cost Calculations</h4>
                <CodeBlock
                  code={`// Assuming 70% input tokens, 30% output tokens
inputRatio = 0.7
outputRatio = 0.3

dailyCostBefore = (dailyTokensBefore × inputRatio × costPerInputToken) +
                  (dailyTokensBefore × outputRatio × costPerOutputToken)

dailyCostAfter = (dailyTokensAfter × inputRatio × costPerInputToken) +
                 (dailyTokensAfter × outputRatio × costPerOutputToken)`}
                  language="text"
                />
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-3">Savings by Period</h4>
                <CodeBlock
                  code={`dailySavings = dailyCostBefore - dailyCostAfter
monthlySavings = dailySavings × 30
yearlySavings = dailySavings × 365`}
                  language="text"
                />
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-3">Break-Even Analysis</h4>
                <CodeBlock
                  code={`netMonthlySavings = monthlySavings - maintenanceCost
breakEvenDays = (implementationCost / netMonthlySavings) × 30

// If netMonthlySavings ≤ 0, break-even is never achieved`}
                  language="text"
                />
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-3">ROI Percentage</h4>
                <CodeBlock
                  code={`firstYearCosts = implementationCost + (maintenanceCost × 12)
firstYearSavings = yearlySavings
roiPercent = ((firstYearSavings - firstYearCosts) / firstYearCosts) × 100

// Positive ROI means profitable
// ROI > 100% means you doubled your investment`}
                  language="text"
                />
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-3">Net Benefit</h4>
                <CodeBlock
                  code={`netBenefit = yearlySavings - implementationCost - (maintenanceCost × 12)

// This is the actual dollar amount you save in the first year
// after accounting for all costs`}
                  language="text"
                />
              </div>
            </div>
          </Section>

          {/* Use Cases */}
          <Section id="use-cases" title="Use Cases & Best Practices" className="mb-12">
            <SubSection id="when-to-optimize" title="When to Optimize Tokens" className="mb-6">
              <p className="text-muted-foreground mb-4">
                Token optimization is most valuable when:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>You process more than 10,000 requests per day</li>
                <li>Average token usage per request exceeds 500 tokens</li>
                <li>Monthly AI costs exceed $500</li>
                <li>You're using expensive models (GPT-4, Claude Opus)</li>
                <li>Token usage is growing month-over-month</li>
                <li>You can achieve 20%+ optimization without quality loss</li>
              </ul>

              <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                      Optimization Sweet Spot
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      The best ROI typically comes from optimizing high-volume, moderate-token requests
                      (100-1000 tokens) where you can achieve 25-40% reduction through prompt engineering,
                      caching, and compression strategies.
                    </p>
                  </div>
                </div>
              </div>
            </SubSection>

            <SubSection id="expected-savings" title="Expected Savings by Strategy" className="mb-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border/50">
                  <h5 className="font-semibold text-foreground mb-2">Prompt Engineering (15-30% reduction)</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Optimize prompts to be more concise and specific. Use few-shot examples efficiently.
                  </p>
                  <CodeBlock
                    code={`// Before (500 tokens)
"Please analyze this document and provide a comprehensive summary..."

// After (350 tokens, 30% reduction)
"Summarize key points from: [document]"`}
                    language="text"
                  />
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h5 className="font-semibold text-foreground mb-2">Response Caching (40-60% reduction)</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Cache common responses and use semantic search to find similar queries.
                  </p>
                  <CodeBlock
                    code={`// Implementation cost: $1,000
// Monthly maintenance: $100
// Typical savings: 50% token reduction on repeat queries`}
                    language="text"
                  />
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h5 className="font-semibold text-foreground mb-2">Model Selection (30-50% cost reduction)</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use cheaper models (GPT-3.5, Claude Haiku) for simple tasks, expensive models for complex ones.
                  </p>
                  <CodeBlock
                    code={`// GPT-4: $0.03/1K tokens
// GPT-3.5: $0.002/1K tokens
// Savings: 93% cost reduction for suitable tasks`}
                    language="text"
                  />
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h5 className="font-semibold text-foreground mb-2">Context Compression (20-40% reduction)</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Compress conversation history and system prompts while maintaining quality.
                  </p>
                  <CodeBlock
                    code={`// Before: 2000 token conversation history
// After: 1200 tokens (40% reduction)
// Quality impact: Minimal with proper compression`}
                    language="text"
                  />
                </div>
              </div>
            </SubSection>

            <SubSection id="calculation-tips" title="Calculation Tips" className="mb-6">
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      Important Considerations
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-amber-600 dark:text-amber-400 ml-2">
                      <li>Include all implementation costs (development, testing, deployment)</li>
                      <li>Factor in ongoing maintenance and monitoring costs</li>
                      <li>Start with conservative optimization percentages (20-30%)</li>
                      <li>Test optimizations thoroughly before deploying</li>
                      <li>Monitor quality metrics alongside token reduction</li>
                      <li>Consider seasonal variations in request volume</li>
                    </ul>
                  </div>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* Related APIs */}
          <Section id="related" title="Related Components & APIs" className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Real-time monitoring and analytics for token optimization
                </p>
              </Link>

              <Link
                href="/reference/components/token-usage-meter"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <Activity className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  TokenUsageMeter
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visual meter showing current token usage with cost estimates
                </p>
              </Link>

              <Link
                href="/reference/hooks/use-token-budget-monitor"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <Eye className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  useTokenBudgetMonitor
                </h3>
                <p className="text-sm text-muted-foreground">
                  Hook for tracking token budgets with alerts and limits
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
                  <p className="text-sm text-muted-foreground mb-2">
                    All interactive elements support full keyboard navigation:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">Tab</code> - Navigate between sliders and interactive elements</li>
                    <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">Arrow Keys</code> - Adjust slider values</li>
                    <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">Home/End</code> - Jump to min/max slider values</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Eye className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Screen Reader Support
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive ARIA labels and semantic HTML ensure compatibility with all major
                    screen readers. Progress bars include textual alternatives, and all interactive
                    elements announce their current state.
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
              href="/reference/components/token-optimization-dashboard"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              TokenOptimizationDashboard
            </Link>
            <Link
              href="/reference/components/token-usage-meter"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-500 transition-colors"
            >
              TokenUsageMeter
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
