import * as React from 'react'
import { cn } from '../lib/utils'

// Simple scroll area component with enhanced scrollbar styling
export const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
<<<<<<< Current (Your changes)
        className={cn('relative overflow-auto rounded-xl bg-[hsl(var(--surface-muted))] [scrollbar-color:rgba(148,163,184,0.4)_transparent] [scrollbar-width:thin]', className)}
=======
        className={cn(
          'relative overflow-auto',
          // Custom scrollbar styling
          'scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent',
          'hover:scrollbar-thumb-muted-foreground/30',
          'transition-colors',
          className
        )}
>>>>>>> Incoming (Background Agent changes)
        {...props}
      >
        {children}
      </div>
    )
  }
)
ScrollArea.displayName = 'ScrollArea'
