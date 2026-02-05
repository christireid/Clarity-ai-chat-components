'use client'

import { ComponentPreview } from './ComponentPreview'
import { AlertCircle, Plus, Minus, Equal } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface DiffViewProps {
  leftComponent: string
  rightComponent: string
}

interface DiffItem {
  type: 'added' | 'removed' | 'changed' | 'unchanged'
  property: string
  leftValue?: string
  rightValue?: string
}

// Mock diff data - in a real implementation, this would analyze actual component differences
const generateDiff = (left: string, right: string): DiffItem[] => {
  return [
    { type: 'unchanged', property: 'variant', leftValue: 'default', rightValue: 'default' },
    { type: 'changed', property: 'size', leftValue: 'md', rightValue: 'lg' },
    { type: 'added', property: 'animation', rightValue: 'fade-in' },
    { type: 'removed', property: 'shadow', leftValue: 'true' },
    { type: 'changed', property: 'theme', leftValue: 'light', rightValue: 'dark' },
    { type: 'unchanged', property: 'rounded', leftValue: 'true', rightValue: 'true' },
  ]
}

export function DiffView({ leftComponent, rightComponent }: DiffViewProps) {
  const diffItems = generateDiff(leftComponent, rightComponent)
  const added = diffItems.filter((item) => item.type === 'added').length
  const removed = diffItems.filter((item) => item.type === 'removed').length
  const changed = diffItems.filter((item) => item.type === 'changed').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Difference Analysis</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <Plus className="h-4 w-4" />
            <span>{added} added</span>
          </div>
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <Minus className="h-4 w-4" />
            <span>{removed} removed</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="h-4 w-4" />
            <span>{changed} changed</span>
          </div>
        </div>
      </div>

      {/* Visual Diff */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="glass-panel p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
              Component A (Original)
            </div>
            <div className="text-xs text-muted-foreground">{leftComponent}</div>
          </div>
          <div className="h-[400px] rounded-lg border bg-background p-6 overflow-auto">
            <ComponentPreview componentId={leftComponent} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="glass-panel p-3 rounded-lg">
            <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
              Component B (Modified)
            </div>
            <div className="text-xs text-muted-foreground">{rightComponent}</div>
          </div>
          <div className="h-[400px] rounded-lg border bg-background p-6 overflow-auto">
            <ComponentPreview componentId={rightComponent} />
          </div>
        </div>
      </div>

      {/* Property Diff Table */}
      <div className="glass-panel rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h4 className="font-semibold">Property Differences</h4>
          <p className="text-sm text-muted-foreground">
            Detailed comparison of component properties and configurations
          </p>
        </div>
        <div className="divide-y">
          {diffItems.map((item, index) => (
            <div
              key={index}
              className={cn(
                'grid grid-cols-[auto,1fr,1fr,1fr] gap-4 p-4 items-center',
                item.type === 'added' && 'bg-green-500/5',
                item.type === 'removed' && 'bg-red-500/5',
                item.type === 'changed' && 'bg-yellow-500/5'
              )}
            >
              {/* Icon */}
              <div>
                {item.type === 'added' && (
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-green-500/20">
                    <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                )}
                {item.type === 'removed' && (
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-red-500/20">
                    <Minus className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                )}
                {item.type === 'changed' && (
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-yellow-500/20">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                )}
                {item.type === 'unchanged' && (
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-500/20">
                    <Equal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                )}
              </div>

              {/* Property Name */}
              <div>
                <code className="text-sm font-mono font-medium">{item.property}</code>
              </div>

              {/* Left Value */}
              <div>
                {item.leftValue && (
                  <code
                    className={cn(
                      'text-sm font-mono px-2 py-1 rounded',
                      item.type === 'removed' && 'bg-red-500/10 text-red-700 dark:text-red-300 line-through',
                      item.type === 'changed' && 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
                      item.type === 'unchanged' && 'bg-gray-500/10'
                    )}
                  >
                    {item.leftValue}
                  </code>
                )}
              </div>

              {/* Right Value */}
              <div>
                {item.rightValue && (
                  <code
                    className={cn(
                      'text-sm font-mono px-2 py-1 rounded',
                      item.type === 'added' && 'bg-green-500/10 text-green-700 dark:text-green-300',
                      item.type === 'changed' && 'bg-green-500/10 text-green-700 dark:text-green-300',
                      item.type === 'unchanged' && 'bg-gray-500/10'
                    )}
                  >
                    {item.rightValue}
                  </code>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
