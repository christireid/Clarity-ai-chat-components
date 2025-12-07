import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../lib/utils"

// ============================================================================
// Core Popover Components (shadcn/ui pattern with Radix UI)
// ============================================================================

const PopoverRoot = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor
const PopoverPortal = PopoverPrimitive.Portal
const PopoverClose = PopoverPrimitive.Close

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

const PopoverArrow = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    className={cn('fill-popover', className)}
    {...props}
  />
))
PopoverArrow.displayName = 'PopoverArrow'

// ============================================================================
// Convenience Popover Component (Legacy API preserved)
// ============================================================================

export interface PopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  defaultOpen?: boolean
}

export interface PopoverTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

export interface PopoverContentProps {
  children: React.ReactNode
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  alignOffset?: number
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  showArrow?: boolean
  avoidCollisions?: boolean
  collisionPadding?: number
}

/**
 * Convenience Popover wrapper that maintains the legacy compound component API
 * while using Radix UI primitives underneath
 */
const Popover: React.FC<PopoverProps> = ({
  open,
  onOpenChange,
  children,
  defaultOpen = false,
}) => {
  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
    >
      {children}
    </PopoverPrimitive.Root>
  )
}

/**
 * Legacy PopoverTrigger wrapper
 */
const LegacyPopoverTrigger: React.FC<PopoverTriggerProps> = ({
  children,
  asChild = false,
}) => {
  return (
    <PopoverPrimitive.Trigger asChild={asChild}>
      {asChild ? (
        children
      ) : (
        <button
          type="button"
          aria-haspopup="dialog"
          className="inline-flex items-center justify-center"
        >
          {children}
        </button>
      )}
    </PopoverPrimitive.Trigger>
  )
}

/**
 * Legacy PopoverContent wrapper with full prop support
 */
const LegacyPopoverContent: React.FC<PopoverContentProps> = ({
  children,
  className,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  alignOffset = 0,
  closeOnClickOutside = true,
  closeOnEscape = true,
  showArrow = false,
  avoidCollisions = true,
  collisionPadding = 8,
}) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        avoidCollisions={avoidCollisions}
        collisionPadding={collisionPadding}
        onPointerDownOutside={
          closeOnClickOutside ? undefined : (e) => e.preventDefault()
        }
        onEscapeKeyDown={
          closeOnEscape ? undefined : (e) => e.preventDefault()
        }
        className={cn(
          'z-50 rounded-xl border bg-popover p-4 text-popover-foreground shadow-md outline-none backdrop-blur-sm',
          'animate-in fade-in-0 zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=top]:slide-in-from-bottom-2',
          className
        )}
      >
        {children}
        {showArrow && (
          <PopoverPrimitive.Arrow className="fill-popover" />
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

/**
 * Legacy PopoverClose wrapper
 */
const LegacyPopoverClose: React.FC<{
  children?: React.ReactNode
  className?: string
  asChild?: boolean
}> = ({ children, className, asChild }) => {
  return (
    <PopoverPrimitive.Close asChild={asChild} className={className}>
      {asChild ? (
        children
      ) : (
        <button type="button">{children}</button>
      )}
    </PopoverPrimitive.Close>
  )
}

// Add displayNames to legacy components
LegacyPopoverTrigger.displayName = 'PopoverTrigger'
LegacyPopoverContent.displayName = 'PopoverContent'
LegacyPopoverClose.displayName = 'PopoverClose'

// Renamed internal shadcn/ui components to avoid export conflicts
const ShadcnPopoverContent = PopoverContent
const ShadcnPopoverTrigger = PopoverTrigger

// ============================================================================
// Exports (Legacy API as primary for backward compatibility - matches Dialog pattern)
// ============================================================================

export {
  // Primary exports - Legacy API for backward compatibility
  // These are what existing consumers expect (matching Dialog exports)
  Popover,
  LegacyPopoverTrigger as PopoverTrigger,
  LegacyPopoverContent as PopoverContent,
  LegacyPopoverClose as PopoverClose,
  PopoverAnchor,
  PopoverArrow,
  // shadcn/ui pattern exports (for new code or migration)
  PopoverRoot,
  PopoverPortal,
  ShadcnPopoverTrigger as PopoverTriggerRadix,
  ShadcnPopoverContent as PopoverContentRadix,
  PopoverClose as PopoverCloseRadix,
}

Popover.displayName = 'Popover'
