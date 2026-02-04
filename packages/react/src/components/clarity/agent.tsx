'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Bot,
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
  Zap,
  Brain,
  Target,
  ListTodo,
  MessageSquare,
  MoreHorizontal,
  RefreshCcw,
  Circle,
  AlertCircle, // Added AlertCircle import
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'

// Agent Types
export interface AgentTask {
  id: string
  title: string
  description?: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  startedAt?: Date
  completedAt?: Date
  output?: string
  error?: string
  subtasks?: AgentTask[]
}

export interface AgentStep {
  id: string
  type: 'thought' | 'action' | 'observation' | 'result'
  content: string
  timestamp: Date
  toolName?: string
  toolInput?: Record<string, unknown>
  toolOutput?: unknown
}

interface AgentProps {
  name: string
  description?: string
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error'
  tasks?: AgentTask[]
  steps?: AgentStep[]
  currentTask?: string
  progress?: number
  onStart?: () => void
  onPause?: () => void
  onStop?: () => void
  onReset?: () => void
  className?: string
}

export function Agent({
  name,
  description,
  status,
  tasks = [],
  steps = [],
  currentTask,
  progress,
  onStart,
  onPause,
  onStop,
  onReset,
  className,
}: AgentProps) {
  const [showTasks, setShowTasks] = React.useState(true)
  const [showSteps, setShowSteps] = React.useState(true)

  const statusConfig = {
    idle: { color: 'text-muted-foreground', bg: 'bg-muted', label: 'Ready' },
    running: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Running' },
    paused: {
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      label: 'Paused',
    },
    completed: {
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      label: 'Completed',
    },
    error: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Error' },
  }

  const config = statusConfig[status]

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              config.bg
            )}
          >
            <Bot className={cn('w-5 h-5', config.color)} />
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn(config.color, config.bg)}>
            {status === 'running' && (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            )}
            {config.label}
          </Badge>

          <div className="flex items-center gap-1">
            {status === 'idle' && (
              <Button size="icon" variant="ghost" onClick={onStart}>
                <Play className="w-4 h-4 text-green-500" />
              </Button>
            )}
            {status === 'running' && (
              <>
                <Button size="icon" variant="ghost" onClick={onPause}>
                  <Pause className="w-4 h-4 text-yellow-500" />
                </Button>
                <Button size="icon" variant="ghost" onClick={onStop}>
                  <Square className="w-4 h-4 text-red-500" />
                </Button>
              </>
            )}
            {status === 'paused' && (
              <Button size="icon" variant="ghost" onClick={onStart}>
                <Play className="w-4 h-4 text-green-500" />
              </Button>
            )}
            {(status === 'completed' || status === 'error') && (
              <Button size="icon" variant="ghost" onClick={onReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      {progress !== undefined && status === 'running' && (
        <div className="px-4 py-2 bg-muted/30 border-b border-border">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          {currentTask && (
            <p className="text-xs text-muted-foreground mt-1">
              Current: {currentTask}
            </p>
          )}
        </div>
      )}

      {/* Tasks */}
      {tasks.length > 0 && (
        <Collapsible open={showTasks} onOpenChange={setShowTasks}>
          <CollapsibleTrigger className="w-full flex items-center justify-between p-3 hover:bg-muted/50 border-b border-border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ListTodo className="w-4 h-4 text-muted-foreground" />
              Tasks
              <Badge variant="secondary" className="text-xs">
                {tasks.filter((t) => t.status === 'completed').length}/
                {tasks.length}
              </Badge>
            </div>
            {showTasks ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="divide-y divide-border">
              {tasks.map((task) => (
                <AgentTaskItem key={task.id} task={task} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Steps / Chain of Thought */}
      {steps.length > 0 && (
        <Collapsible open={showSteps} onOpenChange={setShowSteps}>
          <CollapsibleTrigger className="w-full flex items-center justify-between p-3 hover:bg-muted/50 border-b border-border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Brain className="w-4 h-4 text-muted-foreground" />
              Chain of Thought
              <Badge variant="secondary" className="text-xs">
                {steps.length}
              </Badge>
            </div>
            {showSteps ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {steps.map((step, index) => (
                <AgentStepItem key={step.id} step={step} index={index} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

// Agent Task Item
function AgentTaskItem({ task }: { task: AgentTask }) {
  const [expanded, setExpanded] = React.useState(false)

  const statusIcon = {
    pending: <Clock className="w-4 h-4 text-muted-foreground" />,
    running: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
    completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    failed: <XCircle className="w-4 h-4 text-red-500" />,
    skipped: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
  }

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        {statusIcon[task.status]}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'font-medium text-sm',
                task.status === 'completed' &&
                  'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </span>
            {task.subtasks && task.subtasks.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </Button>
            )}
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {task.description}
            </p>
          )}
          {task.error && (
            <p className="text-xs text-red-500 mt-1">{task.error}</p>
          )}
        </div>
      </div>

      {/* Subtasks */}
      {expanded && task.subtasks && (
        <div className="ml-7 mt-2 space-y-2 border-l-2 border-border pl-3">
          {task.subtasks.map((subtask) => (
            <AgentTaskItem key={subtask.id} task={subtask} />
          ))}
        </div>
      )}
    </div>
  )
}

// Agent Step Item (Chain of Thought)
function AgentStepItem({ step, index }: { step: AgentStep; index: number }) {
  const [expanded, setExpanded] = React.useState(false)

  const stepConfig = {
    thought: { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    action: { icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    observation: {
      icon: Target,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    result: {
      icon: CheckCircle2,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  }

  const config = stepConfig[step.type]
  const Icon = config.icon

  return (
    <div className="relative pl-8">
      {/* Timeline line */}
      <div className="absolute left-3 top-6 bottom-0 w-px bg-border" />

      {/* Step indicator */}
      <div
        className={cn(
          'absolute left-0 w-6 h-6 rounded-full flex items-center justify-center',
          config.bg
        )}
      >
        <Icon className={cn('w-3.5 h-3.5', config.color)} />
      </div>

      <div className="pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-xs font-medium uppercase', config.color)}>
            {step.type}
          </span>
          <span className="text-xs text-muted-foreground">
            {step.timestamp.toLocaleTimeString()}
          </span>
        </div>

        <p className="text-sm">{step.content}</p>

        {/* Tool details */}
        {step.toolName && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Zap className="w-3 h-3" />
            {step.toolName}
            {expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}

        {expanded && (step.toolInput || step.toolOutput) && (
          <div className="mt-2 space-y-2 text-xs">
            {step.toolInput && (
              <div>
                <span className="text-muted-foreground">Input:</span>
                <pre className="mt-1 p-2 rounded bg-muted font-mono overflow-x-auto">
                  {JSON.stringify(step.toolInput, null, 2)}
                </pre>
              </div>
            )}
            {step.toolOutput && (
              <div>
                <span className="text-muted-foreground">Output:</span>
                <pre className="mt-1 p-2 rounded bg-muted font-mono overflow-x-auto">
                  {typeof step.toolOutput === 'string'
                    ? step.toolOutput
                    : JSON.stringify(step.toolOutput, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Queue Component
interface QueueItem {
  id: string
  title: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  priority?: 'low' | 'medium' | 'high'
  createdAt: Date
  progress?: number
}

interface QueueProps {
  items: QueueItem[]
  title?: string
  onItemClick?: (item: QueueItem) => void
  onItemCancel?: (id: string) => void
  className?: string
}

export function Queue({
  items,
  title = 'Queue',
  onItemClick,
  onItemCancel,
  className,
}: QueueProps) {
  const priorityColors = {
    low: 'text-muted-foreground',
    medium: 'text-yellow-500',
    high: 'text-red-500',
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="font-medium text-sm">{title}</h3>
        <Badge variant="secondary">{items.length}</Badge>
      </div>

      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3 hover:bg-muted/50 cursor-pointer"
            onClick={() => onItemClick?.(item)}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {item.status === 'processing' && (
                  <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                )}
                {item.status === 'completed' && (
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                )}
                {item.status === 'failed' && (
                  <XCircle className="w-3 h-3 text-red-500" />
                )}
                {item.status === 'pending' && (
                  <Clock className="w-3 h-3 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">{item.title}</span>
              </div>
              {item.priority && (
                <span
                  className={cn(
                    'text-xs uppercase',
                    priorityColors[item.priority]
                  )}
                >
                  {item.priority}
                </span>
              )}
            </div>

            {item.status === 'processing' && item.progress !== undefined && (
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No items in queue
          </div>
        )}
      </div>
    </div>
  )
}

// Plan Component
interface PlanStep {
  id: string
  title: string
  description?: string
  status: 'pending' | 'current' | 'completed' | 'skipped'
  duration?: string
}

interface PlanProps {
  title?: string
  steps: PlanStep[]
  onStepClick?: (step: PlanStep) => void
  className?: string
}

export function Plan({
  title = 'Execution Plan',
  steps,
  onStepClick,
  className,
}: PlanProps) {
  const currentIndex = steps.findIndex((s) => s.status === 'current')

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      <div className="p-3 border-b border-border">
        <h3 className="font-medium text-sm">{title}</h3>
      </div>

      <div className="p-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              'relative pl-8 pb-6 last:pb-0 cursor-pointer',
              step.status === 'completed' && 'opacity-60'
            )}
            onClick={() => onStepClick?.(step)}
          >
            {/* Timeline */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'absolute left-3 top-6 bottom-0 w-0.5',
                  index < currentIndex ? 'bg-green-500' : 'bg-border'
                )}
              />
            )}

            {/* Step indicator */}
            <div
              className={cn(
                'absolute left-0 w-6 h-6 rounded-full flex items-center justify-center border-2',
                step.status === 'completed' &&
                  'bg-green-500 border-green-500 text-white',
                step.status === 'current' &&
                  'bg-blue-500 border-blue-500 text-white',
                step.status === 'pending' && 'bg-background border-border',
                step.status === 'skipped' && 'bg-muted border-muted-foreground'
              )}
            >
              {step.status === 'completed' && (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              {step.status === 'current' && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              {step.status === 'pending' && (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
              {step.status === 'skipped' && (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'font-medium text-sm',
                    step.status === 'completed' && 'line-through'
                  )}
                >
                  {step.title}
                </span>
                {step.duration && (
                  <span className="text-xs text-muted-foreground">
                    {step.duration}
                  </span>
                )}
              </div>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Reasoning Component (Model Reasoning Display)
interface ReasoningProps {
  title?: string
  reasoning: string
  confidence?: number
  sources?: { title: string; url?: string }[]
  isStreaming?: boolean
  className?: string
}

export function Reasoning({
  title = 'Reasoning',
  reasoning,
  confidence,
  sources,
  isStreaming,
  className,
}: ReasoningProps) {
  const [expanded, setExpanded] = React.useState(true)

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-muted/30 overflow-hidden',
        className
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-500" />
          <span className="font-medium text-sm">{title}</span>
          {isStreaming && (
            <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-3">
          {confidence !== undefined && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Confidence:</span>
              <span className="font-mono">{confidence}%</span>
            </div>
          )}
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="p-4 pt-0">
          <p
            className={cn(
              'text-sm text-muted-foreground whitespace-pre-wrap',
              isStreaming && 'animate-pulse'
            )}
          >
            {reasoning}
          </p>

          {sources && sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                Sources
              </h4>
              <div className="flex flex-wrap gap-2">
                {sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2 py-1 rounded-md bg-background border border-border hover:bg-muted"
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Task Orchestrator Component
interface OrchestratorTask {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  agent?: string
  progress?: number
  startedAt?: Date
  completedAt?: Date
  error?: string
  subtasks?: OrchestratorTask[]
}

interface TaskOrchestratorProps {
  tasks: OrchestratorTask[]
  title?: string
  description?: string
  onPause?: () => void
  onResume?: () => void
  onCancel?: () => void
  onRetry?: (taskId: string) => void
  isPaused?: boolean
  className?: string
}

export function TaskOrchestrator({
  tasks,
  title = 'Task Orchestration',
  description,
  onPause,
  onResume,
  onCancel,
  onRetry,
  isPaused = false,
  className,
}: TaskOrchestratorProps) {
  const completedCount = tasks.filter((t) => t.status === 'completed').length
  const totalCount = tasks.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const getStatusIcon = (status: OrchestratorTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-muted-foreground" />
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className={cn('rounded-lg border border-border bg-card', className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isPaused ? (
              <Button variant="outline" size="sm" onClick={onResume}>
                <Play className="w-3 h-3 mr-1" />
                Resume
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={onPause}>
                <Pause className="w-3 h-3 mr-1" />
                Pause
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onCancel}>
              <XCircle className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {tasks.map((task) => (
          <div key={task.id} className="p-3 flex items-center gap-3">
            {getStatusIcon(task.status)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">
                  {task.name}
                </span>
                {task.agent && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {task.agent}
                  </span>
                )}
              </div>
              {task.status === 'running' && task.progress !== undefined && (
                <div className="mt-1 h-1 w-24 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              )}
              {task.error && (
                <p className="text-xs text-red-500 mt-1">{task.error}</p>
              )}
            </div>
            {task.status === 'failed' && onRetry && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRetry(task.id)}
              >
                <RefreshCcw className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Sub Agent Card Component
interface SubAgentCardProps {
  name: string
  description?: string
  status: 'idle' | 'running' | 'completed' | 'failed'
  task?: string
  progress?: number
  avatar?: React.ReactNode
  onCancel?: () => void
  onRetry?: () => void
  className?: string
}

export function SubAgentCard({
  name,
  description,
  status,
  task,
  progress,
  avatar,
  onCancel,
  onRetry,
  className,
}: SubAgentCardProps) {
  const statusColors = {
    idle: 'bg-muted text-muted-foreground',
    running: 'bg-blue-500/10 text-blue-500',
    completed: 'bg-green-500/10 text-green-500',
    failed: 'bg-red-500/10 text-red-500',
  }

  const statusLabels = {
    idle: 'Idle',
    running: 'Running',
    completed: 'Completed',
    failed: 'Failed',
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4',
        status === 'running' && 'ring-1 ring-blue-500/20',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          {avatar || <Bot className="w-5 h-5 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium truncate">{name}</h4>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                statusColors[status]
              )}
            >
              {statusLabels[status]}
            </span>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {description}
            </p>
          )}
          {task && status === 'running' && (
            <div className="mt-2 p-2 rounded bg-muted/50">
              <p className="text-xs text-muted-foreground">Current task:</p>
              <p className="text-sm truncate">{task}</p>
              {progress !== undefined && (
                <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          )}
          {(status === 'running' || status === 'failed') && (
            <div className="mt-3 flex items-center gap-2">
              {status === 'running' && onCancel && (
                <Button variant="outline" size="sm" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              {status === 'failed' && onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  <RefreshCcw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Agent Status Component
interface AgentStatusProps {
  name: string
  status: 'idle' | 'thinking' | 'working' | 'completed' | 'error'
  message?: string
  className?: string
}

export function AgentStatus({
  name,
  status = 'idle',
  message,
  className,
}: AgentStatusProps) {
  const statusConfig: Record<
    string,
    { color: string; label: string; icon: typeof Circle }
  > = {
    idle: {
      color: 'bg-muted text-muted-foreground',
      label: 'Idle',
      icon: Circle,
    },
    thinking: {
      color: 'bg-yellow-500/10 text-yellow-500',
      label: 'Thinking',
      icon: Loader2,
    },
    working: {
      color: 'bg-blue-500/10 text-blue-500',
      label: 'Working',
      icon: Loader2,
    },
    completed: {
      color: 'bg-green-500/10 text-green-500',
      label: 'Completed',
      icon: CheckCircle2,
    },
    error: {
      color: 'bg-red-500/10 text-red-500',
      label: 'Error',
      icon: AlertCircle,
    },
  }

  const config = statusConfig[status] || statusConfig.idle
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border border-border',
        className
      )}
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{name}</span>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1',
              config.color
            )}
          >
            <Icon
              className={cn(
                'w-3 h-3',
                (status === 'thinking' || status === 'working') &&
                  'animate-spin'
              )}
            />
            {config.label}
          </span>
        </div>
        {message && (
          <p className="text-sm text-muted-foreground truncate mt-0.5">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

// Human In The Loop Component
interface HumanInTheLoopProps {
  title: string
  description?: string
  options?: { label: string; value: string; description?: string }[]
  onApprove?: (value?: string) => void
  onReject?: () => void
  onEdit?: () => void
  isLoading?: boolean
  className?: string
}

export function HumanInTheLoop({
  title,
  description,
  options,
  onApprove,
  onReject,
  onEdit,
  isLoading = false,
  className,
}: HumanInTheLoopProps) {
  const [selectedOption, setSelectedOption] = React.useState<
    string | undefined
  >(options?.[0]?.value)

  return (
    <div
      className={cn(
        'rounded-lg border border-amber-500/30 bg-amber-500/5 p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-amber-500">{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}

          {options && options.length > 0 && (
            <div className="mt-3 space-y-2">
              {options.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                    selectedOption === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  )}
                >
                  <input
                    type="radio"
                    name="hitl-option"
                    value={option.value}
                    checked={selectedOption === option.value}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-medium text-sm">{option.label}</span>
                    {option.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {option.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onApprove?.(selectedOption)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <CheckCircle2 className="w-3 h-3 mr-1" />
              )}
              Approve
            </Button>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                disabled={isLoading}
              >
                Edit
              </Button>
            )}
            {onReject && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReject}
                disabled={isLoading}
              >
                <XCircle className="w-3 h-3 mr-1" />
                Reject
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
