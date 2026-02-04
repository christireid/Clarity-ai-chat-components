'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type { ThinkingStep } from './types/ai-types'
import {
  Brain,
  Search,
  FileText,
  Sparkles,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronRight,
  ListTodo,
  Pencil,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'

interface ThinkingIndicatorProps {
  steps: ThinkingStep[]
  isActive?: boolean
  className?: string
}

const stepIcons = {
  thinking: Brain,
  planning: ListTodo,
  searching: Search,
  analyzing: FileText,
  writing: Pencil,
}

const stepLabels = {
  thinking: 'Thinking',
  planning: 'Planning',
  searching: 'Searching',
  analyzing: 'Analyzing',
  writing: 'Writing',
}

export function ThinkingIndicator({
  steps = [],
  isActive = false,
  className,
}: ThinkingIndicatorProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const safeSteps = steps || []
  const activeSteps = safeSteps.filter((s) => s.status === 'active')
  const completedSteps = safeSteps.filter((s) => s.status === 'complete')

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn('w-full', className)}
    >
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
        <div className="flex items-center gap-2 flex-1">
          {isActive ? (
            <ThinkingAnimation />
          ) : (
            <Sparkles className="h-4 w-4 text-ai-thinking" />
          )}
          <span className="text-sm font-medium">
            {isActive
              ? activeSteps.length > 0
                ? stepLabels[activeSteps[activeSteps.length - 1].type]
                : 'Thinking'
              : `${completedSteps.length} thinking steps`}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="space-y-1 pl-2 border-l-2 border-border ml-3">
          {safeSteps.map((step, idx) => (
            <ThinkingStepItem
              key={step.id}
              step={step}
              isLast={idx === safeSteps.length - 1}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function ThinkingStepItem({
  step,
  isLast,
}: {
  step: ThinkingStep
  isLast: boolean
}) {
  const Icon = stepIcons[step.type] || Brain
  const isActive = step.status === 'active'

  return (
    <div
      className={cn(
        'flex items-start gap-3 py-2 px-3 rounded-md transition-colors',
        isActive && 'bg-secondary/30'
      )}
    >
      <div className="mt-0.5">
        {isActive ? (
          <Loader2 className="h-4 w-4 text-ai-thinking animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-ai-success" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            {stepLabels[step.type]}
          </span>
          {step.duration && (
            <span className="text-xs text-muted-foreground/60">
              {step.duration}ms
            </span>
          )}
        </div>
        <p
          className={cn(
            'text-sm mt-1',
            isActive
              ? 'text-foreground animate-pulse-subtle'
              : 'text-muted-foreground'
          )}
        >
          {step.content}
          {isActive && isLast && <ShimmerText />}
        </p>
      </div>
    </div>
  )
}

function ThinkingAnimation() {
  return (
    <div className="flex items-center gap-1">
      <span
        className="w-2 h-2 rounded-full bg-ai-thinking animate-typing"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="w-2 h-2 rounded-full bg-ai-thinking animate-typing"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-2 h-2 rounded-full bg-ai-thinking animate-typing"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  )
}

function ShimmerText() {
  return (
    <span className="inline-block ml-1 w-16 h-4 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] animate-shimmer rounded" />
  )
}

// Simple thinking dots for inline use
export function ThinkingDots({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span
        className="w-1.5 h-1.5 rounded-full bg-current animate-typing"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-current animate-typing"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-current animate-typing"
        style={{ animationDelay: '300ms' }}
      />
    </span>
  )
}

// ThinkingSteps - Display thinking steps with status
interface ThinkingStepItem {
  id: string
  text: string
  status: 'pending' | 'active' | 'completed'
  duration?: number
}

export function ThinkingSteps({
  steps = [],
  className,
}: {
  steps: (string | ThinkingStepItem)[]
  className?: string
}) {
  const safeSteps = steps || []
  return (
    <div className={cn('space-y-3', className)}>
      {safeSteps.map((step, idx) => {
        const isObject = typeof step === 'object'
        const text = isObject ? step.text : step
        const status = isObject ? step.status : 'completed'
        const key = isObject ? step.id : idx

        return (
          <div key={key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  status === 'completed'
                    ? 'bg-green-500/20 text-green-500'
                    : status === 'active'
                      ? 'bg-blue-500/20 text-blue-500'
                      : 'bg-secondary text-muted-foreground'
                )}
              >
                {status === 'completed' ? '✓' : idx + 1}
              </div>
              {idx < safeSteps.length - 1 && (
                <div className="w-px h-full bg-border mt-1" />
              )}
            </div>
            <p
              className={cn(
                'text-sm pt-1',
                status === 'completed'
                  ? 'text-muted-foreground'
                  : status === 'active'
                    ? 'text-foreground'
                    : 'text-muted-foreground/50'
              )}
            >
              {text}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// Chain of thought display
export function ChainOfThought({
  steps,
  className,
}: {
  steps: string[]
  className?: string
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {steps.map((step, idx) => (
        <div key={idx} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
              {idx + 1}
            </div>
            {idx < steps.length - 1 && (
              <div className="w-px h-full bg-border mt-1" />
            )}
          </div>
          <p className="text-sm text-muted-foreground pt-1">{step}</p>
        </div>
      ))}
    </div>
  )
}

// Reasoning display for model reasoning
export function ReasoningDisplay({
  title = 'Reasoning',
  content,
  isExpanded = false,
  className,
}: {
  title?: string
  content: string
  isExpanded?: boolean
  className?: string
}) {
  const [open, setOpen] = React.useState(isExpanded)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn('rounded-lg border border-border', className)}
    >
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-4 py-3 hover:bg-secondary/50 transition-colors">
        <Brain className="h-4 w-4 text-ai-thinking" />
        <span className="text-sm font-medium flex-1 text-left">{title}</span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-2 text-sm text-muted-foreground whitespace-pre-wrap border-t border-border">
          {content}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
