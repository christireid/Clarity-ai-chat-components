import { forwardRef, useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { ANIMATION_DURATION, ANIMATION_EASING } from '../animations/constants'

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
}

export const CommandPalette = forwardRef<
  HTMLDivElement,
  CommandPaletteProps
>(
  (
    { items, open, onClose, placeholder = 'Type a command...', className },
    ref
  ) => {
    const [search, setSearch] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)

    // Filter items based on search
    const filteredItems = useMemo(() => {
      if (!search) return items

      const query = search.toLowerCase()
      return items.filter(
        (item) =>
          item.label.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
      )
    }, [items, search])

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
            setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
            break
          case 'ArrowUp':
            e.preventDefault()
            setSelectedIndex(
              (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
            )
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

    // Calculate flat index for keyboard navigation
    const flatItems = useMemo(() => {
      return Object.values(groupedItems).flat()
    }, [groupedItems])

    return (
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION.normal / 1000 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[var(--z-modal-backdrop)]"
            />

            {/* Command Palette */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{
                duration: ANIMATION_DURATION.normal / 1000,
                ease: ANIMATION_EASING.out,
              }}
              className={cn(
                'fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4',
                'bg-card border border-border/60 shadow-[0_24px_48px_rgba(15,23,42,0.32)] rounded-2xl z-[var(--z-modal)]',
                'flex flex-col max-h-[60vh] overflow-hidden',
                className
              )}
            >
              {/* Search Input */}
              <div className="relative p-4 border-b">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <motion.input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={placeholder}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={cn(
                      'flex-1 px-0 py-2 text-base bg-transparent',
                      'border-none outline-none placeholder:text-muted-foreground',
                      'focus:ring-0'
                    )}
                  />
                  {search && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setSearch('')}
                      className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted transition-colors"
                      aria-label="Clear search"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="overflow-y-auto flex-1 p-2">
                {filteredItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-12 text-center"
                  >
                    <svg className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-sm text-muted-foreground">No commands found</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Try a different search term</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedItems).map(
                      ([category, categoryItems], groupIndex) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: groupIndex * 0.05 }}
                        >
                          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {category}
                          </div>
                          <div className="space-y-1">
                            {categoryItems.map((item) => {
                              // Calculate global index
                              const globalIndex = flatItems.indexOf(item)
                              const isSelected = globalIndex === selectedIndex

                              return (
                                <motion.button
                                  key={item.id}
                                  onClick={() => {
                                    item.onSelect()
                                    onClose()
                                  }}
                                  onMouseEnter={() =>
                                    setSelectedIndex(globalIndex)
                                  }
                                  whileHover={{ x: 4 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                                    'transition-all duration-150 text-left',
                                    isSelected
                                      ? 'bg-primary text-primary-foreground shadow-md'
                                      : 'hover:bg-accent'
                                  )}
                                >
                                  {/* Icon */}
                                  {item.icon && (
                                    <motion.div
                                      animate={
                                        isSelected ? { scale: [1, 1.2, 1] } : {}
                                      }
                                      transition={{ duration: 0.3 }}
                                      className="flex-shrink-0"
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

                                  {/* Keyboard Shortcut */}
                                  {item.shortcut && (
                                    <div className="flex gap-1 flex-shrink-0">
                                      {item.shortcut.map((key, i) => (
                                        <kbd
                                          key={i}
                                          className={cn(
                                            'px-2 py-1 text-xs font-mono rounded border',
                                            isSelected
                                              ? 'bg-primary-foreground/20 border-primary-foreground/30'
                                              : 'bg-muted border-border'
                                          )}
                                        >
                                          {key}
                                        </kbd>
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

              {/* Footer Hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-4 py-3 border-t text-xs text-muted-foreground flex items-center justify-between bg-muted/50"
              >
                <div className="flex gap-3 sm:gap-4">
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-2 py-1 bg-background border rounded-md text-xs font-mono shadow-sm">
                      ↑↓
                    </kbd>
                    <span className="hidden sm:inline">Navigate</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-2 py-1 bg-background border rounded-md text-xs font-mono shadow-sm">
                      ↵
                    </kbd>
                    <span className="hidden sm:inline">Select</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-2 py-1 bg-background border rounded-md text-xs font-mono shadow-sm">
                      Esc
                    </kbd>
                    <span className="hidden sm:inline">Close</span>
                  </span>
                </div>
                <div className="font-medium">
                  {filteredItems.length} {filteredItems.length === 1 ? 'command' : 'commands'}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }
)

CommandPalette.displayName = 'CommandPalette'
