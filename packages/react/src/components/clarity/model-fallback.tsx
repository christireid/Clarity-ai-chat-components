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
import { Badge } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import {
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  ArrowRight,
  ArrowDown,
  Settings,
  Shield,
  TrendingUp,
  Loader2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'

// Types
export interface ModelConfig {
  id: string
  name: string
  provider: string
  priority: number
  enabled: boolean
  maxRetries: number
  timeout: number
  healthStatus: 'healthy' | 'degraded' | 'down'
  latency?: number
  successRate?: number
  lastUsed?: Date
  costPer1kTokens?: number
}

export interface FallbackAttempt {
  modelId: string
  modelName: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped'
  startTime?: Date
  endTime?: Date
  duration?: number
  error?: string
  retryCount?: number
}

export interface FallbackConfig {
  enabled: boolean
  maxAttempts: number
  retryDelay: number
  fallbackOnRateLimit: boolean
  fallbackOnTimeout: boolean
  fallbackOnError: boolean
}

// Model Health Badge
interface ModelHealthBadgeProps {
  status: ModelConfig['healthStatus']
  className?: string
}

export function ModelHealthBadge({ status, className }: ModelHealthBadgeProps) {
  const config = {
    healthy: {
      icon: CheckCircle,
      label: 'Healthy',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    degraded: {
      icon: AlertTriangle,
      label: 'Degraded',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    down: {
      icon: XCircle,
      label: 'Down',
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
  }

  const { icon: Icon, label, color, bg } = config[status]

  return (
    <Badge variant="outline" className={cn('gap-1', bg, className)}>
      <Icon className={cn('h-3 w-3', color)} />
      {label}
    </Badge>
  )
}

// Model Card
interface ModelCardProps {
  model: ModelConfig
  onToggle?: (enabled: boolean) => void
  onPriorityChange?: (priority: number) => void
  onConfigure?: () => void
  isDragging?: boolean
  className?: string
}

export function ModelCard({
  model,
  onToggle,
  onPriorityChange,
  onConfigure,
  isDragging,
  className,
}: ModelCardProps) {
  return (
    <div
      className={cn(
        'border rounded-lg p-4 space-y-3 bg-background',
        isDragging && 'opacity-50',
        !model.enabled && 'opacity-60',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => onPriorityChange?.(model.priority - 1)}
              disabled={model.priority <= 1}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <span className="text-xs font-mono text-muted-foreground">
              #{model.priority}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => onPriorityChange?.(model.priority + 1)}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
          <div>
            <p className="font-medium">{model.name}</p>
            <p className="text-xs text-muted-foreground">{model.provider}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModelHealthBadge status={model.healthStatus} />
          <Switch checked={model.enabled} onCheckedChange={onToggle} />
        </div>
      </div>

      {model.enabled && (
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Latency</p>
            <p className="font-mono">
              {model.latency ? `${model.latency}ms` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Success Rate</p>
            <p className="font-mono">
              {model.successRate
                ? `${(model.successRate * 100).toFixed(1)}%`
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Cost/1K</p>
            <p className="font-mono">
              {model.costPer1kTokens
                ? `$${model.costPer1kTokens.toFixed(4)}`
                : 'N/A'}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Max retries: {model.maxRetries}</span>
          <span>|</span>
          <span>Timeout: {model.timeout}s</span>
        </div>
        {onConfigure && (
          <Button variant="ghost" size="sm" onClick={onConfigure}>
            <Settings className="h-3 w-3 mr-1" />
            Configure
          </Button>
        )}
      </div>
    </div>
  )
}

// Fallback Chain Visualizer
interface FallbackChainProps {
  models: ModelConfig[]
  currentAttempt?: number
  className?: string
}

export function FallbackChain({
  models,
  currentAttempt,
  className,
}: FallbackChainProps) {
  const enabledModels = models
    .filter((m) => m.enabled)
    .sort((a, b) => a.priority - b.priority)

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {enabledModels.map((model, index) => (
        <React.Fragment key={model.id}>
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2 border rounded-lg',
              currentAttempt === index && 'border-primary bg-primary/10',
              currentAttempt !== undefined &&
                currentAttempt > index &&
                'border-green-500 bg-green-500/10',
              currentAttempt !== undefined &&
                currentAttempt < index &&
                'opacity-50'
            )}
          >
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                model.healthStatus === 'healthy' && 'bg-green-500',
                model.healthStatus === 'degraded' && 'bg-yellow-500',
                model.healthStatus === 'down' && 'bg-red-500'
              )}
            />
            <span className="text-sm font-medium">{model.name}</span>
          </div>
          {index < enabledModels.length - 1 && (
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// Retry Progress
interface RetryProgressProps {
  attempts: FallbackAttempt[]
  maxAttempts: number
  className?: string
}

export function RetryProgress({
  attempts,
  maxAttempts,
  className,
}: RetryProgressProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Fallback Progress</span>
        <span className="font-mono">
          {attempts.filter((a) => a.status !== 'pending').length} /{' '}
          {maxAttempts}
        </span>
      </div>

      <div className="space-y-2">
        {attempts.map((attempt, index) => {
          const statusConfig = {
            pending: {
              icon: Clock,
              color: 'text-muted-foreground',
              bg: 'bg-muted',
            },
            running: {
              icon: Loader2,
              color: 'text-blue-500',
              bg: 'bg-blue-500/10',
            },
            success: {
              icon: CheckCircle,
              color: 'text-green-500',
              bg: 'bg-green-500/10',
            },
            failed: {
              icon: XCircle,
              color: 'text-red-500',
              bg: 'bg-red-500/10',
            },
            skipped: {
              icon: ArrowRight,
              color: 'text-muted-foreground',
              bg: 'bg-muted',
            },
          }

          const config = statusConfig[attempt.status]
          const Icon = config.icon

          return (
            <div
              key={attempt.modelId}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg',
                config.bg
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4',
                  config.color,
                  attempt.status === 'running' && 'animate-spin'
                )}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {attempt.modelName}
                  </span>
                  {attempt.duration && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {attempt.duration}ms
                    </span>
                  )}
                </div>
                {attempt.error && (
                  <p className="text-xs text-red-500 mt-0.5">{attempt.error}</p>
                )}
                {attempt.retryCount !== undefined && attempt.retryCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Retry #{attempt.retryCount}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Fallback Settings
interface FallbackSettingsProps {
  config: FallbackConfig
  onChange: (config: Partial<FallbackConfig>) => void
  className?: string
}

export function FallbackSettings({
  config,
  onChange,
  className,
}: FallbackSettingsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Fallback Settings
        </CardTitle>
        <CardDescription>
          Configure automatic model fallback behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Fallback</Label>
            <p className="text-xs text-muted-foreground">
              Automatically try backup models on failure
            </p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(enabled) => onChange({ enabled })}
          />
        </div>

        {config.enabled && (
          <>
            <div className="space-y-2">
              <Label>Max Attempts</Label>
              <input
                type="number"
                value={config.maxAttempts}
                onChange={(e) =>
                  onChange({ maxAttempts: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md bg-background"
                min={1}
                max={10}
              />
            </div>

            <div className="space-y-2">
              <Label>Retry Delay (ms)</Label>
              <input
                type="number"
                value={config.retryDelay}
                onChange={(e) =>
                  onChange({ retryDelay: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md bg-background"
                min={0}
                step={100}
              />
            </div>

            <div className="space-y-3 pt-2 border-t">
              <p className="text-sm font-medium">Fallback Triggers</p>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">On Rate Limit</Label>
                <Switch
                  checked={config.fallbackOnRateLimit}
                  onCheckedChange={(fallbackOnRateLimit) =>
                    onChange({ fallbackOnRateLimit })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">On Timeout</Label>
                <Switch
                  checked={config.fallbackOnTimeout}
                  onCheckedChange={(fallbackOnTimeout) =>
                    onChange({ fallbackOnTimeout })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">On Error</Label>
                <Switch
                  checked={config.fallbackOnError}
                  onCheckedChange={(fallbackOnError) =>
                    onChange({ fallbackOnError })
                  }
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Model Manager
interface ModelManagerProps {
  models: ModelConfig[]
  fallbackConfig: FallbackConfig
  onModelToggle?: (id: string, enabled: boolean) => void
  onModelReorder?: (models: ModelConfig[]) => void
  onFallbackConfigChange?: (config: Partial<FallbackConfig>) => void
  className?: string
}

export function ModelManager({
  models,
  fallbackConfig,
  onModelToggle,
  onModelReorder,
  onFallbackConfigChange,
  className,
}: ModelManagerProps) {
  const sortedModels = [...models].sort((a, b) => a.priority - b.priority)

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Model Priority
          </CardTitle>
          <CardDescription>
            Drag to reorder models. Higher priority models are tried first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <FallbackChain models={sortedModels} />
          </div>
          <div className="space-y-3">
            {sortedModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onToggle={(enabled) => onModelToggle?.(model.id, enabled)}
                onPriorityChange={(priority) => {
                  const updated = models.map((m) => {
                    if (m.id === model.id) return { ...m, priority }
                    if (m.priority === priority)
                      return { ...m, priority: model.priority }
                    return m
                  })
                  onModelReorder?.(updated)
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {onFallbackConfigChange && (
        <FallbackSettings
          config={fallbackConfig}
          onChange={onFallbackConfigChange}
        />
      )}
    </div>
  )
}

// Retry Banner
interface RetryBannerProps {
  attempt: number
  maxAttempts: number
  modelName: string
  onCancel?: () => void
  className?: string
}

export function RetryBanner({
  attempt,
  maxAttempts,
  modelName,
  onCancel,
  className,
}: RetryBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20',
        className
      )}
    >
      <RotateCcw className="h-4 w-4 text-yellow-500 animate-spin" />
      <div className="flex-1">
        <p className="text-sm font-medium">Retrying with {modelName}</p>
        <p className="text-xs text-muted-foreground">
          Attempt {attempt} of {maxAttempts}
        </p>
      </div>
      {onCancel && (
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  )
}

// Success Fallback Notification
interface FallbackSuccessProps {
  originalModel: string
  usedModel: string
  attempts: number
  totalTime: number
  onDismiss?: () => void
  className?: string
}

export function FallbackSuccess({
  originalModel,
  usedModel,
  attempts,
  totalTime,
  onDismiss,
  className,
}: FallbackSuccessProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20',
        className
      )}
    >
      <CheckCircle className="h-4 w-4 text-green-500" />
      <div className="flex-1">
        <p className="text-sm font-medium">
          Fallback successful: {originalModel} → {usedModel}
        </p>
        <p className="text-xs text-muted-foreground">
          Completed after {attempts} {attempts === 1 ? 'attempt' : 'attempts'}{' '}
          in {totalTime}ms
        </p>
      </div>
      {onDismiss && (
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      )}
    </div>
  )
}
