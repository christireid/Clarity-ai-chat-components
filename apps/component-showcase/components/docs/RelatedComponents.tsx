'use client'

import { ExternalLink } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface RelatedComponentsProps {
  components: string[]
  className?: string
}

export function RelatedComponents({
  components,
  className,
}: RelatedComponentsProps) {
  if (components.length === 0) return null

  return (
    <div className={cn('', className)}>
      <h3 className="text-lg font-semibold mb-3">Related Components</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {components.map((component) => (
          <a
            key={component}
            href={`/components/${component.toLowerCase()}`}
            className="glass-panel p-3 rounded-lg flex items-center justify-between group hover:bg-background/50 transition-colors"
          >
            <span className="font-medium">{component}</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        ))}
      </div>
    </div>
  )
}
