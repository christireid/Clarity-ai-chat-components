'use client'

/**
 * Skeleton Loaders for Tool Components
 *
 * Beautiful animated loading states that replace tool components
 * while data is being fetched.
 */

import { motion } from 'framer-motion'

// Base shimmer animation
const shimmer = {
  hidden: { opacity: 0.3 },
  visible: {
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: 'reverse' as const,
      duration: 1,
    },
  },
}

function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      variants={shimmer}
      initial="hidden"
      animate="visible"
      className={`bg-gray-200 dark:bg-gray-700 rounded ${className || ''}`}
    />
  )
}

export function TickerSearchSkeleton() {
  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-500/30 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-blue-200/50 dark:border-blue-500/20 bg-white/50 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-3 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-12 h-4" />
              </div>
              <Skeleton className="w-32 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StockAnalysisSkeleton() {
  return (
    <div className="rounded-xl border border-purple-200 dark:border-purple-500/30 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 bg-gradient-to-r from-purple-400 to-pink-400">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-16 h-7 bg-white/30" />
              <Skeleton className="w-20 h-5 rounded-full bg-white/30" />
            </div>
            <Skeleton className="w-32 h-4 bg-white/30" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="w-24 h-8 bg-white/30" />
            <Skeleton className="w-20 h-4 bg-white/30" />
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <Skeleton className="w-32 h-10 bg-white/30" />
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-white/5">
              <Skeleton className="w-8 h-8 rounded-md" />
              <div className="space-y-1">
                <Skeleton className="w-12 h-2" />
                <Skeleton className="w-16 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* 52-Week Range */}
        <div className="mt-4 p-3 rounded-lg bg-white/50 dark:bg-white/5">
          <Skeleton className="w-20 h-2 mb-2" />
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex justify-between mt-1">
            <Skeleton className="w-12 h-3" />
            <Skeleton className="w-12 h-3" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex gap-2">
        <Skeleton className="flex-1 h-10 rounded-lg" />
        <Skeleton className="flex-1 h-10 rounded-lg" />
        <Skeleton className="flex-1 h-10 rounded-lg" />
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-green-200 dark:border-green-500/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-green-200/50 dark:border-green-500/20 bg-white/50 dark:bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Skeleton className="w-16 h-5" />
                <Skeleton className="w-24 h-4" />
              </div>
              <Skeleton className="w-32 h-4" />
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="w-8 h-7 rounded-md" />
            ))}
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4">
        <div className="relative h-[220px]">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-10 h-3" />
            ))}
          </div>
          {/* Chart placeholder */}
          <div className="ml-14 h-full flex items-end">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-[60%] bg-gradient-to-t from-green-200/50 to-transparent dark:from-green-500/20 rounded-t-lg"
            />
          </div>
          {/* X-axis labels */}
          <div className="ml-14 flex justify-between mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-10 h-3" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-green-500/5 border-t border-green-200/50 dark:border-green-500/20 flex justify-between">
        <Skeleton className="w-32 h-3" />
        <Skeleton className="w-20 h-3" />
      </div>
    </div>
  )
}

export function TradeSkeleton() {
  return (
    <div className="rounded-xl border-2 border-amber-300 dark:border-amber-500/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-400 to-orange-400">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded bg-white/30" />
          <Skeleton className="w-40 h-5 bg-white/30" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-center mb-4">
          <Skeleton className="w-32 h-10 rounded-full" />
        </div>

        <div className="space-y-3 mb-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-amber-200/50 dark:border-amber-500/20">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
          ))}
          <div className="flex justify-between items-center py-3 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg px-3">
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-28 h-6" />
          </div>
        </div>

        <Skeleton className="w-full h-16 rounded-lg mb-5" />

        <div className="flex gap-3">
          <Skeleton className="flex-1 h-12 rounded-lg" />
          <Skeleton className="flex-1 h-12 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Generic tool skeleton based on tool name
export function ToolSkeleton({ toolName }: { toolName: string }) {
  switch (toolName) {
    case 'search_ticker':
      return <TickerSearchSkeleton />
    case 'get_financials':
      return <StockAnalysisSkeleton />
    case 'render_chart':
      return <ChartSkeleton />
    case 'execute_trade':
      return <TradeSkeleton />
    default:
      return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-32 h-3" />
            </div>
          </div>
          <Skeleton className="w-full h-20 rounded-lg" />
        </div>
      )
  }
}
