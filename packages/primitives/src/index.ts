/**
 * @clarity-chat/primitives - UI Component Primitives
 *
 * This package provides foundational UI components built on shadcn/ui and Radix UI.
 * All components are accessible (WCAG 2.1 AA compliant) and fully customizable.
 *
 * @packageDocumentation
 *
 * ## Features:
 * - **Accessibility**: Full keyboard navigation and screen reader support
 * - **Customization**: Tailwind CSS and class-variance-authority (cva) variants
 * - **Composability**: Headless primitives with sensible defaults
 * - **Performance**: Optimized rendering with React 19 support
 *
 * ## Component Categories:
 * - **Buttons**: Button with loading states and variants
 * - **Dialogs**: Modal dialogs with animations
 * - **Menus**: Dropdown and context menus
 * - **Tooltips**: Simple and advanced tooltip options
 * - **Forms**: Input, Textarea, Checkbox, Label
 * - **Layout**: Card, ScrollArea, Avatar, Badge
 *
 * @example
 * ```tsx
 * import { Button, Dialog, Tooltip } from '@clarity-chat/primitives'
 *
 * <Button variant="primary" state="loading">
 *   Submit
 * </Button>
 *
 * <Tooltip content="Helpful tip">
 *   <span>Hover me</span>
 * </Tooltip>
 * ```
 */

// ============================================================================
// shadcn/ui Components (Default - Official, Battle-Tested with Radix UI)
// ============================================================================
// These are the default components. They provide:
// - Accessibility (WCAG 2.1 AA compliant)
// - Keyboard navigation
// - Focus management
// - Browser compatibility
// - Screen reader support
//
// MIGRATION STRATEGY:
// The default exports (Button, Dialog, etc.) now point to shadcn/ui components
// instead of the custom components that were previously here. This allows all
// existing imports to automatically use shadcn without code changes.
//
// Example: `import { Button } from '@clarity-chat/primitives'`
// - Before migration: pointed to ./components/button (custom)
// - After migration: points to ./components/ui/button-enhanced (shadcn)
//
// The custom components were deleted. For backward compatibility, shadcn
// components are also exported with a `Shadcn` prefix.
// ============================================================================

// Button (Enhanced with loading state)
export { Button, buttonVariants } from './components/ui/button-enhanced'
export type { ButtonProps, ButtonState } from './components/ui/button-enhanced'

// Also export pure shadcn Button for those who want it
export {
  Button as ShadcnButton,
  buttonVariants as shadcnButtonVariants,
} from './components/ui/button'
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
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/ui/dialog'
export type { DialogContentProps } from './components/ui/dialog'

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
} from './components/ui/popover'

// Also export with Shadcn prefix for backward compatibility
export {
  Popover as ShadcnPopover,
  PopoverTrigger as ShadcnPopoverTrigger,
  PopoverContent as ShadcnPopoverContent,
} from './components/ui/popover'

// Tooltip (Enhanced wrapper with content prop)
export { Tooltip, SimpleTooltip } from './components/tooltip'
export type { TooltipProps } from './components/tooltip'

// Raw shadcn Tooltip components (for composable usage)
export {
  Tooltip as TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './components/ui/tooltip'

// Also export raw shadcn/Radix Tooltip components for advanced use (aliased)
export {
  Tooltip as ShadcnTooltip,
  TooltipTrigger as ShadcnTooltipTrigger,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
  Tooltip as RadixTooltip,
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

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/card'
export type { CardProps } from './components/card'

export { ErrorMessage } from './components/error-message'
export type { ErrorMessageProps } from './components/error-message'

export { Input } from './components/input'
export type { InputProps } from './components/input'

export { Label } from './components/label'

export { ScrollArea } from './components/scroll-area'

export { Textarea } from './components/textarea'
export type { TextareaProps } from './components/textarea'

export {
  LoadingIcon,
  SuccessIcon,
  ErrorIcon,
} from './components/button-state-icons'

export { Kbd, useFormattedShortcut } from './components/kbd'
export type {
  KbdProps,
  KbdPlatform,
  KbdSize,
  KbdVariant,
} from './components/kbd'

// ============================================================================
// Hooks
// ============================================================================

export { useRippleEffect } from './hooks/use-ripple-effect'
export type { RippleType } from './hooks/use-ripple-effect'

export { useBodyScrollLock } from './hooks/use-body-scroll-lock'

export {
  useReducedMotion,
  getReducedMotionPreference,
} from './hooks/use-reduced-motion'

export {
  useControllableState,
  useControllableBoolean,
} from './hooks/use-controllable-state'
export type { UseControllableStateOptions } from './hooks/use-controllable-state'

export {
  composeRefs,
  useComposedRefs,
  useForwardedRef,
} from './hooks/use-composed-refs'

// ============================================================================
// Utils
// ============================================================================

export * from './lib/utils'

// ARIA Utilities
export {
  generateAriaId,
  resetAriaIdCounter,
  announce,
  clearAnnouncement,
  getFocusableElements,
  getFirstFocusableElement,
  getLastFocusableElement,
  focusFirstElement,
  saveFocus,
  Keys,
  isKey,
  isActivationKey,
  getErrorAriaAttributes,
  getLoadingAriaAttributes,
  getExpandedAriaAttributes,
} from './lib/aria'

// Animation Presets
export {
  durations,
  springPresets,
  easingPresets,
  noAnimation,
  fadeVariants,
  scaleVariants,
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  popVariants,
  collapseVariants,
  getReducedMotionVariants,
  getReducedMotionTransition,
  interactiveVariants,
  getReducedMotionInteractive,
  staggerContainerVariants,
  staggerItemVariants,
  animationPresets,
} from './lib/animation-presets'

// ============================================================================
// Context Providers
// ============================================================================

export {
  A11yProvider,
  A11yContext,
  useA11y,
  useReducedMotionContext,
} from './context/a11y-context'
export type {
  A11yContextValue,
  A11yProviderProps,
  AnnounceOptions,
} from './context/a11y-context'

// ============================================================================
// Compound Components
// ============================================================================

// Input Compound (composable sub-components)
export {
  InputCompound,
  InputRoot,
  InputLabel,
  InputField,
  InputError,
  InputHelper,
  InputCharacterCount,
  InputFooter,
} from './components/input-compound'
export type {
  InputRootProps,
  InputLabelProps,
  InputFieldProps,
  InputErrorProps,
  InputHelperProps,
  InputCharacterCountProps,
  InputFooterProps,
} from './components/input-compound'

// ============================================================================
// Enhanced Custom Components (with advanced accessibility)
// ============================================================================

// Enhanced Dialog with animations and focus trap
export {
  Dialog as EnhancedDialog,
  DialogTrigger as EnhancedDialogTrigger,
  DialogContent as EnhancedDialogContent,
  DialogHeader as EnhancedDialogHeader,
  DialogTitle as EnhancedDialogTitle,
  DialogDescription as EnhancedDialogDescription,
  DialogBody as EnhancedDialogBody,
  DialogFooter as EnhancedDialogFooter,
  DialogClose as EnhancedDialogClose,
} from './components/dialog'
export type {
  DialogProps as EnhancedDialogProps,
  DialogTriggerProps as EnhancedDialogTriggerProps,
  DialogContentProps as EnhancedDialogContentProps,
  DialogHeaderProps as EnhancedDialogHeaderProps,
  DialogTitleProps as EnhancedDialogTitleProps,
  DialogDescriptionProps as EnhancedDialogDescriptionProps,
  DialogFooterProps as EnhancedDialogFooterProps,
  DialogCloseProps as EnhancedDialogCloseProps,
} from './components/dialog'

// Enhanced Button with ripple and announcements
export {
  Button as EnhancedButton,
  buttonVariants as enhancedButtonVariants,
} from './components/button'
export type { ButtonProps as EnhancedButtonProps } from './components/button'

// Enhanced Checkbox with announcements
export { Checkbox as EnhancedCheckbox } from './components/checkbox'
export type { CheckboxProps as EnhancedCheckboxProps } from './components/checkbox'
