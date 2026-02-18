'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Brain,
  Zap,
  GitBranch,
  MessageSquare,
  Database,
  Globe,
  Code,
  FileText,
  ImageIcon,
  Mail,
  Bell,
  Clock,
  Filter,
  Shuffle,
  Repeat,
  Play,
  Square,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  Settings,
  MoreHorizontal,
  Trash2,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'

// Node Status Types
type NodeStatus = 'idle' | 'running' | 'success' | 'error' | 'waiting'

// Base Workflow Node
interface WorkflowNodeProps {
  id: string
  type: string
  label: string
  description?: string
  icon?: React.ReactNode
  status?: NodeStatus
  selected?: boolean
  onSelect?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onConfigure?: () => void
  children?: React.ReactNode
  className?: string
}

export function WorkflowNode({
  id,
  type,
  label,
  description,
  icon,
  status = 'idle',
  selected,
  onSelect,
  onDelete,
  onDuplicate,
  onConfigure,
  children,
  className,
}: WorkflowNodeProps) {
  const statusColor = {
    idle: 'bg-muted',
    running: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    waiting: 'bg-yellow-500',
  }

  const statusIcon = {
    idle: null,
    running: <Loader2 className="w-3 h-3 animate-spin" />,
    success: <CheckCircle2 className="w-3 h-3" />,
    error: <XCircle className="w-3 h-3" />,
    waiting: <Clock className="w-3 h-3" />,
  }

  return (
    <div
      className={cn(
        'min-w-[200px] rounded-lg border-2 bg-card shadow-sm transition-all',
        selected
          ? 'border-accent ring-4 ring-accent/20'
          : 'border-border hover:border-muted-foreground',
        className
      )}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          {icon || <Zap className="w-4 h-4 text-muted-foreground" />}
          <span className="font-medium text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          {status !== 'idle' && (
            <div
              className={cn(
                'flex items-center justify-center w-5 h-5 rounded-full text-white',
                statusColor[status]
              )}
            >
              {statusIcon[status]}
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onConfigure}>
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      {(description || children) && (
        <div className="p-3">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {children}
        </div>
      )}

      {/* Type Badge */}
      <div className="px-3 pb-2">
        <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">
          {type}
        </span>
      </div>

      {/* Connection Points */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-muted-foreground/30 hover:border-accent hover:bg-accent/10 cursor-crosshair" />
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-muted-foreground/30 hover:border-accent hover:bg-accent/10 cursor-crosshair" />
    </div>
  )
}

// Specialized Node Types
export function AINode({
  model = 'GPT-4',
  temperature = 0.7,
  ...props
}: Omit<WorkflowNodeProps, 'type' | 'icon'> & {
  model?: string
  temperature?: number
}) {
  return (
    <WorkflowNode
      {...props}
      type="ai"
      icon={<Brain className="w-4 h-4 text-purple-500" />}
    >
      <div className="space-y-2 mt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Model</span>
          <span className="font-mono">{model}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Temperature</span>
          <span className="font-mono">{temperature}</span>
        </div>
      </div>
    </WorkflowNode>
  )
}

export function TriggerNode({
  triggerType = 'manual',
  ...props
}: Omit<WorkflowNodeProps, 'type' | 'icon'> & {
  triggerType?: 'manual' | 'schedule' | 'webhook' | 'event'
}) {
  const triggerIcons = {
    manual: <Play className="w-4 h-4 text-green-500" />,
    schedule: <Clock className="w-4 h-4 text-blue-500" />,
    webhook: <Globe className="w-4 h-4 text-orange-500" />,
    event: <Zap className="w-4 h-4 text-yellow-500" />,
  }

  return (
    <WorkflowNode
      {...props}
      type="trigger"
      icon={triggerIcons[triggerType]}
      description={`Trigger: ${triggerType}`}
    />
  )
}

export function ConditionNode({
  condition,
  ...props
}: Omit<WorkflowNodeProps, 'type' | 'icon'> & {
  condition?: string
}) {
  return (
    <WorkflowNode
      {...props}
      type="condition"
      icon={<GitBranch className="w-4 h-4 text-yellow-500" />}
    >
      {condition && (
        <code className="block mt-2 p-2 rounded bg-muted text-xs font-mono">
          {condition}
        </code>
      )}
    </WorkflowNode>
  )
}

export function ActionNode({
  actionType = 'http',
  ...props
}: Omit<WorkflowNodeProps, 'type' | 'icon'> & {
  actionType?: 'http' | 'email' | 'database' | 'code' | 'notification'
}) {
  const actionIcons = {
    http: <Globe className="w-4 h-4 text-blue-500" />,
    email: <Mail className="w-4 h-4 text-pink-500" />,
    database: <Database className="w-4 h-4 text-green-500" />,
    code: <Code className="w-4 h-4 text-orange-500" />,
    notification: <Bell className="w-4 h-4 text-purple-500" />,
  }

  return (
    <WorkflowNode {...props} type="action" icon={actionIcons[actionType]} />
  )
}

export function LoopNode({
  iterations,
  ...props
}: Omit<WorkflowNodeProps, 'type' | 'icon'> & {
  iterations?: number | 'infinite'
}) {
  return (
    <WorkflowNode
      {...props}
      type="loop"
      icon={<Repeat className="w-4 h-4 text-cyan-500" />}
    >
      <div className="mt-2 text-xs">
        <span className="text-muted-foreground">Iterations: </span>
        <span className="font-mono">{iterations || 'until condition'}</span>
      </div>
    </WorkflowNode>
  )
}

// Node Palette for dragging
interface NodePaletteProps {
  onDragStart?: (nodeType: string) => void
  className?: string
}

export function NodePalette({ onDragStart, className }: NodePaletteProps) {
  const nodeTypes = [
    { type: 'trigger', label: 'Trigger', icon: Play, color: 'text-green-500' },
    { type: 'ai', label: 'AI Model', icon: Brain, color: 'text-purple-500' },
    {
      type: 'condition',
      label: 'Condition',
      icon: GitBranch,
      color: 'text-yellow-500',
    },
    { type: 'action', label: 'Action', icon: Zap, color: 'text-blue-500' },
    { type: 'loop', label: 'Loop', icon: Repeat, color: 'text-cyan-500' },
    { type: 'filter', label: 'Filter', icon: Filter, color: 'text-orange-500' },
    {
      type: 'transform',
      label: 'Transform',
      icon: Shuffle,
      color: 'text-pink-500',
    },
    {
      type: 'message',
      label: 'Message',
      icon: ImageIcon,
      color: 'text-indigo-500',
    },
  ]

  return (
    <div className={cn('p-3 space-y-2', className)}>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Nodes
      </h3>
      <div className="space-y-1">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={() => onDragStart?.(node.type)}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-grab active:cursor-grabbing transition-colors"
          >
            <node.icon className={cn('w-4 h-4', node.color)} />
            <span className="text-sm">{node.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Workflow Execution Status
interface WorkflowStatusProps {
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed'
  currentNode?: string
  progress?: number
  startedAt?: Date
  completedAt?: Date
  error?: string
  className?: string
}

export function WorkflowStatus({
  status,
  currentNode,
  progress,
  startedAt,
  completedAt,
  error,
  className,
}: WorkflowStatusProps) {
  const statusConfig = {
    idle: { label: 'Ready', color: 'text-muted-foreground', bg: 'bg-muted' },
    running: { label: 'Running', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    paused: {
      label: 'Paused',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    completed: {
      label: 'Completed',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    failed: { label: 'Failed', color: 'text-red-500', bg: 'bg-red-500/10' },
  }

  const config = statusConfig[status]

  return (
    <div
      className={cn(
        'rounded-lg border border-border p-4',
        config.bg,
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {status === 'running' && (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          )}
          {status === 'completed' && (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
          {status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
          <span className={cn('font-medium', config.color)}>
            {config.label}
          </span>
        </div>
        {progress !== undefined && (
          <span className="text-sm text-muted-foreground">{progress}%</span>
        )}
      </div>

      {progress !== undefined && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {currentNode && status === 'running' && (
        <p className="text-sm text-muted-foreground">
          Current: <span className="font-medium">{currentNode}</span>
        </p>
      )}

      {error && <p className="text-sm text-red-500 mt-2">Error: {error}</p>}

      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        {startedAt && <span>Started: {startedAt.toLocaleTimeString()}</span>}
        {completedAt && (
          <span>Completed: {completedAt.toLocaleTimeString()}</span>
        )}
      </div>
    </div>
  )
}

// Subgraph Node
interface SubgraphNodeProps extends Omit<WorkflowNodeProps, 'type' | 'icon'> {
  subgraphName: string
  nodeCount?: number
  onExpand?: () => void
}

export function SubgraphNode({
  subgraphName,
  nodeCount,
  onExpand,
  ...props
}: SubgraphNodeProps) {
  return (
    <WorkflowNode
      {...props}
      type="subgraph"
      icon={<Shuffle className="w-4 h-4 text-indigo-500" />}
    >
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Subgraph</span>
          <span className="font-medium">{subgraphName}</span>
        </div>
        {nodeCount !== undefined && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Nodes</span>
            <span className="font-mono">{nodeCount}</span>
          </div>
        )}
        {onExpand && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 bg-transparent"
            onClick={onExpand}
          >
            <ExternalLink className="w-3 h-3 mr-2" />
            Expand
          </Button>
        )}
      </div>
    </WorkflowNode>
  )
}

// Human in the Loop Node
interface HumanInLoopNodeProps extends Omit<
  WorkflowNodeProps,
  'type' | 'icon'
> {
  assignee?: string
  timeout?: number
  waitingForInput?: boolean
  onApprove?: () => void
  onReject?: () => void
}

export function HumanInLoopNode({
  assignee,
  timeout,
  waitingForInput,
  onApprove,
  onReject,
  ...props
}: HumanInLoopNodeProps) {
  return (
    <WorkflowNode
      {...props}
      type="human-in-loop"
      icon={<ImageIcon className="w-4 h-4 text-amber-500" />}
      status={waitingForInput ? 'waiting' : props.status}
    >
      <div className="mt-2 space-y-2">
        {assignee && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Assignee</span>
            <span className="font-medium">{assignee}</span>
          </div>
        )}
        {timeout && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Timeout</span>
            <span className="font-mono">{timeout}s</span>
          </div>
        )}
        {waitingForInput && (
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={onReject}
            >
              Reject
            </Button>
            <Button size="sm" className="flex-1" onClick={onApprove}>
              Approve
            </Button>
          </div>
        )}
      </div>
    </WorkflowNode>
  )
}
