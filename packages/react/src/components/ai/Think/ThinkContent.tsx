/**
 * Content component for Think component
 * @packageDocumentation
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { StepItem } from './StepItem'
import type { ThinkStep } from './types'

/**
 * Props for ThinkContent component
 */
interface ThinkContentProps {
  config: { content: string }
  steps?: ThinkStep[]
  content?: React.ReactNode
  isStreaming: boolean
  prefersReducedMotion: boolean
}

/**
 * Content component for Think panel
 */
export const ThinkContent = React.memo(function ThinkContent({
  config,
  steps,
  content,
  isStreaming,
  prefersReducedMotion,
}: ThinkContentProps) {
  return (
    <div className={config.content}>
      {/* Steps */}
      {steps && steps.length > 0 && (
        <div className="space-y-1 mb-3">
          {steps.map((step, index) => (
            <StepItem
              key={`step-${index}`}
              step={step}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      {content && (
        <div
          className={cn(
            'text-sm text-muted-foreground leading-relaxed',
            isStreaming && 'streaming-stable'
          )}
          aria-busy={isStreaming}
        >
          {content}
          {isStreaming && (
            <span className="message-cursor" aria-hidden="true">▋</span>
          )}
        </div>
      )}
    </div>
  )
})

ThinkContent.displayName = 'ThinkContent'
