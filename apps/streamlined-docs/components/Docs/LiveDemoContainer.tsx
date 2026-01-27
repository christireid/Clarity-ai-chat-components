'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Play, RotateCcw, Code2 } from 'lucide-react'

/**
 * LiveDemoContainer - Wrapper for interactive component demonstrations
 *
 * Provides a consistent frame for live demos with:
 * - Reset button to restore initial state
 * - Optional controls panel for demo configuration
 * - Optional code view toggle
 * - Bordered card styling
 *
 * @example
 * ```tsx
 * <LiveDemoContainer
 *   title="Button Demo"
 *   controls={<label><input type="checkbox" /> Show icon</label>}
 *   onReset={() => setShowIcon(false)}
 * >
 *   <Button icon={showIcon ? <Icon /> : undefined}>Click me</Button>
 * </LiveDemoContainer>
 * ```
 */
export interface LiveDemoContainerProps {
  children: React.ReactNode
  title?: string
  description?: string
  controls?: React.ReactNode
  onReset?: () => void
  showCodeToggle?: boolean
  code?: string
  className?: string
}

export function LiveDemoContainer({
  children,
  title,
  description,
  controls,
  onReset,
  showCodeToggle = false,
  code,
  className,
}: LiveDemoContainerProps) {
  const [showCode, setShowCode] = React.useState(false)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-brand-500" aria-hidden="true" />
              <h4 className="font-semibold text-foreground">{title}</h4>
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Controls */}
      {(controls || onReset || showCodeToggle) && (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
          {controls && <div className="flex-1 flex items-center gap-4">{controls}</div>}
          <div className="flex items-center gap-2">
            {showCodeToggle && code && (
              <button
                onClick={() => setShowCode(!showCode)}
                className={cn(
                  'text-sm px-3 py-1.5 rounded transition-colors',
                  'hover:bg-muted/50 flex items-center gap-1.5',
                  showCode
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                    : 'text-muted-foreground'
                )}
                aria-label={showCode ? 'Hide code' : 'Show code'}
              >
                <Code2 className="w-3.5 h-3.5" />
                {showCode ? 'Hide' : 'Code'}
              </button>
            )}
            {onReset && (
              <button
                onClick={onReset}
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded hover:bg-muted/50 transition-colors flex items-center gap-1.5"
                aria-label="Reset demo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Demo Area */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {showCode && code ? (
          <div className="p-4 bg-muted/10">
            <pre className="text-sm overflow-x-auto">
              <code>{code}</code>
            </pre>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
