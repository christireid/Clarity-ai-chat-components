'use client'

import { useState } from 'react'
import { cn } from '@clarity-chat/primitives'
import { Brain, ChevronDown, Loader2 } from 'lucide-react'
import type { ThinkingStep } from './types'

interface ThinkingDisplayProps {
  steps: ThinkingStep[]
  isActive?: boolean
  className?: string
}

export function ThinkingDisplay({ steps, isActive, className }: ThinkingDisplayProps) {
  const [expanded, setExpanded] = useState(false)

  if (steps.length === 0 && !isActive) return null

  return (
    <div className={cn('mb-3', className)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors w-full',
          isActive
            ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
        )}
      >
        {isActive ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Brain className="h-3 w-3" />
        )}
        <span>
          {isActive ? 'Thinking...' : `${steps.length} thinking steps`}
        </span>
        <ChevronDown className={cn(
          'h-3 w-3 ml-auto transition-transform',
          expanded && 'rotate-180'
        )} />
      </button>
      {expanded && (
        <div className="mt-1.5 pl-4 border-l-2 border-violet-500/20 space-y-1">
          {steps.map((step, i) => (
            <div key={step.id} className="text-xs text-muted-foreground py-0.5 flex items-start gap-2">
              <span className="text-violet-500/50 shrink-0 font-mono w-4">{i + 1}.</span>
              <span>{step.content}</span>
            </div>
          ))}
          {isActive && (
            <div className="text-xs text-violet-500 py-0.5 flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="animate-pulse">Processing...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
