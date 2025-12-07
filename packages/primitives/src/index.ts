// ============================================================================
// shadcn/ui Components (Default - Official, Battle-Tested with Radix UI)
// ============================================================================
// These are the default components. They provide:
// - Accessibility (WCAG 2.1 AA compliant)
// - Keyboard navigation
// - Focus management  
// - Browser compatibility
// - Screen reader support
// ============================================================================

// Button (Enhanced with loading state)
export { Button, buttonVariants } from './components/ui/button-enhanced'
export type { ButtonProps } from './components/ui/button-enhanced'

// Also export pure shadcn Button for those who want it
export { Button as ShadcnButton, buttonVariants as shadcnButtonVariants } from './components/ui/button'
export type { ButtonProps as ShadcnButtonProps } from './components/ui/button'

// Dialog
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/ui/dialog'

// Also export with Shadcn prefix for backward compatibility
export {
  Dialog as ShadcnDialog,
  DialogPortal as ShadcnDialogPortal,
  DialogOverlay as ShadcnDialogOverlay,
  DialogTrigger as ShadcnDialogTrigger,
  DialogClose as ShadcnDialogClose,
  DialogContent as ShadcnDialogContent,
  DialogHeader as ShadcnDialogHeader,
  DialogFooter as ShadcnDialogFooter,
  DialogTitle as ShadcnDialogTitle,
  DialogDescription as ShadcnDialogDescription,
} from './components/ui/dialog'

// DropdownMenu
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
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
} from './components/ui/dropdown-menu'

// Also export with Shadcn prefix for backward compatibility
export {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuTrigger as ShadcnDropdownMenuTrigger,
  DropdownMenuContent as ShadcnDropdownMenuContent,
  DropdownMenuItem as ShadcnDropdownMenuItem,
  DropdownMenuCheckboxItem as ShadcnDropdownMenuCheckboxItem,
  DropdownMenuRadioItem as ShadcnDropdownMenuRadioItem,
  DropdownMenuLabel as ShadcnDropdownMenuLabel,
  DropdownMenuSeparator as ShadcnDropdownMenuSeparator,
  DropdownMenuShortcut as ShadcnDropdownMenuShortcut,
  DropdownMenuGroup as ShadcnDropdownMenuGroup,
  DropdownMenuPortal as ShadcnDropdownMenuPortal,
  DropdownMenuSub as ShadcnDropdownMenuSub,
  DropdownMenuSubContent as ShadcnDropdownMenuSubContent,
  DropdownMenuSubTrigger as ShadcnDropdownMenuSubTrigger,
  DropdownMenuRadioGroup as ShadcnDropdownMenuRadioGroup,
} from './components/ui/dropdown-menu'

// Popover
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from './components/ui/popover'

// Also export with Shadcn prefix for backward compatibility
export {
  Popover as ShadcnPopover,
  PopoverTrigger as ShadcnPopoverTrigger,
  PopoverContent as ShadcnPopoverContent,
  PopoverAnchor as ShadcnPopoverAnchor,
} from './components/ui/popover'

// Tooltip
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './components/ui/tooltip'

// Also export with Shadcn prefix for backward compatibility
export {
  Tooltip as ShadcnTooltip,
  TooltipTrigger as ShadcnTooltipTrigger,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
} from './components/ui/tooltip'

// Checkbox
export { Checkbox } from './components/ui/checkbox'

// Also export with Shadcn prefix for backward compatibility
export { Checkbox as ShadcnCheckbox } from './components/ui/checkbox'

// Drawer
export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from './components/ui/drawer'

// Also export with Shadcn prefix for backward compatibility
export {
  Drawer as ShadcnDrawer,
  DrawerPortal as ShadcnDrawerPortal,
  DrawerOverlay as ShadcnDrawerOverlay,
  DrawerTrigger as ShadcnDrawerTrigger,
  DrawerClose as ShadcnDrawerClose,
  DrawerContent as ShadcnDrawerContent,
  DrawerHeader as ShadcnDrawerHeader,
  DrawerFooter as ShadcnDrawerFooter,
  DrawerTitle as ShadcnDrawerTitle,
  DrawerDescription as ShadcnDrawerDescription,
} from './components/ui/drawer'

// ============================================================================
// Other Components (Not replaced by shadcn)
// ============================================================================

export { Avatar } from './components/avatar'
export type { AvatarProps } from './components/avatar'

export { Badge } from './components/badge'
export type { BadgeProps } from './components/badge'

export { Card } from './components/card'
export type { CardProps } from './components/card'

export { ErrorMessage } from './components/error-message'
export type { ErrorMessageProps } from './components/error-message'

export { Input } from './components/input'
export type { InputProps } from './components/input'

export { ScrollArea } from './components/scroll-area'

export { Textarea } from './components/textarea'
export type { TextareaProps } from './components/textarea'

export {
  LoadingIcon,
  SuccessIcon,
  ErrorIcon,
} from './components/button-state-icons'

// ============================================================================
// Hooks
// ============================================================================

export { useRippleEffect } from './hooks/use-ripple-effect'
export { useBodyScrollLock } from './hooks/use-body-scroll-lock'

// ============================================================================
// Utils
// ============================================================================

export * from './lib/utils'
