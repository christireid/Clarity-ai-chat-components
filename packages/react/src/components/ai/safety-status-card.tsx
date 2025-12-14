import * as React from 'react'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { AlertTriangleIcon, ShieldCheckIcon, ShieldCloseIcon } from './icons'

export type SafetyStatus = 'pass' | 'warn' | 'fail'

export interface SafetyCheckItem {
  id: string
  label: string
  status: SafetyStatus
  detail?: string
  remediation?: string
}

export interface SafetyStatusCardProps {
  checks: SafetyCheckItem[]
  lastReviewedAt?: Date
  onReviewPolicy?: () => void
  onAcknowledge?: (check: SafetyCheckItem) => void
  className?: string
  title?: string
  subtitle?: string
}

const statusIcon: Record<SafetyStatus, React.ReactNode> = {
  pass: <ShieldCheckIcon size={16} className="text-success" />,
  warn: <AlertTriangleIcon size={16} className="text-warning" />,
  fail: <ShieldCloseIcon size={16} className="text-destructive" />,
}

const statusBadge: Record<SafetyStatus, 'success' | 'warning' | 'destructive'> = {
  pass: 'success',
  warn: 'warning',
  fail: 'destructive',
}

const statusLabel: Record<SafetyStatus, string> = {
  pass: 'Cleared',
  warn: 'Review recommended',
  fail: 'Blocked',
}

const defaultTitle = 'Safety guardrails'
const defaultSubtitle = 'Monitor policy checks on the latest model response before returning it to end-users.'

export const SafetyStatusCard: React.FC<SafetyStatusCardProps> = ({
  checks,
  lastReviewedAt,
  onReviewPolicy,
  onAcknowledge,
  className,
  title = defaultTitle,
  subtitle = defaultSubtitle,
}) => {
  const totalFails = checks.filter((check) => check.status === 'fail').length
  const totalWarnings = checks.filter((check) => check.status === 'warn').length

  const overallStatus: SafetyStatus = totalFails > 0 ? 'fail' : totalWarnings > 0 ? 'warn' : 'pass'

  const reviewedLabel = lastReviewedAt
    ? `Last reviewed ${lastReviewedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    : 'Awaiting review'

  return (
    <Card className={cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-[0_20px_48px_rgba(15,23,42,0.18)]', className)}>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            {statusIcon[overallStatus]}
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">
            {subtitle}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusBadge[overallStatus]}>{statusLabel[overallStatus]}</Badge>
          {onReviewPolicy && (
            <Button variant="ghost" size="sm" onClick={onReviewPolicy}>
              Review policy
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/50 bg-muted p-4 text-xs font-medium text-muted-foreground/80">
          <span>Checks: {checks.length}</span>
          <span>Warnings: {totalWarnings}</span>
          <span>Failures: {totalFails}</span>
          <span>{reviewedLabel}</span>
        </div>

        <ul className="space-y-3">
          {checks.map((check) => (
            <li
              key={check.id}
              className="flex flex-col gap-2 rounded-lg border border-border/50 bg-muted p-4 shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {statusIcon[check.status]}
                  {check.label}
                </div>
                <Badge variant={statusBadge[check.status]} className="text-[11px]">
                  {statusLabel[check.status]}
                </Badge>
              </div>
              {check.detail && (
                <p className="text-sm text-muted-foreground/85">
                  {check.detail}
                </p>
              )}
              {check.remediation && (
                <div className="rounded-lg border border-dashed border-border/50 bg-background/60 p-3 text-xs text-muted-foreground/80">
                  {check.remediation}
                </div>
              )}

              {onAcknowledge && check.status !== 'pass' && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAcknowledge(check)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Acknowledge resolution
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

SafetyStatusCard.displayName = 'SafetyStatusCard'

