'use client'

/**
 * Token Optimization ROI Calculator - Enhanced Version
 *
 * Interactive calculator with live calculations, animated counters, and URL sharing.
 * Features:
 * - Input controls for monthly requests, tokens/request, and model selection
 * - Sliders for cache hit rate, compression, and routing percentages
 * - Live calculation of costs, savings, and ROI
 * - Before/After breakdown with animated counters
 * - Shareable via URL parameters
 */

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, useSpring, useTransform } from 'framer-motion'
import {
  TrendingDown,
  DollarSign,
  Zap,
  Calculator,
  BarChart3,
  Share2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Percent,
  Database,
  Gauge,
  Copy,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

// ============================================================================
// Types
// ============================================================================

interface ROICalculation {
  // Inputs
  monthlyRequests: number
  avgTokensPerRequest: number
  costPerToken: number

  // Optimization percentages
  cacheHitRate: number
  compressionRate: number
  routingOptimization: number

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
  roiPercentage: number
}

interface PricingModel {
  name: string
  inputCost: number // per 1M tokens
  outputCost: number // per 1M tokens
  averageCost: number // average for calculations
}

// ============================================================================
// Constants
// ============================================================================

const PRICING_MODELS: Record<string, PricingModel> = {
  'claude-opus-4': {
    name: 'Claude Opus 4',
    inputCost: 15,
    outputCost: 75,
    averageCost: 45,
  },
  'claude-sonnet-4': {
    name: 'Claude Sonnet 4',
    inputCost: 3,
    outputCost: 15,
    averageCost: 9,
  },
  'claude-haiku-4': {
    name: 'Claude Haiku 4',
    inputCost: 0.25,
    outputCost: 1.25,
    averageCost: 0.75,
  },
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    inputCost: 10,
    outputCost: 30,
    averageCost: 20,
  },
  'gpt-4': {
    name: 'GPT-4',
    inputCost: 30,
    outputCost: 60,
    averageCost: 45,
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    inputCost: 0.5,
    outputCost: 1.5,
    averageCost: 1,
  },
}

// ============================================================================
// Animated Counter Component
// ============================================================================

function AnimatedCounter({
  value,
  format = 'number',
  className,
}: {
  value: number
  format?: 'number' | 'currency' | 'percentage'
  className?: string
}) {
  const spring = useSpring(value, {
    stiffness: 100,
    damping: 30,
    restSpeed: 0.01,
  })
  const display = useTransform(spring, (latest) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(latest)
    } else if (format === 'percentage') {
      return `${latest.toFixed(1)}%`
    } else {
      return new Intl.NumberFormat('en-US').format(Math.round(latest))
    }
  })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span className={className}>{display}</motion.span>
}

// ============================================================================
// Slider Component
// ============================================================================

function OptimizationSlider({
  label,
  value,
  onChange,
  icon: Icon,
  color,
  description,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg',
              color
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium text-sm">{label}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold">{value}</span>
          <Percent className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-accent"
          style={{
            background: `linear-gradient(to right, hsl(var(--brand-500)) 0%, hsl(var(--brand-500)) ${value}%, hsl(var(--accent)) ${value}%, hsl(var(--accent)) 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function TokenOptimizationROICalculatorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)

  // ============================================================================
  // State - Initialize from URL params or defaults
  // ============================================================================

  const [monthlyRequests, setMonthlyRequests] = useState(() =>
    Number(searchParams.get('requests')) || 100000
  )
  const [avgTokensPerRequest, setAvgTokensPerRequest] = useState(() =>
    Number(searchParams.get('tokens')) || 1500
  )
  const [model, setModel] = useState(() =>
    searchParams.get('model') || 'claude-sonnet-4'
  )
  const [cacheHitRate, setCacheHitRate] = useState(() =>
    Number(searchParams.get('cache')) || 40
  )
  const [compressionRate, setCompressionRate] = useState(() =>
    Number(searchParams.get('compression')) || 30
  )
  const [routingOptimization, setRoutingOptimization] = useState(() =>
    Number(searchParams.get('routing')) || 20
  )

  // ============================================================================
  // URL Sync
  // ============================================================================

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('requests', String(monthlyRequests))
    params.set('tokens', String(avgTokensPerRequest))
    params.set('model', model)
    params.set('cache', String(cacheHitRate))
    params.set('compression', String(compressionRate))
    params.set('routing', String(routingOptimization))

    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', url)
  }, [
    monthlyRequests,
    avgTokensPerRequest,
    model,
    cacheHitRate,
    compressionRate,
    routingOptimization,
  ])

  // ============================================================================
  // Calculations
  // ============================================================================

  const roi: ROICalculation = useMemo(() => {
    const selectedModel = PRICING_MODELS[model]
    const costPerToken = selectedModel.averageCost / 1_000_000

    // Before optimization
    const totalTokensUnoptimized = monthlyRequests * avgTokensPerRequest
    const monthlyCostUnoptimized = totalTokensUnoptimized * costPerToken
    const annualCostUnoptimized = monthlyCostUnoptimized * 12

    // Calculate optimization impact
    // Cache hit rate: reduces tokens by hit rate percentage
    const cacheReduction = cacheHitRate / 100
    // Compression: reduces tokens by compression rate percentage
    const compressionReduction = (compressionRate / 100) * (1 - cacheReduction)
    // Routing: uses cheaper models, reduces effective cost
    const routingReduction = (routingOptimization / 100) * 0.5 // 50% cost reduction when routed

    // Combined optimization (multiplicative, not additive)
    const totalReduction = cacheReduction + compressionReduction
    const totalTokensOptimized = totalTokensUnoptimized * (1 - totalReduction)

    // Apply routing optimization to cost (not token count)
    const baseCostOptimized = totalTokensOptimized * costPerToken
    const monthlyCostOptimized = baseCostOptimized * (1 - routingReduction)
    const annualCostOptimized = monthlyCostOptimized * 12

    // Savings
    const monthlyTokenSavings = totalTokensUnoptimized - totalTokensOptimized
    const monthlyCostSavings = monthlyCostUnoptimized - monthlyCostOptimized
    const annualCostSavings = monthlyCostSavings * 12
    const savingsPercentage =
      (monthlyCostSavings / monthlyCostUnoptimized) * 100
    const roiPercentage =
      (annualCostSavings / (monthlyCostUnoptimized * 12)) * 100

    return {
      monthlyRequests,
      avgTokensPerRequest,
      costPerToken,
      cacheHitRate,
      compressionRate,
      routingOptimization,
      totalTokensUnoptimized,
      monthlyCostUnoptimized,
      annualCostUnoptimized,
      totalTokensOptimized,
      monthlyCostOptimized,
      annualCostOptimized,
      monthlyTokenSavings,
      monthlyCostSavings,
      annualCostSavings,
      savingsPercentage,
      roiPercentage,
    }
  }, [
    monthlyRequests,
    avgTokensPerRequest,
    model,
    cacheHitRate,
    compressionRate,
    routingOptimization,
  ])

  // ============================================================================
  // Handlers
  // ============================================================================

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num))
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/reference/components"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Components
        </Link>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.moderate }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-lg">
              <Calculator className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Token Optimization ROI Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Calculate real-time cost savings and ROI from implementing token
            optimization strategies. Adjust inputs and see results instantly.
          </p>

          {/* Share Button */}
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share This Calculation</span>
              </>
            )}
          </motion.button>
        </motion.header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Basic Inputs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: durations.moderate, delay: 0.1 }}
              className="p-6 rounded-xl border border-border bg-card shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-500" />
                Usage Parameters
              </h3>

              <div className="space-y-6">
                {/* Monthly Requests */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">
                      Monthly Requests
                    </label>
                    <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                      {formatNumber(monthlyRequests)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="10000000"
                    step="1000"
                    value={monthlyRequests}
                    onChange={(e) => setMonthlyRequests(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--brand-500)) 0%, hsl(var(--brand-500)) ${(monthlyRequests / 10000000) * 100}%, hsl(var(--accent)) ${(monthlyRequests / 10000000) * 100}%, hsl(var(--accent)) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1K</span>
                    <span>5M</span>
                    <span>10M</span>
                  </div>
                </div>

                {/* Average Tokens per Request */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">
                      Avg Tokens/Request
                    </label>
                    <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                      {formatNumber(avgTokensPerRequest)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="8000"
                    step="100"
                    value={avgTokensPerRequest}
                    onChange={(e) =>
                      setAvgTokensPerRequest(Number(e.target.value))
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--brand-500)) 0%, hsl(var(--brand-500)) ${(avgTokensPerRequest / 8000) * 100}%, hsl(var(--accent)) ${(avgTokensPerRequest / 8000) * 100}%, hsl(var(--accent)) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>100</span>
                    <span>4K</span>
                    <span>8K</span>
                  </div>
                </div>

                {/* Model Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    AI Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {Object.entries(PRICING_MODELS).map(([key, model]) => (
                      <option key={key} value={key}>
                        {model.name} (${model.averageCost}/1M tokens)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Optimization Sliders */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: durations.moderate, delay: 0.2 }}
              className="p-6 rounded-xl border border-border bg-card shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-500" />
                Optimization Strategies
              </h3>

              <div className="space-y-6">
                <OptimizationSlider
                  label="Cache Hit Rate"
                  value={cacheHitRate}
                  onChange={setCacheHitRate}
                  icon={Database}
                  color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  description="% of requests served from cache"
                />

                <OptimizationSlider
                  label="Compression"
                  value={compressionRate}
                  onChange={setCompressionRate}
                  icon={TrendingDown}
                  color="bg-green-500/10 text-green-600 dark:text-green-400"
                  description="Token reduction via compression"
                />

                <OptimizationSlider
                  label="Smart Routing"
                  value={routingOptimization}
                  onChange={setRoutingOptimization}
                  icon={Gauge}
                  color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
                  description="% routed to cheaper models"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Before/After Comparison */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: durations.moderate, delay: 0.1 }}
              className="p-6 rounded-xl border border-border bg-gradient-to-br from-background to-accent/20 shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                Cost Comparison
              </h3>

              {/* Before Optimization */}
              <div className="mb-4 p-5 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-3">
                  Before Optimization
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">
                      Monthly Tokens:
                    </span>
                    <AnimatedCounter
                      value={roi.totalTokensUnoptimized}
                      format="number"
                      className="font-mono font-semibold"
                    />
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">
                      Monthly Cost:
                    </span>
                    <AnimatedCounter
                      value={roi.monthlyCostUnoptimized}
                      format="currency"
                      className="font-mono font-semibold text-lg"
                    />
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-red-500/20">
                    <span className="text-sm font-medium">Annual Cost:</span>
                    <AnimatedCounter
                      value={roi.annualCostUnoptimized}
                      format="currency"
                      className="font-mono font-bold text-xl text-red-600 dark:text-red-400"
                    />
                  </div>
                </div>
              </div>

              {/* Savings Arrow */}
              <div className="flex items-center justify-center my-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-600/10 to-emerald-600/10 text-green-600 dark:text-green-400 border border-green-600/20">
                  <TrendingDown className="w-5 h-5" />
                  <AnimatedCounter
                    value={roi.savingsPercentage}
                    format="percentage"
                    className="font-bold text-base"
                  />
                  <span className="text-sm font-medium">savings</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* After Optimization */}
              <div className="p-5 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-3">
                  After Optimization
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">
                      Monthly Tokens:
                    </span>
                    <AnimatedCounter
                      value={roi.totalTokensOptimized}
                      format="number"
                      className="font-mono font-semibold"
                    />
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">
                      Monthly Cost:
                    </span>
                    <AnimatedCounter
                      value={roi.monthlyCostOptimized}
                      format="currency"
                      className="font-mono font-semibold text-lg"
                    />
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-green-500/20">
                    <span className="text-sm font-medium">Annual Cost:</span>
                    <AnimatedCounter
                      value={roi.annualCostOptimized}
                      format="currency"
                      className="font-mono font-bold text-xl text-green-600 dark:text-green-400"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Savings Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: durations.moderate, delay: 0.2 }}
              className="p-6 rounded-xl border border-border bg-gradient-to-br from-brand-500/5 to-purple-500/5 shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-500" />
                Savings Breakdown
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background/80 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">
                    Monthly Savings
                  </div>
                  <AnimatedCounter
                    value={roi.monthlyCostSavings}
                    format="currency"
                    className="text-2xl font-bold text-green-600 dark:text-green-400"
                  />
                </div>

                <div className="p-4 rounded-lg bg-background/80 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">
                    Annual Savings
                  </div>
                  <AnimatedCounter
                    value={roi.annualCostSavings}
                    format="currency"
                    className="text-2xl font-bold text-green-600 dark:text-green-400"
                  />
                </div>

                <div className="p-4 rounded-lg bg-background/80 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">
                    ROI Percentage
                  </div>
                  <AnimatedCounter
                    value={roi.roiPercentage}
                    format="percentage"
                    className="text-2xl font-bold text-brand-600 dark:text-brand-400"
                  />
                </div>

                <div className="p-4 rounded-lg bg-background/80 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">
                    Tokens Saved/Month
                  </div>
                  <AnimatedCounter
                    value={roi.monthlyTokenSavings}
                    format="number"
                    className="text-2xl font-bold text-brand-600 dark:text-brand-400"
                  />
                </div>
              </div>

              {/* Recommendation */}
              <div className="mt-6 p-4 rounded-lg bg-brand-500/10 border border-brand-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Recommendation</p>
                    <p className="text-sm text-muted-foreground">
                      {roi.savingsPercentage > 50 ? (
                        <>
                          Excellent optimization potential! You could save{' '}
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(roi.annualCostSavings)}
                          </span>{' '}
                          annually.
                        </>
                      ) : roi.savingsPercentage > 30 ? (
                        <>
                          Strong savings opportunity. Implementing these
                          optimizations will deliver{' '}
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(roi.annualCostSavings)}
                          </span>{' '}
                          in annual savings.
                        </>
                      ) : roi.savingsPercentage > 15 ? (
                        <>
                          Moderate optimization potential. Consider implementing
                          at least caching and compression for{' '}
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(roi.annualCostSavings)}
                          </span>{' '}
                          in annual savings.
                        </>
                      ) : (
                        <>
                          Your configuration has room for optimization. Try
                          increasing cache hit rates and compression to maximize
                          savings.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Token Efficiency */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: durations.moderate, delay: 0.3 }}
              className="p-6 rounded-xl border border-border bg-card shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-4">Token Efficiency</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Tokens saved per request:
                  </span>
                  <AnimatedCounter
                    value={
                      avgTokensPerRequest -
                      avgTokensPerRequest *
                        (1 - roi.savingsPercentage / 100)
                    }
                    format="number"
                    className="font-mono font-semibold"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Cost per optimized request:
                  </span>
                  <AnimatedCounter
                    value={
                      roi.monthlyCostOptimized / roi.monthlyRequests
                    }
                    format="currency"
                    className="font-mono font-semibold"
                  />
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <span className="text-sm font-medium">
                    Overall efficiency gain:
                  </span>
                  <AnimatedCounter
                    value={roi.savingsPercentage}
                    format="percentage"
                    className="font-semibold text-green-600 dark:text-green-400"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Implementation Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.moderate, delay: 0.4 }}
          className="mt-8 p-6 rounded-xl border border-border bg-accent/20"
        >
          <h3 className="text-lg font-semibold mb-4">
            How to Achieve These Savings
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold">Provider Caching</h4>
              </div>
              <p className="text-muted-foreground">
                Use Anthropic's Prompt Caching or OpenAI's Cached Completions to
                serve repeated contexts from cache at 90% cost reduction.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold">Token Compression</h4>
              </div>
              <p className="text-muted-foreground">
                Implement message compression, context summarization, and smart
                pruning to reduce token usage while maintaining quality.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold">Model Routing</h4>
              </div>
              <p className="text-muted-foreground">
                Route simple queries to faster, cheaper models like Haiku while
                reserving premium models for complex tasks.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/cookbook/provider-caching-setup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors font-medium"
            >
              Learn Implementation Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
