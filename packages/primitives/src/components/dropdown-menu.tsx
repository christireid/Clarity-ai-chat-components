/**
 * @deprecated Use ShadcnDropdownMenu from shadcn/ui instead.
 * This custom dropdown will be removed in v2.0.0.
 * 
 * Migration: See /workspace/MIGRATION_GUIDE_SHADCN.md
 */
import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../lib/utils'

type CloseOptions = {
  focusTrigger?: boolean
}

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  close: (options?: CloseOptions) => void
  triggerRef: React.MutableRefObject<HTMLElement | null>
  focusFirstRef: React.MutableRefObject<boolean>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)

const useDropdownMenu = () => {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('DropdownMenu components must be used within a DropdownMenu')
  }
  return context
}

export interface DropdownMenuProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const focusFirstRef = React.useRef(false)

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

  const close = React.useCallback(
    (options: CloseOptions = {}) => {
      const shouldFocusTrigger = options.focusTrigger ?? true
      setOpen(false)

      if (shouldFocusTrigger && typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
          triggerRef.current?.focus()
        })
      }
    },
    [setOpen]
  )

  const contextValue = React.useMemo<DropdownMenuContextValue>(
    () => ({ open, setOpen, close, triggerRef, focusFirstRef }),
    [open, setOpen, close]
  )

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

export interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  disabled?: boolean
}

const composeEventHandlers = <E extends React.SyntheticEvent>(
  original?: (event: E) => void,
  ours?: (event: E) => void
) => {
  return (event: E) => {
    original?.(event)
    if (!event.defaultPrevented) {
      ours?.(event)
    }
  }
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  asChild = false,
  disabled = false,
}) => {
  const { open, setOpen, triggerRef, focusFirstRef } = useDropdownMenu()

  const handleOpen = (nextOpen: boolean) => {
    if (disabled) return
    setOpen(nextOpen)
  }

  const toggle = () => handleOpen(!open)

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return

    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      focusFirstRef.current = true
      handleOpen(true)
    }
  }

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>
    return React.cloneElement(child, {
      ref: (node: HTMLElement | null) => {
        triggerRef.current = node
        const { ref } = child.props
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref && typeof ref === 'object' && 'current' in ref) {
          // Only assign if it's a mutable ref
          (ref as React.MutableRefObject<HTMLElement | null>).current = node
        }
      },
      onClick: composeEventHandlers(child.props.onClick, () => toggle()),
      onKeyDown: composeEventHandlers(child.props.onKeyDown, handleKeyDown),
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      'data-state': open ? 'open' : 'closed',
      disabled,
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button
      type="button"
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      aria-haspopup="menu"
      aria-expanded={open}
      data-state={open ? 'open' : 'closed'}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium tracking-[0.13px] shadow-xs transition-all duration-200',
        'hover:border-primary/40 hover:text-primary hover:shadow-sm focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60'
      )}
    >
      {children}
    </button>
  )
}

export interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  alignOffset?: number
  loopNavigation?: boolean
  autoFocus?: boolean
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className,
  align = 'start',
  side = 'bottom',
  sideOffset = 8,
  alignOffset = 0,
  loopNavigation = true,
  autoFocus = true,
}) => {
  const { open, close, triggerRef, focusFirstRef } = useDropdownMenu()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [actualSide, setActualSide] = React.useState(side)

  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const contentRect = contentRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    let finalSide = side
    let x = 0
    let y = 0

    const calculateForSide = (s: typeof side) => {
      let newX = 0
      let newY = 0

      switch (s) {
        case 'top':
          newX = triggerRect.left + triggerRect.width / 2
          newY = triggerRect.top - sideOffset
          break
        case 'bottom':
          newX = triggerRect.left + triggerRect.width / 2
          newY = triggerRect.bottom + sideOffset
          break
        case 'left':
          newX = triggerRect.left - sideOffset
          newY = triggerRect.top + triggerRect.height / 2
          break
        case 'right':
          newX = triggerRect.right + sideOffset
          newY = triggerRect.top + triggerRect.height / 2
          break
      }

      if (s === 'top' || s === 'bottom') {
        if (align === 'start') newX = triggerRect.left + alignOffset
        else if (align === 'end') newX = triggerRect.right + alignOffset
      } else {
        if (align === 'start') newY = triggerRect.top + alignOffset
        else if (align === 'end') newY = triggerRect.bottom + alignOffset
      }

      return { x: newX, y: newY }
    }

    const willCollide = (testSide: typeof side) => {
      const testPos = calculateForSide(testSide)
      if (!testPos) return false

      let testX = testPos.x
      let testY = testPos.y

      if (testSide === 'top' || testSide === 'bottom') {
        testX -= contentRect.width / 2
      }
      if (testSide === 'top') {
        testY -= contentRect.height
      }
      if (testSide === 'left' || testSide === 'right') {
        testY -= contentRect.height / 2
      }
      if (testSide === 'left') {
        testX -= contentRect.width
      }

      const padding = 8

      return (
        testX < padding ||
        testX + contentRect.width > viewport.width - padding ||
        testY < padding ||
        testY + contentRect.height > viewport.height - padding
      )
    }

    const basePos = calculateForSide(side)
    x = basePos?.x ?? 0
    y = basePos?.y ?? 0

    if (willCollide(side)) {
      const opposite = {
        top: 'bottom' as const,
        bottom: 'top' as const,
        left: 'right' as const,
        right: 'left' as const,
      }[side]

      if (!willCollide(opposite)) {
        finalSide = opposite
        const newPos = calculateForSide(opposite)
        x = newPos?.x ?? x
        y = newPos?.y ?? y
      }
    }

    setActualSide(finalSide)
    setPosition({ x, y })
  }, [align, alignOffset, side, sideOffset, triggerRef])

  React.useEffect(() => {
    if (open) {
      calculatePosition()
    }
  }, [open, calculatePosition])

  React.useEffect(() => {
    if (!open) return

    const updatePosition = () => calculatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, calculatePosition])

  React.useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        triggerRef.current &&
        !contentRef.current.contains(event.target as Element | null) &&
        !triggerRef.current.contains(event.target as Element | null)
      ) {
        close({ focusTrigger: false })
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, close, triggerRef])

  React.useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, close])

  const getItems = React.useCallback(() => {
    return Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>('[data-dropdown-item="true"]:not([data-disabled])') ?? []
    )
  }, [])

  const focusItemByIndex = React.useCallback(
    (index: number) => {
      const items = getItems()
      if (items.length === 0) return

      const clampedIndex = ((index % items.length) + items.length) % items.length
      items[clampedIndex]?.focus()
    },
    [getItems]
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = getItems()
    if (!items.length) return

    const activeElement = document.activeElement as HTMLElement
    const currentIndex = items.findIndex((item) => item === activeElement)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = currentIndex === -1 ? 0 : currentIndex + 1
      if (nextIndex >= items.length && !loopNavigation) return
      focusItemByIndex(nextIndex)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prevIndex = currentIndex === -1 ? items.length - 1 : currentIndex - 1
      if (prevIndex < 0 && !loopNavigation) return
      focusItemByIndex(prevIndex)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusItemByIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusItemByIndex(items.length - 1)
    }
  }

  React.useEffect(() => {
    if (!open || !autoFocus) return

    const frame = window.requestAnimationFrame(() => {
      if (focusFirstRef.current) {
        focusItemByIndex(0)
        focusFirstRef.current = false
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [open, autoFocus, focusFirstRef, focusItemByIndex])

  const animationVariants = React.useMemo(() => {
    const offset = 6
    switch (actualSide) {
      case 'top':
        return {
          initial: { opacity: 0, y: offset, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: offset, scale: 0.96 },
        }
      case 'bottom':
        return {
          initial: { opacity: 0, y: -offset, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -offset, scale: 0.96 },
        }
      case 'left':
        return {
          initial: { opacity: 0, x: offset, scale: 0.96 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: offset, scale: 0.96 },
        }
      case 'right':
        return {
          initial: { opacity: 0, x: -offset, scale: 0.96 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: -offset, scale: 0.96 },
        }
      default:
        return {
          initial: { opacity: 0, y: -offset, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -offset, scale: 0.96 },
        }
    }
  }, [actualSide])

  return (
    <DropdownMenuPortal>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={contentRef}
            data-dropdown-content="true"
            {...animationVariants}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              transform: getMenuTransform(actualSide, align),
              transformOrigin: getTransformOrigin(actualSide),
              zIndex: 9999,
            }}
            className={cn(
              'min-w-[12rem] overflow-hidden rounded-xl border bg-popover py-1 shadow-md backdrop-blur-sm',
              className
            )}
            role="menu"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </DropdownMenuPortal>
  )
}

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  shortcut?: string
  destructive?: boolean
  inset?: boolean
  keepOpenOnSelect?: boolean
  active?: boolean
}

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  (
    {
      className,
      icon,
      shortcut,
      destructive = false,
      inset = false,
      keepOpenOnSelect = false,
      active = false,
      disabled = false,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const { close } = useDropdownMenu()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      onClick?.(event)

      if (!event.defaultPrevented && !keepOpenOnSelect) {
        close()
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        data-dropdown-item="true"
        data-disabled={disabled ? '' : undefined}
        data-active={active ? '' : undefined}
        tabIndex={-1}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-foreground/85 transition-all duration-150',
          'rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0 focus-visible:ring-[3px]',
          destructive
            ? 'hover:bg-destructive/12 hover:text-destructive'
            : 'hover:bg-primary/10 hover:text-primary',
          active && !destructive && 'bg-primary/10 text-primary',
          inset && 'pl-10',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        {...props}
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon && <span className="text-base text-muted-foreground">{icon}</span>}
          <span className="truncate text-left">{children}</span>
        </div>
        {shortcut && (
          <kbd className="rounded-sm ring-1 ring-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-xs">
            {shortcut}
          </kbd>
        )}
      </button>
    )
  }
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuSeparator: React.FC<{ className?: string }> = ({ className }) => {
  return <div role="separator" className={cn('my-1 h-px bg-border/60', className)} />
}

export const DropdownMenuLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      role="presentation"
      className={cn('px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70', className)}
    >
      {children}
    </div>
  )
}

export const DropdownMenuGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div role="group" className={cn('py-1', className)}>
      {children}
    </div>
  )
}

interface DropdownMenuPortalProps {
  children: React.ReactNode
  /** Container element to render portal into (defaults to document.body) */
  container?: Element | null
}

const DropdownMenuPortal: React.FC<DropdownMenuPortalProps> = ({ children, container }) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  // Use createPortal to render content outside the DOM hierarchy
  // This fixes z-index stacking and overflow clipping issues
  return createPortal(children, container ?? document.body)
}

function getMenuTransform(side: 'top' | 'right' | 'bottom' | 'left', align: 'start' | 'center' | 'end'): string {
  let translateX = '-50%'
  let translateY = '0%'

  if (side === 'top') {
    translateX = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%'
    translateY = '-100%'
  } else if (side === 'bottom') {
    translateX = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%'
    translateY = '0%'
  } else if (side === 'left') {
    translateX = '-100%'
    translateY = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%'
  } else if (side === 'right') {
    translateX = '0%'
    translateY = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%'
  }

  return `translate(${translateX}, ${translateY})`
}

function getTransformOrigin(side: 'top' | 'right' | 'bottom' | 'left'): string {
  switch (side) {
    case 'top':
      return 'bottom'
    case 'bottom':
      return 'top'
    case 'left':
      return 'right'
    case 'right':
      return 'left'
    default:
      return 'center'
  }
}

export { DropdownMenuContent }
