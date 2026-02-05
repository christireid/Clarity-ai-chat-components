'use client'

import { CheckCircle2 } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface BestPracticesProps {
  practices: string[]
  className?: string
}

export function BestPractices({ practices, className }: BestPracticesProps) {
  if (practices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No best practices documented yet.</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {practices.map((practice, index) => (
        <div key={index} className="glass-panel p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <p className="text-sm">{practice}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
