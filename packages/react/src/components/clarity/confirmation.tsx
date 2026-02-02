'use client'

import * as React from 'react'
import {
  AlertTriangle,
  Check,
  X,
  Shield,
  Zap,
  Clock,
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Code,
  Terminal,
  Database,
  Globe,
  FileEdit,
  Trash2,
  Send,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Checkbox } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'
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
import { cn } from '@clarity-chat/primitives'

// Types
export type ConfirmationStatus =
  | 'pending'
  | 'approved'
  | 'denied'
  | 'expired'
  | 'auto-approved'

export type ToolRiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface ToolExecution {
  id: string
  name: string
  description?: string
  parameters?: Record<string, unknown>
  riskLevel: ToolRiskLevel
  category?: string
  estimatedDuration?: string
  reversible?: boolean
  status: ConfirmationStatus
  timestamp: Date
  expiresAt?: Date
}

// Risk Level Badge
export interface RiskBadgeProps {
  level: ToolRiskLevel
  showLabel?: boolean
  className?: string
}

export function RiskBadge({
  level,
  showLabel = true,
  className,
}: RiskBadgeProps) {
  const config = {
    low: {
      color: 'bg-green-500/10 text-green-500 border-green-500/20',
      label: 'Low Risk',
    },
    medium: {
      color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      label: 'Medium Risk',
    },
    high: {
      color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      label: 'High Risk',
    },
    critical: {
      color: 'bg-red-500/10 text-red-500 border-red-500/20',
      label: 'Critical',
    },
  }

  const { color, label } = config[level]

  return (
    <Badge variant="outline" className={cn(color, className)}>
      <Shield className="h-3 w-3 mr-1" />
      {showLabel ? label : level.charAt(0).toUpperCase()}
    </Badge>
  )
}

// Tool Confirmation Card
export interface ToolConfirmationCardProps {
  execution: ToolExecution
  onApprove?: (id: string) => void
  onDeny?: (id: string) => void
  onViewDetails?: (id: string) => void
  showParameters?: boolean
  compact?: boolean
  className?: string
}

export function ToolConfirmationCard({
  execution,
  onApprove,
  onDeny,
  onViewDetails,
  showParameters = true,
  compact = false,
  className,
}: ToolConfirmationCardProps) {
  const [expanded, setExpanded] = React.useState(false)
  const [showParams, setShowParams] = React.useState(false)

  const categoryIcons: Record<string, React.ReactNode> = {
    code: <Code className="h-4 w-4" />,
    terminal: <Terminal className="h-4 w-4" />,
    database: <Database className="h-4 w-4" />,
    web: <Globe className="h-4 w-4" />,
    file: <FileEdit className="h-4 w-4" />,
    delete: <Trash2 className="h-4 w-4" />,
    default: <Zap className="h-4 w-4" />,
  }

  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-500', label: 'Pending' },
    approved: {
      icon: CheckCircle2,
      color: 'text-green-500',
      label: 'Approved',
    },
    denied: { icon: XCircle, color: 'text-red-500', label: 'Denied' },
    expired: {
      icon: AlertCircle,
      color: 'text-muted-foreground',
      label: 'Expired',
    },
    'auto-approved': {
      icon: CheckCircle2,
      color: 'text-blue-500',
      label: 'Auto-approved',
    },
  }

  const status = statusConfig[execution.status]
  const StatusIcon = status.icon
  const isPending = execution.status === 'pending'

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border',
          isPending ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-border',
          className
        )}
      >
        <div className="p-2 rounded-lg bg-muted">
          {categoryIcons[execution.category || 'default']}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">
              {execution.name}
            </span>
            <RiskBadge level={execution.riskLevel} showLabel={false} />
          </div>
          {execution.description && (
            <p className="text-xs text-muted-foreground truncate">
              {execution.description}
            </p>
          )}
        </div>
        {isPending ? (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 bg-transparent"
              onClick={() => onDeny?.(execution.id)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              className="h-7"
              onClick={() => onApprove?.(execution.id)}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <div className={cn('flex items-center gap-1', status.color)}>
            <StatusIcon className="h-4 w-4" />
            <span className="text-xs">{status.label}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card
      className={cn(
        isPending && 'border-yellow-500/50 shadow-yellow-500/10 shadow-sm',
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'p-2 rounded-lg',
                isPending ? 'bg-yellow-500/10' : 'bg-muted'
              )}
            >
              {categoryIcons[execution.category || 'default']}
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {execution.name}
                <RiskBadge level={execution.riskLevel} />
              </CardTitle>
              {execution.description && (
                <CardDescription className="mt-0.5">
                  {execution.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className={cn('flex items-center gap-1', status.color)}>
            <StatusIcon className="h-4 w-4" />
            <span className="text-sm">{status.label}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Metadata */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {execution.estimatedDuration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {execution.estimatedDuration}
            </span>
          )}
          {execution.reversible !== undefined && (
            <span className="flex items-center gap-1">
              {execution.reversible ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  Reversible
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Irreversible
                </>
              )}
            </span>
          )}
          {execution.expiresAt && isPending && (
            <span className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Expires: {execution.expiresAt.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Parameters */}
        {showParameters &&
          execution.parameters &&
          Object.keys(execution.parameters).length > 0 && (
            <Collapsible open={showParams} onOpenChange={setShowParams}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  {showParams ? (
                    <ChevronDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ChevronRight className="h-3 w-3 mr-1" />
                  )}
                  {showParams ? 'Hide' : 'Show'} Parameters
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 p-3 rounded-md bg-muted/50 font-mono text-xs overflow-auto">
                  <pre>{JSON.stringify(execution.parameters, null, 2)}</pre>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
      </CardContent>

      {isPending && (
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button variant="outline" onClick={() => onDeny?.(execution.id)}>
            <X className="h-4 w-4 mr-1" />
            Deny
          </Button>
          <Button onClick={() => onApprove?.(execution.id)}>
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// Confirmation Dialog
export interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  execution: ToolExecution | null
  onApprove: (id: string) => void
  onDeny: (id: string) => void
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  execution,
  onApprove,
  onDeny,
}: ConfirmationDialogProps) {
  const [dontAskAgain, setDontAskAgain] = React.useState(false)

  if (!execution) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Confirm Tool Execution
          </DialogTitle>
          <DialogDescription>
            The AI wants to execute the following action. Please review and
            confirm.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <ToolConfirmationCard
            execution={execution}
            showParameters
            compact={false}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-ask"
              checked={dontAskAgain}
              onCheckedChange={(checked) => setDontAskAgain(checked as boolean)}
            />
            <Label htmlFor="dont-ask" className="text-sm text-muted-foreground">
              Always allow this tool (can be changed in settings)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onDeny(execution.id)
              onOpenChange(false)
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Deny
          </Button>
          <Button
            onClick={() => {
              onApprove(execution.id)
              onOpenChange(false)
            }}
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Bulk Confirmation Component
export interface BulkConfirmationProps {
  executions: ToolExecution[]
  onApproveAll: () => void
  onDenyAll: () => void
  onApprove: (id: string) => void
  onDeny: (id: string) => void
  className?: string
}

export function BulkConfirmation({
  executions,
  onApproveAll,
  onDenyAll,
  onApprove,
  onDeny,
  className,
}: BulkConfirmationProps) {
  const pendingExecutions = executions.filter((e) => e.status === 'pending')

  if (pendingExecutions.length === 0) return null

  return (
    <Card className={cn('border-yellow-500/50', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-base">
              {pendingExecutions.length} Action
              {pendingExecutions.length > 1 ? 's' : ''} Pending Approval
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onDenyAll}>
              <X className="h-4 w-4 mr-1" />
              Deny All
            </Button>
            <Button size="sm" onClick={onApproveAll}>
              <Check className="h-4 w-4 mr-1" />
              Approve All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-64">
          <div className="space-y-2">
            {pendingExecutions.map((execution) => (
              <ToolConfirmationCard
                key={execution.id}
                execution={execution}
                onApprove={onApprove}
                onDeny={onDeny}
                compact
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Execution History
export interface ExecutionHistoryProps {
  executions: ToolExecution[]
  onClear?: () => void
  className?: string
}

export function ExecutionHistory({
  executions,
  onClear,
  className,
}: ExecutionHistoryProps) {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-500' },
    approved: { icon: CheckCircle2, color: 'text-green-500' },
    denied: { icon: XCircle, color: 'text-red-500' },
    expired: { icon: AlertCircle, color: 'text-muted-foreground' },
    'auto-approved': { icon: CheckCircle2, color: 'text-blue-500' },
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Execution History</CardTitle>
          {onClear && executions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={onClear}
            >
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {executions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No executions yet
          </p>
        ) : (
          <ScrollArea className="max-h-64">
            <div className="space-y-2">
              {executions.map((execution) => {
                const status = statusConfig[execution.status]
                const StatusIcon = status.icon

                return (
                  <div
                    key={execution.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                  >
                    <StatusIcon
                      className={cn('h-4 w-4 flex-shrink-0', status.color)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {execution.name}
                        </span>
                        <RiskBadge
                          level={execution.riskLevel}
                          showLabel={false}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {execution.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

// Auto-Approve Settings
export interface AutoApproveSettingsProps {
  settings: {
    toolName: string
    riskLevel: ToolRiskLevel
    enabled: boolean
  }[]
  onToggle: (toolName: string) => void
  onReset?: () => void
  className?: string
}

export function AutoApproveSettings({
  settings,
  onToggle,
  onReset,
  className,
}: AutoApproveSettingsProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">Auto-Approve Settings</CardTitle>
            <CardDescription className="text-xs">
              Configure which tools can be executed automatically
            </CardDescription>
          </div>
          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={onReset}
            >
              Reset All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {settings.map((setting) => (
            <div
              key={setting.toolName}
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{setting.toolName}</span>
                <RiskBadge level={setting.riskLevel} showLabel={false} />
              </div>
              <Checkbox
                checked={setting.enabled}
                onCheckedChange={() => onToggle(setting.toolName)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Inline Confirmation (for inline tool calls in messages)
export interface InlineConfirmationProps {
  execution: ToolExecution
  onApprove: () => void
  onDeny: () => void
  className?: string
}

export function InlineConfirmation({
  execution,
  onApprove,
  onDeny,
  className,
}: InlineConfirmationProps) {
  const isPending = execution.status === 'pending'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
        isPending
          ? 'bg-yellow-500/10 border border-yellow-500/30'
          : execution.status === 'approved'
            ? 'bg-green-500/10 border border-green-500/30'
            : 'bg-red-500/10 border border-red-500/30',
        className
      )}
    >
      <Zap className="h-4 w-4" />
      <span className="font-medium">{execution.name}</span>
      <RiskBadge level={execution.riskLevel} showLabel={false} />

      {isPending ? (
        <div className="flex items-center gap-1 ml-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={onDeny}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Deny</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                  onClick={onApprove}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Approve</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <Badge
          variant="outline"
          className={cn(
            'ml-2',
            execution.status === 'approved'
              ? 'border-green-500/50 text-green-500'
              : 'border-red-500/50 text-red-500'
          )}
        >
          {execution.status === 'approved' ? 'Approved' : 'Denied'}
        </Badge>
      )}
    </div>
  )
}
