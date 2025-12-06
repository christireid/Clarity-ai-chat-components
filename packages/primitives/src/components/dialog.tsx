'use client'

import * as React from 'react'
import { cn } from '../lib/utils'
import { useBodyScrollLock } from '../hooks/use-body-scroll-lock'
import {
  Dialog as ShadcnDialog,
  DialogTrigger as ShadcnDialogTrigger,
  DialogContent as ShadcnDialogContent,
  DialogHeader as ShadcnDialogHeader,
  DialogFooter as ShadcnDialogFooter,
  DialogTitle as ShadcnDialogTitle,
  DialogDescription as ShadcnDialogDescription,
  DialogClose as ShadcnDialogClose,
  DialogOverlay,
} from './ui/dialog'

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
// Dialog Root Component
// ============================================================================

export const Dialog: React.FC<DialogProps> = ({
  open: controlledOpen,
  onOpenChange,
  children,
  defaultOpen = false,
  modal = true,
}) => {
  return (
    <ShadcnDialog open={controlledOpen} onOpenChange={onOpenChange} defaultOpen={defaultOpen} modal={modal}>
      {children}
    </ShadcnDialog>
  )
}

// ============================================================================
// Dialog Trigger
// ============================================================================

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, onClick, asChild = false }) => {
  const handleClick = () => {
    onClick?.()
  }

  return (
    <ShadcnDialogTrigger asChild={asChild} onClick={handleClick}>
      {children}
    </ShadcnDialogTrigger>
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

// Animation classes based on animation prop
const getAnimationClasses = (animation: DialogContentProps['animation']) => {
  switch (animation) {
    case 'scale':
      return 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
    case 'slide-up':
      return 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom'
    case 'slide-down':
      return 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top'
    case 'fade':
      return 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
    case 'zoom':
      return 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
    default:
      return 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
  }
}

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEscape = true,
  showCloseButton = true,
  animation = 'scale',
  blurBackdrop = true,
  overlayClassName,
}) => {
  // Note: shadcn/ui DialogContent already includes DialogOverlay internally (line 35 of ui/dialog.tsx)
  // We can't easily replace it without modifying shadcn/ui's component structure
  // For blurBackdrop, we'll render a custom overlay that will be layered
  // The shadcn/ui overlay will be behind our custom one
  const { lock } = useBodyScrollLock()

  // Body scroll lock - Radix UI handles this internally, but we keep for compatibility
  // DialogContent only renders when open, so this effect runs when open
  React.useEffect(() => {
    const unlockFn = lock()
    return unlockFn
  }, [lock])

  return (
    <>
      {/* Custom overlay with blur support - rendered separately since shadcn/ui includes one */}
      {/* This will create a second overlay, but allows us to customize blur */}
      {blurBackdrop && (
        <DialogOverlay
          className={cn(
            'backdrop-blur-lg z-[49]', // z-49 to be just below content (z-50)
            overlayClassName
          )}
        />
      )}
      <ShadcnDialogContent
        className={cn(
          'rounded-2xl border-border/40 shadow-xl',
          sizeClasses[size],
          getAnimationClasses(animation),
          className
        )}
        onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
        onPointerDownOutside={closeOnClickOutside ? undefined : (e) => e.preventDefault()}
      >
        {showCloseButton && (
          <ShadcnDialogClose className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2 z-10">
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
          </ShadcnDialogClose>
        )}
        {children}
      </ShadcnDialogContent>
    </>
  )
}

// ============================================================================
// Dialog Sub-components
// ============================================================================

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className }) => {
  return (
    <ShadcnDialogHeader className={cn('px-6 py-5 border-b border-border/40', className)}>
      {children}
    </ShadcnDialogHeader>
  )
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className }) => {
  return (
    <ShadcnDialogTitle
      className={cn(
        'text-xl font-bold leading-none tracking-tight text-foreground',
        className
      )}
    >
      {children}
    </ShadcnDialogTitle>
  )
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ children, className }) => {
  return (
    <ShadcnDialogDescription className={cn('text-sm text-muted-foreground/90 leading-relaxed', className)}>
      {children}
    </ShadcnDialogDescription>
  )
}

export const DialogBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ children, className }) => {
  return (
    <ShadcnDialogFooter
      className={cn(
        'flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border/40',
        className
      )}
    >
      {children}
    </ShadcnDialogFooter>
  )
}

export const DialogClose: React.FC<DialogCloseProps> = ({ children, className, asChild }) => {
  if (asChild && React.isValidElement(children)) {
    return (
      <ShadcnDialogClose asChild={asChild} className={className}>
        {children}
      </ShadcnDialogClose>
    )
  }

  return (
    <ShadcnDialogClose className={className}>
      {children}
    </ShadcnDialogClose>
  )
}
