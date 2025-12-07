'use client'

import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '../lib/utils'

type ScrollAreaElement = React.ElementRef<typeof ScrollAreaPrimitive.Root>
type ScrollAreaRootProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>

export interface ScrollAreaProps extends ScrollAreaRootProps {
  /** Optional classes applied to the internal viewport element. */
  viewportClassName?: string
}

const viewportBaseClasses =
  'h-full w-full rounded-[inherit] overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40 transition-colors duration-200 ease-out'

const ScrollArea = React.forwardRef<ScrollAreaElement, ScrollAreaProps>(
  ({ className, children, viewportClassName, ...props }, ref) => {
    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          data-slot="scrollarea-viewport"
          className={cn(viewportBaseClasses, viewportClassName)}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollBar orientation="horizontal" />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    )
  }
)
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
