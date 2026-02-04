'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Wrench, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const revalidate = 3600

// Demo ToolInvocationCard component
interface DemoToolCall {
  id: string
  function: {
    name: string
    arguments: string
  }
}

type ToolStatus = 'pending' | 'approved' | 'rejected' | 'executing' | 'success' | 'error'

function DemoToolInvocationCard({
  toolCall,
  status,
  result,
  error,
  requiresApproval,
  onApprove,
  onReject,
  onRetry,
  formatArguments,
  expandableResult,
}: {
  toolCall: DemoToolCall
  status: ToolStatus
  result?: any
  error?: string
  requiresApproval?: boolean
  onApprove?: () => void
  onReject?: () => void
  onRetry?: () => void
  formatArguments?: boolean
  expandableResult?: boolean
}) {
  const [isResultExpanded, setIsResultExpanded] = React.useState(false)
  const [isArgsExpanded, setIsArgsExpanded] = React.useState(false)

  const getStatusBadgeVariant = (status: ToolStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
      case 'approved':
      case 'executing':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'success':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
      case 'error':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: ToolStatus): string => {
    switch (status) {
      case 'pending':
        return 'Awaiting approval'
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      case 'executing':
        return 'Executing...'
      case 'success':
        return 'Completed'
      case 'error':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  const parseArguments = () => {
    try {
      const parsed = JSON.parse(toolCall.function.arguments)
      return formatArguments ? JSON.stringify(parsed, null, 2) : toolCall.function.arguments
    } catch {
      return toolCall.function.arguments
    }
  }

  const formatResult = () => {
    if (error) return error
    if (typeof result === 'string') return result
    try {
      return JSON.stringify(result, null, 2)
    } catch {
      return String(result)
    }
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* Tool Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>

            {/* Tool Name & Status */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h4 className="font-bold text-base text-foreground truncate">
                  {toolCall.function.name}
                </h4>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border',
                    getStatusBadgeVariant(status)
                  )}
                >
                  {status === 'executing' && (
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                      <span className="w-1 h-1 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1 h-1 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </span>
                  )}
                  {getStatusLabel(status)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground/90">Tool Invocation</p>
            </div>
          </div>

          {/* Approval Actions */}
          {requiresApproval && status === 'pending' && (
            <div className="flex gap-2 shrink-0">
              {onApprove && (
                <button
                  onClick={onApprove}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
              )}
              {onReject && (
                <button
                  onClick={onReject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border/50 bg-background hover:bg-muted/50 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              )}
            </div>
          )}
        </div>

        {/* Arguments Section */}
        <div className="space-y-2">
          <button
            onClick={() => setIsArgsExpanded(!isArgsExpanded)}
            className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={isArgsExpanded}
            aria-label={`${isArgsExpanded ? 'Hide' : 'Show'} arguments`}
          >
            <span>Arguments</span>
            <svg
              className={cn(
                'h-4 w-4 transition-transform duration-150',
                isArgsExpanded && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isArgsExpanded && (
            <div className="overflow-hidden">
              <pre className="rounded-lg border bg-muted/50 p-3 text-xs overflow-x-auto scrollbar-hide">
                <code className="text-foreground font-mono">{parseArguments()}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Result Section */}
        {(result || error) && (
          <div className="space-y-2 border-t pt-4 mt-4">
            {expandableResult ? (
              <>
                <button
                  onClick={() => setIsResultExpanded(!isResultExpanded)}
                  className="flex w-full items-center justify-between text-sm font-medium hover:text-primary transition-colors"
                  aria-expanded={isResultExpanded}
                  aria-label={`${isResultExpanded ? 'Hide' : 'Show'} ${error ? 'error details' : 'result'}`}
                >
                  <span className="flex items-center gap-2">
                    {error ? (
                      <>
                        <svg className="h-4 w-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Error Details
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Result
                      </>
                    )}
                  </span>
                  <svg
                    className={cn(
                      'h-4 w-4 transition-transform duration-150',
                      isResultExpanded && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isResultExpanded && (
                  <div className="space-y-3">
                    <pre
                      className={cn(
                        'rounded-lg border p-3 text-sm overflow-x-auto scrollbar-hide',
                        error ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/50'
                      )}
                    >
                      <code className={cn('font-mono', error ? 'text-destructive' : 'text-foreground')}>
                        {formatResult()}
                      </code>
                    </pre>

                    {error && onRetry && (
                      <button
                        onClick={onRetry}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retry
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <pre
                  className={cn(
                    'rounded-lg border p-3 text-sm overflow-x-auto scrollbar-hide',
                    error ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/50'
                  )}
                >
                  <code className={cn('font-mono', error ? 'text-destructive' : 'text-foreground')}>
                    {formatResult()}
                  </code>
                </pre>

                {error && onRetry && (
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ToolInvocationCardPage() {
  const [status, setStatus] = React.useState<ToolStatus>('pending')
  const [requiresApproval, setRequiresApproval] = React.useState(true)
  const [formatArguments, setFormatArguments] = React.useState(true)
  const [expandableResult, setExpandableResult] = React.useState(true)
  const [showResult, setShowResult] = React.useState(false)
  const [isError, setIsError] = React.useState(false)

  const sampleToolCall: DemoToolCall = {
    id: 'tool_1',
    function: {
      name: 'search_database',
      arguments: JSON.stringify({
        query: 'AI chat components',
        limit: 10,
        filters: { category: 'documentation', published: true },
      }),
    },
  }

  const sampleResult = {
    results: [
      { id: 1, title: 'Getting Started', relevance: 0.95 },
      { id: 2, title: 'API Reference', relevance: 0.89 },
      { id: 3, title: 'Best Practices', relevance: 0.82 },
    ],
    total: 3,
    processingTime: '45ms',
  }

  const sampleError = 'Database connection timeout after 30s. Please check your network connection and try again.'

  const handleApprove = () => {
    setStatus('approved')
    setTimeout(() => {
      setStatus('executing')
      setTimeout(() => {
        setStatus('success')
        setShowResult(true)
      }, 2000)
    }, 500)
  }

  const handleReject = () => {
    setStatus('rejected')
  }

  const handleRetry = () => {
    setStatus('executing')
    setIsError(false)
    setShowResult(false)
    setTimeout(() => {
      setStatus('success')
      setShowResult(true)
    }, 2000)
  }

  const handleSimulateError = () => {
    setStatus('executing')
    setIsError(true)
    setShowResult(false)
    setTimeout(() => {
      setStatus('error')
      setShowResult(true)
    }, 1500)
  }

  const handleReset = () => {
    setStatus('pending')
    setShowResult(false)
    setIsError(false)
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
              <h1 className="text-4xl font-bold text-foreground">ToolInvocationCard</h1>
              <p className="text-sm text-muted-foreground mt-1">Tool Component</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Display function and tool calls with approval workflow, status tracking, and result visualization.
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
            <div className="p-6 sm:p-8 border-b border-border/50 bg-gradient-to-br from-muted/30 to-muted/10">
              <DemoToolInvocationCard
                toolCall={sampleToolCall}
                status={status}
                result={showResult && !isError ? sampleResult : undefined}
                error={showResult && isError ? sampleError : undefined}
                requiresApproval={requiresApproval}
                onApprove={handleApprove}
                onReject={handleReject}
                onRetry={handleRetry}
                formatArguments={formatArguments}
                expandableResult={expandableResult}
              />
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Status</label>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'approved', 'rejected', 'executing', 'success', 'error'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatus(s)
                        setShowResult(s === 'success' || s === 'error')
                        setIsError(s === 'error')
                      }}
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
                    checked={requiresApproval}
                    onChange={(e) => setRequiresApproval(e.target.checked)}
                    className="rounded"
                  />
                  <span>Requires Approval</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formatArguments}
                    onChange={(e) => setFormatArguments(e.target.checked)}
                    className="rounded"
                  />
                  <span>Format Arguments</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={expandableResult}
                    onChange={(e) => setExpandableResult(e.target.checked)}
                    className="rounded"
                  />
                  <span>Expandable Result</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Run Approval Flow
                </button>
                <button
                  onClick={handleSimulateError}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Simulate Error
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg border border-border/50 text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  Reset
                </button>
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
              <h3 className="text-lg font-semibold text-foreground mb-3">Basic Tool Display</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { ToolInvocationCard } from '@clarity-chat/react'

function MyComponent() {
  const toolCall = {
    id: 'tool_1',
    function: {
      name: 'search_database',
      arguments: JSON.stringify({ query: 'AI components' })
    }
  }

  return (
    <ToolInvocationCard
      toolCall={toolCall}
      status="success"
      result={{ items: 10, time: '45ms' }}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Approval Workflow</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`function ApprovalWorkflow() {
  const [status, setStatus] = useState<ToolStatus>('pending')

  const handleApprove = async (toolCall: ToolCall) => {
    setStatus('approved')
    setStatus('executing')

    try {
      const result = await executeToolCall(toolCall)
      setStatus('success')
    } catch (error) {
      setStatus('error')
    }
  }

  const handleReject = (toolCall: ToolCall) => {
    setStatus('rejected')
    console.log('Tool rejected:', toolCall.function.name)
  }

  return (
    <ToolInvocationCard
      toolCall={toolCall}
      status={status}
      requiresApproval
      onApprove={handleApprove}
      onReject={handleReject}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Status Transitions</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`function ToolLifecycle() {
  const [status, setStatus] = useState<ToolStatus>('pending')

  // Lifecycle: pending → approved → executing → success
  const runToolLifecycle = async () => {
    setStatus('pending')
    await delay(1000)

    setStatus('approved')
    await delay(500)

    setStatus('executing')
    await delay(2000)

    setStatus('success')
  }

  return (
    <ToolInvocationCard
      toolCall={toolCall}
      status={status}
      result={status === 'success' ? data : undefined}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Error Handling with Retry</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`function ErrorHandling() {
  const [status, setStatus] = useState<ToolStatus>('executing')
  const [error, setError] = useState<string>()

  const handleRetry = async (toolCall: ToolCall) => {
    setStatus('executing')
    setError(undefined)

    try {
      const result = await executeToolCall(toolCall)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <ToolInvocationCard
      toolCall={toolCall}
      status={status}
      error={error}
      onRetry={handleRetry}
      expandableResult
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Custom Argument Formatting</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`function CustomFormatting() {
  return (
    <ToolInvocationCard
      toolCall={{
        id: 'tool_1',
        function: {
          name: 'complex_operation',
          arguments: JSON.stringify({
            nested: { data: [1, 2, 3] },
            config: { timeout: 5000 }
          })
        }
      }}
      status="success"
      formatArguments={true}  // Pretty-print JSON
      expandableResult={true} // Collapsible result
      result={{
        processed: 150,
        duration: '2.5s',
        success: true
      }}
    />
  )
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
                    <code>toolCall</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">ToolCall</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Tool call data with id, function name, and arguments
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>status</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    'pending' | 'approved' | 'rejected' | 'executing' | 'success' | 'error'
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'pending'</td>
                  <td className="py-3 px-4 text-muted-foreground">Current execution status</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>result</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">any</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Tool execution result data</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>error</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Error message if execution failed</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>requiresApproval</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Show approval buttons when status is pending
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onApprove</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    (toolCall: ToolCall) =&gt; void
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Callback when tool is approved</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onReject</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    (toolCall: ToolCall) =&gt; void
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Callback when tool is rejected</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onRetry</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    (toolCall: ToolCall) =&gt; void
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Callback to retry failed tool execution
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>formatArguments</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Pretty-print JSON arguments with indentation
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>expandableResult</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Show result in collapsible section
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>className</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">''</td>
                  <td className="py-3 px-4 text-muted-foreground">Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold">Approval Workflow</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Interactive approve/reject buttons for human-in-the-loop tool execution
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <h3 className="font-semibold">Status Tracking</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time status updates from pending through execution to completion
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold">Error Recovery</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Built-in retry functionality with clear error messaging and recovery actions
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                <h3 className="font-semibold">Accessible</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                WCAG 2.1 AA compliant with keyboard navigation and screen reader support
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                <h3 className="font-semibold">Expandable Sections</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Collapsible arguments and results for clean, scannable interface
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-pink-600 dark:text-pink-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                <h3 className="font-semibold">Format Flexibility</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatic JSON formatting with syntax highlighting for arguments and results
              </p>
            </div>
          </div>
        </section>

        {/* Related Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Components</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/reference/components/streaming-message"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingMessage</h3>
              <p className="text-sm text-muted-foreground">Real-time streaming message display</p>
            </Link>

            <Link
              href="/reference/components/message-actions"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">MessageActions</h3>
              <p className="text-sm text-muted-foreground">Message interaction controls</p>
            </Link>

            <Link
              href="/reference/components/chat-input"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">ChatInput</h3>
              <p className="text-sm text-muted-foreground">Multi-modal chat input component</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
