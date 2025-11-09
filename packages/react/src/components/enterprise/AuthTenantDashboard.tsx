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

export interface PlanAction {
  id: string
  label: string
  onClick: () => void
}

export interface SeatBreakdown {
  label: string
  used: number
  total: number
}

export interface AuthTenantDashboardProps {
  organizationName: string
  planName: string
  planBadge?: string
  renewalDate?: string
  seatUsage: SeatBreakdown
  apiUsage?: {
    label: string
    value: string
  }
  actions?: PlanAction[]
  className?: string
}

const formatUsage = (used: number, total: number) => {
  if (total === 0) return '0%'
  const pct = Math.min(100, Math.round((used / total) * 100))
  return `${pct}%`
}

export const AuthTenantDashboard: React.FC<AuthTenantDashboardProps> = ({
  organizationName,
  planName,
  planBadge,
  renewalDate,
  seatUsage,
  apiUsage,
  actions = [],
  className,
}) => {
  const usagePct =
    seatUsage.total === 0
      ? 0
      : Math.min(100, (seatUsage.used / seatUsage.total) * 100)

  return (
    <Card
      className={cn(
        'border-border/60 bg-[hsl(var(--surface-elevated))] shadow-[0_24px_54px_rgba(15,23,42,0.18)]',
        className
      )}
    >
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {organizationName}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground/80">
              Manage seats, plan limits, and upgrades.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="subtle" className="uppercase tracking-wide">
              {planBadge ?? 'Active'}
            </Badge>
            <span className="text-sm font-medium text-foreground">
              {planName}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground/80">
            <span>Seats used</span>
            <span>
              {seatUsage.used}/{seatUsage.total} •{' '}
              {formatUsage(seatUsage.used, seatUsage.total)}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Seat usage"
            aria-valuemin={0}
            aria-valuemax={seatUsage.total}
            aria-valuenow={seatUsage.used}
            className="relative h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--surface-muted))]"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground/70">
            {seatUsage.used === seatUsage.total
              ? 'All seats allocated. Upgrade or reassign to invite more teammates.'
              : 'Invite more teammates to collaborate with the AI assistant.'}
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-border/50 bg-muted p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground/80">
            <span>Renewal</span>
            <span>{renewalDate ?? 'Contact sales'}</span>
          </div>
          {apiUsage && (
            <div className="flex items-center justify-between text-sm text-muted-foreground/80">
              <span>{apiUsage.label}</span>
              <span className="font-semibold text-foreground">
                {apiUsage.value}
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <Button
                key={action.id}
                variant="surface"
                size="sm"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground/70">
        Need custom terms or higher limits?{' '}
        <span className="text-primary">Contact enterprise sales →</span>
      </CardFooter>
    </Card>
  )
}

AuthTenantDashboard.displayName = 'AuthTenantDashboard'
