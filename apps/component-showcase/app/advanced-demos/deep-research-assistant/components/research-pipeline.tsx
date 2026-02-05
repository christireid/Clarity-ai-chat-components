'use client'

import { useState } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Lightbulb,
  Search,
  BookOpen,
  GitCompareArrows,
  Sparkles,
  Check,
  ChevronDown,
  Loader2,
  Clock,
} from 'lucide-react'

export interface PipelineStep {
  id: string
  label: string
  description: string
  status: 'pending' | 'active' | 'completed'
  progress: number
}

interface ResearchPipelineProps {
  steps: PipelineStep[]
  isActive: boolean
  estimatedTimeRemaining?: number
  className?: string
}

const stepIcons: Record<string, React.ElementType> = {
  planning: Lightbulb,
  searching: Search,
  reading: BookOpen,
  'cross-referencing': GitCompareArrows,
  synthesizing: Sparkles,
}

const stepColors: Record<string, string> = {
  planning: 'text-amber-500',
  searching: 'text-blue-500',
  reading: 'text-emerald-500',
  'cross-referencing': 'text-violet-500',
  synthesizing: 'text-rose-500',
}

const stepBgColors: Record<string, string> = {
  planning: 'bg-amber-500/10',
  searching: 'bg-blue-500/10',
  reading: 'bg-emerald-500/10',
  'cross-referencing': 'bg-violet-500/10',
  synthesizing: 'bg-rose-500/10',
}

const stepRingColors: Record<string, string> = {
  planning: 'ring-amber-500/30',
  searching: 'ring-blue-500/30',
  reading: 'ring-emerald-500/30',
  'cross-referencing': 'ring-violet-500/30',
  synthesizing: 'ring-rose-500/30',
}

const stepProgressColors: Record<string, string> = {
  planning: 'bg-amber-500',
  searching: 'bg-blue-500',
  reading: 'bg-emerald-500',
  'cross-referencing': 'bg-violet-500',
  synthesizing: 'bg-rose-500',
}

export function ResearchPipeline({
  steps,
  isActive,
  estimatedTimeRemaining,
  className,
}: ResearchPipelineProps) {
  const [collapsed, setCollapsed] = useState(false)

  if (steps.length === 0 && !isActive) return null

  const completedCount = steps.filter(s => s.status === 'completed').length
  const totalSteps = steps.length
  const overallProgress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0

  return (
    <div className={cn(
      'rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden mb-4',
      isActive && 'ring-1 ring-primary/20',
      className
    )}>
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        {isActive ? (
          <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {isActive ? 'Deep Research in Progress' : 'Research Pipeline Complete'}
            </span>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalSteps} steps
            </span>
          </div>
          {/* Overall progress bar */}
          <div className="h-1 w-full bg-muted rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
        {isActive && estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Clock className="h-3 w-3" />
            ~{estimatedTimeRemaining}s
          </div>
        )}
        <ChevronDown className={cn(
          'h-4 w-4 text-muted-foreground transition-transform shrink-0',
          collapsed && '-rotate-90'
        )} />
      </button>

      {/* Steps */}
      {!collapsed && (
        <div className="px-4 pb-4 space-y-2">
          {steps.map((step, index) => {
            const IconComponent = stepIcons[step.id] || Sparkles
            const color = stepColors[step.id] || 'text-primary'
            const bgColor = stepBgColors[step.id] || 'bg-primary/10'
            const ringColor = stepRingColors[step.id] || 'ring-primary/30'
            const progressColor = stepProgressColors[step.id] || 'bg-primary'

            return (
              <div key={step.id} className="flex items-start gap-3">
                {/* Connector line */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300',
                    step.status === 'completed' && 'bg-green-500/10 text-green-500',
                    step.status === 'active' && cn(bgColor, color, 'ring-1', ringColor, 'animate-pulse'),
                    step.status === 'pending' && 'bg-muted text-muted-foreground'
                  )}>
                    {step.status === 'completed' ? (
                      <Check className="h-4 w-4" />
                    ) : step.status === 'active' ? (
                      <IconComponent className="h-4 w-4" />
                    ) : (
                      <IconComponent className="h-4 w-4 opacity-50" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      'w-px h-4 mt-1',
                      step.status === 'completed' ? 'bg-green-500/30' : 'bg-muted'
                    )} />
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-sm font-medium',
                      step.status === 'pending' && 'text-muted-foreground'
                    )}>
                      {step.label}
                    </span>
                    {step.status === 'active' && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                        In Progress
                      </span>
                    )}
                    {step.status === 'completed' && (
                      <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded-full font-medium">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  {step.status === 'active' && (
                    <div className="h-1 w-full bg-muted rounded-full mt-2 overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-300', progressColor)}
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
