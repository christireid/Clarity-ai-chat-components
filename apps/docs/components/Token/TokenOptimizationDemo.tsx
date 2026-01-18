'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Zap,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Calculator,
  BarChart3,
  RefreshCw,
  FileText,
  Copy,
  Check,
  Info,
} from 'lucide-react'

// =============================================================================
// Types
// =============================================================================

interface TokenOptimizationDemoProps {
  /** Custom class name for the container */
  className?: string
  /** Show the ROI calculator link */
  showROILink?: boolean
  /** Custom link to the ROI calculator */
  roiCalculatorLink?: string
  /** Initial sample text to display */
  initialText?: string
  /** Whether to auto-focus the textarea on mount */
  autoFocus?: boolean
  /** Variant for different layout contexts */
  variant?: 'default' | 'compact' | 'full'
}

interface TokenStats {
  original: number
  optimized: number
  savings: number
  percentSaved: number
}

// =============================================================================
// Token Estimation Utilities
// =============================================================================

/**
 * Simplified tokenizer that approximates GPT-style tokenization.
 * In production, you would use a proper tokenizer like tiktoken.
 * This approximation uses the ~4 characters per token heuristic
 * combined with word boundary detection for better accuracy.
 */
function estimateTokenCount(text: string): number {
  if (!text || text.trim().length === 0) return 0

  // Split by whitespace and punctuation to get "words"
  const words = text.split(/[\s]+/).filter(Boolean)

  let tokenCount = 0
  for (const word of words) {
    // Approximate tokens: short words (~1 token), longer words (1 token per ~4 chars)
    if (word.length <= 4) {
      tokenCount += 1
    } else {
      tokenCount += Math.ceil(word.length / 4)
    }
  }

  // Add tokens for punctuation (roughly)
  const punctuationMatches = text.match(/[.,!?;:'"()\[\]{}]/g)
  if (punctuationMatches) {
    tokenCount += Math.ceil(punctuationMatches.length / 2)
  }

  return Math.max(1, tokenCount)
}

/**
 * Simulates TOON optimization effects.
 * TOON (Token-Optimized Object Notation) achieves savings through:
 * - Removing redundant whitespace
 * - Using shorter key names
 * - Eliminating null/undefined values
 * - Compacting nested structures
 */
function calculateToonOptimization(originalTokens: number, text: string): number {
  if (originalTokens === 0) return 0

  // Base optimization: 15-25% reduction for typical text
  let optimizationFactor = 0.80

  // JSON/structured data gets better optimization (30-45% reduction)
  const hasJsonPattern = /[\{\[\"]/.test(text)
  if (hasJsonPattern) {
    optimizationFactor = 0.65
  }

  // Repetitive content gets even better optimization
  const words = text.toLowerCase().split(/\s+/)
  const uniqueWords = new Set(words)
  const repetitionRatio = words.length > 0 ? uniqueWords.size / words.length : 1

  if (repetitionRatio < 0.5) {
    optimizationFactor -= 0.10 // Up to 10% more savings for repetitive content
  }

  // Very long text benefits from context compression
  if (originalTokens > 500) {
    optimizationFactor -= 0.05
  }

  return Math.round(originalTokens * optimizationFactor)
}

// =============================================================================
// Animation Variants
// =============================================================================

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

const statsVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

const savingsBarVariants = {
  hidden: { scaleX: 0 },
  visible: (percent: number) => ({
    scaleX: percent / 100,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      delay: 0.2,
    },
  }),
}

const numberVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
}

// =============================================================================
// Sample Text Examples
// =============================================================================

const SAMPLE_TEXTS = [
  {
    label: 'API Response',
    text: `{
  "user": {
    "id": "usr_12345",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2024-01-15T10:30:00Z",
    "metadata": {
      "preferences": {
        "theme": "dark",
        "notifications": true,
        "language": "en-US"
      }
    }
  },
  "status": "success",
  "message": "User retrieved successfully"
}`,
  },
  {
    label: 'Chat History',
    text: `User: Hello, I need help with my order #12345.
Assistant: Of course! I'd be happy to help you with order #12345. Let me look that up for you. Could you tell me what issue you're experiencing?
User: The package hasn't arrived yet and it's been 5 days.
Assistant: I understand your concern about the delayed delivery. Let me check the shipping status for order #12345. According to our records, your package was shipped on January 10th via Standard Shipping. The current tracking shows it's in transit and expected to arrive within 1-2 business days.`,
  },
  {
    label: 'System Prompt',
    text: `You are a helpful AI assistant specialized in customer support for an e-commerce platform. Your responsibilities include:
- Answering questions about products, orders, and shipping
- Helping customers track their orders and resolve delivery issues
- Processing returns and refund requests following company policy
- Providing product recommendations based on customer preferences
- Escalating complex issues to human agents when necessary

Always maintain a professional, friendly tone and prioritize customer satisfaction.`,
  },
]

// =============================================================================
// Sub-components
// =============================================================================

interface AnimatedNumberProps {
  value: number
  duration?: number
}

function AnimatedNumber({ value, duration = 500 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValue = useRef(value)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value)
      return
    }

    const startValue = previousValue.current
    const endValue = value
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue + (endValue - startValue) * easeProgress)

      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
    previousValue.current = value
  }, [value, duration, shouldReduceMotion])

  return <>{displayValue.toLocaleString()}</>
}

interface StatCardProps {
  label: string
  value: number
  suffix?: string
  icon: React.ReactNode
  color: 'gray' | 'green' | 'blue'
  highlight?: boolean
}

function StatCard({ label, value, suffix = ' tokens', icon, color, highlight }: StatCardProps) {
  const colorClasses = {
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-800/50',
      border: 'border-gray-200 dark:border-gray-700',
      icon: 'text-gray-500 dark:text-gray-400',
      text: 'text-gray-900 dark:text-gray-100',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-700 dark:text-green-300',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-700 dark:text-blue-300',
    },
  }

  const classes = colorClasses[color]

  return (
    <motion.div
      variants={statsVariants}
      initial="hidden"
      animate="visible"
      className={`
        relative p-4 rounded-xl border transition-all duration-200
        ${classes.bg} ${classes.border}
        ${highlight ? 'ring-2 ring-green-500/30 dark:ring-green-400/30' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${classes.bg} ${classes.icon}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </p>
          <p className={`text-2xl font-bold ${classes.text}`}>
            <AnimatedNumber value={value} />
            <span className="text-sm font-normal ml-1">{suffix}</span>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function TokenOptimizationDemo({
  className = '',
  showROILink = true,
  roiCalculatorLink = '/tools/roi-calculator',
  initialText = '',
  autoFocus = false,
  variant = 'default',
}: TokenOptimizationDemoProps) {
  const [text, setText] = useState(initialText)
  const [stats, setStats] = useState<TokenStats>({
    original: 0,
    optimized: 0,
    savings: 0,
    percentSaved: 0,
  })
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Calculate token stats whenever text changes
  useEffect(() => {
    const original = estimateTokenCount(text)
    const optimized = calculateToonOptimization(original, text)
    const savings = original - optimized
    const percentSaved = original > 0 ? Math.round((savings / original) * 100) : 0

    setStats({ original, optimized, savings, percentSaved })
  }, [text])

  // Handle sample text selection
  const handleSampleSelect = useCallback((sampleText: string) => {
    setText(sampleText)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }, [text])

  // Handle clear text
  const handleClear = useCallback(() => {
    setText('')
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Memoized savings visualization
  const savingsPercentage = useMemo(() => {
    return Math.min(stats.percentSaved, 100)
  }, [stats.percentSaved])

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-green-500" />
          <h3 className="text-sm font-semibold">Token Optimization Demo</h3>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text to see token savings..."
          className="w-full h-20 p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 dark:focus:border-green-400 transition-colors"
          autoFocus={autoFocus}
        />

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            {stats.original} tokens
            {stats.original > 0 && (
              <span className="text-green-600 dark:text-green-400 ml-2">
                -{stats.percentSaved}% with TOON
              </span>
            )}
          </span>
          {showROILink && (
            <Link
              href={roiCalculatorLink}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ROI Calculator
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-xl">
              <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Token Optimization Demo
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                See real-time savings with TOON format
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-800/30 rounded-full">
              <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Save 20-45%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`p-6 ${variant === 'full' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-6'}`}>
        {/* Input Section */}
        <div className="space-y-4">
          {/* Sample Text Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 self-center mr-1">
              Try sample:
            </span>
            {SAMPLE_TEXTS.map((sample) => (
              <button
                key={sample.label}
                onClick={() => handleSampleSelect(sample.text)}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Text Input */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here to see how many tokens you can save with TOON optimization..."
              className="w-full h-40 p-4 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 dark:focus:border-green-400 transition-colors font-mono"
              autoFocus={autoFocus}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {text.length > 0 && (
                <>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Copy text"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleClear}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Clear text"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Character count */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FileText className="w-3 h-3" />
            <span>{text.length.toLocaleString()} characters</span>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard
              label="Without Optimization"
              value={stats.original}
              icon={<BarChart3 className="w-4 h-4" />}
              color="gray"
            />
            <StatCard
              label="With TOON"
              value={stats.optimized}
              icon={<Zap className="w-4 h-4" />}
              color="blue"
              highlight
            />
            <StatCard
              label="Tokens Saved"
              value={stats.savings}
              icon={<TrendingDown className="w-4 h-4" />}
              color="green"
            />
          </div>

          {/* Savings Visualization */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Savings Visualization
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={stats.percentSaved}
                  variants={numberVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={`text-2xl font-bold ${
                    stats.percentSaved > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {stats.percentSaved}%
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              {/* Original (full width, gray) */}
              <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600" />

              {/* Optimized (green portion showing savings) */}
              <motion.div
                className="absolute inset-y-0 right-0 bg-gradient-to-r from-green-400 to-emerald-500"
                variants={savingsBarVariants}
                initial="hidden"
                animate="visible"
                custom={savingsPercentage}
                style={{ originX: 1 }}
              />

              {/* Labels */}
              <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium">
                <span className="text-gray-600 dark:text-gray-300">
                  {stats.optimized > 0 && 'Optimized'}
                </span>
                <span className="text-white drop-shadow-sm">
                  {stats.savings > 0 && `${stats.savings} saved`}
                </span>
              </div>
            </div>

            {/* Cost Estimation */}
            {stats.original > 0 && (
              <div className="flex items-start gap-2 mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <Info className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-green-700 dark:text-green-300">
                  <p className="font-medium mb-1">Estimated Savings Impact</p>
                  <p>
                    At $0.002/1K tokens (GPT-4), you would save approximately{' '}
                    <span className="font-semibold">
                      ${((stats.savings / 1000) * 0.002).toFixed(4)}
                    </span>{' '}
                    per request. For 10,000 daily requests, that is{' '}
                    <span className="font-semibold">
                      ${(((stats.savings / 1000) * 0.002) * 10000 * 30).toFixed(2)}/month
                    </span>
                    .
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setText(SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)].text)
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try With Your Data
            </button>

            {showROILink && (
              <Link
                href={roiCalculatorLink}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <Calculator className="w-4 h-4" />
                Full ROI Calculator
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Token counts are estimates. Actual savings vary based on content structure and optimization settings.
          <Link
            href="/guides/token-optimization"
            className="text-green-600 dark:text-green-400 hover:underline ml-1"
          >
            Learn more about TOON format
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

// =============================================================================
// Named Exports
// =============================================================================

export type { TokenOptimizationDemoProps, TokenStats }
export { estimateTokenCount, calculateToonOptimization }
