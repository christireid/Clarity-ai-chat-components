'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import {
  Globe,
  Code,
  FileText,
  Database,
  Wrench,
  History,
  Clock,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Copy,
  TrendingUp,
  Calendar,
} from 'lucide-react'

// ============================================================================
// COMPREHENSIVE TOOL EXECUTION DEMO
// ============================================================================
type ToolStatus = 'pending' | 'running' | 'success' | 'failed'

interface Tool {
  id: string
  name: string
  description: string
  status: ToolStatus
  icon: typeof Globe
  enabled: boolean
  category: string
}

export function ToolExecutionDemo() {
  const [tools, setTools] = useState<Tool[]>([
    {
      id: 'tool-1',
      name: 'web_search',
      description: 'Search the web for information',
      status: 'pending',
      icon: Globe,
      enabled: true,
      category: 'Research',
    },
    {
      id: 'tool-2',
      name: 'code_interpreter',
      description: 'Execute Python code in a sandbox',
      status: 'pending',
      icon: Code,
      enabled: true,
      category: 'Development',
    },
    {
      id: 'tool-3',
      name: 'file_reader',
      description: 'Read and analyze file contents',
      status: 'pending',
      icon: FileText,
      enabled: true,
      category: 'Files',
    },
    {
      id: 'tool-4',
      name: 'database_query',
      description: 'Query database records',
      status: 'pending',
      icon: Database,
      enabled: false,
      category: 'Data',
    },
  ])

  const [executions, setExecutions] = useState<
    Array<{
      id: string
      toolId: string
      toolName: string
      status: 'running' | 'success' | 'failed'
      args: Record<string, any>
      result?: any
      error?: string
      startTime: Date
      endTime?: Date
      executionTime?: number
      cost?: number
    }>
  >([])

  const [selectedExecution, setSelectedExecution] = useState<string | null>(null)

  // Mock tool implementations
  const executeTool = async (toolId: string, args: Record<string, unknown>) => {
    const tool = tools.find((t) => t.id === toolId)
    if (!tool) return

    const executionId = `exec-${Date.now()}`
    const execution = {
      id: executionId,
      toolId,
      toolName: tool.name,
      status: 'running' as const,
      args,
      startTime: new Date(),
    }

    setExecutions((prev) => [execution, ...prev])

    // Update tool status
    setTools((prev) =>
      prev.map((t) =>
        t.id === toolId ? { ...t, status: 'running' as ToolStatus } : t
      )
    )

    // Simulate execution
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 2000))

    // Random success/failure
    const success = Math.random() > 0.2

    const executionTime = Date.now() - execution.startTime.getTime()
    const cost = (executionTime / 1000) * 0.001 // Mock cost calculation

    if (success) {
      // Generate mock result based on tool type
      let result: unknown
      switch (tool.name) {
        case 'web_search':
          result = [
            {
              title: 'Next.js 15 Release',
              url: 'https://nextjs.org/blog/next-15',
              snippet: 'Latest features in Next.js 15...',
            },
            {
              title: 'React Server Components',
              url: 'https://react.dev/blog/react-server-components',
              snippet: 'Understanding React Server Components...',
            },
          ]
          break
        case 'code_interpreter':
          result = {
            output: '42\n',
            exitCode: 0,
            executionTime: executionTime,
          }
          break
        case 'file_reader':
          result = {
            content: 'export function Button() { return <button>Click</button> }',
            lineCount: 1,
            size: 58,
          }
          break
        default:
          result = { status: 'success' }
      }

      setExecutions((prev) =>
        prev.map((e) =>
          e.id === executionId
            ? {
                ...e,
                status: 'success' as const,
                result,
                endTime: new Date(),
                executionTime,
                cost,
              }
            : e
        )
      )

      setTools((prev) =>
        prev.map((t) =>
          t.id === toolId ? { ...t, status: 'success' as ToolStatus } : t
        )
      )
    } else {
      const error = 'Tool execution failed: timeout exceeded'

      setExecutions((prev) =>
        prev.map((e) =>
          e.id === executionId
            ? {
                ...e,
                status: 'failed' as const,
                error,
                endTime: new Date(),
                executionTime,
                cost,
              }
            : e
        )
      )

      setTools((prev) =>
        prev.map((t) =>
          t.id === toolId ? { ...t, status: 'failed' as ToolStatus } : t
        )
      )
    }
  }

  const retryExecution = (executionId: string) => {
    const execution = executions.find((e) => e.id === executionId)
    if (execution) {
      executeTool(execution.toolId, execution.args)
    }
  }

  const clearHistory = () => {
    setExecutions([])
    setTools((prev) => prev.map((t) => ({ ...t, status: 'pending' as ToolStatus })))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar - Available Tools */}
      <Card className="glass-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" />
            Available Tools
          </CardTitle>
          <CardDescription className="text-xs">
            Click a tool to execute with sample arguments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {tools.map((tool) => {
            const Icon = tool.icon as React.ComponentType<{ className?: string }>
            return (
              <button
                key={tool.id}
                onClick={() => {
                  if (tool.enabled) {
                    executeTool(tool.id, {
                      query: 'sample query',
                      maxResults: 5,
                    })
                  }
                }}
                disabled={!tool.enabled || tool.status === 'running'}
                className={cn(
                  'w-full flex items-start gap-3 p-3 rounded-lg border transition-all',
                  'hover:glass-subtle disabled:opacity-50 disabled:cursor-not-allowed card-hover',
                  tool.status === 'running' &&
                    'border-yellow-500/50 bg-yellow-500/5',
                  tool.status === 'success' && 'border-green-500/50 bg-green-500/5',
                  tool.status === 'failed' && 'border-red-500/50 bg-red-500/5'
                )}
              >
                <div className="icon-container-sm">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">
                      {tool.name}
                    </span>
                    {tool.status === 'running' && (
                      <Loader2 className="h-3 w-3 animate-spin text-yellow-500" />
                    )}
                    {tool.status === 'success' && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                    {tool.status === 'failed' && (
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tool.description}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs badge-glass">
                    {tool.category}
                  </Badge>
                </div>
                <Badge
                  className={cn(
                    'shrink-0 text-xs',
                    tool.enabled
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {tool.enabled ? 'Ready' : 'Disabled'}
                </Badge>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* Main Content - Execution History */}
      <Card className="lg:col-span-2 glass-card border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Tool Call History
              </CardTitle>
              <CardDescription className="text-xs">
                {executions.length} total executions • Sequential tracking
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              disabled={executions.length === 0}
              className="gap-2 hover:glow-sm"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {executions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="font-medium">No executions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click a tool to start execution
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {executions.map((execution): React.ReactElement => (
                  <Card
                    key={execution.id}
                    className={cn(
                      'border overflow-hidden transition-all card-hover',
                      execution.status === 'running' &&
                        'border-yellow-500/50 bg-yellow-500/5',
                      execution.status === 'success' &&
                        'border-green-500/50 bg-green-500/5',
                      execution.status === 'failed' &&
                        'border-red-500/50 bg-red-500/5',
                      selectedExecution === execution.id &&
                        'ring-2 ring-primary glow-sm'
                    )}
                  >
                    <button
                      onClick={() =>
                        setSelectedExecution(
                          selectedExecution === execution.id ? null : execution.id
                        )
                      }
                      className="w-full p-4 text-left hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Status Icon */}
                          <div
                            className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                              execution.status === 'running' && 'bg-yellow-500/20',
                              execution.status === 'success' && 'bg-green-500/20',
                              execution.status === 'failed' && 'bg-red-500/20'
                            )}
                          >
                            {execution.status === 'running' && (
                              <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
                            )}
                            {execution.status === 'success' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {execution.status === 'failed' && (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>

                          {/* Execution Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-sm font-medium">
                                {execution.toolName}
                              </span>
                              <Badge
                                className={cn(
                                  'text-xs',
                                  execution.status === 'running' &&
                                    'bg-yellow-500/20 text-yellow-600',
                                  execution.status === 'success' &&
                                    'bg-green-500/20 text-green-600',
                                  execution.status === 'failed' &&
                                    'bg-red-500/20 text-red-600'
                                )}
                              >
                                {execution.status}
                              </Badge>
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {execution.executionTime
                                  ? `${(execution.executionTime / 1000).toFixed(2)}s`
                                  : 'Running...'}
                              </span>
                              {execution.cost && (
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  ${execution.cost.toFixed(4)}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {execution.startTime.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {execution.status === 'failed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                retryExecution(execution.id)
                              }}
                              className="gap-1 hover:glow-sm"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Retry
                            </Button>
                          )}
                          {selectedExecution === execution.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {selectedExecution === execution.id ? (
                      <>
                      <div className="border-t border-white/10 p-4 space-y-3 glass-panel">
                        {/* Arguments */}
                        <div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span className="font-medium">Arguments</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:glow-sm"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  JSON.stringify(execution.args, null, 2)
                                )
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <pre className="text-xs font-mono glass-subtle p-3 rounded-lg overflow-x-auto border border-white/10">
                            {JSON.stringify(execution.args, null, 2) as string}
                          </pre>
                        </div>

                        {/* Result */}
                        {execution.result && (
                          <div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <span className="font-medium">Result</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:glow-sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    JSON.stringify(execution.result, null, 2)
                                  )
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <pre className="text-xs font-mono bg-green-500/10 text-green-600 p-3 rounded-lg overflow-x-auto border border-green-500/20 max-h-64 overflow-y-auto scrollbar-hide">
                              {JSON.stringify(execution.result, null, 2) as string}
                            </pre>
                          </div>
                        )}

                        {/* Error */}
                        {execution.error && (
                          <div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <AlertCircle className="h-3 w-3 text-red-500" />
                              <span className="font-medium">Error</span>
                            </div>
                            <pre className="text-xs font-mono bg-red-500/10 text-red-600 p-3 rounded-lg overflow-x-auto border border-red-500/20">
                              {execution.error}
                            </pre>
                          </div>
                        )}
                      </div>
                      </>
                    ) : null}
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
