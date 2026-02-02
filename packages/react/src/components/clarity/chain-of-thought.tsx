'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  Brain,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Search,
  Calculator,
  CheckCircle2,
  Circle,
  Loader2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  Zap,
} from 'lucide-react'

// Types
export interface ThoughtStep {
  id: string
  type:
    | 'reasoning'
    | 'analysis'
    | 'calculation'
    | 'search'
    | 'decision'
    | 'conclusion'
  title: string
  content: string
  status: 'pending' | 'thinking' | 'complete' | 'error'
  duration?: number
  confidence?: number
  children?: ThoughtStep[]
}

export interface ChainOfThoughtProps {
  steps: ThoughtStep[]
  title?: string
  showTimings?: boolean
  showConfidence?: boolean
  expandedByDefault?: boolean
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
}

// Icon mapping
const stepTypeIcons: Record<ThoughtStep['type'], React.ReactNode> = {
  reasoning: <Brain className="h-4 w-4" />,
  analysis: <Search className="h-4 w-4" />,
  calculation: <Calculator className="h-4 w-4" />,
  search: <Search className="h-4 w-4" />,
  decision: <Target className="h-4 w-4" />,
  conclusion: <Lightbulb className="h-4 w-4" />,
}

const statusIcons: Record<ThoughtStep['status'], React.ReactNode> = {
  pending: <Circle className="h-3 w-3 text-muted-foreground" />,
  thinking: <Loader2 className="h-3 w-3 animate-spin text-accent" />,
  complete: <CheckCircle2 className="h-3 w-3 text-green-500" />,
  error: <AlertTriangle className="h-3 w-3 text-destructive" />,
}

// Single Thought Step
function ThoughtStepItem({
  step,
  showTimings,
  showConfidence,
  variant,
  depth = 0,
}: {
  step: ThoughtStep
  showTimings?: boolean
  showConfidence?: boolean
  variant: 'default' | 'compact' | 'detailed'
  depth?: number
}) {
  const [isOpen, setIsOpen] = React.useState(
    step.status === 'thinking' || step.status === 'complete'
  )
  const hasChildren = step.children && step.children.length > 0

  return (
    <div
      className={cn(
        'relative',
        depth > 0 && 'ml-6 border-l border-border pl-4'
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-start gap-3 py-2">
          {/* Status indicator */}
          <div className="mt-1 flex-shrink-0">{statusIcons[step.status]}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 text-left w-full group">
                <div
                  className={cn(
                    'p-1.5 rounded-md',
                    step.status === 'thinking' && 'bg-accent/20 text-accent',
                    step.status === 'complete' &&
                      'bg-green-500/10 text-green-600',
                    step.status === 'error' &&
                      'bg-destructive/10 text-destructive',
                    step.status === 'pending' &&
                      'bg-muted text-muted-foreground'
                  )}
                >
                  {stepTypeIcons[step.type]}
                </div>
                <span className="font-medium text-sm flex-1 truncate">
                  {step.title}
                </span>
                {hasChildren && (
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform',
                      isOpen && 'rotate-90'
                    )}
                  />
                )}
                {!hasChildren && variant !== 'compact' && (
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform opacity-0 group-hover:opacity-100',
                      isOpen && 'rotate-180'
                    )}
                  />
                )}
              </button>
            </CollapsibleTrigger>

            {/* Metadata row */}
            {(showTimings || showConfidence) && variant !== 'compact' && (
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                {showTimings && step.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {step.duration}ms
                  </span>
                )}
                {showConfidence && step.confidence !== undefined && (
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {Math.round(step.confidence * 100)}% confidence
                  </span>
                )}
              </div>
            )}

            {/* Expanded content */}
            <CollapsibleContent>
              <div
                className={cn(
                  'mt-2 text-sm text-muted-foreground',
                  variant === 'detailed' && 'bg-muted/50 rounded-md p-3'
                )}
              >
                {step.content}
              </div>

              {/* Nested children */}
              {hasChildren && (
                <div className="mt-2">
                  {step.children!.map((child) => (
                    <ThoughtStepItem
                      key={child.id}
                      step={child}
                      showTimings={showTimings}
                      showConfidence={showConfidence}
                      variant={variant}
                      depth={depth + 1}
                    />
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </div>
        </div>
      </Collapsible>
    </div>
  )
}

// Main Chain of Thought Component
export function ChainOfThought({
  steps,
  title = 'Reasoning Process',
  showTimings = false,
  showConfidence = false,
  expandedByDefault = true,
  variant = 'default',
  className,
}: ChainOfThoughtProps) {
  const [isExpanded, setIsExpanded] = React.useState(expandedByDefault)

  const completedSteps = steps.filter((s) => s.status === 'complete').length
  const totalSteps = steps.length
  const isThinking = steps.some((s) => s.status === 'thinking')

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-accent/10 text-accent">
                <Brain className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">{title}</span>
              {isThinking && (
                <Badge variant="secondary" className="text-xs">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Thinking
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {completedSteps}/{totalSteps} steps
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform',
                  isExpanded && 'rotate-180'
                )}
              />
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-3 pt-0 space-y-1">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <ThoughtStepItem
                  step={step}
                  showTimings={showTimings}
                  showConfidence={showConfidence}
                  variant={variant}
                />
                {index < steps.length - 1 && variant === 'detailed' && (
                  <div className="flex items-center justify-center py-1">
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

// Reasoning Summary
export interface ReasoningSummaryProps {
  reasoning: string
  conclusion?: string
  confidence?: number
  sources?: { title: string; relevance: number }[]
  className?: string
}

export function ReasoningSummary({
  reasoning,
  conclusion,
  confidence,
  sources,
  className,
}: ReasoningSummaryProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-gradient-to-br from-card to-muted/30 p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-2">Model Reasoning</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {reasoning}
          </p>

          {conclusion && (
            <div className="mt-3 p-3 rounded-md bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  Conclusion
                </span>
              </div>
              <p className="text-sm">{conclusion}</p>
            </div>
          )}

          {(confidence !== undefined || sources) && (
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {confidence !== undefined && (
                <div className="flex items-center gap-1">
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                  <span>{Math.round(confidence * 100)}% confident</span>
                </div>
              )}
              {sources && sources.length > 0 && (
                <span>Based on {sources.length} sources</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Model Reasoning Display
export interface ModelReasoningProps {
  title?: string
  steps: {
    label: string
    detail: string
    status: 'done' | 'active' | 'pending'
  }[]
  result?: string
  className?: string
}

export function ModelReasoning({
  title = 'Reasoning',
  steps,
  result,
  className,
}: ModelReasoningProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <Brain className="h-4 w-4 text-accent" />
        {title}
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-0.5">
              {step.status === 'done' && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              {step.status === 'active' && (
                <Loader2 className="h-4 w-4 text-accent animate-spin" />
              )}
              {step.status === 'pending' && (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{step.label}</div>
              <div className="text-xs text-muted-foreground">{step.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {result && (
        <div className="p-3 rounded-md bg-muted/50 text-sm">
          <span className="font-medium">Result: </span>
          {result}
        </div>
      )}
    </div>
  )
}
