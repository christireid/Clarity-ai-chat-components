import * as React from 'react'
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

export const CommandPalette = React.forwardRef<HTMLDivElement, CommandPaletteProps>(
  ({ items, open, onClose, placeholder = 'Type a command...', className }, ref) => {
    const [search, setSearch] = React.useState('')
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Filter items based on search
    const filteredItems = React.useMemo(() => {
      if (!search) return items
      
      const query = search.toLowerCase()
      return items.filter(
        item =>
          item.label.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
      )
    }, [items, search])

    // Group items by category
    const groupedItems = React.useMemo(() => {
      const groups: Record<string, CommandItem[]> = {}
      
      filteredItems.forEach(item => {
        const category = item.category || 'Commands'
        if (!groups[category]) {
          groups[category] = []
        }
        groups[category].push(item)
      })
      
      return groups
    }, [filteredItems])

    // Reset selection when filtered items change
    React.useEffect(() => {
      setSelectedIndex(0)
    }, [filteredItems])

    // Focus input when opened
    React.useEffect(() => {
      if (open) {
        inputRef.current?.focus()
        setSearch('')
        setSelectedIndex(0)
      }
    }, [open])

    // Handle keyboard navigation
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!open) return

        switch (e.key) {
          case 'Escape':
            e.preventDefault()
            onClose()
            break
          case 'ArrowDown':
            e.preventDefault()
            setSelectedIndex(prev => (prev + 1) % filteredItems.length)
            break
          case 'ArrowUp':
            e.preventDefault()
            setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)
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
    const flatItems = React.useMemo(() => {
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
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
                'fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl',
                'bg-background border rounded-lg shadow-2xl z-50',
                'flex flex-col max-h-[60vh]',
                className
              )}
            >
              {/* Search Input */}
              <div className="p-4 border-b">
                <motion.input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={placeholder}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className={cn(
                    'w-full px-4 py-3 text-lg bg-transparent',
                    'border-none outline-none placeholder:text-muted-foreground'
                  )}
                />
              </div>

              {/* Results */}
              <div className="overflow-y-auto flex-1 p-2">
                {filteredItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No commands found
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedItems).map(([category, categoryItems], groupIndex) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.05 }}
                      >
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {category}
                        </div>
                        <div className="space-y-1">
                          {categoryItems.map((item, itemIndex) => {
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
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-3 rounded-md',
                                  'transition-colors text-left',
                                  isSelected
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                                )}
                              >
                                {/* Icon */}
                                {item.icon && (
                                  <motion.div
                                    animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0"
                                  >
                                    {item.icon}
                                  </motion.div>
                                )}

                                {/* Label & Description */}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{item.label}</div>
                                  {item.description && (
                                    <div
                                      className={cn(
                                        'text-sm truncate',
                                        isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'
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
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-4 py-3 border-t text-xs text-muted-foreground flex items-center justify-between"
              >
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↵</kbd> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd> Close
                  </span>
                </div>
                <div>{filteredItems.length} commands</div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }
)

CommandPalette.displayName = 'CommandPalette'
