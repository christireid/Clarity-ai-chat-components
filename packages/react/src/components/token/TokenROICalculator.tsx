'use client'

/**
 * TokenROICalculator - Calculate ROI for Token Optimization Strategies
 *
 * A comprehensive calculator for analyzing return on investment (ROI) from token optimization.
 * Includes cost savings analysis, break-even calculations, scenario comparisons, and visual reports.
 *
 * @module TokenROICalculator
 * @since 1.0.0
 * @stable
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Time period for ROI calculations
 */
export type ROIPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'

/**
 * Optimization scenario configuration
 */
export interface OptimizationScenario {
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
}

/**
 * Cost breakdown by category
 */
export interface CostBreakdown {
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
}

/**
 * ROI calculation results
 */
export interface ROIResults {
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
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

/**
 * Props for TokenROICalculator component
 */
export interface TokenROICalculatorProps {
  /** Number of requests per day */
  requestsPerDay?: number
  /** Average tokens per request before optimization */
  tokensPerRequest?: number
  /** Cost per input token (in cents or dollars) */
  costPerInputToken?: number
  /** Cost per output token (in cents or dollars) */
  costPerOutputToken?: number
  /** Optimization percentage (0-100) */
  optimizationPercent?: number
  /** One-time implementation cost */
  implementationCost?: number
  /** Monthly maintenance cost */
  maintenanceCost?: number
  /** Time period for calculations */
  period?: ROIPeriod
  /** Show detailed cost breakdown */
  showBreakdown?: boolean
  /** Show comparison chart */
  showChart?: boolean
  /** Show break-even analysis */
  showBreakEven?: boolean
  /** Enable interactive sliders */
  enableSliders?: boolean
  /** Custom scenarios to compare */
  scenarios?: OptimizationScenario[]
  /** Callback when calculations update */
  onCalculate?: (results: ROIResults) => void
  /** Custom className */
  className?: string
  /** Disable animations */
  disableAnimations?: boolean
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate ROI for token optimization
 */
function calculateROI(params: {
  requestsPerDay: number
  tokensPerRequest: number
  costPerInputToken: number
  costPerOutputToken: number
  optimizationPercent: number
  implementationCost: number
  maintenanceCost: number
}): ROIResults {
  const {
    requestsPerDay,
    tokensPerRequest,
    costPerInputToken,
    costPerOutputToken,
    optimizationPercent,
    implementationCost,
    maintenanceCost,
  } = params

  // Calculate daily token usage
  const dailyTokensBefore = requestsPerDay * tokensPerRequest
  const dailyTokensAfter = dailyTokensBefore * (1 - optimizationPercent / 100)
  const tokensSaved = dailyTokensBefore - dailyTokensAfter

  // Calculate costs (assuming 70% input, 30% output split)
  const inputRatio = 0.7
  const outputRatio = 0.3

  const dailyCostBefore =
    dailyTokensBefore * inputRatio * costPerInputToken +
    dailyTokensBefore * outputRatio * costPerOutputToken
  const dailyCostAfter =
    dailyTokensAfter * inputRatio * costPerInputToken +
    dailyTokensAfter * outputRatio * costPerOutputToken

  const dailySavings = dailyCostBefore - dailyCostAfter
  const monthlySavings = dailySavings * 30
  const yearlySavings = dailySavings * 365

  // Calculate break-even
  const totalUpfrontCost = implementationCost
  const monthlyMaintenanceCost = maintenanceCost
  const netMonthlySavings = monthlySavings - monthlyMaintenanceCost
  const breakEvenDays =
    netMonthlySavings > 0 ? (totalUpfrontCost / netMonthlySavings) * 30 : Infinity

  // Calculate ROI
  const firstYearCosts = implementationCost + maintenanceCost * 12
  const firstYearSavings = yearlySavings
  const roiPercent =
    firstYearCosts > 0 ? ((firstYearSavings - firstYearCosts) / firstYearCosts) * 100 : 0

  return {
    totalSavings: yearlySavings,
    savingsPerDay: dailySavings,
    savingsPerMonth: monthlySavings,
    savingsPerYear: yearlySavings,
    roiPercent,
    breakEvenDays,
    beforeCosts: {
      inputCosts: dailyTokensBefore * inputRatio * costPerInputToken * 365,
      outputCosts: dailyTokensBefore * outputRatio * costPerOutputToken * 365,
      totalTokenCosts: dailyCostBefore * 365,
      implementationCosts: 0,
      maintenanceCosts: 0,
    },
    afterCosts: {
      inputCosts: dailyTokensAfter * inputRatio * costPerInputToken * 365,
      outputCosts: dailyTokensAfter * outputRatio * costPerOutputToken * 365,
      totalTokenCosts: dailyCostAfter * 365,
      implementationCosts: implementationCost,
      maintenanceCosts: maintenanceCost * 12,
    },
    netBenefit: yearlySavings - implementationCost - maintenanceCost * 12,
  }
}

/**
 * Format currency value
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format number with commas
 */
function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format percentage
 */
function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Metric Card Component
 */
function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  color = 'brand',
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  trend?: string
  color?: 'brand' | 'green' | 'red' | 'amber'
  className?: string
}) {
  const colorClasses = {
    brand: 'from-brand-500/10 to-purple-500/10 border-brand-500/20',
    green: 'from-green-500/10 to-emerald-500/10 border-green-500/20',
    red: 'from-red-500/10 to-rose-500/10 border-red-500/20',
    amber: 'from-amber-500/10 to-orange-500/10 border-amber-500/20',
  }

  const iconColorClasses = {
    brand: 'text-brand-500',
    green: 'text-green-500',
    red: 'text-red-500',
    amber: 'text-amber-500',
  }

  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-6 ${colorClasses[color]} ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg bg-background/50 ${iconColorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-muted-foreground">{trend}</span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}

/**
 * Slider Input Component
 */
function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = (v) => v.toString(),
  disabled = false,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  format?: (value: number) => string
  disabled?: boolean
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm font-mono text-muted-foreground">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500
                   [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all
                   [&::-webkit-slider-thumb]:hover:scale-110
                   [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                   [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-500
                   [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer
                   disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  )
}

/**
 * Progress Bar Component
 */
function ProgressBar({
  label,
  value,
  max,
  color = 'brand',
  showValue = true,
}: {
  label: string
  value: number
  max: number
  color?: 'brand' | 'green' | 'red' | 'amber'
  showValue?: boolean
}) {
  const percentage = Math.min((value / max) * 100, 100)
  const colorClasses = {
    brand: 'bg-brand-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    amber: 'bg-amber-500',
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {showValue && (
          <span className="text-sm font-mono text-muted-foreground">
            {formatCurrency(value)}
          </span>
        )}
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: durations.slow, ease: 'easeOut' }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  )
}

/**
 * Break-Even Timeline Component
 */
function BreakEvenTimeline({ days }: { days: number }) {
  const milestones = [
    { label: '1 Week', days: 7 },
    { label: '1 Month', days: 30 },
    { label: '3 Months', days: 90 },
    { label: '6 Months', days: 180 },
    { label: '1 Year', days: 365 },
  ]

  const isInfinite = !isFinite(days)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Break-Even Timeline</h3>
        <span className="text-sm font-medium text-brand-500">
          {isInfinite ? 'Never' : `${Math.ceil(days)} days`}
        </span>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t-2 border-dashed border-border" />
        </div>

        <div className="relative flex justify-between">
          {milestones.map((milestone, index) => {
            const isPast = !isInfinite && days <= milestone.days
            const isBreakEven = !isInfinite && days <= milestone.days && (index === 0 || days > milestones[index - 1].days)

            return (
              <div key={milestone.label} className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    isBreakEven
                      ? 'bg-green-500 border-green-500'
                      : isPast
                        ? 'bg-brand-500 border-brand-500'
                        : 'bg-background border-border'
                  }`}
                />
                <span
                  className={`mt-2 text-xs ${
                    isPast ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {milestone.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {isInfinite && (
        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Break-even not achievable with current parameters</span>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export const TokenROICalculator = React.memo(function TokenROICalculator({
  requestsPerDay: initialRequestsPerDay = 1000,
  tokensPerRequest: initialTokensPerRequest = 500,
  costPerInputToken: initialCostPerInputToken = 0.00001,
  costPerOutputToken: initialCostPerOutputToken = 0.00003,
  optimizationPercent: initialOptimizationPercent = 30,
  implementationCost: initialImplementationCost = 500,
  maintenanceCost: initialMaintenanceCost = 50,
  period = 'yearly',
  showBreakdown = true,
  showChart = true,
  showBreakEven = true,
  enableSliders = true,
  scenarios = [],
  onCalculate,
  className,
  disableAnimations = false,
}: TokenROICalculatorProps) {
  // State for interactive parameters
  const [requestsPerDay, setRequestsPerDay] = React.useState(initialRequestsPerDay)
  const [tokensPerRequest, setTokensPerRequest] = React.useState(initialTokensPerRequest)
  const [costPerInputToken, setCostPerInputToken] = React.useState(initialCostPerInputToken)
  const [costPerOutputToken, setCostPerOutputToken] = React.useState(initialCostPerOutputToken)
  const [optimizationPercent, setOptimizationPercent] = React.useState(initialOptimizationPercent)
  const [implementationCost, setImplementationCost] = React.useState(initialImplementationCost)
  const [maintenanceCost, setMaintenanceCost] = React.useState(initialMaintenanceCost)

  // Calculate ROI results
  const results = React.useMemo(
    () =>
      calculateROI({
        requestsPerDay,
        tokensPerRequest,
        costPerInputToken,
        costPerOutputToken,
        optimizationPercent,
        implementationCost,
        maintenanceCost,
      }),
    [
      requestsPerDay,
      tokensPerRequest,
      costPerInputToken,
      costPerOutputToken,
      optimizationPercent,
      implementationCost,
      maintenanceCost,
    ]
  )

  // Call onCalculate when results change
  React.useEffect(() => {
    onCalculate?.(results)
  }, [results, onCalculate])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign}
          label="Annual Savings"
          value={formatCurrency(results.savingsPerYear)}
          color="green"
        />
        <MetricCard
          icon={TrendingUp}
          label="ROI"
          value={formatPercent(results.roiPercent)}
          color={results.roiPercent > 0 ? 'green' : 'red'}
        />
        <MetricCard
          icon={Calendar}
          label="Break-Even"
          value={isFinite(results.breakEvenDays) ? `${Math.ceil(results.breakEvenDays)} days` : 'Never'}
          color={results.breakEvenDays <= 90 ? 'green' : results.breakEvenDays <= 180 ? 'amber' : 'red'}
        />
        <MetricCard
          icon={Target}
          label="Net Benefit"
          value={formatCurrency(results.netBenefit)}
          color={results.netBenefit > 0 ? 'green' : 'red'}
        />
      </div>

      {/* Interactive Sliders */}
      {enableSliders && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SliderInput
              label="Requests per Day"
              value={requestsPerDay}
              onChange={setRequestsPerDay}
              min={100}
              max={10000}
              step={100}
              format={formatNumber}
            />

            <SliderInput
              label="Tokens per Request"
              value={tokensPerRequest}
              onChange={setTokensPerRequest}
              min={100}
              max={4000}
              step={100}
              format={formatNumber}
            />

            <SliderInput
              label="Optimization Percentage"
              value={optimizationPercent}
              onChange={setOptimizationPercent}
              min={0}
              max={80}
              step={5}
              format={(v) => `${v}%`}
            />

            <SliderInput
              label="Implementation Cost"
              value={implementationCost}
              onChange={setImplementationCost}
              min={0}
              max={5000}
              step={100}
              format={formatCurrency}
            />

            <SliderInput
              label="Cost per Input Token"
              value={costPerInputToken * 1000000}
              onChange={(v) => setCostPerInputToken(v / 1000000)}
              min={1}
              max={100}
              step={1}
              format={(v) => `$${(v / 1000000).toFixed(6)}`}
            />

            <SliderInput
              label="Monthly Maintenance"
              value={maintenanceCost}
              onChange={setMaintenanceCost}
              min={0}
              max={500}
              step={10}
              format={formatCurrency}
            />
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      {showBreakdown && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-foreground">
            Annual Cost Breakdown
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Before Optimization</h4>
              <div className="space-y-3">
                <ProgressBar
                  label="Input Token Costs"
                  value={results.beforeCosts.inputCosts}
                  max={results.beforeCosts.totalTokenCosts}
                  color="amber"
                />
                <ProgressBar
                  label="Output Token Costs"
                  value={results.beforeCosts.outputCosts}
                  max={results.beforeCosts.totalTokenCosts}
                  color="amber"
                />
                <ProgressBar
                  label="Total Annual Costs"
                  value={results.beforeCosts.totalTokenCosts}
                  max={results.beforeCosts.totalTokenCosts}
                  color="red"
                />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium text-foreground mb-3">After Optimization</h4>
              <div className="space-y-3">
                <ProgressBar
                  label="Input Token Costs"
                  value={results.afterCosts.inputCosts}
                  max={results.beforeCosts.totalTokenCosts}
                  color="green"
                />
                <ProgressBar
                  label="Output Token Costs"
                  value={results.afterCosts.outputCosts}
                  max={results.beforeCosts.totalTokenCosts}
                  color="green"
                />
                <ProgressBar
                  label="Implementation Costs"
                  value={results.afterCosts.implementationCosts}
                  max={results.beforeCosts.totalTokenCosts}
                  color="brand"
                />
                <ProgressBar
                  label="Annual Maintenance"
                  value={results.afterCosts.maintenanceCosts}
                  max={results.beforeCosts.totalTokenCosts}
                  color="brand"
                />
                <ProgressBar
                  label="Total Annual Costs"
                  value={
                    results.afterCosts.totalTokenCosts +
                    results.afterCosts.implementationCosts +
                    results.afterCosts.maintenanceCosts
                  }
                  max={results.beforeCosts.totalTokenCosts}
                  color="green"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-lg font-semibold text-foreground">Annual Savings</span>
              <span className="text-2xl font-bold text-green-500">
                {formatCurrency(results.savingsPerYear)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Break-Even Timeline */}
      {showBreakEven && (
        <div className="rounded-xl border border-border bg-card p-6">
          <BreakEvenTimeline days={results.breakEvenDays} />
        </div>
      )}

      {/* Savings by Period */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Savings by Time Period
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm text-muted-foreground">Daily</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(results.savingsPerDay)}
              </p>
            </div>
            <TrendingDown className="w-5 h-5 text-green-500" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm text-muted-foreground">Monthly</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(results.savingsPerMonth)}
              </p>
            </div>
            <TrendingDown className="w-5 h-5 text-green-500" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm text-muted-foreground">Yearly</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(results.savingsPerYear)}
              </p>
            </div>
            <TrendingDown className="w-5 h-5 text-green-500" />
          </div>
        </div>
      </div>

      {/* Success Indicator */}
      {results.roiPercent > 0 && results.breakEvenDays < 365 && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              Excellent ROI Potential
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              This optimization strategy will pay for itself in {Math.ceil(results.breakEvenDays)}{' '}
              days and generate {formatCurrency(results.netBenefit)} in net annual benefit.
            </p>
          </div>
        </div>
      )}
    </div>
  )
})

TokenROICalculator.displayName = 'TokenROICalculator'

// ============================================================================
// Exports
// ============================================================================

export default TokenROICalculator
