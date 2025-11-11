import * as React from 'react'
import { cn } from '../lib/utils'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** React 19: ref is now a regular prop! */
  ref?: React.Ref<HTMLDivElement>
}

// Simple scroll area component with enhanced scrollbar styling
export function ScrollArea({ className, children, ref, ...props }: ScrollAreaProps) {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-auto',
          // Custom scrollbar styling
          'scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent',
          'hover:scrollbar-thumb-muted-foreground/30',
          'transition-colors',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
}
ScrollArea.displayName = 'ScrollArea'
