import * as React from 'react'
import { cn } from '../lib/utils'

// Simple scroll area component
export const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative overflow-auto rounded-xl bg-[hsl(var(--surface-muted))] [scrollbar-color:rgba(148,163,184,0.4)_transparent] [scrollbar-width:thin]', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ScrollArea.displayName = 'ScrollArea'
