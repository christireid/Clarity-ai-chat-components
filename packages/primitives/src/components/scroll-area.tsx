import * as React from 'react'
import { cn } from '../lib/utils'

// Simple scroll area component with enhanced scrollbar styling
// Works with both fixed heights (h-full) and flexbox layouts (flex-1 min-h-0)
export const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base overflow handling
          'overflow-y-auto overflow-x-hidden',
          // Prevent scroll chaining to parent elements
          'overscroll-contain',
          // Custom scrollbar styling with refined opacity
          'scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent',
          'hover:scrollbar-thumb-muted-foreground/40',
          'transition-colors duration-200 ease-out',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ScrollArea.displayName = 'ScrollArea'
