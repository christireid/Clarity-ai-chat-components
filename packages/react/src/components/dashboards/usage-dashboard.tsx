import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import type {
  UsageStats,
  CreditBalance,
  UsageLimit,
  UsageMetrics,
} from '@clarity-chat/types'
<<<<<<< HEAD
import { DURATION_SECONDS } from '../../animations/constants'
=======
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'
>>>>>>> origin/main

export interface UsageDashboardProps {
  balance: CreditBalance
  stats: UsageStats
  limits?: UsageLimit[]
  onPurchaseCredits?: () => void
  className?: string
}

/**
 * Usage Dashboard Component
 *
 * Displays comprehensive usage statistics including credit balance,
 * usage metrics, cost breakdowns, and limit warnings.
 *
 * @example
 * ```tsx
 * <UsageDashboard
 *   balance={{ total: 10000, used: 3000, available: 7000 }}
 *   stats={{
 *     period: 'month',
 *     startDate: new Date(),
 *     endDate: new Date(),
 *     metrics: { messagesCount: 150, tokensUsed: 25000 },
 *     costs: { total: 15.50, breakdown: [] }
 *   }}
 *   limits={[{ metric: 'tokensUsed', current: 25000, limit: 100000 }]}
 *   onPurchaseCredits={() => navigate('/billing')}
 * />
 * ```
 */
export function UsageDashboard({
  balance,
  stats,
  limits = [],
  onPurchaseCredits,
  className,
}: UsageDashboardProps) {
  const usagePercentage =
    balance.total > 0 ? (balance.used / balance.total) * 100 : 0
  const isLowBalance = usagePercentage > 80

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const metricIcons: Record<keyof UsageMetrics, string> = {
    messagesCount: '💬',
    tokensUsed: '🔤',
    filesUploaded: '📁',
    exportsGenerated: '📥',
    storageUsed: '💾',
    apiCalls: '🔌',
  }

  const metricLabels: Record<keyof UsageMetrics, string> = {
    messagesCount: 'Messages',
    tokensUsed: 'Tokens',
    filesUploaded: 'Files',
    exportsGenerated: 'Exports',
    storageUsed: 'Storage (MB)',
    apiCalls: 'API Calls',
  }

  return (
    <Card
      className={cn('h-full flex flex-col', className)}
      role="region"
      aria-label="Usage Dashboard"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              Usage Dashboard
              {isLowBalance && (
                <Badge variant="destructive" pulse>
                  Low Balance
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Track your usage and manage credits
            </CardDescription>
          </div>
          {onPurchaseCredits && (
            <Button onClick={onPurchaseCredits} size="sm">
              💳 Buy Credits
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-6 pb-4">
            {/* Credit Balance */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Credit Balance</h3>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {formatNumber(balance.available)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of {formatNumber(balance.total)} credits
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="relative h-3 bg-muted/30 rounded-full overflow-hidden shadow-inner"
                role="progressbar"
                aria-label="Credit usage"
                aria-valuenow={Math.round(usagePercentage)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={`${formatNumber(balance.used)} of ${formatNumber(balance.total)} credits used (${usagePercentage.toFixed(1)}%)`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercentage}%` }}
                  transition={{
                    // Framer Motion 12: Spring progress fill
                    type: 'spring',
                    damping: 28,
                    stiffness: 200,
                  }}
                  className={cn(
                    'h-full rounded-full',
                    isLowBalance
                      ? 'bg-gradient-to-r from-red-500 to-destructive'
                      : 'bg-gradient-to-r from-primary/80 to-primary'
                  )}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{formatNumber(balance.used)} used</span>
                <span>{usagePercentage.toFixed(1)}%</span>
              </div>

              {balance.nextRefillDate && (
                <p className="text-xs text-muted-foreground mt-2">
                  {balance.autoRefill ? '🔄 Auto-refill' : 'Next refill'} on{' '}
                  {balance.nextRefillDate.toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Usage Metrics Grid */}
            <div>
              <h3 className="text-sm font-semibold mb-3">
                Usage This {stats.period}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(stats.metrics) as Array<keyof UsageMetrics>).map(
                  (key, index) => {
                    const value = stats.metrics[key]
                    const limit = limits.find((l) => l.metric === key)
                    const percentage = limit
                      ? (limit.current / limit.limit) * 100
                      : 0
                    const isNearLimit = percentage > 80
                    // Use index directly instead of O(n) indexOf lookups
                    const baseDelay = index * 0.05

                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          delay: baseDelay,
                          duration: DURATION_SECONDS.normal,
                          ease: EASING_FRAMER.sharp,
                        }}
                        className={cn(
                          'p-4 rounded-xl border border-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-200',
                          isNearLimit &&
                            'border-amber-500/50 bg-amber-50 dark:bg-amber-950/20'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <motion.span
                            className="text-2xl"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: baseDelay + 0.1,
                              type: 'spring',
                              stiffness: 500,
                              damping: 30,
                            }}
                          >
                            {metricIcons[key]}
                          </motion.span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground/80 truncate">
                              {metricLabels[key]}
                            </p>
                            <p className="text-xl font-bold text-foreground">
                              {formatNumber(value)}
                            </p>
                          </div>
                        </div>
                        {limit && (
                          <div>
                            <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${Math.min(percentage, 100)}%`,
                                }}
                                transition={{
                                  // Framer Motion 12: Staggered metric bars
                                  type: 'spring',
                                  damping: 30,
                                  stiffness: 220,
                                  delay: baseDelay + 0.2,
                                }}
                                className={cn(
                                  'h-full rounded-full',
                                  isNearLimit
                                    ? 'bg-gradient-to-r from-amber-500/80 to-amber-500'
                                    : 'bg-gradient-to-r from-primary/80 to-primary'
                                )}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatNumber(limit.current)} /{' '}
                              {formatNumber(limit.limit)}
                              {isNearLimit && ' ⚠️'}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )
                  }
                )}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Cost Breakdown</h3>
              <div className="space-y-2">
                {stats.costs.breakdown.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{
                      delay: index * 0.05,
                      duration: DURATION_SECONDS.normal,
                      ease: EASING_FRAMER.sharp,
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {item.category}
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        {formatNumber(item.quantity)} ×{' '}
                        {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="text-sm font-bold">
                      {formatCurrency(item.amount)}
                    </p>
                  </motion.div>
                ))}

                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/30 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                  <p className="text-sm font-bold">Total</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(stats.costs.total)}
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Limits Warnings */}
            {limits.some((l) => (l.current / l.limit) * 100 > 80) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: DURATION_SECONDS.normal,
                  ease: EASING_FRAMER.sharp,
                }}
                className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30 rounded-xl shadow-[0_2px_8px_rgba(245,158,11,0.1)]"
              >
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  ⚠️ Approaching Limits
                </h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {limits
                    .filter((l) => (l.current / l.limit) * 100 > 80)
                    .map((limit) => (
                      <li key={limit.metric}>
                        • {metricLabels[limit.metric]}:{' '}
                        {formatNumber(limit.current)} /{' '}
                        {formatNumber(limit.limit)} (
                        {((limit.current / limit.limit) * 100).toFixed(0)}%)
                      </li>
                    ))}
                </ul>
                {limits[0]?.resetDate && (
                  <p className="text-xs mt-2 text-muted-foreground/80">
                    Resets on {limits[0].resetDate.toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">Period</p>
                <p className="text-sm font-semibold capitalize">
                  {stats.period}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="text-sm font-semibold">
                  {stats.startDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="text-sm font-semibold">
                  {stats.endDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">
                💡 Tips to Save Credits
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Use shorter prompts for simple questions</li>
                <li>• Enable context management to reduce redundant queries</li>
                <li>• Batch similar questions together</li>
                <li>• Use the prompt library for efficient templates</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

UsageDashboard.displayName = 'UsageDashboard'
