'use client'

/**
 * Token Visualizer Demo with Savings Focus
 *
 * Features:
 * - Before/after token count visualization
 * - Real-time compression ratio
 * - Provider caching impact with color coding
 * - Cost comparison charts
 * - Interactive compression level sliders
 * - Prominent "50-70% typical savings" messaging
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  DollarSign,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Gauge,
  Info,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  Save,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import {
  LLMLinguaCompressor,
  type LLMLinguaResult,
} from '@clarity-chat/token-optimization'

// Provider pricing (per 1M tokens)
const PROVIDER_PRICING = {
  anthropic: {
    name: 'Anthropic Claude',
    input: 3.0,
    cached: 0.30, // 90% discount
    output: 15.0,
    cacheSavings: 90,
    color: 'purple',
  },
  openai: {
    name: 'OpenAI GPT-4o',
    input: 5.0,
    cached: 2.50, // 50% discount
    output: 15.0,
    cacheSavings: 50,
    color: 'green',
  },
  gemini: {
    name: 'Google Gemini',
    input: 1.25,
    cached: 0.3125, // 75% discount
    output: 5.0,
    cacheSavings: 75,
    color: 'blue',
  },
}

type Provider = keyof typeof PROVIDER_PRICING

const SAMPLE_TEXT = `System prompt for a customer support AI assistant:

You are a helpful customer support specialist for TechCorp, a software company. Your primary responsibilities include:

1. Answering product questions clearly and accurately
2. Troubleshooting technical issues step-by-step
3. Processing refund requests according to company policy
4. Escalating complex issues to human agents when needed
5. Maintaining a friendly, professional tone at all times

Important guidelines:
- Always verify customer account information before discussing sensitive details
- Follow the standard troubleshooting checklist for technical problems
- Document all interactions in the CRM system with detailed notes
- Never make promises about features or timelines without approval
- Respect customer privacy and handle data according to GDPR compliance

Common issues and solutions:
- Login problems: Reset password, clear cache, check browser compatibility
- Payment failures: Verify card details, check billing address, contact payment processor
- Feature requests: Log in product roadmap, provide timeline if available
- Bug reports: Gather reproduction steps, browser/device info, screenshots

Remember to be empathetic, patient, and solution-oriented in every interaction.`

export default function TokenVisualizerPage() {
  const [inputText, setInputText] = React.useState(SAMPLE_TEXT)
  const [compressionLevel, setCompressionLevel] = React.useState(30)
  const [provider, setProvider] = React.useState<Provider>('anthropic')
  const [cachingEnabled, setCachingEnabled] = React.useState(true)
  const [monthlyRequests, setMonthlyRequests] = React.useState(10000)

  const [isProcessing, setIsProcessing] = React.useState(false)
  const [result, setResult] = React.useState<LLMLinguaResult | null>(null)

  // Token counting
  const [originalTokens, setOriginalTokens] = React.useState(0)
  const [compressedTokens, setCompressedTokens] = React.useState(0)

  const tokenCounter = React.useMemo(
    () => new AccurateTokenCounter({ model: 'gpt-4o', enableCaching: true }),
    []
  )

  // Count original tokens
  React.useEffect(() => {
    if (!inputText) {
      setOriginalTokens(0)
      return
    }
    const timeoutId = setTimeout(() => {
      const count = tokenCounter.count(inputText)
      setOriginalTokens(count)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [inputText, tokenCounter])

  // Count compressed tokens
  React.useEffect(() => {
    if (!result?.compressed) {
      setCompressedTokens(0)
      return
    }
    const timeoutId = setTimeout(() => {
      const count = tokenCounter.count(result.compressed)
      setCompressedTokens(count)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [result?.compressed, tokenCounter])

  // Compress text
  const handleCompress = async () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    try {
      const compressor = new LLMLinguaCompressor()
      const compressionResult = await compressor.compress(
        inputText,
        compressionLevel / 100,
        {
          preserveInstructions: true,
          preserveCode: true,
          debug: true,
        }
      )
      setResult(compressionResult)
    } catch (err) {
      console.error('Compression error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Calculate metrics
  const tokenSavingsPercent = originalTokens && compressedTokens
    ? Math.round(((originalTokens - compressedTokens) / originalTokens) * 100)
    : 0

  const providerInfo = PROVIDER_PRICING[provider]

  // Cost calculations (per request)
  const costBefore = (originalTokens / 1_000_000) * providerInfo.input
  const costAfterCompression = (compressedTokens / 1_000_000) * providerInfo.input
  const costAfterCaching = cachingEnabled
    ? (compressedTokens / 1_000_000) * providerInfo.cached
    : costAfterCompression

  // Monthly costs
  const monthlyCostBefore = costBefore * monthlyRequests
  const monthlyCostAfter = costAfterCaching * monthlyRequests
  const monthlySavings = monthlyCostBefore - monthlyCostAfter
  const monthlySavingsPercent = monthlyCostBefore > 0
    ? Math.round((monthlySavings / monthlyCostBefore) * 100)
    : 0

  // Combined savings percentage
  const compressionSavings = tokenSavingsPercent
  const cachingSavings = cachingEnabled ? providerInfo.cacheSavings : 0
  const combinedSavingsPercent = cachingEnabled
    ? Math.min(Math.round(compressionSavings + (cachingSavings * (1 - compressionSavings / 100))), 95)
    : compressionSavings

  const providerColors = {
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
      accent: 'bg-purple-500',
    },
    green: {
      bg: 'bg-green-500/10',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      accent: 'bg-green-500',
    },
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      accent: 'bg-blue-500',
    },
  }

  const colors = providerColors[providerInfo.color as keyof typeof providerColors]

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.moderate }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              'p-2.5 rounded-lg border',
              colors.bg,
              colors.text,
              colors.border
            )}>
              <BarChart3 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <span className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full border',
                colors.bg,
                colors.text,
                colors.border
              )}>
                Interactive Demo
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Token Optimization Visualizer
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            See how token compression and provider caching work together to reduce AI costs.
            Visualize savings in real-time with before/after comparisons.
          </p>

          {/* Prominent Savings Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-green-500/30"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-500/20 shrink-0">
                <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                  50-70% Typical Savings
                </h2>
                <p className="text-sm text-green-600 dark:text-green-400 leading-relaxed">
                  By combining token compression with provider caching, most applications achieve{' '}
                  <strong>50-70% cost reduction</strong>. With aggressive optimization and high cache hit rates,{' '}
                  savings can reach up to 90% on cached tokens.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Main Demo Interface */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left Column - Visualization */}
          <div className="space-y-6">
            {/* Input Text Area */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Input Text
                </label>
                <span className="text-xs text-muted-foreground">
                  {originalTokens.toLocaleString()} tokens
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to optimize..."
                className={cn(
                  'w-full h-48 p-4 rounded-lg',
                  'bg-muted/30 border border-border/50',
                  'text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-brand-500',
                  'resize-none font-mono text-sm scrollbar-hide'
                )}
              />
            </motion.div>

            {/* Before/After Visualization */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key="visualization"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Token Count Comparison */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Before */}
                    <div className="p-6 rounded-lg bg-red-500/10 border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <h3 className="font-semibold text-red-700 dark:text-red-300">Before Optimization</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-4xl font-bold text-red-600 dark:text-red-400">
                          {originalTokens.toLocaleString()}
                        </div>
                        <div className="text-sm text-red-600/80 dark:text-red-400/80">tokens</div>
                        <div className="pt-2 border-t border-red-200 dark:border-red-800">
                          <div className="text-xs text-red-600/60 dark:text-red-400/60">Cost per request</div>
                          <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                            ${costBefore.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* After */}
                    <div className="p-6 rounded-lg bg-green-500/10 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h3 className="font-semibold text-green-700 dark:text-green-300">After Optimization</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                          {compressedTokens.toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600/80 dark:text-green-400/80">tokens</div>
                        <div className="pt-2 border-t border-green-200 dark:border-green-800">
                          <div className="text-xs text-green-600/60 dark:text-green-400/60">Cost per request</div>
                          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                            ${costAfterCaching.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Savings Breakdown */}
                  <div className="p-6 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Save className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Total Savings: {combinedSavingsPercent}%
                    </h3>

                    <div className="space-y-3">
                      {/* Compression Savings */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Token Compression</span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {tokenSavingsPercent}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${tokenSavingsPercent}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full bg-blue-500 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Caching Savings */}
                      {cachingEnabled && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">
                              Provider Caching ({providerInfo.name})
                            </span>
                            <span className={cn(
                              'text-sm font-bold',
                              colors.text
                            )}>
                              {providerInfo.cacheSavings}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${providerInfo.cacheSavings}%` }}
                              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                              className={cn('h-full rounded-full', colors.accent)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Combined Effect */}
                      <div className="pt-3 border-t border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-foreground">Combined Savings</span>
                          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {combinedSavingsPercent}%
                          </span>
                        </div>
                        <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${combinedSavingsPercent}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Comparison Chart */}
                  <div className="p-6 rounded-lg bg-muted/30 border border-border/50">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Monthly Cost Comparison
                    </h3>

                    <div className="space-y-4">
                      {/* Before Cost Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Before</span>
                          <span className="text-lg font-bold text-red-600 dark:text-red-400">
                            ${monthlyCostBefore.toFixed(2)}
                          </span>
                        </div>
                        <div className="h-8 bg-red-500/20 rounded-lg flex items-center px-3">
                          <div
                            className="h-6 bg-red-500 rounded"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>

                      {/* After Cost Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">After</span>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            ${monthlyCostAfter.toFixed(2)}
                          </span>
                        </div>
                        <div className="h-8 bg-green-500/20 rounded-lg flex items-center px-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(monthlyCostAfter / monthlyCostBefore) * 100}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-6 bg-green-500 rounded"
                          />
                        </div>
                      </div>

                      {/* Savings Display */}
                      <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">Monthly Savings</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ${monthlySavings.toFixed(2)}
                          </div>
                          <div className="text-xs text-green-600/60 dark:text-green-400/60">
                            ({monthlySavingsPercent}% reduction)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            {/* Provider Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h2 className="text-sm font-semibold text-muted-foreground">Provider</h2>
              <div className="space-y-2">
                {Object.entries(PROVIDER_PRICING).map(([key, info]) => {
                  const isActive = provider === key
                  const providerColors = {
                    purple: 'border-purple-500/30 bg-purple-500/10',
                    green: 'border-green-500/30 bg-green-500/10',
                    blue: 'border-blue-500/30 bg-blue-500/10',
                  }
                  const activeColor = providerColors[info.color as keyof typeof providerColors]

                  return (
                    <button
                      key={key}
                      onClick={() => setProvider(key as Provider)}
                      className={cn(
                        'w-full text-left p-4 rounded-lg border transition-all',
                        'focus:outline-none focus:ring-2 focus:ring-brand-500',
                        isActive
                          ? activeColor
                          : 'bg-muted/20 border-border/50 hover:border-brand-500/30'
                      )}
                    >
                      <div className="font-semibold text-sm mb-1">{info.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {info.cacheSavings}% cache discount
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>

            {/* Compression Level Slider */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-muted-foreground">
                  Compression Level
                </label>
                <span className="text-sm font-mono text-foreground">{compressionLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Aggressive</span>
                <span>Balanced</span>
              </div>
            </motion.div>

            {/* Monthly Requests Slider */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-muted-foreground">
                  Monthly Requests
                </label>
                <span className="text-sm font-mono text-foreground">
                  {monthlyRequests.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={monthlyRequests}
                onChange={(e) => setMonthlyRequests(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1K</span>
                <span>100K</span>
              </div>
            </motion.div>

            {/* Provider Caching Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={cn(
                'p-4 rounded-lg border transition-all',
                cachingEnabled ? colors.bg : 'bg-muted/20',
                cachingEnabled ? colors.border : 'border-border/50'
              )}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-sm mb-1">Enable Provider Caching</div>
                  <div className="text-xs text-muted-foreground">
                    {providerInfo.cacheSavings}% discount on cached tokens
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={cachingEnabled}
                  onChange={(e) => setCachingEnabled(e.target.checked)}
                  className="w-5 h-5 rounded border-border/50"
                />
              </label>
            </motion.div>

            {/* Optimize Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={handleCompress}
              disabled={!inputText.trim() || isProcessing}
              className={cn(
                'w-full py-3 px-4 rounded-lg font-semibold',
                'flex items-center justify-center gap-2',
                'transition-all focus:outline-none focus:ring-2 focus:ring-brand-500',
                isProcessing
                  ? 'bg-muted/50 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-md'
              )}
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Calculate Savings
                </>
              )}
            </motion.button>

            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800"
            >
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                How Savings Stack
              </h3>
              <div className="space-y-2 text-xs text-blue-600 dark:text-blue-400">
                <p>
                  <strong>1. Compression:</strong> Reduces token count by removing redundant content while preserving meaning.
                </p>
                <p>
                  <strong>2. Provider Caching:</strong> Applies {providerInfo.cacheSavings}% discount to cached tokens (system prompts, context).
                </p>
                <p>
                  <strong>3. Combined Effect:</strong> Both strategies work together for maximum savings of 50-70% typically, up to 90% with high cache hit rates.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Implementation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-6 rounded-lg bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-200 dark:border-brand-800"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Ready to achieve 50-70% cost reduction?
              </h3>
              <p className="text-sm text-muted-foreground">
                Follow our comprehensive guide to implement token optimization in your application.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/cookbook/achieving-50-percent-reduction'}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg shrink-0',
                'bg-brand-600 hover:bg-brand-700 text-white',
                'transition-colors font-semibold',
                'focus:outline-none focus:ring-2 focus:ring-brand-500'
              )}
            >
              View Implementation Guide
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
