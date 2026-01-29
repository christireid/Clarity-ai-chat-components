'use client'

/**
 * Interactive Compression Demo
 *
 * Educational demonstration of token compression strategies:
 * - LLMLingua: Statistical token-level compression (2-20x)
 * - Extractive: Sentence-level extraction (2-5x)
 * - Adaptive: Auto-selects best strategy based on content
 *
 * Features real-time token counting, quality metrics, and side-by-side comparison.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Zap,
  Brain,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Clock,
  FileText,
  Copy,
  CheckCircle2,
  Info,
  ChevronRight,
  Gauge,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import {
  LLMLinguaCompressor,
  ExtractiveCompressor,
  AdaptiveCompressor,
  type LLMLinguaResult,
  type ExtractiveResult,
  type AdaptiveResult,
} from '@clarity-chat/token-optimization'

// Sample texts for quick testing
const SAMPLE_TEXTS = {
  technical: `System prompt for a code assistant: You are an expert software engineer with deep knowledge of TypeScript, React, and Next.js. Your primary responsibilities include writing clean, maintainable code, following SOLID principles, and implementing best practices for web development. When responding to queries, you should always provide well-documented examples with explanatory comments. You must validate all inputs thoroughly and handle edge cases appropriately. Error messages should be clear and actionable. Performance optimization is a key consideration in all implementations. Security best practices must be followed at all times.`,

  conversational: `Hey there! I'm really excited about this new project we're working on. There are so many possibilities and opportunities to explore. We should definitely consider all the different approaches and methodologies that could work for us. I think it's really important that we take the time to thoroughly evaluate each option and make sure we're choosing the best path forward. What do you think about this? Should we schedule a meeting to discuss it in more detail? Let me know your thoughts!`,

  structured: `Product Requirements Document
Title: User Authentication System
Version: 1.0
Date: January 2026

1. Overview
This document outlines the requirements for implementing a secure user authentication system.

2. Objectives
- Provide secure login/logout functionality
- Support multiple authentication methods
- Enable password reset workflows
- Implement session management

3. Technical Specifications
- JWT-based authentication
- bcrypt password hashing
- Rate limiting on login attempts
- CSRF protection enabled`,

  mixed: `The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for testing. In software development, we often need to compress data to reduce storage costs and improve transmission speeds. Token optimization is particularly important for AI applications where context windows are limited. By using intelligent compression strategies, we can fit more information into the same token budget while maintaining semantic meaning. Different compression algorithms work better for different types of content: LLMLingua excels at technical text, while extractive methods work well for conversational content.`,
}

type CompressionStrategy = 'llmlingua' | 'extractive' | 'adaptive'

interface StrategyConfig {
  id: CompressionStrategy
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  bestFor: string[]
  color: string
}

const STRATEGIES: StrategyConfig[] = [
  {
    id: 'llmlingua',
    name: 'LLMLingua',
    description: 'Statistical token-level compression using importance scoring',
    icon: Brain,
    bestFor: ['Technical text', 'Code', 'Documentation', 'Structured content'],
    color: 'purple',
  },
  {
    id: 'extractive',
    name: 'Extractive',
    description: 'Sentence-level extraction preserving key information',
    icon: FileText,
    bestFor: ['Conversational text', 'Narratives', 'Articles', 'General content'],
    color: 'blue',
  },
  {
    id: 'adaptive',
    name: 'Adaptive',
    description: 'Auto-selects best strategy based on content analysis',
    icon: Zap,
    bestFor: ['Mixed content', 'Unknown type', 'Automatic optimization'],
    color: 'amber',
  },
]

const colorClasses = {
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    hover: 'hover:border-purple-500/30',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    hover: 'hover:border-blue-500/30',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    hover: 'hover:border-amber-500/30',
  },
}

export default function CompressionDemoPage() {
  const [inputText, setInputText] = React.useState('')
  const [strategy, setStrategy] = React.useState<CompressionStrategy>('llmlingua')
  const [compressionRate, setCompressionRate] = React.useState(30)
  const [isCompressing, setIsCompressing] = React.useState(false)
  const [result, setResult] = React.useState<LLMLinguaResult | ExtractiveResult | AdaptiveResult | null>(null)
  const [copiedOriginal, setCopiedOriginal] = React.useState(false)
  const [copiedCompressed, setCopiedCompressed] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Token counting (debounced)
  const [originalTokens, setOriginalTokens] = React.useState(0)
  const [compressedTokens, setCompressedTokens] = React.useState(0)

  // Create token counter instance
  const tokenCounter = React.useMemo(
    () => new AccurateTokenCounter({ model: 'gpt-4o', enableCaching: true }),
    []
  )

  // Count tokens with debouncing
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

  // Compression handler
  const handleCompress = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to compress')
      return
    }

    setIsCompressing(true)
    setError(null)

    try {
      const targetRatio = compressionRate / 100
      let compressionResult: LLMLinguaResult | ExtractiveResult | AdaptiveResult

      switch (strategy) {
        case 'llmlingua': {
          const compressor = new LLMLinguaCompressor()
          compressionResult = await compressor.compress(inputText, targetRatio, {
            preserveInstructions: true,
            preserveCode: true,
            debug: true,
          })
          break
        }
        case 'extractive': {
          const compressor = new ExtractiveCompressor()
          compressionResult = await compressor.compress(inputText, targetRatio, {
            preserveStructure: true,
            debug: true,
          })
          break
        }
        case 'adaptive': {
          const compressor = new AdaptiveCompressor()
          compressionResult = await compressor.compress(inputText, targetRatio, {
            debug: true,
          })
          break
        }
      }

      setResult(compressionResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed')
      console.error('Compression error:', err)
    } finally {
      setIsCompressing(false)
    }
  }

  // Copy handlers
  const handleCopyOriginal = async () => {
    await navigator.clipboard.writeText(inputText)
    setCopiedOriginal(true)
    setTimeout(() => setCopiedOriginal(false), 2000)
  }

  const handleCopyCompressed = async () => {
    if (result?.compressed) {
      await navigator.clipboard.writeText(result.compressed)
      setCopiedCompressed(true)
      setTimeout(() => setCopiedCompressed(false), 2000)
    }
  }

  // Load sample text
  const handleLoadSample = (key: keyof typeof SAMPLE_TEXTS) => {
    setInputText(SAMPLE_TEXTS[key])
    setResult(null)
  }

  // Calculate savings
  const savings = result
    ? Math.round((1 - result.compressionRatio) * 100)
    : 0

  const tokenSavings = originalTokens && compressedTokens
    ? Math.round(((originalTokens - compressedTokens) / originalTokens) * 100)
    : 0

  const qualityScore = result ? Math.round(result.quality.overallQuality * 100) : 0

  const activeStrategy = STRATEGIES.find(s => s.id === strategy)!
  const activeColors = colorClasses[activeStrategy.color as keyof typeof colorClasses]

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
              activeColors.bg,
              activeColors.text,
              activeColors.border
            )}>
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <span className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full border',
                activeColors.bg,
                activeColors.text,
                activeColors.border
              )}>
                Interactive Demo
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Compression Strategies Demo
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore different compression algorithms and see how they reduce token usage while
            preserving semantic meaning. Try different strategies and compression rates to find
            the optimal balance for your use case.
          </p>
        </motion.header>

        {/* Main Demo Interface */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left Column - Input/Output */}
          <div className="space-y-6">
            {/* Sample Text Presets */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Info className="w-4 h-4" />
                Try with sample text
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(SAMPLE_TEXTS).map(([key, _]) => (
                  <button
                    key={key}
                    onClick={() => handleLoadSample(key as keyof typeof SAMPLE_TEXTS)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-sm font-medium',
                      'bg-muted/30 border border-border/50',
                      'hover:bg-muted/50 hover:border-brand-500/30',
                      'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500'
                    )}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Input Text Area */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Original Text
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {originalTokens} tokens
                  </span>
                  <button
                    onClick={handleCopyOriginal}
                    disabled={!inputText}
                    className={cn(
                      'p-1.5 rounded-md transition-colors',
                      'hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed',
                      'focus:outline-none focus:ring-2 focus:ring-brand-500'
                    )}
                    aria-label="Copy original text"
                  >
                    {copiedOriginal ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter or paste text to compress..."
                className={cn(
                  'w-full h-64 p-4 rounded-lg',
                  'bg-muted/30 border border-border/50',
                  'text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-brand-500',
                  'resize-none font-mono text-sm',
                  'scrollbar-hide'
                )}
              />
            </motion.div>

            {/* Compressed Output */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      Compressed Output
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        qualityScore >= 80 ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                        qualityScore >= 60 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-red-500/10 text-red-600 dark:text-red-400'
                      )}>
                        {qualityScore}% quality
                      </span>
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {compressedTokens} tokens
                      </span>
                      <button
                        onClick={handleCopyCompressed}
                        className={cn(
                          'p-1.5 rounded-md transition-colors',
                          'hover:bg-muted/50',
                          'focus:outline-none focus:ring-2 focus:ring-brand-500'
                        )}
                        aria-label="Copy compressed text"
                      >
                        {copiedCompressed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'w-full h-64 p-4 rounded-lg',
                      'bg-muted/30 border border-border/50',
                      'text-foreground',
                      'overflow-y-auto font-mono text-sm',
                      'scrollbar-hide'
                    )}
                  >
                    {result.compressed}
                  </div>

                  {/* Warning if quality is low */}
                  {result.warning && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        'p-3 rounded-lg border flex items-start gap-3',
                        'bg-amber-500/10 border-amber-200 dark:border-amber-800'
                      )}
                    >
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        {result.warning}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    'p-4 rounded-lg border flex items-start gap-3',
                    'bg-red-500/10 border-red-200 dark:border-red-800'
                  )}
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-300 text-sm mb-1">
                      Compression Failed
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Controls & Metrics */}
          <div className="space-y-6">
            {/* Strategy Selector */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h2 className="text-sm font-semibold text-muted-foreground">
                Compression Strategy
              </h2>
              <div className="space-y-2">
                {STRATEGIES.map((strat) => {
                  const Icon = strat.icon
                  const colors = colorClasses[strat.color as keyof typeof colorClasses]
                  const isActive = strategy === strat.id

                  return (
                    <button
                      key={strat.id}
                      onClick={() => setStrategy(strat.id)}
                      className={cn(
                        'w-full text-left p-4 rounded-lg border transition-all',
                        'focus:outline-none focus:ring-2 focus:ring-brand-500',
                        isActive
                          ? cn(colors.bg, colors.border, 'shadow-sm')
                          : 'bg-muted/20 border-border/50 hover:border-brand-500/30'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'p-2 rounded-md shrink-0',
                          isActive ? colors.bg : 'bg-muted/50'
                        )}>
                          <Icon className={cn(
                            'w-5 h-5',
                            isActive ? colors.text : 'text-muted-foreground'
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={cn(
                            'font-semibold text-sm mb-1',
                            isActive ? colors.text : 'text-foreground'
                          )}>
                            {strat.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            {strat.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {strat.bestFor.map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 rounded text-xs bg-muted/30 text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>

            {/* Compression Rate Slider */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-muted-foreground">
                  Target Compression Rate
                </label>
                <span className="text-sm font-mono text-foreground">
                  {compressionRate}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={compressionRate}
                onChange={(e) => setCompressionRate(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Lower values = more compression, higher values = better quality
              </p>
            </motion.div>

            {/* Compress Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleCompress}
              disabled={!inputText.trim() || isCompressing}
              className={cn(
                'w-full py-3 px-4 rounded-lg font-semibold',
                'flex items-center justify-center gap-2',
                'transition-all focus:outline-none focus:ring-2 focus:ring-brand-500',
                isCompressing
                  ? 'bg-muted/50 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-md'
              )}
            >
              {isCompressing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Gauge className="w-5 h-5" />
                  </motion.div>
                  Compressing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Compress Text
                </>
              )}
            </motion.button>

            {/* Metrics Panel */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'p-6 rounded-lg border space-y-4',
                    activeColors.bg,
                    activeColors.border
                  )}
                >
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Compression Metrics
                  </h3>

                  <div className="space-y-3">
                    {/* Token Savings */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Token Savings</span>
                        <span className={cn(
                          'text-lg font-bold',
                          tokenSavings > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                        )}>
                          {tokenSavings > 0 ? `-${tokenSavings}%` : '0%'}
                        </span>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${tokenSavings}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="h-full bg-green-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Character Savings */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Character Reduction</span>
                        <span className={cn(
                          'text-lg font-bold',
                          savings > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                        )}>
                          {savings > 0 ? `-${savings}%` : '0%'}
                        </span>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${savings}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="h-full bg-blue-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Quality Score */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Quality Score</span>
                        <span className={cn(
                          'text-lg font-bold',
                          qualityScore >= 80 ? 'text-green-600 dark:text-green-400' :
                          qualityScore >= 60 ? 'text-amber-600 dark:text-amber-400' :
                          'text-red-600 dark:text-red-400'
                        )}>
                          {qualityScore}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${qualityScore}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className={cn(
                            'h-full rounded-full',
                            qualityScore >= 80 ? 'bg-green-500' :
                            qualityScore >= 60 ? 'bg-amber-500' :
                            'bg-red-500'
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-xs">Before</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {originalTokens}
                      </p>
                      <p className="text-xs text-muted-foreground">tokens</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs">After</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {compressedTokens}
                      </p>
                      <p className="text-xs text-muted-foreground">tokens</p>
                    </div>
                  </div>

                  {/* Processing Time */}
                  {'debug' in result && result.debug && (
                    <div className="pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">Processing Time</span>
                        </div>
                        <span className="text-sm font-mono text-foreground">
                          {result.debug.processingTimeMs}ms
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Educational Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800"
            >
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                How it works
              </h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                {activeStrategy.id === 'llmlingua' &&
                  'LLMLingua uses statistical analysis to score each token by importance, then removes low-scoring tokens while preserving semantic meaning. Great for technical content with structured information.'}
                {activeStrategy.id === 'extractive' &&
                  'Extractive compression analyzes sentences as units and extracts the most important ones based on keyword density and position. Works well for natural language and conversational content.'}
                {activeStrategy.id === 'adaptive' &&
                  'Adaptive compression analyzes your content type and automatically selects the best compression strategy. It detects code, structured data, and conversational patterns to optimize results.'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Use Cases Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 space-y-6"
        >
          <h2 className="text-2xl font-bold text-foreground">When to use compression</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Reduce API Costs',
                description: 'Lower token usage means fewer API costs. Compress prompts to fit more context at lower prices.',
                icon: TrendingDown,
                color: 'green',
              },
              {
                title: 'Extend Context Window',
                description: 'Fit more information into limited context windows by removing redundant content.',
                icon: FileText,
                color: 'blue',
              },
              {
                title: 'Improve Response Time',
                description: 'Smaller prompts process faster, reducing latency and improving user experience.',
                icon: Clock,
                color: 'purple',
              },
            ].map((useCase) => {
              const Icon = useCase.icon
              return (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                    useCase.color === 'green' && 'bg-green-500/10 text-green-600 dark:text-green-400',
                    useCase.color === 'blue' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                    useCase.color === 'purple' && 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {useCase.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Implementation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 p-6 rounded-lg bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-200 dark:border-brand-800"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Ready to implement compression?
              </h3>
              <p className="text-sm text-muted-foreground">
                Check out the API reference for complete implementation details and advanced options.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/reference/packages/token-optimization'}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg shrink-0',
                'bg-brand-600 hover:bg-brand-700 text-white',
                'transition-colors font-semibold',
                'focus:outline-none focus:ring-2 focus:ring-brand-500'
              )}
            >
              View Docs
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
