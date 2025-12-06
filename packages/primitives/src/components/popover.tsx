'use client'

import * as React from 'react'
import { cn } from '../lib/utils'
import {
  Popover as ShadcnPopover,
  PopoverTrigger as ShadcnPopoverTrigger,
  PopoverContent as ShadcnPopoverContent,
} from './ui/popover'

// ============================================================================
// Types
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

// Context for PopoverClose
const PopoverContext = React.createContext<{ setOpen: (open: boolean) => void } | null>(null)

const usePopover = () => {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error('PopoverClose must be used within a Popover')
  }
  return context
}

// ============================================================================
// Popover Root Component
// ============================================================================

export const Popover: React.FC<PopoverProps> = ({
  open: controlledOpen,
  onOpenChange,
  children,
  defaultOpen = false,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
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

  return (
    <PopoverContext.Provider value={{ setOpen }}>
      <ShadcnPopover open={open} onOpenChange={setOpen} defaultOpen={defaultOpen}>
        {children}
      </ShadcnPopover>
    </PopoverContext.Provider>
  )
}

// ============================================================================
// Popover Trigger
// ============================================================================

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, asChild = false }) => {
  return <ShadcnPopoverTrigger asChild={asChild}>{children}</ShadcnPopoverTrigger>
}

// ============================================================================
// Popover Content
// ============================================================================

export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  className,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  alignOffset = 0,
  closeOnClickOutside = true,
  closeOnEscape = true,
  showArrow = false,
  avoidCollisions: _avoidCollisions = true, // Radix UI handles collisions automatically
  collisionPadding = 8,
}) => {
  return (
    <ShadcnPopoverContent
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
      onPointerDownOutside={closeOnClickOutside ? undefined : (e) => e.preventDefault()}
      collisionPadding={collisionPadding}
      className={cn(
        'rounded-xl backdrop-blur-sm',
        showArrow && 'relative',
        className
      )}
    >
      {children}
      {showArrow && (
        <div
          className={cn(
            'absolute w-3 h-3 bg-popover border-border/40 rotate-45',
            getArrowClasses(side, align)
          )}
        />
      )}
    </ShadcnPopoverContent>
  )
}

// ============================================================================
// Popover Sub-components
// ============================================================================

export const PopoverClose: React.FC<{
  children?: React.ReactNode
  className?: string
  asChild?: boolean
}> = ({ children, className, asChild }) => {
  const { setOpen } = usePopover()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => setOpen(false),
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button onClick={() => setOpen(false)} className={className} type="button">
      {children}
    </button>
  )
}

export const PopoverAnchor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

// ============================================================================
// Helper Functions
// ============================================================================

function getArrowClasses(
  side: 'top' | 'right' | 'bottom' | 'left',
  align: 'start' | 'center' | 'end'
): string {
  const baseClasses: string[] = []

  if (side === 'top') {
    baseClasses.push('bottom-[-5px]', 'border-t', 'border-l')
    if (align === 'start') baseClasses.push('left-4')
    else if (align === 'end') baseClasses.push('right-4')
    else baseClasses.push('left-1/2', '-translate-x-1/2')
  } else if (side === 'bottom') {
    baseClasses.push('top-[-5px]', 'border-b', 'border-r')
    if (align === 'start') baseClasses.push('left-4')
    else if (align === 'end') baseClasses.push('right-4')
    else baseClasses.push('left-1/2', '-translate-x-1/2')
  } else if (side === 'left') {
    baseClasses.push('right-[-5px]', 'border-l', 'border-b')
    if (align === 'start') baseClasses.push('top-4')
    else if (align === 'end') baseClasses.push('bottom-4')
    else baseClasses.push('top-1/2', '-translate-y-1/2')
  } else if (side === 'right') {
    baseClasses.push('left-[-5px]', 'border-r', 'border-t')
    if (align === 'start') baseClasses.push('top-4')
    else if (align === 'end') baseClasses.push('bottom-4')
    else baseClasses.push('top-1/2', '-translate-y-1/2')
  }

  return baseClasses.join(' ')
}
