import * as React from 'react'
import { cn } from '../lib/utils'

// Simple scroll area component with enhanced scrollbar styling
// React 19: Using ref as prop instead of forwardRef
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** React 19: ref can be a prop directly */
  ref?: React.Ref<HTMLDivElement>
}

export function ScrollArea({
  className,
  children,
  ref,
  ...props
}: ScrollAreaProps) {
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
