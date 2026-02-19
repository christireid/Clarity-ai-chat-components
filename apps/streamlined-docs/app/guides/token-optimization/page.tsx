import { Metadata } from 'next'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ScrollReveal,
  KineticText,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/Enhanced/ScrollReveal'
import { EnhancedCopyButton } from '@/components/Enhanced/EnhancedCopyButton'
import { CollapsibleSection } from '@/components/CollapsibleSection/CollapsibleSection'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import {
  DollarSign,
  TrendingDown,
  Zap,
  Database,
  Cpu,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
  ArrowRight,
  ChevronRight,
  Gauge,
  Calculator,
  Layers,
  RefreshCw,
  Shield,
  Target,
  FileCode,
  Clock,
  Percent,
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Token Optimization Guide | Reduce AI Costs by 50-70%',
  description:
    'Comprehensive guide to reducing AI costs by 50-70% through provider caching (up to 90% on cached tokens), token compression (50-70% reduction), and smart model routing (10-15% additional savings). Robust strategies with real-world examples, cost calculators, and implementation guides.',
  keywords: [
    'token optimization',
    'AI cost reduction',
    '50-70% savings',
    'provider caching',
    'prompt caching',
    'model routing',
    'compression',
    'token compression',
    'LLM optimization',
    'AI cost savings',
    'cost reduction strategies',
  ],
  openGraph: {
    title: 'Token Optimization Guide - Reduce AI Costs by 50-70%',
    description:
      'Complete guide to token optimization. Provider caching (90% on cached tokens), compression (50-70%), and smart routing (10-15%). Real-world examples and calculators included.',
    type: 'article',
    url: '/guides/token-optimization',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Token Optimization - 50-70% AI Cost Reduction',
    description:
      'Reduce AI costs by 50-70% with provider caching, compression, and routing. Comprehensive guide with production examples.',
  },
}

'use client'

// Cost comparison table data
const providerCostData = [
  {
    provider: 'OpenAI',
    model: 'GPT-4o',
    inputCost: '$2.50',
    outputCost: '$10.00',
    cachedCost: '$1.25',
    contextWindow: '128K',
  },
  {
    provider: 'OpenAI',
    model: 'GPT-4o-mini',
    inputCost: '$0.15',
    outputCost: '$0.60',
    cachedCost: '$0.075',
    contextWindow: '128K',
  },
  {
    provider: 'Anthropic',
    model: 'Claude 3.5 Sonnet',
    inputCost: '$3.00',
    outputCost: '$15.00',
    cachedCost: '$0.30',
    contextWindow: '200K',
  },
  {
    provider: 'Anthropic',
    model: 'Claude 3 Haiku',
    inputCost: '$0.25',
    outputCost: '$1.25',
    cachedCost: '$0.025',
    contextWindow: '200K',
  },
  {
    provider: 'Google',
    model: 'Gemini 2.0 Flash',
    inputCost: '$0.50',
    outputCost: '$3.00',
    cachedCost: '$0.05',
    contextWindow: '200K',
  },
]

// Savings examples
const savingsExamples = [
  {
    scenario: 'Support Chatbot',
    before: '$2,400/mo',
    after: '$480/mo',
    savings: '80%',
    techniques: ['Model Routing', 'Prompt Caching', 'Response Caching'],
    breakdown: [
      { strategy: 'Provider caching (system prompts)', savings: '60%' },
      { strategy: 'Compression (user context)', savings: '15%' },
      { strategy: 'Smart routing (simple queries)', savings: '5%' },
    ],
    note: 'This example shows how combining multiple strategies achieves 80% savings, exceeding the 50-70% baseline.',
  },
  {
    scenario: 'Document Analysis',
    before: '$8,500/mo',
    after: '$1,700/mo',
    savings: '80%',
    techniques: ['Context Compression', 'Semantic Caching', 'Chunking'],
    breakdown: [
      { strategy: 'Context compression (2-20x)', savings: '50%' },
      { strategy: 'Provider caching (document chunks)', savings: '25%' },
      { strategy: 'Smart chunking strategy', savings: '5%' },
    ],
    note: 'Aggressive compression combined with caching enables 80% savings on document-heavy workloads.',
  },
  {
    scenario: 'Code Assistant',
    before: '$12,000/mo',
    after: '$3,600/mo',
    savings: '70%',
    techniques: ['Model Routing', 'Provider Caching', 'Budget Limits'],
    breakdown: [
      { strategy: 'Provider caching (codebase context)', savings: '45%' },
      { strategy: 'Model routing (complexity-based)', savings: '20%' },
      { strategy: 'Budget limits (auto-trim)', savings: '5%' },
    ],
    note: 'Code-heavy use cases benefit from caching large codebases and routing simple queries to cheaper models.',
  },
]

// Code examples
const codeExamples = {
  tokenCounter: `import { useTokenCount } from '@clarity-chat/token-optimization'

function PromptEditor() {
  const [text, setText] = useState('')
  const { count, isLoading, info } = useTokenCount(text)

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type your prompt..."
      />
      <div className="token-display">
        <span>{isLoading ? 'Counting...' : \`\${count} tokens\`}</span>
        <span>{info.characters} chars</span>
        <span>~{info.ratio.toFixed(1)} chars/token</span>
      </div>
    </div>
  )
}`,

  budgetMonitor: `import {
  useTokenBudgetTracking,
  createModelBudgetMonitor,
  getStatusColor,
  formatTokenUsage
} from '@clarity-chat/token-optimization'

function ChatWithBudget() {
  const config = createModelBudgetMonitor('gpt-4o', {
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
    autoTrim: true,
    onWarning: (usage) => console.log('Warning:', usage.utilizationPercent),
    onCritical: (usage) => showNotification('Token budget critical!'),
  })

  const { usage, isWarning, isCritical, updateMessages } = useTokenBudgetTracking(config)

  useEffect(() => {
    updateMessages(messages)
  }, [messages])

  return (
    <div>
      <TokenBar
        value={usage.utilizationPercent}
        color={getStatusColor(usage.status)}
      />
      <span>{formatTokenUsage(usage)}</span>
      {isWarning && <Badge>Approaching limit</Badge>}
      {isCritical && <Alert>Consider trimming history</Alert>}
    </div>
  )
}`,

  providerCaching: `import {
  createProviderCache,
  anthropicCache,
  openaiCache,
  estimateCacheSavings
} from '@clarity-chat/token-optimization'

// Quick setup with provider-specific functions
const messages = [
  { role: 'system', content: largeSystemPrompt },
  { role: 'user', content: userQuery }
]

// Anthropic caching (90% savings on cached tokens)
const anthropicResult = await anthropicCache(messages)
// Result includes formatted messages + estimated savings

// OpenAI caching
const openaiResult = await openaiCache(messages)

// Or create a reusable cache function
const cache = createProviderCache({
  provider: 'anthropic',
  minTokens: 1024,
  autoSelectProvider: true
})

const result = await cache(messages)
console.log(\`Estimated savings: \${result.estimatedSavings}%\`)

// Check savings potential before applying
const savings = await estimateCacheSavings(messages, 'anthropic')
if (savings.eligible) {
  console.log(savings.recommendation)
  // "Anthropic caching enabled. Expected to cache ~5000 tokens with 90% cost reduction."
}`,

  compression: `import {
  compressAdaptively,
  compressWithLLMLingua,
  compressExtractively,
  MarkdownCompressor,
  CompressionLevel
} from '@clarity-chat/token-optimization'

// Adaptive compression - automatically chooses best strategy
const result = await compressAdaptively(longDocument, {
  targetRatio: 0.5, // Target 50% of original
  preserveKeyPhrases: true,
  model: 'gpt-4o'
})
console.log(\`Compressed from \${result.originalTokens} to \${result.compressedTokens} tokens\`)

// LLMLingua-style compression for prompts
const llmResult = await compressWithLLMLingua(prompt, {
  compressionRate: 0.4,
  preserveStructure: true
})

// Extractive compression for documents
const extractive = await compressExtractively(document, {
  targetSentences: 10,
  preserveFirst: true,
  preserveLast: true
})

// Markdown-specific compression
const mdCompressor = new MarkdownCompressor({
  level: CompressionLevel.Moderate
})
const mdResult = mdCompressor.compress(markdownContent)
console.log(\`Saved \${mdResult.estimatedTokensSaved} tokens\`)`,

  modelRouting: `import { ModelRouter, RoutingStrategy } from '@clarity-chat/token-optimization'

// Create router with fluent builder API
const router = ModelRouter.builder()
  .useOpenAIModels()     // Adds gpt-4o-mini, gpt-4o, gpt-4-turbo
  .useClaudeModels()     // Adds claude-3-haiku, claude-3-sonnet, claude-3-opus
  .withStrategy('cost-optimized')
  .build()

// Route based on prompt complexity
const result = router.route(prompt, {
  estimatedInputTokens: 5000,
  estimatedOutputTokens: 1000,
  requiredCapabilities: ['function_calling']
})

console.log(\`Selected: \${result.selectedModel?.id}\`)
console.log(\`Estimated cost: $\${result.estimatedCost?.toFixed(4)}\`)
console.log(\`Complexity: \${result.complexity?.level}\`)

// Get routing statistics
const stats = router.getStats()
console.log(\`Total savings from routing: $\${stats.estimatedSavings.toFixed(2)}\`)
console.log(\`Routes by tier:\`, stats.routesByTier)
// { small: 450, medium: 120, large: 30, premium: 5 }`,

  unifiedOptimization: `import { useTokenOptimization } from '@clarity-chat/token-optimization'

function OptimizedChat() {
  const {
    countTokens,
    optimize,
    compress,
    route,
    getFromCache,
    setInCache,
    getStats,
    isPending,        // React 19: transition state
    optimisticCache,  // React 19: optimistic updates
  } = useTokenOptimization({
    preset: 'production', // 'minimal' | 'standard' | 'production' | 'enterprise'
    model: 'gpt-4o',
    enableCache: true,
    enableCompression: true,
    enableRouting: true,
  })

  const handleSend = async (prompt: string) => {
    // All-in-one optimization: cache check + compress + route
    const {
      cachedResponse,
      compressedPrompt,
      recommendedModel,
      tokensSaved,
      estimatedCostSaved
    } = await optimize(prompt)

    if (cachedResponse) {
      // Use cached response - saved 100% of tokens!
      return cachedResponse
    }

    // Send optimized prompt to recommended model
    const response = await sendToModel(recommendedModel, compressedPrompt)

    // Cache the response for future use
    await setInCache(prompt, response)

    console.log(\`Saved \${tokensSaved} tokens (~$\${estimatedCostSaved.toFixed(4)})\`)
    return response
  }

  // Monitor optimization statistics
  const stats = getStats()
  console.log(\`Total tokens processed: \${stats.tokensProcessed}\`)
  console.log(\`Total tokens saved: \${stats.tokensSaved}\`)
  console.log(\`Cache hit rate: \${stats.cache?.hitRate}%\`)
}`,

  costDashboard: `import {
  calculateCost,
  estimateConversationCost,
  compareModelCosts,
  CostTracker
} from '@clarity-chat/token-optimization'

// Calculate cost for a single request
const cost = calculateCost({
  model: 'gpt-4o',
  inputTokens: 5000,
  outputTokens: 1000,
  cachedInputTokens: 3000 // If using caching
})

console.log(\`Input: $\${cost.inputCost.toFixed(4)}\`)
console.log(\`Output: $\${cost.outputCost.toFixed(4)}\`)
console.log(\`Cached: $\${cost.cachedInputCost?.toFixed(4)}\`)
console.log(\`Total: $\${cost.totalCost.toFixed(4)}\`)

// Estimate monthly costs
const monthly = estimateConversationCost({
  model: 'gpt-4o',
  averageInputTokens: 2000,
  averageOutputTokens: 500,
  messagesPerDay: 1000,
  daysPerMonth: 30
})

console.log(\`Per message: $\${monthly.costPerMessage.toFixed(4)}\`)
console.log(\`Per day: $\${monthly.costPerDay.toFixed(2)}\`)
console.log(\`Per month: $\${monthly.costPerMonth.toFixed(2)}\`)

// Compare costs across models
const comparison = compareModelCosts({
  models: ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet', 'claude-3-haiku'],
  inputTokens: 5000,
  outputTokens: 1000
})

comparison.forEach(({ model, cost, savingsPercent }) => {
  console.log(\`\${model}: $\${cost.toFixed(4)} (save \${savingsPercent.toFixed(0)}%)\`)
})

// Track costs over time
const tracker = new CostTracker()
tracker.recordUsage({ model: 'gpt-4o', inputTokens: 5000, outputTokens: 1000 })
tracker.recordUsage({ model: 'gpt-4o-mini', inputTokens: 3000, outputTokens: 500 })

const report = tracker.generateReport()
console.log(\`Total spent: $\${report.totalCost.toFixed(2)}\`)
console.log(\`Breakdown by model:\`, report.byModel)`,

  completeExample: `// Complete token optimization setup
import {
  useTokenOptimization,
  useTokenCount,
  useTokenBudgetTracking,
  createModelBudgetMonitor,
  calculateCost,
  MODEL_PRICING
} from '@clarity-chat/token-optimization'

function ProductionChat() {
  const [messages, setMessages] = useState<Message[]>([])

  // Budget monitoring with model-specific limits
  const budgetConfig = createModelBudgetMonitor('gpt-4o', {
    warningThreshold: 0.75,
    criticalThreshold: 0.90,
    autoTrim: true,
    onAutoTrim: (result) => {
      showNotification(\`Trimmed \${result.tokensRemoved} tokens from history\`)
    }
  })

  const { usage, updateMessages, isExceeded } = useTokenBudgetTracking(budgetConfig)

  // Unified optimization
  const {
    optimize,
    getStats,
    clearCache
  } = useTokenOptimization({
    preset: 'production',
    model: 'gpt-4o',
    availableModels: ['gpt-4o-mini', 'gpt-4o', 'claude-3-5-sonnet']
  })

  const sendMessage = async (content: string) => {
    if (isExceeded) {
      showError('Token budget exceeded. Please start a new conversation.')
      return
    }

    // Optimize the prompt
    const {
      cachedResponse,
      compressedPrompt,
      recommendedModel,
      tokensSaved,
      estimatedCostSaved
    } = await optimize(content)

    if (cachedResponse) {
      addMessage({ role: 'assistant', content: cachedResponse, cached: true })
      return
    }

    // Calculate and display cost before sending
    const estimatedCost = calculateCost({
      model: recommendedModel,
      inputTokens: usage.current + countTokens(compressedPrompt),
      outputTokens: 1000 // estimated
    })

    // Send to AI
    const response = await chat({
      model: recommendedModel,
      messages: [...messages, { role: 'user', content: compressedPrompt }]
    })

    // Update state
    setMessages(prev => [
      ...prev,
      { role: 'user', content },
      { role: 'assistant', content: response }
    ])

    // Update budget monitor
    updateMessages(messages)

    // Log savings
    console.log(\`
      Model: \${recommendedModel}
      Tokens saved: \${tokensSaved}
      Estimated cost: $\${estimatedCost.totalCost.toFixed(4)}
      Cost saved: ~$\${estimatedCostSaved.toFixed(4)}
    \`)
  }

  return (
    <div>
      <CostDashboard stats={getStats()} pricing={MODEL_PRICING} />
      <BudgetIndicator usage={usage} />
      <MessageList messages={messages} />
      <ChatInput onSend={sendMessage} disabled={isExceeded} />
    </div>
  )
}`
}

// Troubleshooting items
const troubleshootingItems = [
  {
    title: 'Token counts seem inaccurate',
    description: 'The estimated token count differs significantly from what the API reports.',
    solution: `Use accurate tokenization for precise counts:

const { count } = useTokenCount(text, {
  model: 'gpt-4o', // Match your target model
  debounceMs: 0    // Disable debouncing for immediate counts
})

// Or use the AccurateTokenCounter directly
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
const exactCount = counter.count(text)`
  },
  {
    title: 'Cache not reducing costs',
    description: 'Provider caching is enabled but costs remain high.',
    solution: `Ensure your content meets minimum token requirements:

// Anthropic requires 1024+ tokens for caching
const savings = await estimateCacheSavings(messages, 'anthropic')
if (!savings.eligible) {
  console.log(savings.recommendation)
  // "Need at least 1024 tokens for anthropic caching. Current: 500 tokens."
}

// Place cacheable content (system prompts) first
const messages = [
  { role: 'system', content: largeSystemPrompt }, // Cached
  { role: 'user', content: userQuery }            // Not cached
]`
  },
  {
    title: 'Model router always picks expensive model',
    description: 'The router consistently selects premium models even for simple queries.',
    solution: `Adjust the routing strategy or complexity weights:

const router = ModelRouter.builder()
  .useOpenAIModels()
  .withStrategy('cost-optimized') // Prioritize cost over quality
  .build()

// Or use allowedModels to restrict options
const result = router.route(prompt, {
  allowedModels: ['gpt-4o-mini', 'gpt-4o'],
  excludedModels: ['gpt-4-turbo', 'o1']
})`
  },
  {
    title: 'Compression degrades response quality',
    description: 'Aggressive compression causes the AI to miss context.',
    solution: `Use lighter compression or preserve key content:

const result = await compressAdaptively(text, {
  targetRatio: 0.7, // Less aggressive (70% of original)
  preserveKeyPhrases: true,
  preserveFirst: true,  // Keep first paragraph
  preserveLast: true    // Keep last paragraph
})

// Or use extractive compression for documents
const extracted = await compressExtractively(document, {
  targetSentences: 20, // Keep most important 20 sentences
  preserveStructure: true
})`
  },
  {
    title: 'Budget monitor triggers too often',
    description: 'Warning and critical callbacks fire excessively.',
    solution: `Callbacks only fire on status changes, but you can increase thresholds:

const config = createModelBudgetMonitor('gpt-4o', {
  warningThreshold: 0.85,  // Increase from default 0.8
  criticalThreshold: 0.98, // Increase from default 0.95
  debounceMs: 500          // Increase debounce delay
})

// Or disable auto-trim and handle manually
const config = {
  ...createModelBudgetMonitor('gpt-4o'),
  autoTrim: false,
  onCritical: (usage) => {
    // Show UI prompt instead of auto-trimming
    showTrimConfirmation(usage)
  }
}`
  },
]

export default function TokenOptimizationGuidePage() {
  const [selectedProvider, setSelectedProvider] = useState<'anthropic' | 'openai' | 'google'>('anthropic')

  return (
    <div className="container-docs py-8 sm:py-12">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-full mb-6">
            <TrendingDown className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Reduce AI Costs by 50-70%
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Token Optimization Guide
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
            Reduce your AI costs by 50-70% using Clarity Chat&apos;s comprehensive token
            optimization toolkit. From real-time counting to intelligent caching and model routing.
          </p>
          <p className="text-base text-neutral-500 dark:text-neutral-500 max-w-2xl mx-auto">
            Up to 90% with provider caching
          </p>

          {/* Savings Highlight */}
          <div className="inline-flex items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">50-70%</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Baseline Savings</div>
            </div>
            <div className="h-12 w-px bg-emerald-200 dark:bg-emerald-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">5+</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Strategies</div>
            </div>
            <div className="h-12 w-px bg-emerald-200 dark:bg-emerald-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">3</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Providers</div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* What You'll Learn */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mb-16">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 text-white flex-shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-3">What You&apos;ll Learn</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'Real-time token counting and budget monitoring',
                    'Provider-native caching (Anthropic, OpenAI, Google)',
                    'Context compression and summarization',
                    'Intelligent model routing based on complexity',
                    'Cost tracking and analytics dashboards',
                    'Robust optimization patterns',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Understanding Token Costs */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <DollarSign className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Understanding Token Costs</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            AI providers charge per token, with different rates for input (prompts) and output (responses).
            Understanding this pricing model is key to optimization.
          </p>

          {/* How Pricing Works */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <div className="flex items-center gap-2 text-amber-500 mb-3">
                <Calculator className="w-5 h-5" />
                <span className="font-semibold">Input Tokens</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Your prompts, system messages, and conversation history. Typically cheaper than output.
              </p>
              <div className="text-xs text-neutral-500">~4 characters = 1 token</div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <div className="flex items-center gap-2 text-orange-500 mb-3">
                <ArrowRight className="w-5 h-5" />
                <span className="font-semibold">Output Tokens</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                AI-generated responses. Usually 2-4x more expensive than input tokens.
              </p>
              <div className="text-xs text-neutral-500">Control with max_tokens</div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <div className="flex items-center gap-2 text-emerald-500 mb-3">
                <Database className="w-5 h-5" />
                <span className="font-semibold">Cached Tokens</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Reused input tokens from previous requests. Up to 90% cheaper than regular input.
              </p>
              <div className="text-xs text-neutral-500">Biggest savings opportunity</div>
            </div>
          </div>

          {/* Cost Comparison Table */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold">Cost Comparison by Provider (per 1M tokens)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <th className="px-4 py-3 text-left font-medium">Provider</th>
                    <th className="px-4 py-3 text-left font-medium">Model</th>
                    <th className="px-4 py-3 text-right font-medium">Input</th>
                    <th className="px-4 py-3 text-right font-medium">Output</th>
                    <th className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">Cached</th>
                    <th className="px-4 py-3 text-right font-medium">Context</th>
                  </tr>
                </thead>
                <tbody>
                  {providerCostData.map((row, i) => (
                    <tr key={i} className="border-b border-neutral-200/60 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                      <td className="px-4 py-3 font-medium">{row.provider}</td>
                      <td className="px-4 py-3">{row.model}</td>
                      <td className="px-4 py-3 text-right">{row.inputCost}</td>
                      <td className="px-4 py-3 text-right">{row.outputCost}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">{row.cachedCost}</td>
                      <td className="px-4 py-3 text-right text-neutral-500">{row.contextWindow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-emerald-600 dark:text-emerald-400">Key Insight:</strong>{' '}
                Cached tokens cost 50-90% less than regular input. Provider caching is the single
                most impactful optimization for repeated system prompts and context.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Token Counting */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <Gauge className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Token Counting</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Real-time token counting helps you monitor costs before sending requests. The{' '}
            <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-brand-500">useTokenCount</code>{' '}
            hook provides accurate counts with automatic debouncing.
          </p>

          <CodeBlock code={codeExamples.tokenCounter} filename="TokenCounter.tsx" />

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Debounced by Default
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                150ms debounce prevents excessive re-renders during typing. Customize with{' '}
                <code className="text-brand-500">debounceMs</code> option.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                React 19 Ready
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Uses <code className="text-brand-500">useDeferredValue</code> for smooth UI during
                expensive calculations. Includes <code className="text-brand-500">isStale</code> state.
              </p>
            </div>
          </div>

          {/* Budget Monitoring */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Budget Monitoring</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Track token usage against model limits with automatic warnings and optional auto-trimming:
            </p>
            <CodeBlock code={codeExamples.budgetMonitor} filename="BudgetMonitor.tsx" />
          </div>
        </section>
      </ScrollReveal>

      {/* Provider Caching */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Prompt Caching - Up to 90% on Cached Content</h2>
          </div>

          {/* Important Warning Banner */}
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Important: Provider caching achieves 90% savings on <strong>cached tokens only</strong>
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                  Your overall cost reduction will be 50-70% baseline when combining provider caching with other
                  strategies across all tokens. The 90% rate applies only to static content like system prompts
                  that meet the caching threshold.
                </p>
              </div>
            </div>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Provider-native caching reduces costs by up to 90% on cached tokens (repeated content like system prompts).
            Clarity Chat supports Anthropic, OpenAI, and Google caching with a unified API.
          </p>

          {/* Provider Tabs */}
          <div className="flex items-center gap-2 mb-6">
            {(['anthropic', 'openai', 'google'] as const).map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                  selectedProvider === provider
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700'
                )}
              >
                {provider}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProvider}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: durations.normal }}
            >
              <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] mb-6">
                {selectedProvider === 'anthropic' && (
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">Anthropic Prompt Caching</h4>
                    <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                      <li>- Minimum 1024 tokens for caching eligibility</li>
                      <li>- Up to 4 cache breakpoints per request</li>
                      <li>- 90% cost reduction on cached tokens ($0.30 vs $3.00 per 1M)</li>
                      <li>- 5-minute cache TTL (configurable)</li>
                    </ul>
                  </div>
                )}
                {selectedProvider === 'openai' && (
                  <div>
                    <h4 className="font-semibold mb-2 text-emerald-600 dark:text-emerald-400">OpenAI Automatic Caching</h4>
                    <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                      <li>- Automatic caching for prompts over 1024 tokens</li>
                      <li>- 50% discount on cached input tokens</li>
                      <li>- Works with GPT-4o, GPT-4o-mini, o1 models</li>
                      <li>- No configuration required - automatic on eligible requests</li>
                    </ul>
                  </div>
                )}
                {selectedProvider === 'google' && (
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Google Context Caching</h4>
                    <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                      <li>- Minimum 32,768 tokens for caching</li>
                      <li>- 75% cost reduction on cached content</li>
                      <li>- Configurable TTL up to 24 hours</li>
                      <li>- Ideal for large document analysis</li>
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <CodeBlock code={codeExamples.providerCaching} filename="ProviderCaching.tsx" />

          <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-amber-600 dark:text-amber-400">Important:</strong>{' '}
                Provider caching formats messages for caching but does not make API calls.
                You must implement the actual provider API calls in your application.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Context Compression */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Context Compression</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Reduce token usage by 20-60% through intelligent compression while preserving semantic meaning.
            Multiple strategies are available for different content types.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-500" />
                Adaptive
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Automatically selects the best strategy based on content analysis. Recommended for most use cases.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-teal-500" />
                LLMLingua
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Aggressive compression using perplexity-based token pruning. Best for prompts and instructions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-500" />
                Extractive
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Extracts most important sentences using TF-IDF scoring. Ideal for documents and articles.
              </p>
            </div>
          </div>

          <CodeBlock code={codeExamples.compression} filename="Compression.tsx" />
        </section>
      </ScrollReveal>

      {/* Model Routing */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Model Routing</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Route queries to the most cost-effective model based on complexity analysis.
            Simple questions go to cheaper models; complex ones use premium models.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <div className="text-2xl font-bold text-emerald-500 mb-1">Cost-Optimized</div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Prioritizes cheapest model that meets requirements. Maximum savings.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <div className="text-2xl font-bold text-blue-500 mb-1">Balanced</div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Balances cost and quality. Good for production workloads.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <div className="text-2xl font-bold text-purple-500 mb-1">Quality-First</div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Always selects best available model. For critical applications.
              </p>
            </div>
          </div>

          <CodeBlock code={codeExamples.modelRouting} filename="ModelRouting.tsx" />

          <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-blue-600 dark:text-blue-400">Complexity Analysis:</strong>{' '}
                The router analyzes prompt complexity based on length, vocabulary diversity,
                technical terms, and structural patterns to determine the appropriate model tier.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Cost Dashboards */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Cost Dashboards</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Track costs in real-time, compare model pricing, and monitor optimization savings
            with built-in analytics utilities.
          </p>

          <CodeBlock code={codeExamples.costDashboard} filename="CostDashboard.tsx" />
        </section>
      </ScrollReveal>

      {/* Complete Example */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-white">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Complete Example</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Here&apos;s a comprehensive example combining all optimization strategies:
          </p>

          <CodeBlock code={codeExamples.completeExample} filename="ProductionChat.tsx" />
        </section>
      </ScrollReveal>

      {/* Real-World Savings */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-white">
              <Percent className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Real-World Savings</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {savingsExamples.map((example, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <h3 className="font-semibold text-lg mb-4">{example.scenario}</h3>

                {/* Cost comparison */}
                <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Before optimization:</span>
                      <span className="font-mono font-semibold text-red-500">{example.before}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">After optimization:</span>
                      <span className="font-mono font-semibold text-emerald-500">{example.after}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">Total savings:</span>
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{example.savings}</span>
                    </div>
                  </div>
                </div>

                {/* Optimization breakdown */}
                <div className="bg-brand-500/10 border border-brand-500/30 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2 text-sm">How We Achieved {example.savings} Savings:</p>
                  <ul className="space-y-1 text-xs text-neutral-700 dark:text-neutral-300">
                    {example.breakdown.map((item, j) => (
                      <li key={j}>✓ {item.strategy}: {item.savings} savings</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 italic">
                    {example.note}
                  </p>
                </div>

                {/* Techniques used */}
                <div className="space-y-2">
                  <span className="text-xs text-neutral-500 uppercase tracking-wide">Techniques Used:</span>
                  <div className="flex flex-wrap gap-1">
                    {example.techniques.map((tech, j) => (
                      <span key={j} className="px-2 py-0.5 text-xs rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Troubleshooting */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Troubleshooting</h2>
          </div>

          <div className="space-y-4">
            {troubleshootingItems.map((item, i) => (
              <CollapsibleSection key={i} title={item.title} badge="Common Issue">
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {item.description}
                  </p>
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 border-b border-neutral-200 dark:border-neutral-700">
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Solution
                      </span>
                    </div>
                    <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
                      <code>{item.solution}</code>
                    </pre>
                  </div>
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.2}>
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Start Optimizing</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Ready to reduce your AI costs? Start with token counting and gradually add more
              optimization strategies as needed.
            </p>
          </div>

          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Gauge className="w-5 h-5" />,
                  title: 'API Reference',
                  description: 'Complete documentation for all token optimization APIs',
                  href: '/api/token-optimization',
                },
                {
                  icon: <BarChart3 className="w-5 h-5" />,
                  title: 'Playground',
                  description: 'Interactive demos of token counting and optimization',
                  href: '/playground',
                },
                {
                  icon: <FileCode className="w-5 h-5" />,
                  title: 'Examples',
                  description: 'Robust code samples and patterns',
                  href: '/explore/examples',
                },
              ].map((item, i) => (
                <ScrollRevealStaggerItem key={i}>
                  <Link
                    href={item.href}
                    className="block p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-brand-500 transition-colors flex items-center gap-2">
                      {item.title}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </Link>
                </ScrollRevealStaggerItem>
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>
    </div>
  )
}

// Helper Components
interface CodeBlockProps {
  code: string
  filename: string
  language?: string
}

function CodeBlock({ code, filename }: CodeBlockProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-400">
          <FileCode className="w-4 h-4" />
          <span className="text-sm font-mono">{filename}</span>
        </div>
        <EnhancedCopyButton
          text={code}
          label={`Copy ${filename}`}
          size="sm"
          celebration="pulse"
        />
      </div>
      <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}
