'use client'

/**
 * StockAnalysisCard Component
 *
 * Rich financial data card with metrics grid, sparkline chart,
 * and action buttons for further analysis.
 */

import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Activity,
  Target,
  ChevronRight,
} from 'lucide-react'
import type { FinancialData } from '../../lib/types'

interface StockAnalysisCardProps {
  data: FinancialData
  onViewChart?: () => void
  onTrade?: (action: 'buy' | 'sell') => void
}

const ratingColors: Record<string, string> = {
  strong_buy: 'bg-green-500 text-white',
  buy: 'bg-green-400 text-white',
  hold: 'bg-amber-500 text-white',
  sell: 'bg-red-400 text-white',
  strong_sell: 'bg-red-500 text-white',
}

const ratingLabels: Record<string, string> = {
  strong_buy: 'Strong Buy',
  buy: 'Buy',
  hold: 'Hold',
  sell: 'Sell',
  strong_sell: 'Strong Sell',
}

function Sparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const width = 120
  const height = 40
  const padding = 2

  const points = data
    .map((value, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2)
      const y = height - padding - ((value - min) / range) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')

  const gradientId = `sparkline-gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        d={`M ${padding},${height - padding} ${points} ${width - padding},${height - padding} Z`}
        fill={`url(#${gradientId})`}
      />
      {/* Line */}
      <motion.polyline
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
        points={points}
        fill="none"
        stroke={isPositive ? '#22c55e' : '#ef4444'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MetricItem({
  label,
  value,
  icon: Icon,
  delay,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 25 }}
      className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-white/5"
    >
      <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className="text-sm font-semibold text-foreground">{value}</div>
      </div>
    </motion.div>
  )
}

export function StockAnalysisCard({ data, onViewChart, onTrade }: StockAnalysisCardProps) {
  const isPositive = data.change >= 0
  const priceHistoryValues = data.priceHistory.map((p) => p.price)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="rounded-xl border border-purple-200 dark:border-purple-500/30
                 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50
                 overflow-hidden shadow-sm"
    >
      {/* Header with Price */}
      <div className="px-4 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{data.symbol}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${ratingColors[data.analystRating]}`}
              >
                {ratingLabels[data.analystRating]}
              </span>
            </div>
            <div className="text-sm text-white/80">{data.name}</div>
          </div>
          <div className="text-right">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="text-3xl font-bold"
            >
              ${data.currentPrice.toFixed(2)}
            </motion.div>
            <div className={`flex items-center gap-1 justify-end ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">
                {isPositive ? '+' : ''}
                {data.change.toFixed(2)} ({isPositive ? '+' : ''}
                {data.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Sparkline */}
        {priceHistoryValues.length > 0 && (
          <div className="mt-3 flex justify-end">
            <Sparkline data={priceHistoryValues} isPositive={isPositive} />
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <MetricItem
            label="P/E Ratio"
            value={data.metrics.peRatio.toFixed(1)}
            icon={BarChart3}
            delay={0.15}
          />
          <MetricItem label="Market Cap" value={data.metrics.marketCap} icon={DollarSign} delay={0.2} />
          <MetricItem label="Volume" value={data.metrics.volume} icon={Activity} delay={0.25} />
          <MetricItem label="EPS" value={`$${data.metrics.eps.toFixed(2)}`} icon={Target} delay={0.3} />
        </div>

        {/* 52-Week Range */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-4 p-3 rounded-lg bg-white/50 dark:bg-white/5"
        >
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
            52-Week Range
          </div>
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{
                left: '0%',
                width: `${((data.currentPrice - data.metrics.low52Week) / (data.metrics.high52Week - data.metrics.low52Week)) * 100}%`,
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-purple-500 rounded-full shadow"
              style={{
                left: `${((data.currentPrice - data.metrics.low52Week) / (data.metrics.high52Week - data.metrics.low52Week)) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>${data.metrics.low52Week}</span>
            <span>${data.metrics.high52Week}</span>
          </div>
        </motion.div>

        {/* Analyst Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-3 text-xs text-muted-foreground text-center"
        >
          Based on {data.analystCount} analyst ratings
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex gap-2">
        {onViewChart && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            onClick={onViewChart}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                       bg-purple-500 hover:bg-purple-600 text-white rounded-lg
                       font-medium text-sm transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            View Chart
          </motion.button>
        )}
        {onTrade && (
          <>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => onTrade('buy')}
              className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5
                         bg-green-500 hover:bg-green-600 text-white rounded-lg
                         font-medium text-sm transition-colors"
            >
              Buy
              <ChevronRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              onClick={() => onTrade('sell')}
              className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5
                         bg-red-500 hover:bg-red-600 text-white rounded-lg
                         font-medium text-sm transition-colors"
            >
              Sell
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  )
}

StockAnalysisCard.displayName = 'StockAnalysisCard'
