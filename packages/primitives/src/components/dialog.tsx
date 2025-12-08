import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
// Context
// ============================================================================

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  titleId: string
  descriptionId: string
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

const useDialog = () => {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog')
  }
  return context
}

// ============================================================================
// Focus Trap Hook
// ============================================================================

function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  React.useEffect(() => {
    if (!enabled || !ref.current) return

    const element = ref.current
    const previouslyFocusedElement = document.activeElement as HTMLElement

    // Get all focusable elements
    const getFocusableElements = () => {
      return Array.from(
        element.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
        )
      )
    }

    // Focus first element
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Handle tab key
    const handleTab = (e: KeyboardEvent) => {
      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    element.addEventListener('keydown', handleTab)

    return () => {
      element.removeEventListener('keydown', handleTab)
      // Return focus to previously focused element
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus()
      }
    }
  }, [enabled, ref])
}

// ============================================================================
// Dialog Root Component
// ============================================================================

export const Dialog: React.FC<DialogProps> = ({
  open: controlledOpen,
  onOpenChange,
  children,
  defaultOpen = false,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const titleId = React.useId()
  const descriptionId = React.useId()

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange]
  )

  const contextValue = React.useMemo(
    () => ({ open, setOpen, titleId, descriptionId }),
    [open, setOpen, titleId, descriptionId]
  )

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
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
  const { setOpen } = useDialog()

  const handleClick = () => {
    setOpen(true)
    onClick?.()
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
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

// Memoized animation variants - refined with better values
const contentAnimations = {
  scale: {
    initial: { scale: 0.96, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.96, opacity: 0 },
  },
  'slide-up': {
    initial: { y: 24, opacity: 0, scale: 0.98 },
    animate: { y: 0, opacity: 1, scale: 1 },
    exit: { y: 24, opacity: 0, scale: 0.98 },
  },
  'slide-down': {
    initial: { y: -24, opacity: 0, scale: 0.98 },
    animate: { y: 0, opacity: 1, scale: 1 },
    exit: { y: -24, opacity: 0, scale: 0.98 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  zoom: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
} as const

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
  const { open, setOpen, titleId, descriptionId } = useDialog()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null)
  const { lock } = useBodyScrollLock()

  // Get or create portal container
  React.useEffect(() => {
    let container = document.getElementById('dialog-portal-root')
    if (!container) {
      container = document.createElement('div')
      container.id = 'dialog-portal-root'
      document.body.appendChild(container)
    }
    setPortalContainer(container)
    return () => {
      // Don't remove container on unmount as other dialogs might use it
    }
  }, [])

  // Focus trap
  useFocusTrap(contentRef, open)

  // Escape key handling - memoized callback
  const handleEscape = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && closeOnEscape) {
        setOpen(false)
      }
    },
    [open, closeOnEscape, setOpen]
  )

  React.useEffect(() => {
    if (!open || !closeOnEscape) return
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, closeOnEscape, handleEscape])

  // Body scroll lock using custom hook
  React.useEffect(() => {
    if (open) {
      const unlockFn = lock()
      return unlockFn
    }
  }, [open, lock])

  // Memoize animation props
  const animationProps = React.useMemo(
    () => contentAnimations[animation],
    [animation]
  )

  if (!open || !portalContainer) return null

  const dialogContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - refined */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
              'fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/70',
              blurBackdrop && 'backdrop-blur-lg',
              overlayClassName
            )}
            onClick={closeOnClickOutside ? () => setOpen(false) : undefined}
            aria-hidden="true"
          />

          {/* Content */}
          <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              ref={contentRef}
              {...animationProps}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className={cn(
                'relative w-full bg-card border border-border/40 shadow-xl rounded-2xl pointer-events-auto',
                sizeClasses[size],
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
            >
              {/* Close button */}
              {showCloseButton && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
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
                </motion.button>
              )}

              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  // Render via Portal for proper z-index stacking
  return createPortal(dialogContent, portalContainer)
}

// ============================================================================
// Dialog Sub-components
// ============================================================================

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col space-y-2.5 px-6 py-5 border-b border-border/40',
        className
      )}
    >
      {children}
    </div>
  )
}

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className,
}) => {
  const { titleId } = useDialog()

  return (
    <h2
      id={titleId}
      className={cn(
        'text-xl font-bold leading-none tracking-tight text-foreground',
        className
      )}
    >
      {children}
    </h2>
  )
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  className,
}) => {
  const { descriptionId } = useDialog()

  return (
    <p
      id={descriptionId}
      className={cn(
        'text-sm text-muted-foreground/90 leading-relaxed',
        className
      )}
    >
      {children}
    </p>
  )
}

export const DialogBody: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
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
  const { setOpen } = useDialog()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => setOpen(false),
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button onClick={() => setOpen(false)} className={className} type="button">
      {children}
    </button>
  )
}
