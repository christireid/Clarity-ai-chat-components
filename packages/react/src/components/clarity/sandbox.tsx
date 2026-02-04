'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  ChevronDown,
  ChevronRight,
  Play,
  RefreshCw,
  ExternalLink,
  Code,
  Eye,
  Terminal,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { CodeBlock } from './code-block'

interface SandboxProps {
  title?: string
  code: string
  language?: string
  output?: string
  error?: string
  status?: 'idle' | 'running' | 'success' | 'error'
  showPreview?: boolean
  previewUrl?: string
  onRun?: () => void
  onReset?: () => void
  collapsible?: boolean
  defaultOpen?: boolean
  className?: string
}

export function Sandbox({
  title = 'Code Sandbox',
  code,
  language = 'typescript',
  output,
  error,
  status = 'idle',
  showPreview = false,
  previewUrl,
  onRun,
  onReset,
  collapsible = true,
  defaultOpen = true,
  className,
}: SandboxProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [activeTab, setActiveTab] = React.useState<string>(
    showPreview ? 'preview' : 'code'
  )
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const statusConfig = {
    idle: { icon: Code, color: 'text-muted-foreground', label: 'Ready' },
    running: { icon: Loader2, color: 'text-ai-thinking', label: 'Running' },
    success: { icon: CheckCircle2, color: 'text-ai-success', label: 'Success' },
    error: { icon: XCircle, color: 'text-destructive', label: 'Error' },
  }

  const StatusIcon = statusConfig[status].icon

  const content = (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        isFullscreen && 'fixed inset-4 z-50',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          {collapsible && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-secondary rounded transition-colors"
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          <span className="font-medium text-sm">{title}</span>
          <Badge
            variant="outline"
            className={cn('gap-1', statusConfig[status].color)}
          >
            <StatusIcon
              className={cn('h-3 w-3', status === 'running' && 'animate-spin')}
            />
            {statusConfig[status].label}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {onRun && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRun}
              disabled={status === 'running'}
              className="h-7 gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              Run
            </Button>
          )}
          {onReset && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onReset}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      {(isOpen || !collapsible) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-10 px-4">
            <TabsTrigger
              value="code"
              className="gap-1.5 data-[state=active]:bg-secondary"
            >
              <Code className="h-3.5 w-3.5" />
              Code
            </TabsTrigger>
            {showPreview && (
              <TabsTrigger
                value="preview"
                className="gap-1.5 data-[state=active]:bg-secondary"
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
            )}
            {(output || error) && (
              <TabsTrigger
                value="output"
                className="gap-1.5 data-[state=active]:bg-secondary"
              >
                <Terminal className="h-3.5 w-3.5" />
                Output
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="code" className="m-0">
            <CodeBlock
              code={code}
              language={language}
              showLineNumbers
              className="border-0 rounded-none"
              maxHeight={isFullscreen ? undefined : 400}
            />
          </TabsContent>

          {showPreview && (
            <TabsContent value="preview" className="m-0">
              {previewUrl ? (
                <div
                  className={cn(
                    'bg-white',
                    isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-[400px]'
                  )}
                >
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    'flex items-center justify-center text-muted-foreground',
                    isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-[400px]'
                  )}
                >
                  <div className="text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No preview available</p>
                  </div>
                </div>
              )}
            </TabsContent>
          )}

          {(output || error) && (
            <TabsContent value="output" className="m-0">
              <div
                className={cn(
                  'p-4 font-mono text-sm overflow-auto',
                  isFullscreen ? 'h-[calc(100vh-180px)]' : 'max-h-[400px]'
                )}
              >
                {error ? (
                  <StackTrace error={error} />
                ) : (
                  <pre className="whitespace-pre-wrap">{output}</pre>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  )

  if (isFullscreen) {
    return (
      <>
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsFullscreen(false)}
        />
        {content}
      </>
    )
  }

  return content
}

// Stack trace component for error display
export function StackTrace({
  error,
  className,
}: {
  error: string
  className?: string
}) {
  const lines = error.split('\n')
  const errorMessage = lines[0]
  const stackLines = lines.slice(1)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
        <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-destructive">{errorMessage}</p>
        </div>
      </div>

      {stackLines.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Stack Trace
          </p>
          <div className="rounded-lg bg-code-bg border border-code-border p-3 overflow-auto">
            {stackLines.map((line, idx) => {
              const fileMatch = line.match(/at\s+(.+)\s+\((.+):(\d+):(\d+)\)/)
              if (fileMatch) {
                return (
                  <div key={idx} className="text-xs py-0.5">
                    <span className="text-muted-foreground">at </span>
                    <span className="text-foreground">{fileMatch[1]}</span>
                    <span className="text-muted-foreground"> (</span>
                    <span className="text-ai-user">{fileMatch[2]}</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="text-ai-warning">{fileMatch[3]}</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="text-ai-warning">{fileMatch[4]}</span>
                    <span className="text-muted-foreground">)</span>
                  </div>
                )
              }
              return (
                <div key={idx} className="text-xs text-muted-foreground py-0.5">
                  {line}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Test results component
export interface TestResultItem {
  id: string
  name: string
  status: 'passed' | 'failed' | 'skipped' | 'running'
  duration?: number
  error?: string
  stackTrace?: string
}

export function TestResults({
  tests,
  className,
}: {
  tests: TestResultItem[]
  className?: string
}) {
  const passed = tests.filter((t) => t.status === 'passed').length
  const failed = tests.filter((t) => t.status === 'failed').length
  const skipped = tests.filter((t) => t.status === 'skipped').length
  const running = tests.filter((t) => t.status === 'running').length
  const total = tests.length
  const progress = ((passed + failed + skipped) / total) * 100

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      {/* Summary Header */}
      <div className="px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm">Test Results</span>
          <div className="flex items-center gap-3 text-xs">
            {passed > 0 && (
              <span className="flex items-center gap-1 text-ai-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {passed} passed
              </span>
            )}
            {failed > 0 && (
              <span className="flex items-center gap-1 text-destructive">
                <XCircle className="h-3.5 w-3.5" />
                {failed} failed
              </span>
            )}
            {skipped > 0 && (
              <span className="flex items-center gap-1 text-muted-foreground">
                {skipped} skipped
              </span>
            )}
            {running > 0 && (
              <span className="flex items-center gap-1 text-ai-thinking">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {running} running
              </span>
            )}
          </div>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300',
              failed > 0 ? 'bg-destructive' : 'bg-ai-success'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Test List */}
      <div className="divide-y divide-border max-h-[300px] overflow-auto">
        {tests.map((test) => (
          <TestResultItem key={test.id} test={test} />
        ))}
      </div>
    </div>
  )
}

function TestResultItem({ test }: { test: TestResultItem }) {
  const [isOpen, setIsOpen] = React.useState(test.status === 'failed')

  const statusConfig = {
    passed: { icon: CheckCircle2, color: 'text-ai-success' },
    failed: { icon: XCircle, color: 'text-destructive' },
    skipped: { icon: Code, color: 'text-muted-foreground' },
    running: { icon: Loader2, color: 'text-ai-thinking' },
  }

  const StatusIcon = statusConfig[test.status].icon

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/50 transition-colors">
          <StatusIcon
            className={cn(
              'h-4 w-4',
              statusConfig[test.status].color,
              test.status === 'running' && 'animate-spin'
            )}
          />
          <span className="flex-1 text-sm text-left">{test.name}</span>
          {test.duration && (
            <span className="text-xs text-muted-foreground">
              {test.duration}ms
            </span>
          )}
          {test.error && (
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          )}
        </div>
      </CollapsibleTrigger>
      {test.error && (
        <CollapsibleContent>
          <div className="px-4 pb-3">
            <StackTrace error={test.error} />
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}

// Web preview component
export function WebPreview({
  url,
  title,
  className,
}: {
  url: string
  title?: string
  className?: string
}) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true)
      iframeRef.current.src = url
    }
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        isFullscreen && 'fixed inset-4 z-50',
        className
      )}
    >
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[-1]"
          onClick={() => setIsFullscreen(false)}
        />
      )}

      {/* Browser Chrome */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-destructive/60" />
          <span className="w-3 h-3 rounded-full bg-ai-warning/60" />
          <span className="w-3 h-3 rounded-full bg-ai-success/60" />
        </div>

        <div className="flex-1 mx-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-secondary text-sm">
            <span className="text-muted-foreground truncate">{url}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => window.open(url, '_blank')}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Preview Frame */}
      <div
        className={cn(
          'relative bg-white',
          isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[400px]'
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-0"
          title={title || 'Web Preview'}
          sandbox="allow-scripts allow-same-origin allow-forms"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  )
}

// Terminal component
export function TerminalOutput({
  lines = [],
  title = 'Terminal',
  className,
}: {
  lines?: Array<{
    content: string
    type?: 'input' | 'output' | 'error' | 'info'
  }>
  title?: string
  className?: string
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines])

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary/30">
        <Terminal className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div
        ref={containerRef}
        className="p-4 font-mono text-sm bg-code-bg max-h-[300px] overflow-auto scrollbar-thin"
      >
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={cn(
              'py-0.5',
              line.type === 'input' && 'text-ai-user',
              line.type === 'error' && 'text-destructive',
              line.type === 'info' && 'text-ai-thinking',
              line.type === 'output' && 'text-foreground'
            )}
          >
            {line.type === 'input' && (
              <span className="text-ai-success mr-2">$</span>
            )}
            {line.content}
          </div>
        ))}
        <div className="flex items-center mt-1">
          <span className="text-ai-success mr-2">$</span>
          <span className="w-2 h-4 bg-foreground animate-pulse" />
        </div>
      </div>
    </div>
  )
}
