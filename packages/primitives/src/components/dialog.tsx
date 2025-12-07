'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '../lib/utils'

// ============================================================================
// Core Dialog Components (shadcn/ui pattern with Radix UI)
// ============================================================================

const DialogRoot = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClosePrimitive = DialogPrimitive.Close

// ============================================================================
// Close Icon Component (extracted to avoid duplication)
// ============================================================================

const CloseIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
)

const DialogCloseButton = () => (
  <DialogPrimitive.Close
    className={cn(
      'absolute top-4 right-4 w-8 h-8 rounded-lg',
      'flex items-center justify-center',
      'text-muted-foreground hover:text-foreground',
      'hover:bg-accent/50',
      'transition-colors duration-150 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2',
      'disabled:pointer-events-none'
    )}
    aria-label="Close dialog"
  >
    <CloseIcon />
  </DialogPrimitive.Close>
)

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/70 backdrop-blur-lg',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    showCloseButton?: boolean
  }
>(({ className, children, size = 'md', showCloseButton = true, ...props }, ref) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
          'w-full bg-card border border-border/40 shadow-xl rounded-2xl',
          'duration-200',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogCloseButton />
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex flex-col space-y-2.5 px-6 py-5 border-b border-border/40',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border/40',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-xl font-bold leading-none tracking-tight text-foreground',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground/90 leading-relaxed', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

const DialogBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('px-6 py-4', className)} {...props} />
DialogBody.displayName = 'DialogBody'

// ============================================================================
// Legacy Dialog API (Backward Compatibility)
// ============================================================================

export interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  modal?: boolean
  defaultOpen?: boolean
}

export interface DialogTriggerProps {
  asChild?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export interface DialogContentProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  animation?: 'scale' | 'slide-up' | 'slide-down' | 'fade' | 'zoom'
  blurBackdrop?: boolean
  overlayClassName?: string
}

export interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

export interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

export interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

export interface DialogFooterProps {
  children: React.ReactNode
  className?: string
}

export interface DialogCloseProps {
  children?: React.ReactNode
  className?: string
  asChild?: boolean
}

/**
 * Legacy Dialog wrapper component
 */
const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
  modal = true,
  defaultOpen = false,
}) => {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      modal={modal}
    >
      {children}
    </DialogPrimitive.Root>
  )
}

/**
 * Legacy DialogTrigger wrapper
 */
const LegacyDialogTrigger: React.FC<DialogTriggerProps> = ({
  children,
  onClick,
  asChild,
}) => {
  if (asChild && React.isValidElement(children)) {
    return (
      <DialogPrimitive.Trigger asChild onClick={onClick}>
        {children}
      </DialogPrimitive.Trigger>
    )
  }

  return (
    <DialogPrimitive.Trigger asChild onClick={onClick}>
      <button type="button">{children}</button>
    </DialogPrimitive.Trigger>
  )
}

/**
 * Legacy DialogContent wrapper with full prop support
 * 
 * Note: The `animation` prop is accepted for backward compatibility but currently
 * uses Tailwind CSS animations via data-state attributes. The animation type
 * is approximated using scale/zoom-in by default.
 */
const LegacyDialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEscape = true,
  showCloseButton = true,
  animation: _animation = 'scale', // Accepted for backward compat, uses default animation
  blurBackdrop = true,
  overlayClassName,
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  }

  return (
    <DialogPortal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-black/70',
          blurBackdrop && 'backdrop-blur-lg',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          overlayClassName
        )}
      />
      <DialogPrimitive.Content
        onPointerDownOutside={
          closeOnClickOutside ? undefined : (e) => e.preventDefault()
        }
        onEscapeKeyDown={
          closeOnEscape ? undefined : (e) => e.preventDefault()
        }
        className={cn(
          'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
          'w-full bg-card border border-border/40 shadow-xl rounded-2xl',
          'duration-200',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          sizeClasses[size],
          className
        )}
      >
        {children}
        {showCloseButton && <DialogCloseButton />}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

/**
 * Legacy DialogClose wrapper
 */
const LegacyDialogClose: React.FC<DialogCloseProps> = ({
  children,
  className,
  asChild,
}) => {
  if (asChild && React.isValidElement(children)) {
    return (
      <DialogPrimitive.Close asChild className={className}>
        {children}
      </DialogPrimitive.Close>
    )
  }

  return (
    <DialogPrimitive.Close className={className}>
      {children}
    </DialogPrimitive.Close>
  )
}

// Add displayNames to legacy components
LegacyDialogTrigger.displayName = 'DialogTrigger'
LegacyDialogContent.displayName = 'DialogContent'
LegacyDialogClose.displayName = 'DialogClose'

// Store references to shadcn/ui styled components before overwriting exports
const ShadcnDialogContent = DialogContent
const ShadcnDialogTrigger = DialogTrigger

// ============================================================================
// Exports (Legacy API as primary for backward compatibility)
// ============================================================================

export {
  // Primary exports - Legacy API for backward compatibility
  // These are what existing consumers expect (Dialog, DialogTrigger, DialogContent, etc.)
  Dialog,
  LegacyDialogTrigger as DialogTrigger,
  LegacyDialogContent as DialogContent,
  LegacyDialogClose as DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogBody,
  // shadcn/ui pattern exports (for new code or migration)
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  ShadcnDialogTrigger as DialogTriggerRadix,
  ShadcnDialogContent as DialogContentRadix,
  DialogClosePrimitive as DialogCloseRadix,
}

Dialog.displayName = 'Dialog'
