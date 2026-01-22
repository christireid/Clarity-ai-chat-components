'use client'

import { useState, useRef, useMemo, useEffect, useId } from 'react'
import { useDebounce } from '../../hooks/ui/use-debounce'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { cn, Kbd, useBodyScrollLock } from '@clarity-chat/primitives'
import {
  ANIMATION_DURATION,
  EASING_FRAMER,
  DURATION_SECONDS as durations,
} from '../../animations/constants'
import { useReducedMotion } from '@clarity-chat/primitives'
import {
  useFocusTrap,
  useFocusRestoration,
} from '../../accessibility/focus-management'

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string[]
  category?: string
  onSelect: () => void
}

export interface CommandPaletteProps {
  items: CommandItem[]
  open: boolean
  onClose: () => void
  placeholder?: string
  className?: string
  /** Show loading spinner during async operations */
  loading?: boolean
  /** Accessible label for the command palette */
  'aria-label'?: string
  ref?: React.Ref<HTMLDivElement>
}

export function CommandPalette({
  items,
  open,
  onClose,
  placeholder = 'Type a command...',
  className,
  loading = false,
  'aria-label': ariaLabel = 'Command palette',
  ref,
}: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedItemRef = useRef<HTMLButtonElement>(null)
  const listboxId = useId()
  const inputId = useId()
  const prefersReducedMotion = useReducedMotion()

  // PERFORMANCE: Debounce search filtering to prevent excessive filtering on rapid typing
  const debouncedSearch = useDebounce(search, 150)

  // Use existing focus management utilities
  const focusTrapRef = useFocusTrap<HTMLDivElement>(open)
  const { saveFocus, restoreFocus } = useFocusRestoration()
  const { lock } = useBodyScrollLock()

  // Setup portal container
  useEffect(() => {
    setPortalContainer(document.body)
  }, [])

  // Body scroll lock when open
  useEffect(() => {
    if (open) {
      const unlock = lock()
      return unlock
    }
    return undefined
  }, [open, lock])

  // Save/restore focus on open/close
  useEffect(() => {
    if (open) {
      saveFocus()
    } else {
      restoreFocus()
    }
  }, [open, saveFocus, restoreFocus])

  // Filter items based on debounced search to prevent excessive filtering
  const filteredItems = useMemo(() => {
    if (!debouncedSearch) return items

    const query = debouncedSearch.toLowerCase()
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
    )
  }, [items, debouncedSearch])

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}

    filteredItems.forEach((item) => {
      const category = item.category || 'Commands'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
    })

    return groups
  }, [filteredItems])

  // Reset selection when filtered items change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredItems])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      setSearch('')
      setSelectedIndex(0)
    }
  }, [open])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            filteredItems.length > 0
              ? (prev - 1 + filteredItems.length) % filteredItems.length
              : 0
          )
          break
        case 'Home':
          e.preventDefault()
          setSelectedIndex(0)
          break
        case 'End':
          e.preventDefault()
          setSelectedIndex(Math.max(0, filteredItems.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].onSelect()
            onClose()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredItems, selectedIndex, onClose])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    }
  }, [selectedIndex])

  // Calculate flat index for keyboard navigation
  const flatItems = useMemo(() => {
    return Object.values(groupedItems).flat()
  }, [groupedItems])

  // Get the currently selected item ID for aria-activedescendant
  const selectedItemId = flatItems[selectedIndex]?.id
    ? `${listboxId}-option-${flatItems[selectedIndex].id}`
    : undefined

  // Animation config respecting reduced motion preference
  const motionProps = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 0.95, y: -20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: -20 },
      }

  // Screen reader live region for announcements
  const liveRegionContent = useMemo(() => {
    if (filteredItems.length === 0) {
      return 'No commands found'
    }
    return `${filteredItems.length} ${filteredItems.length === 1 ? 'command' : 'commands'} available`
  }, [filteredItems.length])

  if (!portalContainer) return null

  const content = (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      <AnimatePresence>
        {open && (
          <>
            {/* Screen reader announcements */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {liveRegionContent}
            </div>

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: prefersReducedMotion
                  ? 0
                  : ANIMATION_DURATION.normal / 1000,
              }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[var(--z-modal-backdrop)]"
              aria-hidden="true"
            />

            {/* Command Palette - with focus trap */}
            <motion.div
              ref={focusTrapRef}
              {...motionProps}
              transition={{
                duration: prefersReducedMotion
                  ? 0
                  : ANIMATION_DURATION.normal / 1000,
                ease: EASING_FRAMER.out,
              }}
              role="dialog"
              aria-modal="true"
              aria-label={ariaLabel}
              className={cn(
                'fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4',
                'bg-card border shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1),0_8px_10px_-6px_rgb(0_0_0_/_0.1)] rounded-lg z-[var(--z-modal)]',
                'flex flex-col max-h-[60vh] overflow-hidden',
                className
              )}
            >
              {/* Search Input with Combobox pattern */}
              <div className="relative p-4 border-b">
                <div className="flex items-center gap-3">
                  {loading ? (
                    <svg
                      className="h-5 w-5 text-muted-foreground shrink-0 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-muted-foreground shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                  <input
                    ref={inputRef}
                    id={inputId}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={placeholder}
                    role="combobox"
                    aria-expanded="true"
                    aria-controls={listboxId}
                    aria-activedescendant={selectedItemId}
                    aria-autocomplete="list"
                    aria-busy={loading}
                    className={cn(
                      'flex-1 px-0 py-2 text-base bg-transparent',
                      'border-none outline-none placeholder:text-muted-foreground',
                      'focus:ring-0'
                    )}
                  />
                  {search && (
                    <motion.button
                      initial={
                        prefersReducedMotion
                          ? false
                          : { opacity: 0, scale: 0.8 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setSearch('')}
                      className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted transition-colors"
                      aria-label="Clear search"
                      type="button"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Results - Listbox pattern for accessibility */}
              <div
                id={listboxId}
                role="listbox"
                aria-label="Commands"
                className="overflow-y-auto flex-1 p-2"
              >
                {filteredItems.length === 0 ? (
                  <motion.div
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, y: 10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    className="py-12 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    <svg
                      className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-sm text-muted-foreground">
                      No commands found
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Try a different search term
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedItems).map(
                      ([category, categoryItems], groupIndex) => (
                        <motion.div
                          key={category}
                          role="group"
                          aria-labelledby={`${listboxId}-group-${groupIndex}`}
                          initial={
                            prefersReducedMotion ? false : { opacity: 0, y: 10 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: prefersReducedMotion ? 0 : groupIndex * 0.05,
                          }}
                        >
                          <div
                            id={`${listboxId}-group-${groupIndex}`}
                            className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                          >
                            {category}
                          </div>
                          <div className="space-y-1">
                            {categoryItems.map((item) => {
                              // Calculate global index
                              const globalIndex = flatItems.indexOf(item)
                              const isSelected = globalIndex === selectedIndex
                              const optionId = `${listboxId}-option-${item.id}`

                              return (
                                <motion.button
                                  key={item.id}
                                  id={optionId}
                                  ref={isSelected ? selectedItemRef : null}
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    item.onSelect()
                                    onClose()
                                  }}
                                  onMouseEnter={() =>
                                    setSelectedIndex(globalIndex)
                                  }
                                  whileHover={
                                    prefersReducedMotion ? {} : { x: 4 }
                                  }
                                  whileTap={
                                    prefersReducedMotion ? {} : { scale: 0.98 }
                                  }
                                  className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                                    'transition-all duration-150 text-left',
                                    isSelected
                                      ? 'bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(15,23,42,0.15)]'
                                      : 'hover:bg-accent'
                                  )}
                                  type="button"
                                >
                                  {/* Icon */}
                                  {item.icon && (
                                    <motion.div
                                      animate={
                                        isSelected && !prefersReducedMotion
                                          ? { scale: [1, 1.2, 1] }
                                          : {}
                                      }
                                      transition={{
                                        duration: durations.moderate,
                                      }}
                                      className="flex-shrink-0"
                                      aria-hidden="true"
                                    >
                                      {item.icon}
                                    </motion.div>
                                  )}

                                  {/* Label & Description */}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                      {item.label}
                                    </div>
                                    {item.description && (
                                      <div
                                        className={cn(
                                          'text-sm truncate',
                                          isSelected
                                            ? 'text-primary-foreground/70'
                                            : 'text-muted-foreground'
                                        )}
                                      >
                                        {item.description}
                                      </div>
                                    )}
                                  </div>

                                  {/* Keyboard Shortcut - using Kbd component */}
                                  {item.shortcut && (
                                    <div
                                      className="flex gap-1 flex-shrink-0"
                                      aria-hidden="true"
                                    >
                                      {item.shortcut.map((key, i) => (
                                        <Kbd
                                          key={i}
                                          shortcut={key}
                                          size="sm"
                                          variant={
                                            isSelected ? 'ghost' : 'default'
                                          }
                                          className={cn(
                                            isSelected &&
                                              'bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground'
                                          )}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </motion.button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Footer Hint - using Kbd component */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
                className="px-4 py-3 border-t text-xs text-muted-foreground flex items-center justify-between bg-muted/50"
              >
                <div className="flex gap-3 sm:gap-4" aria-hidden="true">
                  <span className="flex items-center gap-1.5">
                    <Kbd shortcut="up" size="sm" />
                    <Kbd shortcut="down" size="sm" />
                    <span className="hidden sm:inline">Navigate</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Kbd shortcut="enter" size="sm" />
                    <span className="hidden sm:inline">Select</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Kbd shortcut="escape" size="sm" />
                    <span className="hidden sm:inline">Close</span>
                  </span>
                </div>
                <div className="font-medium">
                  {filteredItems.length}{' '}
                  {filteredItems.length === 1 ? 'command' : 'commands'}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  )

  // Render through portal to avoid z-index issues
  return createPortal(content, portalContainer)
}

CommandPalette.displayName = 'CommandPalette'
