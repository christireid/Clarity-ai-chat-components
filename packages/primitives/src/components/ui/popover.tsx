'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '../../lib/cn'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

/**
 * Glass variant classes for PopoverContent
 * Follows Premium Glassmorphism spec
 */
const popoverVariantClasses = {
  default: 'bg-popover border',
  glass: [
    'bg-white/70 dark:bg-white/[0.08]',
    'backdrop-blur-[14px] backdrop-saturate-150',
    'border border-white/20 dark:border-white/[0.1]',
    'shadow-lg antialiased isolate',
  ].join(' '),
  frosted: [
    'bg-white/85 dark:bg-white/[0.12]',
    'backdrop-blur-xl backdrop-saturate-[1.8]',
    'border border-white/30 dark:border-white/[0.15]',
    'shadow-xl antialiased isolate',
  ].join(' '),
}

interface PopoverContentProps extends React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
> {
  /**
   * Visual variant - default (solid) or glass (glassmorphism)
   */
  variant?: 'default' | 'glass' | 'frosted'
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      align = 'center',
      sideOffset = 4,
      variant = 'default',
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-72 rounded-md p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]',
          popoverVariantClasses[variant],
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
