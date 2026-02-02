'use client'

import * as React from 'react'
import {
  Play,
  Pause,
  X,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  GripVertical,
  Trash2,
  RefreshCw,
  SkipForward,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

export type QueueItemStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface QueueItem {
  id: string
  title: string
  description?: string
  status: QueueItemStatus
  progress?: number
  error?: string
  priority?: number
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  estimatedDuration?: number
  metadata?: Record<string, unknown>
}

interface QueueProps {
  items: QueueItem[]
  onStart?: () => void
  onPause?: () => void
  onClear?: () => void
  onRemove?: (id: string) => void
  onRetry?: (id: string) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
  onSkip?: (id: string) => void
  isPaused?: boolean
  maxConcurrent?: number
  className?: string
}

export function Queue({
  items,
  onStart,
  onPause,
  onClear,
  onRemove,
  onRetry,
  onReorder,
  onSkip,
  isPaused = false,
  maxConcurrent = 1,
  className,
}: QueueProps) {
  const runningCount = items.filter((i) => i.status === 'running').length
  const pendingCount = items.filter((i) => i.status === 'pending').length
  const completedCount = items.filter((i) => i.status === 'completed').length
  const failedCount = items.filter((i) => i.status === 'failed').length

  const totalProgress =
    items.length > 0
      ? items.reduce((acc, item) => {
          if (item.status === 'completed') return acc + 100
          if (item.status === 'running') return acc + (item.progress || 0)
          return acc
        }, 0) / items.length
      : 0

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border border-border bg-card',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h3 className="font-semibold">Task Queue</h3>
          <p className="text-sm text-muted-foreground">
            {runningCount} running, {pendingCount} pending
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPaused ? (
            <Button variant="default" size="sm" onClick={onStart}>
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={onPause}>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Overall Progress
          </span>
          <span className="text-sm font-medium">
            {Math.round(totalProgress)}%
          </span>
        </div>
        <Progress value={totalProgress} className="h-2" />
        <div className="mt-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span>{runningCount} Running</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
            <span>{pendingCount} Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>{completedCount} Done</span>
          </div>
          {failedCount > 0 && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <span>{failedCount} Failed</span>
            </div>
          )}
        </div>
      </div>

      {/* Queue Items */}
      <ScrollArea className="flex-1 max-h-[400px]">
        <div className="divide-y divide-border">
          {items.map((item, index) => (
            <QueueItemRow
              key={item.id}
              item={item}
              index={index}
              totalItems={items.length}
              onRemove={() => onRemove?.(item.id)}
              onRetry={() => onRetry?.(item.id)}
              onSkip={() => onSkip?.(item.id)}
              onMoveUp={() => index > 0 && onReorder?.(index, index - 1)}
              onMoveDown={() =>
                index < items.length - 1 && onReorder?.(index, index + 1)
              }
            />
          ))}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Clock className="mb-4 h-12 w-12" />
              <p>Queue is empty</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface QueueItemRowProps {
  item: QueueItem
  index: number
  totalItems: number
  onRemove?: () => void
  onRetry?: () => void
  onSkip?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

function QueueItemRow({
  item,
  index,
  totalItems,
  onRemove,
  onRetry,
  onSkip,
  onMoveUp,
  onMoveDown,
}: QueueItemRowProps) {
  const statusIcon = {
    pending: <Clock className="h-4 w-4 text-muted-foreground" />,
    running: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
    completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    failed: <XCircle className="h-4 w-4 text-destructive" />,
    cancelled: <XCircle className="h-4 w-4 text-muted-foreground" />,
  }

  const statusBadge = {
    pending: <Badge variant="secondary">Pending</Badge>,
    running: <Badge className="bg-blue-500">Running</Badge>,
    completed: <Badge className="bg-green-500">Completed</Badge>,
    failed: <Badge variant="destructive">Failed</Badge>,
    cancelled: <Badge variant="secondary">Cancelled</Badge>,
  }

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-4 transition-colors',
        item.status === 'running' && 'bg-blue-500/5'
      )}
    >
      <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onMoveUp}
          disabled={index === 0 || item.status === 'running'}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onMoveDown}
          disabled={index === totalItems - 1 || item.status === 'running'}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-1">{statusIcon[item.status]}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{item.title}</span>
          {statusBadge[item.status]}
        </div>
        {item.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {item.description}
          </p>
        )}
        {item.status === 'running' && item.progress !== undefined && (
          <div className="mt-2">
            <Progress value={item.progress} className="h-1.5" />
            <span className="text-xs text-muted-foreground">
              {item.progress}%
            </span>
          </div>
        )}
        {item.status === 'failed' && item.error && (
          <div className="mt-2 flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{item.error}</span>
          </div>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span>Created {item.createdAt.toLocaleTimeString()}</span>
          {item.estimatedDuration && item.status === 'pending' && (
            <span>Est. {item.estimatedDuration}s</span>
          )}
          {item.completedAt && item.startedAt && (
            <span>
              Took{' '}
              {(
                (item.completedAt.getTime() - item.startedAt.getTime()) /
                1000
              ).toFixed(1)}
              s
            </span>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {item.status === 'pending' && (
            <DropdownMenuItem onClick={onSkip}>
              <SkipForward className="mr-2 h-4 w-4" />
              Skip
            </DropdownMenuItem>
          )}
          {item.status === 'failed' && (
            <DropdownMenuItem onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onRemove} className="text-destructive">
            <X className="mr-2 h-4 w-4" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Plan Component for Model Execution Steps
export interface PlanStep {
  id: string
  title: string
  description?: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  substeps?: PlanStep[]
  output?: string
  duration?: number
}

interface PlanProps {
  steps: PlanStep[]
  title?: string
  className?: string
}

export function Plan({
  steps,
  title = 'Execution Plan',
  className,
}: PlanProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card', className)}>
      <div className="border-b border-border p-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {steps.filter((s) => s.status === 'completed').length} of{' '}
          {steps.length} steps completed
        </p>
      </div>

      <div className="p-4">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-4">
            {steps.map((step, index) => (
              <PlanStepItem
                key={step.id}
                step={step}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlanStepItem({ step, isLast }: { step: PlanStep; isLast: boolean }) {
  const [isExpanded, setIsExpanded] = React.useState(step.status === 'running')

  const statusIcon = {
    pending: (
      <div className="h-6 w-6 rounded-full border-2 border-muted-foreground bg-background" />
    ),
    running: (
      <div className="h-6 w-6 rounded-full border-2 border-blue-500 bg-blue-500/20 flex items-center justify-center">
        <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />
      </div>
    ),
    completed: (
      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
        <CheckCircle2 className="h-4 w-4 text-white" />
      </div>
    ),
    failed: (
      <div className="h-6 w-6 rounded-full bg-destructive flex items-center justify-center">
        <XCircle className="h-4 w-4 text-white" />
      </div>
    ),
    skipped: (
      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
        <SkipForward className="h-3 w-3 text-muted-foreground" />
      </div>
    ),
  }

  return (
    <div className="relative pl-10">
      {/* Status icon */}
      <div className="absolute left-0 top-0">{statusIcon[step.status]}</div>

      <div
        className={cn(
          'rounded-lg border border-border p-3 transition-colors',
          step.status === 'running' && 'border-blue-500 bg-blue-500/5',
          step.status === 'completed' && 'border-green-500/50'
        )}
      >
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div>
            <h4 className="font-medium">{step.title}</h4>
            {step.description && !isExpanded && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {step.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step.duration && (
              <span className="text-xs text-muted-foreground">
                {step.duration}ms
              </span>
            )}
            {(step.substeps || step.output) && (
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform',
                  isExpanded && 'rotate-180'
                )}
              />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3">
            {step.description && (
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            )}

            {step.substeps && step.substeps.length > 0 && (
              <div className="space-y-2 pl-4 border-l-2 border-border">
                {step.substeps.map((substep) => (
                  <div key={substep.id} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    <span className="text-sm">{substep.title}</span>
                    {substep.status === 'completed' && (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {step.output && (
              <div className="rounded bg-muted p-2 text-xs font-mono whitespace-pre-wrap">
                {step.output}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Todo Component
export interface TodoItem {
  id: string
  text: string
  completed: boolean
  priority?: 'low' | 'medium' | 'high'
  dueDate?: Date
}

interface TodoListProps {
  items: TodoItem[]
  onToggle?: (id: string) => void
  onRemove?: (id: string) => void
  onAdd?: (text: string) => void
  className?: string
}

export function TodoList({
  items,
  onToggle,
  onRemove,
  onAdd,
  className,
}: TodoListProps) {
  const [newTodo, setNewTodo] = React.useState('')

  const handleAdd = () => {
    if (newTodo.trim()) {
      onAdd?.(newTodo.trim())
      setNewTodo('')
    }
  }

  const priorityColors = {
    low: 'text-muted-foreground',
    medium: 'text-yellow-500',
    high: 'text-destructive',
  }

  return (
    <div className={cn('rounded-lg border border-border bg-card', className)}>
      <div className="border-b border-border p-4">
        <h3 className="font-semibold">Tasks</h3>
        <p className="text-sm text-muted-foreground">
          {items.filter((i) => i.completed).length} of {items.length} completed
        </p>
      </div>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a task..."
            className="flex-1 bg-transparent border-b border-border px-2 py-1 text-sm focus:outline-none focus:border-accent"
          />
          <Button size="sm" onClick={handleAdd}>
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group',
                item.completed && 'opacity-60'
              )}
            >
              <button
                type="button"
                onClick={() => onToggle?.(item.id)}
                className={cn(
                  'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors',
                  item.completed
                    ? 'border-green-500 bg-green-500'
                    : 'border-muted-foreground hover:border-accent'
                )}
              >
                {item.completed && (
                  <CheckCircle2 className="h-3 w-3 text-white" />
                )}
              </button>
              <span
                className={cn(
                  'flex-1 text-sm',
                  item.completed && 'line-through text-muted-foreground'
                )}
              >
                {item.text}
              </span>
              {item.priority && (
                <span className={cn('text-xs', priorityColors[item.priority])}>
                  {item.priority}
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={() => onRemove?.(item.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
