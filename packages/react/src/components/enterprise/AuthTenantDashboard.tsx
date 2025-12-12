import * as React from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  cn,
} from '@clarity-chat/primitives'
import { Skeleton } from '../skeleton'

export interface PlanAction {
  id: string
  label: string
  onClick: () => void
  variant?: 'default' | 'primary' | 'destructive'
}

export interface SeatBreakdown {
  label: string
  used: number
  total: number
}

export interface AuthTenantDashboardProps {
  /** Name of the organization */
  organizationName: string
  /** Current plan name */
  planName: string
  /** Badge text for plan status */
  planBadge?: string
  /** Badge variant for plan status */
  planBadgeVariant?: 'default' | 'success' | 'warning' | 'destructive'
  /** Plan renewal date */
  renewalDate?: string
  /** Billing period (monthly/annual) */
  billingPeriod?: 'monthly' | 'annual'
  /** Seat usage breakdown */
  seatUsage: SeatBreakdown
  /** API usage info */
  apiUsage?: {
    label: string
    value: string
    /** Usage percentage for warning/critical thresholds */
    percentage?: number
  }
  /** Available actions */
  actions?: PlanAction[]
  /** Callback when contact sales is clicked */
  onContactSales?: () => void
  /** Whether data is loading */
  isLoading?: boolean
  /** Warning threshold percentage (default: 80) */
  warningThreshold?: number
  /** Critical threshold percentage (default: 95) */
  criticalThreshold?: number
  className?: string
}

const formatUsage = (used: number, total: number) => {
  if (total === 0) return '0%'
  const pct = Math.min(100, Math.round((used / total) * 100))
  return `${pct}%`
}

const UsageSkeleton = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton width={80} height={14} />
      <Skeleton width={100} height={14} />
    </div>
    <Skeleton width="100%" height={8} rounded="full" />
    <Skeleton width="70%" height={12} />
  </div>
)

const DetailsSkeleton = () => (
  <div className="space-y-3 rounded-lg border border-border/50 bg-muted p-4">
    <div className="flex items-center justify-between">
      <Skeleton width={60} height={14} />
      <Skeleton width={80} height={14} />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton width={80} height={14} />
      <Skeleton width={100} height={14} />
    </div>
    <div className="flex gap-2">
      <Skeleton width={100} height={32} />
      <Skeleton width={100} height={32} />
    </div>
  </div>
)

export const AuthTenantDashboard: React.FC<AuthTenantDashboardProps> = ({
  organizationName,
  planName,
  planBadge,
  planBadgeVariant = 'default',
  renewalDate,
  billingPeriod,
  seatUsage,
  apiUsage,
  actions = [],
  onContactSales,
  isLoading = false,
  warningThreshold = 80,
  criticalThreshold = 95,
  className,
}) => {
  const usagePct =
    seatUsage.total === 0
      ? 0
      : Math.min(100, (seatUsage.used / seatUsage.total) * 100)

  const isAtCapacity = seatUsage.used >= seatUsage.total
  const isCritical = usagePct >= criticalThreshold
  const isWarning = usagePct >= warningThreshold && !isCritical

  const getProgressBarColor = () => {
    if (isAtCapacity || isCritical) return 'bg-destructive'
    if (isWarning) return 'bg-warning'
    return 'bg-primary'
  }

  const getUsageMessage = () => {
    if (isAtCapacity) {
      return 'All seats allocated. Upgrade or reassign to invite more teammates.'
    }
    if (isCritical) {
      return `Only ${seatUsage.total - seatUsage.used} seat${seatUsage.total - seatUsage.used === 1 ? '' : 's'} remaining. Consider upgrading soon.`
    }
    if (isWarning) {
      return `Approaching seat limit. ${seatUsage.total - seatUsage.used} seats available.`
    }
    return 'Invite more teammates to collaborate with the AI assistant.'
  }

  const badgeVariantMap: Record<
    NonNullable<AuthTenantDashboardProps['planBadgeVariant']>,
    'info' | 'success' | 'warning' | 'destructive'
  > = {
    default: 'info',
    success: 'success',
    warning: 'warning',
    destructive: 'destructive',
  }

  return (
    <Card
      className={cn(
        'border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm',
        className
      )}
      aria-busy={isLoading}
    >
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton width={200} height={24} />
                <Skeleton width={240} height={14} />
              </div>
            ) : (
              <>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {organizationName}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground/80">
                  Manage seats, plan limits, and upgrades.
                </CardDescription>
              </>
            )}
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton width={60} height={20} />
              <Skeleton width={100} height={16} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge
                variant={badgeVariantMap[planBadgeVariant]}
                className="uppercase tracking-wide"
              >
                {planBadge ?? 'Active'}
              </Badge>
              <span className="text-sm font-medium text-foreground">
                {planName}
              </span>
              {billingPeriod && (
                <span className="text-xs text-muted-foreground/60">
                  ({billingPeriod})
                </span>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          <UsageSkeleton />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground/80">
              <span id="seat-usage-label">
                {seatUsage.label || 'Seats used'}
              </span>
              <span className="flex items-center gap-2">
                <span className="tabular-nums">
                  {seatUsage.used}/{seatUsage.total}
                </span>
                <span className="text-muted-foreground/60">•</span>
                <span
                  className={cn(
                    'tabular-nums',
                    isCritical && 'font-medium text-destructive',
                    isWarning && !isCritical && 'font-medium text-warning'
                  )}
                >
                  {formatUsage(seatUsage.used, seatUsage.total)}
                </span>
              </span>
            </div>
            <div
              role="progressbar"
              aria-labelledby="seat-usage-label"
              aria-valuemin={0}
              aria-valuemax={seatUsage.total}
              aria-valuenow={seatUsage.used}
              aria-valuetext={`${seatUsage.used} of ${seatUsage.total} seats used`}
              className="relative h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--surface-muted))]"
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300 ease-out',
                  getProgressBarColor()
                )}
                style={{ width: `${usagePct}%` }}
              />
            </div>
            <p
              className={cn(
                'text-xs',
                isAtCapacity || isCritical
                  ? 'text-destructive'
                  : isWarning
                    ? 'text-warning-foreground'
                    : 'text-muted-foreground/70'
              )}
            >
              {getUsageMessage()}
            </p>
          </div>
        )}

        {isLoading ? (
          <DetailsSkeleton />
        ) : (
          <div className="space-y-3 rounded-lg border border-border/50 bg-muted p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground/80">
              <span>Renewal</span>
              <span className="font-medium text-foreground">
                {renewalDate ?? (
                  <span className="text-muted-foreground/60">Not set</span>
                )}
              </span>
            </div>
            {apiUsage && (
              <div className="flex items-center justify-between text-sm text-muted-foreground/80">
                <span>{apiUsage.label}</span>
                <span
                  className={cn(
                    'font-semibold',
                    apiUsage.percentage !== undefined &&
                      apiUsage.percentage >= criticalThreshold
                      ? 'text-destructive'
                      : apiUsage.percentage !== undefined &&
                          apiUsage.percentage >= warningThreshold
                        ? 'text-warning'
                        : 'text-foreground'
                  )}
                >
                  {apiUsage.value}
                </span>
              </div>
            )}
            {actions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {actions.map((action) => (
                  <Button
                    key={action.id}
                    variant={
                      action.variant === 'primary'
                        ? 'default'
                        : action.variant === 'destructive'
                          ? 'destructive'
                          : 'surface'
                    }
                    size="sm"
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground/70">
        <span>Need custom terms or higher limits?</span>
        {onContactSales ? (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 pl-1 text-xs text-primary"
            onClick={onContactSales}
          >
            Contact enterprise sales
            <svg
              className="ml-0.5 h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Button>
        ) : (
          <span className="pl-1 text-primary">Contact enterprise sales</span>
        )}
      </CardFooter>
    </Card>
  )
}

AuthTenantDashboard.displayName = 'AuthTenantDashboard'
