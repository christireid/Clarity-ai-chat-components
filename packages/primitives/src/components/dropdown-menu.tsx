'use client'

import * as React from 'react'
import { cn } from '../lib/utils'
import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuTrigger as ShadcnDropdownMenuTrigger,
  DropdownMenuContent as ShadcnDropdownMenuContent,
  DropdownMenuItem as ShadcnDropdownMenuItem,
  DropdownMenuSeparator as ShadcnDropdownMenuSeparator,
  DropdownMenuLabel as ShadcnDropdownMenuLabel,
  DropdownMenuGroup as ShadcnDropdownMenuGroup,
} from './ui/dropdown-menu'

// ============================================================================
// Types
// ============================================================================

export interface DropdownMenuProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  disabled?: boolean
}

export interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  alignOffset?: number
  loopNavigation?: boolean
  autoFocus?: boolean
}

export interface DropdownMenuItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ShadcnDropdownMenuItem>, 'onSelect' | 'onClick'> {
  icon?: React.ReactNode
  shortcut?: string
  destructive?: boolean
  inset?: boolean
  keepOpenOnSelect?: boolean
  active?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

// ============================================================================
// DropdownMenu Root Component
// ============================================================================

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  return (
    <ShadcnDropdownMenu open={controlledOpen} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      {children}
    </ShadcnDropdownMenu>
  )
}

// ============================================================================
// DropdownMenu Trigger
// ============================================================================

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  asChild = false,
  disabled = false,
}) => {
  return (
    <ShadcnDropdownMenuTrigger asChild={asChild} disabled={disabled}>
      {children}
    </ShadcnDropdownMenuTrigger>
  )
}

// ============================================================================
// DropdownMenu Content
// ============================================================================

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className,
  align = 'start',
  side = 'bottom',
  sideOffset = 8,
  alignOffset = 0,
  loopNavigation: _loopNavigation = true, // Radix UI handles this automatically
  autoFocus: _autoFocus = true, // Radix UI handles this automatically
}) => {
  return (
    <ShadcnDropdownMenuContent
      align={align}
      side={side}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      className={cn('min-w-[12rem] overflow-hidden rounded-xl border bg-popover py-1 shadow-md backdrop-blur-sm', className)}
    >
      {children}
    </ShadcnDropdownMenuContent>
  )
}

// ============================================================================
// DropdownMenu Item
// ============================================================================

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof ShadcnDropdownMenuItem>,
  DropdownMenuItemProps
>(
  (
    {
      className,
      icon,
      shortcut,
      destructive = false,
      inset = false,
      keepOpenOnSelect = false,
      active = false,
      disabled = false,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      // onClick might expect HTMLButtonElement, but Radix uses div
      // Wrap in try-catch to prevent errors from breaking the component
      if (onClick) {
        try {
          onClick(event as unknown as React.MouseEvent<HTMLButtonElement>)
        } catch (error) {
          // Log error but don't break the component
          // Use typeof check instead of process.env for client-side code
          if (typeof window !== 'undefined' && window.console && console.error) {
            console.error('Error in DropdownMenuItem onClick handler:', error)
          }
        }
      }
    }

    const handleSelect = React.useCallback(
      (event: Event) => {
        if (keepOpenOnSelect) {
          event.preventDefault()
        }
      },
      [keepOpenOnSelect]
    )

    return (
      <ShadcnDropdownMenuItem
        ref={ref}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-foreground/85 transition-all duration-150',
          'rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0 focus-visible:ring-[3px]',
          destructive
            ? 'hover:bg-destructive/12 hover:text-destructive'
            : 'hover:bg-primary/10 hover:text-primary',
          active && !destructive && 'bg-primary/10 text-primary',
          inset && 'pl-10',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        disabled={disabled}
        onClick={handleClick}
        onSelect={handleSelect}
        {...props}
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon && <span className="text-base text-muted-foreground">{icon}</span>}
          <span className="truncate text-left">{children}</span>
        </div>
        {shortcut && (
          <kbd className="rounded-sm ring-1 ring-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-xs">
            {shortcut}
          </kbd>
        )}
      </ShadcnDropdownMenuItem>
    )
  }
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

// ============================================================================
// DropdownMenu Separator
// ============================================================================

export const DropdownMenuSeparator: React.FC<{ className?: string }> = ({ className }) => {
  return <ShadcnDropdownMenuSeparator className={cn('my-1 bg-border/60', className)} />
}

// ============================================================================
// DropdownMenu Label
// ============================================================================

export const DropdownMenuLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <ShadcnDropdownMenuLabel
      className={cn(
        'px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70',
        className
      )}
    >
      {children}
    </ShadcnDropdownMenuLabel>
  )
}

// ============================================================================
// DropdownMenu Group
// ============================================================================

export const DropdownMenuGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <ShadcnDropdownMenuGroup className={cn('py-1', className)}>{children}</ShadcnDropdownMenuGroup>
}
