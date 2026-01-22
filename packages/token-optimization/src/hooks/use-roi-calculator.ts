/**
 * useROICalculator Hook
 *
 * React hooks for tracking ROI from token optimization.
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  ROICalculator,
  calculateQuickROI,
  estimateMonthlySavings,
  compareModels,
  calculateBreakEven,
  type UsageStats,
  type ROIResult,
  type ROIPeriod,
  type ModelPricing,
} from '../roi'

/**
 * ROI calculator hook configuration
 */
export interface UseROICalculatorConfig {
  /** Model name or custom pricing */
  model: string | ModelPricing
  /** Implementation cost (one-time) */
  implementationCost?: number
  /** Auto-track periods */
  autoTrack?: boolean
  /** Track interval (ms) */
  trackInterval?: number
}

/**
 * ROI calculator state
 */
export interface ROICalculatorState {
  /** Current period usage */
  currentUsage: UsageStats
  /** All tracked periods */
  periods: ROIPeriod[]
  /** Total ROI across all periods */
  totalROI: ROIResult | null
  /** Is tracking */
  isTracking: boolean
}

/**
 * Main ROI calculator hook
 *
 * Track and calculate ROI from token optimization.
 *
 * @example
 * ```tsx
 * function ROIDashboard() {
 *   const {
 *     trackUsage,
 *     currentROI,
 *     totalROI,
 *     periods,
 *   } = useROICalculator({
 *     model: 'gpt-4o',
 *     implementationCost: 1000,
 *   })
 *
 *   const handleRequest = (tokens: number) => {
 *     trackUsage({
 *       inputTokensBaseline: tokens,
 *       inputTokensOptimized: tokens * 0.3,
 *       cachedInputTokens: tokens * 0.24,
 *       outputTokens: tokens * 0.5,
 *     })
 *   }
 *
 *   return (
 *     <div>
 *       <h3>Savings: ${currentROI?.totalSavings.toFixed(2)}</h3>
 *       <p>ROI: {currentROI?.roi.toFixed(1)}x</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useROICalculator(config: UseROICalculatorConfig) {
  const [state, setState] = useState<ROICalculatorState>({
    currentUsage: {
      inputTokensBaseline: 0,
      outputTokens: 0,
      inputTokensOptimized: 0,
      cachedInputTokens: 0,
      requestCount: 0,
      imageCount: 0,
      functionCallCount: 0,
    },
    periods: [],
    totalROI: null,
    isTracking: false,
  })

  const calculatorRef = useRef<ROICalculator>()
  const periodStartRef = useRef<Date>(new Date())

  // Initialize calculator
  useEffect(() => {
    calculatorRef.current = new ROICalculator(
      config.model,
      config.implementationCost
    )
  }, [config.model, config.implementationCost])

  /**
   * Track usage
   */
  const trackUsage = useCallback(
    (usage: Partial<UsageStats>) => {
      setState((prev) => {
        const newUsage = {
          inputTokensBaseline:
            prev.currentUsage.inputTokensBaseline +
            (usage.inputTokensBaseline || 0),
          outputTokens: prev.currentUsage.outputTokens + (usage.outputTokens || 0),
          inputTokensOptimized:
            prev.currentUsage.inputTokensOptimized +
            (usage.inputTokensOptimized || 0),
          cachedInputTokens:
            prev.currentUsage.cachedInputTokens + (usage.cachedInputTokens || 0),
          requestCount: prev.currentUsage.requestCount + (usage.requestCount || 1),
          imageCount: prev.currentUsage.imageCount + (usage.imageCount || 0),
          functionCallCount:
            prev.currentUsage.functionCallCount + (usage.functionCallCount || 0),
        }

        return {
          ...prev,
          currentUsage: newUsage,
        }
      })
    },
    []
  )

  /**
   * Complete current period and start new one
   */
  const completePeriod = useCallback(() => {
    if (!calculatorRef.current) return

    const endDate = new Date()
    const period = calculatorRef.current.trackPeriod(
      periodStartRef.current,
      endDate,
      state.currentUsage
    )

    setState((prev) => ({
      currentUsage: {
        inputTokensBaseline: 0,
        outputTokens: 0,
        inputTokensOptimized: 0,
        cachedInputTokens: 0,
        requestCount: 0,
        imageCount: 0,
        functionCallCount: 0,
      },
      periods: [...prev.periods, period],
      totalROI: calculatorRef.current!.getTotalROI(),
      isTracking: prev.isTracking,
    }))

    periodStartRef.current = new Date()

    return period
  }, [state.currentUsage])

  /**
   * Start auto-tracking
   */
  const startTracking = useCallback(() => {
    setState((prev) => ({ ...prev, isTracking: true }))
  }, [])

  /**
   * Stop auto-tracking
   */
  const stopTracking = useCallback(() => {
    setState((prev) => ({ ...prev, isTracking: false }))
  }, [])

  /**
   * Clear all data
   */
  const clear = useCallback(() => {
    calculatorRef.current?.clear()
    setState({
      currentUsage: {
        inputTokensBaseline: 0,
        outputTokens: 0,
        inputTokensOptimized: 0,
        cachedInputTokens: 0,
        requestCount: 0,
        imageCount: 0,
        functionCallCount: 0,
      },
      periods: [],
      totalROI: null,
      isTracking: false,
    })
    periodStartRef.current = new Date()
  }, [])

  /**
   * Get current ROI
   */
  const currentROI = useMemo(() => {
    if (!calculatorRef.current) return null
    if (state.currentUsage.requestCount === 0) return null

    return calculatorRef.current.calculateROI(state.currentUsage)
  }, [state.currentUsage])

  /**
   * Get average daily savings
   */
  const averageDailySavings = useMemo(() => {
    if (!calculatorRef.current) return 0
    return calculatorRef.current.getAverageDailySavings()
  }, [state.periods])

  // Auto-tracking
  useEffect(() => {
    if (!config.autoTrack || !state.isTracking) return

    const interval = setInterval(() => {
      completePeriod()
    }, config.trackInterval || 86400000) // Default: 24 hours

    return () => clearInterval(interval)
  }, [config.autoTrack, state.isTracking, config.trackInterval, completePeriod])

  return {
    trackUsage,
    completePeriod,
    startTracking,
    stopTracking,
    clear,
    currentROI,
    totalROI: state.totalROI,
    periods: state.periods,
    currentUsage: state.currentUsage,
    averageDailySavings,
    isTracking: state.isTracking,
  }
}

/**
 * Quick ROI estimation hook
 *
 * Simple hook for estimating ROI without tracking.
 *
 * @example
 * ```tsx
 * function QuickEstimate() {
 *   const estimate = useQuickROI({
 *     baselineTokens: 10000,
 *     optimizedTokens: 3000,
 *     cachedTokens: 2400,
 *     outputTokens: 5000,
 *     model: 'gpt-4o',
 *   })
 *
 *   return (
 *     <div>
 *       <p>Estimated savings: ${estimate.totalSavings.toFixed(2)}</p>
 *       <p>Savings: {estimate.savingsPercentage.toFixed(1)}%</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useQuickROI(config: {
  baselineTokens: number
  optimizedTokens: number
  cachedTokens: number
  outputTokens: number
  model?: string
}): ROIResult {
  return useMemo(
    () =>
      calculateQuickROI(
        config.baselineTokens,
        config.optimizedTokens,
        config.cachedTokens,
        config.outputTokens,
        config.model
      ),
    [
      config.baselineTokens,
      config.optimizedTokens,
      config.cachedTokens,
      config.outputTokens,
      config.model,
    ]
  )
}

/**
 * Monthly savings estimation hook
 *
 * @example
 * ```tsx
 * function MonthlySavings() {
 *   const estimate = useMonthlySavings({
 *     dailyRequests: 1000,
 *     avgTokensPerRequest: 500,
 *     optimizationPercentage: 70,
 *     cacheHitRate: 0.8,
 *     model: 'gpt-4o',
 *   })
 *
 *   return (
 *     <div>
 *       <h3>Monthly Savings Estimate</h3>
 *       <p>Baseline: ${estimate.baselineMonthlyCost.toFixed(2)}</p>
 *       <p>Optimized: ${estimate.optimizedMonthlyCost.toFixed(2)}</p>
 *       <p>Savings: ${estimate.monthlySavings.toFixed(2)}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useMonthlySavings(config: {
  dailyRequests: number
  avgTokensPerRequest: number
  optimizationPercentage?: number
  cacheHitRate?: number
  model?: string
}) {
  return useMemo(
    () =>
      estimateMonthlySavings(
        config.dailyRequests,
        config.avgTokensPerRequest,
        config.optimizationPercentage,
        config.cacheHitRate,
        config.model
      ),
    [
      config.dailyRequests,
      config.avgTokensPerRequest,
      config.optimizationPercentage,
      config.cacheHitRate,
      config.model,
    ]
  )
}

/**
 * Model comparison hook
 *
 * @example
 * ```tsx
 * function ModelComparison() {
 *   const comparison = useModelComparison({
 *     usage: myUsageStats,
 *     models: ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet'],
 *   })
 *
 *   return (
 *     <table>
 *       {comparison.map(({ model, roi }) => (
 *         <tr key={model}>
 *           <td>{model}</td>
 *           <td>${roi.actualCost.toFixed(4)}</td>
 *           <td>{roi.savingsPercentage.toFixed(1)}%</td>
 *         </tr>
 *       ))}
 *     </table>
 *   )
 * }
 * ```
 */
export function useModelComparison(config: {
  usage: UsageStats
  models: string[]
}) {
  return useMemo(
    () => compareModels(config.usage, config.models),
    [config.usage, config.models]
  )
}

/**
 * Break-even calculation hook
 *
 * @example
 * ```tsx
 * function BreakEvenCalculator() {
 *   const breakEven = useBreakEven({
 *     implementationCost: 5000,
 *     dailyRequests: 10000,
 *     avgTokensPerRequest: 500,
 *     optimizationPercentage: 70,
 *   })
 *
 *   return (
 *     <div>
 *       <h3>Break-Even Analysis</h3>
 *       <p>Days to break even: {breakEven.daysToBreakEven}</p>
 *       <p>Break even date: {breakEven.breakEvenDate.toLocaleDateString()}</p>
 *       <p>Daily savings: ${breakEven.dailySavings.toFixed(2)}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useBreakEven(config: {
  implementationCost: number
  dailyRequests: number
  avgTokensPerRequest: number
  optimizationPercentage?: number
  model?: string
}) {
  return useMemo(
    () =>
      calculateBreakEven(
        config.implementationCost,
        config.dailyRequests,
        config.avgTokensPerRequest,
        config.optimizationPercentage,
        config.model
      ),
    [
      config.implementationCost,
      config.dailyRequests,
      config.avgTokensPerRequest,
      config.optimizationPercentage,
      config.model,
    ]
  )
}

/**
 * ROI dashboard hook
 *
 * Comprehensive hook with all ROI metrics.
 *
 * @example
 * ```tsx
 * function ComprehensiveDashboard() {
 *   const {
 *     currentROI,
 *     monthlySavings,
 *     breakEven,
 *     modelComparison,
 *   } = useROIDashboard({
 *     model: 'gpt-4o',
 *     implementationCost: 5000,
 *     dailyRequests: 10000,
 *     avgTokensPerRequest: 500,
 *   })
 *
 *   return <div>... all metrics ...</div>
 * }
 * ```
 */
export function useROIDashboard(config: {
  model: string
  implementationCost: number
  dailyRequests: number
  avgTokensPerRequest: number
  optimizationPercentage?: number
  cacheHitRate?: number
}) {
  const roi = useROICalculator({
    model: config.model,
    implementationCost: config.implementationCost,
  })

  const monthlySavings = useMonthlySavings({
    dailyRequests: config.dailyRequests,
    avgTokensPerRequest: config.avgTokensPerRequest,
    optimizationPercentage: config.optimizationPercentage,
    cacheHitRate: config.cacheHitRate,
    model: config.model,
  })

  const breakEven = useBreakEven({
    implementationCost: config.implementationCost,
    dailyRequests: config.dailyRequests,
    avgTokensPerRequest: config.avgTokensPerRequest,
    optimizationPercentage: config.optimizationPercentage,
    model: config.model,
  })

  const modelComparison = useModelComparison({
    usage: roi.currentUsage,
    models: ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet', 'claude-3-5-haiku'],
  })

  return {
    ...roi,
    monthlySavings,
    breakEven,
    modelComparison,
  }
}
