// ============================================================================
// shadcn/ui Components (Official, Battle-Tested with Radix UI)
// ============================================================================
// These are the recommended components to use. They provide better:
// - Accessibility (WCAG 2.1 AA compliant)
// - Keyboard navigation
// - Focus management  
// - Browser compatibility
// - Screen reader support
// ============================================================================

export { Button as ShadcnButton, buttonVariants as shadcnButtonVariants } from './components/ui/button'
export type { ButtonProps as ShadcnButtonProps } from './components/ui/button'

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

export {
  Popover as ShadcnPopover,
  PopoverTrigger as ShadcnPopoverTrigger,
  PopoverContent as ShadcnPopoverContent,
  PopoverAnchor as ShadcnPopoverAnchor,
} from './components/ui/popover'

export {
  Tooltip as ShadcnTooltip,
  TooltipTrigger as ShadcnTooltipTrigger,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
} from './components/ui/tooltip'

export { Checkbox as ShadcnCheckbox } from './components/ui/checkbox'

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
// Legacy Custom Components (Backward Compatibility)
// ============================================================================
// These are kept for backward compatibility during migration.
// New code should prefer the Shadcn* prefixed components above.
// ============================================================================

export { Button, buttonVariants } from './components/button'
export type { ButtonProps, ButtonState } from './components/button'

export { Avatar } from './components/avatar'
export type { AvatarProps } from './components/avatar'

export { Badge } from './components/badge'
export type { BadgeProps } from './components/badge'

export { Card } from './components/card'
export type { CardProps } from './components/card'

export { Checkbox } from './components/checkbox'
export type { CheckboxProps } from './components/checkbox'

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from './components/dialog'
export type {
  DialogProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogCloseProps,
} from './components/dialog'

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from './components/drawer'
export type {
  DrawerProps,
  DrawerTriggerProps,
  DrawerContentProps,
} from './components/drawer'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from './components/dropdown-menu'
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
} from './components/dropdown-menu'

export { ErrorMessage } from './components/error-message'
export type { ErrorMessageProps } from './components/error-message'

export { Input } from './components/input'
export type { InputProps } from './components/input'

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverAnchor,
} from './components/popover'
export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
} from './components/popover'

export { ScrollArea } from './components/scroll-area'

export { Textarea } from './components/textarea'
export type { TextareaProps } from './components/textarea'

export { Tooltip, SimpleTooltip } from './components/tooltip'
export type { TooltipProps } from './components/tooltip'

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
