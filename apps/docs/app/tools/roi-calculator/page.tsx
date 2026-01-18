'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { Pagination } from '@/components/Navigation/Pagination'

interface ROIInputs {
  monthlyApiCost: number
  messagesPerMonth: number
  avgTokensPerMessage: number
  useToonFormat: boolean
  usePromptCaching: boolean
  useTokenOptimization: boolean
  cachablePromptPercent: number
}

interface ROIResults {
  toonSavings: number
  cachingSavings: number
  optimizationSavings: number
  totalSavings: number
  newMonthlyCost: number
  savingsPercent: number
  annualSavings: number
  paybackPeriod: string
}

const PROVIDER_RATES = {
  'gpt-4o': { input: 2.5, output: 10.0 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'claude-3-5-sonnet': { input: 3.0, output: 15.0 },
  'claude-3-5-haiku': { input: 0.25, output: 1.25 },
  'claude-3-opus': { input: 15.0, output: 75.0 },
} as const

type Provider = keyof typeof PROVIDER_RATES

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

export default function ROICalculatorPage() {
  const [inputs, setInputs] = useState<ROIInputs>({
    monthlyApiCost: 5000,
    messagesPerMonth: 100000,
    avgTokensPerMessage: 500,
    useToonFormat: true,
    usePromptCaching: true,
    useTokenOptimization: true,
    cachablePromptPercent: 60,
  })

  const [selectedProvider, setSelectedProvider] = useState<Provider>('gpt-4o')

  const updateInput = useCallback(
    <K extends keyof ROIInputs>(key: K, value: ROIInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const results = useMemo<ROIResults>(() => {
    let remainingCost = inputs.monthlyApiCost
    let toonSavings = 0
    let cachingSavings = 0
    let optimizationSavings = 0

    // TOON format savings (30-45% on structured data, ~20% of messages have structured data)
    if (inputs.useToonFormat) {
      const structuredDataPercent = 0.2
      const toonEfficiency = 0.4 // 40% savings on structured data
      toonSavings = remainingCost * structuredDataPercent * toonEfficiency
      remainingCost -= toonSavings
    }

    // Prompt caching savings (50-90% on cached portions)
    if (inputs.usePromptCaching) {
      const cachePercent = inputs.cachablePromptPercent / 100
      const cacheEfficiency = 0.75 // 75% cost reduction on cached tokens
      cachingSavings = remainingCost * cachePercent * cacheEfficiency
      remainingCost -= cachingSavings
    }

    // Token optimization savings (context compression, smart truncation)
    if (inputs.useTokenOptimization) {
      const optimizationEfficiency = 0.15 // 15% additional savings from optimization
      optimizationSavings = remainingCost * optimizationEfficiency
      remainingCost -= optimizationSavings
    }

    const totalSavings = toonSavings + cachingSavings + optimizationSavings
    const newMonthlyCost = inputs.monthlyApiCost - totalSavings
    const savingsPercent = (totalSavings / inputs.monthlyApiCost) * 100
    const annualSavings = totalSavings * 12

    // Payback period calculation (assuming ~$500/month for Clarity Chat enterprise)
    const clarityMonthlyCost = 500
    let paybackPeriod = 'Immediate'
    if (totalSavings > clarityMonthlyCost) {
      paybackPeriod = 'Immediate ROI'
    } else if (totalSavings > 0) {
      const months = Math.ceil(clarityMonthlyCost / totalSavings)
      paybackPeriod = `${months} month${months > 1 ? 's' : ''}`
    } else {
      paybackPeriod = 'N/A'
    }

    return {
      toonSavings,
      cachingSavings,
      optimizationSavings,
      totalSavings,
      newMonthlyCost,
      savingsPercent,
      annualSavings,
      paybackPeriod,
    }
  }, [inputs])

  return (
    <>
      <Breadcrumbs />

      <h1>ROI Calculator</h1>

      <p className="lead">
        Estimate your potential cost savings with Clarity Chat&apos;s token
        optimization features. Enter your current usage to see projected savings
        from TOON format, prompt caching, and intelligent token management.
      </p>

      <Callout type="info">
        <p>
          These estimates are based on typical usage patterns and may vary
          depending on your specific use case. Actual savings depend on data
          structure, prompt similarity, and conversation patterns.
        </p>
      </Callout>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
        {/* Input Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Current Usage</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Monthly API Cost
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  value={inputs.monthlyApiCost}
                  onChange={(e) =>
                    updateInput('monthlyApiCost', Number(e.target.value))
                  }
                  className="w-full pl-8 pr-4 py-2 border rounded-lg bg-background"
                  min="0"
                  step="100"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Your current monthly spending on LLM API calls
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Messages per Month
              </label>
              <input
                type="number"
                value={inputs.messagesPerMonth}
                onChange={(e) =>
                  updateInput('messagesPerMonth', Number(e.target.value))
                }
                className="w-full px-4 py-2 border rounded-lg bg-background"
                min="0"
                step="1000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Total AI messages processed monthly
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Average Tokens per Message
              </label>
              <input
                type="number"
                value={inputs.avgTokensPerMessage}
                onChange={(e) =>
                  updateInput('avgTokensPerMessage', Number(e.target.value))
                }
                className="w-full px-4 py-2 border rounded-lg bg-background"
                min="0"
                step="50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Combined input + output tokens per message
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                AI Provider
              </label>
              <select
                value={selectedProvider}
                onChange={(e) =>
                  setSelectedProvider(e.target.value as Provider)
                }
                className="w-full px-4 py-2 border rounded-lg bg-background"
              >
                <option value="gpt-4o">OpenAI GPT-4o</option>
                <option value="gpt-4o-mini">OpenAI GPT-4o Mini</option>
                <option value="claude-3-5-sonnet">
                  Anthropic Claude 3.5 Sonnet
                </option>
                <option value="claude-3-5-haiku">
                  Anthropic Claude 3.5 Haiku
                </option>
                <option value="claude-3-opus">Anthropic Claude 3 Opus</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Used for rate reference ($
                {PROVIDER_RATES[selectedProvider].input}/M input, $
                {PROVIDER_RATES[selectedProvider].output}/M output)
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              Optimization Features
            </h3>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.useToonFormat}
                  onChange={(e) =>
                    updateInput('useToonFormat', e.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                />
                <div>
                  <span className="font-medium">TOON Format</span>
                  <p className="text-sm text-muted-foreground">
                    30-60% token savings on structured data (arrays, tables,
                    lists)
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.usePromptCaching}
                  onChange={(e) =>
                    updateInput('usePromptCaching', e.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                />
                <div>
                  <span className="font-medium">Prompt Caching</span>
                  <p className="text-sm text-muted-foreground">
                    50-90% savings on repeated system prompts and context
                  </p>
                </div>
              </label>

              {inputs.usePromptCaching && (
                <div className="ml-7">
                  <label className="block text-sm font-medium mb-2">
                    Cacheable Prompt Content: {inputs.cachablePromptPercent}%
                  </label>
                  <input
                    type="range"
                    value={inputs.cachablePromptPercent}
                    onChange={(e) =>
                      updateInput(
                        'cachablePromptPercent',
                        Number(e.target.value)
                      )
                    }
                    className="w-full"
                    min="10"
                    max="90"
                    step="5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Percentage of prompts that can be cached (system messages,
                    RAG context)
                  </p>
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.useTokenOptimization}
                  onChange={(e) =>
                    updateInput('useTokenOptimization', e.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                />
                <div>
                  <span className="font-medium">Token Optimization</span>
                  <p className="text-sm text-muted-foreground">
                    Smart context management, truncation, and compression
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Projected Savings</h2>

          <div className="p-6 border rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Monthly Savings
              </p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(results.totalSavings)}
              </p>
              <p className="text-lg text-muted-foreground">
                {results.savingsPercent.toFixed(1)}% reduction
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Current Cost</p>
              <p className="text-2xl font-semibold">
                {formatCurrency(inputs.monthlyApiCost)}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
            <div className="p-4 border rounded-lg bg-green-500/5">
              <p className="text-sm text-muted-foreground">New Cost</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(results.newMonthlyCost)}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Savings Breakdown</h3>

            {inputs.useToonFormat && (
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">TOON Format</p>
                  <p className="text-xs text-muted-foreground">
                    Structured data optimization
                  </p>
                </div>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(results.toonSavings)}
                </p>
              </div>
            )}

            {inputs.usePromptCaching && (
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Prompt Caching</p>
                  <p className="text-xs text-muted-foreground">
                    Repeated prompt optimization
                  </p>
                </div>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(results.cachingSavings)}
                </p>
              </div>
            )}

            {inputs.useTokenOptimization && (
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Token Optimization</p>
                  <p className="text-xs text-muted-foreground">
                    Context management
                  </p>
                </div>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(results.optimizationSavings)}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Annual Savings</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(results.annualSavings)}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Payback Period</p>
              <p className="text-xl font-bold">{results.paybackPeriod}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="my-12">
        <h2 id="how-it-works">How These Optimizations Work</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-lg mb-3">TOON Format</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Token-Oriented Object Notation converts JSON data to a compact
              tabular format, eliminating repetitive syntax like brackets and
              quotes.
            </p>
            <div className="text-sm">
              <p className="font-medium text-green-600 dark:text-green-400">
                30-60% savings
              </p>
              <p className="text-muted-foreground">on structured data</p>
            </div>
            <Link
              href="/reference/utilities/toon-format"
              className="text-sm text-primary hover:underline mt-3 inline-block"
            >
              Learn more →
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Prompt Caching</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cache system prompts and frequently-used context with
              provider-native caching (Anthropic) or semantic caching for other
              providers.
            </p>
            <div className="text-sm">
              <p className="font-medium text-green-600 dark:text-green-400">
                50-90% savings
              </p>
              <p className="text-muted-foreground">on cached tokens</p>
            </div>
            <Link
              href="/guides/prompt-caching"
              className="text-sm text-primary hover:underline mt-3 inline-block"
            >
              Learn more →
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Token Optimization</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Intelligent context window management with smart truncation,
              message summarization, and dynamic context sizing.
            </p>
            <div className="text-sm">
              <p className="font-medium text-green-600 dark:text-green-400">
                10-20% savings
              </p>
              <p className="text-muted-foreground">additional optimization</p>
            </div>
            <Link
              href="/guides/token-optimization"
              className="text-sm text-primary hover:underline mt-3 inline-block"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 id="implementation">Quick Implementation</h2>

        <p className="mb-4">Get started with token optimization in minutes:</p>

        <EnhancedCodeBlock
          code={`import {
  ClarityChat,
  autoOptimize,
  PromptCacheManager,
  useTokenOptimization
} from '@clarity-chat/react/internal'

// 1. Set up prompt caching
const cacheManager = new PromptCacheManager({
  provider: 'anthropic',
  strategy: 'aggressive'
})

// 2. Optimize structured data with TOON
function prepareContext(data) {
  const { formatted, metadata } = autoOptimize(data)
  console.log(\`Saved \${metadata.tokensSaved} tokens\`)
  return formatted
}

// 3. Use token optimization hook
function ChatWithOptimization() {
  const { optimizedMessages, stats } = useTokenOptimization({
    maxTokens: 8000,
    strategy: 'smart-truncation'
  })

  return (
    <ClarityChat
      messages={optimizedMessages}
      cacheManager={cacheManager}
      onTokenUsage={(usage) => console.log(usage)}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="case-studies">Real-World Results</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 border rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-500 font-bold">E</span>
              </div>
              <div>
                <p className="font-semibold">E-commerce Platform</p>
                <p className="text-sm text-muted-foreground">
                  Product recommendations
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Before:</span>
                <span>$12,000/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">After:</span>
                <span className="text-green-600 dark:text-green-400">
                  $4,200/month
                </span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Savings:</span>
                <span className="text-green-600 dark:text-green-400">65%</span>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-500 font-bold">S</span>
              </div>
              <div>
                <p className="font-semibold">SaaS Customer Support</p>
                <p className="text-sm text-muted-foreground">
                  AI helpdesk chatbot
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Before:</span>
                <span>$8,500/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">After:</span>
                <span className="text-green-600 dark:text-green-400">
                  $2,800/month
                </span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Savings:</span>
                <span className="text-green-600 dark:text-green-400">67%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 id="next-steps">Next Steps</h2>

        <ul className="space-y-2">
          <li>
            <Link
              href="/guides/token-optimization"
              className="text-primary hover:underline"
            >
              Token Optimization Guide
            </Link>{' '}
            - Comprehensive optimization strategies
          </li>
          <li>
            <Link
              href="/guides/prompt-caching"
              className="text-primary hover:underline"
            >
              Prompt Caching Guide
            </Link>{' '}
            - Set up provider-native caching
          </li>
          <li>
            <Link
              href="/reference/utilities/toon-format"
              className="text-primary hover:underline"
            >
              TOON Format Reference
            </Link>{' '}
            - API documentation for TOON utilities
          </li>
          <li>
            <Link href="/enterprise" className="text-primary hover:underline">
              Enterprise Features
            </Link>{' '}
            - Usage quotas, multi-tenancy, and analytics
          </li>
        </ul>
      </section>

      <Pagination
        prev={{
          title: 'Dev Tools',
          href: '/tools/dev-tools',
        }}
        next={{
          title: 'CLI',
          href: '/tools/cli',
        }}
      />
    </>
  )
}
