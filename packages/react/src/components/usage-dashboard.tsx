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
import type { UsageStats, CreditBalance, UsageLimit, UsageMetrics } from '@clarity-chat/types'

export interface UsageDashboardProps {
  balance: CreditBalance
  stats: UsageStats
  limits?: UsageLimit[]
  onPurchaseCredits?: () => void
  className?: string
}

export const UsageDashboard: React.FC<UsageDashboardProps> = ({
  balance,
  stats,
  limits = [],
  onPurchaseCredits,
  className,
}) => {
  const usagePercentage = (balance.used / balance.total) * 100
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
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Usage Dashboard
              {isLowBalance && (
                <Badge variant="destructive" className="animate-pulse">
                  Low Balance
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
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
                  <p className="text-2xl font-bold">{formatNumber(balance.available)}</p>
                  <p className="text-xs text-muted-foreground">
                    of {formatNumber(balance.total)} credits
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={cn(
                    'h-full rounded-full',
                    isLowBalance ? 'bg-destructive' : 'bg-primary'
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
              <h3 className="text-sm font-semibold mb-3">Usage This {stats.period}</h3>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(stats.metrics) as Array<keyof UsageMetrics>).map((key) => {
                  const value = stats.metrics[key]
                  const limit = limits.find((l) => l.metric === key)
                  const percentage = limit ? (limit.current / limit.limit) * 100 : 0
                  const isNearLimit = percentage > 80

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        'p-4 rounded-lg border',
                        isNearLimit && 'border-yellow-500/50 bg-yellow-500/5'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{metricIcons[key]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground truncate">
                            {metricLabels[key]}
                          </p>
                          <p className="text-xl font-bold">{formatNumber(value)}</p>
                        </div>
                      </div>
                      {limit && (
                        <div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                isNearLimit ? 'bg-yellow-500' : 'bg-primary'
                              )}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatNumber(limit.current)} / {formatNumber(limit.limit)}
                            {isNearLimit && ' ⚠️'}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Cost Breakdown</h3>
              <div className="space-y-2">
                {stats.costs.breakdown.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(item.quantity)} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="text-sm font-bold">{formatCurrency(item.amount)}</p>
                  </motion.div>
                ))}

                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-bold">Total</p>
                  <p className="text-lg font-bold">{formatCurrency(stats.costs.total)}</p>
                </div>
              </div>
            </div>

            {/* Usage Limits Warnings */}
            {limits.some((l) => (l.current / l.limit) * 100 > 80) && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  ⚠️ Approaching Limits
                </h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {limits
                    .filter((l) => (l.current / l.limit) * 100 > 80)
                    .map((limit) => (
                      <li key={limit.metric}>
                        • {metricLabels[limit.metric]}: {formatNumber(limit.current)} /{' '}
                        {formatNumber(limit.limit)} (
                        {((limit.current / limit.limit) * 100).toFixed(0)}%)
                      </li>
                    ))}
                </ul>
                <p className="text-xs mt-2">
                  Resets on {limits[0]?.resetDate.toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">Period</p>
                <p className="text-sm font-semibold capitalize">{stats.period}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="text-sm font-semibold">
                  {stats.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="text-sm font-semibold">
                  {stats.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">💡 Tips to Save Credits</h4>
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
