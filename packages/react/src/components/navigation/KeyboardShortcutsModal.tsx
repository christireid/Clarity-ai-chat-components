'use client'

/**
 * Enhanced Keyboard Shortcuts Modal
 *
 * A beautiful, searchable modal for discovering keyboard shortcuts.
 * Features:
 * - Fuzzy search across all shortcuts
 * - Grouped by category with animations
 * - Platform-aware key display (Mac vs Windows)
 * - Keyboard navigable
 * - Sequence shortcuts visual indicator
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Kbd, cn, useReducedMotion } from '@clarity-chat/primitives'
import {
  useFocusTrap,
  useFocusRestoration,
} from '../../accessibility/focus-management'
import {
  formatShortcutDisplay,
  useIsMac,
} from '../../hooks/keyboard/use-keyboard-navigation'
import { EASING_FRAMER, ANIMATION_PRESETS } from '../../animations/constants'

export interface ShortcutItem {
  id: string
  keys: string | string[]
  description: string
  category?: string
  isSequence?: boolean
}

export interface KeyboardShortcutsModalProps {
  /** Whether the modal is open */
  open: boolean
  /** Callback when modal should close */
  onClose: () => void
  /** Array of shortcuts to display */
  shortcuts: ShortcutItem[]
  /** Modal title */
  title?: string
  /** Custom class name */
  className?: string
}

export function KeyboardShortcutsModal({
  open,
  onClose,
  shortcuts,
  title = 'Keyboard Shortcuts',
  className,
}: KeyboardShortcutsModalProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const focusTrapRef = useFocusTrap<HTMLDivElement>(open)
  const { saveFocus, restoreFocus } = useFocusRestoration()
  const prefersReducedMotion = useReducedMotion()

  // Detect platform using SSR-safe hook
  const isMac = useIsMac()

  // Save/restore focus
  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (open) {
      saveFocus()
      // Focus search input with small delay for animation
      timeoutId = setTimeout(() => searchInputRef.current?.focus(), 100)
    } else {
      restoreFocus()
      setSearchQuery('')
      setSelectedIndex(0)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [open, saveFocus, restoreFocus])

  // Filter shortcuts by search query
  const filteredShortcuts = React.useMemo(() => {
    if (!searchQuery.trim()) return shortcuts

    const query = searchQuery.toLowerCase()
    return shortcuts.filter(
      (shortcut) =>
        shortcut.description.toLowerCase().includes(query) ||
        shortcut.category?.toLowerCase().includes(query) ||
        (Array.isArray(shortcut.keys)
          ? shortcut.keys.some((k) => k.toLowerCase().includes(query))
          : shortcut.keys.toLowerCase().includes(query))
    )
  }, [shortcuts, searchQuery])

  // Group shortcuts by category
  const groupedShortcuts = React.useMemo(() => {
    const groups: Record<string, ShortcutItem[]> = {}

    filteredShortcuts.forEach((shortcut) => {
      const category = shortcut.category || 'General'
      if (!groups[category]) groups[category] = []
      groups[category].push(shortcut)
    })

    // Sort categories
    const sortOrder = ['General', 'Navigation', 'Chat', 'Edit', 'Help']
    return Object.entries(groups).sort(([a], [b]) => {
      const aIndex = sortOrder.indexOf(a)
      const bIndex = sortOrder.indexOf(b)
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
  }, [filteredShortcuts])

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          if (searchQuery) {
            setSearchQuery('')
          } else {
            onClose()
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            Math.min(prev + 1, filteredShortcuts.length - 1)
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, searchQuery, filteredShortcuts.length, onClose])

  // Reset selection when filtered results change
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [filteredShortcuts.length])

  const renderKeyDisplay = (keys: string | string[]) => {
    const keyArray = Array.isArray(keys) ? keys : [keys]

    return (
      <div className="flex items-center gap-2 flex-shrink-0">
        {keyArray.map((key, index) => {
          // Check if it's a sequence (contains space)
          const isSequence = key.includes(' ')
          const parts = isSequence ? key.split(' ') : [key]

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="text-muted-foreground text-xs">or</span>
              )}
              <div className="flex items-center gap-1">
                {parts.map((part, partIndex) => (
                  <React.Fragment key={partIndex}>
                    {partIndex > 0 && isSequence && (
                      <span className="text-muted-foreground text-xs mx-0.5">
                        then
                      </span>
                    )}
                    <Kbd
                      shortcut={formatShortcutDisplay(
                        part,
                        isMac ? 'mac' : 'windows'
                      )}
                      size="sm"
                      className="min-w-[24px] justify-center"
                    />
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            {...ANIMATION_PRESETS.fadeIn}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={focusTrapRef}
            {...(prefersReducedMotion
              ? ANIMATION_PRESETS.fadeIn
              : ANIMATION_PRESETS.slideUp)}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.25,
              ease: EASING_FRAMER.sharp,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-modal-title"
            className={cn(
              'fixed top-[10%] left-1/2 -translate-x-1/2 z-50',
              'w-full max-w-2xl mx-4',
              'backdrop-blur-md backdrop-saturate-150 bg-white/60 dark:bg-background/60',
              'rounded-xl border border-glass-light dark:border-glass-dark-light',
              'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]',
              'hover:-translate-y-0.5 hover:shadow-lg transition-transform',
              'flex flex-col max-h-[80vh] overflow-hidden',
              className
            )}
          >
            {/* Header */}
            <div className="flex flex-col gap-4 p-5 border-b border-border/60 bg-muted/30">
              <div className="flex items-center justify-between">
                <motion.div
                  {...ANIMATION_PRESETS.slideRight}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.1 }}
                >
                  <h2
                    id="shortcuts-modal-title"
                    className="text-xl font-bold flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                    {title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {filteredShortcuts.length} shortcut
                    {filteredShortcuts.length !== 1 ? 's' : ''} available
                  </p>
                </motion.div>

                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
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
              </div>

              {/* Search */}
              <motion.div
                {...ANIMATION_PRESETS.slideDown}
                transition={{ delay: prefersReducedMotion ? 0 : 0.15 }}
                className="relative"
              >
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
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
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shortcuts..."
                  className={cn(
                    'w-full pl-10 pr-10 py-2.5 text-sm',
                    'bg-background border border-border/60 rounded-lg',
                    'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
                    'placeholder:text-muted-foreground/60',
                    'transition-all duration-200'
                  )}
                  aria-label="Search shortcuts"
                />
                {searchQuery && (
                  <motion.button
                    {...ANIMATION_PRESETS.pop}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded transition-colors"
                    aria-label="Clear search"
                  >
                    <svg
                      className="w-3.5 h-3.5"
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
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-5">
              {groupedShortcuts.length === 0 ? (
                <motion.div
                  {...ANIMATION_PRESETS.slideUp}
                  className="text-center py-12"
                >
                  <svg
                    className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3"
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
                    No shortcuts found for &quot;{searchQuery}&quot;
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {groupedShortcuts.map(
                    ([category, categoryShortcuts], categoryIndex) => (
                      <motion.div
                        key={category}
                        {...ANIMATION_PRESETS.slideUp}
                        transition={{
                          delay: prefersReducedMotion
                            ? 0
                            : categoryIndex * 0.05,
                        }}
                      >
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
                          <span>{category}</span>
                          <span className="text-muted-foreground/70">
                            ({categoryShortcuts.length})
                          </span>
                        </h3>
                        <div className="space-y-1">
                          {categoryShortcuts.map((shortcut, index) => (
                            <motion.div
                              key={shortcut.id}
                              {...ANIMATION_PRESETS.slideRight}
                              transition={{
                                delay: prefersReducedMotion
                                  ? 0
                                  : categoryIndex * 0.05 + index * 0.02,
                              }}
                              whileHover={{
                                x: prefersReducedMotion ? 0 : 4,
                                backgroundColor: 'var(--accent)',
                              }}
                              className={cn(
                                'flex items-center justify-between gap-4 p-3 rounded-lg',
                                'hover:bg-accent/50 transition-all duration-200 group'
                              )}
                            >
                              <span className="text-sm group-hover:text-foreground transition-colors">
                                {shortcut.description}
                              </span>
                              {renderKeyDisplay(shortcut.keys)}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <motion.div
              {...ANIMATION_PRESETS.fadeIn}
              transition={{ delay: prefersReducedMotion ? 0 : 0.3 }}
              className="px-5 py-3.5 border-t border-border/60 bg-muted/30 text-xs text-muted-foreground flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Kbd shortcut="?" size="sm" />
                  <span>toggle</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd shortcut="Esc" size="sm" />
                  <span>close</span>
                </span>
              </div>
              <span className="text-muted-foreground/70">
                {isMac ? 'macOS' : 'Windows/Linux'}
              </span>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

KeyboardShortcutsModal.displayName = 'KeyboardShortcutsModal'
