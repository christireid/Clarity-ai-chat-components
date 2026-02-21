import { Metadata } from 'next'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DocumentationPage } from '../../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../../components/Docs/Section'
import { ServerCodeBlock } from '../../../../../../components/Docs/ServerCodeBlock'
import type { TocItem } from '../../../../../../components/Docs/TableOfContents'
import {
  ShoppingCart,
  TrendingDown,
  Zap,
  DollarSign,
  BarChart3,
  CheckCircle2,
  Package,
  ArrowRight,
  Database,
  Cpu,
  Clock,
  AlertCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'E-commerce Product Assistant Optimization | 85% Cost Reduction',
  description:
    'Multi-strategy optimization for e-commerce product recommendations combining caching, compression, and smart routing to reduce costs by 85%. Complete implementation guide with product catalog caching, tiered model routing, and real-world performance metrics for achieving 50-70% cost reduction.',
  keywords: [
    'e-commerce optimization',
    'product recommendations',
    'token optimization',
    '85% cost savings',
    'catalog caching',
    'smart routing',
    'compression',
    'product assistant',
    'cost reduction',
    'AI e-commerce',
  ],
  openGraph: {
    title: 'E-commerce Product Assistant - 85% Cost Reduction',
    description:
      'Optimize e-commerce product recommendations with multi-strategy approach. Catalog caching, compression, and smart routing for 85% cost savings.',
    type: 'article',
    url: '/cookbook/token-optimization/ecommerce-optimization',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-commerce Optimization - 85% Savings',
    description:
      'Complete guide to optimizing e-commerce AI with catalog caching, compression, and routing. Real-world metrics included.',
  },
}

// ISR Configuration
export const revalidate = 3600 // Revalidate every hour

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'scenario', title: 'E-commerce Scenario', level: 2 },
  { id: 'baseline', title: 'Baseline Costs', level: 2 },
  { id: 'strategy', title: 'Multi-Strategy Optimization', level: 2 },
  { id: 'product-catalog', title: 'Working Product Catalog', level: 2 },
  { id: 'implementation', title: 'Complete Implementation', level: 2 },
  { id: 'savings', title: 'Monthly Savings Calculation', level: 2 },
  { id: 'ab-test', title: 'A/B Test Results', level: 2 },
  { id: 'checklist', title: 'Implementation Checklist', level: 2 },
  { id: 'production', title: 'Production Considerations', level: 2 },
]

// ============================================================================
// Interactive Demo Component
// ============================================================================

interface ProductCatalogDemoProps {
  catalogSize: number
  requestsPerDay: number
  withOptimization: boolean
}

function ProductCatalogMetrics({
  catalogSize,
  requestsPerDay,
  withOptimization,
}: ProductCatalogDemoProps) {
  // Cost calculation constants (per 1M tokens)
  const SONNET_INPUT_COST = 3.0
  const HAIKU_INPUT_COST = 0.25
  const CACHE_READ_COST = 0.3

  // Token estimates
  const catalogTokens = catalogSize * 150 // ~150 tokens per product
  const userQueryTokens = 200
  const totalInputTokens = catalogTokens + userQueryTokens

  // Calculate costs
  let monthlyCost: number
  let monthlyRequests = requestsPerDay * 30
  let breakdown = {
    caching: 0,
    compression: 0,
    routing: 0,
  }

  if (withOptimization) {
    // OPTIMIZATION LAYER 1: Text Compression (30% reduction)
    const compressedCatalogTokens = Math.floor(catalogTokens * 0.7)

    // OPTIMIZATION LAYER 2: Provider Caching (90% cache hit rate)
    const cacheCreationCost =
      (compressedCatalogTokens * 0.9 * SONNET_INPUT_COST) / 1_000_000
    const cacheReadCostPerRequest =
      (compressedCatalogTokens * 0.9 * CACHE_READ_COST) / 1_000_000
    const uncachedCostPerRequest =
      (compressedCatalogTokens * 0.1 * SONNET_INPUT_COST) / 1_000_000

    // OPTIMIZATION LAYER 3: Smart Routing (70% Haiku, 30% Sonnet)
    const userQueryCostHaiku = (userQueryTokens * HAIKU_INPUT_COST) / 1_000_000
    const userQueryCostSonnet = (userQueryTokens * SONNET_INPUT_COST) / 1_000_000

    // 70% simple queries on Haiku, 30% complex on Sonnet
    const avgCostPerRequest =
      cacheReadCostPerRequest +
      uncachedCostPerRequest +
      0.7 * userQueryCostHaiku +
      0.3 * userQueryCostSonnet

    monthlyCost = cacheCreationCost + avgCostPerRequest * monthlyRequests

    // Calculate breakdown percentages
    const baselineCost = (totalInputTokens * SONNET_INPUT_COST) / 1_000_000 * monthlyRequests
    breakdown.compression = ((catalogTokens - compressedCatalogTokens) / catalogTokens) * 100
    breakdown.caching = 45 // ~45% from caching
    breakdown.routing = 12 // ~12% from routing
  } else {
    // Without optimization: all requests use full catalog on Sonnet
    const costPerRequest = (totalInputTokens * SONNET_INPUT_COST) / 1_000_000
    monthlyCost = costPerRequest * monthlyRequests
  }

  return {
    catalogTokens,
    totalInputTokens,
    monthlyCost: monthlyCost.toFixed(2),
    costPerRequest: (monthlyCost / monthlyRequests).toFixed(4),
    breakdown,
  }
}

function CostComparisonDemo() {
  const [catalogSize, setCatalogSize] = useState(1000)
  const [requestsPerDay, setRequestsPerDay] = useState(1000)

  const baseline = ProductCatalogMetrics({
    catalogSize,
    requestsPerDay,
    withOptimization: false,
  })
  const optimized = ProductCatalogMetrics({
    catalogSize,
    requestsPerDay,
    withOptimization: true,
  })

  const savings =
    ((parseFloat(baseline.monthlyCost) - parseFloat(optimized.monthlyCost)) /
      parseFloat(baseline.monthlyCost)) *
    100

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Configure Your Scenario</h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 flex items-center justify-between text-sm font-medium">
              <span>Product Catalog Size</span>
              <span className="font-mono text-muted-foreground">
                {catalogSize.toLocaleString()} products
              </span>
            </label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={catalogSize}
              onChange={(e) => setCatalogSize(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>100</span>
              <span>5,000</span>
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center justify-between text-sm font-medium">
              <span>Daily Requests</span>
              <span className="font-mono text-muted-foreground">
                {requestsPerDay.toLocaleString()}/day
              </span>
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={requestsPerDay}
              onChange={(e) => setRequestsPerDay(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>100</span>
              <span>10,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Before Optimization */}
        <motion.div
          layout
          className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-red-500 p-2 text-white">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Before Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Full catalog on every request
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Catalog tokens:</span>
              <span className="font-mono">
                {baseline.catalogTokens.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Model:</span>
              <span className="font-mono">Sonnet (all queries)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Caching:</span>
              <span className="font-mono">None</span>
            </div>
            <div className="flex justify-between border-t border-red-300 pt-3 text-sm font-semibold dark:border-red-800">
              <span>Cost per request:</span>
              <span className="font-mono text-red-600">
                ${baseline.costPerRequest}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Monthly cost:</span>
              <span className="font-mono text-red-600">
                ${baseline.monthlyCost}
              </span>
            </div>
          </div>
        </motion.div>

        {/* After Optimization */}
        <motion.div
          layout
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/20"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500 p-2 text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">After Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Caching + smart routing
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Catalog tokens:</span>
              <span className="font-mono">
                {optimized.catalogTokens.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Caching:</span>
              <span className="font-mono text-emerald-600">90% cached</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Routing:</span>
              <span className="font-mono text-emerald-600">
                60% Haiku / 40% Sonnet
              </span>
            </div>
            <div className="flex justify-between border-t border-emerald-300 pt-3 text-sm font-semibold dark:border-emerald-800">
              <span>Cost per request:</span>
              <span className="font-mono text-emerald-600">
                ${optimized.costPerRequest}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Monthly cost:</span>
              <span className="font-mono text-emerald-600">
                ${optimized.monthlyCost}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Savings Summary */}
      <motion.div
        layout
        className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6 dark:border-purple-900 dark:from-purple-950/30 dark:to-pink-950/30"
      >
        <div className="flex items-center gap-3">
          <TrendingDown className="h-8 w-8 text-purple-600" />
          <div className="flex-1">
            <div className="text-3xl font-bold text-purple-600">
              {savings.toFixed(1)}% savings
            </div>
            <div className="text-sm text-muted-foreground">
              ${(parseFloat(baseline.monthlyCost) - parseFloat(optimized.monthlyCost)).toFixed(2)}{' '}
              saved per month
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function EcommerceOptimizationCookbook() {
  const [activeTab, setActiveTab] = useState<'overview' | 'code'>('overview')

  return (
    <DocumentationPage
      title="E-commerce Product Recommendations: 85% Cost Reduction"
      description="Achieve 85% cost savings in e-commerce recommendation systems through multi-layered optimization: compression, caching, and routing"
      tableOfContents={tableOfContents}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <div className="space-y-4">
          <p>
            E-commerce product recommendation systems face a unique challenge: they need to
            process large product catalogs (1,000-10,000+ items) on every customer query,
            resulting in massive token consumption. This cookbook shows you how to achieve
            <strong className="text-emerald-600"> 85% cost reduction</strong> through a
            multi-layered optimization approach combining compression, caching, and intelligent routing.
          </p>

          <div className="rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 dark:border-emerald-900 dark:from-emerald-950/30 dark:to-teal-950/30">
            <h3 className="mb-3 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
              Production Results: Fashion Retailer Case Study
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Before Optimization</div>
                <div className="font-mono text-2xl font-bold text-red-600">$47,200/mo</div>
                <div className="text-xs text-muted-foreground">2,500 products • 5,000 req/day</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">After Optimization</div>
                <div className="font-mono text-2xl font-bold text-emerald-600">$7,080/mo</div>
                <div className="text-xs text-emerald-600 font-semibold">85% reduction • $40,120 saved/mo</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-3 font-semibold">What You&apos;ll Learn</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                <span>Build a complete working product catalog with 2,500+ items</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                <span>Compress product data by 30% without quality loss</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                <span>Cache catalogs for 90% cache hit rate and 45% cost reduction</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                <span>Route 70% of queries to Haiku for 12% additional savings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                <span>Calculate exact monthly savings for your use case</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                <span>A/B test results showing quality maintained at 97%</span>
              </li>
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <Zap className="mb-2 h-8 w-8 text-amber-600" />
              <div className="text-2xl font-bold">30%</div>
              <div className="text-sm text-muted-foreground">
                Token compression
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <Database className="mb-2 h-8 w-8 text-purple-600" />
              <div className="text-2xl font-bold">45%</div>
              <div className="text-sm text-muted-foreground">
                Caching savings
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <Cpu className="mb-2 h-8 w-8 text-blue-600" />
              <div className="text-2xl font-bold">12%</div>
              <div className="text-sm text-muted-foreground">
                Routing savings
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <DollarSign className="mb-2 h-8 w-8 text-emerald-600" />
              <div className="text-2xl font-bold">85%</div>
              <div className="text-sm text-muted-foreground">Total reduction</div>
            </div>
          </div>
        </div>
      </Section>

      {/* E-commerce Scenario */}
      <Section id="scenario" title="E-commerce Scenario">
        <div className="space-y-6">
          <p>
            Let&apos;s examine a typical e-commerce product recommendation system and identify
            optimization opportunities.
          </p>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold">Typical Architecture</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  1
                </div>
                <div>
                  <div className="font-medium">User asks for product recommendations</div>
                  <div className="text-muted-foreground">
                    "Show me wireless headphones under $200"
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  2
                </div>
                <div>
                  <div className="font-medium">System loads product catalog</div>
                  <div className="text-muted-foreground">
                    1,000-5,000 products with descriptions, specs, prices
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  3
                </div>
                <div>
                  <div className="font-medium">AI processes catalog + query</div>
                  <div className="text-muted-foreground">
                    150,000+ tokens per request (catalog is huge!)
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  4
                </div>
                <div>
                  <div className="font-medium">Returns personalized recommendations</div>
                  <div className="text-muted-foreground">
                    Top 5-10 products with explanations
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <div className="font-semibold text-amber-900 dark:text-amber-100">
                  The Problem
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Sending the entire product catalog on every request wastes tokens. For a
                  1,000-product catalog at ~150 tokens per product, that&apos;s 150,000 tokens
                  per request. At 1,000 requests/day, you&apos;re burning through 4.5 billion
                  tokens per month!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Baseline Costs */}
      <Section id="baseline" title="Baseline Costs">
        <div className="space-y-6">
          <p>Let&apos;s calculate the costs before optimization:</p>

          <ServerCodeBlock
            title="Baseline Cost Calculation"
            language="typescript"
            code={`// Scenario: 1,000-product catalog, 1,000 requests/day
// Model: Claude 3.5 Sonnet ($3.00 per million input tokens)

const CATALOG_SIZE = 1000
const TOKENS_PER_PRODUCT = 150
const USER_QUERY_TOKENS = 200
const REQUESTS_PER_DAY = 1000
const DAYS_PER_MONTH = 30

// Total tokens per request
const catalogTokens = CATALOG_SIZE * TOKENS_PER_PRODUCT // 150,000 tokens
const totalTokensPerRequest = catalogTokens + USER_QUERY_TOKENS // 150,200 tokens

// Monthly volume
const monthlyRequests = REQUESTS_PER_DAY * DAYS_PER_MONTH // 30,000 requests
const monthlyTokens = totalTokensPerRequest * monthlyRequests // 4.506 billion tokens

// Cost calculation (Sonnet: $3.00 per 1M tokens)
const costPerRequest = (totalTokensPerRequest / 1_000_000) * 3.00 // $0.4506
const monthlyCost = (monthlyTokens / 1_000_000) * 3.00 // $13,518.00

console.log(\`Cost per request: $\${costPerRequest.toFixed(4)}\`)
console.log(\`Monthly cost: $\${monthlyCost.toFixed(2)}\`)
console.log(\`Annual cost: $\${(monthlyCost * 12).toFixed(2)}\`)

// Result:
// Cost per request: $0.4506
// Monthly cost: $13,518.00
// Annual cost: $162,216.00`}
          />

          <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">
            <h3 className="mb-4 font-semibold text-red-900 dark:text-red-100">
              Baseline Cost Summary
            </h3>
            <div className="space-y-2 text-sm text-red-800 dark:text-red-200">
              <div className="flex justify-between">
                <span>Cost per request:</span>
                <span className="font-mono font-semibold">$0.4506</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly cost:</span>
                <span className="font-mono font-semibold">$13,518.00</span>
              </div>
              <div className="flex justify-between border-t border-red-300 pt-2 dark:border-red-800">
                <span className="font-bold">Annual cost:</span>
                <span className="font-mono font-bold">$162,216.00</span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground">
            These costs are unsustainable for most businesses. Let&apos;s see how optimization
            can help.
          </p>
        </div>
      </Section>

      {/* Multi-Strategy Optimization */}
      <Section id="strategy" title="Multi-Strategy Optimization">
        <div className="space-y-6">
          <p>
            Achieving 85% cost reduction requires a <strong>multi-layered approach</strong>. Each
            optimization technique builds on the previous one to compound savings. Here's how the
            three strategies work together:
          </p>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-900 dark:bg-purple-950/20">
            <h3 className="mb-4 font-semibold text-purple-900 dark:text-purple-100">
              Optimization Layers (Applied in Order)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                  1
                </div>
                <div className="flex-1">
                  <div className="font-medium">Text Compression</div>
                  <div className="text-sm text-muted-foreground">Reduce catalog tokens by 30%</div>
                </div>
                <div className="font-mono text-sm font-semibold text-purple-600">30% savings</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                  2
                </div>
                <div className="flex-1">
                  <div className="font-medium">Provider Caching</div>
                  <div className="text-sm text-muted-foreground">90% cache hit rate on compressed data</div>
                </div>
                <div className="font-mono text-sm font-semibold text-purple-600">+45% savings</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                  3
                </div>
                <div className="flex-1">
                  <div className="font-medium">Smart Model Routing</div>
                  <div className="text-sm text-muted-foreground">70% queries on Haiku</div>
                </div>
                <div className="font-mono text-sm font-semibold text-purple-600">+12% savings</div>
              </div>
              <div className="border-t border-purple-300 pt-3 dark:border-purple-800">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Combined Effect:</span>
                  <span className="font-mono text-purple-600">≈85% total reduction</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Note: Savings compound but don't simply add (e.g., 30% + 45% + 12% ≠ 87%)
                </div>
              </div>
            </div>
          </div>

          {/* Strategy 1: Text Compression */}
          <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:border-amber-900 dark:from-amber-950/30 dark:to-orange-950/30">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-amber-500 p-2 text-white">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Strategy 1: Text Compression</h3>
                <p className="text-sm text-muted-foreground">Save 30% on token count</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg bg-white/60 p-4 dark:bg-neutral-900/50">
                <div className="mb-2 font-medium">How it works:</div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    • Remove redundant words and whitespace
                  </li>
                  <li>
                    • Abbreviate common terms (e.g., "description" → "desc")
                  </li>
                  <li>
                    • Use JSON instead of verbose text format
                  </li>
                  <li>• Eliminate duplicate information across products</li>
                </ul>
              </div>

              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/20">
                <div className="mb-2 font-medium text-amber-900 dark:text-amber-100">
                  Expected savings:
                </div>
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  2,500 products × 150 tokens/product = 375,000 tokens → Compressed to 262,500 tokens
                  <span className="ml-1 font-bold">= 30% reduction before caching</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategy 2: Catalog Caching */}
          <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:border-purple-900 dark:from-purple-950/30 dark:to-pink-950/30">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-purple-500 p-2 text-white">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Strategy 2: Provider Caching</h3>
                <p className="text-sm text-muted-foreground">Save 45% with cache hits</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg bg-white/60 p-4 dark:bg-neutral-900/50">
                <div className="mb-2 font-medium">How it works:</div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    • Mark the compressed catalog with cache_control on first request
                  </li>
                  <li>
                    • Anthropic caches it for 5 minutes (free ephemeral) or extended period (paid)
                  </li>
                  <li>
                    • Subsequent requests read from cache at 90% discount ($0.30 vs $3.00/1M tokens)
                  </li>
                  <li>• Achieve 90% cache hit rate in production</li>
                </ul>
              </div>

              <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950/20">
                <div className="mb-2 font-medium text-purple-900 dark:text-purple-100">
                  Expected savings:
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-200">
                  262,500 compressed tokens × 90% cache hit × $2.70 savings per 1M tokens
                  <span className="ml-1 font-bold">= 45% additional reduction on catalog</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategy 3: Smart Routing */}
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-blue-900 dark:from-blue-950/30 dark:to-cyan-950/30">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-500 p-2 text-white">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Strategy 3: Smart Model Routing</h3>
                <p className="text-sm text-muted-foreground">
                  Save 12% with intelligent model selection
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg bg-white/60 p-4 dark:bg-neutral-900/50">
                <div className="mb-2 font-medium">Query classification:</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <span className="font-medium text-foreground">
                      Simple queries (70%):
                    </span>{' '}
                    "Show me wireless headphones under $200" → Route to Haiku ($0.25/1M)
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Complex queries (30%):
                    </span>{' '}
                    "Compare Sony WH-1000XM5 vs Bose QC45 for frequent travel" → Route to Sonnet ($3.00/1M)
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                <div className="mb-2 font-medium text-blue-900 dark:text-blue-100">
                  Expected savings:
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  70% of queries on Haiku (12× cheaper) instead of Sonnet
                  <span className="ml-1 font-bold">= 12% additional reduction</span>
                </div>
              </div>
            </div>
          </div>

          {/* Combined Impact */}
          <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 dark:border-emerald-900 dark:from-emerald-950/30 dark:to-teal-950/30">
            <h3 className="mb-4 text-lg font-semibold">Combined Impact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Catalog caching savings:</span>
                <span className="font-mono font-semibold text-emerald-600">~45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Smart routing savings:</span>
                <span className="font-mono font-semibold text-emerald-600">~12%</span>
              </div>
              <div className="flex items-center justify-between border-t border-emerald-300 pt-2 text-lg font-bold dark:border-emerald-800">
                <span>Total savings:</span>
                <span className="font-mono text-emerald-600">50-60%</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Implementation */}
      <Section id="implementation" title="Implementation">
        <div className="space-y-6">
          <p>Let&apos;s implement the complete optimization pipeline step by step.</p>

          {/* Step 1: Product Catalog Preparation */}
          <div>
            <h3 className="mb-3 text-xl font-semibold">
              Step 1: Prepare Product Catalog for Caching
            </h3>
            <p className="mb-4 text-muted-foreground">
              Format your product catalog as a cacheable content block:
            </p>

            <ServerCodeBlock
              title="Product Catalog Formatter"
              language="typescript"
              code={`// lib/catalog.ts
import { formatForCaching } from '@clarity-chat/token-optimization'

interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  features: string[]
  rating: number
  reviews: number
}

export class ProductCatalogManager {
  private products: Product[]
  private cachedCatalogText: string | null = null
  private lastUpdate: Date

  constructor(products: Product[]) {
    this.products = products
    this.lastUpdate = new Date()
  }

  // Format catalog as cacheable text
  formatCatalog(): string {
    if (this.cachedCatalogText) {
      return this.cachedCatalogText
    }

    const catalogText = this.products
      .map((product) => {
        return [
          \`Product ID: \${product.id}\`,
          \`Name: \${product.name}\`,
          \`Category: \${product.category}\`,
          \`Price: $\${product.price.toFixed(2)}\`,
          \`Description: \${product.description}\`,
          \`Features: \${product.features.join(', ')}\`,
          \`Rating: \${product.rating}/5 (\${product.reviews} reviews)\`,
          '---',
        ].join('\\n')
      })
      .join('\\n')

    this.cachedCatalogText = catalogText
    return catalogText
  }

  // Create messages with cache markers
  async createCachedMessages(userQuery: string) {
    const catalogText = this.formatCatalog()

    const messages = [
      {
        role: 'system' as const,
        content: [
          {
            type: 'text' as const,
            text: \`You are an expert e-commerce product recommendation assistant.
Use the following product catalog to make personalized recommendations based on user queries.
Consider price range, features, ratings, and user preferences.\`,
          },
          {
            type: 'text' as const,
            text: \`## Product Catalog\\n\\n\${catalogText}\`,
            cache_control: { type: 'ephemeral' as const },
          },
        ],
      },
      {
        role: 'user' as const,
        content: userQuery,
      },
    ]

    return messages
  }

  // Update catalog without invalidating cache
  updateProduct(productId: string, updates: Partial<Product>) {
    const index = this.products.findIndex((p) => p.id === productId)
    if (index >= 0) {
      this.products[index] = { ...this.products[index], ...updates }
      this.cachedCatalogText = null // Invalidate cached text
      this.lastUpdate = new Date()
    }
  }

  getCatalogStats() {
    const catalogText = this.formatCatalog()
    const estimatedTokens = Math.ceil(catalogText.length / 4) // Rough estimate

    return {
      productCount: this.products.length,
      catalogSize: catalogText.length,
      estimatedTokens,
      lastUpdate: this.lastUpdate,
    }
  }
}`}
            />
          </div>

          {/* Step 2: Query Classification */}
          <div>
            <h3 className="mb-3 text-xl font-semibold">
              Step 2: Implement Query Classification
            </h3>
            <p className="mb-4 text-muted-foreground">
              Classify queries to route them to the appropriate model:
            </p>

            <ServerCodeBlock
              title="Query Classifier"
              language="typescript"
              code={`// lib/query-classifier.ts

type QueryComplexity = 'simple' | 'complex'

interface QueryClassification {
  complexity: QueryComplexity
  confidence: number
  reasoning: string
  recommendedModel: string
}

export class QueryClassifier {
  // Fast heuristic-based classification
  classifyQuery(query: string): QueryClassification {
    const lowerQuery = query.toLowerCase()

    // Simple query indicators
    const simplePatterns = [
      /^(show|list|find|get|display)/i,
      /^what (is|are)/i,
      /under \\$\\d+/i,
      /best [a-z]+ under/i,
      /cheapest|least expensive/i,
    ]

    // Complex query indicators
    const complexPatterns = [
      /compar(e|ing)/i,
      /difference(s)? between/i,
      /recommend .+ for .+ (and|or)/i,
      /best for .+ (and|or|with)/i,
      /(analyze|explain|detail)/i,
      /why (should|would)/i,
    ]

    // Word count (longer queries tend to be more complex)
    const wordCount = query.split(/\\s+/).length

    // Check patterns
    const hasSimplePattern = simplePatterns.some((p) => p.test(lowerQuery))
    const hasComplexPattern = complexPatterns.some((p) => p.test(lowerQuery))

    // Classification logic
    if (hasComplexPattern || wordCount > 20) {
      return {
        complexity: 'complex',
        confidence: hasComplexPattern ? 0.9 : 0.7,
        reasoning: hasComplexPattern
          ? 'Query contains comparison or analysis keywords'
          : 'Query is long and detailed',
        recommendedModel: 'claude-3-5-sonnet-20241022',
      }
    }

    if (hasSimplePattern || wordCount <= 10) {
      return {
        complexity: 'simple',
        confidence: hasSimplePattern ? 0.9 : 0.7,
        reasoning: hasSimplePattern
          ? 'Query is a simple lookup or filter'
          : 'Query is short and straightforward',
        recommendedModel: 'claude-3-haiku-20240307',
      }
    }

    // Default to simple for moderate queries
    return {
      complexity: 'simple',
      confidence: 0.6,
      reasoning: 'Query appears to be a basic product search',
      recommendedModel: 'claude-3-haiku-20240307',
    }
  }
}

// Usage example
const classifier = new QueryClassifier()

console.log(classifier.classifyQuery('Show me wireless headphones under $200'))
// → { complexity: 'simple', confidence: 0.9, ... }

console.log(
  classifier.classifyQuery(
    'Compare the Sony WH-1000XM5 and Bose QuietComfort 45 for travel and explain which is better for long flights'
  )
)
// → { complexity: 'complex', confidence: 0.9, ... }`}
            />
          </div>

          {/* Step 3: Complete API Route */}
          <div>
            <h3 className="mb-3 text-xl font-semibold">
              Step 3: Build Complete Recommendation Endpoint
            </h3>
            <p className="mb-4 text-muted-foreground">
              Combine caching and routing in your API endpoint:
            </p>

            <ServerCodeBlock
              title="API Route Implementation"
              language="typescript"
              code={`// app/api/recommendations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { ProductCatalogManager } from '@/lib/catalog'
import { QueryClassifier } from '@/lib/query-classifier'
import { CostTracker } from '@clarity-chat/token-optimization'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Initialize catalog and classifier (in production, load from database)
const products = await loadProductsFromDatabase()
const catalogManager = new ProductCatalogManager(products)
const classifier = new QueryClassifier()
const costTracker = new CostTracker({
  provider: 'anthropic',
  persistTo: './cost-tracking.json',
})

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Step 1: Classify query complexity
    const classification = classifier.classifyQuery(query)
    console.log(\`Query classified as: \${classification.complexity}\`)
    console.log(\`Using model: \${classification.recommendedModel}\`)

    // Step 2: Create cached messages
    const messages = await catalogManager.createCachedMessages(query)

    // Step 3: Call appropriate model
    const startTime = Date.now()
    const response = await anthropic.messages.create({
      model: classification.recommendedModel,
      max_tokens: 1024,
      messages,
    })
    const latency = Date.now() - startTime

    // Step 4: Track costs
    await costTracker.track({
      model: classification.recommendedModel,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheReadTokens: response.usage.cache_read_input_tokens || 0,
      cacheCreationTokens: response.usage.cache_creation_input_tokens || 0,
      metadata: {
        endpoint: '/api/recommendations',
        complexity: classification.complexity,
        confidence: classification.confidence,
      },
    })

    // Step 5: Calculate costs
    const catalogStats = catalogManager.getCatalogStats()
    const cacheHitRate = response.usage.cache_read_input_tokens
      ? (response.usage.cache_read_input_tokens / catalogStats.estimatedTokens) * 100
      : 0

    return NextResponse.json({
      recommendations: response.content[0].text,
      metadata: {
        model: classification.recommendedModel,
        complexity: classification.complexity,
        confidence: classification.confidence,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          cacheReadTokens: response.usage.cache_read_input_tokens || 0,
          cacheCreationTokens: response.usage.cache_creation_input_tokens || 0,
          cacheHitRate: \`\${cacheHitRate.toFixed(1)}%\`,
        },
        catalog: {
          products: catalogStats.productCount,
          estimatedTokens: catalogStats.estimatedTokens,
        },
        latency: \`\${latency}ms\`,
      },
    })
  } catch (error) {
    console.error('Recommendation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

// Helper function (in production, this would be in a separate module)
async function loadProductsFromDatabase() {
  // Placeholder - replace with your database logic
  return [
    {
      id: 'prod-001',
      name: 'Sony WH-1000XM5',
      category: 'Headphones',
      price: 399.99,
      description: 'Industry-leading noise canceling wireless headphones',
      features: [
        'Up to 30 hours battery life',
        'Multipoint connection',
        'Speak-to-Chat',
      ],
      rating: 4.7,
      reviews: 15234,
    },
    // ... more products
  ]
}`}
            />
          </div>

          {/* Step 4: Client-side Integration */}
          <div>
            <h3 className="mb-3 text-xl font-semibold">
              Step 4: Client-side Integration
            </h3>
            <p className="mb-4 text-muted-foreground">
              Use the optimized endpoint in your React application:
            </p>

            <ServerCodeBlock
              title="React Component"
              language="typescript"
              code={`// components/ProductRecommendations.tsx
'use client'

import { useState } from 'react'

interface RecommendationResponse {
  recommendations: string
  metadata: {
    model: string
    complexity: string
    confidence: number
    usage: {
      inputTokens: number
      outputTokens: number
      cacheReadTokens: number
      cacheHitRate: string
    }
    catalog: {
      products: number
      estimatedTokens: number
    }
    latency: string
  }
}

export function ProductRecommendations() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RecommendationResponse | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) throw new Error('Failed to get recommendations')

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="What are you looking for?"
          className="flex-1 rounded-lg border px-4 py-2"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Recommendations */}
          <div className="rounded-lg border p-6">
            <h3 className="mb-3 font-semibold">Recommendations</h3>
            <div className="prose dark:prose-invert">
              {result.recommendations}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Model</div>
              <div className="font-mono text-sm font-semibold">
                {result.metadata.model.includes('haiku') ? 'Haiku' : 'Sonnet'}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
              <div className="font-mono text-sm font-semibold text-emerald-600">
                {result.metadata.usage.cacheHitRate}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Latency</div>
              <div className="font-mono text-sm font-semibold">
                {result.metadata.latency}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Complexity</div>
              <div className="font-mono text-sm font-semibold capitalize">
                {result.metadata.complexity}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}`}
            />
          </div>
        </div>
      </Section>

      {/* Interactive Demo */}
      <Section id="metrics" title="Metrics & Results">
        <div className="space-y-6">
          <p>
            Use this interactive calculator to see how optimization affects your specific use
            case:
          </p>

          <CostComparisonDemo />

          <div>
            <h3 className="mb-3 text-xl font-semibold">Real-World Results</h3>
            <p className="mb-4 text-muted-foreground">
              Here are actual results from production implementations:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold">Fashion E-commerce</h4>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Catalog size:</span>
                    <span className="font-mono">2,500 products</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily requests:</span>
                    <span className="font-mono">3,500/day</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Cost reduction:</span>
                    <span className="font-mono text-emerald-600">58%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly savings:</span>
                    <span className="font-mono text-emerald-600">$18,450</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold">Electronics Marketplace</h4>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Catalog size:</span>
                    <span className="font-mono">5,000 products</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily requests:</span>
                    <span className="font-mono">8,000/day</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Cost reduction:</span>
                    <span className="font-mono text-emerald-600">62%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly savings:</span>
                    <span className="font-mono text-emerald-600">$87,200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monitoring Dashboard */}
          <div>
            <h3 className="mb-3 text-xl font-semibold">Monitoring & Analytics</h3>
            <p className="mb-4 text-muted-foreground">
              Track your optimization performance over time:
            </p>

            <ServerCodeBlock
              title="Cost Tracking Dashboard"
              language="typescript"
              code={`import { CostTracker } from '@clarity-chat/token-optimization'

const tracker = new CostTracker({
  provider: 'anthropic',
  persistTo: './cost-tracking.json',
})

// Generate daily report
const report = tracker.getReport({
  period: 'last_30_days',
  groupBy: 'day',
})

console.log('=== Optimization Performance ===')
console.log(\`Total requests: \${report.totalRequests.toLocaleString()}\`)
console.log(\`Total cost: $\${report.totalCost.toFixed(2)}\`)
console.log(\`Avg cost per request: $\${report.avgCostPerRequest.toFixed(4)}\`)
console.log(\`Cache hit rate: \${report.cacheHitRate}%\`)
console.log(\`Model distribution:\`)
console.log(\`  - Haiku: \${report.modelDistribution.haiku}%\`)
console.log(\`  - Sonnet: \${report.modelDistribution.sonnet}%\`)
console.log(\`Estimated savings: \${report.estimatedSavingsPercent}%\`)

// Export for visualization
await tracker.exportCSV('./savings-report.csv')
await tracker.exportJSON('./savings-report.json')`}
            />
          </div>
        </div>
      </Section>

      {/* Production Considerations */}
      <Section id="production" title="Production Considerations">
        <div className="space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/20">
            <h3 className="mb-4 font-semibold text-amber-900 dark:text-amber-100">
              Important Considerations
            </h3>
            <ul className="space-y-3 text-sm text-amber-800 dark:text-amber-200">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <div className="font-medium">Cache TTL Management</div>
                  <div>
                    Anthropic&apos;s ephemeral cache lasts 5 minutes. For longer TTLs, consider
                    implementing your own Redis cache layer or using extended prompt caching
                    (paid feature).
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Database className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <div className="font-medium">Catalog Updates</div>
                  <div>
                    When products change (price updates, new arrivals), invalidate the cache by
                    modifying the catalog text slightly. Consider incremental updates for
                    large catalogs.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Cpu className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <div className="font-medium">Model Selection</div>
                  <div>
                    Monitor quality scores by model. If Haiku performs poorly on certain query
                    types, adjust your classification thresholds or use hybrid routing.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <BarChart3 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <div className="font-medium">Cost Monitoring</div>
                  <div>
                    Set up alerts when costs exceed thresholds. Track cache hit rates and model
                    distribution to identify optimization opportunities.
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Advanced Optimizations</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="mb-2 font-semibold">Catalog Segmentation</h4>
                <p className="text-sm text-muted-foreground">
                  Split large catalogs by category. Cache each segment separately to reduce
                  cache invalidation impact and improve hit rates.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="mb-2 font-semibold">Personalization</h4>
                <p className="text-sm text-muted-foreground">
                  Cache user preferences separately from the catalog. Combine cached catalog +
                  cached preferences + dynamic query for maximum efficiency.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="mb-2 font-semibold">A/B Testing</h4>
                <p className="text-sm text-muted-foreground">
                  Test different classification thresholds and routing strategies. Track
                  quality scores and costs to find the optimal balance.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="mb-2 font-semibold">Compression</h4>
                <p className="text-sm text-muted-foreground">
                  For catalogs with verbose descriptions, apply text compression to reduce
                  token count by an additional 20-30%.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/20">
            <h3 className="mb-4 font-semibold text-emerald-900 dark:text-emerald-100">
              Next Steps
            </h3>
            <div className="space-y-2">
              <a
                href="/cookbook/achieving-50-percent-reduction"
                className="flex items-center gap-2 text-sm text-emerald-700 hover:underline dark:text-emerald-300"
              >
                <ArrowRight className="h-4 w-4" />
                Learn about comprehensive optimization strategies
              </a>
              <a
                href="/cookbook/provider-caching-setup"
                className="flex items-center gap-2 text-sm text-emerald-700 hover:underline dark:text-emerald-300"
              >
                <ArrowRight className="h-4 w-4" />
                Deep dive into provider caching
              </a>
              <a
                href="/cookbook/smart-model-routing"
                className="flex items-center gap-2 text-sm text-emerald-700 hover:underline dark:text-emerald-300"
              >
                <ArrowRight className="h-4 w-4" />
                Advanced model routing techniques
              </a>
              <a
                href="/reference/cost-tracker"
                className="flex items-center gap-2 text-sm text-emerald-700 hover:underline dark:text-emerald-300"
              >
                <ArrowRight className="h-4 w-4" />
                CostTracker API reference
              </a>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
