import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '../../lib/cn'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * Glass variant classes for TooltipContent
 * Follows Premium Glassmorphism spec
 */
const tooltipVariantClasses = {
  default: 'bg-popover border',
  glass: [
    'bg-white/60 dark:bg-white/[0.06]',
    'backdrop-blur-md backdrop-saturate-[1.3]',
    'border border-white/15 dark:border-white/[0.08]',
    'shadow-md antialiased',
  ].join(' '),
  frosted: [
    'bg-white/75 dark:bg-white/[0.1]',
    'backdrop-blur-lg backdrop-saturate-150',
    'border border-white/20 dark:border-white/[0.12]',
    'shadow-lg antialiased',
  ].join(' '),
}

interface TooltipContentProps extends React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
> {
  /**
   * Visual variant - default (solid) or glass (glassmorphism)
   */
  variant?: 'default' | 'glass' | 'frosted'
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, variant = 'default', ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]',
      tooltipVariantClasses[variant],
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
