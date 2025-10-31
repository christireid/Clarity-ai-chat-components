import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { ANIMATION_DURATION, ANIMATION_EASING } from '../animations/constants'

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
}

export const ContextMenu = React.forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ items, children, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const [submenuOpen, setSubmenuOpen] = React.useState<string | null>(null)
    const menuRef = React.useRef<HTMLDivElement>(null)

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault()
      setPosition({ x: e.clientX, y: e.clientY })
      setIsOpen(true)
      setSubmenuOpen(null)
    }

    const handleClose = () => {
      setIsOpen(false)
      setSubmenuOpen(null)
    }

    const handleItemClick = (item: ContextMenuItem) => {
      if (item.disabled) return
      
      if (item.submenu) {
        setSubmenuOpen(submenuOpen === item.id ? null : item.id)
      } else {
        item.onSelect?.()
        handleClose()
      }
    }

    // Close on click outside
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          handleClose()
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    // Close on Escape
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose()
        }
      }

      if (isOpen) {
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
      }
    }, [isOpen])

    // Adjust position to keep menu on screen
    React.useEffect(() => {
      if (isOpen && menuRef.current) {
        const menu = menuRef.current
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
    }, [isOpen, position])

    const renderMenuItems = (menuItems: ContextMenuItem[], level = 0) => {
      return menuItems.map((item, index) => {
        if (item.separator) {
          return (
            <motion.div
              key={`separator-${index}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.02 }}
              className="my-1 border-t"
            />
          )
        }

        const hasSubmenu = item.submenu && item.submenu.length > 0
        const isSubmenuOpen = submenuOpen === item.id

        return (
          <div key={item.id} className="relative">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, ease: ANIMATION_EASING.out }}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => hasSubmenu && setSubmenuOpen(item.id)}
              disabled={item.disabled}
              whileHover={!item.disabled ? { x: 4 } : {}}
              whileTap={!item.disabled ? { scale: 0.98 } : {}}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 text-sm text-left',
                'transition-colors rounded-md',
                item.disabled && 'opacity-50 cursor-not-allowed',
                !item.disabled && 'hover:bg-muted',
                item.danger && !item.disabled && 'hover:bg-destructive hover:text-destructive-foreground'
              )}
            >
              {/* Icon */}
              {item.icon && (
                <motion.div
                  whileHover={!item.disabled ? { scale: 1.2, rotate: 5 } : {}}
                  className="flex-shrink-0"
                >
                  {item.icon}
                </motion.div>
              )}

              {/* Label */}
              <span className="flex-1">{item.label}</span>

              {/* Shortcut or Submenu Arrow */}
              {item.shortcut && !hasSubmenu && (
                <kbd className="text-xs text-muted-foreground font-mono">
                  {item.shortcut}
                </kbd>
              )}

              {hasSubmenu && (
                <motion.svg
                  animate={{ rotate: isSubmenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  width="12"
                  height="12"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0"
                >
                  <path
                    d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </motion.button>

            {/* Submenu */}
            <AnimatePresence>
              {hasSubmenu && isSubmenuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10, scale: 0.95 }}
                  transition={{
                    duration: ANIMATION_DURATION.fast / 1000,
                    ease: ANIMATION_EASING.out,
                  }}
                  className={cn(
                    'absolute left-full top-0 ml-1',
                    'min-w-[180px] bg-background border rounded-lg shadow-lg',
                    'p-1 z-10'
                  )}
                >
                  {renderMenuItems(item.submenu!, level + 1)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })
    }

    return (
      <div ref={ref} onContextMenu={handleContextMenu} className={className}>
        {children}

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Invisible backdrop for detecting outside clicks */}
              <div className="fixed inset-0 z-40" />

              {/* Context Menu */}
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{
                  duration: ANIMATION_DURATION.fast / 1000,
                  ease: ANIMATION_EASING.out,
                }}
                style={{
                  position: 'fixed',
                  left: position.x,
                  top: position.y,
                  zIndex: 50,
                }}
                className="min-w-[200px] bg-background border rounded-lg shadow-xl p-1"
              >
                {renderMenuItems(items)}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

ContextMenu.displayName = 'ContextMenu'
