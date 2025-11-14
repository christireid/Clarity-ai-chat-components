import * as React from 'react'
import { cn } from '../lib/utils'

// Simple scroll area component with enhanced scrollbar styling
export const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-auto',
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
