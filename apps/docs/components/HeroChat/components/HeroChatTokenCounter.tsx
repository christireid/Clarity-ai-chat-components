'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useState, useMemo } from 'react'

interface TokenUsage {
  prompt: number
  completion: number
  total: number
}

interface HeroChatTokenCounterProps {
  tokenUsage: TokenUsage
  estimatedCost: number
  isStreaming?: boolean
}

export function HeroChatTokenCounter({
  tokenUsage,
  estimatedCost,
  isStreaming = false,
}: HeroChatTokenCounterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
  }

  const formatCost = (cost: number) => {
    if (cost < 0.01) return '<$0.01'
    return `$${cost.toFixed(4)}`
  }

  // Calculate percentage breakdown
  const percentages = useMemo(() => {
    if (tokenUsage.total === 0) return { prompt: 0, completion: 0 }
    return {
      prompt: (tokenUsage.prompt / tokenUsage.total) * 100,
      completion: (tokenUsage.completion / tokenUsage.total) * 100,
    }
  }, [tokenUsage])

  // Show nothing if no tokens used
  if (tokenUsage.total === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-24 right-4 z-10"
    >
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Collapsed view - just the total */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 w-full hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          aria-expanded={isExpanded}
          aria-label="Toggle token usage details"
        >
          <div className="flex items-center gap-1.5">
            <Zap
              className={`w-4 h-4 ${isStreaming ? 'text-amber-500 animate-pulse' : 'text-indigo-500'}`}
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {formatNumber(tokenUsage.total)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              tokens
            </span>
          </div>
          <span className="text-xs text-slate-400 mx-1">•</span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            {formatCost(estimatedCost)}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400 ml-1" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          )}
        </button>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: durations.normal }}
              className="border-t border-slate-200 dark:border-slate-700"
            >
              <div className="p-3 space-y-3">
                {/* Token breakdown */}
                <div className="space-y-2">
                  {/* Input tokens */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        Input
                      </span>
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {formatNumber(tokenUsage.prompt)}
                    </span>
                  </div>

                  {/* Output tokens */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        Output
                      </span>
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {formatNumber(tokenUsage.completion)}
                    </span>
                  </div>
                </div>

                {/* Visual breakdown bar */}
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentages.prompt}%` }}
                    transition={{ duration: durations.moderate }}
                  />
                  <motion.div
                    className="h-full bg-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentages.completion}%` }}
                    transition={{ duration: durations.moderate, delay: 0.1 }}
                  />
                </div>

                {/* Cost breakdown */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <DollarSign className="w-4 h-4" />
                      <span>Estimated Cost</span>
                    </div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCost(estimatedCost)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Based on Gemini 1.5 Flash pricing
                  </p>
                </div>

                {/* Streaming indicator */}
                {isStreaming && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400"
                  >
                    <TrendingUp className="w-3 h-3 animate-pulse" />
                    <span>Tokens updating...</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
