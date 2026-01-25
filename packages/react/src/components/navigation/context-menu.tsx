'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { cn, Kbd } from '@clarity-chat/primitives'
import { ANIMATION_DURATION, EASING_FRAMER, ANIMATION_PRESETS } from '../../animations/constants'
import { useReducedMotion } from '@clarity-chat/primitives'
import {
  useFocusTrap,
  useFocusRestoration,
} from '../../accessibility/focus-management'

export interface ContextMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  separator?: boolean
  submenu?: ContextMenuItem[]
  onSelect?: () => void
}

export interface ContextMenuProps {
  items: ContextMenuItem[]
  children: React.ReactNode
  className?: string
  /** Accessible label for the context menu */
  'aria-label'?: string
  ref?: React.Ref<HTMLDivElement>
}

export function ContextMenu({
  items,
  children,
  className,
  'aria-label': ariaLabel = 'Context menu',
  ref,
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [submenuOpen, setSubmenuOpen] = React.useState<string | null>(null)
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const [typeahead, setTypeahead] = React.useState('')
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null)
  const typeaheadTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const menuId = React.useId()
  const prefersReducedMotion = useReducedMotion()

  // Use existing focus management utilities
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen)
  const { saveFocus, restoreFocus } = useFocusRestoration()

  // Setup portal container
  React.useEffect(() => {
    setPortalContainer(document.body)
  }, [])

  // Filter out separators for navigation
  const navigableItems = React.useMemo(
    () => items.filter((item) => !item.separator),
    [items]
  )

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    saveFocus() // Save focus before opening
    setPosition({ x: e.clientX, y: e.clientY })
    setIsOpen(true)
    setSubmenuOpen(null)
    setFocusedIndex(0) // Focus first item on open
  }

  const handleClose = React.useCallback(() => {
    setIsOpen(false)
    setSubmenuOpen(null)
    setFocusedIndex(-1)
    setTypeahead('')
    restoreFocus() // Restore focus on close
  }, [restoreFocus])

  const handleItemClick = React.useCallback(
    (item: ContextMenuItem) => {
      if (item.disabled) return

      if (item.submenu) {
        setSubmenuOpen((prev) => (prev === item.id ? null : item.id))
      } else {
        item.onSelect?.()
        handleClose()
      }
    },
    [handleClose]
  )

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        focusTrapRef.current &&
        !focusTrapRef.current.contains(e.target as Node)
      ) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
    return undefined
  }, [isOpen, handleClose, focusTrapRef])

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          // If submenu is open, close it first
          if (submenuOpen) {
            setSubmenuOpen(null)
          } else {
            handleClose()
          }
          break

        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) => {
            let next = prev + 1
            // Skip disabled items
            while (
              next < navigableItems.length &&
              navigableItems[next]?.disabled
            ) {
              next++
            }
            return next >= navigableItems.length ? prev : next
          })
          break

        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => {
            let next = prev - 1
            // Skip disabled items
            while (next >= 0 && navigableItems[next]?.disabled) {
              next--
            }
            return next < 0 ? prev : next
          })
          break

        case 'ArrowRight':
          e.preventDefault()
          // Open submenu if available
          if (navigableItems[focusedIndex]?.submenu) {
            setSubmenuOpen(navigableItems[focusedIndex].id)
          }
          break

        case 'ArrowLeft':
          e.preventDefault()
          // Close submenu
          if (submenuOpen) {
            setSubmenuOpen(null)
          }
          break

        case 'Home':
          e.preventDefault()
          // Find first non-disabled item
          const firstEnabled = navigableItems.findIndex(
            (item) => !item.disabled
          )
          if (firstEnabled !== -1) {
            setFocusedIndex(firstEnabled)
          }
          break

        case 'End':
          e.preventDefault()
          // Find last non-disabled item
          for (let i = navigableItems.length - 1; i >= 0; i--) {
            if (!navigableItems[i].disabled) {
              setFocusedIndex(i)
              break
            }
          }
          break

        case 'Enter':
        case ' ':
          e.preventDefault()
          if (focusedIndex >= 0 && navigableItems[focusedIndex]) {
            handleItemClick(navigableItems[focusedIndex])
          }
          break

        default:
          // Type-ahead: match first letter of item label
          if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            const newTypeahead = typeahead + e.key.toLowerCase()
            setTypeahead(newTypeahead)

            // Clear typeahead after 500ms of inactivity
            if (typeaheadTimeoutRef.current) {
              clearTimeout(typeaheadTimeoutRef.current)
            }
            typeaheadTimeoutRef.current = setTimeout(() => {
              setTypeahead('')
            }, 500)

            // Find matching item
            const matchIndex = navigableItems.findIndex(
              (item) =>
                !item.disabled &&
                item.label.toLowerCase().startsWith(newTypeahead)
            )
            if (matchIndex !== -1) {
              setFocusedIndex(matchIndex)
            }
          }
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
    return undefined
  }, [
    isOpen,
    focusedIndex,
    submenuOpen,
    navigableItems,
    typeahead,
    handleClose,
    handleItemClick,
  ])

  // Adjust position to keep menu on screen
  React.useEffect(() => {
    if (isOpen && focusTrapRef.current) {
      const menu = focusTrapRef.current
      const rect = menu.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let { x, y } = position

      // Adjust horizontal position
      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width - 10
      }

      // Adjust vertical position
      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height - 10
      }

      if (x !== position.x || y !== position.y) {
        setPosition({ x, y })
      }
    }
  }, [isOpen, position, focusTrapRef])

  const renderMenuItems = (
    menuItems: ContextMenuItem[],
    level = 0,
    parentId = menuId
  ) => {
    // Track navigation index for this level
    let navIndex = -1

    return menuItems.map((item, index) => {
      if (item.separator) {
        return (
          <motion.div
            key={`separator-${index}`}
            role="separator"
            initial={prefersReducedMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: prefersReducedMotion ? 0 : index * 0.02 }}
            className="my-1 border-t"
            aria-hidden="true"
          />
        )
      }

      // Calculate navigation index (excluding separators)
      navIndex++
      const currentNavIndex = navIndex

      const hasSubmenu = item.submenu && item.submenu.length > 0
      const isSubmenuOpen = submenuOpen === item.id
      const isFocused = level === 0 && currentNavIndex === focusedIndex
      const itemId = `${parentId}-item-${item.id}`

      return (
        <div key={item.id} className="relative">
          <motion.button
            id={itemId}
            role="menuitem"
            aria-disabled={item.disabled}
            aria-haspopup={hasSubmenu ? 'menu' : undefined}
            aria-expanded={hasSubmenu ? isSubmenuOpen : undefined}
            tabIndex={isFocused ? 0 : -1}
            {...(prefersReducedMotion ? ANIMATION_PRESETS.fadeIn : ANIMATION_PRESETS.slideRight)}
            transition={{
              delay: prefersReducedMotion ? 0 : index * 0.03,
              ease: EASING_FRAMER.out,
            }}
            onClick={() => handleItemClick(item)}
            onMouseEnter={() => {
              if (hasSubmenu) setSubmenuOpen(item.id)
              if (level === 0) setFocusedIndex(currentNavIndex)
            }}
            onFocus={() => {
              if (level === 0) setFocusedIndex(currentNavIndex)
            }}
            disabled={item.disabled}
            whileHover={!item.disabled && !prefersReducedMotion ? { x: 2 } : {}}
            whileTap={
              !item.disabled && !prefersReducedMotion ? { scale: 0.98 } : {}
            }
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 text-sm text-left',
              'transition-all duration-150 rounded-lg',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              item.disabled && 'opacity-50 cursor-not-allowed',
              !item.disabled &&
                'hover:bg-accent hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)]',
              item.danger &&
                !item.disabled &&
                'text-destructive hover:bg-destructive/10 hover:text-destructive',
              isFocused && !item.disabled && 'bg-accent'
            )}
            type="button"
          >
            {/* Icon */}
            {item.icon && (
              <motion.div
                whileHover={
                  !item.disabled && !prefersReducedMotion
                    ? { scale: 1.2, rotate: 5 }
                    : {}
                }
                className="flex-shrink-0"
                aria-hidden="true"
              >
                {item.icon}
              </motion.div>
            )}

            {/* Label */}
            <span className="flex-1">{item.label}</span>

            {/* Shortcut or Submenu Arrow */}
            {item.shortcut && !hasSubmenu && (
              <Kbd shortcut={item.shortcut} size="sm" aria-hidden="true" />
            )}

            {hasSubmenu && (
              <motion.svg
                animate={
                  prefersReducedMotion ? {} : { rotate: isSubmenuOpen ? 90 : 0 }
                }
                transition={{
                  type: 'spring',
                  damping: 18,
                  stiffness: 280,
                }}
                width="12"
                height="12"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </motion.svg>
            )}
          </motion.button>

          {/* Submenu */}
          <AnimatePresence>
            {hasSubmenu && isSubmenuOpen && (
              <motion.div
                role="menu"
                aria-label={`${item.label} submenu`}
                {...(prefersReducedMotion ? ANIMATION_PRESETS.fadeIn : ANIMATION_PRESETS.slideRight)}
                transition={{
                  type: prefersReducedMotion ? 'tween' : 'spring',
                  duration: prefersReducedMotion ? 0.1 : undefined,
                  damping: 26,
                  stiffness: 290,
                }}
                style={{ zIndex: 'var(--z-popover)' }}
                className={cn(
                  'absolute left-full top-0 ml-2',
                  'min-w-[180px] bg-card border border-border/60 shadow-2xl rounded-lg',
                  'p-2'
                )}
              >
                {renderMenuItems(item.submenu!, level + 1, itemId)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    })
  }

  const menuContent =
    isOpen && portalContainer ? (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Invisible backdrop for detecting outside clicks */}
            <div
              className="fixed inset-0"
              style={{ zIndex: 'var(--z-popover)' }}
              aria-hidden="true"
            />

            {/* Context Menu */}
            <motion.div
              ref={focusTrapRef}
              id={menuId}
              role="menu"
              aria-label={ariaLabel}
              {...(prefersReducedMotion ? ANIMATION_PRESETS.fadeIn : ANIMATION_PRESETS.slideDown)}
              transition={{
                duration: prefersReducedMotion
                  ? 0.1
                  : ANIMATION_DURATION.fast / 1000,
                ease: EASING_FRAMER.out,
              }}
              style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 'var(--z-popover)',
              }}
              className="min-w-[200px] bg-card border border-border/50 shadow-md rounded-lg p-2 backdrop-blur-sm focus:outline-none"
              tabIndex={-1}
            >
              {renderMenuItems(items)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    ) : null

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      <div ref={ref} onContextMenu={handleContextMenu} className={className}>
        {children}
        {menuContent && createPortal(menuContent, portalContainer!)}
      </div>
    </MotionConfig>
  )
}

ContextMenu.displayName = 'ContextMenu'
