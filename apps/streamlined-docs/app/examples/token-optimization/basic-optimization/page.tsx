'use client'

/**
 * Basic Token Optimization Example
 *
 * Interactive demonstration of the useTokenCounter hook showing:
 * - Real-time token counting as you type
 * - Model-specific token calculations
 * - Token optimization toggle with text shortening
 * - Visual feedback for token limits
 * - Performance metrics and savings
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Gauge,
  Scissors,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useTokenCounter } from '@clarity-chat/react'
import { shortenPrompt, calculateTokenSavings } from '@clarity-chat/react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import Link from 'next/link'

const EXAMPLE_TEXT = `I'm really, really trying to understand, you know, how artificial intelligence and machine learning, as well as neural networks, work together in order to create, um, you know, intelligent systems that can, sort of, process and analyze data in a way that's similar to how humans think and reason. I would like to know, basically, what are the fundamental principles and concepts that underpin these technologies, and how do they actually work in practice?`

const MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', contextWindow: 128000 },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', contextWindow: 128000 },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', contextWindow: 200000 },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', contextWindow: 200000 },
] as const

export default function BasicOptimizationExamplePage() {
  const [text, setText] = React.useState(EXAMPLE_TEXT)
  const [selectedModel, setSelectedModel] = React.useState<string>('gpt-4o')
  const [optimizationEnabled, setOptimizationEnabled] = React.useState(false)
  const [optimizedText, setOptimizedText] = React.useState('')

  // Initialize token counter hook
  const { countTokens, isWithinLimit, modelMaxTokens, encodingName } =
    useTokenCounter({
      model: selectedModel,
      debounceMs: 150,
      includeMessageOverhead: true,
    })

  // Calculate tokens for current text
  const currentTokens = React.useMemo(() => {
    return countTokens(text)
  }, [text, countTokens])

  // Calculate tokens for optimized text
  const optimizedTokens = React.useMemo(() => {
    if (!optimizationEnabled || !optimizedText) return 0
    return countTokens(optimizedText)
  }, [optimizedText, optimizationEnabled, countTokens])

  // Calculate savings
  const savings = React.useMemo(() => {
    if (!optimizationEnabled || !optimizedText) {
      return { tokensSaved: 0, percentage: 0 }
    }
    return calculateTokenSavings(text, optimizedText)
  }, [text, optimizedText, optimizationEnabled])

  // Get model config
  const modelConfig = MODELS.find((m) => m.id === selectedModel)
  const warningThreshold = modelConfig ? modelConfig.contextWindow * 0.7 : 50000
  const criticalThreshold = modelConfig
    ? modelConfig.contextWindow * 0.9
    : 100000

  // Token status
  const getTokenStatus = React.useCallback(
    (tokens: number) => {
      if (tokens >= criticalThreshold) return 'critical'
      if (tokens >= warningThreshold) return 'warning'
      return 'normal'
    },
    [criticalThreshold, warningThreshold]
  )

  const currentStatus = getTokenStatus(currentTokens)
  const optimizedStatus = optimizedText
    ? getTokenStatus(optimizedTokens)
    : 'normal'

  // Handle optimization toggle
  const handleOptimizationToggle = () => {
    if (!optimizationEnabled) {
      // Enable optimization and shorten text
      const shortened = shortenPrompt(text, {
        removeDuplicates: true,
        removeFillers: true,
        simplifySentences: true,
        targetReduction: 0.3,
      })
      setOptimizedText(shortened)
    } else {
      // Disable optimization
      setOptimizedText('')
    }
    setOptimizationEnabled(!optimizationEnabled)
  }

  // Handle example button
  const loadExample = () => {
    setText(EXAMPLE_TEXT)
    setOptimizationEnabled(false)
    setOptimizedText('')
  }

  const statusColors = {
    normal:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning:
      'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    critical:
      'bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  }

  const StatusIcon = {
    normal: CheckCircle2,
    warning: AlertTriangle,
    critical: AlertTriangle,
  }[currentStatus]

  return (
    <div className="min-h-screen">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: durations.moderate,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/examples/token-optimization"
              className="text-sm text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              ← Back to Token Optimization
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
              <Calculator className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                Interactive Example
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Basic Token Optimization
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl">
            Experience real-time token counting with the useTokenCounter hook. Toggle
            optimization to see automatic text shortening and token savings.
          </p>
        </motion.header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr,340px] gap-6">
          {/* Left Column - Input & Controls */}
          <div className="space-y-6">
            {/* Model Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-foreground">
                Select Model
              </label>
              <div className="grid grid-cols-2 gap-3">
                {MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={cn(
                      'p-3 rounded-lg border transition-all text-left',
                      'focus:outline-none focus:ring-2 focus:ring-brand-500',
                      selectedModel === model.id
                        ? 'bg-brand-500/10 border-brand-500 shadow-sm'
                        : 'bg-muted/20 border-border/50 hover:border-brand-500/30'
                    )}
                  >
                    <div className="font-semibold text-sm">{model.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {(model.contextWindow / 1000).toFixed(0)}K context
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Text Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Input Text
                </label>
                <button
                  onClick={loadExample}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Load Example
                </button>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className={cn(
                  'w-full h-48 px-4 py-3 rounded-lg border',
                  'bg-background text-foreground',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-brand-500',
                  'resize-none font-mono text-sm',
                  'scrollbar-hide',
                  currentStatus === 'critical'
                    ? 'border-red-500'
                    : currentStatus === 'warning'
                      ? 'border-amber-500'
                      : 'border-border'
                )}
              />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{text.length} characters</span>
                <span>
                  {text.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </motion.div>

            {/* Optimization Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <Scissors className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <div>
                  <div className="font-semibold text-sm">Token Optimization</div>
                  <div className="text-xs text-muted-foreground">
                    Remove fillers and simplify text
                  </div>
                </div>
              </div>

              <button
                onClick={handleOptimizationToggle}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
                  optimizationEnabled
                    ? 'bg-brand-600'
                    : 'bg-muted-foreground/30'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    optimizationEnabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </motion.div>

            {/* Optimized Output */}
            <AnimatePresence>
              {optimizationEnabled && optimizedText && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label className="text-sm font-semibold text-foreground">
                    Optimized Text
                  </label>

                  <div
                    className={cn(
                      'w-full h-48 px-4 py-3 rounded-lg border overflow-y-auto',
                      'bg-emerald-500/5 border-emerald-200 dark:border-emerald-800',
                      'font-mono text-sm scrollbar-hide'
                    )}
                  >
                    {optimizedText}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      Reduced by {savings.percentage.toFixed(1)}% (
                      {savings.tokensSaved} tokens saved)
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Metrics & Stats */}
          <div className="space-y-6">
            {/* Token Count Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'p-6 rounded-lg border',
                statusColors[currentStatus]
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5" />
                  <span className="font-semibold text-sm">Token Count</span>
                </div>
                <StatusIcon className="w-5 h-5" />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold mb-1">
                    {currentTokens.toLocaleString()}
                  </div>
                  <div className="text-xs opacity-80">
                    of {modelMaxTokens.toLocaleString()} max
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(currentTokens / modelMaxTokens) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={cn(
                      'h-full rounded-full',
                      currentStatus === 'critical'
                        ? 'bg-red-600'
                        : currentStatus === 'warning'
                          ? 'bg-amber-600'
                          : 'bg-emerald-600'
                    )}
                  />
                </div>

                <div className="text-xs opacity-80">
                  {((currentTokens / modelMaxTokens) * 100).toFixed(2)}% utilized
                </div>
              </div>
            </motion.div>

            {/* Optimization Stats */}
            <AnimatePresence>
              {optimizationEnabled && optimizedText && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-500/10"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                    <span className="font-semibold text-sm text-emerald-700 dark:text-emerald-300">
                      Optimization Results
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-emerald-700/80 dark:text-emerald-300/80">
                        Original:
                      </span>
                      <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                        {currentTokens} tokens
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-emerald-700/80 dark:text-emerald-300/80">
                        Optimized:
                      </span>
                      <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                        {optimizedTokens} tokens
                      </span>
                    </div>

                    <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-emerald-700/80 dark:text-emerald-300/80">
                          Saved:
                        </span>
                        <span className="font-mono font-bold text-lg text-emerald-700 dark:text-emerald-300">
                          {savings.tokensSaved} tokens
                        </span>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                          {savings.percentage.toFixed(1)}%
                        </span>
                        <span className="text-xs text-emerald-700/80 dark:text-emerald-300/80 ml-1">
                          reduction
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Model Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                <span className="font-semibold text-sm text-blue-700 dark:text-blue-300">
                  Model Details
                </span>
              </div>

              <div className="space-y-2 text-xs text-blue-700/80 dark:text-blue-300/80">
                <div className="flex justify-between">
                  <span>Model:</span>
                  <span className="font-mono">{selectedModel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Encoding:</span>
                  <span className="font-mono">{encodingName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Context Window:</span>
                  <span className="font-mono">
                    {modelMaxTokens.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="font-semibold text-sm">Pro Tips</span>
              </div>

              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                  <span>
                    Enable optimization to remove filler words and simplify text
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                  <span>
                    Token counts update in real-time with 150ms debounce
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                  <span>
                    Different models use different tokenization algorithms
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Code Example */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 space-y-4"
        >
          <h2 className="text-2xl font-bold text-foreground">
            Implementation Code
          </h2>

          <div className="p-6 rounded-lg bg-muted/30 border border-border/50 overflow-x-auto">
            <pre className="text-sm font-mono">
              <code className="language-tsx">{`import { useTokenCounter } from '@clarity-chat/react'
import { shortenPrompt, calculateTokenSavings } from '@clarity-chat/react'

function TokenOptimizationDemo() {
  const [text, setText] = useState('')
  const [optimizationEnabled, setOptimizationEnabled] = useState(false)

  // Initialize token counter hook
  const {
    countTokens,
    isWithinLimit,
    modelMaxTokens,
    encodingName
  } = useTokenCounter({
    model: 'gpt-4o',
    debounceMs: 150,
    includeMessageOverhead: true,
  })

  // Count tokens for current text
  const currentTokens = countTokens(text)

  // Optimize text when enabled
  const optimizedText = optimizationEnabled
    ? shortenPrompt(text, {
        removeDuplicates: true,
        removeFillers: true,
        simplifySentences: true,
        targetReduction: 0.3,
      })
    : ''

  // Calculate savings
  const savings = calculateTokenSavings(text, optimizedText)

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div>
        Tokens: {currentTokens} / {modelMaxTokens}
      </div>

      {optimizationEnabled && (
        <div>
          Saved {savings.tokensSaved} tokens ({savings.percentage}%)
        </div>
      )}
    </div>
  )
}`}</code>
            </pre>
          </div>
        </motion.section>

        {/* Next Steps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 rounded-lg bg-brand-500/10 border border-brand-200 dark:border-brand-800"
        >
          <h2 className="text-xl font-bold text-brand-700 dark:text-brand-300 mb-4">
            Ready for More?
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/examples/token-optimization"
              className={cn(
                'group p-4 rounded-lg border border-border/50',
                'hover:border-brand-500/30 hover:shadow-sm transition-all',
                'focus:outline-none focus:ring-2 focus:ring-brand-500'
              )}
            >
              <h3 className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
                More Examples
              </h3>
              <p className="text-sm text-muted-foreground">
                Explore advanced token optimization features
              </p>
            </Link>

            <Link
              href="/reference/hooks/use-token-counter"
              className={cn(
                'group p-4 rounded-lg border border-border/50',
                'hover:border-brand-500/30 hover:shadow-sm transition-all',
                'focus:outline-none focus:ring-2 focus:ring-brand-500'
              )}
            >
              <h3 className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1 flex items-center gap-2">
                API Reference
                <ChevronRight className="w-4 h-4" />
              </h3>
              <p className="text-sm text-muted-foreground">
                Complete hook documentation
              </p>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
