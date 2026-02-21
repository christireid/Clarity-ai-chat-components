'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Wrench, Play, CheckCircle2, XCircle, Timer } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ISR caching configuration
export const revalidate = 3600

// =============================================================================
// DEMO COMPONENT
// =============================================================================

type ToolExecutionStatus = 'pending' | 'executing' | 'complete' | 'error'

interface ToolExecution {
  id: string
  name: string
  description?: string
  status: ToolExecutionStatus
  input: Record<string, unknown> | null
  output: unknown | null
  error?: string
  startTime?: Date
  endTime?: Date
}

interface DemoToolExecutionCardProps {
  tool: ToolExecution
  defaultInputExpanded: boolean
  defaultOutputExpanded: boolean
  compact: boolean
  showTimestamps: boolean
  onRetry?: () => void
  onCancel?: () => void
}

// Status configuration
const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    bgColor: 'bg-muted/30',
    borderColor: 'border-border/50',
    iconColor: 'text-muted-foreground',
  },
  executing: {
    label: 'Executing',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  complete: {
    label: 'Complete',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    label: 'Error',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-600 dark:text-red-400',
  },
}

// Helper functions
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatJSON(data: unknown): string {
  if (data === null || data === undefined) return 'null'
  if (typeof data === 'string') return data
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

// Duration timer hook
function useDurationTimer(
  startTime: Date | undefined,
  endTime: Date | undefined,
  isActive: boolean
): string {
  const [duration, setDuration] = React.useState<number>(0)

  React.useEffect(() => {
    if (!startTime) {
      setDuration(0)
      return
    }

    if (endTime) {
      setDuration(endTime.getTime() - startTime.getTime())
      return
    }

    if (!isActive) {
      setDuration(Date.now() - startTime.getTime())
      return
    }

    const updateDuration = () => {
      setDuration(Date.now() - startTime.getTime())
    }

    updateDuration()
    const interval = setInterval(updateDuration, 100)

    return () => clearInterval(interval)
  }, [startTime, endTime, isActive])

  return formatDuration(duration)
}

// Collapsible section
function CollapsibleSection({
  title,
  data,
  defaultExpanded,
  variant = 'input',
}: {
  title: string
  data: unknown
  defaultExpanded: boolean
  variant?: 'input' | 'output' | 'error'
}) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  const formattedData = formatJSON(data)
  const hasData = data !== null && data !== undefined

  if (!hasData) return null

  const variantStyles = {
    input: 'bg-muted/50 border-border/40',
    output: 'bg-emerald-500/5 border-emerald-500/20',
    error: 'bg-red-500/10 border-red-500/30',
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2">
          {variant === 'error' && <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
          {title}
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <pre
              className={cn(
                'rounded-lg border p-3 text-xs overflow-x-auto scrollbar-hide max-h-64 overflow-y-auto',
                variantStyles[variant]
              )}
            >
              <code
                className={cn(
                  'font-mono whitespace-pre-wrap break-words',
                  variant === 'error' ? 'text-red-600 dark:text-red-400' : 'text-foreground'
                )}
              >
                {formattedData}
              </code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Status icon component
function StatusIcon({ status }: { status: ToolExecutionStatus }) {
  const config = STATUS_CONFIG[status]
  const iconClass = cn('w-4 h-4', config.iconColor)

  switch (status) {
    case 'pending':
      return <Timer className={iconClass} />
    case 'executing':
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Play className={iconClass} />
        </motion.div>
      )
    case 'complete':
      return <CheckCircle2 className={iconClass} />
    case 'error':
      return <XCircle className={iconClass} />
    default:
      return <Timer className={iconClass} />
  }
}

// Main demo component
function DemoToolExecutionCard({
  tool,
  defaultInputExpanded,
  defaultOutputExpanded,
  compact,
  showTimestamps,
  onRetry,
  onCancel,
}: DemoToolExecutionCardProps) {
  const config = STATUS_CONFIG[tool.status]
  const isExecuting = tool.status === 'executing'
  const duration = useDurationTimer(tool.startTime, tool.endTime, isExecuting)

  const hasInput = tool.input !== null && tool.input !== undefined
  const hasOutput = tool.output !== null && tool.output !== undefined
  const hasError = tool.status === 'error' && tool.error

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div
        className={cn(
          'rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative',
          config.borderColor,
          isExecuting && 'ring-2 ring-blue-500/20'
        )}
      >
        {/* Header */}
        <div className={cn('border-b border-border/50', compact ? 'p-4' : 'p-6')}>
          <div className="flex items-start justify-between gap-4">
            {/* Tool info */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Icon */}
              <div
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-lg border shadow-sm',
                  compact ? 'w-8 h-8' : 'w-10 h-10',
                  config.bgColor,
                  config.borderColor
                )}
              >
                <Wrench className={cn(compact ? 'w-4 h-4' : 'w-5 h-5', config.iconColor)} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={cn('font-semibold text-foreground truncate', compact ? 'text-sm' : 'text-base')}>
                    {tool.name}
                  </h4>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border',
                      config.bgColor,
                      config.borderColor,
                      config.iconColor
                    )}
                  >
                    <StatusIcon status={tool.status} />
                    {config.label}
                  </span>
                </div>

                {tool.description && !compact && (
                  <p className="text-xs text-muted-foreground/80 line-clamp-2">{tool.description}</p>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                  {tool.startTime && (
                    <span className="flex items-center gap-1 tabular-nums">
                      <Timer className="w-3 h-3" />
                      {duration}
                    </span>
                  )}
                  {showTimestamps && tool.startTime && (
                    <span className="tabular-nums">Started: {formatTimestamp(tool.startTime)}</span>
                  )}
                  {showTimestamps && tool.endTime && (
                    <span className="tabular-nums">Ended: {formatTimestamp(tool.endTime)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              {isExecuting && onCancel && (
                <button
                  onClick={onCancel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                  aria-label="Cancel tool execution"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  {!compact && <span>Cancel</span>}
                </button>
              )}

              {tool.status === 'error' && onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                  aria-label="Retry tool execution"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {!compact && <span>Retry</span>}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {(hasInput || hasOutput || hasError) && (
          <div className={cn('space-y-3', compact ? 'p-4 pt-3' : 'p-6 pt-4')}>
            {hasInput && (
              <CollapsibleSection
                title="Input Parameters"
                data={tool.input}
                defaultExpanded={defaultInputExpanded}
                variant="input"
              />
            )}

            {hasOutput && (
              <CollapsibleSection
                title="Output Result"
                data={tool.output}
                defaultExpanded={defaultOutputExpanded}
                variant="output"
              />
            )}

            {hasError && (
              <CollapsibleSection
                title="Error Details"
                data={tool.error}
                defaultExpanded={true}
                variant="error"
              />
            )}
          </div>
        )}

        {/* Executing indicator */}
        {isExecuting && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>
    </motion.div>
  )
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ToolExecutionCardPage() {
  const [status, setStatus] = React.useState<ToolExecutionStatus>('executing')
  const [defaultInputExpanded, setDefaultInputExpanded] = React.useState(false)
  const [defaultOutputExpanded, setDefaultOutputExpanded] = React.useState(true)
  const [compact, setCompact] = React.useState(false)
  const [showTimestamps, setShowTimestamps] = React.useState(false)

  // Simulated tool execution
  const [tool, setTool] = React.useState<ToolExecution>(() => ({
    id: 'tool_123',
    name: 'web_search',
    description: 'Search the web for relevant information',
    status: 'executing',
    input: {
      query: 'What is the capital of France?',
      maxResults: 5,
      language: 'en',
    },
    output: null,
    startTime: new Date(),
  }))

  // Update tool status
  React.useEffect(() => {
    const baseOutput = {
      results: [
        { title: 'Paris - Wikipedia', url: 'https://en.wikipedia.org/wiki/Paris' },
        { title: 'Visit Paris', url: 'https://www.visitparis.com' },
      ],
      totalResults: 2,
      searchTime: 0.42,
    }

    setTool((prev) => ({
      ...prev,
      status,
      output: status === 'complete' ? baseOutput : null,
      error: status === 'error' ? 'Failed to connect to search API: Connection timeout after 30s' : undefined,
      endTime: status === 'complete' || status === 'error' ? new Date() : undefined,
    }))
  }, [status])

  const handleRetry = () => {
    setStatus('executing')
    setTool((prev) => ({
      ...prev,
      status: 'executing',
      output: null,
      error: undefined,
      startTime: new Date(),
      endTime: undefined,
    }))
  }

  const handleCancel = () => {
    setStatus('error')
    setTool((prev) => ({
      ...prev,
      status: 'error',
      error: 'Execution cancelled by user',
      endTime: new Date(),
    }))
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/reference/components"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Components
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">ToolExecutionCard</h1>
              <p className="text-sm text-muted-foreground mt-1">Tool Execution Component</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Display tool execution status with real-time updates, collapsible input/output sections, live duration timer, and action buttons for retry and cancel operations.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Demo</h2>

          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            {/* Demo Display */}
            <div className="p-8 sm:p-12 border-b border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center min-h-[400px]">
              <div className="w-full max-w-2xl">
                <DemoToolExecutionCard
                  tool={tool}
                  defaultInputExpanded={defaultInputExpanded}
                  defaultOutputExpanded={defaultOutputExpanded}
                  compact={compact}
                  showTimestamps={showTimestamps}
                  onRetry={handleRetry}
                  onCancel={handleCancel}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Status</label>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'executing', 'complete', 'error'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        status === s
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={defaultInputExpanded}
                    onChange={(e) => setDefaultInputExpanded(e.target.checked)}
                    className="rounded"
                  />
                  <span>Input Expanded</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={defaultOutputExpanded}
                    onChange={(e) => setDefaultOutputExpanded(e.target.checked)}
                    className="rounded"
                  />
                  <span>Output Expanded</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={compact}
                    onChange={(e) => setCompact(e.target.checked)}
                    className="rounded"
                  />
                  <span>Compact Mode</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTimestamps}
                    onChange={(e) => setShowTimestamps(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Timestamps</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Installation</h2>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
            <code className="text-sm">npm install @clarity-chat/react</code>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Usage</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Basic Tool Execution</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { ToolExecutionCard } from '@clarity-chat/react'

function MyComponent() {
  const [tool, setTool] = useState({
    id: 'tool_123',
    name: 'web_search',
    description: 'Search the web',
    status: 'executing',
    input: { query: 'React hooks' },
    output: null,
    startTime: new Date(),
  })

  return (
    <ToolExecutionCard
      tool={tool}
      onRetry={() => console.log('Retry')}
      onCancel={() => console.log('Cancel')}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Live Duration Timer</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<ToolExecutionCard
  tool={{
    id: 'tool_456',
    name: 'code_interpreter',
    status: 'executing',
    input: { code: 'print("Hello")' },
    output: null,
    startTime: new Date(), // Timer updates live
  }}
  showTimestamps={true}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Collapsible Input/Output</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<ToolExecutionCard
  tool={{
    id: 'tool_789',
    name: 'database_query',
    status: 'complete',
    input: {
      query: 'SELECT * FROM users',
      limit: 100,
    },
    output: {
      rows: [...],
      count: 42,
    },
    startTime: new Date(Date.now() - 2000),
    endTime: new Date(),
  }}
  defaultInputExpanded={false}
  defaultOutputExpanded={true}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Error Handling with Retry</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`function ToolExecutionWithRetry() {
  const { tool, start, fail, reset } = useToolExecution({
    initialTool: {
      name: 'api_call',
      input: { endpoint: '/api/data' },
    },
  })

  const handleRetry = () => {
    reset()
    start()
    // Retry logic here
  }

  return (
    <ToolExecutionCard
      tool={tool}
      onRetry={handleRetry}
      compact={false}
      showTimestamps={true}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Compact Mode</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<ToolExecutionCard
  tool={tool}
  compact={true}
  defaultInputExpanded={false}
  defaultOutputExpanded={false}
  icon={<CustomIcon />}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Using the Hook</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { useToolExecution } from '@clarity-chat/react'

function MyComponent() {
  const { tool, start, complete, fail, isExecuting } = useToolExecution({
    initialTool: {
      name: 'image_generation',
      description: 'Generate an image from text',
      input: { prompt: 'A sunset over mountains' },
    },
    autoStart: true,
  })

  // Simulate execution
  useEffect(() => {
    if (isExecuting) {
      setTimeout(() => {
        complete({ imageUrl: 'https://...' })
      }, 3000)
    }
  }, [isExecuting, complete])

  return <ToolExecutionCard tool={tool} />
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Props */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Props</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold">Prop</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Default</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>tool</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">ToolExecution</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Tool execution data object</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onRetry</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">() =&gt; void</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Callback when retry button is clicked (error status)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onCancel</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">() =&gt; void</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Callback when cancel button is clicked (executing status)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>defaultInputExpanded</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">Whether input section is expanded by default</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>defaultOutputExpanded</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Whether output section is expanded by default</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>icon</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">ReactNode</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Custom icon to display</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>className</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Additional CSS classes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>compact</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">Compact mode for inline display</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showTimestamps</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">Show start and end timestamps</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>disableAnimations</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">Disable all animations</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">ToolExecution Interface</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 font-semibold">Property</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <code>id</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">string</td>
                    <td className="py-3 px-4 text-muted-foreground">Unique identifier for the tool execution</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <code>name</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">string</td>
                    <td className="py-3 px-4 text-muted-foreground">Tool name (e.g., 'web_search', 'code_interpreter')</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <code>description</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">string</td>
                    <td className="py-3 px-4 text-muted-foreground">Human-readable description of what the tool does</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <code>status</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">'pending' | 'executing' | 'complete' | 'error'</td>
                    <td className="py-3 px-4 text-muted-foreground">Current execution status</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <code>input</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">Record&lt;string, unknown&gt; | null</td>
                    <td className="py-3 px-4 text-muted-foreground">Input parameters passed to the tool</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <code>output</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">unknown | null</td>
                    <td className="py-3 px-4 text-muted-foreground">Output result from the tool</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <code>error</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">string</td>
                    <td className="py-3 px-4 text-muted-foreground">Error message if status is 'error'</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <code>startTime</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">Date</td>
                    <td className="py-3 px-4 text-muted-foreground">Timestamp when execution started</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <code>endTime</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">Date</td>
                    <td className="py-3 px-4 text-muted-foreground">Timestamp when execution completed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold">Live Duration Timer</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time duration tracking that updates every 100ms during execution with automatic formatting
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <h3 className="font-semibold">Collapsible Sections</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Expandable input/output sections with syntax highlighting and scrollable JSON display
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold">Status Indicators</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Visual status badges with animated icons and color-coded borders for each execution state
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h3 className="font-semibold">Action Buttons</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Context-aware retry and cancel buttons that appear based on execution status
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="font-semibold">Smooth Animations</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Framer Motion powered animations with automatic reduced motion support
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <h3 className="font-semibold">Accessible</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                WCAG 2.1 AA compliant with proper ARIA labels, keyboard navigation, and focus management
              </p>
            </div>
          </div>
        </section>

        {/* Related Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Components</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/reference/components/streaming-progress"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingProgress</h3>
              <p className="text-sm text-muted-foreground">Real-time progress indicator for streaming responses</p>
            </Link>

            <Link
              href="/reference/components/streaming-message"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingMessage</h3>
              <p className="text-sm text-muted-foreground">Live message display with typewriter effect</p>
            </Link>

            <Link
              href="/reference/components/streaming-code-block"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingCodeBlock</h3>
              <p className="text-sm text-muted-foreground">Syntax-highlighted code streaming with live updates</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
