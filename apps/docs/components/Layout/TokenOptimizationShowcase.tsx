'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { durations } from '@/lib/animations'
import {
  DollarSign,
  TrendingDown,
  Zap,
  BarChart3,
  Calculator,
  ArrowRight,
  CheckCircle,
  Percent,
} from 'lucide-react'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

interface ROIMetric {
  label: string
  value: string
  subtext: string
  color: string
}

/**
 * TokenOptimizationShowcase Component
 *
 * Prominently displays token optimization ROI and demos on the homepage.
 * Features an interactive calculator preview and key metrics.
 */
export function TokenOptimizationShowcase() {
  const [monthlyTokens, setMonthlyTokens] = useState(100000)
  const [currentCost, setCurrentCost] = useState(500)

  // Calculate savings based on typical optimization improvements
  const savings = useMemo(() => {
    // TOON format: ~15% reduction on average
    const toonSavings = currentCost * 0.15
    // Prompt caching: ~25% reduction on cacheable prompts (60% of traffic)
    const cachingSavings = currentCost * 0.25 * 0.6
    // Smart truncation: ~10% reduction
    const truncationSavings = currentCost * 0.1

    const totalSavings = toonSavings + cachingSavings + truncationSavings
    const savingsPercent = Math.round((totalSavings / currentCost) * 100)
    const annualSavings = totalSavings * 12

    return {
      monthly: Math.round(totalSavings),
      annual: Math.round(annualSavings),
      percent: savingsPercent,
      newCost: Math.round(currentCost - totalSavings),
    }
  }, [currentCost])

  const metrics: ROIMetric[] = [
    {
      label: 'Monthly Savings',
      value: `$${savings.monthly.toLocaleString()}`,
      subtext: `${savings.percent}% reduction`,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Annual Savings',
      value: `$${savings.annual.toLocaleString()}`,
      subtext: 'At current usage',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Tokens Optimized',
      value: `${(monthlyTokens * 0.35 / 1000).toFixed(0)}K`,
      subtext: '35% fewer tokens sent',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'TOON Format',
      description: '30-45% smaller structured data',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Prompt Caching',
      description: '90% off repeated prompts',
    },
    {
      icon: <TrendingDown className="w-5 h-5" />,
      title: 'Smart Truncation',
      description: 'Intelligent context management',
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
      <div className="container-docs">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-sm font-medium mb-4">
              <DollarSign className="w-4 h-4" />
              Token Optimization
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Cut Your AI Costs by{' '}
              <span className="text-green-600 dark:text-green-400">
                30-50%
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built-in token optimization that actually works. See your savings
              in real-time with our ROI calculator and live demos.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interactive ROI Preview */}
          <ScrollRevealItem>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">ROI Calculator Preview</h3>
                  <p className="text-sm text-gray-500">
                    See your potential savings
                  </p>
                </div>
              </div>

              {/* Input Sliders */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Monthly API Cost: ${currentCost.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={currentCost}
                    onChange={(e) => setCurrentCost(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$100</span>
                    <span>$10,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Monthly Tokens: {(monthlyTokens / 1000).toFixed(0)}K
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={monthlyTokens}
                    onChange={(e) => setMonthlyTokens(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10K</span>
                    <span>1M</span>
                  </div>
                </div>
              </div>

              {/* Savings Display */}
              <motion.div
                key={savings.monthly}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm opacity-80">
                      Estimated Monthly Savings
                    </div>
                    <div className="text-4xl font-bold">
                      ${savings.monthly.toLocaleString()}
                    </div>
                    <div className="text-sm opacity-80 mt-1">
                      {savings.percent}% reduction
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-80">Annual Impact</div>
                    <div className="text-2xl font-bold">
                      ${savings.annual.toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>

              <Link
                href="/tools/roi-calculator"
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Open Full Calculator
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollRevealItem>

          {/* Metrics and Features */}
          <div className="space-y-8">
            {/* Metrics Cards */}
            <ScrollReveal stagger staggerDelay={0.1}>
              <div className="grid gap-4">
                {metrics.map((metric, i) => (
                  <ScrollRevealItem key={i}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-800 flex items-center gap-4"
                    >
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}
                      >
                        <Percent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          {metric.label}
                        </div>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <div className="text-sm text-gray-400">
                          {metric.subtext}
                        </div>
                      </div>
                    </motion.div>
                  </ScrollRevealItem>
                ))}
              </div>
            </ScrollReveal>

            {/* Feature List */}
            <ScrollRevealItem>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
                <h4 className="font-semibold mb-4">What's Included</h4>
                <div className="space-y-4">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                        {feature.icon}
                      </div>
                      <div>
                        <div className="font-medium">{feature.title}</div>
                        <div className="text-sm text-gray-500">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/demos/token-visualizer"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  Try Live Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollRevealItem>
          </div>
        </div>

        {/* Bottom CTA */}
        <ScrollReveal>
          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Used by teams saving thousands on AI costs every month
            </p>
            <div className="flex items-center justify-center gap-6">
              <Link
                href="/guides/token-optimization"
                className="text-green-600 dark:text-green-400 hover:underline font-medium"
              >
                Read the Guide
              </Link>
              <Link
                href="/reference/components/token-optimization-dashboard"
                className="text-green-600 dark:text-green-400 hover:underline font-medium"
              >
                View Dashboard Component
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
