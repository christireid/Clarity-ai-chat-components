'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  Bot,
  ChevronDown,
  ChevronRight,
  Circle,
  CheckCircle2,
  XCircle,
  Loader2,
  Pause,
  Play,
  Network,
  GitBranch,
  Workflow,
  ArrowRight,
  MoreHorizontal,
  RefreshCw,
  StopCircle,
  Maximize2,
  Minimize2,
} from 'lucide-react'

// Types
export interface SubgraphAgent {
  id: string
  name: string
  role: string
  status: 'idle' | 'running' | 'completed' | 'failed' | 'paused'
  progress?: number
  currentTask?: string
  output?: string
  error?: string
  children?: SubgraphAgent[]
  dependencies?: string[]
  startTime?: Date
  endTime?: Date
}

export interface SubgraphConnection {
  from: string
  to: string
  label?: string
  status?: 'pending' | 'active' | 'completed'
}

export interface SubgraphData {
  id: string
  name: string
  description?: string
  agents: SubgraphAgent[]
  connections: SubgraphConnection[]
  status: 'idle' | 'running' | 'completed' | 'failed' | 'paused'
  progress: number
}

// Subgraph Visualizer Component
interface SubgraphVisualizerProps {
  data: SubgraphData
  onAgentClick?: (agent: SubgraphAgent) => void
  onPause?: () => void
  onResume?: () => void
  onStop?: () => void
  onRestart?: () => void
  className?: string
}

export function SubgraphVisualizer({
  data,
  onAgentClick,
  onPause,
  onResume,
  onStop,
  onRestart,
  className,
}: SubgraphVisualizerProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="border-b bg-muted/30 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Network className="h-5 w-5 text-accent" />
            <div>
              <CardTitle className="text-base">{data.name}</CardTitle>
              {data.description && (
                <p className="text-xs text-muted-foreground">
                  {data.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SubgraphStatusBadge status={data.status} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {data.status === 'running' && (
          <Progress value={data.progress} className="mt-3 h-1" />
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4">
          {/* Controls */}
          <div className="mb-4 flex items-center gap-2">
            {data.status === 'running' && onPause && (
              <Button variant="outline" size="sm" onClick={onPause}>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            )}
            {data.status === 'paused' && onResume && (
              <Button variant="outline" size="sm" onClick={onResume}>
                <Play className="mr-2 h-4 w-4" />
                Resume
              </Button>
            )}
            {(data.status === 'running' || data.status === 'paused') &&
              onStop && (
                <Button variant="outline" size="sm" onClick={onStop}>
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              )}
            {(data.status === 'completed' || data.status === 'failed') &&
              onRestart && (
                <Button variant="outline" size="sm" onClick={onRestart}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restart
                </Button>
              )}
          </div>

          {/* Agent Tree */}
          <div className="space-y-2">
            {data.agents
              .filter((a) => !a.dependencies?.length)
              .map((agent) => (
                <AgentNode
                  key={agent.id}
                  agent={agent}
                  allAgents={data.agents}
                  connections={data.connections}
                  onClick={onAgentClick}
                  depth={0}
                />
              ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Agent Node Component
interface AgentNodeProps {
  agent: SubgraphAgent
  allAgents: SubgraphAgent[]
  connections: SubgraphConnection[]
  onClick?: (agent: SubgraphAgent) => void
  depth: number
}

function AgentNode({
  agent,
  allAgents,
  connections,
  onClick,
  depth,
}: AgentNodeProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const childAgents = allAgents.filter((a) =>
    a.dependencies?.includes(agent.id)
  )
  const hasChildren =
    childAgents.length > 0 || (agent.children?.length ?? 0) > 0

  return (
    <div className={cn('', depth > 0 && 'ml-6 border-l pl-4')}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={cn(
            'flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted/50',
            onClick && 'cursor-pointer'
          )}
          onClick={() => onClick?.(agent)}
        >
          {hasChildren && (
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => e.stopPropagation()}
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          )}
          {!hasChildren && <div className="w-6" />}

          <AgentStatusIcon status={agent.status} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{agent.name}</span>
              <Badge variant="outline" className="text-xs">
                {agent.role}
              </Badge>
            </div>
            {agent.currentTask && agent.status === 'running' && (
              <p className="truncate text-xs text-muted-foreground">
                {agent.currentTask}
              </p>
            )}
            {agent.error && agent.status === 'failed' && (
              <p className="truncate text-xs text-destructive">{agent.error}</p>
            )}
          </div>

          {agent.progress !== undefined && agent.status === 'running' && (
            <div className="flex items-center gap-2">
              <Progress value={agent.progress} className="h-1 w-20" />
              <span className="text-xs text-muted-foreground">
                {agent.progress}%
              </span>
            </div>
          )}
        </div>

        {hasChildren && (
          <CollapsibleContent>
            <div className="mt-1 space-y-1">
              {(agent.children || childAgents).map((child) => (
                <AgentNode
                  key={child.id}
                  agent={child}
                  allAgents={allAgents}
                  connections={connections}
                  onClick={onClick}
                  depth={depth + 1}
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  )
}

// Agent Status Icon
function AgentStatusIcon({ status }: { status: SubgraphAgent['status'] }) {
  switch (status) {
    case 'idle':
      return <Circle className="h-4 w-4 text-muted-foreground" />
    case 'running':
      return <Loader2 className="h-4 w-4 animate-spin text-accent" />
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-destructive" />
    case 'paused':
      return <Pause className="h-4 w-4 text-yellow-500" />
    default:
      return <Circle className="h-4 w-4" />
  }
}

// Subgraph Status Badge
function SubgraphStatusBadge({ status }: { status: SubgraphData['status'] }) {
  const variants: Record<
    SubgraphData['status'],
    { label: string; className: string }
  > = {
    idle: { label: 'Idle', className: 'bg-muted text-muted-foreground' },
    running: { label: 'Running', className: 'bg-accent/20 text-accent' },
    completed: {
      label: 'Completed',
      className: 'bg-green-500/20 text-green-500',
    },
    failed: {
      label: 'Failed',
      className: 'bg-destructive/20 text-destructive',
    },
    paused: { label: 'Paused', className: 'bg-yellow-500/20 text-yellow-500' },
  }

  const { label, className: badgeClass } = variants[status]

  return (
    <Badge variant="outline" className={cn('border-0', badgeClass)}>
      {label}
    </Badge>
  )
}

// Subgraph Flow Component - Horizontal Flow View
interface SubgraphFlowProps {
  data: SubgraphData
  onAgentClick?: (agent: SubgraphAgent) => void
  className?: string
}

export function SubgraphFlow({
  data,
  onAgentClick,
  className,
}: SubgraphFlowProps) {
  // Group agents by their dependency depth
  const levels = React.useMemo(() => {
    const result: SubgraphAgent[][] = []
    const processed = new Set<string>()

    // First level: agents with no dependencies
    const rootAgents = data.agents.filter((a) => !a.dependencies?.length)
    if (rootAgents.length > 0) {
      result.push(rootAgents)
      rootAgents.forEach((a) => processed.add(a.id))
    }

    // Subsequent levels
    while (processed.size < data.agents.length) {
      const nextLevel = data.agents.filter(
        (a) =>
          !processed.has(a.id) && a.dependencies?.every((d) => processed.has(d))
      )
      if (nextLevel.length === 0) break
      result.push(nextLevel)
      nextLevel.forEach((a) => processed.add(a.id))
    }

    return result
  }, [data.agents])

  return (
    <div className={cn('overflow-x-auto', className)}>
      <div className="flex items-start gap-8 p-4">
        {levels.map((level, levelIndex) => (
          <React.Fragment key={levelIndex}>
            {levelIndex > 0 && (
              <div className="flex items-center self-center">
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex flex-col gap-3">
              {level.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onClick={() => onAgentClick?.(agent)}
                />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// Agent Card Component
interface AgentCardProps {
  agent: SubgraphAgent
  onClick?: () => void
}

function AgentCard({ agent, onClick }: AgentCardProps) {
  return (
    <Card
      className={cn(
        'w-48 cursor-pointer transition-all hover:shadow-md',
        agent.status === 'running' && 'ring-2 ring-accent',
        agent.status === 'failed' && 'ring-2 ring-destructive'
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{agent.name}</span>
          </div>
          <AgentStatusIcon status={agent.status} />
        </div>
        <Badge variant="secondary" className="mt-2 text-xs">
          {agent.role}
        </Badge>
        {agent.currentTask && agent.status === 'running' && (
          <p className="mt-2 truncate text-xs text-muted-foreground">
            {agent.currentTask}
          </p>
        )}
        {agent.progress !== undefined && agent.status === 'running' && (
          <Progress value={agent.progress} className="mt-2 h-1" />
        )}
      </CardContent>
    </Card>
  )
}

// Subgraph Summary Component
interface SubgraphSummaryProps {
  data: SubgraphData
  className?: string
}

export function SubgraphSummary({ data, className }: SubgraphSummaryProps) {
  const stats = React.useMemo(() => {
    const counts = {
      total: data.agents.length,
      idle: 0,
      running: 0,
      completed: 0,
      failed: 0,
      paused: 0,
    }
    data.agents.forEach((a) => {
      counts[a.status]++
    })
    return counts
  }, [data.agents])

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex items-center gap-2">
        <Network className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{stats.total} agents</span>
      </div>
      {stats.completed > 0 && (
        <div className="flex items-center gap-1 text-sm text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          {stats.completed}
        </div>
      )}
      {stats.running > 0 && (
        <div className="flex items-center gap-1 text-sm text-accent">
          <Loader2 className="h-4 w-4 animate-spin" />
          {stats.running}
        </div>
      )}
      {stats.failed > 0 && (
        <div className="flex items-center gap-1 text-sm text-destructive">
          <XCircle className="h-4 w-4" />
          {stats.failed}
        </div>
      )}
    </div>
  )
}

// Multi-Subgraph Coordinator Component
interface SubgraphCoordinatorProps {
  subgraphs: SubgraphData[]
  onSubgraphSelect?: (subgraph: SubgraphData) => void
  selectedId?: string
  className?: string
}

export function SubgraphCoordinator({
  subgraphs,
  onSubgraphSelect,
  selectedId,
  className,
}: SubgraphCoordinatorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Workflow className="h-5 w-5" />
          Active Subgraphs
        </h3>
        <Badge variant="secondary">{subgraphs.length} total</Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {subgraphs.map((subgraph) => (
          <Card
            key={subgraph.id}
            className={cn(
              'cursor-pointer transition-colors hover:bg-muted/50',
              selectedId === subgraph.id && 'border-accent'
            )}
            onClick={() => onSubgraphSelect?.(subgraph)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{subgraph.name}</span>
                </div>
                <SubgraphStatusBadge status={subgraph.status} />
              </div>
              <Progress value={subgraph.progress} className="mt-3 h-1" />
              <SubgraphSummary data={subgraph} className="mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
