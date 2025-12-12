'use client'

/**
 * InteractiveStockChart Component
 *
 * Full interactive SVG-based stock chart with animations,
 * tooltips, and timeframe controls.
 */

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react'
import type { ChartData, ChartDataPoint } from '../../lib/types'

interface InteractiveStockChartProps {
  data: ChartData
  height?: number
  onTimeframeChange?: (timeframe: string) => void
}

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '1Y', '5Y']

function formatPrice(price: number): string {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(timestamp: string, timeframe: string): string {
  const date = new Date(timestamp)
  if (timeframe === '1D') {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  if (timeframe === '1W' || timeframe === '1M') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function formatVolume(volume: number): string {
  if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(1)}B`
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`
  return volume.toString()
}

export function InteractiveStockChart({
  data,
  height = 300,
  onTimeframeChange,
}: InteractiveStockChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState(data.timeframe)

  const isPositive = data.changePercent >= 0
  const primaryColor = isPositive ? '#22c55e' : '#ef4444'
  const gradientId = `chart-gradient-${data.symbol}`

  // Chart dimensions
  const width = 600
  const chartHeight = height - 80
  const padding = { top: 20, right: 20, bottom: 30, left: 60 }
  const chartWidth = width - padding.left - padding.right
  const chartInnerHeight = chartHeight - padding.top - padding.bottom

  // Calculate scales
  const { minPrice, maxPrice, points, areaPath, linePath } = useMemo(() => {
    const prices = data.dataPoints.map((d) => d.close)
    const min = Math.min(...prices) * 0.998
    const max = Math.max(...prices) * 1.002
    const range = max - min

    const pts = data.dataPoints.map((point, i) => {
      const x = padding.left + (i / (data.dataPoints.length - 1)) * chartWidth
      const y = padding.top + (1 - (point.close - min) / range) * chartInnerHeight
      return { x, y, data: point }
    })

    const linePathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    const areaPathD = `${linePathD} L ${pts[pts.length - 1].x} ${chartHeight - padding.bottom} L ${pts[0].x} ${chartHeight - padding.bottom} Z`

    return {
      minPrice: min,
      maxPrice: max,
      points: pts,
      linePath: linePathD,
      areaPath: areaPathD,
    }
  }, [data.dataPoints, chartWidth, chartInnerHeight, chartHeight, padding])

  // Y-axis labels
  const yLabels = useMemo(() => {
    const labels = []
    const step = (maxPrice - minPrice) / 4
    for (let i = 0; i <= 4; i++) {
      const value = minPrice + step * i
      const y = padding.top + (1 - i / 4) * chartInnerHeight
      labels.push({ value, y })
    }
    return labels
  }, [minPrice, maxPrice, chartInnerHeight, padding.top])

  // X-axis labels
  const xLabels = useMemo(() => {
    const labels = []
    const step = Math.floor(data.dataPoints.length / 5)
    for (let i = 0; i < data.dataPoints.length; i += step) {
      const x = padding.left + (i / (data.dataPoints.length - 1)) * chartWidth
      labels.push({ date: data.dataPoints[i].timestamp, x })
    }
    return labels
  }, [data.dataPoints, chartWidth, padding.left])

  const handleTimeframeClick = useCallback(
    (tf: string) => {
      setSelectedTimeframe(tf)
      onTimeframeChange?.(tf)
    },
    [onTimeframeChange]
  )

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="rounded-xl border border-green-200 dark:border-green-500/30
                 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50
                 overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-green-200/50 dark:border-green-500/20 bg-white/50 dark:bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-foreground">{data.symbol}</span>
                <span className="text-sm text-muted-foreground">{data.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{formatPrice(data.currentPrice)}</span>
                <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isPositive ? '+' : ''}
                  {data.change.toFixed(2)} ({isPositive ? '+' : ''}
                  {data.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 rounded-lg p-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => handleTimeframeClick(tf)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  selectedTimeframe === tf
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="p-4">
        <div className="relative">
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${width} ${chartHeight}`}
            preserveAspectRatio="xMidYMid meet"
            className="overflow-visible"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {yLabels.map((label, i) => (
              <line
                key={i}
                x1={padding.left}
                y1={label.y}
                x2={width - padding.right}
                y2={label.y}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Y-axis Labels */}
            {yLabels.map((label, i) => (
              <text
                key={i}
                x={padding.left - 10}
                y={label.y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {formatPrice(label.value)}
              </text>
            ))}

            {/* X-axis Labels */}
            {xLabels.map((label, i) => (
              <text
                key={i}
                x={label.x}
                y={chartHeight - 10}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {formatDate(label.date, data.timeframe)}
              </text>
            ))}

            {/* Area Fill */}
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              d={areaPath}
              fill={`url(#${gradientId})`}
            />

            {/* Line */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
              d={linePath}
              fill="none"
              stroke={primaryColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Invisible hover areas */}
            {points.map((point, i) => (
              <rect
                key={i}
                x={point.x - chartWidth / points.length / 2}
                y={padding.top}
                width={chartWidth / points.length}
                height={chartInnerHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
              />
            ))}

            {/* Hover indicator */}
            <AnimatePresence>
              {hoveredPoint && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Vertical line */}
                  <line
                    x1={hoveredPoint.x}
                    y1={padding.top}
                    x2={hoveredPoint.x}
                    y2={chartHeight - padding.bottom}
                    stroke={primaryColor}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />
                  {/* Dot */}
                  <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="6" fill={primaryColor} />
                  <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="3" fill="white" />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredPoint && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 pointer-events-none z-10"
                style={{
                  left: Math.min(hoveredPoint.x, width - 150),
                  top: hoveredPoint.y - 70,
                }}
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {formatDate(hoveredPoint.data.timestamp, data.timeframe)}
                </div>
                <div className="text-sm font-semibold">{formatPrice(hoveredPoint.data.close)}</div>
                <div className="text-[10px] text-muted-foreground">
                  Vol: {formatVolume(hoveredPoint.data.volume)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-green-500/5 border-t border-green-200/50 dark:border-green-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {data.chartType.charAt(0).toUpperCase() + data.chartType.slice(1)} Chart
        </div>
      </div>
    </motion.div>
  )
}

InteractiveStockChart.displayName = 'InteractiveStockChart'
