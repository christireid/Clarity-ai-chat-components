'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '../lib/utils'
import { useBodyScrollLock } from '../hooks/use-body-scroll-lock'

// ============================================================================
// Types
// ============================================================================

export interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  modal?: boolean // Default: true
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
  closeOnClickOutside?: boolean // Default: true
  closeOnEscape?: boolean // Default: true
  showCloseButton?: boolean // Default: true
  animation?: 'scale' | 'slide-up' | 'slide-down' | 'fade' | 'zoom'
  blurBackdrop?: boolean // Default: true
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

// ============================================================================
// Dialog Root Component (using Radix)
// ============================================================================

export const Dialog: React.FC<DialogProps> = ({
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

// ============================================================================
// Dialog Trigger
// ============================================================================

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  children,
  onClick,
  asChild,
}) => {
  const handleClick = () => {
    onClick?.()
  }

  return (
    <DialogPrimitive.Trigger asChild={asChild} onClick={handleClick}>
      {children}
    </DialogPrimitive.Trigger>
  )
}

// ============================================================================
// Dialog Content (with Portal, Backdrop, and Animations)
// ============================================================================

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
}

export const DialogContent: React.FC<DialogContentProps & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>> = ({
  children,
  className,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEscape = true,
  showCloseButton = true,
  animation = 'scale', // Preserved for API compatibility, using Tailwind animations
  blurBackdrop = true,
  overlayClassName,
  ...props
}) => {
  // Animation prop preserved for API compatibility
  void animation
  
  const { lock } = useBodyScrollLock()

  // Body scroll lock - DialogContent only renders when dialog is open (Radix handles visibility)
  // So we lock on mount and unlock on unmount
  React.useEffect(() => {
    const unlockFn = lock()
    return unlockFn
  }, [lock])

  return (
    <DialogPrimitive.Portal>
      {/* Backdrop */}
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          blurBackdrop && 'backdrop-blur-lg',
          overlayClassName
        )}
      />

      {/* Content */}
      <DialogPrimitive.Content
        className={cn(
          'fixed left-[50%] top-[50%] z-[var(--z-modal)] translate-x-[-50%] translate-y-[-50%]',
          'w-full bg-card border border-border/40 shadow-xl rounded-2xl',
          'focus:outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          sizeClasses[size],
          className
        )}
        onPointerDownOutside={(e) => {
          if (!closeOnClickOutside) {
            e.preventDefault()
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!closeOnEscape) {
            e.preventDefault()
          }
        }}
        {...props}
      >
        {showCloseButton && (
          <DialogPrimitive.Close
            className={cn(
              'absolute top-4 right-4 w-8 h-8 rounded-lg',
              'flex items-center justify-center',
              'text-muted-foreground hover:text-foreground',
              'hover:bg-accent/50',
              'transition-colors duration-150 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2'
            )}
            aria-label="Close dialog"
          >
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
            <span className="sr-only">Close dialog</span>
          </DialogPrimitive.Close>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

// ============================================================================
// Dialog Sub-components
// ============================================================================

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('flex flex-col space-y-2.5 px-6 py-5 border-b border-border/40', className)}>
      {children}
    </div>
  )
}

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className,
}) => {
  return (
    <DialogPrimitive.Title
      className={cn(
        'text-xl font-bold leading-none tracking-tight text-foreground',
        className
      )}
    >
      {children}
    </DialogPrimitive.Title>
  )
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  className,
}) => {
  return (
    <DialogPrimitive.Description className={cn('text-sm text-muted-foreground/90 leading-relaxed', className)}>
      {children}
    </DialogPrimitive.Description>
  )
}

export interface DialogBodyProps {
  children: React.ReactNode
  className?: string
}

export const DialogBody: React.FC<DialogBodyProps> = ({
  children,
  className,
}) => {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

export const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border/40',
        className
      )}
    >
      {children}
    </div>
  )
}

export const DialogClose: React.FC<DialogCloseProps> = ({
  children,
  className,
  asChild,
}) => {
  // If asChild is true, we must have a valid React element as children
  if (asChild) {
    if (!React.isValidElement(children)) {
      console.warn('DialogClose: asChild requires a valid React element as children')
      return null
    }
    return (
      <DialogPrimitive.Close className={className} asChild={asChild}>
        {children}
      </DialogPrimitive.Close>
    )
  }
  
  // If children provided, render them; otherwise render default button
  return (
    <DialogPrimitive.Close className={className} asChild={false}>
      {children || (
        <button type="button" className={className}>
          Close
        </button>
      )}
    </DialogPrimitive.Close>
  )
}
