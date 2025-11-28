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

/**
 * Simple Progress component for internal use
 */
const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value = 0, ...props }, ref) => {
  // Guard against NaN/Infinity - clamp to valid percentage range
  const safeValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0

  return (
    <div
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-gray-200',
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-blue-600 transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  )
})
Progress.displayName = 'Progress'

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
}: ABTestingDashboardProps) {
  const config = { ...defaultConfig, ...userConfig }

  const [selectedExperiment, setSelectedExperiment] = React.useState<ExperimentResult | null>(
    experiments[0] || null
  )
  const [sortBy, setSortBy] = React.useState<'conversionRate' | 'impressions' | 'engagement'>('conversionRate')

  // Calculate statistical significance
  const calculateSignificance = React.useCallback((
    controlMetrics: VariantMetrics,
    variantMetrics: VariantMetrics
  ): SignificanceTest => {
    // Simple z-test for proportions
    const p1 = controlMetrics.conversionRate
    const p2 = variantMetrics.conversionRate
    const n1 = controlMetrics.impressions
    const n2 = variantMetrics.impressions

    // Pooled proportion
    const pPool = (controlMetrics.conversions + variantMetrics.conversions) / (n1 + n2)

    // Standard error
    const se = Math.sqrt(pPool * (1 - pPool) * (1/n1 + 1/n2))

    // Z-score
    const z = (p2 - p1) / se

    // Two-tailed p-value (approximate)
    const pValue = 2 * (1 - normalCDF(Math.abs(z)))

    // Effect size (relative improvement)
    const effectSize = ((p2 - p1) / p1) * 100

    const isSignificant = pValue < (1 - config.confidenceLevel) && Math.abs(effectSize) >= config.minEffect

    return {
      isSignificant,
      pValue,
      confidenceLevel: config.confidenceLevel,
      sampleSize: n1 + n2,
      effectSize,
    }
  }, [config])

  // Normal CDF approximation
  const normalCDF = (x: number): number => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x))
    const d = 0.3989423 * Math.exp(-x * x / 2)
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return x > 0 ? 1 - p : p
  }

  // Get sorted variants for selected experiment
  const getSortedVariants = React.useCallback((experiment: ExperimentResult) => {
    const variants = experiment.variants.map(variant => {
      const metrics = experiment.metrics.get(variant.id)
      return { variant, metrics }
    }).filter(v => v.metrics)

    return variants.sort((a, b) => {
      if (sortBy === 'conversionRate') {
        return b.metrics!.conversionRate - a.metrics!.conversionRate
      } else if (sortBy === 'impressions') {
        return b.metrics!.impressions - a.metrics!.impressions
      } else {
        return b.metrics!.avgEngagementTime - a.metrics!.avgEngagementTime
      }
    })
  }, [sortBy])

  // Determine winner
  const determineWinner = React.useCallback((experiment: ExperimentResult) => {
    const sorted = getSortedVariants(experiment)
    if (sorted.length < 2) return null

    const control = sorted.find(v => v.variant.isControl)
    const best = sorted[0]

    if (!control || !best.metrics) return null

    // Check if best is significantly better than control
    const significance = calculateSignificance(
      control.metrics!,
      best.metrics
    )

    if (significance.isSignificant && best.metrics.impressions >= config.minSampleSize) {
      return {
        variant: best.variant,
        metrics: best.metrics,
        significance,
      }
    }

    return null
  }, [getSortedVariants, calculateSignificance, config])

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
      {experiments.map(experiment => {
        const isSelected = selectedExperiment?.experimentId === experiment.experimentId
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
                    <CardTitle className="text-base">{experiment.experimentName}</CardTitle>
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
    const control = sorted.find(v => v.variant.isControl)
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
                  <strong>{winner.variant.name}</strong> is performing significantly better
                  with {formatPercent(winner.metrics.conversionRate)} conversion rate
                  ({winner.significance.effectSize.toFixed(1)}% improvement)
                </p>
                <p className="text-xs text-muted-foreground">
                  p-value: {winner.significance.pValue.toFixed(4)} (
                  {formatPercent(winner.significance.confidenceLevel)} confidence)
                </p>

                {!selectedExperiment.winner && (
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => handleDeclareWinner(
                      selectedExperiment.experimentId,
                      winner.variant.id
                    )}
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
            const significance = control && !variant.isControl
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
                        <Progress
                          value={(metrics.impressions / config.minSampleSize) * 100}
                          className="h-2"
                        />
                      </div>

                      {/* Additional metrics */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bounce Rate</span>
                          <span>{formatPercent(metrics.bounceRate)}</span>
                        </div>
                        {metrics.revenue !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Revenue</span>
                            <span>${metrics.revenue.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      {/* Statistical significance */}
                      {showStatistics && significance && (
                        <div className="pt-2 border-t">
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">vs Control</span>
                              <Badge
                                variant={significance.isSignificant ? 'success' : 'secondary'}
                                className="text-xs"
                              >
                                {significance.isSignificant ? 'Significant' : 'Not Significant'}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Effect Size</span>
                              <span className={cn(
                                'font-medium',
                                significance.effectSize > 0 ? 'text-green-600' : 'text-red-600'
                              )}>
                                {significance.effectSize > 0 ? '+' : ''}
                                {significance.effectSize.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">p-value</span>
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

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardHeader>
          <CardTitle>A/B Testing Dashboard</CardTitle>
          <CardDescription>
            Monitor experiment results and statistical significance
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Experiment list */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Experiments</CardTitle>
            </CardHeader>
            <CardContent>
              {renderExperimentList()}
            </CardContent>
          </Card>
        </div>

        {/* Variant comparison */}
        <div className="lg:col-span-2">
          {selectedExperiment ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{selectedExperiment.experimentName}</CardTitle>
                <CardDescription>
                  Started {new Date(selectedExperiment.startDate).toLocaleDateString()}
                  {selectedExperiment.endDate && (
                    <> · Ended {new Date(selectedExperiment.endDate).toLocaleDateString()}</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderVariantComparison()}
              </CardContent>
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
    </div>
  )
}

/**
 * Hook for managing A/B test experiments
 */
export function useABTesting() {
  const [experiments, setExperiments] = React.useState<ExperimentResult[]>([])
  const [currentVariants, setCurrentVariants] = React.useState<Map<string, string>>(new Map())

  const createExperiment = React.useCallback((
    name: string,
    variants: ExperimentVariant[],
    description?: string
  ) => {
    const experiment: ExperimentResult = {
      experimentId: `exp-${Date.now()}`,
      experimentName: name,
      description,
      status: 'draft',
      startDate: Date.now(),
      variants,
      metrics: new Map(),
    }

    setExperiments(prev => [...prev, experiment])
    return experiment
  }, [])

  const startExperiment = React.useCallback((experimentId: string) => {
    setExperiments(prev => prev.map(exp =>
      exp.experimentId === experimentId
        ? { ...exp, status: 'running' as const }
        : exp
    ))
  }, [])

  const getVariant = React.useCallback((experimentId: string, userId: string) => {
    const experiment = experiments.find(e => e.experimentId === experimentId)
    if (!experiment || experiment.status !== 'running') return null

    // Check if user already has a variant
    const key = `${experimentId}-${userId}`
    if (currentVariants.has(key)) {
      return experiment.variants.find(v => v.id === currentVariants.get(key))
    }

    // Assign random variant
    const variant = experiment.variants[Math.floor(Math.random() * experiment.variants.length)]
    setCurrentVariants(prev => new Map(prev).set(key, variant.id))
    return variant
  }, [experiments, currentVariants])

  const recordMetric = React.useCallback((
    experimentId: string,
    variantId: string,
    metric: Partial<VariantMetrics>
  ) => {
    setExperiments(prev => prev.map(exp => {
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
      updated.conversionRate = updated.conversions / (updated.impressions || 1)

      const newMetrics = new Map(exp.metrics)
      newMetrics.set(variantId, updated)

      return { ...exp, metrics: newMetrics }
    }))
  }, [])

  return {
    experiments,
    createExperiment,
    startExperiment,
    getVariant,
    recordMetric,
  }
}
