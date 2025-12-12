'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from 'framer-motion'
import { cn } from '../lib/utils'
import { saveFocus, getFocusableElements, announce } from '../lib/aria'
import { CloseIcon } from './icons'
import {
  springPresets,
  easingPresets,
  fadeVariants,
  scaleVariants,
  slideUpVariants,
  slideDownVariants,
  getReducedMotionVariants,
  getReducedMotionTransition,
  noAnimation,
} from '../lib/animation-presets'
import { useBodyScrollLock } from '../hooks/use-body-scroll-lock'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { useControllableState } from '../hooks/use-controllable-state'

// ============================================================================
// Types
// ============================================================================

export interface DialogProps {
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Dialog content (Trigger, Content, etc.) */
  children: React.ReactNode
  /** Whether to act as a modal (default: true) */
  modal?: boolean
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean
}

export interface DialogTriggerProps {
  /** Use child as trigger element (Slot pattern) */
  asChild?: boolean
  /** Trigger content */
  children: React.ReactNode
  /** Additional click handler */
  onClick?: () => void
}

export interface DialogContentProps {
  /** Dialog content */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** Dialog size preset */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Close when clicking outside (default: true) */
  closeOnClickOutside?: boolean
  /** Close when pressing Escape (default: true) */
  closeOnEscape?: boolean
  /** Show close button (default: true) */
  showCloseButton?: boolean
  /** Animation type */
  animation?: 'scale' | 'slide-up' | 'slide-down' | 'fade' | 'zoom' | 'none'
  /** Blur backdrop (default: true) */
  blurBackdrop?: boolean
  /** Additional classes for overlay */
  overlayClassName?: string
  /** Callback when dialog opens */
  onOpenAutoFocus?: (event: Event) => void
  /** Callback when dialog closes */
  onCloseAutoFocus?: (event: Event) => void
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
  contentId: string
  modal: boolean
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

/**
 * Hook to access Dialog context
 * @throws Error if used outside of Dialog
 */
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
    const restoreFocus = saveFocus()

    // Get all focusable elements
    const focusableElements = getFocusableElements(element)
    const firstFocusable = focusableElements[0]

    // Focus first element
    if (firstFocusable) {
      firstFocusable.focus()
    }

    // Handle tab key for focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const elements = getFocusableElements(element)
      if (elements.length === 0) return

      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]

      if (e.shiftKey) {
        // Shift + Tab: wrap from first to last
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab: wrap from last to first
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    element.addEventListener('keydown', handleTab)

    return () => {
      element.removeEventListener('keydown', handleTab)
      restoreFocus()
    }
  }, [enabled, ref])
}

// ============================================================================
// Dialog Root Component
// ============================================================================

/**
 * Dialog root component - provides context for all dialog parts
 *
 * @example
 * ```tsx
 * <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Title</DialogTitle>
 *       <DialogDescription>Description</DialogDescription>
 *     </DialogHeader>
 *     <DialogBody>Content</DialogBody>
 *     <DialogFooter>
 *       <DialogClose asChild>
 *         <Button>Close</Button>
 *       </DialogClose>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const Dialog: React.FC<DialogProps> = ({
  open: controlledOpen,
  onOpenChange,
  children,
  modal = true,
  defaultOpen = false,
}) => {
  // Use controllable state for controlled/uncontrolled support
  const [open, setOpen] = useControllableState({
    prop: controlledOpen,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })

  // Generate unique IDs for ARIA relationships
  const titleId = React.useId()
  const descriptionId = React.useId()
  const contentId = React.useId()

  const contextValue = React.useMemo(
    () => ({ open, setOpen, titleId, descriptionId, contentId, modal }),
    [open, setOpen, titleId, descriptionId, contentId, modal]
  )

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  )
}

Dialog.displayName = 'Dialog'

// ============================================================================
// Dialog Trigger
// ============================================================================

/**
 * Button that opens the dialog
 */
export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  children,
  onClick,
  asChild,
}) => {
  const { setOpen, contentId } = useDialog()

  const handleClick = () => {
    setOpen(true)
    onClick?.()
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      'aria-haspopup': 'dialog',
      'aria-controls': contentId,
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      aria-haspopup="dialog"
      aria-controls={contentId}
    >
      {children}
    </button>
  )
}

DialogTrigger.displayName = 'DialogTrigger'

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

// Animation variants mapping
const animationVariantsMap: Record<string, Variants> = {
  scale: scaleVariants,
  'slide-up': slideUpVariants,
  'slide-down': slideDownVariants,
  fade: fadeVariants,
  zoom: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
}

/**
 * Dialog content - the modal window itself
 */
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
  const { open, setOpen, titleId, descriptionId, contentId, modal } =
    useDialog()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null)
  const { lock } = useBodyScrollLock()

  // Check for reduced motion preference
  const prefersReducedMotion = useReducedMotion()

  // Get or create portal container
  React.useEffect(() => {
    let container = document.getElementById('dialog-portal-root')
    if (!container) {
      container = document.createElement('div')
      container.id = 'dialog-portal-root'
      document.body.appendChild(container)
    }
    setPortalContainer(container)
  }, [])

  // Focus trap (only for modal dialogs)
  useFocusTrap(contentRef, open && modal)

  // Escape key handling
  React.useEffect(() => {
    if (!open || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, closeOnEscape, setOpen])

  // Body scroll lock (only for modal dialogs)
  React.useEffect(() => {
    if (open && modal) {
      const unlockFn = lock()
      return unlockFn
    }
    return undefined
  }, [open, modal, lock])

  // Announce dialog open/close to screen readers
  React.useEffect(() => {
    if (open) {
      announce('Dialog opened', { assertive: false })
    }
  }, [open])

  // Get animation variants based on motion preference
  const contentVariants = React.useMemo(() => {
    const baseVariants = animationVariantsMap[animation] || scaleVariants
    return getReducedMotionVariants(baseVariants, prefersReducedMotion)
  }, [animation, prefersReducedMotion])

  // Get transition based on motion preference
  const contentTransition: Transition = React.useMemo(() => {
    if (animation === 'none') return noAnimation
    return getReducedMotionTransition(
      springPresets.smooth,
      prefersReducedMotion
    )
  }, [animation, prefersReducedMotion])

  const overlayTransition: Transition = React.useMemo(() => {
    return getReducedMotionTransition(easingPresets.enter, prefersReducedMotion)
  }, [prefersReducedMotion])

  if (!portalContainer) return null

  const dialogContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            className={cn(
              'fixed inset-0 z-[var(--z-modal-backdrop,50)] bg-black/70',
              blurBackdrop && !prefersReducedMotion && 'backdrop-blur-lg',
              overlayClassName
            )}
            onClick={closeOnClickOutside ? () => setOpen(false) : undefined}
            aria-hidden="true"
            data-dialog-overlay
          />

          {/* Content container */}
          <div
            className="fixed inset-0 z-[var(--z-modal,51)] flex items-center justify-center p-4 pointer-events-none"
            data-dialog-positioner
          >
            <motion.div
              ref={contentRef}
              id={contentId}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={contentTransition}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className={cn(
                'relative w-full bg-card border border-border/40 shadow-xl rounded-2xl pointer-events-auto',
                sizeClasses[size],
                className
              )}
              role="dialog"
              aria-modal={modal}
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              data-dialog-content
              data-state={open ? 'open' : 'closed'}
              data-reduced-motion={prefersReducedMotion || undefined}
            >
              {/* Close button */}
              {showCloseButton && (
                <motion.button
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
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
                  type="button"
                >
                  <CloseIcon className="h-[15px] w-[15px]" />
                </motion.button>
              )}

              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(dialogContent, portalContainer)
}

DialogContent.displayName = 'DialogContent'

// ============================================================================
// Dialog Sub-components
// ============================================================================

/**
 * Container for dialog header content (title + description)
 */
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
      data-dialog-header
    >
      {children}
    </div>
  )
}

DialogHeader.displayName = 'DialogHeader'

/**
 * Dialog title - automatically linked via aria-labelledby
 */
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
      data-dialog-title
    >
      {children}
    </h2>
  )
}

DialogTitle.displayName = 'DialogTitle'

/**
 * Dialog description - automatically linked via aria-describedby
 */
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
      data-dialog-description
    >
      {children}
    </p>
  )
}

DialogDescription.displayName = 'DialogDescription'

/**
 * Container for main dialog content
 */
export const DialogBody: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4', className)} data-dialog-body>
      {children}
    </div>
  )
}

DialogBody.displayName = 'DialogBody'

/**
 * Container for dialog footer (usually buttons)
 */
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
      data-dialog-footer
    >
      {children}
    </div>
  )
}

DialogFooter.displayName = 'DialogFooter'

/**
 * Button that closes the dialog
 */
export const DialogClose: React.FC<DialogCloseProps> = ({
  children,
  className,
  asChild,
}) => {
  const { setOpen } = useDialog()

  const handleClose = () => {
    setOpen(false)
    announce('Dialog closed', { assertive: false })
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClose,
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button
      onClick={handleClose}
      className={className}
      type="button"
      data-dialog-close
    >
      {children}
    </button>
  )
}

DialogClose.displayName = 'DialogClose'
