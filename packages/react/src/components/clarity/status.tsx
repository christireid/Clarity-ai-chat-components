'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  Circle,
  Info,
  Wifi,
  WifiOff,
  Server,
  Activity,
  Zap,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'

// Status Badge
export type StatusType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'pending'
  | 'idle'

export interface StatusBadgeProps {
  status: StatusType
  label?: string
  showIcon?: boolean
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function StatusBadge({
  status,
  label,
  showIcon = true,
  size = 'default',
  className,
}: StatusBadgeProps) {
  const config = {
    success: {
      icon: CheckCircle2,
      label: 'Success',
      variant: 'default' as const,
      classes: 'bg-green-500/10 text-green-500 border-green-500/20',
    },
    error: {
      icon: XCircle,
      label: 'Error',
      variant: 'destructive' as const,
      classes: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
    warning: {
      icon: AlertCircle,
      label: 'Warning',
      variant: 'default' as const,
      classes: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    },
    info: {
      icon: Info,
      label: 'Info',
      variant: 'default' as const,
      classes: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    pending: {
      icon: Loader2,
      label: 'Pending',
      variant: 'secondary' as const,
      classes: 'bg-muted text-muted-foreground',
    },
    idle: {
      icon: Circle,
      label: 'Idle',
      variant: 'outline' as const,
      classes: 'text-muted-foreground',
    },
  }

  const { icon: Icon, label: defaultLabel, classes } = config[status]
  const iconSize =
    size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5',
        classes,
        size === 'sm' && 'text-xs px-2 py-0',
        size === 'lg' && 'text-sm px-3 py-1',
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(iconSize, status === 'pending' && 'animate-spin')}
        />
      )}
      {label || defaultLabel}
    </Badge>
  )
}

// Status Dot
export interface StatusDotProps {
  status: StatusType
  pulse?: boolean
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function StatusDot({
  status,
  pulse = false,
  size = 'default',
  className,
}: StatusDotProps) {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    pending: 'bg-muted-foreground',
    idle: 'bg-muted-foreground/50',
  }

  const sizes = {
    sm: 'h-2 w-2',
    default: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
  }

  return (
    <span className={cn('relative inline-flex', className)}>
      <span className={cn('rounded-full', colors[status], sizes[size])} />
      {pulse && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
            colors[status]
          )}
        />
      )}
    </span>
  )
}

// Online Status Indicator
export interface OnlineStatusProps {
  isOnline: boolean
  showLabel?: boolean
  className?: string
}

export function OnlineStatus({
  isOnline,
  showLabel = true,
  className,
}: OnlineStatusProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <StatusDot status={isOnline ? 'success' : 'error'} pulse={isOnline} />
      {showLabel && (
        <span className="text-sm text-muted-foreground">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      )}
    </div>
  )
}

// Connection Status
export interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'error'
  showDetails?: boolean
  latency?: number
  className?: string
}

export function ConnectionStatus({
  status,
  showDetails = false,
  latency,
  className,
}: ConnectionStatusProps) {
  const config = {
    connected: {
      icon: Wifi,
      label: 'Connected',
      color: 'text-green-500',
      dot: 'success' as StatusType,
    },
    connecting: {
      icon: Loader2,
      label: 'Connecting',
      color: 'text-yellow-500',
      dot: 'warning' as StatusType,
    },
    disconnected: {
      icon: WifiOff,
      label: 'Disconnected',
      color: 'text-muted-foreground',
      dot: 'idle' as StatusType,
    },
    error: {
      icon: WifiOff,
      label: 'Connection Error',
      color: 'text-red-500',
      dot: 'error' as StatusType,
    },
  }

  const { icon: Icon, label, color, dot } = config[status]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-2', className)}>
            <StatusDot status={dot} pulse={status === 'connected'} />
            <Icon
              className={cn(
                'h-4 w-4',
                color,
                status === 'connecting' && 'animate-spin'
              )}
            />
            {showDetails && (
              <span className={cn('text-sm', color)}>{label}</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>{label}</p>
            {latency !== undefined && status === 'connected' && (
              <p className="text-muted-foreground">{latency}ms latency</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Server Status
export interface ServerStatusProps {
  name: string
  status: 'healthy' | 'degraded' | 'down' | 'maintenance'
  uptime?: string
  lastCheck?: Date
  className?: string
}

export function ServerStatus({
  name,
  status,
  uptime,
  lastCheck,
  className,
}: ServerStatusProps) {
  const config = {
    healthy: { icon: Server, color: 'text-green-500', bg: 'bg-green-500/10' },
    degraded: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    down: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    maintenance: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  }

  const { icon: Icon, color, bg } = config[status]

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border border-border',
        className
      )}
    >
      <div className={cn('p-2 rounded-md', bg)}>
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">{name}</span>
          <StatusBadge
            status={
              status === 'healthy'
                ? 'success'
                : status === 'degraded'
                  ? 'warning'
                  : status === 'down'
                    ? 'error'
                    : 'info'
            }
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="sm"
          />
        </div>
        {(uptime || lastCheck) && (
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            {uptime && <span>Uptime: {uptime}</span>}
            {lastCheck && (
              <span>Last check: {lastCheck.toLocaleTimeString()}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// System Health Overview
export interface SystemHealthProps {
  services: Array<{
    name: string
    status: 'healthy' | 'degraded' | 'down'
  }>
  className?: string
}

export function SystemHealth({ services, className }: SystemHealthProps) {
  const healthyCount = services.filter((s) => s.status === 'healthy').length
  const degradedCount = services.filter((s) => s.status === 'degraded').length
  const downCount = services.filter((s) => s.status === 'down').length

  const overallStatus =
    downCount > 0 ? 'down' : degradedCount > 0 ? 'degraded' : 'healthy'

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">System Health</h3>
        <StatusBadge
          status={
            overallStatus === 'healthy'
              ? 'success'
              : overallStatus === 'degraded'
                ? 'warning'
                : 'error'
          }
          label={
            overallStatus === 'healthy'
              ? 'All Systems Operational'
              : overallStatus === 'degraded'
                ? 'Degraded Performance'
                : 'System Outage'
          }
        />
      </div>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <StatusDot status="success" />
          <span>{healthyCount} Healthy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot status="warning" />
          <span>{degradedCount} Degraded</span>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot status="error" />
          <span>{downCount} Down</span>
        </div>
      </div>

      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <span className="text-sm">{service.name}</span>
            <StatusDot
              status={
                service.status === 'healthy'
                  ? 'success'
                  : service.status === 'degraded'
                    ? 'warning'
                    : 'error'
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Activity Indicator
export interface ActivityIndicatorProps {
  isActive: boolean
  label?: string
  className?: string
}

export function ActivityIndicator({
  isActive,
  label,
  className,
}: ActivityIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Activity
        className={cn(
          'h-4 w-4',
          isActive ? 'text-green-500 animate-pulse' : 'text-muted-foreground'
        )}
      />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  )
}

// Security Status
export interface SecurityStatusProps {
  status: 'secure' | 'warning' | 'critical'
  message?: string
  className?: string
}

export function SecurityStatus({
  status,
  message,
  className,
}: SecurityStatusProps) {
  const config = {
    secure: {
      icon: ShieldCheck,
      label: 'Secure',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    warning: {
      icon: ShieldAlert,
      label: 'Warning',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    critical: {
      icon: Shield,
      label: 'Critical',
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
  }

  const { icon: Icon, label, color, bg } = config[status]

  return (
    <div
      className={cn('flex items-center gap-3 p-3 rounded-lg', bg, className)}
    >
      <Icon className={cn('h-5 w-5', color)} />
      <div>
        <div className={cn('font-medium text-sm', color)}>{label}</div>
        {message && (
          <div className="text-xs text-muted-foreground">{message}</div>
        )}
      </div>
    </div>
  )
}

// Performance Indicator
export interface PerformanceIndicatorProps {
  value: number
  max?: number
  label?: string
  thresholds?: { warning: number; critical: number }
  className?: string
}

export function PerformanceIndicator({
  value,
  max = 100,
  label,
  thresholds = { warning: 70, critical: 90 },
  className,
}: PerformanceIndicatorProps) {
  const percentage = (value / max) * 100
  const status =
    percentage >= thresholds.critical
      ? 'error'
      : percentage >= thresholds.warning
        ? 'warning'
        : 'success'

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        {label && <span className="text-muted-foreground">{label}</span>}
        <div className="flex items-center gap-2">
          <Zap
            className={cn(
              'h-4 w-4',
              status === 'success'
                ? 'text-green-500'
                : status === 'warning'
                  ? 'text-yellow-500'
                  : 'text-red-500'
            )}
          />
          <span className="font-medium">{value.toFixed(1)}%</span>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            status === 'success'
              ? 'bg-green-500'
              : status === 'warning'
                ? 'bg-yellow-500'
                : 'bg-red-500'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}
