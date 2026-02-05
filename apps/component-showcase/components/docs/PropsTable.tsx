'use client'

import { useState } from 'react'
import { Check, X, Copy, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import type { PropDefinition } from '@/lib/docs-parser'
import { formatType } from '@/lib/docs-parser'

interface PropsTableProps {
  props: PropDefinition[]
  className?: string
}

export function PropsTable({ props, className }: PropsTableProps) {
  const [expandedProps, setExpandedProps] = useState<Set<string>>(new Set())
  const [copiedProp, setCopiedProp] = useState<string | null>(null)

  const toggleExpanded = (propName: string) => {
    setExpandedProps((prev) => {
      const next = new Set(prev)
      if (next.has(propName)) {
        next.delete(propName)
      } else {
        next.add(propName)
      }
      return next
    })
  }

  const copyPropName = async (propName: string) => {
    await navigator.clipboard.writeText(propName)
    setCopiedProp(propName)
    setTimeout(() => setCopiedProp(null), 2000)
  }

  if (props.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No props found.</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {props.map((prop) => {
        const isExpanded = expandedProps.has(prop.name)
        const typeNeedsExpansion = prop.type.length > 50

        return (
          <div
            key={prop.name}
            className="glass-panel rounded-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono font-semibold text-primary">
                      {prop.name}
                    </code>
                    {prop.required && (
                      <span className="text-xs text-red-500 font-medium">
                        required
                      </span>
                    )}
                    <button
                      onClick={() => copyPropName(prop.name)}
                      className="ml-auto p-1 hover:bg-background/50 rounded transition-colors"
                      title="Copy prop name"
                    >
                      {copiedProp === prop.name ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-start gap-2">
                    <code className="text-xs font-mono text-muted-foreground break-all">
                      {typeNeedsExpansion && !isExpanded
                        ? formatType(prop.type.slice(0, 50) + '...')
                        : formatType(prop.type)}
                    </code>
                    {typeNeedsExpansion && (
                      <button
                        onClick={() => toggleExpanded(prop.name)}
                        className="p-0.5 hover:bg-background/50 rounded transition-colors shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {prop.required ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>

              {prop.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {prop.description}
                </p>
              )}

              {prop.defaultValue && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Default:</span>
                  <code className="bg-background/50 px-1.5 py-0.5 rounded">
                    {prop.defaultValue}
                  </code>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
