'use client'

/**
 * ToolCardList Component
 *
 * List container for multiple ToolCard instances
 * @packageDocumentation
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { ToolCard } from './ToolCard'
import { GAP_CLASSES } from './constants'
import type { ToolCardListProps } from './types'

/**
 * ToolCardList - Display multiple tool cards
 *
 * @example
 * ```tsx
 * <ToolCardList
 *   tools={[
 *     { id: '1', name: 'search', status: 'success' },
 *     { id: '2', name: 'calculate', status: 'running' }
 *   ]}
 *   size="sm"
 *   showArgs
 * />
 * ```
 */
export function ToolCardList({
  tools,
  size = 'sm',
  gap = 'sm',
  showArgs = false,
  showResult = false,
  className,
}: ToolCardListProps) {
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())

  const toggleExpand = React.useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  return (
    <div className={cn('flex flex-col', GAP_CLASSES[gap], className)}>
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          name={tool.name}
          status={tool.status}
          args={tool.args}
          result={tool.result}
          error={tool.error}
          duration={tool.duration}
          size={size}
          showArgs={showArgs}
          showResult={showResult}
          expanded={expandedIds.has(tool.id)}
          onToggleExpand={
            (showArgs && tool.args) || (showResult && tool.result) || tool.error
              ? () => toggleExpand(tool.id)
              : undefined
          }
        />
      ))}
    </div>
  )
}

ToolCardList.displayName = 'ToolCardList'
