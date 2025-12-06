'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '../lib/utils'

// ============================================================================
// Core DropdownMenu Components (shadcn/ui pattern with Radix UI)
// ============================================================================

const DropdownMenuRoot = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium outline-none',
      'focus:bg-primary/10 focus:text-primary',
      'data-[state=open]:bg-primary/10 data-[state=open]:text-primary',
      inset && 'pl-10',
      className
    )}
    {...props}
  >
    {children}
    <svg
      className="ml-auto h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[12rem] overflow-hidden rounded-xl border bg-popover py-1 text-popover-foreground shadow-lg',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[12rem] overflow-hidden rounded-xl border bg-popover py-1 text-popover-foreground shadow-md backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
    destructive?: boolean
    icon?: React.ReactNode
    shortcut?: string
  }
>(({ className, inset, destructive, icon, shortcut, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/85 outline-none transition-all duration-150',
      'focus:bg-primary/10 focus:text-primary',
      destructive && 'focus:bg-destructive/12 focus:text-destructive',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-10',
      className
    )}
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
  </DropdownMenuPrimitive.Item>
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-150',
      'focus:bg-primary/10 focus:text-primary',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-4 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-150',
      'focus:bg-primary/10 focus:text-primary',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-4 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <svg
          className="h-2 w-2 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="12" />
        </svg>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70',
      inset && 'pl-10',
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('my-1 h-px bg-border/60', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-[11px] tracking-widest text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

// ============================================================================
// Legacy DropdownMenu API (Backward Compatibility)
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

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  shortcut?: string
  destructive?: boolean
  inset?: boolean
  keepOpenOnSelect?: boolean
  active?: boolean
}

/**
 * Legacy DropdownMenu wrapper
 */
const DropdownMenu: React.FC<DropdownMenuProps> = ({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  return (
    <DropdownMenuPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {children}
    </DropdownMenuPrimitive.Root>
  )
}

/**
 * Legacy DropdownMenuTrigger wrapper
 */
const LegacyDropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  asChild = false,
  disabled = false,
}) => {
  if (asChild) {
    return (
      <DropdownMenuPrimitive.Trigger asChild disabled={disabled}>
        {children}
      </DropdownMenuPrimitive.Trigger>
    )
  }

  return (
    <DropdownMenuPrimitive.Trigger
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium tracking-[0.13px] shadow-xs transition-all duration-200',
        'hover:border-primary/40 hover:text-primary hover:shadow-sm',
        'focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-60'
      )}
    >
      {children}
    </DropdownMenuPrimitive.Trigger>
  )
}

/**
 * Legacy DropdownMenuContent wrapper
 */
const LegacyDropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className,
  align = 'start',
  side = 'bottom',
  sideOffset = 8,
  alignOffset = 0,
  loopNavigation = true,
}) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        loop={loopNavigation}
        className={cn(
          'z-50 min-w-[12rem] overflow-hidden rounded-xl border bg-popover py-1 text-popover-foreground shadow-md backdrop-blur-sm',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=top]:slide-in-from-bottom-2',
          className
        )}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

// Add displayNames to legacy components
LegacyDropdownMenuTrigger.displayName = 'DropdownMenuTrigger'
LegacyDropdownMenuContent.displayName = 'DropdownMenuContent'

// Renamed internal shadcn/ui components to avoid export conflicts
const ShadcnDropdownMenuContent = DropdownMenuContent
const ShadcnDropdownMenuTrigger = DropdownMenuTrigger

// ============================================================================
// Exports (Legacy API as primary for backward compatibility - matches Dialog pattern)
// ============================================================================

export {
  // Primary exports - Legacy API for backward compatibility
  // These are what existing consumers expect (matching Dialog exports)
  DropdownMenu,
  LegacyDropdownMenuTrigger as DropdownMenuTrigger,
  LegacyDropdownMenuContent as DropdownMenuContent,
  // shadcn/ui pattern component exports (always available)
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  // shadcn/ui pattern exports (for new code or migration)
  DropdownMenuRoot,
  ShadcnDropdownMenuTrigger as DropdownMenuTriggerRadix,
  ShadcnDropdownMenuContent as DropdownMenuContentRadix,
}

DropdownMenu.displayName = 'DropdownMenu'
