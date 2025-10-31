import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'

// ============================================================================
// Types
// ============================================================================

export interface DrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  defaultOpen?: boolean
}

export interface DrawerTriggerProps {
  asChild?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export interface DrawerContentProps {
  children: React.ReactNode
  className?: string
  side?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  blurBackdrop?: boolean
  overlayClassName?: string
}

// ============================================================================
// Context
// ============================================================================

interface DrawerContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null)

const useDrawer = () => {
  const context = React.useContext(DrawerContext)
  if (!context) {
    throw new Error('Drawer components must be used within a Drawer')
  }
  return context
}

// ============================================================================
// Focus Trap Hook
// ============================================================================

function useFocusTrap(ref: React.RefObject<HTMLElement>, enabled: boolean) {
  React.useEffect(() => {
    if (!enabled || !ref.current) return

    const element = ref.current
    const previouslyFocusedElement = document.activeElement as HTMLElement

    const getFocusableElements = () => {
      return Array.from(
        element.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
        )
      )
    }

    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    const handleTab = (e: KeyboardEvent) => {
      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
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
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus()
      }
    }
  }, [enabled, ref])
}

// ============================================================================
// Drawer Root Component
// ============================================================================

export const Drawer: React.FC<DrawerProps> = ({
  open: controlledOpen,
  onOpenChange,
  children,
  defaultOpen = false,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange]
  )

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  )
}

// ============================================================================
// Drawer Trigger
// ============================================================================

export const DrawerTrigger: React.FC<DrawerTriggerProps> = ({
  children,
  onClick,
  asChild,
}) => {
  const { setOpen } = useDrawer()

  const handleClick = () => {
    setOpen(true)
    onClick?.()
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    } as any)
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  )
}

// ============================================================================
// Drawer Content
// ============================================================================

const sizeClasses = {
  left: {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    xl: 'w-[480px]',
    full: 'w-full',
  },
  right: {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    xl: 'w-[480px]',
    full: 'w-full',
  },
  top: {
    sm: 'h-64',
    md: 'h-80',
    lg: 'h-96',
    xl: 'h-[480px]',
    full: 'h-full',
  },
  bottom: {
    sm: 'h-64',
    md: 'h-80',
    lg: 'h-96',
    xl: 'h-[480px]',
    full: 'h-full',
  },
}

const positionClasses = {
  left: 'inset-y-0 left-0',
  right: 'inset-y-0 right-0',
  top: 'inset-x-0 top-0',
  bottom: 'inset-x-0 bottom-0',
}

const slideAnimations = {
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
  top: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },
}

export const DrawerContent: React.FC<DrawerContentProps> = ({
  children,
  className,
  side = 'right',
  size = 'md',
  closeOnClickOutside = true,
  closeOnEscape = true,
  showCloseButton = true,
  blurBackdrop = true,
  overlayClassName,
}) => {
  const { open, setOpen } = useDrawer()
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Focus trap
  useFocusTrap(contentRef, open)

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

  // Body scroll lock
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [open])

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed inset-0 z-50 bg-black/50',
              blurBackdrop && 'backdrop-blur-sm',
              overlayClassName
            )}
            onClick={closeOnClickOutside ? () => setOpen(false) : undefined}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <motion.div
            ref={contentRef}
            {...slideAnimations[side]}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              'fixed z-50 bg-background border shadow-xl',
              positionClasses[side],
              sizeClasses[side][size],
              side === 'left' && 'border-r',
              side === 'right' && 'border-l',
              side === 'top' && 'border-b',
              side === 'bottom' && 'border-t',
              className
            )}
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            {showCloseButton && (
              <button
                onClick={() => setOpen(false)}
                className={cn(
                  'absolute top-4 right-4 w-8 h-8 rounded-md',
                  'flex items-center justify-center',
                  'text-muted-foreground hover:text-foreground',
                  'hover:bg-muted/50',
                  'transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  'z-10'
                )}
                aria-label="Close drawer"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// Drawer Sub-components
// ============================================================================

export const DrawerHeader: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 px-6 py-5 border-b', className)}>
      {children}
    </div>
  )
}

export const DrawerTitle: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <h2
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className
      )}
    >
      {children}
    </h2>
  )
}

export const DrawerDescription: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  )
}

export const DrawerBody: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return <div className={cn('px-6 py-4 overflow-y-auto flex-1', className)}>{children}</div>
}

export const DrawerFooter: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 px-6 py-4 border-t',
        className
      )}
    >
      {children}
    </div>
  )
}

export const DrawerClose: React.FC<{
  children?: React.ReactNode
  className?: string
  asChild?: boolean
}> = ({ children, className, asChild }) => {
  const { setOpen } = useDrawer()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => setOpen(false),
    } as any)
  }

  return (
    <button onClick={() => setOpen(false)} className={className} type="button">
      {children}
    </button>
  )
}
