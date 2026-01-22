'use client'

import { motion } from 'framer-motion'
import { TrendingUp, ChevronDown, Activity } from 'lucide-react'
import { useMemo } from 'react'
import { durations } from '@/lib/animations'

interface DataPoint {
  date: string
  price: number
}

interface StockChartProps {
  symbol: string
  companyName: string
  currentPrice: number
  changePercent: number
  changeAmount?: number
  marketCap?: string
  volume?: string
  dataPoints?: DataPoint[]
}

export function StockChart({
  symbol,
  companyName,
  currentPrice,
  changePercent,
  changeAmount,
  marketCap,
  volume,
  dataPoints = [],
}: StockChartProps) {
  const isPositive = changePercent >= 0
  const accentColor = isPositive ? 'emerald' : 'red'

  // Generate SVG path for the chart
  const { path, areaPath, minPrice, maxPrice } = useMemo(() => {
    if (dataPoints.length < 2) {
      return { path: '', areaPath: '', minPrice: 0, maxPrice: 0 }
    }

    const prices = dataPoints.map((d) => d.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const range = max - min || 1
    const padding = range * 0.1

    const width = 280
    const height = 100
    const paddedMin = min - padding
    const paddedMax = max + padding
    const paddedRange = paddedMax - paddedMin

    const points = dataPoints.map((d, i) => {
      const x = (i / (dataPoints.length - 1)) * width
      const y = height - ((d.price - paddedMin) / paddedRange) * height
      return { x, y }
    })

    const pathD = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ')
    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`

    return { path: pathD, areaPath: areaD, minPrice: min, maxPrice: max }
  }, [dataPoints])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {symbol}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  isPositive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                ) : (
                  <ChevronDown className="w-3 h-3 inline mr-1" />
                )}
                {isPositive ? '+' : ''}
                {changePercent.toFixed(2)}%
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {companyName}
            </p>
          </div>
          <Activity className="w-5 h-5 text-slate-400" />
        </div>

        {/* Price */}
        <div className="mt-4">
          <motion.div
            className="flex items-baseline gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-4xl font-bold text-slate-900 dark:text-white">
              ${currentPrice.toFixed(2)}
            </span>
            {changeAmount !== undefined && (
              <span
                className={`text-sm font-medium ${
                  isPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {isPositive ? '+' : ''}${changeAmount.toFixed(2)}
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Chart */}
      {dataPoints.length > 1 && (
        <div className="p-4">
          <svg viewBox="0 0 280 100" className="w-full h-24">
            <defs>
              <linearGradient
                id={`gradient-${symbol}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={isPositive ? '#10b981' : '#ef4444'}
                  stopOpacity="0.3"
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? '#10b981' : '#ef4444'}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <motion.path
              d={areaPath}
              fill={`url(#gradient-${symbol})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: durations.slow }}
            />

            {/* Line */}
            <motion.path
              d={path}
              fill="none"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                delay: 0.3,
                duration: durations.slower,
                ease: 'easeOut',
              }}
            />

            {/* Current price dot */}
            <motion.circle
              cx="280"
              cy={
                100 -
                ((currentPrice - minPrice) / (maxPrice - minPrice || 1)) * 100
              }
              r="4"
              fill={isPositive ? '#10b981' : '#ef4444'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 }}
            />
          </svg>

          {/* Time labels */}
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>30d ago</span>
            <span>Today</span>
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 grid grid-cols-2 gap-4">
        {marketCap && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Market Cap
            </p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              ${marketCap}
            </p>
          </motion.div>
        )}
        {volume && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">Volume</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {volume}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
