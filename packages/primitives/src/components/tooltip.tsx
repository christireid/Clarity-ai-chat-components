'use client'

import * as React from 'react'
import { cn } from '../lib/cn'
import {
  Tooltip as ShadcnTooltip,
  TooltipTrigger as ShadcnTooltipTrigger,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
} from './ui/tooltip'

// ============================================================================
// Types
// ============================================================================

export interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delay?: number // milliseconds
  sideOffset?: number // pixels offset from trigger
  showArrow?: boolean
  className?: string
  contentClassName?: string
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// ============================================================================
// Tooltip Component
// ============================================================================

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = 'top',
  align = 'center',
  delay = 200,
  sideOffset = 8,
  showArrow = true,
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

  // Map align to Radix UI align prop
  const radixAlign =
    align === 'start' ? 'start' : align === 'end' ? 'end' : 'center'

  if (disabled) {
    return <div className={cn('inline-block', className)}>{children}</div>
  }

  // Use Radix UI's built-in delay via delayDuration prop
  // Remove custom delay handlers to avoid double-delay
  // Validate delay to prevent negative values
  const validDelay = Math.max(0, delay || 200)

  return (
    <ShadcnTooltipProvider delayDuration={validDelay}>
      <ShadcnTooltip open={open} onOpenChange={setOpen}>
        <ShadcnTooltipTrigger asChild className={cn('inline-block', className)}>
          {children}
        </ShadcnTooltipTrigger>
        <ShadcnTooltipContent
          side={side}
          align={radixAlign}
          sideOffset={sideOffset}
          className={cn(
            'text-xs font-medium rounded-lg backdrop-blur-sm',
            showArrow && 'relative',
            contentClassName
          )}
        >
          {content}
          {showArrow && (
            <div
              className={cn(
                'absolute w-2 h-2 bg-popover border-border/40 rotate-45',
                getArrowClasses(side, align)
              )}
            />
          )}
        </ShadcnTooltipContent>
      </ShadcnTooltip>
    </ShadcnTooltipProvider>
  )
}

// ============================================================================
// Helper Functions
// ============================================================================

function getArrowClasses(
  side: 'top' | 'right' | 'bottom' | 'left',
  align: 'start' | 'center' | 'end'
): string {
  const baseClasses: string[] = []

  // Position arrow on opposite side
  if (side === 'top') {
    baseClasses.push('bottom-[-5px]', 'border-t', 'border-l')
    if (align === 'start') baseClasses.push('left-3')
    else if (align === 'end') baseClasses.push('right-3')
    else baseClasses.push('left-1/2', '-translate-x-1/2')
  } else if (side === 'bottom') {
    baseClasses.push('top-[-5px]', 'border-b', 'border-r')
    if (align === 'start') baseClasses.push('left-3')
    else if (align === 'end') baseClasses.push('right-3')
    else baseClasses.push('left-1/2', '-translate-x-1/2')
  } else if (side === 'left') {
    baseClasses.push('right-[-5px]', 'border-l', 'border-b')
    if (align === 'start') baseClasses.push('top-3')
    else if (align === 'end') baseClasses.push('bottom-3')
    else baseClasses.push('top-1/2', '-translate-y-1/2')
  } else if (side === 'right') {
    baseClasses.push('left-[-5px]', 'border-r', 'border-t')
    if (align === 'start') baseClasses.push('top-3')
    else if (align === 'end') baseClasses.push('bottom-3')
    else baseClasses.push('top-1/2', '-translate-y-1/2')
  }

  return baseClasses.join(' ')
}

// ============================================================================
// Simple Tooltip (Alternative API)
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
