// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: Fix type errors from peer dependencies (framer-motion, vaul, class-variance-authority)
'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type { ToolCall as ToolCallType } from './types/ai-types'
import {
  Wrench,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ChevronDown,
  ChevronRight,
  Play,
  Globe,
  Database,
  FileCode,
  Terminal,
  Search,
  Mail,
  Calendar,
  Calculator,
  ImageIcon,
  Mic,
  Video,
  FileText,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { CodeBlock } from './code-block'

interface ToolCallDisplayProps {
  toolCall: ToolCallType
  onRetry?: () => void
  onCancel?: () => void
  className?: string
}

const toolIcons: Record<string, React.ElementType> = {
  web_search: Globe,
  search: Search,
  database: Database,
  code: FileCode,
  terminal: Terminal,
  email: Mail,
  calendar: Calendar,
  calculator: Calculator,
  image: ImageIcon,
  audio: Mic,
  video: Video,
  file: FileText,
}

const statusColors = {
  pending: 'bg-muted text-muted-foreground',
  running: 'bg-ai-thinking/20 text-ai-thinking',
  complete: 'bg-ai-success/20 text-ai-success',
  error: 'bg-destructive/20 text-destructive',
}

const statusIcons = {
  pending: Clock,
  running: Loader2,
  complete: CheckCircle2,
  error: XCircle,
}

export function ToolCallDisplay({
  toolCall,
  onRetry,
  onCancel,
  className,
}: ToolCallDisplayProps) {
  const [isOpen, setIsOpen] = React.useState(
    toolCall.status === 'running' || toolCall.status === 'error'
  )

  const Icon = toolIcons[toolCall.name.toLowerCase()] || Wrench
  const StatusIcon = statusIcons[toolCall.status]

  const duration =
    toolCall.startedAt && toolCall.completedAt
      ? new Date(toolCall.completedAt).getTime() -
        new Date(toolCall.startedAt).getTime()
      : null

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        'rounded-lg border border-border overflow-hidden',
        className
      )}
    >
      <CollapsibleTrigger className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/50 transition-colors">
        <div className={cn('p-1.5 rounded-md', statusColors[toolCall.status])}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {formatToolName(toolCall.name)}
            </span>
            <Badge
              variant="outline"
              className={cn('text-xs', statusColors[toolCall.status])}
            >
              <StatusIcon
                className={cn(
                  'h-3 w-3 mr-1',
                  toolCall.status === 'running' && 'animate-spin'
                )}
              />
              {toolCall.status}
            </Badge>
          </div>
          {duration && (
            <span className="text-xs text-muted-foreground">{duration}ms</span>
          )}
        </div>

        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="border-t border-border">
          {/* Arguments */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Arguments
            </p>
            <CodeBlock
              code={JSON.stringify(
                toolCall.arguments || toolCall.args || {},
                null,
                2
              )}
              language="json"
              showLineNumbers={false}
              className="text-xs"
            />
          </div>

          {/* Result or Error */}
          {toolCall.status === 'complete' && toolCall.result !== undefined && (
            <div className="px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Result
              </p>
              <CodeBlock
                code={
                  typeof toolCall.result === 'string'
                    ? toolCall.result
                    : JSON.stringify(toolCall.result, null, 2)
                }
                language="json"
                showLineNumbers={false}
                className="text-xs"
              />
            </div>
          )}

          {toolCall.status === 'error' && toolCall.error && (
            <div className="px-4 py-3">
              <p className="text-xs font-medium text-destructive mb-2">Error</p>
              <div className="p-3 rounded-md bg-destructive/10 text-sm text-destructive">
                {toolCall.error}
              </div>
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 bg-transparent"
                  onClick={onRetry}
                >
                  <Play className="h-3 w-3 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          )}

          {toolCall.status === 'running' && onCancel && (
            <div className="px-4 py-3 flex justify-end">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function formatToolName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Compact tool call indicator for inline display
export function ToolCallBadge({ toolCall }: { toolCall: ToolCallType }) {
  const StatusIcon = statusIcons[toolCall.status]

  return (
    <Badge
      variant="outline"
      className={cn('gap-1', statusColors[toolCall.status])}
    >
      <StatusIcon
        className={cn(
          'h-3 w-3',
          toolCall.status === 'running' && 'animate-spin'
        )}
      />
      {formatToolName(toolCall.name)}
    </Badge>
  )
}

// Tool call list for displaying multiple calls
export function ToolCallList({
  toolCalls,
  className,
}: {
  toolCalls: ToolCallType[]
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {toolCalls.map((toolCall) => (
        <ToolCallDisplay key={toolCall.id} toolCall={toolCall} />
      ))}
    </div>
  )
}

// Web search specific display
export function WebSearchCall({
  query,
  results,
  status,
  className,
}: {
  query: string
  results?: Array<{ title: string; url: string; snippet: string }>
  status: 'pending' | 'running' | 'complete' | 'error'
  className?: string
}) {
  const [isOpen, setIsOpen] = React.useState(true)
  const StatusIcon = statusIcons[status]

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn('rounded-lg border border-border', className)}
    >
      <CollapsibleTrigger className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/50 transition-colors">
        <div className={cn('p-1.5 rounded-md', statusColors[status])}>
          <Globe className="h-4 w-4" />
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Web Search</span>
            <Badge
              variant="outline"
              className={cn('text-xs', statusColors[status])}
            >
              <StatusIcon
                className={cn(
                  'h-3 w-3 mr-1',
                  status === 'running' && 'animate-spin'
                )}
              />
              {status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">{query}</p>
        </div>

        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="border-t border-border divide-y divide-border">
          {status === 'running' && (
            <div className="px-4 py-8 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Searching the web...
              </p>
            </div>
          )}

          {status === 'complete' &&
            results &&
            results.length > 0 &&
            results.map((result, idx) => (
              <a
                key={idx}
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 hover:bg-secondary/50 transition-colors"
              >
                <p className="text-sm font-medium text-foreground hover:text-ai-user transition-colors line-clamp-1">
                  {result.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {result.snippet}
                </p>
                <p className="text-xs text-ai-user mt-1 truncate">
                  {result.url}
                </p>
              </a>
            ))}

          {status === 'complete' && (!results || results.length === 0) && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Alias for backward compatibility
export const ToolCall = ToolCallDisplay
