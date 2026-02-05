'use client'

import { AlertTriangle, Lightbulb } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import type { TroubleshootingItem } from '@/lib/docs-parser'

interface TroubleshootingGuideProps {
  items: TroubleshootingItem[]
  className?: string
}

export function TroubleshootingGuide({
  items,
  className,
}: TroubleshootingGuideProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No troubleshooting items documented yet.</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {items.map((item, index) => (
        <div key={index} className="glass-panel rounded-lg overflow-hidden">
          <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                  Problem
                </h4>
                <p className="text-sm">{item.problem}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border-l-4 border-green-500 p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-700 dark:text-green-400 mb-1">
                  Solution
                </h4>
                <p className="text-sm mb-3">{item.solution}</p>

                {item.code && (
                  <pre className="text-xs bg-background/50 p-3 rounded-lg overflow-x-auto">
                    <code>{item.code}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
