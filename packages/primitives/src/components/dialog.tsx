import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
type DialogAnimation = 'scale' | 'slide-up' | 'slide-down' | 'fade' | 'zoom'

const sizeClasses: Record<DialogSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-2xl',
  full: 'sm:max-w-4xl w-[calc(100%-2rem)]',
}

const animationClasses: Record<DialogAnimation, string> = {
  scale:
    'data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0',
  'slide-up':
    'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-1/3 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-1/3',
  'slide-down':
    'data-[state=open]:animate-in data-[state=open]:slide-in-from-top-1/3 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-1/3',
  fade:
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
  zoom:
    'data-[state=open]:animate-in data-[state=open]:zoom-in-90 data-[state=closed]:animate-out data-[state=closed]:zoom-out-90',
}

export type DialogProps = DialogPrimitive.DialogProps
export type DialogTriggerProps = DialogPrimitive.DialogTriggerProps

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: DialogSize
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  animation?: DialogAnimation
  blurBackdrop?: boolean
  overlayClassName?: string
}

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>
export type DialogTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
export type DialogDescriptionProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>
export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>
export type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  blur?: boolean
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ blur = true, className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
      blur && 'backdrop-blur-md',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      size = 'md',
      closeOnClickOutside = true,
      closeOnEscape = true,
      showCloseButton = true,
      animation = 'scale',
      blurBackdrop = true,
      overlayClassName,
      onInteractOutside,
      onEscapeKeyDown,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    return (
      <DialogPortal>
        <DialogOverlay blur={blurBackdrop} className={overlayClassName} />
        <DialogPrimitive.Content
          role="dialog"
          aria-modal="true"
          aria-describedby={ariaDescribedBy ?? undefined}
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border border-border/40 bg-card p-6 shadow-2xl sm:rounded-2xl',
            animationClasses[animation],
            sizeClasses[size],
            className
          )}
          onInteractOutside={(event) => {
            if (!closeOnClickOutside) {
              event.preventDefault()
            }
            onInteractOutside?.(event)
          }}
          onEscapeKeyDown={(event) => {
            if (!closeOnEscape) {
              event.preventDefault()
            }
            onEscapeKeyDown?.(event)
          }}
          {...props}
        >
          {showCloseButton && (
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition hover:bg-accent/60 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/60 focus:ring-offset-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close dialog</span>
            </DialogPrimitive.Close>
          )}
          {children}
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = DialogPrimitive.Content.displayName

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div
    className={cn('flex flex-col space-y-2.5 border-b border-border/40 px-6 py-5', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-xl font-semibold leading-tight text-foreground', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground/90', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-6 py-4', className)} {...props} />
)
DialogBody.displayName = 'DialogBody'

export const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-2.5 border-t border-border/40 px-6 py-4 sm:flex-row sm:justify-end',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'
