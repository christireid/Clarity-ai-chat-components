// @ts-nocheck
// TODO: Fix Collapsible imports from primitives
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
import { ScrollArea } from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  Activity,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
  MessageSquare,
  Wrench,
  Database,
  Globe,
  FileText,
  ArrowRight,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Code,
  Layers,
} from 'lucide-react'
import { Input } from '@clarity-chat/primitives'

// Types
export interface TraceSpan {
  id: string
  name: string
  type: 'llm' | 'tool' | 'retrieval' | 'chain' | 'agent' | 'custom'
  startTime: Date
  endTime?: Date
  duration?: number
  status: 'running' | 'success' | 'error'
  parentId?: string
  input?: unknown
  output?: unknown
  error?: string
  metadata?: Record<string, unknown>
  tokens?: { input: number; output: number }
  cost?: number
  model?: string
  children?: TraceSpan[]
}

export interface Trace {
  id: string
  name: string
  startTime: Date
  endTime?: Date
  status: 'running' | 'success' | 'error'
  spans: TraceSpan[]
  totalTokens?: number
  totalCost?: number
  tags?: string[]
}

// Span Type Icon
function SpanTypeIcon({
  type,
  className,
}: {
  type: TraceSpan['type']
  className?: string
}) {
  const icons = {
    llm: MessageSquare,
    tool: Wrench,
    retrieval: Database,
    chain: Layers,
    agent: Zap,
    custom: Code,
  }

  const Icon = icons[type]
  return <Icon className={cn('h-4 w-4', className)} />
}

// Status Icon
function StatusIcon({
  status,
  className,
}: {
  status: TraceSpan['status']
  className?: string
}) {
  if (status === 'running') {
    return (
      <Loader2
        className={cn('h-4 w-4 animate-spin text-blue-500', className)}
      />
    )
  }
  if (status === 'success') {
    return <CheckCircle className={cn('h-4 w-4 text-green-500', className)} />
  }
  return <XCircle className={cn('h-4 w-4 text-red-500', className)} />
}

// Duration Display
function DurationDisplay({
  duration,
  className,
}: {
  duration?: number
  className?: string
}) {
  if (!duration) return null

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`
    return `${(ms / 60000).toFixed(2)}m`
  }

  return (
    <span className={cn('text-xs text-muted-foreground font-mono', className)}>
      {formatDuration(duration)}
    </span>
  )
}

// Trace Span Item
interface TraceSpanItemProps {
  span: TraceSpan
  depth?: number
  onSelect?: (span: TraceSpan) => void
  selectedId?: string
}

export function TraceSpanItem({
  span,
  depth = 0,
  onSelect,
  selectedId,
}: TraceSpanItemProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const hasChildren = span.children && span.children.length > 0

  return (
    <div className="border-l-2 border-border">
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 hover:bg-muted/50 cursor-pointer',
          selectedId === span.id && 'bg-muted'
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={() => onSelect?.(span)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
            className="p-0.5 hover:bg-muted rounded"
          >
            {isOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        <StatusIcon status={span.status} />
        <SpanTypeIcon type={span.type} className="text-muted-foreground" />

        <span className="flex-1 text-sm font-medium truncate">{span.name}</span>

        {span.model && (
          <Badge variant="outline" className="text-xs">
            {span.model}
          </Badge>
        )}

        {span.tokens && (
          <span className="text-xs text-muted-foreground font-mono">
            {span.tokens.input}↑ {span.tokens.output}↓
          </span>
        )}

        <DurationDisplay duration={span.duration} />
      </div>

      {hasChildren && isOpen && (
        <div>
          {span.children!.map((child) => (
            <TraceSpanItem
              key={child.id}
              span={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Span Detail Panel
interface SpanDetailPanelProps {
  span: TraceSpan
  className?: string
}

export function SpanDetailPanel({ span, className }: SpanDetailPanelProps) {
  const [copied, setCopied] = React.useState<string | null>(null)

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SpanTypeIcon type={span.type} />
          <h3 className="font-semibold">{span.name}</h3>
        </div>
        <StatusIcon status={span.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Type</p>
          <p className="font-medium capitalize">{span.type}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Duration</p>
          <DurationDisplay duration={span.duration} className="text-sm" />
        </div>
        {span.model && (
          <div>
            <p className="text-muted-foreground">Model</p>
            <p className="font-medium">{span.model}</p>
          </div>
        )}
        {span.tokens && (
          <div>
            <p className="text-muted-foreground">Tokens</p>
            <p className="font-mono">
              {span.tokens.input} in / {span.tokens.output} out
            </p>
          </div>
        )}
        {span.cost !== undefined && (
          <div>
            <p className="text-muted-foreground">Cost</p>
            <p className="font-mono">${span.cost.toFixed(4)}</p>
          </div>
        )}
      </div>

      {span.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm font-medium text-red-500 mb-1">Error</p>
          <p className="text-sm font-mono">{span.error}</p>
        </div>
      )}

      <Tabs defaultValue="input">
        <TabsList className="w-full">
          <TabsTrigger value="input" className="flex-1">
            Input
          </TabsTrigger>
          <TabsTrigger value="output" className="flex-1">
            Output
          </TabsTrigger>
          <TabsTrigger value="metadata" className="flex-1">
            Metadata
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() =>
                handleCopy(JSON.stringify(span.input, null, 2), 'input')
              }
            >
              {copied === 'input' ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            <pre className="p-3 bg-muted rounded-lg text-xs overflow-auto max-h-64">
              {JSON.stringify(span.input, null, 2) || 'No input'}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="output" className="mt-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() =>
                handleCopy(JSON.stringify(span.output, null, 2), 'output')
              }
            >
              {copied === 'output' ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            <pre className="p-3 bg-muted rounded-lg text-xs overflow-auto max-h-64">
              {JSON.stringify(span.output, null, 2) || 'No output'}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="metadata" className="mt-2">
          <pre className="p-3 bg-muted rounded-lg text-xs overflow-auto max-h-64">
            {JSON.stringify(span.metadata, null, 2) || 'No metadata'}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Trace Viewer
interface TraceViewerProps {
  trace: Trace
  className?: string
}

export function TraceViewer({ trace, className }: TraceViewerProps) {
  const [selectedSpan, setSelectedSpan] = React.useState<TraceSpan | null>(null)

  const buildSpanTree = (spans: TraceSpan[]): TraceSpan[] => {
    const spanMap = new Map<string, TraceSpan>()
    const roots: TraceSpan[] = []

    spans.forEach((span) => {
      spanMap.set(span.id, { ...span, children: [] })
    })

    spans.forEach((span) => {
      const node = spanMap.get(span.id)!
      if (span.parentId) {
        const parent = spanMap.get(span.parentId)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(node)
        } else {
          roots.push(node)
        }
      } else {
        roots.push(node)
      }
    })

    return roots
  }

  const spanTree = buildSpanTree(trace.spans)
  const totalDuration = trace.endTime
    ? trace.endTime.getTime() - trace.startTime.getTime()
    : undefined

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {trace.name}
            </CardTitle>
            <CardDescription>
              {trace.startTime.toLocaleString()} | {trace.spans.length} spans
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon status={trace.status} />
            <DurationDisplay duration={totalDuration} />
            {trace.totalCost !== undefined && (
              <Badge variant="outline">${trace.totalCost.toFixed(4)}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="p-2 border-b bg-muted/50">
              <p className="text-sm font-medium">Trace Timeline</p>
            </div>
            <ScrollArea className="h-[400px]">
              {spanTree.map((span) => (
                <TraceSpanItem
                  key={span.id}
                  span={span}
                  onSelect={setSelectedSpan}
                  selectedId={selectedSpan?.id}
                />
              ))}
            </ScrollArea>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="p-2 border-b bg-muted/50">
              <p className="text-sm font-medium">Span Details</p>
            </div>
            <ScrollArea className="h-[400px] p-4">
              {selectedSpan ? (
                <SpanDetailPanel span={selectedSpan} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p className="text-sm">Select a span to view details</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Trace List
interface TraceListProps {
  traces: Trace[]
  onTraceSelect?: (trace: Trace) => void
  selectedId?: string
  className?: string
}

export function TraceList({
  traces,
  onTraceSelect,
  selectedId,
  className,
}: TraceListProps) {
  const [search, setSearch] = React.useState('')

  const filteredTraces = traces.filter(
    (trace) =>
      trace.name.toLowerCase().includes(search.toLowerCase()) ||
      trace.tags?.some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
      )
  )

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Traces</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search traces..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {filteredTraces.map((trace) => {
              const duration = trace.endTime
                ? trace.endTime.getTime() - trace.startTime.getTime()
                : undefined

              return (
                <div
                  key={trace.id}
                  className={cn(
                    'p-3 border rounded-lg cursor-pointer hover:bg-muted/50',
                    selectedId === trace.id && 'bg-muted border-primary'
                  )}
                  onClick={() => onTraceSelect?.(trace)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={trace.status} />
                      <span className="font-medium text-sm">{trace.name}</span>
                    </div>
                    <DurationDisplay duration={duration} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{trace.startTime.toLocaleTimeString()}</span>
                    <div className="flex items-center gap-2">
                      <span>{trace.spans.length} spans</span>
                      {trace.totalCost !== undefined && (
                        <span>${trace.totalCost.toFixed(4)}</span>
                      )}
                    </div>
                  </div>
                  {trace.tags && trace.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {trace.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Latency Chart
interface LatencyChartProps {
  data: { timestamp: Date; latency: number; label?: string }[]
  className?: string
}

export function LatencyChart({ data, className }: LatencyChartProps) {
  const maxLatency = Math.max(...data.map((d) => d.latency))
  const avgLatency = data.reduce((sum, d) => sum + d.latency, 0) / data.length

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Latency
        </CardTitle>
        <CardDescription>
          Avg: {avgLatency.toFixed(0)}ms | Max: {maxLatency.toFixed(0)}ms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1 h-24">
          {data.map((item, index) => {
            const height = (item.latency / maxLatency) * 100
            const color =
              item.latency > avgLatency * 1.5
                ? 'bg-red-500'
                : item.latency > avgLatency
                  ? 'bg-yellow-500'
                  : 'bg-green-500'

            return (
              <div
                key={index}
                className="flex-1 group relative"
                title={`${item.latency.toFixed(0)}ms`}
              >
                <div
                  className={cn('w-full rounded-t transition-all', color)}
                  style={{ height: `${height}%` }}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Error Boundary Display
interface ErrorBoundaryDisplayProps {
  error: Error
  componentStack?: string
  onRetry?: () => void
  onReport?: () => void
  className?: string
}

export function ErrorBoundaryDisplay({
  error,
  componentStack,
  onRetry,
  onReport,
  className,
}: ErrorBoundaryDisplayProps) {
  const [showStack, setShowStack] = React.useState(false)

  return (
    <div
      className={cn(
        'p-6 rounded-lg bg-destructive/10 border border-destructive/20',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-destructive/20">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-destructive">
            Something went wrong
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>

          {componentStack && (
            <Collapsible open={showStack} onOpenChange={setShowStack}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="mt-2">
                  {showStack ? 'Hide' : 'Show'} Stack Trace
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 ml-1 transition-transform',
                      showStack && 'rotate-180'
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-48">
                  {componentStack}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          )}

          <div className="flex gap-2 mt-4">
            {onRetry && (
              <Button onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            {onReport && (
              <Button variant="outline" onClick={onReport}>
                Report Issue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Debug Panel
interface DebugPanelProps {
  logs: {
    timestamp: Date
    level: 'info' | 'warn' | 'error' | 'debug'
    message: string
    data?: unknown
  }[]
  onClear?: () => void
  className?: string
}

export function DebugPanel({ logs, onClear, className }: DebugPanelProps) {
  const levelColors = {
    info: 'text-blue-500',
    warn: 'text-yellow-500',
    error: 'text-red-500',
    debug: 'text-gray-500',
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Code className="h-4 w-4" />
            Debug Console
          </CardTitle>
          <div className="flex gap-2">
            {onClear && (
              <Button variant="ghost" size="sm" onClick={onClear}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] font-mono text-xs">
          {logs.map((log, index) => (
            <div
              key={index}
              className="py-1 border-b border-border/50 last:border-0"
            >
              <span className="text-muted-foreground">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span className={cn('mx-2 uppercase', levelColors[log.level])}>
                [{log.level}]
              </span>
              <span>{log.message}</span>
              {log.data && (
                <pre className="mt-1 pl-4 text-muted-foreground">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
