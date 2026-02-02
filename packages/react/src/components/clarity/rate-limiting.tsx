'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  AlertTriangle,
  Clock,
  Zap,
  TrendingUp,
  RefreshCw,
  Shield,
  Info,
  Ban,
  CheckCircle,
  Timer,
} from 'lucide-react'

// Types
export interface RateLimitStatus {
  limit: number
  remaining: number
  reset: Date
  used: number
  type: 'requests' | 'tokens' | 'images' | 'audio'
}

export interface RateLimitTier {
  name: string
  requestsPerMinute: number
  tokensPerMinute: number
  tokensPerDay: number
  color?: string
}

export interface UsageQuota {
  id: string
  name: string
  used: number
  limit: number
  unit: string
  resetPeriod: 'minute' | 'hour' | 'day' | 'month'
  resetAt?: Date
}

// Rate Limit Badge
interface RateLimitBadgeProps {
  status: 'ok' | 'warning' | 'critical' | 'exceeded'
  remaining?: number
  className?: string
}

export function RateLimitBadge({
  status,
  remaining,
  className,
}: RateLimitBadgeProps) {
  const config = {
    ok: {
      icon: CheckCircle,
      label: 'OK',
      variant: 'default' as const,
      color: 'text-green-500',
    },
    warning: {
      icon: AlertTriangle,
      label: 'Warning',
      variant: 'secondary' as const,
      color: 'text-yellow-500',
    },
    critical: {
      icon: AlertTriangle,
      label: 'Critical',
      variant: 'destructive' as const,
      color: 'text-orange-500',
    },
    exceeded: {
      icon: Ban,
      label: 'Exceeded',
      variant: 'destructive' as const,
      color: 'text-red-500',
    },
  }

  const { icon: Icon, label, variant, color } = config[status]

  return (
    <Badge variant={variant} className={cn('gap-1', className)}>
      <Icon className={cn('h-3 w-3', color)} />
      {label}
      {remaining !== undefined && <span className="ml-1">({remaining})</span>}
    </Badge>
  )
}

// Rate Limit Progress
interface RateLimitProgressProps {
  used: number
  limit: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RateLimitProgress({
  used,
  limit,
  label,
  showPercentage = true,
  size = 'md',
  className,
}: RateLimitProgressProps) {
  const percentage = Math.min((used / limit) * 100, 100)
  const remaining = Math.max(limit - used, 0)

  const getColor = () => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-orange-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' }

  return (
    <div className={cn('space-y-1', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className="font-medium">
              {used.toLocaleString()} / {limit.toLocaleString()}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-secondary rounded-full overflow-hidden',
          heights[size]
        )}
      >
        <div
          className={cn('h-full transition-all duration-300', getColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{remaining.toLocaleString()} remaining</span>
        <span>{percentage.toFixed(1)}% used</span>
      </div>
    </div>
  )
}

// Countdown Timer
interface CountdownTimerProps {
  resetAt: Date
  onReset?: () => void
  className?: string
}

export function CountdownTimer({
  resetAt,
  onReset,
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState('')

  React.useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const diff = resetAt.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft('Resetting...')
        onReset?.()
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${seconds}s`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [resetAt, onReset])

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <Timer className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">Resets in:</span>
      <span className="font-mono font-medium">{timeLeft}</span>
    </div>
  )
}

// Rate Limit Card
interface RateLimitCardProps {
  title: string
  description?: string
  status: RateLimitStatus
  tier?: RateLimitTier
  onUpgrade?: () => void
  className?: string
}

export function RateLimitCard({
  title,
  description,
  status,
  tier,
  onUpgrade,
  className,
}: RateLimitCardProps) {
  const percentage = (status.used / status.limit) * 100
  const badgeStatus =
    percentage >= 100
      ? 'exceeded'
      : percentage >= 80
        ? 'critical'
        : percentage >= 60
          ? 'warning'
          : 'ok'

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <RateLimitBadge status={badgeStatus} remaining={status.remaining} />
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <RateLimitProgress
          used={status.used}
          limit={status.limit}
          label={`${status.type.charAt(0).toUpperCase() + status.type.slice(1)} Usage`}
        />

        <CountdownTimer resetAt={status.reset} />

        {tier && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Current tier:
              </span>
              <Badge variant="outline">{tier.name}</Badge>
            </div>
            {onUpgrade && (
              <Button variant="outline" size="sm" onClick={onUpgrade}>
                <TrendingUp className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Usage Quota Display
interface UsageQuotaDisplayProps {
  quotas: UsageQuota[]
  className?: string
}

export function UsageQuotaDisplay({
  quotas,
  className,
}: UsageQuotaDisplayProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {quotas.map((quota) => {
        const percentage = (quota.used / quota.limit) * 100
        return (
          <div key={quota.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{quota.name}</span>
              <span className="text-xs text-muted-foreground">
                Resets {quota.resetPeriod}ly
              </span>
            </div>
            <RateLimitProgress
              used={quota.used}
              limit={quota.limit}
              showPercentage
            />
          </div>
        )
      })}
    </div>
  )
}

// Throttle Warning
interface ThrottleWarningProps {
  isThrottled: boolean
  retryAfter?: number
  onRetry?: () => void
  className?: string
}

export function ThrottleWarning({
  isThrottled,
  retryAfter,
  onRetry,
  className,
}: ThrottleWarningProps) {
  if (!isThrottled) return null

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20',
        className
      )}
    >
      <div className="flex-shrink-0">
        <AlertTriangle className="h-5 w-5 text-destructive" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-destructive">
          Rate limit exceeded
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {retryAfter
            ? `Please wait ${retryAfter} seconds before retrying`
            : 'Too many requests. Please slow down.'}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  )
}

// API Usage Dashboard
interface APIUsageDashboardProps {
  requests: RateLimitStatus
  tokens: RateLimitStatus
  images?: RateLimitStatus
  tier: RateLimitTier
  onUpgrade?: () => void
  className?: string
}

export function APIUsageDashboard({
  requests,
  tokens,
  images,
  tier,
  onUpgrade,
  className,
}: APIUsageDashboardProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">API Usage</h3>
          <p className="text-sm text-muted-foreground">
            Current usage across all endpoints
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            {tier.name}
          </Badge>
          {onUpgrade && (
            <Button variant="default" size="sm" onClick={onUpgrade}>
              Upgrade Plan
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RateLimitCard
          title="Requests"
          description="API requests per minute"
          status={requests}
        />
        <RateLimitCard
          title="Tokens"
          description="Token usage per minute"
          status={tokens}
        />
        {images && (
          <RateLimitCard
            title="Images"
            description="Image generations per day"
            status={images}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {tier.requestsPerMinute.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Requests/min</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {tier.tokensPerMinute.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Tokens/min</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {tier.tokensPerDay.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Tokens/day</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Inline Rate Limit Indicator
interface InlineRateLimitProps {
  remaining: number
  limit: number
  showTooltip?: boolean
  className?: string
}

export function InlineRateLimit({
  remaining,
  limit,
  showTooltip = true,
  className,
}: InlineRateLimitProps) {
  const percentage = ((limit - remaining) / limit) * 100
  const color =
    percentage >= 80
      ? 'text-red-500'
      : percentage >= 60
        ? 'text-yellow-500'
        : 'text-green-500'

  const indicator = (
    <div className={cn('flex items-center gap-1 text-xs', className)}>
      <Zap className={cn('h-3 w-3', color)} />
      <span className={color}>{remaining}</span>
      <span className="text-muted-foreground">/ {limit}</span>
    </div>
  )

  if (!showTooltip) return indicator

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{indicator}</TooltipTrigger>
        <TooltipContent>
          <p>
            {remaining} requests remaining out of {limit}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
