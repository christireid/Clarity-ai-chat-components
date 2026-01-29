'use client'

/**
 * Model Routing Demo - Live Query Complexity Analysis
 *
 * Interactive demo showing how queries are analyzed for complexity
 * and routed to appropriate models with cost optimization.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Brain,
  DollarSign,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  analyzeComplexity,
  routeQuery,
  COMMON_MODELS,
} from '@clarity-chat/react/utils/api/model-router'
import type {
  QueryComplexity,
  RoutingDecision,
} from '@clarity-chat/react/utils/api/model-router'

// Example queries demonstrating different complexity levels
const EXAMPLE_QUERIES = [
  {
    text: 'What is TypeScript?',
    description: 'Simple factual question',
    expectedLevel: 'simple' as const,
  },
  {
    text: 'How do I implement authentication in my React app?',
    description: 'Standard implementation question',
    expectedLevel: 'medium' as const,
  },
  {
    text: 'Analyze the trade-offs between microservices and monolithic architectures, considering scalability, development velocity, operational complexity, and cost implications for a mid-sized SaaS platform.',
    description: 'Complex analytical request',
    expectedLevel: 'complex' as const,
  },
  {
    text: 'Hi! How are you today?',
    description: 'Simple greeting',
    expectedLevel: 'simple' as const,
  },
  {
    text: 'Compare and contrast the performance characteristics of different sorting algorithms',
    description: 'Analytical comparison',
    expectedLevel: 'complex' as const,
  },
]

const COMPLEXITY_COLORS = {
  simple: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/20',
  },
  medium: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/20',
  },
  complex: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-600 dark:text-purple-400',
    ring: 'ring-purple-500/20',
  },
}

export default function ModelRoutingDemoPage() {
  const [query, setQuery] = React.useState('')
  const [complexity, setComplexity] = React.useState<QueryComplexity | null>(null)
  const [routing, setRouting] = React.useState<RoutingDecision | null>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)

  // Analyze query with debounce
  React.useEffect(() => {
    if (!query.trim()) {
      setComplexity(null)
      setRouting(null)
      return
    }

    setIsAnalyzing(true)
    const timeoutId = setTimeout(() => {
      const complexityResult = analyzeComplexity(query)
      setComplexity(complexityResult)

      const routingResult = routeQuery(query, {
        availableModels: COMMON_MODELS,
      })
      setRouting(routingResult)
      setIsAnalyzing(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery)
  }

  const colors = complexity ? COMPLEXITY_COLORS[complexity.level] : COMPLEXITY_COLORS.simple

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/30">
              <Brain className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                  Interactive Demo
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Model Routing: Live Query Analysis
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl">
            See how query complexity analysis determines which AI model to use. Save 40-60% on costs
            by routing simple queries to cheaper models while preserving quality.
          </p>
        </motion.header>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Query Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Enter Your Query
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type any query to see complexity analysis..."
                className={cn(
                  'w-full h-32 px-4 py-3 rounded-lg border bg-background/50',
                  'focus:outline-none focus:ring-2 transition-all',
                  'resize-none scrollbar-hide',
                  query.trim() ? `${colors.border} ${colors.ring}` : 'border-border/50'
                )}
              />
              <div className="text-xs text-muted-foreground">
                Character count: {query.length} • Estimated tokens: ~
                {Math.ceil(query.length / 4)}
              </div>
            </div>

            {/* Example Queries */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Try These Examples:</h3>
              <div className="space-y-2">
                {EXAMPLE_QUERIES.map((example, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleExampleClick(example.text)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-all',
                      'hover:border-brand-500/30 hover:shadow-sm',
                      'focus:outline-none focus:ring-2 focus:ring-brand-500/20',
                      query === example.text
                        ? 'bg-brand-500/10 border-brand-500'
                        : 'bg-muted/20 border-border/50'
                    )}
                  >
                    <div className="text-sm text-foreground mb-1">{example.text}</div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full border',
                          COMPLEXITY_COLORS[example.expectedLevel].bg,
                          COMPLEXITY_COLORS[example.expectedLevel].border,
                          COMPLEXITY_COLORS[example.expectedLevel].text
                        )}
                      >
                        {example.expectedLevel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {example.description}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Analysis */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {!query.trim() ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center p-12 rounded-lg border-2 border-dashed border-border/50"
                >
                  <div className="text-center">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="text-muted-foreground">
                      Enter a query to see complexity analysis
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  {/* Complexity Score */}
                  {complexity && (
                    <div
                      className={cn(
                        'p-6 rounded-lg border-2',
                        colors.bg,
                        colors.border
                      )}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className={cn('w-5 h-5', colors.text)} />
                          <h3 className="font-semibold">Complexity Analysis</h3>
                        </div>
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-sm font-semibold border',
                            colors.bg,
                            colors.border,
                            colors.text
                          )}
                        >
                          {complexity.level.toUpperCase()}
                        </span>
                      </div>

                      {/* Score Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Complexity Score</span>
                          <span className={cn('font-mono font-semibold', colors.text)}>
                            {(complexity.score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${complexity.score * 100}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className={cn(
                              'h-full rounded-full',
                              complexity.level === 'simple' && 'bg-emerald-500',
                              complexity.level === 'medium' && 'bg-amber-500',
                              complexity.level === 'complex' && 'bg-purple-500'
                            )}
                          />
                        </div>
                      </div>

                      {/* Reasons */}
                      <div className="space-y-2">
                        <div className="text-sm font-semibold">Detected Factors:</div>
                        <div className="space-y-1">
                          {complexity.reasons.map((reason, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Routing Decision */}
                  {routing && (
                    <div className="p-6 rounded-lg border-2 border-brand-500/30 bg-brand-500/5">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        <h3 className="font-semibold">Selected Model</h3>
                      </div>

                      {/* Model Selection */}
                      <div className="p-4 rounded-lg bg-background border border-border/50 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-semibold text-lg">
                              {routing.model.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {routing.model.provider} • {routing.model.tier} tier
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                              ${routing.estimatedCost.toFixed(4)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              estimated cost
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Details */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                            Input Cost
                          </div>
                          <div className="font-mono text-sm">
                            ${routing.model.inputCost.toFixed(8)}/token
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                            Output Cost
                          </div>
                          <div className="font-mono text-sm">
                            ${routing.model.outputCost.toFixed(8)}/token
                          </div>
                        </div>
                      </div>

                      {/* Savings */}
                      {routing.savingsPercent > 0 && (
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="font-semibold text-sm text-green-700 dark:text-green-300">
                              Cost Savings
                            </span>
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Save <strong>{routing.savingsPercent.toFixed(1)}%</strong> vs using
                            the most expensive model for this query.
                          </p>
                        </div>
                      )}

                      {/* Reasoning */}
                      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="text-xs text-muted-foreground mb-2">
                          Routing Reasoning:
                        </div>
                        <p className="text-sm">{routing.reasoning}</p>
                      </div>
                    </div>
                  )}

                  {/* All Models Comparison */}
                  {routing && (
                    <div className="p-6 rounded-lg border border-border/50 bg-muted/20">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        All Models Comparison
                      </h3>
                      <div className="space-y-2">
                        {COMMON_MODELS.filter(
                          (m) => m.provider === routing.model.provider
                        )
                          .sort((a, b) => {
                            const aCost =
                              complexity!.estimatedTokens * a.inputCost +
                              complexity!.estimatedTokens * 2 * a.outputCost
                            const bCost =
                              complexity!.estimatedTokens * b.inputCost +
                              complexity!.estimatedTokens * 2 * b.outputCost
                            return aCost - bCost
                          })
                          .map((model) => {
                            const cost =
                              complexity!.estimatedTokens * model.inputCost +
                              complexity!.estimatedTokens * 2 * model.outputCost
                            const isSelected = model.id === routing.model.id
                            return (
                              <div
                                key={model.id}
                                className={cn(
                                  'p-3 rounded-lg border transition-all',
                                  isSelected
                                    ? 'bg-brand-500/10 border-brand-500 ring-2 ring-brand-500/20'
                                    : 'bg-background border-border/50'
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div
                                      className={cn(
                                        'font-medium text-sm',
                                        isSelected && 'text-brand-600 dark:text-brand-400'
                                      )}
                                    >
                                      {model.name}
                                      {isSelected && (
                                        <span className="ml-2 text-xs">
                                          <ArrowRight className="w-3 h-3 inline" /> Selected
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {model.tier} tier
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div
                                      className={cn(
                                        'font-mono font-semibold',
                                        isSelected && 'text-brand-600 dark:text-brand-400'
                                      )}
                                    >
                                      ${cost.toFixed(4)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {cost < routing.estimatedCost &&
                                        !isSelected &&
                                        `${(((routing.estimatedCost - cost) / routing.estimatedCost) * 100).toFixed(0)}% cheaper`}
                                      {cost > routing.estimatedCost &&
                                        `${(((cost - routing.estimatedCost) / cost) * 100).toFixed(0)}% more`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* How It Works Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 rounded-lg bg-muted/30 border border-border/50"
        >
          <h2 className="text-2xl font-bold mb-6">How Model Routing Works</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  1
                </span>
              </div>
              <h3 className="font-semibold mb-2">Analyze Complexity</h3>
              <p className="text-sm text-muted-foreground">
                Queries are analyzed using pattern matching, length, context size, and
                technical indicators to determine complexity level.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">2</span>
              </div>
              <h3 className="font-semibold mb-2">Select Model</h3>
              <p className="text-sm text-muted-foreground">
                Based on complexity, route to simple (cheap), standard, or advanced (expensive)
                tier models. Simple queries use cheaper models.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  3
                </span>
              </div>
              <h3 className="font-semibold mb-2">Optimize Costs</h3>
              <p className="text-sm text-muted-foreground">
                Save 40-60% on API costs by using cheaper models for simple tasks while
                maintaining quality with premium models for complex queries.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Key Insights */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid md:grid-cols-2 gap-6"
        >
          <div className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Complexity Factors
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  <strong>Simple:</strong> Greetings, factual questions, definitions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  <strong>Medium:</strong> How-to questions, standard implementations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  <strong>Complex:</strong> Analysis, comparisons, architecture, code generation
                </span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" />
              Cost Savings
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Claude 3 Haiku is 60x cheaper than Claude 3 Opus</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>GPT-3.5 Turbo is 60x cheaper than GPT-4</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Average 40-60% cost reduction with smart routing</span>
              </li>
            </ul>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
