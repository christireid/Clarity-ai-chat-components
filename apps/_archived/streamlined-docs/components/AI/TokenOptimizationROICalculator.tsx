'use client'

/**
 * Token Optimization ROI Calculator
 *
 * Interactive calculator that demonstrates the cost savings and ROI
 * of implementing token optimization strategies in AI chat applications.
 *
 * Features:
 * - Real-time cost calculations
 * - Before/After comparison
 * - Savings visualization
 * - Multiple optimization strategies
 * - Annual ROI projection
 * - Break-even analysis
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingDown,
  DollarSign,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calculator,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

interface OptimizationStrategy {
  id: string
  name: string
  description: string
  savingsPercentage: number
  icon: React.ReactNode
}

interface ROICalculation {
  monthlyMessages: number
  avgTokensPerMessage: number
  costPerToken: number
  monthlyConversations: number

  // Before optimization
  totalTokensUnoptimized: number
  monthlyCostUnoptimized: number
  annualCostUnoptimized: number

  // After optimization
  totalTokensOptimized: number
  monthlyCostOptimized: number
  annualCostOptimized: number

  // Savings
  monthlyTokenSavings: number
  monthlyCostSavings: number
  annualCostSavings: number
  savingsPercentage: number

  // ROI
  implementationCost: number
  breakEvenMonths: number
  threeYearROI: number
}

// ============================================================================
// Constants
// ============================================================================

const OPTIMIZATION_STRATEGIES: OptimizationStrategy[] = [
  {
    id: 'compression',
    name: 'Message Compression',
    description: 'Remove redundant whitespace, optimize formatting',
    savingsPercentage: 15,
    icon: <TrendingDown className="w-4 h-4" />,
  },
  {
    id: 'summarization',
    name: 'Context Summarization',
    description: 'Summarize older messages in conversation history',
    savingsPercentage: 30,
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'selective-context',
    name: 'Selective Context',
    description: 'Only include relevant context for each query',
    savingsPercentage: 25,
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: 'smart-truncation',
    name: 'Smart Truncation',
    description: 'Intelligently truncate long conversations',
    savingsPercentage: 20,
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
]

const PRICING_TIERS = {
  'Claude Sonnet': 0.003, // $3 per 1M tokens
  'Claude Haiku': 0.00025, // $0.25 per 1M tokens
  'GPT-4': 0.01, // $10 per 1M tokens
  'GPT-3.5': 0.0005, // $0.50 per 1M tokens
}

// ============================================================================
// Component
// ============================================================================

export function TokenOptimizationROICalculator() {
  // ============================================================================
  // State
  // ============================================================================

  const [monthlyMessages, setMonthlyMessages] = useState(100000)
  const [avgTokensPerMessage, setAvgTokensPerMessage] = useState(500)
  const [model, setModel] = useState<keyof typeof PRICING_TIERS>('Claude Sonnet')
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(['compression', 'summarization'])
  const [implementationCost, setImplementationCost] = useState(2000) // One-time cost

  // ============================================================================
  // Calculations
  // ============================================================================

  const roi: ROICalculation = useMemo(() => {
    const costPerToken = PRICING_TIERS[model] / 1_000_000 // Convert to per-token cost
    const totalTokensUnoptimized = monthlyMessages * avgTokensPerMessage
    const monthlyCostUnoptimized = totalTokensUnoptimized * costPerToken

    // Calculate total savings percentage from selected strategies
    const totalSavingsPercentage = selectedStrategies.reduce((acc, strategyId) => {
      const strategy = OPTIMIZATION_STRATEGIES.find(s => s.id === strategyId)
      return acc + (strategy?.savingsPercentage || 0)
    }, 0)

    // Cap total savings at 70% (realistic maximum)
    const cappedSavingsPercentage = Math.min(totalSavingsPercentage, 70)

    const totalTokensOptimized = totalTokensUnoptimized * (1 - cappedSavingsPercentage / 100)
    const monthlyCostOptimized = totalTokensOptimized * costPerToken

    const monthlyCostSavings = monthlyCostUnoptimized - monthlyCostOptimized
    const annualCostSavings = monthlyCostSavings * 12

    const breakEvenMonths = implementationCost / monthlyCostSavings
    const threeYearROI = ((annualCostSavings * 3 - implementationCost) / implementationCost) * 100

    return {
      monthlyMessages,
      avgTokensPerMessage,
      costPerToken,
      monthlyConversations: Math.floor(monthlyMessages / 10), // Estimate

      totalTokensUnoptimized,
      monthlyCostUnoptimized,
      annualCostUnoptimized: monthlyCostUnoptimized * 12,

      totalTokensOptimized,
      monthlyCostOptimized,
      annualCostOptimized: monthlyCostOptimized * 12,

      monthlyTokenSavings: totalTokensUnoptimized - totalTokensOptimized,
      monthlyCostSavings,
      annualCostSavings,
      savingsPercentage: cappedSavingsPercentage,

      implementationCost,
      breakEvenMonths,
      threeYearROI,
    }
  }, [monthlyMessages, avgTokensPerMessage, model, selectedStrategies, implementationCost])

  // ============================================================================
  // Handlers
  // ============================================================================

  const toggleStrategy = (strategyId: string) => {
    setSelectedStrategies(prev =>
      prev.includes(strategyId)
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num))
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold">Token Optimization ROI Calculator</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate the cost savings and return on investment from implementing
          token optimization strategies in your AI chat application.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Usage Inputs */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-500" />
              Usage Parameters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Monthly Messages: {formatNumber(monthlyMessages)}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="1000000"
                  step="1000"
                  value={monthlyMessages}
                  onChange={(e) => setMonthlyMessages(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1K</span>
                  <span>1M</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Avg Tokens per Message: {avgTokensPerMessage}
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={avgTokensPerMessage}
                  onChange={(e) => setAvgTokensPerMessage(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>100</span>
                  <span>2,000</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">AI Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as keyof typeof PRICING_TIERS)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                >
                  {Object.keys(PRICING_TIERS).map(modelName => (
                    <option key={modelName} value={modelName}>
                      {modelName} (${PRICING_TIERS[modelName as keyof typeof PRICING_TIERS].toFixed(3)}/1K tokens)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Implementation Cost: {formatCurrency(implementationCost)}
                </label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={implementationCost}
                  onChange={(e) => setImplementationCost(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$500</span>
                  <span>$10,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Strategies */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-500" />
              Optimization Strategies
            </h3>
            <div className="space-y-2">
              {OPTIMIZATION_STRATEGIES.map(strategy => (
                <motion.button
                  key={strategy.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleStrategy(strategy.id)}
                  className={cn(
                    'w-full p-4 rounded-lg border transition-all text-left',
                    selectedStrategies.includes(strategy.id)
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-border hover:border-brand-500/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-lg',
                      selectedStrategies.includes(strategy.id)
                        ? 'bg-brand-500 text-white'
                        : 'bg-accent text-muted-foreground'
                    )}>
                      {strategy.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{strategy.name}</span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          -{strategy.savingsPercentage}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {strategy.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Cost Comparison */}
          <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-background to-accent/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Cost Comparison
            </h3>

            {/* Before Optimization */}
            <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="text-sm font-medium text-destructive mb-2">
                Before Optimization
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Tokens:</span>
                  <span className="font-mono">{formatNumber(roi.totalTokensUnoptimized)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Cost:</span>
                  <span className="font-mono font-semibold">{formatCurrency(roi.monthlyCostUnoptimized)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Annual Cost:</span>
                  <span className="font-mono font-semibold text-base">{formatCurrency(roi.annualCostUnoptimized)}</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center my-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/10 text-green-600 dark:text-green-400">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-semibold">Save {roi.savingsPercentage}%</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* After Optimization */}
            <div className="p-4 rounded-lg bg-green-600/10 border border-green-600/20">
              <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                After Optimization
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Tokens:</span>
                  <span className="font-mono">{formatNumber(roi.totalTokensOptimized)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Cost:</span>
                  <span className="font-mono font-semibold">{formatCurrency(roi.monthlyCostOptimized)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Annual Cost:</span>
                  <span className="font-mono font-semibold text-base">{formatCurrency(roi.annualCostOptimized)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Metrics */}
          <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-brand-500/10 to-purple-500/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              ROI Analysis
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Monthly Savings</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(roi.monthlyCostSavings)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Annual Savings</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(roi.annualCostSavings)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Break-even Period</div>
                <div className="text-2xl font-bold text-brand-500">
                  {roi.breakEvenMonths.toFixed(1)} mo
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <div className="text-sm text-muted-foreground mb-1">3-Year ROI</div>
                <div className="text-2xl font-bold text-brand-500">
                  {roi.threeYearROI.toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Implementation Recommendation */}
            <div className="mt-4 p-4 rounded-lg bg-brand-500/10 border border-brand-500/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Recommendation</p>
                  <p className="text-sm text-muted-foreground">
                    {roi.threeYearROI > 500 ? (
                      <>Excellent ROI! Token optimization will pay for itself in {roi.breakEvenMonths.toFixed(1)} months and save {formatCurrency(roi.annualCostSavings * 3)} over 3 years.</>
                    ) : roi.threeYearROI > 200 ? (
                      <>Strong ROI! Implementation is highly recommended with {formatCurrency(roi.annualCostSavings)} in annual savings.</>
                    ) : roi.threeYearROI > 100 ? (
                      <>Positive ROI. Token optimization will deliver {formatCurrency(roi.annualCostSavings)} in annual savings.</>
                    ) : (
                      <>Consider optimization if usage scales up. Current savings: {formatCurrency(roi.annualCostSavings)}/year.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Token Savings Breakdown */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">Token Savings Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tokens Saved per Month:</span>
                <span className="font-mono font-semibold">{formatNumber(roi.monthlyTokenSavings)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tokens Saved per Year:</span>
                <span className="font-mono font-semibold">{formatNumber(roi.monthlyTokenSavings * 12)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-sm font-medium">Total Optimization:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{roi.savingsPercentage}% reduction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
