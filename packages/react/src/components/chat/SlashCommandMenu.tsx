'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'
import { ANIMATION_PRESETS } from '../../animations/constants'

/**
 * Slash Command Definition
 */
export interface SlashCommand {
  /** Command name (e.g., "/search") */
  name: string
  /** Human-readable description */
  description: string
  /** Icon component (lucide-react or custom) */
  icon: React.ComponentType<{ size?: number; className?: string }>
  /** Optional category for grouping */
  category?: string
  /** Whether command is currently available */
  available?: boolean
}

export interface SlashCommandMenuProps {
  /** List of available commands */
  commands: SlashCommand[]
  /** Whether the menu is visible */
  isOpen: boolean
  /** Callback when a command is selected */
  onSelect: (command: SlashCommand) => void
  /** Callback to close the menu */
  onClose: () => void
  /** Current search query (after "/") */
  query?: string
  /** Optional CSS class */
  className?: string
  /** Position relative to input */
  position?: 'above' | 'below'
}

/**
 * SlashCommandMenu - Command Discovery Interface
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat UI - Tool Discovery
 *
 * A visual interface for discovering and selecting slash commands (tool shortcuts).
 * Appears when user types "/" in the chat input, showing available commands with
 * keyboard navigation support.
 *
 * **Agent-Native Architecture Principle**:
 * "What the user can see, the agent can see" - This UI makes tool capabilities
 * visible and discoverable, improving both human and agent understanding of
 * available actions.
 *
 * @example
 * ```tsx
 * const commands = [
 *   { name: '/search', description: 'Search documentation', icon: Search },
 *   { name: '/bundle', description: 'Calculate bundle size', icon: Package },
 *   { name: '/code', description: 'Generate code example', icon: Code },
 * ]
 *
 * <SlashCommandMenu
 *   commands={commands}
 *   isOpen={showMenu}
 *   onSelect={(cmd) => insertCommand(cmd.name)}
 *   onClose={() => setShowMenu(false)}
 *   query="sea"
 * />
 * ```
 *
 * **Features:**
 * - Keyboard navigation (↑↓ arrows, Enter to select, Esc to close)
 * - Fuzzy filtering based on query
 * - Categorized commands
 * - Accessibility (ARIA labels, focus management)
 * - Smooth animations (respects reduced motion)
 *
 * @param props - SlashCommandMenu configuration
 */
export function SlashCommandMenu({
  commands,
  isOpen,
  onSelect,
  onClose,
  query = '',
  className,
  position = 'above',
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Filter commands based on query
  const filteredCommands = React.useMemo(() => {
    if (!query) return commands

    const lowerQuery = query.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(lowerQuery) ||
        cmd.description.toLowerCase().includes(lowerQuery)
    )
  }, [commands, query])

  // Reset selection when filtered commands change
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [filteredCommands])

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            onSelect(filteredCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
        case 'Tab':
          // Tab cycles through commands like arrow keys
          e.preventDefault()
          if (e.shiftKey) {
            setSelectedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredCommands.length - 1
            )
          } else {
            setSelectedIndex((prev) =>
              prev < filteredCommands.length - 1 ? prev + 1 : 0
            )
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onSelect, onClose])

  // Scroll selected item into view
  React.useEffect(() => {
    if (!menuRef.current) return

    const selectedElement = menuRef.current.querySelector(
      `[data-command-index="${selectedIndex}"]`
    )
    selectedElement?.scrollIntoView({
      block: 'nearest',
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [selectedIndex, prefersReducedMotion])

  // Group commands by category
  const commandsByCategory = React.useMemo(() => {
    const grouped: Record<string, SlashCommand[]> = {}

    filteredCommands.forEach((cmd) => {
      const category = cmd.category || 'General'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(cmd)
    })

    return grouped
  }, [filteredCommands])

  if (filteredCommands.length === 0) {
    return null
  }

  const menuVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, y: position === 'above' ? 10 : -10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: position === 'above' ? 10 : -10, scale: 0.95 },
      }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
            mass: 0.8,
          }}
          className={cn(
            'absolute left-0 right-0 z-50',
            'glass-strong rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20',
            'max-h-[280px] overflow-y-auto scrollbar-hide',
            position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2',
            className
          )}
          role="listbox"
          aria-label="Available slash commands"
        >
          {/* Header */}
          <div className="sticky top-0 glass-subtle border-b border-white/10 dark:border-white/5 px-3 py-2.5 flex items-center gap-2">
            <div className="icon-container-sm !w-6 !h-6">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground">
              Quick Commands
            </span>
            {query && (
              <span className="badge-glass text-xs ml-auto">
                /{query}
              </span>
            )}
          </div>

          {/* Commands grouped by category */}
          <div className="p-1">
            {Object.entries(commandsByCategory).map(
              ([category, categoryCommands]) => (
                <div key={category}>
                  {Object.keys(commandsByCategory).length > 1 && (
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {category}
                    </div>
                  )}
                  {categoryCommands.map((cmd, idx) => {
                    const globalIndex = filteredCommands.indexOf(cmd)
                    const isSelected = globalIndex === selectedIndex
                    const isAvailable = cmd.available !== false

                    return (
                      <button
                        key={cmd.name}
                        data-command-index={globalIndex}
                        onClick={() => isAvailable && onSelect(cmd)}
                        disabled={!isAvailable}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                          'text-left transition-all duration-200',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          'group relative overflow-hidden',
                          isSelected
                            ? 'glass text-foreground glow-sm'
                            : 'text-muted-foreground hover:glass-subtle hover:text-foreground',
                          !isAvailable && 'opacity-50 cursor-not-allowed'
                        )}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={!isAvailable}
                      >
                        {/* Icon */}
                        <cmd.icon
                          size={16}
                          className={cn(
                            isSelected
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          )}
                        />

                        {/* Command name and description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span
                              className={cn(
                                'font-mono text-sm font-medium',
                                isSelected ? 'text-primary' : 'text-foreground'
                              )}
                            >
                              {cmd.name}
                            </span>
                            {!isAvailable && (
                              <span className="text-xs text-muted-foreground">
                                (unavailable)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {cmd.description}
                          </p>
                        </div>

                        {/* Selection indicator */}
                        {isSelected && (
                          <motion.div
                            layoutId="selection-indicator"
                            className="w-1.5 h-1.5 rounded-full bg-primary"
                            transition={{
                              type: 'spring',
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            )}
          </div>

          {/* Footer hint */}
          <div className="sticky bottom-0 glass-subtle border-t border-white/10 dark:border-white/5 px-3 py-2">
            <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
              <kbd className="badge-glass font-mono text-xs">
                ↑↓
              </kbd>
              <span>navigate</span>
              <span>•</span>
              <kbd className="badge-glass font-mono text-xs">
                Enter
              </kbd>
              <span>select</span>
              <span>•</span>
              <kbd className="badge-glass font-mono text-xs">
                Esc
              </kbd>
              <span>close</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

SlashCommandMenu.displayName = 'SlashCommandMenu'
