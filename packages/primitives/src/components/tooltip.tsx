'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../lib/utils'

// ============================================================================
// Tooltip Provider (shadcn/ui pattern)
// ============================================================================

const TooltipProvider = TooltipPrimitive.Provider

// ============================================================================
// Core Tooltip Components (shadcn/ui pattern)
// ============================================================================

const TooltipRoot = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipPortal = TooltipPrimitive.Portal

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-lg border bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-md',
        'animate-in fade-in-0 zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

const TooltipArrow = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn('fill-popover', className)}
    {...props}
  />
))
TooltipArrow.displayName = 'TooltipArrow'

// ============================================================================
// Convenience Tooltip Component (Legacy API preserved)
// ============================================================================

export interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delay?: number // milliseconds (delayDuration)
  showArrow?: boolean
  className?: string
  contentClassName?: string
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Convenience Tooltip component that wraps Radix UI primitives
 * Maintains backward compatibility with existing API
 * 
 * NOTE: Each Tooltip instance creates its own TooltipProvider for self-contained
 * behavior. For apps with many tooltips, consider wrapping your app in a single
 * <TooltipProvider> and using the primitive components (TooltipRoot, TooltipTrigger, 
 * TooltipContent) directly for better performance.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = 'top',
  align = 'center',
  delay = 200,
  showArrow = false,
  className,
  contentClassName,
  disabled = false,
  open,
  onOpenChange,
}) => {
  if (disabled) {
    return <>{children}</>
  }

  // If children is a valid React element, use it directly with asChild
  // Otherwise, wrap in a span to ensure Radix has a valid element to work with
  const isValidChild = React.isValidElement(children)
  
  const triggerElement = isValidChild ? (
    // Clone element to merge className if provided
    className ? 
      React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn((children as React.ReactElement<{ className?: string }>).props.className, className),
      }) : 
      children
  ) : (
    <span className={cn('inline-block', className)}>{children}</span>
  )

  return (
    <TooltipPrimitive.Provider delayDuration={delay}>
      <TooltipPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>
          {triggerElement}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={8}
            className={cn(
              'z-50 overflow-hidden rounded-lg border bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-md backdrop-blur-sm',
              'animate-in fade-in-0 zoom-in-95',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              'data-[side=bottom]:slide-in-from-top-2',
              'data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2',
              'data-[side=top]:slide-in-from-bottom-2',
              contentClassName
            )}
          >
            {content}
            {showArrow && (
              <TooltipPrimitive.Arrow className="fill-popover" />
            )}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

// ============================================================================
// Simple Tooltip (Alternative API - preserved)
// ============================================================================

export const SimpleTooltip: React.FC<{
  children: React.ReactNode
  text: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
}> = ({ children, text, side = 'top', delay = 200 }) => {
  return (
    <Tooltip content={text} side={side} delay={delay}>
      {children}
    </Tooltip>
  )
}

// ============================================================================
// Exports
// ============================================================================

export {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipArrow,
}
