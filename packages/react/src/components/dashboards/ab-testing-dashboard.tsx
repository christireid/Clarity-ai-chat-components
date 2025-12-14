'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  cn,
} from '@clarity-chat/primitives'
import {
  useKeyboardShortcuts,
  useShortcutDisplay,
  KeyboardShortcutsHelp,
  type KeyboardShortcut,
} from '../../hooks/keyboard/use-keyboard-shortcuts'
import { DashboardProgress } from '../ui/dashboard-progress'
import { KeyboardShortcutHint } from '../navigation/keyboard-shortcut-hint'

/**
 * Experiment variant
 */
export interface ExperimentVariant {
  id: string
  name: string
  description?: string
  isControl: boolean
  config?: Record<string, any>
}

/**
 * Variant metrics
 */
export interface VariantMetrics {
  variantId: string
  impressions: number
  conversions: number
  conversionRate: number
  avgEngagementTime: number
  bounceRate: number
  revenue?: number
  users: number
}

/**
 * Statistical significance result
 */
export interface SignificanceTest {
  isSignificant: boolean
  pValue: number
  confidenceLevel: number
  sampleSize: number
  effectSize: number
}

/**
 * Experiment result
 */
export interface ExperimentResult {
  experimentId: string
  experimentName: string
  description?: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  startDate: number
  endDate?: number
  variants: ExperimentVariant[]
  metrics: Map<string, VariantMetrics>
  winner?: string
  significance?: SignificanceTest
  recommendation?: string
}

/**
 * Experiment configuration
 */
export interface ExperimentConfig {
  /** Minimum sample size per variant */
  minSampleSize: number
  /** Confidence level for significance testing (0.9, 0.95, 0.99) */
  confidenceLevel: number
  /** Minimum detectable effect (%) */
  minEffect: number
  /** Traffic allocation (equal, weighted) */
  allocation: 'equal' | 'weighted'
}

/**
 * Props for ABTestingDashboard
 */
export interface ABTestingDashboardProps {
  /** List of experiments */
  experiments: ExperimentResult[]
  /** Configuration */
  config?: Partial<ExperimentConfig>
  /** Callback when experiment is selected */
  onSelectExperiment?: (experiment: ExperimentResult) => void
  /** Callback when winner is declared */
  onDeclareWinner?: (experimentId: string, winnerId: string) => void
  /** Show detailed statistics */
  showStatistics?: boolean
  /** Custom className */
  className?: string
  /** Whether the dashboard is in a loading state */
  isLoading?: boolean
  /** Error to display (renders error state when provided) */
  error?: Error | string | null
  /** Callback when refresh is requested (via 'r' shortcut or button) */
  onRefresh?: () => void
  /** Enable keyboard shortcuts for power users (default: true) */
  enableKeyboardShortcuts?: boolean
}

const defaultConfig: ExperimentConfig = {
  minSampleSize: 100,
  confidenceLevel: 0.95,
  minEffect: 5,
  allocation: 'equal',
}

/**
 * ABTestingDashboard Component
 *
 * Display A/B test results with:
 * - Experiment overview
 * - Variant performance comparison
 * - Statistical significance testing
 * - Winner recommendation
 * - Conversion funnel visualization
 */
export function ABTestingDashboard({
  experiments,
  config: userConfig,
  onSelectExperiment,
  onDeclareWinner,
  showStatistics = true,
  className,
  isLoading = false,
  error = null,
  onRefresh,
  enableKeyboardShortcuts = true,
}: ABTestingDashboardProps) {
  const config = { ...defaultConfig, ...userConfig }

  const [selectedExperiment, setSelectedExperiment] =
    React.useState<ExperimentResult | null>(experiments[0] || null)
  const [sortBy, setSortBy] = React.useState<
    'conversionRate' | 'impressions' | 'engagement'
  >('conversionRate')
  const [showShortcutsHelp, setShowShortcutsHelp] = React.useState(false)
  const getShortcut = useShortcutDisplay()

  // Get current experiment index for navigation
  const currentIndex = React.useMemo(() => {
    if (!selectedExperiment) return -1
    return experiments.findIndex(
      (exp) => exp.experimentId === selectedExperiment.experimentId
    )
  }, [experiments, selectedExperiment])

  // Navigate to next experiment
  const navigateNext = React.useCallback(() => {
    if (experiments.length === 0) return
    const nextIndex =
      currentIndex < experiments.length - 1 ? currentIndex + 1 : 0
    const nextExp = experiments[nextIndex]
    setSelectedExperiment(nextExp)
    onSelectExperiment?.(nextExp)
  }, [experiments, currentIndex, onSelectExperiment])

  // Navigate to previous experiment
  const navigatePrev = React.useCallback(() => {
    if (experiments.length === 0) return
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : experiments.length - 1
    const prevExp = experiments[prevIndex]
    setSelectedExperiment(prevExp)
    onSelectExperiment?.(prevExp)
  }, [experiments, currentIndex, onSelectExperiment])

  // Keyboard shortcuts definition
  const keyboardShortcuts: KeyboardShortcut[] = React.useMemo(
    () => [
      {
        key: 'j',
        callback: navigateNext,
        description: 'Next experiment',
        enabled: enableKeyboardShortcuts && !showShortcutsHelp,
      },
      {
        key: 'arrowdown',
        callback: navigateNext,
        description: 'Next experiment',
        enabled: enableKeyboardShortcuts && !showShortcutsHelp,
      },
      {
        key: 'k',
        callback: navigatePrev,
        description: 'Previous experiment',
        enabled: enableKeyboardShortcuts && !showShortcutsHelp,
      },
      {
        key: 'arrowup',
        callback: navigatePrev,
        description: 'Previous experiment',
        enabled: enableKeyboardShortcuts && !showShortcutsHelp,
      },
      {
        key: 'r',
        callback: () => onRefresh?.(),
        description: 'Refresh data',
        enabled: enableKeyboardShortcuts && !showShortcutsHelp && !!onRefresh,
      },
      {
        key: 'shift+/',
        callback: () => setShowShortcutsHelp(true),
        description: 'Show keyboard shortcuts',
        enabled: enableKeyboardShortcuts && !showShortcutsHelp,
      },
      {
        key: '1',
        callback: () => setSortBy('conversionRate'),
        description: 'Sort by conversion rate',
        enabled: enableKeyboardShortcuts && !showShortcutsHelp,
      },
      {
        key: '2',
        callback: () => setSortBy('impressions'),
        description: 'Sort by impressions',
        enabled: enableKeyboardShortcuts && !showShortcutsHelp,
      },
      {
        key: '3',
        callback: () => setSortBy('engagement'),
        description: 'Sort by engagement',
        enabled: enableKeyboardShortcuts && !showShortcutsHelp,
      },
    ],
    [
      enableKeyboardShortcuts,
      showShortcutsHelp,
      navigateNext,
      navigatePrev,
      onRefresh,
    ]
  )

  // Display shortcuts for help panel (filtered, unique descriptions)
  const displayShortcuts: KeyboardShortcut[] = React.useMemo(
    () => [
      { key: 'j', callback: () => {}, description: 'Next experiment' },
      { key: 'k', callback: () => {}, description: 'Previous experiment' },
      { key: 'r', callback: () => {}, description: 'Refresh data' },
      { key: '1', callback: () => {}, description: 'Sort by conversion rate' },
      { key: '2', callback: () => {}, description: 'Sort by impressions' },
      { key: '3', callback: () => {}, description: 'Sort by engagement' },
      {
        key: 'shift+/',
        callback: () => {},
        description: 'Show keyboard shortcuts',
      },
    ],
    []
  )

  // Register keyboard shortcuts
  useKeyboardShortcuts(keyboardShortcuts)

  // Sync selectedExperiment when experiments prop changes
  React.useEffect(() => {
    // If selected experiment no longer exists in experiments, reset to first
    if (selectedExperiment) {
      const stillExists = experiments.some(
        (exp) => exp.experimentId === selectedExperiment.experimentId
      )
      if (!stillExists) {
        setSelectedExperiment(experiments[0] || null)
      }
    } else if (experiments.length > 0) {
      setSelectedExperiment(experiments[0])
    }
  }, [experiments, selectedExperiment])

  // Calculate statistical significance
  const calculateSignificance = React.useCallback(
    (
      controlMetrics: VariantMetrics,
      variantMetrics: VariantMetrics
    ): SignificanceTest => {
      // Simple z-test for proportions
      const p1 = controlMetrics.conversionRate
      const p2 = variantMetrics.conversionRate
      const n1 = controlMetrics.impressions
      const n2 = variantMetrics.impressions
      const totalSampleSize = n1 + n2

      // Guard against insufficient data - return non-significant result
      if (totalSampleSize === 0 || n1 === 0 || n2 === 0) {
        return {
          isSignificant: false,
          pValue: 1,
          confidenceLevel: config.confidenceLevel,
          sampleSize: totalSampleSize,
          effectSize: 0,
        }
      }

      // Pooled proportion
      const pPool =
        (controlMetrics.conversions + variantMetrics.conversions) /
        totalSampleSize

      // Standard error - guard against pPool being 0 or 1 (causes se=0)
      const seSquared = pPool * (1 - pPool) * (1 / n1 + 1 / n2)
      const se = seSquared > 0 ? Math.sqrt(seSquared) : 0

      // Z-score - guard against se being 0
      const z = se > 0 ? (p2 - p1) / se : 0

      // Two-tailed p-value (approximate)
      const pValue = se > 0 ? 2 * (1 - normalCDF(Math.abs(z))) : 1

      // Effect size (relative improvement) - guard against p1 being 0
      // When control rate is 0, use absolute difference instead
      const effectSize = p1 > 0 ? ((p2 - p1) / p1) * 100 : p2 > 0 ? 100 : 0

      const isSignificant =
        pValue < 1 - config.confidenceLevel &&
        Math.abs(effectSize) >= config.minEffect

      return {
        isSignificant,
        pValue,
        confidenceLevel: config.confidenceLevel,
        sampleSize: totalSampleSize,
        effectSize,
      }
    },
    [config]
  )

  // Normal CDF approximation
  const normalCDF = (x: number): number => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x))
    const d = 0.3989423 * Math.exp((-x * x) / 2)
    const p =
      d *
      t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return x > 0 ? 1 - p : p
  }

  // Get sorted variants for selected experiment
  const getSortedVariants = React.useCallback(
    (experiment: ExperimentResult) => {
      const variants = experiment.variants
        .map((variant) => {
          const metrics = experiment.metrics.get(variant.id)
          return { variant, metrics }
        })
        .filter((v) => v.metrics)

      return variants.sort((a, b) => {
        if (sortBy === 'conversionRate') {
          return b.metrics!.conversionRate - a.metrics!.conversionRate
        } else if (sortBy === 'impressions') {
          return b.metrics!.impressions - a.metrics!.impressions
        } else {
          return b.metrics!.avgEngagementTime - a.metrics!.avgEngagementTime
        }
      })
    },
    [sortBy]
  )

  // Determine winner
  const determineWinner = React.useCallback(
    (experiment: ExperimentResult) => {
      const sorted = getSortedVariants(experiment)
      if (sorted.length < 2) return null

      const control = sorted.find((v) => v.variant.isControl)
      const best = sorted[0]

      if (!control || !best.metrics) return null

      // Check if best is significantly better than control
      const significance = calculateSignificance(control.metrics!, best.metrics)

      if (
        significance.isSignificant &&
        best.metrics.impressions >= config.minSampleSize
      ) {
        return {
          variant: best.variant,
          metrics: best.metrics,
          significance,
        }
      }

      return null
    },
    [getSortedVariants, calculateSignificance, config]
  )

  // Handle experiment selection
  const handleSelectExperiment = (experiment: ExperimentResult) => {
    setSelectedExperiment(experiment)
    onSelectExperiment?.(experiment)
  }

  // Handle declare winner
  const handleDeclareWinner = (experimentId: string, winnerId: string) => {
    onDeclareWinner?.(experimentId, winnerId)
  }

  // Format percentage
  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`

  // Format duration
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`
  }

  // Render experiment list
  const renderExperimentList = () => (
    <div className="space-y-2">
      {experiments.map((experiment) => {
        const isSelected =
          selectedExperiment?.experimentId === experiment.experimentId
        const winner = determineWinner(experiment)

        return (
          <motion.div
            key={experiment.experimentId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Card
              className={cn(
                'cursor-pointer transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-1',
                isSelected && 'border-primary'
              )}
              onClick={() => handleSelectExperiment(experiment)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSelectExperiment(experiment)
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Select experiment ${experiment.experimentName}`}
              aria-pressed={isSelected}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {experiment.experimentName}
                    </CardTitle>
                    {experiment.description && (
                      <CardDescription className="text-xs mt-1">
                        {experiment.description}
                      </CardDescription>
                    )}
                  </div>

                  <Badge
                    variant={
                      experiment.status === 'running'
                        ? 'default'
                        : experiment.status === 'completed'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {experiment.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {experiment.variants.length} variants
                  </span>

                  {winner && (
                    <Badge variant="success" className="text-xs">
                      Winner found
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}

      {experiments.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No experiments yet. Create your first A/B test to get started.
        </p>
      )}
    </div>
  )

  // Render variant comparison
  const renderVariantComparison = () => {
    if (!selectedExperiment) return null

    const sorted = getSortedVariants(selectedExperiment)
    const control = sorted.find((v) => v.variant.isControl)
    const winner = determineWinner(selectedExperiment)

    return (
      <div className="space-y-4">
        {/* Sorting controls */}
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'conversionRate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('conversionRate')}
          >
            Conversion Rate
          </Button>
          <Button
            variant={sortBy === 'impressions' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('impressions')}
          >
            Impressions
          </Button>
          <Button
            variant={sortBy === 'engagement' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('engagement')}
          >
            Engagement
          </Button>
        </div>

        {/* Winner recommendation */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-green-500 bg-green-50 dark:bg-green-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  🏆 Winner Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  <strong>{winner.variant.name}</strong> is performing
                  significantly better with{' '}
                  {formatPercent(winner.metrics.conversionRate)} conversion rate
                  ({winner.significance.effectSize.toFixed(1)}% improvement)
                </p>
                <p className="text-xs text-muted-foreground">
                  p-value: {winner.significance.pValue.toFixed(4)} (
                  {formatPercent(winner.significance.confidenceLevel)}{' '}
                  confidence)
                </p>

                {!selectedExperiment.winner && (
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() =>
                      handleDeclareWinner(
                        selectedExperiment.experimentId,
                        winner.variant.id
                      )
                    }
                  >
                    Declare Winner
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Variant cards */}
        <div className="space-y-3">
          {sorted.map(({ variant, metrics }, index) => {
            if (!metrics) return null

            const isWinner = winner?.variant.id === variant.id
            const significance =
              control && !variant.isControl
                ? calculateSignificance(control.metrics!, metrics)
                : null

            return (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(isWinner && 'border-green-500')}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {variant.name}
                          {variant.isControl && (
                            <Badge variant="outline" className="text-xs">
                              Control
                            </Badge>
                          )}
                          {isWinner && (
                            <Badge variant="success" className="text-xs">
                              Winner
                            </Badge>
                          )}
                        </CardTitle>
                        {variant.description && (
                          <CardDescription className="text-xs mt-1">
                            {variant.description}
                          </CardDescription>
                        )}
                      </div>

                      <Badge variant="outline">{index + 1}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {/* Main metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Conversion Rate
                          </div>
                          <div className="text-2xl font-bold">
                            {formatPercent(metrics.conversionRate)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {metrics.conversions} / {metrics.impressions}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Avg Engagement
                          </div>
                          <div className="text-2xl font-bold">
                            {formatDuration(metrics.avgEngagementTime)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {metrics.users} users
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Sample Size</span>
                          <span>
                            {metrics.impressions} / {config.minSampleSize}
                          </span>
                        </div>
                        <DashboardProgress
                          value={
                            (metrics.impressions / config.minSampleSize) * 100
                          }
                          size="sm"
                          aria-label={`Sample size progress: ${metrics.impressions} of ${config.minSampleSize} required`}
                        />
                      </div>

                      {/* Additional metrics */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Bounce Rate
                          </span>
                          <span>{formatPercent(metrics.bounceRate)}</span>
                        </div>
                        {metrics.revenue !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Revenue
                            </span>
                            <span>${metrics.revenue.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      {/* Statistical significance */}
                      {showStatistics && significance && (
                        <div className="pt-2 border-t">
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                vs Control
                              </span>
                              <Badge
                                variant={
                                  significance.isSignificant
                                    ? 'success'
                                    : 'secondary'
                                }
                                className="text-xs"
                              >
                                {significance.isSignificant
                                  ? 'Significant'
                                  : 'Not Significant'}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Effect Size
                              </span>
                              <span
                                className={cn(
                                  'font-medium',
                                  significance.effectSize > 0
                                    ? 'text-green-700 dark:text-green-400'
                                    : 'text-red-700 dark:text-red-400'
                                )}
                                aria-label={`Effect size: ${significance.effectSize > 0 ? 'positive' : 'negative'} ${Math.abs(significance.effectSize).toFixed(1)} percent`}
                              >
                                {significance.effectSize > 0 ? '+' : ''}
                                {significance.effectSize.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                p-value
                              </span>
                              <span>{significance.pValue.toFixed(4)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn('space-y-4', className)}
        role="status"
        aria-label="Loading A/B Testing Dashboard"
        aria-busy="true"
      >
        <Card>
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-6 w-48 bg-muted rounded mb-2" />
              <div className="h-4 w-64 bg-muted/60 rounded" />
            </div>
          </CardHeader>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="h-5 w-24 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted/30 rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardContent className="flex items-center justify-center h-64">
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
        <span className="sr-only">Loading A/B testing data...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return (
      <div
        className={cn('space-y-4', className)}
        role="alert"
        aria-live="assertive"
      >
        <Card className="border-destructive/30">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <svg
                  className="h-6 w-6 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium text-foreground">
                  Failed to load A/B testing data
                </p>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className={cn('space-y-4', className)}
      role="region"
      aria-label="A/B Testing Dashboard"
    >
      {/* Keyboard shortcuts help overlay */}
      {showShortcutsHelp && (
        <KeyboardShortcutsHelp
          shortcuts={displayShortcuts}
          onClose={() => setShowShortcutsHelp(false)}
          title="A/B Testing Keyboard Shortcuts"
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>A/B Testing Dashboard</CardTitle>
              <CardDescription>
                Monitor experiment results and statistical significance
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  aria-label="Refresh data"
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="hidden sm:inline">Refresh</span>
                  <kbd className="ml-2 hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
                    R
                  </kbd>
                </Button>
              )}
              {enableKeyboardShortcuts && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShortcutsHelp(true)}
                  aria-label="Show keyboard shortcuts"
                  className="text-muted-foreground"
                >
                  <kbd className="flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium">
                    ?
                  </kbd>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Experiment list */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Experiments</CardTitle>
            </CardHeader>
            <CardContent>{renderExperimentList()}</CardContent>
          </Card>
        </div>

        {/* Variant comparison */}
        <div className="lg:col-span-2">
          {selectedExperiment ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedExperiment.experimentName}
                </CardTitle>
                <CardDescription>
                  Started{' '}
                  {new Date(selectedExperiment.startDate).toLocaleDateString()}
                  {selectedExperiment.endDate && (
                    <>
                      {' '}
                      · Ended{' '}
                      {new Date(
                        selectedExperiment.endDate
                      ).toLocaleDateString()}
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>{renderVariantComparison()}</CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-sm text-muted-foreground">
                  Select an experiment to view results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Keyboard shortcut discovery hint */}
      {enableKeyboardShortcuts && (
        <KeyboardShortcutHint
          storageKey="ab-testing-dashboard"
          message="Keyboard shortcuts available"
          shortcutKey="?"
          position="bottom-right"
          showDelay={2000}
          displayDuration={6000}
        />
      )}
    </div>
  )
}

/**
 * Hook for managing A/B test experiments
 */
export function useABTesting() {
  const [experiments, setExperiments] = React.useState<ExperimentResult[]>([])
  const [currentVariants, setCurrentVariants] = React.useState<
    Map<string, string>
  >(new Map())

  const createExperiment = React.useCallback(
    (name: string, variants: ExperimentVariant[], description?: string) => {
      const experiment: ExperimentResult = {
        experimentId: `exp-${Date.now()}`,
        experimentName: name,
        description,
        status: 'draft',
        startDate: Date.now(),
        variants,
        metrics: new Map(),
      }

      setExperiments((prev) => [...prev, experiment])
      return experiment
    },
    []
  )

  const startExperiment = React.useCallback((experimentId: string) => {
    setExperiments((prev) =>
      prev.map((exp) =>
        exp.experimentId === experimentId
          ? { ...exp, status: 'running' as const }
          : exp
      )
    )
  }, [])

  const getVariant = React.useCallback(
    (experimentId: string, userId: string) => {
      const experiment = experiments.find(
        (e) => e.experimentId === experimentId
      )
      if (!experiment || experiment.status !== 'running') return null

      // Check if user already has a variant
      const key = `${experimentId}-${userId}`
      if (currentVariants.has(key)) {
        return experiment.variants.find(
          (v) => v.id === currentVariants.get(key)
        )
      }

      // Assign random variant
      const variant =
        experiment.variants[
          Math.floor(Math.random() * experiment.variants.length)
        ]
      setCurrentVariants((prev) => new Map(prev).set(key, variant.id))
      return variant
    },
    [experiments, currentVariants]
  )

  const recordMetric = React.useCallback(
    (
      experimentId: string,
      variantId: string,
      metric: Partial<VariantMetrics>
    ) => {
      setExperiments((prev) =>
        prev.map((exp) => {
          if (exp.experimentId !== experimentId) return exp

          const existing = exp.metrics.get(variantId) || {
            variantId,
            impressions: 0,
            conversions: 0,
            conversionRate: 0,
            avgEngagementTime: 0,
            bounceRate: 0,
            users: 0,
          }

          const updated = { ...existing, ...metric }
          updated.conversionRate =
            updated.conversions / (updated.impressions || 1)

          const newMetrics = new Map(exp.metrics)
          newMetrics.set(variantId, updated)

          return { ...exp, metrics: newMetrics }
        })
      )
    },
    []
  )

  return {
    experiments,
    createExperiment,
    startExperiment,
    getVariant,
    recordMetric,
  }
}

ABTestingDashboard.displayName = 'ABTestingDashboard'
