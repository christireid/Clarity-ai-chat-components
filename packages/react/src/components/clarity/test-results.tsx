'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Play,
  RotateCcw,
  FileCode,
  Timer,
  Layers,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'

// Types
export type TestStatus = 'passed' | 'failed' | 'skipped' | 'running' | 'pending'

export interface TestCase {
  id: string
  name: string
  status: TestStatus
  duration?: number
  error?: {
    message: string
    stack?: string
    expected?: string
    actual?: string
  }
  filePath?: string
  line?: number
}

export interface TestSuite {
  id: string
  name: string
  filePath?: string
  tests: TestCase[]
  duration?: number
  status: TestStatus
}

export interface TestResultsData {
  suites: TestSuite[]
  summary: {
    total: number
    passed: number
    failed: number
    skipped: number
    duration: number
  }
  startTime?: Date
  endTime?: Date
}

// Status icon component
function StatusIcon({
  status,
  className,
}: {
  status: TestStatus
  className?: string
}) {
  const icons = {
    passed: (
      <CheckCircle2 className={cn('h-4 w-4 text-emerald-500', className)} />
    ),
    failed: <XCircle className={cn('h-4 w-4 text-red-500', className)} />,
    skipped: (
      <AlertCircle className={cn('h-4 w-4 text-amber-500', className)} />
    ),
    running: (
      <Clock className={cn('h-4 w-4 text-blue-500 animate-pulse', className)} />
    ),
    pending: (
      <Clock className={cn('h-4 w-4 text-muted-foreground', className)} />
    ),
  }
  return icons[status]
}

// Format duration
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`
  return `${Math.floor(ms / 60000)}m ${((ms % 60000) / 1000).toFixed(0)}s`
}

// Test case component
interface TestCaseItemProps {
  test: TestCase
  onRerun?: (testId: string) => void
}

export function TestCaseItem({ test, onRerun }: TestCaseItemProps) {
  const [expanded, setExpanded] = React.useState(test.status === 'failed')

  return (
    <div
      className={cn(
        'border-l-2 pl-3 py-2',
        test.status === 'passed' && 'border-emerald-500/50',
        test.status === 'failed' && 'border-red-500',
        test.status === 'skipped' && 'border-amber-500/50',
        test.status === 'running' && 'border-blue-500',
        test.status === 'pending' && 'border-muted'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <StatusIcon status={test.status} />
          <span
            className={cn(
              'text-sm truncate',
              test.status === 'failed' && 'text-red-500 font-medium'
            )}
          >
            {test.name}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {test.duration !== undefined && (
            <span className="text-xs text-muted-foreground">
              {formatDuration(test.duration)}
            </span>
          )}
          {test.error && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          {onRerun && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onRerun(test.id)}
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {expanded && test.error && (
        <div className="mt-2 space-y-2">
          <div className="text-sm text-red-500 bg-red-500/10 rounded-md p-3 font-mono">
            {test.error.message}
          </div>
          {(test.error.expected || test.error.actual) && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {test.error.expected && (
                <div className="bg-emerald-500/10 rounded-md p-2">
                  <div className="text-emerald-500 font-medium mb-1">
                    Expected
                  </div>
                  <pre className="text-muted-foreground overflow-x-auto">
                    {test.error.expected}
                  </pre>
                </div>
              )}
              {test.error.actual && (
                <div className="bg-red-500/10 rounded-md p-2">
                  <div className="text-red-500 font-medium mb-1">Actual</div>
                  <pre className="text-muted-foreground overflow-x-auto">
                    {test.error.actual}
                  </pre>
                </div>
              )}
            </div>
          )}
          {test.error.stack && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <Layers className="h-3 w-3 mr-1" />
                  Stack trace
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2 overflow-x-auto mt-1">
                  {test.error.stack}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          )}
          {test.filePath && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileCode className="h-3 w-3" />
              {test.filePath}
              {test.line && `:${test.line}`}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Test suite component
interface TestSuiteItemProps {
  suite: TestSuite
  defaultOpen?: boolean
  onRerunTest?: (testId: string) => void
  onRerunSuite?: (suiteId: string) => void
}

export function TestSuiteItem({
  suite,
  defaultOpen = false,
  onRerunTest,
  onRerunSuite,
}: TestSuiteItemProps) {
  const [open, setOpen] = React.useState(
    defaultOpen || suite.status === 'failed'
  )

  const passedCount = suite.tests.filter((t) => t.status === 'passed').length
  const failedCount = suite.tests.filter((t) => t.status === 'failed').length

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border rounded-lg overflow-hidden">
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              'flex items-center justify-between gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors',
              suite.status === 'failed' && 'bg-red-500/5'
            )}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {open ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
              <StatusIcon status={suite.status} />
              <span className="font-medium text-sm truncate">{suite.name}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs">
                {passedCount > 0 && (
                  <span className="text-emerald-500">{passedCount} passed</span>
                )}
                {failedCount > 0 && (
                  <span className="text-red-500">{failedCount} failed</span>
                )}
              </div>
              {suite.duration !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {formatDuration(suite.duration)}
                </span>
              )}
              {onRerunSuite && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRerunSuite(suite.id)
                  }}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t p-3 space-y-1 bg-muted/30">
            {suite.tests.map((test) => (
              <TestCaseItem key={test.id} test={test} onRerun={onRerunTest} />
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// Main test results component
interface TestResultsProps {
  data: TestResultsData
  onRunAll?: () => void
  onRerunFailed?: () => void
  onRerunTest?: (testId: string) => void
  onRerunSuite?: (suiteId: string) => void
  className?: string
}

export function TestResults({
  data,
  onRunAll,
  onRerunFailed,
  onRerunTest,
  onRerunSuite,
  className,
}: TestResultsProps) {
  const { summary, suites } = data
  const passRate =
    summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0

  const isRunning = suites.some((s) => s.status === 'running')

  return (
    <div className={cn('space-y-4', className)}>
      {/* Summary header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold flex items-center gap-2">
            Test Results
            {isRunning && (
              <Badge variant="secondary" className="animate-pulse">
                Running...
              </Badge>
            )}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" />
              {formatDuration(summary.duration)}
            </span>
            <span>{summary.total} tests</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRerunFailed && summary.failed > 0 && (
            <Button variant="outline" size="sm" onClick={onRerunFailed}>
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Rerun Failed
            </Button>
          )}
          {onRunAll && (
            <Button size="sm" onClick={onRunAll} disabled={isRunning}>
              <Play className="h-3.5 w-3.5 mr-1" />
              Run All
            </Button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {summary.passed} passed
            </span>
            <span className="text-red-500 flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5" />
              {summary.failed} failed
            </span>
            {summary.skipped > 0 && (
              <span className="text-amber-500 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {summary.skipped} skipped
              </span>
            )}
          </div>
          <span
            className={cn(
              'font-medium',
              passRate === 100 && 'text-emerald-500',
              passRate < 100 && passRate >= 80 && 'text-amber-500',
              passRate < 80 && 'text-red-500'
            )}
          >
            {passRate}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 transition-all duration-500"
            style={{ width: `${(summary.passed / summary.total) * 100}%` }}
          />
          <div
            className="bg-red-500 transition-all duration-500"
            style={{ width: `${(summary.failed / summary.total) * 100}%` }}
          />
          <div
            className="bg-amber-500 transition-all duration-500"
            style={{ width: `${(summary.skipped / summary.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Test suites */}
      <div className="space-y-2">
        {suites.map((suite) => (
          <TestSuiteItem
            key={suite.id}
            suite={suite}
            onRerunTest={onRerunTest}
            onRerunSuite={onRerunSuite}
          />
        ))}
      </div>
    </div>
  )
}

// Stack trace component
export interface StackFrame {
  file: string
  line: number
  column?: number
  function?: string
  isInternal?: boolean
}

interface StackTraceProps {
  frames: StackFrame[]
  error?: string
  className?: string
  onFrameClick?: (frame: StackFrame) => void
}

export function StackTrace({
  frames,
  error,
  className,
  onFrameClick,
}: StackTraceProps) {
  return (
    <div className={cn('rounded-lg border bg-card overflow-hidden', className)}>
      {error && (
        <div className="px-4 py-3 bg-red-500/10 border-b">
          <p className="text-sm font-medium text-red-500">{error}</p>
        </div>
      )}
      <div className="divide-y">
        {frames.map((frame, index) => (
          <div
            key={index}
            className={cn(
              'px-4 py-2 text-sm font-mono flex items-start gap-2 hover:bg-muted/50 transition-colors',
              frame.isInternal && 'opacity-50',
              onFrameClick && 'cursor-pointer'
            )}
            onClick={() => onFrameClick?.(frame)}
          >
            <span className="text-muted-foreground shrink-0 w-6">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              {frame.function && (
                <span className="text-foreground">{frame.function}</span>
              )}
              <span className="text-muted-foreground ml-2">
                at {frame.file}:{frame.line}
                {frame.column && `:${frame.column}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
