'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../lib/utils'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Legacy API compatibility wrapper
export interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delay?: number
  showArrow?: boolean
  className?: string
  contentClassName?: string
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const TooltipLegacy: React.FC<TooltipProps> = ({
  children,
  content,
  side = 'top',
  align = 'center',
  delay = 200,
  showArrow = true, // Preserved for API compatibility - Radix doesn't support arrows natively
  className,
  contentClassName,
  disabled = false,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange]
  )

  if (disabled) {
    return <>{children}</>
  }

  // Validate children is a valid React element for asChild
  if (!React.isValidElement(children)) {
    console.warn('Tooltip: children must be a valid React element')
    return <>{children}</>
  }

  // Apply className to the child element if it's a valid element
  const childWithClassName = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        className: cn(className, (children as React.ReactElement<any>).props?.className),
      })
    : children

  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          {childWithClassName}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align} 
          className={cn(contentClassName, showArrow && 'relative')}
        >
          {content}
          {showArrow === true && (
            <div
              className="absolute z-50 h-2 w-2 rotate-45 border border-border bg-popover"
              style={{
                [side === 'top' ? 'bottom' : side === 'bottom' ? 'top' : side === 'left' ? 'right' : 'left']: '-4px',
                [side === 'top' || side === 'bottom' ? 'left' : 'top']: '50%',
                transform: `translate${side === 'top' || side === 'bottom' ? 'X' : 'Y'}(-50%)`,
              }}
              data-testid="tooltip-arrow"
            />
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Export both new and legacy APIs
export { TooltipProvider, TooltipTrigger, TooltipContent }
// Default export for backward compatibility
export { TooltipLegacy as Tooltip }
