'use client'

/**
 * InteractiveStockChart Component
 *
 * Full interactive SVG-based stock chart with candlesticks,
 * multiple chart types, technical indicators, and mobile support.
 */

import { useState, useMemo, useCallback, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  ChevronDown,
  Activity,
  Clock,
  BarChart2,
  LineChart,
  BarChart3,
  Minus,
} from 'lucide-react'
import type { ChartData, ChartDataPoint } from '../../lib/types'

interface InteractiveStockChartProps {
  data: ChartData
  height?: number
  onTimeframeChange?: (timeframe: string) => void
}

type ChartType = 'line' | 'candlestick' | 'area'

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '1Y', '5Y']
const CHART_TYPES: {
  type: ChartType
  icon: React.ElementType
  label: string
}[] = [
  { type: 'line', icon: LineChart, label: 'Line' },
  { type: 'candlestick', icon: BarChart3, label: 'Candlestick' },
  { type: 'area', icon: BarChart2, label: 'Area' },
]

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
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
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

// Calculate Simple Moving Average
function calculateSMA(data: ChartDataPoint[], period: number): number[] {
  const result: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN)
    } else {
      let sum = 0
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close
      }
      result.push(sum / period)
    }
  }
  return result
}

// Calculate RSI
function calculateRSI(data: ChartDataPoint[], period: number = 14): number[] {
  const result: number[] = []
  const gains: number[] = []
  const losses: number[] = []

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push(NaN)
      continue
    }
    const change = data[i].close - data[i - 1].close
    gains.push(change > 0 ? change : 0)
    losses.push(change < 0 ? Math.abs(change) : 0)

    if (i < period) {
      result.push(NaN)
      continue
    }

    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period

    if (avgLoss === 0) {
      result.push(100)
    } else {
      const rs = avgGain / avgLoss
      result.push(100 - 100 / (1 + rs))
    }
  }
  return result
}

export const InteractiveStockChart = memo(function InteractiveStockChart({
  data,
  height = 350,
  onTimeframeChange,
}: InteractiveStockChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState(data.timeframe)
  const [chartType, setChartType] = useState<ChartType>('candlestick')
  const [showSMA20, setShowSMA20] = useState(true)
  const [showSMA50, setShowSMA50] = useState(false)
  const [showVolume, setShowVolume] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isPositive = data.changePercent >= 0
  const primaryColor = isPositive ? '#22c55e' : '#ef4444'
  const gradientId = `chart-gradient-${data.symbol}`

  // Chart dimensions - responsive
  const width = isMobile ? 400 : 600
  const chartHeight = height - (isMobile ? 100 : 80)
  const volumeHeight = showVolume ? 50 : 0
  const padding = {
    top: 20,
    right: isMobile ? 10 : 20,
    bottom: 30 + volumeHeight,
    left: isMobile ? 45 : 60,
  }
  const chartWidth = width - padding.left - padding.right
  const chartInnerHeight =
    chartHeight - padding.top - padding.bottom - volumeHeight

  // Calculate SMA indicators
  const sma20 = useMemo(
    () => calculateSMA(data.dataPoints, 20),
    [data.dataPoints]
  )
  const sma50 = useMemo(
    () => calculateSMA(data.dataPoints, 50),
    [data.dataPoints]
  )

  // Calculate scales
  const {
    minPrice,
    maxPrice,
    maxVolume,
    points,
    sma20Points,
    sma50Points,
    areaPath,
    linePath,
  } = useMemo(() => {
    const prices = data.dataPoints.flatMap((d) => [d.high, d.low])
    const min = Math.min(...prices) * 0.998
    const max = Math.max(...prices) * 1.002
    const range = max - min

    const volumes = data.dataPoints.map((d) => d.volume)
    const maxVol = Math.max(...volumes)

    const pts = data.dataPoints.map((point, i) => {
      const x = padding.left + (i / (data.dataPoints.length - 1)) * chartWidth
      const y =
        padding.top + (1 - (point.close - min) / range) * chartInnerHeight
      const yOpen =
        padding.top + (1 - (point.open - min) / range) * chartInnerHeight
      const yHigh =
        padding.top + (1 - (point.high - min) / range) * chartInnerHeight
      const yLow =
        padding.top + (1 - (point.low - min) / range) * chartInnerHeight
      const volumeY =
        chartHeight -
        padding.bottom +
        5 +
        (1 - point.volume / maxVol) * (volumeHeight - 10)
      const volumeBarHeight = (point.volume / maxVol) * (volumeHeight - 10)
      return { x, y, yOpen, yHigh, yLow, volumeY, volumeBarHeight, data: point }
    })

    const sma20Pts = sma20.map((value, i) => {
      if (isNaN(value)) return null
      const x = padding.left + (i / (data.dataPoints.length - 1)) * chartWidth
      const y = padding.top + (1 - (value - min) / range) * chartInnerHeight
      return { x, y }
    })

    const sma50Pts = sma50.map((value, i) => {
      if (isNaN(value)) return null
      const x = padding.left + (i / (data.dataPoints.length - 1)) * chartWidth
      const y = padding.top + (1 - (value - min) / range) * chartInnerHeight
      return { x, y }
    })

    const linePathD = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ')

    const areaPathD = `${linePathD} L ${pts[pts.length - 1].x} ${chartHeight - padding.bottom - volumeHeight} L ${pts[0].x} ${chartHeight - padding.bottom - volumeHeight} Z`

    return {
      minPrice: min,
      maxPrice: max,
      maxVolume: maxVol,
      points: pts,
      sma20Points: sma20Pts,
      sma50Points: sma50Pts,
      linePath: linePathD,
      areaPath: areaPathD,
    }
  }, [
    data.dataPoints,
    chartWidth,
    chartInnerHeight,
    chartHeight,
    padding,
    volumeHeight,
    sma20,
    sma50,
  ])

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
    const step = Math.floor(data.dataPoints.length / (isMobile ? 3 : 5))
    for (let i = 0; i < data.dataPoints.length; i += step) {
      const x = padding.left + (i / (data.dataPoints.length - 1)) * chartWidth
      labels.push({ date: data.dataPoints[i].timestamp, x })
    }
    return labels
  }, [data.dataPoints, chartWidth, padding.left, isMobile])

  const handleTimeframeClick = useCallback(
    (tf: string) => {
      setSelectedTimeframe(tf)
      onTimeframeChange?.(tf)
    },
    [onTimeframeChange]
  )

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null

  // Candlestick bar width
  const candleWidth = Math.max(
    3,
    Math.min(12, chartWidth / data.dataPoints.length - 2)
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="rounded-xl border border-green-200 dark:border-green-500/30
                 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50
                 overflow-hidden shadow-sm"
      role="img"
      aria-label={`Stock chart for ${data.symbol}. Current price ${formatPrice(data.currentPrice)}, ${isPositive ? 'up' : 'down'} ${Math.abs(data.changePercent).toFixed(2)}%`}
    >
      {/* Header */}
      <div className="px-3 sm:px-4 py-3 border-b border-green-200/50 dark:border-green-500/20 bg-white/50 dark:bg-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-sm"
              aria-hidden="true"
            >
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  {data.symbol}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                  {data.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-semibold">
                  {formatPrice(data.currentPrice)}
                </span>
                <span
                  className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-3 h-3" aria-hidden="true" />
                  )}
                  {isPositive ? '+' : ''}
                  {data.change.toFixed(2)} ({isPositive ? '+' : ''}
                  {data.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Chart Type Selector */}
            <div
              className="flex items-center gap-0.5 bg-green-100 dark:bg-green-900/30 rounded-lg p-0.5"
              role="group"
              aria-label="Chart type"
            >
              {CHART_TYPES.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`p-1.5 sm:p-2 rounded-md transition-all ${
                    chartType === type
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50'
                  }`}
                  aria-label={label}
                  aria-pressed={chartType === type}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              ))}
            </div>

            {/* Timeframe Selector */}
            <div
              className="flex items-center gap-0.5 bg-green-100 dark:bg-green-900/30 rounded-lg p-0.5 overflow-x-auto"
              role="group"
              aria-label="Timeframe"
            >
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => handleTimeframeClick(tf)}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                    selectedTimeframe === tf
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50'
                  }`}
                  aria-pressed={selectedTimeframe === tf}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Indicator toggles */}
        <div className="mt-2 flex items-center gap-3 text-[10px] sm:text-xs flex-wrap">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showSMA20}
              onChange={(e) => setShowSMA20(e.target.checked)}
              className="w-3 h-3 rounded accent-blue-500"
            />
            <span className="text-blue-600 dark:text-blue-400">SMA 20</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showSMA50}
              onChange={(e) => setShowSMA50(e.target.checked)}
              className="w-3 h-3 rounded accent-orange-500"
            />
            <span className="text-orange-600 dark:text-orange-400">SMA 50</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showVolume}
              onChange={(e) => setShowVolume(e.target.checked)}
              className="w-3 h-3 rounded accent-purple-500"
            />
            <span className="text-purple-600 dark:text-purple-400">Volume</span>
          </label>
        </div>
      </div>

      {/* Chart Container */}
      <div className="p-2 sm:p-4">
        <div className="relative">
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${width} ${chartHeight}`}
            preserveAspectRatio="xMidYMid meet"
            className="overflow-visible touch-none"
            onMouseLeave={() => setHoveredIndex(null)}
            onTouchEnd={() => setHoveredIndex(null)}
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
                x={padding.left - 5}
                y={label.y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-muted-foreground"
                fontSize={isMobile ? 8 : 10}
              >
                ${label.value.toFixed(0)}
              </text>
            ))}

            {/* X-axis Labels */}
            {xLabels.map((label, i) => (
              <text
                key={i}
                x={label.x}
                y={chartHeight - volumeHeight - 10}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={isMobile ? 8 : 10}
              >
                {formatDate(label.date, data.timeframe)}
              </text>
            ))}

            {/* Area Fill (for area chart type) */}
            {chartType === 'area' && (
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: durations.slow }}
                d={areaPath}
                fill={`url(#${gradientId})`}
              />
            )}

            {/* Line Chart */}
            {(chartType === 'line' || chartType === 'area') && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  delay: 0.2,
                  duration: durations.slower,
                  ease: 'easeOut',
                }}
                d={linePath}
                fill="none"
                stroke={primaryColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Candlestick Chart */}
            {chartType === 'candlestick' &&
              points.map((point, i) => {
                const isBullish = point.data.close >= point.data.open
                const candleColor = isBullish ? '#22c55e' : '#ef4444'
                return (
                  <g key={i}>
                    {/* Wick */}
                    <line
                      x1={point.x}
                      y1={point.yHigh}
                      x2={point.x}
                      y2={point.yLow}
                      stroke={candleColor}
                      strokeWidth="1"
                    />
                    {/* Body */}
                    <rect
                      x={point.x - candleWidth / 2}
                      y={Math.min(point.y, point.yOpen)}
                      width={candleWidth}
                      height={Math.max(1, Math.abs(point.y - point.yOpen))}
                      fill={isBullish ? candleColor : candleColor}
                      stroke={candleColor}
                      strokeWidth="1"
                      rx="1"
                    />
                  </g>
                )
              })}

            {/* SMA 20 Line */}
            {showSMA20 && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: durations.slower }}
                d={
                  sma20Points
                    .filter((p) => p !== null)
                    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p!.x} ${p!.y}`)
                    .join(' ') || ''
                }
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.8"
              />
            )}

            {/* SMA 50 Line */}
            {showSMA50 && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: durations.slower }}
                d={
                  sma50Points
                    .filter((p) => p !== null)
                    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p!.x} ${p!.y}`)
                    .join(' ') || ''
                }
                fill="none"
                stroke="#f97316"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.8"
              />
            )}

            {/* Volume Bars */}
            {showVolume &&
              points.map((point, i) => {
                const isBullish = point.data.close >= point.data.open
                return (
                  <rect
                    key={`vol-${i}`}
                    x={point.x - candleWidth / 2}
                    y={
                      chartHeight -
                      padding.bottom +
                      5 +
                      (volumeHeight - 10 - point.volumeBarHeight)
                    }
                    width={candleWidth}
                    height={point.volumeBarHeight}
                    fill={isBullish ? '#22c55e' : '#ef4444'}
                    opacity="0.3"
                    rx="1"
                  />
                )
              })}

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
                onTouchStart={() => setHoveredIndex(i)}
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
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="6"
                    fill={primaryColor}
                  />
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="3"
                    fill="white"
                  />
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
                className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 pointer-events-none z-10 text-xs sm:text-sm"
                style={{
                  left:
                    Math.min(Math.max(10, (hoveredPoint.x / width) * 100), 70) +
                    '%',
                  top: Math.max(10, hoveredPoint.y - 90),
                }}
              >
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">
                  {formatDate(hoveredPoint.data.timestamp, data.timeframe)}
                </div>
                {chartType === 'candlestick' ? (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] sm:text-xs">
                    <span className="text-muted-foreground">O:</span>
                    <span className="font-medium">
                      {formatPrice(hoveredPoint.data.open)}
                    </span>
                    <span className="text-muted-foreground">H:</span>
                    <span className="font-medium">
                      {formatPrice(hoveredPoint.data.high)}
                    </span>
                    <span className="text-muted-foreground">L:</span>
                    <span className="font-medium">
                      {formatPrice(hoveredPoint.data.low)}
                    </span>
                    <span className="text-muted-foreground">C:</span>
                    <span className="font-medium">
                      {formatPrice(hoveredPoint.data.close)}
                    </span>
                  </div>
                ) : (
                  <div className="font-semibold">
                    {formatPrice(hoveredPoint.data.close)}
                  </div>
                )}
                <div className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">
                  Vol: {formatVolume(hoveredPoint.data.volume)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 sm:px-4 py-2 bg-green-500/5 border-t border-green-200/50 dark:border-green-500/20 flex items-center justify-between text-[10px] sm:text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-3 h-3" aria-hidden="true" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          {showSMA20 && (
            <span className="flex items-center gap-1">
              <Minus className="w-3 h-3 text-blue-500" />
              SMA20
            </span>
          )}
          {showSMA50 && (
            <span className="flex items-center gap-1">
              <Minus className="w-3 h-3 text-orange-500" />
              SMA50
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
})
