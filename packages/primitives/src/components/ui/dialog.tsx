import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '../../lib/cn'
import { getFocusableElements } from '../../lib/aria'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

export interface DialogContentProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  /**
   * Dialog size variant
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * Animation style
   */
  animation?: 'default' | 'slide' | 'scale' | 'none'
}

const dialogSizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[90vw]',
}

/**
 * Mobile-compatible focus trap hook
 * Radix UI's focus trap doesn't work reliably on mobile browsers
 */
function useMobileFocusTrap(
  contentRef: React.RefObject<HTMLElement | null>,
  isOpen: boolean
) {
  React.useEffect(() => {
    if (!isOpen || !contentRef.current) return

    // Detect mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (!isMobile) return // Use Radix focus trap for desktop

    const content = contentRef.current
    const focusableElements = getFocusableElements(content)
    let lastFocusedElement: HTMLElement | null = null

    // Store the currently focused element before opening
    if (document.activeElement instanceof HTMLElement) {
      lastFocusedElement = document.activeElement
    }

    // Focus first focusable element in dialog
    const firstFocusable = focusableElements[0]
    if (firstFocusable && firstFocusable !== document.activeElement) {
      firstFocusable.focus()
    }

    // Mobile focus trap implementation
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (!content.contains(target)) {
        // Focus escaped dialog, redirect to first focusable element
        const firstFocusable = focusableElements[0]
        if (firstFocusable) {
          e.preventDefault()
          firstFocusable.focus()
        }
      }
    }

    // Add event listeners
    document.addEventListener('focusin', handleFocus, true)

    return () => {
      // Cleanup
      document.removeEventListener('focusin', handleFocus, true)

      // Restore focus to previously focused element
      if (lastFocusedElement && !content.contains(document.activeElement)) {
        lastFocusedElement.focus()
      }
    }
    // contentRef is a stable ref object, no need to include in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    { className, children, size = 'lg', animation = 'default', ...props },
    ref
  ) => {
    const contentRef = React.useRef<HTMLElement>(null)
    const [isOpen, setIsOpen] = React.useState(false)

    // Combine refs
    const combinedRef = React.useCallback(
      (element: React.ElementRef<typeof DialogPrimitive.Content>) => {
        contentRef.current = element
        if (ref) {
          if (typeof ref === 'function') {
            ref(element)
          } else {
            ref.current = element
          }
        }
      },
      [ref]
    )

    // Track dialog open state using mutation observer
    React.useEffect(() => {
      if (!contentRef.current) return

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-state'
          ) {
            const newState =
              contentRef.current?.getAttribute('data-state') === 'open'
            setIsOpen(newState)
          }
        })
      })

      observer.observe(contentRef.current, {
        attributes: true,
        attributeFilter: ['data-state'],
      })

      // Initial state check
      const initialState =
        contentRef.current.getAttribute('data-state') === 'open'
      setIsOpen(initialState)

      return () => observer.disconnect()
    }, [])

    // Mobile-compatible focus trap
    useMobileFocusTrap(contentRef, isOpen)

    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={combinedRef}
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
            dialogSizeClasses[size],
            animation !== 'none' &&
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            className
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

/**
 * DialogBody - Container for main dialog content
 *
 * A simple wrapper component for the main content area of a dialog.
 * Use this between DialogHeader and DialogFooter.
 */
const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('py-4', className)} {...props} />
)
DialogBody.displayName = 'DialogBody'

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
