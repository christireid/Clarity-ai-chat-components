'use client'

import * as React from 'react'
import {
  ListTodo,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  MoreHorizontal,
  Plus,
  Trash2,
  Edit3,
  GripVertical,
  ArrowRight,
  Target,
  Sparkles,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
export type TaskStatus =
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'skipped'

export interface PlanTask {
  id: string
  title: string
  description?: string
  status: TaskStatus
  progress?: number
  duration?: string
  error?: string
  subtasks?: PlanTask[]
  dependencies?: string[]
  metadata?: Record<string, unknown>
}

export interface Plan {
  id: string
  title: string
  description?: string
  tasks: PlanTask[]
  status: 'planning' | 'executing' | 'paused' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
}

// Task Status Icon
export interface TaskStatusIconProps {
  status: TaskStatus
  progress?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function TaskStatusIcon({
  status,
  progress,
  size = 'md',
  className,
}: TaskStatusIconProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const iconSize = sizeClasses[size]

  switch (status) {
    case 'completed':
      return (
        <CheckCircle2 className={cn(iconSize, 'text-green-500', className)} />
      )
    case 'in-progress':
      return progress !== undefined ? (
        <div className={cn('relative', iconSize, className)}>
          <Circle className={cn(iconSize, 'text-muted-foreground')} />
          <svg className={cn('absolute inset-0', iconSize)} viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${progress * 0.628} 100`}
              strokeLinecap="round"
              transform="rotate(-90 12 12)"
              className="text-accent"
            />
          </svg>
        </div>
      ) : (
        <Loader2
          className={cn(iconSize, 'text-accent animate-spin', className)}
        />
      )
    case 'failed':
      return (
        <AlertCircle className={cn(iconSize, 'text-destructive', className)} />
      )
    case 'skipped':
      return (
        <Circle className={cn(iconSize, 'text-muted-foreground', className)} />
      )
    default:
      return (
        <Circle className={cn(iconSize, 'text-muted-foreground', className)} />
      )
  }
}

// Task Item Component
export interface TaskItemProps {
  task: PlanTask
  onStatusChange?: (id: string, status: TaskStatus) => void
  onEdit?: (task: PlanTask) => void
  onDelete?: (id: string) => void
  onRetry?: (id: string) => void
  showActions?: boolean
  indent?: number
  className?: string
}

export function TaskItem({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  onRetry,
  showActions = true,
  indent = 0,
  className,
}: TaskItemProps) {
  const [expanded, setExpanded] = React.useState(true)
  const hasSubtasks = task.subtasks && task.subtasks.length > 0

  const completedSubtasks =
    task.subtasks?.filter((t) => t.status === 'completed').length || 0
  const totalSubtasks = task.subtasks?.length || 0

  return (
    <div
      className={cn('space-y-1', className)}
      style={{ paddingLeft: `${indent * 24}px` }}
    >
      <div
        className={cn(
          'group flex items-start gap-3 p-2 rounded-lg transition-colors',
          'hover:bg-muted/50',
          task.status === 'in-progress' && 'bg-accent/5',
          task.status === 'failed' && 'bg-destructive/5'
        )}
      >
        {/* Expand/Collapse for subtasks */}
        {hasSubtasks ? (
          <button
            className="mt-0.5 text-muted-foreground hover:text-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Status Icon */}
        <button
          className="mt-0.5"
          onClick={() => {
            if (task.status === 'pending') {
              onStatusChange?.(task.id, 'completed')
            } else if (task.status === 'completed') {
              onStatusChange?.(task.id, 'pending')
            }
          }}
        >
          <TaskStatusIcon status={task.status} progress={task.progress} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-medium',
                task.status === 'completed' &&
                  'line-through text-muted-foreground',
                task.status === 'skipped' && 'text-muted-foreground'
              )}
            >
              {task.title}
            </span>
            {task.status === 'in-progress' && (
              <Badge variant="secondary" className="text-xs h-5">
                In Progress
              </Badge>
            )}
            {task.duration && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.duration}
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {task.description}
            </p>
          )}

          {task.error && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {task.error}
            </p>
          )}

          {hasSubtasks && (
            <div className="flex items-center gap-2 mt-1">
              <Progress
                value={(completedSubtasks / totalSubtasks) * 100}
                className="h-1 w-20"
              />
              <span className="text-xs text-muted-foreground">
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {task.status === 'failed' && onRetry && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onRetry(task.id)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Retry</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onStatusChange && (
                  <>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(task.id, 'completed')}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark complete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(task.id, 'skipped')}
                    >
                      <Circle className="h-4 w-4 mr-2" />
                      Skip
                    </DropdownMenuItem>
                  </>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(task.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Subtasks */}
      {hasSubtasks && expanded && (
        <div className="space-y-1">
          {task.subtasks?.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
              onRetry={onRetry}
              showActions={showActions}
              indent={1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Plan Display Component
export interface PlanDisplayProps {
  plan: Plan
  onTaskStatusChange?: (taskId: string, status: TaskStatus) => void
  onTaskEdit?: (task: PlanTask) => void
  onTaskDelete?: (taskId: string) => void
  onTaskRetry?: (taskId: string) => void
  onAddTask?: () => void
  onPause?: () => void
  onResume?: () => void
  onCancel?: () => void
  editable?: boolean
  showProgress?: boolean
  className?: string
}

export function PlanDisplay({
  plan,
  onTaskStatusChange,
  onTaskEdit,
  onTaskDelete,
  onTaskRetry,
  onAddTask,
  onPause,
  onResume,
  onCancel,
  editable = false,
  showProgress = true,
  className,
}: PlanDisplayProps) {
  const completedTasks = plan.tasks.filter(
    (t) => t.status === 'completed'
  ).length
  const totalTasks = plan.tasks.length
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const currentTask = plan.tasks.find((t) => t.status === 'in-progress')

  const statusConfig = {
    planning: { icon: Sparkles, color: 'text-accent', label: 'Planning' },
    executing: { icon: Play, color: 'text-green-500', label: 'Executing' },
    paused: { icon: Pause, color: 'text-yellow-500', label: 'Paused' },
    completed: {
      icon: CheckCircle2,
      color: 'text-green-500',
      label: 'Completed',
    },
    failed: { icon: AlertCircle, color: 'text-destructive', label: 'Failed' },
  }

  const status = statusConfig[plan.status]
  const StatusIcon = status.icon

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {plan.title}
                <Badge
                  variant="outline"
                  className={cn('text-xs', status.color)}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </CardTitle>
              {plan.description && (
                <CardDescription className="mt-0.5">
                  {plan.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {plan.status === 'executing' && onPause && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={onPause}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Pause</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {plan.status === 'paused' && onResume && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={onResume}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Resume</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {onCancel &&
              (plan.status === 'executing' || plan.status === 'paused') && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={onCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cancel</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
          </div>
        </div>

        {showProgress && (
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {completedTasks} of {totalTasks} tasks completed
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {currentTask && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Current: {currentTask.title}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-1">
            {plan.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={editable ? onTaskStatusChange : undefined}
                onEdit={editable ? onTaskEdit : undefined}
                onDelete={editable ? onTaskDelete : undefined}
                onRetry={onTaskRetry}
                showActions={editable || !!onTaskRetry}
              />
            ))}
          </div>
        </ScrollArea>

        {editable && onAddTask && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-muted-foreground"
            onClick={onAddTask}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add task
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Compact Task List
export interface CompactTaskListProps {
  tasks: PlanTask[]
  onTaskClick?: (task: PlanTask) => void
  className?: string
}

export function CompactTaskList({
  tasks,
  onTaskClick,
  className,
}: CompactTaskListProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className={cn(
            'flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors',
            'hover:bg-muted/50',
            task.status === 'in-progress' && 'bg-accent/5'
          )}
          onClick={() => onTaskClick?.(task)}
        >
          <TaskStatusIcon status={task.status} size="sm" />
          <span
            className={cn(
              'text-sm flex-1 truncate',
              task.status === 'completed' &&
                'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </span>
          {task.status === 'in-progress' && (
            <Badge variant="secondary" className="text-xs h-5">
              Current
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}

// Inline Plan (for showing in messages)
export interface InlinePlanProps {
  plan: Plan
  expanded?: boolean
  onToggle?: () => void
  className?: string
}

export function InlinePlan({
  plan,
  expanded = false,
  onToggle,
  className,
}: InlinePlanProps) {
  const completedTasks = plan.tasks.filter(
    (t) => t.status === 'completed'
  ).length
  const totalTasks = plan.tasks.length

  return (
    <Collapsible
      open={expanded}
      onOpenChange={() => onToggle?.()}
      className={className}
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <Target className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">{plan.title}</span>
          <Badge variant="outline" className="text-xs ml-auto">
            {completedTasks}/{totalTasks}
          </Badge>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-6 pt-2">
          <CompactTaskList tasks={plan.tasks} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Task Input (for adding new tasks)
export interface TaskInputProps {
  onAdd: (title: string) => void
  placeholder?: string
  className?: string
}

export function TaskInput({
  onAdd,
  placeholder = 'Add a new task...',
  className,
}: TaskInputProps) {
  const [value, setValue] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onAdd(value.trim())
      setValue('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex items-center gap-2', className)}
    >
      <Circle className="h-5 w-5 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 h-9 border-0 shadow-none focus-visible:ring-0 px-0"
      />
      {value && (
        <Button type="submit" variant="ghost" size="icon" className="h-7 w-7">
          <Check className="h-4 w-4" />
        </Button>
      )}
    </form>
  )
}
