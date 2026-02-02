'use client'

import * as React from 'react'
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bot,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  GitBranch,
  Layers,
  List,
  Loader2,
  MoreVertical,
  Network,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Settings,
  Square,
  Target,
  Terminal,
  Trash2,
  Workflow,
  XCircle,
  Zap,
} from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
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

type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused'
type AgentType = 'orchestrator' | 'researcher' | 'coder' | 'reviewer' | 'writer'

interface Task {
  id: string
  name: string
  description: string
  status: TaskStatus
  agent: AgentType
  progress: number
  startedAt?: Date
  completedAt?: Date
  duration?: number
  tokens?: number
  cost?: number
  subtasks?: Task[]
  logs?: string[]
  result?: string
  error?: string
}

interface Agent {
  id: string
  name: string
  type: AgentType
  status: 'idle' | 'busy' | 'error'
  currentTask?: string
  completedTasks: number
  failedTasks: number
  avgDuration: number
  totalTokens: number
}

// Status Badge Component
function StatusBadge({ status }: { status: TaskStatus }) {
  const config = {
    pending: { label: 'Pending', className: 'bg-slate-500/10 text-slate-500' },
    running: { label: 'Running', className: 'bg-blue-500/10 text-blue-500' },
    completed: {
      label: 'Completed',
      className: 'bg-emerald-500/10 text-emerald-500',
    },
    failed: { label: 'Failed', className: 'bg-red-500/10 text-red-500' },
    paused: { label: 'Paused', className: 'bg-amber-500/10 text-amber-500' },
  }

  return (
    <Badge variant="secondary" className={config[status].className}>
      {status === 'running' && (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      )}
      {status === 'completed' && <Check className="mr-1 h-3 w-3" />}
      {status === 'failed' && <XCircle className="mr-1 h-3 w-3" />}
      {config[status].label}
    </Badge>
  )
}

// Agent Avatar Component
function AgentAvatar({
  type,
  size = 'md',
}: {
  type: AgentType
  size?: 'sm' | 'md' | 'lg'
}) {
  const config = {
    orchestrator: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-500',
      icon: Network,
    },
    researcher: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: FileText },
    coder: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-500',
      icon: Terminal,
    },
    reviewer: { bg: 'bg-amber-500/10', text: 'text-amber-500', icon: Eye },
    writer: { bg: 'bg-rose-500/10', text: 'text-rose-500', icon: FileText },
  }

  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const Icon = config[type].icon

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg',
        config[type].bg,
        sizes[size]
      )}
    >
      <Icon className={cn(config[type].text, iconSizes[size])} />
    </div>
  )
}

// Task Card Component
function TaskCard({
  task,
  expanded,
  onToggle,
}: {
  task: Task
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <Collapsible open={expanded} onOpenChange={onToggle}>
      <div
        className={cn(
          'rounded-lg border transition-colors',
          task.status === 'running' && 'border-blue-500/50 bg-blue-500/5',
          task.status === 'failed' && 'border-red-500/50 bg-red-500/5',
          task.status === 'completed' && 'border-border',
          task.status === 'pending' && 'border-border bg-muted/30',
          task.status === 'paused' && 'border-amber-500/50 bg-amber-500/5'
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-4 p-4 text-left"
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                expanded && 'rotate-90'
              )}
            />
            <AgentAvatar type={task.agent} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{task.name}</p>
                <StatusBadge status={task.status} />
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {task.description}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {task.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.duration}s
                </span>
              )}
              {task.tokens && (
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {task.tokens.toLocaleString()}
                </span>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {task.status === 'running' && (
                  <DropdownMenuItem>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </DropdownMenuItem>
                )}
                {task.status === 'paused' && (
                  <DropdownMenuItem>
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </DropdownMenuItem>
                )}
                {task.status === 'failed' && (
                  <DropdownMenuItem>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </button>
        </CollapsibleTrigger>

        {task.status === 'running' && task.progress > 0 && (
          <div className="px-4 pb-2">
            <Progress value={task.progress} className="h-1" />
          </div>
        )}

        <CollapsibleContent>
          <div className="border-t border-border px-4 py-3 space-y-4">
            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Subtasks</p>
                <div className="space-y-2 pl-4 border-l-2 border-border">
                  {task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      {subtask.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      )}
                      {subtask.status === 'running' && (
                        <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                      )}
                      {subtask.status === 'pending' && (
                        <div className="h-4 w-4 rounded-full border-2 border-muted" />
                      )}
                      {subtask.status === 'failed' && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={cn(
                          subtask.status === 'completed' &&
                            'text-muted-foreground line-through'
                        )}
                      >
                        {subtask.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logs */}
            {task.logs && task.logs.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Logs</p>
                <div className="rounded-lg bg-muted/50 p-3 font-mono text-xs max-h-32 overflow-auto">
                  {task.logs.map((log, i) => (
                    <p key={i} className="text-muted-foreground">
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Result */}
            {task.result && (
              <div>
                <p className="text-sm font-medium mb-2">Result</p>
                <p className="text-sm text-muted-foreground">{task.result}</p>
              </div>
            )}

            {/* Error */}
            {task.error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-sm font-medium text-red-500">Error</p>
                <p className="text-sm text-red-400 mt-1">{task.error}</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// Agent Card Component
function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <AgentAvatar type={agent.type} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium">{agent.name}</p>
              <Badge
                variant="secondary"
                className={cn(
                  agent.status === 'idle' && 'bg-slate-500/10 text-slate-500',
                  agent.status === 'busy' && 'bg-blue-500/10 text-blue-500',
                  agent.status === 'error' && 'bg-red-500/10 text-red-500'
                )}
              >
                {agent.status === 'busy' && (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                )}
                {agent.status}
              </Badge>
            </div>
            {agent.currentTask && (
              <p className="text-sm text-muted-foreground truncate mt-1">
                Working on: {agent.currentTask}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  {agent.completedTasks}
                </span>{' '}
                completed
              </span>
              {agent.failedTasks > 0 && (
                <span className="text-red-500">{agent.failedTasks} failed</span>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Avg Duration</p>
            <p className="font-medium">{agent.avgDuration}s</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Tokens</p>
            <p className="font-medium">{agent.totalTokens.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Workflow Node Component
function WorkflowNode({ task, isLast }: { task: Task; isLast: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border-2',
            task.status === 'completed' &&
              'border-emerald-500 bg-emerald-500/10',
            task.status === 'running' && 'border-blue-500 bg-blue-500/10',
            task.status === 'failed' && 'border-red-500 bg-red-500/10',
            task.status === 'pending' && 'border-muted bg-muted/30',
            task.status === 'paused' && 'border-amber-500 bg-amber-500/10'
          )}
        >
          {task.status === 'completed' && (
            <Check className="h-5 w-5 text-emerald-500" />
          )}
          {task.status === 'running' && (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          )}
          {task.status === 'failed' && (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          {task.status === 'pending' && (
            <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
          )}
          {task.status === 'paused' && (
            <Pause className="h-5 w-5 text-amber-500" />
          )}
        </div>
        {!isLast && <div className="w-0.5 h-12 bg-border" />}
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-center gap-2">
          <p className="font-medium">{task.name}</p>
          <Badge variant="outline" className="text-xs">
            {task.agent}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{task.description}</p>
        {task.duration && (
          <p className="text-xs text-muted-foreground mt-1">
            Duration: {task.duration}s
          </p>
        )}
      </div>
    </div>
  )
}

// Main Dashboard Component
export function AgentTaskDashboard() {
  const [viewMode, setViewMode] = React.useState<'list' | 'workflow'>('list')
  const [filterStatus, setFilterStatus] = React.useState<string>('all')
  const [expandedTasks, setExpandedTasks] = React.useState<Set<string>>(
    new Set()
  )

  const tasks: Task[] = [
    {
      id: '1',
      name: 'Research market trends',
      description: 'Analyze current market trends for AI development tools',
      status: 'completed',
      agent: 'researcher',
      progress: 100,
      duration: durations.slower,
      tokens: 12500,
      cost: 0.025,
      result: 'Identified 5 key trends in AI tooling market',
      subtasks: [
        {
          id: '1.1',
          name: 'Gather data sources',
          status: 'completed',
          agent: 'researcher',
          description: '',
          progress: 100,
        },
        {
          id: '1.2',
          name: 'Analyze competitors',
          status: 'completed',
          agent: 'researcher',
          description: '',
          progress: 100,
        },
        {
          id: '1.3',
          name: 'Summarize findings',
          status: 'completed',
          agent: 'writer',
          description: '',
          progress: 100,
        },
      ],
    },
    {
      id: '2',
      name: 'Generate implementation plan',
      description: 'Create detailed implementation plan based on research',
      status: 'running',
      agent: 'orchestrator',
      progress: 65,
      tokens: 8200,
      logs: [
        '[12:34:56] Starting task execution...',
        '[12:34:58] Analyzing research findings...',
        '[12:35:12] Generating initial plan structure...',
        '[12:35:45] Refining implementation details...',
      ],
      subtasks: [
        {
          id: '2.1',
          name: 'Define milestones',
          status: 'completed',
          agent: 'orchestrator',
          description: '',
          progress: 100,
        },
        {
          id: '2.2',
          name: 'Estimate resources',
          status: 'running',
          agent: 'orchestrator',
          description: '',
          progress: 50,
        },
        {
          id: '2.3',
          name: 'Create timeline',
          status: 'pending',
          agent: 'orchestrator',
          description: '',
          progress: 0,
        },
      ],
    },
    {
      id: '3',
      name: 'Write technical spec',
      description: 'Document technical specifications for the new features',
      status: 'pending',
      agent: 'writer',
      progress: 0,
    },
    {
      id: '4',
      name: 'Review code changes',
      description: 'Review pull request #142 for API improvements',
      status: 'failed',
      agent: 'reviewer',
      progress: 0,
      error: 'Unable to access repository. Authentication token expired.',
      tokens: 500,
    },
  ]

  const agents: Agent[] = [
    {
      id: '1',
      name: 'Orchestrator',
      type: 'orchestrator',
      status: 'busy',
      currentTask: 'Generate implementation plan',
      completedTasks: 24,
      failedTasks: 1,
      avgDuration: 38,
      totalTokens: 125000,
    },
    {
      id: '2',
      name: 'Researcher',
      type: 'researcher',
      status: 'idle',
      completedTasks: 42,
      failedTasks: 2,
      avgDuration: 52,
      totalTokens: 280000,
    },
    {
      id: '3',
      name: 'Code Assistant',
      type: 'coder',
      status: 'idle',
      completedTasks: 156,
      failedTasks: 8,
      avgDuration: 25,
      totalTokens: 450000,
    },
    {
      id: '4',
      name: 'Reviewer',
      type: 'reviewer',
      status: 'error',
      completedTasks: 89,
      failedTasks: 3,
      avgDuration: 18,
      totalTokens: 180000,
    },
  ]

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }

  const filteredTasks = tasks.filter(
    (task) => filterStatus === 'all' || task.status === filterStatus
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Task Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage agentic workflows and tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Tasks</p>
                <p className="text-2xl font-bold">
                  {tasks.filter((t) => t.status === 'running').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {tasks.filter((t) => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {tasks.filter((t) => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">
                  {tasks.filter((t) => t.status === 'failed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">
            <List className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="agents">
            <Bot className="mr-2 h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="workflow">
            <Workflow className="mr-2 h-4 w-4" />
            Workflow
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'workflow' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('workflow')}
              >
                <Workflow className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  expanded={expandedTasks.has(task.id)}
                  onToggle={() => toggleTask(task.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                {tasks.map((task, index) => (
                  <WorkflowNode
                    key={task.id}
                    task={task}
                    isLast={index === tasks.length - 1}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents">
          <div className="grid gap-4 md:grid-cols-2">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Visualization</CardTitle>
              <CardDescription>
                Visual representation of the current task execution flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed border-border rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Interactive workflow diagram</p>
                  <p className="text-sm">
                    Drag and drop to create task dependencies
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AgentTaskDashboard
