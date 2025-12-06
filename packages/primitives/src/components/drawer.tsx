import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

type DrawerSide = 'left' | 'right' | 'top' | 'bottom'
type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const drawerVariants = cva(
  'fixed z-50 bg-card shadow-2xl transition data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-300 data-[state=closed]:duration-200',
  {
    variants: {
      side: {
        left: 'inset-y-0 left-0 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
        right:
          'inset-y-0 right-0 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
        top: 'inset-x-0 top-0 data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top',
        bottom:
          'inset-x-0 bottom-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
)

const drawerSizes: Record<DrawerSide, Record<DrawerSize, string>> = {
  left: {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    xl: 'w-[28rem]',
    full: 'w-screen',
  },
  right: {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    xl: 'w-[28rem]',
    full: 'w-screen',
  },
  top: {
    sm: 'h-56',
    md: 'h-72',
    lg: 'h-96',
    xl: 'h-[32rem]',
    full: 'h-screen',
  },
  bottom: {
    sm: 'h-56',
    md: 'h-72',
    lg: 'h-96',
    xl: 'h-[32rem]',
    full: 'h-screen',
  },
}

export type DrawerProps = SheetPrimitive.DialogProps
export type DrawerTriggerProps = SheetPrimitive.DialogTriggerProps

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof drawerVariants> {
  size?: DrawerSize
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  blurBackdrop?: boolean
  overlayClassName?: string
}

export type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement>
export type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement>
export type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement>
export type DrawerTitleProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
export type DrawerDescriptionProps = React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.Description
>
export type DrawerCloseProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Close>

export const Drawer = SheetPrimitive.Root
export const DrawerTrigger = SheetPrimitive.Trigger
export const DrawerClose = SheetPrimitive.Close
export const DrawerPortal = SheetPrimitive.Portal

interface DrawerOverlayProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> {
  blur?: boolean
}

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  DrawerOverlayProps
>(({ blur = true, className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
      blur && 'backdrop-blur-sm',
      className
    )}
    {...props}
  />
))
DrawerOverlay.displayName = SheetPrimitive.Overlay.displayName

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      side = 'right',
      size = 'md',
      closeOnClickOutside = true,
      closeOnEscape = true,
      showCloseButton = true,
      blurBackdrop = true,
      overlayClassName,
      className,
      onInteractOutside,
      onEscapeKeyDown,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <DrawerPortal>
        <DrawerOverlay blur={blurBackdrop} className={overlayClassName} />
        <SheetPrimitive.Content
          role="dialog"
          aria-modal="true"
          ref={ref}
          data-side={side}
          className={cn(
            drawerVariants({ side }),
            drawerSizes[side][size],
            side === 'left' && 'rounded-r-2xl border-r border-border/40',
            side === 'right' && 'rounded-l-2xl border-l border-border/40',
            side === 'top' && 'rounded-b-2xl border-b border-border/40',
            side === 'bottom' && 'rounded-t-2xl border-t border-border/40',
            'focus:outline-none',
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
            <SheetPrimitive.Close className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition hover:bg-accent/60 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/60 focus:ring-offset-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close drawer</span>
            </SheetPrimitive.Close>
          )}
          {children}
        </SheetPrimitive.Content>
      </DrawerPortal>
    )
  }
)
DrawerContent.displayName = SheetPrimitive.Content.displayName

export const DrawerHeader = ({ className, ...props }: DrawerHeaderProps) => (
  <div
    className={cn('flex flex-col space-y-2 border-b border-border/40 px-6 py-5', className)}
    {...props}
  />
)
DrawerHeader.displayName = 'DrawerHeader'

export const DrawerFooter = ({ className, ...props }: DrawerFooterProps) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-2.5 border-t border-border/40 px-6 py-4 sm:flex-row sm:justify-end',
      className
    )}
    {...props}
  />
)
DrawerFooter.displayName = 'DrawerFooter'

export const DrawerBody = ({ className, ...props }: DrawerBodyProps) => (
  <div className={cn('flex-1 overflow-y-auto px-6 py-4', className)} {...props} />
)
DrawerBody.displayName = 'DrawerBody'

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  DrawerTitleProps
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-tight text-foreground', className)}
    {...props}
  />
))
DrawerTitle.displayName = SheetPrimitive.Title.displayName

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground/90', className)}
    {...props}
  />
))
DrawerDescription.displayName = SheetPrimitive.Description.displayName
